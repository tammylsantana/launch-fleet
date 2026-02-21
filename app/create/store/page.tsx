'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, Lightbulb, Tag, Palette, Wrench, Monitor, Globe, Store, Rocket, Save } from 'lucide-react'

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

const COMPLETED = ['idea', 'name', 'brand', 'build', 'present', 'landing']

/* ── Every App Store Connect field, organized by tab ── */
const STORE_TABS = [
    { id: 'general', label: 'General' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'age-rating', label: 'Age Rating' },
    { id: 'ai-transparency', label: 'AI Transparency' },
    { id: 'export', label: 'Export Compliance' },
    { id: 'review', label: 'App Review' },
]

const GENERAL_FIELDS = [
    { id: 'appName', label: 'App Name', type: 'text', maxLength: 30, hint: 'Your app name as it appears on the App Store.', required: true },
    { id: 'subtitle', label: 'Subtitle', type: 'text', maxLength: 30, hint: 'Brief summary shown below your app name.' },
    { id: 'primaryCategory', label: 'Primary Category', type: 'select', options: ['Books', 'Business', 'Developer Tools', 'Education', 'Entertainment', 'Finance', 'Food & Drink', 'Games', 'Graphics & Design', 'Health & Fitness', 'Lifestyle', 'Medical', 'Music', 'Navigation', 'News', 'Photo & Video', 'Productivity', 'Reference', 'Shopping', 'Social Networking', 'Sports', 'Travel', 'Utilities', 'Weather'], required: true },
    { id: 'secondaryCategory', label: 'Secondary Category', type: 'select', options: ['None', 'Books', 'Business', 'Developer Tools', 'Education', 'Entertainment', 'Finance', 'Food & Drink', 'Games', 'Graphics & Design', 'Health & Fitness', 'Lifestyle', 'Medical', 'Music', 'Navigation', 'News', 'Photo & Video', 'Productivity', 'Reference', 'Shopping', 'Social Networking', 'Sports', 'Travel', 'Utilities', 'Weather'] },
    { id: 'description', label: 'Description', type: 'textarea', maxLength: 4000, hint: 'Detailed description of your app. Up to 4000 characters.', required: true },
    { id: 'keywords', label: 'Keywords', type: 'text', maxLength: 100, hint: 'Comma-separated. 100 characters max.', required: true },
    { id: 'supportUrl', label: 'Support URL', type: 'text', hint: 'Required by Apple for all apps.', required: true },
    { id: 'marketingUrl', label: 'Marketing URL', type: 'text', hint: 'Link to your app\'s marketing page.' },
    { id: 'promotionalText', label: 'Promotional Text', type: 'textarea', maxLength: 170, hint: 'Appears above your description. Can be changed without a new submission.' },
    { id: 'whatsNew', label: 'What\'s New', type: 'textarea', maxLength: 4000, hint: 'Release notes shown to users updating your app.', required: true },
    { id: 'bundleId', label: 'Bundle ID', type: 'text', hint: 'e.g. com.yourcompany.appname', required: true },
    { id: 'sku', label: 'SKU', type: 'text', hint: 'Unique identifier for your app. Not visible to users.', required: true },
    { id: 'contentRights', label: 'Content Rights', type: 'select', options: ['Does not contain third-party content', 'Contains third-party content with rights'], required: true },
    { id: 'copyrightHolder', label: 'Copyright', type: 'text', hint: 'e.g. 2025 Your Company Name', required: true },
]

const PRICING_FIELDS = [
    { id: 'price', label: 'Price', type: 'select', options: ['Free', '$0.99', '$1.99', '$2.99', '$3.99', '$4.99', '$5.99', '$6.99', '$7.99', '$8.99', '$9.99', '$14.99', '$19.99', '$24.99', '$29.99', '$39.99', '$49.99', '$69.99', '$79.99', '$99.99'], required: true },
    { id: 'availability', label: 'Availability', type: 'select', options: ['All territories', 'Select territories'], required: true },
    { id: 'preOrder', label: 'Pre-Order', type: 'select', options: ['No', 'Yes'] },
    { id: 'preOrderDate', label: 'Pre-Order Release Date', type: 'text', hint: 'Only if pre-order is Yes.' },
    { id: 'iap', label: 'In-App Purchases', type: 'select', options: ['None', 'Consumable', 'Non-Consumable', 'Auto-Renewable Subscription', 'Non-Renewing Subscription'], required: true },
    { id: 'iapNote', label: 'IAP Review Notes', type: 'textarea', hint: 'Instructions for the reviewer to test in-app purchases.' },
]

