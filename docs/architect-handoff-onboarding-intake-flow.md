# Handoff to Solution Architect: Onboarding Intake Flow

**Date:** November 19, 2025
**From:** Product Owner (AI-Dev-Orchestrator)
**To:** Solution Architect
**Phase:** Phase 1 (Planning) → Technical Specification Required
**Project:** Onboarding Intake Flow v2.0 with Prompt Architect Hybrid Approach

---

## Executive Summary

The Product Owner has completed the PRD for the **Onboarding Intake Flow** feature (v2.0.0). This is a strategic pivot that positions the app as a tool to help users build their own "Prompt Architect" meta-project, rather than just a simple prompt generator.

**Your task:** Create a comprehensive technical specification that translates the 9 user stories into an implementable architecture, with particular focus on:
- Cookie management system
- Output formatting for dual-section Prompt Architect outputs
- Built-in instruction loading and concatenation logic
- Dynamic UI rendering based on AI tool selection

---

## Completed Artifacts

✅ **PRD v2.0.0:** `/home/user/prompt-architect/docs/onboarding-intake-flow-prd.md`
- 9 user stories with detailed acceptance criteria
- File structure proposal
- User flow diagrams
- Constants and configuration specs
- Timeline estimate: 10-12 hours

---

## Key Requirements Summary

### The Strategic Pivot

**Before:** Simple 3-category selection (Custom Instructions, Projects/Gems, Threads)
**After:** 4-option intake flow with **"Prompt Architect Project"** as the ⭐ recommended primary path

**Core Innovation:** Instead of giving users a single prompt, we teach them to create a reusable AI assistant (Project/Gem) that helps them build unlimited prompts forever.

### Technical Complexity Highlights

1. **Dynamic UI Filtering:**
   - ChatGPT/Claude: 4 options (Prompt Architect, Custom Instructions, Projects, General)
   - Gemini: 3 options (Prompt Architect Gem, Gems, General)
   - Copilot: 1 option (General only)

2. **Dual-Output Format for Prompt Architect:**
   - Section 1: Setup instructions (tool-specific)
   - Section 2: Ready-to-use text (P/T/C/F framework + Golden Rules)

3. **Cookie-Based Usage Tracking:**
   - Stores: sessionId, aiTool, promptType, messageCount, intakeCompleted, timestamp
   - Privacy-friendly (no personal data)
   - Syncs with localStorage
   - 30-day expiration

4. **Built-in AI Instructions:**
   - 10 different instruction files (4 tools × ~2.5 avg prompt types)
   - Tool-specific + prompt-type-specific guidance
   - Easily updateable (JSON or Markdown)

---

## Technical Decisions Required from Architect

### 1. Cookie Management Architecture

**Question:** What is the detailed cookie schema and sync strategy?

**Context from PRD:**
```json
{
  "sessionId": "uuid-v4",
  "aiTool": "chatgpt|claude|gemini|copilot",
  "promptType": "prompt-architect|custom-instructions|projects|gems|general-prompt",
  "messageCount": 0,
  "intakeCompleted": false,
  "timestamp": "ISO-8601-timestamp"
}
```

**Architect must specify:**
- Exact cookie structure (nested objects or flat?)
- How to handle cookie/localStorage sync (which is source of truth?)
- Conflict resolution if cookie and localStorage diverge
- Migration strategy if schema changes in future
- Browser compatibility considerations (Safari ITP, etc.)
- Cookie creation timing (on first visit vs. after Step 1?)
- Cookie update logic (when does each field get updated?)

**Deliverable:** Cookie management module specification (`src/lib/cookie-manager.ts`)

---

### 2. Output Formatter for Prompt Architect

**Question:** How do we generate the dual-section output (Setup Instructions + Ready-to-Use Text)?

**Context from PRD:**
- Prompt Architect outputs have 2 sections, others have 1 section
- Section 1: Tool-specific setup instructions (e.g., "In ChatGPT, click Projects → New Project → ...")
- Section 2: Ready-to-use text using P/T/C/F framework with Golden Rules, tailored to user's business/role

