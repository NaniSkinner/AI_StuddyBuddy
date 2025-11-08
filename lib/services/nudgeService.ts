import { Student } from "@/types";
import { getStudentById, saveStudentData } from "./studentService";
import {
  assessRisk,
  ChurnRisk,
  ChurnRiskAssessment,
} from "./churnDetectionService";
import {
  NudgeTemplate,
  NudgeMessage,
  ChurnReason,
  AgeGroup,
  NudgeIntensity,
} from "@/types/nudge";

/**
 * NUDGE TEMPLATES - Celebrate-First Structure
 * All templates follow: Celebration → Encouragement → CTA
 */
const NUDGE_TEMPLATES: NudgeTemplate[] = [
  // === INACTIVE NUDGES ===
  {
    id: "inactive-3days-young",
    trigger: "inactive",
    ageGroup: "young",
    messages: {
      celebration: "You did awesome on {subject} last time! 🎉",
      encouragement:
        "We miss you! Your AI buddy has been waiting to help you learn more cool stuff.",
      cta: "Want to try just one quick problem? It'll only take 2 minutes! 😊",
    },
    intensity: "gentle",
  },
  {
    id: "inactive-3days-middle",
    trigger: "inactive",
    ageGroup: "middle",
    messages: {
      celebration: "You're {progress}% through {subject} - that's progress!",
      encouragement:
        "Your streak is about to break. You're only 1 day away from beating your record of {longest_streak} days!",
      cta: "Quick 5-minute session to keep your streak alive?",
    },
    intensity: "moderate",
  },
  {
    id: "inactive-3days-teen",
    trigger: "inactive",
    ageGroup: "teen",
    messages: {
      celebration: "You're {progress}% through {subject} - you're so close!",
      encouragement:
        "Taking a break is fine, but momentum matters. Students who practice regularly score 15% higher.",
      cta: "One practice session today would put you over 80%. Ready to finish strong?",
    },
    intensity: "moderate",
  },

  // === GOAL COMPLETED NUDGES ===
  {
    id: "goal-completed-young",
    trigger: "goal_completed",
    ageGroup: "young",
    messages: {
      celebration: "You finished learning {subject}! That's AMAZING! 🏆",
      encouragement:
        "Now you're ready for something new! How about we try {next_subject}? They're like {subject}'s best friends!",
      cta: "Let's start with an easy one! Click here to begin!",
    },
    intensity: "gentle",
  },
  {
    id: "goal-completed-middle",
    trigger: "goal_completed",
    ageGroup: "middle",
    messages: {
      celebration: "Goal crushed! You completed {subject}! 🎉",
      encouragement:
        "Students who set new goals right away are 3x more likely to keep learning.",
      cta: "Want to add a new subject next? Choose what interests you!",
    },
    intensity: "moderate",
  },
  {
    id: "goal-completed-teen",
    trigger: "goal_completed",
    ageGroup: "teen",
    messages: {
      celebration:
        "{subject} complete! That's major progress toward your goals.",
      encouragement:
        "Since you're on a roll, consider adding another subject. Strong performance across multiple areas stands out.",
      cta: "Add a complementary subject to strengthen your profile?",
    },
    intensity: "moderate",
  },

  // === LOW TASK COMPLETION NUDGES ===
  {
    id: "low-completion-young",
    trigger: "low_task_completion",
    ageGroup: "young",
    messages: {
      celebration: "You've been working hard on these practice problems!",
      encouragement:
        "Some of them are tricky! That's okay - everyone learns at their own speed.",
      cta: "Want to try an easier one? I can help you build up to the harder stuff!",
    },
    intensity: "gentle",
  },
  {
    id: "low-completion-middle",
    trigger: "low_task_completion",
    ageGroup: "middle",
    messages: {
      celebration: "You're putting in the effort - that's what counts!",
      encouragement:
        "These tasks might be too challenging right now. Let's try something that matches your level better.",
      cta: "Try some easier tasks to build confidence?",
    },
    intensity: "gentle",
  },
  {
    id: "low-completion-teen",
    trigger: "low_task_completion",
    ageGroup: "teen",
    messages: {
      celebration: "You're tackling challenging material - that takes courage.",
      encouragement:
        "Lower completion rates often mean the difficulty is too high. Let's adjust to optimize your learning.",
      cta: "Want me to assign tasks at a better difficulty level?",
    },
    intensity: "moderate",
  },

  // === STREAK BROKEN NUDGES ===
  {
    id: "streak-broken-middle",
    trigger: "streak_broken",
    ageGroup: "middle",
    messages: {
      celebration: "Your {longest_streak}-day streak was impressive!",
      encouragement:
        "Streaks break sometimes - that's life! But you can start a new one right now.",
      cta: "Let's get Day 1 of your next streak started! One quick task?",
    },
    intensity: "gentle",
  },
  {
    id: "streak-broken-teen",
    trigger: "streak_broken",
    ageGroup: "teen",
    messages: {
      celebration: "You built a {longest_streak}-day streak before - solid discipline.",
      encouragement:
        "The streak broke, but the habits you built are still there. Time to rebuild.",
      cta: "Start your comeback streak today?",
    },
    intensity: "moderate",
  },

  // === GENERAL ENCOURAGEMENT ===
  {
    id: "general-young",
    trigger: "general_encouragement",
    ageGroup: "young",
    messages: {
      celebration: "You're learning so much! 🌟",
      encouragement: "Every time you practice, you get smarter!",
      cta: "Let's learn something new today!",
    },
    intensity: "gentle",
  },
  {
    id: "general-middle",
    trigger: "general_encouragement",
    ageGroup: "middle",
    messages: {
      celebration: "You're making great progress!",
      encouragement: "Consistent practice is the key to mastering any subject.",
      cta: "Ready for today's practice session?",
    },
    intensity: "gentle",
  },
  {
    id: "general-teen",
    trigger: "general_encouragement",
    ageGroup: "teen",
    messages: {
      celebration: "You're on the right track with your studies.",
      encouragement:
        "Regular practice correlates with better outcomes. You're building good habits.",
      cta: "Continue your progress with today's session?",
    },
    intensity: "gentle",
  },
];