const PRIVACY_FIELDS = [
    { id: 'privacyUrl', label: 'Privacy Policy URL', type: 'text', hint: 'Apple requires this for all apps.', required: true },
    { id: 'dataCollection', label: 'Data Collection', type: 'select', options: ['App does not collect any data', 'App collects data'], required: true },
    { id: 'dataTypes', label: 'Data Types Collected', type: 'textarea', hint: 'If applicable: Contact info, Health, Financial info, Location, Identifiers, etc.' },
    { id: 'dataLinked', label: 'Data Linked to User', type: 'select', options: ['No', 'Yes'], required: true },
    { id: 'trackingEnabled', label: 'App Tracking Transparency', type: 'select', options: ['No tracking', 'Uses ATT framework'], required: true },
    { id: 'thirdPartySDKs', label: 'Third-Party SDKs', type: 'textarea', hint: 'List all third-party SDKs and the data they access.' },
    { id: 'privacyManifest', label: 'Privacy Manifest (PrivacyInfo.xcprivacy)', type: 'select', options: ['Included in build', 'Not applicable'], required: true },
    { id: 'requiredReasonAPIs', label: 'Required Reason APIs', type: 'textarea', hint: 'UserDefaults, File timestamp, System boot time, Disk space — declare usage reasons.', required: true },
]

const AGE_RATING_FIELDS = [
    { id: 'violenceCartoon', label: 'Cartoon or Fantasy Violence', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'violenceRealistic', label: 'Realistic Violence', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'sexualContent', label: 'Sexual Content and Nudity', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'profanity', label: 'Profanity or Crude Humor', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'drugs', label: 'Alcohol, Tobacco, or Drug Use', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'matureThemes', label: 'Mature/Suggestive Themes', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'gambling', label: 'Simulated Gambling', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'horror', label: 'Horror/Fear Themes', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'medicalInfo', label: 'Medical/Treatment Information', type: 'select', options: ['None', 'Infrequent/Mild', 'Frequent/Intense'] },
    { id: 'contestAndBets', label: 'Contests and Real-Money Bets', type: 'select', options: ['No', 'Yes'] },
    { id: 'unrestrictedWeb', label: 'Unrestricted Web Access', type: 'select', options: ['No', 'Yes'] },
    { id: 'ageTier', label: 'Age Rating Tier (2025)', type: 'select', options: ['4+', '9+', '12+', '17+'], hint: 'New tiered system as of 2025.', required: true },
]

const AI_TRANSPARENCY_FIELDS = [
    { id: 'usesGenAI', label: 'Uses Generative AI', type: 'select', options: ['No', 'Yes'], hint: 'Does your app generate text, images, audio, or video via AI?' },
    { id: 'aiDisclosure', label: 'AI Feature Description', type: 'textarea', hint: 'Describe how AI is used in your app.' },
    { id: 'aiLabeling', label: 'AI Content Labeling', type: 'select', options: ['AI content is clearly labeled', 'AI content is not labeled', 'N/A'] },
    { id: 'aiModeration', label: 'AI Content Moderation', type: 'select', options: ['Moderated', 'Unmoderated', 'N/A'], hint: 'Is AI-generated content moderated before display?' },
    { id: 'aiDataSources', label: 'AI Training Data Sources', type: 'textarea', hint: 'Describe the data used to train AI features, if applicable.' },
    { id: 'deepfakeProtection', label: 'Deepfake Protection', type: 'select', options: ['Measures in place', 'Not applicable'], hint: 'If your app can generate images of people.' },
]

const EXPORT_FIELDS = [
    { id: 'usesEncryption', label: 'Uses Encryption', type: 'select', options: ['No', 'Yes — Standard HTTPS only', 'Yes — Proprietary encryption'], required: true },
    { id: 'encryptionExempt', label: 'Exempt from EAR', type: 'select', options: ['Yes', 'No'], required: true },
    { id: 'frenchEncryption', label: 'French Encryption Declaration', type: 'select', options: ['Not required', 'Declaration filed'] },
]

