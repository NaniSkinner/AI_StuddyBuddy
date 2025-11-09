# 💪 AI Study Companion - Retention Features

**PRD v3 - Shard 6 of 12**

---

## 📖 Overview

This document specifies the Retention and Re-engagement systems designed to combat the 52% churn rate. These features detect at-risk students and proactively intervene with personalized encouragement.

**Churn Detection:** Identify students at risk of dropping off  
**Nudge System:** Personalized re-engagement messages  
**Strategy:** Celebrate-first, then encourage

**Goal:** Reduce churn from 52% to <30%

---

## 📉 The Churn Problem

### Current Situation

**Baseline Metrics:**

- **52% churn rate** after completing first goal
- Average **2.1 sessions per student** in 30 days
- Students who reach **3 sessions have 80% retention**
- Most churn happens in **Days 3-7**

**Why Students Leave:**

1. Goal completed → "I'm done"
2. Initial excitement fades
3. No reminder to return
4. Don't see next steps
5. Lost momentum during gap

**Our Solution:**

- Detect churn risk early
- Proactive intervention
- Celebrate progress first
- Show path forward
- Make return easy

---

## 🎯 Churn Detection System

### Risk Levels

```typescript
enum ChurnRisk {
  NONE = "none", // Healthy engagement
  LOW = "low", // Minor concern
  MEDIUM = "medium", // Needs attention
  HIGH = "high", // Immediate intervention
}
```

### Detection Logic

**Primary Indicators:**

1. **Session Count (Days 1-7)**

   - <1 session by Day 3 → HIGH
   - <2 sessions by Day 5 → MEDIUM
   - <3 sessions by Day 7 → HIGH

2. **Inactivity Duration**

   - No login for 3+ days → HIGH
   - No login for 2 days → MEDIUM
   - No login for 1 day → LOW

3. **Practice Activity**

   - No tasks completed in 5+ days → HIGH
   - No tasks completed in 3+ days → MEDIUM
   - Task completion rate <30% → MEDIUM

4. **Engagement Decline**
   - Messages sent declining week-over-week → LOW
   - Time per session decreasing → LOW

**Secondary Indicators:**

5. **Goal Completion Status**

   - Completed goal but no new goal → HIGH
   - Stalled progress (no improvement in 7 days) → MEDIUM

6. **Streak Status**
   - Broken streak (was 3+, now 0) → MEDIUM
   - Never built a streak → LOW

---

### Implementation

