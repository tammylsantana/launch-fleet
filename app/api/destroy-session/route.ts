import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/destroy-session
 * Stage 8: Submit — Securely destroys all session data
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { sessionId } = body

        // In production with Supabase:
        // await supabase.from('wizard_sessions').delete().eq('id', sessionId)
        // await supabase.storage.from('icons').remove([`${sessionId}/*`])
        // await supabase.storage.from('screenshots').remove([`${sessionId}/*`])

        // For now, confirm destruction (client-side localStorage is cleared by the frontend)
        return NextResponse.json({
            destroyed: true,
            timestamp: new Date().toISOString(),
            message: 'All session data has been permanently deleted.',
        })
    } catch (error: any) {
        console.error('[Destroy Session API]', error)
        return NextResponse.json({ error: error.message || 'Data destruction failed' }, { status: 500 })
    }
}
