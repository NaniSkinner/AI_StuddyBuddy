/**
 * Metrics Types for Retention System
 * Used for tracking nudge performance and student engagement
 */

/**
 * Individual nudge interaction record
 */
export interface NudgeInteractionRecord {
  nudgeId: string;
  studentId: string;
  trigger: string;
  action: "shown" | "accepted" | "dismissed" | "expired";
  timestamp: string;
  priority: string;
}

/**
 * Aggregated nudge metrics for a student
 */
export interface NudgeMetrics {
  studentId: string;
  totalNudgesShown: number;
  totalAccepted: number;
  totalDismissed: number;
  totalExpired: number;
  acceptanceRate: number; // 0-100
  dismissalRate: number; // 0-100
  lastNudgeShown?: string;
  lastNudgeId?: string;
  triggerBreakdown: {
    [trigger: string]: {
      shown: number;
      accepted: number;
      dismissed: number;
    };
  };
}

/**
 * Churn detection metrics
 */
export interface ChurnMetrics {
  studentId: string;
  churnScore: number; // 0-100
  riskLevel: "none" | "low" | "medium" | "high";
  lastAssessed: string;
  reasons: string[];
  daysSinceActive: number;
  sessionCount: number;
}

/**
 * Overall system stats
 */
export interface SystemStats {
  totalStudents: number;
  totalNudgesSent: number;
  overallAcceptanceRate: number;
  studentsAtRisk: number; // medium + high churn risk
  averageChurnScore: number;
  lastUpdated: string;
}

/**
 * Session-based metrics (stored in sessionStorage)
 */
export interface SessionMetrics {
  studentId: string;
  sessionStart: string;
  nudgesShownThisSession: number;
  interactions: NudgeInteractionRecord[];
  currentChurnScore?: number;
  currentRiskLevel?: string;
}