```typescript
// /lib/services/churnService.ts
import { Student } from "@/types";

export interface ChurnRiskAssessment {
  level: ChurnRisk;
  score: number; // 0-100
  reasons: string[];
  interventions: string[];
  daysSinceActive: number;
  sessionCount: number;
}

export const churnService = {
  /**
   * Assess churn risk for a student
   */
  assessRisk(student: Student): ChurnRiskAssessment {
    const now = new Date();
    const accountAge = this.getAccountAge(student, now);
    const daysSinceActive = this.getDaysSinceActive(student, now);
    const sessionCount = student.sessions?.length || 0;

    let score = 0;
    const reasons: string[] = [];
    const interventions: string[] = [];

    // Factor 1: Session count in first week
    if (accountAge <= 7) {
      if (accountAge >= 3 && sessionCount < 1) {
        score += 40;
        reasons.push("No sessions by Day 3");
        interventions.push("Welcome nudge with easy first task");
      } else if (accountAge >= 5 && sessionCount < 2) {
        score += 30;
        reasons.push("Less than 2 sessions by Day 5");
        interventions.push("Show progress made, suggest next step");
      } else if (accountAge >= 7 && sessionCount < 3) {
        score += 35;
        reasons.push("Less than 3 sessions by Day 7");
        interventions.push("Celebrate what they've done, build momentum");
      }
    }

    // Factor 2: Inactivity duration
    if (daysSinceActive >= 3) {
      score += 35;
      reasons.push(`No activity for ${daysSinceActive} days`);
      interventions.push("Personal check-in, ask how they're doing");
    } else if (daysSinceActive >= 2) {
      score += 20;
      reasons.push(`Inactive for ${daysSinceActive} days`);
      interventions.push("Reminder with specific task suggestion");
    } else if (daysSinceActive >= 1) {
      score += 10;
      reasons.push("Inactive for 1 day");
      interventions.push("Gentle reminder about streak");
    }

    // Factor 3: Task completion
    const taskStats = this.getTaskStats(student);
    if (taskStats.daysSinceLastTask >= 5) {
      score += 25;
      reasons.push("No tasks completed in 5+ days");
      interventions.push("Assign easy, quick win task");
    } else if (taskStats.completionRate < 0.3 && taskStats.total > 5) {
      score += 15;
      reasons.push("Low task completion rate");
      interventions.push("Check if tasks are too difficult");
    }

    // Factor 4: Goal status
    const completedGoals =
      student.goals?.filter((g) => g.progress >= 100) || [];
    const activeGoals = student.goals?.filter((g) => g.progress < 100) || [];

    if (completedGoals.length > 0 && activeGoals.length === 0) {
      score += 30;
      reasons.push("Completed goal, no new goals");
      interventions.push("Suggest related subjects");
    }

    // Factor 5: Streak status
    const hadStreak = student.streaks?.longest > 0;
    const currentStreak = student.streaks?.current || 0;

    if (hadStreak && currentStreak === 0) {
      score += 15;
      reasons.push("Lost previous streak");
      interventions.push("Encourage streak recovery");
    }

    // Determine risk level
    let level: ChurnRisk;
    if (score >= 60) {
      level = ChurnRisk.HIGH;
    } else if (score >= 35) {
      level = ChurnRisk.MEDIUM;
    } else if (score >= 15) {
      level = ChurnRisk.LOW;
    } else {
      level = ChurnRisk.NONE;
    }

    return {
      level,
      score,
      reasons,
      interventions,
      daysSinceActive,
      sessionCount,
    };
  },

  /**
   * Get days since account creation
   */
  getAccountAge(student: Student, now: Date): number {
    const created = new Date(student.createdAt);
    return Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
  },

  /**
   * Get days since last activity
   */
  getDaysSinceActive(student: Student, now: Date): number {
    const lastActive = new Date(student.lastLoginAt);
    return Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );
  },

  /**
   * Get task completion statistics
   */
  getTaskStats(student: Student): {
    total: number;
    completed: number;
    completionRate: number;
    daysSinceLastTask: number;
  } {
    const tasks = student.taskHistory || [];
    const completed = tasks.filter((t) => t.status === "complete");

    let daysSinceLastTask = 999;
    if (completed.length > 0) {
      const lastTask = completed[completed.length - 1];
      const lastDate = new Date(lastTask.completedAt);
      const now = new Date();
      daysSinceLastTask = Math.floor(
        (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return {
      total: tasks.length,
      completed: completed.length,
      completionRate: tasks.length > 0 ? completed.length / tasks.length : 0,
      daysSinceLastTask,
    };
  },

  /**
   * Check if student should receive a nudge
   */
  shouldNudge(student: Student): boolean {
    // Check last nudge time
    const lastNudge = student.metadata?.lastNudgeShown;
    if (lastNudge) {
      const hoursSince =
        (Date.now() - new Date(lastNudge).getTime()) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        return false; // Max 1 nudge per 24 hours
      }
    }

    // Check risk level
    const risk = this.assessRisk(student);
    return risk.level === ChurnRisk.MEDIUM || risk.level === ChurnRisk.HIGH;
  },
};
```

---

## 💬 Nudge System

### Celebrate-First Strategy

**Core Principle:** Always start with something positive before encouraging action.

**Why This Works:**

- Reduces shame/guilt about being away
- Reminds student of their progress
- Creates positive emotional association
- Makes return feel like continuation, not failure

**Structure:**

```
1. Celebration (what they've done)
   ↓
2. Encouragement (gentle nudge)
   ↓
3. Call-to-Action (specific, easy next step)
```

---

### Message Templates

**Template System:**

```typescript
interface NudgeTemplate {
  id: string;
  trigger: ChurnReason;
  ageGroup: "young" | "middle" | "teen";
  messages: {
    celebration?: string;
    encouragement: string;
    cta: string;
  };
  intensity: "gentle" | "moderate" | "urgent";
}
```

**Example Templates:**

