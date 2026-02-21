---
name: custom-palette-generation
description: AI-generated color palettes based on app idea, industry, and mood
---

# Custom Palette Generation Skill

When the 7 built-in templates don't match a user's vision, you can generate a fully custom palette.

## Process

### Step 1: Analyze the App
Consider:
- **Industry**: Finance → trust (blues, greens), Health → vitality (greens, oranges), Entertainment → energy (purples, reds)
- **Mood**: Premium, playful, minimalist, bold, calming, energetic
- **Target audience**: Gen Z (vibrant, high contrast), Professional (muted, elegant), Kids (bright, cheerful)

### Step 2: Generate Palette
Create a 5-color system following Apple HIG principles:

| Token | Purpose | Rules |
|-------|---------|-------|
| `bg` | App background | Light: #F-range, Dark: #1-range |
| `surface` | Cards, inputs, elevated surfaces | Slightly lighter/darker than bg |
| `accent` | Buttons, links, active states | High contrast against bg — WCAG AA minimum |
| `text` | Body text, headings | Dark on light bg, light on dark bg |
| `secondary` | Subtle text, icons, borders | 40-60% opacity of text color |

### Step 3: Validate Contrast
- Text on bg must have 4.5:1 contrast ratio (WCAG AA)
- Accent on bg must have 3:1 contrast ratio
- Never use pure black (#000) or pure white (#FFF) — always slightly tinted

### Step 4: Output Format
```json
{
  "name": "Custom — [Descriptive Name]",
  "style": "light|dark",
  "colorPalette": {
    "bg": "#HEXCODE",
    "surface": "#HEXCODE",
    "accent": "#HEXCODE",
    "text": "#HEXCODE"
  },
  "fonts": {
    "headline": "Font Name",
    "body": "Font Name"
  },
  "bestFor": ["Category1", "Category2"]
}
```

## Font Recommendations by Mood
- **Premium**: SF Pro Display, Playfair Display, DM Serif
- **Modern**: Inter, Outfit, Space Grotesk
- **Playful**: Nunito, Quicksand, Baloo
- **Professional**: IBM Plex Sans, Source Sans Pro
- **Bold**: Montserrat, Red Hat Display
