"use client";

import React, { forwardRef } from "react";

export interface DoodleTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const DoodleTextarea = forwardRef<
  HTMLTextAreaElement,
  DoodleTextareaProps
>(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="relative w-full">
      {label && (
        <label className="block mb-2 text-sm font-sketch text-doodle-sketch font-medium">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`doodle-textarea ${
          error ? "border-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-sketch">{error}</p>
      )}
    </div>
  );
});

DoodleTextarea.displayName = "DoodleTextarea";

export default DoodleTextarea;
