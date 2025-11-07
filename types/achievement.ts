export type AchievementId =
  | "first_steps"
  | "three_day_streak"
  | "topic_master"
  | "curious_mind"
  | "social_butterfly"
  | "streak_breaker";

export interface Achievement {
  id: AchievementId;
  name: string;
  icon: string;
  description: string;
  trigger: string;
  unlockedAt?: string; // ISO date
}

export const ACHIEVEMENT_DEFINITIONS: Record<
  AchievementId,
  Omit<Achievement, "unlockedAt">
> = {
  first_steps: {
    id: "first_steps",
    name: "First Steps",
    icon: "🎯",
    description: "Welcome to learning!",
    trigger: "Complete first conversation",
  },
  three_day_streak: {
    id: "three_day_streak",
    name: "3-Day Streak",
    icon: "🔥",
    description: "Consistency is key!",
    trigger: "Study 3 consecutive days",
  },
  topic_master: {
    id: "topic_master",
    name: "Topic Master",
    icon: "🎓",
    description: "You've mastered this!",
    trigger: "Reach 90% on any topic",
  },
  curious_mind: {
    id: "curious_mind",
    name: "Curious Mind",
    icon: "❓",
    description: "Never stop wondering!",
    trigger: "Ask 10 questions",
  },
  social_butterfly: {
    id: "social_butterfly",
    name: "Social Butterfly",
    icon: "🤝",
    description: "Learning together!",
    trigger: "Send 5 friend messages",
  },
  streak_breaker: {
    id: "streak_breaker",
    name: "Streak Breaker",
    icon: "🏆",
    description: "New personal record!",
    trigger: "Beat previous longest streak",
  },
};
