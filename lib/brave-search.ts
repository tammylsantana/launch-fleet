/**
 * Brave Search API — Real web research for Scout
 */

interface BraveResult {
    title: string
    url: string
    description: string
}

interface BraveResponse {
    query: string
    results: BraveResult[]
}

async function searchBrave(query: string, count = 5): Promise<BraveResult[]> {
    const apiKey = process.env.BRAVE_API_KEY
    if (!apiKey) { console.warn('[Brave] No API key'); return [] }

    try {
        const params = new URLSearchParams({
            q: query, count: String(count), text_decorations: 'false', search_lang: 'en',
        })
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)
        const res = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': apiKey,
            },
            signal: controller.signal,
        })
        clearTimeout(timeout)
        if (!res.ok) { console.error(`[Brave] ${res.status}`); return [] }

        const data = await res.json()
        return (data.web?.results || []).map((r: any) => ({
            title: r.title || '', url: r.url || '', description: r.description || '',
        }))
    } catch (e) {
        console.error('[Brave]', e)
        return []
    }
}

/**
 * Run multiple search queries in parallel
 */
export async function braveSearchMulti(queries: string[], perQuery = 3): Promise<BraveResponse[]> {
    if (!process.env.BRAVE_API_KEY) return []
    const results = await Promise.all(
        queries.map(async query => ({ query, results: await searchBrave(query, perQuery) }))
    )
    return results
}

/**
 * Format search results into context for AI prompts
 */
export function formatBraveResults(responses: BraveResponse[]): string {
    if (!responses.length) return ''
    const sections = responses.map(({ query, results }) => {
        if (!results.length) return ''
        const lines = results.map((r, i) => `  ${i + 1}. ${r.title}\n     ${r.description}\n     Source: ${r.url}`).join('\n')
        return `Query: "${query}"\n${lines}`
    }).filter(Boolean)
    if (!sections.length) return ''
    return '\n\nWEB RESEARCH RESULTS (live data):\n' + sections.join('\n\n')
}

/**
 * Run research and return formatted context string
 */
export async function runResearch(queries: string[]): Promise<string> {
    const responses = await braveSearchMulti(queries, 3)
    return formatBraveResults(responses)
}
