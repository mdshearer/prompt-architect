# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Prompt Architect** is a lead magnet web application for Optimi that helps users build better prompts for AI interactions. The app focuses on three key areas:
- Custom instructions optimization
- Projects/Gems development
- Thread/conversation structuring

## Core Features

- **Free tier**: Limited chat sessions with AI-powered prompt development assistance
- **Authenticated tier**: Additional chat sessions after user login
- **AI Integration**: Uses Together.ai for conversational prompt improvement
- **Lead Generation**: Captures user information for Optimi's sales funnel

## Tech Stack Considerations

- **Backend/Database**: Supabase (provides auth, database, and real-time features)
- **AI Provider**: Together.ai API integration
- **Frontend**: React/Next.js (recommended for rapid development)
- **Authentication**: Supabase Auth (handles login, session management)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Together.ai   │
│   (Next.js)     │◄──►│   (Auth + DB)   │    │   (AI Chat)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Schema (Supabase)
- `users` - User profiles and auth
- `chat_sessions` - Track usage limits and conversation history
- `prompts` - Store developed prompts for analysis
- `usage_limits` - Track free/premium usage quotas

## Development Setup

### 1. Database Setup
Run the SQL in `supabase-schema.sql` in your Supabase project:
- Go to Supabase Dashboard → SQL Editor
- Copy and execute the entire schema file
- This creates tables: profiles, chat_sessions, prompts
- Sets up RLS policies and triggers

### 2. Environment Variables
API keys are configured in `.env.local`:
- ✅ Supabase URL and keys configured
- ✅ Together.ai API key configured

### 3. Test Setup  
- Run `npm run dev` - Development server on http://localhost:3001
- Test APIs: `curl http://localhost:3001/api/test`

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

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `TOGETHER_AI_API_KEY`