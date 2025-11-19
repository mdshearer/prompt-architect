# Phase 2: Implementation

**Duration:** 2-4 hours (varies by feature complexity)
**Goal:** Build the feature task-by-task with working, tested code
**Persona:** Developer

---

## Overview

Phase 2 is where code gets written. The key is to work **iteratively** - break the feature into small tasks, implement one at a time, test frequently, and commit working code.

By the end of this phase, you'll have:
- ✅ Working feature implemented
- ✅ TypeScript types defined
- ✅ Components styled with Optimi brand
- ✅ Manual testing completed
- ✅ Code committed to git

---

## Step 1: Generate Task List

**Duration:** 5-10 minutes

Take the Tech Spec from Phase 1 and break it into small, sequential tasks.

### Prompt Template:

```
Based on this Technical Specification:

[Paste Tech Spec from Phase 1]

Generate a detailed task list for implementation following the Developer persona guidelines in `.claude/personas/developer.md`.

Break the feature into small tasks (15-30 minutes each) that can be:
- Implemented independently
- Tested immediately
- Committed to git

Number the tasks and order them by dependency (e.g., create types before components that use them).

Reference `/home/user/prompt-architect/CONSTITUTION.md` for coding standards.
```

### Example Task List:

```
Implementation Tasks: Save & Resume Conversations

1. Create type definitions in src/types/conversation.ts
2. Create useLocalStorage custom hook in src/hooks/useLocalStorage.ts
3. Create email hashing utility in src/lib/hash.ts
4. Create SaveButton component in src/components/chat/SaveButton.tsx
5. Create EmailCaptureModal component in src/components/modals/EmailCaptureModal.tsx
6. Create ResumePrompt component in src/components/chat/ResumePrompt.tsx
7. Integrate SaveButton into ChatHeader.tsx
8. Integrate ResumePrompt into homepage (page.tsx)
9. Add save/resume logic to ChatInterface.tsx
10. Test save functionality (Chrome desktop)
11. Test resume functionality (Chrome desktop)
12. Test on mobile (iOS Safari)
13. Fix any styling issues found
14. Run type-check and build commands
```

### Good Task Characteristics:
- ✅ **Small** - 15-30 minutes each
- ✅ **Specific** - Clear what to build
- ✅ **Testable** - Can verify it works
- ✅ **Sequential** - Logical dependency order

---

## Step 2: Implement Task-by-Task

**Duration:** 2-3 hours

Work through each task one at a time. **Do not skip ahead.** Each task should be completed, tested, and committed before moving to the next.

### For Each Task:

#### **1. Implement the task**

Use Claude Code or your preferred editor to write the code.

**Follow standards:**
- Reference `/home/user/prompt-architect/CONSTITUTION.md` for:
  - TypeScript requirements (explicit types, no `any`)
  - React patterns (functional components, hooks)
  - File naming (kebab-case files, PascalCase components)
  - Styling (Tailwind + Optimi brand colors)

**Example - Task 1: Create type definitions**

```typescript
// src/types/conversation.ts

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface SavedConversation {
  id: string
  emailHash: string
  messages: ChatMessage[]
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  lastSaved: Date
}

export interface SaveConversationOptions {
  email: string
  messages: ChatMessage[]
  category: string
}
```

#### **2. Test the task**

Verify your code works:

- **For types:** Run `npm run type-check` - should compile
- **For components:** View in browser - should render
- **For utilities:** Test with sample data - should work
- **For API routes:** Call from frontend - should respond

**Check:**
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Feature works as expected
- [ ] Mobile responsive (if UI component)
- [ ] Optimi brand colors correct (if styled component)

#### **3. Commit the task**

```bash
git add .
git commit -m "Add conversation type definitions"
git push -u origin claude/review-orchestrator-integration-01NaLRjy3K9MPwvbzamA5MJT
```

**Good commit messages:**
- ✅ `"Add SaveButton component to chat header"`
- ✅ `"Create email hashing utility for privacy"`
- ✅ `"Integrate save/resume logic into ChatInterface"`

**Bad commit messages:**
- ❌ `"changes"`
- ❌ `"wip"`
- ❌ `"fixed stuff"`

#### **4. Move to next task**

Repeat for each task in the list.

---

## Step 3: Integration Testing

**Duration:** 20-30 minutes

After all tasks are complete, test the feature end-to-end.

### Happy Path Test:

**Scenario:** User saves and resumes a conversation

1. Start a new chat
2. Send 3 messages
3. Click "Save" button
4. Enter email address
5. Verify success message
6. Close browser (or open incognito window)
7. Return to homepage
8. Verify "Resume" prompt appears
9. Click "Resume"
10. Verify conversation restored

**Expected:** All steps work smoothly
**Actual:** [Document what happens]

### Edge Case Tests:

Test unusual but valid scenarios:

1. **No messages** - What happens if user tries to save with 0 messages?
2. **Invalid email** - What if user enters "notanemail"?
3. **Already saved** - What if user saves twice with same email?
4. **Different email** - What if user tries to resume with wrong email?
5. **Old saved data** - What if localStorage has corrupted data?

