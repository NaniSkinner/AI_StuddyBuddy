"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Achievement } from "@/types";
import {
  staggerContainerVariant,
  staggerItemVariant,
  celebrationVariant,
} from "@/lib/animations";

interface AchievementBadgesProps {
  achievements: Array<Achievement & { unlocked: boolean }>;
  onBadgeClick?: (achievement: Achievement) => void;
}

export default function AchievementBadges({
  achievements,
  onBadgeClick,
}: AchievementBadgesProps) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      variants={staggerContainerVariant}
      initial="hidden"
      animate="visible"
    >
      {achievements.map((achievement, index) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          onClick={() => onBadgeClick?.(achievement)}
          index={index}
        />
      ))}
    </motion.div>
  );
}

interface AchievementBadgeProps {
  achievement: Achievement & { unlocked: boolean };
  onClick?: () => void;
  index: number;
}

function AchievementBadge({
  achievement,
  onClick,
  index,
}: AchievementBadgeProps) {
  const { unlocked } = achievement;

  return (
    <motion.div
      variants={staggerItemVariant}
      whileHover={
        unlocked
          ? {
              scale: 1.08,
              rotate: index % 2 === 0 ? 3 : -3,
              boxShadow: "6px 6px 0px var(--doodle-sketch)",
            }
          : {}
      }
      whileTap={unlocked ? { scale: 0.95 } : {}}
      onClick={unlocked ? onClick : undefined}
      className={`relative p-6 rounded-2xl border-3 transition-all doodle-card ${
        unlocked
          ? "bg-gradient-to-br from-doodle-yellow to-doodle-peach cursor-pointer"
          : "bg-doodle-cream opacity-60"
      }`}
      style={{
        borderWidth: "3px",
        transform: unlocked
          ? `rotate(${index % 2 === 0 ? -1 : 1}deg)`
          : "rotate(0deg)",
      }}
    >
      {/* Badge Icon - Doodle Style */}
      <div className="flex justify-center mb-3 relative">
        <motion.div
          initial={unlocked ? { scale: 0, rotate: -180 } : { scale: 1 }}
          animate={unlocked ? { scale: 1, rotate: 0 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`text-6xl ${unlocked ? "" : "grayscale opacity-40"}`}
        >
          {achievement.icon}
        </motion.div>
        {unlocked && (
          <>
            <motion.span
              className="absolute -top-2 -right-2 text-2xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐
            </motion.span>
            <motion.span
              className="absolute -top-2 -left-2 text-2xl"
              animate={{
                rotate: [0, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              ✨
            </motion.span>
          </>
        )}
      </div>

      {/* Badge Name - Doodle Style */}
      <h4
        className={`text-center font-hand font-bold text-lg mb-2 ${
          unlocked ? "text-doodle-sketch" : "text-doodle-sketch opacity-50"
        }`}
      >
        {achievement.name}
      </h4>

      {/* Badge Description */}
      <p
        className={`text-xs text-center font-sketch ${
          unlocked ? "text-doodle-sketch" : "text-doodle-sketch opacity-40"
        }`}
      >
        {achievement.description}
      </p>

      {/* Trigger Info */}
      <p
        className={`text-xs text-center mt-2 font-indie italic ${
          unlocked
            ? "text-doodle-sketch opacity-70"
            : "text-doodle-sketch opacity-30"
        }`}
      >
        {achievement.trigger}
      </p>

      {/* Locked Overlay - Doodle Style */}
      {!unlocked && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-5xl">🔒</div>
        </motion.div>
      )}

      {/* Unlock Glow Effect - Doodle Style */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 230, 109, 0.4) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}

// Unlock Animation Component (to show when badge is earned) - Doodle Style
export function AchievementUnlockAnimation({
  achievement,
  onComplete,
}: {
  achievement: Achievement;
  onComplete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white rounded-3xl p-10 max-w-md mx-4 relative overflow-hidden border-4 border-doodle-sketch"
        style={{ transform: "rotate(-1deg)" }}
      >
        {/* Confetti Effect - Doodle Colors */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const colors = [
              "bg-doodle-yellow",
              "bg-doodle-pink",
              "bg-doodle-orange",
              "bg-doodle-green",
              "bg-doodle-purple",
              "bg-doodle-blue",
            ];
            const randomColor = colors[i % colors.length];
            return (
              <motion.div
                key={i}
                className={`absolute w-3 h-3 ${randomColor} rounded-full`}
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.03,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>

        <div className="text-center relative z-10">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: 3,
            }}
            className="text-8xl mb-6"
          >
            {achievement.icon}
          </motion.div>

          <motion.h2
            className="text-4xl font-hand font-bold text-doodle-sketch mb-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            Achievement Unlocked! 🎉
          </motion.h2>

          <motion.div
            className="inline-block px-6 py-2 bg-doodle-purple rounded-full border-3 border-doodle-sketch mb-4"
            style={{ transform: "rotate(-2deg)", borderWidth: "3px" }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <h3 className="text-2xl font-hand font-bold text-white">
              {achievement.name}
            </h3>
          </motion.div>

          <p className="text-lg font-sketch text-doodle-sketch mb-6 opacity-80">
            {achievement.description}
          </p>

          <motion.button
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.92, rotate: -2 }}
            onClick={onComplete}
            className="sketch-button px-8 py-4 text-xl"
          >
            Awesome! 🚀
          </motion.button>
        </div>

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
  );
}
