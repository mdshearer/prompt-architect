# Technical Specification: Onboarding Intake Flow v2.0

**Version:** 1.0.0
**Date:** November 20, 2025
**Author:** Solution Architect (AI-Dev-Orchestrator)
**Status:** Ready for Implementation
**PRD Reference:** `/docs/onboarding-intake-flow-prd.md`

---

## Executive Summary

This technical specification provides implementation details for the Onboarding Intake Flow v2.0, which introduces a "Prompt Architect Project" as the recommended path for users. The system collects user preferences (AI tool, prompt type, initial thoughts) and generates tailored outputs with built-in instructions.

**Key Architecture Decisions:**
- Cookie-based tracking with localStorage sync
- JSON format for built-in instructions
- New `/api/chat/intake/route.ts` endpoint
- React Context for state management
- Dual-section output formatter for Prompt Architect
- Rate limiter exemption for intake messages

**Estimated Implementation:** 10-12 hours

---

## 1. Technical Decisions

### Decision 1: Cookie Management Architecture

**Schema:**
```typescript
interface IntakeCookie {
  sessionId: string          // crypto.randomUUID()
  aiTool: 'chatgpt' | 'claude' | 'gemini' | 'copilot'
  promptType: 'prompt-architect' | 'custom-instructions' | 'projects' | 'gems' | 'general-prompt'
  messageCount: number
  intakeCompleted: boolean
  timestamp: string          // ISO-8601
}
```

**Implementation Strategy:**
- **Flat structure** (no nesting) for simplicity
- **localStorage is source of truth**, cookie is backup for cross-session persistence
- **Write to both** on every update
- **Read from localStorage first**, fallback to cookie if localStorage fails
- **No conflict resolution needed** (single device, sequential updates)
- **Cookie created on Step 1 completion** (after AI tool selection)

**File:** `src/lib/cookie-manager.ts`

```typescript
export function setCookie(data: IntakeCookie): void
export function getCookie(): IntakeCookie | null
export function clearCookie(): void
export function syncToLocalStorage(data: IntakeCookie): void
export function loadFromLocalStorage(): IntakeCookie | null
```

---

### Decision 2: Output Formatter for Prompt Architect

**Question:** How do we generate dual-section output (Setup Instructions + Ready-to-Use Text)?

**Answer:** Template-based system with AI-generated content for Section 2

**Section 1: Setup Instructions (Hardcoded Templates)**
- Stored in `data/ai-instructions/setup-templates/`
- Tool-specific Markdown files:
  - `chatgpt-project-setup.md`
  - `claude-project-setup.md`
  - `gemini-gem-setup.md`
- Simple variable substitution: `{{userRole}}`, `{{userBusiness}}`

**Section 2: Ready-to-Use Text (AI-Generated)**
- Together.ai API generates this based on user's thoughts + built-in instructions
- Must follow P/T/C/F framework (enforced via system prompt)
- Includes Golden Rules (enforced via system prompt)

**File:** `src/lib/output-formatter.ts`

```typescript
export interface FormattedOutput {
  section1?: string  // Setup instructions (only for Prompt Architect)
  section2: string   // Ready-to-use text (always present)
  promptType: string
}

export function formatOutput(
  aiResponse: string,
  promptType: string,
  aiTool: string,
  userThoughts: string
): FormattedOutput
```

---

### Decision 3: Built-in Instructions Storage & Loading

**Format:** JSON (structured data, easier to parse)

**File:** `data/ai-instructions/instructions.json`

**Structure:**
```json
{
  "chatgpt": {
    "prompt-architect": {
      "systemPrompt": "You are helping the user create a Prompt Architect Project for ChatGPT GPT-5...",
      "guidelines": "Use P/T/C/F framework. Include Golden Rules...",
      "capabilities": ["Projects feature", "File uploads"],
      "limitations": []
    },
    "custom-instructions": { ... },
    "projects": { ... },
    "general-prompt": { ... }
  },
  "claude": { ... },
  "gemini": { ... },
  "copilot": { ... }
}
```

**Loading Strategy:**
- Read at build time (server-side only, never exposed to client)
- Cache in memory (no need to re-read file on every request)
- Error handling: throw error if file missing or malformed

**File:** `src/lib/intake-instructions.ts`

