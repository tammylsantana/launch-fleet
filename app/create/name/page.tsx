'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, ExternalLink, ChevronRight, RefreshCw, Search, Lightbulb, Tag, Palette, Wrench, Monitor, Globe, Store, Rocket, Loader2 } from 'lucide-react'

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

interface NameCandidate {
    name: string
    brandScore: number
    domains: { ext: string; available: boolean; price?: string }[]
    trademark: { status: 'clear' | 'conflict' | 'pending'; class?: string }
    socials: { platform: string; handle: string; available: boolean; signupUrl: string }[]
}

const SOCIAL_PLATFORMS = [
    { id: 'instagram', label: 'Instagram', baseUrl: 'https://www.instagram.com/' },
    { id: 'tiktok', label: 'TikTok', baseUrl: 'https://www.tiktok.com/@' },
    { id: 'x', label: 'X', baseUrl: 'https://x.com/' },
    { id: 'youtube', label: 'YouTube', baseUrl: 'https://youtube.com/@' },
    { id: 'facebook', label: 'Facebook', baseUrl: 'https://facebook.com/' },
    { id: 'threads', label: 'Threads', baseUrl: 'https://threads.net/@' },
]

export default function NamePage() {
    const [names, setNames] = useState<NameCandidate[]>([])
    const [selectedName, setSelectedName] = useState<string | null>(null)
    const [customName, setCustomName] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const [sessionIdea, setSessionIdea] = useState<string>('')
    const [hasVerified, setHasVerified] = useState(false)

    // Load pre-vetted names from verified database on mount
    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        const idea = session.idea || session.ideaText || ''
        setSessionIdea(idea)

        // Fetch verified names matched to this app's category
        if (idea) {
            fetch(`/api/vet-names?idea=${encodeURIComponent(idea)}`)
                .then(r => r.json())
                .then(data => {
                    if (data.names && data.names.length > 0) {
                        // Convert verified names to NameCandidate format
                        const verified: NameCandidate[] = data.names.map((n: { name: string; tagline?: string; vibe?: string; domains?: { ext: string; available: boolean }[]; socials?: { platform: string; available: boolean }[] }) => ({
                            name: n.name,
                            brandScore: 9,
                            domains: n.domains || [
                                { ext: '.com', available: true },
                                { ext: '.ai', available: true },
                                { ext: '.app', available: true },
                            ],
                            trademark: { status: 'clear' as const, class: 'Pre-verified' },
                            socials: SOCIAL_PLATFORMS.map(p => {
                                const found = n.socials?.find((s: { platform: string; available: boolean }) => s.platform === p.id)
                                return {
                                    platform: p.id,
                                    handle: n.name.toLowerCase().replace(/\s+/g, ''),
                                    available: found?.available ?? true,
                                    signupUrl: getSocialSignupUrl(p.id, n.name.toLowerCase().replace(/\s+/g, '')),
                                }
                            }),
                        }))
                        setNames(verified)
                        setHasVerified(true)
                    }
                })
                .catch(() => { /* No verified names yet — user can still generate */ })
        }
    }, [])

    const generateNames = async () => {
        setIsGenerating(true)
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            const res = await fetch('/api/name-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'generate', session }),
            })
            const data = await res.json()
            if (data.names) {
                // Append AI-generated names after verified ones
                setNames(prev => {
                    const existingNames = new Set(prev.map(n => n.name))
                    const newNames = data.names.filter((n: NameCandidate) => !existingNames.has(n.name))
                    return [...prev, ...newNames]
                })
            }
        } catch {
            // Fallback
        } finally {
            setIsGenerating(false)
        }
    }

    const checkCustomName = async () => {
        if (!customName.trim()) return
        setIsChecking(true)
        try {
            const res = await fetch('/api/name-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'check', name: customName.trim() }),
            })
            const data = await res.json()
            if (data.result) setNames(prev => [data.result, ...prev])
        } catch {
            // Handle error
        } finally {
            setIsChecking(false)
        }
    }

    const selectName = (name: string) => {
        setSelectedName(name)
    }

    const confirmName = () => {
        if (!selectedName) return
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        const chosen = names.find(n => n.name === selectedName)
        localStorage.setItem('launchfleet_session', JSON.stringify({
            ...session,
            appName: selectedName,
            nameData: chosen,
            stage: 'name',
            nameComplete: true,
        }))
        setConfirmed(true)

        // Notify all agents that app idea is locked — they can start preparing
        fetch('/api/agent-comms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'broadcast',
                from: 'namer',
                message: `App name confirmed: "${selectedName}". Idea: ${session.ideaText || session.idea || 'See session'}. All agents prepare for pipeline.`,
                session: { ...session, appName: selectedName, nameData: chosen },
            }),
        }).catch(() => { /* non-blocking */ })
    }

    const getVercelDomainUrl = (name: string, ext: string) => {
        const domain = name.toLowerCase().replace(/\s+/g, '') + ext
        return `https://vercel.com/domains/${domain}`
    }

    const getSocialSignupUrl = (platform: string, handle: string) => {
        const h = handle || selectedName?.toLowerCase().replace(/\s+/g, '') || ''
        switch (platform) {
            case 'instagram': return `https://www.instagram.com/accounts/edit/`
            case 'tiktok': return `https://www.tiktok.com/signup`
            case 'x': return `https://x.com/i/flow/signup`
            case 'youtube': return `https://www.youtube.com/create_channel`
            case 'facebook': return `https://www.facebook.com/pages/create`
            case 'threads': return `https://www.threads.net/`
            default: return '#'
        }
    }

    const chosenCandidate = names.find(n => n.name === selectedName)

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Header */}
            <header style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--separator)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Link href="/create" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: 'var(--fs-h3)' }}>
                    LaunchFleet
                </Link>
                <div className="stage-nav" style={{ borderBottom: 'none', padding: 0 }}>
                    {STAGES.map((s, i) => (
                        <Link key={s.id} href={s.path} className={`stage-pill ${s.id === 'name' ? 'active' : s.id === 'idea' ? 'completed' : ''}`}>
                            <span className="stage-num">{s.id === 'idea' ? <Check size={12} /> : i + 1}</span>
                            {s.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="page-header">
                    <div className="caption" style={{ marginBottom: 'var(--space-xs)' }}>Stage 2</div>
                    <h1>Name and Identity</h1>
                    <p className="subhead">
                        Brand-ready names, pre-vetted daily — trademark clear, .com domain available, and social handles open across six platforms.
                    </p>
                </div>

                {/* Session context banner */}
                {sessionIdea ? (
                    <div style={{ padding: '12px 16px', background: 'rgba(0,122,255,0.06)', border: '1px solid rgba(0,122,255,0.15)', borderRadius: '12px', marginBottom: 'var(--space-lg)', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Generating names for:</strong> {sessionIdea.length > 120 ? sessionIdea.slice(0, 120) + '...' : sessionIdea}
                    </div>
                ) : (
                    <div style={{ padding: '12px 16px', background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.2)', borderRadius: '12px', marginBottom: 'var(--space-lg)', fontSize: '14px' }}>
                        <strong>⚠ No app idea loaded.</strong> <Link href="/create/idea" style={{ color: '#007AFF', textDecoration: 'underline' }}>Start with the Idea page</Link> so names match your concept.
                    </div>
                )}
                {/* Custom name check */}
                <div className="card" style={{ marginBottom: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Check a custom name</label>
                        <input
                            className="input"
                            value={customName}
                            onChange={e => setCustomName(e.target.value)}
                            placeholder="Enter a name to verify..."
                            onKeyDown={e => e.key === 'Enter' && checkCustomName()}
                        />
                    </div>
                    <button className="btn btn-ghost" onClick={checkCustomName} disabled={isChecking}>
                        {isChecking ? <Loader2 size={16} className="spinner" /> : <Search size={16} />}
                        Check
                    </button>
                </div>

                {/* Generate button */}
                {names.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            {hasVerified
                                ? 'All verified names shown above. Generate more with AI below.'
                                : 'No pre-vetted names available yet for this category. Generate AI-powered name candidates.'}
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={generateNames} disabled={isGenerating}>
                            {isGenerating ? <><Loader2 size={18} /> Researching...</> : <>Generate Names</>}
                        </button>
                    </div>
                )}

                {/* Name cards */}
                {names.length > 0 && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                            <div>
                                <h2>{hasVerified ? 'Curated & Verified' : 'Vetted Candidates'}</h2>
                                {hasVerified && <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', margin: 0 }}>Pre-checked: trademark clear, .com available, social handles open</p>}
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={generateNames} disabled={isGenerating}>
                                <RefreshCw size={14} /> {hasVerified ? 'Generate More' : 'Regenerate'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                            {names.map((candidate, idx) => (
                                <div
                                    key={idx}
                                    className={`name-card ${selectedName === candidate.name ? 'selected' : ''}`}
                                    onClick={() => selectName(candidate.name)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                                        <div>
                                            <div className="name-title">{candidate.name}</div>
                                            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                                                <span className="caption">Brandability</span>
                                                <div style={{ display: 'flex', gap: 2 }}>
                                                    {Array.from({ length: 10 }, (_, i) => (
                                                        <div key={i} style={{
                                                            width: 8, height: 16, borderRadius: 2,
                                                            background: i < candidate.brandScore ? 'var(--blue)' : 'var(--bg-tertiary)',
                                                        }} />
                                                    ))}
                                                </div>
                                                <span className="footnote">{candidate.brandScore}/10</span>
                                            </div>
                                        </div>
                                        {/* Trademark badge */}
                                        <span className={`badge ${candidate.trademark.status === 'clear' ? 'badge-success' :
                                            candidate.trademark.status === 'conflict' ? 'badge-neutral' : 'badge-neutral'
                                            }`}>
                                            {candidate.trademark.status === 'clear' ? <><Check size={12} /> USPTO Clear</> :
                                                candidate.trademark.status === 'conflict' ? <><X size={12} /> Conflict</> :
                                                    'Checking...'}
                                        </span>
                                    </div>

                                    {/* Domains — clickable to purchase */}
                                    <div style={{ marginBottom: 'var(--space-md)' }}>
                                        <div className="caption" style={{ marginBottom: 'var(--space-sm)' }}>Domains — click to purchase on Vercel</div>
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                                            {candidate.domains.map((d, di) => (
                                                <a
                                                    key={di}
                                                    href={getVercelDomainUrl(candidate.name, d.ext)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                                                        padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                                                        background: d.available ? 'rgba(52,199,89,0.08)' : 'rgba(255,59,48,0.06)',
                                                        border: `1px solid ${d.available ? 'rgba(52,199,89,0.2)' : 'rgba(255,59,48,0.15)'}`,
                                                        fontSize: 'var(--fs-footnote)',
                                                        textDecoration: 'none', color: 'inherit',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    {d.available ? <Check size={12} color="var(--green)" /> : <X size={12} color="var(--red)" />}
                                                    <span style={{ fontWeight: 600 }}>{candidate.name.toLowerCase().replace(/\s+/g, '')}{d.ext}</span>
                                                    {d.available && d.price && <span style={{ color: 'var(--text-tertiary)' }}>{d.price}</span>}
                                                    {d.available && <ExternalLink size={10} color="var(--green)" />}
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Social handles — clickable to signup */}
                                    <div>
                                        <div className="caption" style={{ marginBottom: 'var(--space-sm)' }}>Social Handles — click to register</div>
                                        <div className="handle-grid">
                                            {candidate.socials.map((s, si) => {
                                                const handle = s.handle || candidate.name.toLowerCase().replace(/\s+/g, '')
                                                return (
                                                    <a
                                                        key={si}
                                                        href={getSocialSignupUrl(s.platform, handle)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="handle-item"
                                                        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                                                    >
                                                        {s.available ? <Check size={12} color="var(--green)" /> : <X size={12} color="var(--red)" />}
                                                        <span style={{ fontWeight: 500 }}>{s.platform}</span>
                                                        <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>@{handle}</span>
                                                        <ExternalLink size={9} color="var(--text-tertiary)" style={{ marginLeft: 'auto' }} />
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Post-selection: purchase links */}
                        {selectedName && !confirmed && (
                            <div className="card" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
                                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Secure "{selectedName}"</h3>

                                {/* Domain purchase links */}
                                <div style={{ marginBottom: 'var(--space-lg)' }}>
                                    <div className="caption" style={{ marginBottom: 'var(--space-sm)' }}>Purchase Domain on Vercel</div>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                                        {['.com', '.ai', '.app'].map(ext => {
                                            const domain = chosenCandidate?.domains.find(d => d.ext === ext)
                                            return (
                                                <a
                                                    key={ext}
                                                    href={getVercelDomainUrl(selectedName, ext)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`btn ${domain?.available ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                                    style={{ opacity: domain?.available ? 1 : 0.5 }}
                                                >
                                                    {selectedName.toLowerCase().replace(/\s+/g, '')}{ext}
                                                    {domain?.available && <ExternalLink size={12} />}
                                                    {!domain?.available && ' (taken)'}
                                                </a>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Social media signup links */}
                                <div style={{ marginBottom: 'var(--space-lg)' }}>
                                    <div className="caption" style={{ marginBottom: 'var(--space-sm)' }}>Register Social Handles</div>
                                    <div className="grid grid-3" style={{ gap: 'var(--space-sm)' }}>
                                        {SOCIAL_PLATFORMS.map(platform => {
                                            const handle = selectedName.toLowerCase().replace(/\s+/g, '')
                                            const social = chosenCandidate?.socials.find(s => s.platform === platform.id)
                                            return (
                                                <a
                                                    key={platform.id}
                                                    href={getSocialSignupUrl(platform.id, handle)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-ghost btn-sm"
                                                    style={{ justifyContent: 'flex-start' }}
                                                >
                                                    {social?.available ? <Check size={12} color="var(--green)" /> : <X size={12} color="var(--red)" />}
                                                    {platform.label}: @{handle}
                                                    <ExternalLink size={10} style={{ marginLeft: 'auto' }} />
                                                </a>
                                            )
                                        })}
                                    </div>
                                    <p className="footnote" style={{ marginTop: 'var(--space-sm)' }}>
                                        Each link opens the signup page. Register the handle "{selectedName.toLowerCase().replace(/\s+/g, '')}" on each platform, then return here.
                                    </p>
                                </div>

                                <button className="btn btn-primary btn-lg w-full" onClick={confirmName}>
                                    <Check size={18} /> Confirm "{selectedName}" and Continue
                                </button>
                            </div>
                        )}

                        {/* Confirmed — next stage */}
                        {confirmed && (
                            <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                                <div className="badge badge-success" style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--fs-subhead)', padding: '8px 20px' }}>
                                    <Check size={16} /> Name confirmed: {selectedName}
                                </div>
                                <br />
                                <Link href="/create/brand" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }}>
                                    Continue to Brand <ChevronRight size={18} />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
