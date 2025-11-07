import { Student } from "@/types";
import { getStudentById } from "./studentService";
import { calculateChurnRisk } from "./churnDetectionService";
import { formatDate } from "@/lib/utils/dateUtils";

/**
 * Nudge types
 */
export type NudgeType =
  | "celebration"
  | "encouragement"
  | "streak_reminder"
  | "task_reminder"
  | "goal_progress"
  | "comeback";

/**
 * Nudge message
 */
export interface Nudge {
  id: string;
  studentId: string;
  type: NudgeType;
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  expiresAt?: string;
  dismissed: boolean;
}

// Store nudges in memory for Phase 1
const nudgeCache = new Map<string, Nudge[]>();

/**
 * Generate personalized nudge based on student state
 */
export async function generateNudge(studentId: string): Promise<Nudge | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    const churnRisk = await calculateChurnRisk(studentId);

    // Priority 1: Celebrate wins first (PRD: celebrate-first approach)
    const celebrationNudge = await generateCelebrationNudge(student);
    if (celebrationNudge) return celebrationNudge;

    // Priority 2: Encourage catch-up if at risk
    if (churnRisk.riskLevel !== "none") {
      const encouragementNudge = await generateEncouragementNudge(
        student,
        churnRisk.factors
      );
      if (encouragementNudge) return encouragementNudge;
    }

    // Priority 3: Streak reminders
    const streakNudge = await generateStreakNudge(student);
    if (streakNudge) return streakNudge;

    // Priority 4: Task reminders
    const taskNudge = await generateTaskNudge(student);
    if (taskNudge) return taskNudge;

    return null;
  } catch (error) {
    console.error(`Error generating nudge for ${studentId}:`, error);
    return null;
  }
}

/**
 * Generate celebration nudge for achievements/progress
 */
async function generateCelebrationNudge(
  student: Student
): Promise<Nudge | null> {
  // Check for high progress on any goal
  const highProgressGoals = student.goals.filter((g) => g.progress >= 75);

  if (highProgressGoals.length > 0) {
    const goal = highProgressGoals[0];
    return {
      id: `nudge-${student.id}-${Date.now()}`,
      studentId: student.id,
      type: "celebration",
      title: "Amazing Progress!",
      message: `Great job on ${goal.subject}! You're ${goal.progress}% complete! 🎉`,
      actionText: "Keep Going!",
      priority: "high",
      createdAt: new Date().toISOString(),
      dismissed: false,
    };
  }

  // Check for recent achievement unlocks
  if (student.achievements.length > 0) {
    const latestAchievement =
      student.achievements[student.achievements.length - 1];
    return {
      id: `nudge-${student.id}-${Date.now()}`,
      studentId: student.id,
      type: "celebration",
      title: "Achievement Unlocked!",
      message: `You earned the ${latestAchievement.replace(
        "_",
        " "
      )} badge! Keep up the great work! 🏆`,
      actionText: "View Badges",
      priority: "high",
      createdAt: new Date().toISOString(),
      dismissed: false,
    };
  }

  return null;
}

/**
 * Generate encouragement nudge for at-risk students
 */
async function generateEncouragementNudge(
  student: Student,
  riskFactors: string[]
): Promise<Nudge | null> {
  // Find a goal that needs attention
  const needsAttentionGoal = student.goals.find((g) => g.progress < 40);

  if (needsAttentionGoal) {
    return {
      id: `nudge-${student.id}-${Date.now()}`,
      studentId: student.id,
      type: "encouragement",
      title: "Let's Get Back on Track!",
      message: `${needsAttentionGoal.subject} needs a little love. How about a quick 5-minute practice session?`,
      actionText: "Start Practice",
      priority: "high",
      createdAt: new Date().toISOString(),
      dismissed: false,
    };
  }

  // General encouragement
  return {
    id: `nudge-${student.id}-${Date.now()}`,
    studentId: student.id,
    type: "encouragement",
    title: "We Miss You!",
    message:
      "It's been a while! Let's continue your learning journey together.",
    actionText: "Continue Learning",
    priority: "medium",
    createdAt: new Date().toISOString(),
    dismissed: false,
  };
}

