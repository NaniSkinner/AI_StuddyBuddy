# 🎨 Doodle Design System - Component Library

**AI Study Companion**  
**Last Updated:** November 7, 2025

---

## 📚 Component Overview

This document provides a comprehensive guide to all doodle-themed UI components in the AI Study Companion project.

---

## 🎯 Core UI Components

### SketchButton

**Location:** `app/components/ui/SketchButton.tsx`

Playful hand-drawn button with multiple variants and states.

**Props:**

- `variant`: `"primary"` | `"success"` | `"danger"` | `"ghost"` (default: `"primary"`)
- `size`: `"small"` | `"medium"` | `"large"` (default: `"medium"`)
- `disabled`: boolean
- `isLoading`: boolean
- `children`: ReactNode

**Usage:**

```tsx
<SketchButton variant="primary" size="large" onClick={handleClick}>
  Get Started!
</SketchButton>
```

**Features:**

- Hand-drawn border with double-border effect
- Playful rotation on hover
- Scale animations on tap
- Gradient backgrounds
- Disabled and loading states

---

### DoodleCard

**Location:** `app/components/ui/DoodleCard.tsx`

Hand-drawn card container with optional decorations.

**Props:**

- `children`: ReactNode
- `decoration`: `"star"` | `"heart"` | `"sparkle"` | `null`
- `className`: string
- `onClick`: function
- `style`: CSSProperties

**Usage:**

```tsx
<DoodleCard decoration="star">
  <h3>Card Content</h3>
</DoodleCard>
```

**Features:**

- 3px hand-drawn border
- Layered box-shadows for depth
- Subtle rotation (-0.5deg)
- Hover effects (straighten, lift)
- Optional corner decorations

---

### DoodleInput / DoodleTextarea

**Location:** `app/components/ui/DoodleInput.tsx` / `DoodleTextarea.tsx`

Hand-drawn text input fields with playful focus states.

**Props:**

- `placeholder`: string
- `value`: string
- `onChange`: function
- `disabled`: boolean
- All standard HTML input/textarea props

**Usage:**

```tsx
<DoodleInput
  placeholder="Type your message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
```

**Features:**

- Bottom-border only for inputs
- Full border for textareas
- Patrick Hand font
- Animated pencil emoji on focus
- Wiggle animation
- Purple focus state

---

### ProgressBar

**Location:** `app/components/ui/ProgressBar.tsx`

Hand-drawn progress bar with shimmer animation.

**Props:**

- `progress`: number (0-100)
- `variant`: `"default"` | `"success"` | `"warning"` | `"info"`
- `showLabel`: boolean
- `label`: string

**Usage:**

```tsx
<ProgressBar
  progress={75}
  variant="success"
  showLabel={true}
  label="7/10 concepts"
/>
```

**Features:**

- Sketchy border style
- Green/mint gradient fill
- Shimmer animation
- Color variants
- Optional percentage/label display

---

### CircularProgress

**Location:** `app/components/ui/CircularProgress.tsx`

Circular SVG-based progress ring with animations.

**Props:**

- `progress`: number (0-100)
- `size`: number (default: 140)
- `strokeWidth`: number (default: 12)
- `color`: string
- `label`: string
- `icon`: string (emoji)
- `showPercentage`: boolean
- `animated`: boolean

**Usage:**

```tsx
<CircularProgress
  progress={85}
  size={150}
  label="Reading"
  icon="📚"
  animated={true}
/>
```

**Features:**

- Smooth animated progress fill
- Auto color-coding based on progress
- Center icon and percentage
- Decorative sparkles for 80%+ progress
- Hover animations
- Doodle-styled label

---

### ConceptIndicator

**Location:** `app/components/ui/ConceptIndicator.tsx`

Status badges for sub-concepts (ages 9-12).

**Props:**

- `name`: string
- `status`: `"mastered"` | `"struggling"` | `"in-progress"` | `"not-started"`
- `animate`: boolean

**Usage:**

```tsx
<ConceptIndicator name="Fractions" status="mastered" animate={true} />
```

**Features:**

- Color-coded by status
- Icon indicators (✓, ⚠, →)
- Subtle rotation
- Hover animations
- Wrap layout support

---

### EmptyState

**Location:** `app/components/ui/EmptyState.tsx`

Encouraging empty state displays with floating animations.

**Props:**

- `icon`: string (emoji)
- `title`: string
- `description`: string
- `actionLabel`: string (optional)
- `onAction`: function (optional)
- `illustration`: ReactNode (optional)

