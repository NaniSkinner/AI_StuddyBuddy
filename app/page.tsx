"use client";

import { useEffect } from "react";

/**
 * Root Page
 * Immediately redirects to login page
 */
export default function Home() {
  useEffect(() => {
    // Simple direct redirect to login
    // Let the ProtectedRoute handle auth checking
    window.location.href = "/login";
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-doodle-cream">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-doodle-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-sketch text-doodle-sketch text-lg">Loading...</p>
      </div>
    </main>
  );
}