```typescript
const NUDGE_TEMPLATES: NudgeTemplate[] = [
  {
    id: "inactive-3days-young",
    trigger: "inactive",
    ageGroup: "young",
    messages: {
      celebration: "You did awesome on fractions last time! 🎉",
      encouragement:
        "We miss you! Your AI buddy has been waiting to help you learn more cool stuff.",
      cta: "Want to try just one quick problem? It'll only take 2 minutes! 😊",
    },
    intensity: "gentle",
  },
  {
    id: "inactive-3days-middle",
    trigger: "inactive",
    ageGroup: "middle",
    messages: {
      celebration:
        "You're 65% through Reading Comprehension - that's progress!",
      encouragement:
        "Your streak is about to break. You're only 1 day away from beating your record of 8 days!",
      cta: "Quick 5-minute session to keep your streak alive?",
    },
    intensity: "moderate",
  },
  {
    id: "inactive-3days-teen",
    trigger: "inactive",
    ageGroup: "teen",
    messages: {
      celebration: "You're 75% through SAT Math - you're so close!",
      encouragement:
        "Taking a break is fine, but momentum matters. Students who practice regularly score 15% higher.",
      cta: "One practice session today would put you over 80%. Ready to finish strong?",
    },
    intensity: "moderate",
  },
  {
    id: "goal-completed-young",
    trigger: "goal_completed",
    ageGroup: "young",
    messages: {
      celebration: "You finished learning fractions! That's AMAZING! 🏆",
      encouragement:
        "Now you're ready for something new! How about we try decimals? They're like fractions' best friends!",
      cta: "Let's start with an easy one! Click here to begin!",
    },
    intensity: "gentle",
  },
  {
    id: "goal-completed-middle",
    trigger: "goal_completed",
    ageGroup: "middle",
    messages: {
      celebration: "Goal crushed! You completed Reading Comprehension! 🎉",
      encouragement:
        "Students who set new goals right away are 3x more likely to keep learning.",
      cta: "Want to add Writing or History next? Choose what interests you!",
    },
    intensity: "moderate",
  },
  {
    id: "goal-completed-teen",
    trigger: "goal_completed",
    ageGroup: "teen",
    messages: {
      celebration:
        "SAT Math complete! That's major progress toward your college goals.",
      encouragement:
        "Since you're on a roll, consider adding College Essays or SAT Reading. Colleges look at the full picture.",
      cta: "Add a complementary subject to strengthen your application?",
    },
    intensity: "moderate",
  },
  {
    id: "low-completion-young",
    trigger: "low_task_completion",
    ageGroup: "young",
    messages: {
      celebration: "You've been working hard on these practice problems!",
      encouragement:
        "Some of them are tricky! That's okay - everyone learns at their own speed.",
      cta: "Want to try an easier one? I can help you build up to the harder stuff!",
    },
    intensity: "gentle",
  },
  {
    id: "streak-broken-middle",
    trigger: "streak_broken",
    ageGroup: "middle",
    messages: {
      celebration: "Your 5-day streak was impressive!",
      encouragement:
        "Streaks break sometimes - that's life! But you can start a new one right now.",
      cta: "Let's get Day 1 of your next streak started! One quick task?",
    },
    intensity: "gentle",
  },
];
```

---

### Message Generation

**Dynamic Message Creation:**

