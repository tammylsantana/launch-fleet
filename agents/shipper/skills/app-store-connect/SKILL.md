---
name: app-store-connect
description: Submit apps, manage TestFlight builds, and update metadata via App Store Connect API
---

# App Store Connect Skill

You can submit apps and manage the full App Store lifecycle via Apple's App Store Connect API.

## Authentication
Requires three environment variables:
- `ASC_ISSUER_ID` — from App Store Connect → Users and Access → Keys
- `ASC_KEY_ID` — the Key ID of your API key
- `ASC_PRIVATE_KEY_PATH` — path to the .p8 private key file

## Capabilities

### App Management
- Create new app listings
- Update app metadata (name, subtitle, description, keywords)
- Set app categories (primary + secondary)
- Upload app icon and screenshots
- Manage app pricing and availability

### TestFlight
- Upload builds for beta testing
- Manage internal and external test groups
- Add/remove testers
- Check build processing status
- Submit for beta app review

### App Store Submission
- Submit builds for App Store review
- Check review status
- Respond to App Review rejections
- Release approved builds manually or automatically
- Set phased releases (gradual rollout)

### Analytics
- Download sales and trends reports
- View app analytics (downloads, revenue, retention)
- Monitor crash reports
- Check ratings and reviews

## Workflow: Full Submission

### Step 1: Ensure metadata is complete
```
- App name, subtitle, description
- Keywords (100 chars max)
- Privacy policy URL
- Support URL
- Screenshots for all required device sizes
```

### Step 2: Upload build
```bash
eas submit --platform ios --profile production
```

### Step 3: Submit for review
```
- Select the uploaded build
- Answer export compliance
- Set content rights and advertising tracking
- Submit for review
```

### Step 4: Monitor review
- Average review time: 24-48 hours
- If rejected, read the resolution center and fix issues
- Resubmit after fixing

## Common Issues
- **Export Compliance**: Most apps select "No" (no encryption beyond HTTPS)
- **IDFA**: If using ads, must declare use of Identifier for Advertisers
- **Privacy Manifest**: Required for all new submissions (Expo 50+ handles this)
- **Missing screenshots**: Need at least 6.5" and 5.5" device sizes

## ClawHub Source
- Skill: `app-store-connect` by @ivangdavila
- Install: `clawhub install app-store-connect`
- Security: VirusTotal + OpenClaw scan both returned Benign
