/**
 * Task Generation Service
 * AI-powered generation of practice tasks using OpenAI
 */

import OpenAI from "openai";
import {
  MultipleChoiceTask,
  OpenEndedTask,
  RealWorldTask,
  TaskDifficulty,
  TaskGrading,
  AnyTask,
  TaskType,
} from "@/types";
import {
  getMultipleChoicePrompt,
  getOpenEndedPrompt,
  getRealWorldPrompt,
  getOpenEndedGradingPrompt,
  getRealWorldGradingPrompt,
} from "@/lib/prompts/taskGenerationPrompts";
import { withRetry, categorizeError } from "@/lib/utils/aiErrorHandler";
import { calculateUsage, logUsage } from "@/lib/services/usageLogService";
import {
  taskResponseCache,
  getTaskResponseCacheKey,
} from "@/lib/utils/promptCache";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Validate Multiple Choice Task response from OpenAI
 */
function validateMultipleChoiceResponse(data: any): boolean {
  if (!data.question || typeof data.question !== "string") return false;
  if (!Array.isArray(data.options) || data.options.length !== 4) return false;
  if (
    !data.correctAnswer ||
    !["A", "B", "C", "D"].includes(data.correctAnswer)
  )
    return false;
  if (!data.explanation || typeof data.explanation !== "string") return false;
  if (!Array.isArray(data.hints) || data.hints.length !== 3) return false;

  return true;
}

/**
 * Generate a Multiple Choice Task using OpenAI
 */
