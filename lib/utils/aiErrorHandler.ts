/**
 * AI Error Handler
 * Provides error categorization, retry logic, and user-friendly messages
 */

export class AIError extends Error {
  constructor(
    message: string,
    public code: AIErrorCode,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = "AIError";
  }
}

export type AIErrorCode =
  | "rate_limit"
  | "invalid_auth"
  | "network_error"
  | "timeout"
  | "invalid_response"
  | "content_filter"
  | "unknown";

/**
 * Categorize error from OpenAI API
 */
export function categorizeError(error: any): AIError {
  // Rate limit errors (429)
  if (error?.status === 429 || error?.code === "rate_limit_exceeded") {
    return new AIError(
      "Too many requests. Please wait a moment and try again.",
      "rate_limit",
      429,
      true
    );
  }

  // Authentication errors (401)
  if (error?.status === 401 || error?.code === "invalid_api_key") {
    return new AIError(
      "Authentication failed. Please check your API key configuration.",
      "invalid_auth",
      401,
      false
    );
  }

  // Network errors
  if (
    error?.code === "ECONNREFUSED" ||
    error?.code === "ENOTFOUND" ||
    error?.code === "ETIMEDOUT"
  ) {
    return new AIError(
      "Network connection failed. Please check your internet connection.",
      "network_error",
      undefined,
      true
    );
  }

  // Timeout errors
  if (error?.code === "ETIMEDOUT" || error?.message?.includes("timeout")) {
    return new AIError(
      "Request timed out. Please try again.",
      "timeout",
      undefined,
      true
    );
  }

  // Content filter errors
  if (error?.code === "content_filter") {
    return new AIError(
      "Sorry, I can't help with that. Let's focus on your learning!",
      "content_filter",
      undefined,
      false
    );
  }

  // Unknown errors
  return new AIError(
    "Something went wrong. Please try again.",
    "unknown",
    error?.status,
    true
  );
}

/**
 * Get user-friendly error message based on student age
 */
export function getUserFriendlyMessage(
  error: AIError,
  studentAge?: number
): string {
  const isYoung = studentAge && studentAge < 13;

  switch (error.code) {
    case "rate_limit":
      return isYoung
        ? "I'm thinking really hard right now! Let's wait a moment and try again. ⏰"
        : "I'm processing a lot right now. Give me a moment and we can continue!";

    case "invalid_auth":
      return isYoung
        ? "Oops! I need to check my connection. Please tell your teacher. 🔧"
        : "There's a configuration issue. Please contact your teacher or administrator.";

    case "network_error":
      return isYoung
        ? "I can't connect right now. Check your internet and try again! 📡"
        : "Network connection failed. Please check your internet connection and try again.";

    case "timeout":
      return isYoung
        ? "That's taking too long! Let's try again. ⚡"
        : "The request timed out. Let's try that again.";

    case "content_filter":
      return isYoung
        ? "Let's keep our chat about learning! What subject can I help you with? 📚"
        : "Let's keep our conversation focused on learning. What would you like to study?";

    case "unknown":
    default:
      return isYoung
        ? "Something went wrong. Can you try asking again? 🤔"
        : "I encountered an error. Please try your request again.";
  }
}

/**
 * Exponential backoff calculator for retries
 */
export function calculateBackoff(attemptNumber: number): number {
  // Base delay: 1 second
  // Exponential: 1s, 2s, 4s, 8s...
  // Max delay: 10 seconds
  const baseDelay = 1000;
  const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
  const maxDelay = 10000;

  return Math.min(exponentialDelay, maxDelay);
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  retryableErrors: AIErrorCode[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryableErrors: ["rate_limit", "network_error", "timeout", "unknown"],
};

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxAttempts, retryableErrors } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: AIError | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const aiError = categorizeError(error);
      lastError = aiError;

      // Don't retry if error is not retryable
      if (!aiError.retryable || !retryableErrors.includes(aiError.code)) {
        throw aiError;
      }

      // Don't retry on last attempt
      if (attempt >= maxAttempts) {
        throw aiError;
      }

      // Calculate backoff and wait
      const delay = calculateBackoff(attempt);
      console.log(
        `Retry attempt ${attempt}/${maxAttempts} after ${delay}ms. Error: ${aiError.code}`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new Error("Retry failed");
}

/**
 * Validate environment configuration
 */
export function validateEnvironment(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required variables
  if (!process.env.OPENAI_API_KEY) {
    errors.push("OPENAI_API_KEY is required");
  }

  // Validate API key format (should start with sk-)
  if (
    process.env.OPENAI_API_KEY &&
    !process.env.OPENAI_API_KEY.startsWith("sk-")
  ) {
    errors.push("OPENAI_API_KEY appears to be invalid (should start with sk-)");
  }

  // Validate numeric values if present
  if (process.env.OPENAI_MAX_TOKENS) {
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS);
    if (isNaN(maxTokens) || maxTokens < 1 || maxTokens > 4096) {
      errors.push("OPENAI_MAX_TOKENS must be between 1 and 4096");
    }
  }

  if (process.env.OPENAI_TEMPERATURE) {
    const temperature = parseFloat(process.env.OPENAI_TEMPERATURE);
    if (isNaN(temperature) || temperature < 0 || temperature > 2) {
      errors.push("OPENAI_TEMPERATURE must be between 0 and 2");
    }
  }

  if (process.env.OPENAI_CONTEXT_WINDOW_SIZE) {
    const windowSize = parseInt(process.env.OPENAI_CONTEXT_WINDOW_SIZE);
    if (isNaN(windowSize) || windowSize < 1 || windowSize > 50) {
      errors.push("OPENAI_CONTEXT_WINDOW_SIZE must be between 1 and 50");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
