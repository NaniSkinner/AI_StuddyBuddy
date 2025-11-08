"use client";

import { motion } from "framer-motion";
import { Achievement, BadgeRarity } from "@/types";
import BadgeCard from "./BadgeCard";
import { staggerContainerVariant, staggerItemVariant } from "@/lib/animations";

interface BadgeCollectionProps {
  achievements: Array<Achievement & { unlocked: boolean }>;
  totalPoints: number;
  onBadgeClick?: (achievement: Achievement) => void;
}

export default function BadgeCollection({
  achievements,
  totalPoints,
  onBadgeClick,
}: BadgeCollectionProps) {
  // Group by rarity
  const groupedByRarity: Record<
    BadgeRarity,
    Array<Achievement & { unlocked: boolean }>
  > = {
    common: [],
    uncommon: [],
    rare: [],
    legendary: [],
  };

  achievements.forEach((achievement) => {
    groupedByRarity[achievement.rarity].push(achievement);
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="font-hand text-5xl font-bold text-doodle-sketch mb-3">
          🏆 Your Achievements
        </h2>
        <p className="font-sketch text-xl text-doodle-sketch mb-2">
          Progress: {unlockedCount}/{totalCount} badges unlocked
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-doodle-yellow rounded-full border-3 border-doodle-sketch">
          <span className="font-hand text-2xl font-bold text-doodle-sketch">
            Total Points: {totalPoints}
          </span>
          <span className="text-2xl">🌟</span>
        </div>
      </div>

      {/* Empty State */}
      {unlockedCount === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">🎯</div>
          <p className="font-hand text-2xl text-doodle-sketch mb-2">
            No achievements yet!
          </p>
          <p className="font-sketch text-lg text-doodle-sketch opacity-70">
            Start learning to earn your first badge! 🚀
          </p>
        </motion.div>
      )}

      {/* Badges Grouped by Rarity */}
      {Object.entries(groupedByRarity).map(([rarity, badges]) => {
        if (badges.length === 0) return null;

        return (
          <div key={rarity} className="mb-10">
            {/* Rarity Section Header */}
            <h3 className="font-sketch text-2xl font-bold text-doodle-sketch capitalize mb-4 flex items-center gap-2">
              <span>{rarity}</span>
              <span className="text-sm opacity-60">
                ({badges.filter((b) => b.unlocked).length}/{badges.length})
              </span>
            </h3>

            {/* Badge Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={staggerContainerVariant}
              initial="hidden"
              animate="visible"
            >
              {badges.map((badge, index) => (
                <motion.div key={badge.id} variants={staggerItemVariant}>
                  <BadgeCard
                    badge={badge}
                    unlocked={badge.unlocked}
                    onClick={() => badge.unlocked && onBadgeClick?.(badge)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

