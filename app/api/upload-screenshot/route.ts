import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/upload-screenshot
 * Upload a base64 screenshot to Supabase Storage and return a public URL.
 * This is needed because screenshots.pro requires a public URL, not base64.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { imageData, filename, sessionId } = body as {
            imageData: string  // base64 data URL
            filename: string
            sessionId?: string
        }

        if (!imageData) {
            return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
                { status: 500 }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Extract base64 data from data URL
        const base64Match = imageData.match(/^data:image\/(\w+);base64,(.+)$/)
        if (!base64Match) {
            return NextResponse.json({ error: 'Invalid image data format' }, { status: 400 })
        }

        const mimeType = `image/${base64Match[1]}`
        const base64Data = base64Match[2]
        const buffer = Buffer.from(base64Data, 'base64')

        // Upload to Supabase Storage
        const folder = sessionId || 'general'
        const filePath = `screenshots/${folder}/${filename}`

        const { data, error } = await supabase.storage
            .from('assets')
            .upload(filePath, buffer, {
                contentType: mimeType,
                upsert: true,
            })

        if (error) {
            console.error('[Upload Screenshot]', error)
            return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('assets')
            .getPublicUrl(filePath)

        return NextResponse.json({
            success: true,
            publicUrl: urlData.publicUrl,
            path: filePath,
        })
    } catch (error: unknown) {
        console.error('[Upload Screenshot API]', error)
        const message = error instanceof Error ? error.message : 'Upload failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
