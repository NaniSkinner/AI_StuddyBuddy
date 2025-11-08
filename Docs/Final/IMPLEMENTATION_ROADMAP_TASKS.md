# 📋 Implementation Roadmap - Weekly Tasks

**Last Updated:** November 8, 2025
**Total Timeline:** 4-6 weeks
**Reference:** [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)

This document provides a week-by-week checklist for completing Phase 1 MVP.

---

## 📊 Weekly Progress Overview

- [ ] **Week 1: Tutor Booking Interface** (0/40 tasks) - 4-5 days
- [ ] **Week 2-3: Friend Connection UI** (0/60 tasks) - 10 days
- [ ] **Week 4: AI Topic Switching + Export** (0/30 tasks) - 5 days
- [ ] **Week 5: Testing & QA** (0/42 tasks) - 5 days
- [ ] **Week 6-7: Optional Enhancements** (0/20 tasks) - 10 days (optional)

**Total Tasks:** 0/192 complete (0%)

---

## Week 1: Tutor Booking Interface (4-5 days)

**Goal:** Complete booking flow from AI suggestion to booking request

**Deliverable:** ✅ Booking modal displays tutor profile, time slot picker works, booking request created

### Days 1-2: Build BookingInterface Modal Component

#### Day 1 Morning: Component Setup (2-3 hours)

- [ ] Create `app/components/BookingInterface.tsx`
- [ ] Define `BookingInterfaceProps` TypeScript interface
- [ ] Set up component boilerplate with React hooks
- [ ] Import dependencies (Framer Motion, services, types)
- [ ] Create initial state management
  - [ ] Selected time slot state
  - [ ] Form data state (topic, notes)
  - [ ] Loading state
  - [ ] Error state
  - [ ] Confirmation state

#### Day 1 Afternoon: Modal Layout & Styling (3-4 hours)

- [ ] Implement modal backdrop
  - [ ] Fixed positioning with blur
  - [ ] Click-outside-to-close handler
  - [ ] Escape key handler
- [ ] Create modal container
  - [ ] Responsive width (max-w-2xl desktop, full mobile)
  - [ ] Doodle styling (border-2, rounded-2xl)
  - [ ] Proper padding and margins
- [ ] Add modal animations
  - [ ] Slide-in from bottom entrance
  - [ ] Fade-out exit
  - [ ] Use Framer Motion variants
- [ ] Create close button (X in corner)

#### Day 2 Morning: Tutor Profile Section (2-3 hours)

- [ ] Display tutor avatar/photo
  - [ ] Circular image with border
  - [ ] Fallback to initials if no photo
  - [ ] Size appropriately (80-100px)
- [ ] Display tutor name and title
  - [ ] Name in large bold font
  - [ ] Title/credentials below name
- [ ] Create specialties badges
  - [ ] Map through tutor.specialties array
  - [ ] Use pill-style with subject colors
  - [ ] Add subject icons (📚, 🔢, 🔬)
- [ ] Display tutor bio
  - [ ] Show 2-3 sentence description
  - [ ] Use readable font size and line height
- [ ] Add success stats
  - [ ] Show "Helped X+ students" or similar
  - [ ] Add star icon or checkmark

#### Day 2 Afternoon: Form Fields (2-3 hours)

- [ ] Create topic input field
  - [ ] Pre-fill with `suggestedTopic` prop
  - [ ] Make editable (text input)
  - [ ] Add label and validation
  - [ ] Show error if empty on submit
- [ ] Create reason section
  - [ ] Display `strugglingConcepts` as list
  - [ ] Format as bulleted or comma-separated
  - [ ] Add label "Why you're booking:"
  - [ ] Make read-only or lightly editable
- [ ] Create notes textarea (optional)
  - [ ] Label: "Anything else to share?"
  - [ ] 3-4 rows tall
  - [ ] Character limit (200 chars)
  - [ ] Show character count
  - [ ] Doodle border styling

### Day 3: Time Slot Picker & Integration (6-8 hours)

#### Day 3 Morning: Time Slot Picker UI (3-4 hours)

- [ ] Fetch available slots from tutor data
  - [ ] Access `tutor.availableSlots` from props
  - [ ] Filter out unavailable slots
  - [ ] Sort by date/time
- [ ] Choose display approach (list or calendar)
  - [ ] Decide on list view or calendar view
  - [ ] Implement chosen approach
- [ ] **If List View:**
  - [ ] Create time slot cards
  - [ ] Display date, time, duration for each
  - [ ] Make slots clickable
  - [ ] Highlight selected slot
  - [ ] Show "No slots available" if empty
- [ ] **If Calendar View:**
  - [ ] Integrate calendar library or build custom
  - [ ] Mark dates with available slots
  - [ ] Show time options when date clicked
  - [ ] Highlight selected date and time
- [ ] Implement selection logic
  - [ ] Store selected slot in state
  - [ ] Validate selection before submit
  - [ ] Show visual feedback on selection
- [ ] Handle edge case: no slots available
  - [ ] Show friendly message
  - [ ] Disable booking button
  - [ ] Suggest contacting tutor directly

#### Day 3 Afternoon: Backend Integration (3-4 hours)

- [ ] Import `createBookingWithHandoff` from bookingService
- [ ] Create submit handler function
  - [ ] Gather all form data (topic, reason, slot, notes)
  - [ ] Validate all required fields
  - [ ] Show validation errors if any
- [ ] Call booking service
  - [ ] Pass studentId, tutorId, topic, reason, etc.
  - [ ] Handle loading state (disable button, show spinner)
  - [ ] Handle success response
  - [ ] Handle error response
- [ ] Implement confirmation state
  - [ ] Show success message with tutor name
  - [ ] Display booking ID
  - [ ] Show checkmark or celebration animation
  - [ ] Auto-close modal after 3 seconds
  - [ ] Call `onBookingComplete(bookingId)` prop
- [ ] Test booking flow end-to-end
  - [ ] Fill form with valid data
  - [ ] Select time slot
  - [ ] Submit booking
  - [ ] Verify success confirmation
  - [ ] Check booking created in service

### Day 4: Polish, Testing & Integration (6-8 hours)

#### Day 4 Morning: AI Trigger Integration (3-4 hours)

- [ ] Open `app/learn/page.tsx`
- [ ] Add booking modal state
  - [ ] `const [showBookingModal, setShowBookingModal] = useState(false)`
  - [ ] `const [bookingData, setBookingData] = useState(null)`