/**
 * Generate a unique nudge ID
 */
function generateNudgeId(): string {
  return `nudge-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Determine primary trigger reason based on churn assessment
 */
export function determineTrigger(
  student: Student,
  risk: ChurnRiskAssessment
): ChurnReason {
  // Priority order (from PRD)
  if (risk.reasons.includes("Completed goal, no new goals")) {
    return "goal_completed";
  }
  if (risk.reasons.some((r) => r.includes("No activity") || r.includes("Inactive"))) {
    return "inactive";
  }
  if (risk.reasons.includes("Lost previous streak")) {
    return "streak_broken";
  }
  if (risk.reasons.includes("Low task completion rate")) {
    return "low_task_completion";
  }
  return "general_encouragement";
}

/**
 * Get age group for template selection
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age <= 11) return "young";
  if (age <= 14) return "middle";
  return "teen";
}

/**
 * Select appropriate template based on trigger, age, and risk level
 */
export function selectTemplate(
  student: Student,
  trigger: ChurnReason,
  risk: ChurnRiskAssessment
): NudgeTemplate {
  const ageGroup = getAgeGroup(student.age);

  // Find matching templates
  const candidates = NUDGE_TEMPLATES.filter(
    (t) => t.trigger === trigger && t.ageGroup === ageGroup
  );

  if (candidates.length === 0) {
    // Fallback to general encouragement
    return getGeneralTemplate(ageGroup, risk.level);
  }

  // Select based on intensity matching risk level
  if (risk.level === ChurnRisk.HIGH || risk.level === "high") {
    const urgent = candidates.find((t) => t.intensity === "urgent");
    if (urgent) return urgent;
  }

  // Return first match or fallback
  return candidates[0] || getGeneralTemplate(ageGroup, risk.level);
}

/**
 * Get fallback general template
 */
function getGeneralTemplate(ageGroup: AgeGroup, riskLevel: ChurnRisk | string): NudgeTemplate {
  const general = NUDGE_TEMPLATES.find(
    (t) => t.trigger === "general_encouragement" && t.ageGroup === ageGroup
  );

  return (
    general ||
    NUDGE_TEMPLATES.find((t) => t.trigger === "general_encouragement")!
  );
}

/**
 * Find something specific to celebrate about the student
 */
export function findCelebrationPoint(student: Student): string | null {
  const points: string[] = [];

  // Check achievements
  if (student.achievements?.length > 0) {
    points.push(
      `You've unlocked ${student.achievements.length} achievement${
        student.achievements.length > 1 ? "s" : ""
      }! 🏆`
    );
  }

  // Check streak
  const longestStreak =
    student.streaks?.login?.longest ||
    student.streaks?.practice?.longest ||
    student.streaks?.longest ||
    0;
  if (longestStreak > 0) {
    points.push(
      `Your longest streak was ${longestStreak} days - that's dedication!`
    );
  }

  // Check progress on goals
  const highProgress = student.goals?.find(
    (g) => g.progress >= 50 && g.progress < 100
  );
  if (highProgress) {
    points.push(
      `You're ${highProgress.progress}% done with ${highProgress.subject}! 🎯`
    );
  }

  // Check completed goals
  const completedGoals = student.goals?.filter((g) => g.progress >= 100) || [];
  if (completedGoals.length > 0) {
    points.push(
      `You completed ${completedGoals.length} goal${
        completedGoals.length > 1 ? "s" : ""
      }! Amazing! 🎉`
    );
  }

  // Check completed tasks
  const completedTasks = student.taskHistory?.length || 0;
  if (completedTasks >= 10) {
    points.push(
      `${completedTasks} practice tasks completed! You're putting in the work!`
    );
  }

  // Return random point if any found
  return points.length > 0
    ? points[Math.floor(Math.random() * points.length)]
    : null;
}

