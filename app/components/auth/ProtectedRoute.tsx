"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/lib/services/authService";
import { useAppStore } from "@/lib/store/appStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Wrapper component that protects routes from unauthenticated access
 * Validates session and redirects to login if not authenticated
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const hasValidated = useRef(false);
  const setCurrentStudent = useAppStore((state) => state.setCurrentStudent);

  useEffect(() => {
    // Prevent multiple validation calls
    if (hasValidated.current) return;
    hasValidated.current = true;

    validateAuth();
  }, []);

  /**
   * Validate authentication status
   * Redirects to login if not authenticated
   * Also populates the Zustand store with student data
   */
  const validateAuth = async () => {
    try {
      console.log("🟣 ProtectedRoute: Starting validation...");
      const studentId = authService.getCurrentStudentId();
      console.log(
        "🟣 ProtectedRoute: Student ID from localStorage:",
        studentId
      );

      // Get the student data
      const student = await authService.getCurrentStudent();
      console.log(
        "🟣 ProtectedRoute: Student from API:",
        student?.name || "null"
      );

      if (!student) {
        console.log("🟣 ProtectedRoute: Invalid session, redirecting to login");
        window.location.href = "/login";
      } else {
        console.log("🟣 ProtectedRoute: Valid session, populating store...");
        // Populate Zustand store with student data
        setCurrentStudent(student);
        console.log(
          "🟣 ProtectedRoute: Store populated, rendering protected content"
        );
        setIsValidating(false);
      }
    } catch (error) {
      console.error("🟣 ProtectedRoute: Session validation error:", error);
      window.location.href = "/login";
    }
  };

  /**
   * Show loading screen while validating
   */
  if (isValidating) {
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
            Checking authentication...
          </p>
        </motion.div>
      </div>
    );
  }

  /**
   * Render children when authenticated
   */
  return <>{children}</>;
}
