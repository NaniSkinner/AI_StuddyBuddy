"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  icon?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function CircularProgress({
  progress,
  size = 140,
  strokeWidth = 12,
  color = "#A685E2", // doodle-purple
  label,
  icon,
  showPercentage = true,
  animated = true,
}: CircularProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayProgress(progress), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const getProgressColor = () => {
    if (progress >= 80) return "var(--doodle-green)";
    if (progress >= 50) return "var(--doodle-blue)";
    if (progress >= 30) return "var(--doodle-orange)";
    return "var(--doodle-pink)";
  };

  const progressColor = color || getProgressColor();

  return (
    <div className="flex flex-col items-center space-y-3">
      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--doodle-cream)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />

          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && (
            <motion.span
              className="text-3xl mb-1"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {icon}
            </motion.span>
          )}
          {showPercentage && (
            <motion.span
              className="text-2xl font-hand font-bold text-doodle-sketch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(displayProgress)}%
            </motion.span>
          )}
        </div>

        {progress >= 80 && (
          <>
            <motion.span
              className="absolute -top-2 -right-2 text-xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐
            </motion.span>
            <motion.span
              className="absolute -bottom-2 -left-2 text-xl"
              animate={{
                rotate: [0, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              ✨
            </motion.span>
          </>
        )}
      </motion.div>

      {label && (
        <motion.div
          className="text-center px-4 py-2 bg-white rounded-xl border-2 border-doodle-sketch"
          style={{ transform: "rotate(-1deg)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="font-hand font-bold text-lg text-doodle-sketch">
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
}
