# ✅ Success Metrics Tasks - Testing & Validation Checklist

**Last Updated:** November 8, 2025
**Phase:** MVP (Phase 1)
**Purpose:** Granular, executable testing tasks to validate all Phase 1 acceptance criteria

---

## 📋 How to Use This Document

- [ ] **Each checkbox** = One discrete testing task
- [ ] **Time estimates** = Expected duration per task
- [ ] **Dependencies** = Tasks that must complete first
- [ ] **Status tracking** = Check off as you complete each test

---

## 🎯 Section A: Feature Acceptance Testing (17 Criteria)

**Total Tasks:** 51
**Estimated Time:** 8-10 hours
**Priority:** Critical (blocks Phase 1 completion)

---

### A.1 Student Profile Loading (Criterion 1) - 20 min

- [ ] Load Lucas's profile at `http://localhost:3000?student=lucas`
  - [ ] Verify age displays as 9
  - [ ] Verify subjects: Science, Reading
  - [ ] Verify preferences loaded (color, onboarding status)
  - [ ] Check browser console for errors
- [ ] Load Eva's profile at `http://localhost:3000?student=eva`
  - [ ] Verify age displays as 12
  - [ ] Verify subjects: Science, Math, History
  - [ ] Verify progress data renders correctly
- [ ] Load Pat's profile at `http://localhost:3000?student=pat`
  - [ ] Verify age displays as 16
  - [ ] Verify subjects: SAT Prep
  - [ ] Verify advanced tone in chat
- [ ] Load Mia's profile at `http://localhost:3000?student=mia`
  - [ ] Verify age displays as 14
  - [ ] Verify churn risk flag set
  - [ ] Verify nudge popup appears

**Pass Criteria:** All 4 profiles load without errors, all data displays correctly

---

### A.2 AI Context Window (Criterion 2) - 30 min

- [ ] Start conversation with Lucas
  - [ ] Send 20 messages back-and-forth
  - [ ] Open browser DevTools → Network tab
  - [ ] Inspect OpenAI API request payload
  - [ ] Verify last 15 messages in full detail in `messages` array
  - [ ] Verify messages 16-20 summarized in system prompt
- [ ] Verify rolling window behavior
  - [ ] Count tokens in request (should be < 2000 per turn)
  - [ ] Confirm older messages not sent in full
- [ ] Test context accuracy
  - [ ] Reference message #5 in message #21
  - [ ] Verify AI recalls from summary (not full message)

**Pass Criteria:** Last 15 messages in full, older messages summarized, token count < 2000

---

### A.3 Age-Appropriate Tone (Criterion 3) - 45 min

**Age 9-11 (Lucas):**
- [ ] Start chat session with Lucas
- [ ] Ask: "What is photosynthesis?"
- [ ] Verify AI response uses:
  - [ ] Simple vocabulary (no words like "chlorophyll")
  - [ ] Short sentences (< 15 words per sentence)
  - [ ] Emojis (at least 1-2 per response)
  - [ ] High encouragement ("Great question! 🌟")
- [ ] Ask 5 more questions, verify tone consistency

**Age 12-14 (Eva):**
- [ ] Start chat session with Eva
- [ ] Ask: "Explain the water cycle"
- [ ] Verify AI response uses:
  - [ ] Grade-level vocabulary (some technical terms)
  - [ ] Medium sentence length (15-25 words)
  - [ ] Balanced encouragement (not overly enthusiastic)
  - [ ] Some emojis (1-2 per response)
- [ ] Ask 5 more questions, verify tone consistency

**Age 15-16 (Pat):**
- [ ] Start chat session with Pat
- [ ] Ask: "What is the quadratic formula?"
- [ ] Verify AI response uses:
  - [ ] Academic vocabulary (technical terms explained)
  - [ ] Longer sentences (20-30 words)
  - [ ] Analytical tone (focuses on reasoning)
  - [ ] Minimal emojis (0-1 per response)
- [ ] Ask 5 more questions, verify tone consistency

**Pass Criteria:** All 3 age groups exhibit distinct tone patterns

---

### A.4 Task Generation (Criterion 4) - 40 min

**Multiple Choice Tasks:**
- [ ] Trigger task generation for Lucas (Science)
- [ ] Verify task structure:
  - [ ] Question text is clear and age-appropriate
  - [ ] Exactly 4 options (A, B, C, D)
  - [ ] One correct answer
  - [ ] Three distractors based on common mistakes
  - [ ] 3 progressive hints available
- [ ] Test hint system:
  - [ ] Hint 1: Broad guidance
  - [ ] Hint 2: More specific
  - [ ] Hint 3: Almost gives away answer

**Open-Ended Tasks:**
- [ ] Trigger OE task for Eva (History)
- [ ] Verify task structure:
  - [ ] Open-ended prompt
  - [ ] Rubric with 3-5 evaluation criteria
  - [ ] Sample answer provided
  - [ ] Points range (e.g., 10-15 points)

**Real-World Tasks:**
- [ ] Trigger RW task for Pat (SAT Prep)
- [ ] Verify task structure:
  - [ ] Activity description
  - [ ] Materials list (if applicable)
  - [ ] Safety notes (if applicable)
  - [ ] Expected deliverable

**Pass Criteria:** All 3 task types generate correctly with required fields

---

### A.5 Streak Counter (Criterion 5) - 25 min

**Login Streak:**
- [ ] Log in as Lucas on Day 1
  - [ ] Verify `loginStreak.current` = 1
- [ ] Log in again on Day 2 (simulate date change)
  - [ ] Verify `loginStreak.current` = 2
- [ ] Skip Day 3, log in on Day 4
  - [ ] Verify `loginStreak.current` resets to 1
  - [ ] Verify `loginStreak.longest` preserved

**Practice Streak:**
- [ ] Complete task on Day 1
  - [ ] Verify `practiceStreak.current` = 1
- [ ] Complete task on Day 2
  - [ ] Verify `practiceStreak.current` = 2
- [ ] Skip Day 3, complete task on Day 4
  - [ ] Verify `practiceStreak.current` resets to 1

**Pass Criteria:** Both streak types increment correctly, reset on missed days, preserve longest

---

### A.6 Color Picker (Criterion 6) - 15 min

- [ ] Open ColorPicker component in onboarding
- [ ] Verify 10 color options display:
  - [ ] Purple, Blue, Green, Pink, Orange, Red, Yellow, Teal, Indigo, Rose
- [ ] Select "Purple"
  - [ ] Verify bubble changes to purple immediately
  - [ ] Complete onboarding
- [ ] Reload page
  - [ ] Verify `student.preferences.aiColor = "purple"` in JSON file
  - [ ] Verify bubble still displays purple

**Pass Criteria:** Color selection persists after page reload

---

### A.7 Achievement Badges (Criterion 7) - 35 min

**First Steps Badge:**
- [ ] Create new student profile (copy Lucas.json)
- [ ] Send first message
- [ ] Verify badge unlocks
  - [ ] Confetti animation plays
  - [ ] Badge appears in achievements list
  - [ ] `achievements` array includes `{id: "first_steps", unlockedAt: timestamp}`

**3-Day Streak Badge:**
- [ ] Set up student with 2-day streak
- [ ] Log in on Day 3
- [ ] Verify badge unlocks

**Topic Master Badge:**
- [ ] Set topic progress to 89%
- [ ] Complete one more task to reach 90%+
- [ ] Verify badge unlocks

**Curious Mind Badge:**
- [ ] Count student's questions in conversation history
- [ ] Send 10th question
- [ ] Verify badge unlocks

**Social Butterfly Badge:**
- [ ] ⚠️ **Skip (UI not implemented)**
- [ ] Verify backend service works: `friendService.sendMessage()` exists

**Streak Breaker Badge:**
- [ ] Set `loginStreak.longest = 5`
- [ ] Set `loginStreak.current = 5`
- [ ] Log in next day to reach 6-day streak
- [ ] Verify badge unlocks

**Pass Criteria:** 5/6 badges unlock correctly (Social Butterfly excluded)

---

### A.8 Churn Detection (Criterion 8) - 20 min

- [ ] Open `data/students/mia.json`
- [ ] Verify `conversationSessions` has < 3 entries in past 7 days
- [ ] Run `assessRisk(mia)` function manually
  - [ ] Open browser console
  - [ ] Import service: `import { assessRisk } from '@/lib/services/retentionService'`
  - [ ] Call: `assessRisk(miaData)`
  - [ ] Verify return value: `{riskLevel: "high", ...}`
