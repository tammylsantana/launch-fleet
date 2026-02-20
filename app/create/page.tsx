'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, Lightbulb, Tag, Palette, Wrench, Monitor, Globe, Store, Rocket } from 'lucide-react'

const STAGES = [
    { id: 'idea', label: 'Idea', icon: Lightbulb, path: '/create/idea', description: 'Market research, competitor analysis, and profit potential' },
    { id: 'name', label: 'Name', icon: Tag, path: '/create/name', description: 'Trademark, domain, and social media handle verification' },
    { id: 'brand', label: 'Brand', icon: Palette, path: '/create/brand', description: 'Icon, color palette, typography, and splash screen' },
    { id: 'build', label: 'Build', icon: Wrench, path: '/create/build', description: 'App code, native widget, and API configuration' },
    { id: 'present', label: 'Present', icon: Monitor, path: '/create/present', description: 'Screenshots, device mockups, and QR code' },
    { id: 'landing', label: 'Landing', icon: Globe, path: '/create/landing', description: 'Your app\'s marketing landing page on Vercel' },
    { id: 'store', label: 'Store', icon: Store, path: '/create/store', description: 'Every App Store Connect field, pre-filled by AI' },
    { id: 'submit', label: 'Submit', icon: Rocket, path: '/create/submit', description: 'Package, upload, and submit to App Store' },
]

export default function CreateDashboard() {
    const [completed] = useState<Record<string, boolean>>({})

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Top bar */}
            <header style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--separator)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: 'var(--fs-h3)' }}>
                    LaunchFleet
                </Link>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    {STAGES.map((s, i) => {
                        const Icon = s.icon
                        return (
                            <Link key={s.id} href={s.path} className={`stage-pill ${completed[s.id] ? 'completed' : ''}`}>
                                <span className="stage-num">
                                    {completed[s.id] ? <Check size={12} /> : i + 1}
                                </span>
                                {s.label}
                            </Link>
                        )
                    })}
                </div>
            </header>

            {/* Main content */}
            <main className="container" style={{ paddingTop: 'var(--space-3xl)' }}>
                <div className="page-header" style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                    <h1 style={{ fontSize: 'var(--fs-hero)', marginBottom: 'var(--space-md)' }}>
                        Build Your App
                    </h1>
                    <p className="subhead" style={{ maxWidth: 500, margin: '0 auto' }}>
                        Eight stages from idea to App Store. AI handles the heavy lifting — you make the decisions.
                    </p>
                </div>

                {/* Progress */}
                <div style={{ maxWidth: 600, margin: '0 auto var(--space-3xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                        <span className="caption">Progress</span>
                        <span className="caption">{Object.values(completed).filter(Boolean).length} / {STAGES.length}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(Object.values(completed).filter(Boolean).length / STAGES.length) * 100}%` }} />
                    </div>
                </div>

                {/* Stage cards */}
                <div className="grid grid-2" style={{ gap: 'var(--space-md)', maxWidth: 900, margin: '0 auto' }}>
                    {STAGES.map((stage, i) => {
                        const Icon = stage.icon
                        const done = completed[stage.id]
                        return (
                            <Link key={stage.id} href={stage.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card" style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)',
                                    opacity: done ? 0.7 : 1,
                                }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                        background: done ? 'rgba(52,199,89,0.1)' : 'var(--bg-secondary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        {done ? <Check size={22} color="var(--green)" /> : <Icon size={22} color="var(--text-secondary)" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                                            <span className="caption" style={{ color: done ? 'var(--green)' : 'var(--text-tertiary)' }}>
                                                Stage {i + 1}
                                            </span>
                                            {done && <span className="badge badge-success">Complete</span>}
                                        </div>
                                        <h3 style={{ fontSize: 'var(--fs-body)', marginBottom: 4 }}>{stage.label}</h3>
                                        <p style={{ fontSize: 'var(--fs-footnote)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                            {stage.description}
                                        </p>
                                    </div>
                                    <ChevronRight size={18} color="var(--text-tertiary)" style={{ flexShrink: 0, marginTop: 14 }} />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </main>

            {/* ── Footer ──────────────────────────────────────── */}
            <footer style={{
                borderTop: '1px solid var(--separator)',
                padding: 'var(--space-xl) var(--space-lg) var(--space-lg)',
                marginTop: 'var(--space-3xl)',
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    maxWidth: 900, margin: '0 auto', flexWrap: 'wrap', gap: 'var(--space-md)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--fs-body)', color: 'var(--text-primary)' }}>LaunchFleet</span>
                        <nav style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            <a href="/privacy" style={{ fontSize: 'var(--fs-footnote)', color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy</a>
                            <a href="/terms" style={{ fontSize: 'var(--fs-footnote)', color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms</a>
                            <a href="/support" style={{ fontSize: 'var(--fs-footnote)', color: 'var(--text-secondary)', textDecoration: 'none' }}>Support</a>
                            <a href="mailto:hello@launchfleet.ai" style={{ fontSize: 'var(--fs-footnote)', color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</a>
                        </nav>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <a href="/admin" style={{
                            fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)',
                            textDecoration: 'none', transition: 'color 0.2s',
                        }}>Admin Sign In</a>
                        <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' }}>
                            © {new Date().getFullYear()} BTS Innovations
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
