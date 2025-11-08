# 🏆 Achievement & Gamification Implementation Tasks

**Project:** AI Study Companion - Phase 2  
**Focus:** Achievements & Gamification System  
**Based on:** GamePRD.md (Shard 4) + Architecture.md  
**Last Updated:** November 7, 2025

## 🎯 **IMPLEMENTATION STATUS: 100% COMPLETE** 🎉

### Current State (Nov 7, 2025):

✅ **ALL PHASES COMPLETE (100%)** 🎊

**Phase 1 & 2: Foundation (Complete)**

- ✅ Achievement types with points & rarity system
- ✅ Student type with dual streak tracking & totalPoints
- ✅ Enhanced achievementService (points, rarity, grouping)
- ✅ Dual streak tracking (login + practice)
- ✅ Streak milestones system
- ✅ All 6 achievements updated with points/rarity

**Phase 3 & 4: UI Components (Complete)**

- ✅ Confetti particle component
- ✅ BadgeCard (locked/unlocked states)
- ✅ BadgeCollection grid with rarity grouping
- ✅ UnlockNotification modal with animations
- ✅ StreakCounter for TopBar
- ✅ StreakDetail modal (dual streaks display)

**Phase 5: Hooks & Integration (Complete)**

- ✅ useAchievements hook with event system
- ✅ Component index exports
- ✅ Zero linter errors across all components

**Phase 6 & 7: Data & App Integration (Complete)**

- ✅ All 4 student JSON files updated (lucas, eva, mia, pat)
- ✅ Dual streak data structure in all students
- ✅ totalPoints added to all students
- ✅ TopBar integrated with StreakCounter & points
- ✅ Achievements page created (`/app/achievements/page.tsx`)
- ✅ Learn page updated with gamification loading
- ✅ StreakDetail modal click integration
- ✅ Complete routing & navigation
- ✅ Zero linter errors - production ready! 🚀

### 🔧 What We're Building:

**Achievement System (6 Badges Total):**

- Enhance existing 6 badges with points & rarity tiers
- Badge collection grid UI
- Unlock animations with confetti
- Notification system for unlocks
- Progress tracking (X/6 badges)

**Streak System:**

- Dual tracking (login + practice based)
- Streak counter in TopBar
- Streak detail modal
- Milestone celebrations (3, 7, 14, 30 days)
- Recovery encouragement UI

**Integration:**

- Event hooks throughout the app
- Automatic achievement checks
- Real-time UI updates
- State management integration

**Sound Effects:** Deferred (optional if time permits)

---

## 📋 Task Overview

**Progress Tracking:**

- Total Tasks: 160+ tasks (adjusted for 6 achievements)
- Completed: 55+ tasks (30%)
- In Progress: Phase 1 data expansion
- Blocked: 0
- Remaining: Components, animations, integration, testing
- **Strategy:** Build achievement and streak systems in parallel

---

## 🎯 Phase 1: Achievement Data & Type System ✅ 30% COMPLETE

### 1.1 Achievement Type System Expansion 🔄 IN PROGRESS

- [x] **Review existing achievement types** (`types/achievement.ts`)

  - [x] Document current 6 achievements
  - [x] Note: Currently has AchievementId, Achievement interface, ACHIEVEMENT_DEFINITIONS

- [ ] **Expand Achievement Type Definitions**

  - [ ] Add `rarity` field to Achievement interface ('common' | 'uncommon' | 'rare' | 'legendary')
  - [ ] Add `points` field to Achievement interface (number)
  - [ ] Add `condition` function field (optional, for complex checks)
  - [ ] Keep existing 6 achievement IDs (no new ones to add)
  - [ ] Test TypeScript compilation

- [ ] **Create Rarity System Types**

  - [ ] Create BadgeRarity enum/type
  - [ ] Create RARITY_COLORS constant object
  - [ ] Create RARITY_ORDER constant (for sorting)
  - [ ] Export all rarity-related types
  - [ ] Document rarity system in comments

- [ ] **Update ACHIEVEMENT_DEFINITIONS Object**

  - [ ] Update existing 6 achievements with points and rarity:
    - [ ] first_steps: 10 points, common
    - [ ] three_day_streak: 20 points, common
    - [ ] topic_master: 30 points, uncommon
    - [ ] curious_mind: 15 points, common
    - [ ] social_butterfly: 15 points, common
    - [ ] streak_breaker: 40 points, rare
  - [ ] Verify all 6 achievements compile correctly with new fields

- [ ] **Create Achievement Helper Functions**
  - [ ] Create `getAchievementsByRarity()` function
  - [ ] Create `getTotalPoints()` function
  - [ ] Create `getAchievementCount()` function
  - [ ] Create `sortAchievementsByRarity()` function
  - [ ] Export all helper functions
  - [ ] Add JSDoc comments to each function

### 1.2 Streak Type System Expansion

- [ ] **Update Streak Type Definitions**

  - [ ] Review current streak structure in Student type
  - [ ] Create new StreakData interface (dual tracking):
    ```typescript
    interface StreakData {
      login: {
        current: number;
        longest: number;
        lastDate: string;
      };
      practice: {
        current: number;
        longest: number;
        lastDate: string;
      };
    }
    ```
  - [ ] Add StreakType type ('login' | 'practice')
  - [ ] Add StreakMilestone type with celebration data
  - [ ] Test TypeScript compilation

- [ ] **Create Streak Constants**
  - [ ] Create MILESTONE_CELEBRATIONS object (days 3, 7, 14, 30)
  - [ ] Create STREAK_THRESHOLDS constant
  - [ ] Create STREAK_ACHIEVEMENT_MAP (which streaks unlock badges)
  - [ ] Export all streak constants
  - [ ] Document milestone system in comments

### 1.3 Student Data Model Updates

