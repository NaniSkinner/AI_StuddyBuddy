import { NextResponse } from "next/server";
import {
  getPendingFriendRequests,
  getSentFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "@/lib/services/friendConnectionService";
import { getStudentById } from "@/lib/services/studentService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const type = searchParams.get("type"); // "pending" or "sent"

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    if (type === "pending") {
      const requests = await getPendingFriendRequests(studentId);

      // Enrich requests with sender information
      const enrichedRequests = await Promise.all(
        requests.map(async (req) => {
          const sender = await getStudentById(req.fromStudentId);
          return {
            ...req,
            sender,
          };
        })
      );

      return NextResponse.json({ requests: enrichedRequests });
    }

    if (type === "sent") {
      const requests = await getSentFriendRequests(studentId);

      // Enrich requests with recipient information
      const enrichedRequests = await Promise.all(
        requests.map(async (req) => {
          const recipient = await getStudentById(req.toStudentId);
          return {
            ...req,
            recipient,
          };
        })
      );

      return NextResponse.json({ requests: enrichedRequests });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Friend requests API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch friend requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, fromStudentId, toStudentId, requestId } = body;

    if (action === "send") {
      if (!fromStudentId || !toStudentId) {
        return NextResponse.json(
          { error: "fromStudentId and toStudentId are required" },
          { status: 400 }
        );
      }
      const newRequest = await sendFriendRequest(fromStudentId, toStudentId);
      return NextResponse.json({ request: newRequest });
    }

    if (action === "accept") {
      if (!requestId) {
        return NextResponse.json(
          { error: "requestId is required" },
          { status: 400 }
        );
      }
      const acceptedRequest = await acceptFriendRequest(requestId);
      return NextResponse.json({ request: acceptedRequest });
    }

    if (action === "decline") {
      if (!requestId) {
        return NextResponse.json(
          { error: "requestId is required" },
          { status: 400 }
        );
      }
      const declinedRequest = await declineFriendRequest(requestId);
      return NextResponse.json({ request: declinedRequest });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Friend requests POST error:", error);
    return NextResponse.json(
      { error: "Failed to process friend request" },
      { status: 500 }
    );
  }
}
