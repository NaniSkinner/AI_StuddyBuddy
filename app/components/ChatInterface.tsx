"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";
import AnimatedBubble from "./AnimatedBubble";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isAITyping?: boolean;
  aiColor?: string;
  studentName?: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isAITyping = false,
  aiColor = "#3B82F6",
  studentName = "Student",
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [showCharacter, setShowCharacter] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAITyping]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: "❓", label: "Ask a question", prompt: "I have a question about" },
    { icon: "📝", label: "Get practice", prompt: "Can I practice" },
    { icon: "🔄", label: "Review topic", prompt: "Can we review" },
  ];

  // Determine AI character state based on activity
  const getCharacterState = () => {
    if (isAITyping) return "thinking";
    if (
      messages.length > 0 &&
      messages[messages.length - 1]?.speaker === "ai"
    ) {
      return "speaking";
    }
    return "idle";
  };

  return (
    <div className="flex flex-col h-full bg-doodle-cream relative">
      {/* Floating AI Character - Toggleable */}
      <AnimatePresence>
        {showCharacter && (
          <motion.div
            initial={{ scale: 0, x: 100, y: 100 }}
            animate={{ scale: 1, x: 0, y: 0 }}
            exit={{ scale: 0, x: 100, y: 100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute bottom-24 right-6 z-50 cursor-pointer group"
            onClick={() => setShowCharacter(false)}
          >
            <AnimatedBubble
              state={getCharacterState()}
              color={aiColor}
              size={80}
            />
            {/* Tooltip on hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute -top-12 right-0 bg-white px-3 py-1 rounded-lg border-2 border-doodle-sketch text-xs font-sketch whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ transform: "rotate(-1deg)" }}
            >
              Click to hide 👻
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Character Button (when hidden) */}
      <AnimatePresence>
        {!showCharacter && (
          <motion.button
            initial={{ scale: 0, x: 100 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => setShowCharacter(true)}
            className="absolute bottom-24 right-6 z-50 w-16 h-16 rounded-full bg-white border-3 border-doodle-sketch flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            style={{
              borderWidth: "3px",
              boxShadow: "4px 4px 0px var(--doodle-sketch)",
            }}
            whileHover={{ rotate: 360 }}
            whileTap={{ scale: 0.9 }}
          >
            🤖
          </motion.button>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 font-sketch">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center"
          >
            {/* AI Character */}
            <motion.div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-4 border-3"
              style={{
                backgroundColor: aiColor,
                borderWidth: "3px",
                borderColor: "var(--doodle-sketch)",
              }}
              animate={{
                scale: [1, 1.05, 1],
                rotate: [-1, 1, -1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-5xl">😊</span>
            </motion.div>
            <h2 className="text-4xl font-hand font-bold text-doodle-sketch mb-2">
              Hi, {studentName}! 👋
            </h2>
            <p className="text-doodle-sketch opacity-80 mb-6 max-w-md text-lg font-sketch">
              I'm your AI study companion! I remember everything we've learned
              together and I'm here to help you practice and grow.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  onClick={() => setInputMessage(action.prompt + " ")}
                  className="px-4 py-3 bg-white border-2 border-doodle-sketch rounded-lg transition-all font-sketch"
                  style={{
                    transform: "rotate(-1deg)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 1,
                    boxShadow: "4px 4px 0px var(--doodle-sketch)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{action.icon}</div>
                  <div className="text-xs text-doodle-sketch">
                    {action.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={`${message.timestamp}-${index}`}
                message={message}
                aiColor={aiColor}
              />
            ))}

            {/* AI Typing Indicator - Doodle Style */}
            <AnimatePresence>
              {isAITyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center space-x-3 mb-4"
                >
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                    style={{
                      backgroundColor: `${aiColor}30`,
                      borderColor: "var(--doodle-sketch)",
                    }}
                  >
                    <span className="text-xl">🤖</span>
                  </motion.div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-tl-sm flex space-x-1 border-2 font-comic"
                    style={{
                      backgroundColor: aiColor,
                      borderColor: "var(--doodle-sketch)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full border"
                        style={{ borderColor: "var(--doodle-sketch)" }}
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
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Doodle Style */}
      <div className="border-t-2 border-doodle-sketch bg-white px-6 py-4">
        {/* Quick Action Buttons (show when messages exist) */}
        {messages.length > 0 && (
          <div className="flex space-x-2 mb-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                onClick={() => setInputMessage(action.prompt + " ")}
                className="text-xs px-3 py-1.5 bg-doodle-cream border-2 border-doodle-sketch rounded-full font-sketch"
                style={{ transform: "rotate(-0.5deg)" }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0.5,
                  backgroundColor: "var(--doodle-yellow)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {action.icon} {action.label}
              </motion.button>
            ))}
          </div>
        )}

        {/* Input Field - Doodle Style */}
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="doodle-input flex-1"
            disabled={isAITyping}
          />
          <motion.button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isAITyping}
            className="sketch-button"
            style={{
              backgroundColor:
                !inputMessage.trim() || isAITyping
                  ? "var(--color-disabled)"
                  : undefined,
            }}
            whileHover={
              !inputMessage.trim() || isAITyping
                ? {}
                : {
                    scale: 1.05,
                    rotate: 1,
                  }
            }
            whileTap={
              !inputMessage.trim() || isAITyping
                ? {}
                : {
                    scale: 0.95,
                    rotate: -1,
                  }
            }
          >
            Send ✉️
          </motion.button>
        </div>
      </div>
    </div>
  );
}