- [ ] **Update Student Type Interface**

  - [ ] Replace single `streaks` with dual `streaks: StreakData`
  - [ ] Add `totalPoints` field (number, defaults to 0)
  - [ ] Add `practiceMinutes` field (for practice_pro achievement)
  - [ ] Add `tasksCompleted` field (for bookworm achievement)
  - [ ] Add `correctStreak` field (for star_student achievement)
  - [ ] Verify all existing code compiles with new types

- [ ] **Update Student JSON Mock Data Files**
  - [ ] Update `lucas.json` with new streak structure
  - [ ] Update `eva.json` with new streak structure
  - [ ] Update `mia.json` with new streak structure
  - [ ] Update `pat.json` with new streak structure
  - [ ] Add sample `totalPoints` to each student
  - [ ] Add sample `practiceMinutes` to each student
  - [ ] Add sample achievement unlocks for testing
  - [ ] Verify JSON files are valid

---

## 🔧 Phase 2: Service Layer Expansion ⏳ PENDING

### 2.1 Achievement Service Enhancement

- [ ] **Expand Core Achievement Functions**

  - [ ] Update `getAllAchievementsWithStatus()` to include points
  - [ ] Update `getAllAchievementsWithStatus()` to include rarity
  - [ ] Add `getAchievementPoints()` function (studentId)
  - [ ] Add `getAchievementsByRarity()` function (studentId, rarity)
  - [ ] Add `getProgress()` function (achievement progress 0-100%)
  - [ ] Add `getNextAchievement()` function (closest to unlocking)
  - [ ] Test all functions with mock data

- [ ] **Enhance Existing Achievement Check Functions**

  - [ ] Review existing 6 check functions (all currently working)
  - [ ] No new achievement check functions needed (keeping 6 total)
  - [ ] Test each existing check function still works correctly
  - [ ] Verify `checkAllAchievements()` works with points/rarity additions

- [ ] **Create Event-Based Trigger System**

  - [ ] Create `UserEvent` type (conversation_complete, task_complete, etc.)
  - [ ] Create `checkTriggers()` function (student, event) → Achievement[]
  - [ ] Map each achievement to its event triggers
  - [ ] Implement condition checking per achievement
  - [ ] Add debouncing to prevent duplicate unlocks
  - [ ] Test trigger system with various events

- [ ] **Implement Points Accumulation**
  - [ ] Create `addPoints()` function (studentId, points)
  - [ ] Update `unlockAchievement()` to add points automatically
  - [ ] Create `getTotalPoints()` function (studentId)
  - [ ] Create `getPointsLeaderboard()` function (top students)
  - [ ] Test points accumulation with multiple unlocks

### 2.2 Streak Service Enhancement

- [ ] **Implement Dual Streak Tracking**

  - [ ] Update `updateStreak()` to handle both login and practice
  - [ ] Create `updateLoginStreak()` function
  - [ ] Create `updatePracticeStreak()` function (taskCompletion based)
  - [ ] Add logic to distinguish between streak types
  - [ ] Test both streak types independently
  - [ ] Test edge cases (same-day login and practice)

- [ ] **Add Streak Milestone Detection**

  - [ ] Create `checkMilestone()` function (current streak) → Celebration | null
  - [ ] Implement milestone triggers (3, 7, 14, 30 days)
  - [ ] Create `getNextMilestone()` function (days until next)
  - [ ] Add milestone celebration data objects
  - [ ] Test milestone detection at each threshold

- [ ] **Implement Streak Recovery System**

  - [ ] Create `getStreakBreakMessage()` function (encouraging)
  - [ ] Create `getDaysUntilRecord()` function (motivation)
  - [ ] Add recovery state to StreakStatus
  - [ ] Create age-appropriate recovery messages
  - [ ] Test recovery messages for different ages

- [ ] **Add Streak Comparison**
  - [ ] Create `compareStreaks()` function (login vs practice)
  - [ ] Create `getBestStreak()` function (highest of both types)
  - [ ] Add visual indicators for which streak is higher
  - [ ] Test comparison logic with mock data

### 2.3 Notification Service (New)

- [ ] **Create notificationService.ts**

  - [ ] Create file structure and exports
  - [ ] Define NotificationType enum (achievement, streak, milestone)
  - [ ] Create Notification interface
  - [ ] Set up notification queue system
  - [ ] Add max notification limit (1 at a time)

- [ ] **Implement Achievement Notifications**

  - [ ] Create `showAchievementUnlock()` function
  - [ ] Add confetti trigger integration
  - [ ] Add auto-dismiss timer (5 seconds)
  - [ ] Add manual dismiss handler
  - [ ] Queue multiple notifications if rapid unlocks

- [ ] **Implement Streak Notifications**

  - [ ] Create `showStreakMilestone()` function
  - [ ] Add milestone-specific messages
  - [ ] Add celebration effects
  - [ ] Create age-appropriate celebration intensity

- [ ] **Create Notification Manager Hook**
  - [ ] Create `useNotifications()` hook
  - [ ] Implement notification state management
  - [ ] Add show/hide/dismiss methods
  - [ ] Add notification history (last 3)
  - [ ] Test hook with multiple notifications

---

## 🎨 Phase 3: Badge UI Components ⏳ PENDING

### 3.1 BadgeCard Component (Individual Badge)

- [ ] **Create BadgeCard.tsx Component**

  - [ ] Create component file in `app/components/achievements/`
  - [ ] Define BadgeCardProps interface
  - [ ] Implement base component structure
  - [ ] Add unlocked prop
  - [ ] Add onClick handler prop

- [ ] **Implement Locked State Design**

  - [ ] Create `.achievement-locked` CSS class (per PRD)
  - [ ] Add dashed border (2px)
  - [ ] Add grayscale filter
  - [ ] Add 0.6 opacity
  - [ ] Add lock icon emoji (🔒)
  - [ ] Add hover effect (0.8 opacity, translateY -2px)
  - [ ] Test locked state styling

