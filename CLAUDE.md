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

1. Initialize Next.js project with TypeScript
2. Set up Supabase project and configure auth
3. Configure Together.ai API integration
4. Implement usage tracking and limits

## Commands

TBD - Will include standard Next.js commands:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run lint` - Code linting

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `TOGETHER_AI_API_KEY`