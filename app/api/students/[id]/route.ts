import { NextResponse } from "next/server";
import {
  getStudentById,
  updateStudentProfile,
} from "@/lib/services/studentService";

// Force dynamic rendering, no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`API: Received GET request for student ID: ${id}`);
    const student = await getStudentById(id);

    if (!student) {
      console.log(`API: Student not found with ID: ${id}`);
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    console.log(`API: Successfully fetched student: ${student.name}`);
    return NextResponse.json(student, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("API: Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const student = await updateStudentProfile(id, updates);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}
