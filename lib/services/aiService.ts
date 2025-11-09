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
import {
  systemPromptCache,
  getSystemPromptCacheKey,
} from "@/lib/utils/promptCache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CONTEXT_MESSAGES = 15;

export function getSystemPrompt(student: Student): string {
  const cacheKey = getSystemPromptCacheKey(student.id, student.age);
  const cached = systemPromptCache.get(cacheKey);
  if (cached) {
    return cached;
  }

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
  let prompt: string;

  if (ageGroup === "child") {
    prompt =
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
`;
  } else if (ageGroup === "teen") {
    prompt =
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
`;
  } else {
    prompt =
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
`;
  }

  systemPromptCache.set(cacheKey, prompt);

  return prompt;
}

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

  let ageTone = "";
  if (ageGroup === "child") {
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

export function buildContext(
  messages: Message[],
  recentSessions?: Session[]
): Message[] {
  const context: Message[] = [];

  if (recentSessions && recentSessions.length > 0) {
    const sessionSummary = summarizeRecentSessions(recentSessions, 2);

    context.push({
      speaker: "ai",
      message: `[CONTEXT: Recent tutoring sessions]\n${sessionSummary}`,
      timestamp: new Date().toISOString(),
    });
  }

  const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
  context.push(...recentMessages);

  return context;
}

export function summarizeOlderMessages(messages: Message[]): string {
  if (messages.length === 0) return "";

  const analysis = analyzeConversation(messages);
  return generateSummary(analysis);
}

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

  const studentProfile: StudentProfile = {
    id: student.id,
    name: student.name,
    age: student.age,
    grade: student.grade,
  };

  const recentMessages = messages.slice(-maxRecentMessages);

  let conversationSummary: string | undefined;
  if (includeSummary && messages.length > maxRecentMessages) {
    const olderMessages = messages.slice(
      0,
      messages.length - maxRecentMessages
    );
    conversationSummary = summarizeOlderMessages(olderMessages);
  }

  const limitedSessions = recentSessions.slice(0, maxRecentSessions);

  const strugglingConcepts = Array.from(
    new Set(
      limitedSessions.flatMap((session) => session.strugglingConcepts || [])
    )
  );

  const masteredConcepts = student.goals.flatMap((goal) =>
    goal.topics
      .filter((topic) => topic.progress >= 90)
      .map((topic) => topic.name)
  );

  const activeGoals = student.goals.filter((goal) => goal.progress < 100);

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

export async function generateAIResponse(
  student: Student,
  messages: Message[],
  recentSessions?: Session[]
): Promise<string> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

  try {
    const contextMessages = buildContext(messages, recentSessions);

    const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: getSystemPrompt(student),
      },
    ];

    if (messages.length > MAX_CONTEXT_MESSAGES) {
      const summary = summarizeOlderMessages(
        messages.slice(0, messages.length - MAX_CONTEXT_MESSAGES)
      );
      openAIMessages.push({
        role: "system",
        content: summary,
      });
    }

    contextMessages.forEach((msg) => {
      openAIMessages.push({
        role: msg.speaker === "student" ? "user" : "assistant",
        content: msg.message,
      });
    });

    const model = process.env.OPENAI_MODEL || "gpt-4";
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || "500");
    const temperature = parseFloat(process.env.OPENAI_TEMPERATURE || "0.7");

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

    const contentCheck = checkContent(response, student.age);
    if (!contentCheck.isAllowed) {
      return "I'm here to help you learn! Let's focus on your studies.";
    }

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

export async function generateAIResponseStream(
  student: Student,
  messages: Message[],
  onChunk: (chunk: string) => void,
  recentSessions?: Session[]
): Promise<string> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;
  let fullResponse = "";

  try {
    const contextMessages = buildContext(messages, recentSessions);

    const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: getSystemPrompt(student),
      },
    ];

    if (messages.length > MAX_CONTEXT_MESSAGES) {
      const summary = summarizeOlderMessages(
        messages.slice(0, messages.length - MAX_CONTEXT_MESSAGES)
      );
      openAIMessages.push({
        role: "system",
        content: summary,
      });
    }

    contextMessages.forEach((msg) => {
      openAIMessages.push({
        role: msg.speaker === "student" ? "user" : "assistant",
        content: msg.message,
      });
    });

    const model = process.env.OPENAI_MODEL || "gpt-4";
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || "500");
    const temperature = parseFloat(process.env.OPENAI_TEMPERATURE || "0.7");

    const stream = await openai.chat.completions.create({
      model,
      messages: openAIMessages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    let promptTokensEstimate = 0;
    let completionTokens = 0;

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        completionTokens++;
        onChunk(content);
      }
    }

    const contentCheck = checkContent(fullResponse, student.age);
    if (!contentCheck.isAllowed) {
      return "I'm here to help you learn! Let's focus on your studies.";
    }

    success = true;
    const responseTime = Date.now() - startTime;

    const totalMessageLength = openAIMessages.reduce(
      (sum, msg) =>
        sum + (typeof msg.content === "string" ? msg.content.length : 0),
      0
    );
    promptTokensEstimate = Math.ceil(totalMessageLength / 4);

    const usage = calculateUsage(promptTokensEstimate, completionTokens, model);

    logUsage(student.id, "ai_response_stream", usage, model, {
      responseTime,
      success: true,
    });

    console.log(
      `✅ AI response streamed: ${completionTokens} tokens in ${responseTime}ms`
    );

    return fullResponse;
  } catch (error) {
    const aiError = categorizeError(error);
    errorCode = aiError.code;

    console.error(`❌ AI response streaming failed:`, aiError.message);

    const responseTime = Date.now() - startTime;
    logUsage(
      student.id,
      "ai_response_stream",
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

    throw aiError;
  }
}

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
    return {
      question: `Practice ${topic} in ${subject}`,
      hints: ["Think about what you've learned", "Take it step by step"],
    };
  }
}

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

    const allOptions = [correctAnswer, ...wrongOptions];
    return allOptions.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error generating multiple choice options:", error);
    return [correctAnswer, "Option A", "Option B", "Option C"];
  }
}

export async function detectStruggle(
  messages: Message[],
  recentAttempts: Array<{ correct: boolean }>
): Promise<{
  needsHelp: boolean;
  reason?: string;
}> {
  const recentFailures = recentAttempts.filter((a) => !a.correct).length;
  if (recentFailures >= 3) {
    return {
      needsHelp: true,
      reason: "Multiple incorrect attempts on this concept",
    };
  }

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
