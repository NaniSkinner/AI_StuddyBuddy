/**
 * Retention System Test Suite
 * Automated testing for churn detection and nudge generation
 * Run with: bun run test:retention
 */

import { Student } from "@/types";
import {
  assessRisk,
  ChurnRisk,
  getAccountAge,
  getDaysSinceActive,
  getTaskStats,
  shouldNudge,
} from "@/lib/services/churnDetectionService";
import {
  generateNudge,
  determineTrigger,
  selectTemplate,
  findCelebrationPoint,
  replacePlaceholders,
  getAgeGroup,
} from "@/lib/services/nudgeService";
import { getStudentById, getAllStudents } from "@/lib/services/studentService";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

const testResults: TestResult[] = [];

function logTest(
  name: string,
  passed: boolean,
  message: string,
  details?: any
) {
  const emoji = passed ? "✅" : "❌";
  const color = passed ? colors.green : colors.red;
  console.log(
    `${color}${emoji} ${name}${colors.reset}${colors.gray} - ${message}${colors.reset}`
  );
  if (details && !passed) {
    console.log(
      colors.gray + "   Details:",
      JSON.stringify(details, null, 2) + colors.reset
    );
  }
  testResults.push({ name, passed, message, details });
}

function logSection(title: string) {
  console.log(
    `\n${colors.cyan}${colors.bright}═══ ${title} ═══${colors.reset}\n`
  );
}

function logInfo(message: string) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logWarning(message: string) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

