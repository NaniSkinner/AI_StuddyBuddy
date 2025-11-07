import { Task, TaskType, TaskStatus, TaskContent } from "@/types";
import { promises as fs } from "fs";
import path from "path";

// For Phase 1, tasks will be stored in memory
// Phase 2 will persist to database
const tasksCache = new Map<string, Task[]>();

/**
 * Create a new task
 */
export async function createTask(task: Task): Promise<Task> {
  try {
    const studentTasks = tasksCache.get(task.studentId) || [];
    studentTasks.push(task);
    tasksCache.set(task.studentId, studentTasks);
    return task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

/**
 * Get all tasks for a student
 */
export async function getTasksByStudent(studentId: string): Promise<Task[]> {
  try {
    return tasksCache.get(studentId) || [];
  } catch (error) {
    console.error(`Error getting tasks for ${studentId}:`, error);
    return [];
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<Task | null> {
  try {
    for (const [studentId, tasks] of tasksCache.entries()) {
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].status = status;
        if (status === "complete") {
          tasks[taskIndex].completedAt = new Date().toISOString();
        }
        tasksCache.set(studentId, tasks);
        return tasks[taskIndex];
      }
    }
    return null;
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    return null;
  }
}

/**
 * Generate adaptive tasks based on student progress
 * This is a placeholder - Phase 5 will implement AI-powered generation
 */
export async function generateAdaptiveTasks(
  studentId: string,
  subject: string,
  count: number = 3
): Promise<Task[]> {
  try {
    // For Phase 1, return empty array
    // Phase 5 will implement full AI-powered task generation
    const tasks: Task[] = [];

    for (let i = 0; i < count; i++) {
      const taskId = `task-${studentId}-${Date.now()}-${i}`;
      const taskType: TaskType = ["multiple_choice", "open_ended", "real_world"][
        i % 3
      ] as TaskType;

      const task: Task = {
        id: taskId,
        studentId,
        type: taskType,
        subject,
        topic: "Practice",
        content: {
          question: `Sample ${taskType} question for ${subject}`,
          hints: ["Think about what you learned", "Review your notes"],
        },
        status: "incomplete",
        attempts: 0,
        createdAt: new Date().toISOString(),
      };

      tasks.push(task);
      await createTask(task);
    }

    return tasks;
  } catch (error) {
    console.error(`Error generating tasks for ${studentId}:`, error);
    return [];
  }
}

/**
 * Get incomplete tasks for a student
 */
export async function getIncompleteTasks(studentId: string): Promise<Task[]> {
  try {
    const tasks = await getTasksByStudent(studentId);
    return tasks.filter((t) => t.status === "incomplete");
  } catch (error) {
    console.error(`Error getting incomplete tasks for ${studentId}:`, error);
    return [];
  }
}

/**
 * Record a task attempt
 */
export async function recordTaskAttempt(
  taskId: string,
  correct: boolean
): Promise<Task | null> {
  try {
    for (const [studentId, tasks] of tasksCache.entries()) {
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].attempts += 1;

        // If correct, mark as complete
        if (correct) {
          tasks[taskIndex].status = "complete";
          tasks[taskIndex].completedAt = new Date().toISOString();
        }

        tasksCache.set(studentId, tasks);
        return tasks[taskIndex];
      }
    }
    return null;
  } catch (error) {
    console.error(`Error recording attempt for task ${taskId}:`, error);
    return null;
  }
}

/**
 * Calculate task difficulty for adaptive learning
 * Returns difficulty level based on student performance
 */
export async function calculateTaskDifficulty(
  studentId: string,
  topic: string
): Promise<"easy" | "medium" | "hard"> {
  try {
    const tasks = await getTasksByStudent(studentId);
    const topicTasks = tasks.filter(
      (t) => t.topic === topic && t.status === "complete"
    );

    if (topicTasks.length === 0) return "easy";

    // Calculate success rate
    const totalAttempts = topicTasks.reduce((sum, t) => sum + t.attempts, 0);
    const successfulTasks = topicTasks.length;
    const successRate = totalAttempts > 0 ? successfulTasks / totalAttempts : 0;

    if (successRate > 0.8) return "hard";
    if (successRate > 0.5) return "medium";
    return "easy";
  } catch (error) {
    console.error(
      `Error calculating difficulty for ${studentId}, topic: ${topic}:`,
      error
    );
    return "medium";
  }
}

/**
 * Get task completion rate for a student
 */
export async function getTaskCompletionRate(studentId: string): Promise<number> {
  try {
    const tasks = await getTasksByStudent(studentId);
    if (tasks.length === 0) return 0;

    const completed = tasks.filter((t) => t.status === "complete").length;
    return Math.round((completed / tasks.length) * 100);
  } catch (error) {
    console.error(`Error calculating completion rate for ${studentId}:`, error);
    return 0;
  }
}

/**
 * Get task by ID
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
  try {
    for (const tasks of tasksCache.values()) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return null;
  } catch (error) {
    console.error(`Error getting task ${taskId}:`, error);
    return null;
  }
}

