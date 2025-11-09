"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface TutorialProps {
  onNext: () => void;
  onSkip: () => void;
  aiColor?: string;
}

const TUTORIAL_STEPS = [
  {
    title: "Chat with Your AI",
    description:
      "Click anywhere on the chat to start talking to me. I remember everything we discuss!",
    icon: "💬",
    highlight: "center",
  },
  {
    title: "Track Your Progress",
    description:
      "Check the progress card at the top to see how you're doing on each subject.",
    icon: "📊",
    highlight: "top",
  },
  {
    title: "Complete Your Tasks",
    description:
      "Look at the task sidebar on the right to see practice problems I've assigned you.",
    icon: "📚",
    highlight: "right",
  },
  {
    title: "Build Your Streak",
    description:
      "Come back every day to keep your learning streak going and unlock achievements!",
    icon: "🔥",
    highlight: "streak",
  },
];

export default function Tutorial({
  onNext,
  onSkip,
  aiColor = "#A685E2",
}: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const handleSkipClick = () => {
    onSkip();
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center"
    >
      {/* Tutorial Card - Doodle Style */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 pointer-events-auto border-4 border-doodle-sketch">
        {/* Progress Dots - Doodle Style */}
        <div className="flex justify-center space-x-3 mb-8">
          {TUTORIAL_STEPS.map((_, index) => (
            <motion.div
              key={index}
              className={`h-3 rounded-full border-2 border-doodle-sketch transition-all ${
                index === currentStep ? "w-10" : "w-3"
              }`}
              style={{
                backgroundColor: index <= currentStep ? aiColor : "transparent",
              }}
              animate={{
                scale: index === currentStep ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <div className="text-7xl text-center mb-6">{step.icon}</div>

            <div>
              <h2 className="text-3xl font-hand font-bold text-doodle-sketch mb-4 text-center">
                {step.title}
              </h2>
              <p className="text-lg font-sketch text-doodle-sketch opacity-80 text-center mb-8">
                {step.description}
              </p>
            </div>

            <div className="flex space-x-3">
              <motion.button
                onClick={handleSkipClick}
                className="sketch-button--ghost px-6 py-3 font-sketch"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Skip Tutorial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95, rotate: -1 }}
                onClick={handleNext}
                className="flex-1 px-6 py-3 text-white rounded-xl font-sketch font-bold shadow-doodle border-2 border-doodle-sketch"
                style={{ backgroundColor: aiColor }}
              >
                {currentStep === TUTORIAL_STEPS.length - 1
                  ? "Start Learning! 🚀"
                  : "Next →"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
