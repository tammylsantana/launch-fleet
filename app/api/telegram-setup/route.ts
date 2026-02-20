import { NextResponse } from 'next/server'

type AgentBot = {
    id: string
    name: string
    description: string
    tokenEnv: string
}

const AGENT_BOTS: AgentBot[] = [
    { id: 'scout', name: 'Scout — Market Intelligence', description: 'Market research, competitor analysis, and profit potential for your app idea.', tokenEnv: 'TELEGRAM_BOT_TOKEN_SCOUT' },
    { id: 'namer', name: 'Namer — Brand Crafter', description: 'Creative app names with trademark, domain, and social handle verification.', tokenEnv: 'TELEGRAM_BOT_TOKEN_NAMER' },
    { id: 'checker', name: 'Checker — Verification', description: 'Trademark, domain, and social media handle verification specialist.', tokenEnv: 'TELEGRAM_BOT_TOKEN_CHECKER' },
    { id: 'pixel', name: 'Pixel — Design Studio', description: 'Brand identity, color palette, typography, and app icon design.', tokenEnv: 'TELEGRAM_BOT_TOKEN_PIXEL' },
    { id: 'builder', name: 'Builder — Code Generation', description: 'React Native/Expo app code generation and project scaffolding.', tokenEnv: 'TELEGRAM_BOT_TOKEN_BUILDER' },
    { id: 'shipper', name: 'Shipper — App Store Prep', description: 'App Store Connect metadata, compliance, and submission materials.', tokenEnv: 'TELEGRAM_BOT_TOKEN_SHIPPER' },
    { id: 'buzz', name: 'Buzz — Marketing', description: 'Launch strategy, landing pages, social media, and marketing plans.', tokenEnv: 'TELEGRAM_BOT_TOKEN_BUZZ' },
]

/**
 * POST /api/telegram-setup
 * Configures all 7 agent bots on Telegram:
 * - Sets bot name and description via Telegram Bot API
 * - Sets up webhook or confirms bot is reachable
 */
export async function POST() {
    const chatId = process.env.TELEGRAM_CHAT_ID
    const results: Array<{ agent: string; success: boolean; error?: string; botUsername?: string }> = []

    for (const bot of AGENT_BOTS) {
        const token = process.env[bot.tokenEnv]
        if (!token) {
            results.push({ agent: bot.id, success: false, error: `Missing ${bot.tokenEnv}` })
            continue
        }

        try {
            // 1. Get bot info to verify token works
            const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`)
            const meData = await meRes.json()
            if (!meData.ok) {
                results.push({ agent: bot.id, success: false, error: `Invalid token: ${meData.description}` })
                continue
            }

            const botUsername = meData.result?.username || ''

            // 2. Set bot description
            try {
                await fetch(`https://api.telegram.org/bot${token}/setMyDescription`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ description: bot.description }),
                })
            } catch { /* non-critical */ }

            // 3. Set bot short description
            try {
                await fetch(`https://api.telegram.org/bot${token}/setMyShortDescription`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ short_description: `LaunchFleet ${bot.name}` }),
                })
            } catch { /* non-critical */ }

            // 4. Set bot name
            try {
                await fetch(`https://api.telegram.org/bot${token}/setMyName`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: bot.name }),
                })
            } catch { /* non-critical */ }

            // 5. Send intro message to user's chat
            if (chatId) {
                try {
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: `🤖 *${bot.name}* is online.\n\n${bot.description}\n\n_Type /start to begin._`,
                            parse_mode: 'Markdown',
                        }),
                    })
                } catch { /* non-critical */ }
            }

            results.push({ agent: bot.id, success: true, botUsername })
        } catch (err: any) {
            results.push({ agent: bot.id, success: false, error: err.message })
        }
    }

    const successCount = results.filter(r => r.success).length

    return NextResponse.json({
        success: successCount > 0,
        message: `${successCount}/${AGENT_BOTS.length} agents configured on Telegram`,
        results,
        chatId: chatId ? `Chat ID: ${chatId}` : 'No TELEGRAM_CHAT_ID set',
    })
}

/**
 * GET /api/telegram-setup
 * Returns the current status of all agent bots
 */
export async function GET() {
    const results: Array<{ agent: string; configured: boolean; username?: string }> = []

    for (const bot of AGENT_BOTS) {
        const token = process.env[bot.tokenEnv]
        if (!token) {
            results.push({ agent: bot.id, configured: false })
            continue
        }

        try {
            const res = await fetch(`https://api.telegram.org/bot${token}/getMe`)
            const data = await res.json()
            results.push({
                agent: bot.id,
                configured: data.ok,
                username: data.result?.username,
            })
        } catch {
            results.push({ agent: bot.id, configured: false })
        }
    }

    return NextResponse.json({ agents: results })
}