- [ ] Verify churn flag set in student profile
  - [ ] Check `mia.churnRisk = true` or similar field

**Pass Criteria:** Mia flagged as high risk, risk assessment returns "high"

---

### A.9 Nudge Popup Delivery (Criterion 9) - 25 min

- [ ] Log in as Mia
- [ ] Verify NudgePopup component renders on landing page
  - [ ] Modal overlay with backdrop blur visible
  - [ ] Celebrate-first message displays
  - [ ] Example: "Great job on Science! You're 75% complete! 🎉"
  - [ ] Subject suggestion displays (e.g., "Start Math Session")
  - [ ] Two buttons: "Accept" and "Maybe Later"
- [ ] Test "Accept" button
  - [ ] Click "Start Math Session"
  - [ ] Verify redirect to chat with Math topic selected
  - [ ] Verify nudge marked as accepted in history
- [ ] Test "Dismiss" button
  - [ ] Click "Maybe Later"
  - [ ] Verify modal closes
  - [ ] Verify nudge marked as dismissed
  - [ ] Log out and back in (same day)
  - [ ] Verify nudge does NOT reappear (24-hour cooldown)

**Pass Criteria:** Nudge displays correctly, accept/dismiss flows work, cooldown enforced

---

### A.10 Friend Messaging (Criterion 10) - ⚠️ Backend Only

- [ ] **UI Testing Skipped** (UI not implemented)
- [ ] Verify backend service exists:
  - [ ] File exists: `lib/services/friendService.ts`
  - [ ] Function exists: `sendFriendMessage()`
  - [ ] Function exists: `sendFriendRequest()`
  - [ ] Function exists: `acceptFriendRequest()`
- [ ] Test 3/day limit programmatically:
  - [ ] Call `sendFriendMessage()` 3 times
  - [ ] Verify 4th call throws error or returns `{success: false}`

**Pass Criteria:** Backend services confirmed, 3/day limit enforced

---

### A.11 Tutor Booking (Criterion 11) - ⚠️ Backend Only

- [ ] **UI Testing Skipped** (UI not implemented)
- [ ] Verify backend service exists:
  - [ ] File exists: `lib/services/tutorService.ts`
  - [ ] Function exists: `createBookingWithHandoff()`
  - [ ] Function exists: `getTutorAvailability()`
- [ ] Test handoff notes generation:
  - [ ] Call `createBookingWithHandoff()` manually with sample data
  - [ ] Verify AI generates comprehensive notes
  - [ ] Check notes include: student age, topic, struggle context, suggested focus

**Pass Criteria:** Backend services confirmed, handoff notes comprehensive

---

### A.12 Content Filter (Criterion 12) - 30 min

**Inappropriate Language:**
- [ ] Open chat as Lucas
- [ ] Type inappropriate word (e.g., profanity)
- [ ] Verify message blocked before sending
- [ ] Verify error message displays: "This message contains inappropriate content"
- [ ] Verify message NOT saved to conversation history

**Personal Information:**
- [ ] Type address: "I live at 123 Main St, Anytown USA"
  - [ ] Verify blocked
- [ ] Type phone number: "Call me at 555-1234"
  - [ ] Verify blocked
- [ ] Type email: "My email is student@example.com"
  - [ ] Verify blocked

**Off-Platform Communication:**
- [ ] Type: "Let's chat on Discord"
  - [ ] Verify blocked
- [ ] Type: "Add me on Snapchat"
  - [ ] Verify blocked

**Pass Criteria:** All inappropriate content blocked, error messages clear

---

### A.13 Homework Helper (Criterion 13) - 20 min

- [ ] Open chat as Eva
- [ ] Ask: "What's the answer to 5 + 7?"
- [ ] Verify AI response:
  - [ ] Does NOT give direct answer
  - [ ] Provides hint: "Try counting on your fingers" or similar
  - [ ] Encourages student to solve
- [ ] Ask 3 more homework questions:
  - [ ] "What's the capital of France?"
  - [ ] "Solve for x: 2x + 5 = 15"
  - [ ] "What year did WWII end?"
- [ ] Verify AI provides hints, not answers

**Pass Criteria:** AI never gives direct answers to homework questions

---

### A.14 Progress Tracking (Criterion 14) - 25 min

- [ ] Open progress dashboard for Eva
- [ ] Verify circular progress rings display for each subject
  - [ ] Science: 75% (green ring)
  - [ ] Math: 45% (yellow ring)
  - [ ] History: 30% (yellow/red ring)
- [ ] Complete one Math task
  - [ ] Verify Math progress updates immediately (45% → 48%)
  - [ ] Verify ring animates to new percentage
- [ ] Check sub-concept granularity:
  - [ ] Expand "Fractions" topic
  - [ ] Verify sub-concepts listed: Halves, Thirds, Quarters, Eighths
  - [ ] Verify each has status icon: ✓ (mastered), ⚠️ (struggling), ○ (not started)

**Pass Criteria:** Progress displays accurately, updates in real-time, granularity visible

---

### A.15 Topic Switcher (Criterion 15) - ⚠️ Partial

- [ ] **Manual Topic Switch:**
  - [ ] Open chat as Pat
  - [ ] Click topic dropdown in chat header
  - [ ] Select "College Essays" (different subject)
  - [ ] Verify chat context updates
  - [ ] Verify AI acknowledges topic switch
- [ ] **AI-Suggested Switch (Not Implemented):**
  - [ ] ⚠️ Skip automated trigger testing
  - [ ] Verify component exists: `app/components/TopicSwitcher.tsx`
  - [ ] Verify manual switching works

**Pass Criteria:** Manual switching works, AI triggers pending

---

### A.16 Onboarding Flow (Criterion 16) - 30 min

- [ ] Create new student profile (copy Lucas, set `hasCompletedOnboarding: false`)
- [ ] Load profile in browser
- [ ] **Step 1: Welcome Screen**
  - [ ] Verify welcome message displays
  - [ ] Verify animation plays (friendly bubble)
  - [ ] Click "Next"
- [ ] **Step 2: Color Picker**
  - [ ] Verify 10 color options display
  - [ ] Select "Blue"
  - [ ] Verify bubble changes color
  - [ ] Click "Next"
- [ ] **Step 3: Tutorial**
  - [ ] Verify 4 tutorial slides:
    - [ ] Slide 1: Chat basics
    - [ ] Slide 2: Progress tracking
    - [ ] Slide 3: Task system
    - [ ] Slide 4: Streak counter
  - [ ] Click through all slides
- [ ] **Step 4: Goal Setup**
  - [ ] Select 3 subjects: Math, Science, Reading
  - [ ] Click "Start Learning"
- [ ] **Completion:**
  - [ ] Verify `preferences.hasCompletedOnboarding = true`
  - [ ] Verify redirect to chat page
  - [ ] Reload page
  - [ ] Verify onboarding does NOT show again

**Pass Criteria:** All 4 steps complete, onboarding flag persists

---

### A.17 Returning User Greeting (Criterion 17) - 10 min

- [ ] Log in as returning student (Pat with `hasCompletedOnboarding: true`)
- [ ] Verify personalized greeting displays:
  - [ ] Example: "Welcome back, Pat! Ready to continue SAT Prep?"
  - [ ] No onboarding flow shown
  - [ ] Dashboard displays immediately
- [ ] Verify greeting references:
  - [ ] Student name
  - [ ] Current subject or recent activity
  - [ ] Login streak (if applicable)

**Pass Criteria:** Returning users skip onboarding, see personalized greeting

---

## 🧪 Section B: User Journey Validation Tests

**Total Tasks:** 68
**Estimated Time:** 6-8 hours
**Priority:** High (validates end-to-end flows)

---

### B.1 Journey 1: Lucas's First Session (Age 9)

**Total Subtasks:** 16
**Estimated Time:** 90 minutes

#### B.1.1 Onboarding Flow (30 min)

- [ ] Set up test environment:
  - [ ] Copy `data/students/lucas.json` to `lucas-test.json`
  - [ ] Set `hasCompletedOnboarding: false`
  - [ ] Load `http://localhost:3000?student=lucas-test`
- [ ] Welcome screen test:
  - [ ] Verify welcome message: "Hi! I'm your AI study buddy! 🌟"
  - [ ] Verify animation plays (bubble entrance)
  - [ ] Click "Get Started"
