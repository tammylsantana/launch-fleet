import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ── Server-side Supabase (service role — full access) ──
let _serverClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
    if (!_serverClient) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (!url || !key) throw new Error('Supabase configuration missing — check .env.local')
        _serverClient = createClient(url, key)
    }
    return _serverClient
}

// ── Browser-side Supabase (anon key — RLS-enforced) ──
let _browserClient: SupabaseClient | null = null

export function getBrowserSupabase(): SupabaseClient {
    if (!_browserClient) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (!url || !key) throw new Error('Supabase configuration missing — check .env.local')
        _browserClient = createClient(url, key)
    }
    return _browserClient
}
