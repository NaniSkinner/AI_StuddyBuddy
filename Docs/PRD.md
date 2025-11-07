# 🧠 AI Study Companion

**Gauntlet Project | Phase 1 PRD v2**

---

## 📖 Document Information

**Version:** 2.0  
**Last Updated:** November 6, 2025  
**Status:** Ready for Development  
**Project Phase:** MVP (Phase 1)

---

## 🎯 Executive Summary

The **AI Study Companion** is a persistent, context-aware tutoring assistant designed to live between human tutoring sessions. It remembers lessons, assigns adaptive practice, answers questions conversationally, and nudges students to continue learning after goals are achieved.

### Primary Objective

Improve **student retention and engagement**, reducing the 52% churn rate seen after single-goal completion.

### Target Users

K-12 students (ages 9-16) who receive periodic human tutoring and need continuous learning support between sessions.

---

## 👥 User Profiles

| User      | Age | Grade | Focus Areas                       | Engagement Pattern                   | Notes                                                 |
| --------- | --- | ----- | --------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| **Lucas** | 9   | 4th   | Elementary Math, Science          | High engagement, frequent questions  | Needs friendly tone, short sentences, visual feedback |
| **Eva**   | 12  | 7th   | Reading, Writing, History         | Moderate engagement, self-reflective | Balanced tone, encourages metacognition               |
| **Pat**   | 16  | 11th  | SAT Prep, College Essays, AP Calc | Goal-driven, mature                  | Academic tone, challenge thinking, planning focus     |
| **Mia**   | 14  | 9th   | Algebra II, Biology               | Low engagement, early churn risk     | Showing retention issues (2 sessions in Week 1)       |

### Tutor Profiles (Mock Data)

- **Dr. Sarah Chen** - Math & Science specialist
- **Mr. James Rodriguez** - English & SAT Prep
- **Ms. Aisha Patel** - STEM subjects (Algebra, Biology, Chemistry)

### Mock Data Scope

- **4 student profiles**
- **3 tutors**
- **6 sessions per student** (spanning 14 days)
- **Full dialogue transcripts** for each session
- **Simulated progress tracking** and timestamps

---

## 🏗️ System Architecture

### Technology Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (chat bubble effects)
- **AI Integration:** OpenAI API (GPT-4)
- **State Management:** React Context or Zustand
- **Data Storage:** Local JSON files (Phase 1)
- **Deployment:** Local development / Vercel for demo

### Architecture Principles (Phase 2 Foundation)

1. **Data Access Layer Pattern** - Clean service APIs (`studentService.js`, `tutorService.js`)
2. **TypeScript from Day 1** - Type safety for all data models
3. **Environment Variables** - `.env.local` for API keys and config
4. **Modular Component Architecture** - Separation of UI and business logic
5. **Mock API Response Format** - Structure JSON to match future REST API
6. **Authentication Stub** - Simple login against mock data (ready for real auth)

### Context Window Strategy

- **Rolling Window:** Last 10-15 messages in full context
- **Summarized History:** Older messages compressed ("Last week we covered fractions...")
- **Age-Specific System Prompts:** Persistent tone/complexity settings per user
- **Token Management:** Hybrid approach to balance cost and continuity

---

## 💡 Core Features

### 1. Persistent AI Memory

**Description:** The AI remembers each student's past lessons, completed goals, and knowledge gaps.

**Technical Implementation:**

- Conversation history stored in local JSON
- Rolling context window (last 10-15 messages)
- Automatic summarization of older sessions
- Quick recall interface: "What did we study last time?"

**Age Adaptation:**

- **Ages 9-11:** Simple vocabulary, short sentences, high encouragement
- **Ages 12-14:** Balanced tone, self-reflection prompts
- **Ages 15-16:** Academic tone, challenge critical thinking

---

### 2. Adaptive Learning Engine

**Description:** Assigns personalized practice tasks based on progress trends and learning patterns.

**Task Types:**

1. **Multiple Choice Quizzes** - Quick knowledge checks
2. **Open-Ended Problems** - AI-graded responses with hints
3. **Real-World Practice** - "Try this at home" suggestions (e.g., "Count objects in groups of 3")

