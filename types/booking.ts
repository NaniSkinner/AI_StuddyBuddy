export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface HandoffNotes {
  strugglingConcepts: string[];
  attemptsSummary: string;
  suggestedFocus: string;
}

export interface BookingRequest {
  id: string;
  studentId: string;
  tutorId: string;
  requestedTopic: string;
  reason: string;
  preferredTimes: string[];

  status: BookingStatus;
  createdAt: string;

  // AI-generated handoff notes
  handoffNotes: HandoffNotes;
}
