export interface FriendRequest {
  id: string;
  fromStudentId: string;
  toStudentId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  respondedAt?: string;
  sender?: any; // Enriched from API - Student object
  recipient?: any; // Enriched from API - Student object
}

export type FriendMessageType =
  | "achievement_share"
  | "tutor_recommendation"
  | "study_note";

export interface FriendMessage {
  id: string;
  fromStudentId: string;
  toStudentId: string;
  type: FriendMessageType;
  timestamp: string;
  read: boolean;

  // Type-specific data
  achievementId?: string; // For achievement shares
  achievementName?: string;
  tutorId?: string; // For tutor recommendations
  tutorName?: string;
  tutorSpecialty?: string;
  noteTitle?: string; // For study notes
  noteContent?: string;
  noteSubject?: string;
}

export interface FriendConnection {
  studentId: string;
  friendId: string;
  connectedAt: string;
  messagesSentToday: number;
  messagesReceivedToday: number;
  lastMessageAt?: string;
}

export interface DailyMessageLimit {
  studentId: string;
  date: string; // YYYY-MM-DD format
  messagesSent: number;
  limit: number; // default 3
}
