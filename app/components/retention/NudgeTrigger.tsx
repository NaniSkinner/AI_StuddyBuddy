"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface NudgeTriggerProps {
  onTrigger: () => void;
}

export default function NudgeTrigger({ onTrigger }: NudgeTriggerProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onTrigger();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      className="fixed bottom-5 left-5 z-[9997]
                 px-4 py-3 rounded-2xl
                 bg-gradient-to-r from-[#F97316] to-[#EA580C]
                 text-white font-['Architects_Daughter'] font-bold text-sm
                 border-3 border-[#2D3748]
                 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]
                 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.2)]
                 hover:translate-x-[2px] hover:translate-y-[2px]
                 transition-all duration-150
                 flex items-center gap-2"
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <span className="text-lg">{isLoading ? "⏳" : "🔔"}</span>
      <span>{isLoading ? "Loading..." : "Test Nudge"}</span>
    </motion.button>
  );
}

/**
 * Nudge Trigger with Scenario Selector (Advanced)
 */
interface NudgeTriggerAdvancedProps {
  onTrigger: (scenario?: string) => void;
}

export function NudgeTriggerAdvanced({
  onTrigger,
}: NudgeTriggerAdvancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const scenarios = [
    { id: "auto", label: "Auto (Current State)", icon: "🎯" },
    { id: "inactive", label: "Inactive 3 Days", icon: "😴" },
    { id: "goal_completed", label: "Goal Completed", icon: "🏆" },
    { id: "streak_broken", label: "Streak Broken", icon: "💔" },
    { id: "low_completion", label: "Low Task Completion", icon: "📉" },
  ];

  const handleTrigger = async (scenario: string) => {
    setIsLoading(true);
    setIsOpen(false);
    try {
      await onTrigger(scenario === "auto" ? undefined : scenario);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-[9997]">
      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          className="absolute bottom-full left-0 mb-2
                     bg-white rounded-2xl border-3 border-[#2D3748]
                     shadow-[4px_4px_0px_rgba(0,0,0,0.2)]
                     p-2 min-w-[220px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              className="w-full px-3 py-2 rounded-xl
                       text-left font-['Architects_Daughter'] text-sm
                       hover:bg-[#6FB1FC]/10
                       flex items-center gap-2
                       transition-colors"
              onClick={() => handleTrigger(scenario.id)}
            >
              <span>{scenario.icon}</span>
              <span>{scenario.label}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Main Button */}
      <motion.button
        className="px-4 py-3 rounded-2xl
                   bg-gradient-to-r from-[#F97316] to-[#EA580C]
                   text-white font-['Architects_Daughter'] font-bold text-sm
                   border-3 border-[#2D3748]
                   shadow-[4px_4px_0px_rgba(0,0,0,0.2)]
                   hover:shadow-[2px_2px_0px_rgba(0,0,0,0.2)]
                   hover:translate-x-[2px] hover:translate-y-[2px]
                   transition-all duration-150
                   flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-lg">{isLoading ? "⏳" : "🔔"}</span>
        <span>{isLoading ? "Loading..." : "Test Nudge"}</span>
        {!isLoading && <span className="text-xs">▼</span>}
      </motion.button>
    </div>
  );
}

