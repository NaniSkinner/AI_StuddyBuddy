import { Student, Session, Message } from "@/types";
import { getStudentById } from "./studentService";
import {
  checkContent,
  sanitizeUserInput,
  isHomeworkHelperRequest,
} from "@/lib/utils/contentFilter";

/**
 * Safety alert for flagged content
 */
export interface SafetyAlert {
  id: string;
  studentId: string;
  sessionId: string;
  messageId: string;
  type:
    | "inappropriate_content"
    | "academic_dishonesty"
    | "safety_concern"
    | "spam";
  severity: "low" | "medium" | "high";
  content: string;
  timestamp: Date;
  flaggedBy: "ai" | "keyword" | "pattern";
  resolved: boolean;
}

/**
 * Mock alerts storage
 */
const safetyAlerts: SafetyAlert[] = [];

/**
 * Content moderation result
 */
export interface ModerationResult {
  approved: boolean;
  reason?: string;
  severity?: "low" | "medium" | "high";
  alternativeResponse?: string;
}

/**
 * Moderate user message before processing
 */
export async function moderateMessage(
  content: string,
  studentId: string,
  sessionId: string
): Promise<ModerationResult> {
  try {
    const student = await getStudentById(studentId);
    if (!student) {
      return { approved: false, reason: "Student not found" };
    }

    // Sanitize input
    const sanitized = sanitizeUserInput(content);
    if (sanitized !== content) {
      // Input was modified - contains potentially dangerous content
      return {
        approved: false,
        reason: "Message contains invalid characters",
        severity: "low",
      };
    }

    // Check for inappropriate content
    const contentCheck = checkContent(content, student.age, "chat");
    if (!contentCheck.isAllowed) {
      // Create safety alert
      createSafetyAlert({
        studentId,
        sessionId,
        messageId: `msg-${Date.now()}`,
        type: "inappropriate_content",
        severity: "high",
        content,
        flaggedBy: "keyword",
      });

      return {
        approved: false,
        reason: contentCheck.reason || "Inappropriate content detected",
        severity: "high",
        alternativeResponse:
          contentCheck.suggestion ||
          "Let's keep our conversation focused on learning!",
      };
    }

    // Check for academic dishonesty patterns
    const dishonestyCheck = detectAcademicDishonesty(content);
    if (dishonestyCheck.flagged) {
      createSafetyAlert({
        studentId,
        sessionId,
        messageId: `msg-${Date.now()}`,
        type: "academic_dishonesty",
        severity: dishonestyCheck.severity,
        content,
        flaggedBy: "pattern",
      });

      return {
        approved: true, // Allow but flag for review
        reason: "Academic dishonesty detected - flagged for review",
        severity: dishonestyCheck.severity,
      };
    }

    // Check for spam/repetitive patterns
    const spamCheck = detectSpam(content);
    if (spamCheck.isSpam) {
      return {
        approved: false,
        reason: "Repeated or spam-like content detected",
        severity: "low",
      };
    }

    return { approved: true };
  } catch (error) {
    console.error(`Error moderating message:`, error);
    return { approved: true }; // Fail open to avoid blocking legitimate content
  }
}

/**
 * Detect academic dishonesty patterns
 */
function detectAcademicDishonesty(content: string): {
  flagged: boolean;
  severity: "low" | "medium" | "high";
} {
  const lower = content.toLowerCase();

  // High severity - direct requests
  const highSeverityPatterns = [
    "give me the answer",
    "just tell me",
    "what's the answer to",
    "solve this for me",
    "do my homework",
    "write my essay",
  ];

  for (const pattern of highSeverityPatterns) {
    if (lower.includes(pattern)) {
      return { flagged: true, severity: "high" };
    }
  }

  // Medium severity - indirect requests
  const mediumSeverityPatterns = [
    "can you do",
    "complete this",
    "finish this",
    "all the answers",
  ];

  for (const pattern of mediumSeverityPatterns) {
    if (lower.includes(pattern)) {
      return { flagged: true, severity: "medium" };
    }
  }

  return { flagged: false, severity: "low" };
}

/**
 * Detect spam or repetitive content
 */
function detectSpam(content: string): { isSpam: boolean } {
  // Check for excessive repetition
  const words = content.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);

  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    return { isSpam: true }; // Less than 30% unique words
  }

  // Check for excessive punctuation
  const punctuation = content.match(/[!?.]{3,}/g);
  if (punctuation && punctuation.length > 3) {
    return { isSpam: true };
  }

  // Check for excessive caps
  const caps = content.match(/[A-Z]/g);
  if (caps && content.length > 10 && caps.length / content.length > 0.7) {
    return { isSpam: true };
  }

  return { isSpam: false };
}

/**
 * Create a safety alert
 */
function createSafetyAlert(
  alert: Omit<SafetyAlert, "id" | "timestamp" | "resolved">
): void {
  safetyAlerts.push({
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    resolved: false,
    ...alert,
  });
}

/**
 * Get all safety alerts for a student
 */