**Architect must specify:**
- Does Together.ai API return both sections, or do we format post-response?
- Template structure for Section 1 (is this hardcoded per tool, or AI-generated?)
- How do we ensure Section 2 follows P/T/C/F framework? (Is this in the system prompt?)
- Markdown formatting strategy for copy-paste friendliness
- Component structure for rendering both sections with copy buttons

**Deliverable:** Output formatter module specification (`src/lib/output-formatter.ts`)

---

### 3. Built-in Instructions Storage & Loading

**Question:** JSON or Markdown? How do we load and concatenate instructions?

**Context from PRD:**
- Option 1: Single `instructions.json` with nested structure
- Option 2: Separate Markdown files (e.g., `chatgpt-prompt-architect.md`)
- 10 total instruction sets needed

**Architect must specify:**
- Recommendation: JSON vs. Markdown (consider: ease of editing, AI accessibility, parsing complexity)
- File structure if Markdown (flat directory vs. nested by tool?)
- Loading strategy (read all at build time vs. on-demand at runtime?)
- Caching strategy (in-memory cache? how long?)
- Concatenation logic: How do we combine user input + built-in instructions + system prompt?
- Error handling if instruction file is missing or malformed

**Deliverable:** Instruction loading module specification (`src/lib/intake-instructions.ts`)

---

### 4. API Endpoint Design

**Question:** New `/api/chat/intake` endpoint or reuse existing `/api/chat`?

**Context from PRD:**
- Intake should NOT count toward free tier (different from normal chat)
- Intake returns formatted output, not streaming chat response
- Needs to load built-in instructions and concatenate with user input

**Architect must specify:**
- Endpoint structure (new route or parameter on existing route?)
- Request payload format
- Response format (JSON with sections? Markdown string?)
- Rate limiting integration (how to exclude intake from counter?)
- Error handling strategy
- Timeout configuration (30 seconds like chat, or different?)

**Deliverable:** API endpoint specification (`/api/chat/intake/route.ts`)

---

### 5. Component Architecture

**Question:** How do components communicate state (AI tool, prompt type, user input)?

**Context from PRD:**
- 3-step flow: AI Tool → Prompt Type → Initial Thoughts
- Progress indicator needs to know current step
- Prompt Type options are dynamically filtered based on AI Tool
- Placeholder text changes based on Prompt Type

**Architect must specify:**
- State management approach (React Context? Component state? URL params?)
- Props structure for each component
- Event handling for step transitions
- Validation flow (when to show errors?)
- Back navigation strategy (can users go back? what happens to entered data?)

**Deliverable:** Component architecture diagram + interface definitions

---

### 6. Example Output Modal

**Question:** How do we structure and load example Prompt Architect outputs?

**Context from PRD:**
- "View example" link opens modal showing sample output
- Examples include real client work (Research Summarizer for Optimi, Prompt Architect for Black Culture Zone)
- Examples should be tool-specific (ChatGPT example, Claude example, Gemini example)

**Architect must specify:**
- Example storage location (`data/ai-instructions/examples/`)
- File format (Markdown? JSON with metadata?)
- Modal component structure
- Loading strategy (eager load all? lazy load on click?)
- Syntax highlighting for code blocks (if examples include code)

**Deliverable:** Example modal specification + example file structure

---

### 7. Dynamic Placeholder Text Logic

**Question:** How do we implement dynamic placeholder text that changes based on prompt type?

**Context from PRD:**
```typescript
INTAKE_PLACEHOLDERS = {
  PROMPT_ARCHITECT: "Describe your business, role, or the main areas...",
  DEFAULT: "Describe what you want your AI to do..."
}
```

**Architect must specify:**
- Where does the switch happen? (in component or utility function?)
- Do we need more granular placeholders? (e.g., different for Custom Instructions vs. Projects?)
- Label text also changes ("Tell us about your business or role" vs. "What do you want your AI to help you with?")
- Animation strategy when placeholder/label changes

**Deliverable:** Dynamic text rendering specification

---

### 8. Free Tier Exemption Logic

**Question:** How do we exclude intake messages from the 3 free message count?

**Context from PRD:**
- Existing rate limiter in `src/lib/rate-limiter.ts`
- Intake should not increment message count
- After intake, user should see "3 free messages remaining"

