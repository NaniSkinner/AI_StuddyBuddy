# 🏆 AI Study Companion - Achievements & Gamification

**PRD v3 - Shard 4 of 12**

---

## 📖 Overview

This document specifies the Achievement and Gamification systems - critical features for student motivation and retention. These systems turn learning into a rewarding, game-like experience.

**Achievement System:** Badge-based rewards for milestones  
**Streak System:** Daily engagement tracking  
**Gamification Philosophy:** Celebrate effort, not just outcomes

---

## 🎯 Achievement System

### Design Philosophy

**Goals:**

- Celebrate small wins to build confidence
- Encourage consistent practice
- Make progress visible and rewarding
- Create memorable moments

**Principles:**

- Badges reward effort AND achievement
- Multiple paths to earn badges (inclusive)
- Immediate feedback (unlock within 2 seconds)
- Visual celebrations (animations, confetti)
- Age-appropriate rewards

---

## 🏅 Achievement Badge Definitions

### Complete Badge List

| Badge | Name             | Icon           | Trigger                            | Points | Rarity   | Description            |
| ----- | ---------------- | -------------- | ---------------------------------- | ------ | -------- | ---------------------- |
| 🎯    | First Steps      | Target         | Complete first conversation        | 10     | Common   | Welcome to learning!   |
| 🔥    | 3-Day Streak     | Fire           | Study 3 consecutive days           | 20     | Common   | Consistency is key!    |
| 📅    | Week Warrior     | Calendar       | Study 7 consecutive days           | 50     | Uncommon | A whole week! Amazing! |
| 🎓    | Topic Master     | Grad Cap       | Reach 90% on any topic             | 30     | Uncommon | You've mastered this!  |
| ❓    | Curious Mind     | Lightbulb      | Ask 10 questions                   | 15     | Common   | Never stop wondering!  |
| 🤝    | Social Butterfly | Two People     | Send 5 friend messages             | 15     | Common   | Learning together!     |
| 🏆    | Streak Breaker   | Trophy         | Beat previous longest streak       | 40     | Rare     | New personal record!   |
| 📚    | Bookworm         | Stack of Books | Complete 20 tasks                  | 25     | Uncommon | You're on a roll!      |
| ⭐    | Star Student     | Star           | Get 5 tasks correct in a row       | 20     | Common   | Perfection!            |
| 💪    | Practice Pro     | Flexed Bicep   | Practice 30 minutes in one session | 30     | Uncommon | Dedication!            |
| 🎨    | Creative Thinker | Palette        | Complete 5 open-ended tasks        | 25     | Uncommon | Great ideas!           |
| 🚀    | Goal Getter      | Rocket         | Complete a learning goal           | 50     | Rare     | You did it!            |

### Badge Rarity System

```typescript
enum BadgeRarity {
  COMMON = "common", // Easy to earn, frequent
  UNCOMMON = "uncommon", // Requires effort
  RARE = "rare", // Major achievements
  LEGENDARY = "legendary", // Future: special events
}

const RARITY_COLORS = {
  common: "#7FD8BE", // Green
  uncommon: "#6FB1FC", // Blue
  rare: "#A685E2", // Purple
  legendary: "#FFE66D", // Gold
};
```

---

## 🎨 Badge UI Design

### Badge Card States

**Locked State:**

```css
.achievement-locked {
  position: relative;
  width: 120px;
  height: 140px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px dashed var(--doodle-sketch);
  border-radius: 12px;
  text-align: center;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.achievement-locked:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.achievement-locked::before {
  content: "🔒";
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.achievement-locked .badge-icon {
  font-size: 48px;
  filter: grayscale(100%) brightness(1.2);
  opacity: 0.5;
}

.achievement-locked .badge-name {
  font-family: var(--font-sketch);
  font-size: var(--text-sm);
  color: var(--doodle-sketch);
  opacity: 0.5;
  margin-top: 8px;
}
```

**Unlocked State:**

