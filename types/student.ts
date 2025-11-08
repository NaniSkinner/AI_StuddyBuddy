import { Goal } from "./goal";
import { AchievementId } from "./achievement";

/**
 * Nudge interaction tracking
 */
export interface NudgeInteraction {
  id: string;
  type: string;
  shownAt: string;
  action: "accepted" | "dismissed" | "expired";
  actionAt?: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: number;
  email?: string; // For Phase 2

  // Learning Profile
  goals: Goal[]; // Max 4
  sessions: string[]; // Session IDs
  taskHistory: string[]; // Task IDs

  // Engagement Metrics
  streaks: {
    login: {
      current: number;
      longest: number;
      lastDate: string;
    };
    practice: {
      current: number;
      longest: number;
      lastDate: string;
    };
    // Legacy field for backwards compatibility
    current?: number;
    longest?: number;
    lastActiveDate?: string;
  };
  achievements: AchievementId[];
  totalPoints: number;
  churnRisk: boolean;

  // Preferences
  preferences: {
    aiColor: string;
    notificationEnabled: boolean;
    reminderTime?: string;
    hasCompletedOnboarding?: boolean;
  };

  // Social
  friendConnections: string[]; // Student IDs
  messagesSentToday: number;

  // Stats
  questionsAsked: number;
  totalConversations: number;

  // Metadata
  createdAt: string;
  lastLoginAt: string;
  metadata?: {
    lastNudgeShown?: string;
    lastNudgeId?: string;
    nudgeHistory?: NudgeInteraction[];
  };
}