**Architect must specify:**
- How to distinguish intake request from chat request?
- Modification to rate limiter function
- Where to check/update message count (server-side only, or client-side tracking too?)
- Cookie integration (messageCount field)

**Deliverable:** Rate limiter modification specification

---

### 9. Open Questions from PRD (Architect to Resolve)

The PRD includes 5 open questions with recommendations. Architect must make final decisions:

1. **Back Navigation:** Allow users to go back to previous steps?
   - PRD Recommendation: Yes, with data loss warning
   - **Architect Decision Required:** Implement in v1 or v2? How to handle state when going back?

2. **Skip Intake for Returning Users:** If cookie exists, skip intake?
   - PRD Recommendation: "Start New Conversation" button
   - **Architect Decision Required:** UX flow for returning users? Where does button appear?

3. **Intake Editing:** Can users edit selections after completion?
   - PRD Recommendation: "Start Over" button
   - **Architect Decision Required:** Where does button appear? What data is preserved?

4. **Multi-conversation Behavior:** Intake once per session or every new conversation?
   - PRD Recommendation: Once per session
   - **Architect Decision Required:** How to handle "New Conversation" within same session?

5. **Cookie Consent Banner:** Implement in v1 or v2?
   - PRD Recommendation: v2 (v1 uses cookie without banner)
   - **Architect Decision Required:** Confirm or override? Any legal risks?

---

## PRD Reference Sections

### User Stories (9 Total)
- **US-1:** AI Tool Selection
- **US-2:** Prompt Type Selection (Dynamic with Recommended Option)
- **US-3:** Initial Thoughts Collection (Dynamic Guidance)
- **US-4:** Built-in AI Instructions (Dynamic)
- **US-5:** Prompt Architect Output Format (Instructions + Ready-to-Use Text)
- **US-6:** Cookie-Based Usage Tracking
- **US-7:** Free Tier Exemption
- **US-8:** Integration with Prompt Builders
- **US-9:** Embeddable UI Design

Full acceptance criteria available in PRD.

### File Structure Proposal (from PRD)
```
src/
├── app/
│   ├── page.tsx                          # NEW: Onboarding intake page
│   └── api/chat/intake/route.ts          # NEW: Intake API endpoint
├── components/onboarding/
│   ├── intake-flow.tsx                   # NEW: Main container
│   ├── ai-tool-selector.tsx              # NEW
│   ├── prompt-type-selector.tsx          # NEW: With "Recommended" badge
│   ├── initial-thoughts-input.tsx        # NEW: Dynamic placeholders
│   ├── intake-progress-indicator.tsx     # NEW
│   └── example-output-modal.tsx          # NEW
├── lib/
│   ├── cookie-manager.ts                 # NEW
│   ├── intake-instructions.ts            # NEW
│   ├── output-formatter.ts               # NEW
│   └── [existing files to update]
└── data/ai-instructions/
    ├── instructions.json                 # NEW (or .md files)
    ├── README.md                         # NEW
    └── examples/                         # NEW
```

### Constants Proposed (from PRD)
```typescript
MAX_INTAKE_THOUGHTS_LENGTH = 500
MIN_INTAKE_THOUGHTS_LENGTH = 20
INTAKE_PLACEHOLDERS = { PROMPT_ARCHITECT, DEFAULT }
AI_TOOLS = { CHATGPT, CLAUDE, GEMINI, COPILOT }
PROMPT_TYPES = { PROMPT_ARCHITECT, CUSTOM_INSTRUCTIONS, PROJECTS, GEMS, GENERAL_PROMPT }
COOKIE_CONFIG = { NAME, MAX_AGE, PATH, SAME_SITE, SECURE }
EXTERNAL_LINKS = { PROMPT_ARCHITECT_GUIDE }
```

---

## Deliverables Expected from Architect

### Primary Deliverable: Technical Specification Document

Create: `/home/user/prompt-architect/docs/onboarding-intake-flow-tech-spec.md`

**Required Sections:**
1. **System Architecture Overview**
   - Component diagram
   - Data flow diagram
   - State management strategy