- [ ] Color picker test:
  - [ ] Verify 10 colors display in grid layout
  - [ ] Click "Green"
  - [ ] Verify bubble changes to green instantly
  - [ ] Click "Next"
- [ ] Tutorial test:
  - [ ] Advance through 4 tutorial slides
  - [ ] Verify each slide has illustration + text
  - [ ] Verify progress dots show current slide (1/4, 2/4, etc.)
  - [ ] Click "Next" through all slides
- [ ] Goal setup test:
  - [ ] Verify subject picker displays 10+ subjects
  - [ ] Select "Science" and "Reading"
  - [ ] Verify max 3 subjects enforced (try selecting 4th)
  - [ ] Click "Start Learning"
- [ ] Completion verification:
  - [ ] Open `lucas-test.json` in editor
  - [ ] Verify `preferences.hasCompletedOnboarding = true`
  - [ ] Verify `preferences.aiColor = "green"`
  - [ ] Verify `subjects` includes Science and Reading goals

**Pass Criteria:** All onboarding steps complete without errors, data persists

#### B.1.2 Initial Conversation (25 min)

- [ ] Chat interface load:
  - [ ] Verify chat window displays
  - [ ] Verify animated bubble in idle state (gentle pulsing)
  - [ ] Verify input field enabled
- [ ] Send first message:
  - [ ] Type: "What is a plant?"
  - [ ] Press Enter
  - [ ] Verify loading state (thinking animation)
  - [ ] Wait for AI response (should be < 5 seconds)
- [ ] Verify age-appropriate tone:
  - [ ] Check response uses simple words
  - [ ] Check response has emojis (at least 1)
  - [ ] Check response has high encouragement
  - [ ] Example: "Great question! 🌱 A plant is a living thing that..."
- [ ] Verify context tracking:
  - [ ] Open browser DevTools → Application → Local Storage
  - [ ] Verify conversation saved
  - [ ] Verify message count = 2 (1 student, 1 AI)

**Pass Criteria:** Chat works, tone is age-appropriate, context tracked

#### B.1.3 Task Assignment (20 min)

- [ ] AI suggests task:
  - [ ] Continue conversation about plants
  - [ ] Verify AI says: "Want to try a practice question about plants?"
  - [ ] Type: "Yes!"
- [ ] Task generation:
  - [ ] Verify task appears in sidebar with "New" badge
  - [ ] Verify task title: e.g., "Plants and Sunlight"
  - [ ] Verify task type: Multiple Choice
  - [ ] Click task in sidebar
- [ ] Task details display:
  - [ ] Verify question text displays in chat
  - [ ] Verify 4 answer options (A, B, C, D)
  - [ ] Verify "Hints Available: 3" shown
  - [ ] Click "Show Hint 1"
  - [ ] Verify hint displays (broad guidance)
- [ ] Answer task:
  - [ ] Select correct answer
  - [ ] Click "Submit"
  - [ ] Verify feedback: "Correct! Great job! 🎉"
  - [ ] Verify points awarded (10-15)

**Pass Criteria:** Task generates, hints work, feedback is positive

#### B.1.4 Progress Tracking (15 min)

- [ ] After task completion:
  - [ ] Navigate to Progress page
  - [ ] Verify Science subject displays
  - [ ] Verify circular progress ring shows > 0%
  - [ ] Verify sub-concept marked as practiced
- [ ] Achievement unlock:
  - [ ] Verify "First Steps" badge unlocks
  - [ ] Verify confetti animation plays
  - [ ] Verify badge appears in achievements list
  - [ ] Verify points display in header (+10-15)
- [ ] Data persistence:
  - [ ] Open `lucas-test.json`
  - [ ] Verify `subjects[0].topics[X].progress > 0`
  - [ ] Verify `achievements` array includes "first_steps"
  - [ ] Verify `points > 0`

**Pass Criteria:** Progress updates, achievement unlocks, data saves

---

### B.2 Journey 2: Mia's Retention Nudge (Age 14, Churn Risk)

**Total Subtasks:** 18
**Estimated Time:** 80 minutes

#### B.2.1 Churn Detection (15 min)

- [ ] Open `data/students/mia.json` in editor
- [ ] Verify session count:
  - [ ] Count `conversationSessions` entries
  - [ ] Verify only 2 sessions in past 7 days
  - [ ] Verify last session date is 4+ days ago
- [ ] Calculate risk manually:
  - [ ] Open browser console
  - [ ] Import: `import { assessRisk } from '@/lib/services/retentionService'`
  - [ ] Call: `const risk = assessRisk(miaData)`
  - [ ] Verify `risk.riskLevel = "high"`
  - [ ] Verify `risk.reasons` includes "low session count"
- [ ] Verify churn flag:
  - [ ] Check `mia.churnRisk = true` (or equivalent field)

**Pass Criteria:** Mia correctly identified as high churn risk

#### B.2.2 Nudge Generation (20 min)

- [ ] Trigger nudge generation:
  - [ ] Import: `import { generateNudge } from '@/lib/services/retentionService'`
  - [ ] Call: `const nudge = await generateNudge(miaData)`
- [ ] Verify nudge message structure:
  - [ ] Check `nudge.message` exists
  - [ ] Check message celebrates progress first
  - [ ] Example: "Great job on Science! You're 75% complete! 🎉"
  - [ ] Check message encourages lagging subject
  - [ ] Example: "Math needs some attention. Ready to practice?"
- [ ] Verify nudge metadata:
  - [ ] Check `nudge.type = "subject_encouragement"`
  - [ ] Check `nudge.targetSubject = "Math"`
  - [ ] Check `nudge.priority = "high"`
  - [ ] Check `nudge.createdAt` timestamp exists
- [ ] Verify spam prevention:
  - [ ] Call `generateNudge()` again immediately
  - [ ] Verify 2nd call returns `null` (1 nudge/day limit)

**Pass Criteria:** Nudge message is positive, spam prevention works

#### B.2.3 Nudge Delivery UI (20 min)

- [ ] Load Mia's profile:
  - [ ] Navigate to `http://localhost:3000?student=mia`
  - [ ] Wait for page load (< 3 seconds)
- [ ] Verify NudgePopup renders:
  - [ ] Verify modal overlay displays
  - [ ] Verify backdrop blur effect visible
  - [ ] Verify modal container has doodle styling (border-2, rounded-2xl)
  - [ ] Verify nudge message displays correctly
  - [ ] Verify two buttons: "Start Math Session" and "Maybe Later"
- [ ] Verify modal animations:
  - [ ] Verify slide-in animation on mount
  - [ ] Verify modal is centered on screen
  - [ ] Verify modal is responsive (test mobile view)

**Pass Criteria:** Modal displays correctly, animations smooth

#### B.2.4 Accept Flow (15 min)

- [ ] Click "Start Math Session" button:
  - [ ] Verify redirect to chat page
  - [ ] Verify Math topic pre-selected in chat
  - [ ] Verify AI greeting references nudge
  - [ ] Example: "Let's work on Math together! 📚"
- [ ] Verify task sidebar:
  - [ ] Verify incomplete Math tasks display
  - [ ] Verify tasks sorted by priority
  - [ ] Click first task
  - [ ] Verify task loads correctly
- [ ] Verify nudge marked as accepted:
  - [ ] Open `mia.json`
  - [ ] Verify nudge in history with `status: "accepted"`
  - [ ] Verify `acceptedAt` timestamp exists

**Pass Criteria:** Accept flow redirects correctly, nudge tracked

#### B.2.5 Dismiss Flow (10 min)

- [ ] Reset test environment:
  - [ ] Clear nudge history in `mia.json`
  - [ ] Reload page to trigger nudge again
- [ ] Click "Maybe Later" button:
  - [ ] Verify modal closes with fade-out animation
  - [ ] Verify dashboard displays
  - [ ] Verify no redirect occurs
- [ ] Test 24-hour cooldown:
  - [ ] Log out
  - [ ] Log back in immediately (same day)
  - [ ] Verify nudge does NOT reappear
  - [ ] Open `mia.json`
  - [ ] Verify nudge marked as `status: "dismissed"`
  - [ ] Verify `dismissedAt` timestamp exists

**Pass Criteria:** Dismiss closes modal, cooldown prevents spam

---

### B.3 Journey 3: Pat's Subject Expansion (Age 16)

**Total Subtasks:** 18
**Estimated Time:** 90 minutes

