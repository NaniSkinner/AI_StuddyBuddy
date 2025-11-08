import OpenAI from "openai";
import {
  Message,
  Student,
  Session,
  ConversationContext,
  ContextBuildOptions,
  StudentProfile,
} from "@/types";
import { determineAgeGroup } from "@/lib/utils/progressCalculator";
import { checkContent } from "@/lib/utils/contentFilter";
import { withRetry, categorizeError } from "@/lib/utils/aiErrorHandler";
import { calculateUsage, logUsage } from "@/lib/services/usageLogService";
import {
  analyzeConversation,
  generateSummary,
} from "@/lib/utils/conversationAnalysis";

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
 * Enhanced system prompt builder using ConversationContext
 */
export function buildSystemPromptWithContext(
  context: ConversationContext
): string {
  const {
    studentProfile,
    currentTopic,
    strugglingConcepts,
    masteredConcepts,
    activeGoals,
    recentSessions,
    engagementLevel,
    strugglingFlag,
  } = context;
  const ageGroup = determineAgeGroup(studentProfile.age);

  // Base prompt with context
  const basePrompt = `You are an AI study companion helping ${
    studentProfile.name
  }, a ${studentProfile.age}-year-old student in grade ${studentProfile.grade}.

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

Current Learning Context:
${currentTopic ? `- Current topic: ${currentTopic}` : ""}
${
  activeGoals.length > 0
    ? `- Active goals: ${activeGoals.map((g) => g.subject).join(", ")}`
    : ""
}
${
  masteredConcepts.length > 0
    ? `- Mastered concepts: ${masteredConcepts.slice(0, 3).join(", ")}${
        masteredConcepts.length > 3
          ? ` (+${masteredConcepts.length - 3} more)`
          : ""
      }`
    : ""
}
${
  strugglingConcepts.length > 0
    ? `- Known struggles: ${strugglingConcepts.join(
        ", "
      )} (approach with patience and alternative explanations)`
    : ""
}
${engagementLevel ? `- Engagement level: ${engagementLevel}` : ""}
${
  strugglingFlag
    ? "- Student is showing signs of difficulty - be extra supportive"
    : ""
}
`;

  // Add recent session context if available
  let sessionContext = "";
  if (recentSessions.length > 0) {
    sessionContext = "\nRecent Tutoring Sessions:\n";
    recentSessions.slice(0, 2).forEach((session) => {
      const topics = session.topicsCovered.map((t) => t.topic).join(", ");
      const struggles =
        session.strugglingConcepts && session.strugglingConcepts.length > 0
          ? ` Struggled with: ${session.strugglingConcepts.join(", ")}`
          : " Going well overall";
      sessionContext += `- ${new Date(
        session.date
      ).toLocaleDateString()}: ${topics}.${struggles}\n`;
    });
  }

  // Age-specific adaptations
  let ageTone = "";
  if (ageGroup === "child") {
    // Ages 9-11: Simple, encouraging, lots of emojis
    ageTone = `
Tone for ${studentProfile.name}:
- Use SIMPLE words and SHORT sentences
- Be VERY encouraging with lots of praise
- Use emojis and fun examples (pizza, games, animals)
- Break complex topics into tiny steps
- Use analogies to things kids understand
- Keep energy high and positive
- Examples: "Great job! 🎉", "Let's try this together!", "You're doing awesome!"
`;
  } else if (ageGroup === "teen") {
    // Ages 12-14: Balanced, encourage self-reflection
    ageTone = `
Tone for ${studentProfile.name}:
- Use clear language, not too childish or too academic
- Encourage self-reflection: "What do you think?", "How would you approach this?"
- Balance support with challenge
- Relate concepts to their interests when possible
- Ask questions that promote critical thinking
- Use some emojis but not excessively
- Examples: "That's a good start! What's your next step?", "Let's think about this together."
`;
  } else {
    // Ages 15-16: Academic, challenge thinking
    ageTone = `
Tone for ${studentProfile.name}:
- Use academic language appropriate for high school
- Challenge critical thinking and analysis
- Encourage planning and goal-setting
- Focus on SAT/college prep if relevant
- Push for deeper understanding
- Be more mentor-like than teacher-like
- Examples: "Consider the implications of...", "How does this connect to what you learned before?"
`;
  }

  return basePrompt + sessionContext + ageTone;
}

/**
 * Summarize recent tutoring sessions concisely
 */
