"use client";

import React from "react";
import { motion } from "framer-motion";
import { buttonVariant } from "@/lib/animations";

export interface SketchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  isLoading?: boolean;
}

const sizeClasses = {
  small: "px-4 py-2 text-sm",
  medium: "px-6 py-3 text-md",
  large: "px-8 py-4 text-lg",
};

export const SketchButton: React.FC<SketchButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  isLoading = false,
  disabled,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const variantClass =
    variant === "primary"
      ? ""
      : variant === "success"
      ? "sketch-button--success"
      : variant === "danger"
      ? "sketch-button--danger"
      : "sketch-button--ghost";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`sketch-button ${variantClass} ${sizeClasses[size]} ${className}`}
      variants={buttonVariant}
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "tap" : undefined}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <motion.span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default SketchButton;