```css
.achievement-unlocked {
  position: relative;
  width: 120px;
  height: 140px;
  padding: 16px;
  background: linear-gradient(
    145deg,
    var(--rarity-color),
    var(--rarity-color-light)
  );
  border: 3px solid var(--doodle-sketch);
  border-radius: 12px;
  text-align: center;
  transform: rotate(-2deg);
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s var(--ease-bounce);
}

.achievement-unlocked:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.15);
}

.achievement-unlocked .badge-icon {
  font-size: 48px;
  line-height: 1;
  display: block;
  margin-bottom: 8px;
  animation: float 3s ease-in-out infinite;
}

.achievement-unlocked .badge-name {
  font-family: var(--font-hand);
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  color: var(--doodle-sketch);
}

.achievement-unlocked .badge-points {
  font-family: var(--font-sketch);
  font-size: var(--text-xs);
  color: var(--doodle-sketch);
  opacity: 0.7;
  margin-top: 4px;
}

/* Rarity indicator */
.achievement-unlocked::after {
  content: "";
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: var(--rarity-color);
  border: 2px solid var(--doodle-sketch);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--rarity-color);
}
```

**Recently Unlocked (Glow Effect):**

```css
.achievement-unlocked.recently-unlocked {
  animation: pulse-glow 2s ease-in-out;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1), 0 0 20px var(--rarity-color),
      0 0 40px var(--rarity-color);
  }
}
```

---

## 🎬 Unlock Animation

### Animation Sequence

**Phase 1: Scale Up (0-400ms)**

```typescript
export const achievementUnlockVariant = {
  initial: {
    scale: 0,
    rotate: -180,
    opacity: 0,
  },
  animate: {
    scale: [0, 1.2, 0.9, 1.05, 1],
    rotate: [-180, 0, 5, -5, 0],
    opacity: [0, 1, 1, 1, 1],
    transition: {
      duration: 1.2,
      times: [0, 0.4, 0.6, 0.8, 1],
      ease: "easeOut",
    },
  },
};
```

**Phase 2: Confetti Burst**

```typescript
export const confettiVariant = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: [0, 1, 1],
    opacity: [0, 1, 0],
    x: Math.cos((i * (360 / 20) * Math.PI) / 180) * 100,
    y: Math.sin((i * (360 / 20) * Math.PI) / 180) * 100,
    rotate: Math.random() * 360,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  }),
};
```

**Phase 3: Settle (400-1200ms)**

- Badge settles into collection
- Glow effect pulses 2 times
- Points counter animates up

---

## 📱 Badge Collection UI

### Layout

```
┌──────────────────────────────────────┐
│  🏆 Your Achievements                │
│  Progress: 3/12 badges unlocked      │
│                                      │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │🎯│ │🔥│ │🔒│ │🔒│  Common       │
│  └──┘ └──┘ └──┘ └──┘               │
│                                      │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │🔒│ │🔒│ │🔒│ │🔒│  Uncommon     │
│  └──┘ └──┘ └──┘ └──┘               │
│                                      │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │🔒│ │🔒│ │🔒│ │🔒│  Rare         │
│  └──┘ └──┘ └──┘ └──┘               │
│                                      │
│  Total Points: 45 🌟                 │
└──────────────────────────────────────┘
```

### Implementation

```typescript
// /components/achievements/BadgeCollection.tsx
"use client";

import { motion } from "framer-motion";
import { Student, Achievement } from "@/types";
import BadgeCard from "./BadgeCard";
import { achievementService } from "@/lib/services/achievementService";

interface BadgeCollectionProps {
  student: Student;
}

export default function BadgeCollection({ student }: BadgeCollectionProps) {
  const allBadges = achievementService.getAllAchievements();
  const unlockedIds = student.achievements || [];

  const groupedByRarity = {
    common: allBadges.filter((b) => b.rarity === "common"),
    uncommon: allBadges.filter((b) => b.rarity === "uncommon"),
    rare: allBadges.filter((b) => b.rarity === "rare"),
  };

  const totalPoints = unlockedIds.reduce((sum, id) => {
    const badge = allBadges.find((b) => b.id === id);
    return sum + (badge?.points || 0);
  }, 0);

  return (
    <div className="badge-collection">
      <div className="collection-header">
        <h2 className="font-hand text-h2">🏆 Your Achievements</h2>
        <p className="font-sketch text-md">
          Progress: {unlockedIds.length}/{allBadges.length} badges unlocked
        </p>
      </div>

      {Object.entries(groupedByRarity).map(([rarity, badges]) => (
        <div key={rarity} className="badge-group">
          <h3 className="font-sketch text-h4 capitalize">{rarity}</h3>
          <div className="badge-grid">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={unlockedIds.includes(badge.id)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="total-points">
        <span className="font-hand text-h3">
          Total Points: {totalPoints} 🌟
        </span>
      </div>
    </div>
  );
}
```

