"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { NudgeMessage } from "@/types";

interface NudgePopupProps {
  nudge: NudgeMessage;
  onAccept: () => void;
  onDismiss: () => void;
}

export default function NudgePopup({
  nudge,
  onAccept,
  onDismiss,
}: NudgePopupProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store previous focus for restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, []);

  // Focus management - focus popup on mount
  useEffect(() => {
    if (acceptButtonRef.current) {
      acceptButtonRef.current.focus();
    }

    return () => {
      // Restore focus on unmount
      if (previousFocusRef.current && typeof window !== "undefined") {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Handle Escape key with proper cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isClosing && !isLoading) {
        e.preventDefault();
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isClosing, isLoading]);

  // Multi-tab sync - dismiss if dismissed in another tab
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `nudge_dismissed_${nudge.id}` && e.newValue === "true") {
        handleDismiss();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [nudge.id]);

  const handleAccept = useCallback(async () => {
    if (isLoading || isClosing) return; // Prevent race conditions

    setIsLoading(true);
    setIsClosing(true);

    try {
      // Sync across tabs
      if (typeof window !== "undefined") {
        localStorage.setItem(`nudge_dismissed_${nudge.id}`, "true");
      }

      setTimeout(async () => {
        await onAccept();
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error accepting nudge:", error);
      setIsLoading(false);
      setIsClosing(false);
      // Show error to user (could add toast here)
    }
  }, [nudge.id, onAccept, isLoading, isClosing]);

  const handleDismiss = useCallback(async () => {
    if (isLoading || isClosing) return; // Prevent race conditions

    setIsLoading(true);
    setIsClosing(true);

    try {
      // Sync across tabs
      if (typeof window !== "undefined") {
        localStorage.setItem(`nudge_dismissed_${nudge.id}`, "true");
      }

      setTimeout(async () => {
        await onDismiss();
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error dismissing nudge:", error);
      setIsLoading(false);
      setIsClosing(false);
    }
  }, [nudge.id, onDismiss, isLoading, isClosing]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleDismiss();
    }
  };

  // Focus trap - keep focus within popup
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" && popupRef.current) {
      const focusableElements = popupRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  // Validate nudge data (edge case: corrupted data)
  if (!nudge || !nudge.encouragement) {
    console.error("Invalid nudge data received:", nudge);
    return null;
  }

  return (
    <AnimatePresence>
      {!isClosing && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />

          {/* Popup */}
          <motion.div
            ref={popupRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nudge-title"
            aria-describedby="nudge-description"
            onKeyDown={handleKeyDown}
            className="fixed top-1/2 left-1/2 z-[9999]
                       w-[400px] max-w-[90vw] p-8
                       bg-white rounded-3xl
                       border-4 border-[#2D3748]
                       shadow-[8px_8px_0px_rgba(0,0,0,0.1),16px_16px_0px_rgba(0,0,0,0.05)]"
            style={{ x: "-50%", y: "-50%" }}
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{
              scale: 1,
              rotate: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
              },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
          >
            {/* AI Character - Floating Animation */}
            <motion.div
              className="flex justify-center mb-6"
              animate={{
                y: [0, -8, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6FB1FC] to-[#4A90E2] 
                            flex items-center justify-center text-4xl
                            border-4 border-[#2D3748]
                            shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
              >
                😊
              </div>
            </motion.div>

            {/* Messages */}
            <div className="space-y-4 mb-6 text-center">
              {/* Celebration */}
              {nudge.celebration && (
                <p
                  id="nudge-title"
                  className="font-['Architects_Daughter'] text-lg font-bold text-[#F97316]"
                >
                  {nudge.celebration}
                </p>
              )}

              {/* Encouragement */}
              <p
                id="nudge-description"
                className="font-['Architects_Daughter'] text-md text-[#2D3748] leading-relaxed"
              >
                {nudge.encouragement}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <motion.button
                ref={acceptButtonRef}
                className="w-full px-6 py-3 rounded-xl
                         bg-[#6FB1FC] text-white font-['Architects_Daughter'] font-bold text-lg
                         border-3 border-[#2D3748]
                         shadow-[4px_4px_0px_rgba(0,0,0,0.15)]
                         hover:shadow-[2px_2px_0px_rgba(0,0,0,0.15)]
                         hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-4 focus:ring-[#6FB1FC]/50"
                onClick={handleAccept}
                disabled={isLoading}
                aria-busy={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? "Loading..." : nudge.cta}
              </motion.button>

              <button
                className="w-full px-6 py-2 rounded-xl
                         bg-transparent text-[#2D3748] font-['Architects_Daughter'] text-md
                         border-2 border-[#2D3748]
                         hover:bg-[#F7FAFC]
                         transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-4 focus:ring-[#2D3748]/20"
                onClick={handleDismiss}
                disabled={isLoading}
              >
                Maybe later
              </button>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 w-8 h-8
                       rounded-full bg-white border-2 border-[#2D3748]
                       flex items-center justify-center
                       text-[#2D3748] text-lg font-bold
                       hover:bg-[#F7FAFC] hover:rotate-90
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-4 focus:ring-[#2D3748]/20"
              onClick={handleDismiss}
              disabled={isLoading}
              aria-label="Close notification"
              title="Close (Esc)"
            >
              ✕
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
