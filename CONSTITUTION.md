# Prompt Architect - Project Constitution

> **Last Updated:** November 19, 2025
> **Purpose:** This document defines the rules, standards, and principles that govern all AI-assisted development for Prompt Architect. Every AI persona (Product Owner, Architect, Developer, QA Engineer, Technical Writer) MUST follow these guidelines.

---

## 🎯 Project Mission

Build a **lead magnet web application** for Optimi that helps **non-technical users** create better AI prompts through interactive coaching conversations. The app focuses on education and conversion, not complex features.

**Target Audience:** Regular folks who don't know how to prompt AI yet - marketers, small business owners, professionals who want better AI results but lack technical expertise.

---

## 🛠️ Technical Stack

### **Frontend**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.9+ (strict mode)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 with Optimi brand colors
- **Icons:** Lucide React

### **Backend / Data Storage**
- **Hosting:** Replit (not Vercel, not Supabase)
- **Storage:** Client-side (localStorage/sessionStorage) for MVP
- **Future:** Replit DB if database needed later
- **Authentication:** NOT IMPLEMENTED (lead magnet is open access initially)

### **AI Integration**
- **Provider:** Together.ai API
- **Model:** Llama-3.3-70B-Instruct-Turbo
- **Purpose:** Conversational coaching for prompt development

### **Deployment**
- **Platform:** Replit
- **Port:** 3001 (configured in package.json)
- **Environment:** Node.js with Next.js dev server

---

## 📐 Coding Standards

### **File Organization**
```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   └── [pages]/           # Page components
├── components/            # React components
│   ├── chat/             # Chat-related components
│   ├── prompt-builders/  # Builder wizards
│   ├── dashboard/        # Dashboard components
│   └── [feature]/        # Feature-specific folders
├── lib/                   # Utility functions & API clients
└── types/                 # TypeScript type definitions
```

