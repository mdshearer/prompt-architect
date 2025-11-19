# Phase 3: Review & Refactoring

**Duration:** 30-60 minutes
**Goal:** Ensure quality, security, and maintainability before shipping
**Persona:** QA Engineer (with Developer support for fixes)

---

## Overview

Phase 3 is quality assurance. Even though you tested during implementation (Phase 2), this phase provides a comprehensive, systematic review of the feature from multiple angles.

By the end of this phase, you'll have:
- ✅ Comprehensive QA report
- ✅ All critical issues fixed
- ✅ Security verified
- ✅ Performance validated
- ✅ Production-ready code

---

## Step 1: Comprehensive QA Review

**Persona:** QA Engineer
**Duration:** 30 minutes

### Prompt Template:

```
I've just implemented this feature:

**Feature:** [Feature name]
**Branch:** claude/review-orchestrator-integration-01NaLRjy3K9MPwvbzamA5MJT
**Files Changed:**
[List key files]

**Feature Description:**
[Brief description of what the feature does]

Perform a comprehensive QA review following the QA Engineer persona guidelines in `.claude/personas/qa-engineer.md`.

Reference `/home/user/prompt-architect/CONSTITUTION.md` for:
- Security requirements (API keys, input validation)
- Performance benchmarks (< 2s load time)
- Design standards (Optimi brand colors, mobile-first)
- Non-technical user focus

Please test:
1. Functional testing (happy path + edge cases)
2. Mobile & cross-browser compatibility
3. UX & accessibility
4. Security review
5. Performance testing

Provide a detailed QA report with:
- Issues found (categorized by severity: Critical/Medium/Low)
- Steps to reproduce each issue
- Recommended fixes
- Overall pass/fail status
```

### What to Provide:

Gather information for the QA Engineer:

```bash
# List files changed
git diff --name-only main

# Get feature details
# - Feature name: Save & Resume Conversations
# - What it does: Users can save conversation with email, resume later
# - Key user flows: Save → Email capture → Resume on return
```

### QA Review Areas:

The QA Engineer will test:

#### **1. Functional Testing**
- Happy path (primary user flow)
- Edge cases (empty data, max data, special characters)
- Error handling (network failures, invalid inputs)

#### **2. Mobile & Browser**
- iOS Safari (real device or simulator)
- Android Chrome (real device or simulator)
- Desktop Chrome, Safari, Firefox

#### **3. UX & Accessibility**
- Non-technical user friendliness
- Visual polish (colors, spacing, alignment)
- Accessibility (keyboard nav, screen readers, contrast)

#### **4. Security**
- API key exposure check
- Input validation
- Data privacy (localStorage, console logs)

#### **5. Performance**
- Page load times
- Bundle size impact
- Runtime performance

---

## Step 2: Review QA Report

**Duration:** 5 minutes

The QA Engineer will provide a report like:

```markdown
# QA Report: Save & Resume Conversations

**Overall Status:** ⚠️ Pass with Issues
**Recommendation:** Fix 2 critical issues before merge

---

## Issues Found

### 🔴 Critical Issues (Must Fix)

**Issue #1: Save button crashes with no messages**
- **Severity:** Critical
- **Impact:** App breaks if user clicks save with empty chat
- **Steps to reproduce:**
  1. Open app
  2. Click save button immediately (no messages sent)
  3. App crashes with TypeError
- **Fix:** Add validation: `if (messages.length === 0) return`

**Issue #2: Email stored in plain text in localStorage**
- **Severity:** Critical (Security)
- **Impact:** User email visible in browser storage
- **Steps to reproduce:**
  1. Save conversation with email
  2. Open DevTools → Application → localStorage
  3. Email visible in plain text
- **Fix:** Hash email before storage (use SHA-256)

### 🟡 Medium Issues (Should Fix)

**Issue #3: Mobile keyboard covers input field**
- **Severity:** Medium
- **Impact:** Users can't see what they're typing on mobile
- **Fix:** Add `scrollIntoView()` when input is focused

### 🟢 Low Issues (Nice to Fix)

**Issue #4: Loading state missing on save**
- **Severity:** Low
- **Impact:** No feedback during save (confusing but not broken)
- **Fix:** Add spinner/loading text during save

---

## Test Results Summary

- Functional: ⚠️ Issues #1, #4
- Mobile & Browser: ⚠️ Issue #3
- UX & Accessibility: ✅ Pass
- Security: ❌ Issue #2 (critical)
- Performance: ✅ Pass
```

Prioritize fixes:
1. **🔴 Critical** - Must fix before merge (app broken or security issue)
2. **🟡 Medium** - Should fix before merge (bad UX)
3. **🟢 Low** - Nice to fix (can be done later)

---

## Step 3: Fix Critical & Medium Issues

**Persona:** Developer
**Duration:** 20-45 minutes

For each critical and medium issue:

### Fix Process:

**1. Understand the issue**
- Read steps to reproduce
- Reproduce it yourself
- Verify it's actually a problem

**2. Implement the fix**
- Make minimal changes
- Don't refactor other code (scope creep)
- Follow the recommended fix if provided

**3. Test the fix**
- Verify issue is resolved
- Test that fix doesn't break other things
- Re-test original feature still works

**4. Commit the fix**
```bash
git add .
git commit -m "Fix save button crash with empty messages"
git push
```

### Example Fixes:

**Issue #1: Save button crashes with no messages**

```typescript
// src/components/chat/SaveButton.tsx

export default function SaveButton({ messages, onSave }: SaveButtonProps) {
  const handleSave = () => {
    // ADD THIS CHECK
    if (messages.length === 0) {
      alert('Please send at least one message before saving')
      return
    }

    onSave()
  }

  return (
    <button
      onClick={handleSave}
      disabled={messages.length === 0} // Also disable button visually
      className="bg-optimi-blue..."
    >
      Save
    </button>
  )
}
```

