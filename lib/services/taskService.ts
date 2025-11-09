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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tasksCache = new Map<string, Task[]>();

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

export async function getTasksByStudent(studentId: string): Promise<Task[]> {
  try {
    return tasksCache.get(studentId) || [];
  } catch (error) {
    console.error(`Error getting tasks for ${studentId}:`, error);
    return [];
  }
}

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

export async function generateAdaptiveTasks(
  studentId: string,
  subject: string,
  count: number = 3
): Promise<Task[]> {
  try {
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

export async function getIncompleteTasks(studentId: string): Promise<Task[]> {
  try {
    const tasks = await getTasksByStudent(studentId);
    return tasks.filter((t) => t.status === "incomplete");
  } catch (error) {
    console.error(`Error getting incomplete tasks for ${studentId}:`, error);
    return [];
  }
}

export async function recordTaskAttempt(
  taskId: string,
  correct: boolean
): Promise<Task | null> {
  try {
    for (const [studentId, tasks] of tasksCache.entries()) {
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].attempts += 1;

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

export function gradeMultipleChoice(
  task: MultipleChoiceTask,
  studentAnswer: string,
  hintsUsed: number = 0
): TaskGrading {
  const normalizedStudentAnswer = studentAnswer.trim().toUpperCase();
  const normalizedCorrectAnswer = task.correctAnswer.toUpperCase();

  const isCorrect = normalizedStudentAnswer === normalizedCorrectAnswer;
  const score = isCorrect ? 100 : 0;

  let feedback = "";
  const suggestions: string[] = [];

  if (isCorrect) {
    feedback = `🎉 Excellent work! That's correct! ${task.explanation}`;
    if (hintsUsed === 0) {
      feedback += " And you got it without any hints - amazing!";
    }
  } else {
    feedback = `Not quite right, but great effort! The correct answer is ${task.correctAnswer}. ${task.explanation}`;

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

export async function gradeOpenEnded(
  task: OpenEndedTask,
  studentAnswer: string,
  age: number
): Promise<TaskGrading> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

  try {
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

export function getHint(
  task: MultipleChoiceTask | OpenEndedTask,
  hintLevel: number
): string | null {
  if (!task.hints || task.hints.length === 0) return null;

  const level = Math.max(0, Math.min(hintLevel, task.hints.length - 1));

  return task.hints[level];
}

export function determineTaskDifficulty(
  student: Student,
  topic: string
): TaskDifficulty {
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

  if (!topicData) {
    console.log(`Topic "${topic}" not found in student goals, defaulting to easy`);
    return "easy";
  }

  const topicTasks = (tasksCache.get(student.id) || []).filter(
    (t) => t.topic === topic && t.status === "complete"
  );

  if (topicTasks.length < 3) {
    return "easy";
  }

  const totalAttempts = topicTasks.reduce((sum, t) => sum + t.attempts, 0);
  const successfulTasks = topicTasks.length;
  const successRate = totalAttempts > 0 ? successfulTasks / totalAttempts : 0;

  const progress = topicData.progress;

  if (progress < 40) {
    return "easy";
  } else if (progress < 70) {
    if (successRate < 0.5) {
      return "easy";
    }
    return "medium";
  } else {
    if (successRate < 0.6) {
      return "medium";
    }
    return "hard";
  }
}

export function selectTaskType(age: number): TaskType {
  let weights: { [key in TaskType]: number };

  if (age <= 11) {
    weights = {
      multiple_choice: 50,
      open_ended: 30,
      real_world: 20,
    };
  } else if (age <= 14) {
    weights = {
      multiple_choice: 40,
      open_ended: 40,
      real_world: 20,
    };
  } else {
    weights = {
      multiple_choice: 30,
      open_ended: 50,
      real_world: 20,
    };
  }

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const [type, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (random <= cumulative) {
      return type as TaskType;
    }
  }

  return "multiple_choice";
}

export async function assignAdaptiveTasks(
  student: Student,
  maxTasks: number = 5
): Promise<AnyTask[]> {
  try {
    const tasks: AnyTask[] = [];

    const activeGoals = student.goals.filter((goal) => goal.progress < 100);

    if (activeGoals.length === 0) {
      console.log("No active goals for student", student.id);
      return [];
    }

    type TopicWithContext = {
      topic: Topic;
      subject: string;
      goalId: string;
    };

    const topicsNeedingPractice: TopicWithContext[] = [];

    for (const goal of activeGoals) {
      for (const topic of goal.topics) {
        if (topic.progress < 90) {
          topicsNeedingPractice.push({
            topic,
            subject: goal.subject,
            goalId: goal.id,
          });
        }
      }
    }

    topicsNeedingPractice.sort((a, b) => a.topic.progress - b.topic.progress);

    const selectedTopics = topicsNeedingPractice.slice(0, maxTasks);

    for (const { topic, subject, goalId } of selectedTopics) {
      const difficulty = determineTaskDifficulty(student, topic.name);
      const taskType = selectTaskType(student.age);

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
          const studentTasks = tasksCache.get(student.id) || [];
          studentTasks.push(task as Task);
          tasksCache.set(student.id, studentTasks);
        }
      } catch (error) {
        console.error(`Error generating ${taskType} task for ${topic.name}:`, error);
      }
    }

    console.log(`Assigned ${tasks.length} adaptive tasks to ${student.name}`);
    return tasks;
  } catch (error) {
    console.error(`Error assigning adaptive tasks to ${student.id}:`, error);
    return [];
  }
}

export function needsMorePractice(student: Student, topic: string): boolean {
  let topicData: Topic | undefined;

  for (const goal of student.goals) {
    const foundTopic = goal.topics.find((t) => t.name === topic);
    if (foundTopic) {
      topicData = foundTopic;
      break;
    }
  }

  if (!topicData) {
    return true;
  }

  if (topicData.progress < 90) {
    return true;
  }

  const topicTasks = (tasksCache.get(student.id) || []).filter(
    (t) => t.topic === topic && t.status === "complete"
  );

  if (topicTasks.length < 5) {
    return true;
  }

  const recentTasks = topicTasks.slice(-3);
  const recentSuccessRate =
    recentTasks.filter((t) => t.attempts === 1).length / recentTasks.length;

  return recentSuccessRate < 0.8;
}

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

export async function updateProgressAfterTask(
  studentId: string,
  taskId: string,
  success: boolean
): Promise<void> {
  try {
    const task = await getTaskById(taskId);
    if (!task) {
      console.error(`Task ${taskId} not found`);
      return;
    }

    console.log(
      `Progress update for ${studentId}: Topic "${task.topic}", Success: ${success}`
    );
  } catch (error) {
    console.error(`Error updating progress for ${studentId}:`, error);
  }
}

