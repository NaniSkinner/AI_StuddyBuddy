#!/usr/bin/env bun
/**
 * Test nudge generation with celebrate-first structure
 */

import { generateNudge, shouldNudge } from "../lib/services/nudgeService";
import { getStudentById } from "../lib/services/studentService";

// Color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  dim: "\x1b[2m",
};

async function testNudgeGeneration() {
  console.log("\n🎯 NUDGE GENERATION TEST\n");
  console.log("Testing celebrate-first nudge system...\n");

  const studentIds = [
    "student-lucas",
    "student-eva",
    "student-pat",
    "student-mia",
  ];

  for (const studentId of studentIds) {
    try {
      const student = await getStudentById(studentId);
      if (!student) {
        console.log(`${colors.red}❌ Student not found: ${studentId}${colors.reset}\n`);
        continue;
      }

      // Check if should nudge
      const should = shouldNudge(student);
      console.log(
        `${colors.cyan}👤 ${student.name} (${student.age} yo)${colors.reset}`
      );
      console.log(`   Should Nudge: ${should ? colors.green + "YES" + colors.reset : colors.dim + "NO (within 24hr limit)" + colors.reset}`);

      if (!should) {
        console.log();
        continue;
      }

      // Generate nudge
      const nudge = await generateNudge(studentId);

      if (!nudge) {
        console.log(
          `   ${colors.dim}No nudge generated (risk level too low)${colors.reset}\n`
        );
        continue;
      }

      // Display nudge with celebrate-first structure
      console.log(`   ${colors.magenta}Trigger:${colors.reset} ${nudge.trigger}`);
      console.log(
        `   ${colors.yellow}Priority:${colors.reset} ${nudge.priority.toUpperCase()}`
      );
      console.log();
      console.log(`   ${colors.green}🎉 CELEBRATION:${colors.reset}`);
      console.log(`      "${nudge.celebration}"`);
      console.log();
      console.log(`   ${colors.blue}💬 ENCOURAGEMENT:${colors.reset}`);
      console.log(`      "${nudge.encouragement}"`);
      console.log();
      console.log(`   ${colors.cyan}👉 CALL-TO-ACTION:${colors.reset}`);
      console.log(`      "${nudge.cta}"`);
      console.log();
      console.log(`   ${colors.dim}Expires: ${new Date(nudge.expiresAt).toLocaleString()}${colors.reset}`);
      console.log();
    } catch (error) {
      console.log(`${colors.red}❌ Error testing ${studentId}:${colors.reset}`, error);
      console.log();
    }
  }

  console.log("✅ Nudge generation test complete!\n");
}

// Run test
testNudgeGeneration().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});

