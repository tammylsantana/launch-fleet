'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, ExternalLink, Save, Lightbulb, Tag, Palette, Wrench, Monitor, Globe, Store, Rocket, Smartphone, Laptop } from 'lucide-react'

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

const API_KEY_SECTIONS = [
    {
        category: 'Backend', keys: [
            { id: 'supabase_url', label: 'Supabase URL', placeholder: 'https://xxxxx.supabase.co', guide: 'https://supabase.com/docs', required: true },
            { id: 'supabase_anon', label: 'Supabase Anon Key', placeholder: 'eyJ...', guide: 'https://supabase.com/docs', required: true },
        ]
    },
    {
        category: 'Payments', keys: [
            { id: 'stripe_pk', label: 'Stripe Publishable Key', placeholder: 'pk_...', guide: 'https://stripe.com/docs/keys' },
            { id: 'stripe_sk', label: 'Stripe Secret Key', placeholder: 'sk_...', guide: 'https://stripe.com/docs/keys' },
        ]
    },
    {
        category: 'AI', keys: [
            { id: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...', guide: 'https://platform.openai.com/api-keys' },
            { id: 'gemini', label: 'Gemini API Key', placeholder: 'AI...', guide: 'https://aistudio.google.com/apikey' },
            { id: 'anthropic', label: 'Anthropic API Key', placeholder: 'sk-ant-...', guide: 'https://console.anthropic.com/settings/keys' },
        ]
    },
    {
        category: 'Storage', keys: [
            { id: 'firebase', label: 'Firebase Config', placeholder: '{"apiKey":"..."}', guide: 'https://firebase.google.com/docs' },
            { id: 'cloudinary', label: 'Cloudinary URL', placeholder: 'cloudinary://...', guide: 'https://cloudinary.com/documentation' },
        ]
    },
    {
        category: 'Email', keys: [
            { id: 'resend', label: 'Resend API Key', placeholder: 're_...', guide: 'https://resend.com/docs' },
            { id: 'sendgrid', label: 'SendGrid API Key', placeholder: 'SG...', guide: 'https://docs.sendgrid.com/' },
        ]
    },
    {
        category: 'Analytics', keys: [
            { id: 'posthog', label: 'PostHog API Key', placeholder: 'phc_...', guide: 'https://posthog.com/docs' },
            { id: 'mixpanel', label: 'Mixpanel Token', placeholder: '...', guide: 'https://mixpanel.com/docs' },
        ]
    },
    {
        category: 'Push Notifications', keys: [
            { id: 'fcm', label: 'Firebase Cloud Messaging', placeholder: '...', guide: 'https://firebase.google.com/docs/cloud-messaging' },
        ]
    },
    {
        category: 'Auth', keys: [
            { id: 'apple_signin', label: 'Apple Sign-In Service ID', placeholder: 'com.your.app', guide: 'https://developer.apple.com/sign-in-with-apple/', required: true },
            { id: 'google_signin', label: 'Google OAuth Client ID', placeholder: '...apps.googleusercontent.com', guide: 'https://console.cloud.google.com/apis/credentials' },
        ]
    },
]

const RESOURCE_RECS = [
    { feature: 'Chat / Messaging', tool: 'Stream Chat SDK', reason: 'Pre-built chat UI components', link: 'https://getstream.io' },
    { feature: 'Health Data', tool: 'HealthKit', reason: 'iOS health integration', link: 'https://developer.apple.com/healthkit/' },
    { feature: 'Maps / Location', tool: 'Mapbox', reason: 'Custom map styling', link: 'https://mapbox.com' },
    { feature: 'Video / Audio', tool: 'Mux', reason: 'Streaming and transcoding', link: 'https://mux.com' },
    { feature: 'Search', tool: 'Algolia', reason: 'Fast search-as-you-type', link: 'https://algolia.com' },
    { feature: 'Scheduling', tool: 'Cal.com API', reason: 'Booking and calendar', link: 'https://cal.com' },
    { feature: 'E-commerce', tool: 'Shopify Storefront API', reason: 'Product catalog', link: 'https://shopify.dev' },
    { feature: 'Deep Links', tool: 'Branch.io', reason: 'Links and attribution', link: 'https://branch.io' },
    { feature: 'Error Tracking', tool: 'Sentry', reason: 'Crash reporting', link: 'https://sentry.io' },
]

export default function BuildPage() {
    const [activeTab, setActiveTab] = useState('brief')
    const [savedKeys, setSavedKeys] = useState<Record<string, string>>({})
    const [keyValues, setKeyValues] = useState<Record<string, string>>({})
    const [isBuilding, setIsBuilding] = useState(false)
    const [buildComplete, setBuildComplete] = useState(false)
    const [session, setSession] = useState<Record<string, unknown>>({})

    // Load session on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            const s = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            setSession(s)
        }
    })

    const appName = (session.appName as string) || (session.selectedName as string) || ''
    const ideaText = (session.ideaText as string) || (session.idea as string) || ''
    const brand = session.brandTemplate as { name?: string; style?: string; colorPalette?: Record<string, string>; fonts?: { headline: string; body: string }; bestFor?: string[]; description?: string } | undefined
    const iconUrl = session.icon as string | undefined

    const saveKey = (id: string) => {
        if (!keyValues[id]) return
        setSavedKeys(prev => ({ ...prev, [id]: keyValues[id] }))
    }

    const startBuild = async () => {
        setIsBuilding(true)
        try {
            const current = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            await fetch('/api/build-app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: current, theme: brand?.style?.toLowerCase() || 'light', apiKeys: savedKeys }),
            })
            setBuildComplete(true)
            localStorage.setItem('launchfleet_session', JSON.stringify({ ...current, stage: 'build', buildComplete: true }))
        } catch {
            // Handle error
        } finally {
            setIsBuilding(false)
        }
    }

    const TABS = ['brief', 'api-keys', 'resources']

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
                        <Link key={s.id} href={s.path} className={`stage-pill ${s.id === 'build' ? 'active' : ['idea', 'name', 'brand'].includes(s.id) ? 'completed' : ''}`}>
                            <span className="stage-num">{['idea', 'name', 'brand'].includes(s.id) ? <Check size={12} /> : i + 1}</span>
                            {s.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="page-header">
                    <div className="caption" style={{ marginBottom: 'var(--space-xs)' }}>Stage 4</div>
                    <h1>Build</h1>
                    <p className="subhead">
                        Review your app brief, add API keys, and configure resources before building.
                    </p>
                </div>

                {/* Tabs */}
                <div className="tabs" style={{ marginBottom: 'var(--space-xl)' }}>
                    {TABS.map(tab => (
                        <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab === 'brief' ? 'App Brief' : tab === 'api-keys' ? 'API Keys' : 'Resources'}
                        </button>
                    ))}
                </div>

                {/* Brief tab — shows everything the user chose */}
                {activeTab === 'brief' && (
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Your App Brief</h2>
                        <p className="subhead" style={{ marginBottom: 'var(--space-xl)' }}>
                            Everything the builder will use to generate your app.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: 700 }}>

                            {/* App Name */}
                            <div className="card" style={{ padding: 'var(--space-lg)' }}>
                                <div className="caption" style={{ marginBottom: 4 }}>App Name</div>
                                <h3 style={{ fontSize: 'var(--fs-h2)', margin: 0 }}>{appName || '—'}</h3>
                            </div>

                            {/* App Idea */}
                            <div className="card" style={{ padding: 'var(--space-lg)' }}>
                                <div className="caption" style={{ marginBottom: 4 }}>App Idea</div>
                                <p style={{ margin: 0, lineHeight: 1.5 }}>{ideaText || '—'}</p>
                            </div>

                            {/* Brand & Colors */}
                            {brand && (
                                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                                    <div className="caption" style={{ marginBottom: 8 }}>Brand Template</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 12 }}>
                                        <h3 style={{ margin: 0 }}>{brand.name}</h3>
                                        <span style={{
                                            fontSize: 11, padding: '2px 8px', borderRadius: 4,
                                            background: brand.style === 'Dark' ? '#1D1D1F' : '#F2F2F7',
                                            color: brand.style === 'Dark' ? '#F5F5F7' : '#1D1D1F',
                                            fontWeight: 600,
                                        }}>{brand.style}</span>
                                    </div>
                                    {brand.description && (
                                        <p className="footnote" style={{ marginBottom: 12 }}>{brand.description}</p>
                                    )}

                                    {/* Color swatches */}
                                    {brand.colorPalette && (
                                        <div style={{ marginBottom: 12 }}>
                                            <div className="caption" style={{ marginBottom: 4 }}>Colors</div>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {Object.entries(brand.colorPalette).map(([key, color]) => (
                                                    <div key={key} style={{ textAlign: 'center' }}>
                                                        <div style={{
                                                            width: 32, height: 32, borderRadius: 8, background: color,
                                                            border: '1px solid rgba(0,0,0,0.1)',
                                                        }} />
                                                        <div style={{ fontSize: 9, color: '#86868B', marginTop: 2 }}>{key}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fonts */}
                                    {brand.fonts && (
                                        <div style={{ marginBottom: 12 }}>
                                            <div className="caption" style={{ marginBottom: 4 }}>Fonts</div>
                                            <p className="footnote" style={{ margin: 0 }}>{brand.fonts.headline} / {brand.fonts.body}</p>
                                        </div>
                                    )}

                                    {/* Best For */}
                                    {brand.bestFor && (
                                        <div>
                                            <div className="caption" style={{ marginBottom: 4 }}>Best For</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                {brand.bestFor.map(tag => (
                                                    <span key={tag} style={{
                                                        fontSize: 10, padding: '2px 8px', borderRadius: 4,
                                                        background: '#F2F2F7', color: '#1D1D1F', fontWeight: 500,
                                                    }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Icon */}
                            {iconUrl && (
                                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                                    <div className="caption" style={{ marginBottom: 8 }}>App Icon</div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={iconUrl} alt="App Icon" style={{ width: 80, height: 80, borderRadius: 18, border: '1px solid rgba(0,0,0,0.08)' }} />
                                </div>
                            )}

                            {/* API Keys Summary */}
                            <div className="card" style={{ padding: 'var(--space-lg)' }}>
                                <div className="caption" style={{ marginBottom: 4 }}>API Keys Configured</div>
                                <p style={{ margin: 0 }}>
                                    {Object.keys(savedKeys).length > 0
                                        ? `${Object.keys(savedKeys).length} key(s) saved`
                                        : 'None yet — add keys in the API Keys tab'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* API Keys tab */}
                {activeTab === 'api-keys' && (
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>API Keys</h2>
                        <p className="subhead" style={{ marginBottom: 'var(--space-xl)' }}>
                            Add the keys your app needs. Only fill in what applies to your app.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                            {API_KEY_SECTIONS.map(section => (
                                <div key={section.category}>
                                    <div className="caption" style={{ marginBottom: 'var(--space-md)' }}>{section.category}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                        {section.keys.map(key => (
                                            <div key={key.id} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                                                <div style={{ flex: 1 }}>
                                                    <input
                                                        className="input"
                                                        placeholder={`${key.label}: ${key.placeholder}`}
                                                        type="password"
                                                        value={keyValues[key.id] || ''}
                                                        onChange={e => setKeyValues(prev => ({ ...prev, [key.id]: e.target.value }))}
                                                        style={(key as any).required ? { borderColor: savedKeys[key.id] ? '#34C759' : '#FF3B30', borderWidth: 1.5 } : {}}
                                                    />
                                                </div>
                                                {(key as any).required && !savedKeys[key.id] && (
                                                    <span style={{ fontSize: 9, color: '#FF3B30', fontWeight: 700, whiteSpace: 'nowrap' }}>REQUIRED</span>
                                                )}
                                                <button
                                                    className={`btn ${savedKeys[key.id] ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
                                                    onClick={() => saveKey(key.id)}
                                                >
                                                    {savedKeys[key.id] ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save</>}
                                                </button>
                                                <a href={key.guide} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" title="Setup guide">
                                                    <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resources tab */}
                {activeTab === 'resources' && (
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Recommended Resources</h2>
                        <p className="subhead" style={{ marginBottom: 'var(--space-xl)' }}>
                            Based on your app category, these tools could enhance your app. Each includes a link to obtain the API key.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {RESOURCE_RECS.map(rec => (
                                <div key={rec.tool} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 2 }}>
                                            <span className="caption">{rec.feature}</span>
                                        </div>
                                        <h3 style={{ fontSize: 'var(--fs-body)', marginBottom: 2 }}>{rec.tool}</h3>
                                        <p className="footnote">{rec.reason}</p>
                                    </div>
                                    <a href={rec.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                                        Get Key <ExternalLink size={12} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}



                {/* Build action */}
                <div style={{ marginTop: 'var(--space-3xl)', textAlign: 'center' }}>
                    {!buildComplete ? (
                        <button className="btn btn-primary btn-lg" onClick={startBuild} disabled={isBuilding}>
                            {isBuilding ? 'Building...' : 'Build App'}
                        </button>
                    ) : (
                        <>
                            <span className="badge badge-success" style={{ fontSize: 'var(--fs-subhead)', padding: '8px 20px', marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
                                <Check size={16} /> Build complete
                            </span>
                            <br />
                            <Link href="/create/present" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }}>
                                Continue to Presentation <ChevronRight size={18} />
                            </Link>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
