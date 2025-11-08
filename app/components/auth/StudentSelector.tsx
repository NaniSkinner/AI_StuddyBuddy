"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Student } from "@/types";
import StudentCard from "./StudentCard";
import { authService } from "@/lib/services/authService";

/**
 * StudentSelector Component
 * Displays all available students as selectable cards
 * Handles authentication on selection
 */
export default function StudentSelector() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  /**
   * Load all students from API on mount
   */
  useEffect(() => {
    loadStudents();
  }, []);

  /**
   * Fetch students from API
   */
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/students");

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const allStudents: Student[] = await response.json();
      setStudents(allStudents);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle student selection
   * Authenticates and redirects based on onboarding status
   */
  const handleSelectStudent = async (studentId: string) => {
    console.log("🔵 STEP 1: handleSelectStudent called with ID:", studentId);
    try {
      setLoggingIn(true);

      // First, ensure we clear any existing session
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentStudentId");
        console.log("🔵 STEP 2: Cleared existing session");
      }

      // Small delay to ensure cleanup
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Now login
      console.log("🔵 STEP 3: Calling authService.login...");
      const student = await authService.login(studentId);
      console.log("🔵 STEP 4: Login successful! Student:", student.name);

      // Verify localStorage was set
      const storedId = localStorage.getItem("currentStudentId");
      console.log("🔵 STEP 5: Stored student ID:", storedId);

      if (!storedId) {
        console.error("🔴 ERROR: localStorage was not set!");
        throw new Error("Failed to store session");
      }

      // Longer delay to ensure localStorage is flushed to disk
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Check if onboarding is needed
      console.log("🔵 STEP 6: Checking onboarding status...");
      console.log("🔵 student.preferences:", student.preferences);
      console.log(
        "🔵 hasCompletedOnboarding:",
        student.preferences.hasCompletedOnboarding
      );
      console.log(
        "🔵 Type:",
        typeof student.preferences.hasCompletedOnboarding
      );

      // Store event for nudge trigger after redirect
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trigger_nudge_on_load", "login");
      }

      if (!student.preferences.hasCompletedOnboarding) {
        console.log(
          "🔵 STEP 7: ✅ ONBOARDING NEEDED - Redirecting to /onboarding"
        );
        console.log("🔵 Current URL:", window.location.href);
        window.location.href = "/onboarding";
      } else {
        console.log(
          "🔵 STEP 7: ⏭️  ONBOARDING COMPLETE - Redirecting to /learn"
        );
        console.log("🔵 Current URL:", window.location.href);
        window.location.href = "/learn";
      }
    } catch (err) {
      console.error("🔴 Login failed:", err);
      setError("Login failed. Please try again.");
      setLoggingIn(false);
    }
  };

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          className="w-16 h-16 border-4 border-doodle-purple border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="font-sketch text-doodle-sketch">Loading students...</p>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 max-w-md">
        <p className="font-sketch text-red-600 text-center">{error}</p>
        <button
          onClick={loadStudents}
          className="sketch-button sketch-button--primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  /**
   * Main render with student grid
   */
  return (
    <>
      <motion.div
        className="student-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {students.map((student, index) => (
          <StudentCard
            key={student.id}
            student={student}
            onClick={() => handleSelectStudent(student.id)}
            delay={index}
          />
        ))}
      </motion.div>

      {/* Loading overlay during login */}
      {loggingIn && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-2xl p-8 doodle-border shadow-doodle-lg">
            <motion.div
              className="w-16 h-16 border-4 border-doodle-purple border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="font-sketch text-doodle-sketch text-center">
              Logging in...
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
