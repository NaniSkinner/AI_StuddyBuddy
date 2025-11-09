# 🧠 AI Study Companion - Complete PRD v3

**Gauntlet Project | Comprehensive Specification**

---

## 📖 Document Information

**Version:** 3.0 (Consolidated)  
**Last Updated:** November 6, 2025  
**Status:** Ready for Phase 2 Implementation  
**Previous Versions:** PRD v1 (Foundation), PRD v2 (UI Enhancement)

---

## 🎯 Executive Summary

The **AI Study Companion** is a persistent, context-aware tutoring assistant that bridges the gap between human tutoring sessions. Building upon a completed Phase 1 foundation with functional UI and data structures, Phase 2 focuses on:

1. **Complete UI/UX transformation** to a playful, hand-drawn doodle aesthetic
2. **Implementation of 3 missing core systems**: Authentication, Onboarding, Achievements
3. **OpenAI integration verification and enhancement** with proper context management
4. **Feature completeness audit** to ensure all PRD v1 requirements are met
5. **Performance optimization** for all-device compatibility

### Primary Objectives

- **Retention:** Reduce 52% churn rate to <30% through engagement mechanics
- **Engagement:** Increase average session duration to 15+ minutes
- **Delight:** Transform learning into a playful, curiosity-driven adventure
- **Accessibility:** Support ages 9-16 with age-appropriate adaptations

---

## 📊 Current State Assessment

### ✅ Phase 1 Completed (Existing)

- [x] Project setup (Next.js 14, TypeScript, Tailwind CSS)
- [x] Three-column layout structure (Progress, Chat, Tasks)
- [x] Mock data architecture (students, tutors, sessions)
- [x] Service layer foundation (studentService, tutorService, etc.)
- [x] Progress tracking UI with sub-concepts
- [x] Task sidebar with status indicators
- [x] Streak counter (visual display)
- [x] Chat interface shell
- [x] Basic component library (buttons, cards, inputs)
- [x] Student selection/switching
- [x] Topic/subject management

### ⚠️ Phase 1 Gaps (To Be Completed)

- [ ] **Authentication/Login system** - Not implemented
- [ ] **Onboarding flow** - Not implemented
- [ ] **Achievement system** - Not implemented
- [ ] **OpenAI integration** - Built but needs API keys + verification
- [ ] **Conversation context management** - Needs verification
- [ ] **Task generation logic** - Needs verification
- [ ] **Nudge system triggers** - Needs verification
- [ ] **Friend messaging** - Needs verification
- [ ] **Tutor booking flow** - Needs verification

### 🎨 Current Design State

**Style:** Clean, modern, corporate aesthetic

- Standard rounded rectangles
- Gradient backgrounds (purple AI bubble)
- Traditional progress bars
- Standard fonts and spacing
- Minimal animations
- Professional color scheme

**Target:** Playful, hand-drawn doodle aesthetic

- Sketchy borders and organic shapes
- Hand-lettered typography
- Animated mascot character
- Vibrant, warm color palette
- Bouncy, delightful animations
- Whimsical decorative elements

---

## 👥 User Profiles (Maintained from PRD v1)

| User      | Age | Grade | Focus Areas                       | Engagement Pattern          | UI Adaptation                                                |
| --------- | --- | ----- | --------------------------------- | --------------------------- | ------------------------------------------------------------ |
| **Lucas** | 9   | 4th   | Elementary Math, Science          | High engagement             | Sub-concept tracking, simple language, lots of encouragement |
| **Eva**   | 12  | 7th   | Reading, Writing, History         | Moderate engagement         | Balanced detail, metacognition prompts                       |
| **Pat**   | 16  | 11th  | SAT Prep, College Essays, AP Calc | Goal-driven                 | Percentage tracking, academic tone, planning focus           |
| **Mia**   | 14  | 9th   | Algebra II, Biology               | Low engagement (churn risk) | Retention nudges, celebration-first messaging                |

### Tutor Profiles

- **Dr. Sarah Chen** - Math & Science specialist
- **Mr. James Rodriguez** - English & SAT Prep
- **Ms. Aisha Patel** - STEM subjects (Algebra, Biology, Chemistry)

### Mock Data Specifications

- **4 student profiles** with full history
- **3 tutors** with specialties and bios
- **6 sessions per student** (24 total sessions)
- **14-day activity timeline** for retention simulation
- **Full dialogue transcripts** for each session
- **Progress data** with realistic struggle points

---

## 🏗️ Technology Stack

### Core Technologies (Confirmed)

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS (extended with custom doodle config)
- **Animations:** Framer Motion (primary) + roughjs (special illustrations)
- **AI:** OpenAI API (GPT-4) with context window management
- **State:** React Context or Zustand for global state
- **Data:** Local JSON files with service layer (Phase 1)
- **Deployment:** Vercel for demo

### Design & Asset Tools

- **Fonts:** Google Fonts (Caveat, Patrick Hand, Indie Flower, Comic Neue)
- **Illustrations:** Curated free/premium doodle packs
  - Blush Design, unDraw, DrawKit, Humaaans
- **Icons:** Doodle icon sets from Noun Project, Iconfinder
- **Animations:** LottieFiles + custom Framer Motion variants
- **Hand-drawn Graphics:** roughjs library for authentic sketchy elements

### Architecture Principles

1. **Service Layer Pattern** - Clean APIs ready for backend migration
2. **TypeScript Everywhere** - Type safety across all components
3. **Component Modularity** - Reusable, themeable components
4. **Performance First** - 60fps animations on all target devices
5. **Progressive Enhancement** - Works on low-end devices
6. **Accessibility Built-in** - WCAG 2.1 AA compliance

---

## 🎨 Design System Specifications

### Visual Design Philosophy

**Inspiration:** Khanmigo, Khan Academy Kids, Duolingo, Scratch

**Core Principles:**

- **Playful but purposeful** - Whimsy supports learning, doesn't distract
- **Hand-drawn authenticity** - Imperfect lines, organic shapes
- **Warm and inviting** - Colors that feel friendly, not corporate
- **Age-appropriate flexibility** - Can feel young or mature based on user
- **Accessible contrast** - Fun colors that still meet WCAG standards

---

### Color Palette

#### Primary Colors

```css
--doodle-cream: #f5f5dc; /* Backgrounds, paper texture */
--doodle-sketch: #2d2d2d; /* Outlines, text, borders */
--doodle-green: #7fd8be; /* Success, growth, completed */
--doodle-orange: #ff9671; /* Energy, enthusiasm, active */
--doodle-purple: #a685e2; /* Creativity, wisdom, AI character */
--doodle-blue: #6fb1fc; /* Calm, focus, information */
--doodle-yellow: #ffe66d; /* Highlights, joy, achievements */
```

#### Secondary/Accent Colors

```css
--doodle-pink: #ffaac9; /* Achievements, special moments */
--doodle-mint: #b4f8c8; /* Progress indicators */
--doodle-lavender: #cfbaf0; /* Curiosity, questions */
--doodle-peach: #ffc09f; /* Warmth, encouragement */
```

#### Semantic Colors

```css
--color-success: var(--doodle-green);
--color-warning: var(--doodle-orange);
--color-error: #ff6b6b;
--color-info: var(--doodle-blue);
```

---

### Typography System

#### Font Families

```css
--font-hand: "Caveat", cursive; /* Headings, playful emphasis */
--font-sketch: "Patrick Hand", cursive; /* Body text, readable handwriting */
--font-comic: "Comic Neue", cursive; /* AI messages, friendly tone */
--font-indie: "Indie Flower", cursive; /* Decorative text, labels */
```

#### Type Scale

```css
/* Headings */
--text-h1: 48px; /* Page titles, welcome messages */
--text-h2: 36px; /* Section headers */
--text-h3: 28px; /* Component titles */
--text-h4: 24px; /* Subsection headers */

/* Body */
--text-lg: 20px; /* Emphasized body text */
--text-md: 18px; /* Standard body, AI messages */
--text-sm: 16px; /* Secondary text, labels */
--text-xs: 14px; /* Captions, metadata */
```

#### Font Weights & Line Heights

```css
--font-normal: 400;
--font-medium: 500;
--font-bold: 700;

--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

### Animation System

#### Timing Functions

```css
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-playful: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);
```

#### Duration Scale

```css
--duration-fast: 200ms; /* Button clicks, small interactions */
--duration-base: 300ms; /* Standard transitions */
--duration-slow: 500ms; /* Larger animations, page transitions */
--duration-slower: 800ms; /* Achievement reveals, celebrations */
```

#### Core Animation Variants (Framer Motion)

**Idle/Breathing (AI Character)**

```typescript
const breathingVariant = {
  animate: {
    scale: [1, 1.05, 1],
    rotate: [-1, 1, -1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
```

**Button Hover**

```typescript
const buttonVariant = {
  hover: {
    scale: 1.05,
    rotate: 2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.95,
    rotate: -2,
    transition: { duration: 0.1 },
  },
};
```

**Bounce In (Messages, Notifications)**

```typescript
const bounceInVariant = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};
```

**Float (Decorative Elements)**

```typescript
const floatVariant = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
```

**Wiggle (Attention)**

```typescript
const wiggleVariant = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
```

---

### Component Design Patterns

#### 1. Hand-Drawn Borders

**Implementation Options:**

**Option A: CSS-Only (Performant)**

```css
.doodle-border {
  border: 3px solid var(--doodle-sketch);
  border-radius: 15px;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1), 4px 4px 0px rgba(0, 0, 0, 0.05);
  position: relative;
}

.doodle-border::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 3px solid var(--doodle-sketch);
  border-radius: 16px;
  opacity: 0.6;
  transform: rotate(-0.5deg);
  z-index: -1;
}
```

**Option B: roughjs (Authentic Hand-Drawn)**

```typescript
import rough from "roughjs";

const drawSketchyBorder = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) => {
  const rc = rough.canvas(canvas);
  rc.rectangle(0, 0, width, height, {
    roughness: 1.2,
    stroke: "#2D2D2D",
    strokeWidth: 3,
    fill: "#F5F5DC",
    fillStyle: "solid",
  });
};
```

**Recommendation:** CSS for UI elements (performance), roughjs for special illustrations

---

#### 2. Sketchy Buttons

**Base Style:**

```css
.sketch-button {
  position: relative;
  padding: 12px 24px;
  background: linear-gradient(
    145deg,
    var(--doodle-yellow),
    var(--doodle-peach)
  );
  border: 2px solid var(--doodle-sketch);
  border-radius: 12px;
  font-family: var(--font-sketch);
  font-size: var(--text-md);
  font-weight: var(--font-bold);
  cursor: pointer;
  transform: rotate(-1deg);
  transition: all 0.2s var(--ease-bounce);
}