---

## 🎉 Unlock Notification Toast

### Design

```
┌───────────────────────────────┐
│  🎉 Achievement Unlocked!     │
│                               │
│      ┌────────┐               │
│      │   🎯   │               │
│      └────────┘               │
│     First Steps               │
│          +10                  │
│                               │
│  You completed your first     │
│  conversation! Keep it up!    │
│                               │
│         [Awesome!]            │
└───────────────────────────────┘
```

### Implementation

```typescript
// /components/achievements/UnlockNotification.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Achievement } from "@/types";
import Confetti from "./Confetti";

interface UnlockNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function UnlockNotification({
  achievement,
  onClose,
}: UnlockNotificationProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="unlock-notification-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="unlock-notification"
          initial={{ scale: 0, rotate: -10 }}
          animate={{
            scale: [0, 1.1, 0.95, 1],
            rotate: [-10, 5, -5, 0],
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 0.8,
            times: [0, 0.5, 0.7, 1],
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti Effect */}
          <Confetti count={20} />

          {/* Header */}
          <h3 className="font-hand text-h3">🎉 Achievement Unlocked!</h3>

          {/* Badge Display */}
          <motion.div
            className="badge-showcase"
            animate={achievementUnlockVariant.animate}
          >
            <span className="badge-icon-large">{achievement.icon}</span>
            <span className="badge-name-large">{achievement.name}</span>
            <span className="badge-points-large">+{achievement.points}</span>
          </motion.div>

          {/* Description */}
          <p className="font-sketch text-md achievement-description">
            {achievement.description}
          </p>

          {/* Close Button */}
          <motion.button
            className="sketch-button sketch-button--primary"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Awesome!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

**Styling:**

```css
.unlock-notification-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.unlock-notification {
  position: relative;
  width: 400px;
  max-width: 90vw;
  padding: 40px;
  background: white;
  border: 4px solid var(--doodle-sketch);
  border-radius: 24px;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.1), 16px 16px 0px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.badge-showcase {
  margin: 32px 0;
}

.badge-icon-large {
  font-size: 80px;
  line-height: 1;
  display: block;
  margin-bottom: 16px;
}

.badge-name-large {
  font-family: var(--font-hand);
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  color: var(--doodle-sketch);
  display: block;
  margin-bottom: 8px;
}

.badge-points-large {
  font-family: var(--font-sketch);
  font-size: var(--text-lg);
  color: var(--doodle-green);
  font-weight: var(--font-bold);
}

.achievement-description {
  margin: 24px 0;
  color: var(--doodle-sketch);
  opacity: 0.8;
}
```

---

## 🔥 Streak System

### Dual Tracking

**Two Streak Types:**

1. **Login Streak** - Consecutive days accessing app
2. **Practice Streak** - Consecutive days completing tasks

**Why Both:**

- Login streak: Lower barrier, builds habit
- Practice streak: Rewards actual learning
- Students can maintain one even if they miss the other

### Data Model

```typescript
interface StreakData {
  login: {
    current: number;
    longest: number;
    lastDate: string; // ISO date string
  };
  practice: {
    current: number;
    longest: number;
    lastDate: string;
  };
}
```

---

### Streak Counter UI

**Top Bar Display:**

```
┌────────────────────┐
│  🔥 3 Day Streak   │
│  Keep it going!    │
└────────────────────┘
```

**Design Specifications:**

```css
.streak-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(
    135deg,
    var(--doodle-orange),
    var(--doodle-yellow)
  );
  border: 2px solid var(--doodle-sketch);
  border-radius: 20px;
  font-family: var(--font-hand);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--doodle-sketch);
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  transform: rotate(-1deg);
  cursor: pointer;
  transition: all 0.3s var(--ease-bounce);
}

.streak-counter:hover {
  transform: rotate(0deg) scale(1.05);
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.15);
}

