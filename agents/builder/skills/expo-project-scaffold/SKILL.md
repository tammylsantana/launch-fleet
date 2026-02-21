---
name: expo-project-scaffold
description: Generate a complete Expo Router project structure from scratch
---

# Expo Project Scaffold Skill

Generate a complete, runnable Expo project for any app idea. Every file must compile and run without manual fixes.

## Project Structure

```
app/
├── _layout.tsx          # Root layout with tab navigator
├── (tabs)/
│   ├── _layout.tsx      # Tab bar configuration with icons + haptics
│   ├── index.tsx        # Home / main screen
│   ├── explore.tsx      # Feature discovery / search
│   └── profile.tsx      # User profile + settings
├── onboarding/
│   ├── _layout.tsx      # Stack layout for onboarding flow
│   ├── welcome.tsx      # Screen 1: Value proposition
│   ├── features.tsx     # Screen 2: Key features preview
│   └── get-started.tsx  # Screen 3: CTA to sign up or continue
assets/
├── fonts/               # Custom Google Fonts via expo-google-fonts
├── images/              # App images and illustrations
constants/
├── theme.ts             # Brand colors, typography, spacing (from Pixel's palette)
├── strings.ts           # All user-facing strings (i18n ready)
components/
├── ui/
│   ├── Button.tsx       # Branded button with haptic feedback
│   ├── Card.tsx         # Glass-effect content card
│   ├── Header.tsx       # Screen header with brand styling
│   └── Input.tsx        # Styled text input
├── widgets/
│   └── HomeWidget.tsx   # iOS WidgetKit widget component
hooks/
├── useTheme.ts          # Theme hook returning brand colors
├── useHaptics.ts        # Haptic feedback wrapper
stores/
├── appStore.ts          # Zustand store for app state
app.json                 # Expo config with bundle ID, permissions, plugins
package.json             # Dependencies
tsconfig.json            # TypeScript config
```

## Required Dependencies

```json
{
  "expo": "~52.0.0",
  "expo-router": "~4.0.0",
  "expo-blur": "~14.0.0",
  "expo-haptics": "~14.0.0",
  "expo-linear-gradient": "~14.0.0",
  "expo-font": "~13.0.0",
  "expo-secure-store": "~14.0.0",
  "expo-notifications": "~0.29.0",
  "expo-symbols": "~0.2.0",
  "react-native-reanimated": "~3.16.0",
  "@react-native-async-storage/async-storage": "2.1.0",
  "@shopify/flash-list": "1.7.2",
  "zustand": "^5.0.0",
  "@gorhom/bottom-sheet": "^5.0.0"
}
```

## app.json Template

```json
{
  "expo": {
    "name": "{APP_NAME}",
    "slug": "{APP_SLUG}",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "{APP_SLUG}",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.launchfleet.{APP_SLUG}",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-haptics",
      "expo-secure-store",
      "expo-notifications"
    ]
  }
}
```

## Theme File Template

```typescript
// constants/theme.ts — Generated from Pixel's brand template
export const theme = {
  colors: {
    bg: '{BRAND_BG}',
    surface: '{BRAND_SURFACE}',
    accent: '{BRAND_ACCENT}',
    text: '{BRAND_TEXT}',
    textSecondary: '{BRAND_TEXT}99',
    separator: '{BRAND_TEXT}1A',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
  fonts: {
    headline: '{BRAND_HEADLINE_FONT}',
    body: '{BRAND_BODY_FONT}',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 },
}
```
