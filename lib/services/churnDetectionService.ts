import { Student } from "@/types";
import { getStudentById } from "./studentService";
import { getSessionCount, getLastSessionDate } from "./sessionService";
import { daysSince } from "@/lib/utils/dateUtils";

/**
 * Churn risk levels
 */
export type ChurnRiskLevel = "none" | "low" | "medium" | "high";

/**
 * Churn risk assessment result
 */
export interface ChurnRiskAssessment {
  riskLevel: ChurnRiskLevel;
  score: number; // 0-100, higher = more risk
  factors: string[];
  recommendations: string[];
}

/**
 * Calculate churn risk score for a student
 */
export async function calculateChurnRisk(
  studentId: string
): Promise<ChurnRiskAssessment> {
  try {
    const student = await getStudentById(studentId);
    if (!student) {
      return {
        riskLevel: "none",
        score: 0,
        factors: [],
        recommendations: [],
      };
    }

    let score = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    // Factor 1: Session count (most important)
    const sessionCount = await getSessionCount(studentId);
    const daysSinceCreation = daysSince(student.createdAt);

    if (daysSinceCreation >= 7) {
      if (sessionCount < 3) {
        score += 40;
        factors.push(`Only ${sessionCount} sessions in first week`);
        recommendations.push("Schedule more frequent tutor sessions");
      } else if (sessionCount < 5) {
        score += 20;
        factors.push("Below average session frequency");
      }
    }

    // Factor 2: Last activity
    const daysSinceLastLogin = daysSince(student.lastLoginAt);
    if (daysSinceLastLogin > 3) {
      score += 25;
      factors.push(`No login for ${daysSinceLastLogin} days`);
      recommendations.push("Send re-engagement notification");
    } else if (daysSinceLastLogin > 1) {
      score += 10;
      factors.push("Inactive for multiple days");
    }

    // Factor 3: Streak status
    const currentStreak =
      student.streaks.login?.current || student.streaks.current || 0;
    const longestStreak =
      student.streaks.login?.longest || student.streaks.longest || 0;
    if (currentStreak === 0 && longestStreak > 0) {
      score += 15;
      factors.push("Lost previous streak");
      recommendations.push("Encourage streak rebuild");
    }

    // Factor 4: Goal progress
    const avgGoalProgress =
      student.goals.reduce((sum, g) => sum + g.progress, 0) /
      (student.goals.length || 1);
    if (avgGoalProgress < 20 && daysSinceCreation >= 7) {
      score += 15;
      factors.push("Low progress on learning goals");
      recommendations.push("Simplify goals or break into smaller tasks");
    }

    // Factor 5: Engagement metrics
    if (student.totalConversations < 3 && daysSinceCreation >= 7) {
      score += 10;
      factors.push("Low AI interaction");
      recommendations.push("Prompt to use AI tutor between sessions");
    }

    // Factor 6: Task completion
    if (student.taskHistory.length === 0 && daysSinceCreation >= 3) {
      score += 5;
      factors.push("No practice tasks completed");
    }

    // Determine risk level
    let riskLevel: ChurnRiskLevel = "none";
    if (score >= 70) riskLevel = "high";
    else if (score >= 40) riskLevel = "medium";
    else if (score >= 20) riskLevel = "low";

    // Add default recommendations if at risk
    if (riskLevel !== "none" && recommendations.length === 0) {
      recommendations.push("Increase check-ins");
      recommendations.push("Personalize content to student interests");
    }

    return {
      riskLevel,
      score: Math.min(100, score),
      factors,
      recommendations,
    };
  } catch (error) {
    console.error(`Error calculating churn risk for ${studentId}:`, error);
    return {
      riskLevel: "none",
      score: 0,
      factors: ["Error calculating risk"],
      recommendations: [],
    };
  }
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
        const assessment = await calculateChurnRisk(student.id);
        return { student, assessment };
      })
    );

    return assessments
      .filter((a) => a.assessment.riskLevel !== "none")
      .sort((a, b) => b.assessment.score - a.assessment.score);
  } catch (error) {
    console.error("Error getting at-risk students:", error);
    return [];
  }
}

/**
 * Check if student meets "at-risk" criteria (for PRD: <3 sessions by Day 7)
 */
export async function isAtRisk(studentId: string): Promise<boolean> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return false;

    const daysSinceCreation = daysSince(student.createdAt);
    const sessionCount = await getSessionCount(studentId);

    // PRD criteria: <3 sessions by Day 7
    if (daysSinceCreation >= 7 && sessionCount < 3) {
      return true;
    }

    // Additional criteria: no login in 3+ days
    const daysSinceLastLogin = daysSince(student.lastLoginAt);
    if (daysSinceLastLogin >= 3) {
      return true;
    }

    return false;
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
      (a) => a.assessment.riskLevel === "high"
    ).length;
    const mediumRisk = atRiskStudents.filter(
      (a) => a.assessment.riskLevel === "medium"
    ).length;
    const lowRisk = atRiskStudents.filter(
      (a) => a.assessment.riskLevel === "low"
    ).length;

    return {
      totalStudents: allStudents.length,
      atRisk: atRiskStudents.length,
      highRisk,
      mediumRisk,
      lowRisk,
      percentageAtRisk: Math.round(
        (atRiskStudents.length / allStudents.length) * 100
      ),
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