#### B.3.1 Goal Completion Detection (15 min)

- [ ] Open `data/students/pat.json`
- [ ] Verify current progress:
  - [ ] Check SAT Prep goal exists
  - [ ] Check `subjects[0].progress >= 85%`
  - [ ] Check all topics > 80% mastered
  - [ ] Check `lastPracticed` timestamp within 7 days
- [ ] Calculate engagement score:
  - [ ] Import: `import { assessRisk } from '@/lib/services/retentionService'`
  - [ ] Call: `const risk = assessRisk(patData)`
  - [ ] Verify `risk.riskLevel = "low"` (high engagement)
  - [ ] Verify `risk.engagementScore >= 80`

**Pass Criteria:** Pat's progress is 85%+, engagement is high

#### B.3.2 Cross-Subject Recommendation (25 min)

- [ ] Trigger recommendation logic:
  - [ ] Import: `import { getSubjectRecommendations } from '@/lib/services/adaptiveLearningService'`
  - [ ] Call: `const recs = await getSubjectRecommendations(patData)`
- [ ] Verify rule-based suggestions:
  - [ ] Check `recs.ruleBased` array exists
  - [ ] Check "College Essays" in suggestions (related to SAT Prep)
  - [ ] Check `priority = "high"` for rule-based
  - [ ] Check reasoning provided (e.g., "Complements SAT Prep")
- [ ] Verify AI-inferred suggestions:
  - [ ] Check `recs.aiInferred` array exists
  - [ ] Check at least 1 suggestion (e.g., "Study Skills")
  - [ ] Check `priority = "medium"` for AI-inferred
  - [ ] Check reasoning provided
- [ ] Verify sorting:
  - [ ] Verify rule-based suggestions appear first
  - [ ] Verify AI-inferred suggestions appear second
  - [ ] Verify max 3 total suggestions

**Pass Criteria:** Recommendations generated, sorted by priority

#### B.3.3 AI Suggestion Display in Chat (20 min)

- [ ] Load Pat's profile and start chat:
  - [ ] Navigate to `http://localhost:3000?student=pat`
  - [ ] Wait for chat to load
  - [ ] Send message: "How's my progress?"
- [ ] Verify AI suggests new subject:
  - [ ] AI responds with progress summary
  - [ ] Example: "You're almost done with SAT Prep! 🎉 You're at 87% completion."
  - [ ] AI suggests new subject
  - [ ] Example: "Have you thought about working on College Essays next?"
  - [ ] AI explains reasoning
  - [ ] Example: "Strong writing skills will help with college applications."
- [ ] Verify action prompt:
  - [ ] AI asks for confirmation
  - [ ] Example: "Would you like to add College Essays to your goals?"
  - [ ] Verify clear "yes/no" options mentioned

**Pass Criteria:** AI suggests subject naturally, explains reasoning clearly

#### B.3.4 Student Confirmation & Goal Addition (20 min)

- [ ] Student accepts suggestion:
  - [ ] Type: "Yes, let's do College Essays!"
  - [ ] Press Enter
  - [ ] Wait for AI response (< 5 seconds)
- [ ] Verify AI creates new goal:
  - [ ] AI responds with confirmation
  - [ ] Example: "Great! I've added College Essays to your goals. 📝"
  - [ ] AI explains what to expect
  - [ ] Example: "We'll cover brainstorming, structure, and revision."
- [ ] Verify goal added to profile:
  - [ ] Open `pat.json`
  - [ ] Verify new subject in `subjects` array:
    ```json
    {
      "subject": "College Essays",
      "progress": 0,
      "topics": [
        {"name": "Brainstorming", "progress": 0},
        {"name": "Structure", "progress": 0},
        {"name": "Revision", "progress": 0}
      ]
    }
    ```
- [ ] Verify max subjects enforced:
  - [ ] If Pat has 4 subjects, try adding 5th
  - [ ] Verify AI prompts to complete or remove existing goal
  - [ ] Example: "You have 4 active goals. Complete one before adding more."

**Pass Criteria:** New goal added seamlessly, max enforced

#### B.3.5 New Goal Initialization (10 min)

- [ ] Navigate to Progress page:
  - [ ] Verify "College Essays" appears in subject list
  - [ ] Verify circular progress ring displays at 0%
  - [ ] Verify ring color matches theme
  - [ ] Verify 3 topics listed: Brainstorming, Structure, Revision
  - [ ] Verify all topics marked as "not started" (○)
- [ ] Return to chat:
  - [ ] Send message: "Let's start with brainstorming"
  - [ ] Verify AI generates first task for College Essays
  - [ ] Verify task appears in sidebar
  - [ ] Click task
  - [ ] Verify task loads correctly

**Pass Criteria:** New goal displays in UI, tasks generate correctly

---

### B.4 Journey 4: Eva's Tutor Booking (Age 12)

**Total Subtasks:** 16
**Estimated Time:** 100 minutes

#### B.4.1 Struggle Detection (20 min)

- [ ] Set up struggle scenario:
  - [ ] Open `data/students/eva.json`
  - [ ] Verify Eva has incomplete "Fractions - Thirds" task
  - [ ] Start chat session as Eva
  - [ ] Navigate to task: "Fractions - Thirds"
- [ ] Attempt task 3 times (incorrectly):
  - [ ] Select wrong answer
  - [ ] Click "Submit"
  - [ ] Verify feedback: "Not quite. Try again!"
  - [ ] Repeat 2 more times (3 total failures)
- [ ] Verify frustration detection:
  - [ ] Type in chat: "I don't understand this"
  - [ ] Verify AI acknowledges struggle
  - [ ] Type: "This is confusing"
  - [ ] Verify AI detects frustration
- [ ] Verify intervention trigger:
  - [ ] Import: `import { determineIntervention } from '@/lib/services/adaptiveLearningService'`
  - [ ] Call: `const intervention = determineIntervention(evaData, "Fractions - Thirds", 3)`
  - [ ] Verify `intervention.type = "tutor_suggestion"`
  - [ ] Verify `intervention.priority = "high"`

**Pass Criteria:** 3 failures + frustration phrases trigger tutor suggestion

#### B.4.2 AI Intervention Message (15 min)

- [ ] Verify AI suggests tutor:
  - [ ] AI responds with empathetic message
  - [ ] Example: "I notice you've been working really hard on this, Eva. Fractions can be tricky!"
  - [ ] AI suggests tutor
  - [ ] Example: "Sometimes it helps to talk to a real tutor. Would you like to schedule a session?"
  - [ ] AI provides context
  - [ ] Example: "Mr. Rodriguez is great at explaining fractions with fun examples."
- [ ] Verify action metadata:
  - [ ] Open browser DevTools → Network tab
  - [ ] Inspect AI response payload
  - [ ] Verify `metadata` field includes:
    ```json
    {
      "type": "suggest_booking",
      "tutorId": "tutor-james-rodriguez",
      "topic": "Fractions",
      "strugglingConcepts": ["Thirds", "Division"]
    }
    ```

**Pass Criteria:** AI suggests tutor naturally, metadata correct

#### B.4.3 Booking Modal Trigger (⚠️ UI Not Implemented - 15 min)

- [ ] **Skip UI testing** (component not implemented)
- [ ] Verify component file exists:
  - [ ] Check `app/components/BookingInterface.tsx` exists
  - [ ] If not, verify component planned in roadmap
- [ ] Verify backend service:
  - [ ] Check `lib/services/tutorService.ts` exists
  - [ ] Function exists: `getTutorProfile(tutorId)`
  - [ ] Function exists: `getTutorAvailability(tutorId)`

**Pass Criteria:** Backend services confirmed (UI pending)

#### B.4.4 Booking Form (⚠️ UI Not Implemented - 20 min)

- [ ] **Skip form testing** (UI not implemented)
- [ ] Verify backend booking function:
  - [ ] Import: `import { createBookingWithHandoff } from '@/lib/services/tutorService'`
  - [ ] Call manually with sample data:
    ```typescript
    const booking = await createBookingWithHandoff({
      studentId: "eva",
      tutorId: "tutor-james-rodriguez",
      topic: "Fractions",
      timeSlot: {date: "2025-11-09", time: "15:00", duration: 60},
      reason: "Struggling with thirds and division",
      notes: ""
    })
    ```
  - [ ] Verify `booking.id` exists
  - [ ] Verify `booking.status = "pending"`

**Pass Criteria:** Backend booking creation works