**Task Assignment Logic:**

- Analyzes struggle points from session transcripts
- Adjusts difficulty based on success rate
- Generates both predefined and AI-created problems

**Cross-Subject Recommendations (Hybrid Approach):**

- **Rule-Based Triggers:**
  - SAT Complete → College Essays, Study Skills
  - Chemistry → Physics, Biology
  - Algebra I → Geometry, Algebra II
- **AI-Inferred:** Detects student interests from conversation context
- **Student Confirmation:** AI suggests, student approves subject addition

**Progress Tracking Granularity:**

- **Ages 9-12:** Sub-concept level with visual indicators
  - Example: "Halves: ✓, Thirds: ⚠️, Quarters: ✓"
- **Ages 13-16:** Topic-level percentages
  - Example: "Fractions: 60%, Algebra: 75%"

**Subject Limits:** Maximum 4 active subjects per student

---

### 3. Retention & Motivation System

#### Churn Detection

- **Risk Indicator:** Students with <3 sessions by Day 7
- **Mock Implementation:** Simulated timestamps and session counts
- **Monitoring Dashboard:** Admin view to trigger retention states manually

#### Nudge System

**Delivery Methods:**

1. **Simulated Notifications** - Shown when app opens
2. **In-App Popup** - Appears during natural break points

**Nudge Strategy:**

- **Priority Rule:** Celebrate wins first, then encourage catch-up
- **Example Flow:**
  1. "Great job on Science! You're 75% complete! 🎉"
  2. "Math needs a little love - want to do a quick practice session?"

**Frequency:** Maximum 1 nudge per day per subject

#### Streak System

**Tracking:**

- **Login-based:** Consecutive days accessing the app
- **Practice-based:** Consecutive days completing tasks

**Mechanics:**

- Display current streak and longest streak
- **Streak Breaks:** Encourage students to beat their previous record
- **Buffer Days:** None (builds urgency)

---

### 4. Gamification System

#### Chat Bubble Animation

**Interaction States:**

1. **Idle:** Gentle pulsing glow
2. **Click:** Satisfying "burst" animation
3. **AI Thinking:** Breathing effect with color transitions
4. **New Message:** Bounce animation

**Technology:** Framer Motion + Canvas for dynamic color control

#### Color Customization

- **First Login:** Student picks their AI bubble color
- **Available Palette:** 8-10 vibrant options
- **Persistence:** Color saved to student profile

#### Achievement Badges (6 Total)

| Badge | Name             | Trigger                      | Description           |
| ----- | ---------------- | ---------------------------- | --------------------- |
| 🎯    | First Steps      | Complete first conversation  | Welcome to learning!  |
| 🔥    | 3-Day Streak     | Study 3 consecutive days     | Consistency is key!   |
| 🎓    | Topic Master     | Reach 90% on any topic       | You've mastered this! |
| ❓    | Curious Mind     | Ask 10 questions             | Never stop wondering! |
| 🤝    | Social Butterfly | Send 5 friend messages       | Learning together!    |
| 🏆    | Streak Breaker   | Beat previous longest streak | New personal record!  |

**Visual Display:** Badge grid in profile section, animated unlock sequence

---

### 5. Human Tutor Integration

#### Session Reference System

- AI references specific moments from past sessions
- Example: "Remember when Dr. Chen explained stoichiometry with the cookie recipe?"

#### Struggle Detection & Handoff

**Trigger Conditions:**

- Concept repeated 3+ times with incorrect answers
- Student explicitly says "I don't understand"
- Frustration detected in conversation tone

**Booking Flow:**

1. AI suggests: "It looks like stoichiometry is tricky - want me to set up a review with Ms. Patel?"
2. Student confirms
3. **Mock Booking Interface** appears with:
   - Available time slots (simulated)
   - Tutor profile
   - Topic pre-filled
4. "Booking Request" logged in system

#### Handoff Notes

**Auto-Generated by AI:**

