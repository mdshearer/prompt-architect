# Implementation Task List: Onboarding Intake Flow v2.0

**Tech Spec Reference:** `/docs/onboarding-intake-flow-tech-spec.md`
**Estimated Time:** 10-12 hours
**Status:** Ready for Implementation

---

## Overview

This document breaks down the Onboarding Intake Flow v2.0 into granular, sequential tasks for implementation. Each task is a single, small, verifiable change that references specific sections of the tech spec.

---

## Phase 1: Foundation & Setup (1.5 hours)

### Task 1: Create TypeScript Types
**Reference:** Tech Spec §2 (Data Schemas)
**File:** `src/types/intake.ts` (NEW)

- [ ] Create `IntakeCookie` interface with all 6 fields
- [ ] Create `AI_TOOLS` const object with 4 tool options
- [ ] Create `PROMPT_TYPES` const object with 5 prompt types
- [ ] Export all types and constants
- [ ] Run `npm run type-check` to verify no errors

**Verification:** File compiles with zero TypeScript errors

---

### Task 2: Add Intake Constants to Constants File
**Reference:** Tech Spec §5 (Constants to Add)
**File:** `src/lib/constants.ts` (MODIFIED)

- [ ] Add `MAX_INTAKE_THOUGHTS_LENGTH = 500`
- [ ] Add `MIN_INTAKE_THOUGHTS_LENGTH = 20`
- [ ] Add `INTAKE_PLACEHOLDERS` object with 2 entries
- [ ] Add `INTAKE_LABELS` object with 2 entries
- [ ] Add `COOKIE_CONFIG` object with 5 properties
- [ ] Add `EXTERNAL_LINKS` object with Prompt Architect guide URL
- [ ] Run `npm run type-check` to verify

**Verification:** Constants are accessible via import, zero TypeScript errors

---

### Task 3: Create Built-in Instructions JSON File
**Reference:** Tech Spec §1 Decision 3 (Built-in Instructions Storage)
**File:** `data/ai-instructions/instructions.json` (NEW)

- [ ] Create directory structure: `data/ai-instructions/`
- [ ] Create `instructions.json` with nested structure
- [ ] Add ChatGPT instructions for all 4 prompt types
- [ ] Add Claude instructions for all 4 prompt types
- [ ] Add Gemini instructions for 3 prompt types (no custom-instructions)
- [ ] Add Copilot instructions for 1 prompt type (general-prompt only)
- [ ] Validate JSON syntax with online validator
- [ ] Include systemPrompt, guidelines, capabilities, limitations for each

**Verification:** JSON is valid, contains 10+ instruction sets total

---

### Task 4: Create Setup Template for ChatGPT
**Reference:** Tech Spec §1 Decision 2 (Output Formatter)
**File:** `data/ai-instructions/setup-templates/chatgpt-project-setup.md` (NEW)

- [ ] Create directory: `data/ai-instructions/setup-templates/`
- [ ] Write Markdown template with step-by-step instructions
- [ ] Include variable placeholders: `{{userRole}}`, `{{userBusiness}}`
- [ ] Add sections: "How to Set Up Your ChatGPT Project"
- [ ] Format as clear numbered steps

**Verification:** File is valid Markdown, placeholders are present

---

### Task 5: Create Setup Template for Claude
**Reference:** Tech Spec §1 Decision 2
**File:** `data/ai-instructions/setup-templates/claude-project-setup.md` (NEW)

- [ ] Write Markdown template for Claude Projects
- [ ] Include same variable placeholders as ChatGPT
- [ ] Adjust language for Claude-specific features
- [ ] Add sections specific to Claude's interface

**Verification:** File is valid Markdown, Claude-specific content

---

### Task 6: Create Setup Template for Gemini
**Reference:** Tech Spec §1 Decision 2
**File:** `data/ai-instructions/setup-templates/gemini-gem-setup.md` (NEW)

- [ ] Write Markdown template for Gemini Gems
- [ ] Include same variable placeholders
- [ ] Adjust language for Gemini-specific features
- [ ] Reference Gems terminology

**Verification:** File is valid Markdown, Gemini-specific content

---

### Task 7: Create Example Output for ChatGPT
**Reference:** Tech Spec §1 Decision 6 (Example Output Modal)
**File:** `data/ai-instructions/examples/chatgpt-prompt-architect-example.md` (NEW)

- [ ] Create directory: `data/ai-instructions/examples/`
- [ ] Write realistic example with Section 1 (Setup) + Section 2 (Prompt)
- [ ] Use P/T/C/F framework structure
- [ ] Include Golden Rules
- [ ] Make it 300-500 words

**Verification:** File renders as Markdown with 2 clear sections

---

### Task 8: Create Example Output for Claude
**Reference:** Tech Spec §1 Decision 6
**File:** `data/ai-instructions/examples/claude-prompt-architect-example.md` (NEW)

- [ ] Write realistic example similar to ChatGPT
- [ ] Adjust for Claude Projects UI
- [ ] Use P/T/C/F framework
- [ ] Include Golden Rules

**Verification:** File renders as Markdown with 2 sections

---

### Task 9: Create Example Output for Gemini
**Reference:** Tech Spec §1 Decision 6
**File:** `data/ai-instructions/examples/gemini-prompt-architect-example.md` (NEW)

- [ ] Write realistic example for Gemini Gems
- [ ] Adjust for Gemini Gems UI
- [ ] Use P/T/C/F framework
- [ ] Include Golden Rules

