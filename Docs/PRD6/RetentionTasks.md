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
- Completed: 0 (Ready to start!)
- In Progress: 0
- Blocked: 0
- **Strategy:** Enhance existing services → Build UI components → Integrate → Test → Polish

**Estimated Timeline:** 4-6 days (flexible, user-managed pace)  
**Time Elapsed:** Starting now!  
**Status:** 🎯 **Phase 1 Ready to Begin**

---

## 🔍 Phase 1: Enhance Churn Detection Service ✅ 0% COMPLETE

### 1.1 Update Student Data Structure ⏳

- [ ] **Add Metadata Fields to Student Type**

  - [ ] Open `/types/student.ts`
  - [ ] Add `metadata?` object to Student interface
  - [ ] Add `lastNudgeShown?: string` field
  - [ ] Add `lastNudgeId?: string` field
  - [ ] Add `nudgeHistory?: NudgeInteraction[]` array
  - [ ] Create `NudgeInteraction` interface
  - [ ] Test TypeScript compilation

- [ ] **Update Student JSON Files**

  - [ ] Add `metadata: {}` to lucas.json
  - [ ] Add `metadata: {}` to eva.json
  - [ ] Add `metadata: {}` to pat.json
  - [ ] Add `metadata: {}` to mia.json
  - [ ] Verify JSON structure is valid

- [ ] **Create Demo Churn Scenarios**
  - [ ] Create mia-churn-scenario.md with test data
  - [ ] Document: 2 sessions in 15 days (churn risk)
  - [ ] Document: No activity for 4 days scenario
  - [ ] Document: Completed goal, no new goal scenario
  - [ ] Document: Broken streak scenario
  - [ ] Save test scenarios for Phase 10

### 1.2 Enhance Churn Risk Assessment ⏳

- [ ] **Update ChurnRiskAssessment Interface**

  - [ ] Open `/lib/services/churnDetectionService.ts`
  - [ ] Rename `riskLevel` to `level` (match PRD)
  - [ ] Rename `factors` to `reasons` (match PRD)
  - [ ] Rename `recommendations` to `interventions` (match PRD)
  - [ ] Add `daysSinceActive: number` field
  - [ ] Add `sessionCount: number` field
  - [ ] Export ChurnRisk enum from PRD
  - [ ] Update all function signatures

- [ ] **Implement PRD-Spec Scoring System**

  - [ ] Rewrite `calculateChurnRisk()` to match PRD exactly
  - [ ] Factor 1: Session count in first 7 days (weights: 40, 30, 35)
  - [ ] Factor 2: Inactivity duration (weights: 35, 20, 10)
  - [ ] Factor 3: Task completion tracking (weights: 25, 15)
  - [ ] Factor 4: Goal completion status (weight: 30)
  - [ ] Factor 5: Streak status (weight: 15)
  - [ ] Calculate total score (0-100)
  - [ ] Map score to risk level (HIGH ≥60, MEDIUM 35-60, LOW 15-35, NONE <15)
  - [ ] Populate reasons array with specific messages
  - [ ] Populate interventions array with actions

- [ ] **Implement Helper Functions**

  - [ ] Create `getAccountAge()` function
  - [ ] Create `getDaysSinceActive()` function
  - [ ] Create `getTaskStats()` function
  - [ ] Add `shouldNudge()` function (checks 24hr limit)
  - [ ] Add error handling for all functions
  - [ ] Test with mock student data

- [ ] **Test Churn Detection**
  - [ ] Test Lucas (healthy - expect NONE/LOW)
  - [ ] Test Eva (moderate - expect LOW/MEDIUM)
  - [ ] Test Mia (at-risk - expect HIGH)
  - [ ] Test Pat (engaged - expect NONE)
  - [ ] Verify score calculations are accurate
  - [ ] Verify reasons match risk factors
  - [ ] Verify interventions are appropriate

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

## 💬 Phase 2: Enhance Nudge Service with AI Hybrid ✅ 0% COMPLETE

### 2.1 Create Nudge Templates System ⏳

- [ ] **Create Template Types**

  - [ ] Create `/types/nudge.ts` file
  - [ ] Define `NudgeTemplate` interface (id, trigger, ageGroup, messages, intensity)
  - [ ] Define `NudgeMessage` interface (id, studentId, type, trigger, celebration, encouragement, cta, priority, createdAt, expiresAt)
  - [ ] Define `ChurnReason` type (inactive, goal_completed, low_task_completion, streak_broken, general_encouragement)
  - [ ] Export all types
  - [ ] Add to `/types/index.ts`

