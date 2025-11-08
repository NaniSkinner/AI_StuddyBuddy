# ❌ Missing Features - UI Components to Build

**Last Updated:** November 8, 2025
**Estimated Total Effort:** 4-6 weeks

This document provides detailed specifications for all incomplete features in Phase 1 MVP.

---

## Critical (Must Have for Phase 1)

### A. Tutor Booking Interface UI

**Status:** 🔴 Backend Complete, UI Missing
**Estimated Effort:** 2-3 days
**Priority:** HIGH

#### What Needs to Be Built

##### 1. Main Booking Modal Component

**File to Create:** `app/components/BookingInterface.tsx`

**Required Elements:**

```typescript
interface BookingInterfaceProps {
  studentId: string;
  suggestedTutor: Tutor;
  suggestedTopic: string;
  strugglingConcepts: string[];
  onClose: () => void;
  onBookingComplete: (bookingId: string) => void;
}
```

**UI Requirements:**

- Modal overlay with backdrop blur
- Tutor profile section:
  - Photo (or placeholder avatar)
  - Name and title
  - Specialties badges
  - Bio (2-3 sentences)
  - Success stats (e.g., "Helped 50+ students")
- Topic field (pre-filled, editable)
- Reason for booking (auto-populated with struggling concepts)
- Time slot picker:
  - Display available slots from `tutor.availableSlots`
  - Calendar-style or list view
  - Select preferred time(s)
- Additional notes textarea (optional)
- Action buttons:
  - "Request Session" (primary)
  - "Cancel" (secondary)
- Confirmation state:
  - Success message: "Booking request sent to [Tutor Name]!"
  - Show booking ID
  - Auto-close after 3 seconds

**Backend Integration:**

```typescript
// Use existing service
import { createBookingWithHandoff } from "@/lib/services/bookingService";

const handleSubmit = async () => {
  const booking = await createBookingWithHandoff(
    studentId,
    tutorId,
    topic,
    reason,
    strugglingConcepts,
    taskAttempts,
    conversationContext
  );
  // Display confirmation
  onBookingComplete(booking.id);
};
```

##### 2. Trigger Integration

**File to Modify:** `app/learn/page.tsx`

**Implementation:**

- Add state: `const [showBookingModal, setShowBookingModal] = useState(false)`
- Listen for struggle detection events
- Trigger modal when AI suggests booking
- Pass necessary props (student, tutor, topic, concepts)

##### 3. AI Response Integration

**File to Modify:** `lib/services/aiService.ts`

**Enhancement:**

- Detect when `determineIntervention()` returns type "tutor_suggestion"
- Include metadata in AI response to trigger booking UI
- Example response structure:

```typescript
{
  message: "I notice you've been working really hard on this...",
  action: {
    type: "suggest_booking",
    tutorId: "tutor-sarah-chen",
    topic: "Fractions",
    strugglingConcepts: ["Thirds", "Division"]
  }
}
```

**Design Specifications:**

- Follow doodle design system (border-2, rounded-2xl, sketch-button)
- Use student's AI color for primary button
- Animations: modal slide-in, calendar interactions
- Mobile responsive (max-w-2xl on desktop, full-width on mobile)

---

### B. Friend Connection UI Components

**Status:** 🔴 Backend Complete, UI Missing
**Estimated Effort:** 3-4 days
**Priority:** HIGH

#### What Needs to Be Built

##### 1. Friend List Component

**File to Create:** `app/components/social/FriendList.tsx`

**Features:**

- Display all connected friends
- Friend card showing:
  - Avatar (initial or photo)
  - Name and grade
  - Current subject + progress (e.g., "📚 Reading 68%")
  - Streak indicator (e.g., "🔥 3-day streak")
  - "Send message" button
  - Last active timestamp
- Empty state: "No friends yet! Add friends to study together 🤝"
- "Add Friend" button (opens friend search/request modal)

**Data Source:**

```typescript
import { getStudentById } from "@/lib/services/studentService";

// Get friend IDs from student.friendConnections
// Fetch each friend's data
// Display activity using current goal progress
```

##### 2. Message Selector Component

**File to Create:** `app/components/social/MessageSelector.tsx`

**Interface:**

