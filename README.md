# AI Study Companion

A persistent, context-aware tutoring assistant designed to live between human tutoring sessions. It remembers lessons, assigns adaptive practice, answers questions conversationally, and nudges students to continue learning after goals are achieved.

## Project Overview

**Phase:** MVP (Phase 1)  
**Target Users:** K-12 students (ages 9-16)  
**Primary Goal:** Improve student retention and engagement

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (JavaScript runtime and package manager)
- OpenAI API Key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd AIStudyBuddy
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=your-api-key-here
```

### Development

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
bun run start
```

## Project Structure

```
/AIStudyBuddy
  /app                  # Next.js 14 App Router
    /components         # React components
    /api               # API routes
    layout.tsx         # Root layout
    page.tsx           # Home page
  /data                # Mock data (JSON files)
    /students          # Student profiles
    /tutors            # Tutor profiles
    /sessions          # Session transcripts
  /lib
    /services          # Business logic services
    /utils             # Utility functions
  /types               # TypeScript type definitions
  /public              # Static assets
  /Docs                # Project documentation
    PRD.md            # Product Requirements Document
    architecture.md   # System architecture diagram
    tasks.md          # Development tasks checklist
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **AI Integration:** OpenAI API (GPT-4)
- **Package Manager:** Bun

## Documentation

- [PRD (Product Requirements Document)](./Docs/PRD.md)
- [System Architecture](./Docs/architecture.md)
- [Development Tasks](./Docs/tasks.md)

## Key Features

### Phase 1 MVP

- Persistent AI memory with conversation recall
- Adaptive task generation (mixed types)
- Age-appropriate tone adjustment (9-11, 12-14, 15-16)
- Streak system (login + practice based)
- Achievement badges (6 types)
- Friend connection system
- Churn detection and nudge system
- Content filtering and safety
- Mock tutor booking interface

## Success Metrics

- **Retention Rate:** Target +20% post-goal completion
- **Avg. Sessions:** Target 3.0+ per user (30 days)
- **Churn Mitigation:** 30% reduction in at-risk students

## Phase 2 Vision

- Real backend integration (Firebase/Supabase)
- Live tutor chat
- Parent/tutor portal
- Mobile app (React Native)
- Advanced analytics

## License

Proprietary - Gauntlet Project

## Contributing

This is a private project. For internal team members, please refer to the [Development Tasks](./Docs/tasks.md) for current work items.

---

**Last Updated:** November 7, 2025
