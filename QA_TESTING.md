# QA Testing Documentation - Prompt Architect

**Project:** Prompt Architect
**Branch:** claude/onboarding-intake-flow-011fpDfcohzUU2SjXnwVu2Xv
**Testing Date:** 2025-11-21
**Phase:** Onboarding Intake Flow Complete

---

## Executive Summary

This document provides comprehensive testing procedures for the Prompt Architect application following Phase 1 (Critical Fixes) and Phase 2 (Security Hardening) completion.

### Changes Implemented

**Phase 1: Critical Fixes**
- ✅ Removed Supabase dependencies and dead code
- ✅ Fixed TypeScript `any` violations with proper UIElements interface
- ✅ Fixed usage counter race condition (optimistic increment)
- ✅ Implemented crypto.randomUUID() for message IDs
- ✅ Added environment variable validation
- ✅ Consolidated duplicate chat components

**Phase 2: Security Hardening**
- ✅ Server-side rate limiting implemented
- ✅ Input sanitization and validation
- ✅ Input length validation (2000 char max)
- ✅ Fetch timeouts (30 second limit)

**Phase 3: Code Quality**
- ✅ File naming conventions fixed (kebab-case)
- ✅ Magic numbers extracted to constants
- ✅ Code organization improved
- ✅ Removed deprecated components

**Onboarding Intake Flow (November 21, 2025)**
- ✅ 3-step onboarding intake flow implemented
- ✅ 8 new onboarding components added
- ✅ Intake API endpoint created (`/api/chat/intake`)
- ✅ Cookie-based session persistence
- ✅ Timer cleanup with useRef pattern
- ✅ Copy feedback error handling
- ✅ Shared CheckIcon component extracted

---

## Testing Checklist

### ✅ Pre-Testing Setup

- [ ] Ensure `node_modules` are installed: `npm install`
- [ ] Verify environment variables in `.env.local`:
  - `TOGETHER_AI_API_KEY` is set
- [ ] Start development server: `npm run dev`
- [ ] Confirm server runs on port 3001
- [ ] Clear browser cache and localStorage

---

## 1. Functional Testing

### Test Case 1.1: Free Message Limit Enforcement

**Objective:** Verify that users are limited to 3 free messages per category

**Steps:**
1. Navigate to http://localhost:3001
2. Click "Custom Instructions" category
3. Send message #1: "Help me write a custom instruction"
4. Verify message is sent and AI responds
5. Send message #2: "Can you improve it?"
6. Verify message is sent and AI responds
7. Send message #3: "What else can I add?"
8. Verify message is sent and AI responds
9. Check header shows "3/3 free conversations used"
10. Attempt to send message #4
11. Verify input field is disabled
12. Verify upgrade prompt is displayed

**Expected Results:**
- ✅ First 3 messages send successfully
- ✅ Counter increments: 1/3, 2/3, 3/3
- ✅ 4th message blocked with upgrade prompt
- ✅ Input field disabled at limit
- ✅ Server-side rate limit enforced (429 status)

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1.2: Rapid Message Submission (Race Condition Test)

**Objective:** Verify no duplicate messages when rapidly clicking send

**Steps:**
1. Open application, select any category
2. Type a message: "Test message"
3. Rapidly click Send button 5 times in succession
4. Observe message list

**Expected Results:**
- ✅ Only 1 message sent
- ✅ Usage counter increments by 1 only
- ✅ No duplicate messages in UI
- ✅ API called only once

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

**Implementation Notes:**
- Usage counter incremented optimistically (before API call)
- Counter decremented on error
- Send button disabled while `isLoading`

---

### Test Case 1.3: Network Error Handling

**Objective:** Verify graceful handling of API failures

**Steps:**
1. Open application, select category
2. Open Browser DevTools → Network tab
3. Enable "Offline" mode
4. Send a message
5. Observe error handling
6. Disable "Offline" mode
7. Send another message

**Expected Results:**
- ✅ Friendly error message displayed
- ✅ Usage counter NOT incremented on error
- ✅ No app crash
- ✅ User can retry after reconnecting
- ✅ Error message shows in chat as assistant response

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1.4: API Timeout Handling

**Objective:** Verify 30-second timeout aborts long requests

