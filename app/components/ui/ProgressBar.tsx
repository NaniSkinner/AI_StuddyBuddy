"use client";

import React from "react";
import { motion } from "framer-motion";
import { progressBarVariant } from "@/lib/animations";

export interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
}

const variantColors = {
  default: "bg-gradient-to-r from-doodle-green to-doodle-mint",
  success: "bg-doodle-green",
  warning: "bg-doodle-orange",
  info: "bg-doodle-blue",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  variant = "default",
  className = "",
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-sketch text-doodle-sketch">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-bold font-hand text-doodle-sketch">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div className="progress-container">
        <motion.div
          className={`progress-fill ${variantColors[variant]}`}
          custom={clampedProgress}
          variants={progressBarVariant}
          initial="initial"
          animate="animate"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
