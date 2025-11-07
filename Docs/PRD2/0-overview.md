# 🎯 AI Study Companion - Project Overview

**PRD v3 - Shard 1 of 12**

---

## 📖 Document Information

**Version:** 3.0 (Consolidated)  
**Last Updated:** November 6, 2025  
**Status:** Ready for Phase 2 Implementation  
**Phase:** Building on completed Phase 1 foundation

---

## 🎯 Executive Summary

The **AI Study Companion** is a persistent, context-aware tutoring assistant that bridges the gap between human tutoring sessions. Building upon a completed Phase 1 foundation with functional UI and data structures, Phase 2 focuses on:

1. **Complete UI/UX transformation** to a playful, hand-drawn doodle aesthetic
2. **Implementation of 3 missing core systems**: Authentication, Onboarding, Achievements
3. **OpenAI integration verification and enhancement** with proper context management
4. **Feature completeness audit** to ensure all PRD v1 requirements are met
5. **Performance optimization** for all-device compatibility

---

## 📊 Primary Objectives

### Retention

Reduce 52% churn rate to <30% through engagement mechanics

### Engagement

Increase average session duration to 15+ minutes

### Delight

Transform learning into a playful, curiosity-driven adventure

### Accessibility

Support ages 9-16 with age-appropriate adaptations

---

## 📍 Current State Assessment

### ✅ Phase 1 Completed (Existing)

- [x] Project setup (Next.js 14, TypeScript, Tailwind CSS)
- [x] Three-column layout structure (Progress, Chat, Tasks)
- [x] Mock data architecture (students, tutors, sessions)
- [x] Service layer foundation (studentService, tutorService, etc.)
- [x] Progress tracking UI with sub-concepts
- [x] Task sidebar with status indicators
- [x] Streak counter (visual display)
- [x] Chat interface shell
- [x] Basic component library (buttons, cards, inputs)
- [x] Student selection/switching
- [x] Topic/subject management

### ⚠️ Phase 1 Gaps (To Be Completed in Phase 2)

- [ ] **Authentication/Login system** - Not implemented
- [ ] **Onboarding flow** - Not implemented
- [ ] **Achievement system** - Not implemented
- [ ] **OpenAI integration** - Built but needs API keys + verification
- [ ] **Conversation context management** - Needs verification
- [ ] **Task generation logic** - Needs verification
- [ ] **Nudge system triggers** - Needs verification
- [ ] **Friend messaging** - Needs verification
- [ ] **Tutor booking flow** - Needs verification

### 🎨 Design Transformation

**Current State:** Clean, modern, corporate aesthetic

- Standard rounded rectangles
- Gradient backgrounds (purple AI bubble)
- Traditional progress bars
- Standard fonts and spacing
- Minimal animations
- Professional color scheme

**Target State:** Playful, hand-drawn doodle aesthetic

- Sketchy borders and organic shapes
- Hand-lettered typography
- Animated mascot character
- Vibrant, warm color palette
- Bouncy, delightful animations
- Whimsical decorative elements

---

## 👥 User Profiles

### Student Personas

| User      | Age | Grade | Focus Areas                       | Engagement Pattern          | UI Adaptation                                                |
| --------- | --- | ----- | --------------------------------- | --------------------------- | ------------------------------------------------------------ |
| **Lucas** | 9   | 4th   | Elementary Math, Science          | High engagement             | Sub-concept tracking, simple language, lots of encouragement |
| **Eva**   | 12  | 7th   | Reading, Writing, History         | Moderate engagement         | Balanced detail, metacognition prompts                       |
| **Pat**   | 16  | 11th  | SAT Prep, College Essays, AP Calc | Goal-driven                 | Percentage tracking, academic tone, planning focus           |
| **Mia**   | 14  | 9th   | Algebra II, Biology               | Low engagement (churn risk) | Retention nudges, celebration-first messaging                |

### Tutor Profiles

- **Dr. Sarah Chen** - Math & Science specialist
- **Mr. James Rodriguez** - English & SAT Prep
- **Ms. Aisha Patel** - STEM subjects (Algebra, Biology, Chemistry)

