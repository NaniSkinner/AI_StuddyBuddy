# 🔐 Authentication & Onboarding Implementation Tasks

**Project:** AI Study Companion - Phase 2  
**Focus:** Authentication System & Onboarding Flow  
**Based on:** PRD v3 Shard 3 (3-Auth&Onboard.md) + Architecture.md  
**Last Updated:** November 7, 2025

## 🎉 **IMPLEMENTATION STATUS: 0% COMPLETE**

### Current Status:

⏳ **Phase 1 - Authentication System (0% Complete)**

- Design system foundations exist (fonts, colors, animations)
- Mock student data exists in `/data/students/`
- Need to implement auth service, login page, and protected routes

⏳ **Phase 2 - Onboarding Flow (0% Complete)**

- Some onboarding components exist but need auth integration
- Color picker component exists
- Need to implement full 4-step onboarding flow

---

## 📋 Task Overview

This document tracks all authentication and onboarding implementation tasks required to enable user login, session management, and first-time user experience for the AI Study Companion.

**Progress Tracking:**

- Total Tasks: 180+ tasks
- Completed: 0 tasks (0%)
- In Progress: None
- Blocked: 0
- Remaining: All phases

**Key Deliverables:**

1. Authentication against mock student data
2. Session persistence via localStorage
3. Protected route system
4. 4-step onboarding flow (Welcome → Color → Tutorial → Goals)
5. Student profile personalization
6. Onboarding completion tracking

---

## 🔐 Phase 1: Authentication System Foundation

### 1.1 Authentication Service Implementation ⏳

- [ ] **Create authService.ts** (`/lib/services/authService.ts`)

  - [ ] Import Student type from `@/types`
  - [ ] Import studentService for data access
  - [ ] Define STORAGE_KEY constant (`"currentStudentId"`)
  - [ ] Set up service object structure
  - [ ] Add TypeScript type definitions

- [ ] **Implement login() function**

  - [ ] Define function signature: `login(studentId: string): Promise<Student>`
  - [ ] Call `studentService.getStudentById(studentId)`
  - [ ] Add error handling for student not found
  - [ ] Store studentId in localStorage using STORAGE_KEY
  - [ ] Update student's lastLoginAt timestamp
  - [ ] Call `studentService.updateStudent()` with updated data
  - [ ] Return authenticated student object
  - [ ] Add try-catch for error handling
  - [ ] Test with valid student IDs (lucas, eva, pat, mia)
  - [ ] Test with invalid student ID (should throw error)

- [ ] **Implement logout() function**

  - [ ] Define function signature: `logout(): void`
  - [ ] Remove STORAGE_KEY from localStorage
  - [ ] Redirect to `/login` page
  - [ ] Add optional callback parameter for post-logout actions
  - [ ] Test logout clears session
  - [ ] Test redirect works correctly

- [ ] **Implement getCurrentStudent() function**

  - [ ] Define function signature: `getCurrentStudent(): Promise<Student | null>`
  - [ ] Get studentId from localStorage
  - [ ] Return null if no studentId found
  - [ ] Call `studentService.getStudentById(studentId)`
  - [ ] Return student object or null
  - [ ] Add error handling for corrupted session
  - [ ] Test with valid session
  - [ ] Test with no session
  - [ ] Test with expired/invalid session

- [ ] **Implement isAuthenticated() function**

  - [ ] Define function signature: `isAuthenticated(): boolean`
  - [ ] Check if STORAGE_KEY exists in localStorage
  - [ ] Return boolean result
  - [ ] Test with authenticated state
  - [ ] Test with unauthenticated state

- [ ] **Implement validateSession() function**

  - [ ] Define function signature: `validateSession(): Promise<boolean>`
  - [ ] Call `getCurrentStudent()`
  - [ ] Return true if student exists, false otherwise
  - [ ] Add optional token expiration check (future enhancement)
  - [ ] Test session validation
  - [ ] Test with corrupted session data

- [ ] **Export authService**
  - [ ] Export all functions as named exports
  - [ ] Add JSDoc comments for all functions
  - [ ] Document function parameters and return types
  - [ ] Add usage examples in comments

### 1.2 Login Page Implementation ⏳

- [ ] **Create login page structure** (`/app/login/page.tsx`)

  - [ ] Create new file in `/app/login/` directory
  - [ ] Set up as "use client" component
  - [ ] Import required dependencies (React, Next.js, motion)
  - [ ] Import StudentSelector component
  - [ ] Import authService
  - [ ] Define page component structure
  - [ ] Add metadata (title, description)

- [ ] **Implement login page layout**

  - [ ] Create container with `.login-screen` class
  - [ ] Add flex layout (vertical, centered)
  - [ ] Set min-height to 100vh
  - [ ] Add padding (40px)
  - [ ] Apply doodle-cream background
  - [ ] Add optional paper texture overlay
  - [ ] Test responsive layout on mobile/tablet/desktop

- [ ] **Add login page header elements**

  - [ ] Add AI character logo/icon (🧠 emoji or custom)
  - [ ] Create title "AI Study Companion"
  - [ ] Apply Caveat font with rotation (-2deg)
  - [ ] Add subtitle "Welcome! Let's get learning! 🚀"
  - [ ] Apply Patrick Hand font
  - [ ] Add entrance animation (fade + bounce)
  - [ ] Test text sizing on mobile

- [ ] **Integrate StudentSelector component**

  - [ ] Import StudentSelector component
  - [ ] Add to login page layout
  - [ ] Pass necessary props
  - [ ] Add loading state handling
  - [ ] Add error state handling
  - [ ] Test component renders correctly

- [ ] **Add optional manual login input** (PRD mentions "enter your name")

  - [ ] Create input field with DoodleInput component
  - [ ] Add "Or enter your name:" label
  - [ ] Create "Start Learning!" button
  - [ ] Implement name-based login (create new student or match existing)
  - [ ] Add validation for empty name
  - [ ] Style with sketch aesthetic
  - [ ] Test manual login flow

- [ ] **Style login screen CSS**
  - [ ] Create `.login-screen` styles in globals.css
  - [ ] Add background color and texture
  - [ ] Create `.login-title` styles (Caveat, rotation, sizing)
  - [ ] Create `.login-subtitle` styles (Patrick Hand, sizing)
  - [ ] Add responsive typography
  - [ ] Test on all breakpoints (mobile, tablet, desktop)

### 1.3 Student Selector Component ⏳

- [ ] **Create StudentSelector component** (`/app/components/auth/StudentSelector.tsx`)

  - [ ] Create new file in `/app/components/auth/` directory
  - [ ] Set up as "use client" component
  - [ ] Import dependencies (React, useState, useEffect, motion)
  - [ ] Import Student type
  - [ ] Import StudentCard component
  - [ ] Import studentService and authService
  - [ ] Define component interface

- [ ] **Implement component state**

  - [ ] Add students state: `useState<Student[]>([])`
  - [ ] Add loading state: `useState<boolean>(true)`
  - [ ] Add error state: `useState<string | null>(null)`
  - [ ] Initialize state with empty values

- [ ] **Implement loadStudents() function**

  - [ ] Create async function to load students
  - [ ] Call `studentService.getAllStudents()`
  - [ ] Update students state with result
  - [ ] Handle loading state (set false when done)
  - [ ] Add error handling (catch and set error state)
  - [ ] Add console logging for debugging
  - [ ] Test with mock student data

- [ ] **Implement useEffect for data loading**

  - [ ] Call loadStudents() on component mount
  - [ ] Add empty dependency array
  - [ ] Test component loads students on mount

