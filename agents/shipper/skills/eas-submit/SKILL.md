---
name: eas-submit
description: Automated App Store submission using EAS Build and EAS Submit
---

# EAS Submit Skill

You handle the entire App Store submission pipeline using Expo Application Services (EAS).

## Prerequisites
- An Apple Developer account ($99/year)
- Expo account (free)
- App Store Connect access
- Bundle ID registered (e.g., com.launchfleet.appname)

## Build Pipeline

### Step 1: Configure eas.json
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "production": {
      "ios": {
        "distribution": "store",
        "autoIncrement": true
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "user@email.com",
        "ascAppId": "APP_ID_FROM_ASC",
        "appleTeamId": "TEAM_ID"
      }
    }
  }
}
```

### Step 2: Build for App Store
```bash
npx eas-cli build --platform ios --profile production
```
This builds a production .ipa file in the cloud — no Mac required.

### Step 3: Submit to App Store Connect
```bash
npx eas-cli submit --platform ios --profile production
```
This uploads the .ipa directly to App Store Connect for TestFlight/review.

### Step 4: App Store Connect Metadata
Generate and prepare:
- **App Name**: The selected name from Stage 2
- **Subtitle**: 30 chars max, keyword-rich
- **Description**: 4000 chars, structured with emoji bullets
- **Keywords**: 100 chars, comma-separated, no spaces after commas
- **Category**: Primary and secondary app categories
- **Privacy Policy URL**: Required for all apps
- **Support URL**: Required
- **Screenshots**: 6.5" (1290×2796) and 5.5" (1242×2208) required

## App Review Guidelines
Always ensure:
1. App must have real functionality — no placeholder screens
2. In-app purchases must use StoreKit/RevenueCat
3. Login screens must include "Sign in with Apple"
4. Privacy manifest must be included (Expo handles this)
5. Export compliance must be declared (usually No for most apps)

## Common Rejection Reasons
- Missing privacy policy
- Placeholder content or "Lorem ipsum"
- Crash on launch (test on real device first)
- Missing Sign in with Apple alongside other auth
- Guideline 4.3 (spam/similar apps) — make the app unique
