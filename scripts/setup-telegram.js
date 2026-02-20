const fs = require('fs');
const envFile = fs.readFileSync('/Users/tammysantana/Downloads/wizard phase two/launch-fleet/launch-fleet/.env.local', 'utf-8');
envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
        process.env[trimmed.substring(0, eqIdx)] = trimmed.substring(eqIdx + 1);
    }
});

const AGENTS = [
    { id: 'scout', name: 'Scout — Market Intelligence', desc: 'Market research, competitor analysis, and profit potential for your app idea.', key: 'TELEGRAM_BOT_TOKEN_SCOUT' },
    { id: 'namer', name: 'Namer — Brand Crafter', desc: 'Creative app names with trademark, domain, and social handle verification.', key: 'TELEGRAM_BOT_TOKEN_NAMER' },
    { id: 'checker', name: 'Checker — Verification', desc: 'Trademark, domain, and social media handle verification specialist.', key: 'TELEGRAM_BOT_TOKEN_CHECKER' },
    { id: 'pixel', name: 'Pixel — Design Studio', desc: 'Brand identity, color palette, typography, and app icon design.', key: 'TELEGRAM_BOT_TOKEN_PIXEL' },
    { id: 'builder', name: 'Builder — Code Generation', desc: 'React Native/Expo app code generation and project scaffolding.', key: 'TELEGRAM_BOT_TOKEN_BUILDER' },
    { id: 'shipper', name: 'Shipper — App Store Prep', desc: 'App Store Connect metadata, compliance, and submission materials.', key: 'TELEGRAM_BOT_TOKEN_SHIPPER' },
    { id: 'buzz', name: 'Buzz — Marketing', desc: 'Launch strategy, landing pages, social media, and marketing plans.', key: 'TELEGRAM_BOT_TOKEN_BUZZ' },
];

const chatId = process.env.TELEGRAM_CHAT_ID;
console.log('Chat ID:', chatId);

async function setupBot(agent) {
    const token = process.env[agent.key];
    if (!token) {
        console.log(agent.id + ': NO TOKEN');
        return;
    }

    try {
        // Verify token
        const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const me = await meRes.json();
        if (!me.ok) {
            console.log(agent.id + ': INVALID TOKEN -', me.description);
            return;
        }
        console.log(agent.id + ': @' + me.result.username + ' (verified)');

        // Set bot name
        await fetch(`https://api.telegram.org/bot${token}/setMyName`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: agent.name }),
        });

        // Set description
        await fetch(`https://api.telegram.org/bot${token}/setMyDescription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: agent.desc }),
        });

        // Set short description
        await fetch(`https://api.telegram.org/bot${token}/setMyShortDescription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ short_description: 'LaunchFleet ' + agent.name }),
        });

        // Send intro message
        if (chatId) {
            const msgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `🤖 *${agent.name}* is online.\n\n${agent.desc}\n\n_Ready for commands._`,
                    parse_mode: 'Markdown',
                }),
            });
            const msg = await msgRes.json();
            console.log(agent.id + ': message sent =', msg.ok, msg.ok ? '' : msg.description || '');
        }
    } catch (e) {
        console.log(agent.id + ': ERROR -', e.message);
    }
}

(async () => {
    for (const a of AGENTS) {
        await setupBot(a);
    }
    console.log('\nDone! All agents configured.');
})();
