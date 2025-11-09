"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Goal } from "@/types";
import { staggerContainerVariant, staggerItemVariant } from "@/lib/animations";
import { CircularProgress } from "./ui/CircularProgress";

interface ProgressCardProps {
  goals: Goal[];
  studentAge: number;
}

export default function ProgressCard({
  goals,
  studentAge,
}: ProgressCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getSubjectEmoji = (subject: string): string => {
    const lower = subject.toLowerCase();
    if (lower.includes("reading") || lower.includes("literature")) return "📚";
    if (lower.includes("writing")) return "✍️";
    if (lower.includes("math")) return "🔢";
    if (lower.includes("science")) return "🔬";
    if (lower.includes("history")) return "🏛️";
    if (lower.includes("art")) return "🎨";
    return "📖";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="doodle-card mb-6 overflow-visible"
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            📊
          </motion.span>
          <h3 className="text-3xl font-hand font-bold text-doodle-sketch">
            Your Progress
          </h3>
        </div>

        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
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

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="px-6 pb-6"
          >
            <motion.div
              variants={staggerContainerVariant}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-12 pt-4"
            >
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  variants={staggerItemVariant}
                  className="flex flex-col items-center space-y-4"
                >
                  <CircularProgress
                    progress={goal.progress}
                    size={150}
                    strokeWidth={12}
                    label={goal.subject}
                    icon={getSubjectEmoji(goal.subject)}
                    animated={true}
                  />

                  <div className="flex flex-wrap gap-2 justify-center max-w-[200px]">
                    {goal.topics.slice(0, 3).map((topic, topicIndex) => (
                      <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + topicIndex * 0.1 }}
                        className="px-3 py-1 bg-white rounded-full border-2 border-doodle-sketch text-xs font-sketch"
                        style={{
                          transform: `rotate(${
                            topicIndex % 2 === 0 ? -1 : 1
                          }deg)`,
                        }}
                        whileHover={{
                          scale: 1.1,
                          rotate: 0,
                          boxShadow: "2px 2px 0px var(--doodle-sketch)",
                        }}
                      >
                        <span className="text-doodle-sketch font-medium">
                          {topic.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {goal.progress >= 90 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.8,
                      }}
                      className="inline-flex items-center space-x-2 bg-doodle-green text-white px-4 py-2 rounded-full border-2 border-doodle-sketch font-sketch font-bold text-sm"
                      style={{ transform: "rotate(-2deg)" }}
                    >
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        🎓
                      </motion.span>
                      <span>Mastered!</span>
                    </motion.div>
                  )}
                  {goal.progress < 40 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="inline-flex items-center space-x-2 bg-doodle-yellow text-doodle-sketch px-4 py-2 rounded-full border-2 border-doodle-sketch font-sketch font-bold text-sm"
                      style={{ transform: "rotate(1deg)" }}
                    >
                      <span>💪</span>
                      <span>Keep going!</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
