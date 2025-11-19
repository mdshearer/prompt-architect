# Product Requirements Document: Onboarding Intake Flow

**Version:** 2.0.0
**Date:** November 19, 2025
**Status:** Draft (Revised)
**Author:** Product Owner (AI-Dev-Orchestrator)

---

## 1. High-Level Description

Replace the current homepage category selection with a modern, embeddable onboarding intake flow that guides users through a simple questionnaire before starting each conversation. The intake flow uses a **hybrid approach** that emphasizes teaching users to build their own "Prompt Architect" meta-project while still supporting quick, single-use prompts.

### The Core Innovation: "Prompt Architect Project" (Recommended Path)

The primary value proposition is helping users **setup their own permanent AI assistant** (a Project/Gem) that coaches them through building any future prompt. This solves the root problem: instead of giving users a single prompt, we teach them to create a reusable "Prompt Architect" that helps them build unlimited prompts forever.

**Example:** Rather than "Here's a custom instruction for your bakery marketing," the tool delivers "Here's how to create a Prompt Architect assistant in ChatGPT that will help you build prompts for marketing, customer service, operations, and any other business need."

### The Hybrid Approach

Users choose from **4 prompt types:**
1. **⭐ Prompt Architect Project** (Recommended) - Setup a meta-project that helps build future prompts
2. **Custom Instructions** - Build a single custom instruction for ChatGPT/Claude
3. **Projects/Gems** - Build a single project/gem for a specific use case
4. **General Prompt** - Build a one-time conversational prompt

### The Intake Flow

1. Ask users which AI tool they're building prompts for (ChatGPT GPT-5, Claude, Gemini 3, Microsoft Copilot)
2. Ask what type of prompt they need (4 options above, dynamically filtered by AI tool capabilities)
3. Collect their brief initial thoughts (guidance varies by prompt type - e.g., "Describe your business/role" for Prompt Architect)
4. Send collected information + built-in tool-specific instructions to Together.ai API to generate the output
5. Deliver both ready-to-use text AND setup instructions

This creates a **best-practice embeddable interface** suitable for deployment on external websites while maintaining the educational, coaching-focused approach of Prompt Architect.

**Strategic Value:**
- Aligns with Optimi's actual consulting work (teaching clients to setup their own prompt architects)
- Higher perceived value than "just another prompt generator"
- Natural funnel: Free self-service tool → "Want us to do this for you?" → Paid consulting
- Differentiates from competitors (teaches users to fish, not gives them a fish)
- Longer engagement and better lead quality

