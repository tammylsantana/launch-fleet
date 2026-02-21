---
name: web-scrape
description: Legal, ethical web scraping with robots.txt compliance, rate limiting, and GDPR awareness
---

# Web Scraping Skill

Extract data from websites legally and ethically. Always respect robots.txt, rate limits, and privacy regulations.

## Ethics First

### Before Scraping ANY Site
1. ✅ Check `robots.txt` — never scrape disallowed paths
2. ✅ Rate limit — max 1 request per second to any domain
3. ✅ Respect `Crawl-delay` directives
4. ✅ Don't scrape personal data without consent (GDPR/CCPA)
5. ✅ Use descriptive User-Agent: `LaunchFleet-Scout/1.0 (+https://launchfleet.ai)`
6. ❌ Never bypass CAPTCHAs or authentication walls

## Tools Available

### 1. Playwright MCP (Browser Automation)
Best for: Dynamic/JS-heavy sites, SPAs, App Store pages
```javascript
// Via Playwright MCP
// Navigate, click, fill forms, extract data, take screenshots
// Handles JavaScript rendering, infinite scroll, lazy loading
```
- Install: `clawhub install playwright-mcp`
- Downloads: 3.3K (most popular automation tool)

### 2. Scrape (@ivangdavila)
Best for: Simple pages, API data, structured content
- robots.txt compliant by default
- Built-in rate limiting
- Respects `nofollow` and `noindex` directives
- Install: `clawhub install scrape`

### 3. Crawl4AI (LLM-Optimized)
Best for: Feeding scraped content to AI agents
- Outputs clean Markdown or structured JSON
- Perfect for agent context
- Install: `clawhub install crawl-for-ai`

## Use Cases for LaunchFleet

### Scout (Market Research)
- Scrape App Store competitor pages for ratings, reviews, pricing
- Extract feature lists from competitor landing pages
- Monitor competitor updates and changelog pages
- Research keyword trends from blog posts and forums

### Checker (Verification)
- Check domain parking status by scraping registrar pages
- Verify social media handle availability
- Cross-reference trademark databases

### Buzz (Content Research)
- Scrape trending hashtags and topic data
- Monitor press coverage and blog mentions
- Research influencer profiles for outreach

## Anti-Block Best Practices
- Rotate User-Agent strings (but keep them honest)
- Add random delays between requests (1-3 seconds)
- Cache results to avoid repeated requests
- Prefer APIs when available (always better than scraping)
- If a site blocks you, stop — don't try to circumvent

## ClawHub Sources
- `scrape` by @ivangdavila (605↓) — ethics-first
- `playwright-mcp` by @Spiceman161 (3.3K↓) — full browser automation
- `crawl-for-ai` by @angusthefuzz (430↓) — LLM-optimized output