**Pre-built Variants:**

- `NoTasksEmptyState`
- `NoMessagesEmptyState`
- `NoAchievementsEmptyState`
- `NoProgressEmptyState`

**Usage:**

```tsx
<NoTasksEmptyState onGetTasks={handleGetTasks} />

// Or custom
<EmptyState
  icon="🎯"
  title="No goals yet!"
  description="Let's set up your learning goals."
  actionLabel="Set Goals"
  onAction={handleSetGoals}
/>
```

**Features:**

- Floating animations
- Decorative sparkles
- Encouraging tone
- Optional CTA button
- Rotating emoji/icon

---

## 🎭 Character Components

### AnimatedBubble

**Location:** `app/components/AnimatedBubble.tsx`

AI character with 6 interactive states.

**Props:**

- `state`: `"idle"` | `"thinking"` | `"speaking"` | `"celebrating"` | `"encouraging"` | `"clicked"`
- `color`: string (student's chosen color)
- `size`: number
- `onClick`: function
- `studentAge`: number (for age-appropriate animations)

**Usage:**

```tsx
<AnimatedBubble
  state="celebrating"
  color="#A685E2"
  size={120}
  onClick={handleClick}
  studentAge={12}
/>
```

**Features:**

- 6 distinct character states
- Facial expressions (emoji-based)
- State-specific animations
- Age-appropriate intensity
- Color customization
- Breathing animation (idle)
- Rotating pencil (thinking)
- Bounce + sparkles (celebrating)

---

## 💬 Chat Components

### MessageBubble

**Location:** `app/components/MessageBubble.tsx`

Doodle-styled chat bubbles for AI and student messages.

**Props:**

- `message`: Message object
- `isAI`: boolean

**Usage:**

```tsx
<MessageBubble
  message={{
    speaker: "ai",
    message: "Great job!",
    timestamp: "2025-11-07T10:30:00Z",
  }}
  isAI={true}
/>
```

**Features:**

- Hand-drawn borders
- Speech tails (::before/::after)
- Subtle rotation
- Font: Comic Neue (AI), Patrick Hand (Student)
- Purple background (AI), white (Student)
- Entrance animations
- Timestamp display

---

### ChatInterface

**Location:** `app/components/ChatInterface.tsx`

Complete chat interface with doodle styling.

**Features:**

- Doodle-cream background
- Message list with scroll
- Typing indicator
- DoodleInput for message entry
- Sketch-styled send button
- Quick action buttons
- AI character display

---

## 📊 Progress Components

### ProgressCard

**Location:** `app/components/ProgressCard.tsx`

Full-width progress display with circular rings.

**Props:**

- `goals`: Goal[]
- `studentAge`: number
- `streakDays`: number

**Features:**

- Circular progress rings for each subject
- Subject-specific emojis
- Sub-topic badges
- Status badges ("Mastered!", "Keep going!")
- Collapsible animation
- Age-appropriate displays
- Stagger animations

---

## ✨ Gamification Components

### AchievementBadges

**Location:** `app/components/AchievementBadges.tsx`

Badge grid with unlock animations.

**Props:**

- `achievements`: Achievement[]
- `onBadgeClick`: function

**Features:**

- Doodle-card styling
- Locked/unlocked states
- Animated sparkles (unlocked)
- Hover effects
- Stagger entrance
- Unlock celebration modal

---

### AchievementUnlockAnimation

**Sub-component of AchievementBadges**

Modal celebrating badge unlocks.

**Features:**

- Confetti in doodle colors
- Rotating badge icon
- Pulsing text
- Doodle-styled modal
- Dismissible overlay

---

## 🎨 Design Tokens

### Colors

```css
--doodle-cream: #FFFBF3
--doodle-sketch: #2C3333
--doodle-orange: #FF9671
--doodle-yellow: #FFE66D
--doodle-green: #7FD8BE
--doodle-mint: #B4F8C8
--doodle-purple: #A685E2
--doodle-lavender: #CFBAF0
--doodle-blue: #6FB1FC
--doodle-pink: #FFAAC9
--doodle-peach: #FFC09F
```

### Fonts

```css
--font-hand: 'Caveat' (headings, playful emphasis)
--font-sketch: 'Patrick Hand' (body text)
--font-comic: 'Comic Neue' (AI messages)
--font-indie: 'Indie Flower' (decorative elements)
```

### Shadows

```css
.shadow-doodle: 4px 4px 0px var(--doodle-sketch)
.shadow-doodle-hover: 6px 6px 0px var(--doodle-sketch)
.shadow-doodle-lg: 8px 8px 0px var(--doodle-sketch)
```

---

## 🎬 Animation Variants

All animation variants are exported from `lib/animations/variants.ts`:

- `breathingVariant` - Gentle breathing for idle states
- `bounceInVariant` - Playful entrance
- `buttonVariant` - Button hover/tap effects
- `floatVariant` - Floating decorative elements
- `wiggleVariant` - Attention-grabbing wiggle
- `slideInVariant` - Slide-in for modals
- `fadeThroughVariant` - Content transitions
- `celebrationVariant` - Achievement celebrations
- `staggerContainerVariant` / `staggerItemVariant` - List animations
- `messageBubbleVariant` - Chat bubble entrance
- `typingIndicatorVariant` - Three-dot animation

**Usage:**

```tsx
<motion.div variants={bounceInVariant} initial="initial" animate="animate">
  Content
</motion.div>
```

---

## 🌐 Responsive Behavior

All components are responsive by default using Tailwind's breakpoint system:

- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet portrait)
- `lg`: 1024px (tablet landscape/desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large desktop)