```
Student: Lucas (Age 9)
Struggle Topic: Fractions (specifically thirds)
Attempts: 4 practice problems, 2 incorrect
Context: Understands halves and quarters well
Suggested Focus: Visual models for thirds, pizza/pie analogies
```

---

### 6. Social "Buddy Connection" Feature

#### Functionality

- Students connect with friends also using the platform
- Send encouraging messages between study sessions

#### Safety Constraints

1. **AI-Generated Messages Only** - No free-form chat
2. **Positive Content Whitelist** - Only encouraging, learning-focused messages
3. **Frequency Limit:** Maximum 3 messages per day per friend
4. **Content Examples:**
   - "I just finished my math session — how's your studying going?"
   - "You're doing great! Keep up the good work! 💪"
   - "Want to race to finish our practice tasks today?"

#### Privacy Boundaries

- No personal information sharing
- No open messaging
- Messages reviewed by AI for tone before sending

---

### 7. Safety & Content Moderation

#### Content Filtering

**Blocked Topics:**

- Inappropriate or unsafe content
- Personal information sharing (addresses, phone numbers)
- Off-platform communication attempts

**Homework Helper Mode:**

- **Hints Over Answers:** AI guides thinking rather than giving solutions
- **Example:**
  - ❌ "The answer is 42"
  - ✓ "What happens if you multiply 6 by 7? Think about your times tables!"

#### Conversation Logging

- All conversations saved for parent/tutor review
- Timestamped transcripts with flagged concerns
- Export functionality for reports

---

## 🎨 User Interface Components

### 1. Chat Interface

**Layout:**

- Center: Scrollable conversation history
- Right Sidebar: "Your Tasks" section
- Top Bar: Progress indicator + streak counter
- Bottom: Message input + quick action buttons

**Task Sidebar:**

- **Incomplete Tasks:** Highlighted in amber/yellow
- **Completed Tasks:** Gray with checkmark
- **New Tasks:** Pulsing blue border
- Click to open task details in chat

### 2. Progress Card (Embedded)

**Display Location:** Top of chat interface (collapsible)

**Information Shown:**

```
📊 Your Progress
🎯 Elementary Math: 65% ━━━━━━━━░░ (streak: 3 days)
🧪 Science: 40% ━━━━░░░░░░ (new!)
✓ Halves ⚠️ Thirds ✓ Quarters
```

### 3. Onboarding Flow

**First-Time User Journey:**

1. **Welcome Screen:** AI introduces itself with friendly animation
2. **Color Picker:** "Choose your AI's color!"
3. **Quick Tutorial:**
   - "Click the bubble to chat"
   - "Check your tasks here →"
   - "Track your progress at the top"
4. **First Conversation:** AI asks about learning goals

**Returning User:**

- Greeting: "Nice to see you again, Lucas! Ready to continue?"
- Can dismiss greeting to view dashboard

### 4. Topic Switcher

**User-Initiated:**

- Student types: "Let's work on Science now"
- Dropdown menu in UI to select active subject

**AI-Suggested:**

- AI: "We've been doing Math for a while. Want to switch to Science?"
- Student confirms or declines

### 5. Mock Booking Interface

**Components:**

- Tutor photo + bio
- Calendar view with available slots (simulated)
- Topic field (pre-filled from context)
- Reason/notes textarea
- "Request Session" button
- Confirmation message: "Booking request sent to Dr. Chen!"

---

## 📊 Data Schema

### Student Model

```typescript
interface Student {
  id: string;
  name: string;
  age: number;
  grade: number;
  email?: string; // For Phase 2

  // Learning Profile
  goals: Goal[]; // Max 4
  sessions: Session[];
  taskHistory: Task[];

  // Engagement Metrics
  streaks: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  achievements: string[]; // Badge IDs
  churnRisk: boolean;

  // Preferences
  preferences: {
    aiColor: string;
    notificationEnabled: boolean;
    reminderTime?: string;
  };

  // Social
  friendConnections: string[]; // Student IDs
  messagesSentToday: number;

  // Metadata
  createdAt: string;
  lastLoginAt: string;
}

interface Goal {
  id: string;
  subject: string;
  targetCompletion: string; // ISO date
  progress: number; // 0-100
  topics: Topic[];
}

interface Topic {
  name: string;
  progress: number; // 0-100
  subConcepts?: SubConcept[];
  lastPracticed: string;
}

interface SubConcept {
  name: string;
  mastered: boolean;
  attemptsCorrect: number;
  attemptsTotal: number;
}
```

