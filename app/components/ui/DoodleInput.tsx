"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";

export interface DoodleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const DoodleInput = forwardRef<HTMLInputElement, DoodleInputProps>(
  ({ label, error, success, className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="relative w-full">
        {label && (
          <label className="block mb-2 text-sm font-sketch text-doodle-sketch font-medium">
            {label}
          </label>
        )}
        <div className="relative doodle-input-wrapper">
          <input
            ref={ref}
            className={`doodle-input ${
              error ? "border-red-500" : success ? "border-green-500" : ""
            } ${className}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {isFocused && (
            <motion.span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              ✏️
            </motion.span>
          )}
        </div>
        {error && (
          <motion.p
            className="mt-1 text-xs text-red-500 font-sketch"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
        {success && !error && (
          <motion.span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            ✓
          </motion.span>
        )}
      </div>
    );
  }
);

DoodleInput.displayName = "DoodleInput";

export default DoodleInput;