.streak-fire {
  font-size: 24px;
  animation: flicker 1.5s ease-in-out infinite;
}

@keyframes flicker {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
    filter: brightness(1.2);
  }
  75% {
    transform: scale(1.1) rotate(5deg);
    filter: brightness(1.2);
  }
}
```

---

### Streak Detail Modal

**Click streak counter to open:**

```
┌──────────────────────────────────────┐
│  🔥 Your Streaks                     │
│                                      │
│  Login Streak                        │
│  Current: 5 days                     │
│  🔥 🔥 🔥 🔥 🔥 ⚪ ⚪               │
│                                      │
│  Practice Streak                     │
│  Current: 3 days                     │
│  🔥 🔥 🔥 ⚪ ⚪ ⚪ ⚪               │
│                                      │
│  ─────────────────                   │
│                                      │
│  Longest Streak: 8 days              │
│  Beat it by studying 4 more days!    │
│                                      │
│  [Keep Going! 💪]                   │
└──────────────────────────────────────┘
```

**Implementation:**

```typescript
// /components/streaks/StreakDetail.tsx
"use client";

import { motion } from "framer-motion";
import { Student } from "@/types";

interface StreakDetailProps {
  student: Student;
  onClose: () => void;
}

export default function StreakDetail({ student, onClose }: StreakDetailProps) {
  const { login, practice } = student.streaks;
  const longestStreak = Math.max(login.longest, practice.longest);

  const renderStreakDots = (current: number, max: number = 7) => {
    return Array.from({ length: max }).map((_, i) => (
      <span
        key={i}
        className={`streak-dot ${i < current ? "active" : "inactive"}`}
      >
        {i < current ? "🔥" : "⚪"}
      </span>
    ));
  };

  const daysToRecord =
    longestStreak - Math.max(login.current, practice.current);

  return (
    <motion.div
      className="streak-modal"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <h2 className="font-hand text-h2">🔥 Your Streaks</h2>

      {/* Login Streak */}
      <div className="streak-section">
        <h3 className="font-sketch text-h4">Login Streak</h3>
        <p className="streak-current">Current: {login.current} days</p>
        <div className="streak-dots">{renderStreakDots(login.current)}</div>
      </div>

      {/* Practice Streak */}
      <div className="streak-section">
        <h3 className="font-sketch text-h4">Practice Streak</h3>
        <p className="streak-current">Current: {practice.current} days</p>
        <div className="streak-dots">{renderStreakDots(practice.current)}</div>
      </div>

      <div className="streak-divider" />

      {/* Longest Streak Challenge */}
      <div className="longest-streak">
        <p className="font-sketch text-md">
          Longest Streak: <strong>{longestStreak} days</strong>
        </p>
        {daysToRecord > 0 ? (
          <p className="streak-challenge">
            Beat it by studying {daysToRecord} more days! 🏆
          </p>
        ) : login.current === longestStreak ||
          practice.current === longestStreak ? (
          <p className="streak-celebration">
            New record! You're unstoppable! 🚀
          </p>
        ) : (
          <p className="streak-challenge">
            You're {daysToRecord * -1} days ahead of your record! 🎉
          </p>
        )}
      </div>

      <button
        className="sketch-button sketch-button--primary"
        onClick={onClose}
      >
        Keep Going! 💪
      </button>
    </motion.div>
  );
}
```

---

### Milestone Celebrations

**Automatic Triggers:**

| Milestone | Display                | Effect                       |
| --------- | ---------------------- | ---------------------------- |
| Day 3     | "🔥 3-Day Streak!"     | Achievement badge + confetti |
| Day 7     | "🎉 One Week!"         | Animated confetti + sound    |
| Day 14    | "⭐ Two Weeks Strong!" | Badge upgrade visual         |
| Day 30    | "🏆 30-Day Legend!"    | Special animation + title    |

**Implementation:**

```typescript
// /lib/services/streakService.ts
const MILESTONE_CELEBRATIONS = {
  3: {
    message: "🔥 3-Day Streak!",
    achievement: "3-day-streak",
    confetti: true,
  },
  7: {
    message: "🎉 One Week!",
    achievement: "week-warrior",
    confetti: true,
    sound: "celebration.mp3",
  },
  14: {
    message: "⭐ Two Weeks Strong!",
    confetti: true,
    badgeUpgrade: true,
  },
  30: {
    message: "🏆 30-Day Legend!",
    achievement: "30-day-legend",
    confetti: true,
    sound: "epic-win.mp3",
    specialAnimation: "epic-celebration",
  },
};

