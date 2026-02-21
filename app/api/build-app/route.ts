import { NextRequest, NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'

/**
 * POST /api/build-app
 * Stage 4: Build — Builder agent generates a complete Expo/React Native project
 * Passes full session context: brand template, colors, fonts, category, idea, icon, API keys
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { session, apiKeys } = body

        const appName = session?.appName || session?.selectedName || 'MyApp'
        const appIdea = session?.idea || session?.ideaText || ''
        const brandTemplate = session?.brandTemplate
        const icon = session?.icon
        const slug = appName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

        // Build a rich, natural language prompt with all context
        const brandSection = brandTemplate ? `
BRAND TEMPLATE: "${brandTemplate.name}" (${brandTemplate.style} mode)
COLOR PALETTE:
  - Background: ${brandTemplate.colorPalette?.bg}
  - Surface (cards, inputs): ${brandTemplate.colorPalette?.surface}
  - Accent (buttons, links, active elements): ${brandTemplate.colorPalette?.accent}
  - Text: ${brandTemplate.colorPalette?.text}
FONTS:
  - Headlines: ${brandTemplate.fonts?.headline}
  - Body text: ${brandTemplate.fonts?.body}
BEST FOR: ${brandTemplate.bestFor?.join(', ') || 'General'}
` : `
BRAND TEMPLATE: Arctic Minimal (Light mode)
COLOR PALETTE: Background #FFFFFF, Surface #F2F2F7, Accent #007AFF, Text #1D1D1F
FONTS: SF Pro Display / SF Pro Text
BEST FOR: Productivity
`
        const keysAvailable = Object.keys(apiKeys || {}).filter(k => apiKeys[k])

        const prompt = `Build a complete React Native / Expo app called "${appName}".

APP IDEA: ${appIdea}

${brandSection}

APP ICON: ${icon ? 'A custom icon has been generated and is ready' : 'No custom icon yet — use a placeholder'}
BUNDLE ID: com.launchfleet.${slug}

API KEYS PROVIDED: ${keysAvailable.length > 0 ? keysAvailable.join(', ') : 'None — build the app to work with local mock data'}

YOUR TASK:
Generate a complete, working Expo project. Use your expo-project-scaffold skill for the file structure, your brand-to-code skill to apply the exact color palette and fonts throughout every screen, and your feature-screens skill to pick the right screens for this app's category.

The app must:
1. Use the exact hex colors from the palette above — background color on every screen, accent on all buttons and active elements, surface for all card backgrounds
2. Use the specified fonts for all headings and body text
3. Have 3-5 feature screens that make sense for the app idea and category
4. Include a 3-screen onboarding flow
5. Include an iOS WidgetKit widget showing real, meaningful data related to the app's purpose
6. Have a tab bar with blur glass effect using expo-blur
7. Use expo-haptics on every button and interactive element
8. Support both the app idea's core functionality and a settings/profile screen

Respond in this JSON format (raw JSON, no markdown fences):
{
  "files": [
    { "path": "app.json", "content": "..." },
    { "path": "constants/theme.ts", "content": "..." },
    { "path": "app/(tabs)/_layout.tsx", "content": "..." },
    { "path": "app/(tabs)/index.tsx", "content": "..." }
  ],
  "summary": "What you built and why these screens were chosen",
  "dependencies": ["expo", "react-native", ...],
  "buildInstructions": "npx expo start"
}`

        const response = await callAgent('builder', prompt, {
            maxTokens: 8000,
            temperature: 0.3,
        })

        let result: { files: Array<{ path: string; content: string }>; summary: string; dependencies: string[]; buildInstructions: string } = {
            files: [], summary: '', dependencies: [], buildInstructions: ''
        }
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) result = JSON.parse(jsonMatch[0])
        } catch {
            result = {
                files: [
                    { path: 'app.json', content: JSON.stringify({ expo: { name: appName, slug, version: '1.0.0', ios: { bundleIdentifier: `com.launchfleet.${slug}` } } }, null, 2) },
                ],
                summary: `Expo project scaffolded for ${appName}. Full generation requires retry.`,
                dependencies: ['expo', 'react-native', 'expo-router', 'expo-blur', 'expo-haptics'],
                buildInstructions: 'npx expo start',
            }
        }

        // Save build output to session
        return NextResponse.json({
            ...result,
            agent: 'builder',
            brandTemplate: brandTemplate || null,
            buildComplete: true,
        })
    } catch (error: unknown) {
        console.error('[Build App API]', error)
        const message = error instanceof Error ? error.message : 'Build failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