- [ ] **Implement handleSelectStudent() function**

  - [ ] Define function with studentId parameter
  - [ ] Make function async
  - [ ] Call `authService.login(studentId)`
  - [ ] Check if student has completed onboarding
  - [ ] Redirect to `/onboarding` if not completed
  - [ ] Redirect to `/learn` if onboarding complete
  - [ ] Add error handling with try-catch
  - [ ] Add loading indicator during login
  - [ ] Test with students who have/haven't completed onboarding

- [ ] **Implement loading state UI**

  - [ ] Create LoadingSpinner component or use existing
  - [ ] Show spinner while loading students
  - [ ] Add "Loading students..." text
  - [ ] Style with doodle aesthetic
  - [ ] Test loading state appears

- [ ] **Implement error state UI**

  - [ ] Create error message display
  - [ ] Show friendly error message
  - [ ] Add "Try again" button
  - [ ] Style with doodle aesthetic
  - [ ] Test error handling

- [ ] **Implement student grid layout**

  - [ ] Create grid container with motion.div
  - [ ] Apply `.student-grid` class
  - [ ] Set up 2-column grid (desktop/tablet)
  - [ ] Set up 1-column grid (mobile)
  - [ ] Add gap between cards (20px)
  - [ ] Set max-width (500px)
  - [ ] Add entrance animation (fade + slide up)

- [ ] **Map students to StudentCard components**

  - [ ] Map over students array
  - [ ] Render StudentCard for each student
  - [ ] Pass student object as prop
  - [ ] Pass onClick handler (handleSelectStudent)
  - [ ] Add stagger delay based on index (index \* 0.1)
  - [ ] Add unique key prop (student.id)

- [ ] **Style StudentSelector CSS**
  - [ ] Create `.student-grid` styles in globals.css
  - [ ] Configure grid layout (2 columns)
  - [ ] Add mobile breakpoint (1 column)
  - [ ] Set gap, margin, max-width
  - [ ] Test responsive grid behavior

### 1.4 Student Card Component ⏳

- [ ] **Create StudentCard component** (`/app/components/auth/StudentCard.tsx`)

  - [ ] Create new file in `/app/components/auth/` directory
  - [ ] Set up as "use client" component
  - [ ] Import motion from framer-motion
  - [ ] Import Student type
  - [ ] Define StudentCardProps interface
  - [ ] Add student, onClick, delay props

- [ ] **Implement getAvatar() helper function**

  - [ ] Define function with name parameter
  - [ ] Create avatar mapping object (Lucas: 👦, Eva: 👧, Pat: 🎓, Mia: 📚)
  - [ ] Return matching avatar or default (🎓)
  - [ ] Test with all student names
  - [ ] Add fallback for unknown names

- [ ] **Implement card structure**

  - [ ] Create motion.button container
  - [ ] Apply `.student-card` class
  - [ ] Add conditional `.student-card--at-risk` class for churn risk
  - [ ] Add onClick handler prop
  - [ ] Set button type="button"
  - [ ] Add accessibility attributes (aria-label)

- [ ] **Add card content elements**

  - [ ] Add avatar emoji with `.student-avatar` class
  - [ ] Call getAvatar() with student name
  - [ ] Add student name with `.student-name` class
  - [ ] Add streak counter with `.student-streak` class
  - [ ] Format streak text (🔥 X day/days)
  - [ ] Handle singular/plural "day" vs "days"

- [ ] **Implement entrance animation**

  - [ ] Set initial state: scale 0, rotate -10deg
  - [ ] Set animate state: scale 1, rotate 0deg
  - [ ] Add delay prop to transition
  - [ ] Use spring animation (stiffness 260, damping 20)
  - [ ] Add animation type: "spring"
  - [ ] Test animation timing

- [ ] **Implement hover animation**

  - [ ] Add whileHover prop
  - [ ] Set scale: 1.05
  - [ ] Set rotate: 0 (straighten)
  - [ ] Increase translateY: -8px
  - [ ] Test hover effect on desktop

- [ ] **Implement tap animation**

  - [ ] Add whileTap prop
  - [ ] Set scale: 0.95
  - [ ] Add haptic feedback feel
  - [ ] Test tap effect on mobile

- [ ] **Style student card CSS**

  - [ ] Create `.student-card` base styles
  - [ ] Add flex layout (column, centered)
  - [ ] Set padding: 24px
  - [ ] Add white background
  - [ ] Add 3px solid sketch border
  - [ ] Add border-radius: 16px
  - [ ] Add box-shadow (4px offset)
  - [ ] Add cursor: pointer
  - [ ] Set initial rotation (CSS variable)

- [ ] **Add rotation variants for each card**

  - [ ] Define `--rotation` CSS variable
  - [ ] :nth-child(1): -2deg
  - [ ] :nth-child(2): 1deg
  - [ ] :nth-child(3): 2deg
  - [ ] :nth-child(4): -1deg
  - [ ] Test rotation applies correctly

- [ ] **Style hover state**

  - [ ] On hover: rotate to 0deg
  - [ ] On hover: translateY(-8px)
  - [ ] On hover: scale(1.05)
  - [ ] On hover: increase box-shadow (8px offset)
  - [ ] Add transition with bounce easing
  - [ ] Test hover state

- [ ] **Style at-risk indicator**

  - [ ] Create `.student-card--at-risk::after` pseudo-element
  - [ ] Add warning emoji (⚠️)
  - [ ] Position absolute (top -10px, right -10px)
  - [ ] Set font-size: 24px
  - [ ] Add wiggle animation (2s infinite)
  - [ ] Test with Mia's student card

- [ ] **Style avatar element**

  - [ ] Create `.student-avatar` styles
  - [ ] Set font-size: 48px
  - [ ] Set line-height: 1
  - [ ] Center align
  - [ ] Test emoji display

- [ ] **Style name element**

  - [ ] Create `.student-name` styles
  - [ ] Apply Caveat font (--font-hand)
  - [ ] Set font-size: var(--text-h4)
  - [ ] Set font-weight: bold
  - [ ] Set color: sketch
  - [ ] Test name display

- [ ] **Style streak element**
  - [ ] Create `.student-streak` styles
  - [ ] Apply Patrick Hand font (--font-sketch)
  - [ ] Set font-size: var(--text-sm)
  - [ ] Set color: orange
  - [ ] Add fire emoji before number
  - [ ] Test streak display with various values

### 1.5 Protected Route Component ⏳

- [ ] **Create ProtectedRoute component** (`/app/components/auth/ProtectedRoute.tsx`)

  - [ ] Create new file in `/app/components/auth/` directory
  - [ ] Set up as "use client" component
  - [ ] Import useEffect, useState
  - [ ] Import useRouter from next/navigation
  - [ ] Import authService
  - [ ] Define component props interface (children)

- [ ] **Implement component state**

  - [ ] Add isValidating state: `useState<boolean>(true)`
  - [ ] Initialize to true (assume validating)

- [ ] **Implement validateAuth() function**

  - [ ] Create async function
  - [ ] Call `authService.validateSession()`
  - [ ] If invalid, redirect to `/login` using router.push()
  - [ ] If valid, set isValidating to false
  - [ ] Add error handling
  - [ ] Test validation logic

- [ ] **Implement useEffect for validation**

  - [ ] Call validateAuth() on component mount
  - [ ] Add empty dependency array
  - [ ] Test validation runs on mount

- [ ] **Implement loading state UI**

  - [ ] Create LoadingScreen component or use existing
  - [ ] Show while isValidating is true
  - [ ] Add "Checking authentication..." message
  - [ ] Style with doodle aesthetic
  - [ ] Test loading screen appears