**Steps:**
1. Send a message that may take long to process
2. Wait up to 30 seconds
3. Observe timeout behavior

**Expected Results:**
- ✅ Request aborts at 30 seconds
- ✅ Timeout error message shown
- ✅ Usage counter decremented
- ✅ App remains responsive

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

**Implementation:** See `chat-container.tsx:151` - `AbortController` with `API_TIMEOUT_MS` (30000ms)

---

### Test Case 1.5: Input Length Validation

**Objective:** Verify 2000 character limit enforcement

**Steps:**
1. Open application, select category
2. Paste a message > 2000 characters
3. Attempt to send
4. Observe validation

**Expected Results:**
- ✅ Server rejects messages > 2000 chars
- ✅ Error message returned (400 status)
- ✅ Usage counter NOT incremented
- ✅ Clear error message to user

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

**Implementation:** See `lib/input-validation.ts:106` - `MAX_MESSAGE_LENGTH` constant

---

### Test Case 1.6: Category-Specific Welcome Messages

**Objective:** Verify each category shows appropriate welcome message

**Steps:**
1. Click "Custom Instructions" → verify welcome message
2. Close chat, click "Projects & Gems" → verify welcome message
3. Close chat, click "Thread Conversations" → verify welcome message

**Expected Results:**
- ✅ Each category shows unique, educational welcome message
- ✅ Welcome messages include examples and guidance
- ✅ UI elements (if any) render correctly

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1.7: Message Persistence Within Session

**Objective:** Verify messages remain visible during session

**Steps:**
1. Send 3 messages in a category
2. Scroll up to view earlier messages
3. Close chat modal
4. Reopen same category

**Expected Results:**
- ✅ All messages visible during session
- ✅ Messages cleared on close/reopen (no localStorage persistence yet)
- ✅ Scroll to bottom on new message

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

---

## 1B. Onboarding Intake Flow Testing

### Test Case 1B.1: Complete Intake Flow

**Objective:** Verify 3-step intake flow completes successfully

**Steps:**
1. Navigate to http://localhost:3001
2. Verify intake flow displays (Step 1 of 3)
3. Select "ChatGPT" as AI tool
4. Verify Step 2 shows with "Prompt Architect" recommended
5. Select "Prompt Architect"
6. Verify Step 3 shows input field
7. Enter 50+ characters describing your needs
8. Click "Generate My Prompt"
9. Verify output displays with setup instructions

**Expected Results:**
- ✅ All 3 steps navigate correctly
- ✅ Progress indicator updates
- ✅ Output displays with two sections (for Prompt Architect)
- ✅ Copy buttons work
- ✅ Session persists on page refresh

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1B.2: Input Validation (20-500 chars)

**Objective:** Verify intake input validation enforces character limits

**Steps:**
1. Navigate to Step 3 of intake
2. Enter less than 20 characters
3. Attempt to submit
4. Verify validation error shown
5. Enter more than 500 characters
6. Verify character counter shows over-limit
7. Enter exactly 50 characters
8. Verify submit button enabled

**Expected Results:**
- ✅ Under 20 chars: validation error displayed
- ✅ Over 500 chars: character counter turns red
- ✅ 20-500 chars: submit enabled
- ✅ Server validates input length (400 on failure)

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1B.3: Dynamic Prompt Type Filtering

**Objective:** Verify prompt types filter based on AI tool

**Steps:**
1. Select "ChatGPT" → verify Projects available
2. Go back, select "Claude" → verify Projects available
3. Go back, select "Gemini" → verify Gems available (not Projects)
4. Go back, select "Copilot" → verify only General Prompt available

**Expected Results:**
- ✅ ChatGPT: Prompt Architect, Custom Instructions, Projects, General Prompt
- ✅ Claude: Prompt Architect, Custom Instructions, Projects, General Prompt
- ✅ Gemini: Prompt Architect, Custom Instructions, Gems, General Prompt
- ✅ Copilot: Custom Instructions, General Prompt only

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1B.4: Session Persistence

**Objective:** Verify session persists across page refreshes

**Steps:**
1. Complete Step 1 (select AI tool)
2. Refresh page
3. Verify "Welcome Back" screen appears
4. Click "Continue to Chat"
5. Verify chat interface loads

