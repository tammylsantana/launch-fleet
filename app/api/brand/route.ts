import { NextRequest, NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'

/**
 * POST /api/brand
 * Stage 3: Brand — Pixel generates brand identity
 * 
 * Accepts: { appName, idea, category, audience }
 * Returns: { brand: BrandIdentity }
 */
export async function POST(req: NextRequest) {
    try {
        const { appName, idea, category, audience } = await req.json()

        const prompt = `Create a complete brand identity for this app:

APP NAME: ${appName || 'Untitled'}
IDEA: ${idea || 'A mobile app'}
CATEGORY: ${category || 'General'}
AUDIENCE: ${audience || 'General'}

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "templateA": {
    "name": "Conservative Template Name",
    "style": "Brief style description",
    "colors": {
      "primary": "#hex",
      "secondary": "#hex",
      "background": "#hex",
      "surface": "#hex",
      "textPrimary": "#hex",
      "textSecondary": "#hex"
    },
    "fonts": {
      "heading": "Google Font Name",
      "body": "Google Font Name"
    },
    "iconDirection": "Detailed description of what the app icon should look like"
  },
  "templateB": {
    "name": "Bold Template Name",
    "style": "Brief style description",
    "colors": {
      "primary": "#hex",
      "secondary": "#hex",
      "background": "#hex",
      "surface": "#hex",
      "textPrimary": "#hex",
      "textSecondary": "#hex"
    },
    "fonts": {
      "heading": "Google Font Name",
      "body": "Google Font Name"
    },
    "iconDirection": "Detailed description of what the app icon should look like"
  },
  "colorRationale": "Why these colors work for this category",
  "fontRationale": "Why these font pairings work"
}`

        const response = await callAgent('pixel', prompt, {
            maxTokens: 2000,
            temperature: 0.7,
        })

        let brand: any = {}
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                brand = JSON.parse(jsonMatch[0])
            }
        } catch {
            brand = { error: 'Could not parse brand identity — try again' }
        }

        return NextResponse.json({
            brand,
            agent: 'pixel',
        })
    } catch (error: any) {
        console.error('[Brand API]', error)
        return NextResponse.json(
            { error: error.message || 'Brand generation failed' },
            { status: 500 }
        )
    }
}
