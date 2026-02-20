/**
 * Telegram Bot Polling — Makes all 7 agent bots LIVE
 * 
 * This script runs as a background process and polls Telegram for new messages.
 * When a message arrives, it routes it through the AI agent system (Groq + OpenClaw skills)
 * and sends the response back through the bot.
 * 
 * Usage: node scripts/telegram-poll.js
 */

const fs = require('fs')
const path = require('path')

// ── Load environment ──
const envPath = path.join(__dirname, '..', '.env.local')
const envFile = fs.readFileSync(envPath, 'utf-8')
envFile.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
        process.env[trimmed.substring(0, eqIdx)] = trimmed.substring(eqIdx + 1)
    }
})

// ── Agent config ──
const AGENTS = [
    { id: 'scout', name: 'Scout — Market Intelligence', tokenKey: 'TELEGRAM_BOT_TOKEN_SCOUT', groqKey: 'GROQ_API_KEY_SCOUT' },
    { id: 'namer', name: 'Namer — Brand Crafter', tokenKey: 'TELEGRAM_BOT_TOKEN_NAMER', groqKey: 'GROQ_API_KEY_NAMER' },
    { id: 'checker', name: 'Checker — Verification', tokenKey: 'TELEGRAM_BOT_TOKEN_CHECKER', groqKey: 'GROQ_API_KEY_CHECKER' },
    { id: 'pixel', name: 'Pixel — Design Studio', tokenKey: 'TELEGRAM_BOT_TOKEN_PIXEL', groqKey: 'GROQ_API_KEY_PIXEL' },
    { id: 'builder', name: 'Builder — Code Generation', tokenKey: 'TELEGRAM_BOT_TOKEN_BUILDER', groqKey: 'GROQ_API_KEY_BUILDER' },
    { id: 'shipper', name: 'Shipper — App Store Prep', tokenKey: 'TELEGRAM_BOT_TOKEN_SHIPPER', groqKey: 'GROQ_API_KEY_SHIPPER' },
    { id: 'buzz', name: 'Buzz — Marketing', tokenKey: 'TELEGRAM_BOT_TOKEN_BUZZ', groqKey: 'GROQ_API_KEY_BUZZ' },
]

// ── Conversation memory (in-memory, resets on restart) ──
const conversations = {}
const MAX_HISTORY = 20

// ── Load wizard session from disk (written by /api/session) ──
function loadWizardSession() {
    try {
        const sessionPath = path.join(__dirname, '..', '.session.json')
        const raw = fs.readFileSync(sessionPath, 'utf-8')
        return JSON.parse(raw)
    } catch {
        return null
    }
}

// ── Build per-agent wizard context ──
const AGENT_WIZARD_ROLES = {
    scout: { stage: 'Idea (Stage 1)', task: 'You helped the user research and validate their app idea. You analyze markets, competitors, and profit potential. When chatting, reference the specific app idea and market insights.' },
    namer: { stage: 'Name (Stage 2)', task: 'You helped the user pick the perfect name, check domain availability, and secure social media handles. Reference the chosen name and any domains/handles that were checked.' },
    checker: { stage: 'Name Verification (Stage 2b)', task: 'You verify trademark availability, domain registrations, and social media handle conflicts. Reference any verification results.' },
    pixel: { stage: 'Brand (Stage 3)', task: 'You designed the app icon, color palette, and visual brand identity. Reference the brand template, colors, and icon that were chosen.' },
    builder: { stage: 'Build (Stage 4)', task: 'You generate the Expo/React Native project code. You create the actual app screens, navigation, and functionality. Reference the app architecture and code you generated.' },
    shipper: { stage: 'Store & Submit (Stages 6-8)', task: 'You prepare App Store metadata, descriptions, keywords, and handle the submission process. Reference the store listing content.' },
    buzz: { stage: 'Marketing & Landing (Stages 5-7)', task: 'You create the 30-day marketing plan, landing page, social media content, and launch strategy. Reference the marketing materials you generated.' },
}

