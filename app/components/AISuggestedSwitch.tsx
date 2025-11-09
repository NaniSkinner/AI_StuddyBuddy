"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Goal } from "@/types";

interface AISuggestedSwitchProps {
  suggestedGoal: Goal;
  currentGoal: Goal;
  reason: string;
  studentColor: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function AISuggestedSwitch({
  suggestedGoal,
  currentGoal,
  reason,
  studentColor,
  onAccept,
  onDecline,
}: AISuggestedSwitchProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="mx-4 mb-4"
      >
        <div
          className="relative bg-white rounded-2xl border-3 border-[#2D3748] p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.1)]"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          {/* AI Icon */}
          <div className="absolute -top-4 -left-4">
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-3 border-[#2D3748] shadow-[3px_3px_0px_rgba(0,0,0,0.1)]"
              style={{ backgroundColor: studentColor }}
              animate={{
                y: [0, -4, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🤔
            </motion.div>
          </div>

          {/* Content */}
          <div className="ml-8">
            <h3 className="font-['Architects_Daughter'] text-xl font-bold text-[#2D3748] mb-2">
              Time for a change? 🌟
            </h3>

            <p className="font-['Architects_Daughter'] text-lg text-gray-700 mb-3">
              {reason}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600 font-['Architects_Daughter']">
                Switch from
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-['Architects_Daughter'] font-bold border-2 border-gray-300">
                {currentGoal.subject}
              </span>
              <span className="text-xl">→</span>
              <span
                className="px-3 py-1 rounded-full text-sm font-['Architects_Daughter'] font-bold border-2 text-white"
                style={{ backgroundColor: studentColor, borderColor: "#2D3748" }}
              >
                {suggestedGoal.subject}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={onAccept}
                className="px-6 py-2 rounded-xl text-white font-['Architects_Daughter'] font-bold text-lg border-3 border-[#2D3748] shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                style={{ backgroundColor: studentColor }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Let&apos;s switch! 🚀
              </motion.button>

              <button
                onClick={onDecline}
                className="px-6 py-2 rounded-xl bg-transparent text-[#2D3748] font-['Architects_Daughter'] font-bold text-lg border-2 border-[#2D3748] hover:bg-gray-100 transition-colors duration-150"
              >
                Keep going ✨
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
