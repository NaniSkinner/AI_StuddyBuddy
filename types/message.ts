export interface Message {
  speaker: "student" | "tutor" | "ai";
  message: string;
  timestamp: string;
}
