export interface ExportFormat {
  type: "pdf" | "text" | "json";
  includeMetadata: boolean;
  includeTranscript: boolean;
  includeNotes: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ConversationExport {
  studentName: string;
  studentId: string;
  exportDate: string;
  sessionsIncluded: number;
  sessions: ExportedSession[];
}

export interface ExportedSession {
  sessionId: string;
  date: string;
  tutorName: string;
  duration: number;
  topicsCovered: string[];
  engagement: "high" | "medium" | "low";
  transcript?: TranscriptEntry[];
  tutorNotes?: string;
  strugglingConcepts?: string[];
}

export interface TranscriptEntry {
  speaker: "tutor" | "student" | "ai";
  message: string;
  timestamp: string;
}

export interface ExportOptions {
  studentId: string;
  format: "pdf" | "text" | "json";
  includeMetadata?: boolean;
  includeTranscript?: boolean;
  includeNotes?: boolean;
  sessionIds?: string[]; // Specific sessions, or all if not provided
  dateRange?: {
    start: string;
    end: string;
  };
}