- [ ] **Implement Unlocked State Design**

  - [ ] Create `.achievement-unlocked` CSS class (per PRD)
  - [ ] Add gradient background based on rarity color
  - [ ] Add 3px solid border
  - [ ] Add -2deg rotation
  - [ ] Add box shadow (4px 4px 0px)
  - [ ] Add rarity indicator dot (::after pseudo-element)
  - [ ] Test unlocked state styling

- [ ] **Add Hover & Interaction States**

  - [ ] Implement hover state (rotate 0deg, translateY -4px)
  - [ ] Increase shadow on hover (6px 6px 0px)
  - [ ] Add cursor pointer for unlocked badges
  - [ ] Add scale on tap/click (0.95)
  - [ ] Use Framer Motion for smooth transitions
  - [ ] Test interactions on desktop and mobile

- [ ] **Add Badge Content Layout**

  - [ ] Display badge icon (48px font-size)
  - [ ] Display badge name (Caveat font, bold)
  - [ ] Display badge points (+XX format)
  - [ ] Display badge description (small text)
  - [ ] Add float animation to icon (3s infinite)
  - [ ] Test content layout responsiveness

- [ ] **Add Recently Unlocked Effect**
  - [ ] Create `.recently-unlocked` CSS class
  - [ ] Implement pulse-glow animation (2s)
  - [ ] Add rarity-colored glow (box-shadow)
  - [ ] Auto-remove class after animation
  - [ ] Test glow animation performance

### 3.2 BadgeCollection Component (Grid View)

- [ ] **Create BadgeCollection.tsx Component**

  - [ ] Create component file in `app/components/achievements/`
  - [ ] Define BadgeCollectionProps interface
  - [ ] Implement base grid layout
  - [ ] Add responsive columns (2 mobile, 3 tablet, 4 desktop)
  - [ ] Import and use BadgeCard component

- [ ] **Implement Collection Header**

  - [ ] Add "🏆 Your Achievements" title (Caveat font, h2)
  - [ ] Add progress text (X/12 badges unlocked)
  - [ ] Add total points display (with star emoji)
  - [ ] Style header with doodle aesthetic
  - [ ] Test header responsiveness

- [ ] **Group Badges by Rarity**

  - [ ] Filter achievements by common
  - [ ] Filter achievements by uncommon
  - [ ] Filter achievements by rare
  - [ ] Filter achievements by legendary
  - [ ] Add section headers for each rarity
  - [ ] Style rarity headers with colors

- [ ] **Add Stagger Animation on Load**

  - [ ] Use staggerContainerVariant from animations
  - [ ] Apply staggerItemVariant to each badge
  - [ ] Set stagger delay (0.05s per badge)
  - [ ] Test animation performance
  - [ ] Add reduced-motion alternative

- [ ] **Implement Badge Click Handler**

  - [ ] Add onBadgeClick callback prop
  - [ ] Pass achievement data to handler
  - [ ] Open detail modal on click (if unlocked)
  - [ ] Test click interactions
  - [ ] Add keyboard support (Enter/Space)

- [ ] **Add Empty State**
  - [ ] Create "No achievements yet" message
  - [ ] Add encouraging CTA ("Start learning to earn badges!")
  - [ ] Style with EmptyState component
  - [ ] Test empty state display
  - [ ] Add decorative illustration

### 3.3 UnlockNotification Component (Modal/Toast)

- [ ] **Create UnlockNotification.tsx Component**

  - [ ] Create component file in `app/components/achievements/`
  - [ ] Define UnlockNotificationProps interface
  - [ ] Add achievement prop
  - [ ] Add onClose callback prop
  - [ ] Use AnimatePresence for enter/exit

- [ ] **Implement Modal Backdrop**

  - [ ] Create fixed positioned overlay (full screen)
  - [ ] Add semi-transparent black background (0.5 opacity)
  - [ ] Add backdrop-filter blur (4px)
  - [ ] Add z-index (9999)
  - [ ] Add click-to-dismiss on backdrop
  - [ ] Test backdrop visibility

- [ ] **Design Modal Content Card**

  - [ ] Create white card with doodle border (4px)
  - [ ] Add large border radius (24px)
  - [ ] Add layered shadows (8px + 16px offset)
  - [ ] Set max-width (400px, 90vw)
  - [ ] Add padding (40px)
  - [ ] Center content alignment

- [ ] **Add Confetti Effect**

  - [ ] Create Confetti sub-component
  - [ ] Generate 20 confetti particles
  - [ ] Use doodle colors for particles
  - [ ] Implement radial burst animation
  - [ ] Add rotation to each particle
  - [ ] Fade out after 1.5s
  - [ ] Test confetti performance

- [ ] **Implement Scale & Rotate Animation**

  - [ ] Set initial state (scale: 0, rotate: -10)
  - [ ] Animate to scale: [0, 1.1, 0.95, 1]
  - [ ] Animate rotation: [-10, 5, -5, 0]
  - [ ] Set duration (0.8s)
  - [ ] Use easeOut timing
  - [ ] Test animation smoothness

- [ ] **Add Modal Content Layout**

  - [ ] Display "🎉 Achievement Unlocked!" header
  - [ ] Display large badge icon (80px)
  - [ ] Display badge name (h2, Caveat font)
  - [ ] Display points earned (+XX, green color)
  - [ ] Display badge description
  - [ ] Add "Awesome!" dismiss button
  - [ ] Style with doodle aesthetic

- [ ] **Implement Auto-Dismiss Timer**
  - [ ] Set 5-second timer on mount
  - [ ] Add countdown indicator (optional)
  - [ ] Clear timer on manual dismiss
  - [ ] Test auto-dismiss timing
  - [ ] Add pause on hover (optional)