.sketch-button::after {
  content: "";
  position: absolute;
  inset: -2px;
  border: 2px solid var(--doodle-sketch);
  border-radius: 12px;
  opacity: 0.4;
  transform: rotate(1deg);
  z-index: -1;
}

.sketch-button:hover {
  transform: rotate(1deg) scale(1.05);
  box-shadow: 4px 4px 0px var(--doodle-sketch);
}

.sketch-button:active {
  transform: rotate(-1deg) scale(0.95);
  box-shadow: 2px 2px 0px var(--doodle-sketch);
}
```

**Variants:**

- Primary: Yellow-to-peach gradient
- Success: Green solid with sketch border
- Danger: Soft red with wavy border
- Ghost: Transparent with dashed sketch border

---

#### 3. Chat Bubbles

**Student Bubble (Right-Aligned)**

```css
.chat-bubble-student {
  position: relative;
  max-width: 70%;
  margin-left: auto;
  padding: 16px 20px;
  background: white;
  border: 2px solid var(--doodle-sketch);
  border-radius: 20px 20px 4px 20px;
  font-family: var(--font-sketch);
  transform: rotate(0.5deg);
}

.chat-bubble-student::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: -8px;
  width: 20px;
  height: 20px;
  background: white;
  border-right: 2px solid var(--doodle-sketch);
  border-bottom: 2px solid var(--doodle-sketch);
  border-radius: 0 0 20px 0;
  transform: rotate(15deg);
}
```

**AI Bubble (Left-Aligned)**

```css
.chat-bubble-ai {
  position: relative;
  max-width: 70%;
  margin-right: auto;
  padding: 16px 20px;
  background: var(--doodle-purple);
  border: 2px solid var(--doodle-sketch);
  border-radius: 20px 20px 20px 4px;
  color: white;
  font-family: var(--font-comic);
  transform: rotate(-0.5deg);
}

.chat-bubble-ai::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: -8px;
  width: 20px;
  height: 20px;
  background: var(--doodle-purple);
  border-left: 2px solid var(--doodle-sketch);
  border-bottom: 2px solid var(--doodle-sketch);
  border-radius: 0 0 0 20px;
  transform: rotate(-15deg);
}
```

---

#### 4. Progress Bars

**Hand-Drawn Progress Bar**

```css
.progress-bar-container {
  position: relative;
  width: 100%;
  height: 24px;
  background: var(--doodle-cream);
  border: 2px solid var(--doodle-sketch);
  border-radius: 12px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--doodle-green), var(--doodle-mint));
  border-right: 2px solid var(--doodle-sketch);
  transition: width 0.5s var(--ease-playful);
  position: relative;
}

.progress-bar-fill::after {
  content: "";
  position: absolute;
  top: 0;
  right: -10px;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%,
  100% {
    transform: translateX(-20px);
  }
  50% {
    transform: translateX(100px);
  }
}
```

**Sub-Concept Indicators (Ages 9-12)**

```css
.concept-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: white;
  border: 2px solid var(--doodle-sketch);
  border-radius: 8px;
  font-size: var(--text-xs);
  transform: rotate(-1deg);
}

.concept-indicator.mastered {
  background: var(--doodle-green);
  color: white;
}

.concept-indicator.struggling {
  background: var(--doodle-orange);
  color: white;
}
```

---

#### 5. Cards

**Base Card Style**

```css
.doodle-card {
  position: relative;
  padding: 24px;
  background: white;
  border: 3px solid var(--doodle-sketch);
  border-radius: 16px;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1), 8px 8px 0px rgba(0, 0, 0, 0.05);
  transform: rotate(-0.5deg);
  transition: all 0.3s var(--ease-bounce);
}

.doodle-card::before {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px solid var(--doodle-sketch);
  border-radius: 18px;
  opacity: 0.3;
  transform: rotate(1deg);
  z-index: -1;
}

.doodle-card:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.15), 12px 12px 0px rgba(0, 0, 0, 0.08);
}
```

**Decorative Corner Doodles**

```css
.doodle-card::after {
  content: "⭐";
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 24px;
  transform: rotate(20deg);
  animation: float 3s ease-in-out infinite;
}
```

---

#### 6. Input Fields

**Text Input**

```css
.doodle-input {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 0;
  border-bottom: 3px solid var(--doodle-sketch);
  font-family: var(--font-sketch);
  font-size: var(--text-md);
  outline: none;
  transition: all 0.3s ease;
  position: relative;
}

.doodle-input::placeholder {
  color: rgba(45, 45, 45, 0.4);
  font-style: italic;
}

.doodle-input:focus {
  border-bottom-width: 4px;
  border-bottom-color: var(--doodle-purple);
  background: linear-gradient(
    to bottom,
    transparent 95%,
    rgba(166, 133, 226, 0.1) 100%
  );
}

.doodle-input:focus::after {
  content: "✏️";
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  animation: wiggle 0.5s ease-in-out;
}
```

---

### AI Character Design

#### Character States & Expressions

**1. Idle (Default)**

- **Visual:** Circle with gentle smile, closed eyes
- **Animation:** Subtle breathing (scale 1.0 to 1.05)
- **Color:** Customizable (student's chosen color)
- **Trigger:** No activity for 2+ seconds

**2. Thinking**

- **Visual:** Eyes closed, pencil rotating around head
- **Animation:** Pencil orbits character, 3 dots appear
- **Color:** Slightly desaturated
- **Trigger:** Waiting for AI response

**3. Speaking**

- **Visual:** Open mouth with small animation lines
- **Animation:** Mouth opens/closes rhythmically
- **Color:** Full saturation
- **Trigger:** AI message is being displayed

**4. Celebrating**

- **Visual:** Big smile, stars/sparkles around character
- **Animation:** Bounce up and down, particles burst
- **Color:** Bright, glowing effect
- **Trigger:** Achievement unlocked, goal completed, streak milestone

**5. Encouraging**

- **Visual:** Gentle smile, heart icon near character
- **Animation:** Slight nod, pulsing glow
- **Color:** Warm tint overlay
- **Trigger:** Student struggling, nudge delivery

#### Character Implementation

**Size Specifications:**

- Desktop: 150px diameter
- Tablet: 120px diameter
- Mobile: 80px diameter

**SVG Structure:**

```svg
<svg viewBox="0 0 150 150" class="ai-character">
  <!-- Base circle -->
  <circle cx="75" cy="75" r="70" fill="var(--student-color)" stroke="#2D2D2D" stroke-width="3"/>

  <!-- Face (expression changes based on state) -->
  <g class="face" data-state="idle">
    <!-- Eyes -->
    <path d="M50 60 Q55 55 60 60" stroke="#2D2D2D" stroke-width="2" fill="none"/>
    <path d="M90 60 Q95 55 100 60" stroke="#2D2D2D" stroke-width="2" fill="none"/>

    <!-- Mouth (changes per state) -->
    <path d="M55 85 Q75 95 95 85" stroke="#2D2D2D" stroke-width="2" fill="none"/>
  </g>

  <!-- Decorative elements (vary by state) -->
  <g class="decorations">
    <!-- Stars, sparkles, etc. -->
  </g>
</svg>
```

**Framer Motion Integration:**

```typescript
const characterVariants = {
  idle: {
    scale: [1, 1.05, 1],
    rotate: [-1, 1, -1],
    transition: { duration: 3, repeat: Infinity },
  },
  thinking: {
    scale: 0.95,
    opacity: 0.8,
    transition: { duration: 0.5 },
  },
  celebrating: {
    scale: [1, 1.2, 1],
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.8, ease: "easeOut" },
  },
};
```

---

## 💡 Core Features Implementation

### 1. Authentication & Login System ⭐ NEW

#### Requirements

- Simple authentication against mock student data
- No external auth service (Phase 1)
- Student selection interface
- Session persistence
- Logout functionality

#### User Flow

**Login Screen:**

```
┌─────────────────────────────────────┐
│     ┌─────┐                         │
│     │ 🧠  │  AI Study Companion      │
│     └─────┘                         │
│                                     │
│  Welcome! Let's get learning! 🚀    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Choose your profile:         │ │
│  │                               │ │
│  │  [Lucas 👦] [Eva 👧]          │ │
│  │  [Pat 🎓] [Mia 📚]            │ │
│  └───────────────────────────────┘ │
│                                     │
│  Or enter your name: [_________]   │
│              [Start Learning!]      │
└─────────────────────────────────────┘
```

**Design Specifications:**

- **Background:** Cream with subtle paper texture
- **Title:** Hand-lettered "AI Study Companion" in Caveat font
- **Student Cards:** Doodle-bordered cards with:
  - Avatar illustration (doodle style)
  - Name in sketch font
  - Current streak indicator
  - Slight rotation (-2° to 2° random)
  - Hover: Bounce animation + color glow
- **Input Field:** Underline style with pencil doodle
- **Button:** Large sketchy button with bounce effect

#### Implementation Details

**Component Structure:**

```
/app/login/page.tsx
/components/auth/
  - StudentSelector.tsx
  - StudentCard.tsx
  - LoginForm.tsx