- [ ] **Render children when validated**

  - [ ] Return children wrapped in fragment
  - [ ] Only render when isValidating is false
  - [ ] Test protected content shows after validation

- [ ] **Test ProtectedRoute with various scenarios**
  - [ ] Test with authenticated user (should show children)
  - [ ] Test with unauthenticated user (should redirect)
  - [ ] Test with corrupted session (should redirect)
  - [ ] Test loading state appears during validation
  - [ ] Test multiple route navigations

### 1.6 Route Protection Integration ⏳

- [ ] **Wrap /learn page with ProtectedRoute**

  - [ ] Import ProtectedRoute component
  - [ ] Wrap page content with ProtectedRoute
  - [ ] Test authentication required for /learn
  - [ ] Test redirect to /login when not authenticated

- [ ] **Wrap /onboarding page with ProtectedRoute**

  - [ ] Import ProtectedRoute component
  - [ ] Wrap page content with ProtectedRoute
  - [ ] Test authentication required for /onboarding
  - [ ] Test redirect to /login when not authenticated

- [ ] **Create middleware for route protection** (Optional Enhancement)

  - [ ] Create middleware.ts file
  - [ ] Define protected routes array
  - [ ] Check authentication status
  - [ ] Redirect to login if not authenticated
  - [ ] Test middleware intercepts requests

- [ ] **Update layout to handle authentication state**
  - [ ] Add authentication check in root layout
  - [ ] Show/hide TopBar based on auth status
  - [ ] Handle logout functionality
  - [ ] Test layout updates on auth state change

### 1.7 Login Flow Testing & Polish ⏳

- [ ] **End-to-end login flow testing**

  - [ ] Test complete flow: visit site → see login → select student → redirect to learn/onboarding
  - [ ] Test with all 4 students (Lucas, Eva, Pat, Mia)
  - [ ] Test at-risk indicator shows for Mia
  - [ ] Test session persistence (reload page, still logged in)
  - [ ] Test logout clears session
  - [ ] Test protected routes redirect when not logged in

- [ ] **Error handling and edge cases**

  - [ ] Test with corrupted localStorage data
  - [ ] Test with missing student data
  - [ ] Test network errors during data fetch
  - [ ] Add user-friendly error messages
  - [ ] Add retry functionality for failed requests

- [ ] **Accessibility testing**

  - [ ] Test keyboard navigation through login screen
  - [ ] Test student card selection with keyboard (Enter/Space)
  - [ ] Test screen reader announces student names and streaks
  - [ ] Test focus indicators visible on all elements
  - [ ] Test color contrast on student cards

- [ ] **Responsive testing**

  - [ ] Test login screen on mobile (< 768px)
  - [ ] Test student grid collapses to single column
  - [ ] Test student cards maintain interactivity on touch
  - [ ] Test on tablet (768px - 1024px)
  - [ ] Test on desktop (> 1024px)

- [ ] **Animation and performance testing**
  - [ ] Test entrance animations smooth at 60fps
  - [ ] Test stagger animation on student cards
  - [ ] Test hover/tap animations responsive
  - [ ] Profile component render time
  - [ ] Optimize any slow animations

---

## 🎨 Phase 2: Onboarding Flow Implementation

### 2.1 Onboarding Service ⏳

- [ ] **Create onboardingService.ts** (`/lib/services/onboardingService.ts`)

  - [ ] Create new file in `/lib/services/` directory
  - [ ] Import Student type
  - [ ] Import studentService
  - [ ] Define OnboardingData interface
  - [ ] Set up service object structure

- [ ] **Define OnboardingData interface**

  - [ ] Add aiColor?: string
  - [ ] Add subjects?: string[]
  - [ ] Add customSubject?: string | null
  - [ ] Add completedAt?: string (ISO timestamp)
  - [ ] Add skippedSteps?: string[]

- [ ] **Implement complete() function**

  - [ ] Define signature: `complete(studentId: string, data: OnboardingData): Promise<void>`
  - [ ] Get current student data
  - [ ] Update student preferences with onboarding data
  - [ ] Set hasCompletedOnboarding to true
  - [ ] Save completedAt timestamp
  - [ ] Call studentService.updateStudent()
  - [ ] Add error handling

- [ ] **Implement saveStep() function**

  - [ ] Define signature: `saveStep(studentId: string, step: string, data: any): Promise<void>`
  - [ ] Get current student data
  - [ ] Update partial onboarding data
  - [ ] Save intermediate progress
  - [ ] Add error handling

- [ ] **Implement getProgress() function**

  - [ ] Define signature: `getProgress(studentId: string): Promise<OnboardingData | null>`
  - [ ] Get current student data
  - [ ] Return saved onboarding progress
  - [ ] Return null if no progress found

- [ ] **Export onboardingService**
  - [ ] Export all functions
  - [ ] Add JSDoc comments
  - [ ] Document parameters and return types

### 2.2 Onboarding Page Structure ⏳

- [ ] **Create onboarding page** (`/app/onboarding/page.tsx`)

  - [ ] Create new file in `/app/onboarding/` directory
  - [ ] Set up as "use client" component
  - [ ] Import required dependencies
  - [ ] Import all step components
  - [ ] Import authService and onboardingService
  - [ ] Define page component

- [ ] **Define step types and constants**

  - [ ] Create STEPS constant array: ["welcome", "color", "tutorial", "goals"]
  - [ ] Define Step type from STEPS array
  - [ ] Export for use in step components

- [ ] **Implement page state**

  - [ ] Add currentStep state: `useState<Step>("welcome")`
  - [ ] Add onboardingData state: `useState<Partial<OnboardingData>>({})`
  - [ ] Add loading state for async operations

- [ ] **Calculate progress indicator**

  - [ ] Get current step index from STEPS
  - [ ] Calculate progress percentage: ((index + 1) / length) \* 100
  - [ ] Update progress bar dynamically

- [ ] **Implement handleNext() function**

  - [ ] Accept optional data parameter
  - [ ] Merge data into onboardingData state
  - [ ] Calculate next step index
  - [ ] If more steps, set currentStep to next
  - [ ] If last step, call completeOnboarding()
  - [ ] Add loading state handling
  - [ ] Test step progression

- [ ] **Implement handleBack() function**

  - [ ] Calculate previous step index
  - [ ] If not first step, set currentStep to previous
  - [ ] Preserve onboardingData
  - [ ] Test backward navigation

- [ ] **Implement handleSkip() function**

  - [ ] Track skipped steps in onboardingData
  - [ ] Call completeOnboarding()
  - [ ] Save which steps were skipped
  - [ ] Test skip functionality

- [ ] **Implement completeOnboarding() function**

  - [ ] Get current student with authService
  - [ ] Call onboardingService.complete() with data
  - [ ] Redirect to /learn using router.push()
  - [ ] Show success message/animation
  - [ ] Add error handling
  - [ ] Test onboarding completion

- [ ] **Create page layout structure**

  - [ ] Create container with `.onboarding-container` class
  - [ ] Apply doodle-cream background
  - [ ] Center content vertically and horizontally
  - [ ] Add padding for mobile
  - [ ] Test responsive layout

- [ ] **Add progress bar UI**

  - [ ] Create progress bar container at top
  - [ ] Add `.progress-bar-container` class
  - [ ] Create progress fill element with dynamic width
  - [ ] Style with doodle aesthetic
  - [ ] Animate width changes smoothly
  - [ ] Test progress updates on step change

- [ ] **Add step indicators (dots)**

  - [ ] Create step indicators container at bottom
  - [ ] Map over STEPS array
  - [ ] Render dot for each step
  - [ ] Apply `.step-dot` class
  - [ ] Add `.active` class for current/completed steps
  - [ ] Style active vs inactive dots
  - [ ] Test indicator updates

