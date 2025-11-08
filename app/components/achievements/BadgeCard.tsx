"use client";

import { motion } from "framer-motion";
import { Achievement, RARITY_COLORS } from "@/types";

interface BadgeCardProps {
  badge: Achievement;
  unlocked: boolean;
  onClick?: () => void;
  recentlyUnlocked?: boolean;
}

export default function BadgeCard({
  badge,
  unlocked,
  onClick,
  recentlyUnlocked = false,
}: BadgeCardProps) {
  const rarityColor = RARITY_COLORS[badge.rarity];

  if (!unlocked) {
    // Locked state
    return (
      <motion.div
        className="relative w-full p-4 bg-white bg-opacity-50 border-2 border-dashed border-doodle-sketch rounded-xl text-center transition-all duration-300 hover:opacity-80 hover:-translate-y-1"
        style={{
          filter: "grayscale(100%)",
          opacity: 0.6,
        }}
        whileHover={{ opacity: 0.8, y: -2 }}
      >
        {/* Lock Icon */}
        <div className="text-4xl mb-2">🔒</div>

        {/* Badge Icon (grayed out) */}
        <div
          className="text-5xl mb-2 opacity-50"
          style={{ filter: "grayscale(100%) brightness(1.2)" }}
        >
          {badge.icon}
        </div>

        {/* Badge Name */}
        <h4 className="font-sketch text-sm text-doodle-sketch opacity-50 mb-1">
          {badge.name}
        </h4>

        {/* Points */}
        <p className="font-indie text-xs text-doodle-sketch opacity-40">
          +{badge.points} points
        </p>
      </motion.div>
    );
  }

  // Unlocked state
  return (
    <motion.div
      className={`relative w-full p-4 rounded-xl border-3 text-center cursor-pointer transition-all ${
        recentlyUnlocked ? "recently-unlocked" : ""
      }`}
      style={{
        background: `linear-gradient(145deg, ${rarityColor}, ${rarityColor}99)`,
        borderWidth: "3px",
        borderColor: "var(--doodle-sketch)",
        transform: "rotate(-2deg)",
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.15)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      animate={
        recentlyUnlocked
          ? {
              boxShadow: [
                "4px 4px 0px rgba(0, 0, 0, 0.1)",
                `0 0 20px ${rarityColor}`,
                "4px 4px 0px rgba(0, 0, 0, 0.1)",
              ],
            }
          : {}
      }
      transition={
        recentlyUnlocked
          ? {
              duration: 2,
              repeat: 2,
              ease: "easeInOut",
            }
          : {
              type: "spring",
              stiffness: 300,
              damping: 20,
            }
      }
    >
      {/* Rarity Indicator Dot */}
      <div
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-doodle-sketch"
        style={{
          background: rarityColor,
          boxShadow: `0 0 10px ${rarityColor}`,
        }}
      />

      {/* Badge Icon with Float Animation */}
      <motion.div
        className="text-5xl mb-2"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {badge.icon}
      </motion.div>

      {/* Badge Name */}
      <h4 className="font-hand text-lg font-bold text-doodle-sketch mb-1">
        {badge.name}
      </h4>

      {/* Points */}
      <p className="font-sketch text-xs text-doodle-sketch opacity-70">
        +{badge.points}
      </p>
    </motion.div>
  );
}