### **Naming Conventions**
- **Files:** `kebab-case.tsx` (e.g., `chat-interface.tsx`)
- **Components:** `PascalCase` (e.g., `ChatInterface`)
- **Functions:** `camelCase` (e.g., `handleSendMessage`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_FREE_MESSAGES`)
- **Types/Interfaces:** `PascalCase` with `I` prefix for interfaces (e.g., `IMessage`, `ChatProps`)

### **TypeScript Requirements**
- ✅ **Always use explicit types** - No `any` unless absolutely necessary
- ✅ **Define interfaces** for all props and data structures
- ✅ **Use type imports** - `import type { ... }` for types only
- ✅ **Strict null checks** - Handle undefined/null explicitly
- ✅ **Export types** - Make reusable types available

**Example:**
```typescript
interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatInterfaceProps {
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  onComplete?: (prompt: string) => void
}
```

### **React Component Standards**
- ✅ **Functional components only** - No class components
- ✅ **Use hooks** - useState, useEffect, custom hooks
- ✅ **Client components** - Mark with `'use client'` when needed
- ✅ **Props destructuring** - Destructure props in function signature
- ✅ **Early returns** - Handle edge cases at top of component

**Example:**
```typescript
'use client'

import { useState } from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export default function Button({ label, onClick, disabled = false }: ButtonProps) {
  if (!label) return null // Early return

  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
```

### **CSS / Styling**
- ✅ **Tailwind utility classes** - Use Tailwind, avoid custom CSS
- ✅ **Optimi brand colors** - Use `optimi-*` color classes (defined in tailwind.config.js)
- ✅ **Mobile-first** - Write mobile styles first, then desktop breakpoints
- ✅ **Consistent spacing** - Use Tailwind spacing scale (p-4, mb-6, etc.)

**Brand Colors:**
```css
bg-optimi-primary     /* #283791 - Deep blue */
bg-optimi-blue        /* #0078FF - Bright blue */
bg-optimi-green       /* #00C896 - Teal green */
bg-optimi-yellow      /* #FFDC00 - Yellow */
bg-optimi-gray        /* #464650 - Dark gray */
```

---

## 🔒 Security Requirements

### **API Key Management**
- ❌ **NEVER expose API keys** in client-side code
- ✅ **Use environment variables** - Store in `.env.local` (gitignored)
- ✅ **Server-side only** - API calls from `/app/api/` routes only
- ✅ **Validate env vars** - Check existence on server startup

### **User Input Handling**
- ✅ **Sanitize inputs** - Clean user messages before sending to AI API
- ✅ **Rate limiting** - Limit messages per session (e.g., 3 free messages)
- ✅ **Input validation** - Check message length, prevent empty submissions
- ✅ **XSS prevention** - React handles this, but be cautious with dangerouslySetInnerHTML

### **Data Privacy**
- ✅ **No PII storage** - Don't store sensitive user data (MVP has no database)
- ✅ **Session-based** - Use client-side state for conversations
- ✅ **Clear on close** - Give users option to clear conversation history

---

## 🎨 Design Principles

### **Non-Technical Users First**
- ✅ **No jargon** - Use plain language, avoid technical terms
- ✅ **Visual hierarchy** - Clear headings, generous spacing
- ✅ **Progressive disclosure** - Don't overwhelm with options upfront
- ✅ **Helpful guidance** - Tooltips, examples, inline help text
- ✅ **Error messages** - Friendly, actionable error messages

**Example:**
```
❌ Bad: "API rate limit exceeded. Status 429."
✅ Good: "You've used your 3 free messages! Sign up to continue."
```

### **Lead Generation Focus**
- ✅ **Capture email early** - After 3 free messages, prompt for email
- ✅ **Value before ask** - Provide value first, then ask for info
- ✅ **Clear CTAs** - Obvious "Get More Access" buttons
- ✅ **Track conversions** - Log when users hit limits, upgrade prompts

### **Professional Quality**
- ✅ **Optimi branding** - Use brand colors consistently
- ✅ **Polish details** - Smooth animations, loading states, micro-interactions
- ✅ **Responsive design** - Works perfectly on mobile and desktop
- ✅ **Accessibility** - WCAG AA minimum (alt text, keyboard nav, contrast)

### **Fast & Simple**
- ✅ **Minimal features** - Core chat experience only
- ✅ **Fast load times** - Optimize images, lazy load components
- ✅ **No bloat** - Remove unused dependencies
- ✅ **Clear user flow** - Home → Choose category → Chat → Upgrade prompt

---

## 🧪 Testing Standards

### **Manual Testing Checklist**
Before every commit, verify:
- ✅ **Chat flow works** - Send message, receive AI response
- ✅ **3-message limit** - Free tier stops at 3 messages
- ✅ **Mobile responsive** - Test on real device or Chrome DevTools
- ✅ **Brand colors correct** - Visual check against Optimi brand guide
- ✅ **No console errors** - Check browser console for warnings/errors
- ✅ **API keys secure** - Verify no keys in client bundle

### **Cross-Browser Testing**
- ✅ Chrome (primary)
- ✅ Safari (iOS users)
- ✅ Firefox (nice to have)

### **Performance Benchmarks**
- ✅ **Page load:** < 2 seconds
- ✅ **AI response:** < 3 seconds
- ✅ **Bundle size:** Keep reasonable (check with `npm run build`)

---

## 📚 Documentation Standards

### **Code Comments**
- ✅ **Complex logic only** - Don't comment obvious code
- ✅ **Why, not what** - Explain reasoning, not just what code does
- ✅ **API endpoints** - Document request/response format
- ✅ **TODOs** - Use `// TODO:` for future improvements

**Example:**
```typescript
// Limit to last 6 messages to prevent token overflow and keep context relevant
const conversationHistory = history.slice(-6)
```

### **README Updates**
- ✅ **Keep current** - Update README when adding major features
- ✅ **Setup instructions** - Must be beginner-friendly
- ✅ **Environment variables** - Document all required env vars

### **CLAUDE.md Updates**
- ✅ **Development patterns** - Document new patterns for future Claude Code sessions
- ✅ **Gotchas** - Note Replit-specific quirks or issues

---

## 🚫 What NOT to Do

### **Avoid Scope Creep**
- ❌ **No authentication system** (for MVP - not needed yet)
- ❌ **No database** (use localStorage for now)
- ❌ **No user accounts** (capture email, but no login)
- ❌ **No complex analytics** (simple tracking only)

### **Avoid Over-Engineering**
- ❌ **No state management libraries** (Redux, Zustand - use React state)
- ❌ **No testing frameworks** (Jest, Vitest - manual testing for MVP)
- ❌ **No CI/CD pipelines** (deploy manually from Replit)
- ❌ **No microservices** (monolithic Next.js app is fine)

### **Avoid Bad UX**
- ❌ **No technical jargon** in UI text
- ❌ **No hidden CTAs** - Make upgrade prompts obvious
- ❌ **No broken mobile** - Always test mobile
- ❌ **No slow responses** - Optimize API calls

---

## 🎯 Core Principles (Summary)

1. **Non-technical users first** - If grandma can't use it, simplify it
2. **Lead generation focus** - Every feature should drive conversions
3. **Professional quality** - Optimi brand deserves polish
4. **Fast & simple** - Ship working features, not perfect features
5. **Educational value** - Teach users about prompting, don't just do it for them

---

## 🔄 Version History

- **v1.0** - November 19, 2025 - Initial Constitution for ai-dev-orchestrator integration
- **Next review:** After first 5 features built with this framework

---

**When in doubt, reference this Constitution. Keep it simple, keep it user-friendly, keep it Optimi.**