```typescript
interface MessageSelectorProps {
  friendId: string;
  friendName: string;
  studentId: string;
  messagesSentToday: number;
  onClose: () => void;
  onMessageSent: () => void;
}
```

**UI Flow:**

1. **Message Type Selection:**

   - 3 cards with icons:
     - 🌟 Send Encouragement
     - 🎉 Share Your Progress
     - 🤝 Study Together Challenge
   - Click to select type

2. **Message Preview:**

   - AI-generated message displayed in preview bubble
   - Example messages:
     - Encouragement: "You're doing great! Keep up the good work! 💪"
     - Milestone: "I just finished my math session — how's your studying going?"
     - Challenge: "Want to race to finish our practice tasks today?"
   - "Regenerate" button (generates new message of same type)

3. **Send Confirmation:**
   - Daily limit counter: "2 messages left today"
   - Warning if at limit: "You've reached your daily limit (3/3)"
   - "Send Message" button (disabled if at limit)
   - Success: "Message sent to [Friend Name]! 📨"

**Backend Integration:**

```typescript
import {
  generateFriendMessage,
  sendMessage,
} from "@/lib/services/gamificationService";

// Generate message based on type
const message = await generateFriendMessage(studentId, friendId, messageType);

// Send message (checks 3/day limit)
const result = await sendMessage(studentId, friendId, message);
```

##### 3. Friend Request Manager

**File to Create:** `app/components/social/FriendRequestManager.tsx`

**Features:**

- **Search/Add Tab:**

  - Search students by name
  - Display search results
  - "Send Friend Request" button
  - Prevent duplicate requests

- **Pending Requests Tab:**

  - Incoming requests list
  - Accept / Decline buttons
  - Request timestamp

- **My Friends Tab:**
  - List of connected friends
  - Activity status
  - "Send Message" quick action

**Backend Integration:**

```typescript
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
} from "@/lib/services/gamificationService";
```

##### 4. Main App Integration

**File to Modify:** `app/learn/page.tsx`

**Implementation Options:**

**Option A: Sidebar Tab** (RECOMMENDED)

- Add "Friends" tab to right sidebar
- Toggle between Tasks and Friends views
- Icon: 👥 with notification badge for pending requests

**Option B: Top Navigation Tab**

- Add "Social" to TopBar navigation
- Dedicated page at `/social` route
- Full-width friend list and messaging interface

##### 5. Activity Feed (Optional Enhancement)

**File to Create:** `app/components/social/ActivityFeed.tsx`

**Shows:**

- Recent friend achievements
- Milestone celebrations
- Streak updates
- "Cheer on your friends!" CTA

**Design Specifications:**

- Doodle card style with playful borders
- Friend cards: rounded-xl, hover effects
- Message type icons with color coding:
  - Encouragement: purple
  - Milestone: green
  - Challenge: orange
- Limit counter visual: progress bar or emoji counter (3/3 ⭐⭐⭐)
- Empty states with friendly illustrations

**Achievement Integration:**

- Sending 5 messages unlocks "Social Butterfly" badge
- Trigger achievement check in message send handler

---

## Should Implement (Quality/Completeness)

### C. AI-Suggested Topic Switching Triggers

**Status:** 🟡 Component Exists, Not Triggered Proactively
**Estimated Effort:** 1-2 days
**Priority:** MEDIUM

#### Current State

- ✅ `TopicSwitcher.tsx` component built
- ✅ `AISuggestedSwitch` sub-component styled and functional
- ✅ `recommendationService.ts` has logic for cross-subject recommendations
- ❌ AI doesn't proactively suggest switches during conversation

#### What Needs to Be Implemented

##### 1. Detection Logic

**File to Modify:** `lib/services/aiService.ts`

**Add Function:**

