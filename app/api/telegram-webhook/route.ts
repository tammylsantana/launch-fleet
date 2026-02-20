import { NextRequest, NextResponse } from 'next/server'
import { callAgent, sendAgentTelegram, type AgentId } from '@/lib/ai'

/**
 * POST /api/telegram-webhook
 * Receives incoming Telegram messages and routes them to the correct AI agent.
 * 
 * Each bot has its own webhook URL: /api/telegram-webhook?agent=scout
 * When a user messages a bot, Telegram sends a POST to this endpoint.
 * The agent processes the message through Groq and sends the response back.
 */

// Map bot tokens to agent IDs (reverse lookup)
const TOKEN_TO_AGENT: Record<string, AgentId> = {}
const VALID_AGENTS: AgentId[] = ['scout', 'namer', 'checker', 'pixel', 'builder', 'shipper', 'buzz']
const AGENT_TOKEN_ENVS: Record<AgentId, string> = {
    scout: 'TELEGRAM_BOT_TOKEN_SCOUT',
    namer: 'TELEGRAM_BOT_TOKEN_NAMER',
    checker: 'TELEGRAM_BOT_TOKEN_CHECKER',
    pixel: 'TELEGRAM_BOT_TOKEN_PIXEL',
    builder: 'TELEGRAM_BOT_TOKEN_BUILDER',
    shipper: 'TELEGRAM_BOT_TOKEN_SHIPPER',
    buzz: 'TELEGRAM_BOT_TOKEN_BUZZ',
}

// Simple in-memory conversation history per chat (resets on server restart)
const conversations: Record<string, { role: 'user' | 'assistant'; content: string }[]> = {}
const MAX_HISTORY = 10

export async function POST(req: NextRequest) {
    try {
        // Determine which agent this message is for
        const agentId = req.nextUrl.searchParams.get('agent') as AgentId | null

        if (!agentId || !VALID_AGENTS.includes(agentId)) {
            return NextResponse.json({ error: 'Missing or invalid agent parameter' }, { status: 400 })
        }

        const update = await req.json()

        // Extract the message
        const message = update.message
        if (!message?.text) {
            // Ignore non-text messages (stickers, photos, etc.)
            return NextResponse.json({ ok: true })
        }

        const chatId = message.chat.id.toString()
        const userText = message.text
        const userName = message.from?.first_name || 'User'

        console.log(`[Telegram/${agentId}] Message from ${userName} (${chatId}): ${userText.substring(0, 100)}`)

        // Handle /start command
        if (userText === '/start') {
            const agentNames: Record<AgentId, string> = {
                scout: 'Scout — Market Intelligence',
                namer: 'Namer — Brand Crafter',
                checker: 'Checker — Verification',
                pixel: 'Pixel — Design Studio',
                builder: 'Builder — Code Generation',
                shipper: 'Shipper — App Store Prep',
                buzz: 'Buzz — Marketing',
            }
            const welcome = `👋 Hey ${userName}! I'm *${agentNames[agentId]}*.\n\nI'm your dedicated LaunchFleet AI agent. Tell me what you need and I'll get to work.\n\nCommands:\n/start — This welcome message\n/reset — Clear conversation history\n/skills — See my capabilities\n/help — Usage tips`

            await sendAgentTelegram(agentId, welcome, chatId)
            return NextResponse.json({ ok: true })
        }

        // Handle /reset command
        if (userText === '/reset') {
            conversations[`${agentId}:${chatId}`] = []
            await sendAgentTelegram(agentId, '🔄 Conversation history cleared. Fresh start!', chatId)
            return NextResponse.json({ ok: true })
        }

        // Handle /skills command
        if (userText === '/skills') {
            // Import skill loader inline to avoid issues
            const { getAgentSkills, loadAgentSkill } = await import('@/lib/ai')
            const skills = getAgentSkills(agentId)
            if (skills.length === 0) {
                await sendAgentTelegram(agentId, '📦 I have no specialized skills loaded yet. I still work with my base intelligence though!', chatId)
            } else {
                const skillList = skills.map(s => {
                    const content = loadAgentSkill(agentId, s)
                    const firstLine = content.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || s
                    return `• *${firstLine}*`
                }).join('\n')
                await sendAgentTelegram(agentId, `🧠 My skills:\n\n${skillList}`, chatId)
            }
            return NextResponse.json({ ok: true })
        }

        // Handle /help command
        if (userText === '/help') {
            await sendAgentTelegram(agentId, `💡 *Tips:*\n\n• Just type naturally — I understand context\n• I remember our conversation (up to ${MAX_HISTORY} messages)\n• Use /reset to start fresh\n• Use /skills to see what I specialize in\n• I can generate plans, analyze markets, create content, and more`, chatId)
            return NextResponse.json({ ok: true })
        }

        // Build conversation history
        const historyKey = `${agentId}:${chatId}`
        if (!conversations[historyKey]) conversations[historyKey] = []

        // Add user message to history
        conversations[historyKey].push({ role: 'user', content: userText })

        // Trim history to max length
        if (conversations[historyKey].length > MAX_HISTORY * 2) {
            conversations[historyKey] = conversations[historyKey].slice(-MAX_HISTORY * 2)
        }

        // Send "typing" indicator
        const token = process.env[AGENT_TOKEN_ENVS[agentId]]
        if (token) {
            fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
            }).catch(() => { })
        }

        // Call the AI agent with conversation history
        const { callAgentChat } = await import('@/lib/ai')
        const response = await callAgentChat(agentId, conversations[historyKey], {
            maxTokens: 2000,
            temperature: 0.7,
            systemPrompt: `You are chatting with ${userName} on Telegram. Keep responses concise and well-formatted for Telegram (use Markdown). Be helpful, direct, and professional. If the user hasn't specified an app they're working on, ask them about it.`,
        })

        // Add assistant response to history
        conversations[historyKey].push({ role: 'assistant', content: response })

        // Send response back via Telegram
        // Split long messages if needed (Telegram limit is 4096 chars)
        if (response.length > 4000) {
            const chunks = response.match(/.{1,4000}/gs) || [response]
            for (const chunk of chunks) {
                await sendAgentTelegram(agentId, chunk, chatId)
            }
        } else {
            await sendAgentTelegram(agentId, response, chatId)
        }

        return NextResponse.json({ ok: true })
    } catch (error: any) {
        console.error('[Telegram Webhook]', error)
        // Don't return error to Telegram — it will retry
        return NextResponse.json({ ok: true })
    }
}
