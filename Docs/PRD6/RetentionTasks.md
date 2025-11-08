# 💪 Retention & Re-engagement System Implementation Tasks

**Project:** AI Study Companion - Retention Features  
**Focus:** Churn Detection & Nudge System  
**Based on:** RetentionPRD.md (Shard 6) + Architecture.md  
**Last Updated:** November 8, 2025  
**Status:** 🚀 **READY TO START**

---

## 🎯 **IMPLEMENTATION STATUS: STARTING**

### Current State (Nov 8, 2025):

**📊 Existing Foundation (What's Already Built):**

✅ **Core Services Exist:**

- `churnDetectionService.ts` - Basic implementation (needs PRD enhancement)
- `nudgeService.ts` - Basic templates (needs celebrate-first + AI hybrid)
- `streakService.ts` - Fully implemented dual tracking
- `achievementService.ts` - Fully implemented
- `studentService.ts` - JSON-based student management

✅ **Student Data Structure:**

- `sessions` array tracking
- `taskHistory` array (empty but ready)
- `streaks` object with login + practice tracking
- `achievements` array
- `createdAt` and `lastLoginAt` timestamps
- All 4 student personas with realistic data

✅ **AI Integration:**

- OpenAI fully connected and working
- Context management operational
- Token usage tracking active
- Hybrid AI approach feasible

**🚧 What Needs Building:**

- ❌ Enhanced churn detection matching PRD spec exactly
- ❌ Celebrate-first nudge generation with AI personalization
- ❌ All retention UI components (popup, toast, trigger)
- ❌ Frontend integration (hooks, context, API routes)
- ❌ Demo trigger button for showcasing
- ❌ Student metadata tracking for nudge history
- ❌ Test infrastructure for retention features
- ❌ Comprehensive testing suite

---

## 📋 Task Overview

**Progress Tracking:**

- Total Phases: 10
- Total Tasks: ~140 tasks
- Completed: **Phases 1-6 (100+ tasks)** ✅
- In Progress: Phase 7-10 (Testing & Polish)
- Blocked: 0
- **Strategy:** ✅ Services → ✅ UI → ✅ Integration → ✅ Events → ✅ Metrics → Testing next

**Estimated Timeline:** 4-6 days (flexible, user-managed pace)  
**Time Elapsed:** 1 day (AMAZING progress!)  
**Status:** 🎯 **Phases 1-6 COMPLETE! Core retention system fully operational!**

---

## 🔍 Phase 1: Enhance Churn Detection Service ✅ 100% COMPLETE

### 1.1 Update Student Data Structure ✅

- [x] **Add Metadata Fields to Student Type**

  - [x] Open `/types/student.ts`
  - [x] Add `metadata?` object to Student interface
  - [x] Add `lastNudgeShown?: string` field
  - [x] Add `lastNudgeId?: string` field
  - [x] Add `nudgeHistory?: NudgeInteraction[]` array
  - [x] Create `NudgeInteraction` interface
  - [x] Test TypeScript compilation

- [x] **Update Student JSON Files**

  - [x] Add `metadata: {}` to lucas.json
  - [x] Add `metadata: {}` to eva.json
  - [x] Add `metadata: {}` to pat.json
  - [x] Add `metadata: {}` to mia.json
  - [x] Verify JSON structure is valid

- [x] **Create Demo Churn Scenarios**
  - [x] Tested with real student data (Mia = MEDIUM risk)
  - [x] Verified 2 sessions = churn risk
  - [x] Verified inactivity detection works
  - [x] Verified goal completion detection
  - [x] Verified broken streak detection
  - [x] Real-time testing via demo button

### 1.2 Enhance Churn Risk Assessment ✅

- [x] **Update ChurnRiskAssessment Interface**

  - [x] Open `/lib/services/churnDetectionService.ts`
  - [x] Rename `riskLevel` to `level` (match PRD)
  - [x] Rename `factors` to `reasons` (match PRD)
  - [x] Rename `recommendations` to `interventions` (match PRD)
  - [x] Add `daysSinceActive: number` field
  - [x] Add `sessionCount: number` field
  - [x] Export ChurnRisk enum from PRD
  - [x] Update all function signatures

- [x] **Implement PRD-Spec Scoring System**

  - [x] Rewrite `calculateChurnRisk()` to match PRD exactly
  - [x] Factor 1: Session count in first 7 days (weights: 40, 30, 35)
  - [x] Factor 2: Inactivity duration (weights: 35, 20, 10)
  - [x] Factor 3: Task completion tracking (weights: 25, 15)
  - [x] Factor 4: Goal completion status (weight: 30)
  - [x] Factor 5: Streak status (weight: 15)
  - [x] Calculate total score (0-100)
  - [x] Map score to risk level (HIGH ≥60, MEDIUM 35-60, LOW 15-35, NONE <15)
  - [x] Populate reasons array with specific messages
  - [x] Populate interventions array with actions

- [x] **Implement Helper Functions**

  - [x] Create `getAccountAge()` function
  - [x] Create `getDaysSinceActive()` function
  - [x] Create `getTaskStats()` function
  - [x] Add `shouldNudge()` function (checks 24hr limit)
  - [x] Add error handling for all functions
  - [x] Test with mock student data

- [x] **Test Churn Detection**
  - [x] Test Lucas (healthy - LOW: 25/100)
  - [x] Test Eva (moderate - LOW: 25/100)
  - [x] Test Mia (at-risk - MEDIUM: 40/100)
  - [x] Test Pat (engaged - LOW: 25/100)
  - [x] Verify score calculations are accurate
  - [x] Verify reasons match risk factors
  - [x] Verify interventions are appropriate

### 📝 Phase 1 Completion Checklist

**Files Modified:**

- [ ] `/types/student.ts` - Added metadata fields
- [ ] `/lib/services/churnDetectionService.ts` - Enhanced to PRD spec
- [ ] `/data/students/*.json` - Added metadata objects

**Testing:**

- [ ] All 4 students tested with churn assessment
- [ ] Score calculations verified manually
- [ ] Risk levels match expected values
- [ ] TypeScript compiles with no errors

---

## 💬 Phase 2: Enhance Nudge Service with AI Hybrid ✅ 100% COMPLETE

### 2.1 Create Nudge Templates System ✅

- [x] **Create Template Types**

  - [x] Create `/types/nudge.ts` file
  - [x] Define `NudgeTemplate` interface (id, trigger, ageGroup, messages, intensity)
  - [x] Define `NudgeMessage` interface (id, studentId, type, trigger, celebration, encouragement, cta, priority, createdAt, expiresAt)
  - [x] Define `ChurnReason` type (inactive, goal_completed, low_task_completion, streak_broken, general_encouragement)
  - [x] Export all types
  - [x] Add to `/types/index.ts`

- [x] **Create Template Library**

  - [x] Open `/lib/services/nudgeService.ts`
  - [x] Create `NUDGE_TEMPLATES` array with all PRD templates
  - [x] Add 3 inactive templates (young, middle, teen)
  - [x] Add 3 goal_completed templates (young, middle, teen)
  - [x] Add 3 low_completion templates (young, middle, teen)
  - [x] Add 2 streak_broken templates (middle, teen)
  - [x] Add 3 general encouragement templates (fallbacks)
  - [x] Verify celebrate-first structure in all templates
  - [x] Test template selection logic

- [x] **Create Template Selection Logic**
  - [x] Create `determineTrigger()` function
  - [x] Prioritize: goal_completed > inactive > streak_broken > low_completion
  - [x] Create `selectTemplate()` function
  - [x] Match by trigger + ageGroup
  - [x] Fall back to general template if no match
  - [x] Match intensity to risk level
  - [x] Test with various student states

### 2.2 Implement AI Personalization (Hybrid) ✅

- [x] **Create Personalization Functions**

  - [x] Create `findCelebrationPoint()` function
  - [x] Check achievements (count, display with emoji)
  - [x] Check streak (longest streak display)
  - [x] Check progress (high progress goals)
  - [x] Check completed goals (celebration)
  - [x] Return random celebration or null
  - [x] Test with all 4 student personas

- [x] **Create AI Enhancement Function (Optional)**

  - [x] Decided: Template-only for Phase 1 ($0 cost!)
  - [x] AI hook ready for Phase 2 if needed
  - [x] All infrastructure supports AI enhancement
  - [x] Would be simple to add via `NUDGE_USE_AI` env var

- [x] **Implement Placeholder Replacement**

  - [x] Create `replacePlaceholders()` function
  - [x] Replace {name} with student.name
  - [x] Replace {age} with student.age
  - [x] Replace {grade} with student.grade
  - [x] Replace {subject} with goal.subject
  - [x] Replace {progress} with goal.progress
  - [x] Replace {longest_streak} with streak data
  - [x] Test with various messages

- [x] **Create Main Generation Function**
  - [x] Rewrite `generateNudge()` to use new system
  - [x] Check if should nudge (24hr limit)
  - [x] Assess churn risk
  - [x] Determine trigger reason
  - [x] Select appropriate template
  - [x] Find celebration point
  - [x] Replace placeholders
  - [x] Return complete NudgeMessage
  - [x] Test end-to-end generation

### 2.3 Implement Nudge Tracking & Limits ✅

- [x] **Create Tracking Functions**

  - [x] Keep existing `shouldNudge()` function
  - [x] Check student.metadata.lastNudgeShown
  - [x] Enforce 24-hour limit between nudges
  - [x] Return boolean
  - [x] Test limit enforcement (working!)

- [x] **Create Interaction Recording**

  - [x] Created `markNudgeShown()` function - saves to JSON
  - [x] Update student.metadata.lastNudgeShown
  - [x] Update student.metadata.lastNudgeId
  - [x] Save student data with persistence
  - [x] Create `recordNudgeInteraction()` function
  - [x] Log to console with color coding
  - [x] Structure ready for Phase 2 analytics
  - [x] Track: shown, accepted, dismissed, expired actions

- [x] **Create Expiration Logic**
  - [x] Create `getExpirationTime()` function (24 hours from now)
  - [x] Expiration included in NudgeMessage
  - [x] Auto-expiration handled by metadata timestamps
  - [x] Test expiration edge cases

### 📝 Phase 2 Completion Checklist

**Files Created:**

- [ ] `/types/nudge.ts` - Complete nudge type system

**Files Modified:**

- [ ] `/lib/services/nudgeService.ts` - Celebrate-first + AI hybrid
- [ ] `/types/index.ts` - Exported nudge types

**Testing:**

- [ ] Template selection tested for all age groups
- [ ] Celebration points found correctly
- [ ] Placeholder replacement working
- [ ] 24-hour limit enforced
- [ ] All 4 students generate appropriate nudges

---

## 🎨 Phase 3: Build Nudge UI Components ✅ 100% COMPLETE

### 3.1 Create NudgePopup Component ✅

- [x] **Set Up Component Structure**

  - [x] Create `/app/components/retention/` folder
  - [x] Create `NudgePopup.tsx` file
  - [x] Import Framer Motion
  - [x] Import NudgeMessage type
  - [x] Define NudgePopupProps interface
  - [x] Set up component with TypeScript

- [x] **Implement Popup UI**

  - [x] Create backdrop overlay (fixed, inset-0, z-index 9998)
  - [x] Create popup container (fixed, centered, z-index 9999)
  - [x] Add AI character (emoji in gradient circle, 80px)
  - [x] Add celebration text section (font-hand, orange)
  - [x] Add encouragement text section (font-hand, sketch color)
  - [x] Add CTA button (blue gradient with shadow)
  - [x] Add "Maybe later" button (outlined ghost button)
  - [x] Add close X button (top-right, circular with rotate)
  - [x] Apply doodle/sketch styling with borders & shadows

- [x] **Add Animations**

  - [x] Backdrop fade in/out (opacity 0 → 1)
  - [x] Popup spring animation (scale 0 + rotate -10 → scale 1)
  - [x] AI character floating animation (y: [0, -8, 0], 2s infinite)
  - [x] Exit animation (scale 0.8, opacity 0)
  - [x] Button hover effects (scale 1.02)
  - [x] Button tap effects (scale 0.98)
  - [x] All animations smooth and delightful
  - [x] Fixed centering issue (using Framer Motion style)

- [x] **Implement Interaction Logic**
  - [x] Create `handleAccept()` function
  - [x] Call `onAccept()` callback with delay
  - [x] Close with animation
  - [x] Create `handleDismiss()` function
  - [x] Call `onDismiss()` callback with delay
  - [x] Close with animation
  - [x] Handle backdrop click (dismiss)
  - [x] Handle Escape key (dismiss)
  - [x] All interactions tested and working

### 3.2 Create Toast Notification Component ✅

- [x] **Create ToastNotification Component**

  - [x] Create `/app/components/retention/ToastNotification.tsx`
  - [x] Define Toast interface (id, title, message, type, icon, duration)
  - [x] Create toast container component with stacking
  - [x] Position: fixed bottom-right
  - [x] Stack multiple toasts vertically with index offset
  - [x] Add icon section (emoji/icon) - type-specific
  - [x] Add title section (font-hand, bold)
  - [x] Add message section (font-hand, smaller)
  - [x] Apply doodle styling with colored borders

- [x] **Implement Toast Animations**

  - [x] Slide in from right (x: 400 → 0)
  - [x] Auto-dismiss after duration (default 5 seconds)
  - [x] Slide out on dismiss (x: 400, opacity 0)
  - [x] Stack animation (y offset: index \* 90px)
  - [x] Test multiple toasts working perfectly

- [x] **Create Notification Service**
  - [x] Create `/lib/services/notificationService.ts`
  - [x] Create `showToast()` function
  - [x] Generate unique ID for each toast
  - [x] Manage toast queue (max 3 visible)
  - [x] Auto-dismiss logic with timers
  - [x] Export convenience methods (toast.success, .info, etc.)
  - [x] Test toast display with all types

### 3.3 Create Demo Trigger Button ✅

- [x] **Create NudgeTrigger Component**

  - [x] Create `/app/components/retention/NudgeTrigger.tsx`
  - [x] Create floating button (bottom-left, fixed)
  - [x] Style as gradient button with "🔔 Test Nudge" text
  - [x] Make it prominent with shadow & animations
  - [x] Add dev-only check (process.env.NODE_ENV)
  - [x] Add click handler with callback

- [x] **Implement Trigger Logic**

  - [x] Uses onTrigger callback prop
  - [x] Calls forceCheckNudge() from hook
  - [x] Force generate nudge (bypass 24hr limit)
  - [x] Show nudge popup immediately
  - [x] Add loading state with emoji change
  - [x] Disable button while loading
  - [x] Test with all students - working!

- [x] **Create Scenario Selector (Advanced)**
  - [x] Created NudgeTriggerAdvanced component
  - [x] Add dropdown with 5 scenarios
  - [x] Options: Auto, Inactive, Goal Complete, Streak Broken, Low Completion
  - [x] Icons for each scenario type
  - [x] Smooth dropdown animation
  - [x] All scenarios tested and working
  - [x] Fixed: Always generates nudge (even for healthy students)

### 📝 Phase 3 Completion Checklist

**Files Created:**

- [x] `/app/components/retention/NudgePopup.tsx` - Main popup component
- [x] `/app/components/retention/ToastNotification.tsx` - Toast component
- [x] `/app/components/retention/NudgeTrigger.tsx` - Demo button (+ Advanced)
- [x] `/lib/services/notificationService.ts` - Toast service

**Styling:**

- [x] Popup matches PRD design (celebrate-first layout)
- [x] Animations are smooth and delightful
- [x] Responsive on mobile (400px max-width, 90vw)
- [x] z-index hierarchy correct (9998 backdrop, 9999 popup)
- [x] Doodle/sketch design system applied perfectly
- [x] Centered properly (fixed Framer Motion issue)

**Testing:**

- [x] Popup displays correctly in center
- [x] All buttons work (Accept, Dismiss, Close X)
- [x] Animations play smoothly (spring, float, fade)
- [x] Toast notifications ready (not integrated yet)
- [x] Demo trigger forces nudge display every time
- [x] No console errors
- [x] Live tested in browser - working perfectly!

---

## 🔗 Phase 4: Frontend Integration (Hooks & API) ✅ 100% COMPLETE

### 4.1 Create useNudgeSystem Hook ✅

- [x] **Set Up Hook File**

  - [x] Create `/lib/hooks/useNudgeSystem.ts`
  - [x] Import useState, useEffect, useCallback
  - [x] Import NudgeMessage type
  - [x] Works with any studentId (no context dependency)
  - [x] Define hook return type with all methods

- [x] **Implement Nudge Checking Logic**

  - [x] Create `checkForNudge()` async function
  - [x] Call API route `/api/nudges?studentId={id}`
  - [x] Parse response JSON
  - [x] Set currentNudge state
  - [x] Handle errors gracefully with console logging
  - [x] Return null if no nudge
  - [x] Call markShown API when nudge received

- [x] **Implement Periodic Checking**

  - [x] useEffect on mount: check once
  - [x] Set up interval: check every 5 minutes
  - [x] Clean up interval on unmount
  - [x] Check sessionStorage to avoid redundant checks
  - [x] Set flag after first check with timestamp
  - [x] Test interval behavior - working!

- [x] **Implement Action Handlers**

  - [x] Create `acceptNudge()` function
  - [x] Call API to record interaction: "accepted"
  - [x] Execute nudge action via handleNudgeAction()
  - [x] Clear currentNudge state
  - [x] Create `dismissNudge()` function
  - [x] Call API to record interaction: "dismissed"
  - [x] Clear currentNudge state
  - [x] Test both actions - working perfectly!

- [x] **Create Action Router**
  - [x] Create `handleNudgeAction()` helper function
  - [x] Route "goal_completed" → `/learn`
  - [x] Route "low_task_completion" → `/learn`
  - [x] Route "inactive" → `/learn`
  - [x] Route "streak_broken" → `/learn`
  - [x] All routes tested and working

### 4.2 Create Nudge API Routes ✅

- [x] **Create Check Nudge Route**

  - [x] Create `/app/api/nudges/route.ts`
  - [x] Handle GET request
  - [x] Extract studentId from query params
  - [x] Import nudgeService
  - [x] Check if should nudge (24hr limit)
  - [x] Generate nudge if appropriate
  - [x] Return JSON response { nudge: NudgeMessage | null }
  - [x] Add comprehensive error handling
  - [x] Tested via frontend hook - working!

- [x] **Create Dismiss Nudge Route**

  - [x] Handle POST request to `/api/nudges`
  - [x] Extract studentId and nudgeId from body
  - [x] Extract action: "accepted" | "dismissed" | "expired"
  - [x] Call nudgeService.recordNudgeInteraction()
  - [x] Update student metadata in JSON files
  - [x] Return success response
  - [x] Add error handling
  - [x] Tested via frontend - working perfectly!

- [x] **Create Force Nudge Route (Demo)**
  - [x] Create `/app/api/nudges/force/route.ts`
  - [x] Handle POST request
  - [x] Extract studentId from body
  - [x] Bypass 24-hour limit completely
  - [x] Generate nudge (with fallback for low-risk)
  - [x] Return nudge immediately
  - [x] Always works for demo purposes!
  - [x] Tested extensively - perfect!

### 4.3 Integrate with Main Layout ✅

- [x] **Add to Root Layout**

  - [x] Decided: Use Learn page instead of root layout
  - [x] Better user experience for focused engagement
  - [x] Root layout would be too intrusive

- [x] **Add to Learn Page**

  - [x] Open `/app/learn/page.tsx`
  - [x] Import useNudgeSystem hook
  - [x] Import NudgePopup component
  - [x] Import NudgeTrigger component
  - [x] Call hook with currentStudent?.id
  - [x] Render NudgePopup conditionally when currentNudge exists
  - [x] Render NudgeTrigger for demo (always visible)
  - [x] Tested integration - perfect!

- [x] **Test End-to-End Flow**
  - [x] Open app as Lucas
  - [x] Trigger nudge manually (demo button)
  - [x] Verify nudge appears centered with animations
  - [x] Test "Let's do it!" button (Accept) - redirects correctly
  - [x] Test "Maybe later" button (Dismiss) - closes properly
  - [x] Test X close button - works
  - [x] Verify 24-hour limit works (metadata persists)
  - [x] Test with multiple students - all working!

### 📝 Phase 4 Completion Checklist

**Files Created:**

- [x] `/lib/hooks/useNudgeSystem.ts` - Client-side hook with all logic
- [x] `/app/api/nudges/route.ts` - GET/POST for check and record
- [x] `/app/api/nudges/force/route.ts` - Demo force trigger API

**Files Modified:**

- [x] `/app/learn/page.tsx` - Added complete nudge integration

**Testing:**

- [x] API routes tested via frontend (working perfectly)
- [x] Hook fetches nudges correctly on mount & interval
- [x] Actions route to correct pages (/learn)
- [x] 24-hour limit enforced (metadata tracking)
- [x] Demo trigger works every time (with fallback)
- [x] No memory leaks from intervals (cleanup working)
- [x] SessionStorage prevents duplicate checks
- [x] All interactions persist to JSON files

---

## 🎯 Phase 5: Implement Real-Time Monitoring ✅ 100% COMPLETE

### 5.1 Create Nudge Check on Key Events ✅

- [x] **Trigger on Login**

  - [x] Open `/app/components/auth/StudentSelector.tsx`
  - [x] After successful login, set sessionStorage trigger
  - [x] Show nudge on learn page load
  - [x] Test login flow - working!

- [x] **Trigger on Goal Completion**

  - [x] Created trigger API: `triggerGoalCompletionNudge(goalId)`
  - [x] Ready to integrate when goal completion system is built
  - [x] Hook listens for custom events automatically
  - [x] Will show "goal_completed" nudge
  - [x] Integration point documented

- [x] **Trigger on Task Completion**

  - [x] Created trigger API: `triggerTaskCompletionNudge(taskId, studentId)`
  - [x] Ready to integrate when task system is built
  - [x] Check if task completion rate is low via churn detection
  - [x] Integration point documented

- [x] **Trigger on Onboarding Complete**
  - [x] Added to `/app/onboarding/page.tsx`
  - [x] Triggers welcome nudge after first login
  - [x] Tested and working!

### 5.2 Create Background Monitoring ✅

- [x] **Event Trigger Infrastructure**

  - [x] Created `/lib/hooks/useEventNudgeTrigger.ts`
  - [x] Trigger functions for all event types
  - [x] Custom event system (window.dispatchEvent)
  - [x] SessionStorage for cross-page triggers
  - [x] useNudgeSystem listens automatically
  - [x] Fully extensible for future events

- [x] **Streak Warning (Ready for Integration)**

  - [x] Created `triggerStreakWarningNudge()` function
  - [x] Ready to integrate with streak service
  - [x] Can be called from background job or cron
  - [x] Hook will handle display automatically
  - [x] Integration point: `/lib/services/streakService.ts`

- [ ] **Inactivity Detection (Optional - Phase 2)**
  - [ ] Deferred to Phase 2 (not critical for MVP)
  - [ ] Would need `useInactivityDetector()` hook
  - [ ] Track mouse/keyboard events
  - [ ] Show nudge after 5 minutes idle
  - [ ] Lower priority than other features

### 📝 Phase 5 Completion Checklist

**Files Created:**

- [x] `/lib/hooks/useEventNudgeTrigger.ts` - Event trigger API
- [x] `/scripts/test-event-triggers.ts` - Test script

**Files Modified:**

- [x] `/lib/hooks/useNudgeSystem.ts` - Added event listener & sessionStorage checks
- [x] `/app/components/auth/StudentSelector.tsx` - Login trigger
- [x] `/app/onboarding/page.tsx` - Onboarding complete trigger
- [x] `/package.json` - Added test:events command

**Testing:**

- [x] Login triggers nudge check - working!
- [x] Onboarding complete triggers nudge - working!
- [x] Event API ready for goal/task completion
- [x] Extensible system for future events
- [x] Test script runs successfully
- [x] Browser testing confirmed working

**Integration Points Ready:**

- [x] `triggerGoalCompletionNudge(goalId)` - Ready for goal system
- [x] `triggerTaskCompletionNudge(taskId, studentId)` - Ready for task system
- [x] `triggerStreakWarningNudge()` - Ready for streak service
- [x] `triggerSessionCompleteNudge()` - Ready for session system

---

## 📊 Phase 6: Analytics & Logging ✅ 100% COMPLETE

### 6.1 Create Logging System ✅

- [x] **Add Console Logging**

  - [x] In `nudgeService.recordInteraction()`, log to console
  - [x] Format: Color-coded with emoji, timestamp, trigger, priority
  - [x] Color code: Green for accepted, yellow for dismissed, blue for shown
  - [x] Log nudge generation with full details
  - [x] Log 24-hour limit blocks

- [x] **Create Metrics Tracking Structure**

  - [x] Create `/types/metrics.ts`
  - [x] Define `NudgeMetrics` interface (from PRD)
  - [x] Define `SessionMetrics` interface
  - [x] Define `ChurnMetrics` interface
  - [x] Define `SystemStats` interface
  - [x] Prepare for Phase 2 database storage
  - [x] Export types

- [x] **Add Session Storage Tracking**
  - [x] Store nudge interactions in sessionStorage
  - [x] Key: `"nudge_metrics_${studentId}"`
  - [x] Array of interactions with full metadata
  - [x] Calculate aggregated metrics (acceptance rate, etc.)
  - [x] Export functionality for analysis
  - [x] Clear on logout functionality

### 6.2 Create Metrics Service ✅

- [x] **Create Metrics Service**

  - [x] Create `/lib/services/metricsService.ts`
  - [x] Implement `getSessionMetrics()` - Get/initialize session data
  - [x] Implement `recordMetric()` - Track all interactions
  - [x] Implement `calculateMetrics()` - Aggregate stats
  - [x] Implement `logMetricToConsole()` - Color-coded logging
  - [x] Implement `printSessionSummary()` - Dev summary
  - [x] Implement `clearSessionMetrics()` - Cleanup
  - [x] Implement `exportMetrics()` - JSON export
  - [x] Export from services index

- [x] **Integrate with Nudge Service**

  - [x] Call `recordMetric()` in `markNudgeShown()`
  - [x] Call `recordMetric()` in `recordNudgeInteraction()`
  - [x] Pass trigger and priority metadata
  - [x] Test integration - working!

- [ ] **Debug Panel (Optional - Deferred)**
  - [ ] Can add `/app/components/retention/NudgeDebugPanel.tsx` later
  - [ ] Would show real-time stats in UI
  - [ ] Not critical for Phase 1
  - [ ] Metrics available via console for now

### 📝 Phase 6 Completion Checklist

**Files Created:**

- [x] `/types/metrics.ts` - Complete metrics type system (6 interfaces)
- [x] `/lib/services/metricsService.ts` - Full metrics service (200+ lines)

**Files Modified:**

- [x] `/lib/services/nudgeService.ts` - Integrated metrics recording
- [x] `/lib/services/index.ts` - Export metrics service
- [x] `/app/api/nudges/route.ts` - Pass trigger/priority data
- [x] `/lib/hooks/useNudgeSystem.ts` - Send metrics with API calls
- [x] `/types/index.ts` - Export metrics types

**Logging & Metrics:**

- [x] All nudge events logged to console with color coding
- [x] Interactions tracked in sessionStorage per student
- [x] Aggregated metrics calculated (acceptance rate, trigger breakdown)
- [x] Session summary available via console
- [x] Export functionality for analysis
- [x] Ready for database persistence in Phase 2
- [x] No linting errors!

---

## 🧪 Phase 7: Testing Infrastructure ✅ 0% COMPLETE

### 7.1 Create Automated Test Suite ⏳

- [ ] **Create Test File**

  - [ ] Create `/scripts/test-retention.ts`
  - [ ] Import all retention services
  - [ ] Import student fixtures
  - [ ] Set up test utilities
  - [ ] Add color-coded output

- [ ] **Test Churn Detection**

  - [ ] Test calculateChurnRisk() with Lucas (expect LOW/NONE)
  - [ ] Test with Eva (expect LOW/MEDIUM)
  - [ ] Test with Mia simulated churn (expect HIGH)
  - [ ] Test with Pat (expect NONE)
  - [ ] Verify score calculations
  - [ ] Verify reasons array contents
  - [ ] Verify interventions array
  - [ ] Test edge cases (new account, no data)

- [ ] **Test Nudge Generation**

  - [ ] Test generateNudge() for inactive student
  - [ ] Test for goal_completed student
  - [ ] Test for streak_broken student
  - [ ] Test for low_task_completion student
  - [ ] Verify celebrate-first structure
  - [ ] Verify age-appropriate language
  - [ ] Test template selection logic
  - [ ] Test personalization with placeholders

- [ ] **Test 24-Hour Limit**

  - [ ] Test shouldNudge() returns false if recent nudge
  - [ ] Test returns true if >24 hours
  - [ ] Test metadata updates correctly
  - [ ] Test edge case: no metadata

- [ ] **Add Test Runner**
  - [ ] Add `"test:retention": "bun run scripts/test-retention.ts"` to package.json
  - [ ] Test command execution
  - [ ] Ensure all tests pass

### 7.2 Create Manual Testing Checklist ⏳

- [ ] **Create Testing Guide**

  - [ ] Create `/Docs/PRD6/RETENTION_TESTING.md`
  - [ ] Section 1: Setup instructions
  - [ ] Section 2: Churn detection tests (step-by-step)
  - [ ] Section 3: Nudge generation tests
  - [ ] Section 4: UI component tests
  - [ ] Section 5: Integration tests
  - [ ] Section 6: Demo scenario tests
  - [ ] Section 7: Acceptance criteria checklist

- [ ] **Create Quick Test Scenarios**
  - [ ] Scenario 1: Healthy student (Lucas) - no nudge
  - [ ] Scenario 2: Inactive student (Mia) - expect nudge
  - [ ] Scenario 3: Goal complete - expect celebration
  - [ ] Scenario 4: Streak about to break - expect warning
  - [ ] Scenario 5: Demo trigger - force all nudge types
  - [ ] Document expected results

### 7.3 Create Demo Preparation ⏳

- [ ] **Set Up Demo Scenarios**

  - [ ] Create `/scripts/setup-demo-scenarios.ts`
  - [ ] Scenario A: Simulate Mia with 2 sessions, 4 days inactive
  - [ ] Scenario B: Simulate Eva with completed goal, no new goal
  - [ ] Scenario C: Simulate Pat with broken 5-day streak
  - [ ] Script to restore original data after demo
  - [ ] Test scenario switching

- [ ] **Create Demo Script**
  - [ ] Create `/Docs/PRD6/DEMO_SCRIPT.md`
  - [ ] Step 1: Show healthy student (no nudge)
  - [ ] Step 2: Trigger demo nudge with button
  - [ ] Step 3: Show different nudge types
  - [ ] Step 4: Demonstrate celebrate-first approach
  - [ ] Step 5: Show 24-hour limit in debug panel
  - [ ] Step 6: Show toast notifications
  - [ ] Talking points for each step

### 📝 Phase 7 Completion Checklist

**Files Created:**

- [ ] `/scripts/test-retention.ts` - Automated test suite
- [ ] `/Docs/PRD6/RETENTION_TESTING.md` - Manual testing guide
- [ ] `/Docs/PRD6/DEMO_SCRIPT.md` - Demo walkthrough
- [ ] `/scripts/setup-demo-scenarios.ts` - Demo setup script

**Testing:**

- [ ] Automated tests run with `bun run test:retention`
- [ ] All tests passing (>95% pass rate acceptable)
- [ ] Manual test scenarios documented
- [ ] Demo scenarios ready to showcase

---

## 🎨 Phase 8: Polish & Edge Cases ✅ 0% COMPLETE

### 8.1 Handle Edge Cases ⏳

- [ ] **No Student Data**

  - [ ] Test nudge system with empty student
  - [ ] Graceful fallback (no crash)
  - [ ] Return null nudge
  - [ ] Log warning

- [ ] **Multiple Tabs Open**

  - [ ] Test nudge shown in multiple tabs
  - [ ] Use localStorage to sync dismissal
  - [ ] Prevent double-showing
  - [ ] Test cross-tab behavior

- [ ] **Network Errors**

  - [ ] Test API failure scenario
  - [ ] Show error toast (friendly message)
  - [ ] Retry logic (exponential backoff)
  - [ ] Graceful degradation

- [ ] **Race Conditions**
  - [ ] Test rapid clicking on demo trigger
  - [ ] Prevent multiple popups
  - [ ] Use loading state
  - [ ] Debounce trigger

### 8.2 Accessibility ⏳

- [ ] **Keyboard Navigation**

  - [ ] Test Tab key navigation
  - [ ] Focus trap in popup (tab stays in popup)
  - [ ] Escape key closes popup
  - [ ] Enter key activates primary button
  - [ ] Test with keyboard only (no mouse)

- [ ] **Screen Reader Support**

  - [ ] Add aria-label to close button
  - [ ] Add aria-live to toast container
  - [ ] Add role="dialog" to popup
  - [ ] Add aria-modal="true" to popup
  - [ ] Test with VoiceOver/NVDA

- [ ] **Focus Management**
  - [ ] Focus popup on open
  - [ ] Restore focus after close
  - [ ] Test focus indicators visible
  - [ ] Test with DevTools Lighthouse

### 8.3 Performance Optimization ⏳

- [ ] **Memoization**

  - [ ] Wrap expensive calculations in useMemo
  - [ ] Memoize template selection
  - [ ] Memoize celebration point finding
  - [ ] Test performance improvement

- [ ] **Lazy Loading**

  - [ ] Lazy load NudgePopup component
  - [ ] Load only when nudge exists
  - [ ] Test bundle size reduction

- [ ] **Throttle Checks**
  - [ ] Throttle periodic nudge checks (5 min minimum)
  - [ ] Cache churn assessment (5 min TTL)
  - [ ] Reduce redundant API calls
  - [ ] Test with network tab

### 📝 Phase 8 Completion Checklist

**Edge Cases:**

- [ ] All edge cases handled gracefully
- [ ] No console errors in any scenario
- [ ] Error states have user-friendly messages

**Accessibility:**

- [ ] Keyboard navigation works perfectly
- [ ] Screen reader announces correctly
- [ ] Focus management is proper
- [ ] Lighthouse score >90

**Performance:**

- [ ] No unnecessary re-renders
- [ ] API calls are optimized
- [ ] Bundle size is reasonable
- [ ] No memory leaks

---

## 📚 Phase 9: Documentation ✅ 0% COMPLETE

### 9.1 Code Documentation ⏳

- [ ] **Add JSDoc Comments**

  - [ ] Document all functions in churnDetectionService.ts
  - [ ] Document all functions in nudgeService.ts
  - [ ] Document all hooks (useNudgeSystem)
  - [ ] Add parameter descriptions
  - [ ] Add return type descriptions
  - [ ] Add usage examples

- [ ] **Add Component Documentation**
  - [ ] Document NudgePopup props
  - [ ] Document ToastNotification props
  - [ ] Add usage examples in comments
  - [ ] Document expected behavior

### 9.2 User-Facing Documentation ⏳

- [ ] **Update README.md**

  - [ ] Add "Retention System" section
  - [ ] Explain churn detection
  - [ ] Explain nudge system
  - [ ] Document demo trigger usage
  - [ ] Add screenshots (optional)

- [ ] **Create Architecture Doc**

  - [ ] Create `/Docs/PRD6/RETENTION_ARCHITECTURE.md`
  - [ ] Diagram: Churn detection flow
  - [ ] Diagram: Nudge generation flow
  - [ ] Diagram: UI component hierarchy
  - [ ] Document integration points
  - [ ] Document data flow

- [ ] **Create Feature Guide**
  - [ ] Create `/Docs/PRD6/RETENTION_FEATURES.md`
  - [ ] Explain celebrate-first approach
  - [ ] Explain 24-hour limit
  - [ ] Explain churn scoring
  - [ ] Document all nudge triggers
  - [ ] Best practices for retention

### 9.3 Developer Handoff ⏳

- [ ] **Create Implementation Summary**

  - [ ] Update this tasks file with final status
  - [ ] List all files created
  - [ ] List all files modified
  - [ ] Document any deviations from PRD
  - [ ] Note known limitations

- [ ] **Create Phase 2 Plan**
  - [ ] Document what's ready for Phase 2
  - [ ] List: Real push notifications
  - [ ] List: Database storage for metrics
  - [ ] List: Analytics dashboard
  - [ ] List: A/B testing system
  - [ ] Estimate effort for Phase 2

### 📝 Phase 9 Completion Checklist

**Documentation:**

- [ ] All code has JSDoc comments
- [ ] README updated with retention features
- [ ] Architecture documented
- [ ] Feature guide complete
- [ ] Developer handoff ready

---

## ✅ Phase 10: Final Testing & Acceptance ✅ 0% COMPLETE

### 10.1 Comprehensive Testing ⏳

- [ ] **Run All Test Suites**

  - [ ] `bun run test:retention` - all passing
  - [ ] `bun run verify-openai` - connection verified
  - [ ] `bun run dev` - no errors on startup
  - [ ] TypeScript compilation - no errors
  - [ ] Linting - no errors

- [ ] **Manual User Journey Testing**

  - [ ] Test as Lucas (healthy student)
  - [ ] Test as Eva (moderate engagement)
  - [ ] Test as Mia (at-risk student)
  - [ ] Test as Pat (high performer)
  - [ ] Test all nudge types appear correctly
  - [ ] Test all actions work correctly
  - [ ] Test on mobile viewport
  - [ ] Test on tablet viewport

- [ ] **Integration Testing**
  - [ ] Test retention + achievements integration
  - [ ] Test retention + streaks integration
  - [ ] Test retention + AI chat integration
  - [ ] Test retention + task system integration
  - [ ] No conflicts between systems

### 10.2 Demo Rehearsal ⏳

- [ ] **Practice Demo Flow**

  - [ ] Follow DEMO_SCRIPT.md
  - [ ] Time the demo (should be <5 minutes)
  - [ ] Prepare talking points
  - [ ] Test all demo scenarios
  - [ ] Have backup scenarios ready

- [ ] **Prepare Demo Environment**
  - [ ] Set up fresh demo data
  - [ ] Clear any test data
  - [ ] Verify demo button is visible
  - [ ] Test in production-like environment
  - [ ] Have debug panel ready (if needed)

### 10.3 Acceptance Criteria Verification ⏳

**From RetentionPRD.md:**

- [ ] **Churn Detection**

  - [ ] Risk assessment calculates score correctly
  - [ ] HIGH risk: >60 score
  - [ ] MEDIUM risk: 35-60 score
  - [ ] LOW risk: 15-35 score
  - [ ] NONE: <15 score
  - [ ] All 5 primary indicators checked
  - [ ] Reasons array populated accurately
  - [ ] Interventions suggested appropriately

- [ ] **Nudge System**

  - [ ] Nudge generation works for all trigger types
  - [ ] Age-appropriate templates selected
  - [ ] Celebrate-first structure maintained
  - [ ] Personalization replaces placeholders
  - [ ] Celebration points found automatically
  - [ ] Template selection matches risk level
  - [ ] Messages are encouraging, not shaming

- [ ] **Frequency Control**

  - [ ] Maximum 1 nudge per 24 hours enforced
  - [ ] Last nudge timestamp saved correctly
  - [ ] No duplicate nudges for same trigger
  - [ ] Expired nudges don't re-appear

- [ ] **UI Components**

  - [ ] Popup displays with smooth animation
  - [ ] AI character placeholder shows
  - [ ] Backdrop dims screen appropriately
  - [ ] Accept button redirects to correct action
  - [ ] Dismiss button closes popup
  - [ ] Close X button works
  - [ ] Popup responsive on mobile
  - [ ] z-index ensures popup always on top

- [ ] **Interactions**

  - [ ] Accept action triggers appropriate next step
  - [ ] Dismiss action records interaction
  - [ ] Interaction timestamps logged
  - [ ] Student returns to task/goal appropriately
  - [ ] Analytics track all nudge events (console)

- [ ] **Notifications**

  - [ ] Toast notifications appear correctly
  - [ ] Notifications auto-dismiss after 5 seconds
  - [ ] Multiple notifications stack properly
  - [ ] Toast styling matches design system

- [ ] **Demo Features**
  - [ ] Demo trigger button works
  - [ ] All nudge types can be triggered
  - [ ] Debug panel shows useful info (if built)
  - [ ] Demo scenarios easy to set up

### 📝 Phase 10 Completion Checklist

**Testing:**

- [ ] All automated tests passing
- [ ] All manual tests passing
- [ ] All acceptance criteria met
- [ ] No critical bugs

**Demo:**

- [ ] Demo rehearsed and ready
- [ ] Demo environment prepared
- [ ] Talking points prepared
- [ ] Backup scenarios ready

**Sign-Off:**

- [ ] Code reviewed (self or peer)
- [ ] Documentation complete
- [ ] Ready for user demonstration
- [ ] Ready for Phase 2 planning

---

## 🎯 Definition of Done

A task is considered complete when:

1. ✅ Code is implemented and functioning correctly
2. ✅ TypeScript types are correct (no errors)
3. ✅ Function returns expected output with test data
4. ✅ Error handling is implemented
5. ✅ JSDoc comments are added (Phase 9)
6. ✅ Integration with existing services works
7. ✅ Tested with all 4 student personas
8. ✅ UI components are responsive and accessible
9. ✅ Animations are smooth and delightful
10. ✅ Code follows existing patterns

---

## 📊 Progress Tracking

### How to Use This Document

1. **Mark tasks as complete** by changing `[ ]` to `[x]`
2. **Add notes** below tasks as needed (use indented bullet points)
3. **Track blockers** by adding `🚫` emoji before blocked tasks
4. **Mark in-progress** by adding `🔄` emoji before current tasks
5. **Update phase percentages** at the top of each phase

### Priority Indicators

- 🔴 **Critical** - Core functionality, blocking demo
- 🟡 **High** - Important for quality user experience
- 🟢 **Medium** - Nice to have, enhances system
- 🔵 **Low** - Polish and optimization

### Implementation Strategy

- **Sequential Phases:** Services first, then UI, then integration, then testing
- **Test Early:** Test each service function before moving on
- **Iterative:** Get basic version working, then enhance
- **Demo-Ready:** Always keep demo trigger working
- **Timeline:** 4-6 days estimated, user-managed pace

---

## 🚀 Quick Start Guide

### To Begin Implementation:

1. **Phase 1 First:** Start with enhancing churn detection service
2. **Test Thoroughly:** Use `bun run test:retention` after each phase
3. **Use Demo Trigger:** Build the trigger button early for testing
4. **Follow AITasks.md Pattern:** We've already done this successfully

### Command Reference:

```bash
# Development
bun run dev

# Testing
bun run test:retention     # Run retention test suite
bun run test:ai           # Verify AI still works
bun run verify-openai     # Check API connection

# TypeScript & Linting
bun run build             # Check for errors
```

---

## 🔗 Related Documents

**Primary References:**

- **RetentionPRD.md** - Full specification (Shard 6)
- **architecture.md** - System architecture overview
- **AITasks.md** - Reference for task structure (100% complete ✅)

**Related PRDs:**

- Shard 1: Overview (success metrics - 52% → <30% churn)
- Shard 4: Achievements (integration point for celebrations)
- Shard 5: AI Integration (AI-powered personalization)
- Shard 10: Implementation Roadmap (Week 2, Day 7)

**Integration Points:**

- `streakService.ts` - Streak data for nudges
- `achievementService.ts` - Achievement celebrations
- `studentService.ts` - Student data and metadata
- `aiService.ts` - AI personalization (optional)
- `taskService.ts` - Task completion tracking

---

## 📝 Notes & Decisions

### Architecture Decisions

- **Hybrid AI Approach:** Templates for speed/cost + AI for personalization (opt-in)
- **Celebrate-First:** Always lead with positive before encouraging action
- **24-Hour Limit:** Prevent notification fatigue
- **Demo-Friendly:** Easy to trigger and showcase in browser
- **Phase 1 Simplicity:** JSON storage, console logging, in-app notifications

### Implementation Decisions

- Enhance existing services (churnDetectionService, nudgeService)
- New folder: `/app/components/retention/` for UI
- New hook: `/lib/hooks/useNudgeSystem.ts` for integration
- API routes: `/app/api/nudges/` for client-server communication
- Demo trigger: Floating button in dev mode
- Toast notifications: In-app only (Phase 2: real browser notifications)

### Open Questions

- **AI Usage:** How often to use AI vs templates? (Start: templates only, opt-in AI)
- **Nudge Frequency:** Is 24hr limit too strict? (Test with users, adjust later)
- **Demo Scenarios:** Which scenarios to prioritize? (All 5 trigger types)
- **Analytics:** Store in sessionStorage or localStorage? (Session for Phase 1)

### Estimated Costs

**Development Testing (1 week):**

- Mostly template-based (no AI cost)
- If AI personalization used: ~50 calls × $0.003 = $0.15
- Budget: Minimal cost (<$1 total)

**Production (per student per week):**

- ~2 nudges per week (if at-risk)
- Template-based: $0
- AI-enhanced: ~$0.006 per week per at-risk student
- 100 students × 20% at-risk × $0.006 = $0.12/week = $0.48/month

**Result:** Nearly free for Phase 1 template approach! 🎉

---

## ✨ Success Metrics

After implementation, measure:

- **Churn Rate:** Target <30% (from baseline 52%)
- **Nudge Acceptance Rate:** Target >30%
- **Return Within 24h:** Target >40%
- **Task Completion After Nudge:** Target >50%
- **Student Feedback:** Qualitative assessment

Track in Phase 2 with proper analytics dashboard.

---

## 🎉 Post-Implementation

After completing all phases:

1. **Demonstrate:** Show retention system in demo
2. **Gather Feedback:** Note what works, what doesn't
3. **Monitor Metrics:** Track acceptance/dismissal rates
4. **Iterate:** Adjust templates based on real usage
5. **Plan Phase 2:** Real notifications, analytics, A/B testing

---

**🎯 Ready to combat that 52% churn rate! Let's build this! 💪**

**Remember: Celebrate-first, encourage gently, make return easy. We got this! 🚀**

---

**End of Retention Implementation Tasks**
