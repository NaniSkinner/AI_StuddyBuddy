import { Session, Student, Message } from "@/types";
import { getRecentSessions } from "./sessionService";
import { getStudentById } from "./studentService";

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
