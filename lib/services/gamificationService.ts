import { Student, AchievementId } from "@/types";
import { getStudentById, saveStudentData } from "./studentService";
import { unlockAchievement } from "./achievementService";

/**
 * Color theme for bubble customization
 */
export interface ColorTheme {
  id: string;
  name: string;
  colors: {
    start: string;
    middle: string;
    end: string;
  };
  unlockCondition?: string;
  isLocked: boolean;
}

/**
 * Default color themes (PRD spec + extras)
 */
export const DEFAULT_THEMES: ColorTheme[] = [
  {
    id: "ocean",
    name: "Ocean Breeze",
    colors: { start: "#667eea", middle: "#764ba2", end: "#f093fb" },
    isLocked: false,
  },
  {
    id: "sunset",
    name: "Sunset Vibes",
    colors: { start: "#fa709a", middle: "#fee140", end: "#30cfd0" },
    isLocked: false,
  },
  {
    id: "forest",
    name: "Forest Green",
    colors: { start: "#56ab2f", middle: "#a8e063", end: "#96e6a1" },
    isLocked: false,
  },
  {
    id: "fire",
    name: "Fire Flame",
    colors: { start: "#f12711", middle: "#f5af19", end: "#fdc830" },
    unlockCondition: "Complete 10 sessions",
    isLocked: true,
  },
  {
    id: "cosmic",
    name: "Cosmic Purple",
    colors: { start: "#4a00e0", middle: "#8e2de2", end: "#da22ff" },
    unlockCondition: "Reach 7-day streak",
    isLocked: true,
  },
  {
    id: "gold",
    name: "Golden Star",
    colors: { start: "#f2994a", middle: "#f2c94c", end: "#ffeaa7" },
    unlockCondition: "Earn 5 achievements",
    isLocked: true,
  },
];

/**
 * Get available themes for a student
 */
export async function getAvailableThemes(
  studentId: string
): Promise<ColorTheme[]> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return DEFAULT_THEMES;

    return DEFAULT_THEMES.map((theme) => {
      if (!theme.unlockCondition) {
        return { ...theme, isLocked: false };
      }

      // Check unlock conditions
      const isUnlocked = checkThemeUnlock(theme, student);
      return { ...theme, isLocked: !isUnlocked };
    });
  } catch (error) {
    console.error(`Error getting themes for ${studentId}:`, error);
    return DEFAULT_THEMES;
  }
}

/**
 * Check if theme should be unlocked
 */
function checkThemeUnlock(theme: ColorTheme, student: Student): boolean {
  const condition = theme.unlockCondition?.toLowerCase() || "";

  // "Complete 10 sessions"
  if (condition.includes("10 sessions")) {
    return student.sessions.length >= 10;
  }

  // "Reach 7-day streak"
  if (condition.includes("7-day streak")) {
    return student.streaks.longest >= 7;
  }

  // "Earn 5 achievements"
  if (condition.includes("5 achievements")) {
    return student.achievements.length >= 5;
  }

  return false;
}

/**
 * Update student's selected color theme
 */
export async function updateColorTheme(
  studentId: string,
  themeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const student = await getStudentById(studentId);
    if (!student) {
      return { success: false, error: "Student not found" };
    }

    const themes = await getAvailableThemes(studentId);
    const selectedTheme = themes.find((t) => t.id === themeId);

    if (!selectedTheme) {
      return { success: false, error: "Theme not found" };
    }

    if (selectedTheme.isLocked) {
      return {
        success: false,
        error: `Theme locked: ${selectedTheme.unlockCondition}`,
      };
    }

    // Update student preferences
    const updatedStudent = {
      ...student,
      preferences: {
        ...student.preferences,
        aiColor: `${selectedTheme.colors.start}-${selectedTheme.colors.end}`,
      },
    };

    await saveStudentData(updatedStudent);
    return { success: true };
  } catch (error) {
    console.error(`Error updating theme for ${studentId}:`, error);
    return { success: false, error: "Failed to update theme" };
  }
}

/**
 * Friend connection request
 */
export interface FriendRequest {
  id: string;
  fromStudentId: string;
  toStudentId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
}

/**
 * Mock friend requests storage (in-memory for now)
 */
const friendRequests: Map<string, FriendRequest[]> = new Map();

/**
 * Send friend request
 */
export async function sendFriendRequest(
  fromStudentId: string,
  toStudentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const fromStudent = await getStudentById(fromStudentId);
    const toStudent = await getStudentById(toStudentId);

    if (!fromStudent || !toStudent) {
      return { success: false, error: "Student not found" };
    }

    // Check if already friends
    if (fromStudent.friendConnections.includes(toStudentId)) {
      return { success: false, error: "Already friends" };
    }

    // Create friend request
    const request: FriendRequest = {
      id: `fr-${Date.now()}`,
      fromStudentId,
      toStudentId,
      status: "pending",
      createdAt: new Date(),
    };

    // Store request
    const existing = friendRequests.get(toStudentId) || [];
    friendRequests.set(toStudentId, [...existing, request]);

    return { success: true };
  } catch (error) {
    console.error(`Error sending friend request:`, error);
    return { success: false, error: "Failed to send request" };
  }
}

