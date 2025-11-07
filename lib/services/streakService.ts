import { Student } from "@/types";
import { getStudentById, saveStudentData } from "./studentService";
import { getStreakDates, isDateToday, isDateYesterday } from "@/lib/utils/dateUtils";

/**
 * Calculate current streak for a student
 */
export async function calculateCurrentStreak(studentId: string): Promise<number> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return 0;

    return student.streaks.current;
  } catch (error) {
    console.error(`Error calculating streak for ${studentId}:`, error);
    return 0;
  }
}

/**
 * Update streak on login or activity
 */
export async function updateStreak(studentId: string): Promise<Student | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    const lastActive = student.streaks.lastActiveDate;
    const now = new Date().toISOString();

    // Check if already logged in today
    if (isDateToday(lastActive)) {
      // Don't update streak, already counted for today
      return student;
    }

    // Check if yesterday (streak continues)
    if (isDateYesterday(lastActive)) {
      student.streaks.current += 1;

      // Update longest streak if needed
      if (student.streaks.current > student.streaks.longest) {
        student.streaks.longest = student.streaks.current;

        // Check for Streak Breaker achievement
        if (!student.achievements.includes("streak_breaker")) {
          student.achievements.push("streak_breaker");
        }
      }

      // Check for 3-day streak achievement
      if (
        student.streaks.current >= 3 &&
        !student.achievements.includes("three_day_streak")
      ) {
        student.achievements.push("three_day_streak");
      }
    } else {
      // Streak broken, reset to 1
      student.streaks.current = 1;
    }

    student.streaks.lastActiveDate = now;
    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error updating streak for ${studentId}:`, error);
    return null;
  }
}

/**
 * Check if streak is broken
 */
export async function checkStreakBreak(studentId: string): Promise<boolean> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return true;

    const lastActive = student.streaks.lastActiveDate;

    // If not today or yesterday, streak is broken
    return !isDateToday(lastActive) && !isDateYesterday(lastActive);
  } catch (error) {
    console.error(`Error checking streak break for ${studentId}:`, error);
    return true;
  }
}

/**
 * Get longest streak for a student
 */
export async function getLongestStreak(studentId: string): Promise<number> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return 0;

    return student.streaks.longest;
  } catch (error) {
    console.error(`Error getting longest streak for ${studentId}:`, error);
    return 0;
  }
}

/**
 * Get streak type (login vs practice)
 * For Phase 1, we're tracking login-based streaks
 * Phase 2 can add practice-based streak tracking
 */
export async function getStreakType(studentId: string): Promise<"login" | "practice"> {
  // For now, always return login-based
  // In Phase 2, this could check if student completed practice tasks
  return "login";
}

/**
 * Calculate streak from activity dates
 */
export function calculateStreakFromDates(activityDates: string[]): number {
  return getStreakDates(activityDates);
}

/**
 * Get streak status for display
 */
export interface StreakStatus {
  current: number;
  longest: number;
  isActive: boolean;
  daysUntilBreak: number;
  message: string;
}

export async function getStreakStatus(studentId: string): Promise<StreakStatus> {
  try {
    const student = await getStudentById(studentId);
    if (!student) {
      return {
        current: 0,
        longest: 0,
        isActive: false,
        daysUntilBreak: 0,
        message: "No streak data available",
      };
    }

    const lastActive = student.streaks.lastActiveDate;
    const isActive = isDateToday(lastActive) || isDateYesterday(lastActive);
    const daysUntilBreak = isDateToday(lastActive) ? 1 : 0;

    let message = "";
    if (student.streaks.current === 0) {
      message = "Start your streak today!";
    } else if (isActive) {
      message = `🔥 ${student.streaks.current} day streak!`;
      if (student.streaks.current === student.streaks.longest) {
        message += " (Personal best!)";
      }
    } else {
      message = `Your ${student.streaks.longest}-day streak ended. Start a new one!`;
    }

    return {
      current: student.streaks.current,
      longest: student.streaks.longest,
      isActive,
      daysUntilBreak,
      message,
    };
  } catch (error) {
    console.error(`Error getting streak status for ${studentId}:`, error);
    return {
      current: 0,
      longest: 0,
      isActive: false,
      daysUntilBreak: 0,
      message: "Error loading streak data",
    };
  }
}

