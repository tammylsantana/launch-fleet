---
name: app-store-screenshots
description: Professional App Store screenshots via screenshots.pro API, AppScreens, and @ivangdavila's automation workflow
---

# App Store Screenshots Skill

Generate professional App Store screenshot sets using screenshots.pro API and AppScreens.

## Pro Tools Available

### screenshots.pro (API)
- **API endpoint**: `https://api.screenshots.pro/v1/render`
- **Auth**: API key via `SCREENSHOTS_PRO_API_KEY` env var
- **Capabilities**: Device frames, text overlays, backgrounds, batch rendering
- **Output**: PNG at any required App Store resolution

### AppScreens (Web Tool)
- **URL**: https://appscreens.com
- **Capabilities**: Template editor, drag-and-drop, localization, batch export
- **Use for**: Quick iterations and visual template design

## Apple Screenshot Requirements

### Required Device Sizes
| Device | Resolution | Required |
|--------|-----------|----------|
| iPhone 6.7" (15 Pro Max) | 1290 × 2796 | ✅ |
| iPhone 6.5" (11 Pro Max) | 1242 × 2688 | ✅ |
| iPhone 5.5" (8 Plus) | 1242 × 2208 | ✅ |
| iPad Pro 12.9" (6th gen) | 2048 × 2732 | If iPad |

### Format Rules
- PNG or JPEG, sRGB or P3 color space
- Under 500KB per image
- No transparency
- 1-10 screenshots per localization

### Safe Zones (Apple UI)
- **Top 44px**: Status bar — avoid placing content here
- **Bottom 34px**: Home indicator — keep clear
- **Corners**: Rounded clip region — no critical content

## The 80% Rule
First 2 screenshots = 80% of conversion impact.

### Screenshot 1 (Hero)
- App's #1 value proposition
- Bold headline, 5-8 words max
- The "money shot" that makes someone download

### Screenshot 2 (Proof)
- Core feature in action with real-looking data
- The "aha moment" — demonstrate value

### Screenshots 3-5 (Feature Tour)
- One feature per screenshot
- Benefits over features ("Never miss a workout" vs "Notifications")

### Screenshots 6-10 (Optional)
- Widget on home screen, Dark mode, Apple Watch, Settings

## Device Frame Styles
| Style | Use When |
|-------|----------|
| Modern iPhone | Professional/business apps |
| Frameless | Clean, minimal aesthetic |
| Floating Angle | Dynamic marketing feel |
| Full Bleed | Maximum screen real estate |

## Text Overlay Rules
- **Headlines**: Bold sans-serif, 48-72pt
- **Position**: Top or bottom 30% — don't cover app UI
- **Length**: 5-8 words max
- **Thumbnail test**: Must be readable at search result size
- **One message per screenshot**: Don't overload

## 7-Phase Automation Workflow (@ivangdavila)

### Phase 1: Project Setup
Create `config.md` with brand colors, fonts, and style preferences.

### Phase 2: Raw Capture
- Use iPhone 15 Pro Max simulator (highest res)
- Clean status bar (9:41, full signal, full battery)
- Capture each key screen with realistic data

### Phase 3: Size Generation
Scale raw captures to all required store dimensions:
```
ios/6.7/en/01-hero.png    (1290×2796)
ios/6.5/en/01-hero.png    (1242×2688)
ios/5.5/en/01-hero.png    (1242×2208)
```

### Phase 4: Visual Polish
- Apply device frames and background gradients
- Add text overlays with brand fonts
- Use screenshots.pro API for batch rendering

### Phase 5: Vision Quality Check
- Verify text readability at thumbnail size
- Check visual consistency across the set
- Confirm safe zones are respected

### Phase 6: User Review
Present full set for approval. Handle iterative changes.

### Phase 7: Export & Delivery
Organize by `store/device/language/`:
```
ios/6.7/en/01-hero.png
ios/6.7/en/02-feature.png
ios/6.7/es/01-hero.png
ios/6.7/es/02-feature.png
```

## screenshots.pro API Usage
```javascript
const response = await fetch('https://api.screenshots.pro/v1/render', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.SCREENSHOTS_PRO_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    template: 'iphone-15-pro',
    screenshot: screenshotUrl,
    title: 'Track Your Goals',
    subtitle: 'AI-powered fitness companion',
    background: { type: 'gradient', colors: ['#1a1a2e', '#16213e'] },
    device: { frame: 'modern', shadow: true },
    output: { width: 1290, height: 2796, format: 'png' },
  }),
})
const { url } = await response.json()
```

## Localization
- Top markets: EN, ES, PT, FR, DE, JA, KO, ZH
- Don't just translate — adapt messaging for each culture
- Test text length (German expands ~30%, Japanese compresses)

## ClawHub Source
- Skill: `screenshots` by @ivangdavila
- Install: `clawhub install screenshots`
- Files: SKILL.md + specs.md + templates.md + text-style.md
