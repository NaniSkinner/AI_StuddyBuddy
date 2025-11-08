"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeCollection,
  UnlockNotification,
} from "@/app/components/achievements";
import { useAchievements } from "@/lib/hooks/useAchievements";
import { useAppStore } from "@/lib/store/appStore";
import { Achievement } from "@/types";

export default function AchievementsPage() {
  const router = useRouter();
  const currentStudent = useAppStore((state) => state.currentStudent);
  const { getAllAchievements, getProgress, loading } = useAchievements();
  const [achievements, setAchievements] = useState<
    Array<Achievement & { unlocked: boolean }>
  >([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!currentStudent) {
      router.push("/login");
      return;
    }

    // Load achievements using student object
    loadAchievements();
  }, [currentStudent, router]);

  const loadAchievements = async () => {
    if (!currentStudent) return;

    // Pass Student object instead of ID to avoid file system access
    const allAchievements = await getAllAchievements(currentStudent);
    setAchievements(allAchievements);

    // Get total points from student object directly
    setTotalPoints(currentStudent.totalPoints || 0);
  };

  const handleBadgeClick = (achievement: Achievement) => {
    setSelectedBadge(achievement);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-doodle-cream flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          🏆
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-doodle-cream p-8">
      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        className="mb-6 px-6 py-3 bg-white border-2 border-doodle-sketch rounded-full font-sketch text-lg"
        style={{ transform: "rotate(-1deg)" }}
        whileHover={{
          scale: 1.05,
          rotate: 1,
          boxShadow: "4px 4px 0px var(--doodle-sketch)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      {/* Badge Collection */}
      <BadgeCollection
        achievements={achievements}
        totalPoints={totalPoints}
        onBadgeClick={handleBadgeClick}
      />

      {/* Badge Detail Modal (reusing UnlockNotification) */}
      {selectedBadge && (
        <UnlockNotification
          achievement={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
}