**Verification:** File renders as Markdown with 2 sections

---

## Phase 2: Core Utilities (2.5 hours)

### Task 10: Implement Cookie Manager - Core Functions
**Reference:** Tech Spec §1 Decision 1 (Cookie Management Architecture)
**File:** `src/lib/cookie-manager.ts` (NEW)

- [ ] Create file with proper imports
- [ ] Import `IntakeCookie` type from `src/types/intake.ts`
- [ ] Import `COOKIE_CONFIG` from `src/lib/constants.ts`
- [ ] Implement `setCookie(data: IntakeCookie): void`
- [ ] Use `document.cookie` with proper serialization
- [ ] Set maxAge, path, sameSite, secure from COOKIE_CONFIG
- [ ] Add JSDoc documentation to function

**Verification:** Function compiles, uses proper types

---

### Task 11: Implement Cookie Manager - Read Functions
**Reference:** Tech Spec §1 Decision 1
**File:** `src/lib/cookie-manager.ts` (MODIFIED)

- [ ] Implement `getCookie(): IntakeCookie | null`
- [ ] Parse `document.cookie` string
- [ ] Return null if cookie doesn't exist
- [ ] Parse JSON and validate structure
- [ ] Handle malformed JSON gracefully
- [ ] Add JSDoc documentation

**Verification:** Function handles missing/invalid cookies without crashing

---

### Task 12: Implement Cookie Manager - Clear & Sync Functions
**Reference:** Tech Spec §1 Decision 1
**File:** `src/lib/cookie-manager.ts` (MODIFIED)

- [ ] Implement `clearCookie(): void` (sets maxAge=-1)
- [ ] Implement `syncToLocalStorage(data: IntakeCookie): void`
- [ ] Use `localStorage.setItem()` with JSON.stringify
- [ ] Implement `loadFromLocalStorage(): IntakeCookie | null`
- [ ] Handle localStorage disabled/quota errors with try-catch
- [ ] Add JSDoc documentation to both functions

**Verification:** Functions handle localStorage errors gracefully

---

### Task 13: Implement Cookie Manager - Integration Logic
**Reference:** Tech Spec §1 Decision 1
**File:** `src/lib/cookie-manager.ts` (MODIFIED)

- [ ] Update `setCookie` to also call `syncToLocalStorage`
- [ ] Update `getCookie` to check localStorage first, fallback to cookie
- [ ] Update `clearCookie` to also clear localStorage
- [ ] Export all 5 functions
- [ ] Add file-level JSDoc comment explaining sync strategy

**Verification:** Cookie and localStorage stay in sync on all operations

---

### Task 14: Implement Instruction Loader - Core Loading
**Reference:** Tech Spec §1 Decision 3 (Built-in Instructions Storage)
**File:** `src/lib/intake-instructions.ts` (NEW)

- [ ] Create file with imports
- [ ] Create `InstructionSet` interface (4 fields)
- [ ] Implement `loadInstructions(aiTool: string, promptType: string): InstructionSet`
- [ ] Use `require()` or `import` to load `instructions.json`
- [ ] Cache loaded instructions in module-level variable
- [ ] Validate that requested tool + type exists
- [ ] Throw error with clear message if not found
- [ ] Add JSDoc documentation

**Verification:** Function loads JSON and returns correct instruction set

---

### Task 15: Implement Instruction Loader - System Prompt Builder
**Reference:** Tech Spec §1 Decision 3
**File:** `src/lib/intake-instructions.ts` (MODIFIED)

- [ ] Implement `buildSystemPrompt(instructions: InstructionSet, userThoughts: string): string`
- [ ] Combine systemPrompt + guidelines + userThoughts
- [ ] Format as clear prompt for Together.ai API
- [ ] Add context about P/T/C/F framework for Prompt Architect
- [ ] Add Golden Rules enforcement
- [ ] Export both functions
- [ ] Add JSDoc documentation

**Verification:** Generated system prompt includes all components

---

### Task 16: Implement Output Formatter - Interface & Basic Logic
**Reference:** Tech Spec §1 Decision 2 (Output Formatter)
**File:** `src/lib/output-formatter.ts` (NEW)

- [ ] Create file with imports
- [ ] Create `FormattedOutput` interface (3 fields)
- [ ] Implement `formatOutput()` function signature
- [ ] Add logic to detect if promptType is 'prompt-architect'
- [ ] For non-Prompt-Architect: return single section (section2 only)
- [ ] Add JSDoc documentation
- [ ] Export interface and function

**Verification:** Function compiles with correct signature

---

### Task 17: Implement Output Formatter - Template Loading
**Reference:** Tech Spec §1 Decision 2
**File:** `src/lib/output-formatter.ts` (MODIFIED)

- [ ] Import `fs` module for reading setup templates
- [ ] Implement template loader function (private)
- [ ] Load correct template based on aiTool (chatgpt/claude/gemini)
- [ ] Handle missing template files gracefully
- [ ] Cache loaded templates in module-level Map
- [ ] Add error handling for file read failures

**Verification:** Templates load correctly for all 3 AI tools

---

### Task 18: Implement Output Formatter - Variable Substitution
**Reference:** Tech Spec §1 Decision 2
**File:** `src/lib/output-formatter.ts` (MODIFIED)

