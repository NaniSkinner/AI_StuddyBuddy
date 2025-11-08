import { useState, useCallback } from "react";
import { Achievement, AchievementId, Student } from "@/types";
import {
  getAllAchievementsWithStatus,
  getAchievementProgress,
  AchievementProgress,
} from "@/lib/services/achievementService.client";

// Event types that can trigger achievement checks
export type AchievementEvent =
  | "conversation_complete"
  | "task_complete"
  | "question_asked"
  | "streak_update"
  | "progress_update"
  | "session_complete"
  | "goal_complete";

interface UseAchievementsReturn {
  checkAchievements: (
    studentId: string,
    eventType: AchievementEvent
  ) => Promise<Achievement[]>;
  getAllAchievements: (
    student: Student
  ) => Promise<Array<Achievement & { unlocked: boolean }>>;
  getProgress: (student: Student) => Promise<AchievementProgress>;
  loading: boolean;
  error: string | null;
}

export function useAchievements(): UseAchievementsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if any achievements should be unlocked based on an event
   * Returns array of newly unlocked achievements
   */
  const checkAchievements = useCallback(
    async (
      studentId: string,
      eventType: AchievementEvent
    ): Promise<Achievement[]> => {
      try {
        setLoading(true);
        setError(null);

        // TODO: This function needs to be implemented via API route
        // Achievement checking requires file system access to update student data
        // For now, this is a placeholder that returns empty array
        console.warn(
          "checkAchievements should be called via API route, not directly from client"
        );
        return [];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check achievements";
        setError(errorMessage);
        console.error("Error checking achievements:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get all achievements with locked/unlocked status
   */
  const getAllAchievements = useCallback(
    async (
      student: Student
    ): Promise<Array<Achievement & { unlocked: boolean }>> => {
      try {
        setLoading(true);
        setError(null);
        return await getAllAchievementsWithStatus(student);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get achievements";
        setError(errorMessage);
        console.error("Error getting achievements:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get achievement progress summary
   */
  const getProgress = useCallback(
    async (student: Student): Promise<AchievementProgress> => {
      try {
        setLoading(true);
        setError(null);
        return await getAchievementProgress(student);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to get achievement progress";
        setError(errorMessage);
        console.error("Error getting achievement progress:", err);
        return {
          totalAchievements: 6,
          unlockedCount: 0,
          percentage: 0,
          totalPoints: 0,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    checkAchievements,
    getAllAchievements,
    getProgress,
    loading,
    error,
  };
}
