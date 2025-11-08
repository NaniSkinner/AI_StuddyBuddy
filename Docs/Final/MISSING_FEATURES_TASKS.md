# 📋 Missing Features - Implementation Tasks

**Last Updated:** November 8, 2025
**Total Estimated Time:** 7-10 days
**Reference:** [MISSING_FEATURES.md](./MISSING_FEATURES.md)

This document provides granular, executable tasks for all incomplete features in Phase 1 MVP.

---

## 📊 Progress Overview

- [ ] **Critical Feature A: Tutor Booking Interface UI** (0/18 tasks) - 2-3 days
- [ ] **Critical Feature B: Friend Connection UI Components** (0/25 tasks) - 3-4 days
- [ ] **Should Implement C: AI-Suggested Topic Switching** (0/10 tasks) - 1-2 days
- [ ] **Should Implement D: Conversation Export UI** (0/8 tasks) - 1 day

**Total Tasks:** 0/61 complete (0%)

---

## 🔴 Critical Feature A: Tutor Booking Interface UI

**Estimated Effort:** 2-3 days
**Priority:** HIGH
**Reference:** [MISSING_FEATURES.md - Section A](./MISSING_FEATURES.md#a-tutor-booking-interface-ui)

### A.1 Setup & Component Boilerplate (30 min)

- [ ] Create new file `app/components/BookingInterface.tsx`
- [ ] Set up TypeScript interface `BookingInterfaceProps`
  - [ ] Add `studentId: string`
  - [ ] Add `suggestedTutor: Tutor`
  - [ ] Add `suggestedTopic: string`
  - [ ] Add `strugglingConcepts: string[]`
  - [ ] Add `onClose: () => void`
  - [ ] Add `onBookingComplete: (bookingId: string) => void`
- [ ] Import required dependencies (Framer Motion, React hooks)
- [ ] Create functional component structure with state management

### A.2 Modal Overlay & Layout (1 hour)

- [ ] Implement modal backdrop with blur effect
  - [ ] Add `fixed inset-0 bg-black/50 backdrop-blur-sm`
  - [ ] Add click-outside-to-close functionality
  - [ ] Add escape key handler
- [ ] Create modal container with doodle styling
  - [ ] Use `max-w-2xl` on desktop, full-width on mobile
  - [ ] Add `border-2 rounded-2xl` sketch style
  - [ ] Add padding and margin
- [ ] Add modal entrance/exit animations
  - [ ] Slide in from bottom on mount
  - [ ] Fade out on unmount

### A.3 Tutor Profile Section (1.5 hours)

- [ ] Create tutor profile display area
  - [ ] Add tutor photo/avatar placeholder
    - [ ] Use initials if no photo available
    - [ ] Add `rounded-full border-2` styling
  - [ ] Display tutor name and title
    - [ ] Use `text-2xl font-bold` for name
    - [ ] Use `text-gray-600` for title
  - [ ] Create specialties badges
    - [ ] Map through `tutor.specialties` array
    - [ ] Use pill-style badges with colors
    - [ ] Add icons for subjects (📚, 🔢, 🔬)
  - [ ] Display bio (2-3 sentences)
    - [ ] Use `text-gray-700 text-sm`
    - [ ] Add line clamp if too long
  - [ ] Add success stats
    - [ ] Show "Helped X+ students" message
    - [ ] Add star rating or success icon

### A.4 Booking Form Fields (2 hours)

- [ ] Create topic input field
  - [ ] Pre-fill with `suggestedTopic` prop
  - [ ] Make editable (input or select dropdown)
  - [ ] Add label "What do you need help with?"
  - [ ] Add validation (required, min 3 chars)
- [ ] Create reason for booking section
  - [ ] Auto-populate with `strugglingConcepts` prop
  - [ ] Display as bulleted list or comma-separated
  - [ ] Add label "Why you're booking:"
  - [ ] Make read-only or lightly editable
- [ ] Create additional notes textarea (optional)
  - [ ] Add label "Anything else to share? (optional)"
  - [ ] Use `textarea` with 3-4 rows
  - [ ] Add character limit indicator (max 200 chars)
  - [ ] Style with doodle borders

### A.5 Time Slot Picker UI (3 hours)

- [ ] Fetch available slots from `tutor.availableSlots`
- [ ] Design time slot display (choose one approach):
  - [ ] **Option A: List View**
    - [ ] Display slots as clickable cards
    - [ ] Show date, time, duration for each slot
    - [ ] Highlight selected slot with border/background
  - [ ] **Option B: Calendar View**
    - [ ] Use calendar component (react-day-picker or custom)
    - [ ] Show available dates on calendar
    - [ ] Show time slots when date selected
- [ ] Implement slot selection logic
  - [ ] Store selected slot in state
  - [ ] Validate at least one slot selected
  - [ ] Show visual feedback on selection
- [ ] Handle no available slots edge case
  - [ ] Display "No available times" message
  - [ ] Offer to contact tutor directly
  - [ ] Disable booking button

### A.6 Action Buttons & Form Submission (1.5 hours)

- [ ] Create "Request Session" primary button
  - [ ] Use student's AI color from profile
  - [ ] Add `sketch-button` doodle styling
  - [ ] Disable if form invalid (no slot selected)
  - [ ] Show loading state during submission
- [ ] Create "Cancel" secondary button
  - [ ] Use `sketch-button--ghost` styling
  - [ ] Call `onClose()` prop on click
- [ ] Implement form validation
  - [ ] Check topic field not empty
  - [ ] Check time slot selected
  - [ ] Show validation errors inline
- [ ] Implement submit handler
  - [ ] Import `createBookingWithHandoff` from bookingService
  - [ ] Gather all form data (topic, reason, slot, notes)
  - [ ] Call booking service with parameters
  - [ ] Handle success response
  - [ ] Handle error response

### A.7 Confirmation State (1 hour)

- [ ] Create success confirmation UI
  - [ ] Show checkmark icon or animation
  - [ ] Display message: "Booking request sent to [Tutor Name]!"
  - [ ] Show booking ID (e.g., "Confirmation #12345")
  - [ ] Add "View Details" or "Close" button
- [ ] Implement auto-close timer
  - [ ] Start 3-second countdown on success
  - [ ] Show countdown indicator (optional)
  - [ ] Call `onBookingComplete(bookingId)` prop
  - [ ] Close modal automatically
- [ ] Add confetti or celebration animation (optional)
  - [ ] Trigger on successful booking
  - [ ] Use Framer Motion or Confetti component

### A.8 Integration with Struggle Detection (2 hours)

- [ ] Modify `app/learn/page.tsx`
  - [ ] Import `BookingInterface` component
  - [ ] Add state: `const [showBookingModal, setShowBookingModal] = useState(false)`
  - [ ] Add state: `const [bookingData, setBookingData] = useState(null)`
  - [ ] Create handler: `handleOpenBooking(data)`
- [ ] Listen for AI action triggers
  - [ ] Check AI response for `action.type === "suggest_booking"`
  - [ ] Extract `tutorId`, `topic`, `strugglingConcepts` from action
  - [ ] Fetch tutor data using `getTutorById(tutorId)`
  - [ ] Call `setBookingData()` and `setShowBookingModal(true)`
- [ ] Pass props to BookingInterface
  - [ ] `studentId={currentStudent.id}`
  - [ ] `suggestedTutor={tutorData}`
  - [ ] `suggestedTopic={bookingData.topic}`
  - [ ] `strugglingConcepts={bookingData.strugglingConcepts}`
  - [ ] `onClose={() => setShowBookingModal(false)}`
  - [ ] `onBookingComplete={(id) => handleBookingComplete(id)}`
- [ ] Test trigger flow
  - [ ] Simulate struggle detection (3 failed attempts)
  - [ ] Verify AI suggests booking
  - [ ] Verify modal opens with correct data

### A.9 AI Response Enhancement (1 hour)

- [ ] Modify `lib/services/aiService.ts`
  - [ ] Import `determineIntervention` from struggleDetectionService
  - [ ] Call intervention check after generating response
  - [ ] Check if intervention type is "tutor_suggestion"
- [ ] Add action metadata to response
  - [ ] Create action object with type, tutorId, topic, concepts
  - [ ] Append to AI response message
  - [ ] Return structured response with action field
- [ ] Update AI message rendering in chat
  - [ ] Check for `message.action` field
  - [ ] Trigger booking modal if action present
  - [ ] Display AI message normally

### A.10 Mobile Responsiveness (1 hour)

- [ ] Test on mobile viewport (375px width)
  - [ ] Modal should be full-width with padding
  - [ ] Form fields stack vertically
  - [ ] Touch targets min 44x44px
- [ ] Adjust time slot picker for mobile
  - [ ] Use list view instead of calendar on small screens
  - [ ] Make slots easily tappable
- [ ] Test keyboard behavior on mobile
  - [ ] Input fields scroll into view when focused
  - [ ] Virtual keyboard doesn't obscure form

### A.11 Error Handling & Edge Cases (1 hour)

- [ ] Handle booking service errors
  - [ ] Show error message if API fails
  - [ ] Allow retry without losing form data
  - [ ] Log error for debugging
- [ ] Handle missing tutor data
  - [ ] Show fallback tutor profile
  - [ ] Display generic booking form
- [ ] Handle no available slots
  - [ ] Show helpful message
  - [ ] Provide alternative action (contact support)
- [ ] Handle network errors
  - [ ] Show offline message
  - [ ] Save form data for retry

### A.12 Testing & Polish (1 hour)

- [ ] Test complete booking flow
  - [ ] From struggle detection to booking confirmation
  - [ ] Verify all data passes correctly
  - [ ] Check booking request created in service
- [ ] Test animations and transitions
  - [ ] Modal entrance smooth
  - [ ] Button hover effects work
  - [ ] Success state animates nicely
- [ ] Test accessibility
  - [ ] Tab through form with keyboard
  - [ ] Escape key closes modal
  - [ ] Focus management correct
- [ ] Code review and cleanup
  - [ ] Remove console.logs
  - [ ] Add TypeScript type safety
  - [ ] Add JSDoc comments

---

## 🔴 Critical Feature B: Friend Connection UI Components

**Estimated Effort:** 3-4 days
**Priority:** HIGH
**Reference:** [MISSING_FEATURES.md - Section B](./MISSING_FEATURES.md#b-friend-connection-ui-components)

### B.1 FriendList Component Setup (2 hours)

- [ ] Create `app/components/social/FriendList.tsx`
- [ ] Set up TypeScript interface `FriendListProps`
  - [ ] Add `studentId: string`
  - [ ] Add `onSendMessage: (friendId: string) => void`
- [ ] Import dependencies (studentService, React hooks)
- [ ] Create component structure with state management
  - [ ] State for friends list
  - [ ] State for loading status
  - [ ] State for errors

### B.2 Fetch Friend Data (1 hour)

- [ ] Implement data fetching logic
  - [ ] Get student data using `getStudentById(studentId)`
  - [ ] Extract `friendConnections` array from student
  - [ ] Fetch each friend's profile in parallel
  - [ ] Handle loading state
  - [ ] Handle errors gracefully
- [ ] Cache friend data to prevent re-fetching
- [ ] Set up refresh mechanism (pull-to-refresh or button)

### B.3 Friend Card Component (2 hours)

- [ ] Create individual friend card layout
  - [ ] Container with doodle card styling (rounded-xl, border)
  - [ ] Hover effect (scale slightly, shadow)
- [ ] Display friend avatar
  - [ ] Show initials if no photo
  - [ ] Use `rounded-full` with border
  - [ ] Add online status indicator (green dot - simulated)
- [ ] Display friend info
  - [ ] Name (bold, text-lg)
  - [ ] Grade level (text-sm, gray)
- [ ] Display current activity
  - [ ] Get current goal from friend profile
  - [ ] Show subject emoji + progress (e.g., "📚 Reading 68%")
  - [ ] Use progress bar or circular indicator
- [ ] Display streak indicator
  - [ ] Show "🔥 X-day streak" if active
  - [ ] Use friend's streak data
- [ ] Add "Send Message" button
  - [ ] Sketch button styling
  - [ ] Call `onSendMessage(friend.id)` on click
- [ ] Display last active timestamp
  - [ ] Format as "Active 2 hours ago"
  - [ ] Use `dateUtils.formatRelativeTime()`

### B.4 Friend List Display (1 hour)

- [ ] Map through friends array
  - [ ] Render FriendCard for each friend
  - [ ] Add key prop (friend.id)
  - [ ] Handle empty array gracefully
- [ ] Create empty state
  - [ ] Show when no friends exist
  - [ ] Display message: "No friends yet! Add friends to study together 🤝"
  - [ ] Add friendly illustration or icon
  - [ ] Show "Add Friend" button
- [ ] Add loading skeleton
  - [ ] Show while fetching friend data
  - [ ] Use animated placeholders
- [ ] Add search/filter (optional)
  - [ ] Filter by name
  - [ ] Filter by subject
  - [ ] Filter by online status

### B.5 Add Friend Button (30 min)

- [ ] Create "Add Friend" button
  - [ ] Sketch button primary styling
  - [ ] Icon: 👥 or + symbol
  - [ ] Position at top of friend list or in empty state
- [ ] Handle click event
  - [ ] Open FriendRequestManager modal
  - [ ] Pass callback to refresh friend list

### B.6 MessageSelector Component Setup (1 hour)

- [ ] Create `app/components/social/MessageSelector.tsx`
- [ ] Set up TypeScript interface `MessageSelectorProps`
  - [ ] Add `friendId: string`
  - [ ] Add `friendName: string`
  - [ ] Add `studentId: string`
  - [ ] Add `messagesSentToday: number`
  - [ ] Add `onClose: () => void`
  - [ ] Add `onMessageSent: () => void`
- [ ] Create component with modal overlay
  - [ ] Backdrop blur
  - [ ] Centered modal container
  - [ ] Doodle card styling

### B.7 Message Type Selection UI (1.5 hours)

- [ ] Create 3 message type cards
  - [ ] **Card 1: Send Encouragement** 🌟
    - [ ] Icon and label
    - [ ] Description: "Send a motivational message"
    - [ ] Click to select
  - [ ] **Card 2: Share Your Progress** 🎉
    - [ ] Icon and label
    - [ ] Description: "Tell them about your achievement"
    - [ ] Click to select
  - [ ] **Card 3: Study Together Challenge** 🤝
    - [ ] Icon and label
    - [ ] Description: "Challenge them to a learning race"
    - [ ] Click to select
- [ ] Style message type cards
  - [ ] Use grid layout (3 columns)
  - [ ] Color-coded borders (purple, green, orange)
  - [ ] Hover effects (scale, glow)
  - [ ] Selected state (thicker border, background highlight)
- [ ] Handle type selection
  - [ ] Store selected type in state
  - [ ] Show preview when type selected
  - [ ] Disable other cards when one selected

### B.8 AI Message Generation (2 hours)

- [ ] Implement message generation
  - [ ] Import `generateFriendMessage` from gamificationService
  - [ ] Call on type selection: `generateFriendMessage(studentId, friendId, messageType)`
  - [ ] Store generated message in state
  - [ ] Show loading indicator during generation
  - [ ] Handle errors (show fallback message)
- [ ] Create message preview bubble
  - [ ] Display AI-generated message
  - [ ] Use doodle message bubble styling
  - [ ] Match friend connection theme color
  - [ ] Show message in quotes or chat bubble
- [ ] Add "Regenerate" button
  - [ ] Icon: 🔄 or refresh symbol
  - [ ] Call `generateFriendMessage` again with same type
  - [ ] Replace current message with new one
  - [ ] Add loading state
  - [ ] Limit regenerations (max 3 per type)

### B.9 Daily Limit Counter (1 hour)

- [ ] Calculate messages sent today
  - [ ] Get student's message history from profile
  - [ ] Filter messages sent to this friend today
  - [ ] Count total (should be ≤ 3)
- [ ] Display limit counter
  - [ ] Show "X messages left today" (e.g., "2 messages left today")
  - [ ] Use visual indicator (3/3 ⭐⭐⭐ or progress bar)
  - [ ] Update in real-time as messages sent
- [ ] Handle at-limit state
  - [ ] Show warning: "You've reached your daily limit (3/3)"
  - [ ] Disable "Send Message" button
  - [ ] Show when limit resets ("Resets at midnight")
  - [ ] Prevent message generation if at limit
- [ ] Add countdown timer (optional)
  - [ ] Show time until midnight reset
  - [ ] Update every minute

### B.10 Send Message Functionality (1.5 hours)

- [ ] Create "Send Message" button
  - [ ] Use sketch button primary styling
  - [ ] Disable if no message generated
  - [ ] Disable if at daily limit (3/3)
  - [ ] Show loading state during send
- [ ] Implement send handler
  - [ ] Import `sendMessage` from gamificationService
  - [ ] Call: `sendMessage(studentId, friendId, generatedMessage)`
  - [ ] Check response for success
  - [ ] Handle 3/day limit enforcement from backend
  - [ ] Handle errors gracefully
- [ ] Show success confirmation
  - [ ] Display: "Message sent to [Friend Name]! 📨"
  - [ ] Show checkmark animation
  - [ ] Auto-close modal after 2 seconds
  - [ ] Call `onMessageSent()` callback
- [ ] Update friend list
  - [ ] Refresh friend data to show sent message
  - [ ] Update last interaction timestamp

### B.11 FriendRequestManager Component Setup (1 hour)

- [ ] Create `app/components/social/FriendRequestManager.tsx`
- [ ] Set up TypeScript interface `FriendRequestManagerProps`
  - [ ] Add `studentId: string`
  - [ ] Add `onClose: () => void`
  - [ ] Add `onFriendAdded: () => void`
- [ ] Create tabbed interface
  - [ ] Tab 1: "Search & Add"
  - [ ] Tab 2: "Pending Requests"
  - [ ] Tab 3: "My Friends"
  - [ ] Use tab state to switch views
- [ ] Style tabs
  - [ ] Active tab highlighted
  - [ ] Doodle underline or border
  - [ ] Smooth transitions

### B.12 Search & Add Tab (2 hours)

- [ ] Create search input
  - [ ] Text input with magnifying glass icon
  - [ ] Placeholder: "Search for friends by name..."
  - [ ] Debounce input (wait 300ms after typing)
- [ ] Implement search functionality
  - [ ] Get all students from `getAllStudents()`
  - [ ] Filter by name (case-insensitive)
  - [ ] Exclude current student
  - [ ] Exclude already-connected friends
  - [ ] Exclude pending requests
- [ ] Display search results
  - [ ] Show list of matching students
  - [ ] Display name, grade, avatar
  - [ ] Show "Send Friend Request" button for each
  - [ ] Empty state: "No students found"
- [ ] Implement send request
  - [ ] Import `sendFriendRequest` from gamificationService
  - [ ] Call on button click: `sendFriendRequest(studentId, targetStudentId)`
  - [ ] Show success message: "Friend request sent!"
  - [ ] Disable button after sending (prevent duplicates)
  - [ ] Update UI to show "Request Sent" status

### B.13 Pending Requests Tab (1.5 hours)

- [ ] Fetch incoming requests
  - [ ] Import `getFriendRequests` from gamificationService
  - [ ] Call on component mount and tab switch
  - [ ] Filter for requests with status "pending"
- [ ] Display request list
  - [ ] Show requester name, grade, avatar
  - [ ] Show request timestamp ("2 hours ago")
  - [ ] Show Accept and Decline buttons
  - [ ] Empty state: "No pending requests"
- [ ] Implement Accept action
  - [ ] Import `acceptFriendRequest` from gamificationService
  - [ ] Call on Accept click
  - [ ] Update both students' `friendConnections` arrays
  - [ ] Show success message: "You're now friends with [Name]!"
  - [ ] Remove request from list
  - [ ] Call `onFriendAdded()` callback
- [ ] Implement Decline action
  - [ ] Import `declineFriendRequest` from gamificationService (if exists)
  - [ ] Call on Decline click
  - [ ] Remove request from list
  - [ ] Show subtle confirmation

### B.14 My Friends Tab (1 hour)

- [ ] Fetch connected friends
  - [ ] Use same logic as FriendList component
  - [ ] Get friends from student.friendConnections
- [ ] Display friend list
  - [ ] Reuse FriendCard component
  - [ ] Show activity status
  - [ ] Add "Send Message" quick action
- [ ] Add "Send Message" quick action
  - [ ] Small button on each friend card
  - [ ] Opens MessageSelector modal
  - [ ] Pre-fills with friend data
- [ ] Show empty state
  - [ ] "You don't have any friends yet"
  - [ ] Link to Search & Add tab

### B.15 Main App Integration (2 hours)

- [ ] Modify `app/learn/page.tsx`
  - [ ] Import FriendList and MessageSelector components
  - [ ] Add state for showing friend UI
  - [ ] Add state for selected friend
- [ ] **Option A: Sidebar Tab Implementation**
  - [ ] Add "Friends" tab to TaskSidebar
  - [ ] Create toggle between "Tasks" and "Friends" views
  - [ ] Add icon: 👥 with notification badge
  - [ ] Show badge count for pending requests
  - [ ] Implement tab switching logic
  - [ ] Render FriendList when Friends tab active
- [ ] **Option B: Top Navigation Tab**
  - [ ] Add "Social" to TopBar navigation
  - [ ] Create new route `/social`
  - [ ] Create `app/social/page.tsx`
  - [ ] Render FriendList as main content
- [ ] Wire up MessageSelector
  - [ ] Handle "Send Message" button clicks
  - [ ] Open MessageSelector modal with friend data
  - [ ] Handle modal close
  - [ ] Refresh friend list after message sent

### B.16 Achievement Integration (1 hour)

- [ ] Check for "Social Butterfly" achievement
  - [ ] Import `checkAndUnlockAchievements` from achievementService
  - [ ] Call after successful message send
  - [ ] Pass student data and trigger type
- [ ] Track message count
  - [ ] Count total friend messages sent
  - [ ] Check if count reaches 5
  - [ ] Unlock "Social Butterfly" badge
- [ ] Display unlock notification
  - [ ] Use existing UnlockNotification component
  - [ ] Show confetti animation
  - [ ] Display badge with celebration message
  - [ ] Update badge collection

### B.17 Loading & Error States (1 hour)

- [ ] Add loading states
  - [ ] Skeleton loaders for friend cards
  - [ ] Spinner for message generation
  - [ ] Loading button state during send
- [ ] Add error handling
  - [ ] Network error: "Couldn't load friends. Try again."
  - [ ] Message generation error: "Couldn't generate message. Try refreshing."
  - [ ] Send error: "Message failed to send. Please retry."
  - [ ] Friend request error: "Request failed. Try again."
- [ ] Add retry mechanisms
  - [ ] Retry button for failed operations
  - [ ] Automatic retry with exponential backoff (optional)
- [ ] Add empty states
  - [ ] No friends: "Add friends to get started!"
  - [ ] No pending requests: "No new friend requests"
  - [ ] No search results: "No students found matching '[query]'"

### B.18 Mobile Responsiveness (1.5 hours)

- [ ] Test FriendList on mobile
  - [ ] Friend cards stack vertically
  - [ ] Touch targets are 44x44px minimum
  - [ ] Horizontal scrolling for long names
- [ ] Test MessageSelector on mobile
  - [ ] Modal full-screen on small devices
  - [ ] Message type cards stack on small screens
  - [ ] Preview bubble readable and scrollable
- [ ] Test FriendRequestManager on mobile
  - [ ] Tabs easily tappable
  - [ ] Search results scrollable
  - [ ] Request cards well-spaced
- [ ] Test in sidebar integration
  - [ ] Sidebar width responsive
  - [ ] Collapsible on mobile
  - [ ] Swipe gesture to close (optional)

### B.19 Design Polish (1 hour)

- [ ] Apply consistent doodle styling
  - [ ] Rounded corners (rounded-xl)
  - [ ] Hand-drawn borders (border-2)
  - [ ] Playful shadows on hover
- [ ] Color-code message types
  - [ ] Encouragement: Purple (#A685E2)
  - [ ] Milestone: Green (#7FD8BE)
  - [ ] Challenge: Orange (#FF9671)
- [ ] Add micro-animations
  - [ ] Friend card entrance stagger
  - [ ] Message bubble fade-in
  - [ ] Button hover effects
  - [ ] Success checkmark animation
- [ ] Polish empty states
  - [ ] Add friendly illustrations
  - [ ] Use encouraging copy
  - [ ] Make CTAs prominent

### B.20 Testing & QA (1.5 hours)

- [ ] Test complete friend connection flow
  - [ ] Search and send friend request
  - [ ] Accept request from other side
  - [ ] Send message (all 3 types)
  - [ ] Verify 3/day limit enforced
  - [ ] Unlock Social Butterfly achievement
- [ ] Test edge cases
  - [ ] No friends scenario
  - [ ] At limit (3/3 messages)
  - [ ] Duplicate request prevention
  - [ ] Network failures
- [ ] Test across age groups
  - [ ] Lucas (9) can use feature
  - [ ] Eva (12) can use feature
  - [ ] Pat (16) can use feature
- [ ] Accessibility testing
  - [ ] Keyboard navigation works
  - [ ] Screen reader labels correct
  - [ ] Focus management in modals
- [ ] Code review
  - [ ] Remove debug logs
  - [ ] Add TypeScript types
  - [ ] Add JSDoc comments
  - [ ] Optimize re-renders

---

## 🟡 Should Implement C: AI-Suggested Topic Switching

**Estimated Effort:** 1-2 days
**Priority:** MEDIUM
**Reference:** [MISSING_FEATURES.md - Section C](./MISSING_FEATURES.md#c-ai-suggested-topic-switching-triggers)

### C.1 Detection Logic Setup (1 hour)

- [ ] Open `lib/services/aiService.ts`
- [ ] Create TypeScript interface `TopicSwitchSuggestion`
  - [ ] `shouldSuggest: boolean`
  - [ ] `suggestedSubject: string`
  - [ ] `suggestedGoalId: string`
  - [ ] `reason: string`
  - [ ] `currentSubject: string`
- [ ] Create function skeleton `shouldSuggestTopicSwitch()`
  - [ ] Parameters: `student: Student, currentGoalId: string, conversationDuration: number`
  - [ ] Return type: `TopicSwitchSuggestion`

### C.2 Trigger 1: Time-Based Detection (1 hour)

- [ ] Implement 30-minute session check
  - [ ] Check if `conversationDuration >= 30` minutes
  - [ ] Get current goal from student.goals
  - [ ] Find other goals (exclude current)
- [ ] Select suggested topic
  - [ ] Get first available alternative goal
  - [ ] Or use round-robin selection
  - [ ] Or prioritize lowest progress goal
- [ ] Build suggestion object
  - [ ] Set `shouldSuggest: true`
  - [ ] Set `suggestedSubject` to alternative goal subject
  - [ ] Set `suggestedGoalId` to alternative goal id
  - [ ] Set `reason`: "We've been doing [current] for a while. Want to switch to [suggested]?"
  - [ ] Set `currentSubject`
- [ ] Test with mock data
  - [ ] Simulate 30-minute conversation
  - [ ] Verify suggestion triggers
  - [ ] Verify correct goal suggested

### C.3 Trigger 2: Progress-Based Detection (1.5 hours)

- [ ] Implement 85% completion check
  - [ ] Check if `currentGoal.progress >= 85`
  - [ ] Import `getSubjectRecommendations` from recommendationService
  - [ ] Call recommendation service with student id
- [ ] Handle recommendations
  - [ ] Check if recommendations array has items
  - [ ] Get top recommendation (index 0)
  - [ ] Extract subject and reason from recommendation
- [ ] Build suggestion object
  - [ ] Set `shouldSuggest: true`
  - [ ] Set `suggestedSubject` from recommendation
  - [ ] Set `suggestedGoalId` from recommendation
  - [ ] Set `reason` from recommendation service
  - [ ] Set `currentSubject`
- [ ] Test with mock data
  - [ ] Set goal progress to 90%
  - [ ] Verify recommendation service called
  - [ ] Verify correct subject suggested

### C.4 Trigger 3: Balance-Based Detection (1.5 hours)

- [ ] Calculate progress gap
  - [ ] Get all goal progress percentages
  - [ ] Find max progress: `Math.max(...student.goals.map(g => g.progress))`
  - [ ] Find min progress: `Math.min(...student.goals.map(g => g.progress))`
  - [ ] Calculate gap: `maxProgress - minProgress`
- [ ] Check trigger conditions
  - [ ] Check if `progressGap > 30`
  - [ ] Check if `currentGoal.progress > 60` (don't interrupt struggling student)
  - [ ] Find lagging goal (goal with min progress)
- [ ] Build suggestion object
  - [ ] Set `shouldSuggest: true`
  - [ ] Set `suggestedSubject` to lagging goal subject
  - [ ] Set `suggestedGoalId` to lagging goal id
  - [ ] Set `reason`: "Let's give [lagging subject] some attention too!"
  - [ ] Set `currentSubject`
- [ ] Test with mock data
  - [ ] Set goals with 40% gap (e.g., 80% and 40%)
  - [ ] Verify suggestion triggers for lagging subject

### C.5 Cooldown Logic (1 hour)

- [ ] Create cooldown storage mechanism
  - [ ] Use session storage or state
  - [ ] Store: `lastSuggestionTimestamp`
  - [ ] Store: `suggestionsDeclinedThisSession`
- [ ] Check cooldown before suggesting
  - [ ] Get current timestamp
  - [ ] Calculate time since last suggestion
  - [ ] Return early if < 15 minutes elapsed
- [ ] Respect declined suggestions
  - [ ] Track declined suggestions in session
  - [ ] Don't re-suggest same topic in current session
  - [ ] Clear on session end or topic switch
- [ ] Test cooldown
  - [ ] Trigger suggestion
  - [ ] Attempt to trigger again within 15 min
  - [ ] Verify second suggestion blocked

### C.6 Integration in Chat Flow (2 hours)

- [ ] Open `app/learn/page.tsx`
- [ ] Add state for topic switch suggestion
  - [ ] `const [topicSwitchSuggestion, setTopicSwitchSuggestion] = useState<TopicSwitchSuggestion | null>(null)`
- [ ] Add state for session tracking
  - [ ] `const [sessionStartTime] = useState(Date.now())`
- [ ] Import `shouldSuggestTopicSwitch` function
- [ ] Add check in message handler
  - [ ] After AI responds, calculate conversation duration
  - [ ] `const duration = (Date.now() - sessionStartTime) / 1000 / 60`
  - [ ] Call `shouldSuggestTopicSwitch(student, currentGoalId, duration)`
  - [ ] If `shouldSuggest === true`, set state: `setTopicSwitchSuggestion(suggestion)`
- [ ] Handle suggestion state changes
  - [ ] Show AISuggestedSwitch component when state not null
  - [ ] Clear state on user action (accept or decline)

### C.7 Display Suggestion UI (1 hour)

- [ ] Verify AISuggestedSwitch component exists
  - [ ] Check `app/components/TopicSwitcher.tsx`
  - [ ] Verify it has `AISuggestedSwitch` sub-component
- [ ] Render suggestion conditionally
  - [ ] Add JSX: `{topicSwitchSuggestion && <AISuggestedSwitch ... />}`
  - [ ] Position above chat input or in banner area
- [ ] Pass props to component
  - [ ] `suggestedSubject={topicSwitchSuggestion.suggestedSubject}`
  - [ ] `reason={topicSwitchSuggestion.reason}`
  - [ ] `onAccept={handleAcceptSwitch}`
  - [ ] `onDecline={handleDeclineSwitch}`
- [ ] Style suggestion banner
  - [ ] Use doodle card styling
  - [ ] Add gentle pulsing animation (optional)
  - [ ] Make dismissible with X button

### C.8 Handle Accept/Decline Actions (1 hour)

- [ ] Implement `handleAcceptSwitch`
  - [ ] Get suggested goal id from state
  - [ ] Call existing topic switch function: `handleSwitchTopic(suggestedGoalId)`
  - [ ] Update current goal context
  - [ ] AI acknowledges switch: "Great! Let's work on [New Subject] now."
  - [ ] Clear suggestion state: `setTopicSwitchSuggestion(null)`
  - [ ] Log acceptance for analytics
- [ ] Implement `handleDeclineSwitch`
  - [ ] Clear suggestion state: `setTopicSwitchSuggestion(null)`
  - [ ] Add to declined list (prevent re-suggestion)
  - [ ] AI acknowledges: "No problem! Let's keep going with [Current Subject]."
  - [ ] Log decline for analytics
- [ ] Test both flows
  - [ ] Verify accept switches topic correctly
  - [ ] Verify decline dismisses suggestion
  - [ ] Verify conversation continues smoothly

### C.9 Testing & Tuning (1.5 hours)

- [ ] Test time-based trigger
  - [ ] Start conversation
  - [ ] Wait/simulate 30 minutes
  - [ ] Verify suggestion appears
  - [ ] Test different goal combinations
- [ ] Test progress-based trigger
  - [ ] Set goal to 90% progress
  - [ ] Complete a task
  - [ ] Verify recommendation service called
  - [ ] Verify suggestion appears with reason
- [ ] Test balance-based trigger
  - [ ] Create imbalanced progress (80% vs 30%)
  - [ ] Work on high-progress goal
  - [ ] Verify suggestion for low-progress goal
- [ ] Test cooldown mechanism
  - [ ] Trigger suggestion
  - [ ] Decline or accept
  - [ ] Verify no re-suggestion within 15 minutes
  - [ ] Verify new suggestion after cooldown
- [ ] Tune thresholds
  - [ ] Adjust 30-minute threshold if needed
  - [ ] Adjust 85% progress threshold if needed
  - [ ] Adjust 30% gap threshold if needed
  - [ ] Adjust 15-minute cooldown if needed
- [ ] Test edge cases
  - [ ] Student with only 1 goal (no alternatives)
  - [ ] All goals at same progress (no imbalance)
  - [ ] Multiple triggers at once (which wins?)

### C.10 Polish & Documentation (30 min)

- [ ] Add TypeScript types
  - [ ] Ensure all parameters typed
  - [ ] Ensure return types explicit
- [ ] Add JSDoc comments
  - [ ] Document function purpose
  - [ ] Document parameters
  - [ ] Document return value
  - [ ] Add usage examples
- [ ] Code review
  - [ ] Remove console.logs
  - [ ] Optimize performance (memoization if needed)
  - [ ] Check for edge cases
- [ ] Update documentation
  - [ ] Add to IMPLEMENTED_FEATURES.md (move from MISSING)
  - [ ] Document in code comments
  - [ ] Note in SUCCESS_METRICS.md as complete

---

## 🟡 Should Implement D: Conversation Export UI

**Estimated Effort:** 1 day
**Priority:** MEDIUM
**Reference:** [MISSING_FEATURES.md - Section D](./MISSING_FEATURES.md#d-conversation-export-ui-for-parentstutors)

### D.1 Add Export Button to TopBar (30 min)

- [ ] Open `app/components/TopBar.tsx`
- [ ] Import required dependencies (Framer Motion)
- [ ] Add state: `const [showExportModal, setShowExportModal] = useState(false)`
- [ ] Add export button to navigation
  - [ ] Use `motion.button` from Framer Motion
  - [ ] Add icon: 📥 or download icon
  - [ ] Add label: "Export Conversations"
  - [ ] Use `sketch-button--ghost` styling
  - [ ] Add hover animation: `whileHover={{ scale: 1.05 }}`
  - [ ] Click handler: `onClick={() => setShowExportModal(true)}`
- [ ] Position button appropriately
  - [ ] Place in TopBar near settings/logout
  - [ ] Ensure visible on desktop and mobile

### D.2 Create ExportConversationModal Component (1 hour)

- [ ] Create `app/components/ExportConversationModal.tsx`
- [ ] Set up TypeScript interface `ExportConversationModalProps`
  - [ ] Add `studentId: string`
  - [ ] Add `studentName: string`
  - [ ] Add `onClose: () => void`
- [ ] Import dependencies
  - [ ] Import `exportStudentConversations` from safetyService
  - [ ] Import Framer Motion
  - [ ] Import React hooks (useState, useEffect)
- [ ] Create component structure
  - [ ] Modal backdrop with blur
  - [ ] Modal container with max-w-lg
  - [ ] Doodle card styling (border-2, rounded-2xl)
- [ ] Add close button
  - [ ] X button in top-right corner
  - [ ] Escape key handler
  - [ ] Click outside to close

### D.3 Date Range Selector (1.5 hours)

- [ ] Add state for date range
  - [ ] `const [startDate, setStartDate] = useState(null)`
  - [ ] `const [endDate, setEndDate] = useState(null)`
- [ ] Create date picker inputs
  - [ ] Use HTML5 input type="date"
  - [ ] Label: "Start Date" and "End Date"
  - [ ] Style with doodle borders
  - [ ] Set default values (e.g., last 30 days)
- [ ] Add preset buttons
  - [ ] "Last 7 days" button
    - [ ] Click sets startDate to 7 days ago, endDate to today
  - [ ] "Last 30 days" button
    - [ ] Click sets startDate to 30 days ago, endDate to today
  - [ ] "All time" button
    - [ ] Click clears date filters (exports everything)
- [ ] Validate date range
  - [ ] Ensure startDate <= endDate
  - [ ] Show error if invalid range
  - [ ] Disable export button if invalid

### D.4 Export Options Toggles (1 hour)

- [ ] Add state for export options
  - [ ] `const [format, setFormat] = useState('json')` // 'json' or 'csv'
  - [ ] `const [includeOnlyFlagged, setIncludeOnlyFlagged] = useState(false)`
  - [ ] `const [includeAIResponses, setIncludeAIResponses] = useState(true)`
  - [ ] `const [includeMetadata, setIncludeMetadata] = useState(true)`
- [ ] Create format selector
  - [ ] Radio buttons or toggle for JSON vs CSV
  - [ ] Label: "Export Format"
  - [ ] Default to JSON
- [ ] Create toggle switches
  - [ ] **Toggle 1:** "Include only flagged messages"
    - [ ] Doodle-styled toggle switch
    - [ ] Tooltip: "Export only messages flagged for review"
  - [ ] **Toggle 2:** "Include AI responses"
    - [ ] Default ON
    - [ ] Tooltip: "Include AI's messages in export"
  - [ ] **Toggle 3:** "Include session metadata"
    - [ ] Default ON
    - [ ] Tooltip: "Include timestamps, session IDs, etc."
- [ ] Style toggles
  - [ ] Use doodle styling (rounded borders)
  - [ ] Animated transition on toggle
  - [ ] Clear labels and tooltips

### D.5 Preview Section (1.5 hours)

- [ ] Add state for preview data
  - [ ] `const [previewData, setPreviewData] = useState(null)`
  - [ ] `const [isLoadingPreview, setIsLoadingPreview] = useState(false)`
- [ ] Fetch conversation data on modal open
  - [ ] Call `exportStudentConversations(studentId)`
  - [ ] Store in state
  - [ ] Show loading spinner during fetch
- [ ] Filter data by date range
  - [ ] Filter conversations where timestamp >= startDate && <= endDate
  - [ ] Update preview when date range changes
- [ ] Apply export options to preview
  - [ ] If `includeOnlyFlagged`, filter to flagged messages
  - [ ] If `!includeAIResponses`, filter out AI messages
  - [ ] If `!includeMetadata`, remove metadata fields from preview
- [ ] Display preview statistics
  - [ ] Show count: "X messages from Y conversations"
  - [ ] If flagged filter on, show: "Z flagged messages"
  - [ ] Show date range: "From [start] to [end]"
- [ ] Create scrollable preview area
  - [ ] Show first 5-10 messages as sample
  - [ ] Use doodle card for each message
  - [ ] Show timestamp, speaker, message preview
  - [ ] Add "..." if more messages exist
- [ ] Handle no data case
  - [ ] Show message: "No conversations found for selected dates"
  - [ ] Disable export button

### D.6 Download Functionality (2 hours)

- [ ] Create export handler function `handleExport`
- [ ] Get conversation data
  - [ ] Use data from `exportStudentConversations(studentId)`
  - [ ] Apply date range filter
  - [ ] Apply export option filters
- [ ] Format data based on selection
  - [ ] **If JSON:**
    - [ ] Use `JSON.stringify(data, null, 2)` for pretty print
    - [ ] Set MIME type: `application/json`
  - [ ] **If CSV:**
    - [ ] Convert JSON to CSV format
    - [ ] Headers: timestamp, speaker, message, flagged, sessionId
    - [ ] Escape special characters (quotes, commas)
    - [ ] Set MIME type: `text/csv`
- [ ] Generate filename
  - [ ] Format: `student-[name]-conversations-[date].json` or `.csv`
  - [ ] Example: `student-lucas-conversations-2025-11-08.json`
  - [ ] Use student name from props
  - [ ] Use current date: `new Date().toISOString().split('T')[0]`
- [ ] Create download blob
  - [ ] `const blob = new Blob([formattedData], { type: mimeType })`
  - [ ] Create object URL: `URL.createObjectURL(blob)`
- [ ] Trigger download
  - [ ] Create temporary `<a>` element
  - [ ] Set href to blob URL
  - [ ] Set download attribute to filename
  - [ ] Programmatically click: `a.click()`
  - [ ] Clean up: `URL.revokeObjectURL(url)`
- [ ] Show success feedback
  - [ ] Display toast: "Conversations exported successfully!"
  - [ ] Or show checkmark in modal
  - [ ] Auto-close modal after 2 seconds (optional)

### D.7 Error Handling (1 hour)

- [ ] Handle fetch errors
  - [ ] Try-catch around `exportStudentConversations` call
  - [ ] Show error message: "Failed to load conversations"
  - [ ] Provide retry button
- [ ] Handle export errors
  - [ ] Try-catch around download logic
  - [ ] Show error message: "Export failed. Please try again."
  - [ ] Log error for debugging
- [ ] Handle edge cases
  - [ ] No conversations for student (show friendly message)
  - [ ] Empty date range (no conversations in range)
  - [ ] Network timeout (show timeout message)
  - [ ] Browser doesn't support download (show manual copy option)
- [ ] Add loading states
  - [ ] Disable export button during download
  - [ ] Show spinner on button
  - [ ] Prevent multiple simultaneous exports

### D.8 Testing & Polish (1 hour)

- [ ] Test export button in TopBar
  - [ ] Verify modal opens on click
  - [ ] Verify button visible on all pages
- [ ] Test date range selection
  - [ ] Select "Last 7 days" preset
  - [ ] Select "Last 30 days" preset
  - [ ] Select "All time" preset
  - [ ] Manually select custom date range
  - [ ] Verify invalid range rejected
- [ ] Test export options
  - [ ] Toggle each option on/off
  - [ ] Verify preview updates
  - [ ] Verify export reflects options
- [ ] Test JSON export
  - [ ] Export conversations
  - [ ] Open exported file
  - [ ] Verify JSON is valid and readable
  - [ ] Verify data structure correct
- [ ] Test CSV export
  - [ ] Export conversations as CSV
  - [ ] Open in spreadsheet app
  - [ ] Verify columns correct
  - [ ] Verify data escaped properly
- [ ] Test with different students
  - [ ] Lucas (high engagement, many messages)
  - [ ] Mia (low engagement, few messages)
  - [ ] Eva (moderate engagement)
- [ ] Test accessibility
  - [ ] Tab through all controls
  - [ ] Escape key closes modal
  - [ ] Screen reader announces labels
- [ ] Polish UI
  - [ ] Consistent doodle styling
  - [ ] Smooth animations
  - [ ] Clear labels and instructions
  - [ ] Success toast styled nicely

---

## 📝 Task Management Guidelines

### How to Use This File

1. **Pick a Feature** - Start with Critical features (A, B), then Should Implement (C, D)
2. **Check Dependencies** - Some tasks depend on others being complete first
3. **Mark Progress** - Check off `[x]` tasks as you complete them
4. **Update Estimates** - Adjust time estimates based on actual effort
5. **Report Blockers** - Note any blockers with ⚠️ emoji
6. **Cross-Reference** - Link to MISSING_FEATURES.md for detailed specs

### Progress Tracking

Update the Progress Overview at the top as you complete tasks:

```markdown
- [x] **Critical Feature A: Tutor Booking Interface UI** (18/18 tasks) ✅ - 2-3 days
```

### Completion Criteria

A feature is **complete** when:
- [x] All tasks checked off
- [x] Code reviewed and approved
- [x] Tests passing (manual or automated)
- [x] Feature documented in IMPLEMENTED_FEATURES.md
- [x] Acceptance criteria met in SUCCESS_METRICS.md

---

**Last Updated:** November 8, 2025
**Next Review:** After completing each feature
**Related Documents:**
- [MISSING_FEATURES.md](./MISSING_FEATURES.md) - Feature specifications
- [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) - Week-by-week plan
- [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) - Acceptance criteria
