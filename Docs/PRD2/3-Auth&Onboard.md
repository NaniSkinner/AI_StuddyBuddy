# 🔐 AI Study Companion - Authentication & Onboarding

**PRD v3 - Shard 3 of 12**

---

## 📖 Overview

This document specifies the Authentication and Onboarding systems - two critical features missing from Phase 1 that must be implemented in Phase 2.

**Authentication:** Simple login against mock student data  
**Onboarding:** First-time user experience (FTUE) with 4 steps

---

## 🔐 Authentication System

### Requirements

**Phase 1 (Current Implementation):**

- Simple authentication against mock student data
- No external auth service required
- Student selection interface
- Session persistence via localStorage
- Logout functionality

**Phase 3 (Future):**

- Real authentication (Firebase Auth, Auth0, Clerk)
- Email/password or social login
- Parent/tutor accounts
- Role-based access control

---

###

Login Screen Design

**Layout:**

```
┌─────────────────────────────────────────┐
│                                         │
│         ┌─────────┐                     │
│         │  🧠     │                     │
│         └─────────┘                     │
│     AI Study Companion                  │
│                                         │
│  Welcome! Let's get learning! 🚀        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Choose your profile:           │   │
│  │                                 │   │
│  │  ┌────────┐  ┌────────┐        │   │
│  │  │  👦    │  │  👧    │        │   │
│  │  │ Lucas  │  │  Eva   │        │   │
│  │  │ 🔥 3   │  │ 🔥 5   │        │   │
│  │  └────────┘  └────────┘        │   │
│  │                                 │   │
│  │  ┌────────┐  ┌────────┐        │   │
│  │  │  🎓    │  │  📚    │        │   │
│  │  │  Pat   │  │  Mia   │        │   │
│  │  │ 🔥 7   │  │ 🔥 2⚠️ │        │   │
│  │  └────────┘  └────────┘        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Or enter your name: [____________]    │
│          [Start Learning!]             │
└─────────────────────────────────────────┘
```

**Design Specifications:**

```css
/* Login Screen */
.login-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  background: var(--doodle-cream);
  background-image: url("/assets/patterns/paper-texture.png"),
    repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(
          45,
          45,
          45,
          0.02
        ) 50px, rgba(45, 45, 45, 0.02) 51px);
}

/* Title */
.login-title {
  font-family: var(--font-hand);
  font-size: var(--text-h1);
  font-weight: var(--font-bold);
  color: var(--doodle-sketch);
  margin-bottom: 8px;
  transform: rotate(-2deg);
}

/* Subtitle */
.login-subtitle {
  font-family: var(--font-sketch);
  font-size: var(--text-lg);
  color: var(--doodle-sketch);
  margin-bottom: 40px;
}

/* Student Grid */
.student-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 32px 0;
  max-width: 500px;
}

@media (max-width: 768px) {
  .student-grid {
    grid-template-columns: 1fr;
  }
}
```

**Student Card Component:**

```css
.student-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: white;
  border: 3px solid var(--doodle-sketch);
  border-radius: 16px;
  cursor: pointer;
  transform: rotate(calc(var(--rotation) * 1deg));
  transition: all 0.3s var(--ease-bounce);
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1);
}

/* Random rotation for each card */
.student-card:nth-child(1) {
  --rotation: -2;
}
.student-card:nth-child(2) {
  --rotation: 1;
}
.student-card:nth-child(3) {
  --rotation: 2;
}
.student-card:nth-child(4) {
  --rotation: -1;
}

.student-card:hover {
  transform: rotate(0deg) translateY(-8px) scale(1.05);
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.15);
}

/* Churn risk indicator */
.student-card--at-risk::after {
  content: "⚠️";
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 24px;
  animation: wiggle 2s ease-in-out infinite;
}

/* Avatar */
.student-avatar {
  font-size: 48px;
  line-height: 1;
}

/* Name */
.student-name {
  font-family: var(--font-hand);
  font-size: var(--text-h4);
  font-weight: var(--font-bold);
  color: var(--doodle-sketch);
}

/* Streak */
.student-streak {
  font-family: var(--font-sketch);
  font-size: var(--text-sm);
  color: var(--doodle-orange);
}
```

