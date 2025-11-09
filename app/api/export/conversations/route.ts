import { NextResponse } from "next/server";
import {
  createConversationExport,
  formatAsText,
  formatAsJSON,
  formatAsMarkdown,
  getMimeType,
  generateFilename,
} from "@/lib/services/exportService";
import { ExportOptions } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      format = "text",
      includeMetadata = true,
      includeTranscript = true,
      includeNotes = true,
      sessionIds,
      dateRange,
    } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    const options: ExportOptions = {
      studentId,
      format,
      includeMetadata,
      includeTranscript,
      includeNotes,
      sessionIds,
      dateRange,
    };

    // Create export data
    const exportData = await createConversationExport(options);

    // Format based on requested type
    let content: string;
    let mimeType: string;

    switch (format) {
      case "json":
        content = formatAsJSON(exportData);
        mimeType = getMimeType("json");
        break;
      case "pdf":
        // For PDF, we'll use markdown format and let the client convert it
        // Or use a PDF generation library server-side
        content = formatAsMarkdown(exportData);
        mimeType = "text/markdown"; // Client will handle PDF conversion
        break;
      case "text":
      default:
        content = formatAsText(exportData);
        mimeType = getMimeType("text");
        break;
    }

    const filename = generateFilename(exportData.studentName, format);

    // Return the formatted content
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: "Failed to export conversations" },
      { status: 500 }
    );
  }
}

// GET endpoint to preview export without downloading
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const format = (searchParams.get("format") || "text") as
      | "pdf"
      | "text"
      | "json";

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    const options: ExportOptions = {
      studentId,
      format,
      includeMetadata: true,
      includeTranscript: true,
      includeNotes: true,
    };

    const exportData = await createConversationExport(options);

    // Return preview metadata with full session details for dropdown
    return NextResponse.json({
      studentName: exportData.studentName,
      sessionsIncluded: exportData.sessionsIncluded,
      exportDate: exportData.exportDate,
      sessions: exportData.sessions.map((s) => ({
        sessionId: s.sessionId,
        date: s.date,
        tutorName: s.tutorName,
        duration: s.duration,
        topicsCovered: s.topicsCovered,
        engagement: s.engagement,
        transcript: s.transcript, // Include for preview
        tutorNotes: s.tutorNotes,
        strugglingConcepts: s.strugglingConcepts,
      })),
    });
  } catch (error) {
    console.error("Export preview API error:", error);
    return NextResponse.json(
      { error: "Failed to generate export preview" },
      { status: 500 }
    );
  }
}
