"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store/appStore";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import TopBar from "@/app/components/TopBar";
import LearningMessagePanel from "@/app/components/friends/LearningMessagePanel";
import { Student, FriendRequest, FriendMessage, DailyMessageLimit } from "@/types";
import {
  getStreakStatus,
  StreakStatus,
} from "@/lib/services/streakService.client";

export default function FriendsPage() {
  return (
    <ProtectedRoute>
      <FriendsPageContent />
    </ProtectedRoute>
  );
}

function FriendsPageContent() {
  const router = useRouter();
  const currentStudent = useAppStore((state) => state.currentStudent);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Student[]>([]);
  const [potentialFriends, setPotentialFriends] = useState<Student[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [activeView, setActiveView] = useState<"friends" | "requests" | "find">(
    "friends"
  );
  const [selectedFriend, setSelectedFriend] = useState<Student | null>(null);
  const [conversation, setConversation] = useState<FriendMessage[]>([]);
  const [messagesRemaining, setMessagesRemaining] = useState(3);
  const [streakStatus, setStreakStatus] = useState<StreakStatus>({
    login: { current: 0, longest: 0, isActive: false },
    practice: { current: 0, longest: 0, isActive: false },
    best: { current: 0, type: "login" },
    message: "",
  });

  useEffect(() => {
    if (!currentStudent) {
      router.push("/login");
      return;
    }

    initializeData();
  }, [currentStudent]);

  async function initializeData() {
    if (!currentStudent) return;

    try {
      // Load friends
      const friendsRes = await fetch(
        `/api/friends?studentId=${currentStudent.id}&action=connections`
      );
      const friendsData = await friendsRes.json();
      setFriends(friendsData.friends || []);

      // Load potential friends
      const potentialsRes = await fetch(
        `/api/friends?studentId=${currentStudent.id}&action=potential`
      );
      const potentialsData = await potentialsRes.json();
      setPotentialFriends(potentialsData.potentials || []);

      // Load pending requests
      const requestsRes = await fetch(
        `/api/friends/requests?studentId=${currentStudent.id}&type=pending`
      );
      const requestsData = await requestsRes.json();
      setPendingRequests(requestsData.requests || []);

      // Load streak status
      const status = await getStreakStatus(currentStudent);
      setStreakStatus(status);

      // Load daily message limit
      const limitRes = await fetch(
        `/api/friends/messages?studentId=${currentStudent.id}&action=limit`
      );
      const limitData = await limitRes.json();
      const limit: DailyMessageLimit = limitData.limit;
      setMessagesRemaining(limit.limit - limit.messagesSent);
    } catch (error) {
      console.error("Error loading friend data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendRequest(friendId: string) {
    if (!currentStudent) return;

    try {
      await fetch("/api/friends/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          fromStudentId: currentStudent.id,
          toStudentId: friendId,
        }),
      });

      // Refresh potential friends list
      const potentialsRes = await fetch(
        `/api/friends?studentId=${currentStudent.id}&action=potential`
      );
      const potentialsData = await potentialsRes.json();
      setPotentialFriends(potentialsData.potentials || []);

      alert("Friend request sent! 🎉");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    }
  }

  async function handleAcceptRequest(requestId: string) {
    try {
      await fetch("/api/friends/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept",
          requestId,
        }),
      });

      // Refresh data
      initializeData();

      alert("Friend request accepted! 🎊");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request");
    }
  }

  async function handleDeclineRequest(requestId: string) {
    if (!currentStudent) return;

    try {
      await fetch("/api/friends/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "decline",
          requestId,
        }),
      });

      // Refresh pending requests
      const requestsRes = await fetch(
        `/api/friends/requests?studentId=${currentStudent.id}&type=pending`
      );
      const requestsData = await requestsRes.json();
      setPendingRequests(requestsData.requests || []);
    } catch (error) {
      console.error("Error declining friend request:", error);
      alert("Failed to decline friend request");
    }
  }

  async function handleSelectFriend(friend: Student) {
    setSelectedFriend(friend);

    if (!currentStudent) return;

    try {
      // Load conversation
      const convRes = await fetch(
        `/api/friends/messages?studentId=${currentStudent.id}&friendId=${friend.id}&action=conversation`
      );
      const convData = await convRes.json();
      setConversation(convData.messages || []);

      // Update messages remaining
      const limitRes = await fetch(
        `/api/friends/messages?studentId=${currentStudent.id}&action=limit`
      );
      const limitData = await limitRes.json();
      const limit: DailyMessageLimit = limitData.limit;
      setMessagesRemaining(limit.limit - limit.messagesSent);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  }

  async function handleSendMessage(messageData: Partial<FriendMessage>) {
    if (!currentStudent || !selectedFriend) return;

    try {
      const res = await fetch("/api/friends/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          fromStudentId: currentStudent.id,
          toStudentId: selectedFriend.id,
          messageData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Reload conversation
        const convRes = await fetch(
          `/api/friends/messages?studentId=${currentStudent.id}&friendId=${selectedFriend.id}&action=conversation`
        );
        const convData = await convRes.json();
        setConversation(convData.messages || []);

        // Update messages remaining
        const limitRes = await fetch(
          `/api/friends/messages?studentId=${currentStudent.id}&action=limit`
        );
        const limitData = await limitRes.json();
        const limit: DailyMessageLimit = limitData.limit;
        setMessagesRemaining(limit.limit - limit.messagesSent);
      } else {
        alert(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          🌟
        </motion.div>
      </div>
    );
  }

  if (!currentStudent) return null;

  const studentColor = currentStudent.preferences?.aiColor || "#10B981";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <TopBar
        studentName={currentStudent.name}
        streakStatus={streakStatus}
        totalPoints={currentStudent.totalPoints}
        onAchievementsClick={() => router.push("/achievements")}
        onLogoutClick={() => router.push("/login")}
      />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-['Architects_Daughter'] font-bold text-[#2D3748] mb-2">
            Your Friends 👥
          </h1>
          <p className="text-lg font-['Architects_Daughter'] text-gray-600">
            Connect with other students and share your learning journey!
          </p>

          {/* Daily Message Limit Indicator */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-[#2D3748] shadow-[3px_3px_0px_rgba(0,0,0,0.1)]">
            <span className="text-2xl">💬</span>
            <span className="font-['Architects_Daughter'] font-bold text-[#2D3748]">
              {messagesRemaining} messages left today
            </span>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-6">
          <TabButton
            active={activeView === "friends"}
            onClick={() => setActiveView("friends")}
            color={studentColor}
          >
            My Friends ({friends.length})
          </TabButton>
          <TabButton
            active={activeView === "requests"}
            onClick={() => setActiveView("requests")}
            color={studentColor}
          >
            Requests ({pendingRequests.length})
          </TabButton>
          <TabButton
            active={activeView === "find"}
            onClick={() => setActiveView("find")}
            color={studentColor}
          >
            Find Friends
          </TabButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Panel - List View */}
          <div>
            <AnimatePresence mode="wait">
              {activeView === "friends" && (
                <motion.div
                  key="friends"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {friends.length === 0 ? (
                    <EmptyState
                      emoji="👥"
                      title="No friends yet"
                      description="Send a friend request to get started!"
                    />
                  ) : (
                    <div className="space-y-3">
                      {friends.map((friend) => (
                        <FriendCard
                          key={friend.id}
                          friend={friend}
                          selected={selectedFriend?.id === friend.id}
                          onClick={() => handleSelectFriend(friend)}
                          color={studentColor}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeView === "requests" && (
                <motion.div
                  key="requests"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {pendingRequests.length === 0 ? (
                    <EmptyState
                      emoji="📬"
                      title="No pending requests"
                      description="You're all caught up!"
                    />
                  ) : (
                    <div className="space-y-3">
                      {pendingRequests.map((request) => (
                        <FriendRequestCard
                          key={request.id}
                          request={request}
                          onAccept={() => handleAcceptRequest(request.id)}
                          onDecline={() => handleDeclineRequest(request.id)}
                          color={studentColor}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeView === "find" && (
                <motion.div
                  key="find"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="space-y-3">
                    {potentialFriends
                      .filter((p) => !friends.find((f) => f.id === p.id))
                      .map((potential) => (
                        <PotentialFriendCard
                          key={potential.id}
                          student={potential}
                          onSendRequest={() => handleSendRequest(potential.id)}
                          color={studentColor}
                        />
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Learning Message View */}
          <div>
            {selectedFriend ? (
              <LearningMessagePanel
                friend={selectedFriend}
                conversation={conversation}
                messagesRemaining={messagesRemaining}
                currentStudentId={currentStudent.id}
                currentStudent={currentStudent}
                color={studentColor}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <EmptyState
                emoji="💬"
                title="Select a friend"
                description="Click on a friend to share achievements, tutors, or notes!"
              />
            )}
          </div>
        </div>

        {/* Back to Learn Button */}
        <motion.button
          onClick={() => router.push("/learn")}
          className="mt-6 px-6 py-3 bg-white rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_rgba(0,0,0,0.15)] font-['Architects_Daughter'] font-bold text-lg hover:shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Back to Learning
        </motion.button>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-['Architects_Daughter'] font-bold text-lg border-3 border-[#2D3748] transition-all duration-150 ${
        active
          ? "shadow-[4px_4px_0px_rgba(0,0,0,0.15)] text-white"
          : "bg-white text-[#2D3748] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.15)]"
      }`}
      style={active ? { backgroundColor: color } : {}}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

// Friend Card Component
function FriendCard({
  friend,
  selected,
  onClick,
  color,
}: {
  friend: Student;
  selected: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <motion.div
      onClick={onClick}
      className={`p-4 rounded-2xl border-3 border-[#2D3748] cursor-pointer transition-all duration-150 ${
        selected
          ? "shadow-[5px_5px_0px_rgba(0,0,0,0.2)]"
          : "bg-white shadow-[3px_3px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.15)]"
      }`}
      style={selected ? { backgroundColor: `${color}20` } : {}}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full border-3 border-[#2D3748] flex items-center justify-center text-2xl"
          style={{ backgroundColor: friend.preferences?.aiColor || "#10B981" }}
        >
          👤
        </div>
        <div>
          <h3 className="font-['Architects_Daughter'] font-bold text-lg text-[#2D3748]">
            {friend.name}
          </h3>
          <p className="font-['Architects_Daughter'] text-sm text-gray-600">
            Grade {friend.grade} • {friend.goals.length} goals
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Friend Request Card Component
function FriendRequestCard({
  request,
  onAccept,
  onDecline,
  color,
}: {
  request: FriendRequest;
  onAccept: () => void;
  onDecline: () => void;
  color: string;
}) {
  // Use sender from enriched request object
  const sender = request.sender;

  if (!sender) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-2xl border-3 border-[#2D3748] shadow-[3px_3px_0px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full border-3 border-[#2D3748] flex items-center justify-center text-2xl"
            style={{ backgroundColor: sender.preferences?.aiColor || "#10B981" }}
          >
            👤
          </div>
          <div>
            <h3 className="font-['Architects_Daughter'] font-bold text-lg text-[#2D3748]">
              {sender.name}
            </h3>
            <p className="font-['Architects_Daughter'] text-sm text-gray-600">
              wants to be friends!
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={onAccept}
            className="px-4 py-2 rounded-xl text-white font-['Architects_Daughter'] font-bold border-2 border-[#2D3748] shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✓
          </motion.button>
          <motion.button
            onClick={onDecline}
            className="px-4 py-2 bg-gray-200 rounded-xl font-['Architects_Daughter'] font-bold border-2 border-[#2D3748] shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✗
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Potential Friend Card Component
function PotentialFriendCard({
  student,
  onSendRequest,
  color,
}: {
  student: Student;
  onSendRequest: () => void;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-2xl border-3 border-[#2D3748] shadow-[3px_3px_0px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full border-3 border-[#2D3748] flex items-center justify-center text-2xl"
            style={{ backgroundColor: student.preferences?.aiColor || "#10B981" }}
          >
            👤
          </div>
          <div>
            <h3 className="font-['Architects_Daughter'] font-bold text-lg text-[#2D3748]">
              {student.name}
            </h3>
            <p className="font-['Architects_Daughter'] text-sm text-gray-600">
              Grade {student.grade}
            </p>
          </div>
        </div>
        <motion.button
          onClick={onSendRequest}
          className="px-4 py-2 rounded-xl text-white font-['Architects_Daughter'] font-bold border-2 border-[#2D3748] shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
          style={{ backgroundColor: color }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Friend
        </motion.button>
      </div>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_rgba(0,0,0,0.15)] p-12 text-center"
    >
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="font-['Architects_Daughter'] font-bold text-2xl text-[#2D3748] mb-2">
        {title}
      </h3>
      <p className="font-['Architects_Daughter'] text-gray-600">{description}</p>
    </motion.div>
  );
}