export async function generateMultipleChoiceTask(
  studentId: string,
  subject: string,
  topic: string,
  difficulty: TaskDifficulty,
  age: number
): Promise<MultipleChoiceTask> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

  try {
    // Build the prompt
    const prompt = getMultipleChoicePrompt(topic, difficulty, age, subject);

    // Call OpenAI with retry logic
    const completion = await withRetry(async () => {
      return await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational content creator. Generate high-quality practice questions in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" },
      });
    });

    // Calculate and log usage
    const usage = calculateUsage(
      completion,
      Date.now() - startTime,
      "task_generation"
    );
    logUsage(usage);

    // Parse response
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const data = JSON.parse(content);

    // Validate response
    if (!validateMultipleChoiceResponse(data)) {
      throw new Error("Invalid multiple choice task structure from OpenAI");
    }

    // Calculate points based on difficulty
    const points = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
    const estimatedTime =
      difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 6;

    // Build the task object
    const task: MultipleChoiceTask = {
      id: `mc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      type: "multiple_choice",
      subject,
      topic,
      difficulty,
      question: data.question,
      options: data.options as [string, string, string, string],
      correctAnswer: data.correctAnswer as "A" | "B" | "C" | "D",
      explanation: data.explanation,
      hints: data.hints as [string, string, string],
      points,
      estimatedTime,
      status: "incomplete",
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    success = true;
    return task;
  } catch (error: any) {
    errorCode = categorizeError(error);
    console.error("Error generating multiple choice task:", error);

    // Log failed usage
    logUsage({
      operation: "task_generation",
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

    throw error;
  }
}

/**
 * Validate Open-Ended Task response from OpenAI
 */
function validateOpenEndedResponse(data: any): boolean {
  if (!data.question || typeof data.question !== "string") return false;
  if (!data.rubric || typeof data.rubric !== "object") return false;
  if (
    !Array.isArray(data.rubric.keyPoints) ||
    data.rubric.keyPoints.length < 3
  )
    return false;
  if (
    typeof data.rubric.minLength !== "number" ||
    data.rubric.minLength <= 0
  )
    return false;
  if (!Array.isArray(data.hints) || data.hints.length !== 3) return false;

  return true;
}

/**
 * Generate an Open-Ended Task using OpenAI
 */
export async function generateOpenEndedTask(
  studentId: string,
  subject: string,
  topic: string,
  difficulty: TaskDifficulty,
  age: number
): Promise<OpenEndedTask> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

  try {
    // Build the prompt
    const prompt = getOpenEndedPrompt(topic, difficulty, age, subject);

    // Call OpenAI with retry logic
    const completion = await withRetry(async () => {
      return await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational content creator. Generate high-quality practice questions in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });
    });

    // Calculate and log usage
    const usage = calculateUsage(
      completion,
      Date.now() - startTime,
      "task_generation"
    );
    logUsage(usage);

    // Parse response
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const data = JSON.parse(content);

    // Validate response
    if (!validateOpenEndedResponse(data)) {
      throw new Error("Invalid open-ended task structure from OpenAI");
    }

    // Calculate points based on difficulty
    const points =
      difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20;
    const estimatedTime =
      difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;

    // Build the task object
    const task: OpenEndedTask = {
      id: `oe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      type: "open_ended",
      subject,
      topic,
      difficulty,
      question: data.question,
      rubric: {
        keyPoints: data.rubric.keyPoints,
        minLength: data.rubric.minLength,
        maxLength: data.rubric.maxLength,
      },
      sampleAnswer: data.sampleAnswer,
      hints: data.hints as [string, string, string],
      points,
      estimatedTime,
      status: "incomplete",
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    success = true;
    return task;
  } catch (error: any) {
    errorCode = categorizeError(error);
    console.error("Error generating open-ended task:", error);

    // Log failed usage
    logUsage({
      operation: "task_generation",
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

    throw error;
  }
}

/**
 * Validate Real-World Task response from OpenAI
 */
function validateRealWorldResponse(data: any): boolean {
  if (!data.activity || typeof data.activity !== "string") return false;
  if (!Array.isArray(data.instructions) || data.instructions.length < 3)
    return false;
  if (
    !Array.isArray(data.verificationQuestions) ||
    data.verificationQuestions.length !== 3
  )
    return false;
  if (!data.reflectionPrompt || typeof data.reflectionPrompt !== "string")
    return false;

  return true;
}

/**
 * Generate a Real-World Task using OpenAI
 */
export async function generateRealWorldTask(
  studentId: string,
  subject: string,
  topic: string,
  difficulty: TaskDifficulty,
  age: number
): Promise<RealWorldTask> {
  const startTime = Date.now();
  let success = false;
  let errorCode: string | undefined;

  try {
    // Build the prompt
    const prompt = getRealWorldPrompt(topic, difficulty, age, subject);

    // Call OpenAI with retry logic
    const completion = await withRetry(async () => {
      return await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational content creator. Generate engaging, safe, hands-on activities in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8, // Slightly higher for creativity
        max_tokens: 1200,
        response_format: { type: "json_object" },
      });
    });

    // Calculate and log usage
    const usage = calculateUsage(
      completion,
      Date.now() - startTime,
      "task_generation"
    );
    logUsage(usage);

    // Parse response
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const data = JSON.parse(content);

    // Validate response
    if (!validateRealWorldResponse(data)) {
      throw new Error("Invalid real-world task structure from OpenAI");
    }

    // Calculate points based on difficulty
    const points =
      difficulty === "easy" ? 15 : difficulty === "medium" ? 20 : 25;
    const estimatedTime =
      difficulty === "easy" ? 20 : difficulty === "medium" ? 30 : 40;

    // Build the task object
    const task: RealWorldTask = {
      id: `rw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      type: "real_world",
      subject,
      topic,
      difficulty,
      activity: data.activity,
      instructions: data.instructions,
      verificationQuestions: data.verificationQuestions,
      reflectionPrompt: data.reflectionPrompt,
      materials: data.materials,
      safetyNotes: data.safetyNotes,
      points,
      estimatedTime,
      status: "incomplete",
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    success = true;
    return task;
  } catch (error: any) {
    errorCode = categorizeError(error);
    console.error("Error generating real-world task:", error);

    // Log failed usage
    logUsage({
      operation: "task_generation",
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

    throw error;
  }
}

