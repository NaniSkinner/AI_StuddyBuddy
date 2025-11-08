# 🗺️ Implementation Roadmap - AI Study Companion

**Last Updated:** November 8, 2025
**Total Estimated Time:** 4-6 weeks

This document provides a detailed week-by-week plan to complete Phase 1 MVP.

---

## Overview

### Current Status: 80-85% Complete

**Remaining Work:**

- ✅ All backend services complete
- ❌ 4 critical UI components missing
- ⚠️ 1 component needs trigger integration

**Timeline:**

- **Minimum Viable:** 4-5 weeks (critical features + testing)
- **With Enhancements:** 6-8 weeks (optional features included)

---

## Priority 1: Critical UI Components (3-4 weeks)

### Week 1: Tutor Booking Interface

**Goal:** Complete booking flow from AI suggestion to booking request

#### Days 1-2: Build BookingInterface Modal Component

**Tasks:**

- [ ] Create `app/components/BookingInterface.tsx`
- [ ] Build modal shell with backdrop blur
- [ ] Implement tutor profile section:
  - Photo/avatar display
  - Name and title
  - Specialties badges
  - Bio (2-3 sentences)
  - Success stats display
- [ ] Add topic field (pre-filled, editable)
- [ ] Implement reason for booking section (auto-populated with struggling concepts)
- [ ] Build time slot picker UI:
  - Display available slots from `tutor.availableSlots`
  - Calendar-style or list view
  - Time slot selection logic
- [ ] Add additional notes textarea (optional)
- [ ] Implement action buttons (Request Session, Cancel)
- [ ] Build confirmation state with success message

**Integration Code:**

```typescript
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
  onBookingComplete(booking.id);
};
```

**Design Specs:**

- Doodle design system (border-2, rounded-2xl, sketch-button)
- Student's AI color for primary button
- Modal slide-in animation
- Mobile responsive (max-w-2xl desktop, full-width mobile)

#### Day 3: Integrate with Struggle Detection

**Tasks:**

- [ ] Modify `app/learn/page.tsx`:
  - Add state: `const [showBookingModal, setShowBookingModal] = useState(false)`
  - Implement trigger logic
  - Wire up event listeners
- [ ] Modify `lib/services/aiService.ts`:
  - Detect `determineIntervention()` type "tutor_suggestion"
  - Add metadata to AI response
  - Structure action payload
- [ ] Test intervention → booking flow:
  - Simulate struggle scenarios
  - Verify modal triggers correctly
  - Confirm data passes through

**Response Structure:**

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

#### Day 4: Polish and Testing

**Tasks:**

- [ ] Add animations and transitions:
  - Modal entrance/exit
  - Calendar interactions
  - Success confirmation fade
- [ ] Mobile responsive adjustments:
  - Test on various screen sizes
  - Optimize touch targets
  - Adjust layout for small screens
- [ ] Edge case handling:
  - No available time slots
  - Network errors
  - Invalid inputs
- [ ] End-to-end testing:
  - Complete booking flow
  - Verify booking request creation
  - Test cancellation

**Deliverable:** ✅ Complete booking flow functional

---

### Week 2-3: Friend Connection UI (10 days)

**Goal:** Complete social feature with friend list, messaging, and requests

#### Days 1-2: FriendList Component

**Tasks:**

- [ ] Create `app/components/social/FriendList.tsx`
- [ ] Build friend card component:
  - Avatar (initial or photo)
  - Name and grade display
  - Current subject + progress (e.g., "📚 Reading 68%")
  - Streak indicator (e.g., "🔥 3-day streak")
  - "Send message" button
  - Last active timestamp
- [ ] Implement data fetching:
  - Get friend IDs from `student.friendConnections`
  - Fetch each friend's profile
  - Display activity using current goal progress
- [ ] Add empty state:
  - "No friends yet! Add friends to study together 🤝"
  - "Add Friend" button
- [ ] Style with doodle design system
- [ ] Add hover effects and animations

#### Days 3-4: MessageSelector Component

**Tasks:**

- [ ] Create `app/components/social/MessageSelector.tsx`
- [ ] Build message type selection UI:
  - 3 cards with icons:
    - 🌟 Send Encouragement
    - 🎉 Share Your Progress
    - 🤝 Study Together Challenge
  - Click to select type
