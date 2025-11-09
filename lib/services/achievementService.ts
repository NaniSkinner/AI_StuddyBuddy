import {
  AchievementId,
  ACHIEVEMENT_DEFINITIONS,
  Achievement,
  BadgeRarity,
  RARITY_ORDER,
  Student,
} from "@/types";

async function getStudentById(id: string) {
  if (typeof window !== "undefined") {
    throw new Error(
      "getStudentById cannot be called client-side. Pass a Student object instead of ID."
    );
  }
  const { getStudentById: getStudent } = await import("./studentService");
  return getStudent(id);
}

async function saveStudentData(student: Student) {
  if (typeof window !== "undefined") {
    throw new Error(
      "saveStudentData cannot be called client-side. Use API routes instead."
    );
  }
  const { saveStudentData: saveStudent } = await import("./studentService");
  return saveStudent(student);
}

export async function hasAchievement(
  studentId: string,
  achievementId: AchievementId
): Promise<boolean> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return false;

    return student.achievements.includes(achievementId);
  } catch (error) {
    console.error(
      `Error checking achievement ${achievementId} for ${studentId}:`,
      error
    );
    return false;
  }
}

export async function unlockAchievement(
  studentId: string,
  achievementId: AchievementId
): Promise<boolean> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return false;

    if (student.achievements.includes(achievementId)) {
      return false;
    }

    const achievementDef = ACHIEVEMENT_DEFINITIONS[achievementId];
    if (!achievementDef) return false;

    student.achievements.push(achievementId);

    student.totalPoints = (student.totalPoints || 0) + achievementDef.points;

    await saveStudentData(student);

    return true;
  } catch (error) {
    console.error(
      `Error unlocking achievement ${achievementId} for ${studentId}:`,
      error
    );
    return false;
  }
}

export async function getStudentAchievements(
  studentId: string
): Promise<Achievement[]> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return [];

    return student.achievements.map((id) => ({
      ...ACHIEVEMENT_DEFINITIONS[id],
      unlockedAt: undefined,
    }));
  } catch (error) {
    console.error(`Error getting achievements for ${studentId}:`, error);
    return [];
  }
}

export async function getAllAchievementsWithStatus(
  studentOrId: string | Student
): Promise<Array<Achievement & { unlocked: boolean }>> {
  try {
    const student =
      typeof studentOrId === "string"
        ? await getStudentById(studentOrId)
        : studentOrId;
    if (!student) return [];

    return Object.values(ACHIEVEMENT_DEFINITIONS).map((achievement) => ({
      ...achievement,
      unlocked: student.achievements.includes(achievement.id),
      unlockedAt: undefined,
    }));
  } catch (error) {
    const id = typeof studentOrId === "string" ? studentOrId : studentOrId.id;
    console.error(
      `Error getting all achievements with status for ${id}:`,
      error
    );
    return [];
  }
}

export async function checkFirstSteps(studentId: string): Promise<boolean> {
  try {
    const hasIt = await hasAchievement(studentId, "first_steps");
    if (hasIt) return false;

    const student = await getStudentById(studentId);
    if (!student) return false;

    if (student.totalConversations >= 1) {
      return await unlockAchievement(studentId, "first_steps");
    }

    return false;
  } catch (error) {
    console.error(`Error checking first steps for ${studentId}:`, error);
    return false;
  }
}

export async function checkThreeDayStreak(studentId: string): Promise<boolean> {
  try {
    const hasIt = await hasAchievement(studentId, "three_day_streak");
    if (hasIt) return false;

    const student = await getStudentById(studentId);
    if (!student) return false;

    const loginCurrent =
      student.streaks.login?.current || student.streaks.current || 0;
    const practiceCurrent = student.streaks.practice?.current || 0;
    const maxStreak = Math.max(loginCurrent, practiceCurrent);

    if (maxStreak >= 3) {
      return await unlockAchievement(studentId, "three_day_streak");
    }

    return false;
  } catch (error) {
    console.error(`Error checking three day streak for ${studentId}:`, error);
    return false;
  }
}

export async function checkTopicMaster(studentId: string): Promise<boolean> {
  try {
    const hasIt = await hasAchievement(studentId, "topic_master");
    if (hasIt) return false;

    const student = await getStudentById(studentId);
    if (!student) return false;

    const hasMasteredTopic = student.goals.some((goal) =>
      goal.topics.some((topic) => topic.progress >= 90)
    );

    if (hasMasteredTopic) {
      return await unlockAchievement(studentId, "topic_master");
    }

    return false;
  } catch (error) {
    console.error(`Error checking topic master for ${studentId}:`, error);
    return false;
  }
}

export async function checkCuriousMind(studentId: string): Promise<boolean> {
  try {
    const hasIt = await hasAchievement(studentId, "curious_mind");
    if (hasIt) return false;

    const student = await getStudentById(studentId);
    if (!student) return false;

    if (student.questionsAsked >= 10) {
      return await unlockAchievement(studentId, "curious_mind");
    }

    return false;
  } catch (error) {
    console.error(`Error checking curious mind for ${studentId}:`, error);
    return false;
  }
}

export async function checkSocialButterfly(
  studentId: string
): Promise<boolean> {
  try {
    const hasIt = await hasAchievement(studentId, "social_butterfly");
    if (hasIt) return false;

    const student = await getStudentById(studentId);
    if (!student) return false;

    if (
      student.friendConnections.length > 0 &&
      student.messagesSentToday >= 5
    ) {
      return await unlockAchievement(studentId, "social_butterfly");
    }

    return false;
  } catch (error) {
    console.error(`Error checking social butterfly for ${studentId}:`, error);
    return false;
  }
}

