import {
  Task,
  TaskType,
  TaskStatus,
  TaskContent,
  MultipleChoiceTask,
  OpenEndedTask,
  RealWorldTask,
  TaskGrading,
  TaskDifficulty,
  AnyTask,
} from "@/types";
import { Student, Goal, Topic } from "@/types";
import { promises as fs } from "fs";
import path from "path";
import OpenAI from "openai";
import {
  getOpenEndedGradingPrompt,
  getRealWorldGradingPrompt,
} from "@/lib/prompts/taskGenerationPrompts";
import { withRetry, categorizeError } from "@/lib/utils/aiErrorHandler";
import { calculateUsage, logUsage } from "@/lib/services/usageLogService";
import {
  generateMultipleChoiceTask,
  generateOpenEndedTask,
  generateRealWorldTask,
} from "@/lib/services/taskGenerationService";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

/**
 * Grade a Multiple Choice Task
 */
export function gradeMultipleChoice(
  task: MultipleChoiceTask,
  studentAnswer: string,
  hintsUsed: number = 0
): TaskGrading {
  // Normalize answers (case-insensitive)
  const normalizedStudentAnswer = studentAnswer.trim().toUpperCase();
  const normalizedCorrectAnswer = task.correctAnswer.toUpperCase();

  const isCorrect = normalizedStudentAnswer === normalizedCorrectAnswer;
  const score = isCorrect ? 100 : 0;

  // Generate feedback
  let feedback = "";
  const suggestions: string[] = [];

  if (isCorrect) {
    feedback = `🎉 Excellent work! That's correct! ${task.explanation}`;
    if (hintsUsed === 0) {
      feedback += " And you got it without any hints - amazing!";
    }
  } else {
    feedback = `Not quite right, but great effort! The correct answer is ${task.correctAnswer}. ${task.explanation}`;

    // Offer first hint if available
    if (task.hints && task.hints.length > 0 && hintsUsed < 3) {
      suggestions.push(
        `Try again with this hint: ${task.hints[Math.min(hintsUsed, task.hints.length - 1)]}`
      );
    }

    suggestions.push("Review the concept and try similar problems.");
  }

  return {
    score,
    isCorrect,
    feedback,
    suggestions,
    hintsUsed,
  };
}

/**
 * Grade an Open-Ended Task using AI
 */
export async function gradeOpenEnded(
  task: OpenEndedTask,
  studentAnswer: string,
  age: number
): Promise<TaskGrading> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

  try {
    // Build grading prompt
    const prompt = getOpenEndedGradingPrompt(
      task.question,
      studentAnswer,
      task.rubric,
      age
    );

    // Call OpenAI with retry logic
    const completion = await withRetry(async () => {
      return await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a supportive, encouraging teacher grading student work. Be fair but encouraging.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for consistent grading
        max_tokens: 500,
        response_format: { type: "json_object" },
      });
    });

    // Calculate and log usage
    const usage = calculateUsage(
      completion,
      Date.now() - startTime,
      "ai_grading"
    );
    logUsage(usage);

    // Parse response
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Empty grading response from OpenAI");
    }

    const data = JSON.parse(content);

    // Validate and return grading
    const grading: TaskGrading = {
      score: data.score || 0,
      isCorrect: data.isCorrect || data.score >= 70,
      feedback: data.feedback || "Good effort!",
      keyPointsFound: data.keyPointsFound || [],
      suggestions: data.suggestions || [],
    };

    success = true;
    return grading;
  } catch (error: any) {
    errorCode = categorizeError(error);
    console.error("Error grading open-ended task:", error);

    // Log failed usage
    logUsage({
      operation: "ai_grading",
      model: process.env.OPENAI_MODEL || "gpt-4",
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
      timestamp: new Date().toISOString(),
      latency: Date.now() - startTime,
      success: false,
      errorCode,
    });

    // Return fallback grading
    return {
      score: 50,
      isCorrect: false,
      feedback:
        "We encountered an issue grading your answer automatically. Great effort on completing it! A tutor will review it soon.",
      suggestions: ["Keep practicing!", "Try to include more details."],
    };
  }
}

/**
 * Grade a Real-World Task using AI
 */
export async function gradeRealWorld(
  task: RealWorldTask,
  verificationResponses: string[],
  reflectionResponse: string,
  age: number
): Promise<TaskGrading> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

  try {
    // Build grading prompt
    const prompt = getRealWorldGradingPrompt(
      task.activity,
      task.verificationQuestions,
      verificationResponses,
      task.reflectionPrompt,
      reflectionResponse,
      age
    );

    // Call OpenAI with retry logic
    const completion = await withRetry(async () => {
      return await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an encouraging teacher reviewing hands-on learning activities. Celebrate effort and curiosity.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 400,
        response_format: { type: "json_object" },
      });
    });

    // Calculate and log usage
    const usage = calculateUsage(
      completion,
      Date.now() - startTime,
      "ai_grading"
    );
    logUsage(usage);

    // Parse response
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Empty grading response from OpenAI");
    }

    const data = JSON.parse(content);

    // Validate and return grading
    const grading: TaskGrading = {
      score: data.score || 0,
      isCorrect: data.isCorrect || data.score >= 70,
      feedback: data.feedback || "Great hands-on work!",
      suggestions: data.suggestions || [],
    };

    success = true;
    return grading;
  } catch (error: any) {
    errorCode = categorizeError(error);
    console.error("Error grading real-world task:", error);

    // Log failed usage
    logUsage({
      operation: "ai_grading",
      model: process.env.OPENAI_MODEL || "gpt-4",
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
      timestamp: new Date().toISOString(),
      latency: Date.now() - startTime,
      success: false,
      errorCode,
    });

    // Return fallback grading
    return {
      score: 80,
      isCorrect: true,
      feedback:
        "Awesome job completing this hands-on activity! Your curiosity and effort are fantastic!",
      suggestions: ["Try a similar activity with a different topic!"],
    };
  }
}

