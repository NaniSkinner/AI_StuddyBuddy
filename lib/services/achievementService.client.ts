/**
 * Client-safe achievement service functions
 * These functions work with Student objects directly and don't access the file system
 */

import {
  AchievementId,
  ACHIEVEMENT_DEFINITIONS,
  Achievement,
  BadgeRarity,
  RARITY_ORDER,
  Student,
} from "@/types";

/**
 * Get all available achievements with locked/unlocked status
 * CLIENT-SAFE: Works with Student object directly
 */
export async function getAllAchievementsWithStatus(
  student: Student
): Promise<Array<Achievement & { unlocked: boolean }>> {
  return Object.values(ACHIEVEMENT_DEFINITIONS).map((achievement) => ({
    ...achievement,
    unlocked: student.achievements.includes(achievement.id),
    unlockedAt: undefined,
  }));
}

/**
 * Get achievement progress summary
 * CLIENT-SAFE: Works with Student object directly
 */
export interface AchievementProgress {
  totalAchievements: number;
  unlockedCount: number;
  percentage: number;
  totalPoints: number;
  nextToUnlock?: Achievement;
}

export async function getAchievementProgress(
  student: Student
): Promise<AchievementProgress> {
  const totalAchievements = Object.keys(ACHIEVEMENT_DEFINITIONS).length;
  const unlockedCount = student.achievements.length;
  const percentage = Math.round((unlockedCount / totalAchievements) * 100);
  const totalPoints = student.totalPoints || 0;

  // Find next achievement to unlock (simple heuristic)
  let nextToUnlock: Achievement | undefined;
  if (!student.achievements.includes("first_steps")) {
    nextToUnlock = { ...ACHIEVEMENT_DEFINITIONS.first_steps };
  } else if (!student.achievements.includes("three_day_streak")) {
    nextToUnlock = { ...ACHIEVEMENT_DEFINITIONS.three_day_streak };
  } else if (!student.achievements.includes("curious_mind")) {
    nextToUnlock = { ...ACHIEVEMENT_DEFINITIONS.curious_mind };
  }

  return {
    totalAchievements,
    unlockedCount,
    percentage,
    totalPoints,
    nextToUnlock,
  };
}

/**
 * Get total achievement points for a student
 * CLIENT-SAFE: Works with Student object directly
 */
export async function getAchievementPoints(student: Student): Promise<number> {
  return student.totalPoints || 0;
}

/**
 * Get achievements filtered by rarity
 * CLIENT-SAFE: Works with Student object directly
 */
export async function getAchievementsByRarity(
  student: Student,
  rarity: BadgeRarity
): Promise<Achievement[]> {
  const allWithStatus = await getAllAchievementsWithStatus(student);
  return allWithStatus
    .filter((a) => a.rarity === rarity && a.unlocked)
    .map(({ unlocked, ...achievement }) => achievement);
}

/**
 * Sort achievements by rarity (legendary first)
 * CLIENT-SAFE: Pure function
 */
export function sortAchievementsByRarity(
  achievements: Achievement[]
): Achievement[] {
  return [...achievements].sort((a, b) => {
    const rarityDiff = RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
    if (rarityDiff !== 0) return rarityDiff;
    // If same rarity, sort by points (higher first)
    return b.points - a.points;
  });
}

/**
 * Get achievements grouped by rarity
 * CLIENT-SAFE: Works with Student object directly
 */
export async function getAchievementsGroupedByRarity(
  student: Student
): Promise<Record<BadgeRarity, Achievement[]>> {
  const allWithStatus = await getAllAchievementsWithStatus(student);
  const unlocked = allWithStatus
    .filter((a) => a.unlocked)
    .map(({ unlocked, ...achievement }) => achievement);

  const grouped: Record<BadgeRarity, Achievement[]> = {
    legendary: [],
    rare: [],
    uncommon: [],
    common: [],
  };

  for (const achievement of unlocked) {
    grouped[achievement.rarity].push(achievement);
  }

  return grouped;
}
