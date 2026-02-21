import { NextRequest, NextResponse } from 'next/server'

/**
 * Palette-specific icon style guides.
 * Each template gets a tailored DALL-E prompt to produce icons that
 * match the visual language of its color scheme and target category.
 */
const ICON_STYLE_GUIDES: Record<string, { style: string; symbolHint: string }> = {
    minimal: {
        style: 'Ultra-clean, flat design with subtle linear gradient from white to #F2F2F7. Thin-line geometric symbol in #007AFF. Apple SF Symbols aesthetic. Plenty of negative space. Frosted glass effect. Light drop shadow. Think Notion, Things 3, or Apple Reminders icon style.',
        symbolHint: 'a minimal geometric shape like a rounded checkbox, grid, or abstract task symbol',
    },
    dark: {
        style: 'Bold dark mode icon with deep #1C1C1E to #000000 gradient background. Glowing orange (#FF9500) neon-style symbol with subtle outer glow. High contrast, cinematic feel. Think Spotify, Netflix, or Podcasts icon style. Premium dark glass finish.',
        symbolHint: 'a bold media symbol like a play button, waveform, or abstract entertainment shape',
    },
    coral: {
        style: 'Warm, inviting icon with a soft gradient from #FFE5E5 to #FFF0F0. Coral/rose (#E8445A) main symbol with subtle pink shadow. Rounded, friendly shapes. Think Airbnb, Pinterest, or Apple Music icon style. Soft, approachable, modern.',
        symbolHint: 'a heart, shopping bag, social bubble, or abstract connection shape',
    },
    sunset: {
        style: 'Warm wellness icon with cream-to-warm-white (#FFFAF7) gradient background. Main symbol in warm orange (#FF6B35) with subtle peach glow. Organic, rounded shapes suggesting health and calm. Think Headspace, Strava, or Apple Health icon style.',
        symbolHint: 'a sun, leaf, heartbeat, flame, or abstract wellness symbol',
    },
    emerald: {
        style: 'Premium fintech icon with deep dark green (#0D1F17 to #1B3A2D) gradient background. Bright green (#00C853) symbol with metallic sheen effect. Sharp, precise geometric shapes suggesting growth and money. Think Robinhood, Cash App, or Mint icon style.',
        symbolHint: 'an upward arrow, chart line, dollar sign, or abstract growth symbol',
    },
    'purple-haze': {
        style: 'Creative/AI icon with deep purple (#1A0F2E to #2D1B4E) gradient background. Vibrant purple (#A855F7) to magenta symbol with ethereal glow and sparkle effects. Futuristic, creative energy. Think Figma, Arc Browser, or GitHub Copilot icon style.',
        symbolHint: 'a magic wand, brain, sparkle, paintbrush, or abstract AI/creative symbol',
    },
    kids: {
        style: 'Fun, playful icon with a bright white background and bold primary colors. Red (#FF3B30), blue (#007AFF), yellow (#FFD60A), green (#34C759) elements. Chunky rounded shapes, toylike 3D effect with soft shadows. Think Duolingo, PBS Kids, or Khan Academy Kids icon style.',
        symbolHint: 'a star, block letter, rainbow, puzzle piece, or playful animal shape',
    },
}

/**
 * POST /api/generate-icon
 * Stage 3: Brand — Generate app icon via OpenAI DALL-E 3
 * Uses palette-specific style guides for professional quality icons
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { session, templateId, appName, category, description } = body

        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
        }

        // Get context
        const name = appName || session?.appName || 'App'
        const cat = category || session?.category || ''
        const template = session?.brandTemplate
        const tplId = templateId || template?.id || 'minimal'

        // Get palette-specific style guide
        const guide = ICON_STYLE_GUIDES[tplId] || ICON_STYLE_GUIDES.minimal

        // Build expert DALL-E prompt
        const prompt = `Design a premium iOS app icon for "${name}"${cat ? `, a ${cat} app` : ''}.

ICON DESIGN REQUIREMENTS:
- ${guide.style}
- The central symbol should be ${description || guide.symbolHint}
- 1024x1024 pixels, perfect square with standard iOS rounded rectangle shape (Apple superellipse corners)
- NO text, NO letters, NO words anywhere in the icon
- Single centered symbol or abstract mark, not overly complex
- Professional App Store quality — this should look like a top 10 app icon
- Clean edges, pixel-perfect rendering, no artifacts
- The icon should read clearly at 60x60px (small size on home screen)
- Subtle depth with light/shadow, not flat but not overly 3D

This icon must look indistinguishable from a real top-charting App Store app. Premium quality, polished, memorable.`

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt,
                n: 1,
                size: '1024x1024',
                quality: 'hd',
                style: 'vivid',
            }),
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('[DALL-E]', err)
            return NextResponse.json({ error: 'Icon generation failed' }, { status: 500 })
        }

        const data = await response.json()
        const iconUrl = data.data?.[0]?.url

        return NextResponse.json({ iconUrl, prompt, agent: 'pixel' })
    } catch (error: unknown) {
        console.error('[Generate Icon API]', error)
        const message = error instanceof Error ? error.message : 'Icon generation failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
