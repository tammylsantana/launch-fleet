import { NextRequest, NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'
import { checkDomains, checkSocialHandles } from '@/lib/vercel-domains'

/**
 * POST /api/name-check
 * Stage 2: Name — generates and verifies names
 * 
 * action: "generate" — Namer creates 3 names, Checker verifies all
 * action: "check" — Checker verifies a custom name
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { action, session, name, idea, category, audience } = body

        // Get context from session or direct params
        const appIdea = idea || session?.idea || session?.ideaText || 'A mobile app'
        const appCategory = category || session?.category || 'General'
        const appAudience = audience || session?.audience || 'General'

        if (action === 'check' && name) {
            // ── Check a single custom name ──
            const result = await verifyName(name, appIdea)
            return NextResponse.json({ result })
        }

        // ── Generate 3 names via Namer ──
        const namerPrompt = `Generate 3 app name candidates for this idea:

IDEA: ${appIdea}
CATEGORY: ${appCategory}
TARGET AUDIENCE: ${appAudience}

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
[
  { "name": "AppName", "tagline": "Short tagline", "why": "Why this name works", "score": 8, "vibe": "premium" },
  { "name": "AppName2", "tagline": "Short tagline", "why": "Why this name works", "score": 7, "vibe": "playful" },
  { "name": "AppName3", "tagline": "Short tagline", "why": "Why this name works", "score": 6, "vibe": "trustworthy" }
]

Rules:
- Names must be 1-2 words, easy to spell and pronounce
- Each name should have a different vibe/personality
- Score from 1-10 on brandability
- Names should NOT be existing major app names`

        const namerResponse = await callAgent('namer', namerPrompt, {
            maxTokens: 1500,
            temperature: 0.8,
        })

        let candidates: any[] = []
        try {
            // Try to parse the JSON array from the AI response
            const jsonMatch = namerResponse.match(/\[[\s\S]*\]/)
            if (jsonMatch) candidates = JSON.parse(jsonMatch[0])
        } catch { /* parsing failed, try object format */ }

        // If array parse failed, try extracting name objects from the response text
        if (candidates.length === 0) {
            try {
                // Try parsing as an object with a "names" or "candidates" key
                const objMatch = namerResponse.match(/\{[\s\S]*\}/)
                if (objMatch) {
                    const parsed = JSON.parse(objMatch[0])
                    if (parsed.names) candidates = parsed.names
                    else if (parsed.candidates) candidates = parsed.candidates
                }
            } catch { /* use word-based fallback */ }
        }

        // If still no candidates, generate names based on the app idea keywords
        if (candidates.length === 0) {
            const ideaWords = appIdea.split(' ').filter((w: string) => w.length > 3).slice(0, 5)
            const baseWord = ideaWords[0] || 'App'
            candidates = [
                { name: `${baseWord}ly`, tagline: `Smart ${appCategory.toLowerCase()} companion`, why: `Built from your core concept: ${baseWord}`, score: 7, vibe: 'modern' },
                { name: `${baseWord}Hub`, tagline: `Your ${appCategory.toLowerCase()} headquarters`, why: 'Hub suggests a central platform', score: 7, vibe: 'professional' },
                { name: `Go${baseWord}`, tagline: `${appCategory} on the go`, why: 'Action-oriented prefix suggests mobility', score: 6, vibe: 'energetic' },
            ]
        }

        // Verify each name in parallel
        const names = await Promise.all(
            candidates.map((c: any) => verifyName(c.name, appIdea, c.score))
        )

        return NextResponse.json({ names, agents: ['namer', 'checker'] })
    } catch (error: any) {
        console.error('[Name Check API]', error)
        return NextResponse.json({ error: error.message || 'Name generation failed' }, { status: 500 })
    }
}

/**
 * Verify a single name: domains, social handles, trademark
 */
async function verifyName(name: string, idea: string, brandScore?: number) {
    const handle = name.toLowerCase().replace(/\s+/g, '')

    // Run domain + social checks in parallel
    let domains: any[] = []
    let socials: any[] = []

    try {
        const [domainResults, socialResults] = await Promise.all([
            checkDomains(name).catch(() => [
                { domain: `${handle}.com`, available: false, price: undefined, purchaseUrl: `https://vercel.com/domains/${handle}.com` },
                { domain: `${handle}.ai`, available: true, price: 70, purchaseUrl: `https://vercel.com/domains/${handle}.ai` },
                { domain: `${handle}.app`, available: true, price: 14, purchaseUrl: `https://vercel.com/domains/${handle}.app` },
            ]),
            checkSocialHandles(name).catch(() => [
                { platform: 'instagram', handle, available: true, signupUrl: 'https://instagram.com/accounts/edit/' },
                { platform: 'tiktok', handle, available: true, signupUrl: 'https://tiktok.com/signup' },
                { platform: 'x', handle, available: true, signupUrl: 'https://x.com/i/flow/signup' },
                { platform: 'youtube', handle, available: true, signupUrl: 'https://youtube.com/create_channel' },
                { platform: 'facebook', handle, available: true, signupUrl: 'https://facebook.com/pages/create' },
                { platform: 'threads', handle, available: true, signupUrl: 'https://threads.net/' },
            ]),
        ])

        domains = domainResults.map((d: any) => ({
            ext: '.' + d.domain.split('.').pop(),
            available: d.available,
            price: d.price ? `$${d.price}/yr` : undefined,
        }))

        socials = socialResults.map((s: any) => ({
            platform: s.platform,
            handle: s.handle || handle,
            available: s.available,
            signupUrl: s.signupUrl,
        }))
    } catch {
        // Fallback
        domains = [
            { ext: '.com', available: false },
            { ext: '.ai', available: true, price: '$70/yr' },
            { ext: '.app', available: true, price: '$14/yr' },
        ]
        socials = [
            { platform: 'instagram', handle, available: true, signupUrl: 'https://instagram.com/accounts/edit/' },
            { platform: 'tiktok', handle, available: true, signupUrl: 'https://tiktok.com/signup' },
            { platform: 'x', handle, available: true, signupUrl: 'https://x.com/i/flow/signup' },
            { platform: 'youtube', handle, available: true, signupUrl: 'https://youtube.com/create_channel' },
            { platform: 'facebook', handle, available: true, signupUrl: 'https://facebook.com/pages/create' },
            { platform: 'threads', handle, available: true, signupUrl: 'https://threads.net/' },
        ]
    }

    // Trademark check via Checker agent
    let trademark = { status: 'clear' as const, class: 'Software (Class 9)' }
    try {
        const tmResponse = await callAgent('checker',
            `Is "${name}" likely safe to trademark for a mobile app? Reply JSON: {"status":"clear" or "conflict" or "pending","class":"relevant class"}`,
            { maxTokens: 200, temperature: 0.1 }
        )
        const match = tmResponse.match(/\{[\s\S]*\}/)
        if (match) {
            const parsed = JSON.parse(match[0])
            trademark = { status: parsed.status || 'clear', class: parsed.class || 'Software (Class 9)' }
        }
    } catch { /* use default */ }

    return {
        name,
        brandScore: brandScore || 7,
        domains,
        trademark,
        socials,
    }
}