function buildSessionContext(agentId) {
    const session = loadWizardSession()
    if (!session) return ''

    const role = AGENT_WIZARD_ROLES[agentId]
    const appName = session.appName || session.selectedName || null
    const idea = session.idea || session.ideaText || null
    const stage = session.currentStage || null

    let ctx = '\n\n--- CURRENT WIZARD SESSION ---\n'
    if (appName) ctx += `App Name: ${appName}\n`
    if (idea) ctx += `App Idea: ${idea}\n`
    if (stage) ctx += `Current Stage: ${stage}\n`
    if (session.brandTemplate) ctx += `Brand: ${JSON.stringify(session.brandTemplate.colorPalette || {})}\n`
    if (session.selectedName) ctx += `Selected Name: ${session.selectedName}\n`
    if (session.storeData?.subtitle) ctx += `Subtitle: ${session.storeData.subtitle}\n`
    if (session.storeData?.description) ctx += `Description: ${session.storeData.description.substring(0, 200)}...\n`
    ctx += `\nYour role: ${role.task}\n`
    ctx += `Your wizard stage: ${role.stage}\n`
    ctx += '--- END SESSION ---\n'

    return ctx
}

// ── Load agent instructions from workspace files ──
function loadAgentContext(agentId) {
    const agentDir = path.join(__dirname, '..', 'agents', agentId)
    const parts = []

    for (const file of ['SOUL.md', 'AGENTS.md', 'USER.md']) {
        try {
            parts.push(fs.readFileSync(path.join(agentDir, file), 'utf-8'))
        } catch { /* file may not exist */ }
    }

    // Load skills
    const skillsDir = path.join(agentDir, 'skills')
    try {
        const skills = fs.readdirSync(skillsDir)
        for (const skill of skills) {
            const skillFile = path.join(skillsDir, skill, 'SKILL.md')
            try {
                parts.push(`\n--- SKILL: ${skill} ---\n` + fs.readFileSync(skillFile, 'utf-8'))
            } catch { /* skip */ }
        }
    } catch { /* no skills dir */ }

    return parts.join('\n\n---\n\n') || `You are ${agentId}, an AI agent for LaunchFleet.`
}

// ── Call Groq API ──
async function callGroq(agentId, groqKey, messages, systemPrompt) {
    const apiKey = process.env[groqKey] || process.env.GROQ_API_KEY
    if (!apiKey) {
        console.error(`[${agentId}] No Groq API key`)
        return 'Sorry, my AI backend is not configured. Please check the API keys.'
    }

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages,
                ],
                max_tokens: 2000,
                temperature: 0.7,
            }),
        })

        if (!res.ok) {
            const errText = await res.text()
            console.error(`[${agentId}] Groq error ${res.status}:`, errText.substring(0, 200))
            return `⚠️ AI processing error (${res.status}). I'll try again in a moment.`
        }

        const data = await res.json()
        return data.choices?.[0]?.message?.content || 'I had trouble generating a response. Please try again.'
    } catch (err) {
        console.error(`[${agentId}] Groq call failed:`, err.message)
        return '⚠️ Connection error. Please try again.'
    }
}

// ── Send Telegram message ──
async function sendMessage(token, chatId, text) {
    // Split long messages (Telegram limit: 4096 chars)
    const chunks = text.length > 4000 ? text.match(/.{1,4000}/gs) : [text]

    for (const chunk of chunks) {
        try {
            const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: chunk,
                    parse_mode: 'Markdown',
                }),
            })
            if (!res.ok) {
                // Retry without markdown if parsing fails
                await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: chunk }),
                })
            }
        } catch (err) {
            console.error('Send message failed:', err.message)
        }
    }
}

// ── Send typing indicator ──
async function sendTyping(token, chatId) {
    try {
        await fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
        })
    } catch { /* non-critical */ }
}