- [ ] **Render step components conditionally**

  - [ ] Render WelcomeStep when currentStep === "welcome"
  - [ ] Render ColorPickerStep when currentStep === "color"
  - [ ] Render TutorialStep when currentStep === "tutorial"
  - [ ] Render GoalSetupStep when currentStep === "goals"
  - [ ] Pass onNext, onBack, onSkip handlers to each
  - [ ] Test step transitions

- [ ] **Style onboarding page CSS**
  - [ ] Create `.onboarding-container` styles
  - [ ] Add min-height: 100vh
  - [ ] Add flex layout (column, centered)
  - [ ] Style `.progress-bar-container`
  - [ ] Style `.progress-fill` with gradient
  - [ ] Style `.step-indicators` container
  - [ ] Style `.step-dot` (gray inactive, colored active)
  - [ ] Add responsive adjustments

### 2.3 Welcome Step Component ⏳

- [ ] **Create WelcomeStep component** (`/app/components/onboarding/WelcomeStep.tsx`)

  - [ ] Create new file (or update existing WelcomeScreen.tsx)
  - [ ] Set up as "use client" component
  - [ ] Import motion from framer-motion
  - [ ] Import AnimatedBubble or AICharacter
  - [ ] Define StepProps interface (onNext, onSkip)

- [ ] **Implement component structure**

  - [ ] Create motion.div container
  - [ ] Apply `.onboarding-step` class
  - [ ] Add entrance animation (fade + scale)
  - [ ] Add exit animation
  - [ ] Test animations

- [ ] **Add AI character element**

  - [ ] Add AICharacter or AnimatedBubble component
  - [ ] Set expression to "waving"
  - [ ] Set size to 150px
  - [ ] Add breathing animation
  - [ ] Position at top center
  - [ ] Test character renders

- [ ] **Add speech bubble with message**

  - [ ] Create motion.div with `.speech-bubble` class
  - [ ] Add entrance animation (scale + slide up)
  - [ ] Add delay (0.3s after character)
  - [ ] Add heading "Hi there!" with Caveat font
  - [ ] Add message "I'm your AI study buddy! Let's make learning fun together!"
  - [ ] Apply Patrick Hand font to message
  - [ ] Style speech bubble with doodle border

- [ ] **Add primary CTA button**

  - [ ] Create "Let's go! →" button
  - [ ] Use SketchButton component (primary variant)
  - [ ] Add onClick handler (call onNext)
  - [ ] Add entrance animation (delay 0.6s)
  - [ ] Test button interaction

- [ ] **Add skip link**

  - [ ] Create "Skip tutorial" button
  - [ ] Style as text link (no background)
  - [ ] Apply low opacity (50%)
  - [ ] Increase opacity on hover (100%)
  - [ ] Add onClick handler (call onSkip)
  - [ ] Position at bottom
  - [ ] Test skip functionality

- [ ] **Style WelcomeStep CSS**
  - [ ] Create `.onboarding-step` base styles
  - [ ] Add flex layout (column, centered)
  - [ ] Set max-width and padding
  - [ ] Style `.speech-bubble` with border and background
  - [ ] Add speech tail with ::after pseudo-element
  - [ ] Add responsive adjustments
  - [ ] Test on all device sizes

### 2.4 Color Picker Step Component ⏳

- [ ] **Update ColorPickerStep component** (`/app/components/onboarding/ColorPicker.tsx`)

  - [ ] Open existing ColorPicker component file
  - [ ] Update to match StepProps interface
  - [ ] Add onNext and onBack props
  - [ ] Remove any conflicting logic

- [ ] **Define color options constant**

  - [ ] Create COLOR_OPTIONS array
  - [ ] Add 8 color objects with id, name, hex
  - [ ] Colors: purple, blue, green, orange, pink, yellow, mint, lavender
  - [ ] Use friendly names (Magic Purple, Sky Blue, etc.)
  - [ ] Export for use in component

- [ ] **Implement component state**

  - [ ] Add selectedColor state: `useState<string | null>(null)`
  - [ ] Initialize to null (no selection)

- [ ] **Implement handleConfirm() function**

  - [ ] Check if selectedColor is not null
  - [ ] If selected, call onNext({ aiColor: selectedColor })
  - [ ] If not selected, show validation message
  - [ ] Add animation for validation feedback
  - [ ] Test confirmation with and without selection

- [ ] **Add step title and instructions**

  - [ ] Create heading "Pick your favorite color for me!"
  - [ ] Apply Caveat font (h2 size)
  - [ ] Position at top
  - [ ] Test text sizing

- [ ] **Create color grid layout**

  - [ ] Create container with `.color-grid` class
  - [ ] Use CSS Grid (2-4 columns depending on screen size)
  - [ ] Add gap between swatches
  - [ ] Map over COLOR_OPTIONS
  - [ ] Render ColorSwatch for each option

- [ ] **Integrate ColorSwatch component**

  - [ ] Pass color object to ColorSwatch
  - [ ] Pass selected state (selectedColor === color.id)
  - [ ] Pass onClick handler (setSelectedColor)
  - [ ] Add stagger animation for swatches
  - [ ] Test swatch selection

- [ ] **Add AI character preview**

  - [ ] Show preview when color is selected
  - [ ] Use AnimatedBubble with selected color
  - [ ] Add "Preview!" label with Patrick Hand
  - [ ] Add entrance animation (scale from 0)
  - [ ] Position below color grid
  - [ ] Test preview updates when color changes

- [ ] **Add navigation buttons**

  - [ ] Create button group container
  - [ ] Add "← Back" button (ghost variant)
  - [ ] Add onClick handler (call onBack)
  - [ ] Add "Choose! →" button (primary variant)
  - [ ] Add onClick handler (call handleConfirm)
  - [ ] Disable "Choose!" button if no selection
  - [ ] Style buttons side by side
  - [ ] Test navigation

- [ ] **Style ColorPickerStep CSS**
  - [ ] Create `.color-grid` styles
  - [ ] Configure grid layout (responsive columns)
  - [ ] Add gap between swatches
  - [ ] Style `.preview-container`
  - [ ] Style `.button-group` (flex, space-between)
  - [ ] Test responsive layout

### 2.5 Color Swatch Component ⏳

- [ ] **Create ColorSwatch component** (`/app/components/onboarding/ColorSwatch.tsx`)

  - [ ] Create new file in `/app/components/onboarding/` directory
  - [ ] Set up as "use client" component
  - [ ] Import motion from framer-motion
  - [ ] Define ColorOption interface (id, name, hex)
  - [ ] Define ColorSwatchProps interface

- [ ] **Define component props**

  - [ ] Add color: ColorOption
  - [ ] Add selected: boolean
  - [ ] Add onClick: () => void

- [ ] **Implement swatch structure**

  - [ ] Create motion.button container
  - [ ] Apply `.color-swatch` class
  - [ ] Add conditional `.color-swatch--selected` class
  - [ ] Set background color to color.hex
  - [ ] Add onClick handler
  - [ ] Set button type="button"

- [ ] **Add checkmark for selected state**

  - [ ] Conditionally render checkmark when selected
  - [ ] Use motion.span with "✓" character
  - [ ] Add entrance animation (scale from 0)
  - [ ] Position in center
  - [ ] Style with white color and large size

- [ ] **Add color name label**

  - [ ] Add color.name text
  - [ ] Apply Patrick Hand font
  - [ ] Position below swatch or as overlay
  - [ ] Test text visibility on all color backgrounds

