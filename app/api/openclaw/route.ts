import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_URL = 'http://127.0.0.1:18789'
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '089d6b6c1f81b578d8eb8c268a2fae8e8ab1aa8f5288eddd'

async function gatewayFetch(path: string) {
    const res = await fetch(`${GATEWAY_URL}${path}`, {
        headers: {
            'Authorization': `Bearer ${GATEWAY_TOKEN}`,
            'Accept': 'application/json',
        },
        cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Gateway ${res.status}: ${res.statusText}`)
    return res.json()
}

export async function GET(req: NextRequest) {
    const endpoint = req.nextUrl.searchParams.get('endpoint') || 'health'

    try {
        switch (endpoint) {
            case 'health': {
                const data = await gatewayFetch('/api/health')
                return NextResponse.json(data)
            }
            case 'agents': {
                const data = await gatewayFetch('/api/agents')
                return NextResponse.json(data)
            }
            case 'cron': {
                const data = await gatewayFetch('/api/cron/jobs')
                return NextResponse.json(data)
            }
            case 'skills': {
                const data = await gatewayFetch('/api/skills')
                return NextResponse.json(data)
            }
            case 'sessions': {
                const data = await gatewayFetch('/api/sessions')
                return NextResponse.json(data)
            }
            case 'usage': {
                const data = await gatewayFetch('/api/usage')
                return NextResponse.json(data)
            }
            default:
                return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 })
        }
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            hint: 'Is the OpenClaw gateway running? Try: openclaw gateway',
        }, { status: 502 })
    }
}

export async function POST(req: NextRequest) {
    const { action, jobId } = await req.json()

    try {
        switch (action) {
            case 'cron-run': {
                const res = await fetch(`${GATEWAY_URL}/api/cron/jobs/${jobId}/run`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` },
                })
                return NextResponse.json(await res.json())
            }
            case 'cron-enable': {
                const res = await fetch(`${GATEWAY_URL}/api/cron/jobs/${jobId}/enable`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` },
                })
                return NextResponse.json(await res.json())
            }
            case 'cron-disable': {
                const res = await fetch(`${GATEWAY_URL}/api/cron/jobs/${jobId}/disable`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` },
                })
                return NextResponse.json(await res.json())
            }
            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 502 })
    }
}