```typescript
interface TopicSwitchSuggestion {
  shouldSuggest: boolean;
  suggestedSubject: string;
  suggestedGoalId: string;
  reason: string;
  currentSubject: string;
}

export function shouldSuggestTopicSwitch(
  student: Student,
  currentGoalId: string,
  conversationDuration: number // minutes in current session
): TopicSwitchSuggestion {
  const currentGoal = student.goals.find((g) => g.id === currentGoalId);
  if (!currentGoal)
    return {
      shouldSuggest: false,
      suggestedSubject: "",
      suggestedGoalId: "",
      reason: "",
      currentSubject: "",
    };

  // Trigger 1: Time-based (working on topic for 30+ minutes)
  if (conversationDuration >= 30) {
    const otherGoals = student.goals.filter((g) => g.id !== currentGoalId);
    if (otherGoals.length > 0) {
      const suggested = otherGoals[0];
      return {
        shouldSuggest: true,
        suggestedSubject: suggested.subject,
        suggestedGoalId: suggested.id,
        reason: `We've been doing ${currentGoal.subject} for a while.`,
        currentSubject: currentGoal.subject,
      };
    }
  }

  // Trigger 2: Progress-based (goal >85% complete)
  if (currentGoal.progress >= 85) {
    // Use recommendation service
    const recommendations = getSubjectRecommendations(student.id);
    if (recommendations.length > 0) {
      return {
        shouldSuggest: true,
        suggestedSubject: recommendations[0].subject,
        suggestedGoalId: recommendations[0].goalId,
        reason: recommendations[0].reason,
        currentSubject: currentGoal.subject,
      };
    }
  }

  // Trigger 3: Balance-based (one subject significantly ahead)
  const progressGap =
    Math.max(...student.goals.map((g) => g.progress)) -
    Math.min(...student.goals.map((g) => g.progress));
  if (progressGap > 30 && currentGoal.progress > 60) {
    const laggingGoal = student.goals.reduce((min, g) =>
      g.progress < min.progress ? g : min
    );
    return {
      shouldSuggest: true,
      suggestedSubject: laggingGoal.subject,
      suggestedGoalId: laggingGoal.id,
      reason: `Let's give ${laggingGoal.subject} some attention too!`,
      currentSubject: currentGoal.subject,
    };
  }

  return {
    shouldSuggest: false,
    suggestedSubject: "",
    suggestedGoalId: "",
    reason: "",
    currentSubject: "",
  };
}
```

##### 2. Integration in Chat Flow

**File to Modify:** `app/learn/page.tsx`

**Add State:**

```typescript
const [topicSwitchSuggestion, setTopicSwitchSuggestion] =
  useState<TopicSwitchSuggestion | null>(null);
const [sessionStartTime] = useState(Date.now());
```

**Check After Each AI Response:**

```typescript
const handleSendMessage = async (message: string) => {
  // ... existing send logic ...

  // After AI responds, check if should suggest switch
  const conversationDuration = (Date.now() - sessionStartTime) / 1000 / 60; // minutes
  const suggestion = shouldSuggestTopicSwitch(
    currentStudent,
    currentGoalId,
    conversationDuration
  );

  if (suggestion.shouldSuggest) {
    setTopicSwitchSuggestion(suggestion);
  }
};
```

**Display Suggestion:**

```tsx
{
  topicSwitchSuggestion && (
    <AISuggestedSwitch
      suggestedSubject={topicSwitchSuggestion.suggestedSubject}
      reason={topicSwitchSuggestion.reason}
      onAccept={() => {
        handleSwitchTopic(topicSwitchSuggestion.suggestedGoalId);
        setTopicSwitchSuggestion(null);
      }}
      onDecline={() => setTopicSwitchSuggestion(null)}
    />
  );
}
```

##### 3. Cooldown Logic

**Add to prevent suggestion spam:**

- Track last suggestion timestamp
- Don't suggest again within 15 minutes
- Store in session state or local storage

**User Experience:**

- Suggestion appears as a banner above chat input
- Student can accept (switches topic seamlessly) or decline
- Declined suggestions don't reappear in same session
- AI acknowledges switch: "Great! Let's work on [New Subject] now."

---

### D. Conversation Export UI for Parents/Tutors

**Status:** 🟡 Backend Ready, UI Missing
**Estimated Effort:** 1 day
**Priority:** MEDIUM

#### Current State

- ✅ `safetyService.ts` has `exportStudentConversations()`
- ✅ Conversation logging with timestamps
- ✅ Flagged content tracking
- ❌ No UI to access export functionality

#### What Needs to Be Implemented

##### 1. Export Button

**File to Modify:** `app/components/TopBar.tsx`

**Add to Navigation:**

```tsx
// In TopBar component
<motion.button
  onClick={() => setShowExportModal(true)}
  className="sketch-button--ghost px-4 py-2"
  whileHover={{ scale: 1.05 }}
>
  📥 Export Conversations