#### B.4.5 Handoff Notes Generation (20 min)

- [ ] Verify handoff notes created:
  - [ ] Call `createBookingWithHandoff()` (from above)
  - [ ] Wait for OpenAI API response
  - [ ] Verify `booking.handoffNotes` exists
- [ ] Verify handoff notes quality:
  - [ ] Check notes include student name and age
  - [ ] Check notes include struggle topic ("Fractions - Thirds")
  - [ ] Check notes include attempt count (3+ failures)
  - [ ] Check notes include context (e.g., "Understands halves and quarters well")
  - [ ] Check notes suggest teaching approach
  - [ ] Example: "Use visual models like pizza slices"
  - [ ] Check notes mention emotional state
  - [ ] Example: "Frustrated but motivated to learn"
- [ ] Verify notes length:
  - [ ] Count characters (should be 300-600 characters)
  - [ ] Verify concise but comprehensive
  - [ ] Verify no fluff or unnecessary detail

**Pass Criteria:** Handoff notes comprehensive, actionable, 300-600 chars

#### B.4.6 Booking Confirmation (10 min)

- [ ] Verify booking record:
  - [ ] Open `eva.json` (or database in Phase 2)
  - [ ] Verify `bookings` array includes new booking
  - [ ] Verify booking fields:
    ```json
    {
      "id": "booking-xxx",
      "tutorId": "tutor-james-rodriguez",
      "topic": "Fractions",
      "timeSlot": {"date": "2025-11-09", "time": "15:00", "duration": 60},
      "status": "pending",
      "handoffNotes": "...",
      "createdAt": "2025-11-08T..."
    }
    ```
- [ ] Verify confirmation email (Phase 2 feature):
  - [ ] ⚠️ Skip email testing (not implemented in Phase 1)
  - [ ] Verify email service planned in Phase 2

**Pass Criteria:** Booking record created with all fields

---

## 🔬 Section C: Technical Acceptance Tests

**Total Tasks:** 42
**Estimated Time:** 5-6 hours
**Priority:** High (validates core systems)

---

### C.1 AI System Tests (24 min)

**Context Window Tests:**
- [ ] Send 20 messages in chat
- [ ] Inspect API request payload (DevTools → Network)
- [ ] Verify last 15 messages in full detail
- [ ] Verify messages 16-20 summarized
- [ ] Count total tokens (should be < 2000)

**Age Tone Tests:**
- [ ] Test age 9-11 tone (Lucas):
  - [ ] Send 5 questions
  - [ ] Manually verify simple vocabulary
  - [ ] Count emojis (should be 5-10 across 5 responses)
- [ ] Test age 12-14 tone (Eva):
  - [ ] Send 5 questions
  - [ ] Verify balanced tone (not too simple, not too academic)
- [ ] Test age 15-16 tone (Pat):
  - [ ] Send 5 questions
  - [ ] Verify academic vocabulary
  - [ ] Count emojis (should be 0-3 across 5 responses)

**Homework Helper Tests:**
- [ ] Ask: "What's 5 + 7?"
  - [ ] Verify AI provides hint, not answer
- [ ] Ask: "What year did WWII end?"
  - [ ] Verify AI guides research, doesn't state answer
- [ ] Ask: "Solve for x: 2x + 5 = 15"
  - [ ] Verify AI breaks down steps, doesn't solve

**Content Filter Tests:**
- [ ] Type profanity
  - [ ] Verify blocked
- [ ] Type address
  - [ ] Verify blocked
- [ ] Type phone number
  - [ ] Verify blocked
- [ ] Type email
  - [ ] Verify blocked

**Pass Criteria:** All AI system tests pass

---

### C.2 Task Generation Tests (35 min)

**Multiple Choice Tests:**
- [ ] Generate MC task for Lucas (age 9)
  - [ ] Verify exactly 4 options
  - [ ] Verify 1 correct answer
  - [ ] Verify distractors based on common mistakes
  - [ ] Verify 3 progressive hints
  - [ ] Test Hint 1: broad guidance
  - [ ] Test Hint 2: more specific
  - [ ] Test Hint 3: nearly gives answer away
- [ ] Generate MC task for Pat (age 16)
  - [ ] Verify difficulty appropriate for age
  - [ ] Verify vocabulary level higher

**Open-Ended Tests:**
- [ ] Generate OE task for Eva
  - [ ] Verify open-ended prompt
  - [ ] Verify rubric with 3-5 criteria
  - [ ] Verify sample answer provided
  - [ ] Verify points range (10-15)

**Real-World Tests:**
- [ ] Generate RW task for Pat
  - [ ] Verify activity description
  - [ ] Verify materials list exists
  - [ ] Verify safety notes (if applicable)
  - [ ] Verify expected deliverable clear

**Difficulty Adjustment Tests:**
- [ ] Set student to <50% correct rate
  - [ ] Generate next task
  - [ ] Verify difficulty = "easy"
- [ ] Set student to 50-80% correct
  - [ ] Generate next task
  - [ ] Verify difficulty = "medium"
- [ ] Set student to >80% correct
  - [ ] Generate next task
  - [ ] Verify difficulty = "hard"

**Pass Criteria:** All task generation tests pass

---

### C.3 Progress Tracking Tests (20 min)

**Sub-Concept Mastery:**
- [ ] Set sub-concept to 95% correct (9/10 attempts)
  - [ ] Verify status = "mastered" (✓)
- [ ] Set sub-concept to 35% correct (3/10 attempts)
  - [ ] Verify status = "struggling" (⚠️)
- [ ] Set sub-concept to 0 attempts
  - [ ] Verify status = "not started" (○)

**Topic Progress Calculation:**
- [ ] Set topic with 3 sub-concepts:
  - [ ] Sub-concept 1: 90% (mastered)
  - [ ] Sub-concept 2: 60% (practicing)
  - [ ] Sub-concept 3: 30% (struggling)
  - [ ] Calculate average: (90 + 60 + 30) / 3 = 60%
  - [ ] Verify topic progress displays 60%

**Goal Progress Calculation:**
- [ ] Set goal with 3 topics:
  - [ ] Topic 1: 80%
  - [ ] Topic 2: 60%
  - [ ] Topic 3: 50%
  - [ ] Calculate average: (80 + 60 + 50) / 3 = 63.3%
  - [ ] Verify goal progress displays 63%

**Circular Ring Color Tests:**
- [ ] Set progress to 85%
  - [ ] Verify ring color = green
- [ ] Set progress to 60%
  - [ ] Verify ring color = yellow
- [ ] Set progress to 30%
  - [ ] Verify ring color = red

**Pass Criteria:** All progress calculations accurate, colors correct

---

### C.4 Retention System Tests (30 min)

**Churn Detection Tests:**
- [ ] Test high risk: < 3 sessions by Day 7
  - [ ] Set up student with 2 sessions in 7 days
  - [ ] Call `assessRisk()`
  - [ ] Verify `riskLevel = "high"`
- [ ] Test medium risk: no activity 3+ days
  - [ ] Set up student with 5 sessions, last 4 days ago
  - [ ] Call `assessRisk()`
  - [ ] Verify `riskLevel = "medium"`
- [ ] Test low risk: regular activity
  - [ ] Set up student with 10 sessions, last today
  - [ ] Call `assessRisk()`
  - [ ] Verify `riskLevel = "low"`

**Nudge Spam Prevention:**
- [ ] Generate nudge for Mia (Math)
  - [ ] Verify nudge created
- [ ] Generate 2nd nudge same day (Math)
  - [ ] Verify 2nd nudge returns `null`
- [ ] Generate nudge for different subject (Science)
  - [ ] Verify allowed (1 per subject per day)

**Nudge Priority Tests:**
- [ ] Generate nudge with multiple priorities:
  - [ ] Set up student with:
    - [ ] Celebrate: 90% Science progress
    - [ ] Encourage: 40% Math progress
    - [ ] Recover: 2-day login streak (close to 3-day)
  - [ ] Verify celebrate message shown first
  - [ ] Example: "Amazing! Science is 90% complete! 🎉"

**Streak Tests:**
- [ ] Login streak: consecutive days
  - [ ] Log in Day 1: streak = 1
  - [ ] Log in Day 2: streak = 2
  - [ ] Log in Day 3: streak = 3
  - [ ] Verify all increments correct
