'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, RefreshCw, Lightbulb, Tag, Palette, Wrench, Monitor, Globe, Store, Rocket } from 'lucide-react'

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

interface TemplateOption {
    id: string
    name: string
    style: string
    colorPalette: { primary: string; secondary: string; accent: string; bg: string; text: string; card: string }
    fonts: { headline: string; body: string }
    description: string
}

const TEMPLATES: TemplateOption[] = [
    {
        id: 'minimal', name: 'Clean Minimal', style: 'Light',
        colorPalette: { primary: '#1D1D1F', secondary: '#F2F2F7', accent: '#007AFF', bg: '#FFFFFF', text: '#1D1D1F', card: '#F2F2F7' },
        fonts: { headline: 'Inter', body: 'Inter' },
        description: 'White backgrounds, clean typography, subtle shadows. Inspired by Apple Health, Notion, and Things 3.',
    },
    {
        id: 'dark-bold', name: 'Bold Dark', style: 'Dark',
        colorPalette: { primary: '#F5F5F7', secondary: '#2C2C2E', accent: '#FF9500', bg: '#1C1C1E', text: '#F5F5F7', card: '#2C2C2E' },
        fonts: { headline: 'Outfit', body: 'Inter' },
        description: 'Dark backgrounds, high-contrast, vibrant orange. Inspired by Spotify, Netflix, and SoundCloud.',
    },
    {
        id: 'ocean', name: 'Ocean Calm', style: 'Light',
        colorPalette: { primary: '#0A2540', secondary: '#E8F4FD', accent: '#0070F3', bg: '#F8FBFE', text: '#0A2540', card: '#E8F4FD' },
        fonts: { headline: 'Inter', body: 'Inter' },
        description: 'Cool blue tones, trustworthy and professional. Inspired by Stripe, Linear, and Copilot.',
    },
    {
        id: 'sunset', name: 'Sunset Glow', style: 'Light',
        colorPalette: { primary: '#1A1A2E', secondary: '#FFF5F0', accent: '#FF6B35', bg: '#FFFAF7', text: '#1A1A2E', card: '#FFF0E8' },
        fonts: { headline: 'Outfit', body: 'Inter' },
        description: 'Warm gradient energy, friendly and engaging. Inspired by Headspace, Duolingo, and Strava.',
    },
    {
        id: 'emerald', name: 'Emerald Pro', style: 'Dark',
        colorPalette: { primary: '#E8F5E9', secondary: '#1B3A2D', accent: '#00C853', bg: '#0D1F17', text: '#E8F5E9', card: '#1B3A2D' },
        fonts: { headline: 'Inter', body: 'Inter' },
        description: 'Deep greens, premium feel, finance-grade trust. Inspired by Robinhood, Cash App, and Mint.',
    },
    {
        id: 'purple-haze', name: 'Purple Haze', style: 'Dark',
        colorPalette: { primary: '#F3E8FF', secondary: '#2D1B4E', accent: '#A855F7', bg: '#1A0F2E', text: '#F3E8FF', card: '#2D1B4E' },
        fonts: { headline: 'Outfit', body: 'Inter' },
        description: 'Deep purple, creative and bold. Inspired by Figma, Arc Browser, and Twitch.',
    },
]

