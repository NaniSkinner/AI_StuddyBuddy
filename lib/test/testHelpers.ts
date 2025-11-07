import { Student, Session, Task, Achievement, Goal } from "@/types";

/**
 * Create mock student for testing
 */
export function createMockStudent(overrides?: Partial<Student>): Student {
  const baseStudent: Student = {
    id: "test-student-1",
    name: "Test Student",
    age: 13,
    grade: 8,
    createdAt: "2025-01-01T00:00:00.000Z",
    lastLoginAt: "2025-11-06T00:00:00.000Z",
    sessions: [],
    taskHistory: [],
    goals: [
      {
        id: "goal-1",
        subject: "Math",
        targetCompletion: "2025-12-31T00:00:00.000Z",
        progress: 45,
        topics: [],
      },
    ],
    streaks: {
      current: 5,
      longest: 7,
      lastActiveDate: "2025-11-06T00:00:00.000Z",
    },
    achievements: [],
    churnRisk: false,
    preferences: {
      aiColor: "#667eea-#f093fb",
      notificationEnabled: true,
      reminderTime: "16:00",
    },
    friendConnections: [],
    messagesSentToday: 0,
    questionsAsked: 0,
    totalConversations: 0,
  };

  return { ...baseStudent, ...overrides };
}

/**
 * Create mock session for testing
 */
export function createMockSession(overrides?: Partial<Session>): Session {
  const baseSession: Session = {
    id: `session-${Date.now()}`,
    studentId: "test-student-1",
    tutorId: "tutor-ai",
    date: new Date().toISOString(),
    duration: 15,
    topicsCovered: [
      {
        topic: "Algebra",
        subConcepts: ["Variables", "Linear Equations"],
        strugglingPoints: [],
        masteryLevel: 70,
      },
    ],
    strugglingConcepts: [],
    transcript: [
      {
        speaker: "ai",
        message: "Hi! Ready to learn?",
        timestamp: new Date().toISOString(),
      },
      {
        speaker: "student",
        message: "Yes, let's work on algebra!",
        timestamp: new Date().toISOString(),
      },
    ],
    tutorNotes: "Student is engaged and making progress",
    studentEngagement: "high",
  };

  return { ...baseSession, ...overrides };
}

/**
 * Create mock task for testing
 */
export function createMockTask(overrides?: Partial<Task>): Task {
  const baseTask: Task = {
    id: `task-${Date.now()}`,
    studentId: "test-student-1",
    type: "open_ended",
    subject: "Math",
    topic: "Quadratics",
    content: {
      question: "Solve the quadratic equation: x² + 5x + 6 = 0",
      hints: [
        "Factor the equation",
        "Look for two numbers that multiply to 6 and add to 5",
        "The factors are (x + 2)(x + 3)",
      ],
    },
    status: "incomplete",
    attempts: 0,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return { ...baseTask, ...overrides };
}

/**
 * Create mock achievement for testing
 */
export function createMockAchievement(
  overrides?: Partial<Achievement>
): Achievement {
  const baseAchievement: Achievement = {
    id: "first_steps",
    name: "First Steps",
    icon: "🎯",
    description: "Welcome to learning!",
    trigger: "Complete first conversation",
    unlockedAt: new Date().toISOString(),
  };

  return { ...baseAchievement, ...overrides };
}

/**
 * Wait for async operations (useful in tests)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Assert function for testing
 */
export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Test runner utility
 */
export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export async function runTest(
  name: string,
  testFn: () => Promise<void> | void
): Promise<TestResult> {
  const startTime = Date.now();
  try {
    await testFn();
    return {
      name,
      passed: true,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      name,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Run multiple tests and report results
 */
export async function runTestSuite(
  suiteName: string,
  tests: Array<{ name: string; fn: () => Promise<void> | void }>
): Promise<void> {
  console.log(`\n🧪 Running Test Suite: ${suiteName}`);
  console.log("=".repeat(50));

  const results: TestResult[] = [];

  for (const test of tests) {
    const result = await runTest(test.name, test.fn);
    results.push(result);

    const icon = result.passed ? "✅" : "❌";
    const duration = `(${result.duration}ms)`;
    console.log(`${icon} ${result.name} ${duration}`);

    if (!result.passed) {
      console.log(`   Error: ${result.error}`);
    }
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log("=".repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`⏱️  Total Duration: ${totalDuration}ms\n`);

  if (failed > 0) {
    throw new Error(`${failed} test(s) failed`);
  }
}

/**
 * Mock date for testing
 */
export function mockDate(date: Date): () => void {
  const originalDate = Date;
  const MockDate = class extends Date {
    constructor();
    constructor(value: number | string);
    constructor(
      year: number,
      month: number,
      date?: number,
      hours?: number,
      minutes?: number,
      seconds?: number,
      ms?: number
    );
    constructor(...args: any[]) {
      if (args.length === 0) {
        super(date.getTime());
      } else if (args.length === 1) {
        super(args[0]);
      } else {
        super(
          args[0],
          args[1],
          args[2] ?? 1,
          args[3] ?? 0,
          args[4] ?? 0,
          args[5] ?? 0,
          args[6] ?? 0
        );
      }
    }

    static now() {
      return date.getTime();
    }
  };

  // @ts-ignore
  global.Date = MockDate;

  // Return cleanup function
  return () => {
    global.Date = originalDate;
  };
}

/**
 * Create date X days ago
 */
export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Create date X days from now
 */
export function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
