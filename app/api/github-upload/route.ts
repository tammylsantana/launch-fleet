import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/github-upload
 * Stage 8: Submit — Creates a GitHub repo with the project files
 * In production, uses GitHub API with user's token
 * For now, returns a simulated URL
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { session } = body

        const appName = session?.appName || session?.selectedName || 'my-app'
        const appSlug = appName.toLowerCase().replace(/\s+/g, '-')

        const githubToken = process.env.GITHUB_TOKEN
        if (!githubToken) {
            // Return a simulated URL when no token is configured
            return NextResponse.json({
                url: `https://github.com/launchfleet/${appSlug}`,
                simulated: true,
                message: 'GitHub token not configured. In production, this creates a real repo.',
            })
        }

        // Create repository via GitHub API
        const createRes = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                name: appSlug,
                description: `${appName} — Built with LaunchFleet`,
                private: true,
                auto_init: true,
            }),
        })

        if (!createRes.ok) {
            const err = await createRes.text()
            console.error('[GitHub API]', err)
            return NextResponse.json({ error: 'Failed to create repository' }, { status: 500 })
        }

        const repo = await createRes.json()

        return NextResponse.json({
            url: repo.html_url,
            cloneUrl: repo.clone_url,
            simulated: false,
        })
    } catch (error: any) {
        console.error('[GitHub Upload API]', error)
        return NextResponse.json({ error: error.message || 'GitHub upload failed' }, { status: 500 })
    }
}
