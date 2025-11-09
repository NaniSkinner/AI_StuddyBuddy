"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { staggerContainerVariant, staggerItemVariant } from "@/lib/animations";

interface GoalSetupStepProps {
  onNext: (data: { subjects: string[]; customSubject: string | null }) => void;
  onSkip: () => void;
}

const SUBJECT_OPTIONS = [
  { id: "math", name: "Math", icon: "➕" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "reading", name: "Reading", icon: "📖" },
  { id: "writing", name: "Writing", icon: "✍️" },
  { id: "history", name: "History", icon: "🏛️" },
];

const MAX_SUBJECTS = 3;

export default function GoalSetupStep({ onNext, onSkip }: GoalSetupStepProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      } else if (prev.length < MAX_SUBJECTS) {
        return [...prev, subjectId];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    onNext({
      subjects: selectedSubjects,
      customSubject: customSubject.trim() || null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-doodle-cream p-8"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-3xl w-full doodle-card p-12"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-hand font-bold text-doodle-sketch mb-4"
            style={{ transform: "rotate(-1deg)" }}
          >
            What do you want to learn today? 📚
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-sketch text-doodle-sketch opacity-80"
          >
            Choose up to {MAX_SUBJECTS} subjects (you can always add more
            later!)
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
        >
          {SUBJECT_OPTIONS.map((subject) => {
            const isSelected = selectedSubjects.includes(subject.id);
            const isDisabled =
              !isSelected && selectedSubjects.length >= MAX_SUBJECTS;

            return (
              <motion.button
                key={subject.id}
                variants={staggerItemVariant}
                onClick={() => !isDisabled && toggleSubject(subject.id)}
                disabled={isDisabled}
                className={`relative p-6 rounded-2xl border-3 transition-all ${
                  isSelected
                    ? "bg-doodle-purple text-white border-doodle-sketch shadow-doodle-lg scale-105"
                    : isDisabled
                    ? "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed"
                    : "bg-white border-doodle-sketch hover:scale-105 shadow-doodle"
                }`}
                style={{
                  borderWidth: "3px",
                  transform: isSelected ? "rotate(0deg)" : undefined,
                }}
                whileHover={!isDisabled ? { scale: 1.08 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
              >
                <div className="text-4xl mb-2">{subject.icon}</div>
                <div className="font-hand font-bold text-lg">
                  {subject.name}
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          <div className="relative p-6 rounded-2xl border-3 border-doodle-sketch bg-white shadow-doodle">
            <div className="text-4xl mb-2">✨</div>
            <input
              type="text"
              placeholder="Other..."
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              maxLength={30}
              className="w-full font-sketch text-lg bg-transparent border-none outline-none focus:ring-0 placeholder-doodle-sketch placeholder-opacity-50"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center font-sketch text-doodle-sketch opacity-70 mb-8"
        >
          You can always add more subjects later!
        </motion.p>

        <div className="flex space-x-4">
          <motion.button
            onClick={onSkip}
            className="sketch-button--ghost px-6 py-3 font-sketch"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip for now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, rotate: 1 }}
            whileTap={{ scale: 0.98, rotate: -1 }}
            onClick={handleConfirm}
            className="flex-1 sketch-button sketch-button--primary px-8 py-4 text-lg"
          >
            Start Learning! 🚀
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
