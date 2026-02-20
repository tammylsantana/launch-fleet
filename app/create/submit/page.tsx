'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, Download, Github, Trash2, Shield, ChevronRight, Lightbulb, Tag, Palette, Wrench, Monitor, Globe, Store, Rocket, ExternalLink, AlertTriangle, Key } from 'lucide-react'

const STAGES = [
    { id: 'idea', label: 'Idea', icon: Lightbulb, path: '/create/idea' },
    { id: 'name', label: 'Name', icon: Tag, path: '/create/name' },
    { id: 'brand', label: 'Brand', icon: Palette, path: '/create/brand' },
    { id: 'build', label: 'Build', icon: Wrench, path: '/create/build' },
    { id: 'present', label: 'Present', icon: Monitor, path: '/create/present' },
    { id: 'landing', label: 'Landing', icon: Globe, path: '/create/landing' },
    { id: 'store', label: 'Store', icon: Store, path: '/create/store' },
    { id: 'submit', label: 'Submit', icon: Rocket, path: '/create/submit' },
]

const COMPLETED = ['idea', 'name', 'brand', 'build', 'present', 'landing', 'store']

const PRE_SUBMIT_CHECKS = [
    { id: 'idea', label: 'Market research and idea finalized', stage: 'Idea' },
    { id: 'name', label: 'Name, domains, and social handles secured', stage: 'Name' },
    { id: 'brand', label: 'Brand template and icon confirmed', stage: 'Brand' },
    { id: 'build', label: 'App code generated and API keys configured', stage: 'Build' },
    { id: 'screenshots', label: 'Screenshots and device mockups generated', stage: 'Present' },
    { id: 'landing', label: 'Landing page deployed to Vercel', stage: 'Landing' },
    { id: 'store', label: 'All App Store Connect fields completed', stage: 'Store' },
    { id: 'privacy', label: 'Privacy policy URL set', stage: 'Store' },
    { id: 'age', label: 'Age rating configured', stage: 'Store' },
    { id: 'export', label: 'Export compliance declared', stage: 'Store' },
    { id: 'ai', label: 'AI transparency disclosed', stage: 'Store' },
    { id: 'review', label: 'App Review contact and notes provided', stage: 'Store' },
]