- [ ] Practice streak: consecutive task days
  - [ ] Complete task Day 1: streak = 1
  - [ ] Complete task Day 2: streak = 2
  - [ ] Skip Day 3, complete task Day 4: streak = 1 (reset)
- [ ] Longest streak preservation:
  - [ ] Set `longestStreak = 10`
  - [ ] Set `currentStreak = 5`
  - [ ] Break streak (miss day)
  - [ ] Verify `longestStreak` still = 10

**Pass Criteria:** All retention tests pass

---

### C.5 Gamification Tests (25 min)

**Animated Bubble States:**
- [ ] Test idle state:
  - [ ] Open chat with no activity
  - [ ] Verify gentle pulsing animation (3s loop)
  - [ ] Measure loop duration (should be ~3 seconds)
- [ ] Test thinking state:
  - [ ] Send message
  - [ ] During AI response generation, verify:
    - [ ] Breathing effect (scale 1.0 to 1.1)
    - [ ] Pencil rotation animation
- [ ] Test speaking state:
  - [ ] Wait for AI response to arrive
  - [ ] Verify quick scale pulses (0.8s loop)
- [ ] Test celebrating state:
  - [ ] Complete task correctly
  - [ ] Verify burst animation
  - [ ] Verify spinning stars around bubble

**Color Picker Tests:**
- [ ] Verify 10 colors display:
  - [ ] Purple, Blue, Green, Pink, Orange
  - [ ] Red, Yellow, Teal, Indigo, Rose
- [ ] Select each color:
  - [ ] Click color swatch
  - [ ] Verify bubble changes color instantly
  - [ ] Verify `preferences.aiColor` updated in JSON

**Achievement Tests:**
- [ ] Test "First Steps" unlock:
  - [ ] Send first message
  - [ ] Verify confetti animation
  - [ ] Verify badge appears
- [ ] Test "3-Day Streak" unlock:
  - [ ] Set streak to 2
  - [ ] Log in next day
  - [ ] Verify unlock
- [ ] Test "Topic Master" unlock:
  - [ ] Set topic to 89%
  - [ ] Complete task to reach 90%
  - [ ] Verify unlock
- [ ] Test "Curious Mind" unlock:
  - [ ] Send 9 questions
  - [ ] Send 10th question
  - [ ] Verify unlock
- [ ] Test "Streak Breaker" unlock:
  - [ ] Set current streak = longest streak
  - [ ] Log in next day to beat record
  - [ ] Verify unlock

**Confetti Animation Test:**
- [ ] Trigger any achievement
  - [ ] Count confetti particles (should be 20-40)
  - [ ] Verify particles animate upward and outward
  - [ ] Verify animation duration ~2 seconds
  - [ ] Verify confetti clears after animation

**Pass Criteria:** All gamification features work, animations smooth

---

## ⚡ Section D: Performance Benchmarks

**Total Tasks:** 15
**Estimated Time:** 3-4 hours
**Priority:** Medium (validates non-functional requirements)

---

### D.1 Load Time Tests (60 min)

**Desktop Load Times:**
- [ ] Test initial page load (desktop):
  - [ ] Clear browser cache
  - [ ] Open DevTools → Network tab
  - [ ] Load `http://localhost:3000?student=lucas`
  - [ ] Measure "DOMContentLoaded" time
  - [ ] Verify < 2 seconds
  - [ ] Repeat 5 times, calculate average
- [ ] Test subsequent page loads (desktop):
  - [ ] Navigate between pages (Chat → Progress → Dashboard)
  - [ ] Measure load time for each
  - [ ] Verify < 1 second per page

**Mobile Load Times:**
- [ ] Test initial page load (mobile):
  - [ ] Open DevTools → Toggle device toolbar
  - [ ] Select "iPhone 12 Pro"
  - [ ] Enable "Slow 3G" throttling
  - [ ] Clear cache
  - [ ] Load page
  - [ ] Measure load time
  - [ ] Verify < 3 seconds
- [ ] Test subsequent loads (mobile):
  - [ ] Navigate between pages
  - [ ] Verify < 2 seconds per page

**Pass Criteria:** Desktop < 2s, mobile < 3s initial load

---

### D.2 AI Response Time Tests (40 min)

**Conversation Response Time:**
- [ ] Send 10 messages to Lucas
  - [ ] Measure time from "Enter" to AI response displayed
  - [ ] Record all 10 times
  - [ ] Calculate average
  - [ ] Verify average < 5 seconds
  - [ ] Verify max < 8 seconds
- [ ] Repeat for Eva (age 12)
  - [ ] Verify similar performance
- [ ] Repeat for Pat (age 16)
  - [ ] Verify similar performance

**Task Generation Time:**
- [ ] Generate batch of 5 tasks:
  - [ ] Trigger task generation
  - [ ] Measure time from request to tasks displayed
  - [ ] Verify < 8 seconds total
  - [ ] Verify ~1.5 seconds per task average

**Handoff Notes Time:**
- [ ] Generate handoff notes:
  - [ ] Call `createBookingWithHandoff()`
  - [ ] Measure time for OpenAI response
  - [ ] Verify < 3 seconds

**Friend Message Time:**
- [ ] Generate friend message:
  - [ ] Call `generateFriendMessage()`
  - [ ] Measure time
  - [ ] Verify < 2 seconds

**Pass Criteria:** All AI operations within target times

---

### D.3 Profile Load Time Tests (15 min)

- [ ] Test JSON read performance:
  - [ ] Clear cache
  - [ ] Load Lucas profile
  - [ ] Measure time to read `lucas.json`
  - [ ] Verify < 500ms
- [ ] Test large profile (Mia with lots of history):
  - [ ] Add 100 conversation sessions to `mia.json`
  - [ ] Load profile
  - [ ] Measure load time
  - [ ] Verify < 800ms

**Pass Criteria:** Profile loads < 500ms (normal), < 800ms (large)

---

### D.4 Token Usage Tests (60 min)

**Conversation Turn Token Count:**
- [ ] Send message to Lucas:
  - [ ] Open DevTools → Network
  - [ ] Inspect OpenAI API request
  - [ ] Copy request payload
  - [ ] Use token counter tool: https://platform.openai.com/tokenizer
  - [ ] Paste prompt
  - [ ] Verify < 2000 tokens
- [ ] Repeat for 10 turns
  - [ ] Verify all turns < 2000 tokens
  - [ ] Calculate average (~1700 tokens target)

**Task Generation Token Count:**
- [ ] Generate batch of 5 tasks:
  - [ ] Inspect API request
  - [ ] Count tokens
  - [ ] Verify < 3000 tokens total
  - [ ] Calculate per-task average (~500 tokens target)

**Handoff Notes Token Count:**
- [ ] Generate handoff notes:
  - [ ] Inspect API request
  - [ ] Count tokens
  - [ ] Verify < 500 tokens

**Friend Message Token Count:**
- [ ] Generate friend message:
  - [ ] Inspect API request
  - [ ] Count tokens
  - [ ] Verify < 200 tokens

**Pass Criteria:** All operations within token budgets

---

### D.5 Cost Estimation Tests (45 min)

**Calculate Daily Cost per User:**
- [ ] Conversation cost:
  - [ ] 10 turns/day × 1700 tokens = 17,000 tokens
  - [ ] GPT-4 pricing: $0.03 per 1K tokens
  - [ ] Daily cost: 17 × $0.03 = $0.51/day
- [ ] Task generation cost:
  - [ ] 5 tasks/day × 500 tokens = 2,500 tokens
  - [ ] Daily cost: 2.5 × $0.03 = $0.075/day
- [ ] Handoff notes cost:
  - [ ] 1 booking/week ÷ 7 = 0.14/day
  - [ ] 0.14 × 400 tokens × $0.03 = $0.0017/day
- [ ] Friend messages cost:
  - [ ] 3 messages/day × 150 tokens = 450 tokens
  - [ ] Daily cost: 0.45 × $0.03 = $0.0135/day

**Calculate Monthly Cost (100 users):**
- [ ] Sum daily costs:
  - [ ] Conversation: $0.51 × 30 days × 100 users = $1,530
  - [ ] Tasks: $0.075 × 30 × 100 = $225
  - [ ] Handoff: $0.0017 × 30 × 100 = $5.10
  - [ ] Friends: $0.0135 × 30 × 100 = $40.50
  - [ ] **Total: ~$1,800/month**

**Apply Caching Reduction:**
- [ ] Calculate with 40% caching:
  - [ ] $1,800 × 0.6 = $1,080/month
  - [ ] Verify close to target: ~$1,070/month

