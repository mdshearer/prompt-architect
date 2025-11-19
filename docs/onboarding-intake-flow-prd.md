# Product Requirements Document: Onboarding Intake Flow

**Version:** 1.0.0
**Date:** November 19, 2025
**Status:** Draft
**Author:** Product Owner (AI-Dev-Orchestrator)

---

## 1. High-Level Description

Replace the current homepage category selection with a modern, embeddable onboarding intake flow that guides new users through a simple questionnaire before starting each conversation. The intake flow will:

1. Ask users which AI tool they're building prompts for (ChatGPT, Claude, Gemini, Microsoft Copilot)
2. Ask what type of prompt they need (Custom Instructions, Projects/Gems, or General Prompts)
3. Collect their brief initial thoughts (with guidance and character limits)
4. Send collected information + built-in AI-specific instructions to the AI to generate an optimized prompt

This creates a **best-practice embeddable interface** suitable for deployment on external websites while maintaining the educational, coaching-focused approach of Prompt Architect.

**Key Goals:**
- Simplify the new user experience with guided questions
- Dynamically tailor AI responses based on tool-specific capabilities (e.g., Gemini doesn't have Custom Instructions)
- Maintain updateable built-in instructions that adapt as AI tools evolve
- Keep existing prompt builders accessible in the flow
- Ensure onboarding doesn't consume free tier message quota

---

## 2. User Stories

### US-1: AI Tool Selection
**As a** new user visiting Prompt Architect
**I want to** select which AI tool I'm building a prompt for
**So that** the system can tailor its guidance to my specific platform

**Acceptance Criteria:**
- [ ] User sees a clean, embeddable interface asking "Which AI tool are you using?"
- [ ] Four options are presented with clear labels:
  - ChatGPT (GPT-5)
  - Claude (Sonnet/Opus/Haiku)
  - Gemini 3
  - Microsoft Copilot
- [ ] Selection is required before proceeding
- [ ] UI follows Optimi brand colors and Tailwind CSS styling
- [ ] Interface looks professional enough to embed on external websites
- [ ] Selection is stored in conversation context for AI coaching

### US-2: Prompt Type Selection (Dynamic)
**As a** new user who has selected an AI tool
**I want to** choose what type of prompt I need
**So that** I receive guidance specific to that use case

**Acceptance Criteria:**
- [ ] After AI tool selection, user sees "What type of prompt do you need?"
- [ ] Options are dynamically filtered based on selected AI tool:
  - **ChatGPT & Claude:** Custom Instructions, Projects (GPT) / Projects (Claude), General Prompt
  - **Gemini:** Gems, General Prompt (no Custom Instructions option)
  - **Microsoft Copilot:** General Prompt only (no Custom Instructions, no Projects/Gems)
- [ ] Each option includes a brief 1-2 sentence explanation
- [ ] Selection is required before proceeding
- [ ] Selection is stored in conversation context

### US-3: Initial Thoughts Collection
**As a** new user who has completed tool + type selection
**I want to** provide my brief initial thoughts
**So that** the AI can understand my goals and generate a tailored prompt

**Acceptance Criteria:**
- [ ] User sees a textarea with the label "Share your brief thoughts"
- [ ] Placeholder text provides guidance:
  - "Describe what you want your AI to help you with. Be as specific as you can in 2-3 sentences. Example: 'I want ChatGPT to act as a marketing consultant who helps me write social media posts for my bakery business.'"
- [ ] Character limit: **500 characters** (with live counter showing remaining characters)
- [ ] Field is required (minimum 20 characters)
- [ ] Error state if user tries to submit empty or too-short input
- [ ] "Continue" or "Start Coaching" button submits the form

### US-4: Built-in AI Instructions (Dynamic)
**As a** system
**I want to** send tool-specific and prompt-type-specific instructions to the AI
**So that** coaching is accurate and reflects current AI tool capabilities

**Acceptance Criteria:**
- [ ] Built-in instructions stored in structured format (JSON or Markdown files)
- [ ] Instructions organized by:
  - AI tool (ChatGPT, Claude, Gemini, Copilot)
  - Prompt type (Custom Instructions, Projects/Gems, General Prompt)
- [ ] Instructions include:
  - Tool-specific capabilities and limitations
  - Version-specific notes (e.g., "GPT-5 supports...", "Gemini 3 currently doesn't...")
  - Best practices for that tool + prompt type combination
- [ ] Instructions are easily editable by AI or developer (structured in `/data/ai-instructions/` directory)
- [ ] System concatenates: user's tool selection + prompt type + user's brief thoughts + built-in instructions → sent to Together.ai API
- [ ] Instructions are not visible to end user (sent server-side only)

### US-5: Free Tier Exemption
**As a** new user going through onboarding
**I want** the intake flow to not count against my 3 free messages
**So that** I can still use all 3 free coaching messages after completing onboarding

**Acceptance Criteria:**
- [ ] Onboarding intake flow does NOT increment usage counter
- [ ] Only subsequent chat messages (after intake completes) count toward the 3 free message limit
- [ ] Usage tracking logic distinguishes "onboarding" messages from "coaching" messages
- [ ] User sees "3 free messages remaining" after completing intake

### US-6: Integration with Prompt Builders
**As a** user who has completed intake
**I want to** still access the interactive prompt builders
**So that** I can use step-by-step wizards if I prefer that approach

**Acceptance Criteria:**
- [ ] Prompt builders (OPTIMI Framework, Custom Instructions Builder, Projects/Gems Builder) remain accessible
- [ ] Builders can be triggered via chat (AI suggests them) or via UI button
- [ ] Builders are contextually relevant to the selected AI tool and prompt type
- [ ] Example: If user selected "Gemini + Gems", builder for Projects/Gems is offered with Gemini-specific guidance

### US-7: Embeddable UI Design
**As a** potential partner/client
**I want** the intake interface to look professional and embeddable
**So that** I could deploy this on my own website as a lead magnet

**Acceptance Criteria:**
- [ ] Interface uses clean, modern design patterns
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Optimi branding is subtle (can be easily white-labeled)
- [ ] No hardcoded Optimi-specific copy in the intake flow itself
- [ ] UI components are modular and reusable
- [ ] CSS is scoped (no global styles that conflict with parent sites)
- [ ] Interface can be embedded via `<iframe>` or direct component integration

---

## 3. Technical Requirements

### 3.1 File Structure

```
src/
├── app/
│   ├── page.tsx                          # NEW: Onboarding intake page (replaces current homepage)
│   └── api/
│       └── chat/
│           └── intake/
│               └── route.ts              # NEW: Intake-specific API endpoint
│
├── components/
│   ├── onboarding/
│   │   ├── intake-flow.tsx               # NEW: Main intake flow container
│   │   ├── ai-tool-selector.tsx          # NEW: AI tool selection step
│   │   ├── prompt-type-selector.tsx      # NEW: Prompt type selection step
│   │   ├── initial-thoughts-input.tsx    # NEW: Textarea for user's thoughts
│   │   └── intake-progress-indicator.tsx # NEW: Visual progress (step 1 of 3, etc.)
│   │
│   ├── chat/                             # EXISTING: Integrate after intake completes
│   └── prompt-builders/                  # EXISTING: Trigger from chat or intake completion
│
├── lib/
│   ├── constants.ts                      # UPDATE: Add intake-specific constants
│   ├── intake-instructions.ts            # NEW: Logic to load/combine built-in instructions
│   └── input-validation.ts               # UPDATE: Add 500-char validation for intake
│
└── data/
    └── ai-instructions/                  # NEW: Built-in instructions directory
        ├── instructions.json             # NEW: Structured AI tool + prompt type instructions
        └── README.md                     # NEW: Documentation for updating instructions
```

### 3.2 Built-in Instructions Format

**Option 1: JSON (Recommended for structured data)**

```json
{
  "chatgpt": {
    "custom-instructions": {
      "version": "GPT-5",
      "capabilities": ["Custom Instructions in Settings", "Persistent across conversations"],
      "limitations": [],
      "best_practices": "Focus on role definition and output format preferences.",
      "system_prompt_addition": "The user is building Custom Instructions for ChatGPT GPT-5..."
    },
    "projects": {
      "version": "GPT-5",
      "capabilities": ["Projects feature", "Upload files", "Set custom instructions per project"],
      "limitations": [],
      "best_practices": "...",
      "system_prompt_addition": "..."
    },
    "general-prompt": {
      "version": "GPT-5",
      "capabilities": ["Thread-based conversations"],
      "limitations": [],
      "best_practices": "...",
      "system_prompt_addition": "..."
    }
  },
  "claude": {
    "custom-instructions": { "..." },
    "projects": { "..." },
    "general-prompt": { "..." }
  },
  "gemini": {
    "gems": { "version": "Gemini 3", "..." },
    "general-prompt": { "..." }
  },
  "copilot": {
    "general-prompt": { "..." }
  }
}
```

**Option 2: Markdown files (Easier for AI to edit)**

```
data/ai-instructions/
├── chatgpt-custom-instructions.md
├── chatgpt-projects.md
├── chatgpt-general-prompt.md
├── claude-custom-instructions.md
├── claude-projects.md
├── claude-general-prompt.md
├── gemini-gems.md
├── gemini-general-prompt.md
├── copilot-general-prompt.md
└── README.md
```

### 3.3 Constants (Add to `src/lib/constants.ts`)

```typescript
// Intake Flow
export const MAX_INTAKE_THOUGHTS_LENGTH = 500
export const MIN_INTAKE_THOUGHTS_LENGTH = 20
export const INTAKE_THOUGHTS_PLACEHOLDER = "Describe what you want your AI to help you with..."

// AI Tools
export const AI_TOOLS = {
  CHATGPT: 'chatgpt',
  CLAUDE: 'claude',
  GEMINI: 'gemini',
  COPILOT: 'copilot'
} as const

// Prompt Types
export const PROMPT_TYPES = {
  CUSTOM_INSTRUCTIONS: 'custom-instructions',
  PROJECTS: 'projects',
  GEMS: 'gems',
  GENERAL_PROMPT: 'general-prompt'
} as const
```

---

## 4. User Flow Diagram

```
┌─────────────────────────────────────────┐
│  User visits homepage                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Step 1: Select AI Tool                  │
│  • ChatGPT (GPT-5)                       │
│  • Claude (Sonnet/Opus/Haiku)            │
│  • Gemini 3                              │
│  • Microsoft Copilot                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Step 2: Select Prompt Type (dynamic)    │
│  [Filtered based on AI tool selected]    │
│  • Custom Instructions (GPT/Claude only) │
│  • Projects/Gems (GPT/Claude/Gemini)     │
│  • General Prompt (all tools)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Step 3: Share Brief Thoughts            │
│  • Textarea with guidance                │
│  • 500 char limit with counter           │
│  • Placeholder example provided          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  System Processing (Server-side)         │
│  • Load built-in instructions            │
│  • Combine: tool + type + user thoughts  │
│  • Send to Together.ai API               │
│  • Does NOT count toward free tier       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Chat Interface Loads                    │
│  • AI responds with initial coaching     │
│  • Prompt builders accessible            │
│  • User has 3 free messages remaining    │
└─────────────────────────────────────────┘
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Intake flow should load in < 1 second
- Step transitions should be instant (no loading states between steps)
- AI response after Step 3 should appear within 5 seconds

### 5.2 Accessibility
- Full keyboard navigation support (tab through options, Enter to select)
- ARIA labels for all interactive elements
- Screen reader friendly
- High contrast mode support

### 5.3 Security
- Input validation on client and server (500 char limit enforced server-side)
- XSS prevention (sanitize user's "brief thoughts" before sending to AI)
- Built-in instructions never exposed to client (server-side only)

### 5.4 Mobile Responsiveness
- Single-column layout on mobile
- Touch-friendly tap targets (min 44px)
- Virtual keyboard doesn't obscure textarea

---

## 6. Out of Scope (Future Enhancements)

- User authentication (still a free, open-access lead magnet)
- Saving intake preferences for returning users
- A/B testing different intake questions
- Multi-language support
- Admin UI for editing built-in instructions (manual file editing for v1)
- Analytics tracking of most popular AI tool + prompt type combinations

---

## 7. Success Metrics

- **User Completion Rate:** >80% of users complete all 3 intake steps
- **Time to First AI Response:** <10 seconds from landing on homepage to first AI message
- **Bounce Rate:** <30% (users who leave without completing intake)
- **Free Tier Preservation:** 100% of users have 3 messages remaining after intake
- **Embeddability:** Interface can be embedded on external site without CSS conflicts

---

## 8. Dependencies

- Existing Together.ai API integration (`src/lib/together.ts`)
- Existing rate limiting system (must exclude intake messages)
- Existing chat interface components
- Existing prompt builders (OPTIMI, Custom Instructions, Projects/Gems)

---

## 9. Open Questions

1. **Back Navigation:** Should users be able to go back to previous steps, or is intake flow one-way?
2. **Skip Option:** Should there be a "Skip Intake" option for power users who want to go straight to chat?
3. **Intake Editing:** After completing intake, can users edit their selections or restart?
4. **Multi-conversation:** Does intake happen once per session, or every time user starts a new conversation?

---

## 10. Timeline Estimate

**Using ai-dev-orchestrator 4-phase workflow:**

- **Phase 1 (Planning):** 30 minutes - PRD (this doc) + Tech Spec
- **Phase 2 (Implementation):** 4-5 hours - Build intake flow, built-in instructions system, API endpoint
- **Phase 3 (QA Review):** 1 hour - Test all tool/type combinations, validation, free tier logic
- **Phase 4 (Documentation):** 30 minutes - Update CLAUDE.md, README.md, create data/ai-instructions/README.md

**Total Estimated Time:** 6-7 hours for production-ready feature

---

**Next Steps:**
1. Review and approve this PRD
2. Hand off to Architect persona for technical specification
3. Proceed to Phase 2 (Implementation) after tech spec approval