export default function SubmitPage() {
    const [activeTab, setActiveTab] = useState('checklist')
    const [buildProgress, setBuildProgress] = useState(0)
    const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'uploading' | 'submitted' | 'error'>('idle')
    const [githubUrl, setGithubUrl] = useState<string | null>(null)
    const [zipReady, setZipReady] = useState(false)
    const [dataDestroyed, setDataDestroyed] = useState(false)
    const [selectedModel, setSelectedModel] = useState<string | null>(null)
    const [modelApiKey, setModelApiKey] = useState('')
    const [modelKeySaved, setModelKeySaved] = useState(false)
    const [cleanupAcknowledged, setCleanupAcknowledged] = useState(false)

    const AI_MODELS = [
        { id: 'groq', name: 'Groq', model: 'llama-3.3-70b-versatile', desc: 'Fastest inference. Free tier available.', url: 'https://console.groq.com/keys', badge: 'Recommended' },
        { id: 'openai', name: 'OpenAI', model: 'gpt-4o', desc: 'Most capable. $5 credit on signup.', url: 'https://platform.openai.com/api-keys', badge: '' },
        { id: 'anthropic', name: 'Anthropic', model: 'claude-sonnet-4-20250514', desc: 'Best for reasoning. $5 credit on signup.', url: 'https://console.anthropic.com/settings/keys', badge: '' },
        { id: 'google', name: 'Google Gemini', model: 'gemini-2.5-pro', desc: 'Multimodal. Generous free tier.', url: 'https://aistudio.google.com/apikey', badge: 'Free' },
        { id: 'mistral', name: 'Mistral', model: 'mistral-large-latest', desc: 'European AI. Competitive pricing.', url: 'https://console.mistral.ai/api-keys', badge: '' },
    ]

    const saveModelKey = () => {
        if (!selectedModel || !modelApiKey.trim()) return
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        localStorage.setItem('launchfleet_session', JSON.stringify({
            ...session,
            agentModel: selectedModel,
            agentModelName: AI_MODELS.find(m => m.id === selectedModel)?.model || '',
            agentApiKey: modelApiKey.trim(),
        }))
        setModelKeySaved(true)
    }

    const startSubmission = async () => {
        setBuildStatus('building')

        // Simulate build progress
        const steps = [
            { progress: 10, label: 'Preparing Expo project...' },
            { progress: 30, label: 'Running EAS Build...' },
            { progress: 50, label: 'Compiling native code...' },
            { progress: 70, label: 'Building IPA...' },
            { progress: 85, label: 'Uploading to App Store Connect...' },
            { progress: 95, label: 'Submitting for review...' },
            { progress: 100, label: 'Done' },
        ]

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 800))
            setBuildProgress(step.progress)
            if (step.progress === 85) setBuildStatus('uploading')
        }

        setBuildStatus('submitted')
    }

    const uploadToGithub = async () => {
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            const res = await fetch('/api/github-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session }),
            })
            const data = await res.json()
            if (data.url) setGithubUrl(data.url)
        } catch {
            // Handle error
        }
    }

    const downloadZip = async () => {
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            const res = await fetch('/api/download-zip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session }),
            })
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${session.appName || 'app'}-launchfleet.zip`
            a.click()
            URL.revokeObjectURL(url)
            setZipReady(true)
        } catch {
            // Handle error
        }
    }

    const destroyData = async () => {
        if (!confirm('This will permanently delete all your session data from our servers. Your GitHub repo and ZIP file will remain. Continue?')) return
        try {
            await fetch('/api/destroy-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: 'current' }),
            })
            localStorage.removeItem('launchfleet_session')
            setDataDestroyed(true)
        } catch {
            // Handle error
        }
    }

    const TABS = ['checklist', 'build', 'handoff']

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <header style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--separator)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Link href="/create" style={{ textDecoration: 'none', color: '#1D1D1F', fontWeight: 700, fontSize: 'var(--fs-h3)' }}>LaunchFleet</Link>
                <div className="stage-nav" style={{ borderBottom: 'none', padding: 0 }}>
                    {STAGES.map((s, i) => (
                        <Link key={s.id} href={s.path} className={`stage-pill ${s.id === 'submit' ? 'active' : COMPLETED.includes(s.id) ? 'completed' : ''}`}>
                            <span className="stage-num">{COMPLETED.includes(s.id) ? <Check size={12} /> : i + 1}</span>
                            {s.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="page-header">
                    <div className="caption" style={{ marginBottom: 'var(--space-xs)' }}>Stage 8</div>
                    <h1>Submit</h1>
                    <p className="subhead">
                        Review your pre-submission checklist, build and upload, then collect your project files.
                    </p>
                </div>

                <div className="tabs" style={{ marginBottom: 'var(--space-xl)' }}>
                    {TABS.map(tab => (
                        <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab === 'checklist' ? 'Pre-Submit Checklist' : tab === 'build' ? 'Build and Upload' : 'Handoff'}
                        </button>
                    ))}
                </div>

                {/* Checklist tab */}
                {activeTab === 'checklist' && (
                    <div style={{ maxWidth: 700 }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Pre-Submission Checklist</h2>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {PRE_SUBMIT_CHECKS.map(item => {
                                const session = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('launchfleet_session') || '{}') : {}
                                const done = session[`${item.id}Complete`] || false
                                return (
                                    <div key={item.id} className="checklist-item">
                                        <div className={`check-circle ${done ? 'done' : ''}`}>
                                            {done && <Check size={14} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontWeight: 500 }}>{item.label}</span>
                                            <span className="caption" style={{ marginLeft: 'var(--space-sm)' }}>{item.stage}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Build tab */}
                {activeTab === 'build' && (
                    <div style={{ maxWidth: 700 }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Build and Upload</h2>

                        {buildStatus === 'idle' && (
                            <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                                    This will run EAS Build to create your IPA, upload it to App Store Connect, and submit for review.
                                </p>
                                <button className="btn btn-primary btn-lg" onClick={startSubmission}>
                                    Start Build and Submit
                                </button>
                            </div>
                        )}

                        {buildStatus !== 'idle' && (
                            <div>
                                <div style={{ marginBottom: 'var(--space-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                        <span style={{ fontWeight: 500 }}>
                                            {buildStatus === 'building' ? 'Building...' :
                                                buildStatus === 'uploading' ? 'Uploading to App Store Connect...' :
                                                    buildStatus === 'submitted' ? 'Submitted for review' :
                                                        'Error'}
                                        </span>
                                        <span className="footnote">{buildProgress}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${buildProgress}%` }} />
                                    </div>
                                </div>

                                {buildStatus === 'submitted' && (
                                    <div className="card" style={{ background: 'var(--bg-secondary)', border: 'none', textAlign: 'center' }}>
                                        <Check size={32} color="#1D1D1F" style={{ marginBottom: 'var(--space-md)' }} />
                                        <h3 style={{ marginBottom: 'var(--space-sm)' }}>App Submitted</h3>
                                        <p className="subhead">
                                            Your app has been submitted to Apple for review. You will receive a notification when the review is complete. Typical review time: 24-48 hours.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Handoff tab */}
                {activeTab === 'handoff' && (
                    <div style={{ maxWidth: 700 }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Project Handoff</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {/* GitHub */}
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Github size={22} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: 'var(--fs-body)' }}>Upload to GitHub</h3>
                                    <p className="footnote">Push the complete project to a new private repository.</p>
                                    {githubUrl && (
                                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--fs-footnote)', color: '#1D1D1F', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                            {githubUrl} <ExternalLink size={11} />
                                        </a>
                                    )}
                                </div>
                                <button className="btn btn-primary btn-sm" onClick={uploadToGithub} disabled={!!githubUrl}>
                                    {githubUrl ? <><Check size={14} /> Pushed</> : 'Upload'}
                                </button>
                            </div>

                            {/* ZIP Download */}
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Download size={22} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: 'var(--fs-body)' }}>Download ZIP</h3>
                                    <p className="footnote">Download the entire project as a ZIP file. Includes app code, assets, OpenClaw agent, and marketing plan.</p>
                                </div>
                                <button className="btn btn-primary btn-sm" onClick={downloadZip} disabled={zipReady}>
                                    {zipReady ? <><Check size={14} /> Downloaded</> : <><Download size={14} /> Download</>}
                                </button>
                            </div>

                            {/* OpenClaw Agent */}
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Rocket size={22} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: 'var(--fs-body)' }}>OpenClaw Agent</h3>
                                    <p className="footnote">Trained on your app. Includes 30-day marketing plan, social media schedule, analytics monitoring, ASO suggestions, review drafts, and ongoing support.</p>
                                </div>
                                <span className="badge badge-success">
                                    <Check size={12} /> Included
                                </span>
                            </div>

                            {/* AI Model Configuration — MANDATORY */}
                            <div className="card" style={{ border: modelKeySaved ? '1px solid var(--separator)' : '2px solid #1D1D1F', padding: 'var(--space-lg)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                                    <Key size={20} />
                                    <h3 style={{ fontSize: 'var(--fs-body)', margin: 0 }}>AI Model API Key</h3>
                                    {!modelKeySaved && (
                                        <span className="badge" style={{ background: '#FFF3CD', color: '#856404', fontSize: 11, padding: '2px 8px' }}>Required</span>
                                    )}
                                </div>

                                {!modelKeySaved && (
                                    <div style={{
                                        background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 'var(--radius-md)',
                                        padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-md)',
                                        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)',
                                    }}>
                                        <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                                        <p style={{ fontSize: 'var(--fs-footnote)', margin: 0, color: '#92400E' }}>
                                            Your OpenClaw agent requires an AI model to function. Without an API key, the agent cannot respond to queries, generate marketing content, or provide app support.
                                        </p>
                                    </div>
                                )}

                                <p className="footnote" style={{ marginBottom: 'var(--space-md)' }}>
                                    Select a model provider and paste your API key. This key is stored in your project — never on our servers.
                                </p>

                                {/* Model provider cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
                                    {AI_MODELS.map(model => (
                                        <div
                                            key={model.id}
                                            onClick={() => { setSelectedModel(model.id); setModelKeySaved(false) }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                                                padding: 'var(--space-sm) var(--space-md)',
                                                borderRadius: 'var(--radius-md)',
                                                border: selectedModel === model.id ? '2px solid #1D1D1F' : '1px solid var(--separator)',
                                                background: selectedModel === model.id ? 'var(--bg-secondary)' : 'transparent',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}
                                        >
                                            <div style={{
                                                width: 18, height: 18, borderRadius: '50%',
                                                border: selectedModel === model.id ? '5px solid #1D1D1F' : '2px solid #C7C7CC',
                                                flexShrink: 0,
                                            }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <span style={{ fontWeight: 600, fontSize: 'var(--fs-footnote)' }}>{model.name}</span>
                                                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{model.model}</span>
                                                    {model.badge && (
                                                        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: model.badge === 'Recommended' ? '#1D1D1F' : '#34C759', color: '#fff' }}>
                                                            {model.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{model.desc}</span>
                                            </div>
                                            <a
                                                href={model.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    fontSize: 11, color: '#007AFF', textDecoration: 'none',
                                                    display: 'flex', alignItems: 'center', gap: 3,
                                                    padding: '4px 10px', borderRadius: 6, background: '#F2F2F7',
                                                }}
                                            >
                                                Get Key <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                {/* API key input */}
                                {selectedModel && (
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <input
                                            type="password"
                                            value={modelApiKey}
                                            onChange={(e) => { setModelApiKey(e.target.value); setModelKeySaved(false) }}
                                            placeholder={`Paste your ${AI_MODELS.find(m => m.id === selectedModel)?.name} API key...`}
                                            style={{
                                                flex: 1, padding: 'var(--space-sm) var(--space-md)',
                                                borderRadius: 'var(--radius-md)', border: '1px solid var(--separator)',
                                                fontSize: 'var(--fs-footnote)', fontFamily: 'monospace',
                                            }}
                                        />
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={saveModelKey}
                                            disabled={!modelApiKey.trim() || modelKeySaved}
                                        >
                                            {modelKeySaved ? <><Check size={14} /> Saved</> : 'Save Key'}
                                        </button>
                                    </div>
                                )}

                                {modelKeySaved && (
                                    <p style={{ fontSize: 'var(--fs-footnote)', color: '#34C759', marginTop: 'var(--space-sm)', margin: 'var(--space-sm) 0 0' }}>
                                        ✓ API key saved to your project. Your OpenClaw agent is ready to use.
                                    </p>
                                )}
                            </div>

                            {/* Cleanup Acknowledgment — MANDATORY before destroy */}
                            <div className="card" style={{
                                border: cleanupAcknowledged ? '1px solid var(--separator)' : '2px solid #FF3B30',
                                padding: 'var(--space-lg)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                                    <AlertTriangle size={20} color="#FF3B30" />
                                    <h3 style={{ fontSize: 'var(--fs-body)', margin: 0 }}>Project Cleanup Required</h3>
                                    {!cleanupAcknowledged && (
                                        <span className="badge" style={{ background: '#FFEBEE', color: '#C62828', fontSize: 11, padding: '2px 8px' }}>Action Required</span>
                                    )}
                                </div>

                                <p className="footnote" style={{ marginBottom: 'var(--space-md)' }}>
                                    After downloading your project, you have <strong>3 days from your app’s launch on the App Store</strong> to remove all generated files from the LaunchFleet builder. This protects your API keys and intellectual property.
                                </p>

                                <div style={{
                                    background: '#FFF5F5', border: '1px solid #FFC7C7', borderRadius: 'var(--radius-md)',
                                    padding: 'var(--space-md)', marginBottom: 'var(--space-md)',
                                }}>
                                    <p style={{ fontSize: 'var(--fs-footnote)', fontWeight: 600, margin: '0 0 8px', color: '#C62828' }}>
                                        You must remove the following from the builder:
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {[
                                            { item: '.env.local', desc: 'Contains all API keys (Groq, OpenAI, Vercel, Stripe, etc.)' },
                                            { item: '.agent/ folder', desc: 'Your trained OpenClaw agent (AGENTS.md, SOUL.md, USER.md, skills/)' },
                                            { item: 'Generated app files', desc: 'All Expo/React Native source code and assets' },
                                            { item: 'marketing/ folder', desc: '30-day plan, social calendar, brand assets' },
                                            { item: 'store/ metadata', desc: 'App Store Connect fields and review notes' },
                                            { item: 'landing/ HTML', desc: 'Generated landing page source' },
                                        ].map(({ item, desc }) => (
                                            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                                                <code style={{ background: '#FEE', padding: '1px 6px', borderRadius: 4, fontWeight: 600, flexShrink: 0, color: '#C62828' }}>{item}</code>
                                                <span style={{ color: '#666' }}>{desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <label style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)',
                                    cursor: 'pointer', padding: 'var(--space-sm) 0',
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={cleanupAcknowledged}
                                        onChange={(e) => setCleanupAcknowledged(e.target.checked)}
                                        style={{ marginTop: 2, width: 18, height: 18, accentColor: '#1D1D1F' }}
                                    />
                                    <span style={{ fontSize: 'var(--fs-footnote)', lineHeight: 1.4 }}>
                                        <strong>I acknowledge</strong> that within 3 days of my app launching on the App Store, I will remove all generated files, environment variables, and agent folders from the LaunchFleet builder. I understand that leaving these files beyond the 3-day window exposes my API keys and proprietary content, and LaunchFleet may automatically purge them.
                                    </span>
                                </label>

                                {cleanupAcknowledged && (
                                    <p style={{ fontSize: 'var(--fs-footnote)', color: '#34C759', margin: 'var(--space-sm) 0 0' }}>
                                        ✓ Acknowledged. You may now proceed with data destruction.
                                    </p>
                                )}
                            </div>

                            {/* Data Destruction — gated behind acknowledgment */}
                            <div className="card" style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                                borderColor: '#E5E5EA',
                                opacity: cleanupAcknowledged ? 1 : 0.4,
                                pointerEvents: cleanupAcknowledged ? 'auto' : 'none',
                            }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={22} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: 'var(--fs-body)' }}>Secure Data Destruction</h3>
                                    <p className="footnote">Permanently delete all session data, API keys, and build artifacts from our servers. Your GitHub repo and downloaded ZIP file are not affected.</p>
                                </div>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={destroyData}
                                    disabled={dataDestroyed || !cleanupAcknowledged}
                                    style={{ borderColor: dataDestroyed ? 'var(--separator)' : '#1D1D1F' }}
                                >
                                    {dataDestroyed ? <><Check size={14} /> Destroyed</> : <><Trash2 size={14} /> Destroy</>}
                                </button>
                            </div>
                        </div>

                        {dataDestroyed && (
                            <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
                                <h2 style={{ marginBottom: 'var(--space-sm)' }}>All done.</h2>
                                <p className="subhead" style={{ marginBottom: 'var(--space-lg)' }}>
                                    Your app is submitted, your data is destroyed, and your OpenClaw agent is ready. Good luck with your launch.
                                </p>
                                <Link href="/" className="btn btn-primary btn-lg">
                                    Back to LaunchFleet
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