**Expected Results:**
- ✅ Session stored in localStorage
- ✅ Cookie backup created
- ✅ Returning users see welcome back screen
- ✅ Start Over clears session

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1B.5: Timer Cleanup (Memory Leak Prevention)

**Objective:** Verify timers are cleaned up on component unmount

**Steps:**
1. Open browser DevTools → Console
2. Complete intake, copy prompt (see "Copied!" message)
3. Quickly click "Start Over" before 2 seconds
4. Verify no console errors about state updates on unmounted components
5. Repeat with reset confirmation timeout

**Expected Results:**
- ✅ No React warnings about unmounted state updates
- ✅ Timers cleared on unmount
- ✅ No memory leaks

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1B.6: Copy Error Feedback

**Objective:** Verify user-visible error when clipboard fails

**Steps:**
1. Open in HTTP (not HTTPS) or disable clipboard permissions
2. Complete intake flow
3. Click "Copy Prompt" button
4. Verify error message appears

**Expected Results:**
- ✅ Error message: "Unable to copy. Try selecting the text manually."
- ✅ Error auto-dismisses after 4 seconds
- ✅ Error logged to console (dev only)

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 1B.7: Rate Limiter Exemption

**Objective:** Verify intake doesn't count toward free message limit

**Steps:**
1. Complete intake flow (generates output)
2. Click "Continue to Chat"
3. Verify usage counter shows 0/3
4. Send 3 messages
5. Verify limit reached

**Expected Results:**
- ✅ Intake submission doesn't increment rate limit
- ✅ Chat messages still limited to 3
- ✅ Rate limiter correctly exempts intake API

**Status:** [ ] Pass  [ ] Fail

---

## 2. Security Testing

### Test Case 2.1: Server-Side Rate Limiting

**Objective:** Verify rate limiting cannot be bypassed via API

**Steps:**
1. Use browser DevTools → Console
2. Execute direct API call bypassing UI:
   ```javascript
   fetch('/api/chat/enhanced', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       message: 'test',
       category: 'custom_instructions',
       history: []
     })
   }).then(r => r.json()).then(console.log)
   ```
3. Repeat 4 times rapidly

**Expected Results:**
- ✅ First 3 requests succeed (200 status)
- ✅ 4th request fails with 429 (Rate Limit Exceeded)
- ✅ Error message includes rate limit info

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

**Implementation:** See `lib/rate-limiter.ts:20` - `MAX_FREE_MESSAGES` constant

---

### Test Case 2.2: Input Sanitization

**Objective:** Verify XSS attempts are sanitized

**Steps:**
1. Send message with HTML/script tags:
   - `<script>alert('XSS')</script>`
   - `<img src=x onerror=alert('XSS')>`
2. Observe rendering

**Expected Results:**
- ✅ No script execution
- ✅ HTML tags stripped or escaped
- ✅ Message sent to AI safely

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

**Implementation:** See `lib/input-validation.ts` - `validateMessage()` function

---

### Test Case 2.3: Environment Variable Validation

**Objective:** Verify app fails gracefully if API key missing

**Steps:**
1. Stop dev server
2. Remove `TOGETHER_AI_API_KEY` from `.env.local`
3. Start dev server
4. Send a message

**Expected Results:**
- ✅ Server startup throws error OR
- ✅ API call fails with clear error message
- ✅ User sees friendly error (not stack trace)

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

**Implementation:** See `lib/together.ts:4` - Environment variable check

---

## 3. Cross-Browser Testing

### Browser Compatibility Matrix

| Browser | Version | Test Date | Status | Notes |
|---------|---------|-----------|--------|-------|
| Chrome | Latest | [DATE] | [ ] Pass / [ ] Fail | |
| Firefox | Latest | [DATE] | [ ] Pass / [ ] Fail | |
| Safari | Latest | [DATE] | [ ] Pass / [ ] Fail | |
| Edge | Latest | [DATE] | [ ] Pass / [ ] Fail | |
| Mobile Safari (iOS) | Latest | [DATE] | [ ] Pass / [ ] Fail | |
| Mobile Chrome (Android) | Latest | [DATE] | [ ] Pass / [ ] Fail | |

**Test Scenarios for Each Browser:**
1. Homepage loads correctly
2. Category selection opens chat
3. Messages send and receive
4. Free limit enforcement works
5. Chat modal responsive design
6. Close button works
7. No console errors

