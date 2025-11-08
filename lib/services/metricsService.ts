/**
 * Metrics Service
 * Tracks nudge performance and student engagement metrics
 * Phase 1: SessionStorage + Console Logging
 * Phase 2: Will add database persistence
 */

import {
  NudgeMetrics,
  SessionMetrics,
  NudgeInteractionRecord,
} from "@/types/metrics";

/**
 * Get sessionStorage key for student metrics
 */
function getMetricsKey(studentId: string): string {
  return `nudge_metrics_${studentId}`;
}

/**
 * Get or initialize session metrics for a student
 */
export function getSessionMetrics(studentId: string): SessionMetrics {
  if (typeof window === "undefined") {
    return {
      studentId,
      sessionStart: new Date().toISOString(),
      nudgesShownThisSession: 0,
      interactions: [],
    };
  }

  const key = getMetricsKey(studentId);
  const stored = sessionStorage.getItem(key);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing session metrics:", error);
    }
  }

  // Initialize new session metrics
  const metrics: SessionMetrics = {
    studentId,
    sessionStart: new Date().toISOString(),
    nudgesShownThisSession: 0,
    interactions: [],
  };

  sessionStorage.setItem(key, JSON.stringify(metrics));
  return metrics;
}

/**
 * Record a nudge interaction in session metrics
 */
export function recordMetric(
  studentId: string,
  nudgeId: string,
  trigger: string,
  action: "shown" | "accepted" | "dismissed" | "expired",
  priority: string
): void {
  if (typeof window === "undefined") return;

  const metrics = getSessionMetrics(studentId);

  // Add interaction record
  const record: NudgeInteractionRecord = {
    nudgeId,
    studentId,
    trigger,
    action,
    priority,
    timestamp: new Date().toISOString(),
  };

  metrics.interactions.push(record);

  if (action === "shown") {
    metrics.nudgesShownThisSession++;
  }

  // Save back to sessionStorage
  sessionStorage.setItem(getMetricsKey(studentId), JSON.stringify(metrics));

  // Log to console with color coding
  logMetricToConsole(record);
}

/**
 * Calculate aggregated metrics from session data
 */
export function calculateMetrics(studentId: string): NudgeMetrics {
  const session = getSessionMetrics(studentId);

  const totalShown = session.interactions.filter(
    (i) => i.action === "shown"
  ).length;
  const totalAccepted = session.interactions.filter(
    (i) => i.action === "accepted"
  ).length;
  const totalDismissed = session.interactions.filter(
    (i) => i.action === "dismissed"
  ).length;
  const totalExpired = session.interactions.filter(
    (i) => i.action === "expired"
  ).length;

  const acceptanceRate =
    totalShown > 0 ? Math.round((totalAccepted / totalShown) * 100) : 0;
  const dismissalRate =
    totalShown > 0 ? Math.round((totalDismissed / totalShown) * 100) : 0;

  // Calculate trigger breakdown
  const triggerBreakdown: Record<
    string,
    { shown: number; accepted: number; dismissed: number }
  > = {};

  session.interactions.forEach((record) => {
    if (!triggerBreakdown[record.trigger]) {
      triggerBreakdown[record.trigger] = {
        shown: 0,
        accepted: 0,
        dismissed: 0,
      };
    }

    if (record.action === "shown") {
      triggerBreakdown[record.trigger].shown++;
    } else if (record.action === "accepted") {
      triggerBreakdown[record.trigger].accepted++;
    } else if (record.action === "dismissed") {
      triggerBreakdown[record.trigger].dismissed++;
    }
  });

  const lastInteraction = session.interactions
    .filter((i) => i.action === "shown")
    .pop();

  return {
    studentId,
    totalNudgesShown: totalShown,
    totalAccepted,
    totalDismissed,
    totalExpired,
    acceptanceRate,
    dismissalRate,
    lastNudgeShown: lastInteraction?.timestamp,
    lastNudgeId: lastInteraction?.nudgeId,
    triggerBreakdown,
  };
}

/**
 * Log metric to console with color coding
 */
function logMetricToConsole(record: NudgeInteractionRecord): void {
  const timestamp = new Date(record.timestamp).toLocaleTimeString();

  let emoji = "📊";
  let color = "\x1b[36m"; // Cyan for default

  switch (record.action) {
    case "shown":
      emoji = "👁️ ";
      color = "\x1b[34m"; // Blue
      break;
    case "accepted":
      emoji = "✅";
      color = "\x1b[32m"; // Green
      break;
    case "dismissed":
      emoji = "❌";
      color = "\x1b[33m"; // Yellow
      break;
    case "expired":
      emoji = "⏰";
      color = "\x1b[90m"; // Gray
      break;
  }

  const reset = "\x1b[0m";
  const bold = "\x1b[1m";

  console.log(
    `${color}${bold}${emoji} Nudge ${record.action.toUpperCase()}${reset}${color} @ ${timestamp}${reset}`,
    `\n  └─ Trigger: ${record.trigger}`,
    `\n  └─ Priority: ${record.priority}`,
    `\n  └─ ID: ${record.nudgeId.substring(0, 20)}...`
  );
}

/**
 * Print session summary to console
 */
export function printSessionSummary(studentId: string): void {
  const metrics = calculateMetrics(studentId);

  console.group("📊 Nudge Session Summary");
  console.log(`Student: ${studentId}`);
  console.log(`Total Shown: ${metrics.totalNudgesShown}`);
  console.log(
    `Accepted: ${metrics.totalAccepted} (${metrics.acceptanceRate}%)`
  );
  console.log(
    `Dismissed: ${metrics.totalDismissed} (${metrics.dismissalRate}%)`
  );
  console.log(`\nTrigger Breakdown:`);
  Object.entries(metrics.triggerBreakdown).forEach(([trigger, stats]) => {
    console.log(
      `  ${trigger}: ${stats.shown} shown, ${stats.accepted} accepted`
    );
  });
  console.groupEnd();
}

/**
 * Clear session metrics (e.g., on logout)
 */
export function clearSessionMetrics(studentId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(getMetricsKey(studentId));
  console.log(`🗑️  Cleared metrics for ${studentId}`);
}

/**
 * Export metrics as JSON (for debugging/analysis)
 */
export function exportMetrics(studentId: string): string {
  const metrics = calculateMetrics(studentId);
  return JSON.stringify(metrics, null, 2);
}
