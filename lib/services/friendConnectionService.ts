import {
  FriendRequest,
  FriendMessage,
  DailyMessageLimit,
  Student,
} from "@/types";
import { getStudentById } from "./studentService";

// In-memory storage for demo (in production, this would be database)
let friendRequests: FriendRequest[] = [];
let friendMessages: FriendMessage[] = [];
let dailyMessageLimits: DailyMessageLimit[] = [];

/**
 * Get all students that are potential friends (excluding current student)
 */
export async function getPotentialFriends(
  studentId: string
): Promise<Student[]> {
  const student = await getStudentById(studentId);
  if (!student) return [];

  // In real app, would fetch all students from database
  // For now, we'll return hardcoded list based on existing data
  const allStudentIds = [
    "student-eva",
    "student-lucas",
    "student-mia",
    "student-pat",
  ];

  const potentialFriends: Student[] = [];
  for (const id of allStudentIds) {
    if (id === studentId) continue; // Skip current student
    const potentialFriend = await getStudentById(id);
    if (potentialFriend) {
      potentialFriends.push(potentialFriend);
    }
  }

  return potentialFriends;
}

/**
 * Get all friend connections for a student
 */
export async function getFriendConnections(
  studentId: string
): Promise<Student[]> {
  const student = await getStudentById(studentId);
  if (!student || !student.friendConnections) return [];

  const friends: Student[] = [];
  for (const friendId of student.friendConnections) {
    const friend = await getStudentById(friendId);
    if (friend) {
      friends.push(friend);
    }
  }

  return friends;
}

/**
 * Send a friend request
 */
export async function sendFriendRequest(
  fromStudentId: string,
  toStudentId: string
): Promise<FriendRequest> {
  // Check if request already exists
  const existingRequest = friendRequests.find(
    (req) =>
      req.fromStudentId === fromStudentId &&
      req.toStudentId === toStudentId &&
      req.status === "pending"
  );

  if (existingRequest) {
    return existingRequest;
  }

  const newRequest: FriendRequest = {
    id: `friend-request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fromStudentId,
    toStudentId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  friendRequests.push(newRequest);
  return newRequest;
}

/**
 * Get pending friend requests for a student (incoming)
 */
export async function getPendingFriendRequests(
  studentId: string
): Promise<FriendRequest[]> {
  return friendRequests.filter(
    (req) => req.toStudentId === studentId && req.status === "pending"
  );
}

/**
 * Get sent friend requests (outgoing)
 */
export async function getSentFriendRequests(
  studentId: string
): Promise<FriendRequest[]> {
  return friendRequests.filter(
    (req) => req.fromStudentId === studentId && req.status === "pending"
  );
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(
  requestId: string
): Promise<FriendRequest | null> {
  const request = friendRequests.find((req) => req.id === requestId);
  if (!request || request.status !== "pending") return null;

  request.status = "accepted";
  request.respondedAt = new Date().toISOString();

  // In real app, would update database to add to both students' friendConnections
  // For demo, we're relying on the JSON files which already have connections set up

  return request;
}

/**
 * Decline a friend request
 */
export async function declineFriendRequest(
  requestId: string
): Promise<FriendRequest | null> {
  const request = friendRequests.find((req) => req.id === requestId);
  if (!request || request.status !== "pending") return null;

  request.status = "declined";
  request.respondedAt = new Date().toISOString();

  return request;
}

/**
 * Check if two students are friends
 */
export async function areFriends(
  studentId1: string,
  studentId2: string
): Promise<boolean> {
  const student1 = await getStudentById(studentId1);
  if (!student1 || !student1.friendConnections) return false;

  return student1.friendConnections.includes(studentId2);
}

/**
 * Get daily message limit for a student
 */
export async function getDailyMessageLimit(
  studentId: string
): Promise<DailyMessageLimit> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  let limit = dailyMessageLimits.find(
    (l) => l.studentId === studentId && l.date === today
  );

  if (!limit) {
    limit = {
      studentId,
      date: today,
      messagesSent: 0,
      limit: 3, // Default 3 messages per day
    };
    dailyMessageLimits.push(limit);
  }

  return limit;
}

/**
 * Check if student can send more messages today
 */
export async function canSendMessage(studentId: string): Promise<boolean> {
  const limit = await getDailyMessageLimit(studentId);
  return limit.messagesSent < limit.limit;
}

/**
 * Send a learning-focused message to a friend
 */
export async function sendFriendMessage(
  fromStudentId: string,
  toStudentId: string,
  messageData: Partial<FriendMessage>
): Promise<{ success: boolean; message?: FriendMessage; error?: string }> {
  // Check if they are friends
  const isFriends = await areFriends(fromStudentId, toStudentId);
  if (!isFriends) {
    return { success: false, error: "You must be friends to send messages" };
  }

  // Check daily limit
  const canSend = await canSendMessage(fromStudentId);
  if (!canSend) {
    return {
      success: false,
      error: "Daily message limit reached (3 messages/day)",
    };
  }

  // Validate message type
  if (!messageData.type) {
    return { success: false, error: "Message type is required" };
  }

  // Create message
  const newMessage: FriendMessage = {
    id: `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fromStudentId,
    toStudentId,
    type: messageData.type,
    timestamp: new Date().toISOString(),
    read: false,
    ...messageData,
  };

  friendMessages.push(newMessage);

  // Update daily limit
  const limit = await getDailyMessageLimit(fromStudentId);
  limit.messagesSent += 1;

  return { success: true, message: newMessage };
}

