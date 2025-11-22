# Optimi Logo Usage Guide

## Logo Files Available

You now have 4 logo variations in `/public/`:

### 1. `logo-icon.svg` (64×64)
**Full-color gradient circle with animated dots**
- Use: Favicon, app icons, loading states, compact spaces
- Best on: White or light backgrounds
- Minimum size: 32px

### 2. `logo-full.svg` (200×80)
**Gradient circle + "optimi" text**
- Use: Primary header, hero sections, footer
- Best on: White backgrounds
- Minimum size: 120px wide

### 3. `logo-icon-simplified.svg` (64×64)
**Single-color navy circles (fallback)**
- Use: Print, low-bandwidth contexts, accessibility mode
- Best on: Any light background
- Minimum size: 24px

### 4. `logo-full-white.svg` (200×80)
**White version for dark backgrounds**
- Use: Dark headers, footers with `bg-optimi-primary`
- Best on: Navy (#283791) or dark backgrounds
- Minimum size: 120px wide

---

## Quick Implementation Examples

### Homepage Header (Immediate)
```tsx
// src/app/page.tsx - Replace Header component (line 182-196)

function Header() {
  return (
    <header className="text-center mb-12">
      {/* Logo + Title */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <img
          src="/logo-icon.svg"
          alt="Optimi"
          className="w-14 h-14"
        />
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          Prompt Architect
        </h1>
      </div>

      {/* Subtitle with "by Optimi" */}
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-4 flex items-center justify-center gap-2">
        <span>Powered by</span>
        <img src="/logo-full.svg" alt="Optimi" className="h-4" />
      </p>

      {/* Existing description with colorized AI names */}
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Build better AI prompts with expert guidance. Create personalized instructions for{' '}
        <span className="font-semibold bg-gradient-to-r from-optimi-blue to-optimi-green bg-clip-text text-transparent">
          ChatGPT
        </span>,{' '}
        <span className="font-semibold text-optimi-green">Claude</span>,{' '}
        <span className="font-semibold text-optimi-yellow">Gemini</span>, or{' '}
        <span className="font-semibold text-optimi-primary">Copilot</span>.
      </p>
    </header>
  )
}
```

### Gradient Button (Primary CTA)
```tsx
// src/app/page.tsx - Line 82-88
<button
  onClick={() => setShowChat(true)}
  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-optimi-blue via-optimi-green to-optimi-green text-white font-semibold hover:shadow-xl hover:shadow-optimi-green/30 hover:scale-105 transition-all duration-300"
>
  <Sparkles className="w-5 h-5" />
  Continue to Chat
  <ArrowRight className="w-5 h-5" />
</button>
```

### Loading State with Logo
```tsx
// Create new component: src/components/ui/loading-spinner.tsx

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <img
          src="/logo-icon.svg"
          alt="Loading..."
          className="w-16 h-16 animate-pulse"
        />
        <div className="absolute -inset-2 bg-gradient-to-r from-optimi-blue via-optimi-green to-optimi-yellow rounded-full opacity-20 blur-xl animate-pulse" />
      </div>
    </div>
  )
}
```

### Favicon Setup
```tsx
// src/app/layout.tsx - Add to metadata
export const metadata: Metadata = {
  title: 'Prompt Architect - Build Better AI Prompts',
  description: 'Optimize your custom instructions, projects, and threads with AI-powered assistance from Optimi.',
  icons: {
    icon: '/logo-icon-simplified.svg',
    apple: '/logo-icon.svg',
  },
}
```

---

## Color Palette (Tailwind Classes)

### Background Gradients
```tsx
// Add to tailwind.config.ts under extend.backgroundImage

backgroundImage: {
  'gradient-optimi': 'linear-gradient(135deg, #0078FF 0%, #00C896 50%, #FFDC00 100%)',
  'gradient-optimi-vertical': 'linear-gradient(180deg, #283791 0%, #0078FF 100%)',
  'gradient-optimi-subtle': 'linear-gradient(135deg, rgba(0,120,255,0.1) 0%, rgba(0,200,150,0.1) 50%, rgba(255,220,0,0.1) 100%)',
}
```

### Text Gradients
```tsx
// Gradient text effect
<h2 className="text-4xl font-bold bg-gradient-to-r from-optimi-blue via-optimi-green to-optimi-yellow bg-clip-text text-transparent">
  Your Heading
</h2>
```

### Button Styles
```css
/* Primary gradient button */
.btn-primary-gradient {
  @apply bg-gradient-to-r from-optimi-blue to-optimi-green text-white px-6 py-3 rounded-xl font-semibold;
  @apply hover:shadow-lg hover:shadow-optimi-green/30 transition-all duration-300;
}

/* Outlined gradient button */
.btn-outline-gradient {
  @apply bg-white text-optimi-primary border-2 border-transparent bg-clip-padding;
  background-image: linear-gradient(white, white), linear-gradient(135deg, #0078FF, #00C896);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
```

---

## Before/After Examples

### 1. Homepage Hero
**BEFORE:**
```tsx
<h1 className="text-5xl font-bold text-gray-900">
  Prompt Architect
</h1>
<p>...for <span className="text-optimi-primary">ChatGPT</span>...</p>
```

**AFTER:**
```tsx
<div className="flex items-center gap-4">
  <img src="/logo-icon.svg" alt="Optimi" className="w-14 h-14" />
  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-optimi-primary bg-clip-text text-transparent">
    Prompt Architect
  </h1>
</div>
<p>...for <span className="bg-gradient-to-r from-optimi-blue to-optimi-green bg-clip-text text-transparent font-semibold">ChatGPT</span>...</p>
```

### 2. Primary Button
**BEFORE:**
```tsx
<button className="bg-optimi-blue text-white px-8 py-3 rounded-xl">
  Continue to Chat
</button>
```

**AFTER:**
```tsx
<button className="bg-gradient-to-r from-optimi-blue to-optimi-green text-white px-8 py-3 rounded-xl hover:shadow-xl hover:shadow-optimi-green/30 transition-all">
  Continue to Chat
</button>
```

### 3. Success State
**BEFORE:**
```tsx
<div className="bg-optimi-green/10 rounded-full">
  <Sparkles className="text-optimi-green" />
</div>
```

**AFTER:**
```tsx
<div className="bg-gradient-to-br from-optimi-blue/20 via-optimi-green/20 to-optimi-yellow/20 rounded-full">
  <Sparkles className="text-optimi-green" />
</div>
```

---

## Logo Spacing & Sizing

### Minimum Clear Space
Always maintain clear space around logo equal to the height of the lowercase "o" in "optimi":

```
    [Clear Space]
[CS] [LOGO] [CS]
    [Clear Space]
```

### Responsive Sizing
```tsx
// Mobile
<img src="/logo-icon.svg" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />

// Desktop header
<img src="/logo-full.svg" className="h-8 md:h-10 lg:h-12" />
```

### Don't Scale Below These Sizes
- `logo-icon.svg`: 24px minimum
- `logo-full.svg`: 100px width minimum
- `logo-icon-simplified.svg`: 16px minimum (favicon use only)

---

## Advanced: Animated Logo (Optional)

### Pulsing Glow Effect
```tsx
<div className="relative inline-block">
  <img src="/logo-icon.svg" alt="Optimi" className="w-16 h-16 relative z-10" />
  <div className="absolute inset-0 bg-gradient-to-r from-optimi-blue via-optimi-green to-optimi-yellow rounded-full blur-2xl opacity-30 animate-pulse -z-10" />
</div>
```

### Rotating Gradient Border
```css
@keyframes rotate-gradient {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.logo-border-animated {
  position: relative;
}

.logo-border-animated::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #0078FF, #00C896, #FFDC00);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: rotate-gradient 3s linear infinite;
}
```

---

## Accessibility Notes

### Alt Text
- Icon only: `alt="Optimi"`
- Full logo: `alt="Optimi - Prompt Architect"`
- Loading states: `alt="Loading..."`
- Decorative: `alt=""` (with `aria-hidden="true"`)

### Color Contrast
- White text on gradient: ✅ Passes WCAG AA
- Navy text on white: ✅ Passes WCAG AAA
- Yellow text: ⚠️ Use only with dark backgrounds or as accents (not primary text)

### Focus Indicators
```tsx
<img
  src="/logo-icon.svg"
  alt="Optimi"
  className="focus:ring-4 focus:ring-optimi-primary/50 focus:outline-none rounded-full"
  tabIndex={0} // If clickable
/>
```

---

## Print & Export

### For Print Materials
Use `logo-icon-simplified.svg` or export logo as CMYK:
- **optimi-primary:** CMYK(100, 90, 5, 0)
- **optimi-blue:** CMYK(80, 55, 0, 0)
- **optimi-green:** CMYK(70, 0, 55, 0)
- **optimi-yellow:** CMYK(0, 10, 100, 0)

### Social Media Previews
```tsx
// Add to layout.tsx metadata
openGraph: {
  title: 'Prompt Architect',
  description: 'Build better AI prompts with expert guidance from Optimi',
  images: ['/og-image.png'], // Create 1200×630 PNG with logo
}
```

---

## Quick Checklist

- [ ] Add logo to homepage header
- [ ] Update favicon to logo-icon-simplified.svg
- [ ] Add gradient to primary CTA buttons
- [ ] Colorize AI tool names (ChatGPT, Claude, Gemini, Copilot)
- [ ] Replace solid color backgrounds with gradients (chat headers)
- [ ] Add gradient to success states
- [ ] Create loading component with logo
- [ ] Update footer with logo-full-white.svg (when footer exists)
- [ ] Test all logo sizes at different screen widths
- [ ] Verify color contrast with accessibility tools

---

**Need Help?**
See `DESIGN_REVIEW.md` for comprehensive branding strategy and implementation details.
