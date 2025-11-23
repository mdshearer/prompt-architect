# PRD: Database Implementation & Email Capture System

**Status:** Phase 1 - Planning
**Priority:** P0 (Critical - Blocks Core Business Model)
**Created:** 2025-11-23
**Owner:** Product Owner

---

## Executive Summary

**Problem:** Prompt Architect is a lead magnet application that currently captures zero leads. Without a database and email capture system, we have no way to:
- Collect user contact information
- Track conversions and user behavior
- Follow up with interested prospects
- Generate business value from the tool

**Solution:** Implement Replit DB for persistent storage and add strategic email capture points that provide value to users while building our lead database.

**Business Impact:** Transforms Prompt Architect from "free tool with zero ROI" to "lead generation engine that feeds Optimi's sales funnel."

---

## User Story

**Primary Story:**
```
As a marketing professional exploring AI prompt tools,
I want to save my custom prompts and access them later,
So that I can reference them across devices and share them with my team.
```

**Secondary Story:**
```
As an Optimi business development rep,
I want to capture qualified leads from Prompt Architect,
So that I can follow up with prospects who need AI consulting services.
```

---

## Target Audience

### Primary Users:
- **Marketing professionals** (CMOs, marketing managers, content creators)
- **Small business owners** exploring AI for their business
- **Professional consultants** who want better AI results for clients
- **Corporate teams** evaluating AI tools for their organization

### User Characteristics:
- **Technical skill level:** Low (no coding knowledge, limited AI experience)
- **Pain point:** Losing custom prompts, can't save work across sessions
- **Motivation:** Want professional-quality prompts without learning technical details
- **Device usage:** 60% mobile, 40% desktop (must work on both)

### Business Target (Optimi's Ideal Customer Profile):
- Companies with 20-500 employees
- Marketing/consulting budgets of $50k+/year
- Interest in AI adoption and training
- Decision-makers or influencers in their organization

---

## Success Metrics

### Primary Metrics (Must Track):
1. **Lead Capture Rate:** 30%+ of users who complete intake flow provide email
2. **Lead Quality:** 50%+ of captured leads match Optimi's ICP (company email, professional context)
3. **Email Validity:** 90%+ of emails are valid and deliverable

### Secondary Metrics:
4. **Engagement:** Users who provide email use 5x more messages than anonymous users
5. **Conversion Value:** 5%+ of leads convert to Optimi sales conversations
6. **Cross-device Usage:** 20%+ of email users return on a different device

### Analytics Tracking:
7. **Popular Features:** Which AI tools and prompt types are most used
8. **Drop-off Points:** Where users abandon the flow
9. **Session Duration:** Average time spent per session

---

## Feature Requirements

### Must-Have (Phase 1 - Week 1):

