import { NextRequest, NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'

/**
 * POST /api/store-content
 * Stage 7: Store — Shipper agent auto-fills all App Store Connect fields
 * Uses comprehensive prompt with full session context for accurate, ASO-optimized content
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session } = body

    const appName = session?.appName || session?.selectedName || 'App'
    const appIdea = session?.idea || session?.ideaText || ''
    const brandTemplate = session?.brandTemplate
    const category = session?.category || ''
    const icon = session?.icon
    const deployUrl = session?.deployUrl || ''
    const slug = appName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const year = new Date().getFullYear()

    // Derive best-guess category from brand template or idea
    const brandBestFor = brandTemplate?.bestFor?.join(', ') || ''
    const brandName = brandTemplate?.name || ''
    const brandStyle = brandTemplate?.style || 'Light'

    const prompt = `You are an expert App Store Optimization (ASO) consultant who has launched 500+ iOS apps.
Your job: generate EVERY App Store Connect field for "${appName}" so the developer can submit immediately.

=== APP CONTEXT ===
App Name: ${appName}
App Idea: ${appIdea}
Brand Template: ${brandName} (${brandStyle} mode)
Best For Categories: ${brandBestFor}
Has Custom Icon: ${icon ? 'Yes' : 'No'}
Landing Page URL: ${deployUrl || 'Not yet deployed'}
Bundle ID: com.launchfleet.${slug}
SKU: LF-${slug}-${year}

=== INSTRUCTIONS FOR EACH FIELD ===

**subtitle** (max 30 chars): Write a compelling subtitle that complements the app name and highlights the core value proposition. Use action words. Example: "Track Goals. Build Habits." — NOT just repeating the app name.

**primaryCategory**: Pick the BEST matching Apple category from this exact list: Books, Business, Developer Tools, Education, Entertainment, Finance, Food & Drink, Games, Graphics & Design, Health & Fitness, Lifestyle, Medical, Music, Navigation, News, Photo & Video, Productivity, Reference, Shopping, Social Networking, Sports, Travel, Utilities, Weather. Base this on the app idea and brand category tags.

**secondaryCategory**: Pick a second relevant category from the same list, or "None" if nothing fits well.

**description** (max 4000 chars, aim for 800-1500): Write a compelling App Store description optimized for ASO. Structure:
- Opening hook (1-2 sentences explaining the core benefit)
- Feature list with bullet-style formatting using line breaks
- Social proof line (mention the technology behind it)
- Call to action
Use the brand category context to tailor the language. Do NOT use markdown, use plain text with line breaks.

**keywords** (max 100 chars): Comma-separated keywords for ASO. Use ALL 100 characters. Include:
- Primary function keywords
- Competitor alternative keywords
- Long-tail variations
- Category-specific terms
Do NOT include the app name (Apple already indexes it). No spaces after commas.

**promotionalText** (max 170 chars): This appears above the description and can be changed without a new build. Write something timely and action-oriented.

**whatsNew** (max 4000 chars, keep ~200 chars): Write natural release notes for v1.0. Mention 3-4 key features.

**privacyUrl**: Use "${deployUrl ? deployUrl + '/privacy' : 'https://' + slug + '.app/privacy'}"

**dataCollection**: Based on the app idea, determine if the app likely collects data. Most apps with accounts collect data. Output exactly: "App does not collect any data" OR "App collects data"

**dataTypes**: If data is collected, list the specific Apple privacy label data types relevant to this app (e.g., "Contact Info, Usage Data, Identifiers" for a social app; "Health & Fitness, Usage Data" for a wellness app). If no data collected, leave empty.

**dataLinked**: "Yes" if the app has user accounts, "No" if it's a utility with no accounts.

**trackingEnabled**: "No tracking" unless the app idea specifically mentions ads or attribution.

**requiredReasonAPIs**: List any Required Reason APIs the app likely uses. Most Expo/React Native apps use: "UserDefaults (C617.1), File timestamp (35F9.1), System boot time (3D61.1)". If unsure, include these common ones.

**thirdPartySDKs**: Based on the app idea, list likely SDKs: "Expo SDK, React Navigation" as minimum. Add relevant ones like "Supabase SDK" for backend, "RevenueCat SDK" for subscriptions, "Sentry SDK" for error tracking.

**usesGenAI**: Analyze the app idea — if it involves AI/ML features, chatbots, content generation, or smart recommendations, answer "Yes". Otherwise "No".

**aiDisclosure**: If usesGenAI is Yes, describe the AI features in 1-2 sentences. If No, leave empty.

**aiLabeling**: If usesGenAI is Yes, use "AI content is clearly labeled". If No, use "N/A".

**aiModeration**: If usesGenAI is Yes and the app generates user-facing content, use "Moderated". Otherwise "N/A".

**aiDataSources**: If usesGenAI is Yes, describe data sources (e.g., "OpenAI GPT-4 API for text generation"). If No, leave empty.

**deepfakeProtection**: "Not applicable" unless the app generates images of people.

**reviewNotes**: Write helpful, specific notes for the Apple reviewer. Include:
- What the app does in 1 sentence
- How to test the main features
- Note any special configuration needed
- Mention if demo account credentials are provided

=== OUTPUT FORMAT ===
Respond with ONLY a raw JSON object (no markdown, no code fences, no explanation). Every value must be a string.
Include ALL of these field IDs:
{
  "appName": "${appName}",
  "subtitle": "...",
  "primaryCategory": "...",
  "secondaryCategory": "...",
  "description": "...",
  "keywords": "...",
  "supportUrl": "${deployUrl || 'https://' + slug + '.app/support'}",
  "marketingUrl": "${deployUrl || 'https://' + slug + '.app'}",
  "promotionalText": "...",
  "whatsNew": "...",
  "bundleId": "com.launchfleet.${slug}",
  "sku": "LF-${slug}-${year}",
  "contentRights": "Does not contain third-party content",
  "copyrightHolder": "${year} LaunchFleet",
  "price": "Free",
  "availability": "All territories",
  "preOrder": "No",
  "iap": "...",
  "iapNote": "...",
  "privacyUrl": "...",
  "dataCollection": "...",
  "dataTypes": "...",
  "dataLinked": "...",
  "trackingEnabled": "No tracking",
  "thirdPartySDKs": "...",
  "privacyManifest": "Included in build",
  "requiredReasonAPIs": "...",
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
  "usesGenAI": "...",
  "aiDisclosure": "...",
  "aiLabeling": "...",
  "aiModeration": "...",
  "aiDataSources": "...",
  "deepfakeProtection": "Not applicable",
  "usesEncryption": "Yes — Standard HTTPS only",
  "encryptionExempt": "Yes",
  "frenchEncryption": "Not required",
  "reviewNotes": "...",
  "contactFirst": "LaunchFleet",
  "contactLast": "Support",
  "contactPhone": "+1-555-0100",
  "contactEmail": "support@launchfleet.app"
}`

    const response = await callAgent('shipper', prompt, {
      maxTokens: 4000,
      temperature: 0.3,
    })

    let fields: Record<string, string> = {}
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) fields = JSON.parse(jsonMatch[0])
    } catch {
      // Fallback with intelligent defaults
      fields = {
        appName,
        subtitle: appIdea.length > 30 ? appIdea.slice(0, 27) + '...' : appIdea,
        bundleId: `com.launchfleet.${slug}`,
        sku: `LF-${slug}-${year}`,
        supportUrl: deployUrl || `https://${slug}.app/support`,
        marketingUrl: deployUrl || `https://${slug}.app`,
        copyrightHolder: `${year} LaunchFleet`,
        privacyUrl: deployUrl ? `${deployUrl}/privacy` : `https://${slug}.app/privacy`,
        whatsNew: 'Initial release.',
        usesEncryption: 'Yes — Standard HTTPS only',
        encryptionExempt: 'Yes',
      }
    }

    return NextResponse.json({
      fields,
      agent: 'shipper',
    })
  } catch (error: unknown) {
    console.error('[Store Content API]', error)
    const message = error instanceof Error ? error.message : 'Store content generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
