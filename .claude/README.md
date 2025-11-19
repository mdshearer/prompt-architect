# AI-Dev-Orchestrator Framework

This directory contains the **ai-dev-orchestrator** framework integrated into the Prompt Architect project. This framework provides a structured, 4-phase workflow for building features with AI assistance.

## 📚 What's in This Directory

```
.claude/
├── README.md                      # This file
├── personas/                      # 5 specialized AI personas
│   ├── product-owner.md          # Creates PRDs, defines requirements
│   ├── architect.md              # Creates tech specs, designs architecture
│   ├── developer.md              # Implements features, writes code
│   ├── qa-engineer.md            # Tests features, finds bugs
│   └── tech-writer.md            # Updates documentation
└── workflows/                     # 4-phase development process
    ├── phase-1-planning.md       # PRD + Tech spec creation
    ├── phase-2-implementation.md # Task-by-task coding
    ├── phase-3-review.md         # QA testing + bug fixes
    └── phase-4-documentation.md  # Docs updates
```

---

## 🎯 Quick Start

### **Before Using This Framework**

1. **Read the Constitution** - `/home/user/prompt-architect/CONSTITUTION.md`
   - Contains all project rules, coding standards, security requirements
   - Every persona references this document
   - Updated: November 19, 2025

2. **Understand the Project** - `/home/user/prompt-architect/CLAUDE.md`
   - Project overview, tech stack, architecture
   - Target audience: Non-technical users
   - Lead magnet for Optimi

---

## 🛠️ How to Use the Framework

### **The 4-Phase Workflow**

Every feature goes through 4 sequential phases:

#### **Phase 1: Planning** (15-30 minutes)
**Goal:** Define what to build and how to build it

1. Open `.claude/workflows/phase-1-planning.md`
2. Use **Product Owner** persona (`.claude/personas/product-owner.md`)
   - Create a Product Requirements Document (PRD)
   - Define user story, success metrics, scope
3. Use **Architect** persona (`.claude/personas/architect.md`)
   - Create Technical Specification
   - Define components, types, architecture

**Output:** PRD + Tech Spec (ready to implement)

---

#### **Phase 2: Implementation** (2-4 hours)
**Goal:** Build the feature task-by-task

1. Open `.claude/workflows/phase-2-implementation.md`
2. Use **Developer** persona (`.claude/personas/developer.md`)
   - Generate task list from tech spec
   - Implement tasks one-by-one
   - Test and commit after each task

**Output:** Working feature with tests and commits

---

#### **Phase 3: Review & Refactoring** (30-60 minutes)
**Goal:** Ensure quality, security, performance

1. Open `.claude/workflows/phase-3-review.md`
2. Use **QA Engineer** persona (`.claude/personas/qa-engineer.md`)
   - Comprehensive testing (functional, mobile, security, performance)
   - Create QA report with issues found
3. Use **Developer** persona to fix critical/medium issues

**Output:** Production-ready, bug-free feature

---

#### **Phase 4: Documentation** (15-30 minutes)
**Goal:** Document the feature for future reference

1. Open `.claude/workflows/phase-4-documentation.md`
2. Use **Technical Writer** persona (`.claude/personas/tech-writer.md`)
   - Update README.md
   - Update CLAUDE.md (patterns, file locations)
   - Add code comments

**Output:** Feature fully documented

---

## 💡 Example: Building a Feature

### **Feature: Add "Export to PDF" Button**

#### **Step 1: Planning (Phase 1)**

**Product Owner - Create PRD:**

```
Prompt to Claude Code:

I need a Product Requirements Document (PRD) for adding an "Export to PDF" button to the chat interface.

Use the Product Owner persona from `.claude/personas/product-owner.md`.

Reference `/home/user/prompt-architect/CONSTITUTION.md` for project context.

**Feature Idea:** Let users export their conversation as a PDF

**User Problem:** Users want to save and share their improved prompts

**Lead Gen Goal:** PDF includes Optimi branding and CTA to return to app

Please create a complete PRD following the template.
```

