'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════════════
   ANTI-GRAVITY PARTICLE CANVAS
   Nodes float upward, connected by proximity lines. Mouse repels particles.
   ═══════════════════════════════════════════════════════════════════════ */
function AntiGravityCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let raf: number
        let w = 0, h = 0
        let dpr = 1

        const resize = () => {
            dpr = window.devicePixelRatio || 1
            w = window.innerWidth
            h = window.innerHeight
            canvas.width = w * dpr
            canvas.height = h * dpr
            canvas.style.width = w + 'px'
            canvas.style.height = h + 'px'
        }

        const COUNT = 800
        const MOUSE_R = 150
        const CONNECT_DIST = 90

        const COLORS = [
            [220, 50, 60],
            [139, 92, 246],
            [59, 130, 246],
            [245, 180, 30],
            [236, 72, 153],
            [99, 102, 241],
            [6, 182, 212],
            [16, 185, 129],
        ]

        interface P { x: number; y: number; vx: number; vy: number; r: number; c: number[]; opacity: number }

        const ps: P[] = []

        const spawn = (y?: number): P => {
            const c = COLORS[Math.floor(Math.random() * COLORS.length)]
            return {
                x: Math.random() * w,
                y: y ?? Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -(Math.random() * 0.6 + 0.15),
                r: Math.random() * 2.2 + 0.8,
                c,
                opacity: Math.random() * 0.4 + 0.35,
            }
        }

        const init = () => {
            resize()
            ps.length = 0
            for (let i = 0; i < COUNT; i++) ps.push(spawn())
        }

        const draw = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, w, h)

            const mx = mouseRef.current.x
            const my = mouseRef.current.y

            // Update positions — anti-gravity: float upward
            for (let i = 0; i < ps.length; i++) {
                const p = ps[i]

                // Mouse repulsion
                const dx = p.x - mx
                const dy = p.y - my
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < MOUSE_R && dist > 0) {
                    const force = (MOUSE_R - dist) / MOUSE_R
                    p.vx += (dx / dist) * force * 1.5
                    p.vy += (dy / dist) * force * 1.5
                }

                // Apply velocity (anti-gravity = upward drift)
                p.x += p.vx
                p.y += p.vy

                // Gentle lateral sway
                p.vx += (Math.random() - 0.5) * 0.02
                p.vx *= 0.99
                p.vy *= 0.995

                // Keep upward bias (anti-gravity)
                if (p.vy > -0.08) p.vy -= 0.005

                // Respawn at bottom when off top
                if (p.y < -20) { Object.assign(p, spawn(h + 20)) }
                // Wrap horizontally
                if (p.x < -20) p.x = w + 20
                if (p.x > w + 20) p.x = -20
            }

            // Draw connection lines between nearby particles
            ctx.lineWidth = 0.5
            for (let i = 0; i < ps.length; i++) {
                for (let j = i + 1; j < ps.length; j++) {
                    const dx = ps[i].x - ps[j].x
                    const dy = ps[i].y - ps[j].y
                    const d = dx * dx + dy * dy
                    if (d < CONNECT_DIST * CONNECT_DIST) {
                        const alpha = (1 - Math.sqrt(d) / CONNECT_DIST) * 0.15
                        ctx.strokeStyle = `rgba(${ps[i].c[0]},${ps[i].c[1]},${ps[i].c[2]},${alpha})`
                        ctx.beginPath()
                        ctx.moveTo(ps[i].x, ps[i].y)
                        ctx.lineTo(ps[j].x, ps[j].y)
                        ctx.stroke()
                    }
                }
            }

            // Draw particles
            for (let i = 0; i < ps.length; i++) {
                const p = ps[i]
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.opacity})`
                ctx.fill()
            }

            raf = requestAnimationFrame(draw)
        }

        const onMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }

        init()
        draw()
        window.addEventListener('resize', init)
        window.addEventListener('mousemove', onMove)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', init)
            window.removeEventListener('mousemove', onMove)
        }
    }, [])

    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

/* ═══ Scroll reveal ═══ */
function useReveal(threshold = 0.12) {
    const ref = useRef<HTMLDivElement>(null)
    const [vis, setVis] = useState(false)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect() } }, { threshold })
        o.observe(el); return () => o.disconnect()
    }, [threshold])
    return { ref, vis }
}

function Reveal({ children, d = 0, className = '' }: { children: React.ReactNode; d?: number; className?: string }) {
    const { ref, vis } = useReveal()
    return (
        <div ref={ref} className={className} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.8s cubic-bezier(0.25,1,0.5,1) ${d}s, transform 0.8s cubic-bezier(0.25,1,0.5,1) ${d}s`,
        }}>{children}</div>
    )
}

