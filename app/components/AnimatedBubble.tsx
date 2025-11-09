"use client";

import { motion } from "framer-motion";
import {
  breathingVariant,
  wiggleVariant,
  celebrationVariant,
} from "@/lib/animations";

type BubbleState =
  | "idle"
  | "thinking"
  | "speaking"
  | "celebrating"
  | "encouraging"
  | "clicked";

interface AnimatedBubbleProps {
  state?: BubbleState;
  color?: string;
  size?: number;
  onClick?: () => void;
  studentAge?: number; // For age-appropriate animations
}

export default function AnimatedBubble({
  state = "idle",
  color = "#A685E2",
  size = 150,
  onClick,
  studentAge = 12,
}: AnimatedBubbleProps) {
  const getAnimation = () => {
    switch (state) {
      case "idle":
        return {
          scale: [1, 1.05, 1],
          rotate: [-1, 1, -1],
        };
      case "thinking":
        return {
          scale: [1, 1.02, 1],
          filter: [
            "saturate(1) brightness(1)",
            "saturate(0.8) brightness(0.9)",
            "saturate(1) brightness(1)",
          ],
        };
      case "speaking":
        return {
          scale: [1, 1.03, 1],
          rotate: [0, 2, 0, -2, 0],
        };
      case "celebrating":
        return celebrationVariant.animate as any;
      case "encouraging":
        return {
          scale: [1, 1.1, 1],
        };
      case "clicked":
        return wiggleVariant.animate as any;
      default:
        return {};
    }
  };

  const getTransition = () => {
    switch (state) {
      case "idle":
        return {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        };
      case "thinking":
        return {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        };
      case "speaking":
        return {
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        };
      case "encouraging":
        return {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        };
      case "clicked":
        return {
          duration: 0.5,
          ease: "easeInOut",
        };
      default:
        return {};
    }
  };

  const getFacialExpression = () => {
    switch (state) {
      case "idle":
        return "🤓";
      case "thinking":
        return "🤔";
      case "speaking":
        return "🤓";
      case "celebrating":
        return "🎉";
      case "encouraging":
        return "💖";
      case "clicked":
        return "😆";
      default:
        return "🤓";
    }
  };

  const animationIntensity =
    studentAge <= 11 ? 1.3 : studentAge <= 14 ? 1.0 : 0.7;

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      whileHover={{
        scale: 1.05 * animationIntensity,
        rotate: studentAge <= 11 ? 5 : 2,
      }}
      whileTap={{
        scale: 0.95,
        rotate: studentAge <= 11 ? -5 : -2,
      }}
    >
      <motion.div
        className="rounded-full flex items-center justify-center border-3 relative overflow-visible"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "var(--doodle-sketch)",
          boxShadow:
            "4px 4px 0px rgba(0, 0, 0, 0.1), 8px 8px 0px rgba(0, 0, 0, 0.05)",
        }}
        animate={getAnimation()}
        transition={getTransition()}
      >
        <span className="text-6xl" style={{ fontSize: size * 0.5 }}>
          {getFacialExpression()}
        </span>

        {state === "celebrating" && (
          <>
            <motion.span
              className="absolute -top-3 -right-3 text-3xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              ⭐
            </motion.span>
            <motion.span
              className="absolute -top-3 -left-3 text-3xl"
              animate={{
                rotate: [0, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            >
              ✨
            </motion.span>
          </>
        )}

        {state === "encouraging" && (
          <motion.span
            className="absolute -right-4 top-1/4 text-2xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            ❤️
          </motion.span>
        )}
      </motion.div>

      {state === "thinking" && (
        <motion.div
          className="absolute top-0 right-0 text-2xl"
          animate={{
            rotate: 360,
            x: [0, 10, 0, -10, 0],
            y: [0, -10, 0, 10, 0],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            x: { duration: 3, repeat: Infinity },
            y: { duration: 3, repeat: Infinity },
          }}
        >
          ✏️
        </motion.div>
      )}

      {state === "thinking" && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full border-2"
              style={{
                backgroundColor: color,
                borderColor: "var(--doodle-sketch)",
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}

      {state === "encouraging" && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            filter: "blur(10px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
}