- [ ] Create `handleOpenBooking` function
  - [ ] Accept booking data (tutor, topic, concepts)
  - [ ] Fetch tutor details if needed
  - [ ] Set bookingData state
  - [ ] Set showBookingModal to true
- [ ] Listen for AI action triggers
  - [ ] Check AI response for `action.type === "suggest_booking"`
  - [ ] Extract tutorId, topic, strugglingConcepts
  - [ ] Call `handleOpenBooking` with data
- [ ] Modify `lib/services/aiService.ts`
  - [ ] Import `determineIntervention` from struggleDetectionService
  - [ ] Check intervention after AI response
  - [ ] If type is "tutor_suggestion", add action metadata
  - [ ] Structure: `{ type: "suggest_booking", tutorId, topic, strugglingConcepts }`
- [ ] Render BookingInterface conditionally
  - [ ] `{showBookingModal && <BookingInterface ... />}`
  - [ ] Pass all required props
  - [ ] Wire up onClose and onBookingComplete handlers
- [ ] Test trigger flow
  - [ ] Simulate 3 failed task attempts
  - [ ] Verify AI detects struggle
  - [ ] Verify modal opens automatically
  - [ ] Verify correct data passed to modal

#### Day 4 Afternoon: Mobile, Accessibility & Polish (3-4 hours)

- [ ] Test mobile responsiveness
  - [ ] Test on 375px viewport (iPhone SE)
  - [ ] Verify modal full-width with padding
  - [ ] Check form fields stack vertically
  - [ ] Ensure buttons are touch-friendly (44x44px min)
  - [ ] Test time slot picker on mobile
