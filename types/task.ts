export type TaskType = "multiple_choice" | "open_ended" | "real_world";
export type TaskStatus = "incomplete" | "complete" | "skipped";

export interface TaskContent {
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string;
  hints: string[];
}

export interface Task {
  id: string;
  studentId: string;
  type: TaskType;
  subject: string;
  topic: string;

  content: TaskContent;

  status: TaskStatus;
  attempts: number;
  completedAt?: string;

  createdAt: string;
  dueDate?: string;
}
