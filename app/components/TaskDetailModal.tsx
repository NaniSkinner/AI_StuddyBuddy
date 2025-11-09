"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/types";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onSubmit?: (task: Task, answer: string) => void;
  onMarkComplete?: (task: Task) => void;
}

export default function TaskDetailModal({
  task,
  onClose,
  onSubmit,
  onMarkComplete,
}: TaskDetailModalProps) {
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "📝";
      case "open_ended":
        return "✍️";
      case "real_world":
        return "🌍";
      default:
        return "📋";
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const submittedAnswer = task.type === "multiple_choice" ? selectedOption || "" : answer;
    onSubmit?.(task, submittedAnswer);
    setIsSubmitting(false);
  };

  const handleMarkComplete = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onMarkComplete?.(task);
    setIsSubmitting(false);
  };

  const isComplete = task.status === "complete";
  const canSubmit = task.type === "multiple_choice"
    ? selectedOption !== null
    : answer.trim().length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl border-3 border-doodle-sketch shadow-[8px_8px_0px_rgba(0,0,0,0.2)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-doodle-cream border-b-2 border-doodle-sketch p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {getTaskIcon(task.type)}
                </motion.span>
                <div>
                  <h2 className="text-2xl font-hand font-bold text-doodle-sketch">
                    {task.subject} Task
                  </h2>
                  <p className="text-sm font-sketch text-doodle-sketch opacity-70">
                    {task.topic}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-xs px-3 py-1 rounded-full border-2 border-doodle-sketch font-sketch font-bold ${
                  isComplete
                    ? "bg-doodle-green text-white"
                    : task.attempts > 0
                    ? "bg-doodle-orange text-white"
                    : "bg-doodle-blue text-white"
                }`}
              >
                {isComplete ? "Completed" : task.attempts > 0 ? "In Progress" : "New Task"}
              </span>
              <span className="text-xs px-3 py-1 bg-white rounded-full border-2 border-doodle-sketch font-sketch">
                {task.type.replace("_", " ")}
              </span>
              {task.attempts > 0 && (
                <span className="text-xs px-3 py-1 bg-doodle-yellow rounded-full border-2 border-doodle-sketch font-sketch">
                  {task.attempts} {task.attempts === 1 ? "attempt" : "attempts"}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Question */}
            <div>
              <h3 className="text-lg font-hand font-bold text-doodle-sketch mb-3">
                Question:
              </h3>
              <div className="bg-doodle-cream p-4 rounded-xl border-2 border-doodle-sketch">
                <p className="font-sketch text-doodle-sketch leading-relaxed">
                  {task.content.question}
                </p>
              </div>
            </div>

            {/* Answer Section */}
            {!isComplete && (
              <div>
                <h3 className="text-lg font-hand font-bold text-doodle-sketch mb-3">
                  Your Answer:
                </h3>

                {task.type === "multiple_choice" && task.content.options ? (
                  <div className="space-y-3">
                    {task.content.options.map((option, index) => (
                      <motion.label
                        key={index}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedOption === option
                            ? "bg-doodle-blue border-doodle-sketch shadow-[4px_4px_0px_rgba(0,0,0,0.15)]"
                            : "bg-white border-doodle-sketch hover:bg-doodle-cream"
                        }`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="answer"
                            value={option}
                            checked={selectedOption === option}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="w-5 h-5 text-doodle-blue border-2 border-doodle-sketch focus:ring-2 focus:ring-doodle-blue"
                          />
                          <span
                            className={`font-sketch ${
                              selectedOption === option
                                ? "text-white font-bold"
                                : "text-doodle-sketch"
                            }`}
                          >
                            {option}
                          </span>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full min-h-[150px] p-4 border-2 border-doodle-sketch rounded-xl font-sketch text-doodle-sketch focus:outline-none focus:ring-2 focus:ring-doodle-blue transition-all resize-none"
                    disabled={isSubmitting}
                  />
                )}
              </div>
            )}

            {/* Completed Message */}
            {isComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-doodle-green text-white p-6 rounded-xl border-2 border-doodle-sketch text-center"
              >
                <motion.p
                  className="text-5xl mb-3"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎉
                </motion.p>
                <p className="font-hand font-bold text-xl mb-2">Task Completed!</p>
                <p className="font-sketch text-sm opacity-90">
                  Great job! You&apos;ve finished this task.
                </p>
              </motion.div>
            )}

            {/* Hint Section (if available) */}
            {task.content.hints && task.content.hints.length > 0 && !isComplete && (
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="bg-doodle-yellow p-4 rounded-xl border-2 border-doodle-sketch flex items-center justify-between hover:shadow-[4px_4px_0px_rgba(0,0,0,0.15)] transition-all">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">💡</span>
                      <span className="font-hand font-bold text-doodle-sketch">
                        Need a hint?
                      </span>
                    </div>
                    <motion.span
                      className="text-doodle-sketch"
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      ▼
                    </motion.span>
                  </div>
                </summary>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-2 p-4 bg-white rounded-xl border-2 border-doodle-sketch"
                >
                  {task.content.hints.map((hint, index) => (
                    <p key={index} className="font-sketch text-doodle-sketch text-sm mb-2 last:mb-0">
                      {hint}
                    </p>
                  ))}
                </motion.div>
              </details>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t-2 border-doodle-sketch p-6 bg-doodle-cream">
            <div className="flex items-center justify-end space-x-3">
              <motion.button
                onClick={onClose}
                className="px-6 py-3 bg-white border-2 border-doodle-sketch rounded-xl font-hand font-bold text-doodle-sketch shadow-[3px_3px_0px_rgba(0,0,0,0.1)]"
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>

              {!isComplete && (
                <>
                  {task.type === "real_world" && (
                    <motion.button
                      onClick={handleMarkComplete}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-doodle-green border-2 border-doodle-sketch rounded-xl font-hand font-bold text-white shadow-[3px_3px_0px_rgba(0,0,0,0.1)] disabled:opacity-50"
                      whileHover={!isSubmitting ? { scale: 1.05, rotate: 1 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                    >
                      {isSubmitting ? "Submitting..." : "Mark as Complete ✓"}
                    </motion.button>
                  )}

                  {task.type !== "real_world" && (
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!canSubmit || isSubmitting}
                      className="px-6 py-3 bg-doodle-blue border-2 border-doodle-sketch rounded-xl font-hand font-bold text-white shadow-[3px_3px_0px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={canSubmit && !isSubmitting ? { scale: 1.05, rotate: 1 } : {}}
                      whileTap={canSubmit && !isSubmitting ? { scale: 0.95 } : {}}
                    >
                      {isSubmitting ? "Submitting..." : "Submit to Tutor 📤"}
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