- [ ] Test keyboard accessibility
  - [ ] Tab through all form fields
  - [ ] Escape key closes modal
  - [ ] Enter key submits form (if valid)
  - [ ] Focus trap within modal (can't tab outside)
- [ ] Add loading states
  - [ ] Button disabled during submit
  - [ ] Show spinner on button
  - [ ] Prevent double submission
- [ ] Add error states
  - [ ] Show validation errors inline
  - [ ] Display network error message if API fails
  - [ ] Provide retry option on error
- [ ] Polish animations
  - [ ] Smooth modal entrance/exit
  - [ ] Subtle hover effects on buttons
  - [ ] Time slot selection animation
  - [ ] Success checkmark animation
- [ ] Apply student's AI color to primary button
  - [ ] Get color from student profile
  - [ ] Apply to "Request Session" button
  - [ ] Ensure sufficient contrast
- [ ] Code cleanup
  - [ ] Remove console.logs
  - [ ] Add TypeScript types everywhere
  - [ ] Add JSDoc comments to functions
  - [ ] Extract reusable components if needed
- [ ] Final testing
  - [ ] Test complete flow 3 times
  - [ ] Test with different tutors
  - [ ] Test with different students
  - [ ] Test error scenarios

**Week 1 Deliverable Checklist:**
- [ ] Booking modal opens on AI suggestion
- [ ] Tutor profile displays correctly
- [ ] Time slot picker works (list or calendar)
- [ ] Form validates input
- [ ] Booking request created successfully
- [ ] Confirmation shown
- [ ] Mobile responsive
- [ ] Accessible (keyboard, screen reader)

---

## Week 2-3: Friend Connection UI (10 days)

**Goal:** Complete social feature with friend list, messaging, and requests

**Deliverable:** ✅ Friends tab in sidebar, can send AI messages (3/day limit), friend requests work

### Days 1-2: FriendList Component (2 days)

#### Day 1: Component Setup & Data Fetching (6-8 hours)

- [ ] Create `app/components/social/FriendList.tsx`
- [ ] Define `FriendListProps` interface
- [ ] Set up component with state management
  - [ ] Friends list state
  - [ ] Loading state
  - [ ] Error state
  - [ ] Selected friend state (for messaging)
- [ ] Implement data fetching
  - [ ] Import `getStudentById` from studentService
  - [ ] Fetch student data on mount
  - [ ] Extract `friendConnections` array
  - [ ] Fetch each friend's profile data
  - [ ] Handle parallel fetching (Promise.all)
  - [ ] Handle loading state
  - [ ] Handle errors gracefully
- [ ] Create loading skeleton
  - [ ] Show while fetching data
  - [ ] Animated placeholder cards
  - [ ] Match layout of friend cards
- [ ] Create error state
  - [ ] Show if fetch fails
  - [ ] Display retry button
  - [ ] Log error for debugging

#### Day 2: Friend Card Design & Display (6-8 hours)

- [ ] Create FriendCard sub-component
  - [ ] Accept friend data as props
  - [ ] Doodle card styling (rounded-xl, border-2)
  - [ ] Hover effects (scale, shadow)
- [ ] Display friend avatar
  - [ ] Show initials if no photo
  - [ ] Circular with border (rounded-full)
  - [ ] Size appropriately (48-60px)
  - [ ] Add online status indicator (green dot - simulated)
- [ ] Display friend info
  - [ ] Name (bold, text-lg)
  - [ ] Grade level (text-sm, gray)
  - [ ] Layout in flex row
- [ ] Display current activity
  - [ ] Get friend's current goal
  - [ ] Show emoji + subject + progress (e.g., "📚 Reading 68%")
  - [ ] Use progress bar or circular indicator
  - [ ] Color-code by progress level
- [ ] Display streak indicator
  - [ ] Check friend's streak data
  - [ ] Show "🔥 X-day streak" if active
  - [ ] Use fire emoji with number
- [ ] Add "Send Message" button
  - [ ] Sketch button styling
  - [ ] Position at bottom of card
  - [ ] Click calls `onSendMessage(friend.id)`
- [ ] Display last active timestamp
  - [ ] Format as relative time ("Active 2 hours ago")
  - [ ] Use dateUtils.formatRelativeTime()
  - [ ] Gray text, small font
- [ ] Render all friend cards
  - [ ] Map through friends array
  - [ ] Use friend.id as key
  - [ ] Handle empty array (show empty state)

### Days 3-4: MessageSelector Component (2 days)

#### Day 3: Message Type Selection & Generation (6-8 hours)

- [ ] Create `app/components/social/MessageSelector.tsx`
- [ ] Define `MessageSelectorProps` interface
- [ ] Set up modal structure
  - [ ] Backdrop with blur
  - [ ] Centered modal container
  - [ ] Doodle styling
  - [ ] Close button (X in corner)
- [ ] Create state management
  - [ ] Selected message type state
  - [ ] Generated message state
  - [ ] Loading state
  - [ ] Regeneration count state
- [ ] Create 3 message type cards
  - [ ] **Card 1: Encouragement** 🌟
    - [ ] Icon, title, description
    - [ ] Purple theme color
    - [ ] Clickable to select
  - [ ] **Card 2: Milestone** 🎉
    - [ ] Icon, title, description
    - [ ] Green theme color
    - [ ] Clickable to select
  - [ ] **Card 3: Challenge** 🤝
    - [ ] Icon, title, description
    - [ ] Orange theme color
    - [ ] Clickable to select
- [ ] Style message type cards
  - [ ] Grid layout (3 columns, stack on mobile)
  - [ ] Doodle borders with theme colors
  - [ ] Hover effects (scale, glow)
  - [ ] Selected state (thicker border, background)
- [ ] Implement type selection
  - [ ] Store selected type in state
  - [ ] Trigger message generation on selection
  - [ ] Disable other cards when selected
- [ ] Implement AI message generation
  - [ ] Import `generateFriendMessage` from gamificationService
  - [ ] Call when type selected: `generateFriendMessage(studentId, friendId, messageType)`
  - [ ] Show loading spinner during generation
  - [ ] Store generated message in state
  - [ ] Handle errors (show fallback message)

#### Day 4: Message Preview & Send (6-8 hours)

- [ ] Create message preview bubble
  - [ ] Display generated message
  - [ ] Doodle message bubble styling
  - [ ] Use theme color based on type
  - [ ] Show in chat-style bubble
  - [ ] Animate entrance (fade-in)
- [ ] Add "Regenerate" button
  - [ ] Icon: 🔄 or circular arrow
  - [ ] Position near preview
  - [ ] Call generation function again
  - [ ] Increment regeneration count
  - [ ] Limit to 3 regenerations per type
  - [ ] Disable if limit reached
  - [ ] Show loading state
- [ ] Calculate daily message limit
  - [ ] Get student's friend message history
  - [ ] Filter messages sent today to this friend
  - [ ] Count total (max 3)
  - [ ] Store count in state
- [ ] Display limit counter
  - [ ] Show "X messages left today"
  - [ ] Visual indicator (3/3 ⭐⭐⭐ or progress dots)
  - [ ] Update after each send
  - [ ] Prominent placement
- [ ] Handle at-limit state
  - [ ] Check if messagesSentToday >= 3
  - [ ] Show warning: "You've reached your daily limit (3/3)"
  - [ ] Disable "Send Message" button
  - [ ] Show reset time ("Resets at midnight")
  - [ ] Prevent message generation if at limit
- [ ] Create "Send Message" button
  - [ ] Primary sketch button
  - [ ] Use student's AI color
  - [ ] Disable if no message or at limit
  - [ ] Show loading during send
- [ ] Implement send handler
  - [ ] Import `sendMessage` from gamificationService
  - [ ] Call: `sendMessage(studentId, friendId, generatedMessage)`
  - [ ] Check response for success
  - [ ] Handle 3/day limit from backend
  - [ ] Handle errors
- [ ] Show success confirmation
  - [ ] Display: "Message sent to [Friend Name]! 📨"
  - [ ] Checkmark animation
  - [ ] Auto-close modal after 2 seconds
  - [ ] Call `onMessageSent()` callback

### Days 5-6: FriendRequestManager Component (2 days)

#### Day 5: Tabbed Interface & Search/Add Tab (6-8 hours)

- [ ] Create `app/components/social/FriendRequestManager.tsx`
- [ ] Define `FriendRequestManagerProps` interface
- [ ] Create modal structure
  - [ ] Backdrop with blur
  - [ ] Modal container (larger than message selector)
  - [ ] Doodle styling
- [ ] Create tabbed navigation
  - [ ] Tab 1: "Search & Add"
  - [ ] Tab 2: "Pending Requests"
  - [ ] Tab 3: "My Friends"
  - [ ] State to track active tab
  - [ ] Style active vs inactive tabs
  - [ ] Doodle underline for active tab
- [ ] Build Search & Add tab
  - [ ] Search input with icon (🔍)
  - [ ] Placeholder: "Search for friends by name..."
  - [ ] Debounce input (300ms)
  - [ ] Implement search logic
    - [ ] Get all students from `getAllStudents()`
    - [ ] Filter by name (case-insensitive)
    - [ ] Exclude current student
    - [ ] Exclude already-connected friends
    - [ ] Exclude pending requests
- [ ] Display search results
  - [ ] Map through filtered students
  - [ ] Show student cards (name, grade, avatar)
  - [ ] "Send Friend Request" button on each
  - [ ] Empty state: "No students found"
- [ ] Implement send request
  - [ ] Import `sendFriendRequest` from gamificationService
  - [ ] Call on button click
  - [ ] Show success message
  - [ ] Disable button after sending
  - [ ] Change button text to "Request Sent"
  - [ ] Prevent duplicate requests

#### Day 6: Pending Requests & My Friends Tabs (6-8 hours)

- [ ] Build Pending Requests tab
  - [ ] Import `getFriendRequests` from gamificationService
  - [ ] Fetch on component mount and tab switch
  - [ ] Filter for status "pending"
  - [ ] Store in state
- [ ] Display incoming requests
  - [ ] Map through pending requests
  - [ ] Show requester info (name, grade, avatar)
  - [ ] Show request timestamp ("2 hours ago")
  - [ ] Accept and Decline buttons
  - [ ] Empty state: "No pending requests"
- [ ] Implement Accept action
  - [ ] Import `acceptFriendRequest` from gamificationService
  - [ ] Call on Accept click
  - [ ] Update student's `friendConnections`
  - [ ] Show success: "You're now friends with [Name]!"
  - [ ] Remove from pending list
  - [ ] Call `onFriendAdded()` callback
  - [ ] Refresh friend list
- [ ] Implement Decline action
  - [ ] Import `declineFriendRequest` if exists
  - [ ] Call on Decline click
  - [ ] Remove from pending list
  - [ ] Show subtle confirmation
  - [ ] No friend connection created
- [ ] Build My Friends tab
  - [ ] Reuse friend fetching logic
  - [ ] Get friends from student.friendConnections
  - [ ] Display using FriendCard component
  - [ ] Show activity status
  - [ ] Add "Send Message" quick action
  - [ ] Empty state: "You don't have any friends yet"
  - [ ] Link to Search & Add tab

### Days 7-8: Main App Integration (2 days)

#### Day 7: Sidebar Integration (6-8 hours)

- [ ] Decide on integration approach
  - [ ] Choose Option A (Sidebar Tab) or Option B (Top Nav)
  - [ ] Recommended: Option A for quick access
- [ ] **If Option A: Sidebar Tab**
  - [ ] Open `app/learn/page.tsx`
  - [ ] Import FriendList and MessageSelector
  - [ ] Add "Friends" tab to TaskSidebar
    - [ ] Create tab button with 👥 icon
    - [ ] Add notification badge for pending requests
    - [ ] Style like existing tabs
  - [ ] Create toggle between Tasks and Friends views
    - [ ] Add state: `const [activeTab, setActiveTab] = useState('tasks')`
    - [ ] Show TaskSidebar content if activeTab === 'tasks'
    - [ ] Show FriendList if activeTab === 'friends'
  - [ ] Count pending requests for badge
    - [ ] Fetch pending requests count
    - [ ] Display as badge number on tab icon
    - [ ] Update in real-time
- [ ] **If Option B: Top Navigation**
  - [ ] Add "Social" to TopBar navigation
  - [ ] Create new route `/social`
  - [ ] Create `app/social/page.tsx`
  - [ ] Render FriendList as main content
  - [ ] Add notification indicator in TopBar
- [ ] Add state management
  - [ ] State for showing MessageSelector modal
  - [ ] State for selected friend
  - [ ] State for showing FriendRequestManager
  - [ ] State for triggering refresh

#### Day 8: Wire Up Components & Test (6-8 hours)

- [ ] Wire up "Add Friend" button
  - [ ] Click opens FriendRequestManager modal
  - [ ] Pass onClose and onFriendAdded callbacks
- [ ] Wire up "Send Message" buttons
  - [ ] From FriendList cards
  - [ ] From My Friends tab
  - [ ] Click sets selected friend and opens MessageSelector
  - [ ] Pass friend data to modal
- [ ] Wire up MessageSelector callbacks
  - [ ] onClose: closes modal and clears selected friend
  - [ ] onMessageSent: refreshes friend list and closes modal
- [ ] Wire up FriendRequestManager callbacks
  - [ ] onClose: closes modal
  - [ ] onFriendAdded: refreshes friend list
- [ ] Implement refresh mechanism
  - [ ] Re-fetch friend data after actions
  - [ ] Update pending request count
  - [ ] Clear any cached data
- [ ] Test complete integration
  - [ ] Open Friends tab
  - [ ] Verify friend list loads
  - [ ] Click "Add Friend"
  - [ ] Search for student
  - [ ] Send friend request
  - [ ] Accept request (simulate from other side)
  - [ ] Send message to friend
  - [ ] Verify all flows work

### Days 9-10: Testing, Polish & Achievement Integration (2 days)

#### Day 9: Achievement Integration & Limit Testing (6-8 hours)

- [ ] Integrate Social Butterfly achievement
  - [ ] Import `checkAndUnlockAchievements` from achievementService
  - [ ] Call after successful message send
  - [ ] Check if total friend messages >= 5
  - [ ] Unlock "Social Butterfly" badge
  - [ ] Show UnlockNotification component
  - [ ] Display confetti animation
  - [ ] Update badge collection
- [ ] Test message limit enforcement
  - [ ] Send 1st message (should work)
  - [ ] Send 2nd message (should work)
  - [ ] Send 3rd message (should work)
  - [ ] Try 4th message (should be blocked)
  - [ ] Verify counter shows 3/3
  - [ ] Verify "Send Message" button disabled
  - [ ] Verify warning message displayed
  - [ ] Verify reset time shown
- [ ] Test across different times
  - [ ] Send message today
  - [ ] Simulate midnight reset (change system date)
  - [ ] Verify counter resets to 0/3
  - [ ] Verify can send again
- [ ] Test edge cases
  - [ ] No friends (empty state)
  - [ ] Friend with no activity
  - [ ] Friend request to self (should be blocked)
  - [ ] Duplicate friend request (should be blocked)
  - [ ] Network failure scenarios

#### Day 10: Design Polish & Final Testing (6-8 hours)

- [ ] Apply doodle design consistently
  - [ ] All cards have rounded-xl, border-2
  - [ ] Consistent spacing and padding
  - [ ] Playful shadows on hover
- [ ] Color-code message types
  - [ ] Encouragement cards: Purple (#A685E2)
  - [ ] Milestone cards: Green (#7FD8BE)
  - [ ] Challenge cards: Orange (#FF9671)
  - [ ] Apply to borders, buttons, accents
- [ ] Add micro-animations
  - [ ] Friend card entrance stagger
  - [ ] Message bubble fade-in
  - [ ] Button hover scale
  - [ ] Success checkmark animation
  - [ ] Tab switching transition
- [ ] Polish empty states
  - [ ] Add friendly illustrations or icons
  - [ ] Use encouraging copy
  - [ ] Make CTAs prominent
  - [ ] Consistent styling with doodle theme
- [ ] Test mobile responsiveness
  - [ ] Friend list on 375px viewport
  - [ ] Message selector on mobile
  - [ ] Friend request manager on mobile
  - [ ] Touch targets 44x44px minimum
  - [ ] Horizontal scrolling for long content
- [ ] Test accessibility
  - [ ] Tab through all UI with keyboard
  - [ ] Escape key closes modals
  - [ ] Screen reader announces content
  - [ ] ARIA labels on all interactive elements
  - [ ] Focus management correct
- [ ] Final integration test
  - [ ] Complete user journey from search to message
  - [ ] Test with all 4 student profiles
  - [ ] Verify all data saves correctly
  - [ ] Check for console errors
- [ ] Code cleanup
  - [ ] Remove all console.logs
  - [ ] Add TypeScript types everywhere
  - [ ] Add JSDoc comments
  - [ ] Extract duplicated code into utilities
  - [ ] Optimize re-renders with React.memo

**Week 2-3 Deliverable Checklist:**
- [ ] Friends tab appears in sidebar
- [ ] Friend list displays connected friends
- [ ] Can search and add friends
- [ ] Can accept/decline friend requests
- [ ] Can send AI-generated messages (3 types)
- [ ] 3/day message limit enforced
- [ ] Social Butterfly achievement unlocks at 5 messages
- [ ] Mobile responsive
- [ ] Accessible
- [ ] Doodle styling consistent

---

## Week 4: AI Topic Switching + Export (5 days)

**Goal:** AI proactively suggests topic switches, parents can export conversations

**Deliverable:** ✅ Topic suggestions appear during conversation, export modal downloads conversations

### Days 1-2: Topic Switch Triggers (2 days)

#### Day 1: Detection Logic Implementation (6-8 hours)

- [ ] Open `lib/services/aiService.ts`
- [ ] Create `TopicSwitchSuggestion` interface
- [ ] Create `shouldSuggestTopicSwitch` function skeleton
- [ ] Implement Trigger 1: Time-based (30+ minutes)
  - [ ] Check `conversationDuration >= 30`
  - [ ] Get current goal from student
  - [ ] Find alternative goals
  - [ ] Select one to suggest
  - [ ] Build suggestion object with reason
  - [ ] Test with 30-minute mock session
- [ ] Implement Trigger 2: Progress-based (>85%)
  - [ ] Check `currentGoal.progress >= 85`
  - [ ] Call `getSubjectRecommendations` service
  - [ ] Get top recommendation
  - [ ] Build suggestion with recommendation reason
  - [ ] Test with high-progress goal
- [ ] Implement Trigger 3: Balance-based (gap >30%)
  - [ ] Calculate max and min progress across goals
  - [ ] Calculate gap
  - [ ] Check if gap > 30 and current > 60
  - [ ] Find lagging goal
  - [ ] Build suggestion to balance progress
  - [ ] Test with imbalanced goals

#### Day 2: Integration & Cooldown (6-8 hours)

- [ ] Implement cooldown logic
  - [ ] Create storage for last suggestion timestamp
  - [ ] Use session storage or state
  - [ ] Check time since last suggestion
  - [ ] Return early if < 15 minutes
  - [ ] Test cooldown enforcement
- [ ] Track declined suggestions
  - [ ] Store declined topics in session
  - [ ] Don't re-suggest same topic this session
  - [ ] Clear on session end or topic switch
- [ ] Open `app/learn/page.tsx`
- [ ] Add state management
  - [ ] `const [topicSwitchSuggestion, setTopicSwitchSuggestion] = useState(null)`
  - [ ] `const [sessionStartTime] = useState(Date.now())`
- [ ] Import `shouldSuggestTopicSwitch`
- [ ] Call after each AI response
  - [ ] Calculate conversation duration
  - [ ] Call detection function
  - [ ] Set state if `shouldSuggest === true`
- [ ] Render AISuggestedSwitch component
  - [ ] Check if `topicSwitchSuggestion` is not null
  - [ ] Pass suggestion data as props
  - [ ] Position above chat input (banner style)
- [ ] Implement accept handler
  - [ ] Call `handleSwitchTopic(suggestedGoalId)`
  - [ ] AI acknowledges: "Great! Let's work on [New Subject] now."
  - [ ] Clear suggestion state
  - [ ] Reset session timer
  - [ ] Log acceptance
- [ ] Implement decline handler
  - [ ] Clear suggestion state
  - [ ] Add to declined list
  - [ ] AI acknowledges: "No problem! Let's keep going."
  - [ ] Log decline
- [ ] Test all three triggers
  - [ ] Test time-based at 30 minutes
  - [ ] Test progress-based at 90%
  - [ ] Test balance-based with 40% gap
  - [ ] Test cooldown prevents spam
  - [ ] Test decline prevents re-suggestion

### Days 3-4: Conversation Export UI (2 days)

#### Day 3: Export Modal & Date Range (6-8 hours)

- [ ] Open `app/components/TopBar.tsx`
- [ ] Add export modal state
  - [ ] `const [showExportModal, setShowExportModal] = useState(false)`
- [ ] Add export button
  - [ ] Icon: 📥 or download symbol
  - [ ] Label: "Export Conversations"
  - [ ] Sketch button ghost styling
  - [ ] Hover animation
  - [ ] Click opens modal
- [ ] Create `app/components/ExportConversationModal.tsx`
- [ ] Define `ExportConversationModalProps`
- [ ] Create modal structure
  - [ ] Backdrop with blur
  - [ ] Container with max-w-lg
  - [ ] Doodle styling
  - [ ] Close button
- [ ] Add date range state
  - [ ] `const [startDate, setStartDate] = useState(null)`
  - [ ] `const [endDate, setEndDate] = useState(null)`
- [ ] Create date picker inputs
  - [ ] Start date input (type="date")
  - [ ] End date input (type="date")
  - [ ] Labels and styling
  - [ ] Set default to last 30 days
- [ ] Add preset buttons
  - [ ] "Last 7 days" → sets dates
  - [ ] "Last 30 days" → sets dates
  - [ ] "All time" → clears filters
  - [ ] Sketch button styling
- [ ] Validate date range
  - [ ] Ensure startDate <= endDate
  - [ ] Show error if invalid
  - [ ] Disable export if invalid

#### Day 4: Export Options, Preview & Download (6-8 hours)

- [ ] Add export options state
  - [ ] Format (JSON or CSV)
  - [ ] Include only flagged
  - [ ] Include AI responses
  - [ ] Include metadata
- [ ] Create format selector
  - [ ] Radio buttons for JSON vs CSV
  - [ ] Default to JSON
  - [ ] Doodle styling
- [ ] Create toggle switches
  - [ ] "Include only flagged messages" toggle
  - [ ] "Include AI responses" toggle (default ON)
  - [ ] "Include session metadata" toggle (default ON)
  - [ ] Doodle switch styling
  - [ ] Tooltips for each
- [ ] Fetch conversation data
  - [ ] Import `exportStudentConversations` from safetyService
  - [ ] Call on modal open
  - [ ] Store in state
  - [ ] Show loading during fetch
- [ ] Filter data for preview
  - [ ] Apply date range filter
  - [ ] Apply flagged filter if enabled
  - [ ] Count messages and conversations
- [ ] Display preview statistics
  - [ ] Show: "X messages from Y conversations"
  - [ ] If flagged: "Z flagged messages"
  - [ ] Date range: "From [start] to [end]"
- [ ] Create preview area
  - [ ] Show first 5-10 messages
  - [ ] Use doodle cards
  - [ ] Show timestamp, speaker, preview
  - [ ] Scrollable section
- [ ] Implement download handler
  - [ ] Apply all filters to data
  - [ ] Format as JSON or CSV
  - [ ] Generate filename with student name and date
  - [ ] Create blob and download
  - [ ] Show success message
  - [ ] Handle errors
- [ ] Test export
  - [ ] Export JSON with different date ranges
  - [ ] Export CSV
  - [ ] Export flagged only
  - [ ] Export without AI responses
  - [ ] Verify file structure correct

### Day 5: Final Testing & Bug Fixes (6-8 hours)

- [ ] Test topic switch triggers comprehensively
  - [ ] Trigger all 3 types in different scenarios
  - [ ] Test cooldown timing
  - [ ] Test declined suggestions don't reappear
  - [ ] Test accept switches topic correctly
  - [ ] Test across all 4 students
- [ ] Test export with different students
  - [ ] Lucas (many messages)
  - [ ] Mia (few messages)
  - [ ] Eva (moderate messages)
  - [ ] Pat (academic tone messages)
- [ ] Test edge cases
  - [ ] Student with 1 goal (no alternatives to suggest)
  - [ ] Student with no conversations (export empty)
  - [ ] Invalid date range (export errors)
  - [ ] Network failures
- [ ] Polish UI elements
  - [ ] Consistent doodle styling
  - [ ] Smooth animations
  - [ ] Clear labels and instructions
- [ ] Accessibility check
  - [ ] Keyboard navigation
  - [ ] Screen reader compatibility
  - [ ] ARIA labels
- [ ] Fix any bugs found
  - [ ] Address console errors
  - [ ] Fix UI glitches
  - [ ] Handle edge cases gracefully
- [ ] Code cleanup
  - [ ] Remove debug logs
  - [ ] Add TypeScript types
  - [ ] Add comments
  - [ ] Optimize performance

**Week 4 Deliverable Checklist:**
- [ ] AI suggests topic switches (time/progress/balance triggers)
- [ ] Suggestions appear as banner above chat
- [ ] Accept switches topic, decline dismisses
- [ ] 15-minute cooldown enforced
- [ ] Export button in TopBar
- [ ] Export modal with date range and options
- [ ] Can download conversations as JSON or CSV
- [ ] Preview shows message count
- [ ] Works across all students

---

## Week 5: Testing & Quality Assurance (5 days)

**Goal:** Validate all features, fix bugs, ensure quality

**Deliverable:** ✅ All 4 user journeys pass, acceptance criteria met, Phase 1 ready

### Days 1-2: User Journey Testing (2 days)

#### Day 1: Journey 1 (Lucas) & Journey 2 (Mia) (6-8 hours)

**Journey 1: Lucas's First Session (Age 9)**

- [ ] Test onboarding flow
  - [ ] Welcome screen displays
  - [ ] Color picker shows 10 options
  - [ ] Tutorial walks through features
  - [ ] Goal setup allows selecting subjects
  - [ ] Completion flag saved
- [ ] Test initial conversation
  - [ ] Chat interface loads
  - [ ] Animated bubble appears
  - [ ] Student can type message
  - [ ] AI responds with age-appropriate tone
    - [ ] Simple words verified
    - [ ] Short sentences verified
    - [ ] High encouragement verified
    - [ ] Emojis present
- [ ] Test task assignment
  - [ ] AI suggests practice task
  - [ ] Multiple choice task generated
  - [ ] Task appears in sidebar
  - [ ] Task has age-appropriate content
  - [ ] Student can complete task
- [ ] Test progress tracking
  - [ ] After task completion, progress updates
  - [ ] Circular progress ring animates
  - [ ] Sub-concept marked as practiced
  - [ ] Points awarded correctly
- [ ] Test achievement unlock
  - [ ] "First Steps" achievement unlocks
  - [ ] Confetti animation plays
  - [ ] Badge appears in collection
  - [ ] Timestamp recorded

**Journey 2: Mia's Retention Nudge (Age 14, Churn Risk)**

- [ ] Test churn detection
  - [ ] Mia has only 2 sessions in profile
  - [ ] `assessRisk()` returns "high" risk
  - [ ] Engagement score calculated low
  - [ ] Churn flag set in profile
- [ ] Test nudge generation
  - [ ] On login, `generateNudge()` called
  - [ ] Nudge celebrates recent progress first
  - [ ] Nudge encourages lagging subject
  - [ ] Nudge mentions streak recovery
  - [ ] 1 nudge per day per subject enforced
- [ ] Test nudge delivery
  - [ ] NudgePopup displays on landing page
  - [ ] Modal overlay with blur
  - [ ] Message personalized to Mia
  - [ ] Accept button: "Start Math Session"
  - [ ] Dismiss button: "Maybe Later"
- [ ] Test accept flow
  - [ ] Click "Start Math Session"
  - [ ] Redirected to chat with Math topic
  - [ ] AI greets encouragingly
  - [ ] Math tasks shown in sidebar
  - [ ] Nudge marked as accepted
- [ ] Test dismiss flow
  - [ ] Click "Maybe Later"
  - [ ] Nudge dismissed
  - [ ] No re-appearance for 24 hours
  - [ ] Nudge marked as dismissed
  - [ ] Student proceeds to dashboard

#### Day 2: Journey 3 (Pat) & Journey 4 (Eva) (6-8 hours)

**Journey 3: Pat's Subject Expansion (Age 16)**

- [ ] Test goal completion detection
  - [ ] Pat's SAT Prep at 85%+ progress
  - [ ] All topics within goal >80% mastered
  - [ ] Last practiced within 7 days
  - [ ] High engagement verified
- [ ] Test cross-subject recommendation
  - [ ] `getSubjectRecommendations()` triggered
  - [ ] Rule-based suggests "College Essays"
  - [ ] Reason provided: relates to SAT Prep
  - [ ] Priority set correctly
- [ ] Test AI suggestion display
  - [ ] During conversation, AI mentions completion
  - [ ] AI suggests: "Have you thought about College Essays?"
  - [ ] Reasoning explained clearly
  - [ ] Student prompted to confirm
- [ ] Test student confirmation
  - [ ] Student responds affirmatively
  - [ ] New goal added to profile
  - [ ] Goal has subject, topics, 0% progress
  - [ ] Maximum 4 subjects enforced (if at limit)
- [ ] Test new goal initialization
  - [ ] College Essays goal visible in dashboard
  - [ ] Circular progress ring at 0%
  - [ ] AI generates first task for new subject
  - [ ] Task appears in sidebar
  - [ ] Chat context updated

**Journey 4: Eva's Tutor Booking (Age 12)**

- [ ] Test struggle detection
  - [ ] Eva attempts "Metaphors" task 3 times
  - [ ] All attempts incorrect
  - [ ] Conversation has confusion phrases
  - [ ] Frustration level calculated medium
  - [ ] `determineIntervention()` returns "tutor_suggestion"
- [ ] Test AI intervention
  - [ ] AI responds empathetically
  - [ ] AI suggests booking tutor session
  - [ ] Action metadata attached to response
  - [ ] Includes tutorId, topic, strugglingConcepts
- [ ] Test booking modal trigger
  - [ ] Modal opens automatically
  - [ ] Backdrop blur active
  - [ ] Tutor profile displays: Mr. Rodriguez
  - [ ] Specialties shown: English & Reading
  - [ ] Bio displayed correctly
- [ ] Test booking form
  - [ ] Topic pre-filled: "Metaphors"
  - [ ] Reason auto-populated: "Struggling with understanding metaphors"
  - [ ] Time slots displayed (at least 2-3 options)
  - [ ] Can select a time slot
  - [ ] Can add optional notes
- [ ] Test handoff notes generation
  - [ ] `createBookingWithHandoff()` called
  - [ ] AI generates handoff notes
  - [ ] Notes include: summary, concepts, approach, emotional state
  - [ ] Notes comprehensive and actionable
- [ ] Test booking confirmation
  - [ ] Booking request created with status "pending"
  - [ ] Success message displays with tutor name
  - [ ] Booking ID shown
  - [ ] Modal auto-closes after 3 seconds

### Days 3-4: Integration & Acceptance Testing (2 days)

#### Day 3: AI & Task Systems (6-8 hours)

**AI Conversation Flow:**

- [ ] Test context window maintains 15 messages
  - [ ] Start conversation with 20+ messages
  - [ ] Verify last 15 in full detail
  - [ ] Verify older messages summarized
- [ ] Test age-appropriate prompts
  - [ ] Lucas (9): simple words, emojis, encouragement
  - [ ] Eva (12): balanced tone, self-reflection
  - [ ] Pat (16): academic tone, critical thinking
  - [ ] Verify tone consistency across 10+ messages each
- [ ] Test content filtering
  - [ ] Input inappropriate content → blocked
  - [ ] Input personal info (address) → blocked
  - [ ] Input phone number → blocked
  - [ ] AI never gives inappropriate responses
- [ ] Test homework helper mode
  - [ ] Ask AI for homework answer directly
  - [ ] Verify AI gives hints, not answers
  - [ ] Hints progress: general → specific → breakdown
  - [ ] Never reveals full solution

**Task Generation & Completion:**

- [ ] Test multiple choice tasks
  - [ ] Generate 5 MC tasks for different topics
  - [ ] Verify 4 options each
  - [ ] Verify distractors based on common mistakes
  - [ ] Verify hints available (3 levels)
  - [ ] Complete tasks and verify points (10-15)
- [ ] Test open-ended tasks
  - [ ] Generate 5 OE tasks
  - [ ] Verify rubric provided
  - [ ] Verify sample answer included
  - [ ] Complete tasks and verify points (10-20)
- [ ] Test real-world tasks
  - [ ] Generate 3 RW tasks
  - [ ] Verify materials list present
  - [ ] Verify safety notes if applicable
  - [ ] Verify verification questions
  - [ ] Complete tasks and verify points (15-25)
- [ ] Test difficulty adjustment
  - [ ] Student with <50% correct gets easy task
  - [ ] Student with 50-80% gets medium task
  - [ ] Student with >80% gets hard task

**Progress Tracking:**

- [ ] Test sub-concept mastery
  - [ ] Complete tasks for same sub-concept
  - [ ] Verify correct/total attempts tracked
  - [ ] At 90%+ correct, marked "mastered" (✓)
  - [ ] At <40% correct, marked "struggling" (⚠️)
- [ ] Test topic progress
  - [ ] Average of sub-concept mastery
  - [ ] Updates after task completion
  - [ ] Percentage correct
- [ ] Test goal progress
  - [ ] Average of topic progress
  - [ ] Updates in real-time
  - [ ] Circular ring animates to new value
- [ ] Test visual indicators
  - [ ] Green for >75%
  - [ ] Yellow for 40-75%
  - [ ] Red for <40%

#### Day 4: Retention & Gamification (6-8 hours)

**Retention System:**

- [ ] Test churn detection
  - [ ] Mia: <3 sessions by Day 7 → high risk
  - [ ] Student: no activity 3+ days → medium risk
  - [ ] Engagement score calculated correctly
- [ ] Test nudge system
  - [ ] Maximum 1 nudge per day per subject enforced
  - [ ] Celebrate-first priority verified
  - [ ] Event triggers work (login, goal complete, streak)
  - [ ] History tracking prevents spam
- [ ] Test streak tracking
  - [ ] Login streak increments on daily login
  - [ ] Practice streak increments on task completion
  - [ ] Streak breaks reset to 0 if day missed
  - [ ] Longest streak preserved
  - [ ] Milestone celebrations (3, 7, 14, 30 days)

**Gamification:**

- [ ] Test animated bubble
  - [ ] Idle: gentle pulsing (3s loop)
  - [ ] Thinking: breathing + color transitions
  - [ ] Speaking: quick scale pulses
  - [ ] Celebrating: burst animation
  - [ ] Clicked: wiggle animation
  - [ ] Age-specific intensity (1.3x for 9-11, 1.0x for 12-14, 0.7x for 15-16)
- [ ] Test color customization
  - [ ] Select color in picker
  - [ ] Verify saved to profile
  - [ ] Verify applied to bubble, buttons, indicators
  - [ ] Verify persists across sessions
- [ ] Test all 6 achievements
  - [ ] First Steps: after first conversation
  - [ ] 3-Day Streak: after 3 consecutive days
  - [ ] Topic Master: at 90% topic progress
  - [ ] Curious Mind: after 10 questions
  - [ ] Social Butterfly: after 5 friend messages
  - [ ] Streak Breaker: when beating longest streak
  - [ ] Verify unlock notifications display
  - [ ] Verify confetti animations play
  - [ ] Verify badges appear in collection

**Friend System (Backend):**

- [ ] Test friend request send
  - [ ] Request created with status "pending"
  - [ ] Requester and recipient IDs stored
- [ ] Test friend request accept
  - [ ] Both students added to each other's friendConnections
  - [ ] Request status updated to "accepted"
- [ ] Test friend message generation
  - [ ] Generate encouragement message
  - [ ] Generate milestone message
  - [ ] Generate challenge message
  - [ ] Verify all positive, age-appropriate
- [ ] Test 3/day limit
  - [ ] Send 3 messages → all succeed
  - [ ] Send 4th message → blocked
  - [ ] Verify counter shows 3/3

**Tutor Booking (Backend):**

- [ ] Test booking request creation
  - [ ] All fields populated correctly
  - [ ] Status set to "pending"
  - [ ] Timestamp recorded
- [ ] Test handoff notes generation
  - [ ] AI generates summary
  - [ ] Lists struggling concepts (3-5)
  - [ ] Suggests teaching approaches (2-3)
  - [ ] Describes emotional state
  - [ ] Notes comprehensive and helpful
- [ ] Test tutor availability
  - [ ] Time slots display correctly
  - [ ] Available flag respected
  - [ ] Duration and datetime accurate

### Day 5: Bug Fixes, Polish & Final Checks (6-8 hours)

- [ ] Fix any bugs found in testing
  - [ ] Address console errors
  - [ ] Fix UI glitches
  - [ ] Handle edge cases
  - [ ] Improve error messages
- [ ] Performance optimization
  - [ ] Profile slow operations
  - [ ] Optimize re-renders
  - [ ] Lazy load heavy components
  - [ ] Minimize bundle size
- [ ] Accessibility audit (WCAG AA)
  - [ ] Color contrast 4.5:1 for text
  - [ ] All interactive elements keyboard accessible
  - [ ] Focus indicators visible
  - [ ] Screen reader labels correct
  - [ ] Semantic HTML used
- [ ] Browser compatibility
  - [ ] Test Chrome (latest 2 versions)
  - [ ] Test Firefox (latest 2 versions)
  - [ ] Test Safari (latest 2 versions)
  - [ ] Test Edge (latest 2 versions)
- [ ] Mobile testing
  - [ ] iOS Safari (iOS 14+)
  - [ ] Chrome Mobile (Android 10+)
  - [ ] Test on actual devices if possible
- [ ] Final polish
  - [ ] All animations smooth (60fps)
  - [ ] Loading states present
  - [ ] Error states helpful
  - [ ] Empty states encouraging
  - [ ] Success feedback clear
- [ ] Documentation
  - [ ] Update IMPLEMENTED_FEATURES.md
  - [ ] Mark completed in SUCCESS_METRICS.md
  - [ ] Update MASTER_INDEX.md
  - [ ] Add any new code comments

**Week 5 Deliverable Checklist:**
- [ ] All 4 user journeys pass completely
- [ ] All acceptance criteria met (17/17)
- [ ] No critical bugs
- [ ] Performance acceptable (<2s load time)
- [ ] WCAG AA compliant
- [ ] Works in all major browsers
- [ ] Mobile responsive
- [ ] Code documented
- [ ] Ready for stakeholder demo

---

## Week 6-7: Optional Enhancements (10 days)

**Note:** These are nice-to-have features. Only implement if time permits.

### Week 6: Polish & Enhancements (5 days)

#### Advanced Bubble Animations (2 days)

- [ ] Design particle burst effect
- [ ] Implement on bubble click
- [ ] Add trail effects during state changes
- [ ] Add sparkles on hover
- [ ] Add elaborate celebration sequences
- [ ] Test performance (maintain 60fps)
- [ ] Make animations age-appropriate

#### Sound Effects (1 day)

- [ ] Source or create sound files
  - [ ] Achievement unlock sound
  - [ ] Streak milestone sound
  - [ ] Correct answer ding
  - [ ] Encouragement chime
  - [ ] Button click pop
- [ ] Implement Web Audio API or Howler.js
- [ ] Add mute toggle in settings
- [ ] Ensure files <50KB each
- [ ] Test across devices

#### Mobile Optimization (2 days)

- [ ] Implement collapsible sidebars
- [ ] Create bottom navigation for mobile
- [ ] Ensure touch targets 44x44px minimum
- [ ] Add swipe gestures for navigation
- [ ] Optimize chat input for mobile keyboards
- [ ] Test on multiple screen sizes
- [ ] Test on physical devices (iPhone, Android)

### Week 7: Dark Mode (5 days) - Optional

- [ ] Design dark color palette
  - [ ] Background colors
  - [ ] Text colors
  - [ ] Border colors
  - [ ] Ensure WCAG AA contrast
- [ ] Create dark theme CSS variables
- [ ] Update all components with dark variants
- [ ] Create toggle switch in TopBar or settings
- [ ] Persist theme preference to profile
- [ ] Test all components in dark mode
- [ ] Smooth theme transition animations
- [ ] Test accessibility in dark mode

---

## 📝 Task Management

### Daily Standup Questions

At the start of each day, review:

1. **What did I complete yesterday?** - Check off finished tasks
2. **What will I work on today?** - Identify next tasks
3. **Any blockers?** - Note with ⚠️ emoji

### Weekly Review

At the end of each week:

1. **Update progress percentages** at top of document
2. **Mark deliverables complete** when all tasks done
3. **Document any scope changes** or new findings
4. **Update time estimates** based on actual effort
5. **Report status** to team/stakeholders

### Completion Criteria

A week is **complete** when:
- [ ] All tasks in that week checked off
- [ ] Deliverable checklist all ✅
- [ ] Code reviewed and merged
- [ ] Features documented
- [ ] No critical bugs

### Cross-References

- **Feature Specs:** [MISSING_FEATURES.md](./MISSING_FEATURES.md)
- **Detailed Tasks:** [MISSING_FEATURES_TASKS.md](./MISSING_FEATURES_TASKS.md)
- **Success Criteria:** [SUCCESS_METRICS.md](./SUCCESS_METRICS.md)
- **Testing Tasks:** [SUCCESS_METRICS_TASKS.md](./SUCCESS_METRICS_TASKS.md)

---

**Last Updated:** November 8, 2025
**Next Review:** Daily during development
**Total Estimated Time:** 4-6 weeks (critical features) + 2-3 weeks (optional)
