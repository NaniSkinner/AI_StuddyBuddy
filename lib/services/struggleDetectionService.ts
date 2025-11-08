import { Session, Student, Message, Task } from "@/types";
import { getRecentSessions } from "./sessionService";
import { getStudentById } from "./studentService";
import { getTasksByStudent } from "./taskService";
import OpenAI from "openai";
import { withRetry, categorizeError } from "@/lib/utils/aiErrorHandler";
import { calculateUsage, logUsage } from "@/lib/services/usageLogService";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Struggle detection result
 */
export interface StruggleDetection {
  isStruggling: boolean;
  severity: "mild" | "moderate" | "severe";
  topics: string[];
  patterns: string[];
  recommendations: string[];
  shouldSuggestTutor: boolean;
}

/**
 * Analyze if student is struggling based on session history
 */
export async function analyzeStudentStruggle(
  studentId: string,
  subject?: string
): Promise<StruggleDetection> {
  try {
    const student = await getStudentById(studentId);
    if (!student) {
      return createNoStruggleResult();
    }

    const recentSessions = await getRecentSessions(studentId, 5);
    if (recentSessions.length === 0) {
      return createNoStruggleResult();
    }

    // Note: Session doesn't have subject field in schema, filter by topics if needed
    const sessions = recentSessions;

    // Analyze struggle indicators
    const indicators = analyzeStruggleIndicators(sessions);
    const severity = calculateSeverity(indicators);
    const isStruggling =
      severity !== "mild" || indicators.strugglingTopics.length >= 3;

    // Get struggling topics
    const strugglingTopics = Array.from(
      new Set(sessions.flatMap((s) => s.strugglingConcepts || []))
    );

    // Generate recommendations
    const recommendations = generateRecommendations(indicators, student);

    // Determine if tutor should be suggested
    const shouldSuggestTutor = shouldRecommendTutor(indicators, student);

    return {
      isStruggling,
      severity,
      topics: strugglingTopics,
      patterns: indicators.patterns,
      recommendations,
      shouldSuggestTutor,
    };
  } catch (error) {
    console.error(`Error detecting struggle for ${studentId}:`, error);
    return createNoStruggleResult();
  }
}

/**
 * Analyze various struggle indicators
 */
interface StruggleIndicators {
  strugglingTopics: string[];
  repeatedQuestions: number;
  averageConfidence: number;
  sessionDuration: number[];
  questionsAsked: number;
  correctAnswers: number;
  totalAnswers: number;
  patterns: string[];
}

function analyzeStruggleIndicators(sessions: Session[]): StruggleIndicators {
  const indicators: StruggleIndicators = {
    strugglingTopics: [],
    repeatedQuestions: 0,
    averageConfidence: 0,
    sessionDuration: [],
    questionsAsked: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    patterns: [],
  };

  let totalConfidence = 0;
  const topicMap = new Map<string, number>();

  for (const session of sessions) {
    // Track struggling topics
    if (session.strugglingConcepts && session.strugglingConcepts.length > 0) {
      indicators.strugglingTopics.push(...session.strugglingConcepts);

      // Count repeated struggles
      for (const concept of session.strugglingConcepts) {
        topicMap.set(concept, (topicMap.get(concept) || 0) + 1);
      }
    }

    // Analyze messages for patterns
    const analysis = analyzeSessionMessages(session);
    indicators.questionsAsked += analysis.questionsAsked;
    totalConfidence += analysis.averageConfidence;
    indicators.sessionDuration.push(analysis.durationMinutes);

    // Track answer accuracy if available
    indicators.correctAnswers += analysis.correctAnswers;
    indicators.totalAnswers += analysis.totalAnswers;
  }

  // Calculate averages
  indicators.averageConfidence = totalConfidence / sessions.length;

  // Identify repeated struggling topics
  for (const [topic, count] of topicMap.entries()) {
    if (count >= 2) {
      indicators.repeatedQuestions = count;
      indicators.patterns.push(`Repeatedly struggling with ${topic}`);
    }
  }

  // Detect patterns
  if (indicators.questionsAsked < 5 && sessions.length >= 3) {
    indicators.patterns.push("Low engagement - not asking many questions");
  }

  if (indicators.sessionDuration.every((d) => d < 10)) {
    indicators.patterns.push(
      "Short session durations - may indicate frustration"
    );
  }

  const accuracy =
    indicators.totalAnswers > 0
      ? indicators.correctAnswers / indicators.totalAnswers
      : 0.5;

  if (accuracy < 0.5) {
    indicators.patterns.push("Low accuracy on practice problems");
  }

  return indicators;
}

