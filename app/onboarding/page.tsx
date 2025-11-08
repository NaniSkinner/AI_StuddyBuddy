"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/lib/services/authService";
import {
  onboardingService,
  OnboardingData,
} from "@/lib/services/onboardingService";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import WelcomeStep from "@/app/components/onboarding/WelcomeStep";
import ColorPickerStep from "@/app/components/onboarding/ColorPicker";
import Tutorial from "@/app/components/onboarding/Tutorial";
import GoalSetupStep from "@/app/components/onboarding/GoalSetupStep";

const STEPS = ["welcome", "color", "tutorial", "goals"] as const;
type Step = (typeof STEPS)[number];

/**
 * Onboarding Page
 * Multi-step first-time user experience
 * Steps: Welcome → Color Picker → Tutorial → Goal Setup
 */
export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingPageContent />
    </ProtectedRoute>
  );
}

function OnboardingPageContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const hasChecked = useRef(false);

  // Calculate progress
  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  /**
   * Check if onboarding already complete on mount
   */
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const student = await authService.getCurrentStudent();
    if (student?.preferences.hasCompletedOnboarding) {
      // Already completed, redirect to learn
      window.location.href = "/learn";
    }
  };

  /**
   * Handle moving to next step
   */
  const handleNext = async (data?: any) => {
    // Save step data
    const updatedData = { ...onboardingData, ...data };
    setOnboardingData(updatedData);

    // Save progress for resume capability
    const studentId = authService.getCurrentStudentId();
    if (studentId && data) {
      await onboardingService.saveStep(studentId, currentStep, data);
    }

    // Move to next step or complete
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    } else {
      // Onboarding complete
      await completeOnboarding(updatedData);
    }
  };

  /**
   * Handle going back to previous step
   */
  const handleBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1]);
    }
  };

  /**
   * Handle skipping remaining steps
   */
  const handleSkip = async () => {
    const updatedData = {
      ...onboardingData,
      skippedSteps: [currentStep],
    };
    setOnboardingData(updatedData);
    await completeOnboarding(updatedData);
  };

  /**
   * Complete onboarding and redirect
   */
  const completeOnboarding = async (data: Partial<OnboardingData>) => {
    try {
      setLoading(true);
      const studentId = authService.getCurrentStudentId();

      if (!studentId) {
        console.error("No student ID found");
        router.replace("/login");
        return;
      }

      // Save onboarding completion
      await onboardingService.complete(studentId, data);

      // Clear saved progress
      onboardingService.clearProgress(studentId);

      // Trigger nudge after onboarding completion
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trigger_nudge_on_load", "onboarding_complete");
      }

      // Small delay to ensure save completes
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to learn page
      window.location.href = "/learn";
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Still redirect on error to not block user
      window.location.href = "/learn";
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loading overlay
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-doodle-cream">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-doodle-purple border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="font-sketch text-doodle-sketch text-lg">
            Completing onboarding...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <motion.div
          className="progress-fill"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step Content */}
      <div className="onboarding-content">
        {currentStep === "welcome" && (
          <WelcomeStep onNext={handleNext} onSkip={handleSkip} />
        )}
        {currentStep === "color" && (
          <ColorPickerStep onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === "tutorial" && (
          <Tutorial onNext={handleNext} onSkip={handleSkip} />
        )}
        {currentStep === "goals" && (
          <GoalSetupStep onNext={handleNext} onSkip={handleSkip} />
        )}
      </div>

      {/* Step Indicators */}
      <div className="step-indicators">
        {STEPS.map((step, index) => (
          <div
            key={step}
            className={`step-dot ${index <= stepIndex ? "active" : ""}`}
            aria-label={`Step ${index + 1}: ${step}`}
            aria-current={index === stepIndex ? "step" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
