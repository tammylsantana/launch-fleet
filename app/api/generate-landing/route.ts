import { NextRequest, NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'

/**
 * POST /api/generate-landing
 * Stage 6: Landing — Buzz agent generates complete HTML landing page
 * Includes legal links, native Apple App Store badge, and app-specific content
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { session, template } = body

        const appName = session?.appName || session?.selectedName || 'App'
        const appIdea = session?.idea || session?.ideaText || ''
        const brandTemplate = session?.brandTemplate
        const icon = session?.icon

        // Build color values
        const colors = brandTemplate?.colorPalette || {
            primary: '#1D1D1F',
            secondary: '#F2F2F7',
            accent: '#007AFF',
            bg: '#FFFFFF',
            text: '#1D1D1F',
        }
        const fonts = brandTemplate?.fonts || { headline: 'Inter', body: 'Inter' }

        const templateStyle = template === 'minimal'
            ? 'Clean, single-column layout. White hero with centered app icon and tagline. Features as icon+text cards in a grid. Single CTA at bottom.'
            : 'Full-width gradient hero with device mockup placeholder. Alternating left-right feature sections. Social proof / testimonials. Sticky header with download CTA.'

        const prompt = `Generate a COMPLETE, production-ready HTML landing page for an app called "${appName}".

APP DESCRIPTION: ${appIdea}

TEMPLATE STYLE: ${templateStyle}
PRIMARY COLOR: ${colors.primary}
ACCENT COLOR: ${colors.accent}
BACKGROUND: ${colors.bg}
TEXT COLOR: ${colors.text}
HEADLINE FONT: ${fonts.headline}
BODY FONT: ${fonts.body}

MANDATORY REQUIREMENTS — THE PAGE MUST INCLUDE ALL OF THESE:

1. HERO SECTION:
   - App name "${appName}" as large heading
   - A compelling tagline specific to "${appIdea}" — NOT generic like "discover a new way"
   - Official Apple App Store download badge using this exact HTML:
     <a href="#" style="display:inline-block"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" style="height:54px"></a>

2. FEATURES SECTION:
   - 4 specific features derived directly from "${appIdea}"
   - Each feature with an emoji icon, title, and 1-sentence description
   - Features must be SPECIFIC to this app, not generic

3. HOW IT WORKS SECTION:
   - 3 numbered steps showing the user flow specific to this app

4. DOWNLOAD CTA SECTION:
   - Repeat the Apple App Store badge
   - "Available on the App Store" text

5. FOOTER WITH LEGAL LINKS (MANDATORY):
   - Privacy Policy link: <a href="/privacy">Privacy Policy</a>
   - Terms of Service link: <a href="/terms">Terms of Service</a>
   - Support link: <a href="mailto:support@${appName.toLowerCase().replace(/\\s+/g, '')}.app">Contact Support</a>
   - Copyright: © 2025 ${appName}. All rights reserved.

TECHNICAL REQUIREMENTS:
- Complete HTML file with inline CSS
- Load Google Fonts (${fonts.headline}, ${fonts.body}) via <link> tag from fonts.googleapis.com
- Mobile-responsive with media queries
- Use the exact brand colors provided
- Smooth scroll, subtle hover animations
- NO placeholder text — every word must be specific to "${appIdea}"
- The page should feel like it was designed by a professional agency

Respond with ONLY the complete HTML code. No markdown code fences. No explanation. Just the HTML.`

        const htmlContent = await callAgent('buzz', prompt, {
            maxTokens: 4000,
            temperature: 0.4,
        })

        // Clean the response
        let cleanHtml = htmlContent
            .replace(/^```html?\n?/i, '')
            .replace(/\n?```$/i, '')
            .trim()

        // If it doesn't start with a proper HTML tag, wrap it
        if (!cleanHtml.toLowerCase().startsWith('<!doctype') && !cleanHtml.toLowerCase().startsWith('<html')) {
            cleanHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${appName}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=${fonts.headline}:wght@400;600;700&family=${fonts.body}:wght@400;500&display=swap" rel="stylesheet"></head><body>${cleanHtml}</body></html>`
        }

        // Verify legal links exist — if not, inject them
        if (!cleanHtml.includes('Privacy Policy') || !cleanHtml.includes('Terms of Service')) {
            const legalFooter = `
<footer style="background:${colors.primary};color:${colors.bg};padding:40px 20px;text-align:center;font-family:'${fonts.body}',sans-serif;font-size:14px;">
  <div style="max-width:600px;margin:0 auto;">
    <p style="margin:0 0 16px"><a href="/privacy" style="color:${colors.accent};text-decoration:none;margin:0 12px">Privacy Policy</a> <a href="/terms" style="color:${colors.accent};text-decoration:none;margin:0 12px">Terms of Service</a> <a href="mailto:support@${appName.toLowerCase().replace(/\s+/g, '')}.app" style="color:${colors.accent};text-decoration:none;margin:0 12px">Support</a></p>
    <p style="margin:0 0 16px;opacity:0.7">© 2025 ${appName}. All rights reserved.</p>
    <p style="margin:0"><a href="/admin" style="color:${colors.bg};opacity:0.3;text-decoration:none;font-size:11px">Admin</a></p>
  </div>
</footer>`
            // Insert before </body> or at end
            if (cleanHtml.includes('</body>')) {
                cleanHtml = cleanHtml.replace('</body>', `${legalFooter}</body>`)
            } else {
                cleanHtml += legalFooter
            }
        }

        // Verify Apple Store badge exists — if not, inject it in the hero
        if (!cleanHtml.includes('download-on-the-app-store.svg')) {
            const badge = `<a href="#" style="display:inline-block;margin-top:24px"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" style="height:54px"></a>`
            // Try to inject after the first h1
            cleanHtml = cleanHtml.replace(/<\/h1>/i, `</h1>${badge}`)
        }

        const previewUrl = `data:text/html;charset=utf-8,${encodeURIComponent(cleanHtml)}`

        return NextResponse.json({
            previewUrl,
            html: cleanHtml,
            agent: 'buzz',
        })
    } catch (error: any) {
        console.error('[Generate Landing API]', error)
        return NextResponse.json({ error: error.message || 'Landing page generation failed' }, { status: 500 })
    }
}