/**
 * Analyze individual session messages
 */
function analyzeSessionMessages(session: Session): {
  questionsAsked: number;
  averageConfidence: number;
  durationMinutes: number;
  correctAnswers: number;
  totalAnswers: number;
} {
  if (!session.transcript || session.transcript.length === 0) {
    return {
      questionsAsked: 0,
      averageConfidence: 0.5,
      durationMinutes: 15,
      correctAnswers: 0,
      totalAnswers: 0,
    };
  }

  const studentMessages = session.transcript.filter(
    (m) => m.speaker === "student"
  );
  const questionsAsked = studentMessages.filter(
    (m) =>
      m.message.includes("?") ||
      m.message.toLowerCase().startsWith("how") ||
      m.message.toLowerCase().startsWith("what") ||
      m.message.toLowerCase().startsWith("why")
  ).length;

  // Simple confidence scoring based on message content
  let confidenceScore = 0;
  const uncertainPhrases = [
    "i don't know",
    "not sure",
    "confused",
    "help",
    "don't understand",
  ];
  const confidentPhrases = ["i think", "got it", "makes sense", "understand"];

  for (const msg of studentMessages) {
    const lower = msg.message.toLowerCase();
    if (uncertainPhrases.some((phrase) => lower.includes(phrase))) {
      confidenceScore -= 1;
    }
    if (confidentPhrases.some((phrase) => lower.includes(phrase))) {
      confidenceScore += 1;
    }
  }

  const averageConfidence = Math.max(
    0,
    Math.min(1, 0.5 + (confidenceScore / studentMessages.length) * 0.5)
  );

  // Estimate duration from timestamp difference
  const firstMsg = session.transcript[0];
  const lastMsg = session.transcript[session.transcript.length - 1];
  const durationMs =
    new Date(lastMsg.timestamp).getTime() -
    new Date(firstMsg.timestamp).getTime();
  const durationMinutes = Math.max(1, Math.round(durationMs / 60000));

  // Count correct answers (simulated based on tutor/AI responses)
  const aiResponses = session.transcript.filter(
    (m) => m.speaker === "tutor" || m.speaker === "ai"
  );
  const correctAnswers = aiResponses.filter(
    (m) =>
      m.message.includes("correct") ||
      m.message.includes("right") ||
      m.message.includes("great job")
  ).length;
  const totalAnswers = aiResponses.filter(
    (m) =>
      m.message.includes("try") ||
      m.message.includes("answer") ||
      m.message.includes("solve")
  ).length;

  return {
    questionsAsked,
    averageConfidence,
    durationMinutes,
    correctAnswers,
    totalAnswers,
  };
}

/**
 * Calculate severity of struggle
 */
function calculateSeverity(
  indicators: StruggleIndicators
): "mild" | "moderate" | "severe" {
  let score = 0;

  // Repeated struggling topics
  if (indicators.repeatedQuestions >= 3) score += 2;
  else if (indicators.repeatedQuestions >= 2) score += 1;

  // Low confidence
  if (indicators.averageConfidence < 0.3) score += 2;
  else if (indicators.averageConfidence < 0.5) score += 1;

  // Low accuracy
  const accuracy =
    indicators.totalAnswers > 0
      ? indicators.correctAnswers / indicators.totalAnswers
      : 0.5;
  if (accuracy < 0.4) score += 2;
  else if (accuracy < 0.6) score += 1;

  // Number of patterns detected
  if (indicators.patterns.length >= 3) score += 1;

  // Determine severity
  if (score >= 5) return "severe";
  if (score >= 3) return "moderate";
  return "mild";
}

