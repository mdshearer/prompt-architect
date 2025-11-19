# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Prompt Architect** is a lead magnet web application for Optimi that helps **non-technical users** build better prompts for AI interactions. The app focuses on three key areas:
- Custom instructions optimization
- Projects/Gems development
- Thread/conversation structuring

**Target Audience:** Regular folks who don't know how to prompt AI yet - marketers, small business owners, professionals seeking better AI results.

## Core Features

- **Free tier**: 3 free chat messages per category with AI-powered prompt coaching
- **Interactive chat interface**: Real-time conversations with AI prompt expert
- **Prompt builders**: Step-by-step wizards (OPTIMI Framework, Custom Instructions, Projects/Gems)
- **AI Integration**: Uses Together.ai (Llama-3.3-70B-Instruct-Turbo) for coaching
- **Lead Generation**: Designed to capture user interest for Optimi's sales funnel
- **Educational focus**: Teaches users prompt engineering, not just builds prompts for them
- **Performance optimized**: React `useMemo`, environment-aware logging, input validation
- **Security hardened**: Rate limiting, input sanitization, API key protection

## Tech Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript 5.9+ (strict mode, explicit types required, zero `any` allowed)
- **UI Library**: React 19 (functional components + hooks only)
- **Styling**: Tailwind CSS 4 with Optimi brand colors
- **Icons**: Lucide React

### **Backend / Storage**
- **Hosting**: Replit-ready (also works on Vercel)
- **Storage**: Client-side (localStorage/sessionStorage) for MVP
- **Database**: None currently (may add Replit DB later if needed)
- **Authentication**: NOT IMPLEMENTED (lead magnet is open access)

### **AI Integration**
- **Provider**: Together.ai API
- **Model**: Llama-3.3-70B-Instruct-Turbo
- **Purpose**: Conversational coaching for prompt development
- **Security**: API calls from server-side routes only (`/app/api/`)
- **Rate Limiting**: Server-side enforcement (3 free messages per session)
- **Input Validation**: Comprehensive sanitization before AI API calls

### **Deployment**
- **Platform**: Replit or Vercel
- **Port**: 3001 (configured in package.json)
- **Environment**: Node.js with Next.js dev server

## Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend          │         │   Together.ai API   │
│   (Next.js)         │────────►│   (AI Chat)         │
│   - React 19        │  HTTP   │   - Llama 3.3 70B   │
│   - Tailwind CSS    │◄────────│   - System prompts  │
│   - localStorage    │         │   - Rate limited    │
└─────────────────────┘         └─────────────────────┘
         │
         │ Client-side storage
         │ (no database)
         ▼
┌─────────────────────┐
│   Browser Storage   │
│   - Conversations   │
│   - Usage tracking  │
│   - Session state   │
└─────────────────────┘
```

**Key Points:**
- All data storage is client-side (localStorage)
- No database, no authentication system (for MVP)
- API calls go through Next.js API routes (`/app/api/chat/`)
- Together.ai API key stays server-side only (never exposed to client)
- Server-side rate limiting prevents abuse
- Input validation prevents XSS and injection attacks

## Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── api/                  # API routes
│   │   ├── chat/             # Chat endpoints
│   │   │   ├── route.ts      # Standard chat API
│   │   │   └── enhanced/     # Enhanced chat with UI elements
│   │   └── test/             # Test endpoint
│   ├── dashboard/            # Dashboard page (future)
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
│
├── components/               # React components (kebab-case files)
│   ├── chat/                 # Chat interface components
│   │   ├── chat-container.tsx       # Main chat container
│   │   ├── chat-header.tsx          # Header with category info
│   │   ├── input-area.tsx           # Message input with auto-resize
│   │   ├── message-list.tsx         # Message display area
│   │   ├── message-bubble.tsx       # Individual message
│   │   ├── typing-indicator.tsx     # Loading animation
│   │   └── prompt-builder-trigger.tsx # Builder integration
│   │
│   ├── prompt-builders/      # Interactive builder wizards
│   │   ├── optimi-builder.tsx              # OPTIMI Framework
│   │   ├── custom-instructions-builder.tsx # Custom Instructions
│   │   └── projects-gems-builder.tsx       # Projects/Gems
│   │
│   ├── dashboard/            # Dashboard components (future)
│   ├── export/               # Export functionality
│   ├── library/              # Prompt library (future)
│   └── onboarding/           # Onboarding flow (future)
│
└── lib/                      # Utility functions & libraries
    ├── constants.ts          # App-wide constants (NEW - Phase 3)
    ├── logger.ts             # Environment-aware logging (NEW - Phase 3)
    ├── together.ts           # Together.ai client
    ├── rate-limiter.ts       # Server-side rate limiting
    └── input-validation.ts   # Input sanitization & validation
```

