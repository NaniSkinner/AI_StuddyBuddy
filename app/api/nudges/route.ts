import { NextRequest, NextResponse } from "next/server";
import { generateNudge, markNudgeShown, recordNudgeInteraction } from "@/lib/services/nudgeService";

/**
 * GET /api/nudges
 * Check if student should receive a nudge
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Generate nudge if appropriate
    const nudge = await generateNudge(studentId);

    return NextResponse.json({ nudge });
  } catch (error) {
    console.error("Error in GET /api/nudges:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/nudges
 * Record nudge interaction (shown, accepted, dismissed)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, nudgeId, action } = body;

    if (!studentId || !nudgeId || !action) {
      return NextResponse.json(
        { error: "Student ID, nudge ID, and action are required" },
        { status: 400 }
      );
    }

    if (!["shown", "accepted", "dismissed", "expired"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be: shown, accepted, dismissed, or expired" },
        { status: 400 }
      );
    }

    // Handle "shown" action
    if (action === "shown") {
      await markNudgeShown(studentId, nudgeId);
    } else {
      // Handle other actions
      await recordNudgeInteraction(studentId, nudgeId, action);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/nudges:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

