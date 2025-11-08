import { Toast } from "@/app/components/retention/ToastNotification";

/**
 * Simple toast notification service for Phase 1
 * Uses in-app toasts only (no browser notifications)
 */

let toastIdCounter = 0;

/**
 * Generate unique toast ID
 */
function generateToastId(): string {
  return `toast-${Date.now()}-${++toastIdCounter}`;
}

/**
 * Toast queue for display
 * In production, this would be managed by a global state (Zustand/Context)
 */
const toastQueue: Toast[] = [];
const toastListeners: Array<(toasts: Toast[]) => void> = [];

/**
 * Subscribe to toast updates
 */
export function subscribeToToasts(callback: (toasts: Toast[]) => void): () => void {
  toastListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = toastListeners.indexOf(callback);
    if (index > -1) {
      toastListeners.splice(index, 1);
    }
  };
}

/**
 * Notify all listeners of toast queue update
 */
function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toastQueue]));
}

/**
 * Show a toast notification
 */
export function showToast(
  title: string,
  message: string,
  options?: {
    type?: "success" | "info" | "warning" | "error";
    icon?: string;
    duration?: number;
  }
): string {
  const toast: Toast = {
    id: generateToastId(),
    title,
    message,
    type: options?.type || "info",
    icon: options?.icon,
    duration: options?.duration || 5000,
  };

  // Add to queue (max 3 toasts)
  if (toastQueue.length >= 3) {
    toastQueue.shift(); // Remove oldest
  }
  toastQueue.push(toast);
  
  // Notify listeners
  notifyListeners();

  // Console log for Phase 1
  console.log(`🔔 Toast: ${title} - ${message}`);

  return toast.id;
}

/**
 * Dismiss a toast
 */
export function dismissToast(id: string): void {
  const index = toastQueue.findIndex((t) => t.id === id);
  if (index > -1) {
    toastQueue.splice(index, 1);
    notifyListeners();
  }
}

/**
 * Get all active toasts
 */
export function getToasts(): Toast[] {
  return [...toastQueue];
}

/**
 * Clear all toasts
 */
export function clearAllToasts(): void {
  toastQueue.length = 0;
  notifyListeners();
}

/**
 * Convenience methods for different toast types
 */
export const toast = {
  success: (title: string, message: string, duration?: number) =>
    showToast(title, message, { type: "success", duration }),
  
  info: (title: string, message: string, duration?: number) =>
    showToast(title, message, { type: "info", duration }),
  
  warning: (title: string, message: string, duration?: number) =>
    showToast(title, message, { type: "warning", duration }),
  
  error: (title: string, message: string, duration?: number) =>
    showToast(title, message, { type: "error", duration }),
};

/**
 * Request browser notification permission (Phase 2)
 * For now, this is a placeholder
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Show browser notification (Phase 2)
 * For Phase 1, this falls back to toast
 */
export function showBrowserNotification(
  title: string,
  message: string,
  icon?: string
): void {
  // Phase 1: Show as toast
  showToast(title, message, { icon });

  // Phase 2: Use real notifications
  // if ('Notification' in window && Notification.permission === 'granted') {
  //   new Notification(title, { body: message, icon });
  // }
}

