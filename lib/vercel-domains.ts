/**
 * Vercel Domains API — Real domain availability checks and purchase links
 */

const VERCEL_API = 'https://api.vercel.com'

interface DomainCheckResult {
    domain: string
    available: boolean
    parked?: boolean
    parkingProvider?: string
    price?: number
    period?: number
    purchaseUrl?: string
}

/**
 * Check if a domain is available using DNS lookup via Cloudflare DoH
 * If registered, also check if it's a parked/for-sale domain
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
        const available = !data.Answer || data.Answer.length === 0 || data.Status === 3

        if (available) {
            return { domain, available: true, purchaseUrl: `https://vercel.com/domains/${domain}` }
        }

        // Domain is taken — check if it's parked/for-sale
        const parkResult = await checkIfParked(domain)

        return {
            domain,
            available: false,
            parked: parkResult.parked,
            parkingProvider: parkResult.provider,
            purchaseUrl: parkResult.parked
                ? `https://www.dan.com/buy-domain/${domain}`
                : `https://vercel.com/domains/${domain}`,
        }
    } catch {
        return { domain, available: true, purchaseUrl: `https://vercel.com/domains/${domain}` }
    }
}

/**
 * Check if a registered domain is parked (for-sale page, no real content)
 * Fetches the page and looks for common parking indicators
 */
async function checkIfParked(domain: string): Promise<{ parked: boolean; provider?: string }> {
    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)
        const res = await fetch(`https://${domain}`, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LaunchFleet/1.0)' },
        })
        clearTimeout(timeout)

        const html = await res.text()
        const lower = html.toLowerCase()

        // Known parking/for-sale indicators
        const parkingSignals: [string, string][] = [
            ['sedoparking', 'Sedo'],
            ['domainnamesales', 'Domain Name Sales'],
            ['godaddy.com/domain', 'GoDaddy'],
            ['afternic.com', 'Afternic'],
            ['dan.com', 'Dan.com'],
            ['hugedomains.com', 'HugeDomains'],
            ['bodis.com', 'Bodis'],
            ['parkingcrew', 'ParkingCrew'],
            ['domainlane', 'DomainLane'],
            ['this domain is for sale', 'For Sale'],
            ['domain is for sale', 'For Sale'],
            ['buy this domain', 'For Sale'],
            ['domain may be for sale', 'For Sale'],
            ['make an offer', 'Marketplace'],
            ['domain parking', 'Parked'],
            ['parked free', 'Parked'],
            ['undeveloped.com', 'Undeveloped'],
            ['squadhelp.com', 'Squadhelp'],
        ]

        for (const [signal, provider] of parkingSignals) {
            if (lower.includes(signal)) {
                return { parked: true, provider }
            }
        }

        // If page is very short (< 2KB) and has no real content, likely parked
        if (html.length < 2000 && !lower.includes('<article') && !lower.includes('<main')) {
            return { parked: true, provider: 'Minimal content' }
        }

        return { parked: false }
    } catch {
        // Can't reach the site — might be parked or down
        return { parked: false }
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