/**
 * Generate recommendations based on struggle indicators
 */
function generateRecommendations(
  indicators: StruggleIndicators,
  student: Student
): string[] {
  const recommendations: string[] = [];

  // Low engagement
  if (indicators.questionsAsked < 5) {
    recommendations.push(
      "Try asking more questions when you're unsure - I'm here to help!"
    );
  }

  // Repeated struggles
  if (indicators.repeatedQuestions >= 2) {
    recommendations.push("Let's review the basics before moving forward");
    recommendations.push("Consider breaking down concepts into smaller steps");
  }

  // Low confidence
  if (indicators.averageConfidence < 0.5) {
    recommendations.push(
      "Practice problems can build confidence - let's try some easier ones first"
    );
  }

  // Short sessions
  const avgDuration =
    indicators.sessionDuration.reduce((a, b) => a + b, 0) /
    indicators.sessionDuration.length;
  if (avgDuration < 10) {
    recommendations.push(
      "Try longer study sessions (15-20 minutes) for better learning retention"
    );
  }

  // Low accuracy
  const accuracy =
    indicators.totalAnswers > 0
      ? indicators.correctAnswers / indicators.totalAnswers
      : 0.5;
  if (accuracy < 0.5) {
    recommendations.push(
      "Focus on understanding concepts before practicing problems"
    );
  }

  return recommendations.slice(0, 3); // Max 3 recommendations
}

/**
 * Determine if tutor should be recommended
 */
function shouldRecommendTutor(
  indicators: StruggleIndicators,
  student: Student
): boolean {
  // Severe struggle
  if (calculateSeverity(indicators) === "severe") {
    return true;
  }

  // Repeated struggles over multiple sessions
  if (indicators.repeatedQuestions >= 3) {
    return true;
  }

  // Low accuracy for extended period
  const accuracy =
    indicators.totalAnswers > 0
      ? indicators.correctAnswers / indicators.totalAnswers
      : 0.5;
  if (accuracy < 0.4 && indicators.totalAnswers >= 5) {
    return true;
  }

  return false;
}

/**
 * Create a default "no struggle" result
 */
function createNoStruggleResult(): StruggleDetection {
  return {
    isStruggling: false,
    severity: "mild",
    topics: [],
    patterns: [],
    recommendations: [],
    shouldSuggestTutor: false,
  };
}

/**
 * Analyze task attempt history for struggle patterns (AI Integration Enhancement)
 */
export async function analyzeTaskAttempts(studentId: string): Promise<{
  consecutiveFailures: number;
  strugglingTopics: string[];
  frustrationLevel: "low" | "medium" | "high";
}> {
  try {
    const tasks = await getTasksByStudent(studentId);
    const recentTasks = tasks.slice(-10); // Last 10 tasks

    // Count consecutive failures
    let consecutiveFailures = 0;
    for (let i = recentTasks.length - 1; i >= 0; i--) {
      const task = recentTasks[i];
      if (task.status === "complete" && task.attempts > 2) {
        consecutiveFailures++;
      } else if (task.status === "complete" && task.attempts === 1) {
        break; // Stop on first success
      }
    }

    // Identify struggling topics
    const topicAttempts = new Map<string, { total: number; failed: number }>();

    for (const task of recentTasks) {
      if (!topicAttempts.has(task.topic)) {
        topicAttempts.set(task.topic, { total: 0, failed: 0 });
      }
      const stats = topicAttempts.get(task.topic)!;
      stats.total++;
      if (task.attempts > 2 || task.status === "skipped") {
        stats.failed++;
      }
    }

    const strugglingTopics: string[] = [];
    for (const [topic, stats] of topicAttempts.entries()) {
      if (stats.failed / stats.total > 0.5 && stats.total >= 2) {
        strugglingTopics.push(topic);
      }
    }

    // Determine frustration level
    let frustrationLevel: "low" | "medium" | "high" = "low";
    if (consecutiveFailures >= 3 || strugglingTopics.length >= 3) {
      frustrationLevel = "high";
    } else if (consecutiveFailures >= 2 || strugglingTopics.length >= 2) {
      frustrationLevel = "medium";
    }

    return {
      consecutiveFailures,
      strugglingTopics,
      frustrationLevel,
    };
  } catch (error) {
    console.error(`Error analyzing task attempts for ${studentId}:`, error);
    return {
      consecutiveFailures: 0,
      strugglingTopics: [],
      frustrationLevel: "low",
    };
  }
}

