'use client'

const MOTTOS = [
    'Essential. Human. Inevitable.',
    'Simple. Human. Inevitable.',
    'People sense care.',
    'Is it essential? Is it human? Does it feel inevitable?',
    'Deciding what not to do is as important as deciding what to do.',
    'Technology disappears when it truly empowers.',
    '1,000 songs in your pocket — not 5GB storage.',
    'A great carpenter doesn\'t use lousy wood for the back of a cabinet.',
]

export default function JobsIveFooter() {
    // Pick a motto based on the current path to get a different one per page
    // Falls back to random on first render
    const getMottoIndex = () => {
        if (typeof window === 'undefined') return 0
        const path = window.location.pathname
        let hash = 0
        for (let i = 0; i < path.length; i++) {
            hash = ((hash << 5) - hash) + path.charCodeAt(i)
            hash |= 0
        }
        return Math.abs(hash) % MOTTOS.length
    }

    return (
        <footer
            style={{
                textAlign: 'center',
                padding: '24px 16px 32px',
                opacity: 0.4,
                fontSize: '13px',
                fontStyle: 'italic',
                letterSpacing: '0.02em',
                transition: 'opacity 0.3s ease',
                cursor: 'default',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4' }}
        >
            {MOTTOS[getMottoIndex()]}
        </footer>
    )
}
