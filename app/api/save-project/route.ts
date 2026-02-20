import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

/**
 * POST /api/save-project
 * Saves all project files to a portable folder on disk.
 * The folder lives at ~/Documents/LaunchFleet Projects/{appName}/
 * and contains everything the user needs to take with them.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { project } = body

        if (!project?.files?.length) {
            return NextResponse.json({ error: 'No project files to save' }, { status: 400 })
        }

        const appName = project.name || 'MyApp'
        const safeName = appName.replace(/[^a-zA-Z0-9\s-]/g, '').trim()

        // Create the project folder in ~/Documents/LaunchFleet Projects/
        const baseDir = join(homedir(), 'Documents', 'LaunchFleet Projects')
        const projectDir = join(baseDir, safeName)

        // Create base directory if it doesn't exist
        await mkdir(baseDir, { recursive: true })
        await mkdir(projectDir, { recursive: true })

        let savedCount = 0
        const errors: string[] = []

        for (const file of project.files) {
            try {
                const filePath = join(projectDir, file.path)
                const fileDir = filePath.substring(0, filePath.lastIndexOf('/'))

                // Ensure subdirectory exists
                await mkdir(fileDir, { recursive: true })

                // Write the file
                await writeFile(filePath, file.content, 'utf-8')
                savedCount++
            } catch (err: any) {
                errors.push(`${file.path}: ${err.message}`)
            }
        }

        // Also save the session data as a JSON file for re-importing
        try {
            const sessionPath = join(projectDir, '.launchfleet-session.json')
            await writeFile(sessionPath, JSON.stringify({
                savedAt: new Date().toISOString(),
                appName,
                slug: project.slug,
                generatedAt: project.generatedAt,
                fileCount: project.files.length,
            }, null, 2), 'utf-8')
        } catch { /* non-critical */ }

        return NextResponse.json({
            success: savedCount > 0,
            savedCount,
            totalFiles: project.files.length,
            projectPath: projectDir,
            errors: errors.length > 0 ? errors : undefined,
            message: `Saved ${savedCount} files to ${projectDir}`,
        })
    } catch (error: any) {
        console.error('[Save Project API]', error)
        return NextResponse.json({ error: error.message || 'Save failed' }, { status: 500 })
    }
}

/**
 * GET /api/save-project
 * Returns info about existing project folders
 */
export async function GET() {
    try {
        const baseDir = join(homedir(), 'Documents', 'LaunchFleet Projects')
        if (!existsSync(baseDir)) {
            return NextResponse.json({ projects: [], baseDir })
        }

        const { readdir, stat } = require('fs/promises')
        const entries = await readdir(baseDir)
        const projects = []

        for (const entry of entries) {
            const entryPath = join(baseDir, entry)
            const s = await stat(entryPath)
            if (s.isDirectory()) {
                projects.push({
                    name: entry,
                    path: entryPath,
                    lastModified: s.mtime.toISOString(),
                })
            }
        }

        return NextResponse.json({ projects, baseDir })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
