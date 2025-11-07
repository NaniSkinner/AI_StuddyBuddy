import { Goal } from "./goal";
import { AchievementId } from "./achievement";

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
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  achievements: AchievementId[];
  churnRisk: boolean;

  // Preferences
  preferences: {
    aiColor: string;
    notificationEnabled: boolean;
    reminderTime?: string;
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
}