- [ ] **Implement hover animation**

  - [ ] Add whileHover prop
  - [ ] Set scale: 1.1
  - [ ] Set rotate: 5deg
  - [ ] Test hover effect

- [ ] **Implement tap animation**

  - [ ] Add whileTap prop
  - [ ] Set scale: 0.9
  - [ ] Test tap feedback

- [ ] **Style ColorSwatch CSS**
  - [ ] Create `.color-swatch` base styles
  - [ ] Set size (80px x 80px)
  - [ ] Add border-radius (50% for circle or 12px for rounded square)
  - [ ] Add 3px sketch border
  - [ ] Add cursor: pointer
  - [ ] Add box-shadow
  - [ ] Style `.color-swatch--selected` (thicker border, glow)
  - [ ] Style `.checkmark` (white, large, centered)
  - [ ] Style `.color-name` text
  - [ ] Test on all colors

### 2.6 Tutorial Step Component ⏳

- [ ] **Update Tutorial component** (`/app/components/onboarding/Tutorial.tsx`)

  - [ ] Open existing Tutorial component file
  - [ ] Update to match StepProps interface
  - [ ] Add onNext and onSkip props
  - [ ] Set up tutorial overlay system

- [ ] **Define tutorial stops constant**

  - [ ] Create TUTORIAL_STOPS array with 4 stops
  - [ ] Stop 1: AI character (".ai-character")
  - [ ] Stop 2: Task sidebar (".tasks-sidebar")
  - [ ] Stop 3: Progress card (".progress-card")
  - [ ] Stop 4: Streak counter (".streak-counter")
  - [ ] Each stop: id, target selector, title, message, tooltip position

- [ ] **Implement component state**

  - [ ] Add currentStop state: `useState<number>(0)`
  - [ ] Initialize to 0 (first stop)

- [ ] **Calculate stop progress**

  - [ ] Get current stop object from TUTORIAL_STOPS
  - [ ] Check if last stop: currentStop === length - 1
  - [ ] Calculate progress for indicator

- [ ] **Implement handleNext() function**

  - [ ] If last stop, call onNext()
  - [ ] If not last, increment currentStop
  - [ ] Add animation between stops
  - [ ] Test stop progression

- [ ] **Create overlay element**

  - [ ] Create motion.div with `.tutorial-overlay` class
  - [ ] Cover entire screen (fixed position, full width/height)
  - [ ] Add semi-transparent background (black 50% opacity)
  - [ ] Add entrance animation (fade in)
  - [ ] Add z-index to appear above content

- [ ] **Create Spotlight component**

  - [ ] Create component to highlight target element
  - [ ] Accept target selector prop
  - [ ] Find target element in DOM
  - [ ] Create transparent "hole" around element
  - [ ] Use clip-path or box-shadow technique
  - [ ] Animate spotlight movement between stops
  - [ ] Test spotlight focuses on correct elements

- [ ] **Create TutorialTooltip component**

  - [ ] Create tooltip component
  - [ ] Accept props: title, message, position, target, currentStep, totalSteps
  - [ ] Position tooltip relative to target element
  - [ ] Add doodle-card styling
  - [ ] Add speech bubble tail pointing to target
  - [ ] Display title with Caveat font
  - [ ] Display message with Patrick Hand font
  - [ ] Show progress (e.g., "2 of 4")

- [ ] **Add tooltip navigation buttons**

  - [ ] Add "Next →" button
  - [ ] Add "Skip tutorial" button
  - [ ] Style buttons with sketch aesthetic
  - [ ] Add onClick handlers (handleNext, onSkip)
  - [ ] Test button interactions

- [ ] **Implement tooltip positioning logic**

  - [ ] Calculate target element position
  - [ ] Position tooltip based on position prop (top, bottom, left, right)
  - [ ] Add arrow/tail pointing to target
  - [ ] Ensure tooltip stays in viewport
  - [ ] Test positioning on all stops

- [ ] **Implement stop transitions**

  - [ ] Animate spotlight movement to next target
  - [ ] Animate tooltip movement to next position
  - [ ] Fade out/in tooltip content
  - [ ] Add smooth easing
  - [ ] Test transition animations

- [ ] **Style Tutorial CSS**
  - [ ] Create `.tutorial-overlay` styles
  - [ ] Create `.spotlight` styles (if needed)
  - [ ] Create `.tutorial-tooltip` styles
  - [ ] Style tooltip arrow/tail
  - [ ] Add responsive positioning
  - [ ] Test overlay doesn't block interactions (except target)

### 2.7 Goal Setup Step Component ⏳

- [ ] **Create GoalSetupStep component** (`/app/components/onboarding/GoalSetupStep.tsx`)

  - [ ] Create new file in `/app/components/onboarding/` directory
  - [ ] Set up as "use client" component
  - [ ] Import motion from framer-motion
  - [ ] Import DoodleInput component
  - [ ] Define StepProps interface

- [ ] **Define subject options constant**

  - [ ] Create SUBJECT_OPTIONS array
  - [ ] Add 5 subjects: Math, Science, Reading, Writing, History
  - [ ] Each subject: id, name, icon emoji
  - [ ] Icons: ➕ (math), 🔬 (science), 📖 (reading), ✍️ (writing), 🏛️ (history)

- [ ] **Define maximum subjects constant**

  - [ ] Create MAX_SUBJECTS = 3
  - [ ] Use for validation

- [ ] **Implement component state**

  - [ ] Add selectedSubjects state: `useState<string[]>([])`
  - [ ] Add customSubject state: `useState<string>("")`
  - [ ] Initialize both to empty

- [ ] **Implement toggleSubject() function**

  - [ ] Accept subjectId parameter
  - [ ] Check if already selected (includes in array)
  - [ ] If selected, remove from array
  - [ ] If not selected and under max, add to array
  - [ ] If at max, do nothing (or show message)
  - [ ] Update state
  - [ ] Test selection and deselection

- [ ] **Implement handleConfirm() function**

  - [ ] Create data object with selectedSubjects and customSubject
  - [ ] Call onNext(data)
  - [ ] Test data passes to onboarding page

- [ ] **Add step title and instructions**

  - [ ] Create heading "What do you want to learn today?"
  - [ ] Apply Caveat font (h2 size)
  - [ ] Add subtitle "Choose up to 3 subjects:"
  - [ ] Apply Patrick Hand font
  - [ ] Test text display

- [ ] **Create subject grid layout**

  - [ ] Create container with `.subject-grid` class
  - [ ] Use CSS Grid (2-3 columns)
  - [ ] Add gap between cards
  - [ ] Map over SUBJECT_OPTIONS
  - [ ] Render SubjectCard for each subject

- [ ] **Create SubjectCard component**

  - [ ] Create as sub-component or separate file
  - [ ] Accept props: subject, selected, disabled, onClick
  - [ ] Create motion.button container
  - [ ] Apply `.subject-card` class
  - [ ] Add conditional `.subject-card--selected` class
  - [ ] Add conditional `.subject-card--disabled` class
  - [ ] Display subject icon (emoji)
  - [ ] Display subject name
  - [ ] Add onClick handler
  - [ ] Implement hover animation (unless disabled)
  - [ ] Implement tap animation
  - [ ] Test selection states

- [ ] **Add custom subject input**

  - [ ] Create `.custom-subject-card` container
  - [ ] Add sparkle emoji (✨)
  - [ ] Add DoodleInput with placeholder "Other..."
  - [ ] Bind value to customSubject state
  - [ ] Add onChange handler
  - [ ] Set maxLength to 30 characters
  - [ ] Style to match subject cards
  - [ ] Test input functionality