**Important Notes:**
- **All component files use kebab-case** (e.g., `chat-container.tsx`) per CONSTITUTION.md
- Component names are PascalCase (e.g., `ChatContainer`) but files are kebab-case
- `src/lib/constants.ts` contains all magic numbers (no hardcoded values)
- `src/lib/logger.ts` provides environment-aware logging (dev vs production)

## Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/mdshearer/prompt-architect.git
cd prompt-architect
npm install
```

### 2. Environment Variables
Create `.env.local` in project root:
```bash
# Required: Together.ai API key
TOGETHER_AI_API_KEY=your_together_ai_api_key_here
```

**Get Together.ai API Key:**
- Sign up at https://api.together.xyz
- Create API key
- Copy to `.env.local`

**Note:** Legacy Supabase environment variables are no longer used and have been removed.

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3001 in browser.

### 4. Test the App
- Click any category on homepage (Custom Instructions, Projects/Gems, or Threads)
- Start a conversation with the AI
- Send 3 messages (free tier limit)
- Verify upgrade prompt appears
- Test rate limiting by attempting 4th message

## Commands

- `npm run dev` - Development server (runs on port 3001)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Code linting (ESLint)
- `npm run type-check` - TypeScript type checking (must have zero errors)

## Code Quality Standards

### Recent Improvements (Phase 3 & 4)
- ✅ All component files renamed to kebab-case per CONSTITUTION.md
- ✅ Magic numbers extracted to `src/lib/constants.ts`
- ✅ Environment-aware logging in `src/lib/logger.ts`
- ✅ Performance optimizations with React `useMemo`
- ✅ JSDoc documentation on complex functions
- ✅ Comprehensive QA testing documentation in `QA_TESTING.md`

### TypeScript Requirements
- Zero `any` types allowed (use proper types or `unknown` with guards)
- All props and data structures must have interfaces
- Use `import type { ... }` for type-only imports
- Strict null checks enabled
- Run `npm run type-check` before committing

### File Naming Conventions
- **Files**: `kebab-case.tsx` (e.g., `chat-container.tsx`)
- **Components**: `PascalCase` (e.g., `ChatContainer`)
- **Functions**: `camelCase` (e.g., `handleSendMessage`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_FREE_MESSAGES`)
- **Types/Interfaces**: `PascalCase` (e.g., `Message`, `ChatProps`)

## Brand Colors

Optimi brand colors are configured in Tailwind CSS as `optimi-*`:

**Primary Colors:**
- `optimi-primary` - #283791 (RGB: 40/55/145, CMYK: 100/90/5/0)
- `optimi-blue` - #0078FF (RGB: 0/120/255, CMYK: 80/55/0/0)

**Accent Colors:**
- `optimi-green` - #00C896 (RGB: 0/200/150, CMYK: 70/0/55/0)
- `optimi-yellow` - #FFDC00 (RGB: 255/220/0, CMYK: 0/10/100/0)

**Neutral:**
- `optimi-gray` - #464650 (RGB: 70/70/80, CMYK: 0/0/0/90)

**Usage in CSS:**
```css
bg-optimi-primary
text-optimi-blue
border-optimi-green
```

## Environment Variables

### Required:
- `TOGETHER_AI_API_KEY` - Together.ai API key for AI chat functionality

### Note on Legacy Variables:
Previous Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) have been removed. The app now uses client-side localStorage exclusively.