### 3.4 Confetti Component (Particle Effect)

- [ ] **Create Confetti.tsx Component**

  - [ ] Create component file in `app/components/achievements/`
  - [ ] Define ConfettiProps interface (count, colors)
  - [ ] Implement base particle container
  - [ ] Add absolute positioning

- [ ] **Generate Confetti Particles**

  - [ ] Create array of N particles (default 20)
  - [ ] Use doodle colors array
  - [ ] Randomize particle sizes (8-16px)
  - [ ] Randomize particle shapes (circle, square)
  - [ ] Position all at center initially

- [ ] **Implement Burst Animation**

  - [ ] Calculate angle for each particle (360/N)
  - [ ] Animate X position (cos angle × distance)
  - [ ] Animate Y position (sin angle × distance)
  - [ ] Animate rotation (random 0-360deg)
  - [ ] Animate opacity (0 → 1 → 0)
  - [ ] Animate scale (0 → 1 → 0)

- [ ] **Add Physics Effects**

  - [ ] Add gravity effect (y += time²)
  - [ ] Add air resistance (velocity decay)
  - [ ] Add random drift (slight x wobble)
  - [ ] Test physics realism
  - [ ] Optimize for 60fps

- [ ] **Create Variants for Different Events**
  - [ ] Create `confettiVariant` for achievements
  - [ ] Create `milestoneCelebration` for streaks
  - [ ] Create `epicCelebration` for rare badges
  - [ ] Adjust particle counts per variant
  - [ ] Test each variant

---

## 🔥 Phase 4: Streak UI Components ⏳ PENDING

### 4.1 StreakCounter Component (TopBar Display)

- [ ] **Create StreakCounter.tsx Component**

  - [ ] Create component file in `app/components/streaks/`
  - [ ] Define StreakCounterProps interface
  - [ ] Add currentStreak prop
  - [ ] Add streakType prop ('login' | 'practice')
  - [ ] Add onClick handler for modal

- [ ] **Design Counter Visual**

  - [ ] Create pill-shaped container
  - [ ] Add gradient background (orange → yellow)
  - [ ] Add 2px solid border (sketch)
  - [ ] Add -1deg rotation
  - [ ] Add 2px shadow
  - [ ] Add padding (8px 16px)

- [ ] **Add Fire Emoji Animation**

  - [ ] Display 🔥 emoji (24px)
  - [ ] Implement flicker animation:
    - [ ] Scale: [1, 1.1, 1]
    - [ ] Rotate: [0, -5, 0, 5, 0]
    - [ ] Brightness: [1, 1.2, 1]
  - [ ] Set duration (1.5s, infinite)
  - [ ] Test animation performance

- [ ] **Add Streak Number Display**

  - [ ] Display current streak number
  - [ ] Use Caveat font (large, bold)
  - [ ] Add " Day Streak" label (Patrick Hand)
  - [ ] Make singular/plural ("1 Day" vs "3 Days")
  - [ ] Test text layout

- [ ] **Implement Hover Effect**

  - [ ] Rotate to 0deg on hover
  - [ ] Scale to 1.05
  - [ ] Increase shadow (4px)
  - [ ] Add cursor pointer
  - [ ] Use bounce easing
  - [ ] Test hover on desktop

- [ ] **Add Dual Streak Indicator**

  - [ ] Show both login and practice streaks
  - [ ] Use icons to distinguish (🔥 login, 📚 practice)
  - [ ] Highlight the higher streak
  - [ ] Add tooltip explaining each type
  - [ ] Test with various streak combinations

- [ ] **Integrate into TopBar**
  - [ ] Import StreakCounter in TopBar.tsx
  - [ ] Position counter (top-right area)
  - [ ] Connect to student streak data
  - [ ] Add onClick to open StreakDetail modal
  - [ ] Test TopBar layout with counter

### 4.2 StreakDetail Component (Modal)

- [ ] **Create StreakDetail.tsx Component**

  - [ ] Create component file in `app/components/streaks/`
  - [ ] Define StreakDetailProps interface
  - [ ] Add student prop
  - [ ] Add onClose callback prop
  - [ ] Use AnimatePresence for animations

- [ ] **Design Modal Layout**

  - [ ] Create doodle card container
  - [ ] Add "🔥 Your Streaks" title (h2, Caveat)
  - [ ] Add close button (X or "Close")
  - [ ] Add padding (32px)
  - [ ] Set max-width (500px)
  - [ ] Center on screen

- [ ] **Create Login Streak Section**

  - [ ] Add "Login Streak" subheading (h3)
  - [ ] Display current days (large number)
  - [ ] Add visual dot indicators (7 dots max)
  - [ ] Color active dots (🔥 emoji)
  - [ ] Gray inactive dots (⚪ emoji)
  - [ ] Test dot display logic

- [ ] **Create Practice Streak Section**

  - [ ] Add "Practice Streak" subheading (h3)
  - [ ] Display current days (large number)
  - [ ] Add visual dot indicators (7 dots max)
  - [ ] Color active dots (📚 emoji)
  - [ ] Gray inactive dots (⚪ emoji)
  - [ ] Test dot display logic

- [ ] **Add Divider Between Sections**

  - [ ] Create hand-drawn divider line
  - [ ] Style with sketch color
  - [ ] Add margin (24px top/bottom)
  - [ ] Test visual separation

- [ ] **Implement Longest Streak Display**

  - [ ] Display "Longest Streak: X days"
  - [ ] Show which type (login or practice)
  - [ ] Highlight if current equals longest
  - [ ] Add trophy emoji if record
  - [ ] Style with Patrick Hand font

