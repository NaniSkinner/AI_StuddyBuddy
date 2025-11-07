import { NextResponse } from "next/server";
import { getAllStudents } from "@/lib/services/studentService";

// Force dynamic rendering, no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const students = await getAllStudents();
    return NextResponse.json(students, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
