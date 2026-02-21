/**
 * Vercel Domains API — Real domain availability checks and purchase links
 */

const VERCEL_API = 'https://api.vercel.com'

interface DomainCheckResult {
    domain: string
    available: boolean
    price?: number
    period?: number
    purchaseUrl?: string
}

/**
 * Check if a domain is available using free DNS lookup via Cloudflare DoH
 * No DNS records = likely available. Purchase links go to Vercel.
 */
export async function checkDomain(domain: string): Promise<DomainCheckResult> {
    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 4000)
        const res = await fetch(
            `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`,
            {
                headers: { 'Accept': 'application/dns-json' },
                signal: controller.signal,
            }
        )
        clearTimeout(timeout)

        if (!res.ok) {
            return { domain, available: true, purchaseUrl: `https://vercel.com/domains/${domain}` }
        }

        const data = await res.json()
        // If there are Answer records, the domain is registered (taken)
        // If no answers or NXDOMAIN (Status 3), domain is likely available
        const available = !data.Answer || data.Answer.length === 0 || data.Status === 3

        return {
            domain,
            available,
            purchaseUrl: `https://vercel.com/domains/${domain}`,
        }
    } catch {
        // On error, assume available (optimistic)
        return { domain, available: true, purchaseUrl: `https://vercel.com/domains/${domain}` }
    }
}

/**
 * Check multiple domain extensions for a name
 */
export async function checkDomains(name: string, extensions = ['.com', '.ai', '.app']): Promise<DomainCheckResult[]> {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const checks = extensions.map(ext => checkDomain(`${cleanName}${ext}`))
    return Promise.all(checks)
}

/**
 * Check social media handle availability (best-effort via profile URL checks)
 */
export async function checkSocialHandles(handle: string): Promise<{
    platform: string
    handle: string
    available: boolean
    signupUrl: string
    profileUrl: string
}[]> {
    const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, '')

    const platforms = [
        { platform: 'instagram', checkUrl: `https://www.instagram.com/${cleanHandle}/`, signupUrl: `https://www.instagram.com/accounts/emailsignup/` },
        { platform: 'tiktok', checkUrl: `https://www.tiktok.com/@${cleanHandle}`, signupUrl: `https://www.tiktok.com/signup` },
        { platform: 'x', checkUrl: `https://x.com/${cleanHandle}`, signupUrl: `https://x.com/i/flow/signup` },
        { platform: 'youtube', checkUrl: `https://www.youtube.com/@${cleanHandle}`, signupUrl: `https://www.youtube.com/` },
        { platform: 'facebook', checkUrl: `https://www.facebook.com/${cleanHandle}`, signupUrl: `https://www.facebook.com/r.php` },
        { platform: 'threads', checkUrl: `https://www.threads.net/@${cleanHandle}`, signupUrl: `https://www.threads.net/` },
    ]

    const results = await Promise.all(
        platforms.map(async (p) => {
            try {
                const res = await fetch(p.checkUrl, { method: 'HEAD', redirect: 'follow' })
                // 404 = available, 200 = taken (rough heuristic)
                const available = res.status === 404
                return {
                    platform: p.platform,
                    handle: cleanHandle,
                    available,
                    signupUrl: p.signupUrl,
                    profileUrl: p.checkUrl,
                }
            } catch {
                return {
                    platform: p.platform,
                    handle: cleanHandle,
                    available: true, // assume available if we can't check
                    signupUrl: p.signupUrl,
                    profileUrl: p.checkUrl,
                }
            }
        })
    )

    return results
}