- [ ] Implement message preview:
  - AI-generated message in preview bubble
  - "Regenerate" button
  - Sample messages for each type
- [ ] Add send confirmation:
  - Daily limit counter: "2 messages left today"
  - Warning at limit: "You've reached your daily limit (3/3)"
  - "Send Message" button (disabled at limit)
  - Success message: "Message sent to [Friend Name]! 📨"
- [ ] Integrate backend:

```typescript
import {
  generateFriendMessage,
  sendMessage,
} from "@/lib/services/gamificationService";

const message = await generateFriendMessage(studentId, friendId, messageType);
const result = await sendMessage(studentId, friendId, message);
```

#### Days 5-6: FriendRequestManager Component

**Tasks:**

- [ ] Create `app/components/social/FriendRequestManager.tsx`
- [ ] Build Search/Add Tab:
  - Search input for student names
  - Display search results
  - "Send Friend Request" button
  - Prevent duplicate requests
- [ ] Build Pending Requests Tab:
  - List incoming requests
  - Accept / Decline buttons
  - Request timestamp display
- [ ] Build My Friends Tab:
  - Connected friends list
  - Activity status
  - "Send Message" quick action
- [ ] Integrate backend:

```typescript
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
} from "@/lib/services/gamificationService";
```

#### Days 7-8: Main App Integration

**Tasks:**

- [ ] Modify `app/learn/page.tsx`:
  - Add "Friends" tab to right sidebar
  - Toggle between Tasks and Friends views
  - Icon: 👥 with notification badge for pending requests
- [ ] Wire up all interactions:
  - Friend list → Message selector
  - Friend requests → Accept/Decline
  - Message sent → Achievement check
- [ ] Implement achievement integration:
  - Trigger "Social Butterfly" badge check
  - Show unlock notification
  - Update badge collection
- [ ] Test complete flow:
  - Send friend request
  - Accept request
  - Send messages (verify 3/day limit)
  - Unlock achievement

#### Days 9-10: Testing and Polish

**Tasks:**

- [ ] Message limit enforcement UI:
  - Visual counter display
  - Disabled state at limit
  - Reset at midnight (timezone aware)
- [ ] Loading states:
  - Skeleton loaders for friend cards
  - Spinner for message generation
  - Progress indicator for friend requests
- [ ] Error handling:
  - Network failures
  - Friend not found
  - Message generation errors
- [ ] Accessibility:
  - Keyboard navigation
  - Screen reader labels
  - Focus management
- [ ] Mobile responsive:
  - Touch-friendly buttons
  - Optimized layout
  - Swipe gestures (optional)

**Design Specs:**

- Doodle card style with playful borders
- Friend cards: rounded-xl, hover effects
- Message type icons with color coding:
  - Encouragement: purple
  - Milestone: green
  - Challenge: orange
- Limit counter: emoji visual (3/3 ⭐⭐⭐)

**Deliverable:** ✅ Complete social feature functional

---

### Week 4: AI Topic Switching + Conversation Export

**Goal:** AI proactively suggests topic switches, parents can export conversations

#### Days 1-2: Topic Switch Triggers

**Tasks:**

- [ ] Add detection logic to `lib/services/aiService.ts`:

```typescript
export function shouldSuggestTopicSwitch(
  student: Student,
  currentGoalId: string,
  conversationDuration: number
): TopicSwitchSuggestion {
  // Trigger 1: Time-based (30+ minutes)
  // Trigger 2: Progress-based (>85% complete)
  // Trigger 3: Balance-based (progress gap >30%)
}
```

- [ ] Modify `app/learn/page.tsx`:
  - Add state for switch suggestion
  - Track session start time
  - Check after each AI response
  - Display `AISuggestedSwitch` component
- [ ] Implement cooldown logic:
  - Track last suggestion timestamp
  - Don't suggest within 15 minutes
  - Store in session state/local storage
- [ ] Test all three triggers:
  - 30-minute session
  - Goal at 90% progress
  - Imbalanced progress (one subject 40% ahead)