/lib/services/authService.ts
```

**authService.ts:**

```typescript
interface AuthService {
  login(studentId: string): Promise<Student>;
  logout(): void;
  getCurrentStudent(): Student | null;
  validateSession(): boolean;
}
```

**Session Management:**

- Store in localStorage: `currentStudentId`
- Check on app load: Redirect to dashboard if authenticated
- Logout: Clear localStorage + redirect to login

---

### 2. Onboarding Flow ⭐ NEW

#### Requirements

- First-time user experience (FTUE)
- Multi-step guided tour
- AI character introduction
- Color picker for personalization
- Interactive tutorial
- Skip option for returning users

#### Flow Steps

**Step 1: Welcome & Introduction**

```
┌─────────────────────────────────────┐
│                                     │
│        ┌───────┐                    │
│        │  👋   │  Hi there!         │
│        └───────┘                    │
│      (AI Character)                 │
│                                     │
│   I'm your AI study buddy!          │
│   Let's make learning fun together! │
│                                     │
│         [Let's go! →]               │
│                                     │
│         (Skip tutorial)             │
└─────────────────────────────────────┘
```

**Design:**

- AI character appears with bounce-in animation
- Speech bubble with friendly message
- Background: Animated doodles floating gently
- Button: Large, inviting sketchy style
- Skip link: Small, non-intrusive

**Step 2: Color Picker**

```
┌─────────────────────────────────────┐
│   Pick your favorite color for me! │
│                                     │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐            │
│    │  │ │  │ │  │ │  │ Purple     │
│    └──┘ └──┘ └──┘ └──┘            │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐            │
│    │  │ │  │ │  │ │  │ Blue       │
│    └──┘ └──┘ └──┘ └──┘            │
│                                     │
│         ┌───────┐                   │
│         │  😊   │  Preview!         │
│         └───────┘                   │
│                                     │
│    [← Back]      [Choose! →]       │
└─────────────────────────────────────┘
```

**Design:**

- Color swatches: Paint splat style, hand-drawn borders
- Preview: Live AI character in center with chosen color
- Color names: Playful labels (e.g., "Ocean Blue", "Sunset Orange")
- Hover: Swatches grow slightly with bounce
- Selection: Checkmark appears, swatch pulses

**Available Colors:**

- Purple (#A685E2) - "Magic Purple"
- Blue (#6FB1FC) - "Sky Blue"
- Green (#7FD8BE) - "Forest Green"
- Orange (#FF9671) - "Sunset Orange"
- Pink (#FFAAC9) - "Cotton Candy"
- Yellow (#FFE66D) - "Sunshine Yellow"
- Mint (#B4F8C8) - "Fresh Mint"
- Lavender (#CFBAF0) - "Lavender Dreams"

**Step 3: Interface Tour**

```
Overlay-style tutorial with animated arrows pointing to:
1. AI Character: "Click me to start chatting!"
2. Task Sidebar: "Find your practice tasks here"
3. Progress Card: "Track your learning journey"
4. Streak Counter: "Build your daily streak!"
```

**Design:**

- Semi-transparent overlay (80% opacity)
- Animated doodle arrows pointing to features
- Speech bubbles with tips
- Step indicators: Dots at bottom (1/4, 2/4, etc.)
- Spotlight effect: Feature being explained is highlighted

**Step 4: First Goal Setup**

```
┌─────────────────────────────────────┐
│   What do you want to learn today? │
│                                     │
│   Choose up to 3 subjects:          │
│                                     │
│   ☐ Math      ☐ Science             │
│   ☐ Reading   ☐ Writing             │
│   ☐ History   ☐ Other: [____]       │
│                                     │
│   You can always add more later!    │
│                                     │
│      [Skip for now] [Start! →]     │
└─────────────────────────────────────┘
```

**Design:**

- Checkbox cards with doodle borders
- Subject icons (hand-drawn style)
- Gentle encouragement message
- Limit: 3 selections to start (prevents overwhelm)

#### Implementation Details

**Component Structure:**

```
/components/onboarding/
  - OnboardingFlow.tsx (main orchestrator)
  - WelcomeStep.tsx
  - ColorPickerStep.tsx
  - TutorialStep.tsx
  - GoalSetupStep.tsx
/lib/services/onboardingService.ts
```

**State Management:**

```typescript
interface OnboardingState {
  currentStep: number;
  selectedColor: string;
  completedSteps: string[];
  hasSeenTutorial: boolean;
  selectedGoals: string[];
}
```

**Persistence:**

- Save to student profile: `preferences.hasCompletedOnboarding`
- Check on login: Skip if already completed
- Allow manual reset from settings

---

### 3. Achievement System ⭐ NEW

#### Achievement Definitions

| Badge | Name             | Icon           | Trigger                            | Points | Description            |
| ----- | ---------------- | -------------- | ---------------------------------- | ------ | ---------------------- |
| 🎯    | First Steps      | Target         | Complete first conversation        | 10     | Welcome to learning!   |
| 🔥    | 3-Day Streak     | Fire           | Study 3 consecutive days           | 20     | Consistency is key!    |
| 📅    | Week Warrior     | Calendar       | Study 7 consecutive days           | 50     | A whole week! Amazing! |
| 🎓    | Topic Master     | Graduation Cap | Reach 90% on any topic             | 30     | You've mastered this!  |
| ❓    | Curious Mind     | Lightbulb      | Ask 10 questions                   | 15     | Never stop wondering!  |
| 🤝    | Social Butterfly | Two People     | Send 5 friend messages             | 15     | Learning together!     |
| 🏆    | Streak Breaker   | Trophy         | Beat previous longest streak       | 40     | New personal record!   |
| 📚    | Bookworm         | Stack of Books | Complete 20 tasks                  | 25     | You're on a roll!      |
| ⭐    | Star Student     | Star           | Get 5 tasks correct in a row       | 20     | Perfection!            |
| 💪    | Practice Pro     | Flexed Bicep   | Practice 30 minutes in one session | 30     | Dedication!            |
| 🎨    | Creative Thinker | Palette        | Complete 5 open-ended tasks        | 25     | Great ideas!           |
| 🚀    | Goal Getter      | Rocket         | Complete a learning goal           | 50     | You did it!            |

#### Achievement UI Components

**Badge Card (Locked State)**

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
}

.achievement-locked::before {
  content: "🔒";
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}
```

**Badge Card (Unlocked State)**

```css
.achievement-unlocked {
  position: relative;
  width: 120px;
  height: 140px;
  padding: 16px;
  background: linear-gradient(145deg, var(--doodle-yellow), var(--doodle-pink));
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
```

**Achievement Collection Grid**

```
┌──────────────────────────────────────┐
│  🏆 Your Achievements                │
│                                      │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │🎯│ │🔥│ │🔒│ │🔒│  Progress: 2/12│
│  └──┘ └──┘ └──┘ └──┘               │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │🔒│ │🔒│ │🔒│ │🔒│               │
│  └──┘ └──┘ └──┘ └──┘               │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │🔒│ │🔒│ │🔒│ │🔒│               │
│  └──┘ └──┘ └──┘ └──┘               │
└──────────────────────────────────────┘
```

**Unlock Animation Sequence**

```typescript
const achievementUnlockSequence = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
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

**Unlock Notification (Toast)**

```
┌───────────────────────────────┐
│  🎉 Achievement Unlocked!     │
│                               │
│      ┌────────┐               │
│      │   🎯   │               │
│      └────────┘               │
│     First Steps               │
│                               │
│  You completed your first     │
│  conversation! Keep it up!    │
│                               │
│         [Awesome!]            │
└───────────────────────────────┘
```

#### Trigger Implementation

**achievementService.ts:**

```typescript
interface AchievementService {
  checkTriggers(event: UserEvent): Achievement[];
  unlockAchievement(achievementId: string): void;
  getProgress(achievementId: string): number;
  getUnlockedAchievements(studentId: string): Achievement[];
}

// Example trigger logic
const checkStreakAchievements = (streak: number): Achievement[] => {
  const unlocked: Achievement[] = [];

  if (streak === 3 && !hasAchievement("3-day-streak")) {
    unlocked.push(achievements["3-day-streak"]);
  }

  if (streak === 7 && !hasAchievement("week-warrior")) {
    unlocked.push(achievements["week-warrior"]);
  }

  if (streak > student.longestStreak && !hasAchievement("streak-breaker")) {
    unlocked.push(achievements["streak-breaker"]);
  }

  return unlocked;
};
```

**Event Hooks:**

```typescript
// Trigger points throughout app
onConversationComplete(() => checkAchievements("conversation_complete"));
onTaskComplete(() => checkAchievements("task_complete"));
onStreakUpdate(() => checkAchievements("streak_update"));
onQuestionAsked(() => checkAchievements("question_asked"));
onFriendMessageSent(() => checkAchievements("message_sent"));
onTopicMastery(() => checkAchievements("topic_mastery"));
```

---

### 4. OpenAI Integration Enhancement

#### Current State Verification Checklist

- [ ] API key is configured in `.env.local`
- [ ] `aiService.ts` exists and has basic OpenAI client setup
- [ ] Chat interface calls aiService when message is sent
- [ ] Responses are displayed in chat
- [ ] Error handling is implemented
- [ ] Loading states are shown during API calls

#### Enhancement Requirements

**Context Window Management:**

- Maintain last 10-15 messages in full context
- Summarize older conversation history
- Include student profile data (age, goals, struggle points)
- Include recent session transcripts as reference

**Age-Appropriate Response Formatting:**

```typescript
const getSystemPrompt = (student: Student): string => {
  const basePrompt = `You are a friendly AI tutor helping ${student.name}.`;

  if (student.age <= 11) {
    return `${basePrompt} Use simple words, short sentences (under 15 words), and lots of encouragement. Use emojis occasionally. Explain concepts with fun examples like games, toys, or everyday activities.`;
  } else if (student.age <= 14) {
    return `${basePrompt} Use age-appropriate vocabulary for middle school. Balance being friendly with being informative. Use relatable examples from school life, hobbies, or pop culture.`;
  } else {
    return `${basePrompt} Use mature, academic language. Challenge critical thinking. Provide detailed explanations with real-world applications. Encourage planning and goal-setting.`;
  }
};
```

**Enhanced aiService.ts Implementation:**

```typescript
interface ConversationContext {
  studentProfile: Student;
  recentMessages: Message[];
  sessionHistory: Session[];
  currentTopic: string;
  strugglingConcepts: string[];
}

class AIService {
  private openai: OpenAI;
  private contextWindow: number = 15;

  async generateResponse(
    message: string,
    context: ConversationContext
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    const conversationHistory = this.buildConversationHistory(context);

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    return response.choices[0].message.content;
  }

  private buildSystemPrompt(context: ConversationContext): string {
    const agePrompt = getSystemPrompt(context.studentProfile);
    const contextPrompt = this.buildContextPrompt(context);

    return `${agePrompt}\n\n${contextPrompt}`;
  }

  private buildContextPrompt(context: ConversationContext): string {
    let prompt = `Current topic: ${context.currentTopic}\n`;

    if (context.strugglingConcepts.length > 0) {
      prompt += `Known struggles: ${context.strugglingConcepts.join(", ")}\n`;
    }

    if (context.sessionHistory.length > 0) {
      const lastSession = context.sessionHistory[0];
      prompt += `Last tutor session covered: ${lastSession.topicsCovered
        .map((t) => t.topic)
        .join(", ")}\n`;
    }

    return prompt;
  }

  private buildConversationHistory(
    context: ConversationContext
  ): ChatMessage[] {
    // Keep last N messages in full detail
    const recentMessages = context.recentMessages.slice(-this.contextWindow);

    // Summarize older messages if needed
    const olderMessages = context.recentMessages.slice(0, -this.contextWindow);
    const summary = this.summarizeMessages(olderMessages);

    const history: ChatMessage[] = [];

    if (summary) {
      history.push({
        role: "system",
        content: `Previous conversation summary: ${summary}`,
      });
    }

    recentMessages.forEach((msg) => {
      history.push({
        role: msg.speaker === "student" ? "user" : "assistant",
        content: msg.message,
      });
    });

    return history;
  }

  private summarizeMessages(messages: Message[]): string {
    if (messages.length === 0) return "";

    // Simple summarization (could use GPT for this too in production)
    const topics = new Set(messages.map((m) => this.extractTopic(m.message)));
    return `Previously discussed: ${Array.from(topics).join(", ")}`;
  }
}
```

**Token Usage Monitoring:**

```typescript
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

const trackTokenUsage = (response: ChatCompletion): TokenUsage => {
  const usage = response.usage;
  const costPerToken = 0.00003; // GPT-4 pricing

  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    estimatedCost: usage.total_tokens * costPerToken,
  };
};
```

---

### 5. Task Generation System

#### Task Type Specifications

**Multiple Choice (Quick Knowledge Checks)**

```typescript
interface MultipleChoiceTask {
  type: "multiple_choice";
  question: string;
  options: string[]; // 4 options
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  hints: string[];
}
```

**Example:**

```
Question: What is 1/2 + 1/4?

