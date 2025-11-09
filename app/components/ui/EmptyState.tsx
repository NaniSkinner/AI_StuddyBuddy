"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { floatVariant } from "@/lib/animations";
import { SketchButton } from "./SketchButton";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        variants={floatVariant}
        initial="initial"
        animate="animate"
        className="mb-6"
      >
        {illustration ? (
          illustration
        ) : (
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            {icon}
          </motion.div>
        )}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-hand font-bold text-doodle-sketch mb-3"
        style={{ transform: "rotate(-1deg)" }}
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-sketch text-doodle-sketch opacity-80 max-w-md mb-8"
      >
        {description}
      </motion.p>

      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SketchButton onClick={onAction} variant="primary" size="large">
            {actionLabel}
          </SketchButton>
        </motion.div>
      )}

      <motion.div
        className="absolute top-1/4 left-1/4 text-4xl opacity-20"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 text-4xl opacity-20"
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        ⭐
      </motion.div>
    </motion.div>
  );
}

export function NoTasksEmptyState({ onGetTasks }: { onGetTasks?: () => void }) {
  return (
    <EmptyState
      icon="📚"
      title="No tasks yet!"
      description="You're all caught up! Check back later for new practice problems, or ask me to create some custom ones for you."
      actionLabel={onGetTasks ? "Get Practice Tasks" : undefined}
      onAction={onGetTasks}
    />
  );
}

export function NoMessagesEmptyState({
  onStartChat,
}: {
  onStartChat?: () => void;
}) {
  return (
    <EmptyState
      icon="💬"
      title="Let's start learning!"
      description="Click the AI bubble or type a message below to begin your learning session. I'm here to help you with any questions!"
      actionLabel={onStartChat ? "Start Chatting" : undefined}
      onAction={onStartChat}
    />
  );
}

export function NoAchievementsEmptyState() {
  return (
    <EmptyState
      icon="🏆"
      title="Start your journey!"
      description="Complete tasks, maintain your streak, and explore topics to unlock awesome achievement badges!"
    />
  );
}

export function NoProgressEmptyState({
  onSetGoals,
}: {
  onSetGoals?: () => void;
}) {
  return (
    <EmptyState
      icon="🎯"
      title="Set your goals!"
      description="Let's set up your learning goals so I can track your progress and help you achieve them."
      actionLabel={onSetGoals ? "Set Learning Goals" : undefined}
      onAction={onSetGoals}
    />
  );
}
