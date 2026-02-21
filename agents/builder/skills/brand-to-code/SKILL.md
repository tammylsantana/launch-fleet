---
name: brand-to-code
description: Translate Pixel's brand templates into React Native StyleSheet code
---

# Brand-to-Code Skill

Convert Pixel's brand template selection into production React Native code. The brand template object contains:

```json
{
  "name": "Arctic Minimal",
  "style": "Light",
  "colorPalette": { "bg": "#FFFFFF", "surface": "#F2F2F7", "accent": "#007AFF", "text": "#1D1D1F" },
  "fonts": { "headline": "SF Pro Display", "body": "SF Pro Text" },
  "bestFor": ["Productivity", "Developer Tools"]
}
```

## The 7 LaunchFleet Brand Templates

| ID | Name | Style | BG | Surface | Accent | Text | Fonts |
|----|------|-------|----|---------|--------|------|-------|
| minimal | Arctic Minimal | Light | #FFFFFF | #F2F2F7 | #007AFF | #1D1D1F | SF Pro Display / SF Pro Text |
| dark | Midnight Pro | Dark | #000000 | #1C1C1E | #0A84FF | #F5F5F7 | SF Pro Display / SF Pro Text |
| coral | Coral Rose | Light | #FFF5F5 | #FFE8E8 | #FF6B6B | #2D2D2D | Outfit / Inter |
| sunset | Sunset Glow | Light | #FFFBF0 | #FFF3E0 | #FF9500 | #3A2E1F | Playfair Display / Lora |
| emerald | Emerald Focus | Light | #F0FAF4 | #E3F2E8 | #34C759 | #1B3726 | Inter / Inter |
| purple-haze | Purple Haze | Dark | #1A1025 | #2D1B4E | #BF5AF2 | #F0E6FF | Outfit / Inter |
| kids | Playful Primary | Light | #FFFDE7 | #FFF9C4 | #FF6D00 | #1A237E | Fredoka One / Nunito |

## Color Mapping Rules

| Brand Key | React Native Usage |
|-----------|-------------------|
| `bg` | Screen `backgroundColor`, SafeAreaView background |
| `surface` | Card backgrounds, input backgrounds, grouped sections |
| `accent` | Primary buttons, links, active tab icons, switches, progress bars |
| `text` | All body text, headings, labels |
| `text` + 60% opacity | Secondary text, subtitles, timestamps |
| `accent` + 15% opacity | Tag backgrounds, subtle highlights, selected states |

## Font Integration

For custom fonts, use `expo-google-fonts`:

```typescript
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit'
```

For SF Pro (system font), use `Platform.select`:
```typescript
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto'
```

## Button Color Rules

| Button Type | Background | Text Color |
|-------------|-----------|------------|
| Primary | `accent` | `#FFFFFF` (or `bg` if dark accent) |
| Secondary | `accent` + 15% opacity | `accent` |
| Ghost | transparent | `accent` |
| Destructive | `#FF3B30` | `#FFFFFF` |

## StatusBar

| Brand Style | StatusBar barStyle |
|-------------|-------------------|
| Light | `dark-content` |
| Dark | `light-content` |

## Tab Bar

Use `expo-blur` BlurView for glass effect:
- Light themes: `tint="light"` `intensity={80}` background `rgba(255,255,255,0.72)`
- Dark themes: `tint="dark"` `intensity={80}` background `rgba(30,30,30,0.72)`
- Active tab icon: `accent` color
- Inactive tab icon: `text` at 40% opacity
