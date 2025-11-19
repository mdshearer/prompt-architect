# Prompt Architect

A lead magnet web application for Optimi that helps non-technical users build better AI prompts through interactive conversations and educational coaching.

## 🎯 Overview

Prompt Architect transforms how regular folks create AI prompts. Instead of requiring technical expertise, users have natural conversations with an AI coach that guides them through building professional-grade prompts for Custom Instructions, Projects/Gems, and Thread Conversations.

**Target Audience:** Marketers, small business owners, and professionals who want better AI results but lack prompt engineering experience.

---

## ✨ Features

### **Interactive Chat Experience**
- ✅ Professional chat interface with real-time typing indicators
- ✅ Context-aware conversations with educational guidance
- ✅ Smart message flow that triggers builders when users are ready
- ✅ Multi-line input with auto-resize (up to 4 lines)
- ✅ Character count for longer messages (2000 char limit)
- ✅ Copy-to-clipboard functionality for all prompts

### **Educational Framework**
- ✅ **Custom Instructions**: Build persistent AI behavior for ChatGPT & Claude
- ✅ **Projects & Gems**: Create specialized AI experts with domain knowledge
- ✅ **OPTIMI Framework**: Universal thread prompts that work on any platform

### **Interactive Prompt Builders**
- ✅ Step-by-step wizards with live preview
- ✅ Platform-specific examples and guidance
- ✅ Copy-ready output with formatting
- ✅ Educational content explaining best practices

### **Usage Management**
- ✅ 3 free messages per category (lead magnet tier)
- ✅ Smart upgrade prompts with progress tracking
- ✅ Server-side rate limiting for security
- ✅ Optimistic UI updates for responsiveness

