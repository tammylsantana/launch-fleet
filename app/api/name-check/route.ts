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

        // ── Generate 10 names via Namer (over-generate to filter after verification) ──
        const namerPrompt = `Generate 10 app name candidates for this specific idea:

IDEA: ${appIdea}
CATEGORY: ${appCategory}
TARGET AUDIENCE: ${appAudience}

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
[
  { "name": "Name1", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 8, "vibe": "premium" },
  { "name": "Name2", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 7, "vibe": "playful" },
  { "name": "Name3", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 8, "vibe": "trustworthy" },
  { "name": "Name4", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 7, "vibe": "modern" },
  { "name": "Name5", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 8, "vibe": "bold" },
  { "name": "Name6", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 7, "vibe": "clean" },
  { "name": "Name7", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 8, "vibe": "innovative" },
  { "name": "Name8", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 7, "vibe": "friendly" },
  { "name": "Name9", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 8, "vibe": "energetic" },
  { "name": "Name10", "tagline": "Short tagline", "why": "Why this name works for THIS app", "score": 7, "vibe": "sleek" }
]

CRITICAL RULES:
- Every name MUST clearly relate to what the app does — a user should hear the name and immediately understand the app's purpose or market
- Think like: Robinhood (finance/democratize investing), Calm (meditation), Headspace (mindfulness), Mint (money/fresh start), Duolingo (duo + lingo), Shazam (magic of music discovery)
- Names should evoke the core benefit, emotion, or action of the app
- Combine relevant word roots, fragments, or metaphors from the app's domain
- 1-2 words, easy to spell and pronounce
- Do NOT reuse existing major app names — create new ones inspired by the same naming strategy
- Avoid generic tech suffixes like "App", "Hub", "Pro" unless they truly fit`

        const namerResponse = await callAgent('namer', namerPrompt, {
            maxTokens: 3000,
            temperature: 0.9,
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
                { name: `${baseWord}AI`, tagline: `AI-powered ${appCategory.toLowerCase()}`, why: 'AI suffix signals intelligence', score: 7, vibe: 'tech' },
                { name: `${baseWord}ify`, tagline: `Simplify ${appCategory.toLowerCase()}`, why: 'ify suffix is memorable and action-oriented', score: 6, vibe: 'playful' },
                { name: `${baseWord}Vault`, tagline: `Your ${appCategory.toLowerCase()} vault`, why: 'Vault suggests security and value', score: 6, vibe: 'trustworthy' },
            ]
        }

        // Verify each name in parallel
        const allVerified = await Promise.all(
            candidates.map((c: any) => verifyName(c.name, appIdea, c.score))
        )

        // Filter: only return names with non-conflict trademarks AND at least one available domain
        const passedNames = allVerified.filter(n => {
            const noTrademarkConflict = n.trademark.status !== 'conflict'
            const hasAvailableDomain = n.domains.some((d: any) => d.available)
            return noTrademarkConflict && hasAvailableDomain
        })

        // Return top 3 filtered names (at least show best fallback if all fail)
        const finalNames = passedNames.length > 0 ? passedNames.slice(0, 3) : allVerified.slice(0, 1)

        return NextResponse.json({ names: finalNames, agents: ['namer', 'checker'], totalChecked: allVerified.length, passed: passedNames.length })
    } catch (error: any) {
        console.error('[Name Check API]', error)
        return NextResponse.json({ error: error.message || 'Name generation failed' }, { status: 500 })
    }
}

/**
 * Verify a single name using REAL data only — no fake/simulated results
 * - Domains: DNS lookup via Cloudflare DoH
 * - Socials: HTTP HEAD checks against actual platforms
 * - Trademark: Real USPTO database search via Supabase
 */