### Mock Data Specifications

- **4 student profiles** with full history
- **3 tutors** with specialties and bios
- **6 sessions per student** (24 total sessions)
- **14-day activity timeline** for retention simulation
- **Full dialogue transcripts** for each session
- **Progress data** with realistic struggle points

---

## 🏗️ Technology Stack

### Core Technologies

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS (extended with custom doodle config)
- **Animations:** Framer Motion (primary) + roughjs (special illustrations)
- **AI:** OpenAI API (GPT-4) with context window management
- **State:** React Context or Zustand for global state
- **Data:** Local JSON files with service layer (Phase 1)
- **Deployment:** Vercel for demo

### Design & Asset Tools

- **Fonts:** Google Fonts (Caveat, Patrick Hand, Indie Flower, Comic Neue)
- **Illustrations:** Curated free/premium doodle packs
  - Blush Design, unDraw, DrawKit, Humaaans
- **Icons:** Doodle icon sets from Noun Project, Iconfinder
- **Animations:** LottieFiles + custom Framer Motion variants
- **Hand-drawn Graphics:** roughjs library for authentic sketchy elements

### Architecture Principles

1. **Service Layer Pattern** - Clean APIs ready for backend migration
2. **TypeScript Everywhere** - Type safety across all components
3. **Component Modularity** - Reusable, themeable components
4. **Performance First** - 60fps animations on all target devices
5. **Progressive Enhancement** - Works on low-end devices
6. **Accessibility Built-in** - WCAG 2.1 AA compliance

---

## 🎨 Design Philosophy

### Visual Inspiration

- **Khanmigo** - Hand-drawn, whimsical, child-friendly
- **Khan Academy Kids** - Illustrated education materials
- **Duolingo** - Playful character animations
- **Scratch** - Creative journaling, imperfect lines

### Core Design Principles

**1. Playful but Purposeful**
Whimsy supports learning, doesn't distract. Every decorative element has a reason.

**2. Hand-drawn Authenticity**
Imperfect lines, organic shapes. Nothing feels machine-generated or sterile.

**3. Warm and Inviting**
Colors that feel friendly, not corporate. Spaces that welcome exploration.

**4. Age-appropriate Flexibility**
Can feel young for 9-year-olds or mature for 16-year-olds based on context.

**5. Accessible Contrast**
Fun colors that still meet WCAG standards. Beauty doesn't compromise usability.

---

## 📈 Success Metrics

### Primary Metrics

| Metric                           | Baseline | Phase 2 Goal  | Measurement                             |
| -------------------------------- | -------- | ------------- | --------------------------------------- |
| Retention rate post-goal         | 48%      | 68% (+20%)    | % continuing after initial goal         |
| Avg. sessions per user (30 days) | 2.1      | 3.0+          | Mean sessions across active students    |
| Churn risk mitigation            | N/A      | 30% reduction | % at-risk students reaching 3+ sessions |

### Secondary Metrics

| Metric                | Goal              | Measurement                      |
| --------------------- | ----------------- | -------------------------------- |
| Learning improvement  | +15%              | Time spent × correct answer rate |
| Engagement (messages) | Increase WoW      | Total AI interactions per week   |
| Friend connections    | 25% of users      | % students with ≥1 friend        |
| Task completion rate  | 70%+              | Completed / assigned tasks       |
| Streak achievement    | 40% achieve 3-day | % students with ≥3 day streak    |

### Design Quality Metrics

| Metric                | Target        | Measurement                |
| --------------------- | ------------- | -------------------------- |
| Usability score       | 4+ stars      | User testing feedback      |
| Visual appeal         | 85%+ positive | Design satisfaction survey |
| Load time             | < 2 seconds   | Lighthouse performance     |
| Animation performance | 60fps desktop | FPS monitoring             |
| Accessibility         | WCAG AA       | Automated + manual audit   |

---

## 🗺️ Phase 2 Scope Summary

### Week 1: Foundation + Critical Systems

