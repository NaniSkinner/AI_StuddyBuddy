import { Session } from "@/types";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "sessions");

/**
 * Get all sessions for a student
 */
export async function getSessionsByStudent(studentId: string): Promise<Session[]> {
  try {
    const studentName = studentId.replace("student-", "");
    const fileName = `${studentName}-sessions.json`;
    const filePath = path.join(DATA_DIR, fileName);

    const fileContent = await fs.readFile(filePath, "utf-8");
    const sessions = JSON.parse(fileContent) as Session[];

    return sessions;
  } catch (error) {
    console.error(`Error loading sessions for ${studentId}:`, error);
    return [];
  }
}

/**
 * Get specific session by ID
 */
export async function getSessionById(sessionId: string): Promise<Session | null> {
  try {
    // Extract student ID from session ID (e.g., "session-lucas-1" -> "lucas")
    const parts = sessionId.split("-");
    if (parts.length < 3) return null;

    const studentName = parts[1];
    const fileName = `${studentName}-sessions.json`;
    const filePath = path.join(DATA_DIR, fileName);

    const fileContent = await fs.readFile(filePath, "utf-8");
    const sessions = JSON.parse(fileContent) as Session[];

    return sessions.find((s) => s.id === sessionId) || null;
  } catch (error) {
    console.error(`Error loading session ${sessionId}:`, error);
    return null;
  }
}

/**
 * Get recent sessions for a student
 */
export async function getRecentSessions(
  studentId: string,
  limit: number = 3
): Promise<Session[]> {
  try {
    const sessions = await getSessionsByStudent(studentId);

    // Sort by date (most recent first)
    const sorted = sessions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sorted.slice(0, limit);
  } catch (error) {
    console.error(`Error getting recent sessions for ${studentId}:`, error);
    return [];
  }
}

/**
 * Analyze struggling concepts across sessions
 */
export async function analyzeStrugglingConcepts(
  sessions: Session[]
): Promise<string[]> {
  try {
    const strugglingMap = new Map<string, number>();

    sessions.forEach((session) => {
      session.strugglingConcepts.forEach((concept) => {
        strugglingMap.set(concept, (strugglingMap.get(concept) || 0) + 1);
      });
    });

    // Return concepts that appear in 2+ sessions (persistent struggles)
    return Array.from(strugglingMap.entries())
      .filter(([_, count]) => count >= 2)
      .map(([concept]) => concept);
  } catch (error) {
    console.error("Error analyzing struggling concepts:", error);
    return [];
  }
}

/**
 * Get all topics covered by a student
 */
export async function getTopicsCovered(studentId: string): Promise<string[]> {
  try {
    const sessions = await getSessionsByStudent(studentId);
    const topics = new Set<string>();

    sessions.forEach((session) => {
      session.topicsCovered.forEach((tc) => {
        topics.add(tc.topic);
      });
    });

    return Array.from(topics);
  } catch (error) {
    console.error(`Error getting topics covered for ${studentId}:`, error);
    return [];
  }
}

/**
 * Get session count for a student
 */
export async function getSessionCount(studentId: string): Promise<number> {
  try {
    const sessions = await getSessionsByStudent(studentId);
    return sessions.length;
  } catch (error) {
    console.error(`Error getting session count for ${studentId}:`, error);
    return 0;
  }
}

/**
 * Get last session date for a student
 */
export async function getLastSessionDate(
  studentId: string
): Promise<string | null> {
  try {
    const sessions = await getSessionsByStudent(studentId);
    if (sessions.length === 0) return null;

    // Sort by date and get most recent
    const sorted = sessions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sorted[0].date;
  } catch (error) {
    console.error(`Error getting last session date for ${studentId}:`, error);
    return null;
  }
}

/**
 * Get session summary for AI context
 */
export interface SessionSummary {
  totalSessions: number;
  recentTopics: string[];
  strugglingConcepts: string[];
  lastSessionDate: string | null;
  engagementLevel: "high" | "medium" | "low";
}

export async function getSessionSummary(
  studentId: string
): Promise<SessionSummary> {
  try {
    const sessions = await getSessionsByStudent(studentId);
    const recentSessions = await getRecentSessions(studentId, 3);
    const strugglingConcepts = await analyzeStrugglingConcepts(sessions);
    const lastSessionDate = await getLastSessionDate(studentId);

    // Get recent topics from last 3 sessions
    const recentTopics: string[] = [];
    recentSessions.forEach((session) => {
      session.topicsCovered.forEach((tc) => {
        if (!recentTopics.includes(tc.topic)) {
          recentTopics.push(tc.topic);
        }
      });
    });

    // Calculate average engagement level
    const engagementCounts = { high: 0, medium: 0, low: 0 };
    recentSessions.forEach((session) => {
      engagementCounts[session.studentEngagement]++;
    });

    let engagementLevel: "high" | "medium" | "low" = "medium";
    if (engagementCounts.high > engagementCounts.medium) {
      engagementLevel = "high";
    } else if (engagementCounts.low > engagementCounts.medium) {
      engagementLevel = "low";
    }

    return {
      totalSessions: sessions.length,
      recentTopics,
      strugglingConcepts,
      lastSessionDate,
      engagementLevel,
    };
  } catch (error) {
    console.error(`Error getting session summary for ${studentId}:`, error);
    return {
      totalSessions: 0,
      recentTopics: [],
      strugglingConcepts: [],
      lastSessionDate: null,
      engagementLevel: "medium",
    };
  }
}

/**
 * Find specific topic references in sessions (for AI context)
 */
export async function findTopicReferences(
  studentId: string,
  topicName: string
): Promise<Session[]> {
  try {
    const sessions = await getSessionsByStudent(studentId);

    return sessions.filter((session) =>
      session.topicsCovered.some((tc) =>
        tc.topic.toLowerCase().includes(topicName.toLowerCase())
      )
    );
  } catch (error) {
    console.error(
      `Error finding topic references for ${studentId}, topic: ${topicName}:`,
      error
    );
    return [];
  }
}

