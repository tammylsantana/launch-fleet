---
name: icon-generation
description: Generate app icons using AI image generation with detailed prompts
---

# Icon Generation Skill

Create production-quality app icons using OpenAI DALL-E 3.

## Icon Prompt Template
When generating an icon, use this prompt structure:

"A mobile app icon for [app name], a [category] app. The icon should be [style: flat/gradient/3D/minimalist]. Use [primary color hex] as the main color with [secondary color hex] as accent. The icon features [symbol/shape description]. Clean, modern design suitable for the Apple App Store. Square format with rounded corners. No text in the icon. High contrast, professional quality."

## Style Guidelines by Category
- **Health & Fitness**: Clean, calming colors. Heart, activity, or nature symbols.
- **Productivity**: Sharp geometric shapes. Blue, teal, or monochrome.
- **Social**: Warm, inviting colors. Speech bubbles, people, or connection symbols.
- **Education**: Bright, energetic colors. Books, lightbulbs, or brain symbols.
- **Finance**: Trust-building colors (blue, green). Shield, chart, or coin symbols.
- **Entertainment**: Vibrant, dynamic colors. Play buttons, stars, or media symbols.

## Technical Requirements
- Generate at 1024x1024 minimum
- No text overlays (Apple rejects icons with text that is unreadable at small sizes)
- Must look good at 29x29 and 1024x1024
- No photographs — use illustrations, shapes, or abstract designs
- Avoid trademarked symbols or recognizable brand imagery
