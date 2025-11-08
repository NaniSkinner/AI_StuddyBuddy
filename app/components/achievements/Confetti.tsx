"use client";

import { motion } from "framer-motion";

interface ConfettiProps {
  count?: number;
  colors?: string[];
}

export default function Confetti({ count = 20, colors }: ConfettiProps) {
  const defaultColors = [
    "bg-doodle-yellow",
    "bg-doodle-pink",
    "bg-doodle-orange",
    "bg-doodle-green",
    "bg-doodle-purple",
    "bg-doodle-blue",
  ];

  const confettiColors = colors || defaultColors;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i * 360) / count;
        const distance = 80 + Math.random() * 40; // 80-120px
        const randomColor =
          confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const size = 8 + Math.random() * 8; // 8-16px
        const rotation = Math.random() * 360;
        const duration = 1.2 + Math.random() * 0.6; // 1.2-1.8s

        return (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 ${randomColor} rounded-sm`}
            style={{
              left: "50%",
              top: "50%",
              width: `${size}px`,
              height: `${size}px`,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * distance,
              y: Math.sin((angle * Math.PI) / 180) * distance,
              scale: [0, 1.2, 1, 0],
              opacity: [0, 1, 1, 0],
              rotate: rotation,
            }}
            transition={{
              duration: duration,
              delay: i * 0.02,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
