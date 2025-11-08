/**
 * Environment variable type definitions for AI Study Companion
 * Ensures type safety for OpenAI and application configuration
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // OpenAI Configuration
      OPENAI_API_KEY: string;
      OPENAI_MODEL?: string; // Default: 'gpt-4'
      OPENAI_MAX_TOKENS?: string; // Default: '500'
      OPENAI_TEMPERATURE?: string; // Default: '0.8'
      OPENAI_CONTEXT_WINDOW_SIZE?: string; // Default: '15'

      // Token Usage Monitoring
      OPENAI_LOG_USAGE?: string; // Default: 'true'
      OPENAI_COST_PER_TOKEN?: string; // Default: '0.00003' (GPT-4 rate)

      // Application Configuration
      NEXT_PUBLIC_APP_NAME?: string;
      NEXT_PUBLIC_MAX_SUBJECTS?: string;
      NEXT_PUBLIC_MAX_FRIEND_MESSAGES?: string;

      // Node Environment
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
