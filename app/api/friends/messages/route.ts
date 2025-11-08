import { NextResponse } from "next/server";
import {
  getConversation,
  sendFriendMessage,
  getDailyMessageLimit,
  markMessagesAsRead,
} from "@/lib/services/friendConnectionService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const friendId = searchParams.get("friendId");
    const action = searchParams.get("action");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    if (action === "limit") {
      const limit = await getDailyMessageLimit(studentId);
      return NextResponse.json({ limit });
    }

    if (action === "conversation") {
      if (!friendId) {
        return NextResponse.json(
          { error: "friendId is required for conversation" },
          { status: 400 }
        );
      }
      const messages = await getConversation(studentId, friendId);
      return NextResponse.json({ messages });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Messages API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, fromStudentId, toStudentId, messageData, friendId } = body;

    if (action === "send") {
      if (!fromStudentId || !toStudentId || !messageData) {
        return NextResponse.json(
          { error: "fromStudentId, toStudentId, and messageData are required" },
          { status: 400 }
        );
      }

      const result = await sendFriendMessage(fromStudentId, toStudentId, messageData);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ message: result.message });
    }

    if (action === "markRead") {
      if (!fromStudentId || !friendId) {
        return NextResponse.json(
          { error: "fromStudentId and friendId are required" },
          { status: 400 }
        );
      }

      await markMessagesAsRead(fromStudentId, friendId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Messages API POST error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