/**
 * Check for struggle during an active conversation (Real-Time Monitoring)
 */
export function checkStruggleDuringConversation(recentMessages: Message[]): {
  isStruggling: boolean;
  indicators: string[];
} {
  if (recentMessages.length < 3) {
    return { isStruggling: false, indicators: [] };
  }

  const studentMessages = recentMessages.filter((m) => m.speaker === "student");
  const indicators: string[] = [];

  // Frustration keywords
  const frustrationKeywords = [
    "confused",
    "don't understand",
    "don't get it",
    "frustrated",
    "help",
    "i give up",
    "too hard",
    "can't do this",
  ];

  let frustrationCount = 0;
  for (const msg of studentMessages) {
    const lower = msg.message.toLowerCase();
    if (frustrationKeywords.some((keyword) => lower.includes(keyword))) {
      frustrationCount++;
    }
  }

  if (frustrationCount >= 2) {
    indicators.push("Expressing frustration multiple times");
  }

  // Question repetition
  const questions = studentMessages.map((m) => m.message.toLowerCase().trim());
  const uniqueQuestions = new Set(questions);
  if (questions.length > 3 && uniqueQuestions.size < questions.length * 0.7) {
    indicators.push("Repeating similar questions");
  }

  // Very short responses (disengagement)
  const shortResponses = studentMessages.filter(
    (m) => m.message.length < 10
  ).length;
  if (shortResponses > studentMessages.length * 0.6) {
    indicators.push("Brief responses may indicate disengagement");
  }

  // Multiple help requests in short time
  const helpRequests = studentMessages.filter((m) =>
    m.message.toLowerCase().includes("help")
  ).length;
  if (helpRequests >= 3) {
    indicators.push("Multiple help requests");
  }

  const isStruggling = indicators.length >= 2;

  return { isStruggling, indicators };
}

/**
 * Intervention Triggers - Determine what action to take
 */
export interface InterventionAction {
  type: "hint" | "easier_task" | "tutor_suggestion" | "encouragement" | "none";
  message: string;
  severity: "mild" | "moderate" | "severe";
}

export async function determineIntervention(
  studentId: string,
  recentMessages: Message[]
): Promise<InterventionAction> {
  try {
    // Get comprehensive struggle analysis
    const sessionStruggle = await analyzeStudentStruggle(studentId);
    const taskStruggle = await analyzeTaskAttempts(studentId);
    const conversationStruggle =
      checkStruggleDuringConversation(recentMessages);

    // Combine indicators
    const isSevere =
      sessionStruggle.severity === "severe" ||
      taskStruggle.frustrationLevel === "high" ||
      taskStruggle.consecutiveFailures >= 3;

    const isModerate =
      sessionStruggle.severity === "moderate" ||
      taskStruggle.frustrationLevel === "medium" ||
      conversationStruggle.isStruggling;

    // Determine intervention
    if (isSevere) {
      return {
        type: "tutor_suggestion",
        message:
          "I notice you've been working really hard on this. How about we schedule time with a tutor who can give you personalized help?",
        severity: "severe",
      };
    } else if (isModerate) {
      if (taskStruggle.consecutiveFailures >= 2) {
        return {
          type: "easier_task",
          message:
            "Let's try a slightly easier problem to build up your confidence!",
          severity: "moderate",
        };
      } else if (conversationStruggle.isStruggling) {
        return {
          type: "hint",
          message:
            "I can see this is challenging. Would you like a hint to get started?",
          severity: "moderate",
        };
      }
    }

    // Mild or no struggle - just encouragement
    if (taskStruggle.consecutiveFailures === 1) {
      return {
        type: "encouragement",
        message: "You're making progress! Keep going!",
        severity: "mild",
      };
    }

    return {
      type: "none",
      message: "",
      severity: "mild",
    };
  } catch (error) {
    console.error(`Error determining intervention for ${studentId}:`, error);
    return {
      type: "none",
      message: "",
      severity: "mild",
    };
  }
}

