"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { authService } from "@/lib/services/authService";

// Mock credentials
const MOCK_CREDENTIALS: Record<string, { password: string; studentId: string }> = {
  eva: { password: "12345", studentId: "student-eva" },
  lucas: { password: "12345", studentId: "student-lucas" },
  mia: { password: "12345", studentId: "student-mia" },
  pat: { password: "12345", studentId: "student-pat" },
};

/**
 * Login Page
 * Username/password authentication interface
 */
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate credentials
    const usernameLower = username.toLowerCase().trim();
    const credentials = MOCK_CREDENTIALS[usernameLower];

    if (!credentials || credentials.password !== password) {
      setError("Invalid username or password");
      return;
    }

    try {
      setLoading(true);

      // Clear any existing session
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentStudentId");
      }

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Login with the student ID
      const student = await authService.login(credentials.studentId);

      // Verify localStorage was set
      const storedId = localStorage.getItem("currentStudentId");
      if (!storedId) {
        throw new Error("Failed to store session");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      // ⚠️ DISABLED: Automatic nudge trigger on login
      // Store event for nudge trigger after redirect
      // if (typeof window !== "undefined") {
      //   sessionStorage.setItem("trigger_nudge_on_load", "login");
      // }

      // Redirect based on onboarding status
      if (!student.preferences.hasCompletedOnboarding) {
        window.location.href = "/onboarding";
      } else {
        window.location.href = "/learn";
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Logo/Icon */}
      <motion.div
        className="text-6xl mb-4"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        🧠
      </motion.div>

      {/* Title */}
      <motion.h1
        className="login-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        AI Study Companion
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="login-subtitle"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Welcome! Let&apos;s get learning! 🚀
      </motion.p>

      {/* Login Form */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white rounded-2xl p-8 border-3 border-[#2D3748] shadow-[6px_6px_0px_rgba(0,0,0,0.15)]">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block font-['Architects_Daughter'] font-bold text-[#2D3748] mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g., eva)"
                className="w-full px-4 py-3 border-2 border-[#2D3748] rounded-xl font-['Architects_Daughter'] text-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block font-['Architects_Daughter'] font-bold text-[#2D3748] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-[#2D3748] rounded-xl font-['Architects_Daughter'] text-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-300 rounded-xl p-3"
              >
                <p className="font-['Architects_Daughter'] text-red-600 text-sm">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              className="w-full py-3 bg-[#10B981] border-3 border-[#2D3748] rounded-xl font-['Architects_Daughter'] font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            className="mt-6 pt-6 border-t-2 border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="font-['Architects_Daughter'] text-xs text-gray-500 text-center mb-2">
              Demo Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(MOCK_CREDENTIALS).map((user) => (
                <div
                  key={user}
                  className="bg-gray-50 rounded-lg p-2 border border-gray-200"
                >
                  <p className="font-['Architects_Daughter'] text-xs text-gray-700">
                    <span className="font-bold capitalize">{user}</span> / 12345
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
