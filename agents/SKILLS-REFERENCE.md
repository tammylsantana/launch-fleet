# Agent Skills & API Integration Reference

Each agent needs skills (OpenClaw protocol) + professional APIs for launch readiness.

## Agent → Skill → API Mapping

### Scout (Market Research)
| Built-in Skills | ClawHub Skills | Professional APIs |
|---|---|---|
| `app-store-analysis` | **Playwright MCP** (3.3K↓) — browser scraping | App Store Connect API (Apple) |
| `brave-search` | **Tavily Web Search** (top-rated) — AI search | SensorTower API (app analytics) |
| | **Summarize** — digest competitor pages | data.ai API (market intelligence) |

### Namer (Name Generation)
| Built-in Skills | ClawHub Skills | Professional APIs |
|---|---|---|
| `premium-domains` | **Humanizer** — natural-sounding names | Namelix API (AI naming) |
| | **Tavily** — cross-reference existing brands | Panabee API (name availability) |

### Checker (Trademark & Domain)
| Built-in Skills | ClawHub Skills | Professional APIs |
|---|---|---|
| `trademark-research` | **DomainKits** (WHOIS/DNS) | USPTO TSDR API (trademark search) |
| `domain-intelligence` | **Playwright MCP** — scrape parked domains | Namecheap API (domain pricing) |
| | | TrademarkNow API (comprehensive TM) |

### Pixel (Visual Design)
| Built-in Skills | ClawHub Skills | Professional APIs |
|---|---|---|
| `icon-generation` | **Nano Banana Pro** — AI image gen | OpenAI DALL-E 3 (icons) |
| `custom-palette-generation` | **Seisoai** — unified media gateway | Coolors API (palette gen) |
| | | Figma API (export designs) |

### Builder (Code Generation)
| Built-in Skills | ClawHub Skills | Professional APIs |
|---|---|---|
| `expo-project-scaffold` | **GitHub** (30.7K↓) — repo management | EAS Build API (Expo cloud builds) |
| `brand-to-code` | **Playwright MCP** — screenshot testing | Codemagic API (CI/CD for mobile) |
| `feature-screens` | **Mcporter** — MCP server caller | GitHub API (auto-push code) |

### Shipper (App Store Submission)
| Built-in Skills | ClawHub Skills | Professional APIs |
|---|---|---|
| `app-store-optimization` | **App Store Connect** (46↓) — full ASC API | App Store Connect API (submit) |
| `eas-submit` | **Nano PDF** — privacy policy gen | EAS Submit API (upload .ipa) |
| `app-store-connect` | **Automation Workflows** (5.8K↓) | RevenueCat API (subscriptions) |
| | **API Gateway** (12.1K↓) — Stripe setup | |

### Buzz (Social Media & Marketing)
| Built-in Skills | ClawHub Skills | Professional APIs |
|---|---|---|
| `landing-page-generation` | **Social Media Scheduler** (565↓) | Buffer API (post scheduling) |
| `marketing-plan` | **Mailchimp** (6.9K↓) — email campaigns | X/Twitter API (auto-post) |
| | **Playwright MCP** — scrape social links | Meta Graph API (IG/FB posting) |
| | **Gog** (30.7K↓) — Google Workspace | TikTok API (content posting) |

## Priority Professional APIs to Connect

### Tier 1 — Connect Now
1. **App Store Connect API** — Shipper needs this for real submissions
2. **EAS Build/Submit API** — Builder + Shipper pipeline
3. **Playwright MCP** — Scout + Checker + Buzz all need browser automation
4. **Buffer/Later API** — Buzz needs real social scheduling

### Tier 2 — Connect Before Paid Launch
5. **RevenueCat** — subscription/payment handling
6. **Stripe** — payment processing via API Gateway
7. **Mailchimp** — email marketing for user retention
8. **GitHub API** — Builder auto-push to repos

### Tier 3 — Growth Phase
9. **SensorTower/data.ai** — Scout competitive intelligence
10. **Meta Graph API** — Buzz auto-posting to IG/FB
11. **TikTok API** — Buzz viral content
12. **Figma API** — Pixel export design assets