/**
 * Generate streak reminder nudge
 */
async function generateStreakNudge(student: Student): Promise<Nudge | null> {
  // Streak about to break
  if (student.streaks.current > 0) {
    return {
      id: `nudge-${student.id}-${Date.now()}`,
      studentId: student.id,
      type: "streak_reminder",
      title: "Don't Break Your Streak!",
      message: `You're on a ${student.streaks.current}-day streak! 🔥 Keep it going!`,
      actionText: "Study Now",
      priority: "medium",
      createdAt: new Date().toISOString(),
      dismissed: false,
    };
  }

  // Encourage new streak after breaking one
  if (student.streaks.longest > 0 && student.streaks.current === 0) {
    return {
      id: `nudge-${student.id}-${Date.now()}`,
      studentId: student.id,
      type: "streak_reminder",
      title: "Start a New Streak!",
      message: `Your record is ${student.streaks.longest} days. Let's beat it! 💪`,
      actionText: "Start Streak",
      priority: "low",
      createdAt: new Date().toISOString(),
      dismissed: false,
    };
  }

  return null;
}

/**
 * Generate task reminder nudge
 */
async function generateTaskNudge(student: Student): Promise<Nudge | null> {
  if (student.taskHistory.length === 0) {
    return {
      id: `nudge-${student.id}-${Date.now()}`,
      studentId: student.id,
      type: "task_reminder",
      title: "Try Your First Practice Task!",
      message:
        "I've created some practice problems just for you. Give them a try!",
      actionText: "View Tasks",
      priority: "medium",
      createdAt: new Date().toISOString(),
      dismissed: false,
    };
  }

  return null;
}

/**
 * Store a nudge for a student
 */
export async function saveNudge(nudge: Nudge): Promise<void> {
  const studentNudges = nudgeCache.get(nudge.studentId) || [];
  studentNudges.push(nudge);
  nudgeCache.set(nudge.studentId, studentNudges);
}

/**
 * Get active nudges for a student
 */
export async function getActiveNudges(studentId: string): Promise<Nudge[]> {
  const now = new Date();
  const studentNudges = nudgeCache.get(studentId) || [];

  return studentNudges.filter(
    (nudge) =>
      !nudge.dismissed && (!nudge.expiresAt || new Date(nudge.expiresAt) > now)
  );
}

/**
 * Dismiss a nudge
 */
export async function dismissNudge(
  studentId: string,
  nudgeId: string
): Promise<void> {
  const studentNudges = nudgeCache.get(studentId) || [];
  const nudge = studentNudges.find((n) => n.id === nudgeId);

  if (nudge) {
    nudge.dismissed = true;
    nudgeCache.set(studentId, studentNudges);
  }
}

/**
 * Check if student should receive a nudge (respects 1/day/subject limit)
 */
export async function shouldShowNudge(
  studentId: string,
  subject?: string
): Promise<boolean> {
  const today = new Date().toDateString();
  const studentNudges = nudgeCache.get(studentId) || [];

  // Count nudges shown today
  const nudgesToday = studentNudges.filter(
    (n) => new Date(n.createdAt).toDateString() === today
  );

  // If subject specified, check subject-specific limit
  if (subject) {
    const subjectNudgesToday = nudgesToday.filter((n) =>
      n.message.toLowerCase().includes(subject.toLowerCase())
    );
    return subjectNudgesToday.length === 0; // Max 1 per subject per day
  }

  // General limit: max 3 nudges per day total
  return nudgesToday.length < 3;
}

/**
 * Generate and show nudge if appropriate
 */
export async function triggerNudgeIfNeeded(
  studentId: string
): Promise<Nudge | null> {
  try {
    const shouldShow = await shouldShowNudge(studentId);
    if (!shouldShow) return null;

    const nudge = await generateNudge(studentId);
    if (nudge) {
      await saveNudge(nudge);
    }

    return nudge;
  } catch (error) {
    console.error(`Error triggering nudge for ${studentId}:`, error);
    return null;
  }
}