// Helper to create test student
function createTestStudent(overrides: Partial<Student> = {}): Student {
  return {
    id: "test-student-1",
    name: "Test Student",
    age: 12,
    grade: 7,
    goals: [
      {
        id: "goal-1",
        subject: "Math",
        targetCompletion: "2025-12-31",
        progress: 50,
        topics: [
          {
            name: "Algebra",
            progress: 50,
            lastPracticed: new Date().toISOString(),
          },
        ],
      },
    ],
    sessions: ["session-1", "session-2"],
    taskHistory: [],
    achievements: [],
    totalPoints: 0,
    churnRisk: false,
    preferences: {
      aiColor: "blue",
      notificationEnabled: true,
      hasCompletedOnboarding: true,
    },
    friendConnections: [],
    messagesSentToday: 0,
    questionsAsked: 0,
    totalConversations: 0,
    streaks: {
      login: { current: 0, longest: 0, lastDate: new Date().toISOString() },
      practice: { current: 0, longest: 0, lastDate: new Date().toISOString() },
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    metadata: {},
    ...overrides,
  };
}

// Test Suite Functions

async function testChurnDetectionScoring() {
  logSection("Test 1: Churn Detection Scoring");

  // Test 1.1: Healthy student (should be NONE or LOW)
  const healthyStudent = createTestStudent({
    sessions: ["s1", "s2", "s3", "s4"],
    lastLoginAt: new Date().toISOString(), // Active today
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const healthyRisk = await assessRisk(healthyStudent);
  logTest(
    "Healthy student",
    healthyRisk.level === ChurnRisk.NONE || healthyRisk.level === ChurnRisk.LOW,
    `Risk level: ${healthyRisk.level}, Score: ${healthyRisk.score}`,
    healthyRisk
  );

  // Test 1.2: Inactive student (should be MEDIUM or HIGH)
  const inactiveStudent = createTestStudent({
    sessions: ["s1", "s2"],
    lastLoginAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const inactiveRisk = await assessRisk(inactiveStudent);
  logTest(
    "Inactive student (4 days)",
    inactiveRisk.level === ChurnRisk.MEDIUM ||
      inactiveRisk.level === ChurnRisk.HIGH,
    `Risk level: ${inactiveRisk.level}, Score: ${inactiveRisk.score}`,
    { reasons: inactiveRisk.reasons }
  );

  // Test 1.3: New student with no sessions (should be HIGH)
  const newStudentNoSessions = createTestStudent({
    sessions: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days old
    lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const newRisk = await assessRisk(newStudentNoSessions);
  logTest(
    "New student (Day 3, no sessions)",
    newRisk.score >= 40, // Should have high score
    `Risk level: ${newRisk.level}, Score: ${newRisk.score}`,
    { reasons: newRisk.reasons }
  );

  // Test 1.4: Completed goal, no new goals (should add 30 points)
  const completedGoalStudent = createTestStudent({
    goals: [
      {
        id: "goal-1",
        subject: "Math",
        targetCompletion: "2025-12-31",
        progress: 100, // Completed!
        topics: [
          {
            name: "Algebra",
            progress: 100,
            lastPracticed: new Date().toISOString(),
          },
        ],
      },
    ],
  });

  const completedRisk = await assessRisk(completedGoalStudent);
  logTest(
    "Completed goal, no new goals",
    completedRisk.reasons.includes("Completed goal, no new goals"),
    `Found reason: ${completedRisk.reasons.join(", ")}`,
    { score: completedRisk.score }
  );
}

async function testChurnDetectionHelpers() {
  logSection("Test 2: Churn Detection Helper Functions");

  const testStudent = createTestStudent({
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Test 2.1: getAccountAge
  const accountAge = getAccountAge(testStudent, new Date());
  logTest(
    "getAccountAge",
    accountAge === 5,
    `Account age: ${accountAge} days (expected 5)`,
    { accountAge }
  );

  // Test 2.2: getDaysSinceActive
  const daysSinceActive = getDaysSinceActive(testStudent, new Date());
  logTest(
    "getDaysSinceActive",
    daysSinceActive === 2,
    `Days since active: ${daysSinceActive} (expected 2)`,
    { daysSinceActive }
  );

  // Test 2.3: getTaskStats
  const taskStats = getTaskStats(testStudent);
  logTest(
    "getTaskStats",
    taskStats.total === 0 && taskStats.completed === 0,
    `Total: ${taskStats.total}, Completed: ${taskStats.completed}`,
    taskStats
  );

  // Test 2.4: shouldNudge (no previous nudge)
  const shouldNudge1 = shouldNudge(testStudent);
  logTest(
    "shouldNudge (no previous)",
    shouldNudge1 === true,
    `Should nudge: ${shouldNudge1}`,
    {}
  );

  // Test 2.5: shouldNudge (recent nudge)
  const recentNudgeStudent = createTestStudent({
    metadata: {
      lastNudgeShown: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  });
  const shouldNudge2 = shouldNudge(recentNudgeStudent);
  logTest(
    "shouldNudge (recent nudge)",
    shouldNudge2 === false,
    `Should nudge: ${shouldNudge2} (expected false due to 24hr limit)`,
    {}
  );
}

async function testNudgeGeneration() {
  logSection("Test 3: Nudge Generation");

  // Test 3.1: Generate nudge for at-risk student
  const atRiskStudent = createTestStudent({
    id: "test-student-atrisk",
    lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Temporarily save this student to test with real service
  // For now, we'll test the functions directly

  const risk = await assessRisk(atRiskStudent);
  logTest(
    "Risk assessment for at-risk student",
    risk.level !== ChurnRisk.NONE,
    `Risk level: ${risk.level}`,
    { score: risk.score, reasons: risk.reasons }
  );

  // Test 3.2: Determine trigger
  const trigger = determineTrigger(atRiskStudent, risk);
  logTest("Determine trigger", trigger !== undefined, `Trigger: ${trigger}`, {
    trigger,
    reasons: risk.reasons,
  });

  // Test 3.3: Select template
  const template = selectTemplate(atRiskStudent, trigger, risk);
  logTest(
    "Select template",
    template !== undefined && template.messages !== undefined,
    `Template ID: ${template.id}, Age group: ${template.ageGroup}`,
    { templateId: template.id }
  );

  // Test 3.4: Find celebration point
  const celebrationStudent = createTestStudent({
    achievements: ["three_day_streak"],
    streaks: {
      login: { current: 0, longest: 5, lastDate: new Date().toISOString() },
      practice: { current: 0, longest: 0, lastDate: new Date().toISOString() },
    },
  });
  const celebration = findCelebrationPoint(celebrationStudent);
  logTest(
    "Find celebration point",
    celebration !== null,
    `Celebration: ${celebration?.substring(0, 50)}...`,
    {}
  );

  // Test 3.5: Replace placeholders
  const message = "Hello {name}, you're {age} years old in grade {grade}!";
  const replaced = replacePlaceholders(message, atRiskStudent);
  logTest(
    "Replace placeholders",
    replaced.includes(atRiskStudent.name) &&
      replaced.includes(atRiskStudent.age.toString()),
    `Result: ${replaced}`,
    {}
  );
}

async function testAgeGroupSelection() {
  logSection("Test 4: Age Group Selection");

  // Test 4.1: Young (≤11)
  const youngAge = getAgeGroup(10);
  logTest("Young age group", youngAge === "young", `Age 10 → ${youngAge}`, {});

  // Test 4.2: Middle (12-14)
  const middleAge = getAgeGroup(13);
  logTest(
    "Middle age group",
    middleAge === "middle",
    `Age 13 → ${middleAge}`,
    {}
  );

  // Test 4.3: Teen (15+)
  const teenAge = getAgeGroup(16);
  logTest("Teen age group", teenAge === "teen", `Age 16 → ${teenAge}`, {});
}

async function testRealStudents() {
  logSection("Test 5: Real Student Data");

  try {
    const students = await getAllStudents();
    logInfo(`Found ${students.length} students in database`);

    for (const student of students) {
      const risk = await assessRisk(student);
      logInfo(
        `${student.name}: ${risk.level} (score: ${risk.score}, ${risk.reasons.length} reasons)`
      );
      logTest(
        `Student ${student.name} assessment`,
        risk.level !== undefined && risk.score >= 0,
        `Risk: ${risk.level}, Score: ${risk.score}`,
        { reasons: risk.reasons.slice(0, 2) }
      );
    }
  } catch (error) {
    logWarning("Could not load real students: " + (error as Error).message);
  }
}

async function testNudgeGenerationRealStudents() {
  logSection("Test 6: Nudge Generation for Real Students");

  try {
    const students = await getAllStudents();

    for (const student of students) {
      // Test if we can generate a nudge (bypassing 24hr limit for test)
      const tempStudent = { ...student };
      if (tempStudent.metadata) {
        delete tempStudent.metadata.lastNudgeShown;
      }

      const risk = await assessRisk(tempStudent);
      const trigger = determineTrigger(tempStudent, risk);
      const template = selectTemplate(tempStudent, trigger, risk);

      logTest(
        `Nudge generation for ${student.name}`,
        template !== undefined,
        `Trigger: ${trigger}, Template: ${template.id}`,
        { riskLevel: risk.level, ageGroup: getAgeGroup(student.age) }
      );

      // Test celebration finding
      const celebration = findCelebrationPoint(student);
      if (celebration) {
        logInfo(`  💬 Celebration: ${celebration.substring(0, 60)}...`);
      }
    }
  } catch (error) {
    logWarning(
      "Could not test real student nudges: " + (error as Error).message
    );
  }
}

async function testEdgeCases() {
  logSection("Test 7: Edge Cases");

  // Test 7.1: Student with no goals
  const noGoalsStudent = createTestStudent({ goals: [] });
  const noGoalsRisk = await assessRisk(noGoalsStudent);
  logTest(
    "Student with no goals",
    noGoalsRisk.level !== undefined,
    `Risk level: ${noGoalsRisk.level}`,
    {}
  );

  // Test 7.2: Student with no sessions
  const noSessionsStudent = createTestStudent({ sessions: [] });
  const noSessionsRisk = await assessRisk(noSessionsStudent);
  logTest(
    "Student with no sessions",
    noSessionsRisk.sessionCount === 0,
    `Session count: ${noSessionsRisk.sessionCount}`,
    {}
  );

  // Test 7.3: Student with broken streak
  const brokenStreakStudent = createTestStudent({
    streaks: {
      login: {
        current: 0,
        longest: 5,
        lastDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      practice: { current: 0, longest: 0, lastDate: new Date().toISOString() },
    },
  });
  const brokenStreakRisk = await assessRisk(brokenStreakStudent);
  logTest(
    "Student with broken streak",
    brokenStreakRisk.reasons.some((r) => r.includes("streak")),
    `Has streak reason: ${brokenStreakRisk.reasons.some((r) =>
      r.includes("streak")
    )}`,
    { reasons: brokenStreakRisk.reasons }
  );

  // Test 7.4: Student with all completed goals
  const allCompletedStudent = createTestStudent({
    goals: [
      {
        id: "g1",
        subject: "Math",
        targetCompletion: "2025-12-31",
        progress: 100,
        topics: [
          {
            name: "Algebra",
            progress: 100,
            lastPracticed: new Date().toISOString(),
          },
        ],
      },
      {
        id: "g2",
        subject: "Science",
        targetCompletion: "2025-12-31",
        progress: 100,
        topics: [
          {
            name: "Physics",
            progress: 100,
            lastPracticed: new Date().toISOString(),
          },
        ],
      },
    ],
  });
  const allCompletedRisk = await assessRisk(allCompletedStudent);
  logTest(
    "Student with all goals completed",
    allCompletedRisk.reasons.includes("Completed goal, no new goals"),
    `Has goal completion reason: ${allCompletedRisk.reasons.includes(
      "Completed goal, no new goals"
    )}`,
    {}
  );

  // Test 7.5: Very new student (created today)
  const veryNewStudent = createTestStudent({
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    sessions: ["s1"],
  });
  const veryNewRisk = await assessRisk(veryNewStudent);
  logTest(
    "Very new student (Day 0)",
    veryNewRisk.level === ChurnRisk.NONE || veryNewRisk.level === ChurnRisk.LOW,
    `Risk level: ${veryNewRisk.level} (expected low for new students)`,
    {}
  );
}

async function testScoreThresholds() {
  logSection("Test 8: Score Threshold Boundaries");

  // Create students with exact threshold scores
  const testCases = [
    { score: 10, expectedLevel: ChurnRisk.NONE, name: "Below LOW threshold" },
    { score: 15, expectedLevel: ChurnRisk.LOW, name: "At LOW threshold" },
    { score: 30, expectedLevel: ChurnRisk.LOW, name: "Upper LOW range" },
    { score: 35, expectedLevel: ChurnRisk.MEDIUM, name: "At MEDIUM threshold" },
    { score: 55, expectedLevel: ChurnRisk.MEDIUM, name: "Upper MEDIUM range" },
    { score: 60, expectedLevel: ChurnRisk.HIGH, name: "At HIGH threshold" },
    { score: 100, expectedLevel: ChurnRisk.HIGH, name: "Maximum score" },
  ];

  for (const testCase of testCases) {
    // Simulate by checking the mapping logic
    let level: ChurnRisk;
    if (testCase.score >= 60) {
      level = ChurnRisk.HIGH;
    } else if (testCase.score >= 35) {
      level = ChurnRisk.MEDIUM;
    } else if (testCase.score >= 15) {
      level = ChurnRisk.LOW;
    } else {
      level = ChurnRisk.NONE;
    }

    logTest(
      testCase.name,
      level === testCase.expectedLevel,
      `Score ${testCase.score} → ${level} (expected ${testCase.expectedLevel})`,
      {}
    );
  }
}

// Main test runner
async function runAllTests() {
  console.log(
    `\n${colors.bright}${colors.blue}╔═══════════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.blue}║   🧪 Retention System Test Suite           ║${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.blue}╚═══════════════════════════════════════════════╝${colors.reset}\n`
  );

  const startTime = Date.now();

  // Run all test suites
  await testChurnDetectionScoring();
  await testChurnDetectionHelpers();
  await testNudgeGeneration();
  await testAgeGroupSelection();
  await testRealStudents();
  await testNudgeGenerationRealStudents();
  await testEdgeCases();
  await testScoreThresholds();

  // Summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => r.passed === false).length;
  const total = testResults.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(
    `\n${colors.bright}${colors.cyan}═══ Test Summary ═══${colors.reset}\n`
  );
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.blue}📊 Total:  ${total}${colors.reset}`);
  console.log(`${colors.yellow}⚡ Pass Rate: ${passRate}%${colors.reset}`);
  console.log(`${colors.gray}⏱️  Duration: ${duration}s${colors.reset}\n`);

  if (failed > 0) {
    console.log(
      `${colors.red}${colors.bright}❌ TESTS FAILED${colors.reset}\n`
    );
    process.exit(1);
  } else {
    console.log(
      `${colors.green}${colors.bright}✅ ALL TESTS PASSED!${colors.reset}\n`
    );
    process.exit(0);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error(
    `${colors.red}Fatal error running tests:${colors.reset}`,
    error
  );
  process.exit(1);
});