Options:
A) 1/6
B) 2/6
C) 3/4
D) 1/8

Hints:
1. Find a common denominator
2. Try converting 1/2 to fourths
3. 1/2 is the same as 2/4
```

**Open-Ended (AI-Graded Responses)**

```typescript
interface OpenEndedTask {
  type: "open_ended";
  question: string;
  rubric: {
    keyPoints: string[];
    minLength: number;
    maxLength?: number;
  };
  sampleAnswer?: string;
  hints: string[];
}
```

**Example:**

```
Question: Explain how photosynthesis helps plants grow.

Rubric:
- Mentions sunlight
- Mentions water and CO2
- Mentions glucose/energy production
- Mentions oxygen as byproduct
- At least 50 words

Hints:
1. Think about what plants need from their environment
2. What do plants make that gives them energy?
3. What do they release that we breathe?
```

**Real-World Practice (Experiential Learning)**

```typescript
interface RealWorldTask {
  type: "real_world";
  activity: string;
  instructions: string[];
  verificationQuestions: string[];
  estimatedTime: number; // minutes
}
```

**Example:**

```
Activity: Fraction Hunt at Home

Instructions:
1. Find 3 objects in your house that can be divided
2. Cut or arrange them to show halves and quarters
3. Take a photo or draw what you found
4. Answer: Which fractions did you make?

Verification:
- Did you find at least 3 objects?
- Can you explain how you divided them?
- What was the easiest fraction to show?
```

#### Generation Logic

**Adaptive Difficulty:**

```typescript
const determineTaskDifficulty = (
  student: Student,
  topic: string
): TaskDifficulty => {
  const topicProgress = student.goals
    .flatMap((g) => g.topics)
    .find((t) => t.name === topic);

  if (!topicProgress) return "easy";

  const progress = topicProgress.progress;
  const recentAttempts =
    topicProgress.subConcepts
      ?.flatMap((sc) => sc.attemptsTotal)
      .reduce((a, b) => a + b, 0) || 0;

  if (progress < 40 || recentAttempts < 3) return "easy";
  if (progress < 70) return "medium";
  return "hard";
};
```

**AI-Powered Generation:**

```typescript
const generateTaskWithAI = async (
  topic: string,
  type: TaskType,
  difficulty: TaskDifficulty,
  context: ConversationContext
): Promise<Task> => {
  const prompt = `
    Generate a ${difficulty} ${type} task about ${topic} for a ${
    context.studentProfile.age
  }-year-old.
    
    ${
      type === "multiple_choice"
        ? "Include 4 options with 1 correct answer and 3 plausible distractors."
        : ""
    }
    ${
      type === "open_ended"
        ? "Include grading rubric with key points to check."
        : ""
    }
    ${
      type === "real_world"
        ? "Make it a hands-on activity they can do at home."
        : ""
    }
    
    Include 3 helpful hints that progressively reveal more information.
    
    Format as JSON matching the ${type}Task interface.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert educational content creator.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};
```

**Task Assignment Strategy:**

```typescript
const assignTasks = (student: Student): Task[] => {
  const tasks: Task[] = [];

  // Get current active goals
  const activeGoals = student.goals.filter((g) => g.progress < 100);

  for (const goal of activeGoals) {
    // Find topics that need practice
    const strugglingTopics = goal.topics.filter((t) => t.progress < 70);

    for (const topic of strugglingTopics.slice(0, 2)) {
      // Max 2 topics per goal
      // Mix of task types
      const taskTypes: TaskType[] = [
        "multiple_choice",
        "open_ended",
        "real_world",
      ];
      const selectedType =
        taskTypes[Math.floor(Math.random() * taskTypes.length)];

      const difficulty = determineTaskDifficulty(student, topic.name);

      // Generate or pull from question bank
      const task = await generateTaskWithAI(
        topic.name,
        selectedType,
        difficulty,
        {
          studentProfile: student,
          // ... other context
        }
      );

      tasks.push(task);
    }
  }

  return tasks.slice(0, 5); // Limit to 5 tasks at a time
};
```

---

### 6. Nudge System

#### Churn Detection Logic

```typescript
const detectChurnRisk = (student: Student): ChurnRisk => {
  const now = new Date();
  const lastActive = new Date(student.lastLoginAt);
  const daysSinceActive = Math.floor(
    (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalSessions = student.sessions.length;
  const accountAge = Math.floor(
    (now.getTime() - new Date(student.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // High risk: <3 sessions in first 7 days, or inactive for 3+ days
  if ((accountAge <= 7 && totalSessions < 3) || daysSinceActive >= 3) {
    return {
      level: "high",
      reason: daysSinceActive >= 3 ? "inactive" : "low_engagement",
      daysSinceActive,
      totalSessions,
    };
  }

  // Medium risk: Declining session frequency
  const recentSessions = student.sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    return (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;
  });

  if (recentSessions.length === 0 && daysSinceActive >= 1) {
    return {
      level: "medium",
      reason: "declining_activity",
      daysSinceActive,
      totalSessions,
    };
  }

  return { level: "none" };
};
```

#### Nudge Message Generation

**Template System:**

```typescript
interface NudgeTemplate {
  trigger: ChurnReason;
  ageGroup: "young" | "middle" | "teen";
  messages: {
    celebration?: string;
    encouragement: string;
    cta: string;
  };
}

const nudgeTemplates: NudgeTemplate[] = [
  {
    trigger: "inactive",
    ageGroup: "young",
    messages: {
      encouragement: "We miss you! 😊 You were doing so great with fractions!",
      cta: "Want to practice just one problem? It'll only take 2 minutes!",
    },
  },
  {
    trigger: "inactive",
    ageGroup: "middle",
    messages: {
      encouragement:
        "Hey! Your streak is about to break. You're only 1 day away from the longest streak record!",
      cta: "Quick 5-minute session to keep it going?",
    },
  },
  {
    trigger: "low_engagement",
    ageGroup: "teen",
    messages: {
      encouragement: "You're 60% through SAT Math - so close to your goal!",
      cta: "One practice session today would put you over 70%. Ready?",
    },
  },
];
```

**Celebrate-First Strategy:**

```typescript
const generateNudge = (
  student: Student,
  churnRisk: ChurnRisk
): NudgeMessage => {
  // Always look for something to celebrate first
  const celebrations: string[] = [];

  if (student.achievements.length > 0) {
    celebrations.push(
      `You've unlocked ${student.achievements.length} achievements!`
    );
  }

  if (student.streaks.longest > 0) {
    celebrations.push(
      `Your longest streak is ${student.streaks.longest} days - impressive!`
    );
  }

  const goalProgress = student.goals.find((g) => g.progress > 50);
  if (goalProgress) {
    celebrations.push(
      `You're ${goalProgress.progress}% done with ${goalProgress.subject}!`
    );
  }

  // Select appropriate template
  const ageGroup =
    student.age <= 11 ? "young" : student.age <= 14 ? "middle" : "teen";
  const template = nudgeTemplates.find(
    (t) => t.trigger === churnRisk.reason && t.ageGroup === ageGroup
  );

  return {
    celebration: celebrations[0] || null,
    message: template.messages.encouragement,
    cta: template.messages.cta,
    priority: churnRisk.level,
  };
};
```

#### Nudge UI Component

**Popup Design:**

```css
.nudge-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;

  width: 400px;
  max-width: 90vw;
  padding: 32px;

  background: white;
  border: 4px solid var(--doodle-sketch);
  border-radius: 20px;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.1), 16px 16px 0px rgba(0, 0, 0, 0.05);

  transform-origin: center;
  animation: nudgeAppear 0.6s var(--ease-bounce);
}

@keyframes nudgeAppear {
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(-10deg);
  }
  60% {
    transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
}

.nudge-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}
```

**Component Structure:**

```tsx
<NudgePopup>
  {celebration && <div className="celebration">🎉 {celebration}</div>}

  <AICharacter expression="encouraging" />

  <p className="nudge-message">{message}</p>

  <div className="actions">
    <Button variant="primary" onClick={handleAccept}>
      {cta}
    </Button>
    <Button variant="ghost" onClick={handleDismiss}>
      Maybe later
    </Button>
  </div>

  <button className="close" onClick={handleClose}>
    ✕
  </button>
</NudgePopup>
```

**Delivery Timing:**

```typescript
const shouldShowNudge = (student: Student): boolean => {
  const lastNudge = student.metadata.lastNudgeShown;
  if (!lastNudge) return true;

  const hoursSinceLastNudge =
    (Date.now() - new Date(lastNudge).getTime()) / (1000 * 60 * 60);

  // Max 1 nudge per 24 hours
  if (hoursSinceLastNudge < 24) return false;

  const churnRisk = detectChurnRisk(student);

  // Show for medium/high risk only
  return churnRisk.level !== "none";
};
```

---

### 7. Streak System

#### Visual Design

**Streak Counter (Top Bar)**

```
┌───────────────────┐
│  🔥 3 Day Streak  │
│  Keep it going!   │
└───────────────────┘
```

**Design Specs:**

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
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  transform: rotate(-1deg);
}

.streak-counter .fire-emoji {
  font-size: 24px;
  animation: flicker 1.5s ease-in-out infinite;
}

@keyframes flicker {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  75% {
    transform: scale(1.1) rotate(5deg);
  }
}
```

**Milestone Celebrations:**

