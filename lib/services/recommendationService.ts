import { Student, Goal } from "@/types";
import { getStudentById } from "./studentService";

/**
 * Subject recommendation based on completion and rules
 */
export interface SubjectRecommendation {
  subject: string;
  reason: string;
  priority: "high" | "medium" | "low";
  relatedTo?: string;
}

/**
 * Rule-based subject recommendations (PRD requirements)
 */
const SUBJECT_RULES: Record<string, string[]> = {
  "SAT Prep": ["College Essays", "Study Skills"],
  "SAT Math": ["College Essays", "Study Skills"],
  Chemistry: ["Physics", "Biology"],
  "Algebra I": ["Geometry", "Algebra II"],
  "Algebra II": ["Pre-Calculus", "Trigonometry"],
  Geometry: ["Trigonometry", "Algebra II"],
};

/**
 * Get cross-subject recommendations for a student
 */
export async function getSubjectRecommendations(
  studentId: string
): Promise<SubjectRecommendation[]> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return [];

    const recommendations: SubjectRecommendation[] = [];

    // Check if student has reached max subjects (4)
    if (student.goals.length >= 4) {
      return []; // No recommendations if at max
    }

    // Rule-based recommendations
    for (const goal of student.goals) {
      // Check if goal is near completion (>= 85%)
      if (goal.progress >= 85) {
        const relatedSubjects = SUBJECT_RULES[goal.subject] || [];

        for (const subject of relatedSubjects) {
          // Don't recommend if already studying
          if (student.goals.some((g) => g.subject === subject)) continue;

          recommendations.push({
            subject,
            reason: `You're doing great with ${goal.subject}! ${subject} would be a natural next step.`,
            priority: "high",
            relatedTo: goal.subject,
          });
        }
      }
    }

    // AI-inferred recommendations based on student age and current subjects
    const ageBasedRecs = getAgeBasedRecommendations(student);
    recommendations.push(...ageBasedRecs);

    // Remove duplicates and limit to top 3
    const unique = recommendations.filter(
      (rec, index, self) =>
        self.findIndex((r) => r.subject === rec.subject) === index
    );

    return unique.slice(0, 3);
  } catch (error) {
    console.error(`Error getting recommendations for ${studentId}:`, error);
    return [];
  }
}

/**
 * Age-based subject recommendations
 */
function getAgeBasedRecommendations(student: Student): SubjectRecommendation[] {
  const recommendations: SubjectRecommendation[] = [];
  const currentSubjects = student.goals.map((g) => g.subject.toLowerCase());

  // Ages 9-11: Basic subjects
  if (student.age >= 9 && student.age <= 11) {
    if (!currentSubjects.includes("reading")) {
      recommendations.push({
        subject: "Reading",
        reason: "Reading builds the foundation for all learning!",
        priority: "medium",
      });
    }
    if (!currentSubjects.includes("science")) {
      recommendations.push({
        subject: "Science",
        reason: "Science is fun and full of discoveries!",
        priority: "low",
      });
    }
  }

  // Ages 12-14: Intermediate subjects
  if (student.age >= 12 && student.age <= 14) {
    if (!currentSubjects.includes("writing")) {
      recommendations.push({
        subject: "Writing",
        reason: "Strong writing skills help in every subject!",
        priority: "medium",
      });
    }
  }

  // Ages 15-16: Advanced/college prep
  if (student.age >= 15 && student.age <= 16) {
    if (
      !currentSubjects.includes("sat prep") &&
      !currentSubjects.includes("sat")
    ) {
      recommendations.push({
        subject: "SAT Prep",
        reason: "Start preparing early for college admissions!",
        priority: "high",
      });
    }
    if (!currentSubjects.includes("college essays")) {
      recommendations.push({
        subject: "College Essays",
        reason: "Perfect time to start crafting your college applications!",
        priority: "medium",
      });
    }
  }

  return recommendations;
}

/**
 * Check if student should be prompted for new subject
 */
export async function shouldSuggestNewSubject(
  studentId: string
): Promise<boolean> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return false;

    // Don't suggest if at max subjects
    if (student.goals.length >= 4) return false;

    // Suggest if any goal is >85% complete
    const hasCompletedGoal = student.goals.some((g) => g.progress >= 85);
    if (hasCompletedGoal) return true;

    // Suggest if only 1-2 subjects and been active for 7+ days
    const { daysSince } = await import("@/lib/utils/dateUtils");
    const daysSinceCreation = daysSince(student.createdAt);

    if (student.goals.length <= 2 && daysSinceCreation >= 7) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error checking subject suggestion for ${studentId}:`, error);
    return false;
  }
}

/**
 * Generate personalized learning path suggestions
 */
export interface LearningPathSuggestion {
  goal: string;
  topics: string[];
  estimatedWeeks: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export async function generateLearningPath(
  studentId: string,
  subject: string
): Promise<LearningPathSuggestion | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    // Simple learning path generation based on age and subject
    const pathMap: Record<string, Partial<LearningPathSuggestion>> = {
      "Elementary Math": {
        topics: [
          "Numbers & Counting",
          "Addition & Subtraction",
          "Multiplication",
          "Division",
          "Fractions",
          "Decimals",
        ],
        estimatedWeeks: 12,
        difficulty: "beginner",
      },
      "Algebra I": {
        topics: [
          "Variables",
          "Linear Equations",
          "Graphing",
          "Systems of Equations",
          "Polynomials",
          "Quadratics",
        ],
        estimatedWeeks: 16,
        difficulty: "intermediate",
      },
      "SAT Prep": {
        topics: [
          "Math Fundamentals",
          "Reading Strategies",
          "Writing & Grammar",
          "Practice Tests",
        ],
        estimatedWeeks: 12,
        difficulty: "advanced",
      },
    };

    const path = pathMap[subject];
    if (!path) {
      return {
        goal: subject,
        topics: ["Introduction", "Core Concepts", "Practice", "Mastery"],
        estimatedWeeks: 8,
        difficulty:
          student.age <= 11
            ? "beginner"
            : student.age <= 14
            ? "intermediate"
            : "advanced",
      };
    }

    return {
      goal: subject,
      topics: path.topics || [],
      estimatedWeeks: path.estimatedWeeks || 8,
      difficulty: path.difficulty || "intermediate",
    };
  } catch (error) {
    console.error(`Error generating learning path for ${studentId}:`, error);
    return null;
  }
}