/**
 * Accept friend request
 */
export async function acceptFriendRequest(
  requestId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const requests = friendRequests.get(studentId) || [];
    const request = requests.find((r) => r.id === requestId);

    if (!request) {
      return { success: false, error: "Request not found" };
    }

    // Update request status
    request.status = "accepted";

    // Add to each other's friend lists
    const student = await getStudentById(studentId);
    const friend = await getStudentById(request.fromStudentId);

    if (!student || !friend) {
      return { success: false, error: "Student not found" };
    }

    const updatedStudent = {
      ...student,
      friendConnections: [...student.friendConnections, request.fromStudentId],
    };

    const updatedFriend = {
      ...friend,
      friendConnections: [...friend.friendConnections, studentId],
    };

    await saveStudentData(updatedStudent);
    await saveStudentData(updatedFriend);

    // Unlock achievement for making a friend connection
    await unlockAchievement(studentId, "social_butterfly");
    await unlockAchievement(request.fromStudentId, "social_butterfly");

    return { success: true };
  } catch (error) {
    console.error(`Error accepting friend request:`, error);
    return { success: false, error: "Failed to accept request" };
  }
}

/**
 * Get friend activity feed
 */
export interface FriendActivity {
  friendId: string;
  friendName: string;
  activity: string;
  timestamp: Date;
  type: "session" | "achievement" | "streak";
}

export async function getFriendActivity(
  studentId: string
): Promise<FriendActivity[]> {
  try {
    const student = await getStudentById(studentId);
    if (!student || student.friendConnections.length === 0) {
      return [];
    }

    const activities: FriendActivity[] = [];

    for (const friendId of student.friendConnections.slice(0, 3)) {
      const friend = await getStudentById(friendId);
      if (!friend) continue;

      // Recent achievements (achievements are just IDs, so we'll show them simply)
      if (friend.achievements.length > 0) {
        // Show last achievement
        const lastAchievementId =
          friend.achievements[friend.achievements.length - 1];
        activities.push({
          friendId,
          friendName: friend.name,
          activity: `Earned a new achievement!`,
          timestamp: new Date(), // Would need achievement timestamp in real implementation
          type: "achievement",
        });
      }

      // Current streaks
      if (friend.streaks.current >= 3) {
        activities.push({
          friendId,
          friendName: friend.name,
          activity: `On a ${friend.streaks.current}-day streak!`,
          timestamp: new Date(friend.streaks.lastActiveDate),
          type: "streak",
        });
      }

      // Recent sessions
      if (friend.sessions.length > 0) {
        const recentSessionId = friend.sessions[friend.sessions.length - 1];
        // Would need to fetch actual session data for more details
        const daysSinceLastActive =
          (Date.now() - new Date(friend.lastLoginAt).getTime()) /
          (1000 * 60 * 60 * 24);
        if (daysSinceLastActive <= 1) {
          activities.push({
            friendId,
            friendName: friend.name,
            activity: `Recently studied`,
            timestamp: new Date(friend.lastLoginAt),
            type: "session",
          });
        }
      }
    }

    // Sort by timestamp (most recent first)
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  } catch (error) {
    console.error(`Error getting friend activity for ${studentId}:`, error);
    return [];
  }
}

/**
 * Animation presets for chat bubbles
 */
export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  animationClass: string;
  isLocked: boolean;
  unlockCondition?: string;
}

export const ANIMATION_PRESETS: AnimationPreset[] = [
  {
    id: "float",
    name: "Gentle Float",
    description: "Smooth floating animation",
    animationClass: "animate-float",
    isLocked: false,
  },
  {
    id: "pulse",
    name: "Pulse",
    description: "Subtle pulsing effect",
    animationClass: "animate-pulse-slow",
    isLocked: false,
  },
  {
    id: "bounce",
    name: "Bounce",
    description: "Playful bouncing",
    animationClass: "animate-bounce-gentle",
    isLocked: true,
    unlockCondition: "Complete 5 sessions",
  },
  {
    id: "glow",
    name: "Glow",
    description: "Glowing aura effect",
    animationClass: "animate-glow",
    isLocked: true,
    unlockCondition: "Reach 3-day streak",
  },
];

/**
 * Get available animations for student
 */
export async function getAvailableAnimations(
  studentId: string
): Promise<AnimationPreset[]> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return ANIMATION_PRESETS;

    return ANIMATION_PRESETS.map((preset) => {
      if (!preset.unlockCondition) {
        return { ...preset, isLocked: false };
      }

      // Check unlock conditions
      const condition = preset.unlockCondition.toLowerCase();
      let isUnlocked = false;

      if (condition.includes("5 sessions")) {
        isUnlocked = student.sessions.length >= 5;
      }
      if (condition.includes("3-day streak")) {
        isUnlocked = student.streaks.longest >= 3;
      }

      return { ...preset, isLocked: !isUnlocked };
    });
  } catch (error) {
    console.error(`Error getting animations for ${studentId}:`, error);
    return ANIMATION_PRESETS;
  }
}
