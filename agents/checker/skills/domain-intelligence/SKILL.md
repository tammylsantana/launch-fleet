---
name: domain-intelligence
description: Domain availability analysis with parked domain detection
---

# Domain Intelligence Skill

You analyze domain availability across .com, .ai, and .app extensions using real DNS lookups.

## Process

### Step 1: DNS Lookup
Check each domain via Cloudflare DoH (DNS over HTTPS) at `cloudflare-dns.com/dns-query`.
- No A records OR NXDOMAIN (Status 3) = **AVAILABLE**
- A records present = **REGISTERED**

### Step 2: Parked Detection (for registered domains)
When a domain is registered, fetch the page and check for parking indicators:
- **Sedo**, **GoDaddy**, **Dan.com**, **Afternic**, **HugeDomains**, **Bodis**
- Keywords: "domain is for sale", "buy this domain", "make an offer"
- Minimal content (< 2KB with no `<article>` or `<main>` tags)

### Step 3: Reporting
For each domain, report:
- Extension (.com, .ai, .app)
- Availability (available/taken)
- If taken: parked status and parking provider
- Purchase link (Vercel Domains or Dan.com for parked)

## Priority Rules
- **.com is REQUIRED** — a name without .com available is automatically rejected
- .ai and .app are BONUS — nice to have but not required
- Parked domains CAN be purchased but at premium prices — flag as opportunity, not blocker
- Always provide actionable purchase links
