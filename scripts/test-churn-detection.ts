#!/usr/bin/env bun
/**
 * Quick test for churn detection service
 * Tests all 4 students with PRD-spec scoring
 */

import { assessRisk, ChurnRisk } from "../lib/services/churnDetectionService";
import { getStudentById } from "../lib/services/studentService";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

async function testChurnDetection() {
  console.log("\n🧪 CHURN DETECTION TEST\n");
  console.log("Testing PRD-spec churn risk assessment...\n");

  const studentIds = ["student-lucas", "student-eva", "student-pat", "student-mia"];

  for (const studentId of studentIds) {
    try {
      const student = await getStudentById(studentId);
      if (!student) {
        console.log(`${colors.red}❌ Student not found: ${studentId}${colors.reset}\n`);
        continue;
      }

      const assessment = await assessRisk(student);

      // Color code based on risk level
      let statusColor = colors.green;
      let statusEmoji = "✅";
      if (assessment.level === ChurnRisk.HIGH) {
        statusColor = colors.red;
        statusEmoji = "🚨";
      } else if (assessment.level === ChurnRisk.MEDIUM) {
        statusColor = colors.yellow;
        statusEmoji = "⚠️";
      } else if (assessment.level === ChurnRisk.LOW) {
        statusColor = colors.blue;
        statusEmoji = "ℹ️";
      }

      console.log(`${statusColor}${statusEmoji} ${student.name} (${student.age} yo)${colors.reset}`);
      console.log(`   Risk Level: ${statusColor}${assessment.level.toUpperCase()}${colors.reset}`);
      console.log(`   Score: ${assessment.score}/100`);
      console.log(`   Days Since Active: ${assessment.daysSinceActive}`);
      console.log(`   Session Count: ${assessment.sessionCount}`);

      if (assessment.reasons.length > 0) {
        console.log(`   Reasons:`);
        assessment.reasons.forEach((reason) => {
          console.log(`     • ${reason}`);
        });
      }

      if (assessment.interventions.length > 0) {
        console.log(`   ${colors.cyan}Interventions:${colors.reset}`);
        assessment.interventions.forEach((intervention) => {
          console.log(`     → ${intervention}`);
        });
      }

      console.log(); // blank line
    } catch (error) {
      console.log(`${colors.red}❌ Error testing ${studentId}:${colors.reset}`, error);
      console.log();
    }
  }

  console.log("✅ Churn detection test complete!\n");
}

// Run the test
testChurnDetection().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});