- [ ] **Add helper text**

  - [ ] Add text "You can always add more later!"
  - [ ] Apply Patrick Hand font
  - [ ] Style with low opacity
  - [ ] Position below subject grid

- [ ] **Add navigation buttons**

  - [ ] Create button group container
  - [ ] Add "Skip for now" button (ghost variant)
  - [ ] Add onClick handler (call onSkip)
  - [ ] Add "Start! →" button (primary variant)
  - [ ] Add onClick handler (call handleConfirm)
  - [ ] Enable "Start!" even with 0 selections
  - [ ] Test navigation

- [ ] **Style GoalSetupStep CSS**
  - [ ] Create `.subject-grid` styles
  - [ ] Configure grid layout (2-3 columns, responsive)
  - [ ] Style `.subject-card` base
  - [ ] Style `.subject-card--selected` (border color, background)
  - [ ] Style `.subject-card--disabled` (opacity, no pointer)
  - [ ] Style `.custom-subject-card`
  - [ ] Style `.helper-text`
  - [ ] Test responsive layout

### 2.8 Onboarding Flow Testing & Polish ⏳

- [ ] **End-to-end onboarding flow testing**

  - [ ] Test complete flow: welcome → color → tutorial → goals → completion
  - [ ] Test with new user (no onboarding complete)
  - [ ] Test redirect to /learn after completion
  - [ ] Test progress bar updates correctly
  - [ ] Test step indicators update
  - [ ] Test back button navigation
  - [ ] Test skip tutorial functionality
  - [ ] Test skip entire onboarding

- [ ] **Test onboarding completion persistence**

  - [ ] Complete onboarding for a student
  - [ ] Log out and log back in
  - [ ] Verify user goes to /learn (not /onboarding)
  - [ ] Verify onboarding data saved to student profile
  - [ ] Test hasCompletedOnboarding flag

- [ ] **Test color picker step**

  - [ ] Test all 8 colors selectable
  - [ ] Test preview updates correctly
  - [ ] Test "Choose!" button disabled without selection
  - [ ] Test can't proceed without selecting color
  - [ ] Test selected color saves to profile
  - [ ] Test AI character uses selected color in app

- [ ] **Test tutorial step**

  - [ ] Test spotlight highlights correct elements
  - [ ] Test tooltip positions correctly (top, bottom, left, right)
  - [ ] Test all 4 tutorial stops
  - [ ] Test tutorial progression smooth
  - [ ] Test skip tutorial works
  - [ ] Test tutorial overlay doesn't break interactions

- [ ] **Test goal setup step**

  - [ ] Test can select up to 3 subjects
  - [ ] Test can't select more than 3
  - [ ] Test can deselect subjects
  - [ ] Test custom subject input works
  - [ ] Test can skip with 0 selections
  - [ ] Test selected goals save to profile

- [ ] **Test onboarding responsiveness**

  - [ ] Test entire flow on mobile (< 768px)
  - [ ] Test entire flow on tablet (768px - 1024px)
  - [ ] Test entire flow on desktop (> 1024px)
  - [ ] Test color grid responsive
  - [ ] Test subject grid responsive
  - [ ] Test tutorial tooltip positioning on mobile

- [ ] **Test onboarding animations**

  - [ ] Test welcome screen entrance animation
  - [ ] Test AI character breathing animation
  - [ ] Test speech bubble animation
  - [ ] Test color swatch animations
  - [ ] Test subject card animations
  - [ ] Test step transition animations
  - [ ] Test progress bar animation

- [ ] **Test onboarding accessibility**

  - [ ] Test keyboard navigation through steps
  - [ ] Test can select colors with keyboard
  - [ ] Test can select subjects with keyboard
  - [ ] Test screen reader announces step progress
  - [ ] Test focus management between steps
  - [ ] Test all buttons have proper labels

- [ ] **Error handling and edge cases**
  - [ ] Test with corrupted onboarding data
  - [ ] Test network errors during save
  - [ ] Test rapid step navigation
  - [ ] Test browser back button handling
  - [ ] Test page refresh mid-onboarding
  - [ ] Test multiple window/tab scenarios

---

## ✅ Phase 3: Integration & Acceptance Criteria

### 3.1 Authentication Acceptance Criteria ⏳

- [ ] **Login screen displays correctly**

  - [ ] Login screen shows all 4 student cards
  - [ ] Student cards show correct avatar emoji
  - [ ] Student cards show correct student name
  - [ ] Student cards show correct streak count
  - [ ] At-risk students show warning indicator (Mia with ⚠️)
  - [ ] Cards have hand-drawn doodle styling
  - [ ] Cards have rotation and hover effects

- [ ] **Login functionality works**

  - [ ] Clicking a student card authenticates that student
  - [ ] Authentication stores session in localStorage
  - [ ] Successful login redirects to appropriate page
  - [ ] First-time users redirect to /onboarding
  - [ ] Returning users redirect to /learn
  - [ ] Login errors show user-friendly messages

- [ ] **Session management works**

  - [ ] Session persists across page reloads
  - [ ] Session persists in new browser tabs
  - [ ] Logout button clears session
  - [ ] Logout redirects to /login
  - [ ] Invalid session redirects to /login

- [ ] **Protected routes work**
  - [ ] /learn requires authentication
  - [ ] /onboarding requires authentication
  - [ ] Unauthenticated access redirects to /login
  - [ ] Protected route shows loading state during validation
  - [ ] Protected route handles errors gracefully

### 3.2 Onboarding Acceptance Criteria ⏳

- [ ] **Welcome screen works correctly**

  - [ ] Welcome screen appears for first-time users
  - [ ] AI character displays with animation
  - [ ] Speech bubble appears with friendly message
  - [ ] "Let's go!" button advances to next step
  - [ ] "Skip tutorial" link works
  - [ ] Animations smooth and on-brand

- [ ] **Color picker works correctly**

  - [ ] Color picker shows 8 color options
  - [ ] Can select one color
  - [ ] Selected color shows checkmark
  - [ ] Preview updates in real-time with chosen color
  - [ ] "Choose!" button disabled without selection
  - [ ] "Back" button returns to welcome screen
  - [ ] Selected color saves to student profile

- [ ] **Tutorial works correctly**

  - [ ] Tutorial highlights all 4 interface areas
  - [ ] Tutorial stops: AI character, task sidebar, progress card, streak counter
  - [ ] Spotlight focuses on correct elements
  - [ ] Tooltip displays title and message
  - [ ] Tooltip positions correctly relative to target
  - [ ] Can progress through all stops
  - [ ] Can skip tutorial (but color picker is required)
  - [ ] Tutorial doesn't break page functionality

- [ ] **Goal setup works correctly**

  - [ ] Goal setup shows 5 subject options
  - [ ] Can select 0-3 subjects
  - [ ] Can't select more than 3 subjects
  - [ ] Can deselect subjects
  - [ ] Custom subject input works
  - [ ] Custom subject limited to 30 characters
  - [ ] "Skip for now" button works
  - [ ] "Start!" button completes onboarding
  - [ ] Selected goals save to student profile

- [ ] **Onboarding flow works correctly**

  - [ ] Progress bar updates correctly (0% → 100%)
  - [ ] Step indicators update (4 dots, active state)
  - [ ] Can navigate backward (except from welcome)
  - [ ] Can skip tutorial but not color picker
  - [ ] Completion status saves to profile (hasCompletedOnboarding)
  - [ ] Returning users skip onboarding entirely
  - [ ] Complete flow takes < 2 minutes
  - [ ] Redirects to /learn after completion