- **Day 3:** "🔥 3-Day Streak!" + achievement unlock
- **Day 7:** "🎉 One Week!" + confetti animation
- **Day 14:** "⭐ Two Weeks Strong!" + badge upgrade
- **Day 30:** "🏆 30-Day Legend!" + special animation

**Progress Visualization:**

```
Current Streak: 5 days
🔥 🔥 🔥 🔥 🔥 ⚪ ⚪

Longest Streak: 8 days
Beat it by studying 4 more days in a row!
```

#### Tracking Logic

```typescript
const updateStreak = (student: Student): Student => {
  const now = new Date();
  const lastActive = new Date(student.streaks.lastActiveDate);

  // Reset date to midnight for day comparison
  const today = new Date(now.setHours(0, 0, 0, 0));
  const lastActiveDay = new Date(lastActive.setHours(0, 0, 0, 0));

  const daysDiff = Math.floor(
    (today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  let newStreak = student.streaks.current;

  if (daysDiff === 0) {
    // Same day, no change
    return student;
  } else if (daysDiff === 1) {
    // Next day, increment
    newStreak += 1;
  } else {
    // Missed days, reset
    newStreak = 1;
  }

  // Update longest if exceeded
  const longestStreak = Math.max(newStreak, student.streaks.longest);

  return {
    ...student,
    streaks: {
      current: newStreak,
      longest: longestStreak,
      lastActiveDate: now.toISOString(),
    },
  };
};
```

**Dual Tracking (Login + Practice):**

```typescript
interface StreakData {
  loginStreak: {
    current: number;
    longest: number;
  };
  practiceStreak: {
    current: number;
    longest: number;
  };
  lastLoginDate: string;
  lastPracticeDate: string;
}

// Update on login
const updateLoginStreak = (student: Student): Student => {
  // ... similar logic to updateStreak
};

// Update on task completion
const updatePracticeStreak = (student: Student): Student => {
  // ... similar logic but checks lastPracticeDate
};
```

**Streak Recovery Encouragement:**

