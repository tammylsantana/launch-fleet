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
    preview: string
    bestFor: string[]
}

const TEMPLATES: TemplateOption[] = [
    {
        id: 'minimal', name: 'Clean Minimal', style: 'Light',
        colorPalette: { primary: '#1D1D1F', secondary: '#F2F2F7', accent: '#007AFF', bg: '#FFFFFF', text: '#1D1D1F', card: '#F2F2F7' },
        fonts: { headline: 'Inter', body: 'Inter' },
        description: 'The #1 design pattern in Productivity and Utilities. White space + system blue = instant trust.',
        preview: '/brand-previews/minimal.png',
        bestFor: ['Productivity', 'Utilities', 'Education', 'Health & Fitness'],
    },
    {
        id: 'dark-bold', name: 'Bold Dark', style: 'Dark',
        colorPalette: { primary: '#F5F5F7', secondary: '#2C2C2E', accent: '#FF9500', bg: '#1C1C1E', text: '#F5F5F7', card: '#2C2C2E' },
        fonts: { headline: 'Outfit', body: 'Inter' },
        description: 'Dominant in Entertainment and Music categories. Dark mode + warm accents = premium engagement.',
        preview: '/brand-previews/dark.png',
        bestFor: ['Entertainment', 'Music', 'Social Media', 'Photo & Video'],
    },
    {
        id: 'coral', name: 'Coral Rose', style: 'Light',
        colorPalette: { primary: '#2D2D2D', secondary: '#FFF0F0', accent: '#E8445A', bg: '#FFFAFA', text: '#2D2D2D', card: '#FFF0F0' },
        fonts: { headline: 'Outfit', body: 'Inter' },
        description: 'Leading in Shopping and Social apps. Coral/rose tones drive engagement and impulse action.',
        preview: '/brand-previews/ocean.png',
        bestFor: ['Shopping', 'Social', 'Dating', 'Fashion & Beauty'],
    },
    {
        id: 'sunset', name: 'Sunset Glow', style: 'Light',
        colorPalette: { primary: '#1A1A2E', secondary: '#FFF5F0', accent: '#FF6B35', bg: '#FFFAF7', text: '#1A1A2E', card: '#FFF0E8' },
        fonts: { headline: 'Outfit', body: 'Inter' },
        description: 'Top performer in Health & Wellness. Warm tones = approachable, energizing, habit-building.',
        preview: '/brand-previews/sunset.png',
        bestFor: ['Health & Wellness', 'Food & Drink', 'Lifestyle', 'Travel'],
    },
    {
        id: 'emerald', name: 'Emerald Pro', style: 'Dark',
        colorPalette: { primary: '#E8F5E9', secondary: '#1B3A2D', accent: '#00C853', bg: '#0D1F17', text: '#E8F5E9', card: '#1B3A2D' },
        fonts: { headline: 'Inter', body: 'Inter' },
        description: 'Proven in Fintech and Trading apps. Green = growth, money, trust. Used by 8 of top 10 finance apps.',
        preview: '/brand-previews/emerald.png',
        bestFor: ['Fintech', 'Investing', 'Banking', 'Crypto'],
    },
    {
        id: 'purple-haze', name: 'Purple Haze', style: 'Dark',
        colorPalette: { primary: '#F3E8FF', secondary: '#2D1B4E', accent: '#A855F7', bg: '#1A0F2E', text: '#F3E8FF', card: '#2D1B4E' },
        fonts: { headline: 'Outfit', body: 'Inter' },
        description: 'Rising in Creative and AI tools. Purple = innovation, imagination, premium positioning.',
        preview: '/brand-previews/purple.png',
        bestFor: ['AI & Machine Learning', 'Design Tools', 'Developer Tools', 'Gaming'],
    },
    {
        id: 'kids', name: 'Playful Primary', style: 'Light',
        colorPalette: { primary: '#1D1D1F', secondary: '#FFF8E1', accent: '#FF3B30', bg: '#FFFFFF', text: '#1D1D1F', card: '#FFF8E1' },
        fonts: { headline: 'Outfit', body: 'Inter' },
        description: 'Proven winner in Kids & Education. Bold primary colors = trust from parents, fun for children.',
        preview: '/brand-previews/kids.png',
        bestFor: ['Kids & Family', 'Preschool', 'Education Games', 'Parenting'],
    },
]

