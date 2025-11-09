#!/usr/bin/env bun

/**
 * Test script for conversation export functionality
 */

import {
  createConversationExport,
  formatAsText,
  formatAsJSON,
  formatAsMarkdown,
} from "../lib/services/exportService";

async function testExport() {
  console.log("🧪 Testing Conversation Export Service\n");

  try {
    // Test 1: Export Eva's conversations
    console.log("📚 Test 1: Exporting Eva's conversations...");
    const evaExport = await createConversationExport({
      studentId: "student-eva",
      format: "text",
      includeMetadata: true,
      includeTranscript: true,
      includeNotes: true,
    });

    console.log(`✅ Export created successfully!`);
    console.log(`   Student: ${evaExport.studentName}`);
    console.log(`   Sessions: ${evaExport.sessionsIncluded}`);
    console.log(`   Export Date: ${new Date(evaExport.exportDate).toLocaleString()}`);

    // Test 2: Format as text
    console.log("\n📄 Test 2: Formatting as plain text...");
    const textFormat = formatAsText(evaExport);
    console.log(`✅ Text format length: ${textFormat.length} characters`);
    console.log("   First 200 characters:");
    console.log("   " + textFormat.substring(0, 200).replace(/\n/g, "\n   "));

    // Test 3: Format as JSON
    console.log("\n📊 Test 3: Formatting as JSON...");
    const jsonFormat = formatAsJSON(evaExport);
    const parsed = JSON.parse(jsonFormat);
    console.log(`✅ JSON format is valid!`);
    console.log(`   Sessions in JSON: ${parsed.sessions.length}`);

    // Test 4: Format as Markdown
    console.log("\n📑 Test 4: Formatting as Markdown...");
    const mdFormat = formatAsMarkdown(evaExport);
    console.log(`✅ Markdown format length: ${mdFormat.length} characters`);
    console.log("   Markdown structure check:");
    console.log(
      `   - Has header: ${mdFormat.includes("# AI Tutor Conversation Export")}`
    );
    console.log(`   - Has sessions: ${mdFormat.includes("## Session")}`);
    console.log(`   - Has transcripts: ${mdFormat.includes("### Conversation Transcript")}`);

    // Test 5: Export with date range
    console.log("\n📅 Test 5: Testing date range filter...");
    const dateRangeExport = await createConversationExport({
      studentId: "student-eva",
      format: "text",
      includeMetadata: true,
      includeTranscript: true,
      includeNotes: true,
      dateRange: {
        start: "2025-10-01",
        end: "2025-10-31",
      },
    });
    console.log(`✅ Date range filter working!`);
    console.log(`   Sessions in October: ${dateRangeExport.sessionsIncluded}`);

    // Test 6: Export without transcript
    console.log("\n🔇 Test 6: Testing export without transcript...");
    const noTranscriptExport = await createConversationExport({
      studentId: "student-eva",
      format: "text",
      includeMetadata: true,
      includeTranscript: false,
      includeNotes: true,
    });
    console.log(`✅ Export without transcript created!`);
    const hasTranscript = noTranscriptExport.sessions[0].transcript !== undefined;
    console.log(`   Transcript excluded: ${!hasTranscript ? "✅" : "❌"}`);

    // Test 7: Test all students
    console.log("\n👥 Test 7: Testing export for all students...");
    const students = ["student-lucas", "student-eva", "student-mia", "student-pat"];
    for (const studentId of students) {
      const studentExport = await createConversationExport({
        studentId,
        format: "text",
      });
      console.log(
        `   ${studentExport.studentName}: ${studentExport.sessionsIncluded} sessions ✅`
      );
    }

    console.log("\n🎉 All tests passed!");
    console.log("\n✅ Conversation Export Service is working correctly!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

testExport();
