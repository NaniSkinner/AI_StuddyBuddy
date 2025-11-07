import OpenAI from "openai";
import { Message, Student, Session } from "@/types";
import { determineAgeGroup } from "@/lib/utils/progressCalculator";
import { checkContent } from "@/lib/utils/contentFilter";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Maximum messages to keep in rolling window
const MAX_CONTEXT_MESSAGES = 15;

/**
 * Age-adapted system prompts
 */
export function getSystemPrompt(student: Student): string {
  const ageGroup = determineAgeGroup(student.age);

  const basePrompt = `You are an AI study companion helping ${
    student.name
  }, a ${student.age}-year-old student in grade ${student.grade}.

Your role is to:
- Help with homework by giving HINTS, not direct answers
- Create personalized practice problems
- Reference past tutoring sessions
- Encourage consistent learning
- Track progress and celebrate wins
- Suggest when to book time with a human tutor if struggling

Important rules:
- NEVER give direct answers to homework problems
- Guide students to think through problems step-by-step
- Be encouraging and positive
- Keep conversations focused on learning
- Flag concerning content immediately

Student's current goals: ${student.goals.map((g) => g.subject).join(", ")}
`;

  // Age-specific adaptations
  if (ageGroup === "child") {
    // Ages 9-11: Simple, encouraging, lots of emojis
    return (
      basePrompt +
      `
Tone for ${student.name}:
- Use SIMPLE words and SHORT sentences
- Be VERY encouraging with lots of praise
- Use emojis and fun examples (pizza, games, animals)
- Break complex topics into tiny steps
- Use analogies to things kids understand
- Keep energy high and positive
- Examples: "Great job! 🎉", "Let's try this together!", "You're doing awesome!"
`
    );
  } else if (ageGroup === "teen") {
    // Ages 12-14: Balanced, encourage self-reflection
    return (
      basePrompt +
      `
Tone for ${student.name}:
- Use clear language, not too childish or too academic
- Encourage self-reflection: "What do you think?", "How would you approach this?"
- Balance support with challenge
- Relate concepts to their interests when possible
- Ask questions that promote critical thinking
- Use some emojis but not excessively
- Examples: "That's a good start! What's your next step?", "Let's think about this together."
`
    );
  } else {
    // Ages 15-16: Academic, challenge thinking
    return (
      basePrompt +
      `
Tone for ${student.name}:
- Use academic language appropriate for high school
- Challenge critical thinking and analysis
- Encourage planning and goal-setting
- Focus on SAT/college prep if relevant
- Push for deeper understanding
- Be more mentor-like than teacher-like
- Examples: "Consider the implications of...", "How does this connect to what you learned before?"
`
    );
  }
}

/**
 * Build conversation context from history
 */