// ── Handle incoming message ──
async function handleMessage(agent, message) {
    const token = process.env[agent.tokenKey]
    const chatId = message.chat.id.toString()
    const text = message.text
    const userName = message.from?.first_name || 'User'

    if (!text) return // Ignore non-text messages

    console.log(`[${agent.id}] ${userName}: ${text.substring(0, 80)}`)

    // ── Command handlers ──
    if (text === '/start') {
        await sendMessage(token, chatId,
            `👋 Hey ${userName}! I'm *${agent.name}*.\n\n` +
            `I'm your LaunchFleet AI agent, powered by Llama 3.3 70B with OpenClaw skills.\n\n` +
            `Just tell me what you're working on and I'll help.\n\n` +
            `Commands:\n/start — Welcome\n/reset — Clear memory\n/skills — My capabilities\n/status — Check if I'm alive`
        )
        return
    }

    if (text === '/reset') {
        conversations[`${agent.id}:${chatId}`] = []
        await sendMessage(token, chatId, '🔄 Memory cleared. What are we working on?')
        return
    }

    if (text === '/skills') {
        const agentDir = path.join(__dirname, '..', 'agents', agent.id, 'skills')
        let skillList = '📦 No specialized skills loaded.'
        try {
            const skills = fs.readdirSync(agentDir)
            const loadedSkills = skills.filter(s => {
                try { return fs.statSync(path.join(agentDir, s)).isDirectory() } catch { return false }
            })
            if (loadedSkills.length > 0) {
                skillList = '🧠 *My skills:*\n\n' + loadedSkills.map(s => {
                    try {
                        const content = fs.readFileSync(path.join(agentDir, s, 'SKILL.md'), 'utf-8')
                        const title = content.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || s
                        return `• *${title}*`
                    } catch {
                        return `• ${s}`
                    }
                }).join('\n')
            }
        } catch { /* no skills dir */ }
        await sendMessage(token, chatId, skillList)
        return
    }

    if (text === '/status') {
        await sendMessage(token, chatId, `✅ *${agent.name}* is online.\n\nModel: Llama 3.3 70B (Groq)\nSkills: OpenClaw protocol\nMemory: ${(conversations[`${agent.id}:${chatId}`] || []).length / 2} exchanges`)
        return
    }

    // ── AI conversation ──
    const historyKey = `${agent.id}:${chatId}`
    if (!conversations[historyKey]) conversations[historyKey] = []

    // Add user message
    conversations[historyKey].push({ role: 'user', content: text })

    // Trim history
    if (conversations[historyKey].length > MAX_HISTORY * 2) {
        conversations[historyKey] = conversations[historyKey].slice(-MAX_HISTORY * 2)
    }

    // Show typing
    await sendTyping(token, chatId)

    // Load agent context (instructions + skills + wizard session)
    const agentContext = loadAgentContext(agent.id)
    const sessionContext = buildSessionContext(agent.id)
    const systemPrompt = agentContext + sessionContext + '\n\n' +
        `You are chatting with ${userName} on Telegram. ` +
        `Keep responses concise and well-formatted for Telegram (use Markdown bold and italic). ` +
        `Be helpful, direct, and professional. ` +
        `You know exactly what app the user is building because you are part of the LaunchFleet wizard pipeline. ` +
        `Reference the app by name and give specific, actionable advice for THIS app. ` +
        `Do not ask what they are building if the session context above already has the app name and idea.`

    // Call Groq
    const response = await callGroq(agent.id, agent.groqKey, conversations[historyKey], systemPrompt)

    // Save response to history
    conversations[historyKey].push({ role: 'assistant', content: response })

    // Send response
    await sendMessage(token, chatId, response)
    console.log(`[${agent.id}] → Replied (${response.length} chars)`)
}

// ── Poll for updates ──
const lastUpdateIds = {}

async function pollAgent(agent) {
    const token = process.env[agent.tokenKey]
    if (!token) return

    const offset = lastUpdateIds[agent.id] ? lastUpdateIds[agent.id] + 1 : undefined

    try {
        const url = `https://api.telegram.org/bot${token}/getUpdates?timeout=5&limit=10${offset ? `&offset=${offset}` : ''}`
        const res = await fetch(url)
        const data = await res.json()

        if (!data.ok || !data.result?.length) return

        for (const update of data.result) {
            lastUpdateIds[agent.id] = update.update_id

            if (update.message) {
                await handleMessage(agent, update.message)
            }
        }
    } catch (err) {
        // Silently retry on network errors
        if (!err.message?.includes('ETIMEDOUT')) {
            console.error(`[${agent.id}] Poll error:`, err.message)
        }
    }
}

// ── Main loop ──
async function main() {
    console.log('═══════════════════════════════════════════')
    console.log('  LaunchFleet Telegram Agents — LIVE')
    console.log('═══════════════════════════════════════════')
    console.log('')

    // First, delete any existing webhooks so polling works
    for (const agent of AGENTS) {
        const token = process.env[agent.tokenKey]
        if (!token) {
            console.log(`⚠️  ${agent.id}: No token, skipping`)
            continue
        }
        try {
            await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`)
            const me = await fetch(`https://api.telegram.org/bot${token}/getMe`).then(r => r.json())
            console.log(`✅ ${agent.id}: @${me.result?.username} — listening`)
        } catch (err) {
            console.log(`❌ ${agent.id}: ${err.message}`)
        }
    }

    console.log('')
    console.log('Listening for messages... (Ctrl+C to stop)')
    console.log('')

    // Poll all agents in parallel, every 2 seconds
    while (true) {
        await Promise.all(AGENTS.map(agent => pollAgent(agent)))
        await new Promise(resolve => setTimeout(resolve, 2000))
    }
}

main().catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
})