### **Developer Experience**
- ✅ TypeScript strict mode with zero `any` types
- ✅ Comprehensive input validation and sanitization
- ✅ Environment-aware logging (dev vs production)
- ✅ Performance optimizations with React `useMemo`
- ✅ Extensive QA testing documentation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Together.ai API key ([get one here](https://api.together.xyz))

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/mdshearer/prompt-architect.git
   cd prompt-architect
   npm install
   ```

2. **Configure environment variables**

   Create `.env.local` in project root:
   ```bash
   TOGETHER_AI_API_KEY=your_together_ai_api_key_here
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**

   Navigate to http://localhost:3001

### Testing the App

1. Click any category: **Custom Instructions**, **Projects/Gems**, or **Threads**
2. Start a conversation with the AI coach
3. Send 3 messages to test the free tier limit
4. Verify upgrade prompt appears after limit reached

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9+ (strict mode)
- **UI Library**: React 19 (functional components + hooks)
- **Styling**: Tailwind CSS 4 with Optimi brand colors
- **Icons**: Lucide React

### Backend
- **Hosting**: Replit-ready (also works on Vercel)
- **Storage**: Client-side (localStorage/sessionStorage)
- **API Routes**: Next.js API routes for AI integration
- **Database**: None (may add later if needed)
- **Authentication**: Not implemented (lead magnet is open access)

### AI Integration
- **Provider**: Together.ai API
- **Model**: Llama-3.3-70B-Instruct-Turbo
- **Purpose**: Conversational coaching for prompt development
- **Security**: API key server-side only, never exposed to client

### Development Tools
- **Type Checking**: `npm run type-check`
- **Linting**: `npm run lint`
- **Testing**: Comprehensive QA documentation in `QA_TESTING.md`

---

## 📁 Project Structure

```
prompt-architect/
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── api/                  # API routes
│   │   │   ├── chat/             # Chat endpoints
│   │   │   │   ├── route.ts      # Standard chat
│   │   │   │   └── enhanced/     # Enhanced chat with UI elements
│   │   │   └── test/             # Test endpoint
│   │   ├── dashboard/            # Dashboard page (future)
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Homepage
│   │
│   ├── components/               # React components (kebab-case filenames)
│   │   ├── chat/                 # Chat interface components
│   │   │   ├── chat-container.tsx
│   │   │   ├── chat-header.tsx
│   │   │   ├── input-area.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── typing-indicator.tsx
│   │   │   └── prompt-builder-trigger.tsx
│   │   │
│   │   ├── prompt-builders/      # Interactive builder wizards
│   │   │   ├── optimi-builder.tsx
│   │   │   ├── custom-instructions-builder.tsx
│   │   │   └── projects-gems-builder.tsx
│   │   │
│   │   ├── dashboard/            # Dashboard components (future)
│   │   ├── export/               # Export functionality
│   │   ├── library/              # Prompt library (future)
│   │   └── onboarding/           # Onboarding flow (future)
│   │
│   └── lib/                      # Utility libraries
│       ├── constants.ts          # App-wide constants (NEW)
│       ├── logger.ts             # Environment-aware logging (NEW)
│       ├── together.ts           # Together.ai client
│       ├── rate-limiter.ts       # Server-side rate limiting
│       └── input-validation.ts   # Input sanitization & validation
│
├── .claude/                      # AI-dev-orchestrator framework
│   ├── personas/                 # Specialized AI personas
│   └── workflows/                # Development workflows
│
├── CLAUDE.md                     # Developer guidance for AI assistants
├── CONSTITUTION.md               # Project rules and standards
├── QA_TESTING.md                 # Comprehensive testing documentation (NEW)
└── README.md                     # This file
```

**Note:** All component files use `kebab-case` naming (e.g., `chat-container.tsx`) per CONSTITUTION standards.

---

## 🎨 Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend          │         │   Together.ai API   │
│   (Next.js)         │────────►│   (AI Chat)         │
│   - React 19        │  HTTP   │   - Llama 3.3 70B   │
│   - Tailwind CSS    │◄────────│   - System prompts  │
│   - localStorage    │         │                     │
└─────────────────────┘         └─────────────────────┘
         │
         │ Client-side storage
         │ (no database required)
         ▼
┌─────────────────────┐
│   Browser Storage   │
│   - Conversation     │
│   - Usage tracking   │
│   - Session state    │
└─────────────────────┘
```

### Key Architectural Decisions

- **No Database**: Client-side storage (localStorage) for MVP simplicity
- **Server-Side API Routes**: Together.ai API key never exposed to client
- **Rate Limiting**: Server-side enforcement (3 free messages per session)
- **Input Validation**: Sanitization before AI API calls (XSS prevention)
- **Performance**: React `useMemo` for expensive calculations
- **Logging**: Environment-aware (detailed in dev, silent in production)

---

## 🧪 Quality Assurance

This project includes comprehensive QA documentation:

- **`QA_TESTING.md`**: Complete testing procedures with 25+ test cases
- **Coverage**: Functional, security, performance, and cross-browser testing
- **Standards**: CONSTITUTION compliance checklist included
- **CI/CD Ready**: Type-check, lint, and build verification

### Running Quality Checks

```bash
# TypeScript type checking (zero errors required)
npm run type-check

# Code linting (ESLint)
npm run lint

# Production build test
npm run build
```

All checks must pass before merging to main branch.

---

## 🎨 Optimi Brand Colors

The app uses Optimi's official brand colors configured in Tailwind CSS:

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#283791` | Custom Instructions category |
| **Blue** | `#0078FF` | Thread Conversations category |
| **Green** | `#00C896` | Projects/Gems category |
| **Yellow** | `#FFDC00` | Upgrade prompts, highlights |
| **Gray** | `#464650` | Neutral UI elements |

**Usage in code:**
```jsx
<div className="bg-optimi-primary text-white">
  <p className="text-optimi-blue">Hello</p>
</div>
```

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)**: Development guidance for AI assistants
- **[CONSTITUTION.md](./CONSTITUTION.md)**: Project rules and coding standards
- **[QA_TESTING.md](./QA_TESTING.md)**: Comprehensive testing documentation
- **[.claude/README.md](./.claude/README.md)**: AI-dev-orchestrator framework guide

### For Developers

Read `CONSTITUTION.md` first to understand project standards, then follow the 4-phase development workflow documented in `.claude/workflows/`.

---

## 🤝 Contributing

This project uses the **ai-dev-orchestrator** framework for structured development:

1. **Phase 1: Planning** - Create PRD and technical spec
2. **Phase 2: Implementation** - Build features task-by-task
3. **Phase 3: Review** - QA testing and issue resolution
4. **Phase 4: Documentation** - Update docs and add comments

See `.claude/workflows/` for detailed phase instructions.

---

## 📝 Development Commands

```bash
# Development
npm run dev              # Start dev server on port 3001
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # ESLint checks
npm run type-check       # TypeScript validation

# Testing
# See QA_TESTING.md for comprehensive testing procedures
```

---

## 🔒 Security Features

- ✅ **API Key Protection**: Together.ai key server-side only
- ✅ **Input Sanitization**: XSS prevention on all user inputs
- ✅ **Rate Limiting**: Server-side enforcement (not bypassable from client)
- ✅ **Input Length Limits**: 2000 character maximum
- ✅ **Request Timeouts**: 30-second limit on API calls
- ✅ **Environment Validation**: API key checked on server startup

See `src/lib/input-validation.ts` and `src/lib/rate-limiter.ts` for implementation details.

---

## 🚧 Known Limitations

- **LocalStorage Quota**: 5-10MB per domain (sufficient for MVP)
- **Private Browsing**: localStorage disabled, app won't function
- **Cross-Device**: Conversations don't sync (single-device only)
- **Together.ai Rate Limits**: Free tier has API rate limits
- **No Authentication**: Lead magnet is open access (no user accounts)

---

## 📄 License

This project is proprietary software owned by Optimi. All rights reserved.

---

## 🔗 Links

- **Live Demo**: http://localhost:3001 (after setup)
- **Together.ai API**: https://api.together.xyz
- **Repository**: https://github.com/mdshearer/prompt-architect

---

**Built with ❤️ for Optimi's lead generation**

**Last Updated:** November 19, 2025 | **Version:** 1.0.0 (Phase 3 & 4 Complete)
