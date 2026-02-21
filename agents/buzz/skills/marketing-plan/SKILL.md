---
name: marketing-plan
description: Generate launch marketing plans with social content, hashtags, and growth strategy
---

# Marketing Plan Skill

You create comprehensive launch marketing plans for new apps.

## Phase 1: Pre-Launch (2 weeks before)

### Landing Page
- Generate a simple, beautiful landing page using your `landing-page-generation` skill
- Include email capture for waitlist
- Social proof section (even if just "Coming Soon to the App Store")

### Social Media Setup
1. Claim handles on all 6 platforms (Instagram, TikTok, X, YouTube, Facebook, Threads)
2. Set up profile with app icon, description, and link to landing page
3. Create consistent bio across all platforms

### Content Calendar
Generate 14 days of pre-launch content:
- Day 14-10: Teaser posts ("Something new is coming...")
- Day 9-5: Feature reveals (one feature per day with screenshot)
- Day 4-2: Behind-the-scenes (development process, founder story)
- Day 1: Launch day countdown

## Phase 2: Launch Day

### App Store Optimization
- Keywords research (use Shipper's ASO skill)
- A/B test app icon and screenshots
- Category selection strategy

### Social Content
For each post, generate:
- **Caption**: Engaging, emoji-rich, with clear CTA
- **Hashtags**: 15-30 relevant hashtags (mix of popular and niche)
- **Best posting time**: Based on target audience time zone

### Launch Templates
```
🚀 [App Name] is LIVE on the App Store!

[One-line description of what the app does]

✨ [Feature 1]
📱 [Feature 2]
🎯 [Feature 3]

Download now → [App Store Link]

#newapp #ios #appstore #[industry] #[category]
```

## Phase 3: Post-Launch (ongoing)

### Growth Tactics
1. **Product Hunt launch** — prepare a compelling product page
2. **Reddit communities** — find 5-10 relevant subreddits
3. **App review sites** — submit to AppAdvice, 148apps, AppStoreGames
4. **Influencer outreach** — find 10 micro-influencers in the app's niche
5. **Press kit** — app icon, screenshots, founder bio, one-pager

### Content Types
- Tutorial/how-to videos (TikTok, YouTube Shorts)
- User testimonials and reviews
- Feature comparison with competitors
- "Day in the life" using the app
- Tips and tricks content

## Output Format
Always deliver as a structured JSON:
```json
{
  "strategy": "Brief strategy summary",
  "preLaunch": [{ "day": 1, "platform": "instagram", "caption": "...", "hashtags": [...] }],
  "launchDay": { "caption": "...", "hashtags": [...], "platforms": [...] },
  "postLaunch": { "weeklyThemes": [...], "growthTactics": [...] }
}
```