### Session Model

```typescript
interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  date: string; // ISO datetime
  duration: number; // minutes

  transcript: Message[];
  topicsCovered: TopicCovered[];
  tutorNotes: string;

  // Metadata
  studentEngagement: "high" | "medium" | "low";
  strugglingConcepts: string[];
}

interface Message {
  speaker: "student" | "tutor";
  message: string;
  timestamp: string;
}

interface TopicCovered {
  topic: string;
  subConcepts: string[];
  strugglingPoints: string[];
  masteryLevel: number; // 0-100
}
```

### Task Model

```typescript
interface Task {
  id: string;
  studentId: string;
  type: "multiple_choice" | "open_ended" | "real_world";
  subject: string;
  topic: string;

  content: {
    question: string;
    options?: string[]; // For multiple choice
    correctAnswer?: string;
    hints: string[];
  };

  status: "incomplete" | "complete" | "skipped";
  attempts: number;
  completedAt?: string;

  createdAt: string;
  dueDate?: string;
}
```

### Tutor Model

```typescript
interface Tutor {
  id: string;
  name: string;
  specialties: string[];
  bio: string;
  photoUrl?: string;

  students: string[]; // Student IDs
  availableSlots?: TimeSlot[]; // For booking
}

interface TimeSlot {
  datetime: string;
  duration: number;
  available: boolean;
}
```

### Booking Request Model

```typescript
interface BookingRequest {
  id: string;
  studentId: string;
  tutorId: string;
  requestedTopic: string;
  reason: string;
  preferredTimes: string[];

  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;

  // AI-generated handoff notes
  handoffNotes: {
    strugglingConcepts: string[];
    attemptsSummary: string;
    suggestedFocus: string;
  };
}
```

---

## 📈 Success Metrics

### Primary Metrics

| Metric                              | Baseline | Phase 1 Goal  | Measurement                                              |
| ----------------------------------- | -------- | ------------- | -------------------------------------------------------- |
| Retention rate post-goal completion | 48%      | 68% (+20%)    | % of students who continue after completing initial goal |
| Avg. sessions per user (30 days)    | 2.1      | 3.0+          | Mean sessions across all active students                 |
| Churn risk mitigation               | N/A      | 30% reduction | % of at-risk students who reach 3+ sessions              |

### Secondary Metrics

| Metric                     | Goal              | Measurement                             |
| -------------------------- | ----------------- | --------------------------------------- |
| Learning improvement score | +15%              | Time spent × correct answer rate        |
| Engagement (messages sent) | Increase WoW      | Total AI interactions per week          |
| Friend connections made    | 25% of users      | % of students with ≥1 friend connection |
| Task completion rate       | 70%+              | Completed tasks / assigned tasks        |
| Streak achievement         | 40% achieve 3-day | % of students with ≥3 day streak        |

### Mock Metrics Simulation

**Learning Improvement Score Formula:**

```
Score = (Time Spent in Minutes × Correct Answer Rate) / Total Tasks
Improvement = (Current Score - Initial Score) / Initial Score × 100
```

**Simulated Data Points:**

- Week 1 baseline scores per student
- Progressive improvement over 14-day period
- Variability based on engagement patterns

---

## 🚀 Phase 1 MVP Deliverables

### ✅ Core Functionality

- [x] Mock user data (4 student profiles, 3 tutors, 24 total sessions)
- [x] Persistent AI chat with conversation recall
- [x] Adaptive task generation (mixed types)
- [x] Progress tracking (age-appropriate granularity)
- [x] Streak system (dual-tracking: login + practice)
- [x] Friend connection system (AI-generated messages, 3/day limit)

