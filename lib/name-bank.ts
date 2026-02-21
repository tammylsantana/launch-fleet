/**
 * Pre-vetted, brand-quality app name bank organized by industry
 * These are curated names designed to be memorable, brandable, and available
 * Each name follows top-app naming strategies: evocative, 1-2 words, easy to spell
 *
 * NAMING STRATEGY (inspired by top apps):
 * - Robinhood, Venmo, Stripe → evoke action or identity
 * - Calm, Headspace, Insight Timer → describe the feeling
 * - Duolingo, Babbel → combine word roots
 * - Notion, Linear, Arc → clean single words with depth
 * - Figma, Canva, Miro → invented words that feel natural
 */

export interface CuratedName {
    name: string
    tagline: string
    vibe: string
    why: string
}

export interface IndustryNames {
    category: string
    keywords: string[]
    names: CuratedName[]
}

export const CURATED_NAME_BANK: IndustryNames[] = [
    {
        category: 'Health & Fitness',
        keywords: ['health', 'fitness', 'workout', 'exercise', 'gym', 'training', 'body', 'weight', 'muscle', 'cardio', 'running', 'yoga', 'stretch', 'sports'],
        names: [
            { name: 'Vitality', tagline: 'Move better. Feel better.', vibe: 'premium', why: 'Evokes energy and life force' },
            { name: 'PulseForm', tagline: 'Shape your rhythm.', vibe: 'modern', why: 'Heartbeat + transformation' },
            { name: 'Zenith Fit', tagline: 'Reach your peak.', vibe: 'bold', why: 'Zenith = highest point' },
            { name: 'ArcMotion', tagline: 'Every rep counts.', vibe: 'sleek', why: 'Movement curves and progress' },
            { name: 'Kindra', tagline: 'Wellness, kindled.', vibe: 'warm', why: 'Kindle + kind — approachable' },
            { name: 'FlowState', tagline: 'Find your zone.', vibe: 'calm', why: 'Peak performance state' },
            { name: 'Elevate', tagline: 'Rise above.', vibe: 'aspirational', why: 'Upward movement metaphor' },
            { name: 'Grit', tagline: 'Tough workouts. Real results.', vibe: 'intense', why: 'Determination and strength' },
            { name: 'Ember', tagline: 'Ignite your body.', vibe: 'fiery', why: 'Glowing heat = sustained energy' },
            { name: 'Apex', tagline: 'Train at the top.', vibe: 'elite', why: 'The highest point of performance' },
            { name: 'Stride', tagline: 'One step ahead.', vibe: 'confident', why: 'Forward movement, running, confidence' },
            { name: 'Ironclad', tagline: 'Unbreakable strength.', vibe: 'powerful', why: 'Iron = strength, clad = armored' },
        ],
    },
    {
        category: 'Meditation & Wellness',
        keywords: ['meditation', 'meditate', 'mindfulness', 'breathing', 'breath', 'calm', 'relax', 'sleep', 'stress', 'anxiety', 'mental health', 'wellness', 'mood', 'journal', 'therapy', 'self-care'],
        names: [
            { name: 'Stillpoint', tagline: 'Peace starts here.', vibe: 'serene', why: 'The center of calm' },
            { name: 'Lumora', tagline: 'Light within.', vibe: 'ethereal', why: 'Lumen + aurora — beautiful' },
            { name: 'Breathwell', tagline: 'Inhale calm. Exhale stress.', vibe: 'clean', why: 'Clear breathing message' },
            { name: 'Equanim', tagline: 'Balance your mind.', vibe: 'premium', why: 'From equanimity' },
            { name: 'Solace', tagline: 'Your daily escape.', vibe: 'warm', why: 'Comfort in one word' },
            { name: 'Nimbus', tagline: 'Float above it all.', vibe: 'playful', why: 'Cloud = light, peaceful' },
            { name: 'Vesper', tagline: 'Evening peace.', vibe: 'elegant', why: 'Evening star — tranquil' },
            { name: 'Halcyon', tagline: 'Calm in the storm.', vibe: 'literary', why: 'Peaceful golden days' },
            { name: 'Sereno', tagline: 'Simply serene.', vibe: 'minimal', why: 'Italian/Spanish for serene' },
            { name: 'Zephyr', tagline: 'A gentle breeze.', vibe: 'airy', why: 'Soft west wind — gentle, natural' },
            { name: 'Oasis', tagline: 'Your mental retreat.', vibe: 'refreshing', why: 'Refuge in the desert' },
            { name: 'Dharma', tagline: 'Walk your path.', vibe: 'spiritual', why: 'Cosmic order, purpose' },
        ],
    },
    {
        category: 'Finance & Fintech',
        keywords: ['finance', 'money', 'budget', 'invest', 'investing', 'banking', 'savings', 'stock', 'crypto', 'trading', 'portfolio', 'expense', 'payment', 'wallet', 'tax'],
        names: [
            { name: 'Ledgr', tagline: 'Your money, organized.', vibe: 'modern', why: 'Ledger with modern spelling' },
            { name: 'Vaulted', tagline: 'Protect and grow.', vibe: 'trustworthy', why: 'Security + elevation' },
            { name: 'CashArc', tagline: 'Watch your money grow.', vibe: 'bold', why: 'Growth trajectory' },
            { name: 'Prosper', tagline: 'Financial freedom starts now.', vibe: 'premium', why: 'Direct promise' },
            { name: 'Coinwise', tagline: 'Smart money moves.', vibe: 'friendly', why: 'Wise with money' },
            { name: 'Sequoia', tagline: 'Build lasting wealth.', vibe: 'premium', why: 'Growth and longevity' },
            { name: 'Bullion', tagline: 'The gold standard.', vibe: 'luxurious', why: 'Gold bars = wealth' },
            { name: 'Tally', tagline: 'Count on it.', vibe: 'simple', why: 'Counting made easy' },
            { name: 'Accrux', tagline: 'Navigate your finances.', vibe: 'stellar', why: 'Star name = guidance' },
            { name: 'Greenleaf', tagline: 'Watch it grow.', vibe: 'organic', why: 'Money + natural growth' },
            { name: 'Denari', tagline: 'Ancient value. Modern money.', vibe: 'heritage', why: 'Roman coin — timeless' },
            { name: 'Fortify', tagline: 'Strengthen your future.', vibe: 'strong', why: 'Building financial defenses' },
        ],
    },
    {
        category: 'Productivity & Tasks',
        keywords: ['productivity', 'task', 'todo', 'organize', 'project', 'focus', 'time', 'planner', 'schedule', 'reminder', 'notes', 'workflow', 'management', 'efficiency'],
        names: [
            { name: 'Daybreak', tagline: 'Start every day right.', vibe: 'fresh', why: 'New day, new start' },
            { name: 'Forefront', tagline: 'Keep what matters first.', vibe: 'bold', why: 'Prioritization' },
            { name: 'Slate', tagline: 'Clean slate. Every day.', vibe: 'minimal', why: 'Minimalist, fresh' },
            { name: 'Momentum', tagline: 'Never stop moving.', vibe: 'energetic', why: 'Physics — keep going' },
            { name: 'Cadence', tagline: 'Find your rhythm.', vibe: 'premium', why: 'Musical flow' },
            { name: 'Pinnacle', tagline: 'Peak productivity.', vibe: 'ambitious', why: 'The highest point' },
            { name: 'Lucid', tagline: 'Crystal clear thinking.', vibe: 'sharp', why: 'Clarity of thought' },
            { name: 'Tempo', tagline: 'Set your pace.', vibe: 'rhythmic', why: 'Musical timing' },
            { name: 'Keystone', tagline: 'The habit that holds it all.', vibe: 'foundational', why: 'Critical piece' },
            { name: 'Dispatch', tagline: 'Send it. Done.', vibe: 'fast', why: 'Speed and execution' },
            { name: 'Meridiem', tagline: 'Own your AM and PM.', vibe: 'timely', why: 'From meridian — time' },
            { name: 'Catalyst', tagline: 'Spark action.', vibe: 'dynamic', why: 'Triggers change' },
        ],
    },
    {
        category: 'Education & Learning',
        keywords: ['education', 'learn', 'study', 'course', 'lesson', 'teach', 'student', 'school', 'quiz', 'tutor', 'knowledge', 'skill', 'language', 'training'],
        names: [
            { name: 'Eureka', tagline: 'Discover what you can do.', vibe: 'playful', why: 'Moment of discovery' },
            { name: 'Cognito', tagline: 'Think. Learn. Grow.', vibe: 'modern', why: 'From cognition' },
            { name: 'BrightPath', tagline: 'Your learning journey.', vibe: 'warm', why: 'Intelligence + direction' },
            { name: 'Quill', tagline: 'Write your future.', vibe: 'elegant', why: 'Classic writing tool' },
            { name: 'Prism', tagline: 'See from every angle.', vibe: 'innovative', why: 'Multiple perspectives' },
            { name: 'Synapse', tagline: 'Connect the dots.', vibe: 'scientific', why: 'Brain connections' },
            { name: 'Sage', tagline: 'Learn from the wise.', vibe: 'timeless', why: 'Wise teacher archetype' },
            { name: 'Lumen', tagline: 'Enlighten your mind.', vibe: 'bright', why: 'Unit of light = clarity' },
            { name: 'Acumen', tagline: 'Sharpen your edge.', vibe: 'professional', why: 'Keen insight' },
            { name: 'Thrive', tagline: 'Grow beyond limits.', vibe: 'positive', why: 'Flourishing and growth' },
            { name: 'Curio', tagline: 'Stay curious.', vibe: 'whimsical', why: 'Curiosity-driven learning' },
            { name: 'Lithos', tagline: 'Built on knowledge.', vibe: 'solid', why: 'Greek for stone — foundation' },
        ],
    },
    {
        category: 'Kids & Family',
        keywords: ['kids', 'children', 'family', 'parent', 'baby', 'toddler', 'child', 'preschool', 'parenting', 'mommy', 'daddy', 'nursery'],
        names: [
            { name: 'Sproutling', tagline: 'Watch them grow.', vibe: 'adorable', why: 'Sprout + little one' },
            { name: 'Wondernest', tagline: 'A safe place to explore.', vibe: 'warm', why: 'Wonder + safety' },
            { name: 'Tadpole', tagline: 'Small steps, big leaps.', vibe: 'playful', why: 'Transformation metaphor' },
            { name: 'Beehive', tagline: 'Busy little learners.', vibe: 'energetic', why: 'Productive and social' },
            { name: 'Storybloom', tagline: 'Let imagination blossom.', vibe: 'creative', why: 'Stories + growth' },
            { name: 'Kaleidoscope', tagline: 'A world of color.', vibe: 'vibrant', why: 'Playful and magical' },
            { name: 'Pebble', tagline: 'Little things matter.', vibe: 'gentle', why: 'Small, smooth, natural' },
            { name: 'Firefly', tagline: 'Shine bright.', vibe: 'magical', why: 'Light in the dark — wonder' },
            { name: 'Acorn', tagline: 'Mighty things grow small.', vibe: 'hopeful', why: 'Potential inside' },
            { name: 'Bubblecraft', tagline: 'Pop into fun.', vibe: 'bubbly', why: 'Playful and creative' },
            { name: 'Dandelion', tagline: 'Wish and grow.', vibe: 'dreamy', why: 'Making wishes — childhood' },
            { name: 'Cobblestone', tagline: 'Step by step.', vibe: 'storybook', why: 'Fairytale pathway' },
        ],
    },
    {
        category: 'Social & Communication',
        keywords: ['social', 'chat', 'message', 'community', 'friend', 'network', 'connect', 'share', 'post', 'dating', 'meetup', 'group', 'forum'],
        names: [
            { name: 'Kindred', tagline: 'Find your people.', vibe: 'warm', why: 'Kindred spirits — belonging' },
            { name: 'Chorus', tagline: 'Better together.', vibe: 'harmonious', why: 'Many voices as one' },
            { name: 'Gather', tagline: 'Come together.', vibe: 'friendly', why: 'Core social action' },
            { name: 'Ripple', tagline: 'Start a wave.', vibe: 'dynamic', why: 'Small actions, big impact' },
            { name: 'Haven', tagline: 'Your space. Your people.', vibe: 'safe', why: 'Trust and belonging' },
            { name: 'Mosaic', tagline: 'Every piece matters.', vibe: 'diverse', why: 'Beautiful diversity' },
            { name: 'Bonfire', tagline: 'Warm conversations.', vibe: 'cozy', why: 'People gathering around fire' },
            { name: 'Commune', tagline: 'Share freely.', vibe: 'open', why: 'Communication + community' },
            { name: 'Lantern', tagline: 'Light the way.', vibe: 'guiding', why: 'Illuminating connections' },
            { name: 'Agora', tagline: 'Your public square.', vibe: 'civic', why: 'Greek gathering place' },
            { name: 'Kinfolk', tagline: 'Your chosen family.', vibe: 'intimate', why: 'Close bonds' },
            { name: 'Thread', tagline: 'Stay connected.', vibe: 'clean', why: 'Weaving conversations' },
        ],
    },
    {
        category: 'Food & Cooking',
        keywords: ['food', 'cook', 'recipe', 'meal', 'restaurant', 'delivery', 'diet', 'nutrition', 'grocery', 'kitchen', 'chef', 'eating', 'dining'],
        names: [
            { name: 'Savorly', tagline: 'Taste every moment.', vibe: 'warm', why: 'Savoring food' },
            { name: 'Paprika', tagline: 'Spice up your kitchen.', vibe: 'vibrant', why: 'A real spice name' },
            { name: 'Simmer', tagline: 'Good food takes time.', vibe: 'calm', why: 'Cooking technique' },
            { name: 'Crumble', tagline: 'Deliciously simple.', vibe: 'playful', why: 'A dessert name' },
            { name: 'Harvest', tagline: 'Fresh. Local. Yours.', vibe: 'wholesome', why: 'Farm to table' },
            { name: 'Umami', tagline: 'Deeper flavor.', vibe: 'premium', why: 'The fifth taste' },
            { name: 'Morsel', tagline: 'Every bite counts.', vibe: 'delicate', why: 'Small and delightful' },
            { name: 'Truffle', tagline: 'Rare taste.', vibe: 'luxurious', why: 'Premium ingredient' },
            { name: 'Ember Grill', tagline: 'Fire-kissed flavor.', vibe: 'rustic', why: 'Live fire cooking' },
            { name: 'Pantry', tagline: 'Everything you need.', vibe: 'practical', why: 'Kitchen essential' },
            { name: 'Zest', tagline: 'Fresh every day.', vibe: 'bright', why: 'Citrus and enthusiasm' },
            { name: 'Marinate', tagline: 'Let it develop.', vibe: 'patient', why: 'Slow flavor development' },
        ],
    },
    {
        category: 'Shopping & E-commerce',
        keywords: ['shop', 'shopping', 'ecommerce', 'buy', 'sell', 'marketplace', 'store', 'retail', 'deal', 'discount', 'fashion', 'clothing', 'wardrobe'],
        names: [
            { name: 'Caravel', tagline: 'Discover new treasures.', vibe: 'adventurous', why: 'Explorer ships' },
            { name: 'Gilt', tagline: 'Premium finds.', vibe: 'luxurious', why: 'Gold-coated — exclusive' },
            { name: 'Bazaar', tagline: 'A world of finds.', vibe: 'eclectic', why: 'Global marketplace' },
            { name: 'Curate', tagline: 'Handpicked for you.', vibe: 'premium', why: 'Carefully selected' },
            { name: 'Haul', tagline: 'Score big every time.', vibe: 'energetic', why: 'Shopping haul culture' },
            { name: 'Atelier', tagline: 'Crafted with care.', vibe: 'artisan', why: 'French workshop' },
            { name: 'Trove', tagline: 'Hidden gems.', vibe: 'treasure', why: 'Treasure trove' },
            { name: 'Prêt', tagline: 'Ready for you.', vibe: 'fashion', why: 'Prêt-à-porter — ready to wear' },
            { name: 'Mercato', tagline: 'Your market.', vibe: 'european', why: 'Italian for market' },
            { name: 'Finesse', tagline: 'Style elevated.', vibe: 'refined', why: 'Elegance and skill' },
            { name: 'Verve', tagline: 'Shop with energy.', vibe: 'lively', why: 'Enthusiasm and spirit' },
            { name: 'Boutique', tagline: 'Small. Special. Yours.', vibe: 'intimate', why: 'Personal shopping' },
        ],
    },
    {
        category: 'AI & Creative Tools',
        keywords: ['ai', 'artificial intelligence', 'generate', 'create', 'design', 'image', 'art', 'write', 'writing', 'creative', 'automation', 'chatbot', 'assistant', 'gpt'],
        names: [
            { name: 'Cortex', tagline: 'Think bigger.', vibe: 'powerful', why: 'Brain cortex — intelligence' },
            { name: 'Muse', tagline: 'Inspiration on demand.', vibe: 'creative', why: 'Greek inspiration' },
            { name: 'Axiom', tagline: 'Start from truth.', vibe: 'scientific', why: 'Self-evident truth' },
            { name: 'Forge', tagline: 'Create anything.', vibe: 'powerful', why: 'Making through fire' },
            { name: 'Aether', tagline: 'Beyond imagination.', vibe: 'ethereal', why: 'The fifth element' },
            { name: 'Canvas', tagline: 'Your blank page.', vibe: 'clean', why: 'Starting point' },
            { name: 'Synthesis', tagline: 'Combine and create.', vibe: 'intellectual', why: 'Combining elements' },
            { name: 'Prismatic', tagline: 'Every angle, every color.', vibe: 'dazzling', why: 'Light through a prism' },
            { name: 'Nexus', tagline: 'Where ideas connect.', vibe: 'futuristic', why: 'Connection point' },
            { name: 'Artifex', tagline: 'The craft of creation.', vibe: 'artisan', why: 'Latin for craftsman' },
            { name: 'Alchemy', tagline: 'Transform anything.', vibe: 'magical', why: 'Magical transformation' },
            { name: 'Codex', tagline: 'Your creative library.', vibe: 'scholarly', why: 'Ancient manuscript' },
        ],
    },
    {
        category: 'Travel & Navigation',
        keywords: ['travel', 'trip', 'flight', 'hotel', 'booking', 'map', 'navigate', 'explore', 'vacation', 'adventure', 'destination', 'tourism', 'outdoor'],
        names: [
            { name: 'Wayfarer', tagline: 'Every journey matters.', vibe: 'adventurous', why: 'A traveler — romantic' },
            { name: 'Compass', tagline: 'Find your direction.', vibe: 'trustworthy', why: 'Navigation tool' },
            { name: 'Drift', tagline: 'Wander freely.', vibe: 'laid-back', why: 'Relaxed exploration' },
            { name: 'Meridian', tagline: 'Cross every line.', vibe: 'premium', why: 'Geographic sophistication' },
            { name: 'Roam', tagline: 'Go anywhere.', vibe: 'bold', why: 'One syllable, powerful' },
            { name: 'Atlas', tagline: 'Map your world.', vibe: 'classic', why: 'World maps + mythology' },
            { name: 'Horizon', tagline: 'What lies ahead.', vibe: 'aspirational', why: 'The edge of possibility' },
            { name: 'Nomad', tagline: 'Home is everywhere.', vibe: 'free-spirited', why: 'Wandering lifestyle' },
            { name: 'Venture', tagline: 'Take the leap.', vibe: 'bold', why: 'Daring to explore' },
            { name: 'Trailmark', tagline: 'Leave your mark.', vibe: 'outdoorsy', why: 'Blazing trails' },
            { name: 'Passage', tagline: 'Your next chapter.', vibe: 'literary', why: 'Journey + writing' },
            { name: 'Sextant', tagline: 'Navigate by stars.', vibe: 'nautical', why: 'Ancient navigation tool' },
        ],
    },
    {
        category: 'Legal & Professional',
        keywords: ['legal', 'law', 'lawyer', 'trademark', 'patent', 'contract', 'compliance', 'attorney', 'court', 'business', 'corporate', 'consulting', 'hr'],
        names: [
            { name: 'ClauseGuard', tagline: 'Protect every detail.', vibe: 'trustworthy', why: 'Legal precision' },
            { name: 'Verdict', tagline: 'Clarity in every case.', vibe: 'authoritative', why: 'Final judgment' },
            { name: 'Lexicon', tagline: 'Know the law.', vibe: 'intellectual', why: 'Dictionary of terms' },
            { name: 'Accord', tagline: 'Agreement made simple.', vibe: 'professional', why: 'Harmony + contracts' },
            { name: 'Citadel', tagline: 'Your legal fortress.', vibe: 'strong', why: 'Fortress protection' },
            { name: 'Arbiter', tagline: 'Fair and final.', vibe: 'neutral', why: 'Decision-maker' },
            { name: 'Statute', tagline: 'Stand on solid ground.', vibe: 'firm', why: 'Law itself' },
            { name: 'Quorum', tagline: 'Decisions that count.', vibe: 'civic', why: 'Minimum for decisions' },
            { name: 'Advocate', tagline: 'On your side.', vibe: 'supportive', why: 'Legal supporter' },
            { name: 'Edict', tagline: 'Authority spoken.', vibe: 'commanding', why: 'Official pronouncement' },
            { name: 'Paragon', tagline: 'The standard.', vibe: 'exemplary', why: 'Model of excellence' },
            { name: 'Tribunal', tagline: 'Justice served.', vibe: 'official', why: 'Court of judgment' },
        ],
    },
    {
        category: 'Music & Audio',
        keywords: ['music', 'song', 'audio', 'sound', 'podcast', 'radio', 'playlist', 'dj', 'beat', 'instrument', 'recording', 'listen', 'streaming'],
        names: [
            { name: 'Resonance', tagline: 'Feel every note.', vibe: 'deep', why: 'Sound that lingers' },
            { name: 'Cadenza', tagline: 'Your solo moment.', vibe: 'elegant', why: 'Musical solo term' },
            { name: 'Amplify', tagline: 'Turn it up.', vibe: 'bold', why: 'Making louder + impact' },
            { name: 'Treble', tagline: 'Crystal clear.', vibe: 'clean', why: 'High-frequency clarity' },
            { name: 'Octave', tagline: 'The full range.', vibe: 'complete', why: 'Musical completeness' },
            { name: 'Wavelength', tagline: 'On your frequency.', vibe: 'connected', why: 'Being in sync' },
            { name: 'Sonata', tagline: 'Your composition.', vibe: 'classical', why: 'Musical form' },
            { name: 'Reverb', tagline: 'Let it linger.', vibe: 'atmospheric', why: 'Sound echo effect' },
            { name: 'Riff', tagline: 'Play your tune.', vibe: 'casual', why: 'Musical phrase' },
            { name: 'Harmonic', tagline: 'In perfect tune.', vibe: 'balanced', why: 'Musical harmony' },
            { name: 'Encore', tagline: 'One more time.', vibe: 'exciting', why: 'Audience demands more' },
            { name: 'Crescendo', tagline: 'Build to the peak.', vibe: 'dramatic', why: 'Rising intensity' },
        ],
    },
]

/**
 * Match an app idea to the best industry category
 * Returns matching curated names sorted by relevance
 */
export function matchNamesToIdea(ideaText: string): CuratedName[] {
    const lower = ideaText.toLowerCase()

    // Score each category by keyword matches
    const scored = CURATED_NAME_BANK.map(industry => {
        const matchCount = industry.keywords.filter(kw => lower.includes(kw)).length
        return { ...industry, matchCount }
    })

    // Sort by most matching keywords
    scored.sort((a, b) => b.matchCount - a.matchCount)

    // If best match has keywords, use it; otherwise return mix from top categories
    if (scored[0].matchCount > 0) {
        // Return top category names, plus a few from second-best if available
        const primary = scored[0].names
        const secondary = scored[1]?.matchCount > 0 ? scored[1].names.slice(0, 3) : []
        return [...primary, ...secondary]
    }

    // No strong match — return a diverse mix from multiple categories
    return scored.flatMap(s => s.names.slice(0, 2)).slice(0, 12)
}

/**
 * Get total count of names in the bank
 */
export function getNameBankSize(): number {
    return CURATED_NAME_BANK.reduce((sum, industry) => sum + industry.names.length, 0)
}
