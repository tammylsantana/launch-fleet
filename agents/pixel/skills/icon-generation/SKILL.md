---
name: app-icon-mastery
description: Professional App Store icon generation with AI prompts, validation, and export workflows
---

# App Store Icon Mastery Skill

Generate App Store-quality icons that pass Apple Review and convert downloads.

## Apple Icon Requirements
- **1024×1024px** — exact size, no exceptions
- **No transparency** — must have opaque background
- **No rounded corners** — iOS applies the superellipse mask automatically
- **sRGB color space** — not P3 or CMYK
- **PNG format** — no JPEG, no SVG
- **No alpha channel** — fully opaque

## The 16px Test
Every icon MUST pass the "favicon test":
1. Shrink the icon to 16×16px
2. Is the symbol still recognizable?
3. Can you tell what app this is?
4. If NO → simplify until yes

## What Makes Top Icons Work

### DO:
- **One symbol, one concept** — Instagram (camera), Spotify (sound waves), Headspace (dot)
- **Bold, simple shapes** — readable at any size
- **Background gradient** — subtle depth, not flat
- **Unique silhouette** — recognizable in grayscale
- **Category-appropriate style** — games can be playful, finance must be trustworthy

### DON'T:
- ❌ Text or letters in the icon (Apple explicitly discourages)
- ❌ Photos or screenshots as icon backgrounds
- ❌ Too many colors (3-4 max)
- ❌ Thin lines that disappear at small sizes
- ❌ Complex scenes with multiple objects
- ❌ Border/stroke around the icon edge

## AI Prompt Structure for DALL-E 3
```
Design a premium iOS app icon for "[App Name]", a [category] app.

STYLE: [palette-specific style from template]
SYMBOL: [single centered icon/mark]
BACKGROUND: [gradient direction and colors]

RULES:
- 1024x1024 square, Apple superellipse corners
- NO text, NO letters, NO words
- Single centered symbol, not complex
- Clear at 60x60px (home screen thumbnail)
- Subtle depth (light/shadow), not flat or overly 3D
- Must look like a real top-10 App Store icon
```

## Validation Loop
After generating, check:
1. ✅ No text visible anywhere?
2. ✅ Passes 16px favicon test?
3. ✅ Works on both light and dark wallpapers?
4. ✅ Unique — doesn't look like an existing popular app?
5. ✅ Colors match the brand palette?
6. ❌ If any fail → regenerate with tighter constraints

## Export Sizes (iOS)
| Size | Use |
|------|-----|
| 1024×1024 | App Store listing |
| 180×180 | iPhone (60pt @3x) |
| 120×120 | iPhone (60pt @2x) |
| 167×167 | iPad Pro (83.5pt @2x) |
| 152×152 | iPad (76pt @2x) |
| 87×87 | Spotlight iPhone (@3x) |
| 80×80 | Spotlight iPad (@2x) |
| 58×58 | Settings iPhone (@2x) |
| 29×29 | Settings iPad (@1x) |

## ClawHub Source
- Based on: `logo` by @ivangdavila (136↓) + `icons` by @ivangdavila (178↓)
- Install: `clawhub install logo` + `clawhub install icons`
