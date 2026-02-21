---
name: app-store-screenshots
description: Generate App Store screenshot sets that follow the 80% rule and Apple's requirements
---

# App Store Screenshots Skill

Create screenshot sets that convert browsers into downloaders. Screenshots are the #1 factor in App Store conversion after the icon.

## Apple Requirements

### Required Device Sizes
| Device | Resolution | Required? |
|--------|-----------|-----------|
| iPhone 6.7" (15 Pro Max) | 1290 × 2796 | ✅ Yes |
| iPhone 6.5" (11 Pro Max) | 1242 × 2688 | ✅ Yes |
| iPhone 5.5" (8 Plus) | 1242 × 2208 | ✅ Yes |
| iPad Pro 12.9" (6th gen) | 2048 × 2732 | If iPad app |
| iPad Pro 12.9" (2nd gen) | 2048 × 2732 | If iPad app |

### Rules
- Minimum 1, maximum 10 screenshots per localization
- First 3 are visible without scrolling — make them count
- Can include text overlays and device frames
- Video previews: 15-30 seconds, same device sizes

## The 80% Rule
**The first 2 screenshots provide 80% of the conversion impact.**

### Screenshot 1: The Hero
- Show the app's #1 value proposition
- Big, bold headline text overlay
- The "money shot" — what makes someone download THIS app
- Example: "Track your fitness goals in 10 seconds"

### Screenshot 2: The Proof
- Show the core feature in action
- Real-looking data, not placeholder text
- Demonstrate the "aha moment"
- Example: The beautiful dashboard with actual metrics

### Screenshots 3-5: Feature Tour
- One feature per screenshot
- Benefits, not features ("Never miss a workout" vs "Notification system")
- Progressive disclosure — build the story

### Screenshots 6-10 (Optional): Social Proof & Details
- Settings/customization options
- Widget on home screen
- Apple Watch companion
- Dark mode variant

## Design Principles

### Text Overlays
- **Font**: Bold sans-serif, 48-72pt equivalent
- **Position**: Top or bottom 30% of frame (don't cover the app UI)
- **Colors**: Match brand palette — accent color for emphasis
- **Length**: 5-8 words max per screenshot
- **Hierarchy**: One headline, one optional subline

### Device Frames
- Use official Apple device frames (iPhone 15 Pro)
- Consistent frame style across all screenshots
- Can show without frames for more screen real estate

### Background
- Subtle gradient matching brand palette
- NOT pure white (looks cheap)
- NOT busy patterns (distracts from app)
- Consistent across all screenshots

### Layout Template
```
┌─────────────────────┐
│                     │
│   HEADLINE TEXT     │  ← Bold, 5-8 words
│   Subtext optional  │
│                     │
│  ┌───────────────┐  │
│  │               │  │
│  │   APP SCREEN  │  │  ← Real app UI with real data
│  │               │  │
│  │               │  │
│  │               │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

## Generation with AI

### DALL-E Prompt for Screenshots
```
Create an App Store screenshot for "[App Name]", a [category] app.

LAYOUT:
- [resolution] portrait orientation
- Subtle [brand color] gradient background
- Bold white headline at top: "[benefit statement]"
- iPhone 15 Pro frame in center showing the app's [screen name]

APP UI INSIDE THE PHONE:
- [describe the actual screen: dashboard, list, chart, etc.]
- Use realistic mock data, NOT "Lorem ipsum"
- Match brand colors: bg [hex], accent [hex], text [hex]

QUALITY: Apple marketing material quality, clean rendering
```

## Screenshot Content by App Category

| Category | Screenshot 1 (Hero) | Screenshot 2 (Proof) | Screenshot 3+ |
|----------|--------------------|--------------------|----------------|
| Fitness | "Your personal trainer" | Workout dashboard | Progress charts, social features |
| Finance | "Money made simple" | Account overview | Budgets, goals, insights |
| Productivity | "Get more done" | Task list in action | Calendar, widgets, notifications |
| Social | "Connect your way" | Feed/messages | Profiles, discovery, stories |
| Education | "Learn anything" | Course/lesson view | Progress, certificates, community |

## Localization
For each target market, create localized screenshots:
- Translate text overlays (don't just swap text — adapt messaging)
- Use culturally appropriate imagery and data
- Top markets: EN, ES, PT, FR, DE, JA, KO, ZH
