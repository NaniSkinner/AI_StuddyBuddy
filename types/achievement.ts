export type AchievementId =
  | "first_steps"
  | "three_day_streak"
  | "topic_master"
  | "curious_mind"
  | "social_butterfly"
  | "streak_breaker";

export type BadgeRarity = "common" | "uncommon" | "rare" | "legendary";

export interface Achievement {
  id: AchievementId;
  name: string;
  icon: string;
  description: string;
  trigger: string;
  points: number;
  rarity: BadgeRarity;
  unlockedAt?: string; // ISO date
}

export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: "#7FD8BE", // Green
  uncommon: "#6FB1FC", // Blue
  rare: "#A685E2", // Purple
  legendary: "#FFE66D", // Gold
};

export const RARITY_ORDER: Record<BadgeRarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  legendary: 4,
};

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
    points: 10,
    rarity: "common",
  },
  three_day_streak: {
    id: "three_day_streak",
    name: "3-Day Streak",
    icon: "🔥",
    description: "Consistency is key!",
    trigger: "Study 3 consecutive days",
    points: 20,
    rarity: "common",
  },
  topic_master: {
    id: "topic_master",
    name: "Topic Master",
    icon: "🎓",
    description: "You've mastered this!",
    trigger: "Reach 90% on any topic",
    points: 30,
    rarity: "uncommon",
  },
  curious_mind: {
    id: "curious_mind",
    name: "Curious Mind",
    icon: "❓",
    description: "Never stop wondering!",
    trigger: "Ask 10 questions",
    points: 15,
    rarity: "common",
  },
  social_butterfly: {
    id: "social_butterfly",
    name: "Social Butterfly",
    icon: "🤝",
    description: "Learning together!",
    trigger: "Send 5 friend messages",
    points: 15,
    rarity: "common",
  },
  streak_breaker: {
    id: "streak_breaker",
    name: "Streak Breaker",
    icon: "🏆",
    description: "New personal record!",
    trigger: "Beat previous longest streak",
    points: 40,
    rarity: "rare",
  },
};
