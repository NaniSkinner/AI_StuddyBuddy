/**
 * Hook for triggering nudges based on app events
 * Provides simple API for triggering nudges from anywhere in the app
 */

/**
 * Trigger a nudge check based on an event
 * This stores the event in sessionStorage and will be picked up by useNudgeSystem
 * @param eventType - Type of event (login, goal_complete, task_complete, streak_warning)
 */
export function triggerNudgeEvent(eventType: string) {
  if (typeof window === "undefined") return;

  console.log(`🎯 Queuing nudge trigger for event: ${eventType}`);
  sessionStorage.setItem("pending_nudge_trigger", eventType);
  sessionStorage.setItem("pending_nudge_trigger_time", Date.now().toString());

  // Dispatch a custom event to notify useNudgeSystem
  window.dispatchEvent(
    new CustomEvent("nudge:trigger", {
      detail: { eventType },
    })
  );
}

/**
 * Trigger nudge on goal completion
 * @param goalId - The completed goal ID
 */
export function triggerGoalCompletionNudge(goalId: string) {
  console.log(`🎉 Goal completed: ${goalId} - Triggering nudge`);
  triggerNudgeEvent("goal_complete");
}

/**
 * Trigger nudge on task completion
 * @param taskId - The completed task ID
 * @param studentId - The student ID
 */
export function triggerTaskCompletionNudge(taskId: string, studentId: string) {
  console.log(`✅ Task completed: ${taskId} for student ${studentId}`);
  triggerNudgeEvent("task_complete");
}

/**
 * Trigger nudge on streak warning (streak about to break)
 */
export function triggerStreakWarningNudge() {
  console.log(`⚠️ Streak warning - Triggering nudge`);
  triggerNudgeEvent("streak_warning");
}

/**
 * Trigger nudge after session completion
 */
export function triggerSessionCompleteNudge() {
  console.log(`📚 Session complete - Triggering nudge`);
  triggerNudgeEvent("session_complete");
}
