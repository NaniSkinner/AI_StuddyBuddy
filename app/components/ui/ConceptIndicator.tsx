"use client";

import React from "react";
import { motion } from "framer-motion";
import { bounceInVariant } from "@/lib/animations";

export interface ConceptIndicatorProps {
  name: string;
  status: "mastered" | "struggling" | "in-progress" | "not-started";
  animate?: boolean;
}

export const ConceptIndicator: React.FC<ConceptIndicatorProps> = ({
  name,
  status,
  animate: shouldAnimate = false,
}) => {
  const statusClass =
    status === "mastered"
      ? "mastered"
      : status === "struggling"
      ? "struggling"
      : status === "in-progress"
      ? "in-progress"
      : "";

  const Component = shouldAnimate ? motion.span : "span";

  return (
    <Component
      className={`concept-indicator ${statusClass}`}
      {...(shouldAnimate
        ? {
            initial: "hidden",
            animate: "visible",
            variants: bounceInVariant,
          }
        : {})}
    >
      {name}
    </Component>
  );
};

export default ConceptIndicator;