### ✅ Gamification

- [x] Animated chat bubble (Framer Motion: burst + breathing)
- [x] Color picker (first login personalization)
- [x] 6 achievement badges with unlock animations
- [x] Progress visualization (embedded card)

### ✅ Retention Features

- [x] Churn detection (simulated timestamps)
- [x] Nudge system (popup + simulated notifications)
- [x] Cross-subject recommendations (hybrid approach)
- [x] Celebrate-first encouragement logic

### ✅ Safety & Integration

- [x] Content filtering (blocklist + homework helper mode)
- [x] Conversation logging (parent/tutor review)
- [x] Mock tutor booking interface
- [x] AI-generated handoff notes

### ✅ User Experience

- [x] Onboarding flow (intro + color picker + tutorial)
- [x] Task sidebar (color-coded incomplete tasks)
- [x] Topic switcher (user-initiated + AI-suggested)
- [x] Returning user greeting

### ⚠️ Optional (Time Permitting)

- [ ] Separate analytics dashboard (deprioritized for Phase 1)
- [ ] Parent/tutor portal (Phase 2)
- [ ] Mobile responsive optimization

---

## 🔮 Phase 2 Vision

### Enhanced Features

- **Real Backend Integration:** Firebase/Supabase with user authentication
- **Live Tutor Chat:** Real-time messaging with human tutors
- **Advanced Gamification:** Avatar system, XP points, leaderboards
- **Parent Portal:** Progress reports, conversation review, booking management
- **AI-Driven Path Recommendations:** Machine learning for optimal learning sequences
- **Mobile App:** React Native/Expo for iOS/Android

### Data Migration

- JSON files → PostgreSQL/Firestore
- Service layer remains unchanged (clean migration)
- Add API endpoints with existing data structure

### Scale Considerations

- Multi-tenancy for tutoring organizations
- Real-time synchronization across devices
- Analytics pipeline for retention modeling
- A/B testing framework for nudge strategies

---

## 🎬 Example User Journeys

### Journey 1: Lucas's First Session

1. **Login Screen:** "Welcome! Let's get started!"
2. **AI Introduction:** Friendly animated bubble appears
3. **Color Picker:** Lucas chooses bright blue
4. **Tutorial:** Quick walkthrough of interface
5. **First Chat:**
   - AI: "Hi Lucas! I'm your study buddy! What did you work on with Dr. Chen?"
   - Lucas: "Fractions!"
   - AI: "Awesome! Want to practice some more fractions today?"
6. **Task Assignment:** AI generates 3 visual fraction problems
7. **Progress Update:** "Great job! You got 2 out of 3! Let's try one more..."

### Journey 2: Mia's Retention Nudge

**Day 6 - Mia hasn't logged in since Day 2**

1. **Simulated Notification:** "Hey Mia! Missing you! 😊"
2. **Login:** Mia opens app
3. **Popup Nudge:**
   - "You're so close to a 3-day streak!"
   - "Want to do a quick Algebra problem? Just 5 minutes!"
4. **Quick Win:** Mia completes one task
5. **Celebration:** "Yes! Day 3 streak unlocked! 🔥"
6. **Badge Earned:** "3-Day Streak" achievement appears

### Journey 3: Pat's Subject Expansion

1. **Goal Completed:** SAT Math section reaches 95%
2. **AI Suggestion:**
   - "Amazing work on SAT Math! 🎉"
   - "Since you're crushing it, want to add College Essays to your goals?"
3. **Pat Confirms:** "Yes, let's do it"
4. **New Goal Created:** "College Essays" added (max 4 subjects)
5. **First Task:** AI assigns: "Write a 100-word reflection on a challenge you've overcome"

### Journey 4: Eva's Tutor Booking

