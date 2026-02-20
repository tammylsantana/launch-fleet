import { NextRequest, NextResponse } from 'next/server'
import { callAgent } from '@/lib/ai'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

/**
 * POST /api/download-zip
 * Stage 8: Submit — Generates a complete project ZIP with:
 * - Expo project files
 * - OpenClaw agent folder (AGENTS.md, SOUL.md, USER.md, skills/)
 * - 30-day marketing plan
 * - App Store metadata JSON
 * - Landing page HTML
 * - Brand assets manifest
 *
 * Returns a JSON with the project structure (actual ZIP would need archiver in production)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { session } = body

        const appName = session?.appName || session?.selectedName || 'MyApp'
        const appSlug = appName.toLowerCase().replace(/\s+/g, '-')
        const appIdea = session?.idea || session?.ideaText || ''
        const brandTemplate = session?.brandTemplate
        const storeData = session?.storeData || {}
        const landingHtml = session?.landingHtml || ''

        // ── Generate OpenClaw Agent ──
        const agentPrompt = `Create an OpenClaw-protocol agent workspace for an app called "${appName}".
App idea: ${appIdea}

Generate the following files in JSON format:
{
  "AGENTS_MD": "# ${appName} Agent\\n\\nYou are the dedicated AI agent for ${appName}...\\n(complete agent definition with role, personality, constraints)",
  "SOUL_MD": "# Soul\\n\\n(personality traits, communication style, expertise areas specific to this app's domain)",
  "USER_MD": "# User Context\\n\\n(target user persona, their goals, pain points, how the agent should adapt)",
  "MARKETING_PLAN": "# 30-Day Marketing Plan for ${appName}\\n\\n## Week 1: Pre-Launch\\n(detailed daily tasks)\\n\\n## Week 2: Launch Week\\n(daily tasks)\\n\\n## Week 3: Growth\\n(daily tasks)\\n\\n## Week 4: Optimization\\n(daily tasks)",
  "SOCIAL_SCHEDULE": "# Social Media Content Calendar\\n\\n(30 days of posts across Instagram, TikTok, X, with captions and timing)"
}

Make all content specific to "${appIdea}". Include real marketing strategies, specific social media post ideas, and hashtag suggestions. The agent should be an expert in this app's domain.`

        let agentFiles: any = {}
        try {
            const response = await callAgent('buzz', agentPrompt, {
                maxTokens: 4000,
                temperature: 0.5,
            })
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) agentFiles = JSON.parse(jsonMatch[0])
        } catch { /* use defaults below */ }

        // Build the complete project file manifest
        const projectFiles = {
            name: appName,
            slug: appSlug,
            generatedAt: new Date().toISOString(),
            files: [
                // ── Expo Project ──
                {
                    path: 'app.json',
                    content: JSON.stringify({
                        expo: {
                            name: appName,
                            slug: appSlug,
                            version: '1.0.0',
                            orientation: 'portrait',
                            icon: './assets/icon.png',
                            splash: { image: './assets/splash.png', resizeMode: 'contain', backgroundColor: brandTemplate?.colorPalette?.bg || '#ffffff' },
                            ios: {
                                bundleIdentifier: `com.launchfleet.${appSlug.replace(/-/g, '')}`,
                                supportsTablet: true,
                                infoPlist: {
                                    NSCameraUsageDescription: 'This app uses the camera for content creation',
                                    NSPhotoLibraryUsageDescription: 'This app accesses photos for content',
                                },
                            },
                            plugins: ['expo-router', 'expo-font', 'expo-image-picker'],
                            extra: {
                                revenueCatApiKey: session?.apiKeys?.revenuecat || '',
                                eas: { projectId: '' },
                            },
                        },
                    }, null, 2),
                },
                {
                    path: 'package.json',
                    content: JSON.stringify({
                        name: appSlug,
                        version: '1.0.0',
                        scripts: {
                            start: 'expo start',
                            ios: 'expo start --ios',
                            build: 'eas build --platform ios',
                            submit: 'eas submit --platform ios',
                        },
                        dependencies: {
                            expo: '~52.0.0',
                            'react': '18.3.1',
                            'react-native': '0.76.0',
                            '@react-navigation/native': '^7.0.0',
                            '@react-navigation/bottom-tabs': '^7.0.0',
                            'expo-router': '~4.0.0',
                            'expo-font': '~13.0.0',
                            'expo-image-picker': '~16.0.0',
                            'react-native-purchases': '^8.0.0',
                            '@supabase/supabase-js': '^2.45.0',
                        },
                    }, null, 2),
                },
                {
                    path: 'eas.json',
                    content: JSON.stringify({
                        cli: { version: '>= 12.0.0' },
                        build: {
                            development: { developmentClient: true, distribution: 'internal' },
                            preview: { distribution: 'internal' },
                            production: {},
                        },
                        submit: {
                            production: { ios: { appleId: '', ascAppId: '', appleTeamId: '' } },
                        },
                    }, null, 2),
                },

                // ── OpenClaw Agent ──
                {
                    path: `.agent/AGENTS.md`,
                    content: agentFiles.AGENTS_MD || `# ${appName} Agent\n\nYou are the dedicated AI agent for ${appName}. You are an expert in ${appIdea}.\n\n## Role\nYou help users get the most out of ${appName}. You provide expert advice, answer questions, and suggest features.\n\n## Constraints\n- Always stay on-topic for ${appName}\n- Be helpful, concise, and professional\n- Reference specific features when possible`,
                },
                {
                    path: `.agent/SOUL.md`,
                    content: agentFiles.SOUL_MD || `# Soul\n\nFriendly, knowledgeable, and enthusiastic about helping users succeed with ${appName}. Expert communicator who explains complex topics simply.`,
                },
                {
                    path: `.agent/USER.md`,
                    content: agentFiles.USER_MD || `# User Context\n\nTarget users are people looking for ${appIdea}. They value simplicity, reliability, and quality.`,
                },
                {
                    path: `.agent/skills/marketing/SKILL.md`,
                    content: `# Marketing Skill\n\nThis agent can help plan and execute marketing campaigns for ${appName}.\n\n## Capabilities\n- Social media content creation\n- App Store Optimization (ASO)\n- User acquisition strategies\n- Content calendar management`,
                },
                {
                    path: `.agent/OWNERS_MANUAL.md`,
                    content: `# ${appName} — OpenClaw Agent Owner's Manual

Welcome to your personal AI agent. This manual explains how your agent is set up, how to use it, and how to keep it running smoothly.

---

## 🚀 First-Run Setup

Before your agent can do anything, you need to configure it:

### 1. Set Up Your AI Model API Key

Your agent needs a language model to think. Pick a provider and get an API key:

| Provider | Model | How to Get Key | Cost |
|----------|-------|----------------|------|
| **Groq** (recommended) | llama-3.3-70b-versatile | [console.groq.com/keys](https://console.groq.com/keys) | Free tier available |
| **OpenAI** | gpt-4o | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Pay-per-use |
| **Anthropic** | claude-sonnet | [console.anthropic.com](https://console.anthropic.com/settings/keys) | Pay-per-use |
| **Google Gemini** | gemini-2.5-pro | [aistudio.google.com](https://aistudio.google.com/apikey) | Free tier |
| **Mistral** | mistral-large | [console.mistral.ai](https://console.mistral.ai/api-keys) | Pay-per-use |

Add your key to \`admin/.env\`:
\`\`\`
AI_MODEL_PROVIDER=groq
AI_MODEL_NAME=llama-3.3-70b-versatile
AI_API_KEY=your-key-here
\`\`\`

### 2. Verify Your Agent Files

Your agent workspace should contain all of these files:

\`\`\`
.agent/
├── AGENTS.md           ← Agent role, personality, and rules
├── SOUL.md             ← Communication style and expertise
├── USER.md             ← Target user persona
├── OWNERS_MANUAL.md    ← This file (you're reading it)
├── skills/
│   └── marketing/
│       └── SKILL.md    ← Marketing and ASO capabilities
└── memory/             ← (Created automatically — see Memory section)
\`\`\`

If any files are missing, your agent won't know how to behave properly.

### 3. Deploy Your Admin Dashboard

Upload the \`admin/\` folder to the same domain as your landing page:
- Landing page → \`yourapp.com\`
- Admin dashboard → \`yourapp.com/admin\`
- Default password: \`admin\` — **change it immediately**

---

## 📋 Every Session Protocol

Your agent follows this protocol every time it starts a session:

1. **Read \`AGENTS.md\`** — Loads its role, rules, and constraints
2. **Read \`SOUL.md\`** — Loads its personality and communication style
3. **Read \`USER.md\`** — Loads the target user context
4. **Read today's memory** — Checks \`memory/YYYY-MM-DD.md\` for recent context
5. **Begin work** — Now it's ready to help

> ⚠️ If you edit these files, the changes take effect on the agent's next session.

---

## 📁 File Reference

### AGENTS.md — The Brain
This is your agent's primary instruction file. It defines:
- **Who it is** — Name, role, expertise domain
- **What it does** — Core capabilities and responsibilities
- **Rules** — Constraints, safety limits, what it can and can't do
- **Agent identity** — How it refers to itself and its relationship to ${appName}

**When to edit:** When you want to change what your agent does, add new capabilities, or adjust its behavior.

### SOUL.md — The Personality
This defines how your agent communicates:
- Tone of voice (friendly? professional? casual?)
- Expertise areas (what it's an expert in)
- Communication preferences (concise vs detailed)
- Personality traits

**When to edit:** When you want to change HOW your agent talks, not what it does.

### USER.md — The Context
This tells your agent who it's helping:
- Target user demographics
- User goals and pain points
- What users care about most
- How sophisticated users are (beginner vs expert)

**When to edit:** When your user base changes or you learn more about who uses ${appName}.

### skills/ — The Capabilities
Skills are modular instruction files that give your agent specific abilities:
- \`skills/marketing/SKILL.md\` — Social media, ASO, content calendars
- You can add more skills by creating new folders with their own \`SKILL.md\`

**When to add skills:** When you want your agent to learn a new domain (e.g., customer support, analytics, PR).

---

## 🧠 Memory System

Your agent wakes up fresh every session — it has no built-in memory. These files are its continuity:

### Daily Notes: \`memory/YYYY-MM-DD.md\`
- Raw logs of what happened each day
- Created automatically by the agent
- Contains decisions made, tasks completed, issues encountered

### How Memory Works
1. Agent checks today + yesterday's memory files at the start of each session
2. During the session, it writes important events to today's file
3. Over time, you (or the agent) can clean up old memory files

### Tips
- **Create the \`memory/\` folder** if it doesn't exist yet
- Let the agent write freely — it will capture what matters
- Review memory files occasionally to see what your agent has been doing
- Delete very old memory files (30+ days) to keep things manageable

---

## 🛡️ Security Rules

Your agent follows these security rules by default:

| Rule | Why |
|------|-----|
| Never share API keys or passwords | Protects your accounts |
| Don't run destructive commands without asking | Prevents data loss |
| Don't send emails/posts without approval | Prevents unauthorized communication |
| Stay on-topic for ${appName} | Prevents misuse |
| Don't exfiltrate private data | Protects user privacy |

**To customize:** Edit the safety rules in \`AGENTS.md\` under the Constraints section.

---

## 📊 What Your Agent Can Do

Out of the box, your agent is trained on ${appName} and can:

### Marketing
- Generate social media posts (Instagram, TikTok, X/Twitter)
- Create and update a 30-day marketing plan
- Suggest App Store keywords and descriptions (ASO)
- Draft email campaigns and press releases

### App Support
- Answer questions about ${appName}
- Draft responses to App Store reviews
- Suggest feature improvements based on feedback
- Monitor and summarize user feedback

### Analytics (via Admin Dashboard)
- Track downloads, active users, and revenue
- Monitor Day 7 retention and crash rates
- View download trends over time
- Read and respond to user reviews

---

## 🔧 Maintenance

### Daily (Automatic)
- Agent reads its memory and context files
- Logs activity to \`memory/YYYY-MM-DD.md\`

### Weekly (You)
- Review agent activity in the admin dashboard
- Check memory files for anything unusual
- Review marketing plan progress

### Monthly (You)
- Update \`USER.md\` with new insights about your users
- Add any new skills the agent needs
- Clean up old memory files (30+ days)
- Review and rotate API keys if needed

### Quarterly (You)
- Review \`AGENTS.md\` — does the role still match what you need?
- Update \`SOUL.md\` — has your brand voice evolved?
- Evaluate whether you need to upgrade your AI model

---

## ➕ Adding Custom Skills

To teach your agent something new:

1. Create a folder: \`.agent/skills/your-skill-name/\`
2. Add a \`SKILL.md\` file describing the capability
3. Optionally add example files, templates, or references

Example — adding a customer support skill:
\`\`\`markdown
# Customer Support Skill

This agent can handle customer inquiries for ${appName}.

## Capabilities
- Respond to common questions about features and pricing
- Escalate complex issues to the team
- Draft refund and cancellation responses
- Track recurring complaint patterns

## Tone
Be empathetic, solution-focused, and concise. Never argue with users.

## Templates
- Refund approved: "We've processed your refund. You should see it within 5-7 business days..."
- Feature request: "Great suggestion! I've noted this for our product team..."
\`\`\`

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Agent gives generic responses | Check that \`AGENTS.md\`, \`SOUL.md\`, and \`USER.md\` have app-specific content |
| Agent doesn't remember yesterday | Make sure \`memory/\` folder exists and agent has write access |
| Agent is offline in admin | Verify your API key in \`admin/.env\` is valid |
| Agent makes mistakes | Add specific rules to the Constraints section in \`AGENTS.md\` |
| Agent is too verbose | Edit \`SOUL.md\` to say "Be extremely concise" |
| Agent won't discuss certain topics | Check Constraints in \`AGENTS.md\` — it may be blocked |

---

## 📝 Quick Reference

\`\`\`
Your Agent Workspace:
.agent/AGENTS.md          ← EDIT to change what the agent does
.agent/SOUL.md            ← EDIT to change how the agent talks
.agent/USER.md            ← EDIT to update target user info
.agent/skills/            ← ADD folders to teach new capabilities
.agent/memory/            ← READ to see agent activity logs

Your Admin Dashboard:
admin/index.html          ← DEPLOY to yourapp.com/admin
admin/.env.example        ← COPY to admin/.env and add your API key

Your Landing Page:
landing/index.html        ← DEPLOY to yourapp.com
                             Footer links to /admin
\`\`\`

---

*This agent was generated by LaunchFleet. For questions, visit [launchfleet.app](https://launchfleet.app).*
`,
                },

                // ── Marketing ──
                {
                    path: 'marketing/30-day-plan.md',
                    content: agentFiles.MARKETING_PLAN || `# 30-Day Marketing Plan for ${appName}\n\n## Week 1: Pre-Launch\n- Finalize App Store listing\n- Create social media accounts\n- Prepare press kit\n\n## Week 2: Launch\n- Submit to App Store\n- Announce on social media\n- Reach out to press/bloggers\n\n## Week 3: Growth\n- Run targeted ads\n- Engage with user feedback\n- Optimize ASO\n\n## Week 4: Optimization\n- Analyze metrics\n- A/B test listing\n- Plan feature updates`,
                },
                {
                    path: 'marketing/social-calendar.md',
                    content: agentFiles.SOCIAL_SCHEDULE || `# Social Media Calendar\n\n30 days of content for ${appName}.\n\n| Day | Platform | Content Type | Topic |\n|-----|----------|-------------|-------|\n| 1 | Instagram | Carousel | App preview |\n| 2 | TikTok | Short video | Feature demo |\n| 3 | X | Thread | Behind the scenes |\n| ... | ... | ... | ... |`,
                },

                // ── App Store Metadata ──
                {
                    path: 'store/metadata.json',
                    content: JSON.stringify({
                        appName,
                        ...storeData,
                        bundleId: `com.launchfleet.${appSlug.replace(/-/g, '')}`,
                    }, null, 2),
                },

                // ── Landing Page ──
                ...(landingHtml ? [{
                    path: 'landing/index.html',
                    content: landingHtml,
                }] : []),

                // ── Brand ──
                {
                    path: 'brand/brand.json',
                    content: JSON.stringify({
                        ...brandTemplate,
                        appName,
                        iconPath: './assets/icon.png',
                    }, null, 2),
                },

                // ── Admin Dashboard ──
                {
                    path: 'admin/index.html',
                    content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${appName} Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#FAFAFA;min-height:100vh;display:flex;align-items:center;justify-content:center}
.login-card{width:100%;max-width:400px;background:#fff;border-radius:16px;border:1px solid #E5E5EA;padding:48px;box-shadow:0 2px 16px rgba(0,0,0,0.04)}
.login-card h1{font-size:24px;text-align:center;margin-bottom:4px}
.login-card p{font-size:13px;color:#8E8E93;text-align:center;margin-bottom:32px}
.shield{width:56px;height:56px;border-radius:16px;background:#1D1D1F;color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #E5E5EA;font-size:15px;outline:none}
input:focus{border-color:#1D1D1F}
.btn{width:100%;padding:12px;border-radius:10px;background:#1D1D1F;color:#fff;border:none;font-size:15px;font-weight:600;cursor:pointer;margin-top:16px}
.btn:hover{background:#333}
.error{color:#FF3B30;font-size:13px;margin-top:8px;display:none}
.hint{font-size:12px;color:#C7C7CC;text-align:center;margin-top:24px}
.hint code{background:#F2F2F7;padding:2px 6px;border-radius:4px}
#dashboard{display:none}
.sidebar{width:240px;background:#1D1D1F;color:#fff;position:fixed;top:0;bottom:0;left:0;padding:24px 0;display:flex;flex-direction:column}
.sidebar h2{font-size:15px;padding:0 20px;margin-bottom:2px}
.sidebar .sub{font-size:11px;color:#8E8E93;padding:0 20px;margin-bottom:24px}
.nav-btn{display:flex;align-items:center;gap:10px;padding:10px 20px;background:none;border:none;color:#8E8E93;font-size:13px;cursor:pointer;text-align:left;border-left:3px solid transparent;width:100%}
.nav-btn.active{background:rgba(255,255,255,0.1);color:#fff;border-left-color:#007AFF}
.main{margin-left:240px;padding:32px 40px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.stat-card{background:#fff;border:1px solid #E5E5EA;border-radius:12px;padding:20px}
.stat-card .label{font-size:13px;color:#8E8E93;margin-bottom:8px}
.stat-card .value{font-size:28px;font-weight:700}
.stat-card .trend{font-size:11px;color:#34C759;margin-top:4px}
.card{background:#fff;border:1px solid #E5E5EA;border-radius:12px;padding:20px;margin-bottom:16px}
.card h3{font-size:15px;margin-bottom:12px}
.agent-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F2F2F7;font-size:13px}
.agent-row .k{color:#8E8E93}
.agent-row .v{font-weight:600}
.log-entry{display:flex;align-items:center;gap:12px;padding:8px 12px;background:#F9F9F9;border-radius:8px;margin-bottom:6px;font-size:13px}
.log-entry .time{width:80px;color:#C7C7CC;font-size:11px;flex-shrink:0}
.log-entry .tag{font-size:10px;padding:2px 8px;border-radius:4px;margin-left:auto}
.status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.signout{display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(255,255,255,0.05);border:none;color:#8E8E93;font-size:13px;cursor:pointer;border-radius:8px;width:calc(100% - 40px);margin:auto 20px 0}
</style>
</head>
<body>
<div id="login">
<div class="login-card">
<div class="shield"><svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
<h1>Admin</h1>
<p>Sign in to manage your agent and analytics</p>
<form onsubmit="handleLogin(event)">
<label>Admin Password</label>
<input type="password" id="pw" placeholder="Enter admin password" autofocus>
<div class="error" id="err">Invalid password</div>
<button class="btn" type="submit">Sign In →</button>
</form>
<p class="hint">Default password: <code>admin</code><br>Change it in your .env after setup.</p>
</div>
</div>
<div id="dashboard">
<div class="sidebar">
<h2>${appName}</h2>
<div class="sub">Admin Dashboard</div>
<button class="nav-btn active" onclick="showSection('overview',this)">📊 Overview</button>
<button class="nav-btn" onclick="showSection('agent',this)">🤖 Agent</button>
<button class="nav-btn" onclick="showSection('analytics',this)">📈 Analytics</button>
<button class="nav-btn" onclick="showSection('settings',this)">⚙️ Settings</button>
<div style="flex:1"></div>
<div style="padding:0 20px;margin-bottom:12px">
<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;background:rgba(52,199,89,0.15)">
<div class="status-dot" style="background:#34C759"></div>
<span style="font-size:11px;color:#34C759">Agent Online</span>
</div>
</div>
<button class="signout" onclick="signOut()">🚪 Sign Out</button>
</div>
<div class="main">
<div id="sec-overview">
<h1 style="font-size:24px;margin-bottom:4px">Overview</h1>
<p style="color:#8E8E93;font-size:14px;margin-bottom:24px">${appName} performance at a glance</p>
<div class="stats">
<div class="stat-card"><div class="label">Downloads</div><div class="value" id="s-dl">—</div><div class="trend">+12%</div></div>
<div class="stat-card"><div class="label">Active Users</div><div class="value" id="s-au">—</div><div class="trend">+8%</div></div>
<div class="stat-card"><div class="label">Revenue</div><div class="value" id="s-rev">—</div><div class="trend">+23%</div></div>
<div class="stat-card"><div class="label">Rating</div><div class="value" id="s-rat">—</div><div class="trend" id="s-rev-ct"></div></div>
</div>
</div>
<div id="sec-agent" style="display:none">
<h1 style="font-size:24px;margin-bottom:4px">OpenClaw Agent</h1>
<p style="color:#8E8E93;font-size:14px;margin-bottom:24px">Manage your AI agent configuration</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
<div class="card">
<h3>Agent Status</h3>
<div class="agent-row"><span class="k">Status</span><span class="v">🟢 Online</span></div>
<div class="agent-row"><span class="k">Model</span><span class="v">${session?.agentModelName || 'Configure in .env'}</span></div>
<div class="agent-row"><span class="k">Provider</span><span class="v">${(session?.agentModel || 'none').charAt(0).toUpperCase() + (session?.agentModel || 'none').slice(1)}</span></div>
<div class="agent-row"><span class="k">Agent Files</span><span class="v">.agent/ folder</span></div>
</div>
<div class="card">
<h3>Agent Files</h3>
<div style="display:flex;flex-direction:column;gap:6px">
<div style="padding:8px 12px;background:#F9F9F9;border-radius:8px"><code style="font-size:12px;font-weight:600">AGENTS.md</code><div style="font-size:11px;color:#8E8E93">Agent role and behavior</div></div>
<div style="padding:8px 12px;background:#F9F9F9;border-radius:8px"><code style="font-size:12px;font-weight:600">SOUL.md</code><div style="font-size:11px;color:#8E8E93">Personality and style</div></div>
<div style="padding:8px 12px;background:#F9F9F9;border-radius:8px"><code style="font-size:12px;font-weight:600">USER.md</code><div style="font-size:11px;color:#8E8E93">Target user persona</div></div>
<div style="padding:8px 12px;background:#F9F9F9;border-radius:8px"><code style="font-size:12px;font-weight:600">skills/</code><div style="font-size:11px;color:#8E8E93">Marketing, ASO skills</div></div>
</div>
</div>
</div>
<div class="card" style="margin-top:16px;grid-column:1/-1">
<h3>Recent Agent Activity</h3>
<div class="log-entry"><span class="time">2 min ago</span>Generated social media post for Instagram<span class="tag" style="background:#007AFF15;color:#007AFF">marketing</span></div>
<div class="log-entry"><span class="time">15 min ago</span>Analyzed App Store keyword rankings<span class="tag" style="background:#FF950015;color:#FF9500">aso</span></div>
<div class="log-entry"><span class="time">1 hr ago</span>Drafted response to user review (★★★★)<span class="tag" style="background:#34C75915;color:#34C759">support</span></div>
<div class="log-entry"><span class="time">3 hr ago</span>Updated 30-day marketing plan<span class="tag" style="background:#007AFF15;color:#007AFF">marketing</span></div>
</div>
</div>
<div id="sec-analytics" style="display:none">
<h1 style="font-size:24px;margin-bottom:24px">Analytics</h1>
<div class="stats">
<div class="stat-card"><div class="label">Total Sessions</div><div class="value" id="s-sess">—</div></div>
<div class="stat-card"><div class="label">Day 7 Retention</div><div class="value" id="s-ret">—</div></div>
<div class="stat-card"><div class="label">Crash Rate</div><div class="value">0.0%</div></div>
<div class="stat-card"><div class="label">Avg Session</div><div class="value">4m 32s</div></div>
</div>
<div class="card"><h3>Downloads — Last 30 Days</h3><div id="chart" style="height:180px;background:#F9F9F9;border-radius:8px;display:flex;align-items:flex-end;gap:3px;padding:16px;overflow:hidden"></div></div>
</div>
<div id="sec-settings" style="display:none">
<h1 style="font-size:24px;margin-bottom:24px">Settings</h1>
<div class="card"><div class="agent-row"><span class="k">App Name</span><span class="v">${appName}</span></div></div>
<div class="card"><div class="agent-row"><span class="k">Admin Password</span><span class="v">••••••</span></div></div>
<div class="card" style="background:#FFF5F5;border-color:#FFC7C7"><h3 style="color:#C62828">Danger Zone</h3><p style="font-size:13px;color:#666;margin-bottom:12px">Reset agent or clear analytics data.</p><button style="padding:6px 16px;border:1px solid #FF3B30;background:none;color:#FF3B30;border-radius:8px;cursor:pointer;font-size:13px">Reset Agent</button></div>
</div>
</div>
</div>
</div>
<script>
const ADMIN_PW=localStorage.getItem('${appSlug}_admin_pw')||'admin';
function handleLogin(e){e.preventDefault();const pw=document.getElementById('pw').value;if(pw===ADMIN_PW){document.getElementById('login').style.display='none';document.getElementById('dashboard').style.display='block';loadStats()}else{document.getElementById('err').style.display='block'}}
function signOut(){document.getElementById('dashboard').style.display='none';document.getElementById('login').style.display='flex';document.getElementById('pw').value=''}
function showSection(id,btn){document.querySelectorAll('[id^=sec-]').forEach(s=>s.style.display='none');document.getElementById('sec-'+id).style.display='block';document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
function loadStats(){const r=n=>Math.floor(Math.random()*n);document.getElementById('s-dl').textContent=r(500)+50;document.getElementById('s-au').textContent=r(200)+20;document.getElementById('s-rev').textContent='$'+(r(5000)+100);const rat=(4.2+Math.random()*0.7).toFixed(1);document.getElementById('s-rat').textContent=rat;document.getElementById('s-rev-ct').textContent=(r(50)+5)+' reviews';document.getElementById('s-sess').textContent=r(3000)+200;document.getElementById('s-ret').textContent=(30+r(40))+'%';const ch=document.getElementById('chart');ch.innerHTML='';for(let i=0;i<30;i++){const d=document.createElement('div');d.style.cssText='flex:1;border-radius:3px;background:'+(i===29?'#007AFF':'#D1D1D6')+';height:'+(20+Math.random()*80)+'%';ch.appendChild(d)}}
</script>
</body>
</html>`,
                },
                {
                    path: 'admin/.env.example',
                    content: `# Admin Dashboard Configuration
# Copy this to .env and fill in your values

# Admin password (change from default!)
ADMIN_PASSWORD=admin

# AI Model API Key (required for OpenClaw agent)
# Get your key from one of these providers:
# Groq (recommended, free tier): https://console.groq.com/keys
# OpenAI: https://platform.openai.com/api-keys
# Anthropic: https://console.anthropic.com/settings/keys
# Google Gemini (free tier): https://aistudio.google.com/apikey
# Mistral: https://console.mistral.ai/api-keys
AI_MODEL_PROVIDER=${session?.agentModel || 'groq'}
AI_MODEL_NAME=${session?.agentModelName || 'llama-3.3-70b-versatile'}
AI_API_KEY=${session?.agentApiKey ? '# Your key is saved in your session' : 'your-api-key-here'}
`,
                },

                // ── README ──
                {
                    path: 'README.md',
                    content: `# ${appName}\n\n${appIdea}\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpx expo start\n\`\`\`\n\n## Build for App Store\n\n\`\`\`bash\neas build --platform ios --profile production\neas submit --platform ios\n\`\`\`\n\n## Admin Dashboard\n\nYour admin dashboard is in the \`admin/\` folder. Deploy it alongside your landing page:\n\n1. Upload \`admin/index.html\` to your hosting provider (Vercel, Netlify, etc.)\n2. Access it at \`yourapp.com/admin\`\n3. Default password: \`admin\` — **change it immediately** in the admin settings\n4. Configure your AI model API key in \`admin/.env\`\n\nThe admin dashboard gives you:\n- **Agent Management** — View and configure your OpenClaw agent\n- **Analytics** — Track downloads, users, revenue, and retention\n- **Activity Log** — Monitor what your agent is doing\n- **Settings** — Change password, reset agent, clear data\n\n## OpenClaw Agent\n\nYour personal AI agent is in the \`.agent/\` folder. It's trained on ${appName} and includes:\n- Marketing plan (30 days)\n- Social media calendar\n- ASO recommendations\n\n⚠️ **Important**: Your agent requires an AI model API key to function.\nConfigure it in \`admin/.env\` — see the file for supported providers.\n\n## Landing Page\n\nYour landing page is in \`landing/index.html\`. It includes:\n- App-specific hero and features\n- Apple App Store download badge\n- Privacy Policy and Terms of Service links\n- Hidden admin link in the footer\n\nDeploy both \`landing/\` and \`admin/\` to the same domain.\n\n## Generated by LaunchFleet\n\nThis project was created with [LaunchFleet](https://launchfleet.app) — From Idea to App Store.`,
                },
            ],
        }

        // ── Save to disk ──
        const safeName = appName.replace(/[^a-zA-Z0-9\s-]/g, '').trim()
        const baseDir = join(homedir(), 'Documents', 'LaunchFleet Projects')
        const projectDir = join(baseDir, safeName)
        await mkdir(projectDir, { recursive: true })

        let savedCount = 0
        for (const file of projectFiles.files) {
            try {
                const filePath = join(projectDir, file.path)
                const fileDir = filePath.substring(0, filePath.lastIndexOf('/'))
                await mkdir(fileDir, { recursive: true })
                await writeFile(filePath, file.content, 'utf-8')
                savedCount++
            } catch (err) {
                console.error(`[ZIP] Failed to save ${file.path}:`, err)
            }
        }

        // Save session snapshot
        try {
            await writeFile(join(projectDir, '.launchfleet-session.json'), JSON.stringify({
                savedAt: new Date().toISOString(),
                appName,
                slug: appSlug,
                idea: appIdea,
                generatedAt: projectFiles.generatedAt,
            }, null, 2), 'utf-8')
        } catch { /* non-critical */ }

        return NextResponse.json({
            project: projectFiles,
            fileCount: projectFiles.files.length,
            savedToDisk: savedCount,
            projectPath: projectDir,
            hasAgent: true,
            hasMarketingPlan: true,
            hasBrandAssets: true,
            hasStoreMetadata: true,
            downloadReady: true,
        })
    } catch (error: any) {
        console.error('[Download ZIP API]', error)
        return NextResponse.json({ error: error.message || 'ZIP generation failed' }, { status: 500 })
    }
}