- [ ] **Create Template Library**

  - [ ] Open `/lib/services/nudgeService.ts`
  - [ ] Create `NUDGE_TEMPLATES` array with all PRD templates
  - [ ] Add 3 inactive templates (young, middle, teen)
  - [ ] Add 3 goal_completed templates (young, middle, teen)
  - [ ] Add low_completion template (young)
  - [ ] Add streak_broken template (middle)
  - [ ] Add 3 general encouragement templates (fallbacks)
  - [ ] Verify celebrate-first structure in all templates
  - [ ] Test template selection logic

- [ ] **Create Template Selection Logic**
  - [ ] Create `determineTrigger()` function
  - [ ] Prioritize: goal_completed > inactive > streak_broken > low_completion
  - [ ] Create `selectTemplate()` function
  - [ ] Match by trigger + ageGroup
  - [ ] Fall back to general template if no match
  - [ ] Match intensity to risk level
  - [ ] Test with various student states

### 2.2 Implement AI Personalization (Hybrid) ⏳

- [ ] **Create Personalization Functions**

  - [ ] Create `findCelebrationPoint()` function
  - [ ] Check achievements (count, display with emoji)
  - [ ] Check streak (longest streak display)
  - [ ] Check progress (high progress goals)
  - [ ] Check completed tasks (milestone counts)
  - [ ] Return random celebration or null
  - [ ] Test with all 4 student personas

- [ ] **Create AI Enhancement Function (Optional)**

  - [ ] Create `enhanceNudgeWithAI()` function (async)
  - [ ] Accept template + student + context
  - [ ] Build prompt: "Personalize this nudge: {template} for {student}"
  - [ ] Call OpenAI with max 100 tokens
  - [ ] Parse and validate response
  - [ ] Fall back to template if AI fails
  - [ ] Track token usage
  - [ ] Make this opt-in via env var `NUDGE_USE_AI=false`

- [ ] **Implement Placeholder Replacement**

  - [ ] Create `replacePlaceholders()` function
  - [ ] Replace {name} with student.name
  - [ ] Replace {age} with student.age
  - [ ] Replace {grade} with student.grade
  - [ ] Replace {subject} with goal.subject
  - [ ] Replace {progress} with goal.progress
  - [ ] Test with various messages

- [ ] **Create Main Generation Function**
  - [ ] Rewrite `generateNudge()` to use new system
  - [ ] Check if should nudge (24hr limit)
  - [ ] Assess churn risk
  - [ ] Determine trigger reason
  - [ ] Select appropriate template
  - [ ] Find celebration point
  - [ ] Replace placeholders
  - [ ] Optionally enhance with AI
  - [ ] Return complete NudgeMessage
  - [ ] Test end-to-end generation

### 2.3 Implement Nudge Tracking & Limits ⏳

- [ ] **Create Tracking Functions**

  - [ ] Keep existing `shouldNudge()` function
  - [ ] Check student.metadata.lastNudgeShown
  - [ ] Enforce 24-hour limit between nudges
  - [ ] Return boolean
  - [ ] Test limit enforcement

- [ ] **Create Interaction Recording**

  - [ ] Keep `markShown()` function, enhance to save to JSON
  - [ ] Update student.metadata.lastNudgeShown
  - [ ] Update student.metadata.lastNudgeId
  - [ ] Save student data
  - [ ] Create `recordInteraction()` function
  - [ ] Log to console (Phase 1)
  - [ ] Prepare structure for Phase 2 analytics
  - [ ] Track: accepted, dismissed, expired actions

- [ ] **Create Expiration Logic**
  - [ ] Create `getExpirationTime()` function (24 hours from now)
  - [ ] Add expiration check in nudge display logic
  - [ ] Auto-expire old nudges
  - [ ] Test expiration edge cases

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

## 🎨 Phase 3: Build Nudge UI Components ✅ 0% COMPLETE

### 3.1 Create NudgePopup Component ⏳

- [ ] **Set Up Component Structure**

  - [ ] Create `/app/components/retention/` folder
  - [ ] Create `NudgePopup.tsx` file
  - [ ] Import Framer Motion
  - [ ] Import NudgeMessage type
  - [ ] Define NudgePopupProps interface
  - [ ] Set up component with TypeScript

- [ ] **Implement Popup UI**

  - [ ] Create backdrop overlay (fixed, inset-0, z-index 9998)
  - [ ] Create popup container (fixed, centered, z-index 9999)
  - [ ] Add AI character placeholder (80px circle)
  - [ ] Add celebration text section (font-hand, orange)
  - [ ] Add encouragement text section (font-sketch, sketch color)
  - [ ] Add CTA button (sketch-button--primary)
  - [ ] Add "Maybe later" button (sketch-button--ghost)
  - [ ] Add close X button (top-right, circular)
  - [ ] Apply doodle/sketch styling from design system

