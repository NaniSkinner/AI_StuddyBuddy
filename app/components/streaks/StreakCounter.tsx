"use client";

import { motion } from "framer-motion";

interface StreakCounterProps {
  currentStreak: number;
  streakType: "login" | "practice";
  onClick?: () => void;
}

export default function StreakCounter({
  currentStreak,
  streakType,
  onClick,
}: StreakCounterProps) {
  const icon = streakType === "login" ? "🔥" : "📚";
  const label = streakType === "login" ? "Login" : "Practice";

  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-doodle-orange to-doodle-yellow rounded-full border-2 border-doodle-sketch cursor-pointer font-hand text-lg font-bold text-doodle-sketch shadow-doodle"
      style={{
        transform: "rotate(-1deg)",
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.15)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Fire Emoji with Flicker Animation */}
      <motion.span
        className="text-2xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: "brightness(1.2)",
        }}
      >
        {icon}
      </motion.span>

      {/* Streak Number */}
      <span className="text-xl">{currentStreak}</span>

      {/* Label */}
      <span className="text-sm opacity-90">
        {currentStreak === 1 ? "Day" : "Days"}
      </span>

      {/* Hidden streak type for tooltip */}
      <span className="sr-only">{label} Streak</span>
    </motion.div>
  );
}

