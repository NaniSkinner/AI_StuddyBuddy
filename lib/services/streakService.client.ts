/**
 * Client-safe streak service functions
 * These functions work with Student objects directly and don't access the file system
 */

import { Student } from "@/types";
import {
  getStreakDates,
  isDateToday,
  isDateYesterday,
} from "@/lib/utils/dateUtils";

export interface StreakStatus {
  login: {
    current: number;
    longest: number;
    isActive: boolean;
  };
  practice: {
    current: number;
    longest: number;
    isActive: boolean;
  };
  best: {
    current: number;
    type: "login" | "practice";
  };
  message: string;
}

/**
 * Get detailed streak status for a student
 * CLIENT-SAFE: Works with Student object directly
 */
export async function getStreakStatus(student: Student): Promise<StreakStatus> {
  // Login streak status
  const loginLastDate =
    student.streaks.login?.lastDate || student.streaks.lastActiveDate;
  const loginIsActive = loginLastDate
    ? isDateToday(loginLastDate) || isDateYesterday(loginLastDate)
    : false;
  const loginCurrent =
    student.streaks.login?.current || student.streaks.current || 0;
  const loginLongest =
    student.streaks.login?.longest || student.streaks.longest || 0;

  // Practice streak status
  const practiceLastDate = student.streaks.practice?.lastDate;
  const practiceIsActive = practiceLastDate
    ? isDateToday(practiceLastDate) || isDateYesterday(practiceLastDate)
    : false;
  const practiceCurrent = student.streaks.practice?.current || 0;
  const practiceLongest = student.streaks.practice?.longest || 0;

  // Determine best streak
  const bestCurrent = Math.max(loginCurrent, practiceCurrent);
  const bestType: "login" | "practice" =
    loginCurrent >= practiceCurrent ? "login" : "practice";

  // Generate message
  let message = "";
  if (loginCurrent === 0 && practiceCurrent === 0) {
    message = "Start your learning journey today!";
  } else if (loginIsActive || practiceIsActive) {
    message = `🔥 ${bestCurrent} day streak! Keep it up!`;
  } else {
    message = "Your streak ended. Start a new one today!";
  }

  return {
    login: {
      current: loginCurrent,
      longest: loginLongest,
      isActive: loginIsActive,
    },
    practice: {
      current: practiceCurrent,
      longest: practiceLongest,
      isActive: practiceIsActive,
    },
    best: {
      current: bestCurrent,
      type: bestType,
    },
    message,
  };
}

/**
 * Get streak milestone info
 * CLIENT-SAFE: Pure function
 */
export function checkStreakMilestone(currentStreak: number): {
  isMilestone: boolean;
  milestone?: number;
  message?: string;
} {
  const milestones = [3, 7, 14, 30, 50, 100, 365];
  const milestone = milestones.find((m) => m === currentStreak);

  if (milestone) {
    const messages: Record<number, string> = {
      3: "🎉 3-day streak! You're building a habit!",
      7: "⭐ 1 week streak! Amazing consistency!",
      14: "🔥 2 weeks! You're unstoppable!",
      30: "🏆 1 month streak! Incredible dedication!",
      50: "💎 50 days! You're a learning champion!",
      100: "👑 100 days! Legendary commitment!",
      365: "🌟 1 YEAR STREAK! You're a true master!",
    };

    return {
      isMilestone: true,
      milestone,
      message: messages[milestone],
    };
  }

  return { isMilestone: false };
}