- [ ] Parse userThoughts to extract role/business (basic regex)
- [ ] Replace `{{userRole}}` placeholder in template
- [ ] Replace `{{userBusiness}}` placeholder in template
- [ ] Handle cases where placeholders aren't found in userThoughts
- [ ] Return formatted Section 1 as string

**Verification:** Placeholders are replaced with actual user data

---

### Task 19: Implement Output Formatter - Dual Section Assembly
**Reference:** Tech Spec §1 Decision 2
**File:** `src/lib/output-formatter.ts` (MODIFIED)

- [ ] For Prompt Architect: combine Section 1 (template) + Section 2 (AI response)
- [ ] Format with clear markdown headers ("## Section 1", "## Section 2")
- [ ] For other types: return AI response as-is (section2 only)
- [ ] Return `FormattedOutput` object with proper fields
- [ ] Add final validation logic

**Verification:** Output has 2 sections for Prompt Architect, 1 for others

---

### Task 20: Implement Intake Helpers - Placeholder Text
**Reference:** Tech Spec §1 Decision 7 (Dynamic Placeholder Text)
**File:** `src/lib/intake-helpers.ts` (NEW)

- [ ] Create file with imports
- [ ] Import constants from `src/lib/constants.ts`
- [ ] Implement `getPlaceholderText(promptType: string): string`
- [ ] Return correct placeholder based on promptType
- [ ] Add JSDoc documentation
- [ ] Export function

**Verification:** Correct placeholder returned for each type

---

### Task 21: Implement Intake Helpers - Label Text
**Reference:** Tech Spec §1 Decision 7
**File:** `src/lib/intake-helpers.ts` (MODIFIED)

- [ ] Implement `getLabelText(promptType: string): string`
- [ ] Return correct label based on promptType
- [ ] Handle Prompt Architect vs. default cases
- [ ] Export function
- [ ] Add JSDoc documentation

**Verification:** Correct label returned for each type

---

### Task 22: Implement Intake Helpers - Prompt Type Filtering
**Reference:** Tech Spec Appendix (Dynamic Prompt Type Filtering)
**File:** `src/lib/intake-helpers.ts` (MODIFIED)

- [ ] Implement `getAvailablePromptTypes(aiTool: string): string[]`
- [ ] ChatGPT/Claude: return 4 types
- [ ] Gemini: return 3 types (no custom-instructions)
- [ ] Copilot: return 1 type (general-prompt only)
- [ ] Export function
- [ ] Add JSDoc documentation

**Verification:** Correct prompt types returned for each AI tool

---

### Task 23: Implement Intake Helpers - Prompt Type Labels
**Reference:** Tech Spec Appendix
**File:** `src/lib/intake-helpers.ts` (MODIFIED)

- [ ] Implement `getPromptTypeLabel(promptType: string, aiTool: string): string`
- [ ] Handle "Prompt Architect Gem" for Gemini
- [ ] Handle "Prompt Architect Project" for ChatGPT/Claude
- [ ] Return proper labels for all other types
- [ ] Export function
- [ ] Add JSDoc documentation

**Verification:** Labels are contextually correct for each tool

---

## Phase 3: API Infrastructure (2 hours)

### Task 24: Modify Rate Limiter - Add isIntake Parameter
**Reference:** Tech Spec §1 Decision 8 (Free Tier Exemption)
**File:** `src/lib/rate-limiter.ts` (MODIFIED)

- [ ] Add `isIntake: boolean = false` parameter to `checkRateLimit()`
- [ ] Add early return if `isIntake === true` (return allowed: true)
- [ ] Add JSDoc comment explaining exemption logic
- [ ] Run `npm run type-check` to verify

**Verification:** Function signature updated, compiles without errors

---

### Task 25: Modify Rate Limiter - Update Increment Function
**Reference:** Tech Spec §1 Decision 8
**File:** `src/lib/rate-limiter.ts` (MODIFIED)

