import { Student } from "@/types";
import { getStudentById } from "./studentService";
import { getSessionCount } from "./sessionService";

/**
 * Churn risk levels (matching PRD spec)
 */
export enum ChurnRisk {
  NONE = "none",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

/**
 * Churn risk assessment result (matching PRD spec exactly)
 */
export interface ChurnRiskAssessment {
  level: ChurnRisk;
  score: number; // 0-100
  reasons: string[];
  interventions: string[];
  daysSinceActive: number;
  sessionCount: number;
}

/**
 * Get days since account creation
 */
export function getAccountAge(student: Student, now: Date): number {
  const created = new Date(student.createdAt);
  return Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Get days since last activity
 */
export function getDaysSinceActive(student: Student, now: Date): number {
  const lastActive = new Date(student.lastLoginAt);
  return Math.floor(
    (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Get task completion statistics
 */
export function getTaskStats(student: Student): {
  total: number;
  completed: number;
  completionRate: number;
  daysSinceLastTask: number;
} {
  const tasks = student.taskHistory || [];
  // For Phase 1, taskHistory only contains IDs, so we approximate
  // In Phase 2, we'd fetch actual task objects with status and dates
  const completed = tasks.length; // Assuming all in history are completed

  let daysSinceLastTask = 999;
  if (completed > 0) {
    // For Phase 1, approximate based on last login
    const lastDate = new Date(student.lastLoginAt);
    const now = new Date();
    daysSinceLastTask = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return {
    total: tasks.length,
    completed: completed,
    completionRate: tasks.length > 0 ? 1.0 : 0, // Phase 1: assume all in history are complete
    daysSinceLastTask,
  };
}

/**
 * Assess churn risk for a student (PRD-spec implementation)
 */
export async function assessRisk(
  student: Student
): Promise<ChurnRiskAssessment> {
  const now = new Date();
  const accountAge = getAccountAge(student, now);
  const daysSinceActive = getDaysSinceActive(student, now);
  const sessionCount = student.sessions?.length || 0;

  let score = 0;
  const reasons: string[] = [];
  const interventions: string[] = [];

  // Factor 1: Session count in first week (PRD weights: 40, 30, 35)
  if (accountAge <= 7) {
    if (accountAge >= 3 && sessionCount < 1) {
      score += 40;
      reasons.push("No sessions by Day 3");
      interventions.push("Welcome nudge with easy first task");
    } else if (accountAge >= 5 && sessionCount < 2) {
      score += 30;
      reasons.push("Less than 2 sessions by Day 5");
      interventions.push("Show progress made, suggest next step");
    } else if (accountAge >= 7 && sessionCount < 3) {
      score += 35;
      reasons.push("Less than 3 sessions by Day 7");
      interventions.push("Celebrate what they've done, build momentum");
    }
  }

  // Factor 2: Inactivity duration (PRD weights: 35, 20, 10)
  if (daysSinceActive >= 3) {
    score += 35;
    reasons.push(`No activity for ${daysSinceActive} days`);
    interventions.push("Personal check-in, ask how they're doing");
  } else if (daysSinceActive >= 2) {
    score += 20;
    reasons.push(`Inactive for ${daysSinceActive} days`);
    interventions.push("Reminder with specific task suggestion");
  } else if (daysSinceActive >= 1) {
    score += 10;
    reasons.push("Inactive for 1 day");
    interventions.push("Gentle reminder about streak");
  }

  // Factor 3: Task completion (PRD weights: 25, 15)
  const taskStats = getTaskStats(student);
  if (taskStats.daysSinceLastTask >= 5) {
    score += 25;
    reasons.push("No tasks completed in 5+ days");
    interventions.push("Assign easy, quick win task");
  } else if (taskStats.completionRate < 0.3 && taskStats.total > 5) {
    score += 15;
    reasons.push("Low task completion rate");
    interventions.push("Check if tasks are too difficult");
  }

  // Factor 4: Goal status (PRD weight: 30)
  const completedGoals = student.goals?.filter((g) => g.progress >= 100) || [];
  const activeGoals = student.goals?.filter((g) => g.progress < 100) || [];

  if (completedGoals.length > 0 && activeGoals.length === 0) {
    score += 30;
    reasons.push("Completed goal, no new goals");
    interventions.push("Suggest related subjects");
  }

  // Factor 5: Streak status (PRD weight: 15)
  const hadStreak =
    (student.streaks?.login?.longest || student.streaks?.longest || 0) > 0;
  const currentStreak =
    student.streaks?.login?.current ||
    student.streaks?.practice?.current ||
    student.streaks?.current ||
    0;

  if (hadStreak && currentStreak === 0) {
    score += 15;
    reasons.push("Lost previous streak");
    interventions.push("Encourage streak recovery");
  }

  // Determine risk level (PRD thresholds)
  let level: ChurnRisk;
  if (score >= 60) {
    level = ChurnRisk.HIGH;
  } else if (score >= 35) {
    level = ChurnRisk.MEDIUM;
  } else if (score >= 15) {
    level = ChurnRisk.LOW;
  } else {
    level = ChurnRisk.NONE;
  }

  return {
    level,
    score,
    reasons,
    interventions,
    daysSinceActive,
    sessionCount,
  };
}

/**
 * Check if student should receive a nudge (respects 24hr limit)
 */
export function shouldNudge(student: Student): boolean {
  // Check last nudge time
  const lastNudge = student.metadata?.lastNudgeShown;
  if (lastNudge) {
    const hoursSince =
      (Date.now() - new Date(lastNudge).getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      return false; // Max 1 nudge per 24 hours
    }
  }

  // Check risk level
  const now = new Date();
  const daysSinceActive = getDaysSinceActive(student, now);

  // At minimum, show nudge if inactive for 2+ days
  return daysSinceActive >= 2;
}

/**
 * Get all students at risk of churning
 */
export async function getAtRiskStudents(): Promise<
  Array<{ student: Student; assessment: ChurnRiskAssessment }>
> {
  try {
    const { getAllStudents } = await import("./studentService");
    const students = await getAllStudents();

    const assessments = await Promise.all(
      students.map(async (student) => {
        const assessment = await assessRisk(student);
        return { student, assessment };
      })
    );

    return assessments
      .filter((a) => a.assessment.level !== ChurnRisk.NONE)
      .sort((a, b) => b.assessment.score - a.assessment.score);
  } catch (error) {
    console.error("Error getting at-risk students:", error);
    return [];
  }
}

/**
 * Check if student meets "at-risk" criteria
 */
export async function isAtRisk(studentId: string): Promise<boolean> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return false;

    const assessment = await assessRisk(student);
    return (
      assessment.level === ChurnRisk.MEDIUM ||
      assessment.level === ChurnRisk.HIGH
    );
  } catch (error) {
    console.error(`Error checking if student ${studentId} is at risk:`, error);
    return false;
  }
}

/**
 * Update student's churn risk flag
 */
export async function updateChurnRiskFlag(studentId: string): Promise<void> {
  try {
    const { updateStudentProfile } = await import("./studentService");
    const atRisk = await isAtRisk(studentId);

    await updateStudentProfile(studentId, {
      churnRisk: atRisk,
    });
  } catch (error) {
    console.error(`Error updating churn risk flag for ${studentId}:`, error);
  }
}

/**
 * Get churn risk summary for dashboard
 */
export interface ChurnSummary {
  totalStudents: number;
  atRisk: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  percentageAtRisk: number;
}

export async function getChurnSummary(): Promise<ChurnSummary> {
  try {
    const atRiskStudents = await getAtRiskStudents();
    const { getAllStudents } = await import("./studentService");
    const allStudents = await getAllStudents();

    const highRisk = atRiskStudents.filter(
      (a) => a.assessment.level === ChurnRisk.HIGH
    ).length;
    const mediumRisk = atRiskStudents.filter(
      (a) => a.assessment.level === ChurnRisk.MEDIUM
    ).length;
    const lowRisk = atRiskStudents.filter(
      (a) => a.assessment.level === ChurnRisk.LOW
    ).length;

    return {
      totalStudents: allStudents.length,
      atRisk: atRiskStudents.length,
      highRisk,
      mediumRisk,
      lowRisk,
      percentageAtRisk:
        allStudents.length > 0
          ? Math.round((atRiskStudents.length / allStudents.length) * 100)
          : 0,
    };
  } catch (error) {
    console.error("Error getting churn summary:", error);
    return {
      totalStudents: 0,
      atRisk: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
      percentageAtRisk: 0,
    };
  }
}

// Legacy function aliases for backwards compatibility
export const calculateChurnRisk = assessRisk;
