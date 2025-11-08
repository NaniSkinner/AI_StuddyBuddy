"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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

  const handleAccept = () => {
    setIsClosing(true);
    setTimeout(() => onAccept(), 300);
  };

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => onDismiss(), 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  // Handle Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleDismiss();
    }
  };

  // Add event listener for Escape key
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
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
                <p className="font-['Architects_Daughter'] text-lg font-bold text-[#F97316]">
                  {nudge.celebration}
                </p>
              )}

              {/* Encouragement */}
              <p className="font-['Architects_Daughter'] text-md text-[#2D3748] leading-relaxed">
                {nudge.encouragement}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <motion.button
                className="w-full px-6 py-3 rounded-xl
                         bg-[#6FB1FC] text-white font-['Architects_Daughter'] font-bold text-lg
                         border-3 border-[#2D3748]
                         shadow-[4px_4px_0px_rgba(0,0,0,0.15)]
                         hover:shadow-[2px_2px_0px_rgba(0,0,0,0.15)]
                         hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
                onClick={handleAccept}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {nudge.cta}
              </motion.button>

              <button
                className="w-full px-6 py-2 rounded-xl
                         bg-transparent text-[#2D3748] font-['Architects_Daughter'] text-md
                         border-2 border-[#2D3748]
                         hover:bg-[#F7FAFC]
                         transition-colors duration-150"
                onClick={handleDismiss}
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
                       transition-all duration-200"
              onClick={handleDismiss}
              aria-label="Close"
            >
              ✕
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