**For each:**
- Expected behavior: [What should happen?]
- Actual behavior: [What actually happened?]
- Pass/Fail: [Did it pass?]

### Cross-Browser Test:

- [ ] Chrome desktop - Works correctly
- [ ] Safari desktop - Works correctly
- [ ] iOS Safari - Works correctly
- [ ] Android Chrome - Works correctly

### Document Issues:

```markdown
## Issues Found During Testing

### Issue 1: Save button appears with 0 messages
**Severity:** Low
**Expected:** Button disabled or hidden when no messages
**Actual:** Button clickable, but shows error
**Fix:** Add `disabled={messages.length === 0}` to SaveButton

### Issue 2: Email validation too strict
**Severity:** Medium
**Expected:** Accept "user@domain.com"
**Actual:** Rejects emails without TLD extension
**Fix:** Update email regex to allow simple formats
```

---

## Step 4: Fix Issues & Retest

**Duration:** 30-60 minutes

Address issues found in testing:

1. Fix critical issues (app broken, data loss)
2. Fix medium issues (confusing UX, validation problems)
3. Fix low issues (cosmetic, nice-to-haves) - optional

For each fix:
- Implement the fix
- Test that it resolves the issue
- Test that it doesn't break other things
- Commit: `git commit -m "Fix save button disabled state"`

---

## Step 5: Final Verification

**Duration:** 10 minutes

Before declaring implementation complete:

### Code Quality:
```bash
# TypeScript compiles
npm run type-check

# Build succeeds
npm run build

# Linter passes (optional but recommended)
npm run lint
```

### Functionality:
- [ ] Happy path works perfectly
- [ ] Edge cases handled gracefully
- [ ] Error states show helpful messages
- [ ] Loading states appear appropriately

### Design:
- [ ] Optimi brand colors used (optimi-blue, optimi-primary, etc.)
- [ ] Spacing consistent with existing UI
- [ ] Mobile responsive
- [ ] Animations smooth

### Security:
- [ ] No API keys in client code
- [ ] User inputs sanitized
- [ ] No sensitive data in console logs
- [ ] Email hashed before storage (if applicable)

### Performance:
- [ ] No unnecessary re-renders
- [ ] localStorage usage reasonable (< 5MB)
- [ ] No memory leaks
- [ ] Smooth on mobile devices

---

## Deliverables

At the end of Phase 2, you should have:

1. **Working feature** - Fully functional, tested code
2. **Git commits** - Each task committed with clear messages
3. **Clean codebase** - No console errors, TypeScript errors, or build failures
4. **Documentation notes** - Issues found, decisions made (for Phase 4)

---

## Example Complete Phase 2

### Feature: Save & Resume Conversations

**Tasks Completed:** 14 tasks over 3 hours

**Files Created:**
- `src/types/conversation.ts` - Type definitions
- `src/hooks/useLocalStorage.ts` - Custom hook
- `src/lib/hash.ts` - Email hashing utility
- `src/components/chat/SaveButton.tsx` - Save button component
- `src/components/modals/EmailCaptureModal.tsx` - Email modal
- `src/components/chat/ResumePrompt.tsx` - Resume prompt

**Files Modified:**
- `src/components/chat/ChatHeader.tsx` - Added SaveButton
- `src/app/page.tsx` - Added ResumePrompt
- `src/components/ChatInterface.tsx` - Added save/resume logic

**Testing Results:**
- ✅ Happy path: Perfect
- ✅ Edge cases: All handled
- ✅ Mobile: Works on iOS/Android
- ✅ Security: Email hashed, no leaks

**Issues Fixed:**
- Save button disabled state
- Email validation regex
- localStorage quota handling

**Commits:** 14 commits (one per task + 3 fix commits)

**Next Step:** Move to Phase 3 (Review & Refactoring)

---

## Tips for Success

### Workflow Tips:
1. **One task at a time** - Don't jump ahead
2. **Test immediately** - Catch issues early
3. **Commit frequently** - Every working task
4. **Keep app working** - Don't break existing features
5. **Check Constitution** - Follow project standards

### Common Issues:

**Problem:** "I don't know where to start"
**Solution:** Start with types, then utilities, then components (small → large)

**Problem:** "Task is taking too long (> 1 hour)"
**Solution:** Break it into smaller tasks, implement simplest version first

**Problem:** "Feature works but breaks existing code"
**Solution:** Test existing features after each task, fix immediately

**Problem:** "Build fails with TypeScript errors"
**Solution:** Fix types before moving forward - don't accumulate type errors

**Problem:** "Not sure if this is good enough"
**Solution:** If it works, passes tests, and follows Constitution → it's good enough

### When to Ask for Help:

If stuck for > 30 minutes:
1. Document what you tried
2. Describe the issue clearly
3. Ask specific question (not "it doesn't work")
4. Include error messages / screenshots

---

## Development Principles

1. **Iterate, don't perfect** - Working code > perfect code
2. **Test constantly** - Every change should be verified
3. **Commit working code** - Each commit should be deployable
4. **Follow standards** - Constitution is your guide
5. **Keep it simple** - Simplest solution that works wins

---

**Next Phase:** [Phase 3: Review & Refactoring](./phase-3-review.md)
