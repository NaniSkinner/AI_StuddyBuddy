#!/usr/bin/env bun
/**
 * Quick Smoke Test
 * Fast verification that core AI features are working
 *
 * Usage: bun run test:quick
 */

import { generateMultipleChoiceTask } from "../lib/services/taskGenerationService";
import { generateAIResponse } from "../lib/services/aiService";
import { gradeMultipleChoice } from "../lib/services/taskService";
import { getAllCacheStats } from "../lib/utils/promptCache";
import { getStudentById } from "../lib/services/studentService";
import { MultipleChoiceTask, Message } from "../types";

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

function log(msg: string, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

async function runQuickTest() {
  log("\n🚀 Running Quick Smoke Test...\n", colors.cyan);

  // Check API key
  if (!process.env.OPENAI_API_KEY) {
    log("❌ OPENAI_API_KEY not found", colors.red);
    process.exit(1);
  }
  log("✅ API key configured", colors.green);

  try {
    // Test 1: Task Generation
    log("\n📝 Testing task generation...", colors.cyan);
    const task = await generateMultipleChoiceTask(
      "test-student",
      "Math",
      "Fractions",
      "easy",
      12
    );

    if (!task || !task.question) {
      throw new Error("Task generation failed");
    }
    log(
      `✅ Task generated: "${task.question.substring(0, 50)}..."`,
      colors.green
    );

    // Test 2: Grading
    log("\n✅ Testing grading system...", colors.cyan);
    const mockTask: MultipleChoiceTask = {
      ...task,
      correctAnswer: "A",
    };
    const grading = gradeMultipleChoice(mockTask, "A", 0);
    if (grading.score !== 100) {
      throw new Error("Grading failed");
    }
    log("✅ Grading system working", colors.green);

    // Test 3: Chat
    log("\n💬 Testing chat integration...", colors.cyan);
    const student = await getStudentById("student-eva");
    if (!student) {
      throw new Error("Could not load student");
    }

    const messages: Message[] = [
      {
        speaker: "student",
        message: "Hello!",
        timestamp: new Date().toISOString(),
      },
    ];

    const response = await generateAIResponse(student, messages);
    if (!response || response.length < 10) {
      throw new Error("Chat response failed");
    }
    log(`✅ Chat working: "${response.substring(0, 60)}..."`, colors.green);

    // Test 4: Cache
    log("\n💾 Testing cache system...", colors.cyan);
    const stats = getAllCacheStats();
    log(
      `✅ Cache active: ${
        stats.systemPrompts.size +
        stats.taskPrompts.size +
        stats.taskResponses.size
      } entries`,
      colors.green
    );

    // Success!
    log("\n🎉 All quick tests passed!\n", colors.green);
    log('💡 Run "bun run test:ai" for comprehensive testing\n', colors.cyan);
    process.exit(0);
  } catch (error) {
    log(
      `\n❌ Test failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
      colors.red
    );
    process.exit(1);
  }
}

runQuickTest();
