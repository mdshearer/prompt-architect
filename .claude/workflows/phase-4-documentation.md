# Phase 4: Documentation

**Duration:** 15-30 minutes
**Goal:** Update documentation so the feature is discoverable and maintainable
**Persona:** Technical Writer

---

## Overview

Phase 4 ensures your feature is documented for both users and developers. Good documentation means:
- Future you remembers how this works
- Other developers can understand and extend it
- Users know how to use the feature
- Patterns are reusable for future features

By the end of this phase, you'll have:
- ✅ README.md updated with new feature
- ✅ CLAUDE.md updated with patterns and context
- ✅ Code comments added for complex logic
- ✅ All documentation tested and accurate

---

## Step 1: Update README.md

**Duration:** 5-10 minutes

### What to Update:

**If feature is user-facing:**

Add to the "Features" section:

```markdown
## Features

✅ **Interactive chat interface** for prompt coaching
✅ **Three coaching categories**: Custom Instructions, Projects/Gems, Thread Prompts
✅ **Free tier**: 3 messages, then email capture
✅ **OPTIMI framework builder** with step-by-step guidance
✅ **Export conversations to PDF** with Optimi branding
✅ **Save & Resume conversations** - Never lose your progress [NEW]
```

**If feature affects setup:**

Update setup instructions:

```markdown
## Quick Setup

1. **Clone & Install**
   ```bash
   git clone [repo]
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```
   TOGETHER_AI_API_KEY=your_key_here
   # Optional: for email notifications
   SENDGRID_API_KEY=your_sendgrid_key
   ```
```

**If feature adds new commands:**

```markdown
## Commands

- `npm run dev` - Start development server (port 3001)
- `npm run build` - Production build
- `npm run export` - Export all conversations to JSON [NEW]
```

### Example README Update:

```diff
## Features

✅ Interactive chat interface for prompt coaching
✅ Three coaching categories: Custom Instructions, Projects/Gems, Thread Prompts
✅ Free tier: 3 messages, then email capture
✅ OPTIMI framework builder with step-by-step guidance
+ ✅ **Save & Resume** - Save conversations with email, resume anytime
```

**Commit:**
```bash
git commit -m "Update README with save/resume feature"
```

---

## Step 2: Update CLAUDE.md

**Duration:** 10-15 minutes

### What to Add:

**1. Feature Overview**

Update the "Core Features" section with the new feature:

```markdown
## Core Features

- **Free tier**: Limited chat sessions with AI-powered prompt development assistance
- **Authenticated tier**: Additional chat sessions after user login
- **Save & Resume**: Users can save conversations locally and resume later
- **AI Integration**: Uses Together.ai for conversational prompt improvement
- **Lead Generation**: Captures user information for Optimi's sales funnel
```

**2. Technical Patterns**

Document new patterns for future developers:

```markdown
## Development Patterns

### LocalStorage Management

For persisting user data across sessions:

```typescript
// Save data
const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('LocalStorage save failed:', error)
  }
}

// Load data
const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    return defaultValue
  }
}
```

**Usage:** See `src/hooks/useLocalStorage.ts` for complete implementation.

### Email Hashing for Privacy

When storing user emails:

```typescript
import { hashEmail } from '@/lib/hash'

const emailHash = await hashEmail(userEmail)
localStorage.setItem(`user-data-${emailHash}`, data)
```

**Important:** Never store plain email addresses in localStorage.
```

**3. New File Locations**

Document new components and utilities:

```markdown
## Code Organization

```
src/
├── components/
│   ├── chat/
│   │   ├── SaveButton.tsx           # Save conversation button [NEW]
│   │   └── ResumePrompt.tsx         # Resume conversation prompt [NEW]
│   └── modals/
│       └── EmailCaptureModal.tsx    # Email capture for saving [NEW]
├── hooks/
│   └── useLocalStorage.ts           # LocalStorage custom hook [NEW]
├── lib/
│   └── hash.ts                      # Email hashing utility [NEW]
└── types/
    └── conversation.ts              # Conversation types [NEW]
```
```

**4. Environment Variables (if added)**

```markdown
## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Not used (legacy)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Not used (legacy)
- `TOGETHER_AI_API_KEY` - Together.ai API key for chat
- `SENDGRID_API_KEY` - Optional: for email notifications [NEW]
```

**5. Known Issues / Gotchas**

```markdown
## Known Issues

### LocalStorage Quota

- **Issue:** localStorage has 5-10MB limit per domain
- **Impact:** Users with 100+ saved conversations may hit limit
- **Workaround:** Implement cleanup of old conversations (TODO)
- **File:** `src/hooks/useLocalStorage.ts`

### Email Hashing Browser Compatibility

- **Issue:** `crypto.subtle.digest` requires HTTPS or localhost
- **Impact:** Hash function fails on HTTP sites
- **Solution:** App must be served over HTTPS in production
- **File:** `src/lib/hash.ts`
```

### Example CLAUDE.md Update:

```diff
## Core Features

