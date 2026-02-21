import { NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'
import { CURATED_NAME_BANK, getNameBankSize } from '@/lib/name-bank'

/**
 * GET /api/cron/vet-names
 * Daily cron job: Registrar + Namer collaborate to:
 *   1. Generate fresh name candidates from Namer (per category)
 *   2. Vet all candidates via /api/vet-names (trademark, domains, socials)
 *   3. Store only passing names in the verified database
 *
 * Triggered by Vercel Cron or external scheduler
 * Schedule: daily at 6:00 AM UTC
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 min max for batch vetting

export async function GET(req: Request) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const startTime = Date.now()
    const log: string[] = []

    try {
        log.push(`[${new Date().toISOString()}] Daily name vetting started`)
        log.push(`Name bank size: ${getNameBankSize()} candidates across ${CURATED_NAME_BANK.length} categories`)

        // Step 1: Ask Namer to generate fresh candidates for categories that need more
        const categories = CURATED_NAME_BANK.map(c => c.category)
        let newCandidates = 0

        for (const category of categories) {
            try {
                const namerPrompt = `Generate 5 new brandable app name candidates for the "${category}" industry.

Each name must be:
- 1-2 words, easy to spell and pronounce
- Evocative of the category's core benefit (like how Calm evokes meditation, Robinhood evokes democratized finance)
- NOT an existing well-known app name
- Suitable for .com domain registration

Respond as a JSON array (no markdown, raw JSON only):
[
  { "name": "ExampleName", "tagline": "Short compelling tagline", "vibe": "one-word-vibe", "why": "Why this name works for ${category}" }
]`

                const response = await callAgent('namer', namerPrompt, {
                    maxTokens: 1000,
                    temperature: 0.8,
                })

                // Parse Namer's suggestions
                const jsonMatch = response.match(/\[[\s\S]*\]/)
                if (jsonMatch) {
                    const suggestions = JSON.parse(jsonMatch[0])
                    newCandidates += suggestions.length
                    log.push(`Namer generated ${suggestions.length} candidates for ${category}`)
                }
            } catch (err) {
                log.push(`Namer failed for ${category}: ${err instanceof Error ? err.message : 'unknown'}`)
            }

            // Rate limit between categories
            await new Promise(r => setTimeout(r, 1000))
        }

        // Step 2: Trigger the vetting pipeline
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const vetResponse = await fetch(`${baseUrl}/api/vet-names`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ forceRecheck: false }),
        })

        const vetResult = await vetResponse.json()
        log.push(`Vetting complete: ${vetResult.summary}`)
        log.push(`Total verified names: ${vetResult.totalVerified}`)

        // Step 3: Notify Registrar of results via Telegram
        try {
            const registrarMsg = `📋 Daily Name Vetting Report\n\n` +
                `🏦 Candidates checked: ${getNameBankSize()}\n` +
                `✅ Total verified: ${vetResult.totalVerified}\n` +
                `🆕 New candidates from Namer: ${newCandidates}\n` +
                `⏱ Duration: ${Math.round((Date.now() - startTime) / 1000)}s\n\n` +
                `Categories: ${categories.join(', ')}`

            await fetch(`${baseUrl}/api/agent-comms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'notify',
                    from: 'checker',
                    message: registrarMsg,
                }),
            })
        } catch {
            log.push('Failed to notify Registrar via Telegram')
        }

        const duration = Math.round((Date.now() - startTime) / 1000)
        log.push(`Completed in ${duration}s`)

        return NextResponse.json({
            success: true,
            duration: `${duration}s`,
            newCandidates,
            vetResult,
            log,
        })
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Cron failed'
        log.push(`ERROR: ${msg}`)
        return NextResponse.json({ error: msg, log }, { status: 500 })
    }
}