- [ ] **Onboarding data persistence**
  - [ ] Selected color persists to student.preferences.aiColor
  - [ ] Selected subjects persist to student goals
  - [ ] Custom subject persists if provided
  - [ ] Onboarding completion flag persists
  - [ ] Completion timestamp saved
  - [ ] Can reload page mid-onboarding and resume (optional)

### 3.3 Cross-Feature Integration Testing ⏳

- [ ] **Test complete new user flow**

  - [ ] Visit site for first time
  - [ ] See login screen
  - [ ] Select student (e.g., new student)
  - [ ] Redirect to onboarding
  - [ ] Complete welcome step
  - [ ] Complete color picker step
  - [ ] Complete tutorial step
  - [ ] Complete goal setup step
  - [ ] Redirect to /learn
  - [ ] See personalized AI character with chosen color
  - [ ] See selected goals/subjects

- [ ] **Test complete returning user flow**

  - [ ] Visit site (already completed onboarding)
  - [ ] See login screen
  - [ ] Select student
  - [ ] Redirect directly to /learn (skip onboarding)
  - [ ] See personalized AI character
  - [ ] Session persists

- [ ] **Test logout and re-login flow**

  - [ ] Log in as Student A
  - [ ] Complete some interactions
  - [ ] Log out
  - [ ] See login screen
  - [ ] Log in as Student B
  - [ ] See Student B's data and preferences
  - [ ] No data leakage from Student A

- [ ] **Test AI character color persistence**
  - [ ] Complete onboarding with color selection
  - [ ] Enter /learn page
  - [ ] Verify AI character uses selected color
  - [ ] Log out and log back in
  - [ ] Verify color still applied
  - [ ] Test color appears in chat, bubbles, etc.

### 3.4 Component Documentation ⏳

- [ ] **Document authService API**

  - [ ] Document login() function
  - [ ] Document logout() function
  - [ ] Document getCurrentStudent() function
  - [ ] Document isAuthenticated() function
  - [ ] Document validateSession() function
  - [ ] Add usage examples
  - [ ] Add error handling examples

- [ ] **Document onboardingService API**

  - [ ] Document complete() function
  - [ ] Document saveStep() function
  - [ ] Document getProgress() function
  - [ ] Add usage examples

- [ ] **Document authentication components**

  - [ ] Document StudentSelector props and usage
  - [ ] Document StudentCard props and usage
  - [ ] Document ProtectedRoute props and usage
  - [ ] Add code examples

- [ ] **Document onboarding components**
  - [ ] Document WelcomeStep props and usage
  - [ ] Document ColorPickerStep props and usage
  - [ ] Document TutorialStep props and usage
  - [ ] Document GoalSetupStep props and usage
  - [ ] Document ColorSwatch props and usage
  - [ ] Add code examples

---

## ⚡ Phase 4: Performance & Accessibility

### 4.1 Performance Optimization ⏳

- [ ] **Optimize login page performance**

  - [ ] Lazy load student data
  - [ ] Optimize student card animations
  - [ ] Minimize layout shifts
  - [ ] Test page load time (< 2s)
  - [ ] Profile component render times

- [ ] **Optimize onboarding flow performance**

  - [ ] Lazy load step components
  - [ ] Optimize color swatch rendering
  - [ ] Optimize tutorial spotlight performance
  - [ ] Test step transition smoothness
  - [ ] Ensure 60fps animations

- [ ] **Optimize bundle size**

  - [ ] Code split onboarding flow
  - [ ] Lazy load tutorial component
  - [ ] Analyze bundle size with Next.js analyzer
  - [ ] Remove unused dependencies
  - [ ] Minimize CSS

- [ ] **Test on low-end devices**
  - [ ] Test on older mobile devices
  - [ ] Test on slow 3G connection
  - [ ] Test animation performance
  - [ ] Optimize or disable animations if needed
  - [ ] Test localStorage operations

### 4.2 Accessibility Compliance ⏳

- [ ] **Keyboard navigation**

  - [ ] Test tab order on login screen
  - [ ] Test student card selection with Enter/Space
  - [ ] Test tab order through onboarding steps
  - [ ] Test color picker keyboard selection
  - [ ] Test subject card keyboard selection
  - [ ] Test all buttons keyboard accessible
  - [ ] Test tutorial can be navigated with keyboard

- [ ] **Screen reader support**

  - [ ] Add ARIA labels to student cards
  - [ ] Add ARIA labels to color swatches
  - [ ] Add ARIA labels to subject cards
  - [ ] Add ARIA live region for step changes
  - [ ] Add ARIA labels for progress bar
  - [ ] Test with VoiceOver (Mac)
  - [ ] Test with NVDA (Windows)

- [ ] **Color contrast**

  - [ ] Test student card text contrast
  - [ ] Test color swatch labels contrast
  - [ ] Test subject card text contrast
  - [ ] Test all button text contrast
  - [ ] Test tooltip text contrast
  - [ ] Ensure 4.5:1 minimum ratio

- [ ] **Focus indicators**
  - [ ] Add visible focus indicators to student cards
  - [ ] Add visible focus indicators to color swatches
  - [ ] Add visible focus indicators to subject cards
  - [ ] Add visible focus indicators to all buttons
  - [ ] Add visible focus indicators to inputs
  - [ ] Test focus indicators visible on all backgrounds

### 4.3 Error Handling & Edge Cases ⏳

- [ ] **Handle authentication errors**

  - [ ] Show error message on failed login
  - [ ] Show error message on network failure
  - [ ] Handle corrupted localStorage data
  - [ ] Handle missing student data
  - [ ] Add retry functionality
  - [ ] Log errors for debugging

- [ ] **Handle onboarding errors**

  - [ ] Show error message on failed save
  - [ ] Show error message on network failure
  - [ ] Handle partial onboarding completion
  - [ ] Handle browser back button during onboarding
  - [ ] Handle page refresh during onboarding
  - [ ] Add retry functionality

- [ ] **Handle edge cases**
  - [ ] Test with very long student names
  - [ ] Test with missing avatar data
  - [ ] Test with 0-day streak
  - [ ] Test with 999+ day streak
  - [ ] Test with all colors already selected
  - [ ] Test with all subjects already selected
  - [ ] Test rapid clicking/tapping
  - [ ] Test concurrent sessions (multiple tabs)

---

## 🧪 Phase 5: Testing & Quality Assurance

### 5.1 Unit Testing ⏳

- [ ] **Write tests for authService**

  - [ ] Test login() with valid student
  - [ ] Test login() with invalid student
  - [ ] Test logout() clears session
  - [ ] Test getCurrentStudent() returns student
  - [ ] Test getCurrentStudent() returns null when not authenticated
  - [ ] Test isAuthenticated() returns correct boolean
  - [ ] Test validateSession() validates correctly

- [ ] **Write tests for onboardingService**

  - [ ] Test complete() saves data correctly
  - [ ] Test saveStep() saves partial data
  - [ ] Test getProgress() returns progress
  - [ ] Test getProgress() returns null when no progress

- [ ] **Write tests for components**
  - [ ] Test StudentSelector renders students
  - [ ] Test StudentCard selection works
  - [ ] Test ColorSwatch selection works
  - [ ] Test SubjectCard selection works
  - [ ] Test ProtectedRoute redirects correctly
  - [ ] Test onboarding step navigation

### 5.2 Integration Testing ⏳

- [ ] **Test authentication integration**

  - [ ] Test login → redirect to onboarding
  - [ ] Test login → redirect to learn
  - [ ] Test logout → redirect to login
  - [ ] Test protected route authentication
  - [ ] Test session persistence