- **Free tier**: Limited chat sessions with AI-powered prompt development assistance
- **Authenticated tier**: Additional chat sessions after user login
+ - **Save & Resume**: Users can save conversations with email, resume later via localStorage
- **AI Integration**: Uses Together.ai for conversational prompt improvement
```

**Commit:**
```bash
git commit -m "Update CLAUDE.md with save/resume patterns"
```

---

## Step 3: Add Code Comments

**Duration:** 5 minutes

Add comments for complex logic that isn't immediately obvious.

### What to Comment:

**✅ Comment these:**
- Complex algorithms
- Security considerations
- Performance optimizations
- Workarounds or hacks
- Business logic decisions

**❌ Don't comment these:**
- Obvious code (what code already says)
- Function names that are self-explanatory
- Standard patterns (useState, map, etc.)

### Examples:

**✅ Good comments:**

```typescript
// Hash email with SHA-256 before storage to protect user privacy
// Plain text emails in localStorage are a security risk
const emailHash = await hashEmail(email)

// Limit conversation history to last 20 messages to prevent localStorage quota errors
// Full history is preserved but not sent to AI (token limits)
const recentMessages = messages.slice(-20)

// Safari doesn't support crypto.subtle on HTTP, so fall back to simple hash
// This is less secure but ensures feature works everywhere
if (!window.crypto?.subtle) {
  return simpleHash(email)
}
```

**❌ Bad comments:**

```typescript
// Set loading to true
setLoading(true)

// Map over messages
messages.map(msg => ...)

// Call the API
await fetch('/api/chat', ...)
```

### Where to Add Comments:

**1. Complex utilities:**

```typescript
// src/lib/hash.ts

/**
 * Hashes an email address using SHA-256 for privacy-safe storage.
 *
 * @param email - User email address to hash
 * @returns Promise<string> - Hex-encoded SHA-256 hash
 *
 * @example
 * const hash = await hashEmail('user@example.com')
 * // Returns: 'b4c9a...' (64-character hex string)
 *
 * @security Email addresses are PII and should never be stored in plain text.
 * This function creates a one-way hash suitable for localStorage keys.
 *
 * @compatibility Requires HTTPS or localhost (crypto.subtle limitation)
 */
export async function hashEmail(email: string): Promise<string> {
  // Implementation...
}
```

**2. Business logic:**

```typescript
// src/components/chat/ChatInterface.tsx

const handleSend = async () => {
  // Free tier users get 3 messages max before email capture
  // This is the primary lead generation mechanism
  if (messageCount >= 3 && !userEmail) {
    setShowEmailCapture(true)
    return
  }

  // Proceed with sending message...
}
```

**3. Workarounds:**

```typescript
// src/hooks/useLocalStorage.ts

try {
  localStorage.setItem(key, value)
} catch (error) {
  // Safari private mode throws QuotaExceededError even with space available
  // Gracefully degrade to session-only storage
  if (error.name === 'QuotaExceededError') {
    console.warn('LocalStorage unavailable, using sessionStorage')
    sessionStorage.setItem(key, value)
  }
}
```

**Commit:**
```bash
git commit -m "Add code comments for email hashing and localStorage"
```

---

## Step 4: Test Documentation Accuracy

**Duration:** 5 minutes

Verify all documentation is accurate and up-to-date.

### Checklist:

**README.md:**
- [ ] All listed features actually exist
- [ ] Setup instructions work (test from scratch if possible)
- [ ] Environment variables are correct
- [ ] Commands run successfully
- [ ] Links are valid

**CLAUDE.md:**
- [ ] Feature descriptions match reality
- [ ] File paths are correct
- [ ] Code examples are copy-paste ready
- [ ] Environment variables list is complete
- [ ] Tech stack is accurate (no outdated references)

**Code Comments:**
- [ ] Comments explain WHY, not WHAT
- [ ] Complex logic is documented
- [ ] Security notes are present where needed
- [ ] No outdated comments from previous code

### Common Documentation Issues:

**Issue:** README lists feature that doesn't exist
**Fix:** Remove the feature or add TODO

**Issue:** CLAUDE.md references Supabase (we use Replit)
**Fix:** Update tech stack section

**Issue:** Code example has syntax errors
**Fix:** Test the code, fix the example

**Issue:** File paths are wrong (file was moved)
**Fix:** Update paths to match current structure

**Issue:** Environment variable missing from docs
**Fix:** Add to CLAUDE.md and .env.local.example

---

## Step 5: Optional User Guide

**Duration:** 10-15 minutes (optional)

For major features, consider creating a user-facing guide.

### When to Create User Guides:

- ✅ Feature is complex (multi-step process)
- ✅ Feature is central to product (save/resume)
- ✅ Users might miss the feature (needs discovery)
- ✅ Feature has tips/tricks for best use

### Example User Guide:

Create `docs/guides/save-resume.md`:

```markdown
# How to Save & Resume Your Conversations

Never lose your progress! Prompt Architect lets you save your conversations and pick up where you left off.

## Quick Start