```typescript
// /lib/services/nudgeService.ts
import { churnService } from "./churnService";
import { Student } from "@/types";

export const nudgeService = {
  /**
   * Generate personalized nudge message
   */
  async generateNudge(student: Student): Promise<NudgeMessage | null> {
    // Check if should nudge
    if (!churnService.shouldNudge(student)) {
      return null;
    }

    // Assess risk
    const risk = churnService.assessRisk(student);

    // Determine trigger reason
    const trigger = this.determineTrigger(student, risk);

    // Select appropriate template
    const template = this.selectTemplate(student, trigger, risk);

    // Personalize the message
    const message = await this.personalizeMessage(template, student, risk);

    return message;
  },

  /**
   * Determine primary trigger reason
   */
  determineTrigger(student: Student, risk: ChurnRiskAssessment): ChurnReason {
    // Priority order
    if (risk.reasons.includes("Completed goal, no new goals")) {
      return "goal_completed";
    }
    if (risk.reasons.some((r) => r.includes("No activity"))) {
      return "inactive";
    }
    if (risk.reasons.includes("Lost previous streak")) {
      return "streak_broken";
    }
    if (risk.reasons.includes("Low task completion rate")) {
      return "low_task_completion";
    }
    return "general_encouragement";
  },

  /**
   * Select best template for situation
   */
  selectTemplate(
    student: Student,
    trigger: ChurnReason,
    risk: ChurnRiskAssessment
  ): NudgeTemplate {
    const ageGroup =
      student.age <= 11 ? "young" : student.age <= 14 ? "middle" : "teen";

    // Find matching templates
    const candidates = NUDGE_TEMPLATES.filter(
      (t) => t.trigger === trigger && t.ageGroup === ageGroup
    );

    if (candidates.length === 0) {
      // Fallback to general template
      return this.getGeneralTemplate(ageGroup, risk.level);
    }

    // Select based on intensity
    if (risk.level === ChurnRisk.HIGH) {
      return candidates.find((t) => t.intensity === "urgent") || candidates[0];
    }

    return candidates[0];
  },

  /**
   * Personalize template with student data
   */
  async personalizeMessage(
    template: NudgeTemplate,
    student: Student,
    risk: ChurnRiskAssessment
  ): Promise<NudgeMessage> {
    let celebration = template.messages.celebration;
    let encouragement = template.messages.encouragement;
    let cta = template.messages.cta;

    // Find something specific to celebrate
    const celebrationPoint = this.findCelebrationPoint(student);
    if (celebrationPoint) {
      celebration = celebrationPoint;
    }

    // Personalize with actual data
    celebration = this.replacePlaceholders(celebration, student);
    encouragement = this.replacePlaceholders(encouragement, student);
    cta = this.replacePlaceholders(cta, student);

    return {
      id: generateId(),
      studentId: student.id,
      type: "nudge",
      trigger: template.trigger,
      celebration,
      encouragement,
      cta,
      priority: risk.level,
      createdAt: new Date().toISOString(),
      expiresAt: this.getExpirationTime(),
    };
  },

  /**
   * Find something specific to celebrate
   */
  findCelebrationPoint(student: Student): string | null {
    const points: string[] = [];

    // Check achievements
    if (student.achievements?.length > 0) {
      points.push(
        `You've unlocked ${student.achievements.length} achievement${
          student.achievements.length > 1 ? "s" : ""
        }! 🏆`
      );
    }

    // Check streak
    if (student.streaks?.longest > 0) {
      points.push(
        `Your longest streak was ${student.streaks.longest} days - that's dedication!`
      );
    }

    // Check progress on goals
    const highProgress = student.goals?.find(
      (g) => g.progress >= 50 && g.progress < 100
    );
    if (highProgress) {
      points.push(
        `You're ${highProgress.progress}% done with ${highProgress.subject}! 🎯`
      );
    }

    // Check completed tasks
    const completedTasks =
      student.taskHistory?.filter((t) => t.status === "complete").length || 0;
    if (completedTasks >= 10) {
      points.push(
        `${completedTasks} practice tasks completed! You're putting in the work!`
      );
    }

    // Return random point if any found
    return points.length > 0
      ? points[Math.floor(Math.random() * points.length)]
      : null;
  },

  /**
   * Replace placeholders with student data
   */
  replacePlaceholders(message: string, student: Student): string {
    return message
      .replace(/\{name\}/g, student.name)
      .replace(/\{age\}/g, student.age.toString())
      .replace(/\{grade\}/g, student.grade.toString());
  },

  /**
   * Get expiration time (24 hours from now)
   */
  getExpirationTime(): string {
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);
    return expires.toISOString();
  },

  /**
   * Mark nudge as shown
   */
  async markShown(studentId: string, nudgeId: string): Promise<void> {
    const student = await studentService.getStudentById(studentId);
    if (student) {
      student.metadata = student.metadata || {};
      student.metadata.lastNudgeShown = new Date().toISOString();
      student.metadata.lastNudgeId = nudgeId;
      await studentService.updateStudent(student);
    }
  },

  /**
   * Record nudge interaction
   */
  async recordInteraction(
    nudgeId: string,
    action: "accepted" | "dismissed" | "expired"
  ): Promise<void> {
    // Log for analytics
    console.log("Nudge interaction:", {
      nudgeId,
      action,
      timestamp: new Date().toISOString(),
    });

    // In production, save to database
    // await analyticsService.track('nudge_interaction', { nudgeId, action });
  },
};

