/**
 * Groq AI — Per-agent Llama 3.3 70B caller
 * Each agent has its own Groq API key for independent rate limits.
 * Instructions loaded from agents/{id}/AGENTS.md (OpenClaw protocol)
 * Skills loaded from agents/{id}/skills/{skill-name}/SKILL.md
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

export type AgentId = 'scout' | 'namer' | 'checker' | 'pixel' | 'builder' | 'shipper' | 'buzz'

interface AgentCallOptions {
    maxTokens?: number
    temperature?: number
    systemPrompt?: string
}

// Map agent IDs to their Groq API key env var names
const AGENT_KEYS: Record<AgentId, string> = {
    scout: 'GROQ_API_KEY_SCOUT',
    namer: 'GROQ_API_KEY_NAMER',
    checker: 'GROQ_API_KEY_CHECKER',
    pixel: 'GROQ_API_KEY_PIXEL',
    builder: 'GROQ_API_KEY_BUILDER',
    shipper: 'GROQ_API_KEY_SHIPPER',
    buzz: 'GROQ_API_KEY_BUZZ',
}

// Map agent IDs to their Telegram bot token env var names
const AGENT_TELEGRAM: Record<AgentId, string> = {
    scout: 'TELEGRAM_BOT_TOKEN_SCOUT',
    namer: 'TELEGRAM_BOT_TOKEN_NAMER',
    checker: 'TELEGRAM_BOT_TOKEN_CHECKER',
    pixel: 'TELEGRAM_BOT_TOKEN_PIXEL',
    builder: 'TELEGRAM_BOT_TOKEN_BUILDER',
    shipper: 'TELEGRAM_BOT_TOKEN_SHIPPER',
    buzz: 'TELEGRAM_BOT_TOKEN_BUZZ',
}

// Cache loaded instructions
const instructionCache: Record<string, string> = {}

/**
 * Load an agent's full workspace context (AGENTS.md + SOUL.md + USER.md)
 * Following OpenClaw protocol: each agent has a workspace with identity files
 */
export function loadAgentInstructions(agentId: AgentId): string {
    if (instructionCache[agentId]) return instructionCache[agentId]

    const agentDir = join(process.cwd(), 'agents', agentId)
    const parts: string[] = []

    // Load SOUL.md (core identity)
    try {
        parts.push(readFileSync(join(agentDir, 'SOUL.md'), 'utf-8'))
    } catch { /* no soul file */ }

    // Load AGENTS.md (detailed instructions)
    try {
        parts.push(readFileSync(join(agentDir, 'AGENTS.md'), 'utf-8'))
    } catch { /* no agents file */ }

    // Load USER.md (user context)
    try {
        parts.push(readFileSync(join(agentDir, 'USER.md'), 'utf-8'))
    } catch { /* no user file */ }

    const content = parts.filter(Boolean).join('\n\n---\n\n')
    if (content) instructionCache[agentId] = content
    return content || `You are ${agentId}, an AI agent for LaunchFleet.`
}

/**
 * Load a specific skill from agents/{id}/skills/{skillName}/SKILL.md
 * OpenClaw protocol: skills are directories containing SKILL.md
 */
export function loadAgentSkill(agentId: AgentId, skillName: string): string {
    try {
        const filePath = join(process.cwd(), 'agents', agentId, 'skills', skillName, 'SKILL.md')
        return readFileSync(filePath, 'utf-8')
    } catch {
        return ''
    }
}

/**
 * Get all skill directories for an agent
 */
export function getAgentSkills(agentId: AgentId): string[] {
    try {
        const skillsDir = join(process.cwd(), 'agents', agentId, 'skills')
        const entries = readdirSync(skillsDir)
        return entries.filter((entry: string) => {
            try {
                return statSync(join(skillsDir, entry)).isDirectory()
            } catch {
                return false
            }
        })
    } catch {
        return []
    }
}

/**
 * Get an agent's Telegram bot token
 */
export function getAgentTelegramToken(agentId: AgentId): string | undefined {
    return process.env[AGENT_TELEGRAM[agentId]]
}

/**
 * Send a message to the user's Telegram via an agent's bot
 */
export async function sendAgentTelegram(
    agentId: AgentId,
    message: string,
    chatId?: string
): Promise<boolean> {
    const token = getAgentTelegramToken(agentId)
    const targetChat = chatId || process.env.TELEGRAM_CHAT_ID
    if (!token || !targetChat) return false

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: targetChat,
                text: message,
                parse_mode: 'Markdown',
            }),
        })
        return response.ok
    } catch {
        return false
    }
}

/**
 * Call Groq API with an agent's dedicated key and instructions
 */
export async function callAgent(
    agentId: AgentId,
    prompt: string,
    options: AgentCallOptions = {}
): Promise<string> {
    const keyEnv = AGENT_KEYS[agentId]
    const apiKey = process.env[keyEnv] || process.env.GROQ_API_KEY
    if (!apiKey) throw new Error(`No Groq API key for agent ${agentId} — check ${keyEnv} in .env.local`)

    // Build system prompt from workspace files + skills
    const instructions = loadAgentInstructions(agentId)
    const skills = getAgentSkills(agentId)
    const skillContent = skills.map(s => loadAgentSkill(agentId, s)).filter(Boolean).join('\n\n---\n\n')

    const systemPrompt = [
        options.systemPrompt || '',
        instructions,
        skillContent ? `\n\nSKILLS:\n${skillContent}` : '',
    ].filter(Boolean).join('\n\n')

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            max_tokens: options.maxTokens || 2000,
            temperature: options.temperature ?? 0.7,
        }),
    })

    if (!response.ok) {
        const err = await response.text()
        console.error(`[Groq/${agentId}] API error ${response.status}:`, err)
        throw new Error(`Agent ${agentId} failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
}

/**
 * Call agent with conversation history (for chat interfaces like Stage 1)
 */
export async function callAgentChat(
    agentId: AgentId,
    messages: { role: 'user' | 'assistant'; content: string }[],
    options: AgentCallOptions = {}
): Promise<string> {
    const keyEnv = AGENT_KEYS[agentId]
    const apiKey = process.env[keyEnv] || process.env.GROQ_API_KEY
    if (!apiKey) throw new Error(`No Groq API key for agent ${agentId}`)

    const instructions = loadAgentInstructions(agentId)
    const skills = getAgentSkills(agentId)
    const skillContent = skills.map(s => loadAgentSkill(agentId, s)).filter(Boolean).join('\n\n---\n\n')

    const systemPrompt = [
        options.systemPrompt || '',
        instructions,
        skillContent ? `\n\nSKILLS:\n${skillContent}` : '',
    ].filter(Boolean).join('\n\n')

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
            max_tokens: options.maxTokens || 3000,
            temperature: options.temperature ?? 0.7,
        }),
    })

    if (!response.ok) throw new Error(`Agent ${agentId} chat failed: ${response.status}`)

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
}
