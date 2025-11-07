"use client";

import { motion } from "framer-motion";
import StudentSelector from "@/app/components/auth/StudentSelector";

/**
 * Login Page
 * Student selection interface for authentication
 */
export default function LoginPage() {
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
        Welcome! Let's get learning! 🚀
      </motion.p>

      {/* Student Selection */}
      <motion.div
        className="w-full max-w-2xl flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="font-hand text-2xl text-doodle-sketch text-center mb-6">
          Choose your profile:
        </p>

        <StudentSelector />
      </motion.div>
    </div>
  );
}
