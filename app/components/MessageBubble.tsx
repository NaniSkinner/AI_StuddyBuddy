"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";
import { formatDate } from "@/lib/utils/dateUtils";
import { messageBubbleVariant } from "@/lib/animations";

interface MessageBubbleProps {
  message: Message;
  aiColor?: string;
}

export default function MessageBubble({
  message,
  aiColor = "#A685E2",
}: MessageBubbleProps) {
  const isAI = message.speaker === "ai" || message.speaker === "tutor";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={messageBubbleVariant}
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`max-w-[70%] ${isAI ? "order-2" : "order-1"} flex flex-col`}
      >
        {/* Message Bubble - Doodle Style */}
        <div
          className={isAI ? "chat-bubble-ai" : "chat-bubble-student"}
          style={
            isAI
              ? {
                  backgroundColor: aiColor,
                }
              : undefined
          }
        >
          <p className="whitespace-pre-wrap">{message.message}</p>
        </div>

        {/* Timestamp - Hand-drawn style */}
        <span
          className={`text-xs font-indie opacity-60 mt-1 ${
            isAI ? "text-left" : "text-right"
          }`}
          style={{ color: "var(--doodle-sketch)" }}
        >
          {formatDate(message.timestamp, "h:mm a")}
        </span>
      </div>

      {/* Avatar (only for AI) - Simplified doodle style */}
      {isAI && (
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center mr-3 order-1 flex-shrink-0 border-2"
          style={{
            backgroundColor: `${aiColor}30`,
            borderColor: "var(--doodle-sketch)",
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="text-xl">🤖</span>
        </motion.div>
      )}
    </motion.div>
  );
}
