import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { NudgeMessage } from "@/types";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const TIMEOUT_MS = 10000;

/**
 * Custom hook for nudge system integration
 * Handles checking, displaying, and interacting with nudges
 * Features: Network retry, error handling, performance optimization
 */
export function useNudgeSystem(studentId: string | null) {
  const [currentNudge, setCurrentNudge] = useState<NudgeMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Retry helper with exponential backoff
   */
  const retryWithBackoff = useCallback(
    async (fn: () => Promise<any>, attempt = 0): Promise<any> => {
      try {
        return await fn();
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
          console.log(
            `🔄 Retry attempt ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return retryWithBackoff(fn, attempt + 1);
        }
        throw error;
      }
    },
    []
  );

  /**
   * Fetch with timeout
   */
  const fetchWithTimeout = useCallback(
    async (url: string, options: RequestInit = {}) => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
      } catch (error) {
        clearTimeout(timeout);
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("Request timed out");
        }
        throw error;
      }
    },
    []
  );

  /**
   * Check for nudges from the API with retry logic
   */
  const checkForNudge = useCallback(
    async (force = false) => {
      if (!studentId) {
        console.warn("⚠️ Cannot check nudge: No student ID");
        return;
      }

      // Check if already checked this session (unless forced)
      if (!force && typeof window !== "undefined") {
        const sessionKey = `nudge_checked_${studentId}`;
        const lastCheck = sessionStorage.getItem(sessionKey);
        if (lastCheck) {
          const hoursSince =
            (Date.now() - parseInt(lastCheck)) / (1000 * 60 * 60);
          if (hoursSince < 1) {
            // Already checked within last hour
            return;
          }
        }
      }

      setIsLoading(true);
      setError(null);
      retryCountRef.current = 0;

      try {
        await retryWithBackoff(async () => {
          const response = await fetchWithTimeout(
            `/api/nudges?studentId=${studentId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch nudge: ${response.status}`);
          }

          const data = await response.json();

          // Validate response data
          if (data && typeof data === "object") {
            if (data.nudge) {
              // Validate nudge structure
              if (!data.nudge.id || !data.nudge.encouragement) {
                throw new Error("Invalid nudge data received");
              }

              setCurrentNudge(data.nudge);

              // Mark as shown via API (with metrics data) - non-blocking
              fetch("/api/nudges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  studentId,
                  nudgeId: data.nudge.id,
                  action: "shown",
                  trigger: data.nudge.trigger,
                  priority: data.nudge.priority,
                }),
              }).catch((err) => {
                console.warn("⚠️ Failed to mark nudge as shown:", err);
              });
            }

            // Mark check time
            if (typeof window !== "undefined") {
              sessionStorage.setItem(
                `nudge_checked_${studentId}`,
                Date.now().toString()
              );
            }
          } else {
            throw new Error("Invalid response format");
          }
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Error checking for nudge:", errorMessage);
        setError(errorMessage);

        // Show user-friendly error (optional toast notification)
        if (typeof window !== "undefined" && window.console) {
          console.log(
            "💡 Tip: Check your network connection and try again later"
          );
        }
      } finally {
        setIsLoading(false);
        retryCountRef.current = 0;
      }
    },
    [studentId, retryWithBackoff, fetchWithTimeout]
  );

  /**
   * Accept the current nudge
   */
  const acceptNudge = useCallback(async () => {
    if (!currentNudge || !studentId) return;

    try {
      // Record interaction
      await fetch("/api/nudges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          nudgeId: currentNudge.id,
          action: "accepted",
        }),
      });

      // Handle action based on trigger
      handleNudgeAction(currentNudge);

      // Clear nudge
      setCurrentNudge(null);
    } catch (err) {
      console.error("Error accepting nudge:", err);
    }
  }, [currentNudge, studentId]);

  /**
   * Dismiss the current nudge
   */
  const dismissNudge = useCallback(async () => {
    if (!currentNudge || !studentId) return;

    try {
      // Record interaction
      await fetch("/api/nudges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          nudgeId: currentNudge.id,
          action: "dismissed",
        }),
      });

      // Clear nudge
      setCurrentNudge(null);
    } catch (err) {
      console.error("Error dismissing nudge:", err);
    }
  }, [currentNudge, studentId]);

  /**
   * Force check for nudge (for demo button)
   */
  const forceCheckNudge = useCallback(
    async (messages?: any[]) => {
      if (!studentId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/nudges/force`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            messages: messages || [],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to force nudge");
        }

        const data = await response.json();

        if (data.nudge) {
          setCurrentNudge(data.nudge);
        }
      } catch (err) {
        console.error("Error forcing nudge:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [studentId]
  );

  /**
   * Trigger nudge check based on event
   * Force = true bypasses session check but still respects 24hr limit
   */
  const triggerNudgeOnEvent = useCallback(
    async (eventType: string) => {
      if (!studentId) return;

      console.log(
        `🎯 Event-based nudge trigger: ${eventType} for student ${studentId}`
      );

      // Force check (bypass session cache)
      await checkForNudge(true);
    },
    [studentId, checkForNudge]
  );

  /**
   * Check for nudge on mount and periodically
   * Also handle event-based triggers from sessionStorage
   */
  useEffect(() => {
    if (!studentId) return;

    // Check if there's a pending event trigger
    if (typeof window !== "undefined") {
      const eventTrigger = sessionStorage.getItem("trigger_nudge_on_load");
      if (eventTrigger) {
        console.log(`🎯 Found pending nudge trigger: ${eventTrigger}`);
        sessionStorage.removeItem("trigger_nudge_on_load");
        // Delay slightly to let page finish loading
        setTimeout(() => {
          triggerNudgeOnEvent(eventTrigger);
        }, 1000);
      } else {
        // Normal check on mount
        checkForNudge();
      }
    } else {
      checkForNudge();
    }

    // Check every 5 minutes while app is open
    const interval = setInterval(() => {
      checkForNudge();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      // Cancel any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [studentId, checkForNudge, triggerNudgeOnEvent]);

  /**
   * Listen for custom nudge trigger events
   */
  useEffect(() => {
    if (!studentId || typeof window === "undefined") return;

    const handleCustomTrigger = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { eventType } = customEvent.detail || {};
      if (eventType) {
        console.log(`🎯 Custom event received: ${eventType}`);
        triggerNudgeOnEvent(eventType);
      }
    };

    window.addEventListener("nudge:trigger", handleCustomTrigger);

    return () => {
      window.removeEventListener("nudge:trigger", handleCustomTrigger);
    };
  }, [studentId, triggerNudgeOnEvent]);

  return {
    currentNudge,
    isLoading,
    error,
    acceptNudge,
    dismissNudge,
    forceCheckNudge,
    checkForNudge,
    triggerNudgeOnEvent,
  };
}

/**
 * Handle nudge action - route to appropriate page
 */
function handleNudgeAction(nudge: NudgeMessage) {
  switch (nudge.trigger) {
    case "goal_completed":
      // Redirect to goals page or open goal selector
      window.location.href = "/learn"; // For now, go to learn page
      break;
    case "low_task_completion":
      // Redirect to tasks page with easy difficulty
      window.location.href = "/learn";
      break;
    case "inactive":
    case "streak_broken":
    case "general_encouragement":
    default:
      // Redirect to learn/dashboard
      window.location.href = "/learn";
      break;
  }
}