- [ ] **Add Animations**

  - [ ] Backdrop fade in/out (opacity 0 → 1)
  - [ ] Popup spring animation (scale 0 + rotate -10 → scale 1)
  - [ ] AI character floating animation (y: [0, -5, 0], 2s infinite)
  - [ ] Exit animation (scale 0.8, opacity 0)
  - [ ] Button hover effects (scale 1.05)
  - [ ] Button tap effects (scale 0.95)
  - [ ] Test animations are smooth

- [ ] **Implement Interaction Logic**
  - [ ] Create `handleAccept()` function
  - [ ] Call `onAccept()` callback
  - [ ] Close with animation
  - [ ] Create `handleDismiss()` function
  - [ ] Call `onDismiss()` callback
  - [ ] Close with animation
  - [ ] Handle backdrop click (dismiss)
  - [ ] Handle Escape key (dismiss)
  - [ ] Test all interactions

### 3.2 Create Toast Notification Component ⏳

- [ ] **Create ToastNotification Component**

  - [ ] Create `/app/components/retention/ToastNotification.tsx`
  - [ ] Define Toast interface (id, title, message, type, icon)
  - [ ] Create toast container component
  - [ ] Position: fixed bottom-right
  - [ ] Stack multiple toasts vertically
  - [ ] Add icon section (emoji/icon)
  - [ ] Add title section (font-hand, bold)
  - [ ] Add message section (font-sketch, smaller)
  - [ ] Apply doodle styling

- [ ] **Implement Toast Animations**

  - [ ] Slide in from right (x: 100 → 0)
  - [ ] Auto-dismiss after 5 seconds
  - [ ] Slide out on dismiss (opacity + x)
  - [ ] Stack animation (y offset for multiple)
  - [ ] Test multiple toasts at once

- [ ] **Create Notification Service**
  - [ ] Create `/lib/services/notificationService.ts`
  - [ ] Create `showToast()` function
  - [ ] Generate unique ID for each toast
  - [ ] Manage toast queue (max 3 visible)
  - [ ] Auto-dismiss logic
  - [ ] Export for use across app
  - [ ] Test toast display

### 3.3 Create Demo Trigger Button ⏳

- [ ] **Create NudgeTrigger Component**

  - [ ] Create `/app/components/retention/NudgeTrigger.tsx`
  - [ ] Create floating button (bottom-left, fixed)
  - [ ] Style as sketch button with "🔔 Test Nudge" text
  - [ ] Make it prominent but not intrusive
  - [ ] Add dev-only check (process.env.NODE_ENV)
  - [ ] Add click handler

- [ ] **Implement Trigger Logic**

  - [ ] Import studentService
  - [ ] Import nudgeService
  - [ ] On click: force generate nudge (ignore 24hr limit)
  - [ ] Show nudge popup immediately
  - [ ] Add loading state
  - [ ] Add error handling
  - [ ] Test with all students

- [ ] **Create Scenario Selector (Bonus)**
  - [ ] Add dropdown to select scenario
  - [ ] Options: "Inactive 3 days", "Goal Complete", "Streak Broken", "Low Completion"
  - [ ] Temporarily modify student state for demo
  - [ ] Restore state after demo
  - [ ] Test all scenarios

### 📝 Phase 3 Completion Checklist

**Files Created:**

- [ ] `/app/components/retention/NudgePopup.tsx` - Main popup component
- [ ] `/app/components/retention/ToastNotification.tsx` - Toast component
- [ ] `/app/components/retention/NudgeTrigger.tsx` - Demo button
- [ ] `/lib/services/notificationService.ts` - Toast service

**Styling:**

- [ ] Popup matches PRD design
- [ ] Animations are smooth and delightful
- [ ] Responsive on mobile (test with DevTools)
- [ ] z-index hierarchy correct
- [ ] Doodle/sketch design system applied

**Testing:**

- [ ] Popup displays correctly
- [ ] All buttons work
- [ ] Animations play smoothly
- [ ] Toast notifications appear and dismiss
- [ ] Demo trigger forces nudge display
- [ ] No console errors

---

## 🔗 Phase 4: Create Frontend Integration (Hooks & API) ✅ 0% COMPLETE

### 4.1 Create useNudgeSystem Hook ⏳

