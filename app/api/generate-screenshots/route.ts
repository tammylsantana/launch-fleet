import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/generate-screenshots
 * Generate App Store screenshots using screenshots.pro API
 * 
 * Uses template-based rendering:
 * 1. Templates are designed in screenshots.pro web editor
 * 2. API renders modified copies with custom screenshots + text
 * 
 * Docs: https://renderer.screenshots.pro/docs
 */

const SCREENSHOTS_PRO_BASE = 'https://renderer.screenshots.pro'

// Default template IDs — set these after creating templates in screenshots.pro
// Each template has named elements (Device nodes, Text nodes) that can be modified
const DEFAULT_TEMPLATES = {
    iphone67: process.env.SCREENSHOTS_PRO_TEMPLATE_67 || '',
    iphone65: process.env.SCREENSHOTS_PRO_TEMPLATE_65 || '',
    iphone55: process.env.SCREENSHOTS_PRO_TEMPLATE_55 || '',
    ipad: process.env.SCREENSHOTS_PRO_TEMPLATE_IPAD || '',
}

interface Modification {
    name: string
    attribute: string
    value: string | number
}

interface ScreenshotRequest {
    templateId?: string
    screenshotUrl: string        // URL of the app screenshot to place in device frame
    title?: string               // Headline text overlay
    subtitle?: string            // Subtext overlay
    deviceSize?: '6.7' | '6.5' | '5.5' | 'ipad'
}

async function renderTemplate(templateId: string, modifications: Modification[]) {
    const apiKey = process.env.SCREENSHOTS_PRO_API_KEY
    if (!apiKey) {
        throw new Error('SCREENSHOTS_PRO_API_KEY not configured')
    }

    const response = await fetch(`${SCREENSHOTS_PRO_BASE}/renders/create/${templateId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modifications }),
    })

    if (!response.ok) {
        const err = await response.text()
        console.error('[Screenshots.pro]', response.status, err)
        throw new Error(`Screenshots.pro API error: ${response.status}`)
    }

    return response.json()
}

async function pollForCompletion(renderId: string, maxAttempts = 30): Promise<string> {
    const apiKey = process.env.SCREENSHOTS_PRO_API_KEY

    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 2000)) // Poll every 2 seconds

        const response = await fetch(`${SCREENSHOTS_PRO_BASE}/renders/${renderId}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
        })

        if (!response.ok) continue

        const data = await response.json()
        if (data.status === 'completed' && data.download_url) {
            return data.download_url
        }
    }

    throw new Error('Screenshot render timed out')
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { screenshots, session } = body as {
            screenshots: ScreenshotRequest[]
            session: Record<string, unknown>
        }

        const apiKey = process.env.SCREENSHOTS_PRO_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Screenshots.pro API key not configured. Add SCREENSHOTS_PRO_API_KEY to environment.' },
                { status: 500 }
            )
        }

        const results = []

        for (const screenshot of screenshots) {
            // Determine template
            const templateId = screenshot.templateId ||
                DEFAULT_TEMPLATES[`iphone${screenshot.deviceSize || '67'}` as keyof typeof DEFAULT_TEMPLATES]

            if (!templateId) {
                results.push({
                    error: `No template configured for device size ${screenshot.deviceSize || '6.7'}. Create a template at screenshots.pro and set SCREENSHOTS_PRO_TEMPLATE_67 env var.`,
                    deviceSize: screenshot.deviceSize || '6.7',
                })
                continue
            }

            // Build modifications
            const modifications: Modification[] = []

            // Device node — replace screenshot inside the phone frame
            modifications.push({
                name: 'device',
                attribute: 'screenshot',
                value: screenshot.screenshotUrl,
            })

            // Text overlays
            if (screenshot.title) {
                modifications.push({
                    name: 'title',
                    attribute: 'text',
                    value: screenshot.title,
                })
            }

            if (screenshot.subtitle) {
                modifications.push({
                    name: 'subtitle',
                    attribute: 'text',
                    value: screenshot.subtitle,
                })
            }

            try {
                // Start render
                const render = await renderTemplate(templateId, modifications)

                // Poll for completion
                const downloadUrl = await pollForCompletion(render.id)

                results.push({
                    success: true,
                    downloadUrl,
                    renderId: render.id,
                    deviceSize: screenshot.deviceSize || '6.7',
                    title: screenshot.title,
                })
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Render failed'
                results.push({
                    error: message,
                    deviceSize: screenshot.deviceSize || '6.7',
                })
            }
        }

        return NextResponse.json({
            results,
            total: results.length,
            successful: results.filter((r: Record<string, unknown>) => r.success).length,
            agent: 'pixel',
        })
    } catch (error: unknown) {
        console.error('[Generate Screenshots API]', error)
        const message = error instanceof Error ? error.message : 'Screenshot generation failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