2. **Module Specifications** (detailed specs for each new file)
   - `src/lib/cookie-manager.ts`
   - `src/lib/output-formatter.ts`
   - `src/lib/intake-instructions.ts`
   - `/api/chat/intake/route.ts`

3. **Component Specifications** (interfaces, props, state)
   - All 6 new components in `src/components/onboarding/`

4. **Data Schema**
   - Cookie structure (final schema)
   - Built-in instructions format (JSON or Markdown - final decision)
   - API request/response formats

5. **Integration Points**
   - How intake connects to existing chat interface
   - How to modify rate limiter
   - How to update constants

6. **Error Handling & Edge Cases**
   - What happens if Together.ai API fails?
   - What happens if cookie is corrupted?
   - What happens if instruction file is missing?
   - Browser compatibility issues (Safari ITP, etc.)

7. **Security Considerations**
   - XSS prevention in user input
   - API key protection
   - Cookie security (httpOnly? Secure flag?)

8. **Performance Considerations**
   - Lazy loading strategies
   - Caching strategies
   - Bundle size impact

9. **Testing Strategy**
   - Unit tests needed
   - Integration tests needed
   - E2E test scenarios

10. **Resolved Open Questions**
    - Final decisions on the 5 open questions from PRD

---

## Success Criteria for Tech Spec

The technical specification is complete when:
- ✅ All 9 technical decisions are made with clear rationale
- ✅ All 5 open questions from PRD are resolved
- ✅ All new modules have detailed interface definitions
- ✅ Component architecture is clearly documented with diagrams
- ✅ Data schemas are finalized (cookie, instructions, API payloads)
- ✅ Error handling and edge cases are addressed
- ✅ Security and performance considerations are documented
- ✅ Developer can read tech spec and implement without ambiguity

**Estimated Time:** 30-45 minutes (per PRD timeline)

---

## Context & Constraints

### Existing Codebase Context
- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript 5.9+ (strict mode, zero `any` allowed)
- **Styling:** Tailwind CSS 4 with Optimi brand colors
- **AI Provider:** Together.ai (Llama-3.3-70B-Instruct-Turbo)
- **Storage:** Client-side (localStorage/cookies for MVP, no database)
- **Authentication:** None (open-access lead magnet)

### Code Quality Standards (from CONSTITUTION.md)
- All component files use kebab-case (e.g., `intake-flow.tsx`)
- Zero `any` types allowed
- All magic numbers in `src/lib/constants.ts`
- Environment-aware logging via `src/lib/logger.ts`
- JSDoc comments on complex functions

### Budget Constraints
- **Total estimated time:** 10-12 hours for implementation (keep architecture simple to hit this target)
- **API cost consideration:** Together.ai API calls cost money (optimize token usage)
- **Free tier:** 3 messages (don't break existing rate limiting)

---

## Next Steps After Tech Spec Completion

1. **Handoff to Developer Persona** (Phase 2: Implementation)
2. Developer builds feature following tech spec
3. **QA Engineer Review** (Phase 3: Testing)
4. **Technical Writer** updates documentation (Phase 4)

---

## Questions for the Architect?

If you need clarification on any PRD requirements or business logic, ask the Product Owner before proceeding. The PRD is the source of truth for **what** to build; the tech spec defines **how** to build it.

**Product Owner available for questions on:**
- User story acceptance criteria
- Business logic edge cases
- Strategic priorities (if tradeoffs are needed)

---

## Reference Files

- **PRD:** `/home/user/prompt-architect/docs/onboarding-intake-flow-prd.md`
- **Project Constitution:** `/home/user/prompt-architect/CONSTITUTION.md`
- **Claude Code Instructions:** `/home/user/prompt-architect/CLAUDE.md`
- **Orchestrator Framework:** `/home/user/prompt-architect/.claude/`
- **Architect Persona:** `/home/user/prompt-architect/.claude/personas/solution-architect.md` (if exists)

---

## Good Luck, Architect! 🏗️

Your technical specification will be the blueprint for implementation. Make it clear, detailed, and developer-friendly. Remember: The goal is to enable the Developer persona to implement this feature in 7-9 hours without needing to make major architectural decisions.

**Focus on:** Clarity, completeness, and practical implementation details.
