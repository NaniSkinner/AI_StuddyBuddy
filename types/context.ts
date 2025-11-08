/**
 * Conversation Context Types
 * Defines the complete context structure for AI interactions
 */

import { Message, Session, Goal, Student } from "@/types";

/**
 * Student profile information for context
 */
export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  grade: number;
  learningStyle?: string;
}

/**
 * Progress update information
 */
export interface ProgressUpdate {
  goalId: string;
  subject: string;
  topicName: string;
  progress: number;
  timestamp: string;
}

/**
 * Complete conversation context for AI
 * This is passed to the AI with every request
 */
export interface ConversationContext {
  // Student Information
  studentProfile: StudentProfile;

  // Recent Messages (full detail)
  recentMessages: Message[]; // Last 10-15 messages

  // Older History (summarized)
  conversationSummary?: string;

  // Session History
  recentSessions: Session[]; // Last 2-3 tutoring sessions

  // Current Learning Context
  currentTopic?: string;
  strugglingConcepts: string[];
  masteredConcepts: string[];

  // Goals & Progress
  activeGoals: Goal[];
  recentProgress: ProgressUpdate[];

  // Engagement Metrics (from analysis)
  engagementLevel?: "high" | "medium" | "low";
  strugglingFlag?: boolean;
}

/**
 * Options for building conversation context
 */
export interface ContextBuildOptions {
  maxRecentMessages?: number; // Default: 15
  maxRecentSessions?: number; // Default: 3
  includeProgress?: boolean; // Default: true
  includeSummary?: boolean; // Default: true if messages > maxRecentMessages
}
