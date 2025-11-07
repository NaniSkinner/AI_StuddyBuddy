/**
 * Onboarding Service
 * Manages the first-time user experience flow
 * Saves onboarding data and completion status to student profile
 */

import { authService } from "./authService";

export interface OnboardingData {
  aiColor?: string;
  subjects?: string[];
  customSubject?: string | null;
  completedAt?: string;
  skippedSteps?: string[];
}

export const onboardingService = {
  /**
   * Complete onboarding for a student
   * Saves all onboarding data and marks onboarding as complete
   * @param studentId - The student ID
   * @param data - The onboarding data collected during the flow
   */
  complete: async (
    studentId: string,
    data: Partial<OnboardingData>
  ): Promise<void> => {
    try {
      console.log("🟡 OnboardingService: Starting completion for", studentId);
      console.log("🟡 OnboardingService: Data to save:", data);

      // Get current student to merge preferences properly
      const currentStudent = await authService.getCurrentStudent();
      if (!currentStudent) {
        throw new Error("Student not found");
      }

      // Prepare updates - merge with existing preferences
      const updates: any = {
        preferences: {
          ...currentStudent.preferences,
          hasCompletedOnboarding: true,
        },
      };

      // Add AI color to preferences if provided
      if (data.aiColor) {
        updates.preferences.aiColor = data.aiColor;
      }

      console.log("🟡 OnboardingService: Sending updates:", updates);

      // Note: subjects are stored in goals array
      // In a real implementation, we would create Goal objects here
      // For now, we'll just mark onboarding as complete

      const response = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      console.log(
        "🟡 OnboardingService: Completed successfully for student:",
        studentId
      );
    } catch (error) {
      console.error(
        "🔴 OnboardingService: Error completing onboarding:",
        error
      );
      throw error;
    }
  },

  /**
   * Save intermediate onboarding step data
   * Allows resuming onboarding later
   * @param studentId - The student ID
   * @param step - The step name
   * @param data - The step data to save
   */
  saveStep: async (
    studentId: string,
    step: string,
    data: any
  ): Promise<void> => {
    try {
      // In a full implementation, we would save partial progress
      // For MVP, we'll just log it
      console.log(`Saving step ${step} for student ${studentId}:`, data);

      // Optionally save to localStorage for resume capability
      if (typeof window !== "undefined") {
        const key = `onboarding_${studentId}_${step}`;
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error saving onboarding step:", error);
      // Non-critical error, don't throw
    }
  },

  /**
   * Get saved onboarding progress
   * Retrieves any partially completed onboarding data
   * @param studentId - The student ID
   * @returns Promise<OnboardingData | null> - The saved progress or null
   */
  getProgress: async (studentId: string): Promise<OnboardingData | null> => {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      // Check if onboarding is already complete
      const student = await authService.getCurrentStudent();
      if (student?.preferences.hasCompletedOnboarding) {
        return null;
      }

      // Try to retrieve saved progress from localStorage
      const savedData: Partial<OnboardingData> = {};
      const steps = ["welcome", "color", "tutorial", "goals"];

      steps.forEach((step) => {
        const key = `onboarding_${studentId}_${step}`;
        const data = localStorage.getItem(key);
        if (data) {
          try {
            Object.assign(savedData, JSON.parse(data));
          } catch (e) {
            console.error(`Error parsing saved data for step ${step}:`, e);
          }
        }
      });

      return Object.keys(savedData).length > 0 ? savedData : null;
    } catch (error) {
      console.error("Error getting onboarding progress:", error);
      return null;
    }
  },

  /**
   * Clear saved onboarding progress
   * Useful for testing or if user wants to restart
   * @param studentId - The student ID
   */
  clearProgress: (studentId: string): void => {
    if (typeof window === "undefined") {
      return;
    }

    const steps = ["welcome", "color", "tutorial", "goals"];
    steps.forEach((step) => {
      const key = `onboarding_${studentId}_${step}`;
      localStorage.removeItem(key);
    });
  },
};