```typescript
export interface InstructionSet {
  systemPrompt: string
  guidelines: string
  capabilities: string[]
  limitations: string[]
}

export function loadInstructions(
  aiTool: string,
  promptType: string
): InstructionSet

export function buildSystemPrompt(
  instructions: InstructionSet,
  userThoughts: string
): string
```

---

### Decision 4: API Endpoint Design

**Endpoint:** `/api/chat/intake/route.ts` (new)

**Why new endpoint?**
- Different logic than regular chat (no streaming, no rate limiting)
- Different response format (dual sections for Prompt Architect)
- Clearer separation of concerns

**Request Format:**
```typescript
interface IntakeRequest {
  aiTool: 'chatgpt' | 'claude' | 'gemini' | 'copilot'
  promptType: string
  userThoughts: string  // 20-500 chars
}
```

**Response Format:**
```typescript
interface IntakeResponse {
  success: boolean
  output?: FormattedOutput
  error?: string
}
```

**Error Handling:**
- 400: Invalid input (missing fields, too short/long)
- 429: Rate limit (shouldn't happen for intake, but check anyway)
- 500: Together.ai API failure
- 30-second timeout (same as regular chat)

---

### Decision 5: Component Architecture

**State Management:** React Context (no external libraries)

**Context:** `src/components/onboarding/intake-context.tsx`

```typescript
interface IntakeState {
  step: 1 | 2 | 3
  aiTool: string | null
  promptType: string | null
  userThoughts: string
  isLoading: boolean
  output: FormattedOutput | null
}

interface IntakeContextType {
  state: IntakeState
  setAiTool: (tool: string) => void
  setPromptType: (type: string) => void
  setUserThoughts: (thoughts: string) => void
  goToStep: (step: number) => void
  submitIntake: () => Promise<void>
  resetIntake: () => void
}
```

**Component Hierarchy:**
```
<IntakeProvider>
  <IntakeFlow>
    <IntakeProgressIndicator />
    {step === 1 && <AiToolSelector />}
    {step === 2 && <PromptTypeSelector />}
    {step === 3 && <InitialThoughtsInput />}
    {output && <OutputDisplay />}
  </IntakeFlow>
</IntakeProvider>
```

**Props (all components are simple, minimal props):**
- Most components use Context, no props needed
- `<ExampleOutputModal />` receives `aiTool` and `isOpen` props

---

### Decision 6: Example Output Modal

**Storage:** `data/ai-instructions/examples/`

**Files:**
- `chatgpt-prompt-architect-example.md`
- `claude-prompt-architect-example.md`
- `gemini-prompt-architect-example.md`
- `client-examples/research-summarizer-optimi.md`
- `client-examples/prompt-architect-black-culture-zone.md`

**Loading:** Lazy load on modal open (import dynamic)

**Component:** `src/components/onboarding/example-output-modal.tsx`

```typescript
interface ExampleModalProps {
  isOpen: boolean
  onClose: () => void
  aiTool: string
}
```

---

### Decision 7: Dynamic Placeholder Text Logic

**Implementation:** Utility function + React useMemo

**File:** `src/lib/intake-helpers.ts`

```typescript
export function getPlaceholderText(promptType: string): string {
  if (promptType === 'prompt-architect') {
    return INTAKE_PLACEHOLDERS.PROMPT_ARCHITECT
  }
  return INTAKE_PLACEHOLDERS.DEFAULT
}

export function getLabelText(promptType: string): string {
  if (promptType === 'prompt-architect') {
    return "Tell us about your business or role"
  }
  return "What do you want your AI to help you with?"
}
```

**Usage in component:**
```typescript
const placeholderText = useMemo(
  () => getPlaceholderText(promptType),
  [promptType]
)
```

---

### Decision 8: Free Tier Exemption Logic

**Modification to `src/lib/rate-limiter.ts`:**

Add new parameter to `checkRateLimit` and `incrementRateLimit`:

```typescript
export function checkRateLimit(
  clientId: string,
  isIntake: boolean = false  // NEW PARAMETER
): RateLimitResult {
  if (isIntake) {
    return { allowed: true, currentCount: 0, limit: MAX_FREE_MESSAGES }
  }
  // ... existing logic
}

export function incrementRateLimit(
  clientId: string,
  isIntake: boolean = false  // NEW PARAMETER
): void {
  if (isIntake) {
    return  // Don't increment for intake
  }
  // ... existing logic
}
```

**Usage in `/api/chat/intake/route.ts`:**
```typescript
const rateLimit = checkRateLimit(clientIP, true)  // isIntake = true
// Don't call incrementRateLimit at all for intake
```

---

### Decision 9: Resolved Open Questions

**1. Back Navigation:** ✅ YES, allow it
- User can click "Back" on steps 2 and 3
- Data is preserved in Context state
- No warning needed (just UI navigation, no data loss)

**2. Skip Intake for Returning Users:** ✅ YES
- Check cookie on homepage load
- If `intakeCompleted === true`, show "Continue" button
- Button loads chat interface with saved context (aiTool, promptType)

**3. Intake Editing:** ✅ YES, "Start Over" button
- Button appears after output is displayed
- Clears cookie + localStorage
- Resets Context state to step 1

**4. Multi-conversation Behavior:** ✅ Once per session
- Intake completes → cookie saved
- "New Conversation" button clears chat history but keeps intake data
- User doesn't repeat intake unless they click "Start Over"

**5. Cookie Consent Banner:** ✅ Defer to v2
- v1: Use cookie without banner (low legal risk, no PII)
- v2: Add proper consent UI with GDPR compliance
- Add TODO comment in code for v2

---

## 2. Data Schemas

### Cookie & localStorage Schema

```typescript
// src/types/intake.ts
export interface IntakeCookie {
  sessionId: string
  aiTool: 'chatgpt' | 'claude' | 'gemini' | 'copilot'
  promptType: 'prompt-architect' | 'custom-instructions' | 'projects' | 'gems' | 'general-prompt'
  messageCount: number
  intakeCompleted: boolean
  timestamp: string
}

export const AI_TOOLS = {
  CHATGPT: 'chatgpt',
  CLAUDE: 'claude',
  GEMINI: 'gemini',
  COPILOT: 'copilot'
} as const

export const PROMPT_TYPES = {
  PROMPT_ARCHITECT: 'prompt-architect',
  CUSTOM_INSTRUCTIONS: 'custom-instructions',
  PROJECTS: 'projects',
  GEMS: 'gems',
  GENERAL_PROMPT: 'general-prompt'
} as const
```

### Built-in Instructions Schema

```typescript
// data/ai-instructions/instructions.json
{
  "chatgpt": {
    "prompt-architect": {
      "systemPrompt": "You are an AI prompt engineering expert...",
      "guidelines": "Output must include two sections...",
      "capabilities": ["Projects", "File uploads", "Custom instructions per project"],
      "limitations": []
    }
  }
}
```

### API Request/Response Schemas

```typescript
// Intake API
export interface IntakeAPIRequest {
  aiTool: string
  promptType: string
  userThoughts: string
}

export interface IntakeAPIResponse {
  success: boolean
  output?: {
    section1?: string
    section2: string
    promptType: string
  }
  error?: string
}
```

---

## 3. Component Specifications

### 3.1 `intake-flow.tsx`
- Main container component
- Wraps all intake steps
- Manages step transitions via Context
- Renders progress indicator

### 3.2 `ai-tool-selector.tsx`
- Displays 4 radio options (ChatGPT, Claude, Gemini, Copilot)
- On selection: `setAiTool(tool)` + `goToStep(2)`
- Updates cookie

### 3.3 `prompt-type-selector.tsx`
- Dynamically filters options based on `state.aiTool`
- Shows "⭐ Recommended" badge on Prompt Architect
- Links: "Learn more" + "View example" (opens modal)
- On selection: `setPromptType(type)` + `goToStep(3)`

### 3.4 `initial-thoughts-input.tsx`
- Textarea with dynamic placeholder/label
- Character counter (500 max, 20 min)
- Validation on submit
- On submit: calls `submitIntake()` (async)

### 3.5 `intake-progress-indicator.tsx`
- Visual stepper: "Step 1 of 3", "Step 2 of 3", etc.
- Highlights current step

### 3.6 `example-output-modal.tsx`
- Modal overlay with close button
- Lazy loads example Markdown file
- Syntax highlighting for code blocks
- Copy button for entire example

---

## 4. File Structure

```
src/
├── app/
│   ├── page.tsx                          # MODIFIED: Check cookie, render intake or chat
│   └── api/chat/intake/route.ts          # NEW: Intake endpoint
├── components/onboarding/
│   ├── intake-context.tsx                # NEW: React Context provider
│   ├── intake-flow.tsx                   # NEW: Main container
│   ├── ai-tool-selector.tsx              # NEW
│   ├── prompt-type-selector.tsx          # NEW
│   ├── initial-thoughts-input.tsx        # NEW
│   ├── intake-progress-indicator.tsx     # NEW
│   └── example-output-modal.tsx          # NEW
├── lib/
│   ├── constants.ts                      # MODIFIED: Add intake constants
│   ├── cookie-manager.ts                 # NEW
│   ├── intake-instructions.ts            # NEW
│   ├── output-formatter.ts               # NEW
│   ├── intake-helpers.ts                 # NEW
│   ├── rate-limiter.ts                   # MODIFIED: Add isIntake param
│   └── input-validation.ts               # MODIFIED: Add 500-char validation
├── types/
│   └── intake.ts                         # NEW
└── data/
    └── ai-instructions/
        ├── instructions.json             # NEW
        ├── setup-templates/              # NEW
        │   ├── chatgpt-project-setup.md
        │   ├── claude-project-setup.md
        │   └── gemini-gem-setup.md
        └── examples/                     # NEW
            ├── chatgpt-prompt-architect-example.md
            ├── claude-prompt-architect-example.md
            └── gemini-prompt-architect-example.md
```

---

## 5. Constants to Add

```typescript
// src/lib/constants.ts

// Intake Flow
export const MAX_INTAKE_THOUGHTS_LENGTH = 500
export const MIN_INTAKE_THOUGHTS_LENGTH = 20

export const INTAKE_PLACEHOLDERS = {
  PROMPT_ARCHITECT: "Describe your business, role, or the main areas where you need AI help. Example: 'I run a small bakery...'",
  DEFAULT: "Describe what you want your AI to do. Be as specific as you can in 2-3 sentences."
} as const

export const INTAKE_LABELS = {
  PROMPT_ARCHITECT: "Tell us about your business or role",
  DEFAULT: "What do you want your AI to help you with?"
} as const

// Cookie Configuration
export const COOKIE_CONFIG = {
  NAME: 'prompt_architect_session',
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  PATH: '/',
  SAME_SITE: 'lax' as const,
  SECURE: process.env.NODE_ENV === 'production'
} as const

// External Links
export const EXTERNAL_LINKS = {
  PROMPT_ARCHITECT_GUIDE: 'https://docs.google.com/document/d/13NviH4b6r4i3i2h8BOZVt0EhsOPP0hcD4I4KGFPZlTY/edit?tab=t.0'
} as const
```

---

## 6. Security Considerations

### Input Validation
- **Client-side:** Character limit (500 max, 20 min) with visual feedback
- **Server-side:** Re-validate in `/api/chat/intake/route.ts`
- **Sanitization:** Use existing `src/lib/input-validation.ts` functions

### API Key Protection
- ✅ Already secured (Together.ai key is server-side only)
- ✅ Built-in instructions never sent to client (loaded server-side)

### Cookie Security
- `httpOnly: false` (needs to be read by JavaScript)
- `secure: true` in production only
- `sameSite: 'lax'` (CSRF protection)
- No PII stored (just preferences + usage count)

### XSS Prevention
- React handles escaping automatically
- Don't use `dangerouslySetInnerHTML` for user input
- Markdown rendering for examples: use safe library (e.g., `react-markdown`)

---

## 7. Performance Considerations

### Bundle Size
- Lazy load example modal (don't load until clicked)
- Keep instructions.json on server (don't bundle in client)
- Total new code: ~15KB gzipped

### API Response Time
- Target: < 5 seconds for intake submission
- Same timeout as regular chat (30 seconds)
- No streaming needed (one-time response)

### Caching
- Instructions loaded once at server startup (in-memory cache)
- Example files lazy loaded but cached by browser

### Optimizations
- Use `useMemo` for dynamic placeholders
- Use `useCallback` for event handlers
- Debounce character counter updates (not needed, 500 chars is small)

---

## 8. Testing Strategy

### Unit Tests (Manual for MVP)
- Cookie manager: set, get, clear, sync
- Output formatter: dual sections for Prompt Architect, single for others
- Instruction loader: loads correct instructions for tool + type
- Rate limiter: intake messages don't increment counter

### Integration Tests
- Full intake flow: Step 1 → 2 → 3 → Output
- Cookie persistence across page refresh
- Back navigation preserves data
- "Start Over" clears state correctly

### E2E Test Scenarios
1. New user: ChatGPT + Prompt Architect → dual-section output
2. New user: Gemini + General Prompt → single-section output
3. Returning user: Cookie exists → skip intake option
4. Back navigation: Step 3 → Step 2 → Step 3 (data preserved)
5. Free tier: Intake doesn't count → 3 messages still available

### Cross-Browser Testing
- Chrome (primary)
- Safari (cookie/localStorage behavior)
- Firefox
- Mobile Safari (iOS)

---

## 9. Error Handling

### Client-Side Errors
- **Empty input:** Show error message "Please enter at least 20 characters"
- **Too short:** Character counter turns red, disable submit
- **Network error:** Show "Connection failed. Please try again."

### Server-Side Errors
- **Missing instruction file:** Throw error on startup (fail fast)
- **Together.ai API failure:** Return 500 with user-friendly message
- **Invalid request:** Return 400 with specific error message
- **Timeout:** Return 408 with retry suggestion

### Edge Cases
- **LocalStorage disabled:** Fallback to cookie only
- **Cookie disabled:** Show warning, app won't work across sessions
- **Old cookie schema:** Clear and create new cookie (migration)

---

## 10. Implementation Checklist

### Phase 2: Implementation (Developer Tasks)

**Backend (3 hours):**
- [ ] Create `data/ai-instructions/instructions.json` with 10 instruction sets
- [ ] Create setup templates for ChatGPT, Claude, Gemini
- [ ] Create example output files
- [ ] Implement `src/lib/intake-instructions.ts`
- [ ] Implement `src/lib/output-formatter.ts`
- [ ] Implement `src/lib/cookie-manager.ts`
- [ ] Implement `/api/chat/intake/route.ts`
- [ ] Modify `src/lib/rate-limiter.ts` (add isIntake param)

**Frontend (4 hours):**
- [ ] Create `src/types/intake.ts`
- [ ] Create `src/components/onboarding/intake-context.tsx`
- [ ] Create `src/components/onboarding/intake-flow.tsx`
- [ ] Create `src/components/onboarding/ai-tool-selector.tsx`
- [ ] Create `src/components/onboarding/prompt-type-selector.tsx`
- [ ] Create `src/components/onboarding/initial-thoughts-input.tsx`
- [ ] Create `src/components/onboarding/intake-progress-indicator.tsx`
- [ ] Create `src/components/onboarding/example-output-modal.tsx`
- [ ] Modify `src/app/page.tsx` (integrate intake flow)

**Integration (2 hours):**
- [ ] Add constants to `src/lib/constants.ts`
- [ ] Connect intake output to chat interface
- [ ] Implement "Start Over" button
- [ ] Implement "Continue" button for returning users

**Testing (1.5 hours):**
- [ ] Test all AI tool + prompt type combinations
- [ ] Test cookie persistence
- [ ] Test free tier exemption
- [ ] Test mobile responsiveness

---

## 11. Success Criteria

**Tech spec is complete when:**
- ✅ All 9 technical decisions made with clear rationale
- ✅ All 5 open questions resolved
- ✅ All new modules have interface definitions
- ✅ Data schemas finalized
- ✅ Security and performance documented
- ✅ Developer can implement without ambiguity

**Implementation is complete when:**
- ✅ User can complete 3-step intake flow
- ✅ Output is generated for all tool + type combinations
- ✅ Prompt Architect outputs have 2 sections
- ✅ Cookie persists across sessions
- ✅ Intake doesn't count toward free tier
- ✅ All tests pass

---

## Appendix: Dynamic Prompt Type Filtering

```typescript
// src/lib/intake-helpers.ts

export function getAvailablePromptTypes(aiTool: string): string[] {
  switch (aiTool) {
    case 'chatgpt':
    case 'claude':
      return [
        'prompt-architect',
        'custom-instructions',
        'projects',
        'general-prompt'
      ]
    case 'gemini':
      return [
        'prompt-architect',  // becomes "Prompt Architect Gem"
        'gems',
        'general-prompt'
      ]
    case 'copilot':
      return ['general-prompt']
    default:
      return []
  }
}

export function getPromptTypeLabel(promptType: string, aiTool: string): string {
  if (promptType === 'prompt-architect' && aiTool === 'gemini') {
    return 'Prompt Architect Gem'
  }
  if (promptType === 'prompt-architect') {
    return 'Prompt Architect Project'
  }
  // ... other labels
}
```

---

**End of Technical Specification**

**Next Step:** Hand off to Developer persona for Phase 2 implementation.
