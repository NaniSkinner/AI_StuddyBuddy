# AI Study Companion

A persistent, context-aware AI tutoring assistant for K-12 students (ages 9-16). Features intelligent conversation memory, adaptive task generation, gamification, and retention systems to support learning between human tutoring sessions.

**Status:** 80-85% Complete | **Tech Stack:** Next.js 14, TypeScript, OpenAI GPT-4, Tailwind CSS

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (package manager)
- OpenAI API Key

### Installation

1. Clone and install:

```bash
git clone <repository-url>
cd AIStudyBuddy
bun install
```

2. Configure environment:

```bash
cp .env.example .env.local
# Add your OpenAI API key to .env.local:
# OPENAI_API_KEY=your-api-key-here
```

3. Verify and run:

```bash
bun run verify-openai  # Should show "✅ All checks passed!"
bun run dev            # Open http://localhost:3000
```

## Key Features

- **AI-Powered Tutoring:** Context-aware conversations with age-appropriate tone (9-11, 12-14, 15-16)
- **Adaptive Learning:** Three task types (Multiple Choice, Open-Ended, Real-World) with difficulty adjustment
- **Gamification:** Achievement badges, dual-streak system (login + practice), progress visualization
- **Retention System:** Churn detection, smart nudges, and engagement tracking
- **Safety First:** Content filtering, conversation logging, homework helper mode
- **Friend Connections:** Student networking and collaboration features (backend complete)
- **Tutor Integration:** Struggle detection, handoff notes, booking system (backend complete)

## Project Structure

```
/app                    # Next.js 14 App Router
  /components           # React components (UI, chat, achievements, etc.)
  /api                  # API routes
  /learn                # Main learning interface
/lib
  /services             # Business logic (27 services)
  /utils                # Utility functions
  /hooks                # Custom React hooks
  /prompts              # AI prompt templates
/data                   # Mock data (students, tutors, sessions)
/types                  # TypeScript definitions
/Docs                   # Documentation
  /Final                # Organized project docs (start here)
```

## Documentation

**For Developers:**
- [Master Index](Docs/Final/MASTER_INDEX.md) - Complete documentation navigation
- [Implemented Features](Docs/Final/IMPLEMENTED_FEATURES.md) - What's built and where
- [Missing Features](Docs/Final/MISSING_FEATURES.md) - What needs to be built
- [Architecture](Docs/architecture.md) - System design and patterns

**For Testing:**
- [Testing Checklist](TESTING_CHECKLIST.md) - 15-minute verification
- [Success Metrics](Docs/Final/SUCCESS_METRICS.md) - Acceptance criteria

**For Setup:**
- [Environment Setup](Docs/ENV_SETUP.md) - Detailed configuration guide

## Development

```bash
bun run dev           # Start development server
bun run build         # Build for production
bun run start         # Run production build
bun run verify-openai # Test OpenAI connection
```

## License

Proprietary - Gauntlet Project

---

## About

Made with 🍵 by **[Nani Skinner](https://www.naniskinner.com)**

**Connect:**
- Portfolio: [naniskinner.com](https://www.naniskinner.com)
- X (Twitter): [@naniskinner](https://x.com/naniskinner)
- LinkedIn: [Nani Skinner](https://www.linkedin.com/in/nani-skinner-7b6b17324/)

This project was created as part of the Gauntlet program.
