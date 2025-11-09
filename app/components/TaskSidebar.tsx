"use client";

import { motion } from "framer-motion";
import { Task } from "@/types";
import { formatDate } from "@/lib/utils/dateUtils";
import { staggerItemVariant } from "@/lib/animations";

interface TaskSidebarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export default function TaskSidebar({ tasks, onTaskClick }: TaskSidebarProps) {
  const incompleteTasks = tasks.filter((t) => t.status === "incomplete");
  const completedTasks = tasks.filter((t) => t.status === "complete");

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "📝";
      case "open_ended":
        return "✍️";
      case "real_world":
        return "🌍";
      default:
        return "📋";
    }
  };

  const TaskCard = ({
    task,
    isComplete,
  }: {
    task: Task;
    isComplete: boolean;
  }) => {
    const getBgColor = () => {
      if (isComplete) return "bg-doodle-cream";
      if (task.attempts === 0) return "bg-doodle-yellow";
      return "bg-doodle-peach";
    };

    const getBorderColor = () => {
      if (isComplete) return "border-doodle-sketch";
      if (task.attempts === 0) return "border-doodle-orange";
      return "border-doodle-pink";
    };

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerItemVariant}
        whileHover={{
          scale: 1.03,
          rotate: isComplete ? 0 : 1,
          boxShadow: "4px 4px 0px var(--doodle-sketch)",
        }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onTaskClick?.(task)}
        className={`p-4 rounded-xl cursor-pointer border-2 font-sketch ${getBgColor()} ${getBorderColor()}`}
        style={{ transform: isComplete ? "rotate(0deg)" : "rotate(-1deg)" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <motion.span
              className="text-2xl"
              whileHover={{ scale: 1.3, rotate: 20 }}
            >
              {getTaskIcon(task.type)}
            </motion.span>
            {isComplete && (
              <motion.span
                className="text-2xl text-doodle-green"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                ✓
              </motion.span>
            )}
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full border-2 border-doodle-sketch font-sketch font-bold ${
              isComplete
                ? "bg-doodle-green text-white"
                : task.attempts > 0
                ? "bg-doodle-orange text-white"
                : "bg-doodle-blue text-white"
            }`}
            style={{ transform: "rotate(2deg)" }}
          >
            {isComplete ? "Done" : task.attempts > 0 ? "In Progress" : "New"}
          </span>
        </div>

        <h4
          className={`text-base font-hand font-bold mb-2 ${
            isComplete ? "text-doodle-sketch opacity-60" : "text-doodle-sketch"
          }`}
        >
          {task.subject} - {task.topic}
        </h4>

        <p
          className={`text-sm mb-3 line-clamp-2 ${
            isComplete
              ? "text-doodle-sketch opacity-50"
              : "text-doodle-sketch opacity-80"
          }`}
        >
          {task.content.question}
        </p>

        <div className="flex items-center justify-between text-xs">
          <span
            className={`font-indie ${isComplete ? "opacity-40" : "opacity-60"}`}
          >
            {task.type.replace("_", " ")}
          </span>
          {task.attempts > 0 && (
            <span className="font-indie opacity-60 italic">
              {task.attempts} attempts
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-doodle-cream flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {incompleteTasks.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-hand font-bold text-doodle-sketch uppercase tracking-wide">
              ✨ To Do
            </h4>
            {incompleteTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TaskCard task={task} isComplete={false} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.p
              className="text-6xl mb-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎉
            </motion.p>
            <p className="text-xl font-hand font-bold text-doodle-sketch mb-1">
              All caught up!
            </p>
            <p className="text-sm font-sketch text-doodle-sketch opacity-60">
              No pending tasks
            </p>
          </motion.div>
        )}

        {completedTasks.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="text-sm font-hand font-bold text-doodle-sketch uppercase tracking-wide">
              ✅ Completed
            </h4>
            {completedTasks.slice(0, 3).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TaskCard task={task} isComplete={true} />
              </motion.div>
            ))}
            {completedTasks.length > 3 && (
              <p className="text-xs font-indie text-doodle-sketch opacity-50 text-center py-2">
                +{completedTasks.length - 3} more completed
              </p>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-4 bg-doodle-cream">
        <motion.button
          className="sketch-button w-full"
          whileHover={{ scale: 1.02, rotate: 1 }}
          whileTap={{ scale: 0.98, rotate: -1 }}
        >
          Get Practice Tasks 📝
        </motion.button>
      </div>
    </div>
  );
}