---

## 4. Performance Testing

### Test Case 4.1: Page Load Performance

**Objective:** Verify page load < 2 seconds (CONSTITUTION requirement)

**Steps:**
1. Open Chrome DevTools → Performance tab
2. Clear cache: `Ctrl+Shift+Del`
3. Navigate to http://localhost:3001
4. Measure "Load" event time

**Expected Results:**
- ✅ Page load complete < 2 seconds
- ✅ No render-blocking resources
- ✅ Images optimized

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Measurement:**
- **Load Time:** _____ms
- **First Contentful Paint:** _____ms
- **Time to Interactive:** _____ms

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 4.2: AI Response Time

**Objective:** Verify AI response < 5 seconds (acceptable UX)

**Steps:**
1. Send message: "Help me write a custom instruction"
2. Measure time from send to response display

**Expected Results:**
- ✅ Response received < 5 seconds
- ✅ Loading indicator shown during wait
- ✅ UI remains responsive

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Measurement:**
- **Response Time:** _____ms

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 4.3: Bundle Size Analysis

**Objective:** Verify no unnecessary dependencies in bundle

**Steps:**
1. Run production build: `npm run build`
2. Check build output for bundle sizes
3. Verify Supabase NOT in bundle

**Expected Results:**
- ✅ Supabase packages NOT in bundle
- ✅ Total JS bundle < 500KB (gzipped)
- ✅ No unused dependencies

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Bundle Sizes:**
- **Main bundle:** _____KB
- **Vendor bundle:** _____KB
- **Total:** _____KB

**Status:** [ ] Pass  [ ] Fail

---

## 5. Code Quality Verification

### Test Case 5.1: TypeScript Type Check

**Objective:** Verify no TypeScript errors

**Steps:**
```bash
npm run type-check
```

**Expected Results:**
- ✅ Zero TypeScript errors
- ✅ No `any` types in production code
- ✅ All interfaces properly defined

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 5.2: Linting

**Objective:** Verify code meets style standards

**Steps:**
```bash
npm run lint
```

**Expected Results:**
- ✅ Zero linting errors
- ✅ Warnings (if any) are acceptable

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

---

### Test Case 5.3: Build Success

**Objective:** Verify production build completes

**Steps:**
```bash
npm run build
```

**Expected Results:**
- ✅ Build completes without errors
- ✅ Static pages generated
- ✅ No warnings about missing dependencies

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

---

## 6. Mobile Responsiveness

### Test Case 6.1: Mobile UI Layout

**Objective:** Verify app works on mobile screens

**Steps:**
1. Open DevTools → Device Toolbar
2. Set to iPhone 12 Pro (390x844)
3. Navigate through app
4. Test all functionality

**Expected Results:**
- ✅ Layout adapts to mobile screen
- ✅ Buttons accessible (no overlap)
- ✅ Chat modal fits screen
- ✅ Text readable (not too small)
- ✅ Input area accessible

**Actual Results:** [TO BE FILLED BY QA ENGINEER]

**Status:** [ ] Pass  [ ] Fail

---

## 7. Regression Testing (After Fixes)

### Areas Verified After Phase 1 & 2 Fixes:

- [x] Supabase code removed
- [x] TypeScript `any` violations fixed
- [x] Usage counter race condition resolved
- [x] Message IDs use crypto.randomUUID()
- [x] Input validation implemented
- [x] Rate limiting added
- [x] Fetch timeouts implemented
- [x] File naming conventions corrected
- [x] Magic numbers extracted to constants

### Known Issues Resolved:

1. **Issue:** Duplicate chat components (ChatInterface.tsx + ChatContainer.tsx)
   **Resolution:** Removed deprecated ChatInterface.tsx
   **Status:** ✅ Fixed

2. **Issue:** Race condition in usage counter
   **Resolution:** Optimistic increment before API call
   **Status:** ✅ Fixed

3. **Issue:** Magic numbers throughout codebase
   **Resolution:** Created `lib/constants.ts` with all configuration values
   **Status:** ✅ Fixed

4. **Issue:** PascalCase filenames violating CONSTITUTION
   **Resolution:** Renamed all component files to kebab-case
   **Status:** ✅ Fixed