// Types
type ChurnReason =
  | "inactive"
  | "goal_completed"
  | "low_task_completion"
  | "streak_broken"
  | "general_encouragement";

interface NudgeMessage {
  id: string;
  studentId: string;
  type: "nudge";
  trigger: ChurnReason;
  celebration: string;
  encouragement: string;
  cta: string;
  priority: ChurnRisk;
  createdAt: string;
  expiresAt: string;
}
```

---

## 🎨 Nudge UI Components

### Popup Design

**Visual Layout:**

```
┌───────────────────────────────┐
│                               │
│      ┌────────┐               │
│      │   😊   │               │
│      └────────┘               │
│    (AI Character)             │
│                               │
│  🎉 You did awesome last      │
│     time!                     │
│                               │
│  We miss you! Your streak     │
│  is about to break.           │
│                               │
│  [Quick 5-min session?]       │
│  [Maybe later]                │
│                               │
│  ✕                            │
└───────────────────────────────┘
```

**Implementation:**

```typescript
// /components/nudge/NudgePopup.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AICharacter from "@/components/common/AICharacter";
import { NudgeMessage } from "@/types";

interface NudgePopupProps {
  nudge: NudgeMessage;
  onAccept: () => void;
  onDismiss: () => void;
}

export default function NudgePopup({
  nudge,
  onAccept,
  onDismiss,
}: NudgePopupProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleAccept = () => {
    setIsClosing(true);
    setTimeout(() => onAccept(), 300);
  };

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => onDismiss(), 300);
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <>
          {/* Backdrop */}
          <motion.div
            className="nudge-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            className="nudge-popup"
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{
              scale: 1,
              rotate: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
              },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
          >
            {/* AI Character */}
            <motion.div
              animate={{
                y: [0, -5, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <AICharacter expression="encouraging" size={80} />
            </motion.div>

            {/* Messages */}
            <div className="nudge-content">
              {nudge.celebration && (
                <p className="nudge-celebration font-hand text-lg">
                  {nudge.celebration}
                </p>
              )}

              <p className="nudge-encouragement font-sketch text-md">
                {nudge.encouragement}
              </p>
            </div>

            {/* Actions */}
            <div className="nudge-actions">
              <motion.button
                className="sketch-button sketch-button--primary"
                onClick={handleAccept}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {nudge.cta}
              </motion.button>

              <button
                className="sketch-button sketch-button--ghost"
                onClick={handleDismiss}
              >
                Maybe later
              </button>
            </div>

            {/* Close button */}
            <button
              className="nudge-close"
              onClick={handleDismiss}
              aria-label="Close"
            >
              ✕
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Styling:**

```css
/* /styles/nudge.css */
.nudge-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9998;
}

.nudge-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;

  width: 400px;
  max-width: 90vw;
  padding: 32px;

  background: white;
  border: 4px solid var(--doodle-sketch);
  border-radius: 20px;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.1), 16px 16px 0px rgba(0, 0, 0, 0.05);

  text-align: center;
}

.nudge-content {
  margin: 24px 0;
}

.nudge-celebration {
  color: var(--doodle-orange);
  font-weight: var(--font-bold);
  margin-bottom: 12px;
}

.nudge-encouragement {
  color: var(--doodle-sketch);
  line-height: var(--leading-relaxed);
}

.nudge-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.nudge-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: 2px solid var(--doodle-sketch);
  border-radius: 50%;
  background: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nudge-close:hover {
  background: var(--doodle-cream);
  transform: rotate(90deg);
}
```

---

### Delivery Timing

**When to Show:**

```typescript
// /hooks/useNudgeSystem.ts
import { useEffect, useState } from "react";
import { nudgeService } from "@/lib/services/nudgeService";
import { useStudent } from "@/contexts/StudentContext";

export function useNudgeSystem() {
  const { student } = useStudent();
  const [currentNudge, setCurrentNudge] = useState<NudgeMessage | null>(null);

  useEffect(() => {
    if (!student) return;

    // Check for nudge on mount (when user logs in/opens app)
    checkForNudge();

    // Check periodically while app is open (every 5 minutes)
    const interval = setInterval(checkForNudge, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [student]);

  const checkForNudge = async () => {
    if (!student) return;

    const nudge = await nudgeService.generateNudge(student);

    if (nudge) {
      setCurrentNudge(nudge);
      await nudgeService.markShown(student.id, nudge.id);
    }
  };

  const acceptNudge = async () => {
    if (currentNudge) {
      await nudgeService.recordInteraction(currentNudge.id, "accepted");

      // Redirect to appropriate action
      // e.g., open task, start chat, etc.
      handleNudgeAction(currentNudge);

      setCurrentNudge(null);
    }
  };

  const dismissNudge = async () => {
    if (currentNudge) {
      await nudgeService.recordInteraction(currentNudge.id, "dismissed");
      setCurrentNudge(null);
    }
  };

  return {
    currentNudge,
    acceptNudge,
    dismissNudge,
  };
}

function handleNudgeAction(nudge: NudgeMessage) {
  switch (nudge.trigger) {
    case "goal_completed":
      window.location.href = "/goals/add";
      break;
    case "low_task_completion":
      window.location.href = "/tasks?difficulty=easy";
      break;
    case "inactive":
    case "streak_broken":
    default:
      window.location.href = "/dashboard";
      break;
  }
}
```

**Usage in Layout:**

```typescript
// /app/layout.tsx
import { useNudgeSystem } from "@/hooks/useNudgeSystem";
import NudgePopup from "@/components/nudge/NudgePopup";

export default function RootLayout({ children }) {
  const { currentNudge, acceptNudge, dismissNudge } = useNudgeSystem();

  return (
    <html lang="en">
      <body>
        {children}

        {/* Nudge System */}
        {currentNudge && (
          <NudgePopup
            nudge={currentNudge}
            onAccept={acceptNudge}
            onDismiss={dismissNudge}
          />
        )}
      </body>
    </html>
  );
}
```

---

## 📧 Simulated Notifications

**Browser Notification Simulation:**

```typescript
// /lib/services/notificationService.ts
export const notificationService = {
  /**
   * Show simulated notification
   * In production, use real browser Notification API
   */
  showNotification(title: string, message: string, icon?: string) {
    // For Phase 1, show as toast
    this.showToast(title, message, icon);

    // In Phase 2, use real notifications:
    // if ('Notification' in window && Notification.permission === 'granted') {
    //   new Notification(title, { body: message, icon });
    // }
  },

  /**
   * Show toast notification
   */
  showToast(title: string, message: string, icon?: string) {
    const toast = document.createElement("div");
    toast.className = "notification-toast";
    toast.innerHTML = `
      <div class="toast-content">
        ${icon ? `<span class="toast-icon">${icon}</span>` : ""}
        <div class="toast-text">
          <strong>${title}</strong>
          <p>${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add("show"), 100);

    // Remove after 5 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  },

  /**
   * Request notification permission (for Phase 2)
   */
  async requestPermission(): Promise<boolean> {
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
  },
};
```

**Toast Styling:**

```css
.notification-toast {
  position: fixed;
  bottom: -100px;
  right: 20px;
  z-index: 10000;

  padding: 16px 20px;
  background: white;
  border: 3px solid var(--doodle-sketch);
  border-radius: 12px;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1);

  transition: bottom 0.3s var(--ease-bounce);
}

.notification-toast.show {
  bottom: 20px;
}

.toast-content {
  display: flex;
  gap: 12px;
  align-items: center;
}

.toast-icon {
  font-size: 32px;
  line-height: 1;
}

.toast-text strong {
  font-family: var(--font-hand);
  font-size: var(--text-md);
  color: var(--doodle-sketch);
  display: block;
  margin-bottom: 4px;
}

.toast-text p {
  font-family: var(--font-sketch);
  font-size: var(--text-sm);
  color: var(--doodle-sketch);
  opacity: 0.8;
  margin: 0;
}
```

---

## 📊 Analytics & Optimization

### Tracking Metrics

```typescript
interface NudgeMetrics {
  nudgeId: string;
  studentId: string;
  trigger: ChurnReason;
  riskLevel: ChurnRisk;

  shown: boolean;
  shownAt?: string;

  interaction?: "accepted" | "dismissed" | "expired";
  interactedAt?: string;

  timeTakenToDecide?: number; // seconds

  // Outcome tracking
  returnedWithin24h?: boolean;
  completedTask?: boolean;
  setNewGoal?: boolean;
}
```

**Measuring Effectiveness:**

```typescript
export const nudgeAnalytics = {
  /**
   * Calculate nudge effectiveness
   */
  async getEffectiveness(timeframe: "week" | "month"): Promise<NudgeStats> {
    // In production, query from database
    const metrics = await this.getNudgeMetrics(timeframe);

    const total = metrics.length;
    const accepted = metrics.filter((m) => m.interaction === "accepted").length;
    const dismissed = metrics.filter(
      (m) => m.interaction === "dismissed"
    ).length;
    const expired = metrics.filter((m) => m.interaction === "expired").length;

    const returned = metrics.filter((m) => m.returnedWithin24h).length;
    const completed = metrics.filter((m) => m.completedTask).length;

    return {
      total,
      acceptanceRate: (accepted / total) * 100,
      dismissalRate: (dismissed / total) * 100,
      returnRate: (returned / total) * 100,
      taskCompletionRate: (completed / accepted) * 100,
      avgTimeToDecide: this.calculateAverage(
        metrics.map((m) => m.timeTakenToDecide || 0)
      ),
    };
  },

  /**
   * A/B test different nudge strategies
   */
  async runABTest(variant: "A" | "B", student: Student): Promise<NudgeMessage> {
    // Variant A: Celebrate-first (current)
    // Variant B: Urgency-first (testing)

    if (variant === "B") {
      return await this.generateUrgencyFirstNudge(student);
    }

    return await nudgeService.generateNudge(student);
  },
};
```

---

## ✅ Acceptance Criteria

### Churn Detection

- [ ] Risk assessment calculates score correctly
- [ ] High risk: >60 score
- [ ] Medium risk: 35-60 score
- [ ] Low risk: 15-35 score
- [ ] None: <15 score
- [ ] All 5 primary indicators checked
- [ ] Reasons array populated accurately
- [ ] Interventions suggested appropriately

### Nudge System

- [ ] Nudge generation works for all trigger types
- [ ] Age-appropriate templates selected
- [ ] Celebrate-first structure maintained
- [ ] Personalization replaces placeholders
- [ ] Celebration points found automatically
- [ ] Template selection matches risk level
- [ ] Messages are encouraging, not shaming

### Frequency Control

- [ ] Maximum 1 nudge per 24 hours enforced
- [ ] Last nudge timestamp saved correctly
- [ ] No duplicate nudges for same trigger
- [ ] Expired nudges don't re-appear

### UI Components

- [ ] Popup displays with smooth animation
- [ ] AI character shows "encouraging" expression
- [ ] Backdrop dims screen appropriately
- [ ] Accept button redirects to correct action
- [ ] Dismiss button closes popup
- [ ] Close X button works
- [ ] Popup responsive on mobile
- [ ] z-index ensures popup always on top

### Interactions

- [ ] Accept action triggers appropriate next step
- [ ] Dismiss action records interaction
- [ ] Interaction timestamps logged
- [ ] Student returns to task/goal appropriately
- [ ] Analytics track all nudge events

### Notifications

- [ ] Toast notifications appear correctly
- [ ] Notifications auto-dismiss after 5 seconds
- [ ] Multiple notifications stack properly
- [ ] Notification permission can be requested

### Effectiveness

- [ ] Churn rate decreases for nudged students
- [ ] At least 30% acceptance rate
- [ ] Returned-within-24h rate >40%
- [ ] Task completion after nudge >50%

---

## 📚 Related Documents

**Shard Navigation:**

- **← Previous:** Shard 5 (AI Integration)
- **→ Next:** Shard 7 (Social & Tutor)

**Related Shards:**

- Shard 1: Overview (success metrics)
- Shard 4: Achievements (motivation connection)
- Shard 5: AI Integration (struggle detection)
- Shard 10: Implementation Roadmap (Week 2, Day 7)

---

**End of Retention Features Shard**
