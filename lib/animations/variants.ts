/**
 * Framer Motion Animation Variants
 *
 * This file contains all reusable animation variants for the AI Study Companion.
 * Based on the Doodle Design System specifications.
 *
 * Usage:
 * import { breathingVariant, bounceInVariant } from '@/lib/animations/variants';
 * <motion.div variants={breathingVariant} animate="animate" />
 */

import { Variants } from "framer-motion";

// ========================================
// IDLE & AMBIENT ANIMATIONS
// ========================================

/**
 * Breathing Animation - For idle states
 * Creates a gentle, living feeling for static elements
 */
export const breathingVariant: Variants = {
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

/**
 * Float Animation - For decorative elements
 * Gentle up-and-down movement with slight rotation
 */
export const floatVariant: Variants = {
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

// ========================================
// ENTRANCE ANIMATIONS
// ========================================

/**
 * Bounce In - Playful entrance
 * Perfect for new elements appearing on screen
 */
export const bounceInVariant: Variants = {
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

/**
 * Slide In - For modals and panels
 * Smooth entrance from the right
 */
export const slideInVariant: Variants = {
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

/**
 * Fade Through - For content changes
 * Gentle fade in/out
 */
export const fadeThroughVariant: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// ========================================
// INTERACTION ANIMATIONS
// ========================================

/**
 * Button Interaction - For all clickable buttons
 * Adds playful tilt and scale on hover/tap
 */
export const buttonVariant: Variants = {
  hover: {
    scale: 1.05,
    rotate: 2,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
    rotate: -2,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Wiggle - For attention-grabbing
 * Quick shake to draw user's attention
 */
export const wiggleVariant: Variants = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    rotate: [0, -3, 3, -3, 3, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

// ========================================
// CELEBRATION ANIMATIONS
// ========================================

/**
 * Celebration - For achievements and milestones
 * Dramatic entrance with spin and bounce
 */
export const celebrationVariant: Variants = {
  initial: {
    scale: 0,
    rotate: -180,
  },
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

/**
 * Pulse - Gentle pulsing for emphasis
 * Subtle scale animation
 */
export const pulseVariant: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ========================================
// STAGGER ANIMATIONS
// ========================================

/**
 * Stagger Container - For lists and grids
 * Animates children with a stagger delay
 */
export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger Item - For items within stagger container
 * Fades and slides up
 */
export const staggerItemVariant: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// ========================================
// CHAT-SPECIFIC ANIMATIONS
// ========================================

/**
 * Message Bubble Enter - For chat messages
 * Slides in with slight bounce
 */
export const messageBubbleVariant: Variants = {
  hidden: {
    x: -50,
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

/**
 * Typing Indicator - Three dots animation
 * For "AI is typing..." states
 */
export const typingIndicatorVariant: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ========================================
// MODAL & OVERLAY ANIMATIONS
// ========================================

/**
 * Modal Overlay - Background fade
 */
export const modalOverlayVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Modal Content - Scale in from center
 */
export const modalContentVariant: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 50,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.2,
    },
  },
};

// ========================================
// PROGRESS & LOADING ANIMATIONS
// ========================================

/**
 * Progress Bar - Smooth width transition
 */
export const progressBarVariant: Variants = {
  initial: {
    width: "0%",
  },
  animate: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1], // playful easing
    },
  }),
};

/**
 * Loading Spinner - Continuous rotation
 */
export const loadingSpinnerVariant: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ========================================
// AGE-APPROPRIATE VARIANTS
// ========================================

/**
 * Younger Kids (9-11) - More bouncy and playful
 */
export const youngerKidsVariant: Variants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.9,
    rotate: -5,
  },
};

/**
 * Teens (15-16) - More subtle and sophisticated
 */
export const teensVariant: Variants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
  },
};

// ========================================
// REDUCED MOTION VARIANTS
// ========================================

/**
 * Reduced Motion Safe - For accessibility
 * Minimal animation that respects prefers-reduced-motion
 */
export const reducedMotionVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
};

// ========================================
// CUSTOM EASING FUNCTIONS
// ========================================

export const customEasing = {
  bounce: [0.68, -0.55, 0.265, 1.55],
  playful: [0.34, 1.56, 0.64, 1],
  gentle: [0.4, 0, 0.2, 1],
  sharp: [0.4, 0, 0.6, 1],
};

// ========================================
// DURATION CONSTANTS
// ========================================

export const animationDuration = {
  instant: 0.1,
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
};