export const checkStreakMilestone = (streak: number): Celebration | null => {
  return MILESTONE_CELEBRATIONS[streak] || null;
};
```

---

## 🔧 Achievement Service Implementation

### Core Service

```typescript
// /lib/services/achievementService.ts
import { Student, Achievement, UserEvent } from "@/types";

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    icon: "🎯",
    description: "Complete your first conversation",
    trigger: "conversation_complete",
    condition: (student) => student.sessions.length === 1,
    points: 10,
    rarity: "common",
  },
  {
    id: "3-day-streak",
    name: "3-Day Streak",
    icon: "🔥",
    description: "Study 3 consecutive days",
    trigger: "streak_update",
    condition: (student) => {
      return (
        student.streaks.login.current >= 3 ||
        student.streaks.practice.current >= 3
      );
    },
    points: 20,
    rarity: "common",
  },
  {
    id: "topic-master",
    name: "Topic Master",
    icon: "🎓",
    description: "Reach 90% on any topic",
    trigger: "progress_update",
    condition: (student) => {
      return student.goals.some((goal) =>
        goal.topics.some((topic) => topic.progress >= 90)
      );
    },
    points: 30,
    rarity: "uncommon",
  },
  {
    id: "curious-mind",
    name: "Curious Mind",
    icon: "❓",
    description: "Ask 10 questions",
    trigger: "question_asked",
    condition: (student) => {
      const questionCount =
        student.conversations?.filter(
          (msg) => msg.speaker === "student" && msg.message.includes("?")
        ).length || 0;
      return questionCount >= 10;
    },
    points: 15,
    rarity: "common",
  },
  // ... more achievements
];

export const achievementService = {
  /**
   * Get all achievement definitions
   */
  getAllAchievements: (): Achievement[] => {
    return ACHIEVEMENTS;
  },

  /**
   * Check if student has unlocked an achievement
   */
  hasAchievement: (student: Student, achievementId: string): boolean => {
    return student.achievements?.includes(achievementId) || false;
  },

  /**
   * Check triggers for a specific event
   */
  checkTriggers: (student: Student, event: UserEvent): Achievement[] => {
    const unlocked: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (achievementService.hasAchievement(student, achievement.id)) {
        continue;
      }

      // Check if event matches trigger
      if (achievement.trigger !== event.type) {
        continue;
      }

      // Check condition
      if (achievement.condition(student)) {
        unlocked.push(achievement);
      }
    }

    return unlocked;
  },

  /**
   * Unlock an achievement for a student
   */
  unlockAchievement: async (
    studentId: string,
    achievementId: string
  ): Promise<void> => {
    const student = await studentService.getStudentById(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    // Add achievement if not already unlocked
    if (!student.achievements) {
      student.achievements = [];
    }

    if (!student.achievements.includes(achievementId)) {
      student.achievements.push(achievementId);

      // Save to student profile
      await studentService.updateStudent(student);

      // Trigger unlock notification
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (achievement) {
        notificationService.showAchievementUnlock(achievement);
      }
    }
  },

  /**
   * Get progress toward an achievement
   */
  getProgress: (student: Student, achievementId: string): number => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);

    if (!achievement) return 0;
    if (achievementService.hasAchievement(student, achievementId)) return 100;

    // Custom progress calculation per achievement
    switch (achievementId) {
      case "curious-mind":
        const questionCount =
          student.conversations?.filter(
            (msg) => msg.speaker === "student" && msg.message.includes("?")
          ).length || 0;
        return Math.min(100, (questionCount / 10) * 100);

      case "bookworm":
        const completedTasks =
          student.taskHistory?.filter((t) => t.status === "complete").length ||
          0;
        return Math.min(100, (completedTasks / 20) * 100);

      default:
        return 0;
    }
  },

  /**
   * Get unlocked achievements for a student
   */
  getUnlockedAchievements: (student: Student): Achievement[] => {
    return ACHIEVEMENTS.filter((achievement) =>
      student.achievements?.includes(achievement.id)
    );
  },
};
```

---

### Event Hooks Integration

**Hook achievements into existing events:**

```typescript
// /lib/hooks/useAchievements.ts
import { useEffect } from "react";
import { achievementService } from "@/lib/services/achievementService";
import { useStudent } from "@/contexts/StudentContext";

