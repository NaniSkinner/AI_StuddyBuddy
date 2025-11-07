/**
 * Content filtering utilities for safety and moderation
 */

// Blocked content patterns
const BLOCKED_PATTERNS = [
  // Personal information
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/gi, // Phone numbers
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/gi, // SSN
  /\b\d{5}(-\d{4})?\b/g, // ZIP codes (basic)
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, // Email addresses
  /\b\d+\s+[A-Za-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)/gi, // Addresses

  // Off-platform communication
  /\b(snapchat|snap|instagram|insta|tiktok|facebook|twitter|discord|whatsapp|telegram)\b/gi,
  /\b(add me|DM me|message me|text me)\b/gi,
  /\b(meet me|meet up|hang out)\b/gi,

  // Inappropriate content (basic filtering)
  /\b(hate|racist|sexist)\b/gi,
];

// Positive message whitelist for friend connections
const POSITIVE_MESSAGE_TEMPLATES = [
  "I just finished my math session — how's your studying going?",
  "You're doing great! Keep up the good work!",
  "Want to race to finish our practice tasks today?",
  "Good luck with your studies today!",
  "Just earned a new badge! How are you doing?",
  "Keep learning! You've got this!",
  "Great job on your progress!",
  "Let's both try to maintain our streaks!",
];

/**
 * Check if text contains blocked content
 */
export function containsBlockedContent(text: string): boolean {
  if (!text) return false;

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }

  return false;
}

/**
 * Get blocked content type for logging
 */
export function getBlockedContentType(text: string): string | null {
  if (!text) return null;

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return pattern.toString();
    }
  }

  return null;
}

/**
 * Check if content is appropriate for age
 */
export function isAppropriateForAge(text: string, age: number): boolean {
  // Basic age-appropriate checks
  if (!text) return true;

  const lowerText = text.toLowerCase();

  // Topics that might be too mature for younger students
  const matureTopics = [
    "violence",
    "drugs",
    "alcohol",
    "weapons",
    "sexual",
  ];

  if (age < 13) {
    for (const topic of matureTopics) {
      if (lowerText.includes(topic)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Sanitize user input by removing potentially harmful content
 */
export function sanitizeUserInput(text: string): string {
  if (!text) return "";

  let sanitized = text.trim();

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, " ");

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Remove script tags content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  return sanitized;
}

/**
 * Check if message is homework helper request
 */
export function isHomeworkHelperRequest(text: string): boolean {
  const lowerText = text.toLowerCase();

  const homeworkKeywords = [
    "what's the answer",
    "what is the answer",
    "give me the answer",
    "tell me the answer",
    "just tell me",
    "do my homework",
    "solve this for me",
  ];

  return homeworkKeywords.some((keyword) => lowerText.includes(keyword));
}

/**
 * Generate a hint instead of an answer for homework helper mode
 */
export function generateHintResponse(question: string): string {
  const hints = [
    "Let's think about this step by step. What's the first thing you need to figure out?",
    "Good question! Instead of giving you the answer, let me ask: what approach would you try first?",
    "I can't give you the answer directly, but I can help you think through it. What do you already know about this topic?",
    "Let's work on this together. Can you break the problem down into smaller parts?",
    "Rather than telling you the answer, let me guide you. What method or formula might help here?",
  ];

  return hints[Math.floor(Math.random() * hints.length)];
}

/**
 * Get a random positive friend message
 */
export function getPositiveFriendMessage(): string {
  return POSITIVE_MESSAGE_TEMPLATES[
    Math.floor(Math.random() * POSITIVE_MESSAGE_TEMPLATES.length)
  ];
}

/**
 * Validate friend message content
 */
export function isValidFriendMessage(message: string): boolean {
  // Check if message is from whitelist
  return POSITIVE_MESSAGE_TEMPLATES.includes(message);
}

/**
 * Flag message for review
 */
export interface FlaggedContent {
  message: string;
  reason: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

export function flagContentForReview(
  message: string,
  reason: string,
  severity: "low" | "medium" | "high" = "medium"
): FlaggedContent {
  return {
    message,
    reason,
    severity,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Comprehensive content check
 */
export interface ContentCheckResult {
  isAllowed: boolean;
  reason?: string;
  suggestion?: string;
}

export function checkContent(
  text: string,
  age: number,
  context: "chat" | "friend_message" = "chat"
): ContentCheckResult {
  // Sanitize first
  const sanitized = sanitizeUserInput(text);

  // Check for blocked content
  if (containsBlockedContent(sanitized)) {
    return {
      isAllowed: false,
      reason: "Message contains inappropriate content or personal information",
      suggestion: "Please don't share personal information like phone numbers or addresses.",
    };
  }

  // Check age appropriateness
  if (!isAppropriateForAge(sanitized, age)) {
    return {
      isAllowed: false,
      reason: "Content may not be age-appropriate",
      suggestion: "Let's keep our conversation focused on learning topics.",
    };
  }

  // For friend messages, check against whitelist
  if (context === "friend_message" && !isValidFriendMessage(text)) {
    return {
      isAllowed: false,
      reason: "Friend messages must be from the approved list",
      suggestion: "Please choose a message from the provided options.",
    };
  }

  return {
    isAllowed: true,
  };
}

