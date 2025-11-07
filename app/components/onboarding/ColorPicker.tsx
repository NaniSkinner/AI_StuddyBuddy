"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedBubble from "../AnimatedBubble";
import { staggerContainerVariant, staggerItemVariant } from "@/lib/animations";

interface ColorPickerProps {
  onNext: (data: { aiColor: string }) => void;
  onBack?: () => void;
}

const COLORS = [
  { name: "Ocean Blue", value: "#6FB1FC" },
  { name: "Purple Magic", value: "#A685E2" },
  { name: "Hot Pink", value: "#FFAAC9" },
  { name: "Sunset Orange", value: "#FF9671" },
  { name: "Fresh Green", value: "#7FD8BE" },
  { name: "Bright Cyan", value: "#06B6D4" },
  { name: "Sunny Yellow", value: "#FFE66D" },
  { name: "Peachy Keen", value: "#FFC09F" },
  { name: "Lavender Dream", value: "#CFBAF0" },
  { name: "Mint Fresh", value: "#B4F8C8" },
];

export default function ColorPicker({ onNext, onBack }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[1].value); // Default to purple

  const handleContinue = () => {
    if (selectedColor) {
      onNext({ aiColor: selectedColor });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-doodle-cream p-8"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-3xl w-full doodle-card p-12"
      >
        {/* Header - Doodle Style */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-hand font-bold text-doodle-sketch mb-4"
            style={{ transform: "rotate(-1deg)" }}
          >
            Choose Your AI's Color! 🎨
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-sketch text-doodle-sketch opacity-80"
          >
            Pick a color that makes you happy - this will be your AI companion's
            signature color
          </motion.p>
        </div>

        {/* Preview - Doodle Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="flex flex-col items-center">
            <AnimatedBubble state="idle" color={selectedColor} size={150} />
            <motion.p
              className="mt-6 text-2xl font-hand font-bold text-doodle-sketch px-6 py-2 bg-white border-2 border-doodle-sketch rounded-full"
              style={{ transform: "rotate(-1deg)" }}
              key={selectedColor}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {COLORS.find((c) => c.value === selectedColor)?.name}
            </motion.p>
          </div>
        </motion.div>

        {/* Color Grid - Doodle Style */}
        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-5 gap-4 mb-10"
        >
          {COLORS.map((color, index) => (
            <motion.button
              key={color.value}
              variants={staggerItemVariant}
              onClick={() => setSelectedColor(color.value)}
              className={`relative aspect-square rounded-2xl transition-all border-3 ${
                selectedColor === color.value ? "scale-110" : "hover:scale-105"
              }`}
              style={{
                backgroundColor: color.value,
                borderWidth: "3px",
                borderColor: "var(--doodle-sketch)",
                transform:
                  selectedColor === color.value
                    ? `rotate(${index % 2 === 0 ? 5 : -5}deg)`
                    : `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                boxShadow:
                  selectedColor === color.value
                    ? "6px 6px 0px var(--doodle-sketch)"
                    : "2px 2px 0px var(--doodle-sketch)",
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              {selectedColor === color.value && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-4xl">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Buttons - Doodle Style */}
        <div className="flex space-x-4">
          {onBack && (
            <motion.button
              onClick={onBack}
              className="sketch-button--ghost px-6 py-3 font-sketch"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02, rotate: 1 }}
            whileTap={{ scale: 0.98, rotate: -1 }}
            onClick={handleContinue}
            className="flex-1 px-8 py-4 font-sketch text-lg font-bold border-2 border-doodle-sketch rounded-xl shadow-doodle"
            style={{
              backgroundColor: selectedColor,
              color: "white",
            }}
          >
            Continue → ✨
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
