import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '749c7493d59e429dd822dc75de051ba76430fa19cfaa4c33ab210c080bf210be'

// American voices mapped to each agent — distinct personalities
const AGENT_VOICES: Record<string, { voiceId: string; voiceName: string }> = {
    scout: { voiceId: 'pNInz6obpgDQGcFmaJgB', voiceName: 'Adam' },       // Male, deep, confident
    namer: { voiceId: '21m00Tcm4TlvDq8ikWAM', voiceName: 'Rachel' },     // Female, warm, articulate
    checker: { voiceId: 'VR6AewLTigWG4xSOukaG', voiceName: 'Arnold' },     // Male, authoritative
    pixel: { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Bella' },     // Female, energetic
    builder: { voiceId: 'ErXwobaYiN019PkySvjV', voiceName: 'Antoni' },     // Male, natural
    buzz: { voiceId: 'MF3mGyEYCl7XYWbV9V6O', voiceName: 'Elli' },      // Female, upbeat
    shipper: { voiceId: 'TxGEqnHWrfWFTfGW9XjX', voiceName: 'Josh' },     // Male, professional
}

// Text-to-Speech
export async function POST(req: NextRequest) {
    try {
        const { text, agentId } = await req.json()

        if (!text) {
            return NextResponse.json({ error: 'Missing text' }, { status: 400 })
        }

        const voice = AGENT_VOICES[agentId] || AGENT_VOICES.scout
        const voiceId = voice.voiceId

        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg',
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_turbo_v2_5',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.3,
                    use_speaker_boost: true,
                },
            }),
        })

        if (!res.ok) {
            const err = await res.text()
            return NextResponse.json({ error: `ElevenLabs error: ${err}` }, { status: res.status })
        }

        const audioBuffer = await res.arrayBuffer()
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
            },
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Get available voices for all agents
export async function GET() {
    return NextResponse.json({
        voices: Object.entries(AGENT_VOICES).map(([agentId, v]) => ({
            agentId,
            voiceId: v.voiceId,
            voiceName: v.voiceName,
        })),
    })
}
