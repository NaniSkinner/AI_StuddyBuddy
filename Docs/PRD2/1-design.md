# 🎨 AI Study Companion - Design System

**PRD v3 - Shard 2 of 12**

---

## 📖 Overview

This document defines the complete visual design system for the AI Study Companion. All components, pages, and interactions should follow these specifications to maintain consistency and the playful doodle aesthetic.

**Design Philosophy:** Hand-drawn, warm, inviting, age-appropriate (9-16)  
**Inspiration:** Khanmigo, Khan Academy Kids, Duolingo, Scratch

---

## 🎨 Color Palette

### Primary Colors

```css
/* Backgrounds & Base */
--doodle-cream: #f5f5dc; /* Main background, paper texture */
--doodle-sketch: #2d2d2d; /* Outlines, text, borders, drawings */

/* Action & Energy */
--doodle-orange: #ff9671; /* Energy, enthusiasm, active states */
--doodle-yellow: #ffe66d; /* Highlights, joy, achievements */

/* Learning & Growth */
--doodle-green: #7fd8be; /* Success, growth, completed tasks */
--doodle-mint: #b4f8c8; /* Progress indicators, secondary success */

/* Creativity & AI */
--doodle-purple: #a685e2; /* AI character default, creativity, wisdom */
--doodle-lavender: #cfbaf0; /* Curiosity, questions, thinking */

/* Focus & Information */
--doodle-blue: #6fb1fc; /* Calm, focus, information, links */

/* Special Moments */
--doodle-pink: #ffaac9; /* Achievements, celebration, special */
--doodle-peach: #ffc09f; /* Warmth, encouragement, gentle */
```

### Semantic Color Mapping

```css
/* State Colors */
--color-success: var(--doodle-green);
--color-warning: var(--doodle-orange);
--color-error: #ff6b6b;
--color-info: var(--doodle-blue);

/* Interactive States */
--color-hover: var(--doodle-yellow);
--color-active: var(--doodle-orange);
--color-focus: var(--doodle-purple);
--color-disabled: rgba(45, 45, 45, 0.3);
```

### Color Usage Guidelines

**Backgrounds:**

- Main canvas: `cream`
- Cards/panels: `white` or `cream`
- Overlays: `cream` with 90% opacity

**Text:**

- Primary: `sketch` (near-black)
- Secondary: `sketch` at 70% opacity
- Disabled: `sketch` at 40% opacity

**Borders:**

- All borders: `sketch` (2-4px width)
- Hover states: Increase width or add shadow

**Accents:**

- Call-to-action: `yellow` or `orange`
- Success feedback: `green`
- Learning progress: `blue` to `green` gradient
- Achievements: `pink` or `yellow`

---

## 📝 Typography System

### Font Families

```css
/* Heading Font - Hand-lettered, playful */
--font-hand: "Caveat", cursive;
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap");

/* Body Font - Readable handwriting */
--font-sketch: "Patrick Hand", cursive;
@import url("https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap");

/* AI Messages - Friendly, comic style */
--font-comic: "Comic Neue", cursive;
@import url("https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap");

/* Decorative - Extra playful */
--font-indie: "Indie Flower", cursive;
@import url("https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap");
```

### Type Scale

```css
/* Display */
--text-display: 56px; /* Hero sections, major headings */

/* Headings */
--text-h1: 48px; /* Page titles, welcome messages */
--text-h2: 36px; /* Section headers */
--text-h3: 28px; /* Component titles */
--text-h4: 24px; /* Subsection headers */

/* Body */
--text-xl: 22px; /* Large body text, emphasis */
--text-lg: 20px; /* Emphasized body text */
--text-md: 18px; /* Standard body, AI messages */
--text-sm: 16px; /* Secondary text, labels */
--text-xs: 14px; /* Captions, metadata */
--text-tiny: 12px; /* Fine print, timestamps */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-none: 1;
--leading-tight: 1.2;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

### Typography Usage

**Caveat (Hand-lettered):**

- Page titles and major headings
- Playful emphasis
- Achievement names
- Use: `font-bold` for impact

**Patrick Hand (Body):**

- Main body text
- Chat messages from students
- UI labels and buttons
- Use: `font-normal` for readability

**Comic Neue (AI Messages):**

- All AI character dialogue
- System messages
- Friendly notifications
- Use: `font-normal`, occasionally `font-bold`

**Indie Flower (Decorative):**

- Decorative labels
- Handwritten notes
- Special callouts
- Use sparingly for accent

---

## 🎬 Animation System

### Timing Functions

```css
/* Bouncy - For buttons, cards, interactions */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Playful - For entrances, exits */
--ease-playful: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Gentle - For subtle movements */
--ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);

