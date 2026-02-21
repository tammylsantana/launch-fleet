import { NextRequest, NextResponse } from 'next/server'
import { CURATED_NAME_BANK, getNameBankSize } from '@/lib/name-bank'
import { checkDomains, checkSocialHandles } from '@/lib/vercel-domains'
import { callAgent, sendAgentTelegram } from '@/lib/ai'
import fs from 'fs'
import path from 'path'

/**
 * In-house Wizard trademark database check via Supabase
 * Checks exact matches and similar marks in the USPTO database
 */
async function checkTrademarkDB(name: string): Promise<{ status: 'clear' | 'conflict' | 'pending'; detail: string }> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
            return { status: 'pending', detail: 'Trademark DB not configured' }
        }

        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, serviceKey)
        const searchTerm = name.trim().toLowerCase()

        // Exact match check
        const { data: exactMatches, error: exactError } = await supabase
            .from('trademarks')
            .select('word_mark, status, owner_name')
            .ilike('word_mark', searchTerm)
            .eq('status', 'LIVE')
            .limit(3)

        if (exactError) {
            return { status: 'pending', detail: 'Search error' }
        }

        if (exactMatches && exactMatches.length > 0) {
            return { status: 'conflict', detail: `USPTO conflict: ${exactMatches[0].owner_name || 'registered'}` }
        }

        // Similar marks check
        const { data: similarMatches } = await supabase
            .from('trademarks')
            .select('word_mark')
            .ilike('word_mark', `%${searchTerm}%`)
            .eq('status', 'LIVE')
            .limit(5)

        if (similarMatches && similarMatches.length > 3) {
            return { status: 'pending', detail: `${similarMatches.length} similar USPTO marks` }
        }

        return { status: 'clear', detail: 'No USPTO conflicts' }
    } catch {
        return { status: 'pending', detail: 'Check unavailable' }
    }
}

const VERIFIED_PATH = path.join(process.cwd(), 'data', 'verified-names.json')

interface VerifiedName {
    name: string
    category: string
    tagline: string
    vibe: string
    why: string
    domains: { ext: string; available: boolean }[]
    socials: { platform: string; available: boolean }[]
    trademark: { status: 'clear' | 'conflict' | 'pending' }
    verifiedAt: string
}

function loadVerified(): VerifiedName[] {
    try {
        if (fs.existsSync(VERIFIED_PATH)) {
            return JSON.parse(fs.readFileSync(VERIFIED_PATH, 'utf-8'))
        }
    } catch { }
    return []
}

