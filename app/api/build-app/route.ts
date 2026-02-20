import { NextRequest, NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'

/**
 * POST /api/build-app
 * Stage 4: Build — Builder agent generates Expo/React Native project structure
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { session, theme, apiKeys } = body

        const appName = session?.appName || 'MyApp'
        const appIdea = session?.idea || session?.ideaText || ''
        const brandTemplate = session?.brandTemplate
        const icon = session?.icon

        const prompt = `Generate a complete React Native / Expo project structure for an app called "${appName}".

APP IDEA: ${appIdea}
THEME: ${theme || 'light'}
BRAND COLORS: ${brandTemplate ? JSON.stringify(brandTemplate.colorPalette) : 'Apple default'}
ICON: ${icon ? 'Custom icon generated' : 'Default'}

API KEYS AVAILABLE: ${Object.keys(apiKeys || {}).filter(k => apiKeys[k]).join(', ') || 'None specified'}

Generate:
1. app.json with correct name and bundle ID
2. App.tsx with tab navigation
3. 3-4 main screens based on the app idea
4. A theme file matching the brand
5. package.json with required dependencies

Respond in this JSON format:
{
  "files": [
    { "path": "app.json", "content": "..." },
    { "path": "App.tsx", "content": "..." }
  ],
  "summary": "Brief description of what was generated",
  "dependencies": ["expo", "react-native", ...],
  "buildInstructions": "npx expo start"
}`

        const response = await callAgent('builder', prompt, {
            maxTokens: 4000,
            temperature: 0.4,
        })

        let result: { files: Array<{ path: string; content: string }>; summary: string; dependencies: string[]; buildInstructions: string } = { files: [], summary: '', dependencies: [], buildInstructions: '' }
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) result = JSON.parse(jsonMatch[0])
        } catch {
            result = {
                files: [
                    { path: 'app.json', content: JSON.stringify({ expo: { name: appName, slug: appName.toLowerCase().replace(/\s+/g, '-') } }, null, 2) },
                ],
                summary: `Expo project generated for ${appName}`,
                dependencies: ['expo', 'react-native', '@react-navigation/native'],
                buildInstructions: 'npx expo start',
            }
        }

        return NextResponse.json({
            ...result,
            agent: 'builder',
            buildComplete: true,
        })
    } catch (error: any) {
        console.error('[Build App API]', error)
        return NextResponse.json({ error: error.message || 'Build failed' }, { status: 500 })
    }
}
