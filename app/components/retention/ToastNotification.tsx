"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export interface Toast {
  id: string;
  title: string;
  message: string;
  type?: "success" | "info" | "warning" | "error";
  icon?: string;
  duration?: number; // milliseconds, default 5000
}

interface ToastNotificationProps {
  toast: Toast;
  onDismiss: (id: string) => void;
  index?: number; // for stacking
}

export default function ToastNotification({
  toast,
  onDismiss,
  index = 0,
}: ToastNotificationProps) {
  const duration = toast.duration || 5000;

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  // Type colors
  const typeStyles = {
    success: "border-[#10B981] bg-[#ECFDF5]",
    info: "border-[#6FB1FC] bg-[#EFF6FF]",
    warning: "border-[#F59E0B] bg-[#FFFBEB]",
    error: "border-[#EF4444] bg-[#FEF2F2]",
  };

  const style = typeStyles[toast.type || "info"];

  // Default icons
  const defaultIcons = {
    success: "✅",
    info: "ℹ️",
    warning: "⚠️",
    error: "❌",
  };

  const icon = toast.icon || defaultIcons[toast.type || "info"];

  return (
    <motion.div
      className={`flex items-start gap-3 p-4 rounded-2xl border-3 ${style}
                  shadow-[4px_4px_0px_rgba(0,0,0,0.1)]
                  w-[320px] max-w-[90vw]`}
      initial={{ x: 400, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        y: index * 90, // Stack vertically
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      }}
      exit={{
        x: 400,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      layout
    >
      {/* Icon */}
      {icon && (
        <div className="text-2xl flex-shrink-0 mt-0.5">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-['Architects_Daughter'] font-bold text-md text-[#2D3748] mb-1">
          {toast.title}
        </h4>
        <p className="font-['Architects_Daughter'] text-sm text-[#2D3748]/80">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 w-6 h-6 rounded-full
                   flex items-center justify-center
                   text-[#2D3748]/60 hover:text-[#2D3748]
                   hover:bg-black/5
                   transition-colors"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </motion.div>
  );
}

/**
 * Toast Container Component
 * Place this in your layout to display toasts
 */
interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-5 right-5 z-[10000] flex flex-col-reverse gap-3">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

