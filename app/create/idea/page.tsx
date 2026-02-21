'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Download, Send, Lightbulb, Tag, Palette, Wrench, Monitor, Globe, Store, Rocket, Check } from 'lucide-react'

interface Message {
    role: 'agent' | 'user'
    content: string
}

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

export default function IdeaPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'agent', content: 'Welcome to LaunchFleet. I\'m Scout, your market intelligence agent.\n\nTell me about your app idea — what does it do, who is it for, and what problem does it solve?\n\nI\'ll analyze the market opportunity, identify competitor weaknesses, and estimate your profit potential.' },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [ideaLocked, setIdeaLocked] = useState(false)
    const [marketReport, setMarketReport] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const startNewApp = () => {
        localStorage.removeItem('launchfleet_session')
        setMessages([
            { role: 'agent', content: 'Starting fresh! Tell me about your new app idea — what does it do, who is it for, and what problem does it solve?' },
        ])
        setInput('')
        setIdeaLocked(false)
        setMarketReport(null)
    }

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return
        const userMsg = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setIsLoading(true)

        // ALWAYS save/update the idea to session on first user message
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        const userMsgCount = messages.filter(m => m.role === 'user').length
        if (userMsgCount === 0) {
            // First message = the idea. Always overwrite.
            localStorage.setItem('launchfleet_session', JSON.stringify({
                idea: userMsg,
                ideaText: userMsg,
                stage: 'idea',
            }))
        }

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stage: 'idea',
                    messages: [...messages, { role: 'user', content: userMsg }],
                }),
            })
            const data = await res.json()

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'agent', content: data.reply }])
            }
            if (data.marketReport) {
                setMarketReport(data.marketReport)
            }
            // Always update session with latest data from the API
            const updatedSession = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            localStorage.setItem('launchfleet_session', JSON.stringify({
                ...updatedSession,
                ...(data.sessionData || {}),
                idea: updatedSession.idea || userMsg,
                ideaText: updatedSession.ideaText || userMsg,
                stage: 'idea',
                ideaComplete: data.ideaComplete || false,
            }))
            if (data.ideaComplete) {
                setIdeaLocked(true)
            }
        } catch {
            setMessages(prev => [...prev, { role: 'agent', content: 'Something went wrong. Please try again.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Top bar with stage nav */}
            <header style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--separator)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <Link href="/create" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: 'var(--fs-h3)' }}>
                        LaunchFleet
                    </Link>
                    <button onClick={startNewApp} className="btn btn-ghost btn-sm" style={{ fontSize: '12px' }}>
                        ✦ New App
                    </button>
                </div>
                <div className="stage-nav" style={{ borderBottom: 'none', padding: 0 }}>
                    {STAGES.map((s, i) => (
                        <Link key={s.id} href={s.path} className={`stage-pill ${s.id === 'idea' ? 'active' : ''}`}>
                            <span className="stage-num">{i + 1}</span>
                            {s.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
                {/* Chat panel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: marketReport ? '1px solid var(--separator)' : 'none' }}>
                    <div style={{ padding: 'var(--space-lg) var(--space-lg) 0' }}>
                        <div className="caption" style={{ marginBottom: 'var(--space-xs)' }}>Stage 1</div>
                        <h2>Idea and Market Intelligence</h2>
                        <p className="subhead" style={{ marginTop: 'var(--space-xs)' }}>
                            Describe your app concept. Scout will analyze the market opportunity.
                        </p>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`chat-bubble ${msg.role}`} style={{ whiteSpace: 'pre-wrap' }}>
                                    {msg.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="chat-typing" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', alignSelf: 'flex-start' }}>
                                    <span /><span /><span />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input */}
                    {!ideaLocked ? (
                        <div style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--separator)' }}>
                            <form onSubmit={e => { e.preventDefault(); sendMessage() }} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-end' }}>
                                <textarea
                                    className="input"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                                    placeholder="Describe your app idea..."
                                    disabled={isLoading}
                                    rows={3}
                                    style={{ resize: 'none', lineHeight: '1.5', border: '1.5px solid #ccc', borderRadius: '12px', padding: '12px 16px', fontSize: '15px' }}
                                />
                                <button type="submit" className="btn btn-primary" disabled={isLoading || !input.trim()} style={{ minHeight: '72px' }}>
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--separator)', textAlign: 'center' }}>
                            <Link href="/create/name" className="btn btn-primary btn-lg">
                                Continue to Name <ChevronRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Market report panel */}
                {marketReport && (
                    <div style={{ width: 420, overflowY: 'auto', padding: 'var(--space-lg)', background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                            <h3>Market Gap Report</h3>
                            <button className="btn btn-ghost btn-sm">
                                <Download size={14} /> PDF
                            </button>
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap', fontSize: 'var(--fs-subhead)', lineHeight: 1.6 }}>
                            {marketReport}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
