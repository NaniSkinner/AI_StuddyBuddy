/**
 * Churn risk level (duplicated from churnDetectionService to avoid circular dependency)
 */
export type ChurnRisk = "none" | "low" | "medium" | "high";

/**
 * Churn reason types (what triggered the nudge)
 */
export type ChurnReason =
  | "inactive"
  | "goal_completed"
  | "low_task_completion"
  | "streak_broken"
  | "general_encouragement";

/**
 * Age group for template selection
 */
export type AgeGroup = "young" | "middle" | "teen";

/**
 * Nudge intensity level
 */
export type NudgeIntensity = "gentle" | "moderate" | "urgent";

/**
 * Nudge template structure (celebrate-first)
 */
export interface NudgeTemplate {
  id: string;
  trigger: ChurnReason;
  ageGroup: AgeGroup;
  messages: {
    celebration?: string;
    encouragement: string;
    cta: string;
  };
  intensity: NudgeIntensity;
}

/**
 * Complete nudge message ready to display
 */
export interface NudgeMessage {
  id: string;
  studentId: string;
  type: "nudge";
  trigger: ChurnReason;
  celebration: string;
  encouragement: string;
  cta: string;
  priority: ChurnRisk;
  createdAt: string;
  expiresAt: string;
}

/**
 * Nudge interaction for analytics
 */
export interface NudgeInteractionEvent {
  nudgeId: string;
  studentId: string;
  action: "shown" | "accepted" | "dismissed" | "expired";
  timestamp: string;
  trigger: ChurnReason;
  riskLevel: ChurnRisk;
}