export async function checkStreakBreaker(studentId: string): Promise<boolean> {
  try {
    const hasIt = await hasAchievement(studentId, "streak_breaker");
    if (hasIt) return false;

    const student = await getStudentById(studentId);
    if (!student) return false;

    const loginCurrent =
      student.streaks.login?.current || student.streaks.current || 0;
    const practiceCurrent = student.streaks.practice?.current || 0;
    const maxCurrent = Math.max(loginCurrent, practiceCurrent);

    const loginLongest =
      student.streaks.login?.longest || student.streaks.longest || 0;
    const practiceLongest = student.streaks.practice?.longest || 0;
    const maxLongest = Math.max(loginLongest, practiceLongest);

    if (maxCurrent > maxLongest) {
      return await unlockAchievement(studentId, "streak_breaker");
    }

    return false;
  } catch (error) {
    console.error(`Error checking streak breaker for ${studentId}:`, error);
    return false;
  }
}

export async function checkAllAchievements(
  studentId: string
): Promise<AchievementId[]> {
  try {
    const newlyUnlocked: AchievementId[] = [];

    const checks = [
      { fn: checkFirstSteps, id: "first_steps" as AchievementId },
      { fn: checkThreeDayStreak, id: "three_day_streak" as AchievementId },
      { fn: checkTopicMaster, id: "topic_master" as AchievementId },
      { fn: checkCuriousMind, id: "curious_mind" as AchievementId },
      { fn: checkSocialButterfly, id: "social_butterfly" as AchievementId },
      { fn: checkStreakBreaker, id: "streak_breaker" as AchievementId },
    ];

    for (const check of checks) {
      const unlocked = await check.fn(studentId);
      if (unlocked) {
        newlyUnlocked.push(check.id);
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error(`Error checking all achievements for ${studentId}:`, error);
    return [];
  }
}

export interface AchievementProgress {
  totalAchievements: number;
  unlockedCount: number;
  percentage: number;
  totalPoints: number;
  nextToUnlock?: Achievement;
}

export async function getAchievementProgress(
  studentOrId: string | Student
): Promise<AchievementProgress> {
  try {
    const student =
      typeof studentOrId === "string"
        ? await getStudentById(studentOrId)
        : studentOrId;
    if (!student) {
      return {
        totalAchievements: 6,
        unlockedCount: 0,
        percentage: 0,
        totalPoints: 0,
      };
    }

    const totalAchievements = Object.keys(ACHIEVEMENT_DEFINITIONS).length;
    const unlockedCount = student.achievements.length;
    const percentage = Math.round((unlockedCount / totalAchievements) * 100);
    const totalPoints = student.totalPoints || 0;

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
  } catch (error) {
    const id = typeof studentOrId === "string" ? studentOrId : studentOrId.id;
    console.error(`Error getting achievement progress for ${id}:`, error);
    return {
      totalAchievements: 6,
      unlockedCount: 0,
      percentage: 0,
      totalPoints: 0,
    };
  }
}

export async function getAchievementPoints(
  studentOrId: string | Student
): Promise<number> {
  try {
    const student =
      typeof studentOrId === "string"
        ? await getStudentById(studentOrId)
        : studentOrId;
    if (!student) return 0;

    return student.totalPoints || 0;
  } catch (error) {
    const studentId =
      typeof studentOrId === "string" ? studentOrId : studentOrId.id;
    console.error(`Error getting achievement points for ${studentId}:`, error);
    return 0;
  }
}

export async function getAchievementsByRarity(
  studentId: string,
  rarity: BadgeRarity
): Promise<Achievement[]> {
  try {
    const allAchievements = await getAllAchievementsWithStatus(studentId);

    return allAchievements
      .filter(
        (achievement) =>
          "rarity" in achievement && achievement.rarity === rarity
      )
      .map(({ unlocked, ...achievement }) => achievement);
  } catch (error) {
    console.error(
      `Error getting achievements by rarity for ${studentId}:`,
      error
    );
    return [];
  }
}

export function sortAchievementsByRarity(
  achievements: Achievement[]
): Achievement[] {
  return [...achievements].sort((a, b) => {
    const rarityA = "rarity" in a ? a.rarity : "common";
    const rarityB = "rarity" in b ? b.rarity : "common";
    return RARITY_ORDER[rarityA] - RARITY_ORDER[rarityB];
  });
}

export async function getAchievementsGroupedByRarity(
  studentId: string
): Promise<Record<BadgeRarity, Achievement[]>> {
  try {
    const allAchievements = await getAllAchievementsWithStatus(studentId);

    const grouped: Record<BadgeRarity, Achievement[]> = {
      common: [],
      uncommon: [],
      rare: [],
      legendary: [],
    };

    allAchievements.forEach((achievement) => {
      const rarity = "rarity" in achievement ? achievement.rarity : "common";
      grouped[rarity].push(achievement as Achievement);
    });

    return grouped;
  } catch (error) {
    console.error(
      `Error grouping achievements by rarity for ${studentId}:`,
      error
    );
    return {
      common: [],
      uncommon: [],
      rare: [],
      legendary: [],
    };
  }
}
