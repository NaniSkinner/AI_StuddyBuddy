#!/usr/bin/env bun
/**
 * AI Features Test Suite
 * Comprehensive testing for AI integration, task generation, and grading
 *
 * Usage: bun run scripts/test-ai-features.ts
 */

import {
  generateMultipleChoiceTask,
  generateOpenEndedTask,
  generateRealWorldTask,
} from "../lib/services/taskGenerationService";
import { generateTaskBatch } from "../lib/services/taskBatchService";
import {
  gradeMultipleChoice,
  gradeOpenEnded,
  gradeRealWorld,
} from "../lib/services/taskService";
import {
  determineTaskDifficulty,
  assignAdaptiveTasks,
} from "../lib/services/taskService";
import { generateAIResponse } from "../lib/services/aiService";
import { getAllCacheStats, cleanupAllCaches } from "../lib/utils/promptCache";
import { getStudentById } from "../lib/services/studentService";
import {
  MultipleChoiceTask,
  OpenEndedTask,
  RealWorldTask,
  Message,
} from "../types";

// Test counters
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Color codes for terminal
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function testPassed(testName: string) {
  passedTests++;
  totalTests++;
  log(`✅ PASS: ${testName}`, colors.green);
}

function testFailed(testName: string, error: string) {
  failedTests++;
  totalTests++;
  log(`❌ FAIL: ${testName}`, colors.red);
  log(`   Error: ${error}`, colors.red);
}