**Pass Criteria:** Monthly cost ~$1,070 with caching

---

## ♿ Section E: Accessibility & Compatibility Tests

**Total Tasks:** 25
**Estimated Time:** 4-5 hours
**Priority:** Medium (validates WCAG compliance)

---

### E.1 WCAG AA Color Contrast Tests (60 min)

- [ ] Install contrast checker tool:
  - [ ] Browser extension: "WCAG Color Contrast Checker"
  - [ ] Or use: https://webaim.org/resources/contrastchecker/
- [ ] Test text contrast:
  - [ ] Body text vs background: verify 4.5:1 ratio
  - [ ] Button text vs button background: verify 4.5:1
  - [ ] Link text vs background: verify 4.5:1
  - [ ] Chat bubble text vs bubble background: verify 4.5:1
- [ ] Test all 10 AI bubble colors:
  - [ ] Purple bubble: verify contrast
  - [ ] Blue bubble: verify contrast
  - [ ] Green bubble: verify contrast
  - [ ] Pink bubble: verify contrast
  - [ ] Orange bubble: verify contrast
  - [ ] Red bubble: verify contrast
  - [ ] Yellow bubble: verify contrast (common failure)
  - [ ] Teal bubble: verify contrast
  - [ ] Indigo bubble: verify contrast
  - [ ] Rose bubble: verify contrast
- [ ] Fix any failures:
  - [ ] Adjust color saturation/brightness
  - [ ] Re-test after adjustments

**Pass Criteria:** All text meets 4.5:1 contrast ratio

---

### E.2 Focus Indicator Tests (30 min)

- [ ] Test keyboard navigation:
  - [ ] Press Tab to navigate through page
  - [ ] Verify visible focus ring on all interactive elements:
    - [ ] Buttons
    - [ ] Links
    - [ ] Input fields
    - [ ] Task checkboxes
    - [ ] Color picker swatches
    - [ ] Modal close buttons
- [ ] Test focus visibility:
  - [ ] Verify focus ring color contrasts with background
  - [ ] Verify focus ring thickness (min 2px)
  - [ ] Verify focus ring doesn't obscure content
- [ ] Test focus order:
  - [ ] Verify Tab order follows visual layout
  - [ ] Verify no focus traps (can Tab out of modals)

**Pass Criteria:** All interactive elements have visible focus indicators

---

### E.3 Keyboard Navigation Tests (45 min)

- [ ] Test chat interface:
  - [ ] Tab to input field
  - [ ] Type message
  - [ ] Press Enter to send
  - [ ] Verify message sent without mouse
- [ ] Test task completion:
  - [ ] Tab to task in sidebar
  - [ ] Press Enter to open task
  - [ ] Tab to answer options
  - [ ] Press Space to select
  - [ ] Tab to Submit button
  - [ ] Press Enter to submit
  - [ ] Verify all actions work keyboard-only
- [ ] Test modal dialogs:
  - [ ] Open NudgePopup
  - [ ] Tab to "Accept" button
  - [ ] Press Enter to accept
  - [ ] Test Esc key closes modal
- [ ] Test color picker:
  - [ ] Tab to color swatches
  - [ ] Press Arrow keys to navigate colors
  - [ ] Press Enter to select
  - [ ] Verify selection works keyboard-only

**Pass Criteria:** All features accessible via keyboard only

---

### E.4 Screen Reader Tests (90 min)

**Setup:**
- [ ] Install screen reader:
  - [ ] macOS: Enable VoiceOver (Cmd + F5)
  - [ ] Windows: Install NVDA (free)
  - [ ] Linux: Install Orca

**Test Chat Interface:**
- [ ] Navigate to chat page
  - [ ] Verify page title announced
  - [ ] Verify main heading announced
- [ ] Test input field:
  - [ ] Tab to input field
  - [ ] Verify label announced: "Type your message"
  - [ ] Type message
  - [ ] Verify text announced as typed
- [ ] Test AI responses:
  - [ ] Send message
  - [ ] Verify AI response announced when received
  - [ ] Verify speaker identified: "AI says..."

**Test ARIA Labels:**
- [ ] Check all buttons:
  - [ ] Verify all have `aria-label` or visible text
  - [ ] Example: Color picker button should announce "Select AI bubble color"
- [ ] Check all icons:
  - [ ] Verify all have `aria-label`
  - [ ] Example: Close icon should announce "Close modal"
- [ ] Check all progress rings:
  - [ ] Verify progress announced
  - [ ] Example: "Science progress: 75%"

**Test Form Fields:**
- [ ] Test onboarding forms:
  - [ ] Verify all fields have labels
  - [ ] Verify error messages announced
  - [ ] Verify required fields identified

**Test Dynamic Content:**
- [ ] Trigger notification (achievement unlock):
  - [ ] Verify announcement via `aria-live` region
  - [ ] Example: "Achievement unlocked: First Steps!"
- [ ] Update progress:
  - [ ] Complete task
  - [ ] Verify progress update announced

**Pass Criteria:** All content accessible via screen reader

---

### E.5 Text Resizing Tests (20 min)

- [ ] Test 150% zoom:
  - [ ] Open browser settings
  - [ ] Set zoom to 150%
  - [ ] Verify all text readable
  - [ ] Verify no text cut off
  - [ ] Verify no horizontal scroll
- [ ] Test 200% zoom:
  - [ ] Set zoom to 200%
  - [ ] Verify all text readable
  - [ ] Verify layout doesn't break
  - [ ] Verify images scale appropriately
- [ ] Test on mobile:
  - [ ] Enable text size increase in iOS/Android settings
  - [ ] Verify app respects system text size

**Pass Criteria:** Readable at 200% zoom, no layout breaks

---

### E.6 Alt Text Tests (15 min)

- [ ] Audit all images:
  - [ ] Student avatar images
  - [ ] Tutor photos
  - [ ] Achievement badge icons
  - [ ] Onboarding tutorial illustrations
- [ ] Verify alt text:
  - [ ] All images have `alt` attribute
  - [ ] Alt text is descriptive (not generic)
  - [ ] Example: `alt="Student avatar: smiling girl with glasses"` (not `alt="avatar"`)
- [ ] Test decorative images:
  - [ ] Verify decorative images have `alt=""`
  - [ ] Example: Background patterns, dividers

**Pass Criteria:** All images have appropriate alt text

---

### E.7 Browser Compatibility Tests (90 min)

**Desktop Browsers:**
- [ ] Test Chrome (latest):
  - [ ] Load app, verify all features work
  - [ ] Test chat, tasks, progress, onboarding
  - [ ] Verify animations smooth
  - [ ] Verify no console errors
- [ ] Test Firefox (latest):
  - [ ] Repeat all tests from Chrome
  - [ ] Verify CSS compatibility (Flexbox, Grid)
- [ ] Test Safari (latest):
  - [ ] Repeat all tests
  - [ ] Verify WebKit-specific features work
- [ ] Test Edge (latest):
  - [ ] Repeat all tests
  - [ ] Verify Chromium compatibility

**Mobile Browsers:**
- [ ] Test iOS Safari (iOS 14+):
  - [ ] Load on real device or simulator
  - [ ] Test touch interactions
  - [ ] Verify keyboard doesn't obscure input
  - [ ] Test landscape orientation
- [ ] Test Chrome Mobile (Android 10+):
  - [ ] Load on real device or emulator
  - [ ] Test touch interactions
  - [ ] Verify responsiveness

**Pass Criteria:** All features work on all browsers

---

### E.8 Responsive Design Tests (45 min)

**Mobile (375px - 767px):**
- [ ] Test iPhone SE (375px width):
  - [ ] Verify layout doesn't break
  - [ ] Verify text readable (min 16px)
  - [ ] Verify buttons large enough (min 44px tap target)
  - [ ] Verify no horizontal scroll
- [ ] Test navigation:
  - [ ] Verify mobile menu works
  - [ ] Verify sidebar collapses or becomes drawer
- [ ] Test forms:
  - [ ] Verify input fields full width
  - [ ] Verify keyboard doesn't obscure fields

**Tablet (768px - 1023px):**
- [ ] Test iPad (768px width):
  - [ ] Verify 2-column layout (if applicable)
  - [ ] Verify sidebar displays appropriately
  - [ ] Verify chat and task list both visible

