"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Achievement, RARITY_COLORS } from "@/types";
import Confetti from "./Confetti";

interface UnlockNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function UnlockNotification({
  achievement,
  onClose,
}: UnlockNotificationProps) {
  const rarityColor = RARITY_COLORS[achievement.rarity];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md mx-4 p-10 bg-white rounded-3xl border-4 border-doodle-sketch text-center overflow-hidden"
          style={{
            transform: "rotate(-1deg)",
            boxShadow:
              "8px 8px 0px rgba(0, 0, 0, 0.1), 16px 16px 0px rgba(0, 0, 0, 0.05)",
          }}
          initial={{ scale: 0, rotate: -10 }}
          animate={{
            scale: [0, 1.1, 0.95, 1],
            rotate: [-10, 5, -5, 0],
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 0.8,
            times: [0, 0.5, 0.7, 1],
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti Effect */}
          <Confetti count={30} />

          {/* Header */}
          <motion.h3
            className="font-hand text-4xl font-bold text-doodle-sketch mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            🎉 Achievement Unlocked!
          </motion.h3>

          {/* Badge Showcase */}
          <motion.div className="my-8">
            {/* Badge Icon */}
            <motion.div
              className="text-8xl mb-4"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: 3,
              }}
            >
              {achievement.icon}
            </motion.div>

            {/* Badge Name Pill */}
            <motion.div
              className="inline-block px-6 py-3 rounded-full border-3 border-doodle-sketch mb-3"
              style={{
                background: `linear-gradient(145deg, ${rarityColor}, ${rarityColor}99)`,
                transform: "rotate(-2deg)",
                borderWidth: "3px",
              }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <h3 className="font-hand text-2xl font-bold text-doodle-sketch">
                {achievement.name}
              </h3>
            </motion.div>

            {/* Points */}
            <p className="font-sketch text-xl text-doodle-green font-bold">
              +{achievement.points} points
            </p>
          </motion.div>

          {/* Description */}
          <p className="font-sketch text-lg text-doodle-sketch opacity-80 mb-6">
            {achievement.description}
          </p>

          {/* Close Button */}
          <motion.button
            className="sketch-button sketch-button--primary px-8 py-4 text-xl"
            onClick={onClose}
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.92, rotate: -2 }}
          >
            Awesome! 🚀
          </motion.button>

          {/* Decorative Corner Elements */}
          <motion.span
            className="absolute top-4 right-4 text-4xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            ⭐
          </motion.span>
          <motion.span
            className="absolute bottom-4 left-4 text-4xl"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