function section(title: string) {
  log(`\n${"=".repeat(60)}`, colors.cyan);
  log(`  ${title}`, colors.cyan);
  log("=".repeat(60), colors.cyan);
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// 9.1 Task Generation Testing
// ============================================================================

async function testMultipleChoiceGeneration() {
  section("9.1.1 Multiple Choice Task Generation");

  const difficulties: Array<"easy" | "medium" | "hard"> = [
    "easy",
    "medium",
    "hard",
  ];
  const subjects = ["Math", "Science", "English"];

  for (const difficulty of difficulties) {
    for (const subject of subjects) {
      try {
        const task = await generateMultipleChoiceTask(
          "test-student",
          subject,
          "General",
          difficulty,
          12 // age
        );

        // Validate structure
        if (!task.question || task.question.length < 10) {
          throw new Error("Question is missing or too short");
        }
        if (!task.options || task.options.length !== 4) {
          throw new Error(`Expected 4 options, got ${task.options?.length}`);
        }
        if (!["A", "B", "C", "D"].includes(task.correctAnswer)) {
          throw new Error(`Invalid correct answer: ${task.correctAnswer}`);
        }
        if (!task.hints || task.hints.length !== 3) {
          throw new Error(`Expected 3 hints, got ${task.hints?.length}`);
        }
        if (!task.explanation || task.explanation.length < 10) {
          throw new Error("Explanation is missing or too short");
        }

        testPassed(`${difficulty} ${subject} MC task generated`);
        await delay(1000); // Rate limiting
      } catch (error) {
        testFailed(
          `${difficulty} ${subject} MC task`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  }
}

async function testOpenEndedGeneration() {
  section("9.1.2 Open-Ended Task Generation");

  const testCases = [
    {
      subject: "Science",
      topic: "Photosynthesis",
      difficulty: "medium" as const,
      age: 15,
    },
    { subject: "Math", topic: "Algebra", difficulty: "hard" as const, age: 16 },
    {
      subject: "English",
      topic: "Essay Writing",
      difficulty: "easy" as const,
      age: 13,
    },
  ];

  for (const testCase of testCases) {
    try {
      const task = await generateOpenEndedTask(
        "test-student",
        testCase.subject,
        testCase.topic,
        testCase.difficulty,
        testCase.age
      );

      // Validate structure
      if (!task.question || task.question.length < 15) {
        throw new Error("Question is missing or too short");
      }
      if (
        !task.rubric ||
        !task.rubric.keyPoints ||
        task.rubric.keyPoints.length < 3
      ) {
        throw new Error("Rubric must have at least 3 key points");
      }
      if (!task.rubric.minLength || task.rubric.minLength < 50) {
        throw new Error("Minimum length should be at least 50 words");
      }
      if (!task.hints || task.hints.length !== 3) {
        throw new Error(`Expected 3 hints, got ${task.hints?.length}`);
      }

      testPassed(
        `${testCase.difficulty} ${testCase.subject} OE task (age ${testCase.age})`
      );
      await delay(1000);
    } catch (error) {
      testFailed(
        `${testCase.difficulty} ${testCase.subject} OE task`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

async function testRealWorldGeneration() {
  section("9.1.3 Real-World Task Generation");

  const testCases = [
    {
      subject: "Science",
      topic: "Physics",
      difficulty: "easy" as const,
      age: 10,
    },
    {
      subject: "Math",
      topic: "Geometry",
      difficulty: "medium" as const,
      age: 13,
    },
  ];

  for (const testCase of testCases) {
    try {
      const task = await generateRealWorldTask(
        "test-student",
        testCase.subject,
        testCase.topic,
        testCase.difficulty,
        testCase.age
      );

      // Validate structure
      if (!task.activity || task.activity.length < 10) {
        throw new Error("Activity title is missing or too short");
      }
      if (!task.instructions || task.instructions.length < 3) {
        throw new Error("Must have at least 3 instructions");
      }
      if (
        !task.verificationQuestions ||
        task.verificationQuestions.length !== 3
      ) {
        throw new Error("Must have exactly 3 verification questions");
      }
      if (!task.reflectionPrompt || task.reflectionPrompt.length < 20) {
        throw new Error("Reflection prompt is missing or too short");
      }

      testPassed(
        `${testCase.difficulty} ${testCase.subject} RW task (age ${testCase.age})`
      );
      await delay(1000);
    } catch (error) {
      testFailed(
        `${testCase.difficulty} ${testCase.subject} RW task`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

// ============================================================================
// 9.2 Grading System Testing
// ============================================================================

async function testMultipleChoiceGrading() {
  section("9.2.1 Multiple Choice Grading");

  const mockTask: MultipleChoiceTask = {
    id: "test-mc-1",
    studentId: "test-student",
    type: "multiple_choice",
    subject: "Math",
    topic: "Fractions",
    difficulty: "medium",
    question: "What is 1/2 + 1/4?",
    options: ["1/4", "1/2", "3/4", "1"],
    correctAnswer: "C",
    explanation: "1/2 = 2/4, so 2/4 + 1/4 = 3/4",
    hints: [
      "Convert to common denominator",
      "Think of 1/2 as 2/4",
      "Add the numerators",
    ],
    points: 10,
    estimatedTime: 5,
    status: "incomplete",
    attempts: 0,
    createdAt: new Date().toISOString(),
  };

  // Test correct answer
  try {
    const result = gradeMultipleChoice(mockTask, "C", 0);
    if (result.score !== 100 || !result.isCorrect) {
      throw new Error(
        `Expected score 100 and isCorrect true, got ${result.score} and ${result.isCorrect}`
      );
    }
    testPassed("MC grading - correct answer");
  } catch (error) {
    testFailed(
      "MC grading - correct answer",
      error instanceof Error ? error.message : String(error)
    );
  }

  // Test incorrect answer
  try {
    const result = gradeMultipleChoice(mockTask, "A", 0);
    if (result.score !== 0 || result.isCorrect) {
      throw new Error(
        `Expected score 0 and isCorrect false, got ${result.score} and ${result.isCorrect}`
      );
    }
    testPassed("MC grading - incorrect answer");
  } catch (error) {
    testFailed(
      "MC grading - incorrect answer",
      error instanceof Error ? error.message : String(error)
    );
  }

  // Test case insensitivity
  try {
    const result = gradeMultipleChoice(mockTask, "c", 0);
    if (result.score !== 100 || !result.isCorrect) {
      throw new Error("Case insensitive grading failed");
    }
    testPassed("MC grading - case insensitive");
  } catch (error) {
    testFailed(
      "MC grading - case insensitive",
      error instanceof Error ? error.message : String(error)
    );
  }

  // Test hint penalty
  try {
    const result = gradeMultipleChoice(mockTask, "C", 2);
    if (result.score >= 100) {
      throw new Error("Expected score penalty for using hints");
    }
    testPassed("MC grading - hint penalty");
  } catch (error) {
    testFailed(
      "MC grading - hint penalty",
      error instanceof Error ? error.message : String(error)
    );
  }
}

async function testOpenEndedGrading() {
  section("9.2.2 Open-Ended Task Grading");

  const mockTask: OpenEndedTask = {
    id: "test-oe-1",
    studentId: "test-student",
    type: "open_ended",
    subject: "Science",
    topic: "Photosynthesis",
    difficulty: "medium",
    question: "Explain the process of photosynthesis.",
    rubric: {
      keyPoints: [
        "Plants use sunlight to make food",
        "Carbon dioxide and water are inputs",
        "Glucose and oxygen are outputs",
        "Occurs in chloroplasts",
        "Chlorophyll captures light energy",
      ],
      minLength: 100,
    },
    sampleAnswer:
      "Photosynthesis is the process by which plants convert light energy into chemical energy...",
    hints: [
      "Think about what plants need",
      "Consider what they produce",
      "Remember the role of sunlight",
    ],
    points: 15,
    estimatedTime: 15,
    status: "incomplete",
    attempts: 0,
    createdAt: new Date().toISOString(),
  };

  const testAnswers = [
    {
      name: "Excellent answer",
      answer:
        "Photosynthesis is the process where plants use sunlight, carbon dioxide, and water to create glucose and oxygen. This happens in the chloroplasts, specifically in structures containing chlorophyll which captures the light energy. The plant takes in CO2 from the air and H2O from the soil, and through the photosynthetic process, produces glucose (sugar) for energy and releases oxygen as a byproduct. This is crucial for life on Earth as it provides oxygen for other organisms.",
      expectedScore: 90,
    },
    {
      name: "Good answer",
      answer:
        "Photosynthesis is when plants make food using sunlight. They take in carbon dioxide and water and produce glucose and oxygen. The chlorophyll in the leaves captures the sunlight which powers this process.",
      expectedScore: 70,
    },
    {
      name: "Poor answer",
      answer: "Plants use sunlight to grow.",
      expectedScore: 30,
    },
  ];

  for (const testCase of testAnswers) {
    try {
      const result = await gradeOpenEnded(mockTask, testCase.answer, 14);

      if (result.score < 0 || result.score > 100) {
        throw new Error(`Score out of range: ${result.score}`);
      }

      // Allow some variance in AI grading
      const variance = 20;
      if (Math.abs(result.score - testCase.expectedScore) > variance) {
        log(
          `⚠️  Warning: Score ${result.score} differs significantly from expected ${testCase.expectedScore}`,
          colors.yellow
        );
      }

      if (!result.feedback || result.feedback.length < 20) {
        throw new Error("Feedback is missing or too short");
      }

      testPassed(`OE grading - ${testCase.name} (score: ${result.score})`);
      await delay(1500);
    } catch (error) {
      testFailed(
        `OE grading - ${testCase.name}`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

// ============================================================================
// 9.3 Batch Operations Testing
// ============================================================================

async function testBatchGeneration() {
  section("9.3 Batch Task Generation");

  try {
    const requests = [
      {
        studentId: "test-student",
        subject: "Math",
        topic: "Algebra",
        difficulty: "easy" as const,
        type: "multiple_choice" as const,
        age: 14,
        grade: 8,
      },
      {
        studentId: "test-student",
        subject: "Science",
        topic: "Biology",
        difficulty: "medium" as const,
        type: "open_ended" as const,
        age: 14,
        grade: 8,
      },
      {
        studentId: "test-student",
        subject: "Math",
        topic: "Geometry",
        difficulty: "easy" as const,
        type: "real_world" as const,
        age: 14,
        grade: 8,
      },
    ];

    const startTime = Date.now();
    const tasks = await generateTaskBatch(requests);
    const duration = Date.now() - startTime;

    if (tasks.length !== 3) {
      throw new Error(`Expected 3 tasks, got ${tasks.length}`);
    }

    if (tasks[0].type !== "multiple_choice") {
      throw new Error(`Task 1 should be multiple_choice, got ${tasks[0].type}`);
    }
    if (tasks[1].type !== "open_ended") {
      throw new Error(`Task 2 should be open_ended, got ${tasks[1].type}`);
    }
    if (tasks[2].type !== "real_world") {
      throw new Error(`Task 3 should be real_world, got ${tasks[2].type}`);
    }

    testPassed(`Batch generation of 3 tasks in ${duration}ms`);

    // Test cache on second run
    const startTime2 = Date.now();
    const tasks2 = await generateTaskBatch(requests);
    const duration2 = Date.now() - startTime2;

    if (duration2 > duration * 0.5) {
      log(
        `⚠️  Warning: Second batch not significantly faster (${duration2}ms vs ${duration}ms)`,
        colors.yellow
      );
    } else {
      testPassed(
        `Batch cache working - second run ${duration2}ms (vs ${duration}ms)`
      );
    }
  } catch (error) {
    testFailed(
      "Batch generation",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// ============================================================================
// 9.4 Cache Testing
// ============================================================================

async function testCacheSystem() {
  section("9.4 Cache System");

  try {
    const stats = getAllCacheStats();

    log(`\n📊 Cache Statistics:`, colors.blue);
    log(
      `  System Prompts: ${stats.systemPrompts.size}/${stats.systemPrompts.maxSize} (${stats.systemPrompts.hitRate} hit rate)`,
      colors.cyan
    );
    log(
      `  Task Prompts: ${stats.taskPrompts.size}/${stats.taskPrompts.maxSize} (${stats.taskPrompts.hitRate} hit rate)`,
      colors.cyan
    );
    log(
      `  Task Responses: ${stats.taskResponses.size}/${stats.taskResponses.maxSize} (${stats.taskResponses.hitRate} hit rate)`,
      colors.cyan
    );

    testPassed("Cache statistics available");

    // Test cleanup
    cleanupAllCaches();
    testPassed("Cache cleanup executed");
  } catch (error) {
    testFailed(
      "Cache system",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// ============================================================================
// 9.5 Integration Testing
// ============================================================================

async function testChatIntegration() {
  section("9.5 Chat Integration");

  try {
    const student = await getStudentById("student-eva");
    if (!student) {
      throw new Error("Could not load test student (Eva)");
    }

    const messages: Message[] = [
      {
        speaker: "student",
        message: "Can you help me understand fractions?",
        timestamp: new Date().toISOString(),
      },
    ];

    const response = await generateAIResponse(student, messages);

    if (!response || response.length < 20) {
      throw new Error("AI response is missing or too short");
    }

    if (response.includes("I understand you want to work on")) {
      throw new Error("Response appears to be hardcoded placeholder");
    }

    testPassed(`Chat integration - received ${response.length} char response`);
    log(`   Sample: "${response.substring(0, 100)}..."`, colors.cyan);
  } catch (error) {
    testFailed(
      "Chat integration",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// ============================================================================
// Main Test Runner
// ============================================================================

async function runAllTests() {
  const startTime = Date.now();

  log("\n" + "🧪 ".repeat(20), colors.cyan);
  log("  AI FEATURES TEST SUITE", colors.cyan);
  log("🧪 ".repeat(20) + "\n", colors.cyan);

  // Check API key
  if (!process.env.OPENAI_API_KEY) {
    log("❌ ERROR: OPENAI_API_KEY not found in environment", colors.red);
    log("   Please add it to your .env.local file", colors.yellow);
    process.exit(1);
  }

  try {
    // Run all test suites
    await testMultipleChoiceGeneration();
    await testOpenEndedGeneration();
    await testRealWorldGeneration();
    await testMultipleChoiceGrading();
    await testOpenEndedGrading();
    await testBatchGeneration();
    await testCacheSystem();
    await testChatIntegration();

    // Final summary
    const duration = Date.now() - startTime;
    const durationSec = (duration / 1000).toFixed(2);

    section("TEST SUMMARY");
    log(`\n📊 Results:`, colors.cyan);
    log(`   Total Tests: ${totalTests}`, colors.blue);
    log(`   ✅ Passed: ${passedTests}`, colors.green);
    log(`   ❌ Failed: ${failedTests}`, colors.red);
    log(`   ⏱️  Duration: ${durationSec}s\n`, colors.blue);

    if (failedTests === 0) {
      log("🎉 ALL TESTS PASSED! 🎉\n", colors.green);
      process.exit(0);
    } else {
      log(`⚠️  ${failedTests} test(s) failed\n`, colors.yellow);
      process.exit(1);
    }
  } catch (error) {
    log(
      `\n❌ Test suite error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      colors.red
    );
    process.exit(1);
  }
}

// Run tests
runAllTests();