---

### Implementation

**Component Structure:**

```
/app/login/
  page.tsx          # Main login page
/components/auth/
  StudentSelector.tsx
  StudentCard.tsx
  LoginForm.tsx
/lib/services/
  authService.ts
```

**authService.ts:**

```typescript
// /lib/services/authService.ts
import { Student } from "@/types";

const STORAGE_KEY = "currentStudentId";

export const authService = {
  /**
   * Authenticate a student by ID
   */
  login: async (studentId: string): Promise<Student> => {
    // Load student data from mock JSON
    const student = await studentService.getStudentById(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    // Store session
    localStorage.setItem(STORAGE_KEY, studentId);

    // Update last login time
    student.lastLoginAt = new Date().toISOString();
    await studentService.updateStudent(student);

    return student;
  },

  /**
   * Logout current student
   */
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = "/login";
  },

  /**
   * Get current authenticated student
   */
  getCurrentStudent: async (): Promise<Student | null> => {
    const studentId = localStorage.getItem(STORAGE_KEY);

    if (!studentId) {
      return null;
    }

    return await studentService.getStudentById(studentId);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  /**
   * Validate session
   */
  validateSession: async (): Promise<boolean> => {
    const student = await authService.getCurrentStudent();
    return student !== null;
  },
};
```

**StudentSelector Component:**

```typescript
// /components/auth/StudentSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Student } from "@/types";
import StudentCard from "./StudentCard";
import { studentService } from "@/lib/services/studentService";
import { authService } from "@/lib/services/authService";

export default function StudentSelector() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const allStudents = await studentService.getAllStudents();
      setStudents(allStudents);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (studentId: string) => {
    try {
      const student = await authService.login(studentId);

      // Check if onboarding is needed
      if (!student.preferences.hasCompletedOnboarding) {
        window.location.href = "/onboarding";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      className="student-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {students.map((student, index) => (
        <StudentCard
          key={student.id}
          student={student}
          onClick={() => handleSelectStudent(student.id)}
          delay={index * 0.1}
        />
      ))}
    </motion.div>
  );
}
```

**StudentCard Component:**

```typescript
// /components/auth/StudentCard.tsx
"use client";

import { motion } from "framer-motion";
import { Student } from "@/types";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
  delay?: number;
}

export default function StudentCard({
  student,
  onClick,
  delay = 0,
}: StudentCardProps) {
  const getAvatar = (name: string) => {
    const avatars: Record<string, string> = {
      Lucas: "👦",
      Eva: "👧",
      Pat: "🎓",
      Mia: "📚",
    };
    return avatars[name] || "🎓";
  };

  return (
    <motion.button
      className={`student-card ${
        student.churnRisk ? "student-card--at-risk" : ""
      }`}
      onClick={onClick}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="student-avatar">{getAvatar(student.name)}</span>
      <span className="student-name">{student.name}</span>
      <span className="student-streak">
        🔥 {student.streaks.current} day
        {student.streaks.current !== 1 ? "s" : ""}
      </span>
    </motion.button>
  );
}
```

**Protected Route Wrapper:**

```typescript
// /components/auth/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    validateAuth();
  }, []);

  const validateAuth = async () => {
    const isValid = await authService.validateSession();

    if (!isValid) {
      router.push("/login");
    } else {
      setIsValidating(false);
    }
  };

  if (isValidating) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
```

---

## 🎨 Onboarding Flow

### Requirements

**Goals:**

- Welcome and excite new students
- Personalize experience (color selection)
- Teach interface basics
- Set initial learning goals
- Complete in < 2 minutes

**Steps:**

1. Welcome & AI Introduction
2. Color Picker (personalization)
3. Interactive Tutorial
4. Goal Setup

**Skip Logic:**