export function buildContext(
  messages: Message[],
  recentSessions?: Session[]
): Message[] {
  const context: Message[] = [];

  // Add session context if available
  if (recentSessions && recentSessions.length > 0) {
    const sessionSummary = recentSessions
      .slice(0, 2)
      .map((session) => {
        const topics = session.topicsCovered.map((tc) => tc.topic).join(", ");
        const struggles = session.strugglingConcepts.join(", ");
        return `Session on ${new Date(
          session.date
        ).toLocaleDateString()}: Covered ${topics}. ${
          struggles ? `Struggled with: ${struggles}` : "Going well!"
        }`;
      })
      .join("\n");

    context.push({
      speaker: "ai",
      message: `[CONTEXT: Recent tutoring sessions]\n${sessionSummary}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Add recent messages (rolling window)
  const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
  context.push(...recentMessages);

  return context;
}

/**
 * Summarize older messages to save tokens
 */
export function summarizeOlderMessages(messages: Message[]): string {
  if (messages.length === 0) return "";

  // Simple summarization for Phase 1
  // In Phase 2, we could use GPT to create better summaries
  const topics = new Set<string>();
  let questionsAsked = 0;

  messages.forEach((msg) => {
    if (msg.speaker === "student" && msg.message.includes("?")) {
      questionsAsked++;
    }
    // Extract potential topic keywords (very basic)
    const words = msg.message.toLowerCase().split(" ");
    ["math", "science", "reading", "writing", "history"].forEach((topic) => {
      if (words.includes(topic)) topics.add(topic);
    });
  });

  return `[Previous conversation: Discussed ${Array.from(topics).join(
    ", "
  )}. Student asked ${questionsAsked} questions. Student has been engaged and making progress.]`;
}

/**
 * Generate AI response using OpenAI
 */
export async function generateAIResponse(
  student: Student,
  messages: Message[],
  recentSessions?: Session[]
): Promise<string> {
  try {
    // Build context
    const contextMessages = buildContext(messages, recentSessions);

    // Prepare messages for OpenAI
    const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: getSystemPrompt(student),
      },
    ];

    // Add older message summary if we have many messages
    if (messages.length > MAX_CONTEXT_MESSAGES) {
      const summary = summarizeOlderMessages(
        messages.slice(0, messages.length - MAX_CONTEXT_MESSAGES)
      );
      openAIMessages.push({
        role: "system",
        content: summary,
      });
    }

    // Add context messages
    contextMessages.forEach((msg) => {
      openAIMessages.push({
        role: msg.speaker === "student" ? "user" : "assistant",
        content: msg.message,
      });
    });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: openAIMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response =
      completion.choices[0]?.message?.content || "I'm here to help!";

    // Content safety check
    const contentCheck = checkContent(response, student.age);
    if (!contentCheck.isAllowed) {
      return "I'm here to help you learn! Let's focus on your studies.";
    }

    return response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}

/**
 * Generate practice task using AI
 */
export async function generatePracticeTask(
  student: Student,
  subject: string,
  topic: string,
  difficulty: "easy" | "medium" | "hard"
): Promise<{
  question: string;
  options?: string[];
  hints: string[];
}> {
  try {
    const ageGroup = determineAgeGroup(student.age);

    const prompt = `Create a ${difficulty} practice problem for a ${
      student.age
    }-year-old student (grade ${
      student.grade
    }) on the topic of "${topic}" in ${subject}.

Requirements:
- Make it age-appropriate for ${
      ageGroup === "child"
        ? "elementary"
        : ageGroup === "teen"
        ? "middle school"
        : "high school"
    }
- Include the question
- Provide 2-3 helpful hints that guide thinking without giving the answer
- Use engaging, relatable examples

Format your response as JSON:
{
  "question": "the practice question",
  "hints": ["hint 1", "hint 2", "hint 3"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educator creating practice problems.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(response);

    return {
      question: parsed.question || "Practice problem generation failed",
      hints: parsed.hints || ["Think step by step", "Review your notes"],
    };
  } catch (error) {
    console.error("Error generating practice task:", error);
    // Return fallback task
    return {
      question: `Practice ${topic} in ${subject}`,
      hints: ["Think about what you've learned", "Take it step by step"],
    };
  }
}

/**
 * Generate multiple choice options using AI
 */
export async function generateMultipleChoiceOptions(
  question: string,
  correctAnswer: string
): Promise<string[]> {
  try {
    const prompt = `Given this question: "${question}"
And the correct answer: "${correctAnswer}"

Generate 3 plausible but incorrect answer choices that a student might reasonably choose. Make them educational - common mistakes or misconceptions.

Format as JSON array: ["option1", "option2", "option3"]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at creating educational multiple choice questions.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(response);
    const wrongOptions = parsed.options || ["Option A", "Option B", "Option C"];

    // Shuffle correct answer with wrong options
    const allOptions = [correctAnswer, ...wrongOptions];
    return allOptions.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error generating multiple choice options:", error);
    return [correctAnswer, "Option A", "Option B", "Option C"];
  }
}

/**
 * Check if student needs tutor intervention
 */
export async function detectStruggle(
  messages: Message[],
  recentAttempts: Array<{ correct: boolean }>
): Promise<{
  needsHelp: boolean;
  reason?: string;
}> {
  // Check for repeated failures
  const recentFailures = recentAttempts.filter((a) => !a.correct).length;
  if (recentFailures >= 3) {
    return {
      needsHelp: true,
      reason: "Multiple incorrect attempts on this concept",
    };
  }

  // Check for frustration in messages
  const recentMessages = messages.slice(-5);
  const frustrationKeywords = [
    "don't understand",
    "confused",
    "don't get it",
    "this is hard",
    "help",
    "stuck",
  ];

  const hasFrustration = recentMessages.some((msg) =>
    frustrationKeywords.some((keyword) =>
      msg.message.toLowerCase().includes(keyword)
    )
  );

  if (hasFrustration) {
    return {
      needsHelp: true,
      reason: "Student expressing confusion or frustration",
    };
  }

  return { needsHelp: false };
}
