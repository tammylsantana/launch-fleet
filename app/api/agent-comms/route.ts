import { NextRequest, NextResponse } from 'next/server'
import { callAgent, sendAgentTelegram } from '@/lib/ai'
import type { AgentId } from '@/lib/ai'

/**
 * POST /api/agent-comms
 * Inter-agent communication channel
 * Allows agents to message each other and coordinate during the build pipeline
 *
 * Actions:
 *   - "handoff" — pass context from one agent to the next in the pipeline
 *   - "broadcast" — send a message to all agents (Telegram group)
 *   - "ask" — one agent asks another agent a question and gets a response
 *   - "notify" — send a status update to Telegram
 */
export async function POST(req: NextRequest) {
    try {
        const { action, from, to, message, session } = await req.json()

        switch (action) {
            /* ── Handoff: pass context from agent A → agent B ───────── */
            case 'handoff': {
                const fromId = from as AgentId
                const toId = to as AgentId

                // Notify receiving agent via Telegram
                const handoffMsg = `📋 *Handoff from ${from}*\n\n${message}\n\n_App: ${session?.appName || 'Unnamed'}_`
                await sendAgentTelegram(toId, handoffMsg)

                // Also notify the sender that handoff was delivered
                await sendAgentTelegram(fromId, `✅ Handed off to ${to}: "${message.slice(0, 60)}..."`)

                return NextResponse.json({ success: true, action: 'handoff', from, to })
            }

            /* ── Broadcast: all agents get the message ──────────────── */
            case 'broadcast': {
                const fromId = from as AgentId
                const broadcastMsg = `📢 *${from} to all agents:*\n\n${message}\n\n_App: ${session?.appName || 'Unnamed'}_`

                const agents: AgentId[] = ['scout', 'namer', 'checker', 'pixel', 'builder', 'shipper', 'buzz']
                const results = await Promise.allSettled(
                    agents
                        .filter(a => a !== fromId)
                        .map(a => sendAgentTelegram(a, broadcastMsg))
                )

                const delivered = results.filter(r => r.status === 'fulfilled' && r.value).length

                return NextResponse.json({ success: true, action: 'broadcast', delivered, total: agents.length - 1 })
            }

            /* ── Ask: agent A asks agent B a question, gets AI response ─ */
            case 'ask': {
                const toId = to as AgentId

                const contextPrompt = `You are ${to}, responding to a question from ${from} about the app "${session?.appName || 'the current app'}".

APP IDEA: ${session?.ideaText || session?.idea || 'Not specified'}
BRAND: ${session?.brandTemplate?.name || 'Not selected yet'}

${from} asks you: "${message}"

Respond naturally, in your agent personality. Be specific and actionable. Keep it concise — 2-3 sentences max.`

                const response = await callAgent(toId, contextPrompt, {
                    maxTokens: 500,
                    temperature: 0.6,
                })

                // Send the exchange to Telegram so user can follow along
                const telegramMsg = `💬 *${from} → ${to}:* "${message}"\n\n*${to} responds:* ${response}`
                await sendAgentTelegram(toId, telegramMsg)

                return NextResponse.json({
                    success: true,
                    action: 'ask',
                    from,
                    to,
                    question: message,
                    response,
                })
            }

            /* ── Notify: status update to Telegram ──────────────────── */
            case 'notify': {
                const fromId = from as AgentId
                const statusMsg = `🔔 *${from} status:* ${message}\n_App: ${session?.appName || 'Unnamed'}_`
                await sendAgentTelegram(fromId, statusMsg)

                return NextResponse.json({ success: true, action: 'notify' })
            }

            /* ── Roll Call: all agents check in with status ─────────── */
            case 'rollcall': {
                const agents: AgentId[] = ['scout', 'namer', 'checker', 'pixel', 'builder', 'shipper', 'buzz']
                const headcount: { agent: string; status: 'online' | 'offline'; role: string; report: string; responseMs: number }[] = []

                const agentRoles: Record<AgentId, string> = {
                    scout: 'Market Research',
                    namer: 'Name Generation & Brandability',
                    checker: 'Trademark & Domain Verification',
                    pixel: 'Visual Design & App Icon',
                    builder: 'Code Generation (Expo)',
                    shipper: 'App Store Submission',
                    buzz: 'Social Media & Marketing',
                }

                await Promise.allSettled(agents.map(async (agentId) => {
                    const start = Date.now()
                    try {
                        const report = await callAgent(agentId, `Roll call! Report your current status in one sentence. What are you ready to work on? Include your name and role.`, {
                            maxTokens: 80,
                            temperature: 0.5,
                        })
                        headcount.push({
                            agent: agentId,
                            status: 'online',
                            role: agentRoles[agentId],
                            report: report.trim().slice(0, 120),
                            responseMs: Date.now() - start,
                        })
                    } catch {
                        headcount.push({
                            agent: agentId,
                            status: 'offline',
                            role: agentRoles[agentId],
                            report: 'No response — Groq key may be missing',
                            responseMs: Date.now() - start,
                        })
                    }
                }))

                const online = headcount.filter(a => a.status === 'online').length
                const offline = headcount.filter(a => a.status === 'offline').length

                // Send headcount summary to Telegram
                const rollcallMsg = `🎯 *Agent Roll Call*\n\n` +
                    `✅ Online: ${online} | ❌ Offline: ${offline}\n\n` +
                    headcount.map(a =>
                        `${a.status === 'online' ? '✅' : '❌'} *${a.agent}* (${a.role})\n   ${a.report}\n   _${a.responseMs}ms_`
                    ).join('\n\n')

                // Send via first available agent's Telegram
                const firstOnline = headcount.find(a => a.status === 'online')
                if (firstOnline) {
                    await sendAgentTelegram(firstOnline.agent as AgentId, rollcallMsg)
                }

                return NextResponse.json({
                    success: true,
                    action: 'rollcall',
                    online,
                    offline,
                    total: agents.length,
                    headcount,
                })
            }

            default:
                return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
        }
    } catch (error: unknown) {
        console.error('[Agent Comms]', error)
        const msg = error instanceof Error ? error.message : 'Communication failed'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}

/**
 * GET /api/agent-comms
 * Check which agents are live (have Telegram tokens configured)
 */
export async function GET() {
    const agents: AgentId[] = ['scout', 'namer', 'checker', 'pixel', 'builder', 'shipper', 'buzz']

    const status = agents.map(id => ({
        id,
        hasGroqKey: !!process.env[`GROQ_API_KEY_${id.toUpperCase()}`],
        hasTelegram: !!process.env[`TELEGRAM_BOT_TOKEN_${id.toUpperCase()}`],
        live: !!process.env[`GROQ_API_KEY_${id.toUpperCase()}`],
    }))

    return NextResponse.json({
        agents: status,
        totalLive: status.filter(a => a.live).length,
        totalWithTelegram: status.filter(a => a.hasTelegram).length,
    })
}
