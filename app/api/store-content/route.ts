import { NextRequest, NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'

/**
 * POST /api/store-content
 * Stage 7: Store — Shipper agent auto-fills all App Store Connect fields
 * Returns flat key-value object matching the Store page field IDs
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session } = body

    const appName = session?.appName || 'App'
    const appIdea = session?.idea || session?.ideaText || ''
    const category = session?.category || 'Productivity'
    const icon = session?.icon
    const deployUrl = session?.deployUrl || ''

    const prompt = `Auto-fill all App Store Connect fields for an app called "${appName}".

APP IDEA: ${appIdea}
CATEGORY: ${category}
LANDING PAGE: ${deployUrl}
HAS ICON: ${icon ? 'Yes' : 'No'}

Respond in this EXACT JSON format with these field IDs (no markdown, raw JSON only):
{
  "appName": "${appName}",
  "subtitle": "30-char subtitle",
  "primaryCategory": "One of: Books, Business, Developer Tools, Education, Entertainment, Finance, Food & Drink, Games, Graphics & Design, Health & Fitness, Lifestyle, Medical, Music, Navigation, News, Photo & Video, Productivity, Reference, Shopping, Social Networking, Sports, Travel, Utilities, Weather",
  "secondaryCategory": "or None",
  "description": "Compelling 400-800 char App Store description with line breaks",
  "keywords": "keyword1,keyword2,keyword3 — use all 100 chars",
  "supportUrl": "${deployUrl || 'https://support.example.com'}",
  "marketingUrl": "${deployUrl}",
  "promotionalText": "170-char promo text that can be changed without new build",
  "whatsNew": "Initial release with core features...",
  "bundleId": "com.launchfleet.${appName.toLowerCase().replace(/\\s+/g, '')}",
  "sku": "${appName.toLowerCase().replace(/\\s+/g, '-')}-001",
  "contentRights": "Does not contain third-party content",
  "copyrightHolder": "2025 LaunchFleet",
  "price": "Free",
  "availability": "All territories",
  "preOrder": "No",
  "iap": "Auto-Renewable Subscription",
  "privacyUrl": "${deployUrl ? deployUrl + '/privacy' : 'https://example.com/privacy'}",
  "dataCollection": "App collects data",
  "dataTypes": "List relevant data types",
  "dataLinked": "Yes",
  "trackingEnabled": "No tracking",
  "privacyManifest": "Included in build",
  "violenceCartoon": "None",
  "violenceRealistic": "None",
  "sexualContent": "None",
  "profanity": "None",
  "drugs": "None",
  "matureThemes": "None",
  "gambling": "None",
  "horror": "None",
  "medicalInfo": "None",
  "contestAndBets": "No",
  "unrestrictedWeb": "No",
  "ageTier": "4+",
  "usesGenAI": "Yes or No based on the app idea",
  "aiDisclosure": "Describe AI usage if applicable",
  "aiLabeling": "AI content is clearly labeled or N/A",
  "aiModeration": "Moderated or N/A",
  "usesEncryption": "Yes — Standard HTTPS only",
  "encryptionExempt": "Yes",
  "frenchEncryption": "Not required",
  "reviewNotes": "Detailed notes for the App Store reviewer",
  "contactFirst": "LaunchFleet",
  "contactLast": "Support",
  "contactPhone": "+1-555-0100",
  "contactEmail": "support@launchfleet.app"
}`

    const response = await callAgent('shipper', prompt, {
      maxTokens: 3000,
      temperature: 0.3,
    })

    let fields: Record<string, string> = {}
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) fields = JSON.parse(jsonMatch[0])
    } catch {
      // Minimal fallback
      fields = {
        appName,
        subtitle: appIdea.slice(0, 30),
        bundleId: `com.launchfleet.${appName.toLowerCase().replace(/\s+/g, '')}`,
        supportUrl: deployUrl,
        marketingUrl: deployUrl,
      }
    }

    return NextResponse.json({
      fields,
      agent: 'shipper',
    })
  } catch (error: any) {
    console.error('[Store Content API]', error)
    return NextResponse.json({ error: error.message || 'Store content generation failed' }, { status: 500 })
  }
}