</motion.button>
```

##### 2. Export Modal Component

**File to Create:** `app/components/ExportConversationModal.tsx`

**Features:**

- **Date Range Selector:**
  - Start date and end date pickers
  - Presets: "Last 7 days", "Last 30 days", "All time"
- **Export Options:**

  - Format: JSON or CSV
  - Include flagged messages only (toggle)
  - Include AI responses (toggle)
  - Include session metadata (toggle)

- **Preview:**

  - Show count: "42 messages from 5 conversations"
  - List flagged items if any

- **Export Button:**
  - Downloads file to user's device
  - Filename: `student-[name]-conversations-[date].json`

**Backend Integration:**

```typescript
import { exportStudentConversations } from "@/lib/services/safetyService";

const handleExport = async () => {
  const logs = await exportStudentConversations(studentId);

  // Filter by date range
  const filtered = logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });

  // Filter by options
  const data = includeOnlyFlagged
    ? filtered.filter((log) => log.hasFlaggedContent)
    : filtered;

  // Format and download
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `student-${student.name}-conversations-${
    new Date().toISOString().split("T")[0]
  }.json`;
  a.click();
};
```

**Design Specifications:**

- Modal with max-w-lg
- Date pickers using HTML5 input type="date"
- Toggle switches with doodle styling
- Preview section with scroll
- Download icon: 📥
- Success toast: "Conversations exported successfully!"

---

## Nice to Have (Optional Enhancements)

### E. Advanced Bubble Animations

**Description:** Particle effects for celebrations
**Estimated Effort:** 2-3 days
**Priority:** LOW

**Current State:**

- Basic animations implemented (idle, thinking, speaking, celebrating)
- Confetti component exists for achievements

**Possible Enhancements:**

- Particle burst on bubble click
- Trail effects during animations
- Sparkles on hover
- More elaborate celebration sequences

---

### F. Sound Effects

**Description:** Audio feedback for interactions
**Estimated Effort:** 1-2 days
**Priority:** LOW

**Sounds:**

- Achievement unlock: triumphant chord
- Streak milestone: fire crackling
- Correct answer: pleasant ding
- Encouragement: uplifting chime
- Button clicks: subtle pop

**Implementation:**

- Use Web Audio API or Howler.js
- Mute toggle in settings
- Low file sizes (<50KB each)

---

### G. Dark Mode Support

**Description:** Alternative color scheme for low-light environments
**Estimated Effort:** 2-3 days
**Priority:** LOW

**Requirements:**

- Toggle in TopBar or settings
- Dark variants for all components
- Update doodle colors (darker backgrounds, lighter text)
- Maintain accessibility (WCAG AA contrast ratios)
- Persist preference

---

### H. Mobile Responsive Optimization

**Description:** Enhanced mobile experience
**Estimated Effort:** 3-5 days
**Priority:** MEDIUM

**Current State:**

- Basic responsiveness exists
- Some components may not be optimal on small screens

**Improvements:**

- Collapsible sidebars on mobile
- Bottom navigation for mobile
- Touch-friendly button sizes (min 44x44px)
- Swipe gestures for navigation
- Optimized chat input for mobile keyboards

---

### I. Analytics Dashboard

**Description:** Admin view for monitoring metrics
**Estimated Effort:** 5-7 days (Phase 2 feature)
**Priority:** PHASE 2

**Features:**

- Retention rate visualization
- Churn risk overview
- Engagement metrics
- Token usage and costs
- Student activity heatmaps

**Target Audience:** Tutors, administrators, product team

---

## Summary

### Critical Path (Must Complete for Phase 1)

1. **Tutor Booking Interface** - 2-3 days
2. **Friend Connection UI** - 3-4 days
3. **AI Topic Switch Triggers** - 1-2 days
4. **Conversation Export UI** - 1 day

**Total Minimum Effort:** 7-10 days (1.5-2 weeks)

### With Testing

- Add 1 week for comprehensive testing
- **Total:** 4-5 weeks to Phase 1 completion

---

**Related Documents:**

- [Implemented Features](IMPLEMENTED_FEATURES.md) - What's already built
- [Implementation Roadmap](IMPLEMENTATION_ROADMAP.md) - Week-by-week plan
- [Master Index](MASTER_INDEX.md) - Complete documentation hub
