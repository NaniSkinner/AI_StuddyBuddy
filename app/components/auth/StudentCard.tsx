"use client";

import { motion } from "framer-motion";
import { Student } from "@/types";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
  delay?: number;
}

/**
 * StudentCard Component
 * Displays a student profile card with avatar, name, and streak
 * Used on the login screen for student selection
 */
export default function StudentCard({
  student,
  onClick,
  delay = 0,
}: StudentCardProps) {
  /**
   * Get avatar emoji based on student name
   */
  const getAvatar = (name: string): string => {
    const avatars: Record<string, string> = {
      Lucas: "👦",
      Eva: "👧",
      Pat: "🎓",
      Mia: "📚",
    };
    return avatars[name] || "🎓";
  };

  /**
   * Format streak text with proper singular/plural
   */
  const formatStreak = (days: number): string => {
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  return (
    <motion.button
      className={`student-card ${
        student.churnRisk ? "student-card--at-risk" : ""
      }`}
      onClick={() => {
        console.log("🟢 StudentCard clicked:", student.name);
        onClick();
      }}
      type="button"
      aria-label={`Login as ${student.name}, ${formatStreak(
        student.streaks.current
      )} streak`}
      // Entrance animation - bouncy but optimized
      initial={{ scale: 0, rotate: -10, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        delay: delay * 0.06, // Slight stagger for wave effect
        type: "spring",
        stiffness: 260, // Bouncy but controlled
        damping: 18, // Smooth settling
        mass: 0.8, // Light and responsive
        velocity: 2, // Initial velocity for pop effect
      }}
      // Hover animation
      whileHover={{ scale: 1.05, rotate: 0, translateY: -8 }}
      // Tap animation
      whileTap={{ scale: 0.95 }}
    >
      <span className="student-avatar" aria-hidden="true">
        {getAvatar(student.name)}
      </span>
      <span className="student-name">{student.name}</span>
      <span className="student-streak">
        🔥 {formatStreak(student.streaks.current)}
      </span>
    </motion.button>
  );
}
