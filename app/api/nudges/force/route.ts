import { NextRequest, NextResponse } from "next/server";
import { generateNudge } from "@/lib/services/nudgeService";
import { getStudentById } from "@/lib/services/studentService";

/**
 * POST /api/nudges/force
 * Force generate a contextual nudge based on current conversation
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
    const body = await request.json();
    const { studentId, messages } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const student = await getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const originalMetadata = student.metadata ? { ...student.metadata } : {};
    if (!student.metadata) {
      student.metadata = {};
    }
    delete student.metadata.lastNudgeShown;

    let nudge = await generateNudge(studentId);

    student.metadata = originalMetadata;

    if (!nudge || messages) {
      const {
        selectTemplate,
        findCelebrationPoint,
        replacePlaceholders,
        getExpirationTime,
      } = await import("@/lib/services/nudgeService");
      const { assessRisk } = await import(
        "@/lib/services/churnDetectionService"
      );

      const risk = await assessRisk(student);

      let celebration = "";
      let encouragement = "";
      let cta = "";

      if (messages && messages.length > 0) {
        const lastMessages = messages.slice(-5);
        const currentTopic = extractTopicFromMessages(lastMessages);

        celebration = currentTopic
          ? `Great work on ${currentTopic}! 🎉`
          : findCelebrationPoint(student) || "You're doing awesome! 🌟";

        if (student.age <= 11) {
          encouragement = currentTopic
            ? `Learning about ${currentTopic} is super cool! Keep asking questions! 💪`
            : "You're such a curious learner! Keep it up! 🚀";
          cta = "Want to learn more fun stuff?";
        } else if (student.age <= 14) {
          encouragement = currentTopic
            ? `${currentTopic} can be challenging, but you're getting the hang of it!`
            : "You're making great progress in your learning journey!";
          cta = "Ready to tackle the next challenge?";
        } else {
          encouragement = currentTopic
            ? `Your understanding of ${currentTopic} is developing well. Keep building on this foundation.`
            : "You're demonstrating strong engagement with the material.";
          cta = "Continue exploring this topic?";
        }
      } else {
        const template = selectTemplate(student, "general_encouragement", risk);
        const celebrationPoint = findCelebrationPoint(student);

        celebration = celebrationPoint || template.messages.celebration || "";
        celebration = replacePlaceholders(celebration, student);
        encouragement = replacePlaceholders(
          template.messages.encouragement,
          student
        );
        cta = replacePlaceholders(template.messages.cta, student);
      }

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

function extractTopicFromMessages(messages: any[]): string | null {
  if (!messages || messages.length === 0) return null;

  const lastAIMessage = messages.reverse().find(m => m.speaker === "ai");
  if (!lastAIMessage) return null;

  const text = lastAIMessage.message.toLowerCase();

  const mathTopics = ["fractions", "algebra", "geometry", "calculus", "math", "equation", "derivative", "integral"];
  const scienceTopics = ["photosynthesis", "cell", "biology", "chemistry", "physics", "science"];
  const englishTopics = ["metaphor", "writing", "essay", "reading", "grammar", "literature"];
  const historyTopics = ["history", "civil war", "world war", "revolution"];

  const allTopics = [...mathTopics, ...scienceTopics, ...englishTopics, ...historyTopics];

  for (const topic of allTopics) {
    if (text.includes(topic)) {
      return topic.charAt(0).toUpperCase() + topic.slice(1);
    }
  }

  return null;
}