/* ═══ Counter ═══ */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
    const [n, setN] = useState(0)
    const { ref, vis } = useReveal(0.3)
    useEffect(() => {
        if (!vis) return
        let v = 0; const step = end / 60
        const t = setInterval(() => { v += step; if (v >= end) { setN(end); clearInterval(t) } else setN(Math.floor(v)) }, 16)
        return () => clearInterval(t)
    }, [vis, end])
    return <span ref={ref}>{n}{suffix}</span>
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
    const [scrollY, setScrollY] = useState(0)
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [err, setErr] = useState('')
    const [wlCount, setWlCount] = useState(0)
    const [adminClicks, setAdminClicks] = useState(0)
    const [showAdmin, setShowAdmin] = useState(false)
    const [adminCode, setAdminCode] = useState('')


    const onScroll = useCallback(() => setScrollY(window.scrollY), [])
    useEffect(() => {
        window.addEventListener('scroll', onScroll, { passive: true })
        fetch('/api/waitlist').then(r => r.json()).then(d => { if (d.count) setWlCount(d.count) }).catch(() => {
            setWlCount(JSON.parse(localStorage.getItem('wizard_waitlist') || '[]').length)
        })
        return () => window.removeEventListener('scroll', onScroll)
    }, [onScroll])

    const adminTap = () => { const c = adminClicks + 1; setAdminClicks(c); if (c >= 5) setShowAdmin(true) }
    const adminGo = () => {
        if (adminCode === '02051967') { localStorage.setItem('wizard_admin_access', 'true'); window.location.href = '/admin' }
        else { setAdminCode(''); setShowAdmin(false); setAdminClicks(0) }
    }
    const handleWaitlist = async (e: React.FormEvent) => {
        e.preventDefault(); setErr('')
        if (!email || !email.includes('@')) { setErr('Please enter a valid email.'); return }
        try {
            const r = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'launchfleet', referrer: document.referrer || null }) })
            const d = await r.json()
            if (d.success) { if (d.duplicate) setErr("You're already on the list."); else { setSubmitted(true); setWlCount(p => p + 1) } }
            else setErr(d.error || 'Something went wrong.')
        } catch {
            const s = JSON.parse(localStorage.getItem('wizard_waitlist') || '[]')
            if (s.includes(email.toLowerCase())) { setErr("You're already on the list."); return }
            s.push(email.toLowerCase()); localStorage.setItem('wizard_waitlist', JSON.stringify(s))
            setWlCount(s.length); setSubmitted(true)
        }
        setEmail('')
    }



    const steps = [
        { n: '01', t: 'Describe Your Vision', d: 'Our Greeter agent captures your idea, target audience, and goals through a guided conversation. No technical knowledge required.' },
        { n: '02', t: 'Name, Brand, Research', d: 'Scout, Namer, and Checker work in parallel: analyzing competitors, generating names, and verifying trademarks and domains.' },
        { n: '03', t: 'Design and Architect', d: 'Pixel designs every screen while Builder maps the technical foundation: database schema, API contracts, and navigation.' },
        { n: '04', t: 'Build and Test', d: 'Builder writes production React Native code. Reviewer catches bugs, performance issues, and edge cases before users ever see them.' },
        { n: '05', t: 'Submit to App Stores', d: 'Shipper generates screenshots, optimizes metadata, handles compliance, and submits to both Apple and Google.' },
        { n: '06', t: 'Launch and Scale', d: 'Buzz activates your marketing plan. Sentinel monitors infrastructure. Full source code and documentation are delivered to you.' },
    ]

    const features = [
        { t: 'Native iOS + Android', d: 'React Native compiled to native binaries. Real App Store performance, not a web wrapper.' },
        { t: 'Complete Brand Identity', d: 'Logo, icon, color system, typography, splash screen, and a full brand guidelines document.' },
        { t: 'App Store-Ready Assets', d: 'Screenshots for every device, optimized descriptions, targeted keywords, and preview video.' },
        { t: 'Trademark + Domain Verified', d: 'USPTO trademark search, domain DNS check, and social handle verification across 6 platforms.' },
        { t: '30-Day Launch Campaign', d: 'Content calendar, social media strategy, ASO, email marketing, and press outreach.' },
        { t: 'Full Source Code Ownership', d: 'Every line of code is yours. GitHub export, no lock-in, no recurring platform fees.' },
        { t: 'Revenue Infrastructure', d: 'RevenueCat subscriptions, optimized paywalls, A/B tested pricing, and trial flow design.' },
        { t: 'Dedicated AI Maintainer', d: 'A trained AI agent that knows your codebase and handles updates, reviews, and support.' },
    ]

    const heroParallax = Math.min(scrollY * 0.3, 200)
    const heroFade = Math.max(1 - scrollY / 600, 0)

    return (
        <div className="page">
            <AntiGravityCanvas />
            {/* ═══ NAV ═══ */}
            <nav className="nav" style={{
                background: scrollY > 80 ? 'rgba(255,255,255,0.96)' : 'transparent',
                backdropFilter: scrollY > 80 ? 'blur(20px) saturate(180%)' : 'none',
                borderBottomColor: scrollY > 80 ? 'rgba(0,0,0,0.06)' : 'transparent',
            }}>
                <div className="nav__inner">
                    <a href="/" className="nav__wordmark" style={{ color: '#0a0a0a' }}>LaunchFleet</a>
                    <div className="nav__links">
                        {['Process', 'Features', 'Pricing'].map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: '#555' }}>{l}</a>
                        ))}
                    </div>
                    <a href="#waitlist" className="nav__cta" style={{
                        background: '#0a0a0a',
                        border: '1px solid #0a0a0a',
                        color: '#fff',
                    }}>Get Early Access</a>
                </div>
            </nav>

            {/* ═══ HERO ═══ */}
            <section className="hero">
                <div className="hero__content" style={{ opacity: heroFade }}>
                    <Reveal><p className="hero__badge">Introducing LaunchFleet</p></Reveal>
                    <Reveal d={0.1}><h1 className="hero__h1">The full-stack AI team<br />that ships your app.</h1></Reveal>
                    <Reveal d={0.2}><p className="hero__sub">18 specialized agents handle naming, design, development,<br />compliance, and marketing. You own every line of code.</p></Reveal>
                    <Reveal d={0.3}>
                        <div className="hero__ctas">
                            <a href="#waitlist" className="btn btn--dark">Get Early Access</a>
                            <a href="#process" className="btn btn--outline-dark">See How It Works</a>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══ METRICS ═══ */}
            <section className="metrics">
                <div className="container">
                    <div className="metrics__grid">
                        {[
                            { v: <Counter end={18} />, l: 'AI Agents' },
                            { v: <Counter end={6} />, l: 'Departments' },
                            { v: <Counter end={100} suffix="%" />, l: 'Code Ownership' },
                            { v: '2', l: 'Platforms (iOS + Android)' },
                        ].map((m, i) => (
                            <div key={i} className="metrics__item">
                                <span className="metrics__value">{m.v}</span>
                                <span className="metrics__label">{m.l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* ═══ PROCESS ═══ */}
            <section id="process" className="section section--violet">
                <div className="container">
                    <Reveal>
                        <p className="section__eyebrow">Process</p>
                        <h2 className="section__h2">From idea to App Store in six steps</h2>
                    </Reveal>
                    <div className="steps-grid">
                        {steps.map((s, i) => {
                            const gradients = [
                                'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                'linear-gradient(135deg, #3b82f6, #06b6d4)',
                                'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                'linear-gradient(135deg, #10b981, #3b82f6)',
                                'linear-gradient(135deg, #f59e0b, #ef4444)',
                                'linear-gradient(135deg, #06b6d4, #6366f1)',
                            ]
                            return (
                                <Reveal key={i} d={0.08 * i}>
                                    <div className="step-card">
                                        <div className="step-card__accent" style={{ background: gradients[i] }} />
                                        <span className="step-card__num">{s.n}</span>
                                        <h3 className="step-card__title">{s.t}</h3>
                                        <p className="step-card__desc">{s.d}</p>
                                    </div>
                                </Reveal>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES ═══ */}
            <section id="features" className="section section--rose">
                <div className="container">
                    <Reveal>
                        <p className="section__eyebrow">Capabilities</p>
                        <h2 className="section__h2">Everything required to launch</h2>
                        <p className="section__desc">No third-party tools, no gaps, no handoffs. Every capability is built into the platform.</p>
                    </Reveal>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <Reveal key={i} d={0.06 * i}>
                                <div className="feat">
                                    <h3>{f.t}</h3>
                                    <p>{f.d}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PRICING ═══ */}
            <section id="pricing" className="section section--cyan">
                <div className="container">
                    <Reveal>
                        <p className="section__eyebrow">Pricing</p>
                        <h2 className="section__h2">Simple, transparent pricing</h2>
                    </Reveal>
                    <div className="pricing-grid">
                        <Reveal d={0.1}>
                            <div className="price">
                                <p className="price__tier">Weekly</p>
                                <p className="price__amount">$19.99<span> / week</span></p>
                                <p className="price__desc">Full platform access for a single project. Cancel anytime.</p>
                                <ul className="price__list">
                                    <li>2 builds per week</li>
                                    <li>All 18 AI agents</li>
                                    <li>Full source code ownership</li>
                                    <li>App Store submission</li>
                                    <li>Email support</li>
                                </ul>
                                <a href="#waitlist" className="btn btn--outline-dark btn--full">Get Started</a>
                            </div>
                        </Reveal>
                        <Reveal d={0.2}>
                            <div className="price price--featured">
                                <span className="price__badge">Recommended</span>
                                <p className="price__tier">Annual</p>
                                <p className="price__amount">$499<span> / year</span></p>
                                <p className="price__desc">For teams shipping multiple apps with priority support.</p>
                                <ul className="price__list">
                                    <li>3 builds per week</li>
                                    <li>All 18 AI agents</li>
                                    <li>Full source code ownership</li>
                                    <li>Priority support</li>
                                    <li>30-day launch marketing</li>
                                    <li>Dedicated AI maintainer</li>
                                </ul>
                                <a href="#waitlist" className="btn btn--dark btn--full">Get Started</a>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══ WAITLIST ═══ */}
            <section id="waitlist" className="section section--amber wl-section">
                <div className="container wl-container">
                    <Reveal>
                        <p className="section__eyebrow">Early Access</p>
                        <h2 className="section__h2">Start building with LaunchFleet</h2>
                        <p className="section__desc" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Join the waitlist. We will reach out when your spot opens.</p>
                    </Reveal>
                    <Reveal d={0.15}>
                        {submitted ? (
                            <div className="wl-done">
                                <p className="wl-done__main">You are on the list.</p>
                                <p className="wl-done__sub">We will be in touch soon.</p>
                            </div>
                        ) : (
                            <form className="wl-form" onSubmit={handleWaitlist}>
                                <div className="wl-form__row">
                                    <input type="email" placeholder="you@company.com" value={email} onChange={e => { setEmail(e.target.value); setErr('') }} className="wl-form__input" required />
                                    <button type="submit" className="btn btn--dark">Join Waitlist</button>
                                </div>
                                {err && <p className="wl-form__err">{err}</p>}
                            </form>
                        )}
                        {wlCount > 0 && <p className="wl-count">{wlCount} {wlCount === 1 ? 'person' : 'people'} on the waitlist</p>}
                    </Reveal>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="footer">
                <div className="container">
                    <div className="footer__top">
                        <span className="footer__brand">LaunchFleet</span>
                        <div className="footer__links">
                            <a href="/privacy">Privacy</a>
                            <a href="/terms">Terms</a>
                            <a href="mailto:hello@launchfleet.ai">Contact</a>
                        </div>
                    </div>
                    <div className="footer__bottom">
                        <p onClick={adminTap} style={{ cursor: 'default' }}>2026 LaunchFleet by BTS Innovations. All rights reserved.</p>
                        {showAdmin && (
                            <div className="footer__admin">
                                <input type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="Code" onKeyDown={e => e.key === 'Enter' && adminGo()} />
                                <button onClick={adminGo}>Go</button>
                            </div>
                        )}
                    </div>
                </div>
            </footer>

            {/* ═══ GLOBAL RESET ═══ */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
                body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #0a0a0a; line-height: 1.5; }
                ::selection { background: #0a0a0a; color: #fff; }
            `}</style>

            {/* ═══ SCOPED STYLES ═══ */}
            <style jsx>{`
                /* ─── Layout ─── */
                .container { max-width: 1120px; margin: 0 auto; padding: 0 40px; }

                /* ─── Nav ─── */
                .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; border-bottom: 1px solid transparent; transition: all 0.35s cubic-bezier(0.25,1,0.5,1); }
                .nav__inner { max-width: 1120px; margin: 0 auto; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; height: 72px; }
                .nav__wordmark { font-size: 1.1rem; font-weight: 600; text-decoration: none; letter-spacing: -0.02em; transition: color 0.3s; }
                .nav__links { display: flex; gap: 36px; }
                .nav__links a { text-decoration: none; font-size: 0.84rem; font-weight: 500; transition: all 0.2s; letter-spacing: -0.01em; }
                .nav__links a:hover { opacity: 0.6; }
                .nav__cta { font-size: 0.82rem; font-weight: 600; padding: 10px 22px; border-radius: 8px; text-decoration: none; transition: all 0.25s; }
                .nav__cta:hover { opacity: 0.85; }

                /* ─── Page ─── */
                .page { position: relative; z-index: 1; }

                /* ─── Hero ─── */
                .hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; background: transparent; }
                .hero__content { position: relative; z-index: 3; text-align: center; max-width: 760px; padding: 48px 48px 52px; background: rgba(255,255,255,0.45); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 8px 32px rgba(0,0,0,0.04); }
                .hero__badge { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #999; margin-bottom: 20px; }
                .hero__h1 { font-size: clamp(3rem, 7vw, 4.2rem); font-weight: 600; letter-spacing: -0.03em; line-height: 1.1; color: #1d1d1f; margin-bottom: 18px; }
                .hero__sub { font-size: 1.1rem; line-height: 1.6; color: #86868b; margin-bottom: 38px; font-weight: 400; }
                .hero__ctas { display: flex; gap: 12px; justify-content: center; }

                /* ─── Buttons ─── */
                .btn { display: inline-flex; align-items: center; justify-content: center; padding: 14px 28px; font-size: 0.88rem; font-weight: 600; border-radius: 8px; text-decoration: none; cursor: pointer; transition: all 0.25s; font-family: inherit; border: none; letter-spacing: -0.01em; }
                .btn--white { background: #fff; color: #0a0a0a; }
                .btn--white:hover { background: #f0f0f0; }
                .btn--outline { background: transparent; color: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.2); }
                .btn--outline:hover { border-color: rgba(255,255,255,0.45); color: #fff; }
                .btn--dark { background: #0a0a0a; color: #fff; }
                .btn--dark:hover { background: #222; }
                .btn--outline-dark { background: #fff; color: #0a0a0a; border: 1.5px solid #ddd; }
                .btn--outline-dark:hover { border-color: #0a0a0a; }
                .btn--full { width: 100%; }

                /* ─── Metrics ─── */
                .metrics { padding: 60px 0; border-bottom: 1px solid rgba(0,0,0,0.04); background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); position: relative; z-index: 2; }
                .metrics__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
                .metrics__item { text-align: center; padding: 0 20px; }
                .metrics__item:not(:last-child) { border-right: 1px solid rgba(0,0,0,0.06); }
                .metrics__value { display: block; font-size: 2.2rem; font-weight: 600; letter-spacing: -0.02em; color: #1d1d1f; }
                .metrics__label { display: block; font-size: 0.72rem; font-weight: 400; color: #86868b; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.06em; }

                /* ─── Section ─── */
                .section { padding: 100px 0; position: relative; z-index: 2; background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 1px solid rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.5); }
                .section--blue { background: rgba(235,245,255,0.95); }
                .section--violet { background: rgba(243,237,255,0.95); }
                .section--rose { background: rgba(255,240,245,0.95); }
                .section--cyan { background: rgba(237,250,255,0.95); }
                .section--amber { background: rgba(255,248,235,0.95); }
                .section__eyebrow { font-size: 0.72rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; color: #86868b; margin-bottom: 10px; }
                .section__h2 { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 600; letter-spacing: -0.025em; line-height: 1.15; margin-bottom: 14px; color: #1d1d1f; }
                .section__desc { font-size: 0.95rem; color: #6e6e73; line-height: 1.6; max-width: 520px; margin-bottom: 48px; font-weight: 400; }



                /* ─── Steps Grid ─── */
                .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 40px; }
                .step-card { position: relative; background: #fff; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 28px 24px; overflow: hidden; transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; }
                .step-card:hover { border-color: rgba(0,0,0,0.12); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
                .step-card__accent { position: absolute; top: 0; left: 0; width: 3px; height: 100%; border-radius: 3px 0 0 3px; }
                .step-card__num { font-size: 0.65rem; font-weight: 500; color: #86868b; letter-spacing: 0.1em; display: block; margin-bottom: 12px; }
                .step-card__title { font-size: 0.98rem; font-weight: 600; color: #1d1d1f; margin-bottom: 8px; letter-spacing: -0.01em; }
                .step-card__desc { font-size: 0.82rem; color: #86868b; line-height: 1.6; font-weight: 400; }

                /* ─── Features ─── */
                .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; overflow: hidden; margin-top: 40px; }
                .feat { background: #fff; padding: 28px 24px; transition: background 0.2s; }
                .feat:hover { background: rgba(255,255,255,0.98); }
                .feat h3 { font-size: 0.86rem; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.01em; color: #1d1d1f; }
                .feat p { font-size: 0.82rem; color: #86868b; line-height: 1.6; font-weight: 400; }

                /* ─── Pricing ─── */
                .pricing-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 700px; margin: 40px auto 0; }
                .price { border: 1px solid rgba(0,0,0,0.08); border-radius: 14px; padding: 32px 28px; position: relative; background: #fff; display: flex; flex-direction: column; }
                .price--featured { border: 2px solid #1d1d1f; }
                .price__badge { position: absolute; top: -12px; left: 26px; background: #1d1d1f; color: #fff; padding: 5px 16px; font-size: 0.62rem; font-weight: 500; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.06em; }
                .price__tier { font-size: 0.76rem; font-weight: 500; color: #86868b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
                .price__amount { font-size: 2.4rem; font-weight: 600; letter-spacing: -0.03em; line-height: 1; margin-bottom: 10px; color: #1d1d1f; }
                .price__amount span { font-size: 0.88rem; font-weight: 400; color: #86868b; letter-spacing: 0; }
                .price__desc { font-size: 0.84rem; color: #86868b; line-height: 1.55; margin-bottom: 22px; font-weight: 400; }
                .price__list { list-style: none; margin-bottom: 24px; flex: 1; }
                .price__list li { padding: 7px 0; font-size: 0.84rem; color: #424245; border-bottom: 1px solid rgba(0,0,0,0.04); font-weight: 400; }
                .price__list li:last-child { border: none; }

                /* ─── Waitlist ─── */
                .wl-section { text-align: center; border-top: 1px solid rgba(0,0,0,0.06); }
                .wl-container { max-width: 520px; }
                .wl-form { margin-top: 32px; }
                .wl-form__row { display: flex; gap: 8px; }
                .wl-form__input { flex: 1; padding: 13px 18px; background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; font-size: 0.88rem; font-family: inherit; color: #1d1d1f; outline: none; transition: border-color 0.2s; }
                .wl-form__input::placeholder { color: #86868b; }
                .wl-form__input:focus { border-color: #1d1d1f; }
                .wl-form__err { color: #ef4444; font-size: 0.82rem; margin-top: 10px; }
                .wl-done { margin-top: 32px; }
                .wl-done__main { font-size: 1.05rem; font-weight: 600; color: #1d1d1f; margin-bottom: 4px; }
                .wl-done__sub { font-size: 0.86rem; color: #86868b; }
                .wl-count { font-size: 0.76rem; color: #86868b; margin-top: 14px; }

                /* ─── Footer ─── */
                .footer { border-top: 1px solid rgba(0,0,0,0.06); padding: 44px 0 36px; background: rgba(255,255,255,0.97); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); position: relative; z-index: 2; }
                .footer__top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .footer__brand { font-weight: 600; font-size: 1rem; letter-spacing: -0.02em; color: #1d1d1f; }
                .footer__links { display: flex; gap: 28px; }
                .footer__links a { font-size: 0.82rem; font-weight: 400; color: #86868b; text-decoration: none; transition: color 0.2s; }
                .footer__links a:hover { color: #1d1d1f; }
                .footer__bottom p { font-size: 0.72rem; color: #86868b; }
                .footer__admin { display: flex; gap: 8px; margin-top: 12px; }
                .footer__admin input { padding: 8px 12px; border: 1px solid rgba(0,0,0,0.1); border-radius: 6px; font-size: 0.82rem; font-family: inherit; }
                .footer__admin button { padding: 8px 16px; background: #1d1d1f; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.82rem; font-weight: 500; }

                /* ─── Responsive ─── */
                @media (max-width: 1024px) {
                    .features-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 768px) {
                    .nav__links, .nav__cta { display: none; }
                    .container { padding: 0 24px; }
                    .nav__inner { padding: 0 24px; }
                    .hero__content { padding: 0 20px; }
                    .hero__h1 { font-size: 2.2rem; }
                    .hero__sub br { display: none; }
                    .section { padding: 80px 0; }
                    .steps-grid { grid-template-columns: repeat(2, 1fr); }
                    .metrics__grid { grid-template-columns: repeat(2, 1fr); gap: 28px 0; }
                    .metrics__item:not(:last-child) { border-right: none; }
                    .metrics__item:nth-child(odd) { border-right: 1px solid #eee; }

                    .features-grid { grid-template-columns: 1fr; }
                    .pricing-grid { grid-template-columns: 1fr; }
                    .wl-form__row { flex-direction: column; }
                    .hero__ctas { flex-direction: column; align-items: center; }
                    .footer__top { flex-direction: column; gap: 16px; text-align: center; }
                    .dept-legend { justify-content: center; }
                }
            `}</style>
        </div>
    )
}
