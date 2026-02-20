import { NextRequest, NextResponse } from 'next/server'
import { callAgentChat, callAgent } from '@/lib/ai'
import { runResearch } from '@/lib/brave-search'

/**
 * POST /api/chat
 * Multi-stage chat endpoint — routes to the correct agent based on stage
 * 
 * Stage "idea": Scout agent with Brave Search grounding
 * Stage "brand": Pixel agent for brand template generation
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { stage, messages, action, session, idea } = body

        // ── Stage: Brand template generation ──
        if (stage === 'brand' && action === 'generate-templates') {
            const appName = session?.appName || 'My App'
            const appIdea = session?.idea || session?.ideaText || ''
            const category = session?.category || ''

            const prompt = `Create two brand template options for an app called "${appName}".
App idea: ${appIdea}
Category: ${category}

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "templates": [
    {
      "id": "a",
      "name": "Template Name",
      "style": "Light or Dark",
      "colorPalette": { "primary": "#hex", "secondary": "#hex", "accent": "#hex", "bg": "#hex", "text": "#hex" },
      "fonts": { "headline": "Google Font Name", "body": "Google Font Name" },
      "iconPreview": "",
      "description": "2-sentence description of this template style and what category it's inspired by"
    },
    {
      "id": "b",
      "name": "Template Name",
      "style": "Light or Dark",
      "colorPalette": { "primary": "#hex", "secondary": "#hex", "accent": "#hex", "bg": "#hex", "text": "#hex" },
      "fonts": { "headline": "Google Font Name", "body": "Google Font Name" },
      "iconPreview": "",
      "description": "2-sentence description of this template style and what category it's inspired by"
    }
  ]
}`

            const response = await callAgent('pixel', prompt, { maxTokens: 2000, temperature: 0.7 })

            let templates = []
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0])
                    templates = parsed.templates || []
                }
            } catch {
                // Fallback templates
                templates = [
                    {
                        id: 'a', name: 'Clean Minimal', style: 'Light',
                        colorPalette: { primary: '#1D1D1F', secondary: '#F2F2F7', accent: '#007AFF', bg: '#FFFFFF', text: '#1D1D1F' },
                        fonts: { headline: 'Inter', body: 'Inter' },
                        iconPreview: '', description: 'White backgrounds, clean typography, subtle shadows. Inspired by top-selling productivity and utility apps.',
                    },
                    {
                        id: 'b', name: 'Bold Dark', style: 'Dark',
                        colorPalette: { primary: '#F5F5F7', secondary: '#2C2C2E', accent: '#FF9500', bg: '#1D1D1F', text: '#F5F5F7' },
                        fonts: { headline: 'Outfit', body: 'Inter' },
                        iconPreview: '', description: 'Dark backgrounds, high-contrast elements, vibrant accents. Inspired by top-selling entertainment and media apps.',
                    },
                ]
            }

            return NextResponse.json({ templates, agent: 'pixel' })
        }

        // ── Stage: Idea chat (Scout agent) ──
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
        }

        // Get the latest user message for research context
        const latestMessage = messages[messages.length - 1]?.content || idea || ''

        // Run Brave Search for real market data
        let researchContext = ''
        if (latestMessage && messages.length <= 4) {
            // Only run search on the first few messages
            const searchQueries = [
                `${latestMessage} app store competitors`,
                `${latestMessage} market size revenue 2024 2025`,
                `${latestMessage} mobile app trends`,
            ]
            try {
                researchContext = await runResearch(searchQueries)
            } catch (e) {
                console.warn('[Brave Search] Research failed, continuing without:', e)
            }
        }

        // Build enhanced messages with research data
        const chatMessages = messages.map((m: any) => ({
            role: m.role === 'agent' ? 'assistant' as const : 'user' as const,
            content: m.content,
        }))

        if (researchContext && chatMessages.length > 0) {
            const lastIdx = chatMessages.length - 1
            chatMessages[lastIdx] = {
                ...chatMessages[lastIdx],
                content: `${chatMessages[lastIdx].content}\n\n--- WEB RESEARCH RESULTS (live data) ---\n${researchContext}`,
            }
        }

        // Call Scout agent via Groq
        const reply = await callAgentChat('scout', chatMessages, {
            maxTokens: 3000,
            temperature: 0.5,
        })

        // After 3+ exchanges, generate a market report
        const userMessageCount = messages.filter((m: any) => m.role === 'user').length
        let marketReport: string | null = null
        let ideaComplete = false

        if (userMessageCount >= 2) {
            // Generate market report based on conversation
            const reportPrompt = `Based on our conversation, generate a concise market gap report. Include:
1. Market Overview (2-3 sentences)
2. Top 3 Competitors (name, rating, weakness)
3. Market Gap (what's missing)
4. Revenue Model (recommended monetization)
5. Risk Level (Low/Medium/High with reason)

Format as plain text with section headers. Be concise.

Conversation context:
${messages.map((m: any) => `${m.role}: ${m.content}`).join('\n').slice(0, 3000)}`

            try {
                marketReport = await callAgent('scout', reportPrompt, {
                    maxTokens: 1500,
                    temperature: 0.3,
                })
            } catch {
                // Market report is optional
            }

            if (userMessageCount >= 3) {
                ideaComplete = true
            }
        }

        // Build session data for persistence — always include the idea
        const firstUserMessage = messages.find((m: any) => m.role === 'user')?.content || ''
        const sessionData = {
            idea: firstUserMessage,
            ideaText: firstUserMessage,
            category: 'Auto-detected',
            audience: 'Auto-detected',
        }

        return NextResponse.json({
            reply,
            marketReport,
            ideaComplete,
            sessionData,
            agent: 'scout',
            researchQueries: researchContext ? 3 : 0,
        })
    } catch (error: any) {
        console.error('[Chat API]', error)
        return NextResponse.json(
            { error: error.message || 'Agent unavailable' },
            { status: 500 }
        )
    }
}
