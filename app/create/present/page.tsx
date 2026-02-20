'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, Download, Upload, Play, Plus, X, Lightbulb, Tag, Palette, Wrench, Monitor, Globe, Store, Rocket, AlertTriangle, Smartphone, Tablet, Laptop, MonitorIcon } from 'lucide-react'

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

const COMPLETED = ['idea', 'name', 'brand', 'build']

// Required App Store screenshot sizes
const SCREENSHOT_SLOTS = [
    { id: 'hero', label: 'Hero — Value Proposition', description: 'Show your app\'s #1 feature', required: true },
    { id: 'feature1', label: 'Key Feature', description: 'Your biggest differentiator', required: true },
    { id: 'feature2', label: 'Core Experience', description: 'What users do most', required: true },
    { id: 'feature3', label: 'Details & Settings', description: 'Depth and customization', required: false },
    { id: 'feature4', label: 'Widget or Extra', description: 'Widget, shortcuts, or bonus feature', required: false },
]

export default function PresentPage() {
    const [activeTab, setActiveTab] = useState('screenshots')
    const [screenshots, setScreenshots] = useState<(string | null)[]>([null, null, null, null, null])
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [confirmed, setConfirmed] = useState(false)
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Load saved state from localStorage
    useEffect(() => {
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            if (session.screenshots?.length > 0) setScreenshots(session.screenshots)
            if (session.qrCode) setQrCode(session.qrCode)
            if (session.presentComplete) setConfirmed(true)

            // Generate QR code if we have a name
            const appName = session?.appName || session?.selectedName || 'app'
            if (!session.qrCode) {
                const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://${appName.toLowerCase().replace(/\s+/g, '')}.app`)}`
                setQrCode(qr)
            }
        } catch { /* first visit */ }
    }, [])

    const session = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        : {}
    const landingHtml = session?.landingHtml
    const appName = session?.appName || session?.selectedName || 'App'
    const brandColors = session?.brandTemplate?.colorPalette || { primary: '#1D1D1F', accent: '#007AFF', bg: '#FFFFFF' }

    const handleScreenshotUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, etc.)')
            return
        }

        const reader = new FileReader()
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string
            setScreenshots(prev => {
                const next = [...prev]
                next[index] = dataUrl
                return next
            })
        }
        reader.readAsDataURL(file)
    }

    const removeScreenshot = (index: number) => {
        setScreenshots(prev => {
            const next = [...prev]
            next[index] = null
            return next
        })
    }

    const downloadScreenshot = (dataUrl: string, index: number) => {
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `screenshot-${index + 1}.png`
        link.click()
    }

    const downloadAll = () => {
        screenshots.forEach((url, i) => {
            if (url) setTimeout(() => downloadScreenshot(url, i), i * 500)
        })
    }

    const uploadedCount = screenshots.filter(Boolean).length
    const requiredCount = SCREENSHOT_SLOTS.filter(s => s.required).length
    const hasRequiredScreenshots = screenshots.slice(0, requiredCount).every(Boolean)

    const confirmPresentation = () => {
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        localStorage.setItem('launchfleet_session', JSON.stringify({
            ...session, stage: 'present', presentComplete: true,
            screenshots, qrCode,
        }))
        setConfirmed(true)
    }

    const TABS = ['screenshots', 'showcase', 'mockups']

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
                        <Link key={s.id} href={s.path} className={`stage-pill ${s.id === 'present' ? 'active' : COMPLETED.includes(s.id) ? 'completed' : ''}`}>
                            <span className="stage-num">{COMPLETED.includes(s.id) ? <Check size={12} /> : i + 1}</span>
                            {s.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="page-header">
                    <div className="caption" style={{ marginBottom: 'var(--space-xs)' }}>Stage 5</div>
                    <h1>Presentation Assets</h1>
                    <p className="subhead">
                        Upload real screenshots from your Expo simulator, preview device mockups, and generate your QR code.
                    </p>
                </div>

                {/* Apple compliance notice */}
                <div style={{
                    background: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-md) var(--space-lg)',
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)',
                    marginBottom: 'var(--space-xl)',
                }}>
                    <AlertTriangle size={20} color="#F57F17" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                        <strong style={{ color: '#E65100' }}>Apple Requirement</strong>
                        <p style={{ fontSize: 'var(--fs-footnote)', color: '#5D4037', marginTop: 4, lineHeight: 1.5 }}>
                            App Store screenshots must show the <strong>actual app running</strong> on a real device or simulator.
                            Misleading screenshots will result in rejection. Run your app in the Expo simulator, navigate to each screen,
                            and use <code style={{ background: '#FFF3E0', padding: '1px 4px', borderRadius: 4 }}>⌘+S</code> to save simulator screenshots.
                            Your OpenClaw agent can also capture these automatically.
                        </p>
                    </div>
                </div>

                <div className="tabs" style={{ marginBottom: 'var(--space-xl)' }}>
                    {TABS.map(tab => (
                        <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab === 'screenshots' ? `Screenshots (${uploadedCount}/5)` : tab === 'showcase' ? 'Device Showcase' : 'Mockups & QR'}
                        </button>
                    ))}
                </div>

                {/* ═══ Screenshots — Upload from Simulator ═══ */}
                {activeTab === 'screenshots' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                            <div>
                                <h2>Upload Simulator Screenshots</h2>
                                <p className="subhead" style={{ marginTop: 4 }}>
                                    Capture real screens from the Expo simulator. First 3 are required.
                                </p>
                            </div>
                            {uploadedCount > 0 && (
                                <button className="btn btn-primary btn-sm" onClick={downloadAll}>
                                    <Download size={14} /> Download All
                                </button>
                            )}
                        </div>

                        {/* Screenshot size requirements */}
                        <div style={{
                            background: '#F2F2F7', borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-sm) var(--space-md)',
                            marginBottom: 'var(--space-xl)',
                            display: 'flex', gap: 'var(--space-lg)',
                            fontSize: 'var(--fs-footnote)', color: '#8E8E93',
                        }}>
                            <span><strong>iPhone 6.7"</strong> — 1290 × 2796</span>
                            <span><strong>iPhone 6.5"</strong> — 1284 × 2778</span>
                            <span><strong>iPad 12.9"</strong> — 2048 × 2732</span>
                        </div>

                        {/* Upload slots */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-md)' }}>
                            {SCREENSHOT_SLOTS.map((slot, i) => (
                                <div key={slot.id}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={el => { fileInputRefs.current[i] = el }}
                                        onChange={(e) => handleScreenshotUpload(i, e)}
                                        style={{ display: 'none' }}
                                    />
                                    {screenshots[i] ? (
                                        /* Uploaded screenshot */
                                        <div style={{ position: 'relative' }}>
                                            <div style={{
                                                aspectRatio: '9/19.5',
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                                                border: '2px solid #34C759',
                                            }}>
                                                <img
                                                    src={screenshots[i]!}
                                                    alt={slot.label}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeScreenshot(i)}
                                                style={{
                                                    position: 'absolute', top: -8, right: -8,
                                                    width: 24, height: 24, borderRadius: '50%',
                                                    background: '#FF3B30', color: '#fff',
                                                    border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                            >
                                                <X size={12} />
                                            </button>
                                            <button
                                                onClick={() => fileInputRefs.current[i]?.click()}
                                                style={{
                                                    position: 'absolute', bottom: -8, right: -8,
                                                    width: 28, height: 28, borderRadius: '50%',
                                                    background: '#007AFF', color: '#fff',
                                                    border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 11,
                                                }}
                                                title="Replace screenshot"
                                            >
                                                <Upload size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        /* Empty upload slot */
                                        <div
                                            onClick={() => fileInputRefs.current[i]?.click()}
                                            style={{
                                                aspectRatio: '9/19.5',
                                                borderRadius: 12,
                                                border: `2px dashed ${slot.required ? '#007AFF' : '#D1D1D6'}`,
                                                background: slot.required ? '#F0F5FF' : '#FAFAFA',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 8,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                padding: 12,
                                            }}
                                            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#007AFF' }}
                                            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = slot.required ? '#007AFF' : '#D1D1D6' }}
                                        >
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: slot.required ? '#007AFF' : '#E5E5EA',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Plus size={18} color={slot.required ? '#fff' : '#8E8E93'} />
                                            </div>
                                            <span style={{ fontSize: 10, textAlign: 'center', color: '#8E8E93', lineHeight: 1.3 }}>
                                                Upload
                                            </span>
                                        </div>
                                    )}
                                    <div style={{ marginTop: 'var(--space-xs)', textAlign: 'center' }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: '#1D1D1F', display: 'block' }}>
                                            {i + 1}. {slot.label}
                                        </span>
                                        <span style={{ fontSize: 10, color: '#8E8E93' }}>
                                            {slot.required ? 'Required' : 'Optional'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* How to capture guide */}
                        <div className="card" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-lg)', background: '#F8F8FA' }}>
                            <h3 style={{ fontSize: 'var(--fs-subhead)', marginBottom: 'var(--space-sm)' }}>How to Capture Screenshots</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                                <div>
                                    <strong style={{ fontSize: 11, color: '#007AFF', textTransform: 'uppercase', letterSpacing: 0.5 }}>Manually</strong>
                                    <ol style={{ fontSize: 'var(--fs-footnote)', color: '#3A3A3C', paddingLeft: 16, marginTop: 8, lineHeight: 1.8 }}>
                                        <li>Run <code style={{ background: '#E5E5EA', padding: '1px 4px', borderRadius: 3 }}>npx expo start</code></li>
                                        <li>Open iOS Simulator</li>
                                        <li>Navigate to each screen</li>
                                        <li>Press <code style={{ background: '#E5E5EA', padding: '1px 4px', borderRadius: 3 }}>⌘+S</code> to save</li>
                                        <li>Upload here</li>
                                    </ol>
                                </div>
                                <div>
                                    <strong style={{ fontSize: 11, color: '#007AFF', textTransform: 'uppercase', letterSpacing: 0.5 }}>Via OpenClaw Agent</strong>
                                    <ol style={{ fontSize: 'var(--fs-footnote)', color: '#3A3A3C', paddingLeft: 16, marginTop: 8, lineHeight: 1.8 }}>
                                        <li>Set up your agent on <a href="https://openclaw.ai" target="_blank" rel="noopener" style={{ color: '#007AFF' }}>openclaw.ai</a></li>
                                        <li>Install the relay Chrome extension</li>
                                        <li>Agent auto-captures screens from Expo simulator</li>
                                        <li>Agent auto-records product video</li>
                                        <li>Screenshots saved to your project</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Device Showcase ═══ */}
                {activeTab === 'showcase' && (
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Device Showcase</h2>
                        <p className="subhead" style={{ marginBottom: 'var(--space-xl)' }}>
                            Your app and landing page displayed across Apple devices.
                        </p>

                        <div style={{
                            background: 'linear-gradient(135deg, #F2F2F7 0%, #E5E5EA 100%)',
                            borderRadius: 'var(--radius-2xl)',
                            padding: 'var(--space-3xl) var(--space-xl)',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-xl)',
                            alignItems: 'end',
                        }}>
                            {/* iMac */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    background: '#1D1D1F', borderRadius: '12px 12px 0 0',
                                    padding: '12px 12px 0', display: 'inline-block', width: '100%', maxWidth: 400,
                                }}>
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E' }} />
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840' }} />
                                    </div>
                                    {landingHtml ? (
                                        <iframe srcDoc={landingHtml} style={{ width: '100%', height: 220, border: 'none', borderRadius: '0 0 4px 4px', background: '#fff' }} title="Landing preview" />
                                    ) : (
                                        <div style={{ height: 220, background: brandColors.bg || '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: brandColors.primary, fontWeight: 600, fontSize: 18 }}>{appName}</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ background: '#C7C7CC', height: 20, width: 60, margin: '0 auto', borderRadius: '0 0 4px 4px' }} />
                                <div style={{ background: '#D1D1D6', height: 4, width: 120, margin: '0 auto', borderRadius: '0 0 8px 8px' }} />
                                <span className="caption" style={{ marginTop: 'var(--space-sm)', display: 'block' }}>iMac — Landing Page</span>
                            </div>

                            {/* MacBook */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    background: '#1D1D1F', borderRadius: '8px 8px 0 0',
                                    padding: '8px 8px 0', display: 'inline-block', width: '100%', maxWidth: 360,
                                }}>
                                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#48484A', margin: '0 auto 6px' }} />
                                    {landingHtml ? (
                                        <iframe srcDoc={landingHtml} style={{ width: '100%', height: 200, border: 'none', borderRadius: '0 0 2px 2px', background: '#fff' }} title="Landing preview" />
                                    ) : (
                                        <div style={{ height: 200, background: brandColors.bg || '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: brandColors.primary, fontWeight: 600, fontSize: 16 }}>{appName}</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ background: '#C7C7CC', height: 8, borderRadius: '0 0 8px 8px', width: '110%', margin: '0 -5%' }} />
                                <span className="caption" style={{ marginTop: 'var(--space-sm)', display: 'block' }}>MacBook — Landing Page</span>
                            </div>

                            {/* iPad with uploaded screenshot */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    background: '#1D1D1F', borderRadius: 14, padding: 10,
                                    display: 'inline-block', width: '70%', maxWidth: 280,
                                }}>
                                    <div style={{
                                        background: brandColors.bg || '#fff', borderRadius: 6,
                                        aspectRatio: '3/4', overflow: 'hidden',
                                    }}>
                                        {screenshots[0] ? (
                                            <img src={screenshots[0]} alt="App screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                                {session?.icon && <img src={session.icon} alt="App icon" style={{ width: 48, height: 48, borderRadius: 12 }} />}
                                                <span style={{ color: brandColors.primary, fontWeight: 700, fontSize: 16 }}>{appName}</span>
                                                <span style={{ fontSize: 10, color: '#8E8E93' }}>Upload screenshots to preview</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="caption" style={{ marginTop: 'var(--space-sm)', display: 'block' }}>iPad — App</span>
                            </div>

                            {/* iPhone with uploaded screenshot */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    background: '#1D1D1F', borderRadius: 24, padding: 8,
                                    display: 'inline-block', width: '40%', maxWidth: 160,
                                }}>
                                    <div style={{ background: '#1D1D1F', width: 60, height: 16, borderRadius: '0 0 12px 12px', margin: '0 auto -8px', position: 'relative', zIndex: 2 }} />
                                    <div style={{
                                        background: brandColors.bg || '#fff', borderRadius: 16,
                                        aspectRatio: '9/19.5', overflow: 'hidden',
                                    }}>
                                        {screenshots[0] ? (
                                            <img src={screenshots[0]} alt="App screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                                <Smartphone size={20} color="#8E8E93" />
                                                <span style={{ fontSize: 9, color: '#8E8E93' }}>Upload screenshots</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="caption" style={{ marginTop: 'var(--space-sm)', display: 'block' }}>iPhone — App</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Mockups & QR ═══ */}
                {activeTab === 'mockups' && (
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Device Mockups & QR Code</h2>
                        <p className="subhead" style={{ marginBottom: 'var(--space-xl)' }}>
                            Your screenshots in device frames, plus a QR code.
                        </p>

                        {/* Device mockups with uploaded screenshots */}
                        {uploadedCount > 0 ? (
                            <div className="grid grid-2" style={{ gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)', maxWidth: 600, margin: '0 auto var(--space-xl)' }}>
                                {screenshots.map((src, i) => {
                                    if (!src) return null
                                    return (
                                        <div key={i} className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                                            <div style={{
                                                background: '#1D1D1F', borderRadius: 20, padding: 6,
                                                display: 'inline-block', maxWidth: 140,
                                            }}>
                                                <div style={{ background: '#1D1D1F', width: 40, height: 12, borderRadius: '0 0 8px 8px', margin: '0 auto -4px', position: 'relative', zIndex: 2 }} />
                                                <img src={src} alt={SCREENSHOT_SLOTS[i]?.label || `Screenshot ${i + 1}`}
                                                    style={{ width: '100%', borderRadius: 14, display: 'block' }}
                                                />
                                            </div>
                                            <h3 style={{ fontSize: 'var(--fs-footnote)', marginTop: 'var(--space-sm)' }}>
                                                {SCREENSHOT_SLOTS[i]?.label || `Screenshot ${i + 1}`}
                                            </h3>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                                <Upload size={32} color="#8E8E93" style={{ marginBottom: 'var(--space-sm)' }} />
                                <p className="subhead" style={{ marginBottom: 'var(--space-md)' }}>
                                    Upload screenshots first to see device mockups.
                                </p>
                                <button className="btn btn-ghost" onClick={() => setActiveTab('screenshots')}>
                                    Go to Screenshots tab
                                </button>
                            </div>
                        )}

                        {/* QR Code */}
                        <div className="card" style={{ textAlign: 'center', maxWidth: 340, margin: '0 auto', padding: 'var(--space-xl)' }}>
                            <h3 style={{ marginBottom: 'var(--space-md)' }}>Quick Access QR Code</h3>
                            {qrCode ? (
                                <>
                                    <img
                                        src={qrCode}
                                        alt="QR Code"
                                        style={{
                                            width: 200, height: 200,
                                            borderRadius: 'var(--radius-md)',
                                            margin: '0 auto var(--space-md)',
                                            display: 'block',
                                            border: '1px solid #E5E5EA',
                                        }}
                                    />
                                    <p className="footnote" style={{ color: '#8E8E93' }}>Scan to preview your app</p>
                                    <a
                                        href={qrCode}
                                        download="qr-code.png"
                                        className="btn btn-ghost btn-sm"
                                        style={{ marginTop: 'var(--space-sm)' }}
                                    >
                                        <Download size={14} /> Download QR
                                    </a>
                                </>
                            ) : (
                                <div style={{
                                    width: 200, height: 200,
                                    background: '#F2F2F7', borderRadius: 'var(--radius-md)',
                                    margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span className="footnote" style={{ color: '#8E8E93' }}>Generating...</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══ Confirm ═══ */}
                <div style={{ marginTop: 'var(--space-3xl)', textAlign: 'center' }}>
                    {!confirmed ? (
                        <>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={confirmPresentation}
                                disabled={!hasRequiredScreenshots}
                                style={{ opacity: hasRequiredScreenshots ? 1 : 0.5 }}
                            >
                                <Check size={18} /> Confirm Presentation Assets <ChevronRight size={18} />
                            </button>
                            {!hasRequiredScreenshots && (
                                <p className="footnote" style={{ marginTop: 'var(--space-sm)', color: '#8E8E93' }}>
                                    Upload at least {requiredCount} required screenshots to continue
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <span className="badge badge-success" style={{ fontSize: 'var(--fs-subhead)', padding: '8px 20px', display: 'inline-flex', gap: 6 }}>
                                <Check size={16} /> Assets confirmed
                            </span>
                            <br />
                            <Link href="/create/landing" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)', display: 'inline-flex' }}>
                                Continue to Landing Page <ChevronRight size={18} />
                            </Link>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