/* Sharp - For quick interactions */
--ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
```

### Duration Scale

```css
--duration-instant: 100ms; /* Immediate feedback */
--duration-fast: 200ms; /* Button clicks, small interactions */
--duration-base: 300ms; /* Standard transitions */
--duration-slow: 500ms; /* Larger animations, page transitions */
--duration-slower: 800ms; /* Achievement reveals, celebrations */
--duration-slowest: 1200ms; /* Major scene changes */
```

### Core Framer Motion Variants

**Breathing (Idle State)**

```typescript
export const breathingVariant = {
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

**Bounce In**

```typescript
export const bounceInVariant = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
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

**Button Interaction**

```typescript
export const buttonVariant = {
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

**Float (Decorative Elements)**

```typescript
export const floatVariant = {
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
export const wiggleVariant = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    rotate: [0, -3, 3, -3, 3, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
```

**Slide In (Modals, Panels)**

```typescript
export const slideInVariant = {
  hidden: {
    x: "100%",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};
```

**Fade Through (Content Changes)**

```typescript
export const fadeThroughVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};
```

**Celebration (Achievements)**

```typescript
export const celebrationVariant = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: [0, 1.2, 0.9, 1.05, 1],
    rotate: [-180, 0, 5, -5, 0],
    transition: {
      duration: 1.2,
      times: [0, 0.4, 0.6, 0.8, 1],
      ease: "easeOut",
    },
  },
};
```

### Animation Guidelines

**Performance:**

- Animate `transform` and `opacity` only (GPU-accelerated)
- Use `will-change` for frequently animated elements
- Limit concurrent animations (max 3-4 at once)
- Simplify or disable on low-end devices

**Appropriateness:**

- Age 9-11: More bouncy, playful
- Age 12-14: Balanced, moderate
- Age 15-16: Subtle, sophisticated

**Purpose:**

- Every animation should have a reason (feedback, guidance, delight)
- Don't animate just to animate
- Respect `prefers-reduced-motion`

---

## 🖌️ Component Patterns

### Hand-Drawn Borders

**CSS Implementation (Performant)**

```css
.doodle-border {
  position: relative;
  border: 3px solid var(--doodle-sketch);
  border-radius: 15px;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1), 4px 4px 0px rgba(0, 0, 0, 0.05);
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
  pointer-events: none;
}

.doodle-border::after {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px solid var(--doodle-sketch);
  border-radius: 16px;
  opacity: 0.3;
  transform: rotate(0.5deg);
  z-index: -2;
  pointer-events: none;
}
```

**Tailwind Extension**

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        doodle:
          "2px 2px 0px rgba(0, 0, 0, 0.1), 4px 4px 0px rgba(0, 0, 0, 0.05)",
        "doodle-hover":
          "6px 6px 0px rgba(0, 0, 0, 0.15), 12px 12px 0px rgba(0, 0, 0, 0.08)",
      },
    },
  },
};
```

### Sketchy Buttons

**Base Button Style**

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
  color: var(--doodle-sketch);
  cursor: pointer;
  transform: rotate(-1deg);
  transition: all 0.2s var(--ease-bounce);
  box-shadow: 2px 2px 0px var(--doodle-sketch);
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

.sketch-button:hover:not(:disabled) {
  transform: rotate(1deg) scale(1.05);
  box-shadow: 4px 4px 0px var(--doodle-sketch);
  background: linear-gradient(
    145deg,
    var(--doodle-peach),
    var(--doodle-yellow)
  );
}

.sketch-button:active:not(:disabled) {
  transform: rotate(-1deg) scale(0.95);
  box-shadow: 1px 1px 0px var(--doodle-sketch);
}

.sketch-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(50%);
}
```

**Button Variants**