const REVIEW_FIELDS = [
    { id: 'reviewNotes', label: 'Review Notes', type: 'textarea', hint: 'Instructions for the App Store reviewer. Include login credentials if needed.' },
    { id: 'demoUser', label: 'Demo Account Username', type: 'text' },
    { id: 'demoPass', label: 'Demo Account Password', type: 'text' },
    { id: 'contactFirst', label: 'Contact First Name', type: 'text', required: true },
    { id: 'contactLast', label: 'Contact Last Name', type: 'text', required: true },
    { id: 'contactPhone', label: 'Contact Phone', type: 'text', required: true },
    { id: 'contactEmail', label: 'Contact Email', type: 'text', required: true },
    { id: 'attachments', label: 'Attachments / Notes', type: 'textarea', hint: 'Additional information for the reviewer.' },
]

const ALL_FIELDS: Record<string, Array<{ id: string; label: string; type: string; maxLength?: number; hint?: string; options?: string[]; required?: boolean }>> = {
    general: GENERAL_FIELDS,
    pricing: PRICING_FIELDS,
    privacy: PRIVACY_FIELDS,
    'age-rating': AGE_RATING_FIELDS,
    'ai-transparency': AI_TRANSPARENCY_FIELDS,
    export: EXPORT_FIELDS,
    review: REVIEW_FIELDS,
}

