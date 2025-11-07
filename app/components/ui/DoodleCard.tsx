"use client";

import React from "react";
import { motion } from "framer-motion";
import { bounceInVariant } from "@/lib/animations";

export interface DoodleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  decoration?: "star" | "heart" | "sparkle" | "none";
  highlight?: boolean;
  flat?: boolean;
  animate?: boolean;
}

const decorationEmoji = {
  star: "⭐",
  heart: "❤️",
  sparkle: "✨",
  none: "",
};

export const DoodleCard: React.FC<DoodleCardProps> = ({
  children,
  decoration = "none",
  highlight = false,
  flat = false,
  animate: shouldAnimate = false,
  className = "",
  onClick,
  style,
  ...props
}) => {
  const cardClass = `doodle-card ${flat ? "!rotate-0 !shadow-doodle" : ""} ${
    highlight ? "border-doodle-purple border-4" : ""
  } ${className}`;

  if (shouldAnimate) {
    return (
      <motion.div
        className={cardClass}
        initial="hidden"
        animate="visible"
        variants={bounceInVariant}
        onClick={onClick}
        style={style}
      >
        {children}
        {decoration !== "none" && (
          <span className="absolute -top-2 -right-2 text-2xl animate-float">
            {decorationEmoji[decoration]}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <div className={cardClass} onClick={onClick} style={style} {...props}>
      {children}
      {decoration !== "none" && (
        <span className="absolute -top-2 -right-2 text-2xl animate-float">
          {decorationEmoji[decoration]}
        </span>
      )}
    </div>
  );
};

export default DoodleCard;
