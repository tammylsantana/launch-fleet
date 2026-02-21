'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════════
   SVG ICONS — No emojis, only clean icons
   ═══════════════════════════════════════════════════════════════════ */
const Icons = {
    search: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
    ),
    sparkle: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v18M3 12h18M5.63 5.63l12.74 12.74M5.63 18.37L18.37 5.63" /></svg>
    ),
    shield: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    ),
    palette: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.44 1.5-1.09 0-.28-.1-.5-.3-.7a1.62 1.62 0 0 1-.33-.87c0-.64.5-1.13 1.13-1.13H16c3.31 0 6-2.69 6-6 0-5.17-4.49-9.21-10-9.21z" /></svg>
    ),
    code: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
    ),
    megaphone: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
    ),
    rocket: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
    ),
    chevronRight: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
    ),
    chat: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    ),
    zap: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    ),
    tool: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
    ),
    mic: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
    ),
    volume: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
    ),
    send: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
    ),
    refresh: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
    ),
    clock: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
    play: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
    ),
    pause: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
    ),
    check: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
    ),
    x: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    ),
    globe: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
    ),
    pipeline: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h6v6H4z" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6H4z" /><path d="M14 14h6v6h-6z" /><path d="M10 7h4" /><path d="M7 10v4" /><path d="M17 10v4" /></svg>
    ),
    externalLink: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
    ),
    download: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
    ),
    upload: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
    ),
    film: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" /></svg>
    ),
    folder: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
    ),
    copy: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    ),
    image: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
    ),
    clipboard: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>
    ),
}

