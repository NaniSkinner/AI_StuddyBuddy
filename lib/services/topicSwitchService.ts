import { Student, Goal } from "@/types";

export interface TopicSwitchSuggestion {
  shouldSuggest: boolean;
  suggestedGoal: Goal | null;
  currentGoal: Goal | null;
  reason: string;
  trigger: "time" | "progress" | "balance" | "none";
}

/**
 * Determine if we should suggest a topic switch
 * Based on: conversation duration, progress, and subject balance
 */
export function shouldSuggestTopicSwitch(
  student: Student,
  currentGoalId: string,
  conversationDurationMinutes: number,
  lastSuggestionTime: number | null,
  declinedGoalIds: string[]
): TopicSwitchSuggestion {
  // Find current goal
  const currentGoal = student.goals.find((g) => g.id === currentGoalId);
  if (!currentGoal) {
    return createNoSuggestion();
  }

  // Check cooldown (15 minutes between suggestions)
  if (lastSuggestionTime) {
    const minutesSinceLastSuggestion =
      (Date.now() - lastSuggestionTime) / 1000 / 60;
    if (minutesSinceLastSuggestion < 15) {
      return createNoSuggestion();
    }
  }

  // Get alternative goals (not current, not declined this session)
  const alternativeGoals = student.goals.filter(
    (g) => g.id !== currentGoalId && !declinedGoalIds.includes(g.id)
  );

  if (alternativeGoals.length === 0) {
    return createNoSuggestion();
  }

  // TRIGGER 1: Time-based (2 minutes for demo, normally 30 minutes)
  // For demo: use 2 minutes, for production: use 30
  const timeThreshold = process.env.NODE_ENV === "development" ? 2 : 30;

  if (conversationDurationMinutes >= timeThreshold) {
    // Pick a random alternative goal
    const suggestedGoal =
      alternativeGoals[Math.floor(Math.random() * alternativeGoals.length)];

    return {
      shouldSuggest: true,
      suggestedGoal,
      currentGoal,
      reason: `You've been working on ${currentGoal.subject} for a while now. How about we switch to ${suggestedGoal.subject}?`,
      trigger: "time",
    };
  }

  // TRIGGER 2: Progress-based (>85% complete on current topic)
  if (currentGoal.progress >= 85) {
    // Find a lower-progress alternative
    const lowerProgressGoals = alternativeGoals.filter(
      (g) => g.progress < currentGoal.progress - 10
    );

    if (lowerProgressGoals.length > 0) {
      // Sort by lowest progress
      const suggestedGoal = lowerProgressGoals.sort(
        (a, b) => a.progress - b.progress
      )[0];

      return {
        shouldSuggest: true,
        suggestedGoal,
        currentGoal,
        reason: `Amazing progress on ${currentGoal.subject} (${Math.round(currentGoal.progress)}%)! Ready to work on ${suggestedGoal.subject}?`,
        trigger: "progress",
      };
    }
  }

  // TRIGGER 3: Balance-based (progress gap >30%)
  if (alternativeGoals.length > 0 && currentGoal.progress > 60) {
    // Find goals with significantly lower progress
    const maxProgress = Math.max(...student.goals.map((g) => g.progress));
    const minProgress = Math.min(...student.goals.map((g) => g.progress));
    const progressGap = maxProgress - minProgress;

    if (progressGap > 30) {
      // Suggest the lagging goal
      const laggingGoal = student.goals.reduce((prev, current) =>
        prev.progress < current.progress ? prev : current
      );

      if (
        laggingGoal.id !== currentGoalId &&
        !declinedGoalIds.includes(laggingGoal.id)
      ) {
        return {
          shouldSuggest: true,
          suggestedGoal: laggingGoal,
          currentGoal,
          reason: `Let's balance your learning! Your ${laggingGoal.subject} could use some attention.`,
          trigger: "balance",
        };
      }
    }
  }

  return createNoSuggestion();
}

/**
 * Create a "no suggestion" result
 */
function createNoSuggestion(): TopicSwitchSuggestion {
  return {
    shouldSuggest: false,
    suggestedGoal: null,
    currentGoal: null,
    reason: "",
    trigger: "none",
  };
}

/**
 * Get formatted reason based on student age
 */
export function getAgeAppropriateReason(
  baseReason: string,
  studentAge: number,
  trigger: "time" | "progress" | "balance" | "none"
): string {
  // For younger students (9-11), use more playful language
  if (studentAge <= 11) {
    switch (trigger) {
      case "time":
        return baseReason.replace("How about", "Want to");
      case "progress":
        return baseReason.replace("Amazing progress", "Wow! Great job");
      case "balance":
        return baseReason.replace("Let's balance", "Hey! Let's also work on");
      default:
        return baseReason;
    }
  }

  // For older students (15+), use more mature language
  if (studentAge >= 15) {
    switch (trigger) {
      case "time":
        return baseReason.replace(
          "How about we switch",
          "Would you like to transition"
        );
      case "progress":
        return baseReason.replace("Amazing progress", "Excellent work");
      case "balance":
        return baseReason.replace(
          "Let's balance your learning",
          "Consider balancing your study time"
        );
      default:
        return baseReason;
    }
  }

  // Default (12-14) - use the base reason
  return baseReason;
}
