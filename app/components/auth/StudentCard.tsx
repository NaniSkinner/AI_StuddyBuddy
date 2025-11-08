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

  /**
   * Get unique entrance animation for each card
   * Cards fly in from different parts of the screen
   */
  const getEntranceAnimation = (index: number) => {
    const animations = [
      // Card 0: Fly from top-left with spin
      {
        initial: { x: -400, y: -300, rotate: -180, scale: 0.3, opacity: 0 },
        rotate: -15,
      },
      // Card 1: Fly from top-right with reverse spin
      {
        initial: { x: 400, y: -300, rotate: 180, scale: 0.3, opacity: 0 },
        rotate: 15,
      },
      // Card 2: Fly from bottom-left with tumble
      {
        initial: { x: -400, y: 300, rotate: -270, scale: 0.2, opacity: 0 },
        rotate: -10,
      },
      // Card 3: Fly from bottom-right with flip
      {
        initial: { x: 400, y: 300, rotate: 270, scale: 0.2, opacity: 0 },
        rotate: 10,
      },
    ];

    return animations[index % animations.length];
  };

  const animation = getEntranceAnimation(delay);

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
        student.streaks.login?.current || student.streaks.current || 0
      )} streak`}
      // Dynamic entrance - each card flies from a different direction!
      initial={animation.initial}
      animate={{
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
      }}
      transition={{
        delay: delay * 0.15, // More stagger for dramatic entrance
        type: "spring",
        stiffness: 80, // Slower, more graceful
        damping: 12, // More bouncy overshoot
        mass: 1.2, // Heavier feel, slower motion
        duration: 1.2, // Longer animation
      }}
      // Hover animation - scale, rotate, and lift
      whileHover={{
        scale: 1.05,
        rotate: 0,
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      // Tap animation
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
    >
      <span className="student-avatar" aria-hidden="true">
        {getAvatar(student.name)}
      </span>
      <span className="student-name">{student.name}</span>
      <span className="student-streak">
        🔥{" "}
        {formatStreak(
          student.streaks.login?.current || student.streaks.current || 0
        )}
      </span>
    </motion.button>
  );
}
