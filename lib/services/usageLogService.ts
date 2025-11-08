/**
 * Token Usage Log Service
 * Tracks and analyzes OpenAI API usage
 * 
 * Phase 1: In-memory storage with console logging
 * Phase 2: Database persistence
 */

import {
  TokenUsage,
  UsageLog,
  UsageStats,
  StudentUsageStats,
  OperationType,
  MODEL_COSTS,
  ModelName,
} from '@/types/tokenUsage';

// In-memory storage for Phase 1
const usageLogs: UsageLog[] = [];
let nextLogId = 1;

/**
 * Calculate cost from token usage
 */
export function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: string = 'gpt-4'
): number {
  const modelName = model.startsWith('gpt-4') ? 'gpt-4' : 'gpt-3.5-turbo';
  const rates = MODEL_COSTS[modelName];

  const inputCost = (promptTokens / 1000) * rates.input;
  const outputCost = (completionTokens / 1000) * rates.output;

  return inputCost + outputCost;
}

/**
 * Calculate token usage with cost
 */
export function calculateUsage(
  promptTokens: number,
  completionTokens: number,
  model: string = 'gpt-4'
): TokenUsage {
  return {
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    estimatedCost: calculateCost(promptTokens, completionTokens, model),
  };
}

/**
 * Log API usage
 */
export function logUsage(
  studentId: string,
  operationType: OperationType,
  usage: TokenUsage,
  model: string = 'gpt-4',
  options: {
    responseTime?: number;
    success?: boolean;
    errorCode?: string;
  } = {}
): UsageLog {
  const log: UsageLog = {
    id: `usage-${nextLogId++}`,
    timestamp: new Date().toISOString(),
    studentId,
    operationType,
    model,
    usage,
    responseTime: options.responseTime,
    success: options.success ?? true,
    errorCode: options.errorCode,
  };

  // Store in memory
  usageLogs.push(log);

  // Log to console if enabled
  if (process.env.OPENAI_LOG_USAGE === 'true') {
    console.log('📊 OpenAI Usage:', {
      student: studentId,
      operation: operationType,
      tokens: usage.totalTokens,
      cost: `$${usage.estimatedCost.toFixed(5)}`,
      responseTime: options.responseTime ? `${options.responseTime}ms` : 'N/A',
    });
  }

  return log;
}

/**
 * Get all usage logs
 */
export function getAllLogs(): UsageLog[] {
  return [...usageLogs];
}

/**
 * Get usage logs for a specific student
 */
export function getLogsByStudent(studentId: string): UsageLog[] {
  return usageLogs.filter((log) => log.studentId === studentId);
}

/**
 * Get usage logs by operation type
 */
export function getLogsByOperationType(operationType: OperationType): UsageLog[] {
  return usageLogs.filter((log) => log.operationType === operationType);
}

/**
 * Get usage logs within date range
 */
export function getLogsByDateRange(
  startDate: string,
  endDate: string
): UsageLog[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return usageLogs.filter((log) => {
    const logTime = new Date(log.timestamp).getTime();
    return logTime >= start && logTime <= end;
  });
}

/**
 * Calculate usage statistics from logs
 */
export function calculateStats(logs: UsageLog[]): UsageStats {
  if (logs.length === 0) {
    return {
      totalTokens: 0,
      totalCost: 0,
      totalRequests: 0,
      successRate: 0,
      averageResponseTime: 0,
      byOperationType: {} as any,
    };
  }

  const totalTokens = logs.reduce((sum, log) => sum + log.usage.totalTokens, 0);
  const totalCost = logs.reduce((sum, log) => sum + log.usage.estimatedCost, 0);
  const successfulRequests = logs.filter((log) => log.success).length;
  const successRate = (successfulRequests / logs.length) * 100;

  const logsWithResponseTime = logs.filter((log) => log.responseTime);
  const averageResponseTime =
    logsWithResponseTime.length > 0
      ? logsWithResponseTime.reduce((sum, log) => sum + (log.responseTime || 0), 0) /
        logsWithResponseTime.length
      : 0;

  // Group by operation type
  const byOperationType: Record<string, any> = {};
  logs.forEach((log) => {
    if (!byOperationType[log.operationType]) {
      byOperationType[log.operationType] = {
        count: 0,
        totalTokens: 0,
        totalCost: 0,
      };
    }
    byOperationType[log.operationType].count++;
    byOperationType[log.operationType].totalTokens += log.usage.totalTokens;
    byOperationType[log.operationType].totalCost += log.usage.estimatedCost;
  });

  return {
    totalTokens,
    totalCost,
    totalRequests: logs.length,
    successRate,
    averageResponseTime,
    byOperationType,
  };
}

/**
 * Get usage statistics for a specific student
 */
export function getStudentStats(
  studentId: string,
  startDate?: string,
  endDate?: string
): StudentUsageStats {
  let logs = getLogsByStudent(studentId);

  if (startDate && endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    logs = logs.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  }

  const stats = calculateStats(logs);

  return {
    ...stats,
    studentId,
    studentName: studentId, // Would get from student service in production
    period: {
      start: startDate || (logs[0]?.timestamp || new Date().toISOString()),
      end: endDate || new Date().toISOString(),
    },
  };
}

/**
 * Get total usage across all students
 */
export function getTotalUsage(startDate?: string, endDate?: string): UsageStats {
  let logs = usageLogs;

  if (startDate && endDate) {
    logs = getLogsByDateRange(startDate, endDate);
  }

  return calculateStats(logs);
}

/**
 * Get usage summary for today
 */
export function getTodayUsage(): UsageStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const logs = getLogsByDateRange(today.toISOString(), tomorrow.toISOString());
  return calculateStats(logs);
}

/**
 * Clear all logs (for testing)
 */
export function clearLogs(): void {
  usageLogs.length = 0;
  nextLogId = 1;
}

/**
 * Export logs as JSON (for backup/analysis)
 */
export function exportLogs(): string {
  return JSON.stringify(usageLogs, null, 2);
}

/**
 * Get high-level usage summary
 */
export function getUsageSummary(): {
  today: UsageStats;
  thisWeek: UsageStats;
  total: UsageStats;
} {
  // Today
  const today = getTodayUsage();

  // This week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = getTotalUsage(weekAgo.toISOString(), new Date().toISOString());

  // Total
  const total = getTotalUsage();

  return { today, thisWeek, total };
}

/**
 * Check if approaching budget limit
 */
export function checkBudget(
  monthlyBudget: number,
  currentMonth?: string
): {
  exceeded: boolean;
  percentUsed: number;
  remaining: number;
  warnings: string[];
} {
  // Get current month if not specified
  const now = new Date();
  const month = currentMonth || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const monthStart = new Date(`${month}-01T00:00:00Z`);
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);

  const logs = getLogsByDateRange(monthStart.toISOString(), monthEnd.toISOString());
  const stats = calculateStats(logs);

  const percentUsed = (stats.totalCost / monthlyBudget) * 100;
  const remaining = monthlyBudget - stats.totalCost;
  const exceeded = stats.totalCost > monthlyBudget;

  const warnings: string[] = [];
  if (percentUsed >= 90) {
    warnings.push('⚠️ Over 90% of monthly budget used');
  } else if (percentUsed >= 75) {
    warnings.push('⚠️ Over 75% of monthly budget used');
  }

  if (exceeded) {
    warnings.push('🚨 Monthly budget exceeded!');
  }

  return {
    exceeded,
    percentUsed,
    remaining,
    warnings,
  };
}

