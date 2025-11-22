# Prompt Architect - Replit Project

## Overview
**Prompt Architect** is a Next.js web application that helps users build better AI prompts through an interactive onboarding flow and educational coaching. This lead magnet application guides users through creating personalized instructions for ChatGPT, Claude, Gemini, or Microsoft Copilot.

## Project Information
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS v4
- **UI Library**: React 19
- **AI Provider**: Together.ai (Llama-3.3-70B-Instruct-Turbo)
- **Storage**: Client-side (localStorage/sessionStorage)
- **Port**: 5000

## Architecture
This is a frontend-only application with:
- Next.js API routes for AI integration
- Client-side storage (no database required)
- Server-side API key management for security

## Recent Changes (November 22, 2025)
- Imported from GitHub repository
- Configured for Replit environment:
  - Updated port from 3001 to 5000
  - Configured Next.js to allow all dev origins for Replit proxy
  - Updated Tailwind CSS configuration for v4 compatibility
  - Converted Tailwind config from JS to TypeScript
  - Updated globals.css to use Tailwind v4 @import syntax
  - Configured deployment settings for autoscale
  - Installed all dependencies

## Required Environment Variables
- `TOGETHER_AI_API_KEY` - API key for Together.ai service (required for AI chat functionality)

**Note**: The application will throw an error on startup if this environment variable is missing. You'll need to add it in the Secrets tab.

## Getting Started
1. **Add API Key**: Go to Secrets tab and add `TOGETHER_AI_API_KEY` with your Together.ai API key
2. **Start Development**: The workflow "Start application" runs `npm run dev` on port 5000
3. **View App**: Click the webview to see the application

## User Preferences
None set yet.

## Project Structure
```
prompt-architect/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # React components (chat, onboarding, builders)
│   ├── lib/             # Utilities (Together.ai client, validation, etc.)
│   └── types/           # TypeScript type definitions
├── data/                # AI instructions and templates
├── docs/                # Project documentation
└── tailwind.config.ts   # Tailwind CSS v4 configuration
```

## Features
- Interactive onboarding flow (3 steps)
- AI tool selection (ChatGPT, Claude, Gemini, Copilot)
- Personalized prompt generation
- Educational framework for prompt building
- Usage management (3 free messages per category)
- Rate limiting and input validation

## Deployment
Configured for autoscale deployment:
- Build command: `npm run build`
- Run command: `npm run start`
- Port: 5000

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## Known Limitations
- Requires Together.ai API key for AI functionality
- localStorage-based (won't work in private browsing)
- Single-device only (no cross-device sync)
- No authentication (open access lead magnet)

## Security
- API key stored server-side only
- Input sanitization and validation
- Rate limiting on API routes
- 2000 character input limit

## Links
- **GitHub**: https://github.com/mdshearer/prompt-architect
- **Together.ai**: https://api.together.xyz

Last updated: November 22, 2025