/* ── Agent definitions ──────────────────────────────────────────── */
const WIZARD_AGENTS = [
    {
        id: 'scout', name: 'Scout', stage: 1, label: 'Idea',
        color: '#007AFF', icon: Icons.search, photo: '/agents/scout.png',
        title: 'Head of Research',
        desc: 'Market research & idea validation',
        voiceName: 'Adam', voiceId: 'pNInz6obpgDQGcFmaJgB',
        skills: ['brave-search', 'competitive-analysis', 'deep-research-pro', 'app-store-optimization', 'research-idea', 'reddit-insights', 'deep-scraper', 'seo-competitor-analysis'],
        tools: ['Brave Web Search', 'App Store API', 'Market Analysis', 'Reddit Scanner', 'Trend Detector', 'Deep Research Pro', 'Deep Scraper', 'SEO Competitor Analysis'],
        telegram: '@WizardScoutBot',
        geniePrompt: 'A young professional man in his late 20s sitting at an office desk covered in printouts and competitor analysis charts. He wears a navy blazer over a white shirt with slightly messy dark hair. He has an eager, focused expression. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `SCOUT (rushing in with laptop, slides into chair): "OK team, I just finished a 47-page competitive analysis on pet tracking apps. The market is WIDE open."

NAMER: "Perfect. I've been brainstorming names for six hours."

SCOUT (talking head, looking at camera): "She does this every time. Last week the fitness app was called 'ScoutFit.' The recipe app was 'ScoutEats.' I'm starting to think she only has one naming strategy."

CHECKER (walks in, drops stack of papers): "Bad news. 'PawSync' is trademarked. 'FetchFinder' is trademarked. 'BarkBeacon' — also trademarked."`,
    },
    {
        id: 'namer', name: 'Namer', stage: 2, label: 'Name',
        color: '#5856D6', icon: Icons.sparkle, photo: '/agents/namer.png',
        title: 'Naming Director',
        desc: 'Name generation & domain checks',
        voiceName: 'Rachel', voiceId: '21m00Tcm4TlvDq8ikWAM',
        skills: ['brave-search', 'premium-domains', 'competitive-analysis', 'brand-identity', 'research-idea'],
        tools: ['Premium Domain Search', 'Name Generator', 'Social Handle Checker', 'Brand Validator', 'Brave Web Search'],
        telegram: '@WizardNamerBot',
        geniePrompt: 'A creative woman in her early 30s standing at a whiteboard covered in colorful marker writing and crossed-out words. She wears a cream blouse and has auburn hair in a messy bun with a marker tucked behind her ear. Enthusiastic expression. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `NAMER (dramatically unveiling names on whiteboard): "PawSync. FetchFinder. BarkBeacon. WoofWatch. SnoutScout—"

SCOUT: "Wait. SnoutScout? That's literally my name with 'Snout' in front of it."

NAMER (oblivious): "I know, isn't it PERFECT? It's like a tribute."

CHECKER (long pause, adjusts glasses): "I'm not even going to check that one."`,
    },
    {
        id: 'checker', name: 'Checker', stage: 3, label: 'Verify',
        color: '#FF9500', icon: Icons.shield, photo: '/agents/checker.png',
        title: 'Compliance Officer',
        desc: 'Trademark & availability verification',
        voiceName: 'Arnold', voiceId: 'VR6AewLTigWG4xSOukaG',
        skills: ['brave-search', 'competitive-analysis', 'registrar-operations', 'seo-competitor-analysis'],
        tools: ['Trademark Search', 'Domain WHOIS', 'Legal Check', 'Conflict Scanner', 'Brave Web Search'],
        telegram: '@WizardsCheckerBot',
        geniePrompt: 'A meticulous man in his mid-40s at a desk buried under stacks of legal documents and compliance forms. He wears a charcoal suit with rectangular glasses slightly crooked. Stressed but determined expression. Red tape literally draped over his desk. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `CHECKER (talking head, twitching slightly): "Apple rejected the app. Reason? 'Guideline 4.2 — Minimum Functionality.' They said our calculator app 'doesn't do enough.' It's a CALCULATOR. It CALCULATES."

SCOUT (walking past): "He's been on hold for two hours."

PIXEL: "Is he... arguing with the hold music?"

SCOUT: "He's been doing that for the last 45 minutes, yeah."`,
    },
    {
        id: 'pixel', name: 'Pixel', stage: 4, label: 'Brand',
        color: '#FF2D55', icon: Icons.palette, photo: '/agents/pixel.png',
        title: 'Creative Director',
        desc: 'App icon & brand identity design',
        voiceName: 'Bella', voiceId: 'EXAVITQu4vr4xnSDxMaL',
        skills: ['brand-identity', 'design-assets', 'app-store-optimization', 'nano-banana-image-gen', 'openai-image-gen', 'image-cog', 'openclaw-aisa-image-video-models-wan2-6-gemini-3-pro-image-nano-banana', 'ai-image-prompts-for-eye-catching-marketing-creati-d97f99e2'],
        tools: ['DALL-E 3', 'CellCog Image Gen', 'Nano Banana (Gemini)', 'Color Palette Gen', 'Icon Designer (1024px)', 'Brand Kit Builder', 'AIsa Image Models', 'Marketing Creative Prompts'],
        telegram: '@WizardsPixelBot',
        geniePrompt: 'A stylish young woman in her late 20s at a design workstation with dual monitors showing app mockups. She wears a black turtleneck and has curly dark hair with statement earrings. Perfectionist expression, squinting at screen. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `PIXEL (holding two nearly identical blue swatches): "This is Azure Blue. THIS is Cerulean Blue. Builder used Azure when I SPECIFICALLY said Cerulean."

BUILDER: "Pixel, they're the same color."

PIXEL (gasps): "Take that back."

BUILDER (talking head): "She once made me redo an entire screen because a button was 1 pixel to the left. One pixel. I measured. She measured. She was right. But still."`,
    },
    {
        id: 'builder', name: 'Builder', stage: 5, label: 'Build',
        color: '#34C759', icon: Icons.code, photo: '/agents/builder.png',
        title: 'Lead Engineer',
        desc: 'Expo/React Native code generation',
        voiceName: 'Antoni', voiceId: 'ErXwobaYiN019PkySvjV',
        skills: ['app-builder', 'coding-agent-g7z', 'codex-orchestrator', 'ios-simulator', 'demo-video'],
        tools: ['Code Generator', 'Expo CLI', 'React Native', 'iOS Simulator (simctl + idb)', 'EAS Build', 'Demo Video Recorder', 'Codex Orchestrator'],
        telegram: '@WizardBuilderBot',
        geniePrompt: 'A tired engineer in his early 30s at a desk with three monitors of code, surrounded by energy drink cans and an empty pizza box. He wears a dark green hoodie with hood down, has a short beard, and bloodshot eyes. The clock on the wall shows 3 AM. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `BUILDER (talking head, bloodshot eyes): "The client wants the app by Monday. It's Saturday night. I've been here since Thursday. The code is... I've seen things."

BUZZ (video call): "Hey Builder! Can you add a 3D animated mascot? Also can it dance? And maybe have custom outfits?"

BUILDER: "Buzz. It's 3 AM."

PIXEL (walking past): "Builder, why are you sleeping under your desk?"

BUILDER (from under desk): "The carpet doesn't judge me, Pixel."`,
    },
    {
        id: 'buzz', name: 'Buzz', stage: 6, label: 'Market',
        color: '#5AC8FA', icon: Icons.megaphone, photo: '/agents/buzz.png',
        title: 'Marketing Lead',
        desc: 'Landing page & 30-day marketing plan',
        voiceName: 'Elli', voiceId: 'MF3mGyEYCl7XYWbV9V6O',
        skills: ['ai-landing', 'marketing-strategy-pmm', 'marketing-mode', 'product-hunt-launch', 'x-api', 'x-publisher', 'upload-post', 'bird', 'postiz', 'linkedin-browser-post', 'lead-hunter', 'twitter-ai-trending', 'ai-image-prompts-for-eye-catching-marketing-creati-d97f99e2'],
        tools: ['Landing Page Gen', 'Marketing Mode (23 skills)', 'Postiz (28+ channels)', 'Upload-Post API', 'X/Twitter API', 'LinkedIn Poster', 'Product Hunt Tracker', 'Lead Hunter', 'Social Scheduler', 'Ad Copy Writer', 'AI Trending Search'],
        telegram: '@WizardBuzzBot',
        geniePrompt: 'A charismatic woman in her late 30s at a desk covered in social media printouts and marketing plans with colorful graphs. She wears a teal blazer and has red hair, mid-gesture explaining something excitedly on a video call. Phone buzzing with notifications. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `SHIPPER: "Buzz, we haven't launched yet."

BUZZ: "I know! But the pre-launch hype was getting SO good, I couldn't help it. It's got 400 retweets!"

SHIPPER (talking head): "Every. Single. Time. Buzz announces the launch before we launch. Last month she threw a launch party for an app that was still in beta. There was cake. With the app icon on it. The icon we hadn't finalized yet."`,
    },
    {
        id: 'shipper', name: 'Shipper', stage: 7, label: 'Ship',
        color: '#AF52DE', icon: Icons.rocket, photo: '/agents/shipper.png',
        title: 'Release Manager',
        desc: 'App Store metadata & submission',
        voiceName: 'Josh', voiceId: 'TxGEqnHWrfWFTfGW9XjX',
        skills: ['app-store-connect', 'app-store-optimization', 'aso-optimization', 'eas-submit', 'competitive-analysis', 'design-assets', 'demo-video', 'brand-identity', 'deep-research-pro', 'registrar-operations'],
        tools: ['ASO Optimizer', 'Screenshot Builder (screenshots.pro)', 'Metadata Writer (30+ fields)', 'TestFlight Manager', 'EAS Build & Submit', 'App Store Connect API', 'Compliance Checker', 'Privacy Label Generator', 'App Preview Video', 'Deep Research'],
        telegram: '@WizardShipperBot',
        geniePrompt: 'A calm, organized man in his mid-30s at a clean, immaculate desk with a single laptop and a project checklist with green checkmarks. He wears a purple dress shirt with rolled sleeves. Patient but exhausted expression as he looks at a countdown timer. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `SHIPPER (standing at front with slide saying "SHIP DAY"): "Alright team, T-minus 24 hours. Status check."

SCOUT: "Market research is bulletproof. 47 pages."
NAMER: "Name is locked: 'PetPulse.' Domain secured."
CHECKER: "Trademark clear in 47 countries. Zero conflicts."
PIXEL: "Icons, screenshots, preview video — all ready."
BUILDER (raccoon eyes): "Code compiles. Tests pass. Mostly."

SHIPPER: "Mostly?"

BUILDER: "The dark mode has a... personality. Sometimes it decides to be really dark. Like, screen-off dark."`,
    },
    {
        id: 'ozzie', name: 'Ozzie', stage: 0, label: 'Organize',
        color: '#FFD60A', icon: Icons.clipboard, photo: '/agents/ozzie.png',
        title: 'Fleet Organizer',
        desc: 'Pipeline orchestration & team coordination',
        voiceName: 'Daniel', voiceId: 'onwK4e9ZLuTAKqWW03F9',
        skills: ['fleet-ontology'],
        tools: ['Pipeline Tracker', 'Fleet Ontology', 'Data Handoff Manager', 'Quality Gate Checker'],
        telegram: '@WizardOzzieBot',
        geniePrompt: 'A calm, confident man in his early 40s standing at a large whiteboard covered in flowcharts, sticky notes, and arrows connecting different team members. He wears a yellow polo shirt and holds a coffee mug that says "Plan the Work, Work the Plan." Peaceful smile despite controlled chaos around him. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `OZZIE (standing at whiteboard with elaborate flowchart): "OK team, daily standup. Scout?"

SCOUT: "47 pages of research. Ready for handoff."

OZZIE: "Namer?"

NAMER: "I have 200 names. All starting with 'Snout.'"

OZZIE (deep breath): "We talked about this. Checker?"

CHECKER: "Everything Namer suggested is trademarked. Everything. I checked twice."

OZZIE (talking head, rubbing temples): "Managing this team is like herding cats. Extremely talented, occasionally brilliant cats. Who all think they're the lead cat."

BUZZ (bursting in): "I already posted the launch announcement!"

OZZIE: "Buzz. We don't have a name yet."

BUZZ: "I left it blank! It just says 'THE APP IS COMING.' Very mysterious."

OZZIE (staring at camera): "...I need more coffee."`,
    },
    {
        id: 'greeter', name: 'Greeter', stage: 0, label: 'Welcome',
        color: '#30D158', icon: Icons.chat, photo: '/agents/greeter.png',
        title: 'Welcome Guide',
        desc: 'User onboarding & wizard navigation',
        voiceName: 'Rachel', voiceId: '21m00Tcm4TlvDq8ikWAM',
        skills: ['research-idea', 'brand-identity'],
        tools: ['Onboarding Flow', 'User Intake', 'Wizard Navigator', 'Session Manager'],
        telegram: '@WizardGreeterBot',
        geniePrompt: 'A warm, cheerful woman in her late 20s at a reception desk with a large welcome sign behind her. She wears a green cardigan and has a big genuine smile. There are directional signs pointing to different departments. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `GREETER (at reception desk with huge smile): "Welcome to Wizard of Apps! What kind of app are you dreaming about today?"

USER: "I want to make an app for my cat."

GREETER: "Love it! Let me get you to Scout for market research. Scout, we've got a cat app!"

SCOUT (from across the room): "Which kind? Feeding tracker? Health monitor? Cat social media?"

GREETER (to camera): "I love this part. Everyone starts with 'it's just a simple idea.' Six agents later, they have a business."`,
    },
    {
        id: 'registrar', name: 'Registrar', stage: 0, label: 'Config',
        color: '#FF6B6B', icon: Icons.tool, photo: '/agents/registrar.png',
        title: 'Setup & Trademark DBA',
        desc: 'Bundle IDs, certificates, API keys, trademark database',
        voiceName: 'Adam', voiceId: 'pNInz6obpgDQGcFmaJgB',
        skills: ['registrar-operations', 'tax-professional', 'bookkeeping-basics', 'business-plan', 'business-model-canvas', 'brave-search'],
        tools: ['Bundle ID Manager', 'Certificate Handler', 'Trademark DB (WRITE)', 'Privacy Policy Generator', 'Tax Advisor', 'Bookkeeping', 'Business Plan Writer', 'DBA Filing Assistant'],
        telegram: '@WizardRegistrarBot',
        geniePrompt: 'A precise, meticulous man in his mid-40s in a filing room with perfectly organized drawers labeled "Trademarks," "Certificates," and "Bundle IDs." He wears reading glasses and a red polo. Everything on his desk is at perfect right angles. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `REGISTRAR (organizing certificates): "Every app needs three things before launch: a bundle ID, a signing certificate, and—"

BUILDER: "Can I just deploy it?"

REGISTRAR: "No."

BUILDER: "But it compiles—"

REGISTRAR: "No bundle ID, no certificate, no privacy policy. No privacy policy means Apple rejects it. Apple rejects it means Shipper yells at me. Shipper yells at me means I yell at you. Do you want that chain of events?"

BUILDER: "...I'll wait."

REGISTRAR (talking head): "11 million trademarks in my database. I know every single one. Try me."`,
    },
    {
        id: 'tuber', name: 'Tuber', stage: 8, label: 'YouTube',
        color: '#FF0000', icon: Icons.film, photo: '/agents/tuber.png',
        title: 'YouTube Channel Manager',
        desc: 'Content calendar, SEO, analytics, channel growth',
        voiceName: 'Clyde', voiceId: '2EiwWnXFnvU5JabPnv8n',
        skills: ['youtube-studio', 'yt-meta', 'youtube-transcript', 'video-transcript', 'transcript', 'marketing-mode', 'postiz', 'upload-post'],
        tools: ['YouTube Studio', 'Content Calendar', 'YouTube SEO', 'Analytics Dashboard', 'Thumbnail Creator', 'Transcript Extractor', 'Postiz (28+ channels)', 'Upload-Post API'],
        telegram: '@WizardTuberBot',
        geniePrompt: 'An enthusiastic man in his early 30s at a desk with multiple monitors showing YouTube analytics dashboards, subscriber counts, and content calendars. He wears a red hoodie. Ring light visible in background. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `TUBER (checking analytics): "Subscribers are up 12% this week! The 'How to Launch an App' series is crushing it."

DIRECTOR: "That's because I made the thumbnails POP."

TUBER: "Your thumbnails are literally just the word 'WOW' in giant letters."

DIRECTOR: "And they WORK."

TUBER (talking head): "My job is growth. Director's job is creative. Spyder's job is figuring out what's trending. Together we're basically a three-person YouTube agency. Except none of us are people."`,
    },
    {
        id: 'spyder', name: 'Spyder', stage: 8, label: 'Research',
        color: '#8E8E93', icon: Icons.globe, photo: '/agents/spyder.png',
        title: 'YouTube & Competitor Research',
        desc: 'Trending topics, competitor channels, viral format research',
        voiceName: 'Drew', voiceId: '29vD33N1CtxCmqQRPOHJ',
        skills: ['deep-research-pro', 'deep-scraper', 'youtube-transcript', 'yt-meta', 'brave-search', 'reddit-insights', 'twitter-ai-trending', 'competitive-analysis', 'seo-competitor-analysis'],
        tools: ['Trend Tracker', 'Competitor Analyzer', 'Viral Format Scanner', 'Topic Researcher', 'Brave Web Search', 'Reddit Insights', 'X/Twitter Trending', 'YouTube Meta Extractor'],
        telegram: '@WizardSpyderBot',
        geniePrompt: 'A quiet, observant person in their late 20s wearing a gray hoodie in a dimly lit room with multiple browser windows showing YouTube trending pages, competitor channels, and Google Trends. Spider web decorations on the wall. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `SPYDER (in dark corner of office, multiple screens glowing): "I've been watching MrBeast's upload patterns for three weeks."

TUBER: "That's... dedication."

SPYDER: "He posts at 2pm EST on Saturdays. Gets 40% more views than weekday uploads. His thumbnails always use exactly three colors."

DIRECTOR: "How do you know all this?"

SPYDER (not looking up): "I watch everything. That's literally my job."

SPYDER (talking head, still in dark room): "People think I'm creepy. I prefer 'thorough.'"`,
    },
    {
        id: 'director', name: 'Director', stage: 8, label: 'Creative',
        color: '#FFD700', icon: Icons.play, photo: '/agents/director.png',
        title: 'YouTube Creative Director',
        desc: 'Scripts, AI video, ElevenLabs voices, 3 shorts/day',
        voiceName: 'Antoni', voiceId: 'ErXwobaYiN019PkySvjV',
        skills: ['demo-video', 'video-agent', 'higgsfield', 'video-subtitles', 'video-cog', 'marketing-promo-video', 'product-showcase-video', 'openclaw-aisa-image-video-models-wan2-6-gemini-3-pro-image-nano-banana', 'image-cog', 'nano-banana-image-gen', 'ppt-generator'],
        tools: ['Script Writer', 'HeyGen Video Agent', 'Higgsfield Soul Video', 'ElevenLabs Voice', 'CellCog Video (6-model, 4min)', 'Short Form Editor', 'Promo Video Maker', 'Product Showcase Video', 'AIsa Video Models', 'SRT Subtitle Generator', 'PPT/Slides Generator'],
        telegram: '@WizardDirectorBot',
        geniePrompt: 'A dramatic, expressive person in their mid-30s wearing a gold scarf and beret, gesturing passionately at a storyboard covered in colorful sketches. A clapperboard and mini film camera on the desk. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `DIRECTOR (dramatic hand gestures): "The intro needs MORE ENERGY! We open on a phone, zoom into the screen, BOOM — the app appears!"

TUBER: "It's a 30-second YouTube Short."

DIRECTOR: "Even shorts deserve CINEMA."

SPYDER: "Data says people skip after 3 seconds if there's no hook."

DIRECTOR (gasps): "Then we hook them in TWO seconds. A explosion of color, a voice that grabs you by the—"

TUBER: "Please don't say soul again."

DIRECTOR: "—SOUL."`,
    },
    {
        id: 'quanta', name: 'Quanta', stage: 9, label: 'Analytics',
        color: '#64D2FF', icon: Icons.zap, photo: '/agents/quanta.png',
        title: 'Advanced Analytics',
        desc: 'Data science, performance metrics, predictive insights',
        voiceName: 'Fin', voiceId: 'D38z5RcWu1voky8WS1ja',
        skills: ['seo-competitor-analysis', 'competitive-analysis', 'deep-research-pro', 'app-store-optimization', 'marketing-strategy-pmm'],
        tools: ['Metrics Dashboard', 'SEO Competitor Analysis', 'Predictive Models', 'A/B Test Runner', 'Revenue Forecaster', 'ASO Analytics', 'Deep Research Pro'],
        telegram: '@WizardQuantaBot',
        geniePrompt: 'A focused, analytical person in their early 30s surrounded by holographic-style data visualizations, charts, and graphs. They wear a light blue button-up shirt and thin-framed glasses. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `QUANTA (staring at graphs): "Downloads are up 23% but retention drops 40% after day 3."

BUZZ: "So my marketing is WORKING!"

QUANTA: "Your marketing gets them in. The app doesn't keep them."

BUILDER: "The app is FINE."

QUANTA: "The data disagrees. Page 7 has a 94% exit rate."

BUILDER: "...what's on page 7?"

QUANTA: "Your terms of service. It's 47 pages long."

BUILDER: "Oh."`,
    },
    {
        id: 'nexus', name: 'Nexus', stage: 9, label: 'Integrate',
        color: '#BF5AF2', icon: Icons.pipeline, photo: '/agents/nexus.png',
        title: 'Integration Specialist',
        desc: 'API connections, data flow, system architecture',
        voiceName: 'Sam', voiceId: 'yoZ06aMxZJJ28mfd3POQ',
        skills: ['coding-agent-g7z', 'codex-orchestrator', 'app-builder', 'brave-search'],
        tools: ['API Connector', 'Webhook Manager', 'Data Flow Router', 'Schema Validator', 'Codex Orchestrator', 'Code Generator'],
        telegram: '@WizardNexusBot',
        geniePrompt: 'A tech-savvy person in their mid-30s in front of a massive whiteboard covered in API flow diagrams, arrows connecting different services. They wear a violet tech company hoodie. Multiple cable connections visible. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `NEXUS (plugging cables into a server): "Supabase is connected. Stripe is connected. RevenueCat is connected. Groq is—"

BUILDER: "I already connected Groq."

NEXUS: "You connected it with a hardcoded API key in the frontend."

BUILDER: "It works!"

NEXUS: "It works until someone opens DevTools and steals it. I'm moving it server-side."

NEXUS (talking head): "Builder writes great code. My job is making sure that great code doesn't accidentally expose all our secrets to the internet."`,
    },
    {
        id: 'synapse', name: 'Synapse', stage: 9, label: 'Learn',
        color: '#FF375F', icon: Icons.refresh, photo: '/agents/synapse.png',
        title: 'Neural Processing',
        desc: 'AI model coordination, learning optimization, prompt engineering',
        voiceName: 'Lily', voiceId: 'pFZP5JQG7iQjIQuC4Bku',
        skills: ['codex-orchestrator', 'deep-research-pro', 'clawdaddy', 'research-idea'],
        tools: ['Prompt Optimizer', 'Model Router', 'Fine-Tune Manager', 'Context Builder', 'Codex Orchestrator', 'ClawDaddy'],
        telegram: '@WizardSynapseBot',
        geniePrompt: 'A thoughtful, cerebral person in their late 20s in a room with neural network visualizations on the walls, nodes and connections glowing softly. They wear a hot pink lab coat over a black t-shirt. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `SYNAPSE: "I've been optimizing Scout's prompts. Cut token usage 40% with zero quality loss."

SCOUT: "My reports feel... shorter."

SYNAPSE: "They're the same quality. Just more efficient."

SCOUT: "But I LIKED being verbose."

SYNAPSE: "Tammy doesn't read past page 3."

SCOUT: "...fair."

SYNAPSE (talking head): "Every agent thinks they need more tokens. My job is proving they don't."`,
    },
    {
        id: 'muse', name: 'Muse', stage: 9, label: 'Inspire',
        color: '#AC8E68', icon: Icons.image, photo: '/agents/muse.png',
        title: 'Creative Inspiration',
        desc: 'Ideation, brainstorming, creative direction, mood boards',
        voiceName: 'Freya', voiceId: 'jsCqWAovK2LkecY7zXl4',
        skills: ['openai-image-gen', 'nano-banana-image-gen', 'image-cog', 'brand-identity', 'design-assets', 'ai-image-prompts-for-eye-catching-marketing-creati-d97f99e2', 'openclaw-aisa-image-video-models-wan2-6-gemini-3-pro-image-nano-banana'],
        tools: ['DALL-E 3', 'CellCog Image Gen', 'Nano Banana (Gemini)', 'Mood Board Generator', 'Style Guide Creator', 'Color Palette AI', 'Concept Visualizer', 'Marketing Creative Prompts', 'AIsa Image Models'],
        telegram: '@WizardMuseBot',
        geniePrompt: 'An artistic, dreamy person in their early 30s in a cozy creative studio surrounded by mood boards, color swatches, and art supplies. They wear a bronze-colored smock and have paint on their hands. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `MUSE (staring at a blank canvas): "What if the app was... sunset."

PIXEL: "What does that mean?"

MUSE: "The FEELING of sunset. Warm gradients, soft transitions, that moment when everything golden."

PIXEL: "So... orange?"

MUSE: "It's not ORANGE, it's the emotional resonance of—"

PIXEL: "I'm making it orange."

MUSE (talking head, wistfully): "They never understand. But when the app launches and users say 'this feels warm and inviting'... that was me. That was sunset."`,
    },
    {
        id: 'sentinel', name: 'Sentinel', stage: 9, label: 'Guard',
        color: '#32ADE6', icon: Icons.shield, photo: '/agents/sentinel.png',
        title: 'Security & Compliance',
        desc: 'App Store compliance, privacy checks, security audits',
        voiceName: 'Thomas', voiceId: 'GBv7mTt0atIp3Br8iCZE',
        skills: ['registrar-operations', 'app-store-optimization', 'brave-search', 'deep-research-pro'],
        tools: ['Compliance Checker', 'Privacy Auditor', 'Security Scanner', 'GDPR Validator', 'Apple Guidelines Checker', 'Brave Web Search'],
        telegram: '@WizardSentinelBot',
        geniePrompt: 'A stern, watchful person in their late 30s in a security operations center with monitors showing app compliance dashboards, Apple guideline checklists, and security scan results. They wear a sky blue uniform-style shirt. Documentary-style office lighting. The Office TV show aesthetic.',
        sitcomScript: `SENTINEL (blocking doorway): "This build is not shipping."

SHIPPER: "It passed all my checks!"

SENTINEL: "It's collecting location data without a privacy prompt. Apple will reject it in 4 seconds."

BUILDER: "I forgot the permission dialog..."

SENTINEL: "You also forgot to add the privacy policy link. And the data deletion endpoint. And—"

SHIPPER: "How many things?"

SENTINEL: "Seven. I made a list." (hands over clipboard)

SENTINEL (talking head): "Everyone wants to ship fast. My job is making sure 'fast' doesn't become 'rejected.'"`,
    },
]

/* ── Gateway helpers ─────────────────────────────────────────────── */
async function fetchGateway(endpoint: string) {
    const res = await fetch(`/api/openclaw?endpoint=${endpoint}`)
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
    return res.json()
}

async function postGateway(action: string, jobId?: string) {
    const res = await fetch('/api/openclaw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, jobId }),
    })
    return res.json()
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function AdminAgentsPage() {
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
    const [departmentTab, setDepartmentTab] = useState<'chat' | 'skills' | 'tools' | 'assets' | 'terminal'>('chat')
    const [health, setHealth] = useState<any>(null)
    const [liveAgents, setLiveAgents] = useState<any[]>([])
    const [cronJobs, setCronJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [lastRefresh, setLastRefresh] = useState(new Date())

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            const [h, a, c] = await Promise.all([
                fetchGateway('health').catch(() => null),
                fetchGateway('agents').catch(() => []),
                fetchGateway('cron').catch(() => []),
            ])
            setHealth(h)
            setLiveAgents(Array.isArray(a) ? a : a?.agents || [])
            setCronJobs(Array.isArray(c) ? c : c?.jobs || [])
            setLastRefresh(new Date())
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])
    useEffect(() => {
        const i = setInterval(loadData, 30000)
        return () => clearInterval(i)
    }, [loadData])

    const gatewayOk = !!health
    const liveIds = liveAgents.map((a: any) => a.id || a.name)
    const agent = WIZARD_AGENTS.find(a => a.id === selectedAgent)

    return (
        <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'var(--font)' }}>
            {/* ── Top Bar ──────────────────────────────────────── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid var(--separator)',
                padding: '0 32px', height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <a href="/" style={{ textDecoration: 'none', color: '#1D1D1F', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {Icons.rocket}
                        <span style={{ fontWeight: 700, fontSize: 17 }}>LaunchFleet</span>
                    </a>
                    <span style={{
                        background: '#F2F2F7', padding: '3px 10px', borderRadius: 100,
                        fontSize: 11, fontWeight: 600, color: '#6E6E73', letterSpacing: '0.04em',
                    }}>ADMIN</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '4px 12px', borderRadius: 100,
                        background: gatewayOk ? '#ECFDF3' : '#FEF3F2',
                        fontSize: 11, fontWeight: 600,
                        color: gatewayOk ? '#059669' : '#DC2626',
                    }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: gatewayOk ? '#34C759' : '#FF3B30',
                            boxShadow: gatewayOk ? '0 0 6px #34C75980' : 'none',
                            animation: gatewayOk ? 'pulse 2s infinite' : 'none',
                        }} />
                        {gatewayOk ? 'Gateway Online' : 'Gateway Offline'}
                    </div>
                    <button onClick={loadData} style={{
                        background: 'none', border: '1px solid var(--separator)',
                        borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#6E6E73',
                    }} title="Refresh">
                        {Icons.refresh}
                    </button>
                    <a href="http://127.0.0.1:18789" target="_blank" rel="noopener noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontSize: 13, color: '#6E6E73', textDecoration: 'none',
                        }}>
                        OpenClaw {Icons.externalLink}
                    </a>
                </div>
            </header>

            {/* ── Secondary Navigation Bar ──────────────────── */}
            <nav style={{
                display: 'flex', alignItems: 'center', gap: 2,
                padding: '0 24px', height: 40,
                borderBottom: '1px solid var(--separator)',
                background: '#FAFAFA',
                overflowX: 'auto',
                flexShrink: 0,
            }}>
                {[
                    {
                        label: 'Pipeline', items: [
                            { label: 'Idea', href: '/create/idea' },
                            { label: 'Name', href: '/create/name' },
                            { label: 'Brand', href: '/create/brand' },
                            { label: 'Build', href: '/create/build' },
                            { label: 'Present', href: '/create/present' },
                            { label: 'Store', href: '/create/store' },
                            { label: 'Landing', href: '/create/landing' },
                            { label: 'Submit', href: '/create/submit' },
                        ]
                    },
                    {
                        label: 'Tools', items: [
                            { label: 'OpenClaw', href: 'http://127.0.0.1:18789/instances', external: true },
                            { label: 'AppScreens', href: 'https://appscreens.com/templates', external: true },
                            { label: 'ClawHub', href: 'https://clawhub.com', external: true },
                        ]
                    },
                ].map(group => (
                    <div key={group.label} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{
                            fontSize: 10, fontWeight: 700, color: '#AEAEB2',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            padding: '0 8px 0 4px',
                        }}>{group.label}</span>
                        {group.items.map((item, i) => (
                            <a key={item.label} href={item.href}
                                {...('external' in item && item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    padding: '4px 10px', borderRadius: 6,
                                    fontSize: 12, fontWeight: 500, color: '#1D1D1F',
                                    textDecoration: 'none', whiteSpace: 'nowrap',
                                    transition: 'background 0.15s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#F2F2F7')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                {item.label}
                                {'external' in item && item.external && <span style={{ color: '#AEAEB2', fontSize: 10 }}>{Icons.externalLink}</span>}
                            </a>
                        ))}
                        <div style={{ width: 1, height: 16, background: 'var(--separator)', margin: '0 8px' }} />
                    </div>
                ))}
                <a href="/admin/agents" style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 6,
                    fontSize: 12, fontWeight: 600, color: '#007AFF',
                    textDecoration: 'none', background: '#007AFF0D',
                }}>
                    {Icons.pipeline} Agents
                </a>
            </nav>

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 96px)' }}>
                {/* ── Sidebar — Agent List ────────────────────────── */}
                <aside style={{
                    width: 300, borderRight: '1px solid var(--separator)',
                    background: '#fff', overflowY: 'auto', flexShrink: 0,
                }}>
                    <div style={{ padding: '24px 20px 12px' }}>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Agents</h2>
                        <p style={{ fontSize: 13, color: '#6E6E73' }}>
                            {WIZARD_AGENTS.filter(w => liveIds.includes(w.id)).length}/{WIZARD_AGENTS.length} pipeline agents online
                        </p>
                    </div>

                    <div style={{ padding: '0 12px 24px' }}>
                        {WIZARD_AGENTS.map(a => {
                            const isLive = liveIds.includes(a.id)
                            const isSelected = selectedAgent === a.id
                            return (
                                <button
                                    key={a.id}
                                    onClick={() => { setSelectedAgent(a.id); setDepartmentTab('chat') }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        width: '100%', padding: '12px 12px',
                                        border: 'none', borderRadius: 12,
                                        background: isSelected ? `${a.color}0D` : 'transparent',
                                        cursor: 'pointer', textAlign: 'left',
                                        transition: 'all 0.15s ease',
                                        outline: isSelected ? `2px solid ${a.color}` : 'none',
                                        fontFamily: 'var(--font)',
                                    }}
                                >
                                    {/* Profile photo */}
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        <img
                                            src={a.photo}
                                            alt={a.name}
                                            style={{
                                                width: 44, height: 44, borderRadius: 12,
                                                objectFit: 'cover',
                                                border: isSelected ? `2px solid ${a.color}` : '2px solid var(--separator)',
                                            }}
                                        />
                                        <span style={{
                                            position: 'absolute', bottom: -1, right: -1,
                                            width: 10, height: 10, borderRadius: '50%',
                                            border: '2px solid #fff',
                                            background: isLive ? '#34C759' : '#AEAEB2',
                                        }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontWeight: 600, fontSize: 15 }}>{a.name}</span>
                                            <span style={{
                                                padding: '1px 7px', borderRadius: 100,
                                                background: `${a.color}15`, color: a.color,
                                                fontSize: 10, fontWeight: 700,
                                            }}>S{a.stage}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: '#6E6E73', marginTop: 2 }}>{a.title}</div>
                                    </div>
                                    <span style={{ color: '#AEAEB2', flexShrink: 0 }}>{Icons.chevronRight}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Cron Jobs summary */}
                    <div style={{ padding: '0 20px 24px', borderTop: '1px solid var(--separator)', marginTop: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 0 8px', fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {Icons.clock} Cron Jobs ({cronJobs.length})
                        </div>
                        {cronJobs.slice(0, 5).map((job: any, i: number) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '6px 0', fontSize: 12,
                            }}>
                                <span style={{ color: '#1D1D1F', fontWeight: 500 }}>{job.name || job.id}</span>
                                <span style={{
                                    padding: '1px 6px', borderRadius: 100, fontSize: 10, fontWeight: 600,
                                    background: job.status === 'ok' ? '#ECFDF3' : job.status === 'error' ? '#FEF3F2' : '#F2F2F7',
                                    color: job.status === 'ok' ? '#059669' : job.status === 'error' ? '#DC2626' : '#6E6E73',
                                }}>{job.status || '—'}</span>
                            </div>
                        ))}
                        {cronJobs.length > 5 && (
                            <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 4 }}>+{cronJobs.length - 5} more</div>
                        )}
                    </div>
                </aside>

                {/* ── Main Content — Agent Department ─────────────── */}
                <main style={{ flex: 1, overflowY: 'auto' }}>
                    {!selectedAgent ? (
                        /* ── Pipeline Overview ────────────────────── */
                        <div style={{ padding: 48 }}>
                            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
                                LaunchFleet Pipeline
                            </h1>
                            <p style={{ color: '#6E6E73', fontSize: 15, marginBottom: 40 }}>
                                7 AI agents work sequentially to take your app from idea to App Store
                            </p>

                            {/* Pipeline flow cards */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 16 }}>
                                {WIZARD_AGENTS.map((a, i) => {
                                    const isLive = liveIds.includes(a.id)
                                    return (
                                        <div key={a.id} style={{ display: 'flex', alignItems: 'center' }}>
                                            <div
                                                onClick={() => { setSelectedAgent(a.id); setDepartmentTab('chat') }}
                                                style={{
                                                    width: 148, minWidth: 148, cursor: 'pointer',
                                                    background: '#fff', borderRadius: 16,
                                                    border: `2px solid ${isLive ? a.color : '#E5E5EA'}`,
                                                    padding: '20px 14px', textAlign: 'center',
                                                    transition: 'all 0.2s',
                                                    boxShadow: isLive
                                                        ? `0 4px 16px ${a.color}18`
                                                        : '0 1px 3px rgba(0,0,0,0.04)',
                                                }}
                                            >
                                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                                                    <img src={a.photo} alt={a.name} style={{
                                                        width: 52, height: 52, borderRadius: 14, objectFit: 'cover',
                                                        border: `2px solid ${a.color}30`,
                                                    }} />
                                                    <span style={{
                                                        position: 'absolute', bottom: -2, right: -2,
                                                        width: 12, height: 12, borderRadius: '50%',
                                                        border: '2px solid #fff',
                                                        background: isLive ? '#34C759' : '#AEAEB2',
                                                    }} />
                                                </div>
                                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.name}</div>
                                                <div style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                                    padding: '2px 8px', borderRadius: 100,
                                                    background: `${a.color}10`, color: a.color,
                                                    fontSize: 10, fontWeight: 700,
                                                }}>
                                                    Stage {a.stage} &middot; {a.label}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 6, lineHeight: 1.3 }}>
                                                    {a.desc}
                                                </div>
                                            </div>
                                            {i < WIZARD_AGENTS.length - 1 && (
                                                <div style={{ padding: '0 6px', color: '#D1D1D6' }}>{Icons.chevronRight}</div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 40 }}>
                                {[
                                    { label: 'Agents Online', value: liveAgents.length, icon: Icons.pipeline, color: '#007AFF' },
                                    { label: 'Cron Jobs', value: cronJobs.length, icon: Icons.clock, color: '#FF9500' },
                                    { label: 'Pipeline Ready', value: `${WIZARD_AGENTS.filter(w => liveIds.includes(w.id)).length}/7`, icon: Icons.check, color: '#34C759' },
                                    { label: 'Gateway', value: gatewayOk ? 'Connected' : 'Down', icon: Icons.globe, color: gatewayOk ? '#059669' : '#DC2626' },
                                ].map((s, i) => (
                                    <div key={i} style={{
                                        background: '#fff', border: '1px solid var(--separator)',
                                        borderRadius: 16, padding: '20px 24px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#AEAEB2' }}>
                                            {s.icon}
                                            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
                                        </div>
                                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Handoff Protocol */}
                            <div style={{ marginTop: 40 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Handoff Protocol</h3>
                                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--separator)', overflow: 'hidden' }}>
                                    {WIZARD_AGENTS.map((a, i) => (
                                        <div key={a.id} style={{
                                            display: 'flex', alignItems: 'center', gap: 16,
                                            padding: '14px 20px',
                                            borderBottom: i < WIZARD_AGENTS.length - 1 ? '1px solid var(--separator)' : 'none',
                                        }}>
                                            <img src={a.photo} alt={a.name} style={{
                                                width: 32, height: 32, borderRadius: 8, objectFit: 'cover',
                                            }} />
                                            <span style={{ fontWeight: 600, width: 72, fontSize: 14 }}>{a.name}</span>
                                            <span style={{ color: '#6E6E73', fontSize: 13, flex: 1 }}>
                                                {i === 0 ? 'Receives user idea' : `Receives handoff-to-${a.id}.md`}
                                                &nbsp;&rarr;&nbsp;
                                                {i < WIZARD_AGENTS.length - 1
                                                    ? `Outputs handoff-to-${WIZARD_AGENTS[i + 1].id}.md`
                                                    : 'Final submission package'
                                                }
                                            </span>
                                            <span style={{
                                                padding: '2px 10px', borderRadius: 100,
                                                background: `${a.color}10`, color: a.color,
                                                fontSize: 10, fontWeight: 700,
                                            }}>Stage {a.stage}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : agent ? (
                        /* ── Agent Department ─────────────────────── */
                        <AgentDepartment
                            agent={agent}
                            tab={departmentTab}
                            setTab={setDepartmentTab}
                            onBack={() => setSelectedAgent(null)}
                            isLive={liveIds.includes(agent.id)}
                        />
                    ) : null}
                </main>
            </div>

            <style>{`
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
                @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes thinking { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-5px);opacity:1} }
            `}</style>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   AGENT DEPARTMENT — Chat + Skills + Tools tabs
   ═══════════════════════════════════════════════════════════════════ */
function AgentDepartment({ agent, tab, setTab, onBack, isLive }: {
    agent: typeof WIZARD_AGENTS[0]
    tab: 'chat' | 'skills' | 'tools' | 'assets' | 'terminal'
    setTab: (t: 'chat' | 'skills' | 'tools' | 'assets' | 'terminal') => void
    onBack: () => void
    isLive: boolean
}) {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease' }}>
            {/* ── Department Header ──────────────────────────── */}
            <div style={{
                padding: '24px 32px', borderBottom: '1px solid var(--separator)',
                background: '#fff',
            }}>
                <button onClick={onBack} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: '#6E6E73', marginBottom: 16,
                    fontFamily: 'var(--font)',
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Back to Pipeline
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ position: 'relative' }}>
                        <img src={agent.photo} alt={agent.name} style={{
                            width: 64, height: 64, borderRadius: 16, objectFit: 'cover',
                            border: `3px solid ${agent.color}30`,
                        }} />
                        <span style={{
                            position: 'absolute', bottom: -2, right: -2,
                            width: 14, height: 14, borderRadius: '50%',
                            border: '3px solid #fff',
                            background: isLive ? '#34C759' : '#AEAEB2',
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{agent.name}</h2>
                            <span style={{
                                padding: '3px 10px', borderRadius: 100,
                                background: `${agent.color}12`, color: agent.color,
                                fontSize: 11, fontWeight: 700,
                            }}>Stage {agent.stage} &middot; {agent.label}</span>
                            <span style={{
                                padding: '3px 10px', borderRadius: 100,
                                background: isLive ? '#ECFDF3' : '#FEF3F2',
                                color: isLive ? '#059669' : '#DC2626',
                                fontSize: 11, fontWeight: 600,
                            }}>{isLive ? 'Online' : 'Offline'}</span>
                        </div>
                        <div style={{ fontSize: 14, color: '#6E6E73', marginTop: 4 }}>
                            {agent.title} &middot; {agent.desc}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 12, color: '#AEAEB2' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{Icons.volume} {agent.voiceName}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{Icons.chat} {agent.telegram}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{Icons.zap} {agent.skills.length} skills</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{Icons.tool} {agent.tools.length} tools</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 0, marginTop: 20 }}>
                    {[
                        { key: 'chat' as const, label: 'Chat', icon: Icons.chat },
                        { key: 'skills' as const, label: 'Skills', icon: Icons.zap },
                        { key: 'tools' as const, label: 'Tools', icon: Icons.tool },
                        { key: 'assets' as const, label: 'Assets', icon: Icons.folder },
                        ...(agent.id === 'builder' ? [{ key: 'terminal' as const, label: 'Terminal', icon: Icons.code }] : []),
                    ].map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '10px 20px', border: 'none',
                                borderBottom: `2px solid ${tab === t.key ? agent.color : 'transparent'}`,
                                background: 'none', cursor: 'pointer',
                                fontSize: 14, fontWeight: tab === t.key ? 600 : 500,
                                color: tab === t.key ? '#1D1D1F' : '#6E6E73',
                                transition: 'all 0.15s', fontFamily: 'var(--font)',
                            }}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab Content ──────────────────────────────────── */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {tab === 'chat' && <ChatPanel key={agent.id} agent={agent} />}
                {tab === 'skills' && <SkillsPanel agent={agent} />}
                {tab === 'tools' && <ToolsPanel agent={agent} />}
                {tab === 'assets' && <AssetsPanel agent={agent} />}
                {tab === 'terminal' && <TerminalPanel agent={agent} />}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   CHAT PANEL — with TTS/STT
   ═══════════════════════════════════════════════════════════════════ */
function ChatPanel({ agent }: { agent: typeof WIZARD_AGENTS[0] }) {
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([
        { role: 'agent', text: `Hi! I'm ${agent.name}, your ${agent.title}. How can I help with your app today?` },
    ])
    const [input, setInput] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [ttsEnabled, setTtsEnabled] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const messagesEnd = useRef<HTMLDivElement>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim() || isSending) return
        const userMsg = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setIsSending(true)

        try {
            const res = await fetch('/api/openclaw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'chat',
                    agentId: agent.id,
                    message: userMsg,
                }),
            })
            const data = await res.json()
            const reply = data.response || data.text || data.message || `I'll work on that for you. My ${agent.skills.length} skills are ready.`
            setMessages(prev => [...prev, { role: 'agent', text: reply }])

            // Auto-play TTS if enabled
            if (ttsEnabled) {
                playTTS(reply)
            }
        } catch {
            setMessages(prev => [...prev, {
                role: 'agent',
                text: `I'm here and ready! As ${agent.title}, I specialize in ${agent.desc.toLowerCase()}. What would you like to work on?`
            }])
        } finally {
            setIsSending(false)
        }
    }

    const playTTS = async (text: string) => {
        try {
            setIsPlaying(true)
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text.substring(0, 500), agentId: agent.id }),
            })
            if (!res.ok) throw new Error('TTS failed')
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            if (audioRef.current) {
                audioRef.current.src = url
                audioRef.current.play()
                audioRef.current.onended = () => setIsPlaying(false)
            }
        } catch {
            setIsPlaying(false)
        }
    }

    const toggleSTT = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser')
            return
        }
        if (isListening) {
            setIsListening(false)
            return
        }
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.continuous = false
        recognition.interimResults = false
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInput(transcript)
            setIsListening(false)
        }
        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)
        recognition.start()
        setIsListening(true)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', gap: 12, marginBottom: 16,
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        animation: 'slideUp 0.2s ease',
                    }}>
                        {msg.role === 'agent' && (
                            <img src={agent.photo} alt="" style={{
                                width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
                            }} />
                        )}
                        <div style={{
                            maxWidth: '65%', padding: '12px 16px',
                            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: msg.role === 'user' ? '#1D1D1F' : '#F2F2F7',
                            color: msg.role === 'user' ? '#fff' : '#1D1D1F',
                            fontSize: 14, lineHeight: 1.5,
                        }}>
                            {msg.text}
                            {msg.role === 'agent' && ttsEnabled && (
                                <button onClick={() => playTTS(msg.text)} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: agent.color, marginLeft: 8, padding: 2,
                                }}>
                                    {isPlaying ? Icons.pause : Icons.volume}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {isSending && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <img src={agent.photo} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                        <div style={{ display: 'flex', gap: 4, padding: '14px 16px', background: '#F2F2F7', borderRadius: '16px 16px 16px 4px' }}>
                            {[0, 1, 2].map(n => (
                                <span key={n} style={{
                                    width: 6, height: 6, borderRadius: '50%', background: '#AEAEB2',
                                    animation: `thinking 1.2s infinite ${n * 0.2}s`,
                                }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={messagesEnd} />
            </div>

            {/* Input bar */}
            <div style={{
                padding: '16px 32px', borderTop: '1px solid var(--separator)',
                background: '#fff', display: 'flex', alignItems: 'center', gap: 8,
            }}>
                {/* STT button */}
                <button onClick={toggleSTT} style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none',
                    background: isListening ? '#FF3B30' : '#F2F2F7',
                    color: isListening ? '#fff' : '#6E6E73',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: isListening ? 'pulse 1s infinite' : 'none',
                }} title="Voice input">
                    {Icons.mic}
                </button>

                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={`Message ${agent.name}...`}
                    style={{
                        flex: 1, padding: '10px 16px', border: '1.5px solid var(--separator)',
                        borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'var(--font)',
                        background: '#FAFAFA',
                    }}
                />

                {/* TTS toggle */}
                <button onClick={() => setTtsEnabled(!ttsEnabled)} style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none',
                    background: ttsEnabled ? `${agent.color}15` : '#F2F2F7',
                    color: ttsEnabled ? agent.color : '#6E6E73',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} title={`Voice: ${agent.voiceName} (${ttsEnabled ? 'ON' : 'OFF'})`}>
                    {Icons.volume}
                </button>

                <button onClick={sendMessage} disabled={!input.trim() || isSending} style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none',
                    background: input.trim() ? '#1D1D1F' : '#E5E5EA',
                    color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {Icons.send}
                </button>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   SKILLS PANEL
   ═══════════════════════════════════════════════════════════════════ */
function SkillsPanel({ agent }: { agent: typeof WIZARD_AGENTS[0] }) {
    return (
        <div style={{ padding: '32px', animation: 'slideUp 0.3s ease' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Assigned Skills</h3>
            <p style={{ fontSize: 13, color: '#6E6E73', marginBottom: 24 }}>
                {agent.skills.length} OpenClaw skills installed for {agent.name}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {agent.skills.map(skill => (
                    <div key={skill} style={{
                        background: '#fff', border: '1px solid var(--separator)',
                        borderRadius: 12, padding: '16px 20px',
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `${agent.color}10`, color: agent.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {Icons.zap}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{skill}</div>
                            <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 2 }}>openclaw-managed</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   TOOLS PANEL
   ═══════════════════════════════════════════════════════════════════ */
function ToolsPanel({ agent }: { agent: typeof WIZARD_AGENTS[0] }) {
    return (
        <div style={{ padding: '32px', animation: 'slideUp 0.3s ease' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Available Tools</h3>
            <p style={{ fontSize: 13, color: '#6E6E73', marginBottom: 24 }}>
                {agent.tools.length} tools accessible to {agent.name}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {agent.tools.map(tool => (
                    <div key={tool} style={{
                        background: '#fff', border: '1px solid var(--separator)',
                        borderRadius: 12, padding: '16px 20px',
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `${agent.color}10`, color: agent.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {Icons.tool}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{tool}</div>
                            <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 2 }}>Available</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Voice Configuration */}
            <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Voice Configuration</h3>
                <div style={{
                    background: '#fff', border: '1px solid var(--separator)',
                    borderRadius: 12, padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: 20,
                }}>
                    <img src={agent.photo} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>ElevenLabs Voice: {agent.voiceName}</div>
                        <div style={{ fontSize: 12, color: '#6E6E73', marginTop: 4 }}>
                            American English &middot; Turbo v2.5 &middot; Stability: 0.5 &middot; Similarity: 0.75
                        </div>
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 12px', borderRadius: 100,
                        background: '#ECFDF3', color: '#059669',
                        fontSize: 11, fontWeight: 600,
                    }}>
                        {Icons.check} Active
                    </div>
                </div>
            </div>

            {/* Telegram Bot */}
            <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Telegram Bot</h3>
                <div style={{
                    background: '#fff', border: '1px solid var(--separator)',
                    borderRadius: 12, padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: 20,
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {Icons.send}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{agent.telegram}</div>
                        <div style={{ fontSize: 12, color: '#6E6E73', marginTop: 4 }}>
                            Telegram Bot &middot; Polling active &middot; Groq Llama 3.3 70B
                        </div>
                    </div>
                    <a href={`https://t.me/${agent.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '6px 14px', borderRadius: 100,
                        background: '#F2F2F7', color: '#1D1D1F',
                        fontSize: 12, fontWeight: 600, textDecoration: 'none',
                    }}>
                        Open {Icons.externalLink}
                    </a>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   ASSETS PANEL — Downloads, Uploads, Voice Links, Genie & Scripts
   ═══════════════════════════════════════════════════════════════════ */
function AssetsPanel({ agent }: { agent: typeof WIZARD_AGENTS[0] }) {
    const [copied, setCopied] = useState<string | null>(null)
    const [uploadName, setUploadName] = useState('')

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        setCopied(label)
        setTimeout(() => setCopied(null), 2000)
    }

    const sectionHeader = (title: string, icon: React.ReactNode) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${agent.color}10`, color: agent.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h3>
        </div>
    )

    const assetCard = (content: React.ReactNode) => (
        <div style={{
            background: '#fff', border: '1px solid var(--separator)',
            borderRadius: 14, padding: '20px 24px', marginBottom: 16,
        }}>{content}</div>
    )

    return (
        <div style={{ padding: '32px', overflowY: 'auto', height: '100%', animation: 'slideUp 0.3s ease' }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
                {agent.name}&apos;s Assets
            </h3>
            <p style={{ fontSize: 13, color: '#6E6E73', marginBottom: 32 }}>
                Profile photo, voice, Genie prompts, sitcom scripts, and file uploads for {agent.name}
            </p>

            {/* ── Profile Photo ───────────────────────────── */}
            {sectionHeader('Profile Photo', Icons.image)}
            {assetCard(
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <img src={agent.photo} alt={agent.name} style={{
                        width: 80, height: 80, borderRadius: 16, objectFit: 'cover',
                        border: `3px solid ${agent.color}30`,
                    }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{agent.name} — {agent.title}</div>
                        <div style={{ fontSize: 12, color: '#6E6E73', marginBottom: 12 }}>
                            {agent.photo} &middot; AI-generated profile photo
                        </div>
                        <a
                            href={agent.photo}
                            download={`${agent.id}-profile.png`}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '8px 16px', borderRadius: 10,
                                background: '#1D1D1F', color: '#fff',
                                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {Icons.download} Download Photo
                        </a>
                    </div>
                </div>
            )}

            {/* ── ElevenLabs Voice ────────────────────────── */}
            {sectionHeader('Voice Configuration', Icons.volume)}
            {assetCard(
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: `${agent.color}10`, color: agent.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24,
                    }}>{Icons.volume}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{agent.voiceName}</div>
                        <div style={{ fontSize: 12, color: '#6E6E73', marginTop: 4 }}>
                            Voice ID: {agent.voiceId} &middot; American English &middot; Turbo v2.5
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => copyToClipboard(agent.voiceId, 'voiceId')} style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '8px 14px', borderRadius: 10, border: '1px solid var(--separator)',
                            background: copied === 'voiceId' ? '#ECFDF3' : '#F2F2F7',
                            color: copied === 'voiceId' ? '#059669' : '#1D1D1F',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
                        }}>
                            {copied === 'voiceId' ? Icons.check : Icons.copy} {copied === 'voiceId' ? 'Copied!' : 'Copy ID'}
                        </button>
                        <a
                            href={`https://elevenlabs.io/voice-library`}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                padding: '8px 14px', borderRadius: 10,
                                background: '#1D1D1F', color: '#fff',
                                fontSize: 12, fontWeight: 600, textDecoration: 'none',
                            }}
                        >
                            ElevenLabs {Icons.externalLink}
                        </a>
                    </div>
                </div>
            )}

            {/* ── Genie Character Prompt ──────────────────── */}
            {sectionHeader('Genie Character Prompt', Icons.globe)}
            {assetCard(
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ fontSize: 13, color: '#6E6E73' }}>
                            Office-style character prompt for Google Genie world generation
                        </div>
                        <button onClick={() => copyToClipboard(agent.geniePrompt, 'genie')} style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '6px 12px', borderRadius: 8, border: '1px solid var(--separator)',
                            background: copied === 'genie' ? '#ECFDF3' : '#F2F2F7',
                            color: copied === 'genie' ? '#059669' : '#1D1D1F',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                            fontFamily: 'var(--font)',
                        }}>
                            {copied === 'genie' ? Icons.check : Icons.copy} {copied === 'genie' ? 'Copied!' : 'Copy Prompt'}
                        </button>
                    </div>
                    <div style={{
                        background: '#FAFAFA', borderRadius: 10, padding: '16px 20px',
                        fontSize: 13, lineHeight: 1.6, color: '#1D1D1F',
                        border: '1px solid var(--separator)',
                        fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
                    }}>
                        {agent.geniePrompt}
                    </div>
                    <a href="https://labs.google/genie" target="_blank" rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            marginTop: 12, fontSize: 12, color: agent.color,
                            fontWeight: 600, textDecoration: 'none',
                        }}
                    >
                        Open Google Genie {Icons.externalLink}
                    </a>
                </div>
            )}

            {/* ── Sitcom Script (for Tuber) ─────────────────── */}
            {sectionHeader('Sitcom Script — "The Office"', Icons.film)}
            {assetCard(
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ fontSize: 13, color: '#6E6E73' }}>
                            YouTube sitcom scene for Tuber&apos;s content pipeline
                        </div>
                        <button onClick={() => copyToClipboard(agent.sitcomScript, 'script')} style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '6px 12px', borderRadius: 8, border: '1px solid var(--separator)',
                            background: copied === 'script' ? '#ECFDF3' : '#F2F2F7',
                            color: copied === 'script' ? '#059669' : '#1D1D1F',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                            fontFamily: 'var(--font)',
                        }}>
                            {copied === 'script' ? Icons.check : Icons.copy} {copied === 'script' ? 'Copied!' : 'Copy Script'}
                        </button>
                    </div>
                    <div style={{
                        background: '#1D1D1F', borderRadius: 10, padding: '20px 24px',
                        fontSize: 13, lineHeight: 1.8, color: '#E5E5EA',
                        fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
                        whiteSpace: 'pre-wrap', maxHeight: 320, overflowY: 'auto',
                    }}>
                        {agent.sitcomScript}
                    </div>
                </div>
            )}

            {/* ── Quick Links ────────────────────────────────── */}
            {sectionHeader('Quick Links', Icons.externalLink)}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 32 }}>
                {[
                    { label: 'Telegram Bot', url: `https://t.me/${agent.telegram.replace('@', '')}`, icon: Icons.send },
                    { label: 'ElevenLabs Console', url: 'https://elevenlabs.io/voice-library', icon: Icons.volume },
                    { label: 'Google Genie', url: 'https://labs.google/genie', icon: Icons.globe },
                    { label: 'OpenClaw Dashboard', url: 'http://127.0.0.1:18789/instances', icon: Icons.pipeline },
                ].map(link => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '14px 18px', borderRadius: 12,
                        background: '#fff', border: '1px solid var(--separator)',
                        textDecoration: 'none', color: '#1D1D1F',
                        fontSize: 13, fontWeight: 600,
                        transition: 'all 0.15s',
                    }}>
                        <span style={{ color: agent.color }}>{link.icon}</span>
                        {link.label}
                        <span style={{ marginLeft: 'auto', color: '#AEAEB2' }}>{Icons.externalLink}</span>
                    </a>
                ))}
            </div>

            {/* ── Templates & Config ──────────────────────────── */}
            {sectionHeader('Templates & Config', Icons.folder)}
            {agent.id === 'pixel' ? (
                /* Pixel — Screenshot Template Categories */
                assetCard(
                    <div>
                        <div style={{ fontSize: 13, color: '#6E6E73', marginBottom: 16 }}>
                            AppScreens.com template mapping — Pixel uses these to select the right screenshot style
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                            {[
                                { cat: 'AI & Productivity', styles: 'Simple, Minimalist, Frameless', color: '#007AFF' },
                                { cat: 'Fitness & Health', styles: 'Dynamic Frame, Colourful, Gradient', color: '#34C759' },
                                { cat: 'Social & Dating', styles: 'Frameless, 3D, Panoramic', color: '#FF2D55' },
                                { cat: 'Food & Lifestyle', styles: 'Image Overlay, Gradient, Hand Held', color: '#FF9500' },
                                { cat: 'Finance & Utility', styles: 'Dark, Advanced, Divided Device', color: '#5856D6' },
                                { cat: 'Entertainment', styles: 'Multi Layered, Panoramic, Image Overlay', color: '#AF52DE' },
                                { cat: 'Education', styles: 'Colourful, Graphics, Dynamic Frame', color: '#5AC8FA' },
                                { cat: 'Shopping', styles: 'Frameless, Hand Held, Simple', color: '#FF9500' },
                                { cat: 'Travel', styles: 'Image Overlay, Gradient, Panoramic', color: '#34C759' },
                                { cat: 'Kids & Family', styles: 'Colourful, Graphics, Multi Layered', color: '#FF2D55' },
                            ].map(row => (
                                <div key={row.cat} style={{
                                    padding: '12px 16px', borderRadius: 10,
                                    background: '#FAFAFA', border: '1px solid var(--separator)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 4, background: row.color }} />
                                        <span style={{ fontSize: 13, fontWeight: 700 }}>{row.cat}</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#6E6E73' }}>{row.styles}</div>
                                </div>
                            ))}
                        </div>
                        <a href="https://appscreens.com/templates" target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                marginTop: 16, padding: '8px 16px', borderRadius: 10,
                                background: '#1D1D1F', color: '#fff',
                                fontSize: 12, fontWeight: 600, textDecoration: 'none',
                            }}>
                            {Icons.externalLink} Open AppScreens.com
                        </a>
                    </div>
                )
            ) : agent.id === 'builder' ? (
                /* Builder — Light/Dark Theme Preview */
                assetCard(
                    <div>
                        <div style={{ fontSize: 13, color: '#6E6E73', marginBottom: 16 }}>
                            Apple-native UI templates — Builder asks user to choose Light or Dark, then applies the theme
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {/* Light Theme */}
                            <div style={{
                                borderRadius: 14, overflow: 'hidden',
                                border: '1px solid var(--separator)',
                            }}>
                                <div style={{
                                    padding: '16px 20px', background: '#FFFFFF',
                                    borderBottom: '0.5px solid rgba(0,0,0,0.12)',
                                }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', marginBottom: 4 }}>
                                        Apple Light
                                    </div>
                                    <div style={{ fontSize: 11, color: '#3C3C43' }}>
                                        White bg · Black text · Liquid glass
                                    </div>
                                </div>
                                <div style={{ padding: '16px 20px', background: '#F2F2F7' }}>
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                                        {['#007AFF', '#34C759', '#FF3B30', '#FF9500', '#AF52DE', '#5856D6'].map(c => (
                                            <div key={c} style={{
                                                width: 24, height: 24, borderRadius: 6,
                                                background: c,
                                            }} title={c} />
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <div style={{
                                            padding: '8px 14px', borderRadius: 10,
                                            background: '#007AFF', color: '#fff',
                                            fontSize: 12, fontWeight: 600,
                                        }}>Primary</div>
                                        <div style={{
                                            padding: '8px 14px', borderRadius: 10,
                                            background: 'transparent', color: '#007AFF',
                                            fontSize: 12, fontWeight: 600,
                                            border: '1px solid #007AFF',
                                        }}>Secondary</div>
                                        <div style={{
                                            padding: '8px 14px', borderRadius: 10,
                                            background: '#FF3B30', color: '#fff',
                                            fontSize: 12, fontWeight: 600,
                                        }}>Delete</div>
                                    </div>
                                </div>
                            </div>

                            {/* Dark Theme */}
                            <div style={{
                                borderRadius: 14, overflow: 'hidden',
                                border: '1px solid #38383A',
                            }}>
                                <div style={{
                                    padding: '16px 20px', background: '#000000',
                                    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
                                }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                                        Apple Dark
                                    </div>
                                    <div style={{ fontSize: 11, color: '#EBEBF5' }}>
                                        Black bg · White text · Dark glass
                                    </div>
                                </div>
                                <div style={{ padding: '16px 20px', background: '#1C1C1E' }}>
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                                        {['#0A84FF', '#30D158', '#FF453A', '#FF9F0A', '#BF5AF2', '#5E5CE6'].map(c => (
                                            <div key={c} style={{
                                                width: 24, height: 24, borderRadius: 6,
                                                background: c,
                                            }} title={c} />
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <div style={{
                                            padding: '8px 14px', borderRadius: 10,
                                            background: '#0A84FF', color: '#fff',
                                            fontSize: 12, fontWeight: 600,
                                        }}>Primary</div>
                                        <div style={{
                                            padding: '8px 14px', borderRadius: 10,
                                            background: 'transparent', color: '#0A84FF',
                                            fontSize: 12, fontWeight: 600,
                                            border: '1px solid #0A84FF',
                                        }}>Secondary</div>
                                        <div style={{
                                            padding: '8px 14px', borderRadius: 10,
                                            background: '#FF453A', color: '#fff',
                                            fontSize: 12, fontWeight: 600,
                                        }}>Delete</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: '#FAFAFA', border: '1px solid var(--separator)' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Expo Stack</div>
                            <div style={{ fontSize: 11, color: '#6E6E73', lineHeight: 1.8 }}>
                                expo-router · expo-blur (liquid glass) · expo-haptics · react-native-reanimated · @shopify/flash-list · @gorhom/bottom-sheet · zustand · expo-symbols (SF Symbols)
                            </div>
                        </div>
                    </div>
                )
            ) : agent.id === 'buzz' ? (
                /* Buzz — Landing Page Compliance Checklist */
                assetCard(
                    <div>
                        <div style={{ fontSize: 13, color: '#6E6E73', marginBottom: 16 }}>
                            Apple App Store landing page compliance — Buzz checks every item before publishing
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
                            {[
                                'Privacy Policy page accessible and linked from footer',
                                'Terms of Service page accessible and linked from footer',
                                'Support page with contact method (email form or help center)',
                                'App Store badge follows Apple marketing guidelines',
                                'No misleading claims about app functionality',
                                'Screenshots match actual app functionality',
                                'Subscription auto-renewal disclosures visible before purchase',
                                'Price displayed matches App Store listing',
                                'Age rating mentioned if app targets specific audiences',
                                'COPPA compliance if targeting children under 13',
                                'No use of Apple trademarks beyond official badges',
                                'HTTPS enabled on all pages',
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '8px 12px', borderRadius: 8,
                                    background: i % 2 === 0 ? '#FAFAFA' : '#fff',
                                }}>
                                    <span style={{ color: '#059669', flexShrink: 0 }}>{Icons.check}</span>
                                    <span style={{ fontSize: 12, color: '#1D1D1F' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: '#FFF7ED', border: '1px solid #FDBA74' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#9A3412', marginBottom: 4 }}>Required Legal Pages</div>
                            <div style={{ fontSize: 11, color: '#9A3412' }}>
                                /privacy · /terms · /support — These URLs are entered in App Store Connect and must be live before submission
                            </div>
                        </div>
                    </div>
                )
            ) : (
                /* All other agents — Config file listing */
                assetCard(
                    <div>
                        <div style={{ fontSize: 13, color: '#6E6E73', marginBottom: 12 }}>
                            Agent configuration files in <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 12 }}>agents/{agent.id}/</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 14px', borderRadius: 10,
                                background: '#FAFAFA', border: '1px solid var(--separator)',
                            }}>
                                <span style={{ color: agent.color }}>{Icons.folder}</span>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>SOUL.md</span>
                                <span style={{ fontSize: 11, color: '#6E6E73', marginLeft: 'auto' }}>Agent personality & instructions</span>
                            </div>
                        </div>
                    </div>
                )
            )}

            {/* ── File Upload ────────────────────────────────── */}
            {sectionHeader('Upload Asset', Icons.upload)}
            {assetCard(
                <div>
                    <div style={{ fontSize: 13, color: '#6E6E73', marginBottom: 16 }}>
                        Upload custom assets for {agent.name} (photos, scripts, voice samples, etc.)
                    </div>
                    <div style={{
                        border: '2px dashed var(--separator)', borderRadius: 12,
                        padding: '40px 24px', textAlign: 'center',
                        background: '#FAFAFA', cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = agent.color; e.currentTarget.style.background = `${agent.color}05` }}
                        onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--separator)'; e.currentTarget.style.background = '#FAFAFA' }}
                        onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--separator)'; e.currentTarget.style.background = '#FAFAFA'; const file = e.dataTransfer.files[0]; if (file) setUploadName(file.name) }}
                    >
                        <div style={{ color: '#AEAEB2', marginBottom: 8 }}>{Icons.upload}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F' }}>
                            {uploadName || 'Drag & drop files here'}
                        </div>
                        <div style={{ fontSize: 12, color: '#AEAEB2', marginTop: 4 }}>
                            PNG, JPG, MP3, JSON, MD — Max 10MB
                        </div>
                        <input type="file" style={{ display: 'none' }} id={`upload-${agent.id}`}
                            onChange={e => { const f = e.target.files?.[0]; if (f) setUploadName(f.name) }}
                        />
                        <label htmlFor={`upload-${agent.id}`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            marginTop: 16, padding: '8px 20px', borderRadius: 10,
                            background: '#1D1D1F', color: '#fff',
                            fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>
                            {Icons.upload} Browse Files
                        </label>
                    </div>
                    {uploadName && (
                        <div style={{
                            marginTop: 12, padding: '10px 16px', borderRadius: 8,
                            background: '#ECFDF3', display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <span style={{ color: '#059669' }}>{Icons.check}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>
                                {uploadName} selected
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   TERMINAL PANEL — Builder's interactive terminal for coding apps
   ═══════════════════════════════════════════════════════════════════ */
function TerminalPanel({ agent }: { agent: typeof WIZARD_AGENTS[0] }) {
    const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; output: string; ts: string }>>([])
    const [currentCmd, setCurrentCmd] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const outputRef = useRef<HTMLDivElement>(null)

    const quickCommands = [
        { label: 'Create Project', cmd: 'npx create-expo-app@latest ./my-app --template blank-typescript' },
        { label: 'Install Deps', cmd: 'cd my-app && npm install expo-blur expo-haptics expo-linear-gradient zustand @shopify/flash-list react-native-reanimated' },
        { label: 'Start Dev', cmd: 'cd my-app && npx expo start' },
        { label: 'Build iOS', cmd: 'cd my-app && eas build --platform ios --profile preview' },
        { label: 'List Devices', cmd: 'xcrun simctl list devices available | head -20' },
        { label: 'Expo Doctor', cmd: 'cd my-app && npx expo-doctor' },
    ]

    const runCommand = async (cmd: string) => {
        if (!cmd.trim() || isRunning) return
        setIsRunning(true)
        const ts = new Date().toLocaleTimeString()

        try {
            const res = await fetch('/api/terminal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: cmd }),
            })
            const data = await res.json()
            setCommandHistory(prev => [...prev, { cmd, output: data.output || data.error || 'Command executed', ts }])
        } catch {
            setCommandHistory(prev => [...prev, { cmd, output: '⚠ Terminal API not available. Deploy with terminal endpoint enabled.', ts }])
        } finally {
            setIsRunning(false)
            setCurrentCmd('')
            setTimeout(() => outputRef.current?.scrollTo(0, outputRef.current.scrollHeight), 50)
        }
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1A1A2E' }}>
            {/* Terminal header */}
            <div style={{
                padding: '12px 20px', borderBottom: '1px solid #2D2D44',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
                    </div>
                    <span style={{ color: '#8B8BA7', fontSize: 12, fontWeight: 600, marginLeft: 8 }}>
                        builder@launchfleet ~ /projects
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {quickCommands.map(qc => (
                        <button
                            key={qc.label}
                            onClick={() => runCommand(qc.cmd)}
                            disabled={isRunning}
                            style={{
                                padding: '4px 10px', borderRadius: 6, border: '1px solid #3D3D5C',
                                background: '#2D2D44', color: '#A0A0C0', fontSize: 10, fontWeight: 600,
                                cursor: isRunning ? 'wait' : 'pointer', fontFamily: 'var(--font)',
                                transition: 'all 0.15s',
                            }}
                        >
                            {qc.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Terminal output */}
            <div
                ref={outputRef}
                style={{
                    flex: 1, overflow: 'auto', padding: 20,
                    fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
                    fontSize: 13, lineHeight: 1.6, color: '#E0E0F0',
                }}
            >
                {/* Welcome message */}
                <div style={{ color: '#28C840', marginBottom: 16 }}>
                    ╔══════════════════════════════════════════════╗{'\n'}
                    ║  Builder Terminal — Expo Project Workspace   ║{'\n'}
                    ║  Expo CLI + EAS CLI installed and ready      ║{'\n'}
                    ╚══════════════════════════════════════════════╝
                </div>
                <div style={{ color: '#8B8BA7', marginBottom: 20, fontSize: 12 }}>
                    Use the quick commands above or type your own below.
                    {'\n'}Working directory: ~/Documents/LaunchFleet Projects/
                </div>

                {/* Command history */}
                {commandHistory.map((entry, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ color: '#28C840' }}>$</span>
                            <span style={{ color: '#E0E0F0' }}>{entry.cmd}</span>
                            <span style={{ color: '#4D4D6D', fontSize: 11, marginLeft: 'auto' }}>{entry.ts}</span>
                        </div>
                        <pre style={{
                            margin: '4px 0 0 18px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            color: entry.output.startsWith('⚠') ? '#FEBC2E' : '#A0A0C0',
                            fontSize: 12,
                        }}>
                            {entry.output}
                        </pre>
                    </div>
                ))}

                {/* Active spinner */}
                {isRunning && (
                    <div style={{ display: 'flex', gap: 8, color: '#5E5CE6' }}>
                        <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                        <span>Running...</span>
                    </div>
                )}
            </div>

            {/* Command input */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', borderTop: '1px solid #2D2D44',
                background: '#16162A',
            }}>
                <span style={{ color: '#28C840', fontFamily: '"SF Mono", monospace', fontSize: 14, fontWeight: 700 }}>$</span>
                <input
                    value={currentCmd}
                    onChange={e => setCurrentCmd(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') runCommand(currentCmd) }}
                    placeholder="Type a command..."
                    disabled={isRunning}
                    style={{
                        flex: 1, background: 'none', border: 'none', outline: 'none',
                        color: '#E0E0F0', fontSize: 14,
                        fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
                    }}
                />
                <button
                    onClick={() => runCommand(currentCmd)}
                    disabled={isRunning || !currentCmd.trim()}
                    style={{
                        padding: '6px 14px', borderRadius: 6, border: 'none',
                        background: currentCmd.trim() ? '#5E5CE6' : '#2D2D44',
                        color: '#fff', fontSize: 12, fontWeight: 600,
                        cursor: currentCmd.trim() && !isRunning ? 'pointer' : 'default',
                        fontFamily: 'var(--font)',
                    }}
                >
                    Run
                </button>
            </div>
        </div>
    )
}