- [ ] **Add Challenge/Motivation Section**

  - [ ] Calculate days to beat record
  - [ ] Display "Beat it by studying X more days!"
  - [ ] If at record: "New record! You're unstoppable! 🚀"
  - [ ] If ahead: "You're X days ahead of your record! 🎉"
  - [ ] Use encouraging, age-appropriate tone
  - [ ] Test all message variants

- [ ] **Implement Scale Animation**

  - [ ] Set initial scale (0.8) and opacity (0)
  - [ ] Animate to scale (1) and opacity (1)
  - [ ] Set duration (0.3s)
  - [ ] Add easeOut timing
  - [ ] Test animation smoothness

- [ ] **Add Keep Going Button**
  - [ ] Add "Keep Going! 💪" button
  - [ ] Style as sketch-button--primary
  - [ ] Add onClick to dismiss modal
  - [ ] Add hover effect
  - [ ] Test button interactions

### 4.3 Milestone Celebration Component

- [ ] **Create MilestoneCelebration.tsx Component**

  - [ ] Create component file in `app/components/streaks/`
  - [ ] Define MilestoneCelebrationProps interface
  - [ ] Add milestone prop (3, 7, 14, 30)
  - [ ] Add onComplete callback

- [ ] **Design Celebration Card**

  - [ ] Create full-screen overlay (like UnlockNotification)
  - [ ] Add large milestone number
  - [ ] Display milestone icon (🔥 3-day, 🎉 7-day, etc.)
  - [ ] Add congratulatory message
  - [ ] Style with doodle aesthetic

- [ ] **Implement Confetti Effect**

  - [ ] Trigger confetti on milestone
  - [ ] Use more particles for bigger milestones
  - [ ] Add milestone-specific colors
  - [ ] Test confetti intensity

- [ ] 🔵 **Add Sound Effect Trigger (Optional - Low Priority)**

  - [ ] Create sound effect placeholder
  - [ ] Add audio element (optional)
  - [ ] Trigger on milestone display
  - [ ] Add mute option
  - [ ] Test audio compatibility
  - [ ] **Note:** Defer if time constrained - focus on core features first

- [ ] **Create Age-Appropriate Variants**
  - [ ] Ages 9-11: More animated, lots of confetti
  - [ ] Ages 12-14: Moderate celebration
  - [ ] Ages 15-16: Subtle, sophisticated
  - [ ] Adjust animation intensity per age
  - [ ] Test with each age group

### 4.4 Broken Streak Recovery UI

- [ ] **Create StreakRecovery Component**

  - [ ] Create component file in `app/components/streaks/`
  - [ ] Define StreakRecoveryProps interface
  - [ ] Add previousStreak prop
  - [ ] Add encouragement message

- [ ] **Design Recovery Card**

  - [ ] Use gentle, encouraging tone
  - [ ] Display "Your X-day streak ended"
  - [ ] Add motivational message ("Start a new one!")
  - [ ] Include previous best streak
  - [ ] Add "Let's Go!" CTA button

- [ ] **Style with Empathy**

  - [ ] Avoid negative language
  - [ ] Use warm colors (not red/angry)
  - [ ] Add supportive emoji (💪, 🌟)
  - [ ] Keep message short and positive
  - [ ] Test tone with different ages

- [ ] **Add to StreakDetail Modal**
  - [ ] Show recovery UI if streak broken
  - [ ] Replace normal streak display
  - [ ] Add visual distinction (warm background)
  - [ ] Test recovery message display

---

## 🔗 Phase 5: Event Hooks & Integration ⏳ PENDING

### 5.1 Achievement Event Hooks

- [ ] **Create useAchievements Hook**

  - [ ] Create hook file in `lib/hooks/useAchievements.ts`
  - [ ] Import achievementService functions
  - [ ] Import notificationService
  - [ ] Add student context integration

- [ ] **Implement checkAchievements Function**

  - [ ] Accept eventType parameter
  - [ ] Get current student from context
  - [ ] Call achievementService.checkTriggers()
  - [ ] Loop through newly unlocked achievements
  - [ ] Call achievementService.unlockAchievement() for each
  - [ ] Trigger notification for each unlock
  - [ ] Update student context
  - [ ] Test function with various events

- [ ] **Create Event Type Constants**

  - [ ] Define 'conversation_complete' event
  - [ ] Define 'task_complete' event
  - [ ] Define 'question_asked' event
  - [ ] Define 'streak_update' event
  - [ ] Define 'progress_update' event
  - [ ] Define 'session_complete' event
  - [ ] Define 'goal_complete' event
  - [ ] Export all event types

- [ ] **Add Hook Return Values**
  - [ ] Return checkAchievements function
  - [ ] Return loading state
  - [ ] Return error state
  - [ ] Return recently unlocked achievements
  - [ ] Test hook usage in components

### 5.2 Integration Points

- [ ] **ChatInterface Integration**

  - [ ] Import useAchievements hook
  - [ ] Call checkAchievements on message send
  - [ ] Trigger 'conversation_complete' event
  - [ ] Trigger 'question_asked' event (if "?" in message)
  - [ ] Test achievement unlocks during chat
  - [ ] Verify UI updates immediately

- [ ] **TaskSidebar Integration**

  - [ ] Import useAchievements hook
  - [ ] Call checkAchievements on task completion
  - [ ] Trigger 'task_complete' event
  - [ ] Track consecutive correct answers
  - [ ] Test bookworm achievement
  - [ ] Test star_student achievement

- [ ] **ProgressCard Integration**

  - [ ] Import useAchievements hook
  - [ ] Call checkAchievements on progress update
  - [ ] Trigger 'progress_update' event
  - [ ] Test topic_master achievement
  - [ ] Test goal_getter achievement

- [ ] **Login Integration**

  - [ ] Import streakService in login flow
  - [ ] Call updateLoginStreak() on login
  - [ ] Import useAchievements hook
  - [ ] Trigger 'streak_update' event
  - [ ] Test streak achievements
  - [ ] Test milestone celebrations

