"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  label: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  children,
  label,
  position = "bottom",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === "bottom" ? -5 : 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 pointer-events-none ${positionClasses[position]}`}
          >
            <div className="px-3 py-1.5 bg-doodle-sketch text-white rounded-lg border-2 border-doodle-sketch shadow-lg whitespace-nowrap">
              <span className="font-sketch text-sm font-medium">{label}</span>
            </div>
            <div
              className={`absolute w-2 h-2 bg-doodle-sketch border-doodle-sketch rotate-45 ${
                position === "bottom"
                  ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-t-2 border-l-2"
                  : position === "top"
                  ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b-2 border-r-2"
                  : position === "right"
                  ? "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-t-2 border-l-2"
                  : "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-b-2 border-r-2"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