**Architect - Create Tech Spec:**

```
Prompt to Claude Code:

Based on this PRD: [paste PRD]

Create a Technical Specification using the Architect persona from `.claude/personas/architect.md`.

Reference `/home/user/prompt-architect/CONSTITUTION.md` for:
- Tech stack (Next.js, TypeScript, Tailwind, Replit)
- No database (use browser APIs)
- Security requirements

Please include:
- Component structure
- Type definitions
- Implementation approach
- Integration points
```

---

#### **Step 2: Implementation (Phase 2)**

**Developer - Generate Task List:**

```
Prompt to Claude Code:

Based on this tech spec: [paste tech spec]

Generate a detailed task list using the Developer persona from `.claude/personas/developer.md`.

Break into small tasks (15-30 min each) that can be implemented, tested, and committed independently.
```

**Developer - Implement Tasks:**

Work through each task:
1. Create types (`src/types/export.ts`)
2. Create ExportButton component
3. Create PDF generation logic
4. Integrate into ChatHeader
5. Test on desktop
6. Test on mobile
7. Fix any issues

**Commit after each task:**
```bash
git add .
git commit -m "Add export type definitions"
git push
```

---

#### **Step 3: Review (Phase 3)**

**QA Engineer - Comprehensive Testing:**

```
Prompt to Claude Code:

I've implemented the Export to PDF feature.

Files changed:
- src/types/export.ts
- src/components/export/ExportButton.tsx
- src/components/export/ExportManager.tsx
- src/components/chat/ChatHeader.tsx

Perform comprehensive QA review using the QA Engineer persona from `.claude/personas/qa-engineer.md`.

Reference `/home/user/prompt-architect/CONSTITUTION.md` for:
- Security requirements
- Performance benchmarks
- Mobile-first design

Test:
1. Functional (happy path + edge cases)
2. Mobile & browsers
3. UX & accessibility
4. Security
5. Performance

Provide detailed QA report with issues prioritized by severity.
```

**Developer - Fix Issues:**

Fix critical and medium issues found by QA:
- Add loading state during export
- Fix mobile layout issue
- Add validation for empty conversations

**Commit fixes:**
```bash
git commit -m "Fix export loading state and mobile layout"
```

---

#### **Step 4: Documentation (Phase 4)**

**Technical Writer - Update Docs:**

```
Prompt to Claude Code:

I've completed the Export to PDF feature.

Update documentation using the Technical Writer persona from `.claude/personas/tech-writer.md`.

Please update:
1. README.md - Add feature to list
2. CLAUDE.md - Document new components and patterns
3. Add code comments to complex logic

Files to document:
- src/components/export/ExportButton.tsx
- src/components/export/ExportManager.tsx
```

**Commit docs:**
```bash
git commit -m "Update docs for export to PDF feature"
```

---

## 🎓 How to Use Personas with Claude Code

### **Method 1: Copy-Paste Persona Guidelines**

1. Open persona file (e.g., `.claude/personas/product-owner.md`)
2. Copy the content
3. Include in your prompt to Claude Code:

```
You are the Product Owner for Prompt Architect.

[Paste persona guidelines here]

Now create a PRD for: [feature description]
```

### **Method 2: Reference Persona File**

```
Use the Product Owner persona from `.claude/personas/product-owner.md` to create a PRD for: [feature]
```

Claude Code can read files directly, so this works well.

---

## 📏 When to Use Each Persona

| Persona | When to Use | Output |
|---------|-------------|--------|
| **Product Owner** | Starting a new feature, defining requirements | PRD (Product Requirements Document) |
| **Architect** | After PRD, before coding | Tech Spec (architecture, components, types) |
| **Developer** | During implementation | Working code, git commits |
| **QA Engineer** | After implementation, before merge | QA Report (bugs, issues, recommendations) |
| **Technical Writer** | After feature complete | Updated docs (README, CLAUDE.md, comments) |

---

## ⚠️ Important Guidelines

### **Always Reference the Constitution**