**User Flow:**

1. AI detects trigger condition
2. Suggestion banner appears above chat input
3. Student accepts → topic switches seamlessly
4. Student declines → suggestion dismissed (doesn't reappear)
5. AI acknowledges switch: "Great! Let's work on [New Subject] now."

#### Days 3-4: Conversation Export UI

**Tasks:**

- [ ] Modify `app/components/TopBar.tsx`:
  - Add "📥 Export Conversations" button
  - Wire up to show export modal
- [ ] Create `app/components/ExportConversationModal.tsx`:
  - Date range selector (start/end dates)
  - Presets: "Last 7 days", "Last 30 days", "All time"
  - Export options (toggles):
    - Format: JSON or CSV
    - Include flagged messages only
    - Include AI responses
    - Include session metadata
  - Preview section:
    - Show count: "42 messages from 5 conversations"
    - List flagged items (if any)
  - Download button
- [ ] Integrate backend:

```typescript
import { exportStudentConversations } from "@/lib/services/safetyService";

const handleExport = async () => {
  const logs = await exportStudentConversations(studentId);
  // Filter by date range and options
  // Generate and download file
};
```

- [ ] Test export:
  - Various date ranges
  - Different filter combinations
  - JSON and CSV formats
  - Large conversation sets

**Design Specs:**

- Modal with max-w-lg
- HTML5 date pickers
- Doodle-style toggle switches
- Scrollable preview section
- Success toast: "Conversations exported successfully!"

#### Day 5: Final Testing and Bug Fixes

**Tasks:**

- [ ] End-to-end testing:
  - All 4 user journeys from PRD
  - Lucas's first session
  - Mia's retention nudge
  - Pat's subject expansion
  - Eva's tutor booking
- [ ] Bug fixes:
  - Address any issues found
  - Edge case handling
  - Error recovery
- [ ] Performance check:
  - Load times
  - Animation smoothness
  - API response times
- [ ] Code review:
  - Type safety
  - Error handling
  - Code duplication

**Deliverable:** ✅ All critical features complete

---

## Priority 2: Testing & Quality Assurance (1 week)

### Week 5: Comprehensive Testing

#### Days 1-2: User Journey Testing

**Test Scenarios:**

**Lucas's First Session (Age 9):**

- [ ] Onboarding flow completion
- [ ] Color picker selection
- [ ] Tutorial walkthrough
- [ ] First conversation with AI
- [ ] Age-appropriate tone verification
- [ ] Task assignment and completion
- [ ] Achievement unlock ("First Steps")

**Mia's Retention Nudge (Age 14, Churn Risk):**

- [ ] Churn detection triggers (<3 sessions)
- [ ] Nudge popup appears on login
- [ ] Celebrate-first messaging
- [ ] Accept nudge → redirects to suggested subject
- [ ] Dismiss nudge → doesn't reappear for 24h
- [ ] Streak recovery messaging

**Pat's Subject Expansion (Age 16):**

- [ ] Goal completion detection (SAT Prep at 85%)
- [ ] Cross-subject recommendation appears
- [ ] AI suggests College Essays
- [ ] Student confirms new goal
- [ ] Maximum 4 active subjects enforced
- [ ] New tasks generated for new subject

**Eva's Tutor Booking (Age 12):**

- [ ] Struggle detection after 3 failed attempts
- [ ] AI suggests tutor booking
- [ ] Booking modal opens
- [ ] Tutor profile displays (Mr. Rodriguez)
- [ ] Time slot selection
- [ ] Booking request created
- [ ] Handoff notes generated

#### Days 3-4: Integration Testing

**AI Conversation Flow:**

- [ ] Context window maintains 15 messages
- [ ] Older messages summarized correctly
- [ ] Age-appropriate prompts applied
- [ ] Content filtering works on input/output
- [ ] Homework helper mode enforced (no direct answers)

**Task Generation and Completion:**

- [ ] Multiple choice tasks generate correctly
- [ ] Open-ended tasks with rubrics
- [ ] Real-world tasks with materials list
- [ ] Difficulty adjusts based on performance
- [ ] Points awarded correctly
- [ ] Progress updates after completion

**Achievement Unlocking:**

- [ ] First Steps (first conversation)
- [ ] 3-Day Streak (consecutive days)
- [ ] Topic Master (90% on any topic)
- [ ] Curious Mind (10 questions asked)
- [ ] Social Butterfly (5 friend messages)
- [ ] Streak Breaker (beat longest streak)

**Nudge System Timing:**

- [ ] Maximum 1 nudge per day per subject
- [ ] Event-based triggers (login, goal completion, streak milestone)
- [ ] History tracking prevents spam
- [ ] Celebrate-first priority order

#### Day 5: Bug Fixes and Polish

**Tasks:**

- [ ] Address all issues from testing
- [ ] Performance optimization:
  - Reduce bundle size
  - Optimize images
  - Lazy load components
- [ ] Accessibility checks:
  - Keyboard navigation
  - Screen reader support
  - Color contrast (WCAG AA)
  - Focus indicators
- [ ] Cross-browser testing:
  - Chrome, Firefox, Safari, Edge
  - Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Final polish:
  - Animation smoothness
  - Loading states
  - Error messages
  - Success confirmations

**Deliverable:** ✅ Phase 1 ready for stakeholder demo

---

## Priority 3: Nice-to-Have Enhancements (Optional, 2-3 weeks)

### Week 6: Polish & Enhancements

#### Advanced Bubble Animations (2-3 days)

**Tasks:**

- [ ] Particle burst on bubble click
- [ ] Trail effects during animations
- [ ] Sparkles on hover
- [ ] More elaborate celebration sequences
- [ ] Age-specific animation intensity tuning

**Tools:** Framer Motion + custom SVG animations

#### Sound Effects (1-2 days)

**Tasks:**

- [ ] Source or create sound files (<50KB each):
  - Achievement unlock: triumphant chord
  - Streak milestone: fire crackling
  - Correct answer: pleasant ding
  - Encouragement: uplifting chime
  - Button clicks: subtle pop
- [ ] Implement with Web Audio API or Howler.js
- [ ] Add mute toggle in settings
- [ ] Test across devices

#### Mobile Responsive Optimization (3-5 days)

**Tasks:**

- [ ] Collapsible sidebars on mobile
- [ ] Bottom navigation for mobile
- [ ] Touch-friendly button sizes (min 44x44px)
- [ ] Swipe gestures for navigation
- [ ] Optimized chat input for mobile keyboards
- [ ] Test on physical devices (iPhone, Android)

### Week 7: Dark Mode (Optional)

**Tasks:**

- [ ] Create dark color palette
- [ ] Update all components with dark variants
- [ ] Toggle switch in TopBar or settings
- [ ] Persist preference to student profile
- [ ] Test color contrast (WCAG AA)
- [ ] Smooth theme transitions

**Deliverable:** ✅ Enhanced user experience

---

## Implementation Checklist

### Week 1: Tutor Booking

- [ ] Create `app/components/BookingInterface.tsx`
- [ ] Build tutor profile display section
- [ ] Implement time slot picker
- [ ] Add form validation
- [ ] Integrate with `bookingService.ts`
- [ ] Add trigger logic in `app/learn/page.tsx`
- [ ] Connect to struggle detection
- [ ] Test full booking flow
- [ ] Mobile responsive adjustments
- [ ] Add animations and transitions

### Week 2-3: Friend Connection

- [ ] Create `app/components/social/FriendList.tsx`
- [ ] Build friend card component
- [ ] Display activity status
- [ ] Create `app/components/social/MessageSelector.tsx`
- [ ] Implement message type selection
- [ ] Integrate AI message generation
- [ ] Add preview and send flow
- [ ] Create `app/components/social/FriendRequestManager.tsx`
- [ ] Build search interface
- [ ] Implement send/accept/decline logic
- [ ] Add Friends tab to main app
- [ ] Wire up Social Butterfly achievement
- [ ] Test 3/day message limit enforcement
- [ ] Add loading and error states
- [ ] Mobile responsive design

### Week 4: Topic Switching & Export

- [ ] Add `shouldSuggestTopicSwitch()` to `aiService.ts`
- [ ] Implement time-based detection
- [ ] Implement progress-based detection
- [ ] Implement balance-based detection
- [ ] Integrate with chat flow
- [ ] Add cooldown logic
- [ ] Test suggestion triggers
- [ ] Create `app/components/ExportConversationModal.tsx`
- [ ] Build date range selector
- [ ] Add export options (format, filters)
- [ ] Implement download functionality
- [ ] Add export button to TopBar
- [ ] Test export with various filters

### Week 5: Testing

- [ ] Test Lucas's first session journey
- [ ] Test Mia's retention nudge journey
- [ ] Test Pat's subject expansion journey
- [ ] Test Eva's tutor booking journey
- [ ] End-to-end AI conversation testing
- [ ] Task generation testing (all 3 types)
- [ ] Achievement system testing
- [ ] Nudge timing and frequency testing
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG AA)
- [ ] Bug fixes and polish

