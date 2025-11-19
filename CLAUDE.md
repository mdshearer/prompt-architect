# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Prompt Architect** is a lead magnet web application for Optimi that helps **non-technical users** build better prompts for AI interactions. The app focuses on three key areas:
- Custom instructions optimization
- Projects/Gems development
- Thread/conversation structuring

**Target Audience:** Regular folks who don't know how to prompt AI yet - marketers, small business owners, professionals seeking better AI results.

## Core Features

- **Free tier**: 3 free chat messages with AI-powered prompt coaching
- **Email capture**: Users provide email for additional messages (lead generation)
- **Interactive chat interface**: Real-time conversations with AI prompt expert
- **Prompt builders**: Step-by-step wizards (OPTIMI Framework, Custom Instructions, Projects/Gems)
- **AI Integration**: Uses Together.ai (Llama-3.3-70B-Instruct-Turbo) for coaching
- **Lead Generation**: Captures user information for Optimi's sales funnel
- **Educational focus**: Teaches users prompt engineering, not just builds prompts for them

## Tech Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript 5.9+ (strict mode, explicit types required)
- **UI Library**: React 19 (functional components + hooks only)
- **Styling**: Tailwind CSS 4 with Optimi brand colors
- **Icons**: Lucide React

### **Backend / Storage**
- **Hosting**: Replit (NOT Vercel, NOT Supabase)
- **Storage**: Client-side (localStorage/sessionStorage) for MVP
- **Database**: None currently (may add Replit DB later if needed)
- **Authentication**: NOT IMPLEMENTED (lead magnet is open access)

### **AI Integration**
- **Provider**: Together.ai API
- **Model**: Llama-3.3-70B-Instruct-Turbo
- **Purpose**: Conversational coaching for prompt development
- **Security**: API calls from server-side routes only (`/app/api/`)

### **Deployment**
- **Platform**: Replit
- **Port**: 3001 (configured in package.json)
- **Environment**: Node.js with Next.js dev server

## Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend          │         │   Together.ai API   │
│   (Next.js)         │────────►│   (AI Chat)         │
│   - React 19        │  HTTP   │   - Llama 3.3 70B   │
│   - Tailwind CSS    │◄────────│   - System prompts  │
│   - localStorage    │         │                     │
└─────────────────────┘         └─────────────────────┘
         │
         │ Client-side
         │ (no database)
         ▼
┌─────────────────────┐
│   Browser Storage   │
│   - localStorage    │
│   - sessionStorage  │
│   - No server DB    │
└─────────────────────┘
```

**Key Points:**
- All data storage is client-side (localStorage)
- No database, no authentication system (for MVP)
- API calls go through Next.js API routes (`/app/api/chat/route.ts`)
- Together.ai API key stays server-side only (never exposed to client)

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

# Legacy (not used, can ignore):
# NEXT_PUBLIC_SUPABASE_URL=not_used
# NEXT_PUBLIC_SUPABASE_ANON_KEY=not_used
# SUPABASE_SERVICE_ROLE_KEY=not_used
```

**Get Together.ai API Key:**
- Sign up at https://api.together.xyz
- Create API key
- Copy to `.env.local`

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

## Commands

- `npm run dev` - Development server (runs on port 3001)
- `npm run build` - Production build
- `npm run lint` - Code linting  
- `npm run type-check` - TypeScript type checking

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

### Legacy (Not Used):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL (not implemented)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (not implemented)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role (not implemented)

**Note:** Supabase was planned but not implemented. We use client-side localStorage instead and host on Replit.

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

## Known Issues & Gotchas

### Replit Deployment
- **Port 3001** is hardcoded (don't change without updating config)
- Environment variables must be set in Replit Secrets (not just .env.local)
- Hot reload can be slow on Replit (be patient after code changes)

### LocalStorage Limitations
- **5-10MB quota** per domain (manage conversation storage carefully)
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