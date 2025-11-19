# Phase 1: Planning

**Duration:** 15-30 minutes
**Goal:** Define feature requirements and technical approach
**Personas:** Product Owner → Architect

---

## Overview

Phase 1 transforms a feature idea into concrete, implementable specifications. By the end of this phase, you'll have:
- ✅ Clear product requirements (PRD)
- ✅ Technical specification
- ✅ Component architecture
- ✅ Type definitions
- ✅ Implementation roadmap

---

## Step 1: Product Requirements Document (PRD)

**Persona:** Product Owner
**Duration:** 10-15 minutes

### Prompt Template:

```
I need a Product Requirements Document (PRD) for the following feature:

**Feature Idea:** [Describe the feature in 1-2 sentences]

**User Problem:** [What problem does this solve for non-technical users?]

**Lead Gen Goal:** [How does this help convert visitors to leads?]

Follow the Product Owner persona guidelines in `.claude/personas/product-owner.md` and reference `/home/user/prompt-architect/CONSTITUTION.md` for project context.

Please include:
1. User story
2. Target audience (non-technical users)
3. Success metrics
4. Feature requirements (must-have vs nice-to-have)
5. User flow
6. Lead capture opportunities
7. UI/UX considerations
8. Optimi brand alignment
```

### Example:

```
I need a PRD for the following feature:

**Feature Idea:** Allow users to save their conversation history locally and resume later

**User Problem:** Users lose their progress when they close the browser, forcing them to start over

**Lead Gen Goal:** Captured email becomes the "save key" - users provide email to enable save/resume feature

Follow the Product Owner persona guidelines and reference CONSTITUTION.md.
```

### Deliverable:

A complete PRD document with all sections filled out. Review for:
- [ ] Clear user story
- [ ] Specific success metrics
- [ ] Realistic scope (not too ambitious)
- [ ] Lead gen opportunity identified
- [ ] No technical jargon (written for business stakeholders)

---

## Step 2: Technical Specification

**Persona:** Architect
**Duration:** 15-20 minutes

### Prompt Template:

```
Based on this PRD:

[Paste PRD from Step 1]

Create a Technical Specification following the Architect persona guidelines in `.claude/personas/architect.md`.

Reference `/home/user/prompt-architect/CONSTITUTION.md` for:
- Approved tech stack (Next.js 15, TypeScript, Tailwind, etc.)
- Replit hosting constraints
- No database (use localStorage)
- Security requirements

Please include:
1. Architecture overview
2. Component structure (file paths and names)
3. TypeScript type definitions
4. API routes (if needed)
5. State management approach
6. Styling approach (Tailwind + Optimi colors)
7. Integration points with existing code
8. Security considerations
9. Performance considerations
10. Implementation steps for Developer
```

### Example:

```
Based on this PRD:

[Paste the save/resume PRD]

Create a Technical Specification following the Architect persona.

Reference CONSTITUTION.md for tech stack (localStorage, no database, Replit hosting).

Focus on:
- How to store conversation data in localStorage
- How to link email address to saved data
- How to restore conversation on return visit
- Security (don't store email in plain text?)
```

### Deliverable:

A detailed technical specification that a developer can implement without guessing. Review for:
- [ ] Clear architecture (how components fit together)
- [ ] Specific file paths and names
- [ ] Complete type definitions
- [ ] Security approach documented
- [ ] Integration with existing code identified
- [ ] Realistic for one developer to implement

---

## Step 3: Review & Refinement

**Duration:** 5 minutes

Before moving to Phase 2 (Implementation), review both documents:

### PRD Checklist:
- [ ] User story is clear and specific
- [ ] Target audience is non-technical users
- [ ] Success metrics are measurable
- [ ] Scope is realistic (can ship in 1-2 days)
- [ ] Lead gen opportunity exists
- [ ] No technical jargon

### Tech Spec Checklist:
- [ ] Uses approved tech stack from CONSTITUTION.md
- [ ] Works with Replit hosting
- [ ] No database required (localStorage is fine)
- [ ] Security approach sound (API keys server-side, etc.)
- [ ] Integration points identified
- [ ] File structure clear and organized

### Common Issues to Fix:

**PRD Issues:**
- ❌ Too ambitious (break into smaller features)
- ❌ Technical jargon (rewrite for business audience)
- ❌ No lead gen value (add conversion opportunity)
- ❌ Vague success metrics (make specific/measurable)

**Tech Spec Issues:**
- ❌ Requires database (use localStorage instead)
- ❌ Adds new dependencies (use existing tech)
- ❌ Over-engineered (simplify approach)
- ❌ Unclear implementation steps (be more specific)

---

## Outputs

At the end of Phase 1, you should have:

1. **PRD Document** - Saved as `docs/prd-[feature-name].md` or stored for reference
2. **Tech Spec Document** - Saved as `docs/tech-spec-[feature-name].md` or stored for reference
3. **Ready to implement** - Developer can start Phase 2 immediately

---

## Example Complete Phase 1

### Feature: Save & Resume Conversations

**PRD Summary:**
- **User Story:** As a non-technical user, I want to save my conversation progress, so that I don't lose my work when I close the browser
- **Success Metric:** 40% of users who hit the 3-message limit save their conversation
- **Lead Gen:** Email becomes the "save key" - required to enable save/resume

**Tech Spec Summary:**
- **Architecture:** localStorage for conversation data, email as unique key
- **Components:**
  - `SaveButton.tsx` in chat header
  - `ResumePrompt.tsx` on homepage
  - `useLocalStorage` custom hook
- **Types:**
  ```typescript
  interface SavedConversation {
    id: string
    email: string (hashed)
    messages: ChatMessage[]
    category: string
    lastSaved: Date
  }
  ```
- **Security:** Hash email with SHA-256, don't store plain text
- **Storage:** localStorage key: `prompt-architect-saved-${hashedEmail}`

**Next Step:** Move to Phase 2 (Implementation) - Developer generates task list from tech spec

---

## Tips for Success

### For Product Owner Role:
1. **Focus on user value** - What problem does this solve?
2. **Keep scope small** - Ship working features, iterate later
3. **Always include lead gen** - Every feature should drive conversions
4. **Use plain language** - No jargon in PRD
5. **Define success** - How will we measure if this works?

### For Architect Role:
1. **Use existing tech** - Don't add dependencies unless essential
2. **Keep it simple** - Simplest solution that works is best
3. **Be specific** - File paths, type names, component structure
4. **Think security** - API keys, input validation, data privacy
5. **Reference Constitution** - Follow project standards

### Common Pitfalls:
- ❌ Skipping Phase 1 (jumping straight to code = wasted effort)
- ❌ Vague requirements (causes confusion in implementation)
- ❌ Over-engineering (YAGNI - You Ain't Gonna Need It)
- ❌ Ignoring lead gen (features must support business goals)
- ❌ Forgetting mobile (most users are mobile)

---

## When to Skip Phase 1

Phase 1 can be abbreviated for:
- **Tiny bug fixes** (< 10 lines of code)
- **Simple UI tweaks** (color change, spacing adjustment)
- **Documentation updates** (README edits, comments)

For everything else, invest the 30 minutes in proper planning. It saves hours of rework.

---

**Next Phase:** [Phase 2: Implementation](./phase-2-implementation.md)
