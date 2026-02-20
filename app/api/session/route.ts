import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const SESSION_FILE = join(process.cwd(), '.session.json')

/**
 * GET/POST /api/session
 * Wizard session persistence — stores all wizard state
 * Also saves to .session.json so Telegram bots can read current project context
 */
export async function POST(req: NextRequest) {
    try {
        const session = await req.json()

        // Save to disk so Telegram agents can access current wizard state
        try {
            await writeFile(SESSION_FILE, JSON.stringify({
                ...session,
                updatedAt: new Date().toISOString(),
            }, null, 2), 'utf-8')
        } catch { /* non-critical if file write fails */ }

        return NextResponse.json({ saved: true, sessionId: session.id || 'local' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET() {
    // Try to read from disk
    try {
        const { readFile } = require('fs/promises')
        const data = await readFile(SESSION_FILE, 'utf-8')
        return NextResponse.json({ session: JSON.parse(data) })
    } catch {
        return NextResponse.json({ session: null })
    }
}