```typescript
const generateStreakRecoveryMessage = (student: Student): string => {
  const brokenStreak = student.streaks.longest;
  const currentStreak = student.streaks.current;

  if (currentStreak === 0 && brokenStreak > 0) {
    return `Your ${brokenStreak}-day streak ended, but you can start fresh today! 💪`;
  }

  if (currentStreak > 0 && currentStreak < brokenStreak) {
    const daysToGo = brokenStreak - currentStreak;
    return `${daysToGo} more ${
      daysToGo === 1 ? "day" : "days"
    } to beat your record of ${brokenStreak}! 🔥`;
  }

  if (currentStreak === brokenStreak) {
    return `Tied your record! One more day to set a new one! 🏆`;
  }

  if (currentStreak > brokenStreak) {
    return `New record! ${currentStreak} days - you're unstoppable! 🚀`;
  }

  return `Keep the streak alive! 🔥`;
};
```

---

### 8. Friend Connections & Social Features

#### Functionality

**Friend List UI:**

```
┌──────────────────────────────┐
│  👥 Your Study Buddies       │
│                              │
│  ┌────────────────────────┐ │
│  │ 👧 Eva                 │ │
│  │ 📚 Reading 68%         │ │
│  │ 🔥 3-day streak        │ │
│  │ [Send message]         │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ 👦 Lucas               │ │
│  │ 🎓 Math 72%            │ │
│  │ 🔥 5-day streak        │ │
│  │ [Send message]         │ │
│  └────────────────────────┘ │
│                              │
│  [+ Add Friend]              │
└──────────────────────────────┘
```

**Message Templates (AI-Generated, Whitelisted):**

```typescript
const generateFriendMessage = async (
  sender: Student,
  recipient: Student,
  context: "milestone" | "encouragement" | "challenge"
): Promise<string> => {
  const prompt = `
    Generate a short, positive, age-appropriate message from ${
      sender.name
    } (age ${sender.age}) 
    to ${recipient.name} (age ${recipient.age}) about studying.
    
    Context: ${context}
    ${
      context === "milestone" ? `${sender.name} just completed a milestone` : ""
    }
    ${
      context === "encouragement"
        ? `${sender.name} wants to encourage ${recipient.name}`
        : ""
    }
    ${
      context === "challenge"
        ? `${sender.name} wants to suggest studying together`
        : ""
    }
    
    Requirements:
    - Max 2 sentences
    - Positive and encouraging only
    - No personal information
    - Learning-focused
    - Age-appropriate
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You generate safe, positive messages between students.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 50,
  });

  return response.choices[0].message.content;
};
```

**Safety Validation:**

```typescript
const validateFriendMessage = (message: string): ValidationResult => {
  const blockedPatterns = [
    /\b(phone|number|address|email|meet|location)\b/i,
    /\b(snapchat|instagram|facebook|whatsapp)\b/i,
    /\b(send.*picture|photo)\b/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(message)) {
      return {
        valid: false,
        reason: "Contains blocked content",
      };
    }
  }

  // Check sentiment
  const sentiment = analyzeSentiment(message);
  if (sentiment.score < 0) {
    return {
      valid: false,
      reason: "Negative sentiment detected",
    };
  }

  return { valid: true };
};
```

**3-Per-Day Limit:**

```typescript
const canSendFriendMessage = (student: Student): boolean => {
  const today = new Date().toDateString();
  const messagesSentToday = student.friendMessages.filter(
    (msg) => new Date(msg.sentAt).toDateString() === today
  ).length;

  return messagesSentToday < 3;
};
```

**Message Selection Interface:**

```tsx
<MessageSelector>
  <h3>Send a message to {friend.name}</h3>

  <div className="quick-messages">
    <MessageOption onClick={() => selectMessage("encouragement")}>
      🌟 Send encouragement
    </MessageOption>
    <MessageOption onClick={() => selectMessage("milestone")}>
      🎉 Share your progress
    </MessageOption>
    <MessageOption onClick={() => selectMessage("challenge")}>
      🤝 Study together challenge
    </MessageOption>
  </div>

  {selectedType && (
    <div className="preview">
      <p>Your message:</p>
      <div className="message-bubble">{generatedMessage}</div>
      <Button onClick={sendMessage}>Send!</Button>
    </div>
  )}

  <p className="limit-note">{3 - messagesSentToday} messages left today</p>
</MessageSelector>
```

---

### 9. Tutor Booking & Handoff System

#### Struggle Detection

**Trigger Conditions:**

```typescript
const detectStruggle = (student: Student, topic: string): StruggleDetection => {
  const topicData = findTopic(student, topic);
  if (!topicData) return { struggling: false };

  // Check 1: Concept repeated 3+ times with incorrect answers
  const recentAttempts =
    topicData.subConcepts?.flatMap((sc) => ({
      correct: sc.attemptsCorrect,
      total: sc.attemptsTotal,
    })) || [];

  const recentIncorrect = recentAttempts
    .slice(-5)
    .filter((a) => a.total - a.correct >= 3);

  if (recentIncorrect.length > 0) {
    return {
      struggling: true,
      reason: "repeated_incorrect",
      attempts: recentIncorrect.length,
    };
  }

  // Check 2: Student explicitly says "I don't understand"
  const recentMessages = getRecentMessages(student, 5);
  const frustrationKeywords = [
    "don't understand",
    "confused",
    "help",
    "stuck",
    "don't get it",
  ];

  const frustrationDetected = recentMessages.some((msg) =>
    frustrationKeywords.some((keyword) =>
      msg.message.toLowerCase().includes(keyword)
    )
  );

  if (frustrationDetected) {
    return {
      struggling: true,
      reason: "expressed_confusion",
      messages: recentMessages.filter((m) =>
        frustrationKeywords.some((k) => m.message.toLowerCase().includes(k))
      ),
    };
  }

  // Check 3: Progress stalled (<5% improvement in 3+ sessions)
  const progressHistory = topicData.progressHistory || [];
  if (progressHistory.length >= 3) {
    const recentProgress = progressHistory.slice(-3);
    const progressGain =
      recentProgress[recentProgress.length - 1] - recentProgress[0];

    if (progressGain < 5) {
      return {
        struggling: true,
        reason: "stalled_progress",
        progressGain,
      };
    }
  }

  return { struggling: false };
};
```

#### Booking Flow

**Tutor Suggestion Prompt:**

```tsx
<TutorSuggestion>
  <AICharacter expression="encouraging" />

  <p>
    {topic} is tricky! Want me to set up a review session with {tutor.name}?
    They're great at explaining this!
  </p>

  <div className="actions">
    <Button variant="primary" onClick={handleYes}>
      Yes, please!
    </Button>
    <Button variant="ghost" onClick={handleNo}>
      Not right now
    </Button>
  </div>
</TutorSuggestion>
```

**Booking Modal:**

```
┌────────────────────────────────────┐
│  📅 Book a Session                 │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  [Photo]  Dr. Sarah Chen     │ │
│  │  ⭐ Math & Science Specialist │ │
│  │  📊 Helped 50+ students      │ │
│  └──────────────────────────────┘ │
│                                    │
│  Topic: Fractions (thirds)         │
│                                    │
│  Why book?                         │
│  • 4 incorrect attempts            │
│  • Expressed confusion             │
│  • Need visual explanation         │
│                                    │
│  Preferred Time:                   │
│  ○ Tomorrow 3pm                    │
│  ○ Friday 4pm                      │
│  ○ Saturday 10am                   │
│                                    │
│  [Request Session]  [Cancel]       │
└────────────────────────────────────┘
```

**Design Specs:**

```css
.booking-modal {
  width: 500px;
  max-width: 90vw;
  padding: 32px;
  background: white;
  border: 4px solid var(--doodle-sketch);
  border-radius: 20px;
}

.tutor-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--doodle-cream);
  border: 2px solid var(--doodle-sketch);
  border-radius: 12px;
  margin-bottom: 20px;
}

.tutor-photo {
  width: 80px;
  height: 80px;
  border: 2px solid var(--doodle-sketch);
  border-radius: 50%;
  object-fit: cover;
}

.time-slot {
  padding: 12px;
  background: white;
  border: 2px solid var(--doodle-sketch);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-slot:hover {
  background: var(--doodle-yellow);
  transform: translateY(-2px);
}

.time-slot.selected {
  background: var(--doodle-green);
  border-width: 3px;
}
```

#### Handoff Notes Generation

**Auto-Generated Summary:**

```typescript
const generateHandoffNotes = (
  student: Student,
  topic: string,
  struggle: StruggleDetection
): HandoffNotes => {
  const topicData = findTopic(student, topic);

  const notes = {
    student: {
      name: student.name,
      age: student.age,
      grade: student.grade,
    },
    struggleTopic: topic,
    analysis: {
      attemptsTotal: calculateTotalAttempts(topicData),
      successRate: calculateSuccessRate(topicData),
      strugglingConcepts: identifyStrugglingConcepts(topicData),
      timeSpent: calculateTimeSpent(topicData),
    },
    context: {
      strengths: identifyStrengths(student, topic),
      learningStyle: inferLearningStyle(student),
      recentProgress: getRecentProgress(topicData),
    },
    suggestedFocus: generateSuggestedFocus(student, topicData, struggle),
    conversationExcerpts: getRelevantConversations(student, topic),
  };

  return notes;
};

const generateSuggestedFocus = (
  student: Student,
  topicData: Topic,
  struggle: StruggleDetection
): string => {
  const suggestions: string[] = [];

  if (struggle.reason === "repeated_incorrect") {
    suggestions.push(
      "Focus on core concept understanding before moving to practice"
    );
  }

  if (student.age <= 11) {
    suggestions.push("Use visual models and hands-on demonstrations");
    suggestions.push("Keep explanations short (under 2 minutes)");
  }

  const strugglingConcepts = identifyStrugglingConcepts(topicData);
  if (strugglingConcepts.length > 0) {
    suggestions.push(
      `Specific concepts to review: ${strugglingConcepts.join(", ")}`
    );
  }

  return suggestions.join("\n• ");
};
```

**Handoff Notes Display (For Tutor):**

```
┌────────────────────────────────────┐
│  📋 Session Prep: Lucas            │
│                                    │
│  Student Info                      │
│  • Name: Lucas                     │
│  • Age: 9 (4th grade)              │
│  • Learning Style: Visual learner  │
│                                    │
│  Struggle Topic: Fractions (thirds)│
│  • 4 practice problems attempted   │
│  • 2 correct, 2 incorrect          │
│  • 15 minutes spent on topic       │
│                                    │
│  Strengths                         │
│  • Understands halves and quarters │
│  • Good with visual models         │
│  • Asks clarifying questions       │
│                                    │
│  Struggling Concepts               │
│  • Dividing objects into thirds    │
│  • Comparing 1/3 to other fractions│
│                                    │
│  Suggested Focus                   │
│  • Use pizza/pie visual models     │
│  • Practice with real objects      │
│  • Short explanations (<2 min)     │
│  • Build on existing knowledge     │
│    of halves and quarters          │
│                                    │
│  Recent Conversation               │
│  Lucas: "I don't get how to make   │
│         three equal pieces"        │
│  AI: "Let's try dividing a circle  │
│       into three parts..."         │
│                                    │
│  [Start Session]                   │
└────────────────────────────────────┘
```

---

## 📱 Responsive Design & Performance

### Breakpoint Strategy

```css
/* Mobile First Approach */
:root {
  --container-max: 1200px;
  --sidebar-width: 280px;
  --mobile: 768px;
  --tablet: 1024px;
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }

  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateY(0);
  }

  .ai-character {
    width: 80px;
    height: 80px;
  }
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .layout {
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "progress main"
      "progress main";
  }

  .tasks-sidebar {
    position: fixed;
    right: -300px;
    transition: right 0.3s ease;
  }

  .tasks-sidebar.open {
    right: 0;
  }
}

/* Desktop (> 1024px) */
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 280px 1fr 320px;
    grid-template-areas: "progress main tasks";
  }
}
```

### Mobile-Specific Adaptations

**Touch-Friendly Interactions:**

```css
/* Minimum touch target: 44x44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* Prevent double-tap zoom */
button,
a {
  touch-action: manipulation;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
```

**Simplified Animations (Performance):**

```typescript
const isMobile = window.innerWidth < 768;

const mobileOptimizedVariants = {
  idle: isMobile
    ? { scale: 1 } // Static on mobile
    : { scale: [1, 1.05, 1] }, // Animated on desktop

  bounceIn: isMobile
    ? {
        // Simpler animation
        scale: [0, 1],
        transition: { duration: 0.2 },
      }
    : {
        // Full animation
        scale: [0, 1.2, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      },
};
```

**Bottom Sheet for Mobile:**

```css
.mobile-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 4px solid var(--doodle-sketch);
  border-radius: 20px 20px 0 0;
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 100;
}

.mobile-bottom-sheet.open {
  transform: translateY(0);
}

.mobile-bottom-sheet::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: var(--doodle-sketch);
  border-radius: 2px;
}
```

### Performance Optimization

**Image Optimization:**

```typescript
// Use Next.js Image component with optimization
import Image from "next/image";

<Image
  src="/assets/illustrations/character.svg"
  alt="AI Character"
  width={150}
  height={150}
  priority={true} // For above-the-fold images
  placeholder="blur" // With blurDataURL for PNGs
/>;
```

**Code Splitting:**

```typescript
// Lazy load non-critical components
import dynamic from "next/dynamic";

const AchievementModal = dynamic(() => import("./AchievementModal"), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Don't render on server
});

const TutorBooking = dynamic(() => import("./TutorBooking"), {
  loading: () => <LoadingSkeleton />,
});
```

**Animation Performance:**

```typescript
// Use will-change for animated elements
const optimizedAnimationStyles = {
  willChange: "transform, opacity",
  transform: "translateZ(0)", // Force GPU acceleration
};

// Limit concurrent animations
const AnimationQueue = {
  maxConcurrent: 3,
  queue: [],
  active: 0,

  add: (animation: () => void) => {
    if (this.active < this.maxConcurrent) {
      this.active++;
      animation();
      setTimeout(() => this.active--, 500);
    } else {
      this.queue.push(animation);
    }
  },
};
```

**Bundle Size Management:**

```json
// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        framer: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          priority: 10
        },
        openai: {
          test: /[\\/]node_modules[\\/]openai[\\/]/,
          name: 'openai',
          priority: 10
        }
      }
    };
    return config;
  }
};
```

---

## ✅ Complete Acceptance Criteria

### Phase 1 Completion (Existing Features)

- [ ] ✓ Project structure and dependencies installed
- [ ] ✓ Three-column layout renders correctly
- [ ] ✓ Mock data loads and displays
- [ ] ✓ Progress card shows topic breakdown
- [ ] ✓ Task sidebar displays tasks with status
- [ ] ✓ Streak counter visible and updates
- [ ] ✓ Chat interface functional
- [ ] ✓ Student switching works

### Phase 2: Missing Features Implementation

- [ ] **Authentication System**
  - [ ] Login screen displays student options
  - [ ] Student selection works correctly
  - [ ] Session persists across page reloads
  - [ ] Logout clears session and redirects
- [ ] **Onboarding Flow**
  - [ ] Welcome screen appears for first-time users
  - [ ] AI character introduces itself with animation
  - [ ] Color picker allows selection from 8 colors
  - [ ] Selected color applies to AI character
  - [ ] Tutorial highlights all major UI features
  - [ ] Goal setup allows selecting up to 3 subjects
  - [ ] Onboarding can be skipped by returning users
  - [ ] Completion status saved to student profile
- [ ] **Achievement System**
  - [ ] All 12 achievement badges defined
  - [ ] Trigger logic works for each achievement
  - [ ] Unlock animation plays smoothly
  - [ ] Badge collection grid displays correctly
  - [ ] Locked badges show as grayed out
  - [ ] Achievement notification appears on unlock
  - [ ] Progress tracking shows X/12 achievements

### Phase 2: OpenAI Integration

- [ ] API key configured in environment variables
- [ ] aiService connects to OpenAI successfully
- [ ] Conversation context includes last 10-15 messages
- [ ] Age-appropriate system prompts work correctly
- [ ] Responses match student's age and tone
- [ ] Token usage is monitored and logged
- [ ] Error handling displays friendly messages
- [ ] Loading state shows while AI thinks
- [ ] Conversation history summarization works

### Phase 2: UI/UX Redesign

- [ ] **Design System**
  - [ ] All fonts loaded and applied correctly
  - [ ] Color palette implemented in Tailwind config
  - [ ] Animation variants defined in Framer Motion
  - [ ] Base component styles follow doodle aesthetic
- [ ] **Component Redesign**
  - [ ] Home page: Student cards have sketchy borders and doodle decorations
  - [ ] AI character: Displays with customized color, breathing animation works
  - [ ] Chat bubbles: Speech bubble style with tails pointing correctly
  - [ ] Progress bars: Hand-drawn style with animated fill
  - [ ] Buttons: Sketchy borders with hover/tap animations
  - [ ] Cards: Doodle borders with corner decorations
  - [ ] Input fields: Underline style with focus effects
  - [ ] Task cards: Highlighted by status (amber for incomplete)
- [ ] **Animations**
  - [ ] AI character breathing animation (idle state)
  - [ ] AI character thinking animation (pencil orbiting)
  - [ ] AI character celebrating animation (stars/sparkles)
  - [ ] Message bounce-in animation
  - [ ] Button hover/tap effects
  - [ ] Progress bar fill animation
  - [ ] Achievement unlock sequence
  - [ ] All animations run at 60fps on desktop
  - [ ] Simplified animations work smoothly on mobile

### Phase 2: Core Feature Completeness

- [ ] **Task Generation**
  - [ ] Multiple choice tasks generate correctly
  - [ ] Open-ended tasks generate correctly
  - [ ] Real-world tasks generate correctly
  - [ ] Difficulty adapts based on student progress
  - [ ] AI-powered generation produces appropriate content
  - [ ] Tasks appear in sidebar with correct status
  - [ ] Task completion updates progress
- [ ] **Nudge System**
  - [ ] Churn detection identifies at-risk students (Mia)
  - [ ] Nudges appear as popup with correct timing
  - [ ] Celebration-first messaging strategy works
  - [ ] Maximum 1 nudge per 24 hours enforced
  - [ ] Dismiss and "Maybe later" options work
  - [ ] Nudge acceptance triggers appropriate action
- [ ] **Streak System**
  - [ ] Login streak tracks correctly
  - [ ] Practice streak tracks correctly
  - [ ] Streak counter displays in top bar
  - [ ] Fire emoji animates with flicker effect
  - [ ] Milestone celebrations trigger at 3, 7, 14, 30 days
  - [ ] Longest streak is tracked and displayed
  - [ ] Streak recovery messages appear when appropriate
- [ ] **Friend Connections**
  - [ ] Friend list displays connected students
  - [ ] Message templates generate via AI
  - [ ] Safety validation blocks inappropriate content
  - [ ] 3-messages-per-day limit enforced
  - [ ] Message selector UI works correctly
  - [ ] Messages appear in recipient's activity feed
- [ ] **Tutor Booking**
  - [ ] Struggle detection identifies when to suggest booking
  - [ ] Tutor suggestion prompt appears contextually
  - [ ] Booking modal displays tutor info
  - [ ] Time slot selection works
  - [ ] Booking request is created and logged
  - [ ] Handoff notes generate automatically
  - [ ] Handoff notes include all required information
- [ ] **Topic Switching**
  - [ ] Student can manually switch topics via dropdown
  - [ ] AI can suggest topic changes
  - [ ] Confirmation required for AI suggestions
  - [ ] Context preserves between topic switches
  - [ ] Progress card updates to show active topic

### Phase 2: Safety & Content Moderation

- [ ] Content filter blocks inappropriate topics
- [ ] Homework helper gives hints instead of answers
- [ ] Friend messages validated for safety
- [ ] Conversation logging works correctly
- [ ] Parent/tutor view shows conversation history
- [ ] Age-appropriate content enforcement works

### Phase 2: Responsive Design

- [ ] Mobile (< 768px):
  - [ ] Single column layout
  - [ ] Bottom sheet for progress/tasks
  - [ ] Touch-friendly buttons (min 44x44px)
  - [ ] Simplified animations
  - [ ] Scrolling works smoothly
- [ ] Tablet (768px - 1024px):
  - [ ] Two column layout (progress + main)
  - [ ] Sliding tasks sidebar
  - [ ] Appropriate font sizes
- [ ] Desktop (> 1024px):
  - [ ] Three column layout
  - [ ] All animations at full quality
  - [ ] Hover effects work correctly

### Phase 2: Performance & Accessibility

- [ ] Initial page load < 2 seconds
- [ ] Animations run at 60fps on target devices
- [ ] No layout shift during load (CLS < 0.1)
- [ ] Images optimized and lazy-loaded
- [ ] Code split for non-critical components
- [ ] WCAG 2.1 AA color contrast ratios met
- [ ] Keyboard navigation works throughout
- [ ] Screen reader labels present on interactive elements
- [ ] Focus indicators visible on all focusable elements

### Phase 2: Polish & User Experience

- [ ] Loading states are pleasant (doodle animations)
- [ ] Error states are friendly and helpful
- [ ] Success confirmations use celebrations
- [ ] Empty states have encouraging messages
- [ ] Transitions feel smooth and natural
- [ ] No jarring visual changes
- [ ] Consistent voice/tone throughout
- [ ] First-time user can complete onboarding in < 2 minutes
- [ ] Returning user can access main features immediately

---

## 🗺️ Implementation Roadmap

### Week 1: Foundation + Critical Systems

**Day 1: Design System Setup (6-8 hours)**

- [ ] Install and configure Google Fonts
- [ ] Extend Tailwind config with doodle colors
- [ ] Create animation variants library
- [ ] Build base component styles
- [ ] Test animations on target devices
- [ ] Create design system documentation

**Day 2: Authentication & Onboarding (8-10 hours)**

- [ ] Build login screen with student selector
- [ ] Implement authService with session management
- [ ] Create onboarding flow orchestrator
- [ ] Build welcome screen with AI intro
- [ ] Implement color picker with preview
- [ ] Create tutorial overlay system
- [ ] Build goal setup screen
- [ ] Test complete flow end-to-end

**Day 3: Achievement System (6-8 hours)**

- [ ] Define all 12 achievements in data
- [ ] Build achievementService with trigger logic
- [ ] Create achievement unlock animation
- [ ] Build badge collection grid
- [ ] Implement notification toast
- [ ] Wire triggers throughout app
- [ ] Test all achievement unlocks

**Day 4: OpenAI Integration (8-10 hours)**

- [ ] Configure API key in environment
- [ ] Verify existing aiService implementation
- [ ] Implement context window management
- [ ] Add age-appropriate system prompts
- [ ] Build conversation summarization
- [ ] Add token usage monitoring
- [ ] Implement error handling
- [ ] Test with all age groups

**Day 5: Component Redesign Batch 1 (8-10 hours)**

- [ ] Redesign home page (student cards)
- [ ] Redesign AI character with expressions
- [ ] Redesign chat bubbles with speech tails
- [ ] Redesign progress bars with hand-drawn style
- [ ] Redesign buttons with sketchy borders
- [ ] Add hover/tap animations
- [ ] Test responsiveness

### Week 2: Core Features + UI Polish

**Day 6: Task Generation System (8-10 hours)**

- [ ] Implement task generation logic
- [ ] Build multiple choice task component
- [ ] Build open-ended task component
- [ ] Build real-world task component
- [ ] Add difficulty adaptation
- [ ] Wire AI-powered generation
- [ ] Test task assignment and completion

**Day 7: Nudge System (6-8 hours)**

- [ ] Implement churn detection logic
- [ ] Build nudge popup component
- [ ] Create message templates
- [ ] Add celebration-first logic
- [ ] Implement frequency limiting
- [ ] Wire triggers for at-risk students
- [ ] Test nudge delivery and dismissal

**Day 8: Streak System (6-8 hours)**

- [ ] Implement dual streak tracking
- [ ] Build streak counter component
- [ ] Add milestone celebrations
- [ ] Create streak recovery messages
- [ ] Wire updates on login/practice
- [ ] Test streak persistence
- [ ] Verify achievements trigger correctly

**Day 9: Component Redesign Batch 2 (8-10 hours)**

- [ ] Redesign cards with doodle borders
- [ ] Redesign input fields with underline style
- [ ] Redesign task sidebar
- [ ] Add decorative doodles
- [ ] Implement background textures
- [ ] Polish typography
- [ ] Mobile responsiveness testing

**Day 10: Integration Testing (6-8 hours)**

- [ ] End-to-end user flow testing
- [ ] Cross-browser compatibility
- [ ] Mobile device testing
- [ ] Performance profiling
- [ ] Animation smoothness verification
- [ ] Bug fixes and polish

### Week 3: Social Features + Final Polish

**Day 11: Friend Connections (8-10 hours)**

- [ ] Build friend list component
- [ ] Implement message generator
- [ ] Add safety validation
- [ ] Create message selector UI
- [ ] Implement 3/day limit
- [ ] Build activity feed
- [ ] Test message flow

**Day 12: Tutor Booking System (8-10 hours)**

- [ ] Implement struggle detection
- [ ] Build tutor suggestion prompt
- [ ] Create booking modal
- [ ] Add time slot selector
- [ ] Implement handoff notes generation
- [ ] Wire booking request creation
- [ ] Test complete booking flow

**Day 13: Topic Switching & Navigation (6-8 hours)**

- [ ] Build topic dropdown
- [ ] Implement AI suggestion logic
- [ ] Add confirmation dialog
- [ ] Ensure context preservation
- [ ] Wire progress card updates
- [ ] Test multi-subject workflows

**Day 14: Design Asset Integration (6-8 hours)**

- [ ] Source and license doodle assets
- [ ] Integrate illustrations
- [ ] Add decorative elements
- [ ] Create subject icons
- [ ] Add tutor photos
- [ ] Optimize all images

**Day 15: Final Polish & Testing (8-10 hours)**

- [ ] Performance optimization
- [ ] Accessibility audit and fixes
- [ ] Mobile responsiveness final pass
- [ ] Animation smoothness verification
- [ ] Loading states polish
- [ ] Error handling improvements
- [ ] Documentation updates

**Day 16: User Acceptance Testing (6-8 hours)**

- [ ] Complete user flow walkthroughs
- [ ] Test with all 4 student personas
- [ ] Verify all acceptance criteria
- [ ] Stakeholder demo preparation
- [ ] Bug fixes from testing
- [ ] Final deployment preparation

---

## 📚 Doodle Asset Recommendations

### Illustration Packs

**Free Options:**

1. **unDraw** (https://undraw.co/)

   - Customizable illustrations
   - Can adjust colors to match palette
   - Hand-drawn style available
   - License: Open source

2. **Blush** (https://blush.design/)

   - Free tier available
   - Doodle-style collections
   - Mix and match elements
   - License: Free for personal/commercial

3. **DrawKit** (https://www.drawkit.com/)

   - Free packs available
   - Hand-drawn aesthetics
   - Education-themed sets
   - License: MIT (free packs)

4. **Humaaans** (https://www.humaaans.com/)
   - Customizable character illustrations
   - Doodle-friendly
   - Mix and match
   - License: CC BY

**Premium Options ($):**

1. **Stubborn Illustrations** ($39)
   - 30+ hand-drawn scenes
   - Education theme
   - Fully customizable
2. **Doodle Library** ($49)
   - 100+ hand-drawn elements
   - Animations included
   - SVG format

### Icon Sets

**Free:**

1. **Doodle Icons** (Noun Project)

   - Search "doodle" or "hand-drawn"
   - Free with attribution
   - SVG format

2. **Hand Drawn Icons** (Iconfinder)
   - Filter by "hand drawn" style
   - Many free options
   - Various formats

**Premium ($):**

1. **Streamline Doodle** ($149)
   - 1000+ hand-drawn icons
   - Consistent style
   - Multiple formats

### Fonts (All Free)

**Google Fonts:**

- Caveat (headings)
- Patrick Hand (body text)
- Indie Flower (decorative)
- Comic Neue (AI messages)
- Architects Daughter (alternate)
- Shadows Into Light (alternate)

### Animation Assets

**LottieFiles** (https://lottiefiles.com/)

- Search: "hand drawn", "doodle", "sketch"
- Free animations available
- JSON format for Lottie
- Categories: education, celebration, loading

**Recommended Animations:**

- Loading spinners (hand-drawn)
- Celebration confetti (sketchy)
- Check marks (animated)
- Stars/sparkles (doodle style)

### Background Patterns

**Subtle Patterns** (https://www.toptal.com/designers/subtlepatterns/)

- Paper textures
- Notebook lines
- Dot grids
- All free, seamless

**Custom Creation:**

- Use Figma/Sketch to create custom doodles
- Export as SVG
- Optimize with SVGO
- Convert to background patterns

### Setup Guide

**Directory Structure:**

```
/public/assets
  /illustrations
    - ai-character.svg
    - celebration.svg
    - books.svg
    - lightbulb.svg
  /icons
    - math.svg
    - science.svg
    - reading.svg
    - writing.svg
  /animations
    - confetti.json
    - loading.json
    - checkmark.json
  /patterns
    - paper-texture.png
    - dots.svg
    - doodles-bg.svg
  /tutors
    - sarah-chen.jpg
    - james-rodriguez.jpg
    - aisha-patel.jpg
```

**Integration Example:**

```typescript
// Icon component
import MathIcon from "@/public/assets/icons/math.svg";

<MathIcon
  className="subject-icon"
  fill="var(--doodle-blue)"
  width={32}
  height={32}
/>;

// Lottie animation
import Lottie from "lottie-react";
import confettiAnimation from "@/public/assets/animations/confetti.json";

<Lottie animationData={confettiAnimation} loop={false} autoplay={true} />;
```

---

## 🧪 Testing Strategy

### Unit Testing

**Test Coverage Targets:**

- Services: 80%+
- Utilities: 90%+
- Components: 70%+

**Key Areas:**

```typescript
// Example: achievementService tests
describe("achievementService", () => {
  test("unlocks First Steps on first conversation", () => {
    const student = mockStudent();
    const achievements = checkAchievements(student, "conversation_complete");
    expect(achievements).toContain("first-steps");
  });

  test("unlocks 3-Day Streak on third consecutive day", () => {
    const student = mockStudentWithStreak(3);
    const achievements = checkStreakAchievements(student);
    expect(achievements).toContain("3-day-streak");
  });

  test("does not re-unlock existing achievements", () => {
    const student = mockStudentWithAchievements(["first-steps"]);
    const achievements = checkAchievements(student, "conversation_complete");
    expect(achievements).not.toContain("first-steps");
  });
});
```

### Integration Testing

**User Flow Tests:**

```typescript
// Example: Onboarding flow
describe("Onboarding Flow", () => {
  test("completes full onboarding for new user", async () => {
    render(<App />);

    // Login
    const lucasCard = screen.getByText("Lucas");
    await userEvent.click(lucasCard);

    // Welcome screen
    expect(screen.getByText(/Hi there!/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Let's go!/i));

    // Color picker
    const purpleColor = screen.getByLabelText("Magic Purple");
    await userEvent.click(purpleColor);
    await userEvent.click(screen.getByText(/Choose!/i));

    // Tutorial (skip for test speed)
    await userEvent.click(screen.getByText(/Skip tutorial/i));

    // Goal setup
    await userEvent.click(screen.getByLabelText("Math"));
    await userEvent.click(screen.getByText(/Start!/i));

    // Verify reached dashboard
    expect(screen.getByText(/Hi Lucas!/i)).toBeInTheDocument();
  });
});
```

### Visual Regression Testing

**Screenshot Comparisons:**

- Use Playwright or Chromatic
- Compare before/after redesign
- Capture key states (idle, hover, active)
- Test across breakpoints

### Performance Testing

**Lighthouse Targets:**

- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 90+

**Custom Metrics:**

```typescript
// Animation FPS monitoring
const measureAnimationPerformance = () => {
  let lastTime = performance.now();
  let frames = 0;

  const checkFPS = () => {
    const currentTime = performance.now();
    frames++;

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      console.log(`FPS: ${fps}`);

      if (fps < 55) {
        console.warn("Animation performance below 60fps");
      }

      frames = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(checkFPS);
  };

  requestAnimationFrame(checkFPS);
};
```

### User Acceptance Testing

**Test Scripts:**

1. **New User Journey**

   - Login as new student
   - Complete onboarding
   - Have first conversation
   - Complete first task
   - Earn first achievement

2. **Returning User Journey**

   - Login as Eva
   - View progress
   - Ask AI a question
   - Switch topics
   - Complete a task

3. **At-Risk User Journey**

   - Login as Mia
   - Simulate churn conditions
   - Trigger nudge
   - Accept nudge
   - Complete quick task

4. **Multi-Goal User Journey**
   - Login as Pat
   - Work on SAT Math
   - Complete goal
   - Receive subject suggestion
   - Add College Essays goal

---

## 💰 Cost Estimates

### Development Time

- Design System: 6-8 hours
- Authentication + Onboarding: 8-10 hours
- Achievement System: 6-8 hours
- OpenAI Integration: 8-10 hours
- Component Redesign: 16-20 hours
- Core Features: 20-30 hours
- Social + Tutor Features: 16-20 hours
- Testing + Polish: 14-18 hours
- **Total: 94-124 hours (~2.5-3 weeks full-time)**

### Assets

- **DIY (Free):**

  - Use free illustration packs
  - Google Fonts (free)
  - Free icons and animations
  - **Cost: $0**

- **Mixed (Recommended):**

  - Free illustrations + premium icon set
  - All fonts free
  - Some premium animations
  - **Cost: $50-150**

- **Premium:**
  - Custom illustrations commissioned
  - Premium asset packs
  - **Cost: $500-1000**

### OpenAI API Costs

**Estimates per student per month:**

- Conversations: ~20 messages
- Task generation: ~10 tasks
- Friend messages: ~15 messages
- Average tokens: ~50,000 total
- **Cost: $1.50-2.00 per student/month**

**With 100 active students:**

- $150-200/month

**Optimization strategies:**

- Context window pruning
- Task caching
- Batch operations
- **Optimized cost: $100-150/month**

---

## 📞 Stakeholder Demo Plan

### Demo Structure (30 minutes)

**Part 1: Product Vision (5 min)**

- Problem statement: 52% churn after first goal
- Solution: AI companion with retention mechanics
- Target outcomes: <30% churn, 15+ min sessions

**Part 2: Design Transformation (5 min)**

- Show before (current clean UI)
- Show after (doodle aesthetic)
- Explain age-appropriate appeal
- Discuss Khanmigo inspiration

**Part 3: Core Features Demo (15 min)**

1. **Onboarding Flow** (3 min)

   - New user experience
   - Color personalization
   - Quick, engaging setup

2. **Age-Appropriate Adaptation** (3 min)

   - Lucas (9): Simple, encouraging
   - Eva (12): Balanced
   - Pat (16): Academic, challenging

3. **Retention Mechanics** (4 min)

   - Churn detection (show Mia)
   - Nudge delivery
   - Celebration-first messaging
   - Achievement unlocks

4. **Learning Features** (5 min)
   - AI conversation with context
   - Adaptive task generation
   - Struggle detection
   - Tutor booking flow

**Part 4: Metrics & Next Steps (5 min)**

- Phase 1 foundation review
- Phase 2 enhancements completed
- Success metrics framework
- Phase 3 roadmap (backend integration)
- Q&A

### Demo Script

**Opening:**

> "Welcome! Today I'll show you how we've transformed the AI Study Companion from a functional MVP into an engaging, playful learning experience that keeps students coming back.
>
> Our research showed that 52% of students churn after completing their first goal. We've built a system specifically designed to combat this through continuous engagement, adaptive learning, and delightful interactions."

**Design Transformation:**

> "Let me show you the evolution. This is where we started—clean, functional, but corporate. Here's where we are now—playful, hand-drawn, inviting. Every interaction feels like an adventure, not a chore.
>
> We took inspiration from Khanmigo and other beloved education platforms, creating a doodle aesthetic that appeals to our 9-16 age range while maintaining professionalism for parents and educators."

**Core Demo:**

> "Let's follow Lucas, a 9-year-old working on elementary math. Watch how the system adapts to his age...
>
> [Show onboarding, conversation, task completion, achievement unlock]
>
> Now here's Mia, showing early churn signs. The system detects this and intervenes...
>
> [Show nudge system, celebrate-first messaging]
>
> And here's the magic—when students struggle, the AI doesn't just keep trying. It suggests connecting with a human tutor, providing detailed handoff notes..."

**Closing:**

> "We've built a foundation that's ready to scale. The service layer architecture means moving to a real backend is straightforward. The mock data has proven the retention concepts work.
>
> Next steps: User testing with real students, backend integration, and measuring against our target metrics. Questions?"

---

## 🏁 Definition of Done

**Phase 2 is successfully complete when:**

1. ✅ **All acceptance criteria met** (100% completion)
2. ✅ **Design aesthetic is consistent** across all pages and components
3. ✅ **Animations are smooth and performant** (60fps desktop, 30fps+ mobile)
4. ✅ **All 3 missing systems implemented** (auth, onboarding, achievements)
5. ✅ **OpenAI integration verified** and working with proper context management
6. ✅ **Responsive design works** on mobile, tablet, and desktop
7. ✅ **Accessibility standards met** (WCAG 2.1 AA)
8. ✅ **Performance targets achieved** (<2s load, 90+ Lighthouse score)
9. ✅ **User testing completed** with positive feedback (85%+ satisfaction)
10. ✅ **Documentation is complete** (code comments, README, deployment guide)
11. ✅ **Stakeholder demo prepared** with clear narrative and success metrics
12. ✅ **Code is production-ready** (error handling, logging, optimization)

**Post-Launch Success Indicators:**

- Students complete onboarding in <2 minutes
- Churn rate drops below 40% (interim goal toward 30%)
- Average session duration increases to 12+ minutes
- 85%+ positive feedback on design from user testing
- No critical bugs in first week of usage

---

## 🚀 Phase 3 Preview (Future)

### Backend Integration

- Migrate from JSON to PostgreSQL/Firestore
- Implement real-time synchronization
- Add user authentication (Firebase Auth, Auth0)
- Build API endpoints matching service layer
- Set up production deployment pipeline

### Live Features

- Real tutor session integration
- Live chat with human tutors
- Video call capability
- Real-time progress syncing across devices

### Advanced Analytics

- Learning outcome tracking
- Retention funnel analysis
- A/B testing framework
- Predictive churn modeling

### Expanded Gamification

- Avatar customization system
- XP and leveling mechanics
- Competitive leaderboards (with privacy controls)
- Seasonal challenges and events

### Parent Portal

- Progress dashboards
- Conversation review
- Session scheduling
- Payment management

---

**End of Comprehensive PRD v3**

---

## 📋 Quick Reference

### Key Documents

- This PRD (single source of truth)
- Design System (to be created)
- Implementation Roadmap (Week 1-3 breakdown above)
- Mock Data Schema (PRD v1, maintained)

### Key Stakeholders

- Product Owner: [Name]
- Lead Developer: [Name]
- Designer: [Name]
- Demo Audience: [Stakeholder team]

### Timeline

- Phase 1: ✅ Complete (foundation built)
- Phase 2: 🚧 In Progress (2.5-3 weeks)
- Phase 3: 📅 Future (backend integration)

### Success Metrics

- **Primary:** Churn rate <30% (from 52%)
- **Secondary:** Session duration 15+ min, Task completion 70%+
- **Design:** 85%+ positive feedback, 90+ Lighthouse score

---

_This PRD consolidates all previous discussions and serves as the complete specification for Phase 2 implementation. All team members should reference this document as the single source of truth._
