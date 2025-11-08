import { NextResponse } from "next/server";
import {
  getFriendConnections,
  getPotentialFriends,
  initializeDemoFriendData,
} from "@/lib/services/friendConnectionService";

// Initialize demo data on server startup
initializeDemoFriendData();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const action = searchParams.get("action");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    if (action === "connections") {
      const friends = await getFriendConnections(studentId);
      return NextResponse.json({ friends });
    }

    if (action === "potential") {
      const potentials = await getPotentialFriends(studentId);
      return NextResponse.json({ potentials });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Friends API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