#### 1. Replit Database Setup
- Install and configure Replit DB for persistent storage
- Create database schema for leads, rate limiting, analytics
- Server-side only access (secure, can't be bypassed)
- Migration from in-memory Map to database for rate limiting

#### 2. Email Capture Modal (Post-Intake)
- **Trigger:** Shows after user completes intake flow and sees generated prompt
- **Copy:** "Want to save this prompt? Enter your email to access it anytime, on any device."
- **Form:** Single email input + "Save My Prompt" button
- **Validation:** Email format validation, no spam/temp emails
- **Optional field:** Company name (not required, but encouraged)
- **Mobile-friendly:** Large touch targets, keyboard-friendly

#### 3. Email Verification & Storage
- Store email + timestamp + intake data in Replit DB
- Hash email for rate limiting lookups (privacy protection)
- Basic email validation (format check, disposable email filter)
- No spam - don't send emails yet (Phase 2 feature)

#### 4. Persistent Rate Limiting
- Move from in-memory Map to Replit DB storage
- Survives server restarts (critical for Replit deployments)
- IP + email-based tracking (more accurate than IP alone)
- Can't be bypassed by clearing cookies

#### 5. Basic Analytics Dashboard (Internal Only)
- Admin route: `/api/analytics` (not public)
- Track: Total leads, messages sent, popular categories
- Export: CSV of leads for Optimi sales team

### Nice-to-Have (Phase 2 - Week 2-3):

#### 6. Cross-Device Conversation Sync
- Users can access their prompts on any device
- Email-based magic link authentication (no password)
- Sync conversation history across devices
- "My Saved Prompts" library view

#### 7. Email Delivery System
- Send prompt to user's email immediately upon capture
- Professional branded email template (Optimi design)
- CTA in email: "Want help implementing this? Talk to our team"
- Uses SendGrid or Resend API

#### 8. Enhanced Lead Tracking
- Track which features each lead used
- Behavioral scoring (power user vs casual visitor)
- Segmentation tags for sales follow-up
- Integrates with Optimi CRM (if available)

### Out of Scope (Not Building):

- ❌ User accounts with passwords (too much friction)
- ❌ Social login (Google, LinkedIn) - too complex for MVP
- ❌ Team collaboration features (multiplayer editing)
- ❌ Payment processing (lead magnet is free)
- ❌ AI model customization (out of scope for lead gen)
- ❌ Mobile native app (web only)

---

## User Flow

### New User Journey (Post-Database):

```
1. User lands on homepage
   → Sees compelling value proposition

2. User completes intake flow
   → Selects AI tool (ChatGPT, Claude, etc.)
   → Chooses prompt type (Prompt Architect, Custom Instructions, etc.)
   → Enters initial thoughts (20-500 chars)

3. AI generates custom prompt
   → User sees high-quality, personalized output
   → User feels value has been delivered ✅

4. **[NEW]** Email capture modal appears
   → "Want to save this prompt and create more?"
   → Email input + optional company field
   → Clear benefit: "Access on any device, never lose your work"

5. User provides email (or skips)
   → If yes: Prompt saved to their account, can resume anytime
   → If no: Can still use 3 free messages, but prompts not saved

6. User explores other categories
   → Custom Instructions, Projects, Gems, etc.
   → Each category has 3 free messages (or unlimited if email provided)

7. Upgrade prompt (later phase)
   → "Want unlimited prompts + AI consulting? Talk to Optimi team"
   → CTA to schedule consultation
```

### Returning User Journey:

```
1. User returns to homepage
   → Recognizes their email from cookie/localStorage

2. **[NEW]** "Welcome back!" message
   → "Continue where you left off"
   → Shows last prompt created

3. User resumes conversation
   → All previous prompts accessible
   → Cross-device sync (if on different device)

4. Increased engagement
   → Users with emails use 5x more features
   → Higher conversion to Optimi services
```

---

## Lead Capture Opportunities

### Primary Capture Point: Post-Intake Modal (Highest Priority)

**When:** Immediately after user sees their first generated prompt
**Why Then:** User has received value, emotional peak moment, primed to give email
**Copy:**
```
✨ Your Custom Prompt is Ready!

Want to save this and create unlimited prompts?

[Email input field]
[Optional: Company name]

[Save My Prompts] [Maybe Later]

✓ Access on any device
✓ Never lose your work
✓ No spam, ever
```

**Design:**
- Modal overlay (can't miss it)
- Optimi brand colors (optimi-blue accent)
- Clear value proposition above the fold
- Low-pressure ("Maybe Later" option visible)
- Mobile-optimized (large touch targets)

### Secondary Capture Point: 3-Message Limit

**When:** User hits 3rd message in a category (if they skipped initial capture)
**Why Then:** They're engaged, want to continue, will trade email for access
**Copy:**
```
🎯 You've used your 3 free messages in this category.

Want unlimited access? Just enter your email:

[Email input field]

[Continue with Unlimited Access]

We'll save all your prompts across devices.
```

### Tertiary Capture Point: Export Feature (Phase 2)

**When:** User tries to export a prompt to PDF/email
**Why Then:** Clear transaction - email delivery requires email address
**Copy:**
```
📧 Email this prompt to yourself

[Email input field]

[Send to My Email]

We'll also save it to your Prompt Library for easy access.
```

---

## UI/UX Considerations

### Design Principles:
1. **Value First:** Always show the generated prompt before asking for email
2. **Low Pressure:** "Maybe Later" option always visible, never force it
3. **Clear Benefit:** Explain exactly what they get (save, sync, unlimited)
4. **Professional:** Optimi brand colors, clean design, no spam vibes
5. **Mobile-First:** 60% of users are mobile, optimize for touch

### Component Specifications:

#### Email Capture Modal Component
```
Location: src/components/lead-capture/email-capture-modal.tsx

Layout:
- Modal overlay (50% opacity dark background)
- Centered card (max-width 500px)
- Optimi-blue header accent
- Email input (large, auto-focused)
- Optional company input (below email, smaller)
- Two buttons: Primary "Save" + Secondary "Maybe Later"

Mobile:
- Full-width on screens < 640px
- Bottom sheet style (slides up from bottom)
- Large touch targets (48px minimum)
- Keyboard pushes content up smoothly

Accessibility:
- Focus trap (can't tab outside modal)
- Escape key closes modal
- Screen reader friendly labels
- Keyboard navigation works perfectly
```

#### Welcome Back Banner Component
```
Location: src/components/lead-capture/welcome-back-banner.tsx

Layout:
- Top banner (not modal - less intrusive)
- "Welcome back, [name from email]!"
- Shows last prompt created
- CTA: "Continue" or "Start New"

Dismissible:
- X button to close
- Remembers dismissal (don't show again this session)
```

### Brand Alignment:

**Colors:**
- Primary CTA button: `bg-optimi-blue hover:bg-optimi-primary`
- Accent elements: `text-optimi-green` (success states)
- Secondary buttons: `border-optimi-gray text-optimi-gray`

**Tone:**
- Professional but friendly (not corporate stiff)
- Helpful educator, not pushy salesperson
- "We're here to help you succeed with AI"

**Copywriting:**
- Active voice ("Save your prompts" not "Your prompts will be saved")
- Benefit-focused ("Access anywhere" not "We store in database")
- No jargon (no "sync", "persist", "cloud storage" - use "save" and "access")

---

## Optimi Brand Alignment

### How This Feature Positions Optimi:

1. **Professional & Trustworthy**
   - Secure database, privacy-focused (hashed emails)
   - Professional email capture (not sketchy popup ads)
   - Positions Optimi as serious AI experts, not hobbyists

2. **User-Centric Philosophy**
   - Give value first (show prompt before asking email)
   - Respect user choice ("Maybe Later" always available)
   - Demonstrates Optimi cares about user success

3. **Technical Excellence**
   - Cross-device sync shows technical sophistication
   - Smooth, polished UX reflects quality consulting services
   - Attention to detail (email validation, security) = quality work

4. **Lead Nurturing Funnel**
   - Step 1: Free value (generate prompts)
   - Step 2: Light commitment (provide email)
   - Step 3: Increased engagement (use more features)
   - Step 4: Sales conversation (upgrade to consulting)

### Impression This Leaves:

**User Takeaway:**
> "Prompt Architect is legitimately helpful. Optimi knows their stuff. If I need professional AI consulting, these are the people to call."

**Sales Team Benefit:**
- Warm leads (already engaged with our tool)
- Qualified (used professional prompt tool, not random traffic)
- Context (we know which AI tools and prompt types they care about)
- Segmented (marketing folks, business owners, consultants)

---

## Privacy & Security Considerations

### User Data Protection:
- **Email storage:** Plain text in database (needed for contact), hashed for lookups
- **No passwords:** Magic link authentication only (Phase 2)
- **No PII required:** Email only, company name optional
- **Clear privacy policy:** "We'll never sell your email" message on modal
- **Unsubscribe:** Easy opt-out (Phase 2, when we send emails)

### GDPR/Privacy Compliance:
- Store only what we need (email, timestamp, usage data)
- Allow data export (user can request their data)
- Allow data deletion (user can request deletion)
- Clear consent ("By providing email, you agree to...")

### Security:
- Server-side validation (can't bypass with DevTools)
- Email format validation + disposable email filter
- Rate limiting (prevent spam submissions)
- No sensitive data in localStorage (just session tokens)

---

## Implementation Priority

### Week 1 (Critical Path):
1. **Day 1-2:** Replit DB setup + schema design
2. **Day 3:** Email capture modal component
3. **Day 4:** Database storage + validation
4. **Day 5:** Persistent rate limiting migration
5. **Day 6:** Analytics endpoint + testing
6. **Day 7:** QA, bug fixes, deploy

### Week 2-3 (Enhancements):
7. Email delivery system (SendGrid integration)
8. Cross-device sync (magic link auth)
9. "My Saved Prompts" library view
10. Enhanced analytics dashboard

---

## Open Questions (To Resolve Before Phase 2)

1. **Email sending:** Which service? (SendGrid vs Resend vs Mailgun)
2. **CRM integration:** Does Optimi have a CRM we should integrate with?
3. **Sales handoff:** How do we route qualified leads to sales team?
4. **Pricing strategy:** When/how do we introduce paid tier? (Future consideration)
5. **Data retention:** How long do we keep leads who never return? (6 months? 1 year?)

---

## Appendix: Competitive Analysis

**How Others Capture Leads:**

| Tool | Approach | Pros | Cons |
|------|----------|------|------|
| **Grammarly** | Email required upfront | High conversion | High friction, many bounces |
| **Canva** | Social login (Google) | Easy signup | Privacy concerns, corporate blockers |
| **Notion** | Free tier, email optional | Low friction | Slower lead capture |
| **HubSpot** | Free tools + email gates | Value-first approach | Can feel transactional |

**Our Approach (Best of All):**
- ✅ Value first (free prompts before email ask)
- ✅ Low friction (email only, no password)
- ✅ Clear benefit (save & sync prompts)
- ✅ Professional positioning (not sketchy)

---

## Success Definition

**This feature is successful if:**

1. **30%+ of users provide email** after seeing their first prompt
2. **50%+ of leads are qualified** (company email, professional use case)
3. **5%+ of leads convert** to Optimi sales conversations within 3 months
4. **Zero user complaints** about spam or privacy concerns
5. **Database costs < $10/month** (within Replit free tier limits)

**This feature fails if:**

- Conversion rate < 15% (modal is too aggressive or not valuable enough)
- Lead quality < 25% (attracting wrong audience)
- User complaints about spam (trust damage to Optimi brand)
- Database exceeds budget (poor technical planning)

---

**Next Step:** Solution Architect creates Technical Specification based on this PRD.

**Approval:** Requires sign-off from Optimi stakeholders before proceeding to implementation.