---

## ♿ Accessibility Features

All components include:

- ✅ Proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Focus indicators (doodle-styled)
- ✅ WCAG AA color contrast
- ✅ `prefers-reduced-motion` support
- ✅ Semantic HTML
- ✅ Screen reader compatible

---

## 🎯 Best Practices

### 1. Always use semantic HTML

```tsx
// Good
<button onClick={handleClick}>Submit</button>

// Bad
<div onClick={handleClick}>Submit</div>
```

### 2. Leverage component variants

```tsx
// Use built-in variants instead of custom styling
<SketchButton variant="success">Save</SketchButton>
```

### 3. Respect age-appropriate animations

```tsx
<AnimatedBubble
  studentAge={studentAge} // Component adjusts intensity
  state="celebrating"
/>
```

### 4. Use empty states

```tsx
{
  tasks.length === 0 ? (
    <NoTasksEmptyState onGetTasks={handleGetTasks} />
  ) : (
    <TaskList tasks={tasks} />
  );
}
```

### 5. Test with reduced motion

All animations respect user preferences automatically via CSS.

---

## 📦 Component Imports

All UI components can be imported from the barrel export:

```tsx
import {
  SketchButton,
  DoodleCard,
  DoodleInput,
  DoodleTextarea,
  ProgressBar,
  CircularProgress,
  ConceptIndicator,
  EmptyState,
  NoTasksEmptyState,
} from "@/app/components/ui";
```

---

## 🚀 Getting Started

1. **Import the component:**

```tsx
import { SketchButton } from "@/app/components/ui";
```

2. **Use with props:**

```tsx
<SketchButton variant="primary" size="large">
  Click Me!
</SketchButton>
```

3. **Customize if needed:**

```tsx
<SketchButton
  variant="primary"
  className="my-custom-class"
  onClick={handleClick}
>
  Custom Button
</SketchButton>
```

---

## 💡 Tips & Tricks

### Combining Animations

```tsx
<motion.div
  variants={staggerItemVariant}
  whileHover={{ scale: 1.05, rotate: 2 }}
  whileTap={{ scale: 0.95 }}
>
  Content with multiple animations
</motion.div>
```

### Custom Colors

```tsx
<AnimatedBubble
  color="#FF9671" // Any hex color
  state="celebrating"
/>
```

### Conditional Styling

```tsx
<DoodleCard
  decoration={isSpecial ? "star" : null}
  onClick={isClickable ? handleClick : undefined}
>
  Content
</DoodleCard>
```

---

## 🐛 Troubleshooting

**Issue:** Animations not working

- ✅ Check if Framer Motion is installed
- ✅ Ensure component is client-side (`"use client"`)
- ✅ Verify animation variants are imported

**Issue:** Fonts not loading

- ✅ Check `app/layout.tsx` font configuration
- ✅ Verify CSS variables are defined in `globals.css`
- ✅ Clear browser cache

**Issue:** Colors not showing

- ✅ Check Tailwind config includes doodle colors
- ✅ Verify CSS custom properties are defined
- ✅ Run `bun run dev` to regenerate Tailwind

---

**For more information, see:**

- PRD: `Docs/PRD2/1-design.md`
- Task List: `Docs/Tasks2/DesignTasks.md`
- Architecture: `Docs/architecture.md`
