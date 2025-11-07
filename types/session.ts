import { Message } from "./message";

export interface TopicCovered {
  topic: string;
  subConcepts: string[];
  strugglingPoints: string[];
  masteryLevel: number; // 0-100
}

export interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  date: string; // ISO datetime
  duration: number; // minutes

  transcript: Message[];
  topicsCovered: TopicCovered[];
  tutorNotes: string;

  // Metadata
  studentEngagement: "high" | "medium" | "low";
  strugglingConcepts: string[];
}
