import { SubConcept, Topic, Goal } from "@/types";

/**
 * Calculate topic mastery based on sub-concepts
 */
export function calculateTopicMastery(subConcepts: SubConcept[]): number {
  if (!subConcepts || subConcepts.length === 0) return 0;

  const totalConcepts = subConcepts.length;
  const masteredConcepts = subConcepts.filter((sc) => sc.mastered).length;

  return Math.round((masteredConcepts / totalConcepts) * 100);
}

/**
 * Calculate overall goal progress based on topics
 */
export function calculateGoalProgress(topics: Topic[]): number {
  if (!topics || topics.length === 0) return 0;

  const totalProgress = topics.reduce((sum, topic) => sum + topic.progress, 0);
  return Math.round(totalProgress / topics.length);
}

/**
 * Determine age group for age-appropriate features
 * Returns: 'child' (9-11), 'teen' (12-14), or 'young-adult' (15-16)
 */
export function determineAgeGroup(
  age: number
): "child" | "teen" | "young-adult" {
  if (age >= 9 && age <= 11) return "child";
  if (age >= 12 && age <= 14) return "teen";
  return "young-adult";
}

/**
 * Calculate learning improvement score
 * Formula: (Time Spent in Minutes × Correct Answer Rate) / Total Tasks
 */
export function getLearningScore(
  timeSpent: number,
  correctRate: number,
  totalTasks: number
): number {
  if (totalTasks === 0) return 0;
  return Math.round((timeSpent * correctRate) / totalTasks);
}

/**
 * Calculate success rate from attempts
 */
export function calculateSuccessRate(
  correct: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Determine if a student is ready to level up on a topic
 */
export function isReadyToLevelUp(topic: Topic): boolean {
  return topic.progress >= 90;
}

/**
 * Determine if a student is struggling with a topic
 */
export function isStruggling(topic: Topic): boolean {
  // Consider struggling if progress is low and they've practiced recently
  return topic.progress < 40;
}

/**
 * Get visual indicator for progress (for ages 9-12)
 */
export function getProgressIndicator(
  subConcept: SubConcept
): "✓" | "⚠️" | "○" {
  if (subConcept.mastered) return "✓";
  if (subConcept.attemptsTotal > 0) {
    const rate = calculateSuccessRate(
      subConcept.attemptsCorrect,
      subConcept.attemptsTotal
    );
    return rate >= 50 ? "⚠️" : "○";
  }
  return "○";
}

/**
 * Calculate difficulty adjustment for next task
 * Returns: 'easier', 'same', or 'harder'
 */
export function calculateDifficultyAdjustment(
  recentSuccessRate: number
): "easier" | "same" | "harder" {
  if (recentSuccessRate < 50) return "easier";
  if (recentSuccessRate > 80) return "harder";
  return "same";
}

/**
 * Estimate time to goal completion (in days)
 */
export function estimateTimeToCompletion(
  currentProgress: number,
  averageProgressPerDay: number
): number {
  if (averageProgressPerDay === 0) return Infinity;
  const remainingProgress = 100 - currentProgress;
  return Math.ceil(remainingProgress / averageProgressPerDay);
}