---

## Timeline Summary

### Minimum Viable Phase 1 Completion

| Week | Focus                  | Deliverable                       | Hours   |
| ---- | ---------------------- | --------------------------------- | ------- |
| 1    | Tutor Booking          | Complete booking flow             | 30-40h  |
| 2-3  | Friend Connection      | Social feature functional         | 60-80h  |
| 4    | Topic Switch + Export  | AI triggers + parent export       | 30-40h  |
| 5    | Testing & QA           | Phase 1 ready for demo            | 30-40h  |
| **Total** | **4-5 weeks**      | **All critical features complete** | **150-200h** |

### With Optional Enhancements

| Week | Focus                | Deliverable                | Hours  |
| ---- | -------------------- | -------------------------- | ------ |
| 6    | Polish & Sound       | Enhanced UX                | 30-40h |
| 7    | Dark Mode            | Theme support              | 20-30h |
| **Total** | **6-7 weeks**   | **Complete Phase 1**       | **200-270h** |

---

## Success Criteria

### Week 1 Complete

- ✅ Booking modal displays tutor profile
- ✅ Time slot picker functional
- ✅ Booking request created on submit
- ✅ AI struggle detection triggers modal

### Week 2-3 Complete

- ✅ Friend list displays connected friends
- ✅ Message selector generates AI messages
- ✅ 3/day limit enforced
- ✅ Friend requests send/accept/decline
- ✅ Social Butterfly achievement unlocks