Every persona MUST follow `/home/user/prompt-architect/CONSTITUTION.md`:
- Coding standards (TypeScript, React, Tailwind)
- Security requirements (API keys, input validation)
- Tech stack (Next.js, Replit, localStorage)
- Design principles (non-technical users, lead gen, Optimi brand)

### **Work Sequentially Through Phases**

Don't skip phases:
- ❌ **Bad:** Jump straight to coding without planning
- ✅ **Good:** Plan → Implement → Review → Document

### **Keep Features Small**

Target 1-2 days per feature:
- Phase 1: 30 minutes
- Phase 2: 2-4 hours
- Phase 3: 1 hour
- Phase 4: 30 minutes
- **Total:** 4-6 hours

If longer, break into smaller features.

### **Commit Frequently**

- Commit after each task (Phase 2)
- Commit each bug fix (Phase 3)
- Commit doc updates (Phase 4)

**Good commit messages:**
- ✅ `"Add SaveButton component to chat header"`
- ✅ `"Fix mobile keyboard covering input field"`
- ✅ `"Update README with save/resume feature"`

---

## 🚀 Benefits of This Framework

### **For Solo Development:**
- **Structure** - No more "where do I start?"
- **Quality** - Built-in QA and documentation phases
- **Speed** - Templates and personas accelerate work
- **Consistency** - Every feature follows same process

### **For AI-Assisted Development:**
- **Clear context** - Personas know their role
- **Better outputs** - Detailed prompts = better results
- **Reusable patterns** - Document once, reuse forever
- **Reduced errors** - QA phase catches issues early

### **For Team Collaboration:**
- **Shared standards** - Constitution defines rules
- **Clear handoffs** - PRD → Tech Spec → Code → Docs
- **Easy onboarding** - New devs follow framework
- **Code reviews** - QA reports structure feedback

---

## 🔄 Adapting the Framework

### **For Small Changes:**

Skip some phases for tiny changes:
- **Bug fixes** - Just Phase 2 (implement) + Phase 3 (test)
- **UI tweaks** - Just Phase 2, quick QA
- **Doc updates** - Just Phase 4

### **For Large Features:**

Break into multiple iterations:
- **Iteration 1:** Core functionality (all 4 phases)
- **Iteration 2:** Polish and enhancements (all 4 phases)
- **Iteration 3:** Advanced features (all 4 phases)

### **For Experiments:**

Use abbreviated workflow:
- **Quick planning** - Informal notes, not full PRD
- **Prototype** - Working code, minimal polish
- **Decision** - Ship it (full 4 phases) or kill it

---

## 📖 Further Reading

- **Original Framework:** https://github.com/mdshearer/ai-dev-orchestrator
- **Constitution:** `/home/user/prompt-architect/CONSTITUTION.md`
- **Project Context:** `/home/user/prompt-architect/CLAUDE.md`
- **Current Features:** `/home/user/prompt-architect/README.md`

---

## ❓ FAQ

### **Q: Do I have to use all 5 personas for every feature?**

**A:** Use at minimum: Product Owner (PRD) → Architect (Tech Spec) → Developer (Code) → QA Engineer (Test). Technical Writer is highly recommended but can be skipped for very small changes.

### **Q: Can I modify the personas or workflows?**

**A:** Yes! These are templates. Adapt them to your project's needs. But keep the Constitution as the single source of truth.

### **Q: What if a phase is taking too long?**

**A:** You might be tackling too big a feature. Break it into smaller pieces. Target 30 min for planning, 2-4 hours for implementation.

### **Q: Can I use this without AI assistance?**

**A:** Absolutely! The personas and workflows work as checklists even if you're not using Claude Code or other AI tools.

### **Q: How do I update the Constitution?**

**A:** Edit `/home/user/prompt-architect/CONSTITUTION.md` and commit the changes. All future features will follow the updated rules.

---

**Last Updated:** November 19, 2025
**Framework Version:** 1.0 (based on ai-dev-orchestrator)
**Project:** Prompt Architect by Optimi