1. **Struggling Moment:** Eva gets 3rd question wrong about metaphors
2. **AI Detection:** "Metaphors are tricky! Let's try a different approach..."
3. **After 4th Attempt:** "Want me to schedule time with Mr. Rodriguez? He's great at explaining this!"
4. **Eva Agrees:** "Yes please"
5. **Booking Interface:** Calendar appears with Mr. Rodriguez's slots
6. **Confirmation:** "Booking sent! Mr. Rodriguez will review your practice and help with metaphors"
7. **Handoff Note Generated:** AI summarizes struggle points for tutor

---

## 📝 Development Notes

### Environment Setup

```bash
# Package Manager: Bun (https://bun.sh)
# Install dependencies: bun install
# Run dev server: bun run dev

# Required environment variables
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_NAME="AI Study Companion"
NEXT_PUBLIC_MAX_SUBJECTS=4
NEXT_PUBLIC_MAX_FRIEND_MESSAGES=3
```

### Mock Data Location

```
/data
  /students
    - lucas.json
    - eva.json
    - pat.json
    - mia.json
  /tutors
    - sarah-chen.json
    - james-rodriguez.json
    - aisha-patel.json
  /sessions
    - lucas-sessions.json (6 sessions)
    - eva-sessions.json (6 sessions)
    - pat-sessions.json (6 sessions)
    - mia-sessions.json (6 sessions)
```

### Key Libraries

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "framer-motion": "^10.0.0",
    "openai": "^4.0.0",
    "zustand": "^4.4.0",
    "tailwindcss": "^3.3.0"
  }
}
```

### Service Layer Structure

```
/lib
  /services
    - studentService.ts
    - tutorService.ts
    - sessionService.ts
    - taskService.ts
    - aiService.ts
  /utils
    - dateUtils.ts
    - progressCalculator.ts
    - contentFilter.ts
```

---

## ✅ Acceptance Criteria

### Must Have (Phase 1)

- [ ] All 4 student profiles load correctly with complete mock data
- [ ] AI maintains conversation context for at least 10 messages
- [ ] Age-appropriate tone adjustment works for all age groups
- [ ] Task generation produces all 3 task types correctly
- [ ] Streak counter updates accurately based on activity
- [ ] Color picker saves preference and applies to chat bubble
- [ ] All 6 achievement badges can be earned and display correctly
- [ ] Churn risk detection flags Mia as at-risk by Day 7
- [ ] Nudge system delivers 1 popup when appropriate
- [ ] Friend messages generate positive content only (3/day limit enforced)
- [ ] Tutor booking creates mock request with handoff notes
- [ ] Content filter blocks inappropriate topics
- [ ] Homework helper gives hints instead of direct answers
- [ ] Progress tracking shows correct granularity per age group
- [ ] Topic switcher allows manual and AI-suggested transitions
- [ ] Onboarding flow completes for first-time user
- [ ] Returning user sees greeting but can dismiss

### Nice to Have

- [ ] Conversation export for parent review
- [ ] Advanced bubble animations (particle effects)
- [ ] Sound effects for achievements
- [ ] Dark mode support

---

## 📞 Stakeholder Review Points

### Demo Focus Areas

1. **Retention Impact:** Show Mia's churn risk detection → nudge → re-engagement
2. **Age Adaptation:** Demonstrate tone differences between Lucas and Pat
3. **Task Variety:** Show all 3 task types in action
4. **Gamification:** Live demo of streak system and badge unlock
5. **Safety:** Demonstrate content filtering and homework helper mode
6. **Tutor Integration:** Walk through booking flow and handoff notes

### Questions to Address

- How scalable is the context window approach?
- What's the cost per student per month with OpenAI?
- How will real session data integrate in Phase 2?
- What's the timeline for backend migration?

---

## 🏁 Success Definition

**Phase 1 is successful if:**

1. All core features function as specified in acceptance criteria
2. Demo effectively communicates retention strategy to stakeholders
3. Architecture supports clean migration to Phase 2 backend
4. Mock data realistically simulates 14-day user journeys
5. Gamification elements enhance (not distract from) learning experience

**Phase 2 greenlight criteria:**

- Positive stakeholder feedback on retention features
- Clear technical path to scale (backend architecture approved)
- Budget allocated for OpenAI API costs and development resources

---

**End of PRD v2**
