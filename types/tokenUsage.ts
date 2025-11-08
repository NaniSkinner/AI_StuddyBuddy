/**
 * Token Usage Tracking Types
 * Used for monitoring OpenAI API usage and costs
 */

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface UsageLog {
  id: string;
  timestamp: string;
  studentId: string;
  operationType: OperationType;
  model: string;
  usage: TokenUsage;
  responseTime?: number; // milliseconds
  success: boolean;
  errorCode?: string;
}

export type OperationType =
  | 'chat_completion'
  | 'task_generation_mc'
  | 'task_generation_oe'
  | 'task_generation_rw'
  | 'task_grading_oe'
  | 'task_grading_rw'
  | 'handoff_notes'
  | 'conversation_summary'
  | 'other';

export interface UsageStats {
  totalTokens: number;
  totalCost: number;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  byOperationType: Record<OperationType, {
    count: number;
    totalTokens: number;
    totalCost: number;
  }>;
}

export interface StudentUsageStats extends UsageStats {
  studentId: string;
  studentName: string;
  period: {
    start: string;
    end: string;
  };
}

/**
 * Cost calculation rates (as of November 2025)
 * Update these if OpenAI changes pricing
 */
export const MODEL_COSTS = {
  'gpt-4': {
    input: 0.00003,  // $0.03 per 1K tokens
    output: 0.00006, // $0.06 per 1K tokens
  },
  'gpt-3.5-turbo': {
    input: 0.0000015, // $0.0015 per 1K tokens
    output: 0.000002, // $0.002 per 1K tokens
  },
} as const;

export type ModelName = keyof typeof MODEL_COSTS;

