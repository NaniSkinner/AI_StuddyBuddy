import {
  parseISO,
  differenceInDays,
  isToday,
  isYesterday,
  format,
  addDays,
  startOfDay,
} from "date-fns";

/**
 * Format an ISO date string to a human-readable format
 */
export function formatDate(date: string, formatString: string = "MMM d, yyyy"): string {
  try {
    return format(parseISO(date), formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return date;
  }
}

/**
 * Check if two dates are consecutive days
 */
export function isConsecutiveDay(date1: string, date2: string): boolean {
  try {
    const d1 = startOfDay(parseISO(date1));
    const d2 = startOfDay(parseISO(date2));
    const diff = Math.abs(differenceInDays(d1, d2));
    return diff === 1;
  } catch (error) {
    console.error("Error checking consecutive days:", error);
    return false;
  }
}

/**
 * Calculate days since a given date
 */
export function daysSince(date: string): number {
  try {
    const past = parseISO(date);
    const now = new Date();
    return differenceInDays(now, past);
  } catch (error) {
    console.error("Error calculating days since:", error);
    return 0;
  }
}

/**
 * Find consecutive date sequences to calculate streaks
 * Returns the length of the current streak
 */
export function getStreakDates(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Sort dates in descending order (most recent first)
  const sortedDates = dates
    .map((d) => startOfDay(parseISO(d)))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = startOfDay(new Date());
  const yesterday = startOfDay(addDays(today, -1));

  // Check if most recent activity was today or yesterday
  const mostRecent = sortedDates[0];
  if (
    mostRecent.getTime() !== today.getTime() &&
    mostRecent.getTime() !== yesterday.getTime()
  ) {
    return 0; // Streak is broken
  }

  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = sortedDates[i];
    const next = sortedDates[i + 1];
    const diff = differenceInDays(current, next);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Check if a date is today
 */
export function isDateToday(date: string): boolean {
  try {
    return isToday(parseISO(date));
  } catch (error) {
    return false;
  }
}

/**
 * Check if a date is yesterday
 */
export function isDateYesterday(date: string): boolean {
  try {
    return isYesterday(parseISO(date));
  } catch (error) {
    return false;
  }
}

/**
 * Get a relative time string (e.g., "2 days ago")
 */
export function getRelativeTimeString(date: string): string {
  try {
    const days = daysSince(date);

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(date);
  } catch (error) {
    return date;
  }
}

