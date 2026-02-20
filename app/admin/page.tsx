'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight } from 'lucide-react'

export default function AdminSignIn() {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [checking, setChecking] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (localStorage.getItem('launchfleet_admin_access') === 'true') {
            router.replace('/admin/agents')
        } else {
            setChecking(false)
        }
    }, [router])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (code === '02051967') {
            localStorage.setItem('launchfleet_admin_access', 'true')
            router.push('/admin/agents')
        } else {
            setError('Invalid access code')
            setCode('')
            setTimeout(() => setError(''), 3000)
        }
    }

    if (checking) return null

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#000', fontFamily: 'var(--font)',
        }}>
            <div style={{
                width: 380, padding: 40, borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: 'rgba(0,122,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                }}>
                    <Lock size={24} color="#007AFF" />
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                    Admin Access
                </h1>
                <p style={{ fontSize: 14, color: '#666', marginBottom: 28, lineHeight: 1.5 }}>
                    Enter your access code to continue to the LaunchFleet admin dashboard.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={code}
                        onChange={e => { setCode(e.target.value); setError('') }}
                        placeholder="Access code"
                        autoFocus
                        style={{
                            width: '100%', padding: '14px 18px',
                            background: 'rgba(255,255,255,0.06)',
                            border: error ? '1px solid #FF3B30' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 10, fontSize: 15, color: '#fff',
                            outline: 'none', fontFamily: 'inherit',
                            transition: 'border-color 0.2s',
                            marginBottom: error ? 8 : 16,
                        }}
                        onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(0,122,255,0.5)' }}
                        onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    />
                    {error && (
                        <p style={{ fontSize: 13, color: '#FF3B30', marginBottom: 16, textAlign: 'left' }}>
                            {error}
                        </p>
                    )}
                    <button type="submit" style={{
                        width: '100%', padding: '14px 0',
                        background: '#007AFF', color: '#fff',
                        border: 'none', borderRadius: 10,
                        fontSize: 15, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontFamily: 'inherit',
                        transition: 'opacity 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        Sign In <ArrowRight size={16} />
                    </button>
                </form>

                <a href="/create" style={{
                    display: 'block', marginTop: 20,
                    fontSize: 13, color: '#666', textDecoration: 'none',
                }}>
                    ← Back to LaunchFleet
                </a>
            </div>
        </div>
    )
}
