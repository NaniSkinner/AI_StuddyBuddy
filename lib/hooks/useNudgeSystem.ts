import { useState, useEffect, useCallback } from "react";
import { NudgeMessage } from "@/types";

/**
 * Custom hook for nudge system integration
 * Handles checking, displaying, and interacting with nudges
 */
export function useNudgeSystem(studentId: string | null) {
  const [currentNudge, setCurrentNudge] = useState<NudgeMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check for nudges from the API
   */
  const checkForNudge = useCallback(
    async (force = false) => {
      if (!studentId) return;

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

      try {
        const response = await fetch(`/api/nudges?studentId=${studentId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch nudge");
        }

        const data = await response.json();

        if (data.nudge) {
          setCurrentNudge(data.nudge);

          // Mark as shown via API (with metrics data)
          await fetch("/api/nudges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId,
              nudgeId: data.nudge.id,
              action: "shown",
              trigger: data.nudge.trigger,
              priority: data.nudge.priority,
            }),
          });
        }

        // Mark check time
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            `nudge_checked_${studentId}`,
            Date.now().toString()
          );
        }
      } catch (err) {
        console.error("Error checking for nudge:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [studentId]
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
    async (scenario?: string) => {
      if (!studentId) return;

      setIsLoading(true);
      setError(null);

      try {
        const url = scenario
          ? `/api/nudges/force?studentId=${studentId}&scenario=${scenario}`
          : `/api/nudges/force?studentId=${studentId}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

    return () => clearInterval(interval);
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