- Returning users skip onboarding
- Can skip tutorial (but not color picker)
- Completion status saved to student profile

---

### Step 1: Welcome Screen

**Design:**

```
┌──────────────────────────────────────┐
│                                      │
│         ┌──────────┐                 │
│         │    👋    │  Hi there!      │
│         └──────────┘                 │
│       (AI Character)                 │
│                                      │
│   I'm your AI study buddy!           │
│   Let's make learning fun together!  │
│                                      │
│            [Let's go! →]             │
│                                      │
│            (Skip tutorial)           │
└──────────────────────────────────────┘
```

**Implementation:**

```typescript
// /components/onboarding/WelcomeStep.tsx
export default function WelcomeStep({ onNext, onSkip }: StepProps) {
  return (
    <motion.div
      className="onboarding-step"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <AICharacter expression="waving" size={150} animate={breathingVariant} />

      <motion.div
        className="speech-bubble"
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-hand text-h2">Hi there!</h2>
        <p className="font-sketch text-lg">
          I'm your AI study buddy! Let's make learning fun together!
        </p>
      </motion.div>

      <motion.button
        className="sketch-button sketch-button--primary"
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Let's go! →
      </motion.button>

      <button
        className="text-sm text-doodle-sketch opacity-50 hover:opacity-100"
        onClick={onSkip}
      >
        Skip tutorial
      </button>
    </motion.div>
  );
}
```

---

### Step 2: Color Picker

**Design:**

```
┌──────────────────────────────────────┐
│   Pick your favorite color for me!  │
│                                      │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐            │
│    │▓▓│ │▓▓│ │▓▓│ │▓▓│ Purple     │
│    └──┘ └──┘ └──┘ └──┘            │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐            │
│    │▓▓│ │▓▓│ │▓▓│ │▓▓│ Blue       │
│    └──┘ └──┘ └──┘ └──┘            │
│                                      │
│         ┌────────┐                   │
│         │   😊   │  Preview!         │
│         └────────┘                   │
│                                      │
│    [← Back]      [Choose! →]        │
└──────────────────────────────────────┘
```

**Available Colors:**

```typescript
const COLOR_OPTIONS = [
  { id: "purple", name: "Magic Purple", hex: "#A685E2" },
  { id: "blue", name: "Sky Blue", hex: "#6FB1FC" },
  { id: "green", name: "Forest Green", hex: "#7FD8BE" },
  { id: "orange", name: "Sunset Orange", hex: "#FF9671" },
  { id: "pink", name: "Cotton Candy", hex: "#FFAAC9" },
  { id: "yellow", name: "Sunshine Yellow", hex: "#FFE66D" },
  { id: "mint", name: "Fresh Mint", hex: "#B4F8C8" },
  { id: "lavender", name: "Lavender Dreams", hex: "#CFBAF0" },
];
```

**Implementation:**

```typescript
// /components/onboarding/ColorPickerStep.tsx
export default function ColorPickerStep({ onNext, onBack }: StepProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedColor) {
      // Save to student preferences
      onNext({ aiColor: selectedColor });
    }
  };

  return (
    <motion.div className="onboarding-step">
      <h2 className="font-hand text-h2">Pick your favorite color for me!</h2>

      <div className="color-grid">
        {COLOR_OPTIONS.map((color) => (
          <ColorSwatch
            key={color.id}
            color={color}
            selected={selectedColor === color.id}
            onClick={() => setSelectedColor(color.id)}
          />
        ))}
      </div>

      {selectedColor && (
        <motion.div
          className="preview-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <AICharacter
            color={COLOR_OPTIONS.find((c) => c.id === selectedColor)?.hex}
            expression="happy"
            size={120}
          />
          <p className="font-sketch">Preview!</p>
        </motion.div>
      )}

      <div className="button-group">
        <button className="sketch-button sketch-button--ghost" onClick={onBack}>
          ← Back
        </button>
        <button
          className="sketch-button sketch-button--primary"
          onClick={handleConfirm}
          disabled={!selectedColor}
        >
          Choose! →
        </button>
      </div>
    </motion.div>
  );
}
```

