'use client'
import { useState } from 'react'
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
    colorPalette: { primary: string; secondary: string; accent: string; bg: string; text: string }
    fonts: { headline: string; body: string }
    iconPreview: string
    description: string
}

export default function BrandPage() {
    const [templates, setTemplates] = useState<TemplateOption[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [iconUrl, setIconUrl] = useState<string | null>(null)
    const [isIconGenerating, setIsIconGenerating] = useState(false)
    const [confirmed, setConfirmed] = useState(false)

    const generateTemplates = async () => {
        setIsGenerating(true)
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stage: 'brand', action: 'generate-templates', session }),
            })
            const data = await res.json()
            if (data.templates) setTemplates(data.templates)
        } catch {
            // Demo templates
            setTemplates([
                {
                    id: 'a', name: 'Clean Minimal', style: 'Light',
                    colorPalette: { primary: '#1D1D1F', secondary: '#F2F2F7', accent: '#007AFF', bg: '#FFFFFF', text: '#1D1D1F' },
                    fonts: { headline: 'Inter', body: 'Inter' },
                    iconPreview: '', description: 'White backgrounds, clean typography, subtle shadows. Inspired by top-selling productivity and utility apps.',
                },
                {
                    id: 'b', name: 'Bold Dark', style: 'Dark',
                    colorPalette: { primary: '#F5F5F7', secondary: '#2C2C2E', accent: '#FF9500', bg: '#1D1D1F', text: '#F5F5F7' },
                    fonts: { headline: 'Outfit', body: 'Inter' },
                    iconPreview: '', description: 'Dark backgrounds, high-contrast elements, vibrant accents. Inspired by top-selling entertainment and media apps.',
                },
            ])
        } finally {
            setIsGenerating(false)
        }
    }

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
                        Two template options based on the top-selling apps in your category. Icon, splash screen, and screenshot templates are coordinated within each option.
                    </p>
                </div>

                {templates.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            AI will analyze the top-selling apps in your category and generate two complete brand packages.
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={generateTemplates} disabled={isGenerating}>
                            {isGenerating ? 'Analyzing top sellers...' : 'Generate Brand Options'}
                        </button>
                    </div>
                )}

                {templates.length > 0 && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                            <h2>Choose Your Template</h2>
                            <button className="btn btn-ghost btn-sm" onClick={generateTemplates} disabled={isGenerating}>
                                <RefreshCw size={14} /> Regenerate
                            </button>
                        </div>

                        <div className="grid grid-2" style={{ gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            {templates.map(template => (
                                <div
                                    key={template.id}
                                    className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    {/* Preview */}
                                    <div style={{
                                        aspectRatio: '4/3', padding: 'var(--space-xl)',
                                        background: template.colorPalette.bg, color: template.colorPalette.text,
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-md)',
                                    }}>
                                        {/* Mock phone frame */}
                                        <div style={{
                                            width: 100, height: 180, borderRadius: 16, border: `3px solid ${template.colorPalette.text}`,
                                            background: template.colorPalette.bg, padding: 8,
                                            display: 'flex', flexDirection: 'column', gap: 4,
                                        }}>
                                            <div style={{ height: 16, borderRadius: 4, background: template.colorPalette.secondary }} />
                                            <div style={{ flex: 1, borderRadius: 6, background: template.colorPalette.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: template.colorPalette.accent }} />
                                            </div>
                                            <div style={{ height: 12, borderRadius: 4, background: template.colorPalette.accent, width: '60%', margin: '0 auto' }} />
                                        </div>
                                        <span style={{ fontFamily: template.fonts.headline, fontWeight: 700, fontSize: 'var(--fs-subhead)' }}>
                                            {template.name}
                                        </span>
                                    </div>

                                    <div className="template-info">
                                        <h3 style={{ marginBottom: 4 }}>Option {template.id.toUpperCase()}: {template.name}</h3>
                                        <p className="footnote" style={{ marginBottom: 'var(--space-md)' }}>{template.description}</p>

                                        {/* Color swatches */}
                                        <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-sm)' }}>
                                            {Object.entries(template.colorPalette).map(([key, color]) => (
                                                <div key={key} style={{
                                                    width: 28, height: 28, borderRadius: 6, background: color,
                                                    border: '1px solid var(--separator)',
                                                }} title={`${key}: ${color}`} />
                                            ))}
                                        </div>

                                        <p className="caption">
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
                                    1024 x 1024px. RGB, no transparency. Coordinated with your chosen template.
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
                                            Icon will match your selected template colors and style. Generated via ComfyUI or DALL-E at 1024x1024px.
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
                                    <Check size={16} /> Brand confirmed
                                </span>
                                <br />
                                <Link href="/create/build" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }}>
                                    Continue to Build <ChevronRight size={18} />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