- [ ] **Session Integration**
  - [ ] Track session start time
  - [ ] Calculate session duration on end
  - [ ] Call checkAchievements with duration
  - [ ] Trigger 'session_complete' event
  - [ ] Test practice_pro achievement (30 min)

### 5.3 State Management Integration

- [ ] **Update Global State (Zustand/Context)**

  - [ ] Add achievements array to state
  - [ ] Add totalPoints to state
  - [ ] Add current streaks to state
  - [ ] Add recently unlocked to state
  - [ ] Add notification queue to state

- [ ] **Create State Update Actions**

  - [ ] Create `addAchievement()` action
  - [ ] Create `addPoints()` action
  - [ ] Create `updateStreak()` action
  - [ ] Create `showNotification()` action
  - [ ] Create `dismissNotification()` action
  - [ ] Test all actions

- [ ] **Add State Persistence**
  - [ ] Save achievements to student JSON
  - [ ] Save totalPoints to student JSON
  - [ ] Save streaks to student JSON
  - [ ] Load state on app init
  - [ ] Test persistence across sessions

### 5.4 Performance Optimization

- [ ] **Debounce Achievement Checks**

  - [ ] Add 500ms debounce to checkAchievements
  - [ ] Prevent duplicate checks in rapid succession
  - [ ] Queue checks if already processing
  - [ ] Test with rapid user actions

- [ ] **Memoize Achievement Calculations**

  - [ ] Use useMemo for achievement lists
  - [ ] Use useMemo for points calculations
  - [ ] Use useMemo for streak status
  - [ ] Test re-render performance

- [ ] **Lazy Load Components**
  - [ ] Lazy load UnlockNotification
  - [ ] Lazy load StreakDetail modal
  - [ ] Lazy load Confetti component
  - [ ] Lazy load MilestoneCelebration
  - [ ] Test initial bundle size

---

## 🎬 Phase 6: Animations & Polish ⏳ PENDING

### 6.1 Badge Unlock Animations

- [ ] **Create achievementUnlockVariant**

  - [ ] Define in `lib/animations/variants.ts`
  - [ ] Set initial: { scale: 0, rotate: -180, opacity: 0 }
  - [ ] Set animate: { scale: [0, 1.2, 0.9, 1.05, 1], rotate: [-180, 0, 5, -5, 0], opacity: [0, 1, 1, 1, 1] }
  - [ ] Set duration: 1.2s
  - [ ] Set times: [0, 0.4, 0.6, 0.8, 1]
  - [ ] Use easeOut timing
  - [ ] Test animation smoothness

- [ ] **Create confettiVariant**

  - [ ] Define confetti animation variant
  - [ ] Set initial: { scale: 0, opacity: 0 }
  - [ ] Calculate x/y positions with trigonometry
  - [ ] Add random rotation per particle
  - [ ] Set duration: 1.5s
  - [ ] Test with 20+ particles

- [ ] **Create pulse-glow Animation**
  - [ ] Define CSS keyframes
  - [ ] Animate box-shadow with rarity color
  - [ ] Pulse from normal shadow to glowing
  - [ ] Set duration: 2s
  - [ ] Loop animation
  - [ ] Test glow visibility

### 6.2 Streak Animations

- [ ] **Create flicker Animation (Fire Emoji)**

  - [ ] Define CSS keyframes
  - [ ] Animate scale: [1, 1.1, 1]
  - [ ] Animate rotate: [0, -5, 5, 0]
  - [ ] Animate brightness: [1, 1.2, 1]
  - [ ] Set duration: 1.5s
  - [ ] Loop infinitely
  - [ ] Test performance

- [ ] **Create Milestone Entrance Animation**

  - [ ] Scale in from 0 to 1
  - [ ] Add rotation effect
  - [ ] Add confetti burst
  - [ ] Add bounce effect
  - [ ] Set duration: 1s
  - [ ] Test with various milestones

- [ ] **Create Streak Dot Animations**
  - [ ] Animate dots filling up
  - [ ] Stagger animation (0.1s per dot)
  - [ ] Scale each dot on fill
  - [ ] Add sparkle effect on completion
  - [ ] Test with 7-dot display

### 6.3 Transition Animations

- [ ] **Badge Collection Load Animation**

  - [ ] Use staggerContainerVariant
  - [ ] Stagger each badge by 0.05s
  - [ ] Fade + slide in from bottom
  - [ ] Test with 12 badges
  - [ ] Add reduced-motion variant

- [ ] **Modal Enter/Exit Animations**

  - [ ] Scale from 0.8 to 1 on enter
  - [ ] Fade backdrop in/out
  - [ ] Scale to 0.8 on exit
  - [ ] Set duration: 0.3s
  - [ ] Test modal transitions

- [ ] **Notification Queue Animations**
  - [ ] Slide in from top
  - [ ] Queue multiple notifications
  - [ ] Slide out after timeout
  - [ ] Add stacking effect if multiple
  - [ ] Test queue behavior

### 6.4 Age-Appropriate Animation Variants

- [ ] **Ages 9-11 (High Energy)**

  - [ ] Increase animation speed (1.3x)
  - [ ] Add more confetti particles (30)
  - [ ] Bigger scale effects (1.3x max)
  - [ ] More bouncy easing
  - [ ] Test with Lucas persona

- [ ] **Ages 12-14 (Balanced)**

  - [ ] Standard animation speed
  - [ ] Moderate confetti (20 particles)
  - [ ] Balanced scale effects (1.2x)
  - [ ] Standard easing
  - [ ] Test with Eva and Mia personas

- [ ] **Ages 15-16 (Subtle)**
  - [ ] Reduce animation speed (0.8x)
  - [ ] Fewer confetti particles (10)
  - [ ] Subtle scale effects (1.1x)
  - [ ] Smooth easing
  - [ ] Test with Pat persona