## Key Application Constants

All application constants are defined in `src/lib/constants.ts`:

```typescript
// Free tier limits
export const MAX_FREE_MESSAGES = 3

// AI Configuration - Standard Chat
export const AI_MAX_TOKENS_STANDARD = 500
export const AI_TEMPERATURE_STANDARD = 0.7
export const AI_TOP_P_STANDARD = 0.9
export const CONVERSATION_CONTEXT_LIMIT_STANDARD = 6

// AI Configuration - Enhanced Chat
export const AI_MAX_TOKENS_ENHANCED = 600
export const AI_TEMPERATURE_ENHANCED = 0.8
export const AI_TOP_P_ENHANCED = 0.9
export const CONVERSATION_CONTEXT_LIMIT_ENHANCED = 8

// Network Configuration
export const API_TIMEOUT_MS = 30000 // 30 seconds

// Input Validation
export const MAX_MESSAGE_LENGTH = 2000
```

**Never hardcode these values** - always import from `constants.ts`.

## Development Workflow (AI-Dev-Orchestrator)

This project uses the **ai-dev-orchestrator** framework for structured, AI-assisted development. See `.claude/` directory for complete framework.

### Quick Reference:

**4-Phase Development Process:**
1. **Phase 1: Planning** (15-30 min) - Product Owner creates PRD, Architect creates tech spec
2. **Phase 2: Implementation** (2-4 hours) - Developer builds feature task-by-task
3. **Phase 3: Review** (30-60 min) - QA Engineer tests, Developer fixes issues
4. **Phase 4: Documentation** (15-30 min) - Technical Writer updates docs

### Key Files:
- `CONSTITUTION.md` - Project rules and standards (READ THIS FIRST)
- `.claude/personas/` - 5 specialized AI personas (Product Owner, Architect, Developer, QA Engineer, Technical Writer)
- `.claude/workflows/` - Phase-by-phase workflow guides
- `QA_TESTING.md` - Comprehensive testing documentation with 25+ test cases

### How to Use:

When building a new feature:

1. Read `CONSTITUTION.md` to understand project standards
2. Follow Phase 1 workflow (`.claude/workflows/phase-1-planning.md`)
3. Get PRD from Product Owner persona
4. Get tech spec from Architect persona
5. Follow remaining phases sequentially

**Example:**
```
Feature: Add "Export to PDF" button

Phase 1: Create PRD → Create tech spec (30 min)
Phase 2: Implement task-by-task (3 hours)
Phase 3: QA review → Fix issues (45 min)
Phase 4: Update README, CLAUDE.md, add comments (20 min)
Total: ~5 hours for production-ready feature
```

See `.claude/README.md` for detailed orchestrator usage instructions.

## Security Best Practices

### API Key Protection
- ✅ Together.ai API key is server-side only (`src/lib/together.ts`)
- ✅ Never expose API keys to client bundle
- ✅ Environment variable validation on server startup

### Input Validation
- ✅ All user inputs sanitized before AI API calls
- ✅ XSS prevention with HTML tag removal
- ✅ 2000 character limit enforced server-side
- ✅ Empty message prevention

### Rate Limiting
- ✅ Server-side enforcement (not bypassable from client)
- ✅ 3 free messages per session per category
- ✅ IP-based tracking with time-based expiration
- ✅ 429 status code returned when limit exceeded

### Network Security
- ✅ 30-second timeout on all API requests
- ✅ AbortController for request cancellation
- ✅ Proper error handling without exposing internals

See `src/lib/input-validation.ts`, `src/lib/rate-limiter.ts`, and `QA_TESTING.md` for implementation details.

## Testing

### QA Documentation
Comprehensive testing documentation is available in `QA_TESTING.md`:

- **Functional Tests**: 7 test scenarios (free limit, race conditions, error handling)
- **Security Tests**: 3 test scenarios (rate limiting, input sanitization, env validation)
- **Performance Tests**: 3 benchmarks (page load, AI response, bundle size)
- **Cross-Browser**: 6 browser matrix
- **CONSTITUTION Compliance**: Full checklist