/**
 * Get conversation between two students
 */
export async function getConversation(
  studentId1: string,
  studentId2: string
): Promise<FriendMessage[]> {
  const messages = friendMessages.filter(
    (msg) =>
      (msg.fromStudentId === studentId1 && msg.toStudentId === studentId2) ||
      (msg.fromStudentId === studentId2 && msg.toStudentId === studentId1)
  );

  // Sort by timestamp
  return messages.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  studentId: string,
  friendId: string
): Promise<void> {
  friendMessages.forEach((msg) => {
    if (msg.fromStudentId === friendId && msg.toStudentId === studentId) {
      msg.read = true;
    }
  });
}

/**
 * Get unread message count for a student
 */
export async function getUnreadMessageCount(
  studentId: string
): Promise<number> {
  return friendMessages.filter(
    (msg) => msg.toStudentId === studentId && !msg.read
  ).length;
}

/**
 * Initialize demo data for testing
 */
export function initializeDemoFriendData() {
  // Clear existing data
  friendRequests = [];
  friendMessages = [];
  dailyMessageLimits = [];

  // Add some demo messages between Eva and Pat (who are already friends)
  // Learning-focused: achievements, tutor recommendations, study notes only
  const demoMessages: FriendMessage[] = [
    {
      id: "message-demo-1",
      fromStudentId: "student-eva",
      toStudentId: "student-pat",
      type: "achievement_share",
      achievementId: "three_day_streak",
      achievementName: "Three Day Streak",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: true,
    },
    {
      id: "message-demo-2",
      fromStudentId: "student-pat",
      toStudentId: "student-eva",
      type: "tutor_recommendation",
      tutorId: "tutor-james-rodriguez",
      tutorName: "James Rodriguez",
      tutorSpecialty: "Writing & SAT Prep",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      read: true,
    },
    {
      id: "message-demo-3",
      fromStudentId: "student-eva",
      toStudentId: "student-pat",
      type: "study_note",
      noteTitle: "Persuasive Essay Tips",
      noteContent: "1. Start with a strong hook\n2. State your thesis clearly\n3. Use evidence to support claims\n4. Address counterarguments\n5. End with a powerful conclusion",
      noteSubject: "Writing",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
      read: false,
    },
  ];

  friendMessages.push(...demoMessages);

  // Add a pending friend request from Mia to Lucas
  const demoRequest: FriendRequest = {
    id: "friend-request-demo-1",
    fromStudentId: "student-mia",
    toStudentId: "student-lucas",
    status: "pending",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  };

  friendRequests.push(demoRequest);

  console.log("✅ Demo friend data initialized");
}
