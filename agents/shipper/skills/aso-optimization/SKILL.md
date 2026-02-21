---
name: aso-optimization
description: App Store Optimization — keyword research, metadata, A/B testing, and conversion tactics
---

# ASO (App Store Optimization) Skill

Optimize app store listings for maximum visibility and downloads on both iOS App Store and Google Play.

## Metadata Limits

| Field | iOS (App Store) | Android (Google Play) |
|-------|----------------|----------------------|
| **Title** | 30 chars (front-load keywords) | 30 chars |
| **Subtitle / Short Desc** | 30 chars | 80 chars |
| **Long Description** | Not indexed (informational only) | 4000 chars (indexed, 2-3% keyword density) |
| **Keyword Field** | 100 chars (iOS only) | N/A (indexes all text + reviews) |

## iOS Keyword Rules
1. **Comma-separated, NO spaces after commas**: `fitness,workout,tracker,health`
2. **Never duplicate words** already in Title or Subtitle
3. **No plurals** — Apple matches both singular and plural
4. **Use all 100 characters** — every character counts
5. **Prioritize long-tail keywords** over high-volume head terms

## Screenshot Strategy (The 80% Rule)
- **First 2 screenshots = 80% of impression impact**
- Show **benefits** (outcomes), not just UI
- Use captions that describe value, not features
- Portrait orientation preferred (6.5" and 5.5" required)
- Include a video preview if possible (15-30 seconds)

## Keyword Research Process
1. **Competitor analysis**: What keywords do top 10 apps in your category rank for?
2. **Long-tail focus**: "meditation timer sleep" > "meditation"
3. **Seasonal alignment**: Update keywords for holidays and trends
4. **Local market research**: Don't translate — research local search patterns
5. **Update cadence**: Refresh keywords every 4-6 weeks

## A/B Testing
- Minimum **7 days** per test for statistical significance
- Test one variable at a time (icon, screenshots, description)
- Focus on conversion rate, not just impressions
- iOS: Use Product Page Optimization in App Store Connect
- Android: Use Store Listing Experiments in Google Play Console

## Conversion Optimization
- **App size under 100MB** to avoid WiFi-only download warnings
- **Ratings 4.0+** — below 4.0 significantly hurts conversion
- **Review management**: Respond to all 1-2 star reviews within 24 hours
- **Use `SKStoreReviewController`** for iOS review prompts (max 3 per year)
- **Localize** for top 10 markets: EN, ES, PT, FR, DE, JA, KO, ZH, IT, RU

## Google Play Specific
- Google indexes **first and last paragraphs** of long description most heavily
- Use keyword-rich short description (80 chars)
- Google also indexes reviews — encourage detailed reviews
- Feature graphic (1024×500) is critical for browse visibility

## ClawHub Source
- Skill: `aso` by @ivangdavila
- Install: `clawhub install aso`
- Security: Benign (instruction-only, 3.4 KB)
