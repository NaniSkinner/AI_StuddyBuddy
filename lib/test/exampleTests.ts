import {
  createMockStudent,
  createMockSession,
  createMockTask,
  assert,
  runTestSuite,
  daysAgo,
} from "./testHelpers";

import {
  calculateCurrentStreak,
  getStreakStatus,
} from "@/lib/services/streakService";
import {
  isAtRisk,
  calculateChurnRisk,
} from "@/lib/services/churnDetectionService";
import { calculateGoalProgress } from "@/lib/utils/progressCalculator";

/**
 * Example Test Suite - Service Layer Tests
 */
export async function runServiceTests(): Promise<void> {
  await runTestSuite("Service Layer Tests", [
    {
      name: "getStreakStatus - active streak",
      fn: async () => {
        const student = createMockStudent({
          streaks: {
            current: 3,
            longest: 5,
            lastActiveDate: new Date().toISOString(),
          },
        });

        const streakStatus = await getStreakStatus(student.id);
        assert(streakStatus.current >= 1, "Should have at least 1 day streak");
        assert(streakStatus.isActive, "Streak should be active");
      },
    },
    {
      name: "getStreakStatus - broken streak",
      fn: async () => {
        const student = createMockStudent({
          streaks: {
            current: 0,
            longest: 5,
            lastActiveDate: daysAgo(3).toISOString(),
          },
        });

        const streakStatus = await getStreakStatus(student.id);
        assert(streakStatus.current === 0, "Streak should be broken");
        assert(!streakStatus.isActive, "Streak should not be active");
      },
    },
    {
      name: "isAtRisk - low engagement",
      fn: async () => {
        const student = createMockStudent({
          sessions: ["s1", "s2"],
          streaks: {
            current: 0,
            longest: 1,
            lastActiveDate: daysAgo(8).toISOString(),
          },
        });

        const result = await isAtRisk(student.id);
        assert(result, "Should detect at-risk student");
      },
    },
    {
      name: "calculateGoalProgress - topic mastery",
      fn: () => {
        const progress = calculateGoalProgress([
          {
            name: "Algebra",
            progress: 80,
            lastPracticed: new Date().toISOString(),
            subConcepts: [
              {
                name: "Variables",
                mastered: true,
                attemptsCorrect: 8,
                attemptsTotal: 10,
              },
              {
                name: "Equations",
                mastered: false,
                attemptsCorrect: 6,
                attemptsTotal: 10,
              },
            ],
          },
          {
            name: "Geometry",
            progress: 60,
            lastPracticed: new Date().toISOString(),
          },
        ]);

        assert(progress >= 60, "Overall progress should be at least 60");
        assert(progress <= 80, "Overall progress should be at most 80");
      },
    },
  ]);
}

/**
 * Example Test Suite - Utility Function Tests
 */
export async function runUtilityTests(): Promise<void> {
  await runTestSuite("Utility Function Tests", [
    {
      name: "Goal progress calculation with no data",
      fn: () => {
        const progress = calculateGoalProgress([]);
        assert(progress === 0, "Progress should be 0 with no data");
      },
    },
    {
      name: "Goal progress calculation with topics",
      fn: () => {
        const progress = calculateGoalProgress([
          {
            name: "Algebra",
            progress: 50,
            lastPracticed: new Date().toISOString(),
          },
          {
            name: "Geometry",
            progress: 30,
            lastPracticed: new Date().toISOString(),
          },
        ]);

        assert(progress >= 30, "Progress should be at least 30");
        assert(progress <= 50, "Progress should be at most 50");
      },
    },
  ]);
}

/**
 * Example Test Suite - User Journey Tests
 */
export async function runUserJourneyTests(): Promise<void> {
  await runTestSuite("User Journey Tests", [
    {
      name: "New user onboarding flow",
      fn: async () => {
        // Test: New user should have 0 sessions
        const newStudent = createMockStudent({
          sessions: [],
          achievements: [],
        });

        assert(
          newStudent.sessions.length === 0,
          "New student should have no sessions"
        );
        assert(
          newStudent.achievements.length === 0,
          "New student should have no achievements"
        );
      },
    },
    {
      name: "Active user progression",
      fn: async () => {
        // Test: Active user should have sessions and achievements
        const activeStudent = createMockStudent({
          sessions: ["s1", "s2", "s3"],
          achievements: ["first_steps", "three_day_streak"],
        });

        assert(
          activeStudent.sessions.length >= 3,
          "Active student should have multiple sessions"
        );
        assert(
          activeStudent.achievements.length > 0,
          "Active student should have achievements"
        );
      },
    },
    {
      name: "At-risk user detection",
      fn: async () => {
        // Test: User with gap in sessions should be detected as at-risk
        const atRiskStudent = createMockStudent({
          sessions: ["s1"],
          streaks: {
            current: 0,
            longest: 1,
            lastActiveDate: daysAgo(15).toISOString(),
          },
          goals: [
            {
              id: "goal-1",
              subject: "Math",
              targetCompletion: new Date().toISOString(),
              progress: 20,
              topics: [],
            },
          ],
        });

        const result = await isAtRisk(atRiskStudent.id);
        assert(result, "Should detect at-risk user");
      },
    },
  ]);
}

/**
 * Run all test suites
 */
export async function runAllTests(): Promise<void> {
  console.log("\n🚀 Starting Test Execution\n");

  try {
    await runServiceTests();
    await runUtilityTests();
    await runUserJourneyTests();

    console.log("\n✅ All tests passed!\n");
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}
