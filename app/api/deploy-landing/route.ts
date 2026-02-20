import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/deploy-landing
 * Stage 6: Landing — Deploy generated HTML to Vercel
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { session, html } = body

        const vercelToken = process.env.VERCEL_API_TOKEN
        if (!vercelToken) {
            return NextResponse.json({ error: 'Vercel token not configured' }, { status: 500 })
        }

        const appName = session?.appName || 'app'
        const projectName = `${appName.toLowerCase().replace(/\s+/g, '-')}-landing`
        const htmlContent = html || session?.landingHtml || '<html><body><h1>Landing page</h1></body></html>'

        // Deploy to Vercel using the File API
        const response = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${vercelToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: projectName,
                files: [
                    {
                        file: 'index.html',
                        data: Buffer.from(htmlContent).toString('base64'),
                        encoding: 'base64',
                    },
                ],
                projectSettings: {
                    framework: null,
                },
            }),
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('[Vercel Deploy]', err)
            return NextResponse.json({ error: 'Deployment failed' }, { status: 500 })
        }

        const data = await response.json()
        const deployUrl = `https://${data.url}`

        return NextResponse.json({
            deployUrl,
            deploymentId: data.id,
            status: data.readyState,
        })
    } catch (error: any) {
        console.error('[Deploy Landing API]', error)
        return NextResponse.json({ error: error.message || 'Deployment failed' }, { status: 500 })
    }
}