async function verifyName(name: string, idea: string, brandScore?: number) {
    const handle = name.toLowerCase().replace(/\s+/g, '')

    // Run domain + social + trademark checks in parallel — all real APIs
    const [domainResults, socialResults, trademark] = await Promise.all([
        checkDomains(name).catch((e) => {
            console.error(`[Domain check failed for ${name}]`, e)
            return [
                { domain: `${handle}.com`, available: false, purchaseUrl: `https://vercel.com/domains/${handle}.com` },
                { domain: `${handle}.ai`, available: false, purchaseUrl: `https://vercel.com/domains/${handle}.ai` },
                { domain: `${handle}.app`, available: false, purchaseUrl: `https://vercel.com/domains/${handle}.app` },
            ]
        }),
        checkSocialHandles(name).catch((e) => {
            console.error(`[Social check failed for ${name}]`, e)
            return [] // Empty = could not check, not "available"
        }),
        checkTrademarkDatabase(name),
    ])

    const domains = domainResults.map((d: any) => ({
        ext: '.' + d.domain.split('.').pop(),
        available: d.available,
        parked: d.parked,
        parkingProvider: d.parkingProvider,
        price: d.price ? `$${d.price}/yr` : undefined,
        purchaseUrl: d.purchaseUrl || `https://vercel.com/domains/${d.domain}`,
    }))

    const socials = socialResults.map((s: any) => ({
        platform: s.platform,
        handle: s.handle || handle,
        available: s.available,
        signupUrl: s.signupUrl,
    }))

    // Checker AI analyzes the full picture and gives a professional verdict
    let checkerVerdict = ''
    try {
        const availDomains = domains.filter((d: any) => d.available).map((d: any) => d.ext).join(', ') || 'none'
        const takenDomains = domains.filter((d: any) => !d.available).map((d: any) => `${d.ext}${d.parked ? ' (parked)' : ''}`).join(', ') || 'none'
        const availSocials = socials.filter((s: any) => s.available).length
        const checkerPrompt = `Analyze this name verification for "${name}" (app idea: ${idea}):

Trademark: ${trademark.status} — ${trademark.class}
Domains available: ${availDomains}
Domains taken: ${takenDomains}
Social handles: ${availSocials}/6 available

Give a 1-2 sentence professional verdict. Should we proceed? Flag any concerns.`

        checkerVerdict = await callAgent('checker', checkerPrompt, { maxTokens: 120, temperature: 0.3 })
    } catch {
        // Checker unavailable — verdict remains empty
    }

    return {
        name,
        brandScore: brandScore || 7,
        domains,
        trademark,
        socials,
        checkerVerdict,
    }
}

/**
 * Real USPTO trademark database search via Supabase
 */
async function checkTrademarkDatabase(name: string): Promise<{ status: 'clear' | 'conflict' | 'pending'; class: string }> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
            console.warn('[Trademark] No Supabase credentials — cannot check')
            return { status: 'pending', class: 'Database not configured' }
        }

        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, serviceKey)
        const searchTerm = name.trim().toLowerCase()

        // Check for exact matches in live USPTO trademarks
        const { data: exactMatches, error: exactError } = await supabase
            .from('trademarks')
            .select('word_mark, status, owner_name')
            .ilike('word_mark', searchTerm)
            .eq('status', 'LIVE')
            .limit(3)

        if (exactError) {
            console.error('[Trademark exact search]', exactError)
            return { status: 'pending', class: 'Search error' }
        }

        if (exactMatches && exactMatches.length > 0) {
            return { status: 'conflict', class: `USPTO: Owned by ${exactMatches[0].owner_name || 'registered holder'}` }
        }

        // Check for similar names
        const { data: similarMatches, error: simError } = await supabase
            .from('trademarks')
            .select('word_mark')
            .ilike('word_mark', `%${searchTerm}%`)
            .eq('status', 'LIVE')
            .limit(5)

        if (simError) {
            console.error('[Trademark similar search]', simError)
        }

        if (similarMatches && similarMatches.length > 3) {
            return { status: 'pending', class: `${similarMatches.length} similar marks in USPTO` }
        }

        return { status: 'clear', class: 'No USPTO conflicts found' }
    } catch (e) {
        console.error('[Trademark check error]', e)
        return { status: 'pending', class: 'Check unavailable' }
    }
}

