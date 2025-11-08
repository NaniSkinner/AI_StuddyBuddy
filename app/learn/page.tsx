"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store/appStore";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import TopBar from "@/app/components/TopBar";
import ChatInterface from "@/app/components/ChatInterface";
import ProgressCard from "@/app/components/ProgressCard";
import TaskSidebar from "@/app/components/TaskSidebar";
import AnimatedBubble from "@/app/components/AnimatedBubble";
import AchievementBadges from "@/app/components/AchievementBadges";
import NudgePopup from "@/app/components/retention/NudgePopup";
import { Message, ACHIEVEMENT_DEFINITIONS } from "@/types";
import {
  getStreakStatus,
  StreakStatus,
} from "@/lib/services/streakService.client";
import { getAchievementPoints } from "@/lib/services/achievementService.client";
import { useNudgeSystem } from "@/lib/hooks/useNudgeSystem";

export default function LearnPage() {
  return (
    <ProtectedRoute>
      <LearnPageContent />
    </ProtectedRoute>
  );
}

function LearnPageContent() {
  const router = useRouter();
  const currentStudent = useAppStore((state) => state.currentStudent);
  const messages = useAppStore((state) => state.messages);
  const addMessage = useAppStore((state) => state.addMessage);
  const isTyping = useAppStore((state) => state.isTyping);
  const setIsTyping = useAppStore((state) => state.setIsTyping);
  const setTasks = useAppStore((state) => state.setTasks);
  const showTaskSidebar = useAppStore((state) => state.showTaskSidebar);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showTasksSection, setShowTasksSection] = useState(true);
  const [showAchievementsSection, setShowAchievementsSection] = useState(false);
  const [streakStatus, setStreakStatus] = useState<StreakStatus>({
    login: { current: 0, longest: 0, isActive: false },
    practice: { current: 0, longest: 0, isActive: false },
    best: { current: 0, type: "login" },
    message: "",
  });
  const [totalPoints, setTotalPoints] = useState(0);

  // Nudge system integration
  const { currentNudge, acceptNudge, dismissNudge, forceCheckNudge } =
    useNudgeSystem(currentStudent?.id || null);

  // Mock tasks based on student
  const getMockTasks = () => {
    const studentId = currentStudent?.id || "";

    if (studentId === "student-eva") {
      return [
        {
          id: "task-eva-1",
          studentId: studentId,
          type: "multiple_choice" as const,
          subject: "Reading Comprehension",
          topic: "Literary Devices",
          content: {
            question: "Identify the metaphor in this passage",
            options: [
              "The wind whispered",
              "She was running",
              "Time is money",
              "He walked slowly",
            ],
            correctAnswer: "Time is money",
            hints: ["Think about comparisons without 'like' or 'as'"],
          },
          status: "incomplete" as const,
          attempts: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: "task-eva-2",
          studentId: studentId,
          type: "open_ended" as const,
          subject: "Writing",
          topic: "Character Analysis",
          content: {
            question:
              "Write about the protagonist's development throughout the story",
            hints: [
              "Consider their actions",
              "Look at their relationships",
              "Notice how they change",
            ],
          },
          status: "incomplete" as const,
          attempts: 1,
          createdAt: new Date().toISOString(),
        },
      ];
    } else if (studentId === "student-lucas") {
      return [
        {
          id: "task-lucas-1",
          studentId: studentId,
          type: "multiple_choice" as const,
          subject: "Geometry",
          topic: "Angles in Triangles",
          content: {
            question: "What is the sum of angles in a triangle?",
            options: ["90°", "180°", "270°", "360°"],
            correctAnswer: "180°",
            hints: ["Think about the basic properties of triangles"],
          },
          status: "incomplete" as const,
          attempts: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: "task-lucas-2",
          studentId: studentId,
          type: "real_world" as const,
          subject: "Geometry",
          topic: "3D Shapes",
          content: {
            question:
              "Build a cube and calculate its volume if each side is 5cm",
            hints: ["Volume = side × side × side", "Use a ruler to measure"],
          },
          status: "incomplete" as const,
          attempts: 2,
          createdAt: new Date().toISOString(),
        },
      ];
    } else if (studentId === "student-mia") {
      return [
        {
          id: "task-mia-1",
          studentId: studentId,
          type: "multiple_choice" as const,
          subject: "Biology",
          topic: "Photosynthesis",
          content: {
            question: "What do plants produce during photosynthesis?",
            options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
            correctAnswer: "Oxygen",
            hints: ["Think about what we breathe"],
          },
          status: "incomplete" as const,
          attempts: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: "task-mia-2",
          studentId: studentId,
          type: "open_ended" as const,
          subject: "Biology",
          topic: "Plant Growth",
          content: {
            question:
              "Document your observations from the plant growth experiment",
            hints: [
              "Measure the height",
              "Note any color changes",
              "Record daily progress",
            ],
          },
          status: "incomplete" as const,
          attempts: 1,
          createdAt: new Date().toISOString(),
        },
      ];
    } else if (studentId === "student-pat") {
      return [
        {
          id: "task-pat-1",
          studentId: studentId,
          type: "multiple_choice" as const,
          subject: "Spanish",
          topic: "Vocabulary",
          content: {
            question: "What is 'Hello' in Spanish?",
            options: ["Adiós", "Hola", "Gracias", "Por favor"],
            correctAnswer: "Hola",
            hints: ["It's a common greeting"],
          },
          status: "incomplete" as const,
          attempts: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: "task-pat-2",
          studentId: studentId,
          type: "real_world" as const,
          subject: "Spanish",
          topic: "Conversation",
          content: {
            question:
              "Record yourself ordering food at a restaurant in Spanish",
            hints: [
              "Use '¿Puedo tener...?'",
              "Don't forget 'por favor'",
              "Practice pronunciation",
            ],
          },
          status: "incomplete" as const,
          attempts: 1,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    return [];
  };

  useEffect(() => {
    if (!currentStudent) {
      router.push("/");
      return;
    }

    async function loadStudentData() {
      try {
        // Load gamification data (passing Student object for client-side use)
        const status = await getStreakStatus(currentStudent!);
        setStreakStatus(status);

        const points = await getAchievementPoints(currentStudent!);
        setTotalPoints(points);

        // Load tasks via API
        const tasksResponse = await fetch(`/api/tasks/${currentStudent!.id}`);
        if (tasksResponse.ok) {
          const studentTasks = await tasksResponse.json();
          setTasks(studentTasks);
        }

        // Add welcome message
        if (messages.length === 0 && currentStudent) {
          const welcomeMessage: Message = {
            speaker: "ai",
            message: `Hi ${currentStudent.name}! Welcome back! I'm here to help you learn. What would you like to work on today?`,
            timestamp: new Date().toISOString(),
          };
          addMessage(welcomeMessage);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading student data:", error);
        setLoading(false);
      }
    }

    loadStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStudent]);

  const handleSendMessage = async (messageText: string) => {
    if (!currentStudent || !messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      speaker: "student",
      message: messageText,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMessage);

    // Show AI typing indicator
    setIsTyping(true);

    try {
      // Call the AI chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: currentStudent.id,
          message: messageText,
          sessionId: `session-${Date.now()}`,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      // Add AI response
      const aiMessage: Message = {
        speaker: "ai",
        message: data.response,
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMessage);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: Message = {
        speaker: "ai",
        message:
          "I'm having trouble thinking right now. Can you try asking again?",
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  if (!currentStudent) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your learning space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-doodle-cream">
      {/* Top Navigation Bar */}
      <header role="banner">
        <TopBar
          studentName={currentStudent.name}
          streakStatus={streakStatus}
          totalPoints={totalPoints}
          onLogoutClick={() => router.push("/")}
          onAchievementsClick={() => router.push("/achievements")}
          onTestNudge={forceCheckNudge}
        />
      </header>

      {/* Main Content Area */}
      <main
        id="main-content"
        className="flex-1 flex flex-col overflow-hidden"
        role="main"
      >
        {/* Progress Card - Desktop Only (Full Width at Top) */}
        <div className="hidden lg:block border-b border-gray-200 bg-transparent overflow-y-auto">
          <div className="px-6 py-2">
            <ProgressCard
              goals={currentStudent.goals}
              studentAge={currentStudent.age}
              streakDays={
                currentStudent.streaks.login?.current ||
                currentStudent.streaks.current ||
                0
              }
            />
          </div>
        </div>

        {/* Content Area - Chat and Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center - Chat Interface */}
          <div
            className="flex-1 flex flex-col items-center justify-center relative bg-doodle-cream"
            role="region"
            aria-label="Learning conversation area"
          >
            {!showChat ? (
              <div className="text-center px-4">
                <div className="mb-4 md:mb-8">
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setShowChat(true);
                    }}
                    aria-label="Click to start chat with your AI tutor"
                  >
                    <AnimatedBubble
                      color={currentStudent.preferences.aiColor}
                      size={120}
                      onClick={() => setShowChat(true)}
                    />
                  </div>
                </div>
                {/* Mobile & Tablet: Smaller text */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-hand font-bold text-doodle-sketch mb-2">
                  Hi {currentStudent.name}! 👋
                </h2>
                <p className="text-xl md:text-2xl lg:text-3xl font-sketch text-doodle-sketch opacity-80 mb-4 md:mb-6">
                  Click the bubble to start learning
                </p>
                <div className="max-w-md mx-auto space-y-1 md:space-y-2 font-sketch text-doodle-sketch text-lg md:text-xl lg:text-2xl">
                  <p>
                    🔥 Current Streak:{" "}
                    {currentStudent.streaks.login?.current ||
                      currentStudent.streaks.current ||
                      0}{" "}
                    days
                  </p>
                  <p>🎯 Goals: {currentStudent.goals.length}</p>
                  <p>
                    ⭐ Achievements: {currentStudent.achievements.length}{" "}
                    unlocked
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isAITyping={isTyping}
                  aiColor={currentStudent.preferences.aiColor}
                  studentName={currentStudent.name}
                />
              </div>
            )}
          </div>

          {/* Right Side - Task Sidebar & Achievements (Desktop & Tablet) */}
          {showTaskSidebar && (
            <aside
              className="hidden md:flex w-full md:w-80 lg:w-[450px] bg-doodle-cream flex-col overflow-hidden border-l-2 border-doodle-sketch"
              role="complementary"
              aria-label="Tasks and achievements sidebar"
            >
              {/* Spacer to push content to bottom */}
              <div className="flex-1"></div>

              {/* Tasks Section - Collapsible */}
              <section
                className="border-t-2 border-doodle-sketch"
                aria-labelledby="tasks-heading"
              >
                <button
                  onClick={() => setShowTasksSection(!showTasksSection)}
                  className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between bg-doodle-yellow hover:bg-doodle-orange transition-all group"
                  aria-expanded={showTasksSection}
                  aria-controls="tasks-content"
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span
                      className="text-2xl md:text-3xl lg:text-4xl"
                      aria-hidden="true"
                    >
                      📝
                    </span>
                    <h3
                      id="tasks-heading"
                      className="text-xl md:text-2xl lg:text-3xl font-hand font-bold text-doodle-sketch"
                    >
                      Your Tasks
                    </h3>
                  </div>
                  <motion.span
                    className="text-2xl md:text-3xl text-doodle-sketch"
                    animate={{ rotate: showTasksSection ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {showTasksSection && (
                    <motion.div
                      id="tasks-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden bg-white"
                      role="region"
                    >
                      <div className="p-3 md:p-4 bg-white max-h-[300px] md:max-h-[400px] overflow-y-auto">
                        <TaskSidebar
                          tasks={getMockTasks()}
                          onTaskClick={(task) =>
                            console.log("Task clicked:", task.id)
                          }
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Achievements Section - Collapsible */}
              <section
                className="border-t-2 border-doodle-sketch"
                aria-labelledby="achievements-heading"
              >
                <button
                  onClick={() =>
                    setShowAchievementsSection(!showAchievementsSection)
                  }
                  className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between bg-doodle-peach hover:bg-doodle-pink transition-all group"
                  aria-expanded={showAchievementsSection}
                  aria-controls="achievements-content"
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span
                      className="text-2xl md:text-3xl lg:text-4xl"
                      aria-hidden="true"
                    >
                      ⭐
                    </span>
                    <h3
                      id="achievements-heading"
                      className="text-xl md:text-2xl lg:text-3xl font-hand font-bold text-doodle-sketch"
                    >
                      Achievements
                    </h3>
                  </div>
                  <motion.span
                    className="text-2xl md:text-3xl text-doodle-sketch"
                    animate={{ rotate: showAchievementsSection ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {showAchievementsSection && (
                    <motion.div
                      id="achievements-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden bg-white"
                      role="region"
                    >
                      <div className="p-3 md:p-4 bg-white max-h-[300px] md:max-h-[400px] overflow-y-auto">
                        <h4
                          className="text-lg md:text-xl lg:text-2xl font-hand font-bold text-doodle-sketch mb-3 md:mb-4 text-center"
                          id="unlocked-badges-heading"
                        >
                          Unlocked 🎉
                        </h4>
                        <AchievementBadges
                          achievements={currentStudent.achievements.map(
                            (achId) => ({
                              ...ACHIEVEMENT_DEFINITIONS[achId],
                              unlocked: true,
                            })
                          )}
                          onBadgeClick={(achievement) =>
                            console.log("Badge clicked:", achievement.id)
                          }
                        />
                        {/* Locked Badges Preview */}
                        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t-2 border-doodle-sketch border-dashed">
                          <h4
                            className="text-lg md:text-xl lg:text-2xl font-hand font-bold text-doodle-sketch/60 mb-3 md:mb-4 text-center"
                            id="locked-badges-heading"
                          >
                            Locked 🔒
                          </h4>
                          <AchievementBadges
                            achievements={Object.values(ACHIEVEMENT_DEFINITIONS)
                              .filter(
                                (def) =>
                                  !currentStudent.achievements.includes(def.id)
                              )
                              .map((def) => ({
                                ...def,
                                unlocked: false,
                              }))}
                            onBadgeClick={(achievement) =>
                              console.log(
                                "Locked badge clicked:",
                                achievement.id
                              )
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </aside>
          )}
        </div>
      </main>

      {/* Mobile Bottom Section - Progress Card & Quick Actions */}
      <footer
        className="md:hidden border-t-2 border-doodle-sketch bg-white"
        role="contentinfo"
        aria-label="Progress summary"
      >
        <div className="p-3 max-h-48 overflow-y-auto">
          <ProgressCard
            goals={currentStudent.goals}
            studentAge={currentStudent.age}
            streakDays={
              currentStudent.streaks.login?.current ||
              currentStudent.streaks.current ||
              0
            }
          />
        </div>
      </footer>

      {/* Nudge System */}
      {currentNudge && (
        <NudgePopup
          nudge={currentNudge}
          onAccept={acceptNudge}
          onDismiss={dismissNudge}
        />
      )}
    </div>
  );
}