export default function StorePage() {
    const [activeTab, setActiveTab] = useState('general')
    const [formData, setFormData] = useState<Record<string, string>>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('launchfleet_store_form')
            if (stored) return JSON.parse(stored)
        }
        return {}
    })
    const [isAutoFilling, setIsAutoFilling] = useState(false)
    const [confirmed, setConfirmed] = useState(false)

    const autoFill = async () => {
        setIsAutoFilling(true)
        try {
            const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
            const res = await fetch('/api/store-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session }),
            })
            const data = await res.json()
            if (data.fields) setFormData(prev => ({ ...prev, ...data.fields }))
        } catch {
            // Fallback handled by useEffect pre-fill
        } finally {
            setIsAutoFilling(false)
        }
    }

    // Auto-fill all deterministic fields from session on mount
    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        const name = session.appName || session.selectedName || ''
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const idea = session.ideaText || session.idea || ''
        const year = new Date().getFullYear()

        const preFilled: Record<string, string> = {}

        // General
        if (name) preFilled.appName = name
        if (idea) preFilled.subtitle = idea.length > 30 ? idea.slice(0, 27) + '...' : idea
        if (slug) preFilled.bundleId = `com.launchfleet.${slug}`
        if (slug) preFilled.sku = `LF-${slug}-${year}`
        preFilled.copyrightHolder = `${year} LaunchFleet`
        if (session.deployUrl) {
            preFilled.supportUrl = session.deployUrl
            preFilled.marketingUrl = session.deployUrl
        }
        preFilled.contentRights = 'Does not contain third-party content'
        if (idea) preFilled.whatsNew = 'Initial release.'

        // Pricing defaults
        preFilled.price = 'Free'
        preFilled.availability = 'All territories'
        preFilled.preOrder = 'No'
        preFilled.iap = 'None'

        // Privacy defaults
        preFilled.dataCollection = 'App does not collect any data'
        preFilled.dataLinked = 'No'
        preFilled.trackingEnabled = 'No tracking'
        preFilled.privacyManifest = 'Included in build'

        // Age Rating defaults (all None/No)
        preFilled.violenceCartoon = 'None'
        preFilled.violenceRealistic = 'None'
        preFilled.sexualContent = 'None'
        preFilled.profanity = 'None'
        preFilled.drugs = 'None'
        preFilled.matureThemes = 'None'
        preFilled.gambling = 'None'
        preFilled.horror = 'None'
        preFilled.medicalInfo = 'None'
        preFilled.contestAndBets = 'No'
        preFilled.unrestrictedWeb = 'No'
        preFilled.ageTier = '4+'

        // AI Transparency defaults
        preFilled.usesGenAI = 'No'
        preFilled.aiLabeling = 'N/A'
        preFilled.aiModeration = 'N/A'
        preFilled.deepfakeProtection = 'Not applicable'

        // Export compliance defaults
        preFilled.usesEncryption = 'Yes — Standard HTTPS only'
        preFilled.encryptionExempt = 'Yes'
        preFilled.frenchEncryption = 'Not required'

        // Review contact — pre-fill from session if available
        if (session.contactEmail) preFilled.contactEmail = session.contactEmail
        if (session.contactName) {
            const parts = session.contactName.split(' ')
            preFilled.contactFirst = parts[0] || ''
            preFilled.contactLast = parts.slice(1).join(' ') || ''
        }

        // Only pre-fill fields that aren't already set
        setFormData(prev => {
            const merged = { ...preFilled }
            Object.entries(prev).forEach(([k, v]) => {
                if (v) merged[k] = v
            })
            localStorage.setItem('launchfleet_store_form', JSON.stringify(merged))
            return merged
        })
    }, [])

    const updateField = (id: string, value: string) => {
        setFormData(prev => {
            const next = { ...prev, [id]: value }
            localStorage.setItem('launchfleet_store_form', JSON.stringify(next))
            return next
        })
    }

    const confirmStore = () => {
        const session = JSON.parse(localStorage.getItem('launchfleet_session') || '{}')
        localStorage.setItem('launchfleet_session', JSON.stringify({
            ...session, stage: 'store', storeComplete: true, storeData: formData,
        }))
        setConfirmed(true)
    }

    const currentFields = ALL_FIELDS[activeTab] || []

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
                        <Link key={s.id} href={s.path} className={`stage-pill ${s.id === 'store' ? 'active' : COMPLETED.includes(s.id) ? 'completed' : ''}`}>
                            <span className="stage-num">{COMPLETED.includes(s.id) ? <Check size={12} /> : i + 1}</span>
                            {s.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
                    <div className="page-header" style={{ padding: 0 }}>
                        <div className="caption" style={{ marginBottom: 'var(--space-xs)' }}>Stage 7</div>
                        <h1>App Store Connect</h1>
                        <p className="subhead">
                            Every field required for submission. AI pre-fills based on your app details.
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={autoFill} disabled={isAutoFilling}>
                        {isAutoFilling ? 'Pre-filling...' : 'AI Auto-Fill'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="tabs" style={{ marginBottom: 'var(--space-xl)' }}>
                    {STORE_TABS.map(tab => (
                        <button key={tab.id} className={`tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: 700 }}>
                    {currentFields.map(field => (
                        <div key={field.id} className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="form-label">
                                    {field.label}
                                    {field.required && <span style={{ color: '#FF3B30', marginLeft: 4, fontWeight: 700 }}>*</span>}
                                </label>
                                {field.maxLength && (
                                    <span className={`char-count ${(formData[field.id]?.length || 0) > field.maxLength ? 'over' : (formData[field.id]?.length || 0) > field.maxLength * 0.9 ? 'warn' : ''}`}>
                                        {formData[field.id]?.length || 0}/{field.maxLength}
                                    </span>
                                )}
                            </div>
                            {field.type === 'text' && (
                                <input
                                    className="input"
                                    value={formData[field.id] || ''}
                                    onChange={e => updateField(field.id, e.target.value)}
                                    maxLength={field.maxLength}
                                />
                            )}
                            {field.type === 'textarea' && (
                                <textarea
                                    className="input textarea"
                                    value={formData[field.id] || ''}
                                    onChange={e => updateField(field.id, e.target.value)}
                                    maxLength={field.maxLength}
                                    rows={4}
                                />
                            )}
                            {field.type === 'select' && (
                                <select
                                    className="input select"
                                    value={formData[field.id] || ''}
                                    onChange={e => updateField(field.id, e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}
                            {field.hint && <p className="form-hint">{field.hint}</p>}
                        </div>
                    ))}
                </div>

                {/* Confirm */}
                <div style={{ marginTop: 'var(--space-3xl)', textAlign: 'center' }}>
                    {!confirmed ? (
                        <button className="btn btn-primary btn-lg" onClick={confirmStore}>
                            <Check size={18} /> Confirm Store Listing <ChevronRight size={18} />
                        </button>
                    ) : (
                        <>
                            <span className="badge badge-success" style={{ fontSize: 'var(--fs-subhead)', padding: '8px 20px', display: 'inline-flex' }}>
                                <Check size={16} /> Store listing confirmed
                            </span>
                            <br />
                            <Link href="/create/submit" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }}>
                                Continue to Submit <ChevronRight size={18} />
                            </Link>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
