"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SketchButton } from "./ui/SketchButton";
import { StreakCounter, StreakDetail } from "./streaks";
import { StreakStatus } from "@/lib/services/streakService";

interface TopBarProps {
  studentName: string;
  streakStatus: StreakStatus;
  totalPoints?: number;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onAchievementsClick?: () => void;
  onFriendsClick?: () => void;
  onTestNudge?: () => void;
  onTestBooking?: () => void;
}

export default function TopBar({
  studentName,
  streakStatus,
  totalPoints = 0,
  onSettingsClick,
  onLogoutClick,
  onAchievementsClick,
  onFriendsClick,
  onTestNudge,
  onTestBooking,
}: TopBarProps) {
  const [showStreakModal, setShowStreakModal] = useState(false);

  return (
    <>
      <div className="bg-white border-b-2 border-doodle-sketch px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.h1
            className="text-3xl font-hand font-bold text-doodle-sketch"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ transform: "rotate(-1deg)" }}
          >
            AI Study Companion ✨
          </motion.h1>
          <motion.div
            className="h-8 w-1 bg-doodle-sketch"
            style={{ transform: "rotate(2deg)" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
          />
          <motion.span
            className="text-xl font-sketch text-doodle-sketch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Hi, {studentName}! 👋
          </motion.span>

          {/* Test Nudge Button (Dev/Demo) - Left side */}
          {onTestNudge && (
            <>
              <motion.div
                className="h-8 w-1 bg-doodle-sketch"
                style={{ transform: "rotate(-2deg)" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.button
                onClick={onTestNudge}
                className="px-3 py-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg border-2 border-doodle-sketch font-hand text-sm font-bold shadow-doodle"
                style={{ transform: "rotate(-1deg)" }}
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                  boxShadow: "4px 4px 0px var(--doodle-sketch)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                🔔 Test Nudge
              </motion.button>
            </>
          )}

          {/* Test Booking Button (Dev/Demo) */}
          {onTestBooking && (
            <motion.button
              onClick={onTestBooking}
              className="px-3 py-2 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg border-2 border-doodle-sketch font-hand text-sm font-bold shadow-doodle"
              style={{ transform: "rotate(1deg)" }}
              whileHover={{
                scale: 1.05,
                rotate: -2,
                boxShadow: "4px 4px 0px var(--doodle-sketch)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              📚 Test Booking
            </motion.button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Points Badge */}
          {totalPoints > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-doodle-yellow rounded-full border-2 border-doodle-sketch"
              style={{ transform: "rotate(1deg)" }}
            >
              <span className="font-hand text-lg font-bold text-doodle-sketch">
                {totalPoints} 🌟
              </span>
            </motion.div>
          )}

          {/* Streak Counter - New Component */}
          {streakStatus.best.current > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <StreakCounter
                currentStreak={streakStatus.best.current}
                streakType={streakStatus.best.type}
                onClick={() => setShowStreakModal(true)}
              />
            </motion.div>
          )}

          {/* Friends Button */}
          {onFriendsClick && (
            <motion.button
              onClick={onFriendsClick}
              className="p-3 bg-white border-2 border-doodle-sketch rounded-full"
              style={{ transform: "rotate(2deg)" }}
              whileHover={{
                scale: 1.1,
                rotate: -5,
                boxShadow: "3px 3px 0px var(--doodle-sketch)",
              }}
              whileTap={{ scale: 0.9 }}
              aria-label="View Friends"
            >
              <span className="text-2xl">👥</span>
            </motion.button>
          )}

          {/* Achievements Button */}
          <motion.button
            onClick={onAchievementsClick}
            className="p-3 bg-white border-2 border-doodle-sketch rounded-full"
            style={{ transform: "rotate(-1deg)" }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              boxShadow: "3px 3px 0px var(--doodle-sketch)",
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="View Achievements"
          >
            <span className="text-2xl">🏆</span>
          </motion.button>

          {/* Settings Button - Doodle Style */}
          <motion.button
            onClick={onSettingsClick}
            className="p-3 bg-white border-2 border-doodle-sketch rounded-full"
            style={{ transform: "rotate(1deg)" }}
            whileHover={{
              scale: 1.1,
              rotate: 10,
              boxShadow: "3px 3px 0px var(--doodle-sketch)",
            }}
            whileTap={{ scale: 0.9, rotate: -10 }}
            aria-label="Settings"
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            >
              ⚙️
            </motion.span>
          </motion.button>

          {/* Logout Button - Sketch Button */}
          <SketchButton variant="ghost" size="medium" onClick={onLogoutClick}>
            Logout 👋
          </SketchButton>
        </div>
      </div>

      {/* Streak Detail Modal */}
      {showStreakModal && (
        <StreakDetail
          streakStatus={streakStatus}
          onClose={() => setShowStreakModal(false)}
        />
      )}
    </>
  );
}