export async function getSafetyAlerts(
  studentId: string
): Promise<SafetyAlert[]> {
  return safetyAlerts.filter((alert) => alert.studentId === studentId);
}

/**
 * Get unresolved high-severity alerts
 */
export async function getHighSeverityAlerts(): Promise<SafetyAlert[]> {
  return safetyAlerts.filter(
    (alert) => alert.severity === "high" && !alert.resolved
  );
}

/**
 * Resolve a safety alert
 */
export async function resolveAlert(alertId: string): Promise<boolean> {
  const alert = safetyAlerts.find((a) => a.id === alertId);
  if (alert) {
    alert.resolved = true;
    return true;
  }
  return false;
}

/**
 * Homework Helper Mode configuration
 */
export interface HomeworkHelperMode {
  enabled: boolean;
  rules: {
    noDirectAnswers: boolean;
    requireWorkShown: boolean;
    maxHintsPerProblem: number;
    enforceStepByStep: boolean;
  };
}

const DEFAULT_HOMEWORK_MODE: HomeworkHelperMode = {
  enabled: true,
  rules: {
    noDirectAnswers: true,
    requireWorkShown: true,
    maxHintsPerProblem: 3,
    enforceStepByStep: true,
  },
};

/**
 * Check if response should be modified for homework helper mode
 */
export function enforceHomeworkHelperMode(
  aiResponse: string,
  userMessage: string,
  mode: HomeworkHelperMode = DEFAULT_HOMEWORK_MODE
): { response: string; modified: boolean } {
  if (!mode.enabled) {
    return { response: aiResponse, modified: false };
  }

  // Check if user is asking for direct answer
  const askingForAnswer = detectAcademicDishonesty(userMessage);
  if (askingForAnswer.flagged && askingForAnswer.severity === "high") {
    return {
      response:
        "I'm here to help you learn, not to give you the answer! Let's work through this together. Can you tell me what you've tried so far?",
      modified: true,
    };
  }

  // Check if AI response contains direct answers (simple heuristic)
  const equationMatches = aiResponse.match(/= \d+/g);
  const containsDirectAnswer =
    aiResponse.match(/the answer is/i) ||
    (equationMatches && equationMatches.length > 3) ||
    aiResponse.includes("Here's the completed");

  if (containsDirectAnswer && mode.rules.noDirectAnswers) {
    return {
      response:
        "I can help guide you through this! Let's start with understanding the problem. What do you think the first step should be?",
      modified: true,
    };
  }

  return { response: aiResponse, modified: false };
}

/**
 * Conversation logging for safety/analytics
 */
export interface ConversationLog {
  id: string;
  studentId: string;
  sessionId: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  flagged: boolean;
  safetyAlerts: string[]; // Alert IDs
}

const conversationLogs: Map<string, ConversationLog> = new Map();

/**
 * Start logging a conversation
 */
export function startConversationLog(
  studentId: string,
  sessionId: string
): string {
  const logId = `log-${sessionId}`;
  conversationLogs.set(logId, {
    id: logId,
    studentId,
    sessionId,
    messages: [],
    startTime: new Date(),
    flagged: false,
    safetyAlerts: [],
  });
  return logId;
}

/**
 * Add message to conversation log
 */
export function logMessage(logId: string, message: Message): void {
  const log = conversationLogs.get(logId);
  if (log) {
    log.messages.push(message);
  }
}

/**
 * End conversation log
 */
export function endConversationLog(logId: string): void {
  const log = conversationLogs.get(logId);
  if (log) {
    log.endTime = new Date();
  }
}

/**
 * Flag conversation for review
 */
export function flagConversation(logId: string, alertId: string): void {
  const log = conversationLogs.get(logId);
  if (log) {
    log.flagged = true;
    log.safetyAlerts.push(alertId);
  }
}

/**
 * Get conversation log
 */
export function getConversationLog(logId: string): ConversationLog | undefined {
  return conversationLogs.get(logId);
}

/**
 * Get all flagged conversations
 */
export function getFlaggedConversations(): ConversationLog[] {
  return Array.from(conversationLogs.values()).filter((log) => log.flagged);
}

/**
 * Export conversation logs for a student (for data privacy requests)
 */
export async function exportStudentConversations(
  studentId: string
): Promise<ConversationLog[]> {
  return Array.from(conversationLogs.values()).filter(
    (log) => log.studentId === studentId
  );
}

/**
 * Delete student data (GDPR compliance)
 */
export async function deleteStudentSafetyData(
  studentId: string
): Promise<void> {
  // Remove safety alerts
  const alertsToRemove = safetyAlerts.filter((a) => a.studentId === studentId);
  alertsToRemove.forEach((alert) => {
    const index = safetyAlerts.indexOf(alert);
    if (index > -1) safetyAlerts.splice(index, 1);
  });

  // Remove conversation logs
  for (const [key, log] of conversationLogs.entries()) {
    if (log.studentId === studentId) {
      conversationLogs.delete(key);
    }
  }
}