- [ ] Add `isIntake: boolean = false` parameter to `incrementRateLimit()`
- [ ] Add early return if `isIntake === true` (don't increment)
- [ ] Add JSDoc comment explaining behavior
- [ ] Run `npm run type-check` to verify

**Verification:** Intake calls don't increment counter

---

### Task 26: Update Input Validation for 500-Char Limit
**Reference:** Tech Spec §6 (Security - Input Validation)
**File:** `src/lib/input-validation.ts` (MODIFIED)

- [ ] Import `MAX_INTAKE_THOUGHTS_LENGTH` and `MIN_INTAKE_THOUGHTS_LENGTH`
- [ ] Create new validation function: `validateIntakeInput(text: string): {valid: boolean, error?: string}`
- [ ] Check minimum length (20 chars)
- [ ] Check maximum length (500 chars)
- [ ] Return validation result with error message
- [ ] Export function

**Verification:** Validation rejects <20 or >500 character inputs

---

### Task 27: Create Intake API Route - File Setup
**Reference:** Tech Spec §1 Decision 4 (API Endpoint Design)
**File:** `src/app/api/chat/intake/route.ts` (NEW)

- [ ] Create directory: `src/app/api/chat/intake/`
- [ ] Create `route.ts` file
- [ ] Add imports: NextRequest, NextResponse
- [ ] Import rate limiter with isIntake support
- [ ] Import input validation function
- [ ] Import instruction loader and output formatter
- [ ] Import Together.ai client
- [ ] Add file-level JSDoc comment

**Verification:** File compiles with all imports

---

### Task 28: Create Intake API Route - Request Validation
**Reference:** Tech Spec §1 Decision 4, §2 (API Request Schema)
**File:** `src/app/api/chat/intake/route.ts` (MODIFIED)

- [ ] Create `POST` async function handler
- [ ] Parse request body JSON
- [ ] Validate required fields: aiTool, promptType, userThoughts
- [ ] Return 400 if any field is missing
- [ ] Call `validateIntakeInput(userThoughts)`
- [ ] Return 400 with error message if validation fails
- [ ] Add try-catch for JSON parsing errors

**Verification:** Invalid requests return 400 status

---

### Task 29: Create Intake API Route - Rate Limiting
**Reference:** Tech Spec §1 Decision 8
**File:** `src/app/api/chat/intake/route.ts` (MODIFIED)

- [ ] Get client IP using `getClientIP(request)`
- [ ] Call `checkRateLimit(clientIP, true)` with isIntake=true
- [ ] Add comment explaining exemption (should always pass)
- [ ] Keep check for consistency with other endpoints

**Verification:** Rate limiter is called but doesn't block intake

---

### Task 30: Create Intake API Route - Load Instructions
**Reference:** Tech Spec §1 Decision 3
**File:** `src/app/api/chat/intake/route.ts` (MODIFIED)

- [ ] Call `loadInstructions(aiTool, promptType)`
- [ ] Handle errors if instruction set not found (500 response)
- [ ] Call `buildSystemPrompt(instructions, userThoughts)`
- [ ] Store system prompt in variable

**Verification:** Correct instructions loaded for each tool+type combo

---

### Task 31: Create Intake API Route - Together.ai API Call
**Reference:** Tech Spec §1 Decision 4
**File:** `src/app/api/chat/intake/route.ts` (MODIFIED)

- [ ] Import Together.ai client from `src/lib/together.ts`
- [ ] Call API with system prompt + user message
- [ ] Use 30-second timeout (AbortController)
- [ ] Set temperature to 0.8, max tokens to 600 (for intake)
- [ ] Handle API errors (return 500)
- [ ] Handle timeout errors (return 408)
- [ ] Extract AI response text

**Verification:** API call completes successfully with valid response

---

### Task 32: Create Intake API Route - Format Output
**Reference:** Tech Spec §1 Decision 2
**File:** `src/app/api/chat/intake/route.ts` (MODIFIED)

- [ ] Call `formatOutput(aiResponse, promptType, aiTool, userThoughts)`
- [ ] Receive `FormattedOutput` object
- [ ] Return NextResponse with success: true + output object
- [ ] Return 200 status code
- [ ] Add proper error handling wrapper

**Verification:** Response matches IntakeAPIResponse schema

---

### Task 33: Create Intake API Route - Error Handling
**Reference:** Tech Spec §9 (Error Handling)
**File:** `src/app/api/chat/intake/route.ts` (MODIFIED)

- [ ] Wrap entire handler in try-catch
- [ ] Return user-friendly error messages (no stack traces)
- [ ] Log errors server-side using logger from `src/lib/logger.ts`
- [ ] Return 500 for unexpected errors
- [ ] Add JSDoc to POST function

**Verification:** All error cases return proper status codes

---

## Phase 4: React Context & State (1.5 hours)

### Task 34: Create Intake Context - Interface Definitions
**Reference:** Tech Spec §1 Decision 5 (Component Architecture)
**File:** `src/components/onboarding/intake-context.tsx` (NEW)

- [ ] Create directory: `src/components/onboarding/`
- [ ] Create file with 'use client' directive
- [ ] Define `IntakeState` interface (6 fields)
- [ ] Define `IntakeContextType` interface (7 methods)
- [ ] Import types from `src/types/intake.ts`

**Verification:** Interfaces compile with zero TypeScript errors

---

### Task 35: Create Intake Context - Context & Provider Setup
**Reference:** Tech Spec §1 Decision 5
**File:** `src/components/onboarding/intake-context.tsx` (MODIFIED)

- [ ] Create React Context with `createContext<IntakeContextType | null>(null)`
- [ ] Create `IntakeProvider` component
- [ ] Initialize state with `useState<IntakeState>()`
- [ ] Set default state: step=1, aiTool=null, promptType=null, etc.
- [ ] Return Context.Provider with value prop

**Verification:** Provider compiles, accepts children prop

---

### Task 36: Create Intake Context - State Setters
**Reference:** Tech Spec §1 Decision 5
**File:** `src/components/onboarding/intake-context.tsx` (MODIFIED)

- [ ] Implement `setAiTool(tool: string): void`
- [ ] Update state.aiTool
- [ ] Call cookie-manager to update cookie
- [ ] Implement `setPromptType(type: string): void`
- [ ] Update state.promptType
- [ ] Call cookie-manager to update cookie
- [ ] Implement `setUserThoughts(thoughts: string): void`
- [ ] Update state.userThoughts (no cookie update)

**Verification:** Setters update both state and cookie

---

### Task 37: Create Intake Context - Navigation Methods
**Reference:** Tech Spec §1 Decision 5
**File:** `src/components/onboarding/intake-context.tsx` (MODIFIED)

- [ ] Implement `goToStep(step: number): void`
- [ ] Validate step is 1, 2, or 3
- [ ] Update state.step
- [ ] Implement `resetIntake(): void`
- [ ] Clear cookie using `clearCookie()`
- [ ] Reset state to initial values
- [ ] Set step back to 1

**Verification:** Navigation and reset work correctly

---

### Task 38: Create Intake Context - Submit Function
**Reference:** Tech Spec §1 Decision 5
**File:** `src/components/onboarding/intake-context.tsx` (MODIFIED)

- [ ] Implement `submitIntake(): Promise<void>`
- [ ] Set `isLoading: true`
- [ ] Call `/api/chat/intake` with fetch()
- [ ] Send aiTool, promptType, userThoughts in body
- [ ] Handle successful response (store output in state)
- [ ] Handle error response (show error message)
- [ ] Set `isLoading: false` in finally block
- [ ] Update cookie with `intakeCompleted: true`

**Verification:** Async submit completes and updates state

---

### Task 39: Create Intake Context - Custom Hook
**Reference:** Tech Spec §1 Decision 5
**File:** `src/components/onboarding/intake-context.tsx` (MODIFIED)

- [ ] Create `useIntake()` custom hook
- [ ] Call `useContext(IntakeContext)`
- [ ] Throw error if used outside provider
- [ ] Return context value
- [ ] Export hook and provider

**Verification:** Hook throws error when used incorrectly

---

## Phase 5: UI Components (3 hours)

### Task 40: Create Progress Indicator Component
**Reference:** Tech Spec §3.5 (Component Specifications)
**File:** `src/components/onboarding/intake-progress-indicator.tsx` (NEW)

- [ ] Create file with 'use client' directive
- [ ] Import `useIntake()` hook
- [ ] Get current step from context
- [ ] Render "Step X of 3" text
- [ ] Highlight current step visually
- [ ] Use Optimi brand colors for active step
- [ ] Add Tailwind CSS classes
- [ ] Export component as default

**Verification:** Component renders with correct step highlighted

---

### Task 41: Create AI Tool Selector Component - UI Structure
**Reference:** Tech Spec §3.2 (Component Specifications)
**File:** `src/components/onboarding/ai-tool-selector.tsx` (NEW)

- [ ] Create file with 'use client' directive
- [ ] Import `useIntake()` hook
- [ ] Import AI_TOOLS from types
- [ ] Render heading: "Which AI tool do you use?"
- [ ] Create 4 radio buttons (ChatGPT, Claude, Gemini, Copilot)
- [ ] Use Lucide icons for each tool
- [ ] Add Tailwind CSS styling
- [ ] Use grid layout for 2x2 display

**Verification:** All 4 options render correctly

---

### Task 42: Create AI Tool Selector Component - Interaction Logic
**Reference:** Tech Spec §3.2
**File:** `src/components/onboarding/ai-tool-selector.tsx` (MODIFIED)

- [ ] Get `setAiTool` and `goToStep` from context
- [ ] Add onChange handler to radio buttons
- [ ] Call `setAiTool(tool)` when selected
- [ ] Call `goToStep(2)` after selection
- [ ] Add visual feedback for selected option
- [ ] Export component as default

**Verification:** Selecting a tool advances to step 2

---

### Task 43: Create Prompt Type Selector Component - UI Structure
**Reference:** Tech Spec §3.3 (Component Specifications)
**File:** `src/components/onboarding/prompt-type-selector.tsx` (NEW)

- [ ] Create file with 'use client' directive
- [ ] Import `useIntake()` hook
- [ ] Import `getAvailablePromptTypes`, `getPromptTypeLabel` helpers
- [ ] Get state.aiTool from context
- [ ] Filter prompt types using helper function
- [ ] Render heading: "What would you like to create?"
- [ ] Render radio options for filtered types
- [ ] Add "⭐ Recommended" badge to Prompt Architect

**Verification:** Options filtered correctly per AI tool

---

### Task 44: Create Prompt Type Selector Component - Links & Modal
**Reference:** Tech Spec §3.3
**File:** `src/components/onboarding/prompt-type-selector.tsx` (MODIFIED)

- [ ] Add "Learn more" link (opens external guide in new tab)
- [ ] Add "View example" button
- [ ] Create local state for modal: `const [showModal, setShowModal] = useState(false)`
- [ ] Import ExampleOutputModal component (will create later)
- [ ] Pass modal state and aiTool to modal component

**Verification:** Links render, modal state toggles

---

### Task 45: Create Prompt Type Selector Component - Selection Logic
**Reference:** Tech Spec §3.3
**File:** `src/components/onboarding/prompt-type-selector.tsx` (MODIFIED)

- [ ] Get `setPromptType` and `goToStep` from context
- [ ] Add onChange handler to radio buttons
- [ ] Call `setPromptType(type)` when selected
- [ ] Call `goToStep(3)` after selection
- [ ] Add "Back" button that calls `goToStep(1)`
- [ ] Export component as default

**Verification:** Selection advances to step 3, back button works

---

### Task 46: Create Initial Thoughts Input Component - UI Structure
**Reference:** Tech Spec §3.4 (Component Specifications)
**File:** `src/components/onboarding/initial-thoughts-input.tsx` (NEW)

- [ ] Create file with 'use client' directive
- [ ] Import `useIntake()` hook
- [ ] Import helper functions for placeholder/label
- [ ] Get state (promptType, userThoughts, isLoading) from context
- [ ] Render dynamic label using `getLabelText()`
- [ ] Render textarea with auto-resize
- [ ] Add dynamic placeholder using `getPlaceholderText()`
- [ ] Use `useMemo` for placeholder text (performance)

**Verification:** Label and placeholder change based on promptType

---

### Task 47: Create Initial Thoughts Input Component - Character Counter
**Reference:** Tech Spec §3.4
**File:** `src/components/onboarding/initial-thoughts-input.tsx` (MODIFIED)

- [ ] Add character counter below textarea
- [ ] Display: "X / 500 characters"
- [ ] Turn red if > 500 or < 20
- [ ] Import MIN/MAX constants from `src/lib/constants.ts`
- [ ] Calculate character count from state.userThoughts

**Verification:** Counter updates in real-time, turns red when invalid

---

### Task 48: Create Initial Thoughts Input Component - Validation & Submit
**Reference:** Tech Spec §3.4
**File:** `src/components/onboarding/initial-thoughts-input.tsx` (MODIFIED)

- [ ] Get `setUserThoughts`, `submitIntake`, `goToStep` from context
- [ ] Add onChange handler for textarea
- [ ] Call `setUserThoughts()` on change
- [ ] Add "Submit" button
- [ ] Disable submit if length < 20 or > 500
- [ ] Call `submitIntake()` on click (async)
- [ ] Show loading state during submission
- [ ] Add "Back" button that calls `goToStep(2)`
- [ ] Export component as default

**Verification:** Submit disabled when invalid, async submit works

---

### Task 49: Create Example Output Modal Component - Structure
**Reference:** Tech Spec §3.6 (Component Specifications)
**File:** `src/components/onboarding/example-output-modal.tsx` (NEW)

- [ ] Create file with 'use client' directive
- [ ] Define props interface: `isOpen`, `onClose`, `aiTool`
- [ ] Create modal overlay with dark background
- [ ] Create modal content box with close button (X icon)
- [ ] Add click-outside-to-close handler
- [ ] Add Tailwind CSS for centering and styling
- [ ] Return null if `!isOpen`

**Verification:** Modal opens/closes, click outside closes

---

### Task 50: Create Example Output Modal Component - Content Loading
**Reference:** Tech Spec §3.6, §1 Decision 6
**File:** `src/components/onboarding/example-output-modal.tsx` (MODIFIED)

- [ ] Create state for loaded content: `const [content, setContent] = useState('')`
- [ ] Use `useEffect` to load example file based on aiTool
- [ ] Lazy load with dynamic import or fetch
- [ ] Load from `data/ai-instructions/examples/{aiTool}-prompt-architect-example.md`
- [ ] Handle loading state
- [ ] Handle errors gracefully
- [ ] Install `react-markdown` if needed: `npm install react-markdown`

**Verification:** Example loads when modal opens

---

### Task 51: Create Example Output Modal Component - Markdown Rendering
**Reference:** Tech Spec §3.6
**File:** `src/components/onboarding/example-output-modal.tsx` (MODIFIED)

- [ ] Import ReactMarkdown component
- [ ] Render loaded content as Markdown
- [ ] Add syntax highlighting for code blocks (optional)
- [ ] Add "Copy" button to copy entire example
- [ ] Use clipboard API: `navigator.clipboard.writeText()`
- [ ] Show "Copied!" feedback after copy
- [ ] Export component as default

**Verification:** Markdown renders correctly, copy button works

---

### Task 52: Create Intake Flow Container Component
**Reference:** Tech Spec §3.1 (Component Specifications)
**File:** `src/components/onboarding/intake-flow.tsx` (NEW)

- [ ] Create file with 'use client' directive
- [ ] Import all step components
- [ ] Import IntakeProgressIndicator
- [ ] Import `useIntake()` hook
- [ ] Get state.step from context
- [ ] Render progress indicator at top
- [ ] Conditionally render step components based on step value
- [ ] Add container styling with Tailwind CSS
- [ ] Export component as default

**Verification:** Correct component renders for each step

---

### Task 53: Create Output Display Component - Structure
**Reference:** Tech Spec §3 (implied - not explicitly defined)
**File:** `src/components/onboarding/output-display.tsx` (NEW)

- [ ] Create file with 'use client' directive
- [ ] Import `useIntake()` hook
- [ ] Get state.output from context
- [ ] Return null if no output
- [ ] Create styled container with heading "Your Custom Prompt"
- [ ] Add "Start Over" button

**Verification:** Component renders when output exists

---

### Task 54: Create Output Display Component - Section Rendering
**Reference:** Tech Spec §1 Decision 2
**File:** `src/components/onboarding/output-display.tsx` (MODIFIED)

- [ ] Check if `output.section1` exists (Prompt Architect)
- [ ] If yes, render Section 1 in collapsible/expandable panel
- [ ] Render Section 2 (always present)
- [ ] Use ReactMarkdown for both sections
- [ ] Add "Copy" buttons for each section
- [ ] Style with Tailwind CSS and Optimi colors

**Verification:** Dual sections show for Prompt Architect, single for others

---

### Task 55: Create Output Display Component - Start Over Logic
**Reference:** Tech Spec §1 Decision 9 (Resolved Questions #3)
**File:** `src/components/onboarding/output-display.tsx` (MODIFIED)

- [ ] Get `resetIntake()` from context
- [ ] Add onClick handler to "Start Over" button
- [ ] Call `resetIntake()` when clicked
- [ ] Add confirmation dialog: "Are you sure? This will clear your data."
- [ ] Export component as default

**Verification:** Start Over clears state and cookie, returns to step 1

---

## Phase 6: Integration & Homepage (1.5 hours)

### Task 56: Modify Homepage - Add Intake Provider
**Reference:** Tech Spec §4 (File Structure), §1 Decision 5
**File:** `src/app/page.tsx` (MODIFIED)

- [ ] Import `IntakeProvider` from intake-context
- [ ] Import `IntakeFlow` component
- [ ] Wrap existing content in `<IntakeProvider>`
- [ ] Add intake flow before or instead of category selection

**Verification:** Context provider wraps page content

---

### Task 57: Modify Homepage - Cookie Check Logic
**Reference:** Tech Spec §1 Decision 9 (Resolved Question #2)
**File:** `src/app/page.tsx` (MODIFIED)

- [ ] Import `getCookie` from cookie-manager
- [ ] Add client-side useEffect to check for existing cookie
- [ ] Read cookie on component mount
- [ ] Store cookie data in local state
- [ ] Show different UI if `intakeCompleted === true`

**Verification:** Cookie check runs on page load

---

### Task 58: Modify Homepage - Conditional Rendering
**Reference:** Tech Spec §1 Decision 9
**File:** `src/app/page.tsx` (MODIFIED)

- [ ] If no cookie OR `intakeCompleted === false`: show IntakeFlow
- [ ] If cookie exists AND `intakeCompleted === true`: show "Continue" button
- [ ] Add "Start Over" button next to "Continue"
- [ ] "Continue" loads chat interface with saved context
- [ ] "Start Over" clears cookie and shows IntakeFlow

**Verification:** Returning users see Continue button, new users see intake

---

### Task 59: Connect Intake Output to Chat Interface
**Reference:** Tech Spec §10 (Integration checklist)
**File:** `src/app/page.tsx` (MODIFIED)

- [ ] After intake completes, pass output to chat component
- [ ] Pre-populate first message with Section 2 content
- [ ] OR display output above chat interface
- [ ] Store output in sessionStorage for persistence
- [ ] Load output on "Continue" button click

**Verification:** Intake output appears in chat interface

---

### Task 60: Add "New Conversation" Button Logic
**Reference:** Tech Spec §1 Decision 9 (Resolved Question #4)
**File:** Chat interface component (likely `src/components/chat/chat-container.tsx`)

- [ ] Import `getCookie` from cookie-manager
- [ ] Add "New Conversation" button to chat UI
- [ ] On click: clear chat history state
- [ ] Keep intake cookie intact (don't clear)
- [ ] Reset to empty chat, but maintain aiTool + promptType context

**Verification:** New conversation clears chat but keeps intake data

---

## Phase 7: Testing & Quality Assurance (1.5 hours)

### Task 61: Manual Test - ChatGPT + Prompt Architect Flow
**Reference:** Tech Spec §8 (Testing Strategy - E2E #1)

- [ ] Clear cookies and localStorage
- [ ] Load homepage
- [ ] Select ChatGPT
- [ ] Select Prompt Architect
- [ ] Enter 100-character initial thoughts
- [ ] Submit and wait for output
- [ ] Verify dual sections appear
- [ ] Verify Section 1 has setup instructions
- [ ] Verify Section 2 has P/T/C/F framework
- [ ] Copy both sections successfully

**Verification:** Complete flow works end-to-end

---

### Task 62: Manual Test - Gemini + General Prompt Flow
**Reference:** Tech Spec §8 (E2E #2)

- [ ] Clear cookies and localStorage
- [ ] Select Gemini
- [ ] Verify only 3 prompt types shown (no custom-instructions)
- [ ] Select General Prompt
- [ ] Enter 50-character thoughts
- [ ] Submit and verify single-section output
- [ ] Verify no Section 1 (setup instructions)

**Verification:** Non-Prompt-Architect flow works correctly

---

### Task 63: Manual Test - Cookie Persistence
**Reference:** Tech Spec §8 (E2E #3, Integration Tests)

- [ ] Complete intake flow (any tool + type)
- [ ] Verify cookie is set (check browser DevTools)
- [ ] Refresh page
- [ ] Verify "Continue" button appears
- [ ] Click Continue
- [ ] Verify chat loads with saved context
- [ ] Check localStorage matches cookie data

**Verification:** Cookie persists across page refresh

---

### Task 64: Manual Test - Back Navigation
**Reference:** Tech Spec §8 (E2E #4)

- [ ] Start intake flow
- [ ] Select ChatGPT (step 1 → 2)
- [ ] Select Prompt Architect (step 2 → 3)
- [ ] Click "Back" button
- [ ] Verify step 2 appears
- [ ] Verify ChatGPT is still selected
- [ ] Click "Back" again
- [ ] Verify step 1 appears
- [ ] Verify selections are preserved in context

**Verification:** Back navigation works, data preserved

---

### Task 65: Manual Test - Free Tier Exemption
**Reference:** Tech Spec §8 (E2E #5)

- [ ] Complete intake flow (counts as 0 messages)
- [ ] Start regular chat
- [ ] Send 3 messages
- [ ] Verify upgrade prompt appears
- [ ] Verify intake didn't count toward limit
- [ ] Check rate limiter logs (server-side)

**Verification:** Intake doesn't consume free messages

---

### Task 66: Manual Test - Input Validation
**Reference:** Tech Spec §6 (Security - Input Validation)

- [ ] Try submitting with 10 characters (< 20 min)
- [ ] Verify submit button is disabled
- [ ] Verify error message appears
- [ ] Try submitting with 600 characters (> 500 max)
- [ ] Verify submit button is disabled
- [ ] Enter exactly 20 characters
- [ ] Verify submit button is enabled

**Verification:** Client-side validation works correctly

---

### Task 67: Manual Test - Error Handling
**Reference:** Tech Spec §9 (Error Handling)

- [ ] Temporarily break Together.ai API (remove key or use invalid key)
- [ ] Submit intake
- [ ] Verify user-friendly error message appears
- [ ] Verify no stack traces in UI
- [ ] Check server logs for actual error
- [ ] Restore API key
- [ ] Test timeout scenario (if possible)

**Verification:** Errors handled gracefully with clear messages

---

### Task 68: Manual Test - Mobile Responsiveness
**Reference:** Tech Spec §8 (Cross-Browser Testing)

- [ ] Open app on mobile device or use DevTools responsive mode
- [ ] Test AI tool selector on small screen
- [ ] Test prompt type selector
- [ ] Test textarea resize on mobile
- [ ] Verify modal works on mobile
- [ ] Test all buttons are tappable
- [ ] Verify text is readable

**Verification:** UI works on mobile devices

---

### Task 69: Cross-Browser Testing
**Reference:** Tech Spec §8 (Cross-Browser Testing)

- [ ] Test full flow in Chrome
- [ ] Test full flow in Safari
- [ ] Test full flow in Firefox
- [ ] Test full flow in Mobile Safari (iOS)
- [ ] Verify cookies work in all browsers
- [ ] Verify localStorage works in all browsers

**Verification:** App works in all target browsers

---

### Task 70: TypeScript & Linting Check
**Reference:** Tech Spec §10 (Implementation Checklist)

- [ ] Run `npm run type-check`
- [ ] Fix any TypeScript errors
- [ ] Run `npm run lint`
- [ ] Fix any linting errors
- [ ] Verify zero errors in both checks

**Verification:** Zero TypeScript and linting errors

---

### Task 71: Build Test
**Reference:** Tech Spec §10

- [ ] Run `npm run build`
- [ ] Verify build completes without errors
- [ ] Check bundle size
- [ ] Verify no console warnings
- [ ] Test production build locally: `npm run start`

**Verification:** Production build succeeds

---

## Phase 8: Documentation & Cleanup (1 hour)

### Task 72: Update CLAUDE.md
**Reference:** CONSTITUTION.md (documentation requirements)

- [ ] Add section about Onboarding Intake Flow
- [ ] Document new API endpoint `/api/chat/intake`
- [ ] Document new components in `src/components/onboarding/`
- [ ] Document cookie management system
- [ ] Document rate limiter exemption
- [ ] Update project structure diagram
- [ ] Add usage examples

**Verification:** CLAUDE.md accurately reflects new features

---

### Task 73: Update QA_TESTING.md
**Reference:** CONSTITUTION.md

- [ ] Add new test scenarios for intake flow (10+ scenarios)
- [ ] Add cookie persistence tests
- [ ] Add rate limiter exemption tests
- [ ] Add input validation tests
- [ ] Add cross-browser test checklist

**Verification:** QA_TESTING.md includes all new features

---

### Task 74: Add JSDoc Comments to All New Functions
**Reference:** CONSTITUTION.md (code quality standards)

- [ ] Review all new utility functions
- [ ] Add JSDoc comments with description, params, returns
- [ ] Add examples where helpful
- [ ] Document edge cases in comments
- [ ] Run type-check to verify

**Verification:** All public functions have JSDoc

---

### Task 75: Add TODO Comments for Future Enhancements
**Reference:** Tech Spec §1 Decision 9 (Cookie Consent v2)

- [ ] Add TODO in cookie-manager.ts for GDPR consent banner
- [ ] Add TODO for multi-device sync feature
- [ ] Add TODO for analytics tracking of intake flow
- [ ] Add TODO for A/B testing of prompt type recommendations

**Verification:** Future work is documented in code

---

### Task 76: Final Code Review & Cleanup
**Reference:** CONSTITUTION.md

- [ ] Remove any console.log statements (use logger instead)
- [ ] Remove unused imports
- [ ] Check for magic numbers (should be in constants.ts)
- [ ] Verify kebab-case file naming
- [ ] Verify no `any` types used
- [ ] Remove commented-out code

**Verification:** Code meets all CONSTITUTION standards

---

## Summary

**Total Tasks:** 76
**Estimated Time:** 10-12 hours
**Dependencies:** Tasks must be completed in order (some have dependencies)

**Key Milestones:**
- After Task 9: All data files created ✅
- After Task 23: All utilities implemented ✅
- After Task 33: Backend API complete ✅
- After Task 39: React Context ready ✅
- After Task 55: All UI components complete ✅
- After Task 60: Integration complete ✅
- After Task 71: Testing complete ✅
- After Task 76: Production ready ✅

**Next Step:** Begin implementation with Task 1

---

**Notes for Developer:**
- Each task should take 5-15 minutes
- Run `npm run type-check` frequently
- Test in browser after every 3-5 tasks
- Commit after each major milestone
- Ask questions if any task is unclear
- Reference tech spec sections for detailed context