### Week 4 Complete

- ✅ AI suggests topic switches (time/progress/balance)
- ✅ Export modal downloads conversations
- ✅ Date range filtering works
- ✅ JSON/CSV format options

### Week 5 Complete

- ✅ All 4 user journeys validated
- ✅ No critical bugs
- ✅ Performance targets met
- ✅ Accessibility standards (WCAG AA)

---

## Risk Management

### Potential Blockers

| Risk                           | Impact | Mitigation                                    |
| ------------------------------ | ------ | --------------------------------------------- |
| OpenAI API rate limits         | High   | Implement caching, batch requests             |
| Complex calendar UI            | Medium | Use library (react-day-picker) or simplify    |
| Friend feature scope creep     | Medium | Stick to 3-message limit, no free-form chat   |
| Testing time underestimated    | High   | Allocate full week, prioritize critical paths |
| Mobile responsiveness issues   | Medium | Test early and often, use mobile-first design |

### Dependencies

- OpenAI API key and access
- Development environment setup
- Mock data availability
- Component library (Framer Motion, Tailwind)

---

## Next Steps

### This Week (Week 1)

1. **Review and approve roadmap** with team
2. **Set up development environment** for all contributors
3. **Begin tutor booking interface** - create component file and modal shell
4. **Daily standups** to track progress

### After Week 5

1. **Stakeholder demo** - showcase complete Phase 1
2. **User testing** - gather feedback from target age groups
3. **Phase 2 planning** - database migration, authentication, real-time features
4. **Budget approval** - secure funding for backend infrastructure

---

**Related Documents:**

- [Project Status](PROJECT_STATUS.md) - Current completion overview
- [Missing Features](MISSING_FEATURES.md) - Detailed feature specs
- [Success Metrics](SUCCESS_METRICS.md) - Acceptance criteria
- [Master Index](MASTER_INDEX.md) - Documentation hub