### Running Tests
```bash
# TypeScript type checking (zero errors required)
npm run type-check

# Code linting
npm run lint

# Production build test
npm run build
```

All checks must pass before merging to main branch.

## Performance Optimizations

### React Performance
- ✅ `useMemo` for expensive calculations (category info, placeholder text)
- ✅ Proper component memoization prevents unnecessary re-renders
- ✅ Optimistic UI updates for better perceived performance

### Network Performance
- ✅ AbortController with 30-second timeout
- ✅ Conversation context limited to last 6-8 messages
- ✅ Request debouncing through disabled state

### Code Quality
- ✅ No duplicate components (deprecated `ChatInterface.tsx` removed)
- ✅ Magic numbers extracted to constants for maintainability
- ✅ Environment-aware logging (production logs suppressed)

## Known Issues & Gotchas

### Replit Deployment
- **Port 3001** is configured in package.json
- Environment variables must be set in Replit Secrets (not just .env.local)
- Hot reload can be slow on Replit (be patient after code changes)

### LocalStorage Limitations
- **5-10MB quota** per domain (sufficient for MVP, manage carefully)
- **Private browsing** disables localStorage (feature won't work)
- **Cross-device** - localStorage doesn't sync (conversations stay on one device)

### Together.ai API
- **Rate limits** - Free tier has limits (monitor usage)
- **Timeout** - Responses can take 2-5 seconds (show loading states)
- **Error handling** - API can fail (always handle errors gracefully)

### TypeScript
- **Strict mode enabled** - All code must have explicit types
- **No `any` allowed** - Use proper types or `unknown` with type guards
- **Build-time checks** - Run `npm run type-check` before committing

## Common Development Tasks

### Adding a New Constant
1. Add to `src/lib/constants.ts` with UPPER_SNAKE_CASE naming
2. Export the constant
3. Import where needed: `import { NEW_CONSTANT } from '@/lib/constants'`
4. Never hardcode the value

### Adding a New Component
1. Create file in `src/components/[feature]/` using kebab-case
2. Component name should be PascalCase (e.g., `export default function MyComponent`)
3. Add TypeScript interface for props
4. Use proper imports (kebab-case filenames)
5. Follow CONSTITUTION.md standards

### Logging in Development vs Production
```typescript
import { logger } from '@/lib/logger'

// Use logger instead of console.log/error
logger.error('API call failed', error)  // Shows in dev, silent in prod
logger.info('User clicked button', { userId: 123 })  // Dev only
logger.warn('Rate limit approaching', { count: 2 })  // Dev only
```

### Rate Limiting Check
```typescript
import { getClientIP, checkRateLimit } from '@/lib/rate-limiter'

const clientIP = getClientIP(request)
const rateLimit = checkRateLimit(clientIP)

if (!rateLimit.allowed) {
  return NextResponse.json({
    success: false,
    error: 'Rate limit exceeded'
  }, { status: 429 })
}
```

## Recent Changes Log

### Phase 3 & 4 (November 19, 2025)
- ✅ Removed deprecated `ChatInterface.tsx` component
- ✅ Renamed all components to kebab-case per CONSTITUTION.md
- ✅ Created `src/lib/constants.ts` for application-wide constants
- ✅ Created `src/lib/logger.ts` for environment-aware logging
- ✅ Added `useMemo` optimizations to chat-header and input-area
- ✅ Added JSDoc documentation to complex functions
- ✅ Created comprehensive `QA_TESTING.md` with 25+ test cases
- ✅ Achieved 100% CONSTITUTION compliance
- ✅ Zero TypeScript `any` violations

### Phase 1 & 2 (Previous)
- ✅ Removed Supabase dependencies and dead code
- ✅ Implemented server-side rate limiting
- ✅ Added input validation and sanitization
- ✅ Fixed usage counter race conditions
- ✅ Implemented crypto.randomUUID() for message IDs
- ✅ Added environment variable validation

---

**Last Updated:** November 19, 2025
**Version:** 1.0.0 (Phase 3 & 4 Complete)
**CONSTITUTION Compliance:** ✅ 100%