- Design system setup (colors, fonts, animations)
- Authentication & login
- Onboarding flow (4 steps)
- Achievement system (12 badges)
- OpenAI integration enhancement

### Week 2: Core Features + UI Polish

- Task generation (3 types)
- Nudge system (churn detection)
- Streak system (dual tracking)
- Component redesign (batch 1 & 2)
- Integration testing

### Week 3: Social Features + Final Polish

- Friend connections
- Tutor booking system
- Topic switching
- Asset integration
- User acceptance testing
- Stakeholder demo prep

---

## 💡 Key Architectural Decisions

### 1. Tailwind + Framer Motion

**Rationale:** Balance of development speed (Tailwind) and animation quality (Framer Motion)

### 2. roughjs for Special Illustrations Only

**Rationale:** CSS for UI elements (performance), roughjs for authentic hand-drawn special cases

### 3. Pre-made Doodle Asset Packs

**Rationale:** Cost-effective, high quality, faster than custom illustration

### 4. Component Modularity

**Rationale:** Easy to redesign, test, and migrate to Phase 3 backend

### 5. Service Layer Abstraction

**Rationale:** Clean separation allows seamless backend swap in Phase 3

---

## 🎯 Definition of Done

**Phase 2 is complete when:**

1. ✅ All acceptance criteria met (100% completion)
2. ✅ Design aesthetic consistent across all pages
3. ✅ Animations smooth and performant (60fps desktop)
4. ✅ All 3 missing systems implemented (auth, onboarding, achievements)
5. ✅ OpenAI integration verified with proper context
6. ✅ Responsive design works on all devices
7. ✅ Accessibility standards met (WCAG 2.1 AA)
8. ✅ Performance targets achieved (<2s load, 90+ Lighthouse)
9. ✅ User testing completed (85%+ satisfaction)
10. ✅ Documentation complete
11. ✅ Stakeholder demo prepared
12. ✅ Code production-ready

---

## 📚 Related Documents

### Other PRD Shards

1. **01-OVERVIEW.md** ← You are here
2. **02-DESIGN-SYSTEM.md** - Colors, typography, animations
3. **03-AUTHENTICATION-ONBOARDING.md** - Login and FTUE
4. **04-ACHIEVEMENTS-GAMIFICATION.md** - Badges, streaks, rewards
5. **05-AI-INTEGRATION.md** - OpenAI setup and task generation
6. **06-RETENTION-FEATURES.md** - Nudges and churn detection
7. **07-SOCIAL-TUTOR.md** - Friends and tutor booking
8. **08-UI-COMPONENTS.md** - Component redesign specs
9. **09-RESPONSIVE-PERFORMANCE.md** - Mobile and optimization
10. **10-IMPLEMENTATION-ROADMAP.md** - Week-by-week tasks
11. **11-ASSETS-TESTING.md** - Asset sources and testing
12. **12-DEMO-DEPLOYMENT.md** - Stakeholder demo and launch

### Quick Navigation

- **Need design specs?** → See Shard 2 (Design System)
- **Building features?** → See Shards 3-7 (Feature specs)
- **Redesigning UI?** → See Shard 8 (Components)
- **Planning work?** → See Shard 10 (Roadmap)
- **Getting assets?** → See Shard 11 (Assets)

---

## 🚀 Getting Started

### For Developers

1. Read this overview
2. Review Shard 2 (Design System) for setup
3. Follow Shard 10 (Roadmap) for task order
4. Reference feature shards as you build

### For Designers

1. Read this overview
2. Deep dive Shard 2 (Design System)
3. Review Shard 8 (UI Components)
4. Download assets from Shard 11

### For Project Managers

1. Read this overview
2. Use Shard 10 (Roadmap) for planning
3. Track against acceptance criteria
4. Prepare demo using Shard 12

---

## 💬 Questions?

**Technical decisions:** See architecture principles above  
**Design rationale:** See design philosophy section  
**Timeline concerns:** See Shard 10 (Roadmap)  
**Feature details:** See specific feature shards (3-7)

---

**Next Step:** Review **Shard 2: Design System** to understand the visual foundation before starting implementation.
