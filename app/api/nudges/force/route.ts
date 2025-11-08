import { NextRequest, NextResponse } from "next/server";
import { generateNudge } from "@/lib/services/nudgeService";
import { getStudentById } from "@/lib/services/studentService";

/**
 * POST /api/nudges/force
 * Force generate a nudge for demo purposes (bypasses 24hr limit)
 * Only works in development mode
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Force nudge only available in development" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const scenario = searchParams.get("scenario");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Get student
    const student = await getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // If scenario specified, temporarily modify student state
    // For demo purposes, we just generate normally
    // In a more advanced implementation, you could mock student state here

    // Temporarily clear last nudge shown to bypass limit
    const originalMetadata = student.metadata ? { ...student.metadata } : {};
    if (!student.metadata) {
      student.metadata = {};
    }
    delete student.metadata.lastNudgeShown;

    // Generate nudge
    let nudge = await generateNudge(studentId);

    // Restore metadata
    student.metadata = originalMetadata;

    // If no nudge generated (risk too low), force a general encouragement
    if (!nudge) {
      const {
        getAgeGroup,
        selectTemplate,
        findCelebrationPoint,
        replacePlaceholders,
        getExpirationTime,
      } = await import("@/lib/services/nudgeService");
      const { assessRisk } = await import(
        "@/lib/services/churnDetectionService"
      );

      const risk = await assessRisk(student);
      const template = selectTemplate(student, "general_encouragement", risk);
      const celebrationPoint = findCelebrationPoint(student);

      let celebration = celebrationPoint || template.messages.celebration || "";
      celebration = replacePlaceholders(celebration, student);
      const encouragement = replacePlaceholders(
        template.messages.encouragement,
        student
      );
      const cta = replacePlaceholders(template.messages.cta, student);

      nudge = {
        id: `nudge-demo-${Date.now()}`,
        studentId: student.id,
        type: "nudge",
        trigger: "general_encouragement",
        celebration,
        encouragement,
        cta,
        priority: "low",
        createdAt: new Date().toISOString(),
        expiresAt: getExpirationTime(),
      };
    }

    return NextResponse.json({ nudge });
  } catch (error) {
    console.error("Error in POST /api/nudges/force:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