/**
 * Get hint for a task
 */
export function getHint(
  task: MultipleChoiceTask | OpenEndedTask,
  hintLevel: number
): string | null {
  if (!task.hints || task.hints.length === 0) return null;

  // Clamp hint level to valid range
  const level = Math.max(0, Math.min(hintLevel, task.hints.length - 1));

  return task.hints[level];
}

/**
 * Determine appropriate task difficulty based on student progress
 */
export function determineTaskDifficulty(
  student: Student,
  topic: string
): TaskDifficulty {
  // Find the topic across all goals
  let topicData: Topic | undefined;
  let goalSubject: string | undefined;

  for (const goal of student.goals) {
    const foundTopic = goal.topics.find((t) => t.name === topic);
    if (foundTopic) {
      topicData = foundTopic;
      goalSubject = goal.subject;
      break;
    }
  }

  // If topic not found, default to easy for new topics
  if (!topicData) {
    console.log(`Topic "${topic}" not found in student goals, defaulting to easy`);
    return "easy";
  }

  // Check number of attempts on this topic
  const topicTasks = (tasksCache.get(student.id) || []).filter(
    (t) => t.topic === topic && t.status === "complete"
  );

  // Safety: If fewer than 3 attempts, stick to easy
  if (topicTasks.length < 3) {
    return "easy";
  }

  // Calculate success rate
  const totalAttempts = topicTasks.reduce((sum, t) => sum + t.attempts, 0);
  const successfulTasks = topicTasks.length;
  const successRate = totalAttempts > 0 ? successfulTasks / totalAttempts : 0;

  // Use progress to determine difficulty
  const progress = topicData.progress;

  // Difficulty thresholds
  if (progress < 40) {
    return "easy";
  } else if (progress < 70) {
    // If medium progress but low success rate, keep it easy
    if (successRate < 0.5) {
      return "easy";
    }
    return "medium";
  } else {
    // If high progress but low success rate, use medium
    if (successRate < 0.6) {
      return "medium";
    }
    return "hard";
  }
}

/**
 * Select task type based on age and weighted distribution
 */
export function selectTaskType(age: number): TaskType {
  // Age-based task type distribution
  let weights: { [key in TaskType]: number };

  if (age <= 11) {
    // Ages 9-11: Prefer multiple choice, some open-ended, less real-world
    weights = {
      multiple_choice: 50,
      open_ended: 30,
      real_world: 20,
    };
  } else if (age <= 14) {
    // Ages 12-14: Balance MC and OE, some real-world
    weights = {
      multiple_choice: 40,
      open_ended: 40,
      real_world: 20,
    };
  } else {
    // Ages 15-16: Prefer open-ended, less MC, some real-world
    weights = {
      multiple_choice: 30,
      open_ended: 50,
      real_world: 20,
    };
  }

  // Weighted random selection
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const [type, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (random <= cumulative) {
      return type as TaskType;
    }
  }

  // Fallback (should never reach here)
  return "multiple_choice";
}

/**
 * Assign adaptive tasks to a student based on their goals and progress
 */