**Color Swatch Component:**

```typescript
// /components/onboarding/ColorSwatch.tsx
interface ColorSwatchProps {
  color: ColorOption;
  selected: boolean;
  onClick: () => void;
}

export default function ColorSwatch({
  color,
  selected,
  onClick,
}: ColorSwatchProps) {
  return (
    <motion.button
      className={`color-swatch ${selected ? "color-swatch--selected" : ""}`}
      style={{ backgroundColor: color.hex }}
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
    >
      {selected && (
        <motion.span
          className="checkmark"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          ✓
        </motion.span>
      )}
      <span className="color-name">{color.name}</span>
    </motion.button>
  );
}
```

---

### Step 3: Interactive Tutorial

**Flow:**

```
Overlay-style with spotlight effect

Stop 1: AI Character
"Click me to start chatting!"
↓
Stop 2: Task Sidebar
"Find your practice tasks here"
↓
Stop 3: Progress Card
"Track your learning journey"
↓
Stop 4: Streak Counter
"Build your daily streak!"
```

**Implementation:**

```typescript
// /components/onboarding/TutorialStep.tsx
const TUTORIAL_STOPS = [
  {
    id: "ai-character",
    target: ".ai-character",
    title: "Your AI Study Buddy",
    message: "Click me anytime to start chatting!",
    position: "bottom",
  },
  {
    id: "task-sidebar",
    target: ".tasks-sidebar",
    title: "Your Tasks",
    message: "Find your practice tasks here",
    position: "left",
  },
  {
    id: "progress-card",
    target: ".progress-card",
    title: "Your Progress",
    message: "Track your learning journey",
    position: "right",
  },
  {
    id: "streak-counter",
    target: ".streak-counter",
    title: "Daily Streak",
    message: "Build your streak by practicing every day!",
    position: "bottom",
  },
];

export default function TutorialStep({ onNext, onSkip }: StepProps) {
  const [currentStop, setCurrentStop] = useState(0);

  const stop = TUTORIAL_STOPS[currentStop];
  const isLastStop = currentStop === TUTORIAL_STOPS.length - 1;

  const handleNext = () => {
    if (isLastStop) {
      onNext();
    } else {
      setCurrentStop((prev) => prev + 1);
    }
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Spotlight on target element */}
      <Spotlight target={stop.target} />

      {/* Tutorial Tooltip */}
      <TutorialTooltip
        title={stop.title}
        message={stop.message}
        position={stop.position}
        target={stop.target}
        currentStep={currentStop + 1}
        totalSteps={TUTORIAL_STOPS.length}
        onNext={handleNext}
        onSkip={onSkip}
      />
    </>
  );
}
```

---

### Step 4: Goal Setup

**Design:**

```
┌──────────────────────────────────────┐
│   What do you want to learn today?  │
│                                      │
│   Choose up to 3 subjects:           │
│                                      │
│   ☐ Math      ☐ Science              │
│   ☐ Reading   ☐ Writing              │
│   ☐ History   ☐ Other: [_____]       │
│                                      │
│   You can always add more later!     │
│                                      │
│      [Skip for now] [Start! →]      │
└──────────────────────────────────────┘
```

**Implementation:**