- [ ] **Test onboarding integration**
  - [ ] Test welcome → color → tutorial → goals
  - [ ] Test skip tutorial
  - [ ] Test back navigation
  - [ ] Test onboarding completion
  - [ ] Test redirect to learn after completion
  - [ ] Test onboarding data saves to profile

### 5.3 End-to-End Testing ⏳

- [ ] **Test complete user journeys**

  - [ ] Test new user: login → onboarding → learn
  - [ ] Test returning user: login → learn
  - [ ] Test logout → login as different user
  - [ ] Test skip onboarding → still saves color
  - [ ] Test color selection → appears in app
  - [ ] Test goal selection → appears in app

- [ ] **Test cross-browser compatibility**
  - [ ] Test in Chrome (latest)
  - [ ] Test in Firefox (latest)
  - [ ] Test in Safari (latest)
  - [ ] Test in Edge (latest)
  - [ ] Test in Mobile Safari (iOS)
  - [ ] Test in Chrome Mobile (Android)

### 5.4 Visual Testing ⏳

- [ ] **Test visual design**

  - [ ] Test student cards match design
  - [ ] Test color swatches match design
  - [ ] Test subject cards match design
  - [ ] Test speech bubbles match design
  - [ ] Test tooltips match design
  - [ ] Test progress bar matches design
  - [ ] Screenshot all components for documentation

- [ ] **Test responsive design**
  - [ ] Test login screen responsive (mobile, tablet, desktop)
  - [ ] Test onboarding responsive (mobile, tablet, desktop)
  - [ ] Test portrait and landscape orientations
  - [ ] Test on various screen sizes
  - [ ] Test on high DPI displays

---

## 📚 Phase 6: Documentation & Handoff

### 6.1 Technical Documentation ⏳

- [ ] **Create authentication documentation**

  - [ ] Document authentication flow diagram
  - [ ] Document authService API reference
  - [ ] Document session management strategy
  - [ ] Document protected route pattern
  - [ ] Add code examples
  - [ ] Add troubleshooting guide

- [ ] **Create onboarding documentation**

  - [ ] Document onboarding flow diagram
  - [ ] Document onboardingService API reference
  - [ ] Document step component pattern
  - [ ] Document data persistence strategy
  - [ ] Add code examples
  - [ ] Add troubleshooting guide

- [ ] **Update architecture documentation**
  - [ ] Add authentication system to architecture.md
  - [ ] Add onboarding system to architecture.md
  - [ ] Update data flow diagrams
  - [ ] Update component diagrams
  - [ ] Document integration points

### 6.2 User Documentation ⏳

- [ ] **Create user guide for authentication**

  - [ ] Document how to log in
  - [ ] Document how to log out
  - [ ] Document how to switch users
  - [ ] Add screenshots

- [ ] **Create user guide for onboarding**
  - [ ] Document onboarding steps
  - [ ] Document how to choose colors
  - [ ] Document how to set goals
  - [ ] Document how to skip tutorial
  - [ ] Add screenshots

### 6.3 Testing Documentation ⏳

- [ ] **Document test cases**

  - [ ] Create authentication test cases checklist
  - [ ] Create onboarding test cases checklist
  - [ ] Document edge cases to test
  - [ ] Document browser compatibility matrix
  - [ ] Create bug report template

- [ ] **Document test results**
  - [ ] Document passing tests
  - [ ] Document known issues
  - [ ] Document workarounds
  - [ ] Document future enhancements

### 6.4 Handoff Preparation ⏳

- [ ] **Final review**

  - [ ] Review all completed tasks
  - [ ] Verify all acceptance criteria met
  - [ ] Run final accessibility audit
  - [ ] Run final performance audit
  - [ ] Review code quality
  - [ ] Prepare demo presentation

- [ ] **Deployment preparation**
  - [ ] Create production build
  - [ ] Test production build locally
  - [ ] Verify environment variables
  - [ ] Check asset optimization
  - [ ] Review deployment checklist
  - [ ] Prepare rollback plan

---

## 🎯 Definition of Done

A task is considered complete when:

1. ✅ Code is implemented and functioning
2. ✅ Component/feature tested manually
3. ✅ Responsive behavior verified (mobile, tablet, desktop)
4. ✅ Accessibility requirements met (WCAG 2.1 AA)
5. ✅ Browser compatibility verified
6. ✅ Error handling implemented
7. ✅ TypeScript types correct (no linter errors)
8. ✅ Documentation updated
9. ✅ Code reviewed (if applicable)
10. ✅ Integrated with existing features

---

## 📊 Progress Tracking Tips

### How to Use This Document

1. **Mark tasks as complete** by changing `[ ]` to `[x]`
2. **Add notes** below tasks as needed (use indented bullet points)
3. **Track blockers** by adding 🚫 emoji before blocked tasks
4. **Mark in-progress** by adding 🔄 emoji before current tasks
5. **Update regularly** (daily or after each work session)

### Priority Indicators (Optional)

Add these emoji prefixes to prioritize:

- 🔴 **Critical** - Must complete before moving forward
- 🟡 **High** - Important for core functionality
- 🟢 **Medium** - Nice to have, improves quality
- 🔵 **Low** - Polish and enhancement

### Example Usage

```markdown
- [x] Create authService.ts ✅ Completed Nov 8
  - Note: Added extra validation for edge cases
- [🔄] Create StudentSelector component 🔴 Critical, In Progress
  - Blocked by: Need student data finalized 🚫
- [ ] Add animation to color swatches 🔵 Low priority
```

---

## 🚀 Next Steps

After completing authentication and onboarding:

1. **Test with real users** - Get feedback on onboarding flow
2. **Move to Achievement System** - Implement badges and gamification
3. **Integrate with AI Services** - Connect chat and task generation
4. **Implement Retention Features** - Nudges, churn detection
5. **Add Social Features** - Friend connections, tutor booking

---

## 📝 Related Documents

**Dependencies:**

- Design System (DesignTasks.md) - Must be complete for styling
- PRD Shard 3 (3-Auth&Onboard.md) - Requirements specification
- Architecture.md - System architecture overview

**Related Features:**

- Student Service - Already implemented in `/lib/services/studentService.ts`
- Mock Data - Already exists in `/data/students/`
- Design Components - Already implemented (SketchButton, DoodleCard, etc.)

---

**Good luck with the implementation! 🔐✨**

---

## 📝 Implementation Notes

### Prerequisites

Before starting, ensure:

- [ ] Design system is complete (fonts, colors, animations)
- [ ] Student data exists in `/data/students/`
- [ ] studentService.ts is implemented
- [ ] Base UI components exist (SketchButton, DoodleInput, etc.)
- [ ] AnimatedBubble component exists

### Estimated Timeline

- **Phase 1 (Authentication):** 2-3 days
- **Phase 2 (Onboarding):** 3-4 days
- **Phase 3 (Integration):** 1-2 days
- **Phase 4 (Performance & Accessibility):** 1-2 days
- **Phase 5 (Testing):** 2-3 days
- **Phase 6 (Documentation):** 1-2 days

**Total:** 10-16 days (depending on complexity and team size)

### Key Considerations

1. **Session Management:** Use localStorage for now, but design for easy migration to real auth
2. **Onboarding Skip:** Users must select a color (required), but can skip tutorial and goals
3. **Data Persistence:** All onboarding data saves to student profile for personalization
4. **First-Time User Detection:** Check `hasCompletedOnboarding` flag in student profile
5. **Protected Routes:** Use ProtectedRoute wrapper for all authenticated pages
6. **Error Handling:** Show user-friendly messages, log errors for debugging
7. **Accessibility:** Keyboard navigation and screen reader support are required

---

**End of Authentication & Onboarding Tasks**
