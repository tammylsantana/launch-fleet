import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * POST /api/terminal
 * Execute shell commands for Builder agent's terminal panel
 * Restricted to safe Expo/npm commands in the projects directory
 */
export async function POST(req: NextRequest) {
    try {
        const { command } = await req.json()
        if (!command || typeof command !== 'string') {
            return NextResponse.json({ error: 'No command provided' }, { status: 400 })
        }

        // Safety: restrict to known-safe commands
        const allowedPrefixes = [
            'npx ', 'npm ', 'node ', 'expo ', 'eas ',
            'ls', 'pwd', 'cat ', 'head ', 'tail ', 'echo ',
            'mkdir ', 'cd ', 'which ', 'xcrun ',
            'git status', 'git log', 'git diff',
        ]

        const cmdTrimmed = command.trim()
        const isSafe = allowedPrefixes.some(p => cmdTrimmed.startsWith(p))

        if (!isSafe) {
            return NextResponse.json({
                output: `⚠ Command not allowed: "${cmdTrimmed}"\nOnly Expo, npm, git (read-only), and file inspection commands are permitted.`,
            })
        }

        const projectsDir = process.env.HOME
            ? `${process.env.HOME}/Documents/LaunchFleet Projects`
            : '/tmp/launchfleet-projects'

        // Ensure projects directory exists
        await execAsync(`mkdir -p "${projectsDir}"`)

        const { stdout, stderr } = await execAsync(cmdTrimmed, {
            cwd: projectsDir,
            timeout: 30000,
            maxBuffer: 1024 * 1024,
            env: { ...process.env, PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin` },
        })

        return NextResponse.json({
            output: (stdout + (stderr ? `\n${stderr}` : '')).trim() || 'Done.',
            cwd: projectsDir,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Command failed'
        return NextResponse.json({
            output: `⚠ ${message}`,
        })
    }
}
