import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/generate-icon
 * Stage 3: Brand — Generate app icon via OpenAI DALL-E 3
 * Reads session data to get app name and brand template
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { session, templateId, appName, category, style, primaryColor, secondaryColor, description } = body

        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
        }

        // Get context from session or direct params
        const name = appName || session?.appName || 'App'
        const cat = category || session?.category || 'productivity'
        const template = session?.brandTemplate
        const pColor = primaryColor || template?.colorPalette?.primary || template?.colorPalette?.accent || '#007AFF'
        const sColor = secondaryColor || template?.colorPalette?.secondary || '#F2F2F7'
        const iconStyle = style || (template?.style === 'Dark' ? 'dark modern gradient' : 'clean minimal flat')

        // Build DALL-E prompt
        const prompt = `A mobile app icon for "${name}", a ${cat} app. The icon should be ${iconStyle}. Use ${pColor} as the main color with ${sColor} as accent. ${description || 'Clean geometric design with a single centered symbol'}. Suitable for Apple App Store. Square aspect ratio with rounded corners (Apple iOS style). No text in the icon. High contrast, professional quality. Single centered symbol or abstract shape.`

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
    } catch (error: any) {
        console.error('[Generate Icon API]', error)
        return NextResponse.json({ error: error.message || 'Icon generation failed' }, { status: 500 })
    }
}
