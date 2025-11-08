import { NextRequest, NextResponse } from "next/server";
import { getTutorById } from "@/lib/services/tutorService";

export async function GET(
  request: NextRequest,
  { params }: { params: { tutorId: string } }
) {
  try {
    const { tutorId } = params;

    if (!tutorId) {
      return NextResponse.json(
        { error: "Tutor ID is required" },
        { status: 400 }
      );
    }

    const tutor = await getTutorById(tutorId);

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tutor);
  } catch (error) {
    console.error("Error fetching tutor:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutor data" },
      { status: 500 }
    );
  }
}