/** Renders a high-fidelity app preview image */
function AppPreview({ template }: { template: TemplateOption }) {
    return (
        <div style={{
            width: '100%', maxWidth: 280, margin: '0 auto',
            borderRadius: 24, overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={template.preview}
                alt={`${template.name} preview`}
                style={{ width: '100%', height: 'auto', display: 'block' }}
            />
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
                                background: '#FFFFFF',
                            }}>
                                <AppPreview template={template} />
                            </div>

                            {/* Widget previews — coordinated with palette */}
                            <div style={{
                                padding: '12px 16px', background: '#FAFAFA',
                                borderTop: '1px solid #F2F2F7',
                            }}>
                                <div style={{ fontSize: 9, fontWeight: 600, color: '#86868B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Matching Widgets
                                </div>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
                                    {/* Small widget */}
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 10,
                                        background: template.colorPalette.bg,
                                        border: `1.5px solid ${template.colorPalette.accent}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <div style={{ width: 16, height: 16, borderRadius: 4, background: template.colorPalette.accent, opacity: 0.8 }} />
                                    </div>
                                    {/* Medium widget */}
                                    <div style={{
                                        width: 92, height: 44, borderRadius: 10,
                                        background: template.colorPalette.bg,
                                        border: `1.5px solid ${template.colorPalette.accent}30`,
                                        display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px',
                                    }}>
                                        <div style={{ width: 16, height: 16, borderRadius: 4, background: template.colorPalette.accent, opacity: 0.8, flexShrink: 0 }} />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <div style={{ height: 4, background: template.colorPalette.text, borderRadius: 2, opacity: 0.15, width: '80%' }} />
                                            <div style={{ height: 3, background: template.colorPalette.text, borderRadius: 2, opacity: 0.1, width: '60%' }} />
                                        </div>
                                    </div>
                                    {/* Large widget */}
                                    <div style={{
                                        width: 92, height: 92, borderRadius: 10,
                                        background: template.colorPalette.bg,
                                        border: `1.5px solid ${template.colorPalette.accent}30`,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 6,
                                    }}>
                                        <div style={{ width: 24, height: 24, borderRadius: 6, background: template.colorPalette.accent, opacity: 0.8 }} />
                                        <div style={{ width: '70%', height: 4, background: template.colorPalette.text, borderRadius: 2, opacity: 0.15 }} />
                                        <div style={{ width: '50%', height: 3, background: template.colorPalette.text, borderRadius: 2, opacity: 0.1 }} />
                                    </div>
                                </div>
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
                                <p style={{ fontSize: 12, color: '#86868B', margin: '0 0 8px', lineHeight: 1.4 }}>{template.description}</p>

                                {/* Industry tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                                    {template.bestFor.map(industry => (
                                        <span key={industry} style={{
                                            fontSize: 9, padding: '2px 7px', borderRadius: 4,
                                            background: `${template.colorPalette.accent}15`,
                                            color: template.colorPalette.accent,
                                            fontWeight: 600, whiteSpace: 'nowrap',
                                        }}>{industry}</span>
                                    ))}
                                </div>

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
                {!confirmed && (
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
                                {iconUrl && (
                                    <a
                                        href={iconUrl}
                                        download={`${JSON.parse(localStorage.getItem('launchfleet_session') || '{}').appName || 'app'}-icon-1024.png`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                        style={{ marginLeft: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}
                                    >
                                        ↓ Download Icon
                                    </a>
                                )}
                                <p className="footnote">
                                    Icon will match your selected template colors and style. Generated at 1024×1024px.
                                    {iconUrl && ' Click Download to save your icon as a PNG file.'}
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
