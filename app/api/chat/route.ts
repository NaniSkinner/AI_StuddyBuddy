import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/services/aiService";
import { getStudentById } from "@/lib/services/studentService";
import { moderateMessage } from "@/lib/services/safetyService";
import { Message, Student } from "@/types";
import { getRecentSessions } from "@/lib/services/sessionService";

/**
 * Detect which goal/topic the student is currently discussing
 * Uses recent messages to match against student's goals
 */
async function detectCurrentGoal(
  student: Student,
  messages: Message[]
): Promise<string | null> {
  if (student.goals.length === 0) return null;
  if (messages.length === 0) return student.goals[0].id;

  // Get last 5 messages to analyze
  const recentMessages = messages.slice(-5);
  const conversationText = recentMessages
    .map((m) => m.message)
    .join(" ")
    .toLowerCase();

  // Score each goal based on keyword matches
  const goalScores = student.goals.map((goal) => {
    let score = 0;
    const goalKeywords = [
      goal.subject.toLowerCase(),
      ...goal.topics.map((t) => t.name.toLowerCase()),
    ];

    // Check if any keywords appear in recent conversation
    goalKeywords.forEach((keyword) => {
      const keywordParts = keyword.split(" ");
      keywordParts.forEach((part) => {
        if (conversationText.includes(part)) {
          score += 1;
        }
      });
    });

    return { goalId: goal.id, score, subject: goal.subject };
  });

  // Sort by score
  goalScores.sort((a, b) => b.score - a.score);

  // If top score is 0, default to first goal
  if (goalScores[0].score === 0) {
    return student.goals[0].id;
  }

  console.log(
    "🎯 Detected topic:",
    goalScores[0].subject,
    "with score:",
    goalScores[0].score
  );

  return goalScores[0].goalId;
}

export async function POST(request: Request) {
  try {
    console.log("🤖 Chat API: Request received");

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY is not configured!");
      return NextResponse.json(
        {
          error:
            "AI service is not configured. Please add OPENAI_API_KEY to .env.local",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { studentId, message, sessionId, conversationHistory } = body;
    console.log(
      "📝 Message from student:",
      studentId,
      "-",
      message.substring(0, 50)
    );

    // Validate required fields
    if (!studentId || !message) {
      return NextResponse.json(
        { error: "Missing required fields: studentId and message" },
        { status: 400 }
      );
    }

    // Get student data
    console.log("👤 Fetching student data...");
    const student = await getStudentById(studentId);
    if (!student) {
      console.error("❌ Student not found:", studentId);
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    console.log("✅ Student found:", student.name, "age:", student.age);

    // Moderate the message (safety check)
    const moderation = await moderateMessage(
      message,
      studentId,
      sessionId || "current"
    );
    if (!moderation.approved) {
      return NextResponse.json({
        response:
          moderation.alternativeResponse ||
          "Let's keep our conversation focused on learning!",
        flagged: true,
        reason: moderation.reason,
      });
    }

    // Prepare conversation history
    const messages: Message[] = conversationHistory || [];

    // Add the new user message
    messages.push({
      speaker: "student",
      message: message,
      timestamp: new Date().toISOString(),
    });

    // Get recent sessions for context (optional)
    const recentSessions = await getRecentSessions(studentId, 3);

    // Generate AI response using OpenAI
    console.log("🧠 Calling OpenAI with", messages.length, "messages...");
    const aiResponse = await generateAIResponse(
      student,
      messages,
      recentSessions
    );
    console.log(
      "✅ OpenAI response received:",
      aiResponse.substring(0, 50) + "..."
    );

    // Detect current topic from conversation
    const detectedGoalId = await detectCurrentGoal(student, messages);

    return NextResponse.json({
      response: aiResponse,
      flagged: false,
      currentGoalId: detectedGoalId,
    });
  } catch (error) {
    console.error("❌ Chat API error:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.stack : error
    );

    // Return a user-friendly error
    return NextResponse.json(
      {
        error:
          "I'm having trouble thinking right now. Can you try asking again?",
        technical: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
