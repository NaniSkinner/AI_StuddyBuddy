import {
  Session,
  ExportOptions,
  ConversationExport,
  ExportedSession,
} from "@/types";
import { getSessionsByStudent } from "./sessionService";
import { getStudentById } from "./studentService";

/**
 * Export conversations in various formats for parent review
 */

/**
 * Get sessions to export based on options
 */
async function getSessionsToExport(
  options: ExportOptions
): Promise<Session[]> {
  const allSessions = await getSessionsByStudent(options.studentId);

  let filtered = allSessions;

  // Filter by specific session IDs if provided
  if (options.sessionIds && options.sessionIds.length > 0) {
    filtered = filtered.filter((s) => options.sessionIds!.includes(s.id));
  }

  // Filter by date range if provided
  if (options.dateRange) {
    const start = new Date(options.dateRange.start);
    const end = new Date(options.dateRange.end);

    filtered = filtered.filter((s) => {
      const sessionDate = new Date(s.date);
      return sessionDate >= start && sessionDate <= end;
    });
  }

  // Sort by date (most recent first)
  return filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Generate session summary from transcript
 */
function generateSessionSummary(session: Session): string {
  const topics = session.topicsCovered.map((tc) => tc.topic).join(", ");
  const studentMessages = session.transcript.filter(
    (t) => t.speaker === "student"
  ).length;
  const tutorMessages = session.transcript.filter(
    (t) => t.speaker === "tutor"
  ).length;

  let summary = `This session focused on ${topics}. `;
  summary += `The conversation included ${studentMessages} student responses and ${tutorMessages} tutor prompts. `;

  if (session.studentEngagement === "high") {
    summary += "Student showed high engagement throughout the session.";
  } else if (session.studentEngagement === "medium") {
    summary += "Student maintained moderate engagement during the session.";
  } else {
    summary += "Student engagement was lower than usual.";
  }

  return summary;
}

/**
 * Extract homework/next steps from transcript
 */
function extractHomeworkAndNextSteps(session: Session): {
  homework: string[];
  nextSteps: string[];
} {
  const homework: string[] = [];
  const nextSteps: string[] = [];

  // Look for keywords in tutor messages
  const tutorMessages = session.transcript.filter((t) => t.speaker === "tutor");

  tutorMessages.forEach((msg) => {
    const lower = msg.message.toLowerCase();

    // Detect homework assignments
    if (
      lower.includes("homework") ||
      lower.includes("practice") ||
      lower.includes("try") ||
      lower.includes("work on")
    ) {
      homework.push(msg.message);
    }

    // Detect next steps
    if (
      lower.includes("next time") ||
      lower.includes("next session") ||
      lower.includes("moving forward") ||
      lower.includes("continue")
    ) {
      nextSteps.push(msg.message);
    }
  });

  // If no specific homework found, suggest practice based on topics
  if (homework.length === 0 && session.topicsCovered.length > 0) {
    session.topicsCovered.forEach((topic) => {
      if (topic.masteryLevel < 70) {
        homework.push(
          `Practice ${topic.topic} - especially ${topic.subConcepts.join(", ")}`
        );
      }
    });
  }

  // If no next steps found, create them based on progress
  if (nextSteps.length === 0) {
    if (session.strugglingConcepts.length > 0) {
      nextSteps.push(
        `Continue working on: ${session.strugglingConcepts.join(", ")}`
      );
    }
    if (session.topicsCovered.length > 0) {
      const nextTopic = session.topicsCovered[session.topicsCovered.length - 1];
      if (nextTopic.masteryLevel >= 70) {
        nextSteps.push(`Ready to advance to more complex ${nextTopic.topic} concepts`);
      }
    }
  }

  return { homework, nextSteps };
}

/**
 * Transform session into export format
 */
function transformSessionForExport(
  session: Session,
  options: ExportOptions
): ExportedSession {
  const exported: ExportedSession = {
    sessionId: session.id,
    date: session.date,
    tutorName: session.tutorId.replace("tutor-", "").replace(/-/g, " "),
    duration: session.duration,
    topicsCovered: session.topicsCovered.map((tc) => tc.topic),
    engagement: session.studentEngagement,
  };

  // Include transcript if requested (default: true)
  if (options.includeTranscript !== false) {
    exported.transcript = session.transcript;
  }

  // Include tutor notes if requested (default: true)
  if (options.includeNotes !== false) {
    exported.tutorNotes = session.tutorNotes;
    exported.strugglingConcepts = session.strugglingConcepts;
  }

  return exported;
}

/**
 * Create conversation export data structure
 */
export async function createConversationExport(
  options: ExportOptions
): Promise<ConversationExport> {
  const student = await getStudentById(options.studentId);
  const sessions = await getSessionsToExport(options);

  if (!student) {
    throw new Error(`Student not found: ${options.studentId}`);
  }

  const exportData: ConversationExport = {
    studentName: student.name,
    studentId: student.id,
    exportDate: new Date().toISOString(),
    sessionsIncluded: sessions.length,
    sessions: sessions.map((s) => transformSessionForExport(s, options)),
  };

  return exportData;
}

/**
 * Format export as plain text
 */
export function formatAsText(exportData: ConversationExport): string {
  let text = "";

  // Header
  text += "=" .repeat(60) + "\n";
  text += `AI TUTOR CONVERSATION EXPORT\n`;
  text += `Student: ${exportData.studentName}\n`;
  text += `Export Date: ${new Date(exportData.exportDate).toLocaleDateString()}\n`;
  text += `Sessions Included: ${exportData.sessionsIncluded}\n`;
  text += "=".repeat(60) + "\n\n";

  // Sessions
  exportData.sessions.forEach((session, index) => {
    text += `-`.repeat(60) + "\n";
    text += `SESSION ${index + 1}\n`;
    text += `-`.repeat(60) + "\n";
    text += `Date: ${new Date(session.date).toLocaleString()}\n`;
    text += `Tutor: ${session.tutorName}\n`;
    text += `Duration: ${session.duration} minutes\n`;
    text += `Engagement Level: ${session.engagement}\n`;
    text += `Topics Covered: ${session.topicsCovered.join(", ")}\n`;

    if (session.strugglingConcepts && session.strugglingConcepts.length > 0) {
      text += `Struggling Concepts: ${session.strugglingConcepts.join(", ")}\n`;
    }

    text += "\n";

    // Transcript
    if (session.transcript) {
      text += "CONVERSATION TRANSCRIPT:\n";
      text += "-".repeat(60) + "\n";

      session.transcript.forEach((entry) => {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        const speaker =
          entry.speaker === "tutor" ? "AI Tutor" : exportData.studentName;
        text += `[${time}] ${speaker}:\n${entry.message}\n\n`;
      });
    }

    // Tutor notes
    if (session.tutorNotes) {
      text += "-".repeat(60) + "\n";
      text += "TUTOR NOTES:\n";
      text += session.tutorNotes + "\n";
    }

    text += "\n\n";
  });

  text += "=".repeat(60) + "\n";
  text += "END OF EXPORT\n";
  text += "=".repeat(60) + "\n";

  return text;
}

/**
 * Format export as JSON
 */
export function formatAsJSON(exportData: ConversationExport): string {
  return JSON.stringify(exportData, null, 2);
}

/**
 * Format export as markdown (for PDF conversion)
 */
export function formatAsMarkdown(exportData: ConversationExport): string {
  let md = "";

  // Header
  md += `# AI Tutor Conversation Export\n\n`;
  md += `**Student:** ${exportData.studentName}  \n`;
  md += `**Export Date:** ${new Date(exportData.exportDate).toLocaleDateString()}  \n`;
  md += `**Sessions Included:** ${exportData.sessionsIncluded}  \n\n`;
  md += `---\n\n`;

  // Sessions
  exportData.sessions.forEach((session, index) => {
    md += `## Session ${index + 1}\n\n`;
    md += `**Date:** ${new Date(session.date).toLocaleString()}  \n`;
    md += `**Tutor:** ${session.tutorName}  \n`;
    md += `**Duration:** ${session.duration} minutes  \n`;
    md += `**Engagement Level:** ${session.engagement}  \n`;
    md += `**Topics Covered:** ${session.topicsCovered.join(", ")}  \n`;

    if (session.strugglingConcepts && session.strugglingConcepts.length > 0) {
      md += `**Struggling Concepts:** ${session.strugglingConcepts.join(", ")}  \n`;
    }

    md += `\n`;

    // Transcript
    if (session.transcript) {
      md += `### Conversation Transcript\n\n`;

      session.transcript.forEach((entry) => {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        const speaker =
          entry.speaker === "tutor"
            ? "**AI Tutor**"
            : `**${exportData.studentName}**`;
        md += `${speaker} _(${time})_  \n`;
        md += `${entry.message}\n\n`;
      });
    }

    // Tutor notes
    if (session.tutorNotes) {
      md += `### Tutor Notes\n\n`;
      md += `${session.tutorNotes}\n\n`;
    }

    md += `---\n\n`;
  });

  md += `*End of Export*\n`;

  return md;
}

/**
 * Get file extension for format
 */
export function getFileExtension(format: "pdf" | "text" | "json"): string {
  switch (format) {
    case "pdf":
      return "pdf";
    case "text":
      return "txt";
    case "json":
      return "json";
  }
}

/**
 * Get MIME type for format
 */
export function getMimeType(
  format: "pdf" | "text" | "json"
): string {
  switch (format) {
    case "pdf":
      return "application/pdf";
    case "text":
      return "text/plain";
    case "json":
      return "application/json";
  }
}

/**
 * Generate filename for export
 */
export function generateFilename(
  studentName: string,
  format: "pdf" | "text" | "json"
): string {
  const sanitizedName = studentName.toLowerCase().replace(/\s+/g, "-");
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const ext = getFileExtension(format);
  return `${sanitizedName}-conversations-${date}.${ext}`;
}
