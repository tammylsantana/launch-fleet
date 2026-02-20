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
 * Check if a domain is available via Vercel
 */
export async function checkDomain(domain: string): Promise<DomainCheckResult> {
    const token = process.env.VERCEL_ACCESS_TOKEN
    if (!token) return { domain, available: false }

    try {
        const res = await fetch(`${VERCEL_API}/v4/domains/status?name=${encodeURIComponent(domain)}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return { domain, available: false }

        const data = await res.json()
        const available = data.available === true

        if (available) {
            // Get price
            const priceRes = await fetch(`${VERCEL_API}/v4/domains/price?name=${encodeURIComponent(domain)}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (priceRes.ok) {
                const priceData = await priceRes.json()
                return {
                    domain,
                    available: true,
                    price: priceData.price,
                    period: priceData.period,
                    purchaseUrl: `https://vercel.com/domains/${domain}`,
                }
            }
        }

        return { domain, available }
    } catch (e) {
        console.error(`[Vercel] Domain check failed for ${domain}:`, e)
        return { domain, available: false }
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
