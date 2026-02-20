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
            { id: 'supabase_url', label: 'Supabase URL', placeholder: 'https://xxxxx.supabase.co', guide: 'https://supabase.com/docs' },
            { id: 'supabase_anon', label: 'Supabase Anon Key', placeholder: 'eyJ...', guide: 'https://supabase.com/docs' },
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
            { id: 'apple_signin', label: 'Apple Sign-In Service ID', placeholder: 'com.your.app', guide: 'https://developer.apple.com/sign-in-with-apple/' },
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
    const [activeTab, setActiveTab] = useState('template')
    const [appTheme, setAppTheme] = useState<'light' | 'dark'>('light')
    const [savedKeys, setSavedKeys] = useState<Record<string, string>>({})
    const [keyValues, setKeyValues] = useState<Record<string, string>>({})
    const [isBuilding, setIsBuilding] = useState(false)
    const [buildComplete, setBuildComplete] = useState(false)

    const saveKey = (id: string) => {
        if (!keyValues[id]) return
        setSavedKeys(prev => ({ ...prev, [id]: keyValues[id] }))
    }

    const startBuild = async () => {
        setIsBuilding(true)
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            await fetch('/api/build-app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session, theme: appTheme, apiKeys: savedKeys }),
            })
            setBuildComplete(true)
            localStorage.setItem('launchfleet_session', JSON.stringify({ ...session, stage: 'build', buildComplete: true, appTheme }))
        } catch {
            // Handle error
        } finally {
            setIsBuilding(false)
        }
    }

    const TABS = ['template', 'api-keys', 'resources', 'widget']

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
                        App template, API keys, native widget, and recommended resources.
                    </p>
                </div>

                {/* Tabs */}
                <div className="tabs" style={{ marginBottom: 'var(--space-xl)' }}>
                    {TABS.map(tab => (
                        <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab === 'template' ? 'Template' : tab === 'api-keys' ? 'API Keys' : tab === 'resources' ? 'Resources' : 'Widget'}
                        </button>
                    ))}
                </div>

                {/* Template tab */}
                {activeTab === 'template' && (
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>App Theme</h2>
                        <p className="subhead" style={{ marginBottom: 'var(--space-xl)' }}>
                            Apple-native design. Choose light or dark as your base.
                        </p>

                        <div className="grid grid-2" style={{ gap: 'var(--space-lg)', maxWidth: 700 }}>
                            {/* Light */}
                            <div
                                className={`template-card ${appTheme === 'light' ? 'selected' : ''}`}
                                onClick={() => setAppTheme('light')}
                            >
                                <div style={{ aspectRatio: '9/16', background: '#FFFFFF', color: '#1D1D1F', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                    <div style={{ height: 20, background: '#F2F2F7', borderRadius: 6 }} />
                                    <div style={{ flex: 1, background: '#F2F2F7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Smartphone size={40} color="#AEAEB2" />
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <div style={{ flex: 1, height: 36, background: '#007AFF', borderRadius: 8 }} />
                                        <div style={{ flex: 1, height: 36, background: '#34C759', borderRadius: 8 }} />
                                    </div>
                                </div>
                                <div className="template-info">
                                    <h3>Light Mode</h3>
                                    <p className="footnote">White background, black text, Apple system color buttons</p>
                                </div>
                            </div>

                            {/* Dark */}
                            <div
                                className={`template-card ${appTheme === 'dark' ? 'selected' : ''}`}
                                onClick={() => setAppTheme('dark')}
                            >
                                <div style={{ aspectRatio: '9/16', background: '#1D1D1F', color: '#F5F5F7', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                    <div style={{ height: 20, background: '#2C2C2E', borderRadius: 6 }} />
                                    <div style={{ flex: 1, background: '#2C2C2E', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Smartphone size={40} color="#636366" />
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <div style={{ flex: 1, height: 36, background: '#0A84FF', borderRadius: 8 }} />
                                        <div style={{ flex: 1, height: 36, background: '#30D158', borderRadius: 8 }} />
                                    </div>
                                </div>
                                <div className="template-info">
                                    <h3>Dark Mode</h3>
                                    <p className="footnote">Dark background, white text, Apple system color buttons</p>
                                </div>
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
                                                    />
                                                </div>
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

                {/* Widget tab */}
                {activeTab === 'widget' && (
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Native iPhone Widget</h2>
                        <p className="subhead" style={{ marginBottom: 'var(--space-xl)' }}>
                            A matching WidgetKit extension is generated with your app. Preview your widget sizes.
                        </p>

                        <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {/* Small widget */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 155, height: 155, borderRadius: 22,
                                    background: appTheme === 'dark' ? '#1D1D1F' : '#F2F2F7',
                                    border: '1px solid var(--separator)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: appTheme === 'dark' ? '#F5F5F7' : '#1D1D1F',
                                    fontSize: 'var(--fs-footnote)',
                                }}>
                                    Small (2x2)
                                </div>
                                <span className="caption" style={{ marginTop: 'var(--space-sm)', display: 'block' }}>Small</span>
                            </div>

                            {/* Medium widget */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 329, height: 155, borderRadius: 22,
                                    background: appTheme === 'dark' ? '#1D1D1F' : '#F2F2F7',
                                    border: '1px solid var(--separator)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: appTheme === 'dark' ? '#F5F5F7' : '#1D1D1F',
                                    fontSize: 'var(--fs-footnote)',
                                }}>
                                    Medium (4x2)
                                </div>
                                <span className="caption" style={{ marginTop: 'var(--space-sm)', display: 'block' }}>Medium</span>
                            </div>

                            {/* Large widget */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 329, height: 345, borderRadius: 22,
                                    background: appTheme === 'dark' ? '#1D1D1F' : '#F2F2F7',
                                    border: '1px solid var(--separator)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: appTheme === 'dark' ? '#F5F5F7' : '#1D1D1F',
                                    fontSize: 'var(--fs-footnote)',
                                }}>
                                    Large (4x4)
                                </div>
                                <span className="caption" style={{ marginTop: 'var(--space-sm)', display: 'block' }}>Large</span>
                            </div>
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
