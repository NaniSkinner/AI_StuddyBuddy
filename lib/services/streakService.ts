import { Student } from "@/types";
import {
  getStreakDates,
  isDateToday,
  isDateYesterday,
} from "@/lib/utils/dateUtils";

// Dynamic import for server-side only functions
async function getStudentById(id: string) {
  const { getStudentById: getStudent } = await import("./studentService");
  return getStudent(id);
}

async function saveStudentData(student: Student) {
  const { saveStudentData: saveStudent } = await import("./studentService");
  return saveStudent(student);
}

/**
 * Calculate current streak for a student (login streak)
 */
export async function calculateCurrentStreak(
  studentId: string
): Promise<number> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return 0;

    // Support both new and legacy structure
    return student.streaks.login?.current || student.streaks.current || 0;
  } catch (error) {
    console.error(`Error calculating streak for ${studentId}:`, error);
    return 0;
  }
}

/**
 * Update login streak
 */
export async function updateLoginStreak(
  studentId: string
): Promise<Student | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    const now = new Date().toISOString();
    const lastDate =
      student.streaks.login?.lastDate || student.streaks.lastActiveDate;

    // Check if already logged in today
    if (lastDate && isDateToday(lastDate)) {
      return student; // Already counted for today
    }

    // Initialize if needed
    if (!student.streaks.login) {
      student.streaks.login = {
        current: 0,
        longest: 0,
        lastDate: now,
      };
    }

    // Check if yesterday (streak continues)
    if (lastDate && isDateYesterday(lastDate)) {
      student.streaks.login.current += 1;

      // Update longest streak if needed
      if (student.streaks.login.current > student.streaks.login.longest) {
        student.streaks.login.longest = student.streaks.login.current;

        // Check for Streak Breaker achievement
        if (!student.achievements.includes("streak_breaker")) {
          student.achievements.push("streak_breaker");
        }
      }

      // Check for 3-day streak achievement
      if (
        student.streaks.login.current >= 3 &&
        !student.achievements.includes("three_day_streak")
      ) {
        student.achievements.push("three_day_streak");
      }
    } else {
      // Streak broken, reset to 1
      student.streaks.login.current = 1;
    }

    student.streaks.login.lastDate = now;

    // Update legacy fields for backwards compatibility
    student.streaks.current = student.streaks.login.current;
    student.streaks.longest = Math.max(
      student.streaks.login.longest,
      student.streaks.practice?.longest || 0
    );
    student.streaks.lastActiveDate = now;

    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error updating login streak for ${studentId}:`, error);
    return null;
  }
}

/**
 * Update practice streak (on task completion)
 */
export async function updatePracticeStreak(
  studentId: string
): Promise<Student | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    const now = new Date().toISOString();
    const lastDate = student.streaks.practice?.lastDate;

    // Check if already practiced today
    if (lastDate && isDateToday(lastDate)) {
      return student; // Already counted for today
    }

    // Initialize if needed
    if (!student.streaks.practice) {
      student.streaks.practice = {
        current: 0,
        longest: 0,
        lastDate: now,
      };
    }

    // Check if yesterday (streak continues)
    if (lastDate && isDateYesterday(lastDate)) {
      student.streaks.practice.current += 1;

      // Update longest streak if needed
      if (student.streaks.practice.current > student.streaks.practice.longest) {
        student.streaks.practice.longest = student.streaks.practice.current;
      }

      // Check for 3-day streak achievement (practice-based)
      if (
        student.streaks.practice.current >= 3 &&
        !student.achievements.includes("three_day_streak")
      ) {
        student.achievements.push("three_day_streak");
      }
    } else {
      // Streak broken, reset to 1
      student.streaks.practice.current = 1;
    }

    student.streaks.practice.lastDate = now;

    // Update legacy longest field
    student.streaks.longest = Math.max(
      student.streaks.login?.longest || 0,
      student.streaks.practice.longest
    );

    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error updating practice streak for ${studentId}:`, error);
    return null;
  }
}

/**
 * Update streak (legacy function - now updates login streak)
 */
export async function updateStreak(studentId: string): Promise<Student | null> {
  return updateLoginStreak(studentId);
}

/**
 * Check if streak is broken
 */
export async function checkStreakBreak(studentId: string): Promise<boolean> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return true;

    const lastActive =
      student.streaks.login?.lastDate || student.streaks.lastActiveDate || "";

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

    // Return the longest of both streak types
    const loginLongest = student.streaks.login?.longest || 0;
    const practiceLongest = student.streaks.practice?.longest || 0;
    const legacyLongest = student.streaks.longest || 0;

    return Math.max(loginLongest, practiceLongest, legacyLongest);
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
export async function getStreakType(
  studentId: string
): Promise<"login" | "practice"> {
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
 * Get streak status for display (dual tracking)
 */
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

export async function getStreakStatus(
  studentOrId: string | Student
): Promise<StreakStatus> {
  try {
    const student =
      typeof studentOrId === "string"
        ? await getStudentById(studentOrId)
        : studentOrId;

    if (!student) {
      return {
        login: { current: 0, longest: 0, isActive: false },
        practice: { current: 0, longest: 0, isActive: false },
        best: { current: 0, type: "login" },
        message: "No streak data available",
      };
    }

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
    if (bestCurrent === 0) {
      message = "Start your streak today!";
    } else if (loginIsActive || practiceIsActive) {
      message = `🔥 ${bestCurrent} day streak!`;
      const longestEver = Math.max(loginLongest, practiceLongest);
      if (bestCurrent === longestEver) {
        message += " (Personal best!)";
      }
    } else {
      const longestEver = Math.max(loginLongest, practiceLongest);
      message = `Your ${longestEver}-day streak ended. Start a new one!`;
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
  } catch (error) {
    const id = typeof studentOrId === "string" ? studentOrId : studentOrId.id;
    console.error(`Error getting streak status for ${id}:`, error);
    return {
      login: { current: 0, longest: 0, isActive: false },
      practice: { current: 0, longest: 0, isActive: false },
      best: { current: 0, type: "login" },
      message: "Error loading streak data",
    };
  }
}

/**
 * Get streak milestone celebrations
 */
export interface MilestoneCelebration {
  milestone: number;
  message: string;
  confetti: boolean;
  achievement?: string;
}

export const MILESTONE_CELEBRATIONS: Record<number, MilestoneCelebration> = {
  3: {
    milestone: 3,
    message: "🔥 3-Day Streak!",
    confetti: true,
    achievement: "three_day_streak",
  },
  7: {
    milestone: 7,
    message: "🎉 One Week!",
    confetti: true,
  },
  14: {
    milestone: 14,
    message: "⭐ Two Weeks Strong!",
    confetti: true,
  },
  30: {
    milestone: 30,
    message: "🏆 30-Day Legend!",
    confetti: true,
  },
};

/**
 * Check if a streak hit a milestone today
 */
export function checkStreakMilestone(
  currentStreak: number
): MilestoneCelebration | null {
  return MILESTONE_CELEBRATIONS[currentStreak] || null;
}
