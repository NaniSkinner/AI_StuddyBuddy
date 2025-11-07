"use client";

import { motion } from "framer-motion";
import { SketchButton } from "./ui/SketchButton";

interface TopBarProps {
  studentName: string;
  currentStreak: number;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export default function TopBar({
  studentName,
  currentStreak,
  onSettingsClick,
  onLogoutClick,
}: TopBarProps) {
  return (
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
      </div>

      <div className="flex items-center space-x-4">
        {/* Streak Counter - Doodle Style */}
        {currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center space-x-3 bg-doodle-orange px-5 py-3 rounded-full border-2 border-doodle-sketch"
            style={{ transform: "rotate(-2deg)" }}
            whileHover={{ 
              scale: 1.05,
              rotate: 2,
              boxShadow: "4px 4px 0px var(--doodle-sketch)"
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="text-3xl"
            >
              🔥
            </motion.span>
            <div className="flex flex-col">
              <span className="text-base font-hand font-bold text-white">
                {currentStreak} Day Streak
              </span>
              <span className="text-xs font-sketch text-white opacity-90">
                Keep it going!
              </span>
            </div>
          </motion.div>
        )}

        {/* Settings Button - Doodle Style */}
        <motion.button
          onClick={onSettingsClick}
          className="p-3 bg-white border-2 border-doodle-sketch rounded-full"
          style={{ transform: "rotate(1deg)" }}
          whileHover={{ 
            scale: 1.1,
            rotate: 10,
            boxShadow: "3px 3px 0px var(--doodle-sketch)"
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
        <SketchButton
          variant="ghost"
          size="medium"
          onClick={onLogoutClick}
        >
          Logout 👋
        </SketchButton>
      </div>
    </div>
  );
}