/** Renders a realistic iPhone 15 frame with Apple-native app UI inside */
function IPhoneMockup({ template, appName }: { template: TemplateOption; appName: string }) {
    const c = template.colorPalette
    const isDark = template.style === 'Dark'
    const cellBg = isDark ? c.card : '#FFFFFF'
    const sectionBg = c.bg
    const subtleText = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'
    const divider = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

    return (
        <div style={{
            width: 170, height: 340, borderRadius: 32, border: '3px solid #3A3A3C',
            background: '#000', padding: 3, position: 'relative', overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        }}>
            {/* Dynamic Island */}
            <div style={{
                position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)',
                width: 50, height: 14, borderRadius: 10, background: '#000', zIndex: 10,
            }} />
            {/* Screen */}
            <div style={{
                width: '100%', height: '100%', borderRadius: 28, overflow: 'hidden',
                background: sectionBg, display: 'flex', flexDirection: 'column',
            }}>
                {/* Status bar */}
                <div style={{ height: 24, padding: '0 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: c.text }}>9:41</span>
                    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <svg width="8" height="6" viewBox="0 0 8 6"><rect x="0" y="4" width="2" height="2" rx="0.5" fill={c.text} opacity="0.5" /><rect x="2.5" y="2.5" width="2" height="3.5" rx="0.5" fill={c.text} opacity="0.5" /><rect x="5" y="0.5" width="2" height="5.5" rx="0.5" fill={c.text} opacity="0.5" /></svg>
                        <svg width="12" height="6" viewBox="0 0 12 6"><rect x="0.5" y="0.5" width="10" height="5" rx="1.5" stroke={c.text} strokeWidth="0.7" fill="none" opacity="0.5" /><rect x="11" y="2" width="1" height="2" rx="0.5" fill={c.text} opacity="0.3" /><rect x="1.5" y="1.5" width="7" height="3" rx="0.8" fill={c.accent} /></svg>
                    </div>
                </div>

                {/* iOS Large Title Nav */}
                <div style={{ padding: '2px 12px 6px' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: c.text, fontFamily: template.fonts.headline, letterSpacing: -0.3 }}>{appName || 'MyApp'}</span>
                </div>

                {/* Scrollable content */}
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 6, padding: '0 8px' }}>

                    {/* Hero stats card */}
                    <div style={{
                        borderRadius: 12, background: `linear-gradient(135deg, ${c.accent}, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'})`,
                        padding: 10, display: 'flex', alignItems: 'center', gap: 8,
                        boxShadow: `0 2px 8px ${c.accent}33`,
                    }}>
                        {/* Progress ring */}
                        <svg width="32" height="32" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                            <circle cx="16" cy="16" r="13" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="58 82" strokeLinecap="round" transform="rotate(-90 16 16)" />
                            <text x="16" y="18" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">72</text>
                        </svg>
                        <div>
                            <div style={{ fontSize: 7, fontWeight: 700, color: '#fff' }}>Today&apos;s Progress</div>
                            <div style={{ fontSize: 5.5, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>3 of 5 tasks complete</div>
                        </div>
                    </div>

                    {/* iOS Segmented Control */}
                    <div style={{
                        display: 'flex', borderRadius: 7, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        padding: 2,
                    }}>
                        {['All', 'Active', 'Done'].map((label, i) => (
                            <div key={label} style={{
                                flex: 1, textAlign: 'center', fontSize: 6, fontWeight: 600,
                                padding: '3px 0', borderRadius: 5, color: c.text,
                                background: i === 0 ? cellBg : 'transparent',
                                boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                opacity: i === 0 ? 1 : 0.5,
                            }}>{label}</div>
                        ))}
                    </div>

                    {/* Section header */}
                    <div style={{ fontSize: 6, fontWeight: 600, color: subtleText, textTransform: 'uppercase', letterSpacing: 0.5, padding: '2px 4px 0' }}>
                        Recent
                    </div>

                    {/* iOS grouped inset table */}
                    <div style={{ borderRadius: 10, background: cellBg, overflow: 'hidden' }}>
                        {[
                            { color: c.accent, w: 75, label: 'Dashboard' },
                            { color: isDark ? '#FF453A' : '#FF3B30', w: 60, label: 'Analytics' },
                            { color: isDark ? '#30D158' : '#34C759', w: 50, label: 'Settings' },
                        ].map((item, i, arr) => (
                            <div key={i} style={{
                                padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6,
                                borderBottom: i < arr.length - 1 ? `0.5px solid ${divider}` : 'none',
                            }}>
                                {/* SF-style icon */}
                                <div style={{
                                    width: 18, height: 18, borderRadius: 5, background: item.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span style={{ fontSize: 8, color: '#fff' }}>{['◈', '◉', '⚙'][i]}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 7, fontWeight: 500, color: c.text }}>{item.label}</div>
                                    <div style={{ height: 2.5, width: `${item.w}%`, borderRadius: 2, background: c.text, opacity: 0.1, marginTop: 2 }} />
                                </div>
                                {/* Chevron */}
                                <span style={{ fontSize: 8, color: subtleText }}>›</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* iOS Tab Bar with frosted glass */}
                <div style={{
                    height: 34, borderTop: `0.5px solid ${divider}`,
                    background: isDark ? 'rgba(28,28,30,0.85)' : 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px',
                }}>
                    {[
                        { icon: '⌂', label: 'Home', active: true },
                        { icon: '◎', label: 'Search', active: false },
                        { icon: '♡', label: 'Saved', active: false },
                        { icon: '⊙', label: 'Profile', active: false },
                    ].map((tab) => (
                        <div key={tab.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: tab.active ? c.accent : subtleText, lineHeight: 1 }}>{tab.icon}</div>
                            <div style={{ fontSize: 4.5, color: tab.active ? c.accent : subtleText, marginTop: 1, fontWeight: tab.active ? 600 : 400 }}>{tab.label}</div>
                        </div>
                    ))}
                </div>
                {/* Home indicator */}
                <div style={{ height: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 3, background: isDark ? 'rgba(28,28,30,0.85)' : 'rgba(255,255,255,0.85)' }}>
                    <div style={{ width: 36, height: 3, borderRadius: 2, background: c.text, opacity: 0.15 }} />
                </div>
            </div>
        </div>
    )
}

export default function BrandPage() {
    const [templates] = useState<TemplateOption[]>(TEMPLATES)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [iconUrl, setIconUrl] = useState<string | null>(null)
    const [isIconGenerating, setIsIconGenerating] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const [appName, setAppName] = useState('')

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        setAppName(session.appName || session.idea?.split(' ').slice(0, 2).join('') || 'MyApp')
    }, [])

    const generateIcon = async () => {
        setIsIconGenerating(true)
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            const res = await fetch('/api/generate-icon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session, templateId: selectedTemplate }),
            })
            const data = await res.json()
            if (data.iconUrl) setIconUrl(data.iconUrl)
        } catch {
            // Handle error
        } finally {
            setIsIconGenerating(false)
        }
    }

    const confirmBrand = () => {
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        const chosen = templates.find(t => t.id === selectedTemplate)
        localStorage.setItem('launchfleet_session', JSON.stringify({
            ...session,
            selectedTemplate: selectedTemplate,
            brandTemplate: chosen,
            icon: iconUrl,
            stage: 'brand',
            brandComplete: true,
        }))
        setConfirmed(true)
    }

    const chosenTemplate = templates.find(t => t.id === selectedTemplate)

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <header style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--separator)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Link href="/create" style={{ textDecoration: 'none', color: '#1D1D1F', fontWeight: 700, fontSize: 'var(--fs-h3)' }}>
                    LaunchFleet
                </Link>
                <div className="stage-nav" style={{ borderBottom: 'none', padding: 0 }}>
                    {STAGES.map((s, i) => (
                        <Link key={s.id} href={s.path} className={`stage-pill ${s.id === 'brand' ? 'active' : ['idea', 'name'].includes(s.id) ? 'completed' : ''}`}>
                            <span className="stage-num">{['idea', 'name'].includes(s.id) ? <Check size={12} /> : i + 1}</span>
                            {s.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="page-header">
                    <div className="caption" style={{ marginBottom: 'var(--space-xs)' }}>Stage 3</div>
                    <h1>Brand and Design</h1>
                    <p className="subhead">
                        Six curated color schemes inspired by top-selling apps. Each preview shows a real app layout inside an iPhone frame using the palette.
                    </p>
                </div>

                <h2 style={{ marginBottom: 'var(--space-lg)' }}>Choose Your Color Scheme</h2>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)',
                }}>
                    {templates.map(template => (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            style={{
                                borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                                border: selectedTemplate === template.id ? '3px solid #007AFF' : '1px solid #E5E5EA',
                                transition: 'all 0.2s ease',
                                transform: selectedTemplate === template.id ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: selectedTemplate === template.id ? '0 8px 32px rgba(0,122,255,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                            }}
                        >
                            {/* iPhone preview area */}
                            <div style={{
                                padding: '24px 0', display: 'flex', justifyContent: 'center',
                                background: '#F2F2F7',
                            }}>
                                <IPhoneMockup template={template} appName={appName} />
                            </div>

                            {/* Info section */}
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    {selectedTemplate === template.id && <Check size={16} color="#007AFF" />}
                                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{template.name}</h3>
                                    <span style={{
                                        fontSize: 10, padding: '2px 8px', borderRadius: 4,
                                        background: template.style === 'Dark' ? '#1D1D1F' : '#F2F2F7',
                                        color: template.style === 'Dark' ? '#F5F5F7' : '#1D1D1F',
                                        fontWeight: 600,
                                    }}>{template.style}</span>
                                </div>
                                <p style={{ fontSize: 12, color: '#86868B', margin: '0 0 10px', lineHeight: 1.4 }}>{template.description}</p>

                                {/* Color swatches */}
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {Object.entries(template.colorPalette).map(([key, color]) => (
                                        <div key={key} style={{
                                            width: 24, height: 24, borderRadius: 6, background: color,
                                            border: '1px solid rgba(0,0,0,0.1)',
                                        }} title={`${key}: ${color}`} />
                                    ))}
                                </div>

                                <p style={{ fontSize: 11, color: '#AEAEB2', margin: '8px 0 0' }}>
                                    {template.fonts.headline} / {template.fonts.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Icon generation */}
                {selectedTemplate && !confirmed && (
                    <div className="card" style={{ background: 'var(--bg-secondary)', border: 'none', marginBottom: 'var(--space-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>App Icon</h3>
                        <p className="subhead" style={{ marginBottom: 'var(--space-lg)' }}>
                            1024 x 1024px. RGB, no transparency. Coordinated with your chosen &quot;{chosenTemplate?.name}&quot; palette.
                        </p>

                        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>
                            {/* Icon preview */}
                            <div style={{
                                width: 180, height: 180, borderRadius: 36, background: '#E5E5EA',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid var(--separator)', overflow: 'hidden', flexShrink: 0,
                            }}>
                                {iconUrl ? (
                                    <img src={iconUrl} alt="App icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span className="footnote">No icon yet</span>
                                )}
                            </div>

                            <div style={{ flex: 1 }}>
                                <button className="btn btn-primary" onClick={generateIcon} disabled={isIconGenerating} style={{ marginBottom: 'var(--space-md)' }}>
                                    {isIconGenerating ? 'Generating...' : iconUrl ? 'Regenerate Icon' : 'Generate Icon'}
                                </button>
                                <p className="footnote">
                                    Icon will match your selected template colors and style. Generated at 1024x1024px.
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary btn-lg" onClick={confirmBrand}>
                                <Check size={18} /> Confirm Brand <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {confirmed && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                        <span className="badge badge-success" style={{ fontSize: 'var(--fs-subhead)', padding: '8px 20px', marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
                            <Check size={16} /> Brand confirmed: {chosenTemplate?.name}
                        </span>
                        <br />
                        <Link href="/create/build" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }}>
                            Continue to Build <ChevronRight size={18} />
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}
