/**
 * Authentication Service
 * Client-side authentication against mock student data
 * Session management via localStorage
 */

import { Student } from "@/types";

const STORAGE_KEY = "currentStudentId";

export const authService = {
  /**
   * Authenticate a student by ID
   * @param studentId - The student ID to authenticate
   * @returns Promise<Student> - The authenticated student
   * @throws Error if student not found
   */
  login: async (studentId: string): Promise<Student> => {
    try {
      // Fetch student data from API
      const response = await fetch(`/api/students/${studentId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Student not found");
        }
        throw new Error("Failed to authenticate");
      }

      const student: Student = await response.json();

      // Store session in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, studentId);
      }

      // Update last login timestamp
      await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastLoginAt: new Date().toISOString(),
        }),
      });

      return student;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Logout current student
   * Clears session and redirects to login
   */
  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "/login";
    }
  },

  /**
   * Get current authenticated student
   * @returns Promise<Student | null> - The current student or null if not authenticated
   */
  getCurrentStudent: async (): Promise<Student | null> => {
    try {
      if (typeof window === "undefined") {
        console.log("authService: Running on server, returning null");
        return null;
      }

      const studentId = localStorage.getItem(STORAGE_KEY);
      console.log(
        "authService.getCurrentStudent: studentId from localStorage:",
        studentId
      );

      if (!studentId) {
        console.log("authService: No student ID found in localStorage");
        return null;
      }

      console.log(
        `authService: Fetching student data from /api/students/${studentId}`
      );
      const response = await fetch(`/api/students/${studentId}`);
      console.log("authService: API response status:", response.status);

      if (!response.ok) {
        console.log("authService: API request failed, clearing session");
        // Session is invalid, clear it
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      const student: Student = await response.json();
      console.log("authService: Successfully fetched student:", student.name);
      return student;
    } catch (error) {
      console.error("authService: Get current student error:", error);
      // Clear corrupted session
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      return null;
    }
  },

  /**
   * Check if user is authenticated (client-side only check)
   * @returns boolean - True if student ID exists in localStorage
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") {
      return false;
    }
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  /**
   * Validate current session
   * Checks if the stored student ID is still valid
   * @returns Promise<boolean> - True if session is valid
   */
  validateSession: async (): Promise<boolean> => {
    try {
      const student = await authService.getCurrentStudent();
      return student !== null;
    } catch (error) {
      console.error("Session validation error:", error);
      return false;
    }
  },

  /**
   * Get the current student ID from localStorage
   * @returns string | null - The student ID or null
   */
  getCurrentStudentId: (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(STORAGE_KEY);
  },
};