**Commit:**
```bash
git commit -m "Fix save button validation for empty messages"
```

---

**Issue #2: Email stored in plain text**

```typescript
// src/lib/hash.ts

export async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(email.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
```

```typescript
// src/components/chat/SaveButton.tsx

const handleSave = async () => {
  const email = await getEmailFromUser() // from modal
  const emailHash = await hashEmail(email) // Hash it!

  const conversation: SavedConversation = {
    id: generateId(),
    emailHash, // Store hash, not plain email
    messages,
    category,
    lastSaved: new Date()
  }

  localStorage.setItem(`prompt-architect-${emailHash}`, JSON.stringify(conversation))
}
```

**Commit:**
```bash
git commit -m "Hash user emails before localStorage for privacy"
```

---

**Issue #3: Mobile keyboard covers input**

```typescript
// src/components/modals/EmailCaptureModal.tsx

const handleFocus = () => {
  // Scroll input into view when focused on mobile
  if (inputRef.current) {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300) // Wait for keyboard to appear
  }
}

<input
  ref={inputRef}
  type="email"
  onFocus={handleFocus}
  ...
/>
```

**Commit:**
```bash
git commit -m "Fix mobile keyboard covering email input"
```

---

## Step 4: Regression Testing

**Duration:** 10 minutes

After fixing issues, verify you didn't break anything:

### Test Checklist:
- [ ] Original feature still works (happy path)
- [ ] All issues are actually fixed
- [ ] No new issues introduced
- [ ] Existing features unaffected (chat, builders, etc.)
- [ ] TypeScript still compiles: `npm run type-check`
- [ ] Build still succeeds: `npm run build`

If regression found:
- Fix it immediately
- Test again
- Don't accumulate regressions

---

## Step 5: Optional Refactoring

**Duration:** 15-30 minutes (optional)

If time permits and code could be cleaner:

### When to Refactor:
- ✅ Code duplication (extract to shared utility)
- ✅ Long components (> 300 lines → split into smaller components)
- ✅ Unclear naming (rename for clarity)
- ✅ Missing types (add explicit types)

### When NOT to Refactor:
- ❌ Code works fine but isn't "perfect"
- ❌ You just want to use a different pattern
- ❌ You're refactoring unrelated code
- ❌ It's late and you're tired (will introduce bugs)

### Refactoring Examples:

**Before: Duplicated email validation**
```typescript
// SaveButton.tsx
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// EmailCaptureModal.tsx
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
```

**After: Shared utility**
```typescript
// src/lib/validation.ts
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Both files import it
import { isValidEmail } from '@/lib/validation'
```

**Commit:**
```bash
git commit -m "Extract email validation to shared utility"
```

---

## Step 6: Final Verification

**Duration:** 5 minutes

Before declaring Phase 3 complete:

### Final Checks:
```bash
# Clean build
npm run build

# Type check
npm run type-check

# Lint (optional but recommended)
npm run lint
```

### Manual Verification:
- [ ] Feature works perfectly (happy path)
- [ ] All critical issues fixed
- [ ] All medium issues fixed (or documented as "known issues")
- [ ] No new bugs introduced
- [ ] Mobile tested on real device
- [ ] Security verified (no API keys exposed, emails hashed)

---

## Deliverables

At the end of Phase 3, you should have:

1. **QA Report** - Detailed testing results
2. **Fixes Committed** - All critical/medium issues resolved
3. **Clean Build** - No TypeScript errors, build succeeds
4. **Production-Ready Code** - Feature ready to merge/deploy

---

## Example Complete Phase 3

### Feature: Save & Resume Conversations

**QA Review:** 30 minutes
- Found 4 issues (2 critical, 1 medium, 1 low)

**Fixes Applied:** 25 minutes
- Issue #1: Save validation ✅
- Issue #2: Email hashing ✅
- Issue #3: Mobile keyboard ✅
- Issue #4: Low priority, skipped for now

**Regression Testing:** 10 minutes
- All features still work ✅
- No new issues ✅

**Refactoring:** Skipped (code is clean enough)

**Final Status:** ✅ Production Ready

**Commits:** 3 fix commits

**Next Step:** Move to Phase 4 (Documentation)

---

## Tips for Success

### QA Tips:
1. **Be thorough** - Test everything, not just happy path
2. **Document clearly** - Steps to reproduce are critical
3. **Prioritize** - Critical > Medium > Low
4. **Think like a user** - Non-technical perspective
5. **Check security** - Always verify API keys, input validation

### Fixing Tips:
1. **Fix critical first** - Don't spend time on low-priority cosmetic issues
2. **Minimal changes** - Don't refactor everything while fixing
3. **Test immediately** - Verify fix works before moving on
4. **One fix per commit** - Makes debugging easier later
5. **Regression test** - Ensure you didn't break other things

### Common Mistakes:
- ❌ Skipping QA review (issues reach users)
- ❌ Fixing low-priority issues before critical ones
- ❌ Refactoring during bug fixes (scope creep)
- ❌ Not testing fixes (fix one bug, create another)
- ❌ Ignoring security issues (data leaks, XSS, etc.)

---

## When Issues Can't Be Fixed

If a critical issue is found that can't be fixed quickly:

1. **Document it** - Write up the issue clearly
2. **Decide**: Fix now vs. Redesign vs. Descope feature
3. **If fixing takes > 2 hours** - Consider redesigning or descoping
4. **Don't ship broken features** - Better to delay than ship buggy code

---

**Next Phase:** [Phase 4: Documentation](./phase-4-documentation.md)