```css
/* Primary - Yellow/Peach */
.sketch-button--primary {
  background: linear-gradient(145deg, #ffe66d, #ffc09f);
}

/* Success - Green */
.sketch-button--success {
  background: #7fd8be;
  color: white;
}

/* Danger - Red */
.sketch-button--danger {
  background: #ff6b6b;
  color: white;
}

/* Ghost - Transparent */
.sketch-button--ghost {
  background: transparent;
  border: 2px dashed var(--doodle-sketch);
  box-shadow: none;
}

.sketch-button--ghost:hover:not(:disabled) {
  background: var(--doodle-cream);
  border-style: solid;
}
```

### Chat Bubbles

**Student Bubble (Right)**

```css
.chat-bubble-student {
  position: relative;
  max-width: 70%;
  margin-left: auto;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: white;
  border: 2px solid var(--doodle-sketch);
  border-radius: 20px 20px 4px 20px;
  font-family: var(--font-sketch);
  font-size: var(--text-md);
  line-height: var(--leading-normal);
  transform: rotate(0.5deg);
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
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

**AI Bubble (Left)**

```css
.chat-bubble-ai {
  position: relative;
  max-width: 70%;
  margin-right: auto;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: var(--doodle-purple);
  border: 2px solid var(--doodle-sketch);
  border-radius: 20px 20px 20px 4px;
  color: white;
  font-family: var(--font-comic);
  font-size: var(--text-md);
  line-height: var(--leading-normal);
  transform: rotate(-0.5deg);
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
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

### Progress Bars

**Hand-Drawn Progress Bar**

```css
.progress-container {
  position: relative;
  width: 100%;
  height: 24px;
  background: var(--doodle-cream);
  border: 2px solid var(--doodle-sketch);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--doodle-green), var(--doodle-mint));
  border-right: 2px solid var(--doodle-sketch);
  transition: width 0.5s var(--ease-playful);
  position: relative;
}

.progress-fill::after {
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
  font-family: var(--font-sketch);
  transform: rotate(-1deg);
  margin: 2px;
}

.concept-indicator.mastered {
  background: var(--doodle-green);
  color: white;
  border-color: var(--doodle-sketch);
}

.concept-indicator.mastered::before {
  content: "✓";
  font-weight: bold;
}

.concept-indicator.struggling {
  background: var(--doodle-orange);
  color: white;
  border-color: var(--doodle-sketch);
}

.concept-indicator.struggling::before {
  content: "⚠";
}

.concept-indicator.in-progress {
  background: var(--doodle-yellow);
  color: var(--doodle-sketch);
}

.concept-indicator.in-progress::before {
  content: "→";
}
```

### Cards

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

**Card with Decorative Corner**

```css
.doodle-card--decorated::after {
  content: "⭐";
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 24px;
  transform: rotate(20deg);
  animation: float 3s ease-in-out infinite;
}
```

### Input Fields

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
  color: var(--doodle-sketch);
  outline: none;
  transition: all 0.3s ease;
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

/* Animated focus indicator */
.doodle-input-wrapper {
  position: relative;
}

.doodle-input-wrapper::after {
  content: "✏️";
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.doodle-input:focus + .doodle-input-wrapper::after {
  opacity: 1;
  animation: wiggle 0.5s ease-in-out;
}
```

**Textarea**

```css
.doodle-textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px 16px;
  background: white;
  border: 2px solid var(--doodle-sketch);
  border-radius: 12px;
  font-family: var(--font-sketch);
  font-size: var(--text-md);
  color: var(--doodle-sketch);
  outline: none;
  resize: vertical;
  transition: all 0.3s ease;
}

.doodle-textarea:focus {
  border-width: 3px;
  border-color: var(--doodle-purple);
  box-shadow: 0 0 0 3px rgba(166, 133, 226, 0.2);
}
```

---

## 🎭 AI Character Design

### Character States

**Idle (Default)**

- Circle with gentle smile
- Closed eyes with curved lines
- Subtle breathing animation
- Color: Student's chosen color

**Thinking**

- Eyes closed (more concentrated)
- Pencil rotating around head
- Three dots appearing/disappearing
- Slightly desaturated color

**Speaking**

- Open mouth with small animation
- Eyes half-open
- Slight head tilt
- Full color saturation

**Celebrating**

- Big smile, wide eyes
- Stars/sparkles around character
- Bounce animation
- Bright, glowing effect

**Encouraging**

- Gentle smile
- Heart icon near character
- Pulsing glow
- Warm tint overlay

### Size Specifications

```css
.ai-character {
  /* Desktop */
  width: 150px;
  height: 150px;
}

@media (max-width: 1024px) {
  .ai-character {
    /* Tablet */
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 768px) {
  .ai-character {
    /* Mobile */
    width: 80px;
    height: 80px;
  }
}
```

---

## 📐 Spacing System

### Scale

```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Usage Guidelines

**Component Padding:**

- Small: `space-4` (16px)
- Medium: `space-6` (24px)
- Large: `space-8` (32px)

**Stack Spacing (Vertical):**

- Tight: `space-2` (8px)
- Normal: `space-4` (16px)
- Relaxed: `space-6` (24px)

**Section Spacing:**

- Between sections: `space-12` (48px)
- Between major areas: `space-16` (64px)

---

## 📦 Tailwind Configuration

### Complete Config

```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        doodle: {
          cream: "#F5F5DC",
          sketch: "#2D2D2D",
          green: "#7FD8BE",
          orange: "#FF9671",
          purple: "#A685E2",
          blue: "#6FB1FC",
          yellow: "#FFE66D",
          pink: "#FFAAC9",
          mint: "#B4F8C8",
          lavender: "#CFBAF0",
          peach: "#FFC09F",
        },
      },
      fontFamily: {
        hand: ["Caveat", "cursive"],
        sketch: ["Patrick Hand", "cursive"],
        comic: ["Comic Neue", "cursive"],
        indie: ["Indie Flower", "cursive"],
      },
      fontSize: {
        display: ["56px", { lineHeight: "1.1" }],
        h1: ["48px", { lineHeight: "1.2" }],
        h2: ["36px", { lineHeight: "1.2" }],
        h3: ["28px", { lineHeight: "1.3" }],
        h4: ["24px", { lineHeight: "1.4" }],
      },
      boxShadow: {
        doodle:
          "2px 2px 0px rgba(0, 0, 0, 0.1), 4px 4px 0px rgba(0, 0, 0, 0.05)",
        "doodle-hover":
          "6px 6px 0px rgba(0, 0, 0, 0.15), 12px 12px 0px rgba(0, 0, 0, 0.08)",
        "doodle-lg":
          "4px 4px 0px rgba(0, 0, 0, 0.1), 8px 8px 0px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "bounce-gentle": "bounceGentle 2s infinite",
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(5deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "25%": { transform: "translateX(-5px) rotate(-3deg)" },
          "75%": { transform: "translateX(5px) rotate(3deg)" },
        },
        shimmer: {
          "0%, 100%": { transform: "translateX(-20px)" },
          "50%": { transform: "translateX(100px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## ✅ Implementation Checklist

### Setup

- [ ] Install Google Fonts (Caveat, Patrick Hand, Comic Neue, Indie Flower)
- [ ] Configure Tailwind with extended config
- [ ] Create Framer Motion variants library
- [ ] Set up CSS custom properties
- [ ] Test font loading and fallbacks

### Component Styles

- [ ] Implement doodle border styles
- [ ] Create button variants
- [ ] Style chat bubbles
- [ ] Build progress bar components
- [ ] Design card components
- [ ] Style input fields

### Animations

- [ ] Test all animation variants
- [ ] Verify 60fps performance on desktop
- [ ] Optimize for mobile (30fps+ target)
- [ ] Implement `prefers-reduced-motion`
- [ ] Add loading states

### Verification

- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Typography is readable at all sizes
- [ ] Animations don't cause motion sickness
- [ ] Components work at all breakpoints
- [ ] Dark mode consideration (future)

---

## 📚 Related Documents

**Shard Navigation:**

- **← Previous:** Shard 1 (Overview)
- **→ Next:** Shard 3 (Authentication & Onboarding)

**Related Shards:**

- Shard 8: UI Components (uses this design system)
- Shard 9: Responsive & Performance (optimization)
- Shard 11: Assets & Testing (visual assets)

---

**End of Design System Shard**
