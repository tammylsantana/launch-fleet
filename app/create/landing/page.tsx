'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, Download, Globe, ExternalLink, Lightbulb, Tag, Palette, Wrench, Monitor, Store, Rocket } from 'lucide-react'

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

const COMPLETED = ['idea', 'name', 'brand', 'build', 'present']

const LANDING_TEMPLATES = [
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean, single-column layout. Hero with app icon and tagline, features list, screenshots carousel, download button.',
    },
    {
        id: 'showcase',
        name: 'Showcase',
        description: 'Full-width hero with device mockup. Alternating feature sections with screenshots. Testimonials. Download CTA.',
    },
]

export default function LandingPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [deployUrl, setDeployUrl] = useState<string | null>(null)
    const [confirmed, setConfirmed] = useState(false)

    const generateLanding = async () => {
        if (!selectedTemplate) return
        setIsGenerating(true)
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            const res = await fetch('/api/generate-landing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session, template: selectedTemplate }),
            })
            const data = await res.json()
            if (data.previewUrl) setPreviewUrl(data.previewUrl)
        } catch {
            // Handle error
        } finally {
            setIsGenerating(false)
        }
    }

    const deployToVercel = async () => {
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            const res = await fetch('/api/deploy-landing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session }),
            })
            const data = await res.json()
            if (data.deployUrl) setDeployUrl(data.deployUrl)
        } catch {
            // Handle error
        }
    }

    const confirmLanding = () => {
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        localStorage.setItem('launchfleet_session', JSON.stringify({
            ...session, stage: 'landing', landingComplete: true,
            landingTemplate: selectedTemplate, deployUrl,
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
                <Link href="/create" style={{ textDecoration: 'none', color: '#1D1D1F', fontWeight: 700, fontSize: 'var(--fs-h3)' }}>LaunchFleet</Link>
                <div className="stage-nav" style={{ borderBottom: 'none', padding: 0 }}>
                    {STAGES.map((s, i) => (
                        <Link key={s.id} href={s.path} className={`stage-pill ${s.id === 'landing' ? 'active' : COMPLETED.includes(s.id) ? 'completed' : ''}`}>
                            <span className="stage-num">{COMPLETED.includes(s.id) ? <Check size={12} /> : i + 1}</span>
                            {s.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="page-header">
                    <div className="caption" style={{ marginBottom: 'var(--space-xs)' }}>Stage 6</div>
                    <h1>Landing Page</h1>
                    <p className="subhead">
                        Your app's marketing page. Choose a template, preview it, then deploy to Vercel or download as a ZIP.
                    </p>
                </div>

                {/* Template selection */}
                <h2 style={{ marginBottom: 'var(--space-lg)' }}>Choose Template</h2>
                <div className="grid grid-2" style={{ gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)', maxWidth: 700 }}>
                    {LANDING_TEMPLATES.map(template => (
                        <div
                            key={template.id}
                            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                            onClick={() => setSelectedTemplate(template.id)}
                        >
                            <div style={{ aspectRatio: '16/10', background: '#F2F2F7', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                <div style={{ height: 8, width: '40%', background: '#E5E5EA', borderRadius: 4 }} />
                                <div style={{ height: 6, width: '70%', background: '#E5E5EA', borderRadius: 3 }} />
                                <div style={{ flex: 1, background: '#E5E5EA', borderRadius: 8 }} />
                                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                    <div style={{ flex: 1, height: 20, background: '#E5E5EA', borderRadius: 4 }} />
                                    <div style={{ flex: 1, height: 20, background: '#D1D1D6', borderRadius: 4 }} />
                                </div>
                            </div>
                            <div className="template-info">
                                <h3>{template.name}</h3>
                                <p className="footnote">{template.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedTemplate && !previewUrl && (
                    <button className="btn btn-primary btn-lg" onClick={generateLanding} disabled={isGenerating}>
                        {isGenerating ? 'Building your landing page...' : 'Generate Landing Page'}
                    </button>
                )}

                {/* Preview */}
                {previewUrl && (
                    <div style={{ marginTop: 'var(--space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Preview</h2>
                        <div style={{
                            border: '1px solid var(--separator)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                            aspectRatio: '16/10', background: '#F2F2F7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <iframe src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Landing page preview" />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                            <button className="btn btn-primary" onClick={deployToVercel}>
                                <Globe size={16} /> Deploy to Vercel
                            </button>
                            <button className="btn btn-ghost">
                                <Download size={16} /> Download ZIP
                            </button>
                        </div>

                        {deployUrl && (
                            <div className="card" style={{ marginTop: 'var(--space-md)', background: 'var(--bg-secondary)', border: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <Check size={18} />
                                    <div>
                                        <p style={{ fontWeight: 600 }}>Deployed successfully</p>
                                        <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="footnote" style={{ color: '#1D1D1F' }}>
                                            {deployUrl} <ExternalLink size={11} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Confirm */}
                <div style={{ marginTop: 'var(--space-3xl)', textAlign: 'center' }}>
                    {!confirmed ? (
                        <button className="btn btn-primary btn-lg" onClick={confirmLanding} disabled={!previewUrl}>
                            <Check size={18} /> Confirm Landing Page <ChevronRight size={18} />
                        </button>
                    ) : (
                        <>
                            <span className="badge badge-success" style={{ fontSize: 'var(--fs-subhead)', padding: '8px 20px', display: 'inline-flex' }}>
                                <Check size={16} /> Landing page confirmed
                            </span>
                            <br />
                            <Link href="/create/store" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }}>
                                Continue to App Store <ChevronRight size={18} />
                            </Link>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