- [ ] **Set Up Hook File**

  - [ ] Create `/lib/hooks/useNudgeSystem.ts`
  - [ ] Import useState, useEffect, useCallback
  - [ ] Import NudgeMessage type
  - [ ] Import student context/store
  - [ ] Define hook return type

- [ ] **Implement Nudge Checking Logic**

  - [ ] Create `checkForNudge()` async function
  - [ ] Call API route `/api/nudges?studentId={id}`
  - [ ] Parse response
  - [ ] Set currentNudge state
  - [ ] Handle errors gracefully
  - [ ] Return null if no nudge

- [ ] **Implement Periodic Checking**

  - [ ] useEffect on mount: check once
  - [ ] Set up interval: check every 5 minutes
  - [ ] Clean up interval on unmount
  - [ ] Check sessionStorage to avoid redundant checks in same session
  - [ ] Set flag after first check: "nudge_checked_this_session"
  - [ ] Test interval behavior

- [ ] **Implement Action Handlers**

  - [ ] Create `acceptNudge()` function
  - [ ] Call API to record interaction: "accepted"
  - [ ] Execute nudge action (redirect, show task, etc.)
  - [ ] Clear currentNudge state
  - [ ] Create `dismissNudge()` function
  - [ ] Call API to record interaction: "dismissed"
  - [ ] Clear currentNudge state
  - [ ] Test both actions

- [ ] **Create Action Router**
  - [ ] Create `handleNudgeAction()` helper
  - [ ] Route "goal_completed" → `/goals` or goal selector
  - [ ] Route "low_task_completion" → `/learn` with easy tasks
  - [ ] Route "inactive" → `/learn` main page
  - [ ] Route "streak_broken" → `/learn` with streak display
  - [ ] Test routing for each trigger type

### 4.2 Create Nudge API Routes ⏳

- [ ] **Create Check Nudge Route**

  - [ ] Create `/app/api/nudges/route.ts`
  - [ ] Handle GET request
  - [ ] Extract studentId from query params
  - [ ] Import nudgeService
  - [ ] Check if should nudge (24hr limit)
  - [ ] Generate nudge if appropriate
  - [ ] Return JSON response { nudge: NudgeMessage | null }
  - [ ] Add error handling
  - [ ] Test with Postman/curl

- [ ] **Create Dismiss Nudge Route**

  - [ ] Handle POST request to `/api/nudges`
  - [ ] Extract studentId and nudgeId from body
  - [ ] Extract action: "accepted" | "dismissed"
  - [ ] Call nudgeService.recordInteraction()
  - [ ] Update student metadata
  - [ ] Return success response
  - [ ] Add error handling
  - [ ] Test API endpoint

- [ ] **Create Force Nudge Route (Demo)**
  - [ ] Create `/app/api/nudges/force/route.ts`
  - [ ] Handle POST request
  - [ ] Extract studentId and optional scenario
  - [ ] Bypass 24-hour limit
  - [ ] Generate nudge for scenario
  - [ ] Return nudge immediately
  - [ ] Add dev-only check
  - [ ] Test with demo button

### 4.3 Integrate with Main Layout ⏳

- [ ] **Add to Root Layout**

  - [ ] Open `/app/layout.tsx`
  - [ ] Import useNudgeSystem hook
  - [ ] Import NudgePopup component
  - [ ] Import NudgeTrigger component
  - [ ] Call hook to get currentNudge, acceptNudge, dismissNudge
  - [ ] Render NudgePopup conditionally
  - [ ] Render NudgeTrigger in dev mode
  - [ ] Test integration

- [ ] **Add to Learn Page (Alternative)**

  - [ ] If layout doesn't work, add to `/app/learn/page.tsx`
  - [ ] Same integration pattern
  - [ ] Test on learn page only

- [ ] **Test End-to-End Flow**
  - [ ] Open app as Lucas
  - [ ] Wait for nudge check (or trigger manually)
  - [ ] Verify nudge appears
  - [ ] Test "Accept" action
  - [ ] Test "Dismiss" action
  - [ ] Test "Maybe later" action
  - [ ] Verify 24-hour limit works
  - [ ] Test with other students

### 📝 Phase 4 Completion Checklist

**Files Created:**

- [ ] `/lib/hooks/useNudgeSystem.ts` - Client-side hook
- [ ] `/app/api/nudges/route.ts` - Check and dismiss API
- [ ] `/app/api/nudges/force/route.ts` - Demo force trigger API

**Files Modified:**

- [ ] `/app/layout.tsx` or `/app/learn/page.tsx` - Added nudge integration

**Testing:**