---

## 8. CONSTITUTION Compliance Checklist

- [x] **File Naming:** All files use kebab-case (e.g., `chat-container.tsx`)
- [x] **TypeScript:** No `any` types, all explicit types defined
- [x] **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FREE_MESSAGES`)
- [x] **Security:** API key server-side only, input validation present
- [x] **Performance:** Constants extracted, no unnecessary re-renders
- [x] **Code Organization:** Proper component structure, no dead code
- [x] **Error Handling:** All async operations wrapped in try/catch
- [x] **Rate Limiting:** Server-side enforcement implemented

---

## 9. Final Approval Criteria

### ✅ Ready for Production IF:

- [ ] All functional tests pass
- [ ] All security tests pass
- [ ] Cross-browser testing complete (4+ browsers)
- [ ] Performance benchmarks meet targets
- [ ] Zero TypeScript errors
- [ ] Build completes successfully
- [ ] Mobile responsiveness verified
- [ ] CONSTITUTION compliance 100%

### ⚠️ Staging Only IF:

- [ ] Minor UI issues (non-blocking)
- [ ] Performance slightly below target
- [ ] 1-2 browser compatibility issues

### ❌ Not Ready IF:

- [ ] Security vulnerabilities present
- [ ] Rate limiting can be bypassed
- [ ] Critical functionality broken
- [ ] TypeScript errors present

---

## Test Results Summary

**Overall Status:** [ ] Ready for Production  [ ] Needs Minor Fixes  [ ] Needs Major Fixes

**Tested By:** _____________________
**Test Date:** _____________________
**Sign-off:** _____________________

---

## Notes for QA Engineer

1. **Environment Setup:** Ensure `.env.local` has valid `TOGETHER_AI_API_KEY`
2. **Testing Order:** Follow test cases sequentially for best coverage
3. **Bug Reporting:** Reference test case numbers in bug reports
4. **Performance:** Use Chrome DevTools for accurate measurements
5. **Mobile Testing:** Test on real devices if possible, not just emulators

---

## Appendix: File Changes Summary

### Files Added (Onboarding Intake Flow):
- `src/app/api/chat/intake/route.ts` - Intake API endpoint
- `src/components/onboarding/intake-context.tsx` - React Context for state
- `src/components/onboarding/intake-flow.tsx` - Main container
- `src/components/onboarding/ai-tool-selector.tsx` - Step 1 component
- `src/components/onboarding/prompt-type-selector.tsx` - Step 2 component
- `src/components/onboarding/initial-thoughts-input.tsx` - Step 3 component
- `src/components/onboarding/output-display.tsx` - Output display with copy
- `src/components/onboarding/example-output-modal.tsx` - Example preview modal
- `src/components/onboarding/intake-progress-indicator.tsx` - Step indicator
- `src/components/ui/check-icon.tsx` - Shared selection indicator
- `src/lib/cookie-manager.ts` - Session persistence
- `src/lib/intake-instructions.ts` - AI instructions loader
- `src/lib/intake-helpers.ts` - Utility functions
- `src/lib/output-formatter.ts` - Output formatting
- `src/lib/example-outputs.ts` - Example content
- `src/lib/setup-templates.ts` - Setup instruction templates
- `src/types/intake.ts` - TypeScript type definitions

### Files Added (Previous Phases):
- `src/lib/constants.ts` - Application-wide constants

### Files Modified:
- `src/components/chat/chat-container.tsx` - Constants import, removed magic numbers
- `src/app/api/chat/route.ts` - Constants for AI configuration
- `src/app/api/chat/enhanced/route.ts` - Constants for enhanced AI config
- All component files renamed to kebab-case

### Files Removed:
- `src/components/ChatInterface.tsx` - Deprecated duplicate component
- `src/lib/supabase.ts` - Unused Supabase client
- `src/types/supabase.ts` - Unused Supabase types

### Dependencies Removed:
- `@supabase/auth-ui-react`
- `@supabase/auth-ui-shared`
- `@supabase/ssr`
- `@supabase/supabase-js`

**Total Bundle Size Reduction:** ~200KB

---

**Document Version:** 1.1
**Last Updated:** 2025-11-21
**Next Review:** After intake flow QA testing complete