/**
 * Generate AI-powered tutor handoff notes
 */
export async function generateHandoffNotes(
  studentId: string,
  conversationHistory: Message[],
  taskHistory: Task[]
): Promise<string> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

  try {
    const student = await getStudentById(studentId);
    if (!student) {
      return "Unable to generate handoff notes - student not found.";
    }

    // Get struggle analysis
    const struggleAnalysis = await analyzeStudentStruggle(studentId);
    const taskStruggle = await analyzeTaskAttempts(studentId);

    // Recent conversation excerpts (last 5 messages)
    const recentConversation = conversationHistory
      .slice(-5)
      .map((m) => `${m.speaker}: ${m.message}`)
      .join("\n");

    // Recent task failures
    const recentFailures = taskHistory
      .filter((t) => t.attempts > 2 || t.status === "skipped")
      .slice(-3)
      .map((t) => `${t.topic} (${t.type}): ${t.attempts} attempts`)
      .join("\n");

    // Build prompt
    const prompt = `Generate concise tutor handoff notes for ${
      student.name
    }, a ${student.age}-year-old student in grade ${student.grade}.

STRUGGLING TOPICS:
${struggleAnalysis.topics.join(", ") || "None identified"}

STRUGGLE PATTERNS:
${struggleAnalysis.patterns.join("\n") || "No significant patterns"}

RECENT TASK PERFORMANCE:
${recentFailures || "No recent task failures"}

RECENT CONVERSATION EXCERPT:
${recentConversation || "No recent conversation"}

TASK ANALYSIS:
- Consecutive failures: ${taskStruggle.consecutiveFailures}
- Frustration level: ${taskStruggle.frustrationLevel}
- Topics needing help: ${taskStruggle.strugglingTopics.join(", ") || "None"}

Please generate:
1. Brief summary (2-3 sentences) of where student is struggling
2. Specific concepts/topics to focus on (3-5 items)
3. Recommended approach/teaching strategies (2-3 items)
4. Student's emotional state and engagement level

Keep it concise and actionable for a human tutor. Format as clear bullet points.`;

    // Call OpenAI
    const completion = await withRetry(async () => {
      return await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an educational coordinator creating handoff notes for tutors. Be concise, specific, and actionable.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower for consistent, factual output
        max_tokens: 600,
      });
    });

    // Calculate and log usage
    const model = process.env.OPENAI_MODEL || "gpt-4";
    const usage = calculateUsage(
      completion.usage?.prompt_tokens || 0,
      completion.usage?.completion_tokens || 0,
      model
    );

    logUsage(studentId, "handoff_notes", usage, model, {
      responseTime: Date.now() - startTime,
      success: true,
    });

    const notes = completion.choices[0].message.content || "";

    success = true;
    return notes;
  } catch (error: any) {
    const aiError = categorizeError(error);
    console.error(`Error generating handoff notes for ${studentId}:`, error);

    // Log failed usage
    const model = process.env.OPENAI_MODEL || "gpt-4";
    const failedUsage = calculateUsage(0, 0, model);

    logUsage(studentId, "handoff_notes", failedUsage, model, {
      responseTime: Date.now() - startTime,
      success: false,
      errorCode: aiError.code,
    });

    // Return fallback notes
    const student = await getStudentById(studentId);
    const struggleAnalysis = await analyzeStudentStruggle(studentId);

    return `**Handoff Notes for ${student?.name || "Student"}**

**Struggling Topics:**
${struggleAnalysis.topics.join(", ") || "None identified"}

**Patterns:**
${struggleAnalysis.patterns.join("\n") || "No significant patterns detected"}

**Recommendations:**
${struggleAnalysis.recommendations.join("\n") || "Continue monitoring progress"}

(Note: AI-generated notes unavailable, showing automated analysis)`;
  }
}
