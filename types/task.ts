export type TaskType = "multiple_choice" | "open_ended" | "real_world";
export type TaskStatus = "incomplete" | "complete" | "skipped";
export type TaskDifficulty = "easy" | "medium" | "hard";

/**
 * Base task content (generic)
 */
export interface TaskContent {
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string;
  hints: string[];
}

/**
 * Multiple Choice Task (Detailed)
 */
export interface MultipleChoiceTask {
  id: string;
  studentId: string;
  type: "multiple_choice";
  subject: string;
  topic: string;
  difficulty: TaskDifficulty;

  // Content
  question: string;
  options: [string, string, string, string]; // Exactly 4 options
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string; // Why the answer is correct
  hints: [string, string, string]; // Progressive hints (3 levels)

  // Metadata
  points: number; // 5 for easy, 10 for medium, 15 for hard
  estimatedTime: number; // In minutes
  status: TaskStatus;
  attempts: number;
  completedAt?: string;
  createdAt: string;
  dueDate?: string;
}

/**
 * Open-Ended Task (Detailed)
 */
export interface OpenEndedTask {
  id: string;
  studentId: string;
  type: "open_ended";
  subject: string;
  topic: string;
  difficulty: TaskDifficulty;

  // Content
  question: string;
  rubric: {
    keyPoints: string[]; // 3-5 key points to look for
    minLength: number; // Minimum word count
    maxLength?: number; // Optional maximum word count
  };
  sampleAnswer?: string; // Optional example answer
  hints: [string, string, string]; // Progressive hints

  // Metadata
  points: number; // 10 for easy, 15 for medium, 20 for hard
  estimatedTime: number; // In minutes
  status: TaskStatus;
  attempts: number;
  completedAt?: string;
  createdAt: string;
  dueDate?: string;
}

/**
 * Real-World Task (Detailed)
 */
export interface RealWorldTask {
  id: string;
  studentId: string;
  type: "real_world";
  subject: string;
  topic: string;
  difficulty: TaskDifficulty;

  // Content
  activity: string; // Short title
  instructions: string[]; // Step-by-step instructions (3-5 steps)
  verificationQuestions: string[]; // Questions to verify completion (3 questions)
  reflectionPrompt: string; // Reflection question
  materials?: string[]; // Optional list of materials needed
  safetyNotes?: string[]; // Optional safety guidelines

  // Metadata
  points: number; // 15 for easy, 20 for medium, 25 for hard
  estimatedTime: number; // In minutes
  status: TaskStatus;
  attempts: number;
  completedAt?: string;
  createdAt: string;
  dueDate?: string;
}

/**
 * Task Grading Result
 */
export interface TaskGrading {
  score: number; // 0-100
  isCorrect: boolean;
  feedback: string;
  keyPointsFound?: string[]; // For open-ended tasks
  suggestions: string[];
  hintsUsed?: number; // Track how many hints were used
}

/**
 * Generic Task (Base interface - backward compatible)
 */
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

/**
 * Union type for all task types
 */
export type AnyTask = Task | MultipleChoiceTask | OpenEndedTask | RealWorldTask;