export function summarizeRecentSessions(
  sessions: Session[],
  maxSessions: number = 3
): string {
  if (sessions.length === 0) return "";

  const summaries = sessions.slice(0, maxSessions).map((session) => {
    const date = new Date(session.date).toLocaleDateString();
    const topics = session.topicsCovered.map((t) => t.topic).join(", ");
    const struggles =
      session.strugglingConcepts && session.strugglingConcepts.length > 0
        ? ` Struggled with: ${session.strugglingConcepts.join(", ")}`
        : " Good understanding overall";

    return `${date}: Covered ${topics}.${struggles}`;
  });

  return summaries.join("\n");
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
    const sessionSummary = summarizeRecentSessions(recentSessions, 2);

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
 * Summarize older messages to save tokens (Enhanced)
 * Uses conversation analysis utilities for comprehensive summarization
 */
export function summarizeOlderMessages(messages: Message[]): string {
  if (messages.length === 0) return "";

  // Analyze the conversation
  const analysis = analyzeConversation(messages);

  // Generate summary using analysis
  return generateSummary(analysis);
}

/**
 * Build complete conversation context for AI
 */
export function buildConversationContext(
  student: Student,
  messages: Message[],
  recentSessions: Session[] = [],
  options: ContextBuildOptions = {}
): ConversationContext {
  const {
    maxRecentMessages = 15,
    maxRecentSessions = 3,
    includeProgress = true,
    includeSummary = true,
  } = options;

  // Build student profile
  const studentProfile: StudentProfile = {
    id: student.id,
    name: student.name,
    age: student.age,
    grade: student.grade,
    // learningStyle is optional and not in current Student type
  };

  // Get recent messages
  const recentMessages = messages.slice(-maxRecentMessages);

  // Generate summary for older messages if needed
  let conversationSummary: string | undefined;
  if (includeSummary && messages.length > maxRecentMessages) {
    const olderMessages = messages.slice(
      0,
      messages.length - maxRecentMessages
    );
    conversationSummary = summarizeOlderMessages(olderMessages);
  }

  // Get recent sessions
  const limitedSessions = recentSessions.slice(0, maxRecentSessions);

  // Extract struggling concepts from sessions
  const strugglingConcepts = Array.from(
    new Set(
      limitedSessions.flatMap((session) => session.strugglingConcepts || [])
    )
  );

  // Extract mastered concepts from student goals
  const masteredConcepts = student.goals.flatMap((goal) =>
    goal.topics
      .filter((topic) => topic.progress >= 90)
      .map((topic) => topic.name)
  );

  // Get active goals (not completed)
  const activeGoals = student.goals.filter((goal) => goal.progress < 100);

  // Get current topic (most recently practiced)
  let currentTopic: string | undefined;
  const allTopics = student.goals.flatMap((goal) =>
    goal.topics.map((topic) => ({
      name: topic.name,
      lastPracticed: topic.lastPracticed,
    }))
  );

  if (allTopics.length > 0) {
    const sortedTopics = allTopics.sort((a, b) => {
      if (!a.lastPracticed) return 1;
      if (!b.lastPracticed) return -1;
      return (
        new Date(b.lastPracticed).getTime() -
        new Date(a.lastPracticed).getTime()
      );
    });
    currentTopic = sortedTopics[0]?.name;
  }

  // Build recent progress updates (if includeProgress)
  const recentProgress = includeProgress
    ? student.goals.flatMap((goal) =>
        goal.topics
          .filter((topic) => topic.lastPracticed)
          .slice(0, 3)
          .map((topic) => ({
            goalId: goal.id,
            subject: goal.subject,
            topicName: topic.name,
            progress: topic.progress,
            timestamp: topic.lastPracticed || new Date().toISOString(),
          }))
      )
    : [];

  // Analyze engagement and struggles from conversation
  const analysis = analyzeConversation(recentMessages);

  return {
    studentProfile,
    recentMessages,
    conversationSummary,
    recentSessions: limitedSessions,
    currentTopic,
    strugglingConcepts,
    masteredConcepts,
    activeGoals,
    recentProgress,
    engagementLevel: analysis.engagement.level,
    strugglingFlag: analysis.struggles.struggling,
  };
}

/**
 * Generate AI response using OpenAI
 */
export async function generateAIResponse(
  student: Student,
  messages: Message[],
  recentSessions?: Session[]
): Promise<string> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

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

    const model = process.env.OPENAI_MODEL || "gpt-4";
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || "500");
    const temperature = parseFloat(process.env.OPENAI_TEMPERATURE || "0.7");

    // Call OpenAI with retry logic
    const completion = await withRetry(
      async () => {
        return await openai.chat.completions.create({
          model,
          messages: openAIMessages,
          temperature,
          max_tokens: maxTokens,
        });
      },
      { maxAttempts: 3 }
    );

    const response =
      completion.choices[0]?.message?.content || "I'm here to help!";

    // Content safety check
    const contentCheck = checkContent(response, student.age);
    if (!contentCheck.isAllowed) {
      return "I'm here to help you learn! Let's focus on your studies.";
    }

    // Log successful usage
    success = true;
    const responseTime = Date.now() - startTime;

    if (completion.usage) {
      const usage = calculateUsage(
        completion.usage.prompt_tokens,
        completion.usage.completion_tokens,
        model
      );

      logUsage(student.id, "chat_completion", usage, model, {
        responseTime,
        success: true,
      });
    }

    return response;
  } catch (error) {
    const aiError = categorizeError(error);
    errorCode = aiError.code;

    // Log failed usage (no tokens consumed if it failed)
    const responseTime = Date.now() - startTime;
    logUsage(
      student.id,
      "chat_completion",
      {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCost: 0,
      },
      process.env.OPENAI_MODEL || "gpt-4",
      {
        responseTime,
        success: false,
        errorCode,
      }
    );

    console.error("Error generating AI response:", error);
    throw aiError;
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
  const startTime = Date.now();

  try {
    const ageGroup = determineAgeGroup(student.age);
    const model = process.env.OPENAI_MODEL || "gpt-4";

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

    const completion = await withRetry(
      async () => {
        return await openai.chat.completions.create({
          model,
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
      },
      { maxAttempts: 3 }
    );

    const response = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(response);

    // Log successful usage
    const responseTime = Date.now() - startTime;
    if (completion.usage) {
      const usage = calculateUsage(
        completion.usage.prompt_tokens,
        completion.usage.completion_tokens,
        model
      );

      logUsage(student.id, "task_generation_mc", usage, model, {
        responseTime,
        success: true,
      });
    }

    return {
      question: parsed.question || "Practice problem generation failed",
      hints: parsed.hints || ["Think step by step", "Review your notes"],
    };
  } catch (error) {
    const aiError = categorizeError(error);

    // Log failed usage
    const responseTime = Date.now() - startTime;
    logUsage(
      student.id,
      "task_generation_mc",
      {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCost: 0,
      },
      process.env.OPENAI_MODEL || "gpt-4",
      {
        responseTime,
        success: false,
        errorCode: aiError.code,
      }
    );

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
