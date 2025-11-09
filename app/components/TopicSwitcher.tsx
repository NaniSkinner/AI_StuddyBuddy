"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Goal } from "@/types";

interface TopicSwitcherProps {
  goals: Goal[];
  currentGoalId?: string;
  onSwitchTopic: (goalId: string) => void;
}

export default function TopicSwitcher({
  goals,
  currentGoalId,
  onSwitchTopic,
}: TopicSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentGoal = goals.find((g) => g.id === currentGoalId) || goals[0];

  const handleSelect = (goalId: string) => {
    onSwitchTopic(goalId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Current Topic Button - Doodle Style */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-5 py-3 bg-white border-2 border-doodle-sketch rounded-xl font-sketch"
        style={{ transform: "rotate(-1deg)" }}
        whileHover={{ 
          scale: 1.02,
          rotate: 1,
          boxShadow: "4px 4px 0px var(--doodle-sketch)"
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            📖
          </motion.span>
          <div className="text-left">
            <div className="text-xs font-indie text-doodle-sketch opacity-60">
              Currently studying
            </div>
            <div className="font-hand font-bold text-lg text-doodle-sketch">
              {currentGoal?.subject}
            </div>
          </div>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-6 h-6 text-doodle-sketch"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu - Doodle Style */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute top-full left-0 mt-3 w-80 bg-white border-3 border-doodle-sketch rounded-2xl shadow-doodle-lg z-20 overflow-hidden"
              style={{ borderWidth: "3px" }}
            >
              <div className="p-3">
                <div className="px-3 py-2 text-sm font-hand font-bold text-doodle-sketch uppercase tracking-wide">
                  ✨ Switch Subject
                </div>
                {goals.map((goal, index) => (
                  <motion.button
                    key={goal.id}
                    onClick={() => handleSelect(goal.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      x: 6,
                      scale: 1.02,
                      boxShadow: "3px 3px 0px var(--doodle-sketch)"
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border-2 my-2 font-sketch ${
                      goal.id === currentGoalId
                        ? "bg-doodle-purple text-white border-doodle-sketch"
                        : "bg-doodle-cream border-doodle-sketch hover:bg-doodle-yellow"
                    }`}
                    style={{ transform: goal.id === currentGoalId ? "rotate(0deg)" : "rotate(-0.5deg)" }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.span 
                        className="text-2xl"
                        whileHover={{ scale: 1.3, rotate: 20 }}
                      >
                        {goal.id === currentGoalId ? "✓" : "📚"}
                      </motion.span>
                      <div className="text-left">
                        <div className={`font-hand font-bold ${
                          goal.id === currentGoalId ? "text-white" : "text-doodle-sketch"
                        }`}>
                          {goal.subject}
                        </div>
                        <div className={`text-xs font-indie ${
                          goal.id === currentGoalId ? "text-white opacity-90" : "text-doodle-sketch opacity-60"
                        }`}>
                          {goal.topics.length} topics
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-hand font-bold ${
                        goal.id === currentGoalId ? "text-white" : "text-doodle-sketch"
                      }`}>
                        {goal.progress}%
                      </div>
                      <div className={`w-16 rounded-full h-2 border border-doodle-sketch ${
                        goal.id === currentGoalId ? "bg-white" : "bg-doodle-cream"
                      }`}>
                        <div
                          className={`h-full rounded-full transition-all ${
                            goal.id === currentGoalId ? "bg-doodle-yellow" : "bg-doodle-green"
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// AI-Suggested Topic Switch Component
interface AISuggestedSwitchProps {
  suggestedSubject: string;
  reason: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function AISuggestedSwitch({
  suggestedSubject,
  reason,
  onAccept,
  onDecline,
}: AISuggestedSwitchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="doodle-card bg-gradient-to-r from-doodle-purple to-doodle-lavender p-5 mb-4"
      style={{ transform: "rotate(-0.5deg)" }}
    >
      <div className="flex items-start space-x-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          className="text-4xl"
        >
          💡
        </motion.div>
        <div className="flex-1">
          <h4 className="font-hand font-bold text-2xl text-white mb-2">
            Ready to switch subjects?
          </h4>
          <p className="text-base font-sketch text-white mb-4 opacity-90">
            {reason} Want to work on <span className="font-bold underline decoration-wavy">{suggestedSubject}</span>?
          </p>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95, rotate: -2 }}
              onClick={onAccept}
              className="sketch-button bg-doodle-green text-white border-white"
            >
              Yes, let&apos;s switch! 🚀
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDecline}
              className="sketch-button--ghost text-white border-white font-sketch"
            >
              No thanks
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