export function useAchievements() {
  const { student, updateStudent } = useStudent();

  const checkAchievements = async (eventType: string) => {
    if (!student) return;

    const unlocked = achievementService.checkTriggers(student, {
      type: eventType,
      timestamp: new Date().toISOString(),
    });

    for (const achievement of unlocked) {
      await achievementService.unlockAchievement(student.id, achievement.id);
    }
  };

  return { checkAchievements };
}

// Usage in components:
const { checkAchievements } = useAchievements();

// After conversation completes
onConversationComplete(() => {
  checkAchievements("conversation_complete");
});

// After task completes
onTaskComplete(() => {
  checkAchievements("task_complete");
});

// After streak updates
onStreakUpdate(() => {
  checkAchievements("streak_update");
});
```

---

## 🎮 Gamification Best Practices

### Do's ✅

**Celebrate Effort:**

- Reward attempts, not just success
- "Practice Pro" for time spent, not accuracy
- Multiple paths to earn badges

**Immediate Feedback:**

- Unlock within 2 seconds of trigger
- Visual + auditory celebration
- Clear connection between action and reward

**Age-Appropriate:**

- Younger students: More frequent rewards
- Older students: Bigger challenges
- All ages: Clear progress visibility

**Meaningful Rewards:**

- Each badge tells a story
- Points lead to visible progress
- Achievements unlock new features (future)

### Don'ts ❌

**Avoid Punishment:**

- Never take away badges
- Don't penalize failed attempts
- Broken streaks → encouragement, not shame

**Prevent Overwhelm:**

- Limit notifications (max 1 achievement at a time)
- Don't flood with too many unlocks
- Space out milestone celebrations

**No Comparison:**

- No public leaderboards (privacy)
- Individual progress only
- Friends see activity, not rankings

**Keep It Simple:**

- Clear badge requirements
- Easy to understand progress
- No complex point systems

---

## ✅ Acceptance Criteria

### Achievement System

- [ ] All 12 achievement badges defined in data
- [ ] Trigger logic works for each achievement
- [ ] Unlock animation plays smoothly (60fps)
- [ ] Badge collection grid displays correctly
- [ ] Locked badges show as grayed with padlock
- [ ] Unlocked badges show with correct rarity color
- [ ] Achievement notification appears on unlock
- [ ] Confetti animation triggers on major achievements
- [ ] Progress tracking shows X/12 achievements
- [ ] Clicking badge shows detailed info modal
- [ ] Points accumulate correctly
- [ ] Multiple unlocks queue properly (don't overlap)

### Streak System

- [ ] Login streak tracks correctly
- [ ] Practice streak tracks correctly
- [ ] Streak counter displays in top bar
- [ ] Fire emoji animates with flicker effect
- [ ] Clicking counter opens detail modal
- [ ] Detail modal shows both streak types
- [ ] Visual dots represent current streak (7 days shown)
- [ ] Longest streak displays correctly
- [ ] Challenge message updates based on progress
- [ ] Milestone celebrations trigger at 3, 7, 14, 30 days
- [ ] Broken streaks show recovery encouragement
- [ ] Achievements unlock at correct milestones

### Integration

- [ ] Achievements trigger from all event types
- [ ] No duplicate unlocks
- [ ] Performance: No lag when checking triggers
- [ ] Persistence: Unlocks save to student profile
- [ ] UI updates immediately after unlock
- [ ] Works across all 4 student personas
- [ ] Age-appropriate celebration intensity

---

## 📚 Related Documents

**Shard Navigation:**

- **← Previous:** Shard 3 (Authentication & Onboarding)
- **→ Next:** Shard 5 (AI Integration)

**Related Shards:**

- Shard 2: Design System (animation specs)
- Shard 6: Retention Features (motivation connection)
- Shard 10: Implementation Roadmap (Week 1, Day 3)

---

**End of Achievements & Gamification Shard**
