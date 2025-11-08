"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StreakStatus } from "@/lib/services/streakService";

interface StreakDetailProps {
  streakStatus: StreakStatus;
  onClose: () => void;
}

export default function StreakDetail({
  streakStatus,
  onClose,
}: StreakDetailProps) {
  const { login, practice, best, message } = streakStatus;

  // Calculate longest overall
  const longestOverall = Math.max(login.longest, practice.longest);

  // Calculate days to beat record
  const daysToRecord = longestOverall - best.current;

  // Render streak dots (max 7 shown)
  const renderStreakDots = (current: number, max: number = 7) => {
    return Array.from({ length: max }).map((_, i) => (
      <span key={i} className="text-3xl">
        {i < current ? "🔥" : "⚪"}
      </span>
    ));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg mx-4 p-8 bg-white rounded-3xl border-4 border-doodle-sketch overflow-hidden"
          style={{
            boxShadow:
              "8px 8px 0px rgba(0, 0, 0, 0.1), 16px 16px 0px rgba(0, 0, 0, 0.05)",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <h2 className="font-hand text-4xl font-bold text-doodle-sketch mb-6 text-center">
            🔥 Your Streaks
          </h2>

          {/* Login Streak Section */}
          <div className="mb-6 p-4 bg-doodle-cream rounded-xl border-2 border-doodle-sketch">
            <h3 className="font-sketch text-xl font-bold text-doodle-sketch mb-2">
              🔥 Login Streak
            </h3>
            <p className="font-hand text-3xl font-bold text-doodle-orange mb-3">
              {login.current} {login.current === 1 ? "day" : "days"}
            </p>
            <div className="flex gap-1 flex-wrap">
              {renderStreakDots(login.current)}
            </div>
            {login.isActive && (
              <p className="font-sketch text-sm text-doodle-green mt-2">
                ✓ Active today!
              </p>
            )}
          </div>

          {/* Practice Streak Section */}
          <div className="mb-6 p-4 bg-doodle-cream rounded-xl border-2 border-doodle-sketch">
            <h3 className="font-sketch text-xl font-bold text-doodle-sketch mb-2">
              📚 Practice Streak
            </h3>
            <p className="font-hand text-3xl font-bold text-doodle-purple mb-3">
              {practice.current} {practice.current === 1 ? "day" : "days"}
            </p>
            <div className="flex gap-1 flex-wrap">
              {renderStreakDots(practice.current)}
            </div>
            {practice.isActive && (
              <p className="font-sketch text-sm text-doodle-green mt-2">
                ✓ Active today!
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-1 w-full bg-doodle-sketch my-6" />

          {/* Longest Streak & Challenge */}
          <div className="text-center mb-6">
            <p className="font-sketch text-lg text-doodle-sketch mb-2">
              <strong>Longest Streak:</strong> {longestOverall} days 🏆
            </p>

            {daysToRecord > 0 ? (
              <p className="font-hand text-xl text-doodle-orange">
                Beat it by studying {daysToRecord} more{" "}
                {daysToRecord === 1 ? "day" : "days"}! 💪
              </p>
            ) : best.current === longestOverall ? (
              <motion.p
                className="font-hand text-xl text-doodle-green"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                New record! You're unstoppable! 🚀
              </motion.p>
            ) : (
              <p className="font-hand text-xl text-doodle-green">
                You're {Math.abs(daysToRecord)} days ahead of your record! 🎉
              </p>
            )}
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <p className="font-sketch text-lg text-doodle-sketch italic">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <motion.button
            className="sketch-button sketch-button--primary w-full py-4 text-xl"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Keep Going! 💪
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