- [ ] API routes tested with curl/Postman
- [ ] Hook fetches nudges correctly
- [ ] Actions route to correct pages
- [ ] 24-hour limit enforced
- [ ] Demo trigger works
- [ ] No memory leaks from intervals

---

## 🎯 Phase 5: Implement Real-Time Monitoring ✅ 0% COMPLETE

### 5.1 Create Nudge Check on Key Events ⏳

- [ ] **Trigger on Login**

  - [ ] Open `/app/login/page.tsx` or auth flow
  - [ ] After successful login, call nudge check API
  - [ ] Show nudge if returned
  - [ ] Test login flow

- [ ] **Trigger on Goal Completion**

  - [ ] Open goal completion handler (likely in learn page)
  - [ ] After marking goal complete, trigger nudge check
  - [ ] Force check even if within 24hr window
  - [ ] Show "goal_completed" nudge
  - [ ] Test goal completion flow

- [ ] **Trigger on Task Completion**

  - [ ] Find task completion handler
  - [ ] Check if task completion rate is low
  - [ ] Trigger nudge if appropriate
  - [ ] Test task flow

- [ ] **Trigger on Session End**
  - [ ] After returning from tutor session
  - [ ] Check if student needs encouragement
  - [ ] Trigger nudge check
  - [ ] Test session completion

### 5.2 Create Background Monitoring ⏳

- [ ] **Implement Inactivity Detection**

  - [ ] Create `useInactivityDetector()` hook
  - [ ] Track last user action (click, scroll, type)
  - [ ] After 2 minutes of inactivity, flag as "inactive"
  - [ ] After 5 minutes, show re-engagement nudge
  - [ ] Reset on any activity
  - [ ] Test inactivity detection

- [ ] **Implement Streak Warning**
  - [ ] In useNudgeSystem, check streak status
  - [ ] If streak about to break (today = last day), show warning
  - [ ] "Your streak is about to break!" nudge
  - [ ] Show at 8pm local time (or evening)
  - [ ] Test streak warning timing

### 📝 Phase 5 Completion Checklist

**Files Modified:**

- [ ] Various event handlers - Added nudge triggers
- [ ] `/lib/hooks/useNudgeSystem.ts` - Added event-based checks

**Testing:**

- [ ] Login triggers nudge check
- [ ] Goal completion shows nudge
- [ ] Task completion triggers when appropriate
- [ ] Inactivity detection works
- [ ] Streak warnings appear at right time

---

## 📊 Phase 6: Analytics & Logging (Console Phase 1) ✅ 0% COMPLETE

### 6.1 Create Logging System ⏳

- [ ] **Add Console Logging**

  - [ ] In `nudgeService.recordInteraction()`, log to console
  - [ ] Format: `"📊 Nudge Interaction: {nudgeId, action, trigger, timestamp}"`
  - [ ] Color code: green for accepted, yellow for dismissed
  - [ ] Log nudge generation with details
  - [ ] Log 24-hour limit blocks

- [ ] **Create Metrics Tracking Structure**

  - [ ] Create `/types/metrics.ts`
  - [ ] Define `NudgeMetrics` interface (from PRD)
  - [ ] Define `NudgeStats` interface
  - [ ] Prepare for Phase 2 database storage
  - [ ] Export types

- [ ] **Add Session Storage Tracking**
  - [ ] Store nudge interactions in sessionStorage
  - [ ] Key: `"nudge_history_${studentId}"`
  - [ ] Array of interactions
  - [ ] Display in console on page load (dev mode)
  - [ ] Clear on logout

### 6.2 Create Simple Analytics View (Optional) ⏳

- [ ] **Create Debug Panel Component**

  - [ ] Create `/app/components/retention/NudgeDebugPanel.tsx`
  - [ ] Show in dev mode only
  - [ ] Display: Total nudges shown
  - [ ] Display: Acceptance rate
  - [ ] Display: Dismissal rate
  - [ ] Display: Last nudge shown
  - [ ] Display: Churn risk score
  - [ ] Collapsible panel (bottom-right corner)

- [ ] **Add to Layout**
  - [ ] Import NudgeDebugPanel in layout
  - [ ] Render if `process.env.NODE_ENV === 'development'`
  - [ ] Test display

### 📝 Phase 6 Completion Checklist

**Files Created:**

- [ ] `/types/metrics.ts` - Metrics type definitions
- [ ] `/app/components/retention/NudgeDebugPanel.tsx` (optional)

**Logging:**

- [ ] All nudge events logged to console
- [ ] Interactions tracked in sessionStorage
- [ ] Debug panel shows real-time stats (optional)

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