1. **Start a conversation** - Chat with the AI to improve your prompts
2. **Click the Save button** - Find it in the top-right corner (💾 icon)
3. **Enter your email** - We'll use this to link your saved conversations
4. **Resume anytime** - When you return, you'll see a "Resume" button

## How It Works

Your conversations are saved **locally in your browser** (not on our servers). Your email is hashed for privacy - we can't see it.

### Your Privacy

- ✅ Conversations stored in your browser only
- ✅ Email addresses are hashed (we can't read them)
- ✅ No data sent to servers
- ✅ You can clear saved data anytime

## Tips & Tricks

**Save Early, Save Often**
Don't wait until you're done - save as you go. If your browser crashes, you'll lose unsaved progress.

**Use the Same Email**
To resume a conversation, use the exact same email you saved with. Different email = can't find your conversation.

**Multiple Conversations**
Each conversation is saved separately. You can save different conversations with different emails.

**Clear Old Conversations**
Too many saved conversations? Open your browser's developer tools → Application → Local Storage → Clear old data.

## Troubleshooting

### "Can't find saved conversation"

**Cause:** Using different email, or browser data was cleared

**Solution:**
- Use the exact email you saved with
- Check you're in the same browser
- Check you're not in private/incognito mode

### "Email already used"

**Cause:** You already have a saved conversation with that email

**Solution:**
- Use the resume button instead of saving again
- Or use a different email for this conversation

## Need Help?

Questions? Contact us at support@optimi.com
```

This guide can be linked from the app or included in onboarding emails.

---

## Deliverables

At the end of Phase 4, you should have:

1. **README.md updated** - Feature listed, setup accurate
2. **CLAUDE.md updated** - Patterns documented, files listed
3. **Code comments added** - Complex logic explained
4. **Documentation tested** - All instructions verified accurate
5. **Optional: User guide** - End-user documentation created

---

## Example Complete Phase 4

### Feature: Save & Resume Conversations

**Documentation Updates:**

**README.md:** Added feature to list ✅
**CLAUDE.md:**
- Added to Core Features section ✅
- Documented localStorage pattern ✅
- Documented email hashing pattern ✅
- Listed new files (SaveButton, hooks, etc.) ✅
- Added known issues (localStorage quota, HTTPS requirement) ✅

**Code Comments:**
- Added JSDoc to `hashEmail()` function ✅
- Explained 3-message limit in ChatInterface ✅
- Documented Safari workaround in useLocalStorage ✅

**User Guide:** Created `docs/guides/save-resume.md` ✅

**Testing:** All documentation tested and accurate ✅

**Commits:** 3 documentation commits

**Status:** ✅ Complete

---

## Final Step: Feature Complete

### Checklist:

Phase 1: Planning ✅
- [ ] PRD created
- [ ] Tech spec created

Phase 2: Implementation ✅
- [ ] Feature implemented
- [ ] All tasks completed
- [ ] Code committed

Phase 3: Review ✅
- [ ] QA review completed
- [ ] Critical issues fixed
- [ ] Production-ready

Phase 4: Documentation ✅
- [ ] README.md updated
- [ ] CLAUDE.md updated
- [ ] Code comments added
- [ ] Documentation tested

### Final Commit:

```bash
git add .
git commit -m "Complete save/resume feature - ready for production"
git push -u origin claude/review-orchestrator-integration-01NaLRjy3K9MPwvbzamA5MJT
```

### Next Steps:

**If on feature branch:**
- Create pull request to main
- Request review (or merge if solo)
- Deploy to production

**If ready to deploy:**
- Merge to main
- Push to Replit
- Monitor for issues
- Celebrate! 🎉

---

## Tips for Success

### Documentation Tips:
1. **Be specific** - Vague docs are useless ("it's fast" → "< 2s load time")
2. **Test everything** - Run every command, check every link
3. **Keep it current** - Update docs when code changes
4. **Think of future you** - Write for yourself in 6 months
5. **Use examples** - Code samples, screenshots, step-by-step

### Common Mistakes:
- ❌ Skipping documentation (future you will hate past you)
- ❌ Vague descriptions ("improves performance")
- ❌ Outdated examples (copy-paste fails)
- ❌ Missing file paths (where is this code?)
- ❌ No troubleshooting (users get stuck)

### Time-Saving Tips:
- Update docs as you code (not at the end)
- Copy-paste code examples directly (ensures accuracy)
- Use screenshots for UI features
- Link to related docs (don't duplicate)

---

## When to Skip Documentation

Phase 4 can be minimal for:
- **Tiny bug fixes** - Just the git commit message
- **Internal refactoring** - Brief note in CLAUDE.md
- **Experimental features** - Can document if it works out

But for production features:
- **Always update README**
- **Always update CLAUDE.md**
- **Always add code comments for complex logic**

---

**Congratulations!** You've completed all 4 phases of the ai-dev-orchestrator workflow. Your feature is:
- ✅ Well-planned (Phase 1)
- ✅ Fully implemented (Phase 2)
- ✅ Quality-assured (Phase 3)
- ✅ Well-documented (Phase 4)

**Ship it!** 🚀