**Key Goals:**
- Prioritize teaching users to setup their own "Prompt Architect" (but allow quick options for those who need them)
- Dynamically tailor AI responses based on tool-specific capabilities (e.g., Gemini doesn't have Custom Instructions)
- Maintain updateable built-in instructions that adapt as AI tools evolve (GPT-5, Gemini 3, etc.)
- Keep existing prompt builders accessible in the flow
- Ensure onboarding doesn't consume free tier message quota
- Track user preferences and usage with cookie-based system (privacy-friendly, no personal data)

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

### US-2: Prompt Type Selection (Dynamic with Recommended Option)
**As a** new user who has selected an AI tool
**I want to** choose what type of prompt I need, with clear guidance on the recommended "Prompt Architect Project" option
**So that** I receive guidance specific to that use case and understand the strategic value of the meta-project approach

**Acceptance Criteria:**
- [ ] After AI tool selection, user sees "What type of prompt do you need?"
- [ ] Options are dynamically filtered based on selected AI tool:
  - **ChatGPT & Claude:**
    - ⭐ Prompt Architect Project (Recommended - with badge/visual indicator)
    - Custom Instructions
    - Projects (GPT/Claude)
    - General Prompt
  - **Gemini:**
    - ⭐ Prompt Architect Gem (Recommended - with badge/visual indicator)
    - Gems
    - General Prompt
  - **Microsoft Copilot:**
    - General Prompt only (no Custom Instructions, no Projects/Gems, no Prompt Architect option)
- [ ] Each option includes a brief 1-2 sentence explanation:
  - **Prompt Architect Project/Gem:** "Setup a reusable AI assistant that helps you build unlimited prompts forever. Best for learning the system."
  - **Custom Instructions:** "Create a single custom instruction for your AI tool."
  - **Projects/Gems:** "Build a project/gem for a specific use case (e.g., marketing, customer service)."
  - **General Prompt:** "Create a one-time conversational prompt."
- [ ] "Prompt Architect Project/Gem" option has visual indicator:
  - ⭐ "Recommended" badge
  - Link to educational Google doc: [Learn more about Prompt Architects](https://docs.google.com/document/d/13NviH4b6r4i3i2h8BOZVt0EhsOPP0hcD4I4KGFPZlTY/edit?tab=t.0)
  - "View example" link (opens modal/expandable section showing sample output)
- [ ] Selection is required before proceeding
- [ ] Selection is stored in conversation context AND cookie (for future sessions)

### US-3: Initial Thoughts Collection (Dynamic Guidance)
**As a** new user who has completed tool + type selection
**I want to** provide my brief initial thoughts with guidance tailored to my selected prompt type
**So that** the AI can understand my context and generate a highly relevant output

**Acceptance Criteria:**
- [ ] User sees a textarea with the label "Share your brief thoughts"
- [ ] Placeholder text and guidance vary based on selected prompt type:

  **For "Prompt Architect Project/Gem":**
  - Label: "Tell us about your business or role"
  - Placeholder: "Describe your business, role, or the main areas where you need AI help. Example: 'I run a small bakery and need help with marketing, customer service scripts, and menu planning.' or 'I'm a freelance marketing consultant who works with nonprofit clients.'"

  **For "Custom Instructions", "Projects/Gems", or "General Prompt":**
  - Label: "What do you want your AI to help you with?"
  - Placeholder: "Describe what you want your AI to do. Be as specific as you can in 2-3 sentences. Example: 'I want ChatGPT to act as a marketing consultant who helps me write engaging social media posts for my bakery business.'"

- [ ] Character limit: **500 characters** (with live counter showing remaining characters)
- [ ] Field is required (minimum 20 characters)
- [ ] Error state if user tries to submit empty or too-short input
- [ ] "Continue" or "Build My Prompt" button submits the form

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

### US-5: Prompt Architect Output Format (Instructions + Ready-to-Use Text)
**As a** user who selected "Prompt Architect Project/Gem"
**I want to** receive both setup instructions AND ready-to-use text
**So that** I can easily implement the Prompt Architect in my chosen AI tool

**Acceptance Criteria:**
- [ ] Output is delivered in two clear sections:

  **Section 1: "Your Prompt Architect Setup Instructions"**
  - Step-by-step guide for setting up the Project/Gem in their chosen AI tool
  - Tool-specific instructions (e.g., "In ChatGPT, click Projects → New Project → ...")
  - Screenshots or clear text descriptions of where to paste the prompt

  **Section 2: "Your Prompt Architect Instructions (Copy & Paste This)"**
  - Ready-to-use text formatted for direct copy-paste
  - Structured using established frameworks (e.g., P/T/C/F: Persona/Task/Context/Format)
  - Includes "Golden Rules" (e.g., "Stop and Ask" rule, "Don't Do" list)
  - Tailored to user's business/role from their "initial thoughts"

- [ ] Both sections are clearly labeled with copy buttons
- [ ] Output follows tool-specific best practices:
  - **ChatGPT:** Formatted for Projects feature with file upload instructions
  - **Claude:** Formatted for Projects with context window optimization
  - **Gemini:** Formatted for Gems with P/T/C/F structure and Golden Rules
  - **Copilot:** N/A (Copilot doesn't support Prompt Architect setup in v1)

- [ ] Example outputs are based on real client work (see provided examples: Research Summarizer for Optimi, AI Prompt Architect for Black Culture Zone)

### US-6: Cookie-Based Usage Tracking
**As a** system administrator
**I want to** track user preferences and usage with cookie-based storage
**So that** we can understand user behavior, prevent abuse, and provide continuity across sessions (without requiring authentication)

**Acceptance Criteria:**
- [ ] Cookie created on first visit with structure:
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
- [ ] Cookie persists across page refreshes and browser sessions
- [ ] Cookie expires after 30 days (or configurable duration)
- [ ] Privacy-friendly: No personal data, no tracking across sites, no third-party cookies
- [ ] Cookie tracks:
  - Which AI tool user is working with (enables continuity if they return)
  - Which prompt type they selected (enables analytics on most popular paths)
  - Message count for free tier enforcement
  - Whether intake was completed (skip intake if returning within session)
- [ ] Cookie syncs with localStorage for backup
- [ ] GDPR/privacy consideration: Cookie notice on first visit (optional for v1, required for production)
- [ ] Architect to design full cookie schema and implementation details in tech spec

### US-7: Free Tier Exemption
**As a** new user going through onboarding
**I want** the intake flow to not count against my 3 free messages
**So that** I can still use all 3 free coaching messages after completing onboarding

**Acceptance Criteria:**
- [ ] Onboarding intake flow does NOT increment usage counter
- [ ] Only subsequent chat messages (after intake completes) count toward the 3 free message limit
- [ ] Usage tracking logic distinguishes "onboarding" messages from "coaching" messages
- [ ] User sees "3 free messages remaining" after completing intake

### US-8: Integration with Prompt Builders
**As a** user who has completed intake
**I want to** still access the interactive prompt builders
**So that** I can use step-by-step wizards if I prefer that approach

**Acceptance Criteria:**
- [ ] Prompt builders (OPTIMI Framework, Custom Instructions Builder, Projects/Gems Builder) remain accessible
- [ ] Builders can be triggered via chat (AI suggests them) or via UI button
- [ ] Builders are contextually relevant to the selected AI tool and prompt type
- [ ] Example: If user selected "Gemini + Gems", builder for Projects/Gems is offered with Gemini-specific guidance
- [ ] Note: Prompt builders are supplementary to the Prompt Architect approach (not a replacement)

### US-9: Embeddable UI Design
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
│   │   ├── prompt-type-selector.tsx      # NEW: Prompt type selection step (with "Recommended" badge)
│   │   ├── initial-thoughts-input.tsx    # NEW: Textarea for user's thoughts (dynamic placeholder)
│   │   ├── intake-progress-indicator.tsx # NEW: Visual progress (step 1 of 3, etc.)
│   │   └── example-output-modal.tsx      # NEW: Modal showing example Prompt Architect outputs
│   │
│   ├── chat/                             # EXISTING: Integrate after intake completes
│   └── prompt-builders/                  # EXISTING: Trigger from chat or intake completion
│
├── lib/
│   ├── constants.ts                      # UPDATE: Add intake-specific constants
│   ├── intake-instructions.ts            # NEW: Logic to load/combine built-in instructions
│   ├── input-validation.ts               # UPDATE: Add 500-char validation for intake
│   ├── cookie-manager.ts                 # NEW: Cookie management for usage tracking
│   └── output-formatter.ts               # NEW: Formats Prompt Architect outputs (instructions + text)
│
└── data/
    └── ai-instructions/                  # NEW: Built-in instructions directory
        ├── instructions.json             # NEW: Structured AI tool + prompt type instructions
        ├── README.md                     # NEW: Documentation for updating instructions
        └── examples/                     # NEW: Example outputs directory
            ├── chatgpt-prompt-architect-example.md
            ├── claude-prompt-architect-example.md
            ├── gemini-prompt-architect-example.md
            └── client-examples/
                ├── research-summarizer-optimi.md         # Real client: Optimi
                └── prompt-architect-black-culture-zone.md # Real client: Black Culture Zone
```

### 3.2 Built-in Instructions Format

**Option 1: JSON (Recommended for structured data)**

```json
{
  "chatgpt": {
    "prompt-architect": {
      "version": "GPT-5",
      "capabilities": ["Projects feature", "Upload files", "Custom instructions per project", "Code interpreter"],
      "limitations": [],
      "best_practices": "Use P/T/C/F framework (Persona/Task/Context/Format). Include Golden Rule 1: 'Stop and Ask' before final answers. Include Golden Rule 2: 'Don't Do' list for sensitive topics.",
      "system_prompt_addition": "The user is building a Prompt Architect Project for ChatGPT GPT-5. This is a meta-project that will help them build unlimited future prompts. Output should include: (1) Setup instructions for creating a Project in ChatGPT, (2) Ready-to-use Prompt Architect instructions following P/T/C/F framework with Golden Rules, tailored to their business/role."
    },
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
      "best_practices": "Define specific use case, upload relevant files, set project-specific instructions.",
      "system_prompt_addition": "The user is building a Project for ChatGPT GPT-5..."
    },
    "general-prompt": {
      "version": "GPT-5",
      "capabilities": ["Thread-based conversations", "Advanced reasoning"],
      "limitations": ["No persistent memory across sessions unless using Projects"],
      "best_practices": "Be specific and provide context in each message.",
      "system_prompt_addition": "The user is building a general conversational prompt for ChatGPT GPT-5..."
    }
  },
  "claude": {
    "prompt-architect": {
      "version": "Claude Sonnet/Opus/Haiku",
      "capabilities": ["Projects feature", "200K context window", "Artifacts", "Advanced analysis"],
      "limitations": [],
      "best_practices": "Use P/T/C/F framework. Include 'Stop and Ask' rule and 'Don't Do' list.",
      "system_prompt_addition": "The user is building a Prompt Architect Project for Claude. Output should include setup instructions and ready-to-use instructions following P/T/C/F framework."
    },
    "custom-instructions": {
      "version": "Claude Sonnet/Opus/Haiku",
      "capabilities": ["Custom Instructions feature", "Persistent across conversations"],
      "limitations": [],
      "best_practices": "Focus on role and style preferences.",
      "system_prompt_addition": "The user is building Custom Instructions for Claude..."
    },
    "projects": {
      "version": "Claude Sonnet/Opus/Haiku",
      "capabilities": ["Projects feature", "Upload files", "Custom knowledge base"],
      "limitations": [],
      "best_practices": "Define specific use case and upload relevant documents.",
      "system_prompt_addition": "The user is building a Project for Claude..."
    },
    "general-prompt": {
      "version": "Claude Sonnet/Opus/Haiku",
      "capabilities": ["Thread-based conversations", "Long context window"],
      "limitations": [],
      "best_practices": "Provide clear context and examples.",
      "system_prompt_addition": "The user is building a general prompt for Claude..."
    }
  },
  "gemini": {
    "prompt-architect": {
      "version": "Gemini 3",
      "capabilities": ["Gems feature", "Persistent custom assistants", "File uploads"],
      "limitations": ["No Custom Instructions option (as of Nov 2025)"],
      "best_practices": "Use P/T/C/F framework specifically designed for Gems. Include 'Stop and Ask' Golden Rule and 'Don't Do' list. Reference official Gemini Gems guide.",
      "system_prompt_addition": "The user is building a Prompt Architect Gem for Gemini 3. This Gem will help them build future prompts and Gems. Output should include: (1) Setup instructions for creating a Gem in Gemini, (2) Ready-to-use Gem instructions following P/T/C/F framework with Golden Rules."
    },
    "gems": {
      "version": "Gemini 3",
      "capabilities": ["Gems feature", "Persistent custom assistants", "File uploads"],
      "limitations": ["No Custom Instructions option"],
      "best_practices": "Use P/T/C/F framework. Define clear persona and constraints.",
      "system_prompt_addition": "The user is building a Gem for Gemini 3..."
    },
    "general-prompt": {
      "version": "Gemini 3",
      "capabilities": ["Thread-based conversations", "Multimodal understanding"],
      "limitations": ["No Custom Instructions", "Shorter context window than Claude"],
      "best_practices": "Be specific in each message.",
      "system_prompt_addition": "The user is building a general prompt for Gemini 3..."
    }
  },
  "copilot": {
    "general-prompt": {
      "version": "Microsoft Copilot",
      "capabilities": ["Thread-based conversations", "Web search integration"],
      "limitations": ["No Custom Instructions option", "No Projects/Gems feature (as of Nov 2025)"],
      "best_practices": "Keep prompts clear and concise. Leverage web search when needed.",
      "system_prompt_addition": "The user is building a general prompt for Microsoft Copilot. Note: Copilot does not support Custom Instructions or Projects, so this is a one-time conversational prompt."
    }
  }
}
```

**Note on "Prompt Architect Project":**
- This is the **recommended path** for ChatGPT, Claude, and Gemini users
- Output includes **two sections**: (1) Setup instructions, (2) Ready-to-use text
- Uses **P/T/C/F framework** (Persona/Task/Context/Format) with **Golden Rules**
- Not available for Microsoft Copilot (no Projects/Gems support)

**Option 2: Markdown files (Easier for AI to edit)**

```
data/ai-instructions/
├── chatgpt-prompt-architect.md          # NEW: Prompt Architect for ChatGPT
├── chatgpt-custom-instructions.md
├── chatgpt-projects.md
├── chatgpt-general-prompt.md
├── claude-prompt-architect.md           # NEW: Prompt Architect for Claude
├── claude-custom-instructions.md
├── claude-projects.md
├── claude-general-prompt.md
├── gemini-prompt-architect.md           # NEW: Prompt Architect Gem for Gemini
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

// Dynamic placeholder text based on prompt type
export const INTAKE_PLACEHOLDERS = {
  PROMPT_ARCHITECT: "Describe your business, role, or the main areas where you need AI help. Example: 'I run a small bakery and need help with marketing, customer service scripts, and menu planning.' or 'I'm a freelance marketing consultant who works with nonprofit clients.'",
  DEFAULT: "Describe what you want your AI to do. Be as specific as you can in 2-3 sentences. Example: 'I want ChatGPT to act as a marketing consultant who helps me write engaging social media posts for my bakery business.'"
} as const

// AI Tools
export const AI_TOOLS = {
  CHATGPT: 'chatgpt',
  CLAUDE: 'claude',
  GEMINI: 'gemini',
  COPILOT: 'copilot'
} as const

// Prompt Types
export const PROMPT_TYPES = {
  PROMPT_ARCHITECT: 'prompt-architect',  // NEW: Meta-project for building future prompts
  CUSTOM_INSTRUCTIONS: 'custom-instructions',
  PROJECTS: 'projects',
  GEMS: 'gems',
  GENERAL_PROMPT: 'general-prompt'
} as const

// Cookie Configuration
export const COOKIE_CONFIG = {
  NAME: 'prompt_architect_session',
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  PATH: '/',
  SAME_SITE: 'lax' as const,
  SECURE: true // Only in production
} as const

// Educational Resources
export const EXTERNAL_LINKS = {
  PROMPT_ARCHITECT_GUIDE: 'https://docs.google.com/document/d/13NviH4b6r4i3i2h8BOZVt0EhsOPP0hcD4I4KGFPZlTY/edit?tab=t.0'
} as const
```

---

## 4. User Flow Diagram

```
┌──────────────────────────────────────────────┐
│  User visits homepage                         │
│  ("Build Better AI Prompts")                  │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  Step 1: Select AI Tool                       │
│  • ChatGPT (GPT-5)                            │
│  • Claude (Sonnet/Opus/Haiku)                 │
│  • Gemini 3                                   │
│  • Microsoft Copilot                          │
│                                               │
│  [Cookie stores: aiTool, sessionId]           │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  Step 2: Select Prompt Type (dynamic)         │
│  [Filtered based on AI tool selected]         │
│                                               │
│  ChatGPT/Claude:                              │
│  ⭐ Prompt Architect Project (Recommended)    │
│     [Learn more] [View example]               │
│  • Custom Instructions                        │
│  • Projects (GPT) / Projects (Claude)         │
│  • General Prompt                             │
│                                               │
│  Gemini:                                      │
│  ⭐ Prompt Architect Gem (Recommended)        │
│     [Learn more] [View example]               │
│  • Gems                                       │
│  • General Prompt                             │
│                                               │
│  Copilot:                                     │
│  • General Prompt only                        │
│                                               │
│  [Cookie stores: promptType]                  │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  Step 3: Share Brief Thoughts                 │
│  • Dynamic label & placeholder based on type  │
│  • Prompt Architect: "Tell us about your      │
│    business or role"                          │
│  • Others: "What do you want your AI to do?"  │
│  • 500 char limit with counter                │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  System Processing (Server-side)              │
│  • Load built-in instructions (JSON/MD)       │
│  • Combine: tool + type + user thoughts       │
│  • Send to Together.ai API                    │
│  • Does NOT count toward free tier            │
│  • Cookie stores: intakeCompleted = true      │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  Output Delivered                             │
│                                               │
│  IF "Prompt Architect Project/Gem":           │
│  ┌────────────────────────────────────────┐  │
│  │ Section 1: Setup Instructions          │  │
│  │ (How to create the Project/Gem)        │  │
│  │ [Copy Button]                           │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ Section 2: Ready-to-Use Text           │  │
│  │ (P/T/C/F framework + Golden Rules)      │  │
│  │ [Copy Button]                           │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ELSE (Custom Instructions, Projects, etc.):  │
│  • Standard single-section output             │
│                                               │
│  • Chat interface loads below                 │
│  • User has 3 free messages remaining         │
│  • Prompt builders accessible                 │
└───────────────────────────────────────────────┘
```

### Flow Variations by Prompt Type

**Path A: Prompt Architect Project/Gem (Recommended)**
- User gets: Setup instructions + Ready-to-use text (P/T/C/F framework)
- Example: "Here's how to create a Prompt Architect in ChatGPT that helps you build all future prompts"
- Strategic value: "Setup once, build unlimited prompts forever"

**Path B: Custom Instructions / Projects / Gems**
- User gets: Single optimized prompt for their specific use case
- Example: "Here's a custom instruction for ChatGPT to act as your marketing consultant"

**Path C: General Prompt**
- User gets: Conversational prompt for one-time use
- Example: "Here's a prompt to help you write social media posts for your bakery"

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

- User authentication and account system (remains a free, open-access lead magnet)
- Server-side analytics dashboard (cookie data stays client-side for v1)
- A/B testing different intake questions or UI variations
- Multi-language support (English only for v1)
- Admin UI for editing built-in instructions (manual JSON/MD file editing for v1)
- Email capture integration (lead magnet functionality for v2)
- Cross-device sync (cookies are device-specific for v1)
- Advanced analytics (heatmaps, session recordings, etc.)

---

## 7. Success Metrics

### Primary Metrics
- **Prompt Architect Adoption Rate:** >50% of users choose "Prompt Architect Project/Gem" (recommended path)
- **User Completion Rate:** >80% of users complete all 3 intake steps
- **Time to Output:** <10 seconds from submitting Step 3 to seeing output
- **Bounce Rate:** <30% (users who leave without completing intake)
- **Free Tier Preservation:** 100% of users have 3 messages remaining after intake

### Secondary Metrics
- **Educational Link Click-Through:** >20% of users click "Learn more" on Prompt Architect option
- **Example View Rate:** >30% of users click "View example" before selecting Prompt Architect
- **Copy Button Usage:** >70% of users copy the output text (indicates perceived value)
- **Return User Rate:** >15% of users return within 7 days (tracked via cookie)

### Technical Metrics
- **Embeddability:** Interface can be embedded on external site without CSS conflicts
- **Mobile Usability:** >90% of mobile users complete intake without issues
- **Cookie Persistence:** >95% of users retain cookie data across sessions

---

## 8. Dependencies

- Existing Together.ai API integration (`src/lib/together.ts`)
- Existing rate limiting system (must exclude intake messages)
- Existing chat interface components
- Existing prompt builders (OPTIMI, Custom Instructions, Projects/Gems)

---

## 9. Resolved Questions & Design Decisions

### ✅ Resolved in This PRD
1. **Hybrid Approach:** Confirmed - "Prompt Architect Project" is primary/recommended, but quick options remain available
2. **Prompt Type Options:** 4 options - Prompt Architect (⭐ Recommended), Custom Instructions, Projects/Gems, General Prompt
3. **Output Format:** Both instructions AND ready-to-use text for Prompt Architect path
4. **Usage Tracking:** Cookie-based system (sessionId, aiTool, promptType, messageCount)
5. **Educational Resources:** Link to Google doc + "View example" modal
6. **Dynamic Guidance:** Placeholder text changes based on prompt type selection
7. **Onboarding Free Tier:** Intake flow does NOT count toward 3 free messages

### ⚠️ Open Questions (For Architect to Decide)
1. **Back Navigation:** Should users be able to go back to previous steps, or is intake flow one-way?
   - Recommendation: Allow back navigation for better UX, but warn if changing selections (data loss)

2. **Skip Intake for Returning Users:** If user has cookie showing completed intake, skip directly to chat?
   - Recommendation: Show "Start New Conversation" button that skips intake if cookie exists

3. **Intake Editing:** After completing intake, can users edit their AI tool/prompt type selections?
   - Recommendation: "Start Over" button that clears cookie and restarts intake flow

4. **Multi-conversation Behavior:** Does intake happen once per session, or every time user starts a new conversation?
   - Recommendation: Intake once per session; "New Conversation" button for additional chats within same context

5. **Cookie Consent Banner:** Required for GDPR compliance - implement in v1 or v2?
   - Recommendation: v1 uses cookie without banner (low risk, no personal data); v2 adds proper consent UI

---

## 10. Timeline Estimate

**Using ai-dev-orchestrator 4-phase workflow:**

### Phase 1: Planning (45 minutes)
- ✅ PRD complete (this document)
- ⏳ Tech Spec by Architect persona (cookie schema, output formatting, instruction loading logic)

### Phase 2: Implementation (7-9 hours)
Broken down by component:

**Frontend Components (3-4 hours):**
- Intake flow container with progress indicator (1 hour)
- AI tool selector (30 min)
- Prompt type selector with "Recommended" badge + links (1.5 hours)
- Initial thoughts input with dynamic placeholders (1 hour)
- Example output modal (30 min)

**Backend & Data (2-3 hours):**
- Built-in instructions JSON/MD files for 10 combinations (1.5 hours)
- Intake API endpoint with instruction loading logic (1 hour)
- Output formatter for Prompt Architect (setup instructions + text) (30 min)
- Example outputs (2 client examples already provided) (30 min)

**Cookie Management (1 hour):**
- Cookie manager utility (30 min)
- Integration with intake flow (30 min)

**Integration (1-2 hours):**
- Connect intake to chat interface (1 hour)
- Update rate limiter to exclude intake messages (30 min)
- Homepage replacement (30 min)

### Phase 3: QA Review (1.5 hours)
- Test all AI tool + prompt type combinations (12 combinations) (45 min)
- Test cookie persistence and tracking (15 min)
- Test free tier exemption (15 min)
- Cross-browser testing (15 min)
- Mobile responsiveness (15 min)

### Phase 4: Documentation (45 minutes)
- Update CLAUDE.md with new intake flow (15 min)
- Update README.md (15 min)
- Create data/ai-instructions/README.md (15 min)
- Add inline JSDoc comments for complex functions (15 min)

---

**Total Estimated Time:** 10-12 hours for production-ready feature

**Complexity Factors:**
- 4 AI tools × 2.5 avg prompt types = ~10 instruction files to create
- Dynamic UI based on tool selection (frontend complexity)
- Cookie management + localStorage sync
- Dual-output format for Prompt Architect (instructions + text)
- Example modal with real client work

---

**Next Steps:**
1. ✅ PRD approved (v2.0.0 with Prompt Architect hybrid approach)
2. ⏳ Hand off to **Architect persona** for technical specification
3. ⏳ Architect designs: Cookie schema, output formatting logic, instruction file structure
4. ⏳ Proceed to Phase 2 (Implementation) after tech spec approval

**Recommendation:** This is a significant feature (10-12 hours). Consider breaking into 2 releases:
- **v1.0:** Basic intake flow with Prompt Architect option (8 hours)
- **v1.1:** Cookie tracking + example modal (2-4 hours)