**Desktop (1024px+):**
- [ ] Test 1920px width:
  - [ ] Verify 3-column layout (sidebar, chat, tasks)
  - [ ] Verify content doesn't stretch too wide
  - [ ] Verify max-width constraints applied

**Pass Criteria:** App usable on all screen sizes

---

## 🔒 Section F: Security & Safety Tests

**Total Tasks:** 13
**Estimated Time:** 2-3 hours
**Priority:** Critical (protects students)

---

### F.1 Content Filter Tests (40 min)

**Inappropriate Language:**
- [ ] Test profanity filter:
  - [ ] Type common profanity words
  - [ ] Verify blocked before sending
  - [ ] Verify error message: "This message contains inappropriate content"
- [ ] Test variations:
  - [ ] Test with spaces: "d a m n"
  - [ ] Test with symbols: "d@mn"
  - [ ] Verify filter catches variations

**Personal Information:**
- [ ] Test address blocking:
  - [ ] Type: "I live at 123 Main Street"
  - [ ] Verify blocked
- [ ] Test phone number blocking:
  - [ ] Type: "555-1234"
  - [ ] Type: "(555) 123-4567"
  - [ ] Verify both formats blocked
- [ ] Test email blocking:
  - [ ] Type: "student@example.com"
  - [ ] Verify blocked

**Off-Platform Communication:**
- [ ] Test social media references:
  - [ ] Type: "Add me on Instagram"
  - [ ] Type: "Let's chat on Discord"
  - [ ] Type: "My Snapchat is..."
  - [ ] Verify all blocked

**Pass Criteria:** All inappropriate content blocked

---

### F.2 Conversation Logging Tests (30 min)

- [ ] Test message logging:
  - [ ] Send 10 messages in chat
  - [ ] Open `student.json`
  - [ ] Verify all 10 messages logged
  - [ ] Verify timestamps accurate
  - [ ] Verify speaker identified (student vs AI)
- [ ] Test metadata logging:
  - [ ] Verify each message has:
    - [ ] `id` (unique)
    - [ ] `speaker` ("student" or "ai")
    - [ ] `text` (message content)
    - [ ] `timestamp` (ISO 8601 format)
    - [ ] `session_id` (session identifier)

**Pass Criteria:** All messages logged with complete metadata

---

### F.3 Flagged Content Tests (25 min)

- [ ] Test flagging system:
  - [ ] Send message with inappropriate content
  - [ ] Verify message blocked
  - [ ] Open `student.json`
  - [ ] Verify flagged content tracked separately
  - [ ] Check `flaggedContent` array includes:
    - [ ] Original message text
    - [ ] Reason for flagging
    - [ ] Timestamp
- [ ] Test retrieval:
  - [ ] Call `getFlaggedContent(studentId)`
  - [ ] Verify returns all flagged messages
  - [ ] Verify sorted by timestamp (newest first)

**Pass Criteria:** Flagged content tracked, retrievable

---

### F.4 Export Conversations Tests (⚠️ UI Not Implemented - 25 min)

- [ ] **Skip UI testing** (export UI not implemented)
- [ ] Verify backend export function:
  - [ ] Check `lib/services/conversationService.ts`
  - [ ] Function exists: `exportConversations(studentId, format)`
  - [ ] Test JSON export:
    - [ ] Call `exportConversations("lucas", "json")`
    - [ ] Verify returns JSON string
    - [ ] Verify all messages included
  - [ ] Test CSV export (if implemented):
    - [ ] Call `exportConversations("lucas", "csv")`
    - [ ] Verify returns CSV string

**Pass Criteria:** Backend export works (UI pending)

---

## ✅ Section G: Definition of Done Checklist

**Total Tasks:** 10
**Estimated Time:** 1-2 hours (review only)
**Priority:** Critical (gates Phase 1 completion)

---

### G.1 Phase 1 Completion Checklist (60 min)

- [ ] **Criterion 1: All 17 acceptance criteria pass**
  - [ ] Review Section A (A.1 - A.17)
  - [ ] Verify all 51 tasks checked off
  - [ ] Document any failures

- [ ] **Criterion 2: All 4 user journeys validated**
  - [ ] Review Section B (B.1 - B.4)
  - [ ] Verify all 68 tasks checked off
  - [ ] Verify journeys complete end-to-end

- [ ] **Criterion 3: Technical tests pass**
  - [ ] Review Section C (C.1 - C.5)
  - [ ] Verify all 42 tasks checked off
  - [ ] Document performance metrics

- [ ] **Criterion 4: Performance benchmarks met**
  - [ ] Review Section D (D.1 - D.5)
  - [ ] Verify load times < targets
  - [ ] Verify token usage < budgets
  - [ ] Verify cost estimates accurate

- [ ] **Criterion 5: Accessibility standards achieved**
  - [ ] Review Section E (E.1 - E.8)
  - [ ] Verify WCAG AA compliance
  - [ ] Document any accessibility issues

- [ ] **Criterion 6: Browser compatibility confirmed**
  - [ ] Review Section E.7
  - [ ] Verify all 6 browsers tested
  - [ ] Document any browser-specific bugs

- [ ] **Criterion 7: Security tests pass**
  - [ ] Review Section F (F.1 - F.4)
  - [ ] Verify content filter robust
  - [ ] Verify all conversations logged

- [ ] **Criterion 8: Stakeholder demo successful**
  - [ ] Schedule demo with stakeholders
  - [ ] Prepare demo script (use Journey tests)
  - [ ] Record feedback
  - [ ] Document action items

- [ ] **Criterion 9: Code reviewed and approved**
  - [ ] Create pull request with all changes
  - [ ] Request review from team
  - [ ] Address all review comments
  - [ ] Obtain approval

- [ ] **Criterion 10: Documentation complete**
  - [ ] Verify all shard documents up to date
  - [ ] Verify all task files checked off
  - [ ] Create final summary report

**Pass Criteria:** All 10 criteria met

---

### G.2 Phase 2 Readiness Checklist (30 min)

- [ ] **Phase 1 complete**
  - [ ] All Section G.1 tasks checked off

- [ ] **User testing completed**
  - [ ] Recruit 5-10 students (ages 9-16)
  - [ ] Conduct moderated testing sessions
  - [ ] Collect feedback via surveys
  - [ ] Analyze results

- [ ] **Feedback incorporated**
  - [ ] Prioritize feedback items
  - [ ] Implement critical changes
  - [ ] Re-test affected features

- [ ] **Architecture validated for scale**
  - [ ] Review current mock data approach
  - [ ] Design database schema
  - [ ] Plan migration strategy

- [ ] **Budget approved**
  - [ ] Present cost estimates to stakeholders
  - [ ] Obtain budget approval for Phase 2
  - [ ] Plan for database hosting, auth services

- [ ] **Database schema designed**
  - [ ] Design `students` table
  - [ ] Design `conversations` table
  - [ ] Design `tasks` table
  - [ ] Design `bookings` table
  - [ ] Design relationships and indexes

- [ ] **Authentication strategy defined**
  - [ ] Choose auth provider (Auth0, Clerk, etc.)
  - [ ] Design parent/student login flow
  - [ ] Plan security measures

- [ ] **Deployment plan finalized**
  - [ ] Choose hosting (Vercel, AWS, etc.)
  - [ ] Plan CI/CD pipeline
  - [ ] Plan monitoring and logging

**Pass Criteria:** Ready to start Phase 2 development

---

## 📊 Summary Metrics

**Total Testing Tasks:** 224
**Estimated Total Time:** 30-35 hours
**Critical Priority:** 127 tasks
**High Priority:** 68 tasks
**Medium Priority:** 29 tasks

**Testing Breakdown:**
- Feature Acceptance: 51 tasks (8-10 hours)
- User Journeys: 68 tasks (6-8 hours)
- Technical Tests: 42 tasks (5-6 hours)
- Performance: 15 tasks (3-4 hours)
- Accessibility: 25 tasks (4-5 hours)
- Security: 13 tasks (2-3 hours)
- Definition of Done: 10 tasks (1-2 hours)

---

**Related Documents:**

- [Success Metrics](SUCCESS_METRICS.md) - Acceptance criteria reference
- [Implementation Roadmap Tasks](IMPLEMENTATION_ROADMAP_TASKS.md) - Development tasks
- [Missing Features Tasks](MISSING_FEATURES_TASKS.md) - Feature development tasks
- [Master Index](MASTER_INDEX.md) - Documentation hub