export async function assignAdaptiveTasks(
  student: Student,
  maxTasks: number = 5
): Promise<AnyTask[]> {
  try {
    const tasks: AnyTask[] = [];

    // Get active goals (not completed)
    const activeGoals = student.goals.filter((goal) => goal.progress < 100);

    if (activeGoals.length === 0) {
      console.log("No active goals for student", student.id);
      return [];
    }

    // Build list of topics that need practice
    type TopicWithContext = {
      topic: Topic;
      subject: string;
      goalId: string;
    };

    const topicsNeedingPractice: TopicWithContext[] = [];

    for (const goal of activeGoals) {
      for (const topic of goal.topics) {
        // Prioritize topics with lower progress
        if (topic.progress < 90) {
          topicsNeedingPractice.push({
            topic,
            subject: goal.subject,
            goalId: goal.id,
          });
        }
      }
    }

    // Sort by progress (lowest first) - prioritize struggling topics
    topicsNeedingPractice.sort((a, b) => a.topic.progress - b.topic.progress);

    // Limit to maxTasks topics
    const selectedTopics = topicsNeedingPractice.slice(0, maxTasks);

    // Generate a task for each selected topic
    for (const { topic, subject, goalId } of selectedTopics) {
      // Determine difficulty
      const difficulty = determineTaskDifficulty(student, topic.name);

      // Select task type based on age
      const taskType = selectTaskType(student.age);

      // Generate the appropriate task
      let task: AnyTask | null = null;

      try {
        switch (taskType) {
          case "multiple_choice":
            task = await generateMultipleChoiceTask(
              student.id,
              subject,
              topic.name,
              difficulty,
              student.age
            );
            break;

          case "open_ended":
            task = await generateOpenEndedTask(
              student.id,
              subject,
              topic.name,
              difficulty,
              student.age
            );
            break;

          case "real_world":
            task = await generateRealWorldTask(
              student.id,
              subject,
              topic.name,
              difficulty,
              student.age
            );
            break;
        }

        if (task) {
          tasks.push(task);
          // Store in cache
          const studentTasks = tasksCache.get(student.id) || [];
          studentTasks.push(task as Task);
          tasksCache.set(student.id, studentTasks);
        }
      } catch (error) {
        console.error(`Error generating ${taskType} task for ${topic.name}:`, error);
        // Continue with next topic instead of failing entire assignment
      }
    }

    console.log(`Assigned ${tasks.length} adaptive tasks to ${student.name}`);
    return tasks;
  } catch (error) {
    console.error(`Error assigning adaptive tasks to ${student.id}:`, error);
    return [];
  }
}

/**
 * Check if a student needs more practice on a topic
 */
export function needsMorePractice(student: Student, topic: string): boolean {
  // Find the topic in student goals
  let topicData: Topic | undefined;

  for (const goal of student.goals) {
    const foundTopic = goal.topics.find((t) => t.name === topic);
    if (foundTopic) {
      topicData = foundTopic;
      break;
    }
  }

  // If topic not found, assume they need practice
  if (!topicData) {
    return true;
  }

  // Check progress - if < 90%, needs more practice
  if (topicData.progress < 90) {
    return true;
  }

  // Check recent success rate
  const topicTasks = (tasksCache.get(student.id) || []).filter(
    (t) => t.topic === topic && t.status === "complete"
  );

  if (topicTasks.length < 5) {
    // Not enough data, assume needs practice
    return true;
  }

  // Check recent tasks (last 3)
  const recentTasks = topicTasks.slice(-3);
  const recentSuccessRate =
    recentTasks.filter((t) => t.attempts === 1).length / recentTasks.length;

  // If recent success rate < 0.8, needs more practice
  return recentSuccessRate < 0.8;
}

/**
 * Get task completion statistics for a student
 */
export interface TaskCompletionStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageScore: number;
  tasksByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  tasksByType: {
    multiple_choice: number;
    open_ended: number;
    real_world: number;
  };
}

export function getTaskCompletionStats(
  studentId: string
): TaskCompletionStats {
  const tasks = tasksCache.get(studentId) || [];

  const completedTasks = tasks.filter((t) => t.status === "complete");
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Calculate average score (for completed tasks)
  // Note: We don't store scores in Task interface, so this is an approximation
  // Successful first attempt = 100, otherwise estimate based on attempts
  let totalScore = 0;
  for (const task of completedTasks) {
    if (task.attempts === 1) {
      totalScore += 100;
    } else if (task.attempts === 2) {
      totalScore += 75;
    } else {
      totalScore += 50;
    }
  }
  const averageScore =
    completedTasks.length > 0
      ? Math.round(totalScore / completedTasks.length)
      : 0;

  // Count by difficulty (check if task has difficulty field)
  const tasksByDifficulty = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  for (const task of tasks) {
    const anyTask = task as any;
    if (anyTask.difficulty) {
      tasksByDifficulty[anyTask.difficulty as TaskDifficulty]++;
    }
  }

  // Count by type
  const tasksByType = {
    multiple_choice: tasks.filter((t) => t.type === "multiple_choice").length,
    open_ended: tasks.filter((t) => t.type === "open_ended").length,
    real_world: tasks.filter((t) => t.type === "real_world").length,
  };

  return {
    totalTasks,
    completedTasks: completedTasks.length,
    completionRate,
    averageScore,
    tasksByDifficulty,
    tasksByType,
  };
}

/**
 * Update student progress after task completion
 */
export async function updateProgressAfterTask(
  studentId: string,
  taskId: string,
  success: boolean
): Promise<void> {
  try {
    // Get the task
    const task = await getTaskById(taskId);
    if (!task) {
      console.error(`Task ${taskId} not found`);
      return;
    }

    // Note: In a real implementation, this would update the student's progress in the database
    // For now, we just log the update
    console.log(
      `Progress update for ${studentId}: Topic "${task.topic}", Success: ${success}`
    );

    // In Phase 2 with a real backend, this would:
    // 1. Find the topic in student.goals
    // 2. Update topic.progress based on success
    // 3. Update topic.lastPracticed
    // 4. Update subConcept mastery if applicable
    // 5. Trigger achievement checks
    // 6. Save to database
  } catch (error) {
    console.error(`Error updating progress for ${studentId}:`, error);
  }
}

