"use client";

import { motion } from "framer-motion";
import AnimatedBubble from "../AnimatedBubble";
import {
  bounceInVariant,
  staggerContainerVariant,
  staggerItemVariant,
} from "@/lib/animations";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
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
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="max-w-2xl w-full doodle-card p-12 text-center"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AnimatedBubble state="celebrating" size={120} />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-6xl font-hand font-bold text-doodle-sketch mb-4"
        >
          Welcome to
          <br />
          <span className="inline-block" style={{ transform: "rotate(-2deg)" }}>
            AI Study Companion! ✨
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-sketch text-doodle-sketch opacity-80 mb-10"
        >
          Your personal AI tutor that remembers everything you learn and helps
          you grow between tutoring sessions.
        </motion.p>

        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: "🧠",
              title: "Remembers Everything",
              description: "I keep track of all your lessons and progress",
            },
            {
              icon: "🎯",
              title: "Personalized Practice",
              description: "Get tasks tailored to your learning style",
            },
            {
              icon: "🔥",
              title: "Stay Motivated",
              description: "Build streaks and earn achievement badges",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={staggerItemVariant}
              className="text-center p-6 bg-white rounded-2xl border-2 border-doodle-sketch"
              style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                boxShadow: "4px 4px 0px var(--doodle-sketch)",
              }}
            >
              <motion.div
                className="text-5xl mb-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="font-hand font-bold text-xl text-doodle-sketch mb-2">
                {feature.title}
              </h3>
              <p className="text-sm font-sketch text-doodle-sketch opacity-70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.92, rotate: -2 }}
          onClick={onGetStarted}
          className="sketch-button px-10 py-5 text-2xl"
        >
          Get Started! 🚀
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
