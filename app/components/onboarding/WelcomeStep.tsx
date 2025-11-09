"use client";

import { motion } from "framer-motion";
import AnimatedBubble from "../AnimatedBubble";

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <motion.div
      className="onboarding-step"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <AnimatedBubble state="celebrating" size={150} />
      </motion.div>

      <motion.div
        className="speech-bubble"
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <h2 className="font-hand text-4xl text-doodle-sketch mb-3">
          Hi there! 👋
        </h2>
        <p className="font-sketch text-lg text-doodle-sketch">
          I&apos;m your AI study buddy! Let&apos;s make learning fun together!
          I&apos;ll remember everything you learn and help you practice between
          your tutoring sessions.
        </p>
      </motion.div>

      <motion.button
        className="sketch-button sketch-button--primary px-8 py-4 text-xl"
        onClick={() => onNext()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let&apos;s go! →
      </motion.button>

      <motion.button
        className="text-sm text-doodle-sketch opacity-50 hover:opacity-100 transition-opacity underline"
        onClick={onSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Skip tutorial
      </motion.button>
    </motion.div>
  );
}