---

## 🧪 Phase 7: Testing & Quality Assurance ⏳ PENDING

### 7.1 Unit Testing

- [ ] **Achievement Service Tests**

  - [ ] Test unlockAchievement() with valid/invalid IDs
  - [ ] Test hasAchievement() returns correct boolean
  - [ ] Test checkAllAchievements() with various student states
  - [ ] Test getAchievementProgress() calculations
  - [ ] Test points accumulation
  - [ ] Test each check function individually
  - [ ] Achieve 80%+ test coverage

- [ ] **Streak Service Tests**

  - [ ] Test updateLoginStreak() logic
  - [ ] Test updatePracticeStreak() logic
  - [ ] Test streak continuation (yesterday → today)
  - [ ] Test streak break (gap > 1 day)
  - [ ] Test milestone detection
  - [ ] Test dual streak comparison
  - [ ] Achieve 80%+ test coverage

- [ ] **Component Tests**
  - [ ] Test BadgeCard renders correctly (locked/unlocked)
  - [ ] Test BadgeCollection groups by rarity
  - [ ] Test UnlockNotification displays achievement
  - [ ] Test StreakCounter shows correct number
  - [ ] Test StreakDetail renders both streaks
  - [ ] Test Confetti generates particles
  - [ ] Test all user interactions

### 7.2 Integration Testing

- [ ] **End-to-End Achievement Flow**

  - [ ] Start with new student (0 achievements)
  - [ ] Complete first conversation
  - [ ] Verify "First Steps" badge unlocks
  - [ ] Check notification displays
  - [ ] Verify points added
  - [ ] Check badge collection updates
  - [ ] Verify persistence (reload app)

- [ ] **End-to-End Streak Flow**

  - [ ] Start with 0 streak
  - [ ] Login on day 1 (streak = 1)
  - [ ] Login on day 2 (streak = 2)
  - [ ] Login on day 3 (streak = 3, milestone!)
  - [ ] Verify 3-Day Streak badge unlocks
  - [ ] Check milestone celebration displays
  - [ ] Skip a day (streak breaks)
  - [ ] Verify recovery message
  - [ ] Test restart streak

- [ ] **Multiple Achievements Test**
  - [ ] Trigger 3+ achievements rapidly
  - [ ] Verify notification queuing
  - [ ] Check no duplicate unlocks
  - [ ] Verify all points added correctly
  - [ ] Test UI performance with multiple unlocks

### 7.3 Visual Testing

- [ ] **Cross-Browser Testing**

  - [ ] Test badge UI in Chrome
  - [ ] Test badge UI in Firefox
  - [ ] Test badge UI in Safari
  - [ ] Test badge UI in Edge
  - [ ] Test animations in all browsers
  - [ ] Document any browser-specific issues

- [ ] **Responsive Testing**

  - [ ] Test BadgeCollection on mobile (< 768px)
  - [ ] Test BadgeCollection on tablet (768-1024px)
  - [ ] Test BadgeCollection on desktop (> 1024px)
  - [ ] Test StreakCounter in TopBar (all sizes)
  - [ ] Test modals on small screens
  - [ ] Test confetti on all screen sizes

- [ ] **Animation Performance Testing**
  - [ ] Profile unlock animation (target: 60fps)
  - [ ] Profile confetti (target: 60fps)
  - [ ] Profile streak flicker (target: 60fps)
  - [ ] Test on low-end devices
  - [ ] Test with 10+ badges animating
  - [ ] Optimize if below 45fps

### 7.4 Accessibility Testing

- [ ] **Keyboard Navigation**

  - [ ] Tab through badge collection
  - [ ] Test Enter/Space to open badge detail
  - [ ] Tab through streak modal
  - [ ] Test Escape to close modals
  - [ ] Test focus indicators visible
  - [ ] Test skip navigation

- [ ] **Screen Reader Testing**

  - [ ] Test badge announcements (locked/unlocked)
  - [ ] Test achievement unlock announcement
  - [ ] Test streak counter reading
  - [ ] Test progress announcements
  - [ ] Add aria-live regions for dynamic content
  - [ ] Test with VoiceOver (Mac) and NVDA (Windows)

- [ ] **Reduced Motion Support**
  - [ ] Test all animations respect prefers-reduced-motion
  - [ ] Verify confetti disabled with reduced motion
  - [ ] Verify glow effects simplified
  - [ ] Test static badge states
  - [ ] Document reduced motion behavior

### 7.5 Performance Testing

- [ ] **Lighthouse Audits**

  - [ ] Run Lighthouse on badge collection page
  - [ ] Target: Performance 90+
  - [ ] Target: Accessibility 100
  - [ ] Target: Best Practices 95+
  - [ ] Address any issues found

- [ ] **Load Time Testing**

  - [ ] Measure initial badge render time (< 500ms)
  - [ ] Measure achievement check time (< 100ms)
  - [ ] Measure notification display time (< 200ms)
  - [ ] Test on slow 3G connection
  - [ ] Optimize if above targets

- [ ] **Memory Testing**
  - [ ] Profile memory usage with confetti
  - [ ] Check for memory leaks in animations
  - [ ] Test cleanup on component unmount
  - [ ] Monitor with Chrome DevTools
  - [ ] Fix any leaks found

---

## 📚 Phase 8: Documentation & Polish ⏳ PENDING

### 8.1 Code Documentation

- [ ] **Add JSDoc Comments**

  - [ ] Document all achievement service functions
  - [ ] Document all streak service functions
  - [ ] Document all notification functions
  - [ ] Document component props
  - [ ] Document custom hooks
  - [ ] Add usage examples

- [ ] **Create Component README**

  - [ ] Document BadgeCard props and usage
  - [ ] Document BadgeCollection props and usage
  - [ ] Document UnlockNotification props and usage
  - [ ] Document StreakCounter props and usage
  - [ ] Document StreakDetail props and usage
  - [ ] Add code snippets