/**
 * Replace placeholders with student data
 */
export function replacePlaceholders(
  message: string,
  student: Student,
  data?: Record<string, any>
): string {
  let result = message;

  // Student info
  result = result.replace(/\{name\}/g, student.name);
  result = result.replace(/\{age\}/g, student.age.toString());
  result = result.replace(/\{grade\}/g, student.grade.toString());

  // Goal/subject info
  const activeGoal = student.goals?.[0];
  if (activeGoal) {
    result = result.replace(/\{subject\}/g, activeGoal.subject);
    result = result.replace(/\{progress\}/g, activeGoal.progress.toString());
  }

  // Streak info
  const longestStreak =
    student.streaks?.login?.longest ||
    student.streaks?.practice?.longest ||
    student.streaks?.longest ||
    0;
  result = result.replace(/\{longest_streak\}/g, longestStreak.toString());

  // Additional data if provided
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      result = result.replace(regex, String(value));
    });
  }

  // Remove any remaining placeholders
  result = result.replace(/\{[^}]+\}/g, "");

  return result;
}

/**
 * Get expiration time (24 hours from now)
 */
export function getExpirationTime(): string {
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  return expires.toISOString();
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

  return true;
}

/**
 * Generate personalized nudge for a student
 */
export async function generateNudge(
  studentId: string
): Promise<NudgeMessage | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    // Check if should nudge (24hr limit)
    if (!shouldNudge(student)) {
      return null;
    }

    // Assess churn risk
    const risk = await assessRisk(student);

    // Only nudge if at least LOW risk
    if (risk.level === ChurnRisk.NONE || risk.level === "none") {
      return null;
    }

    // Determine trigger reason
    const trigger = determineTrigger(student, risk);

    // Select appropriate template
    const template = selectTemplate(student, trigger, risk);

    // Find celebration point (overrides template if found)
    const celebrationPoint = findCelebrationPoint(student);
    let celebration = celebrationPoint || template.messages.celebration || "";

    // Personalize messages
    celebration = replacePlaceholders(celebration, student);
    const encouragement = replacePlaceholders(
      template.messages.encouragement,
      student
    );
    const cta = replacePlaceholders(template.messages.cta, student);

    // Create nudge message
    const nudgeMessage: NudgeMessage = {
      id: generateNudgeId(),
      studentId: student.id,
      type: "nudge",
      trigger,
      celebration,
      encouragement,
      cta,
      priority: risk.level as ChurnRisk,
      createdAt: new Date().toISOString(),
      expiresAt: getExpirationTime(),
    };

    return nudgeMessage;
  } catch (error) {
    console.error(`Error generating nudge for ${studentId}:`, error);
    return null;
  }
}

/**
 * Mark nudge as shown (updates student metadata)
 */
export async function markNudgeShown(
  studentId: string,
  nudgeId: string
): Promise<void> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return;

    // Initialize metadata if needed
    if (!student.metadata) {
      student.metadata = {};
    }

    // Update last nudge info
    student.metadata.lastNudgeShown = new Date().toISOString();
    student.metadata.lastNudgeId = nudgeId;

    // Save student data
    await saveStudentData(student);
  } catch (error) {
    console.error(`Error marking nudge shown for ${studentId}:`, error);
  }
}

/**
 * Record nudge interaction
 */
export async function recordNudgeInteraction(
  studentId: string,
  nudgeId: string,
  action: "accepted" | "dismissed" | "expired"
): Promise<void> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return;

    // Initialize metadata if needed
    if (!student.metadata) {
      student.metadata = {};
    }
    if (!student.metadata.nudgeHistory) {
      student.metadata.nudgeHistory = [];
    }

    // Find existing interaction or create new
    const existing = student.metadata.nudgeHistory.find((n) => n.id === nudgeId);
    if (existing) {
      existing.action = action;
      existing.actionAt = new Date().toISOString();
    } else {
      student.metadata.nudgeHistory.push({
        id: nudgeId,
        type: "nudge",
        shownAt: new Date().toISOString(),
        action,
        actionAt: new Date().toISOString(),
      });
    }

    // Log for Phase 1 (console logging)
    const color = action === "accepted" ? "\x1b[32m" : "\x1b[33m";
    const reset = "\x1b[0m";
    console.log(
      `${color}📊 Nudge ${action.toUpperCase()}:${reset} ${nudgeId} by ${student.name}`
    );

    // Save student data
    await saveStudentData(student);
  } catch (error) {
    console.error(
      `Error recording nudge interaction for ${studentId}:`,
      error
    );
  }
}

// Legacy function aliases for backwards compatibility
export const triggerNudgeIfNeeded = generateNudge;
export const dismissNudge = (studentId: string, nudgeId: string) =>
  recordNudgeInteraction(studentId, nudgeId, "dismissed");
export const acceptNudge = (studentId: string, nudgeId: string) =>
  recordNudgeInteraction(studentId, nudgeId, "accepted");