```typescript
// /components/onboarding/GoalSetupStep.tsx
const SUBJECT_OPTIONS = [
  { id: "math", name: "Math", icon: "➕" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "reading", name: "Reading", icon: "📖" },
  { id: "writing", name: "Writing", icon: "✍️" },
  { id: "history", name: "History", icon: "🏛️" },
];

export default function GoalSetupStep({ onNext, onSkip }: StepProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");

  const MAX_SUBJECTS = 3;

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      } else if (prev.length < MAX_SUBJECTS) {
        return [...prev, subjectId];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    onNext({
      subjects: selectedSubjects,
      customSubject: customSubject || null,
    });
  };

  return (
    <motion.div className="onboarding-step">
      <h2 className="font-hand text-h2">What do you want to learn today?</h2>
      <p className="font-sketch text-md">
        Choose up to {MAX_SUBJECTS} subjects:
      </p>

      <div className="subject-grid">
        {SUBJECT_OPTIONS.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            selected={selectedSubjects.includes(subject.id)}
            disabled={
              !selectedSubjects.includes(subject.id) &&
              selectedSubjects.length >= MAX_SUBJECTS
            }
            onClick={() => toggleSubject(subject.id)}
          />
        ))}

        <div className="custom-subject-card">
          <span className="subject-icon">✨</span>
          <input
            type="text"
            placeholder="Other..."
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="doodle-input"
            maxLength={30}
          />
        </div>
      </div>

      <p className="helper-text">You can always add more later!</p>

      <div className="button-group">
        <button className="sketch-button sketch-button--ghost" onClick={onSkip}>
          Skip for now
        </button>
        <button
          className="sketch-button sketch-button--primary"
          onClick={handleConfirm}
        >
          Start! →
        </button>
      </div>
    </motion.div>
  );
}
```

---

### Onboarding Orchestrator

```typescript
// /app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import { onboardingService } from "@/lib/services/onboardingService";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import ColorPickerStep from "@/components/onboarding/ColorPickerStep";
import TutorialStep from "@/components/onboarding/TutorialStep";
import GoalSetupStep from "@/components/onboarding/GoalSetupStep";

const STEPS = ["welcome", "color", "tutorial", "goals"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [onboardingData, setOnboardingData] = useState({});

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const handleNext = async (data?: any) => {
    // Save step data
    setOnboardingData((prev) => ({ ...prev, ...data }));

    // Move to next step
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    } else {
      // Onboarding complete
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1]);
    }
  };

  const handleSkip = async () => {
    // Skip remaining steps
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    const student = await authService.getCurrentStudent();

    if (student) {
      // Save onboarding data
      await onboardingService.complete(student.id, onboardingData);

      // Redirect to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <div className="onboarding-container">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Steps */}
      {currentStep === "welcome" && (
        <WelcomeStep onNext={handleNext} onSkip={handleSkip} />
      )}
      {currentStep === "color" && (
        <ColorPickerStep onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === "tutorial" && (
        <TutorialStep onNext={handleNext} onSkip={handleSkip} />
      )}
      {currentStep === "goals" && (
        <GoalSetupStep onNext={handleNext} onSkip={handleSkip} />
      )}

      {/* Step Indicators */}
      <div className="step-indicators">
        {STEPS.map((step, index) => (
          <div
            key={step}
            className={`step-dot ${index <= stepIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

### Authentication

- [ ] Login screen displays all 4 student cards
- [ ] Student cards show correct avatar, name, and streak
- [ ] At-risk students show warning indicator (Mia)
- [ ] Clicking a card authenticates that student
- [ ] Session persists across page reloads
- [ ] Logout button clears session and redirects
- [ ] Protected routes redirect to login when not authenticated

### Onboarding

- [ ] Welcome screen appears for first-time users
- [ ] AI character displays with animation
- [ ] Color picker shows 8 color options
- [ ] Selected color updates preview in real-time
- [ ] Tutorial highlights all 4 interface areas
- [ ] Can skip tutorial but not color picker
- [ ] Goal setup allows selecting 0-3 subjects
- [ ] Custom subject input works
- [ ] Progress bar updates correctly
- [ ] Onboarding completion status saves to profile
- [ ] Returning users skip onboarding entirely
- [ ] Complete flow takes < 2 minutes

---

## 📚 Related Documents

**Shard Navigation:**

- **← Previous:** Shard 2 (Design System)
- **→ Next:** Shard 4 (Achievements & Gamification)

**Related Shards:**

- Shard 2: Design System (styling reference)
- Shard 10: Implementation Roadmap (Week 1 tasks)

---

**End of Authentication & Onboarding Shard**