- [ ] **Document Achievement System**

  - [ ] Explain achievement types
  - [ ] Explain rarity system
  - [ ] Explain points economy
  - [ ] Explain trigger conditions
  - [ ] Provide examples
  - [ ] Create flowchart

- [ ] **Document Streak System**
  - [ ] Explain dual tracking
  - [ ] Explain milestone system
  - [ ] Explain recovery messaging
  - [ ] Provide examples
  - [ ] Create flowchart

### 8.2 User-Facing Documentation

- [ ] **Create Achievement Guide**

  - [ ] List all 12 achievements
  - [ ] Explain how to unlock each
  - [ ] Show point values
  - [ ] Show rarity tiers
  - [ ] Add visual examples
  - [ ] Make age-appropriate

- [ ] **Create Streak Guide**

  - [ ] Explain login vs practice streaks
  - [ ] Explain milestone celebrations
  - [ ] Explain streak recovery
  - [ ] Provide tips for maintaining streaks
  - [ ] Add visual examples

- [ ] **Add In-App Tooltips**
  - [ ] Add tooltip to locked badges (how to unlock)
  - [ ] Add tooltip to streak counter (what it means)
  - [ ] Add tooltip to points (what they're for)
  - [ ] Add tooltip to rarity colors
  - [ ] Test tooltip visibility

### 8.3 Developer Handoff

- [ ] **Create Implementation Checklist**

  - [ ] List all completed features
  - [ ] List all components created
  - [ ] List all services enhanced
  - [ ] List all integration points
  - [ ] Document any known issues

- [ ] **Create Testing Checklist**

  - [ ] Provide QA test scripts
  - [ ] List test scenarios
  - [ ] List expected behaviors
  - [ ] Document edge cases
  - [ ] Provide test data

- [ ] **Create Deployment Notes**
  - [ ] List environment variables (if any)
  - [ ] List dependencies added
  - [ ] Note any breaking changes
  - [ ] Provide rollback plan
  - [ ] Document migration steps

### 8.4 Polish & Refinement

- [ ] **Visual Polish**

  - [ ] Fine-tune badge card shadows
  - [ ] Adjust color contrast if needed
  - [ ] Refine animation timing
  - [ ] Polish confetti particles
  - [ ] Ensure consistent spacing

- [ ] **Copy Refinement**

  - [ ] Review all achievement descriptions
  - [ ] Review all streak messages
  - [ ] Review all notification copy
  - [ ] Ensure age-appropriate language
  - [ ] Check for typos

- [ ] **Final UX Review**
  - [ ] Test complete user journeys
  - [ ] Verify all interactions feel smooth
  - [ ] Check all feedback is immediate
  - [ ] Ensure no confusing states
  - [ ] Get stakeholder approval

---

## 🎯 Definition of Done

A task is considered complete when:

1. ✅ Code is implemented and functioning correctly
2. ✅ Component/feature tested with mock data
3. ✅ Responsive behavior verified (mobile, tablet, desktop)
4. ✅ Accessibility requirements met (keyboard nav, screen reader, reduced motion)
5. ✅ Animations run at 60fps (45fps minimum on mobile)
6. ✅ TypeScript types are correct (no errors)
7. ✅ Integration with existing components works
8. ✅ Code is documented with JSDoc comments
9. ✅ Unit tests written (if applicable)
10. ✅ Visually matches PRD specifications

---

## 📊 Progress Tracking

### How to Use This Document

1. **Mark tasks as complete** by changing `[ ]` to `[x]`
2. **Add notes** below tasks as needed (use indented bullet points)
3. **Track blockers** by adding `🚫` emoji before blocked tasks
4. **Mark in-progress** by adding `🔄` emoji before current tasks
5. **Update status** at the top of the document regularly

### Priority Indicators

- 🔴 **Critical** - Blocking other work
- 🟡 **High** - Core functionality
- 🟢 **Medium** - Important for quality
- 🔵 **Low** - Polish and refinement

### Implementation Strategy

- **Parallel Development:** Build achievement and streak systems simultaneously
- **Test as We Go:** No separate testing environment, validate in main app
- **6 Achievements:** Keep existing 6, enhance with points/rarity
- **Sound Effects:** Optional (defer to end if time permits)
- **Timeline:** Flexible - user managing schedule

---

## 🚀 Next Steps

After completing all gamification tasks:

1. **Integrate with AI Services** (Shard 5: AI Integration)
2. **Implement Retention Features** (Shard 6: Nudges, Churn Detection)
3. **Add Social Features** (Friend connections, messages)
4. **Implement Tutor Handoff** (Struggle detection, booking)
5. **Final QA & User Testing**

---

## 📝 Notes & Decisions

### Architecture Decisions

- Using existing doodle design system (85% complete)
- Building on top of existing services (enhancing, not replacing)
- Keeping components in separate folders (achievements/, streaks/)
- Using Framer Motion for all animations
- Using Zustand/Context for state management

### Implementation Decisions ✅

- ✅ **Achievements:** Keep 6 total (enhance existing with points/rarity)
- ✅ **Sound effects:** Optional/deferred (low priority, time permitting)
- ✅ **Build strategy:** Both systems in parallel
- ✅ **Testing:** Test as we go in main app (no separate test page)
- ✅ **Timeline:** User managing, work at natural pace

### Open Questions

- Leaderboards: Include or privacy concern? (Future decision)
- Achievement rewards: Unlock future features? (Phase 2)

### Dependencies

- Requires: Design System (Phase 7-8 complete)
- Requires: Student service with JSON persistence
- Requires: TopBar component for streak counter
- Requires: Global state management

---

**Good luck with the implementation! 🎮✨**