function saveVerified(names: VerifiedName[]) {
    const dir = path.dirname(VERIFIED_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(VERIFIED_PATH, JSON.stringify(names, null, 2))
}

/**
 * POST /api/vet-names
 * Admin endpoint — batch-vet candidate names from the name bank
 * Only names that pass ALL checks get stored in verified-names.json
 *
 * Checks: .com domain available + trademark clear + at least 3 social handles available
 */
export async function POST(req: NextRequest) {
    try {
        const { category, forceRecheck } = await req.json()

        const existing = loadVerified()
        const existingNames = new Set(existing.map(n => n.name))

        // Get candidates to vet
        let candidates = CURATED_NAME_BANK.flatMap(industry =>
            industry.names.map(n => ({ ...n, category: industry.category }))
        )

        // Filter to specific category if requested
        if (category) {
            candidates = candidates.filter(c => c.category === category)
        }

        // Skip already-verified unless force recheck
        if (!forceRecheck) {
            candidates = candidates.filter(c => !existingNames.has(c.name))
        }

        const results: { name: string; passed: boolean; reason?: string }[] = []
        const newVerified: VerifiedName[] = []

        // Vet each candidate
        for (const candidate of candidates) {
            try {
                // Check domains (.com is required, .ai and .app are bonus)
                const slug = candidate.name.toLowerCase().replace(/\s+/g, '')
                const domainResults = await checkDomains(slug)
                const comAvailable = domainResults.find(d => d.domain.endsWith('.com'))?.available ?? false

                if (!comAvailable) {
                    results.push({ name: candidate.name, passed: false, reason: '.com domain not available' })
                    continue
                }

                // Buzz (social media team) vets handle availability
                const socialResults = await checkSocialHandles(slug)
                const availableSocials = socialResults.filter(s => s.available).length

                // Buzz reviews: is this name good for social media branding?
                let buzzApproved = true
                try {
                    const buzzReview = await callAgent('buzz', `Quick check: is the handle "@${slug}" good for social media branding? Consider: is it easy to type, not easily confused with another brand, and professional enough for ${candidate.category}. Reply with just YES or NO and a one-line reason.`, {
                        maxTokens: 100,
                        temperature: 0.3,
                    })
                    if (buzzReview.toUpperCase().startsWith('NO')) {
                        buzzApproved = false
                        results.push({ name: candidate.name, passed: false, reason: `Buzz flagged: ${buzzReview.slice(0, 80)}` })
                        continue
                    }
                } catch {
                    // Buzz unavailable — continue with raw check
                }

                if (availableSocials < 3) {
                    results.push({ name: candidate.name, passed: false, reason: `Only ${availableSocials}/6 social handles available` })
                    continue
                }

                // In-house Wizard trademark database check
                const tmResult = await checkTrademarkDB(candidate.name)
                if (tmResult.status === 'conflict') {
                    results.push({ name: candidate.name, passed: false, reason: tmResult.detail })
                    continue
                }
                if (tmResult.status === 'pending') {
                    results.push({ name: candidate.name, passed: false, reason: tmResult.detail })
                    continue
                }
                const trademark = { status: tmResult.status }

                // PASSED — store it
                const verified: VerifiedName = {
                    name: candidate.name,
                    category: candidate.category,
                    tagline: candidate.tagline,
                    vibe: candidate.vibe,
                    why: candidate.why,
                    domains: domainResults.map(d => ({ ext: '.' + d.domain.split('.').pop(), available: d.available })),
                    socials: socialResults.map(s => ({ platform: s.platform, available: s.available })),
                    trademark,
                    verifiedAt: new Date().toISOString(),
                }

                newVerified.push(verified)
                results.push({ name: candidate.name, passed: true })

                // Rate limit — avoid hammering DNS/social APIs
                await new Promise(r => setTimeout(r, 500))

            } catch (err) {
                results.push({ name: candidate.name, passed: false, reason: 'Verification error' })
            }
        }

        // Merge with existing verified names (replace if force recheck)
        let finalVerified: VerifiedName[]
        if (forceRecheck) {
            const recheckedNames = new Set(newVerified.map(n => n.name))
            finalVerified = [
                ...existing.filter(n => !recheckedNames.has(n.name)),
                ...newVerified,
            ]
        } else {
            finalVerified = [...existing, ...newVerified]
        }

        saveVerified(finalVerified)

        const passed = results.filter(r => r.passed).length
        const failed = results.filter(r => !r.passed).length

        return NextResponse.json({
            summary: `Vetted ${results.length} candidates: ${passed} passed, ${failed} failed`,
            totalVerified: finalVerified.length,
            totalCandidates: getNameBankSize(),
            results,
        })
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Vetting failed'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}

/**
 * GET /api/vet-names
 * Returns all verified names, optionally filtered by category
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const idea = searchParams.get('idea')

    let verified = loadVerified()

    // Filter by category if specified
    if (category) {
        verified = verified.filter(n => n.category === category)
    }

    // If idea provided, score and sort by relevance
    if (idea) {
        const lower = idea.toLowerCase()
        const categoryScores = CURATED_NAME_BANK.map(industry => ({
            category: industry.category,
            score: industry.keywords.filter(kw => lower.includes(kw)).length,
        })).sort((a, b) => b.score - a.score)

        const bestCategory = categoryScores[0]?.score > 0 ? categoryScores[0].category : null
        const secondCategory = categoryScores[1]?.score > 0 ? categoryScores[1].category : null

        if (bestCategory) {
            // Primary matches first, then secondary, then rest
            verified.sort((a, b) => {
                const aScore = a.category === bestCategory ? 2 : a.category === secondCategory ? 1 : 0
                const bScore = b.category === bestCategory ? 2 : b.category === secondCategory ? 1 : 0
                return bScore - aScore
            })
        }
    }

    return NextResponse.json({
        names: verified,
        total: verified.length,
    })
}
