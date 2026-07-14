const express = require('express');
const { getTelegramConfig } = require('../services/telegram');
const { fetchCurrencyRates, fetchRedditInsights, fetchPlaces } = require('../services/freeApis');
const { grokChatStream, getCacheStats } = require('../services/grok');

const router = express.Router();

function buildServerPrompt(contextBlock = '', intent = 'general') {
  const urgentFormat = intent === 'urgent' || intent === 'safety';

  return `You are LOKI, an Egypt tourism assistant for Locali.

Scope: Egypt tourism only. If the user asks anything outside travel, places, hotels, restaurants, transport, scams, prices, visas, maps, or tourist safety, politely refuse.

Style:
- Natural Arabic/English depending on user.
- Short, helpful, practical.
- If urgent/safety: answer clearly first, then details.

Rules:
- Never invent prices.
- Prefer community-verified and free public sources.
- Always mention maps links for places, menus when available, and source counts when possible.
- End with a concise sources block.

${contextBlock ? `LIVE DATA:\n${contextBlock}` : ''}`;
}

/** LOKI context metadata */
router.get('/context-status', (req, res) => {
    res.json({
        loki: 'active',
        mode: 'tourism-only',
        dataSources: [
            'locali_scam_reports', 'locali_prices', 'locali_currency',
            'numbeo_scraper', 'frankfurter_currency', 'reddit_json',
            'nominatim_osm', 'telegram_links', 'facebook_links', 'community_intel',
        ],
        freeApis: {
            currency: 'Frankfurter.app (ECB)',
            places: 'OpenStreetMap Nominatim',
            reddit: 'Reddit JSON search',
            numbeo: 'Numbeo scraper (backend)',
        },
        telegram: getTelegramConfig(),
        cache: getCacheStats(),
    });
});

/** Free currency rates — Frankfurter/ECB */
router.get('/currency', async (req, res) => {
    try {
        const result = await fetchCurrencyRates();
        res.json(result);
    } catch (err) {
        console.error('[loki/currency]', err);
        res.status(500).json({ error: 'currency fetch failed' });
    }
});

/** Reddit travel insights */
router.get('/reddit', async (req, res) => {
    const { q = '', city = '' } = req.query;
    try {
        const result = await fetchRedditInsights(q, city);
        res.json(result);
    } catch (err) {
        console.error('[loki/reddit]', err);
        res.status(500).json({ error: 'reddit fetch failed' });
    }
});

/** OSM place search */
router.get('/places', async (req, res) => {
    const { q = '', city = '' } = req.query;
    try {
        const result = await fetchPlaces(q, city);
        res.json(result);
    } catch (err) {
        console.error('[loki/places]', err);
        res.status(500).json({ error: 'places fetch failed' });
    }
});

/** Grok chat proxy with streaming */
router.post('/chat', async (req, res) => {
    try {
        const { message = '', contextBlock = '', intent = 'general', history = [] } = req.body || {};

        if (!message.trim()) {
            return res.status(400).json({ error: 'message is required' });
        }

        res.status(200);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Accel-Buffering', 'no');

        const systemPrompt = buildServerPrompt(contextBlock, intent);
        const messages = [
            { role: 'system', content: systemPrompt },
            ...Array.isArray(history) ? history : [],
            { role: 'user', content: message },
        ].filter((m) => m && m.content);

        let streamed = '';
        await grokChatStream(
            messages,
            {
                model: process.env.XAI_MODEL || 'grok-2-latest',
                temperature: parseFloat(process.env.LOKI_TEMPERATURE || '0.3'),
                maxTokens: parseInt(process.env.LOKI_MAX_TOKENS || '900', 10),
            },
            (chunk) => {
                streamed += chunk;
                res.write(chunk);
            }
        );

        res.end();
    } catch (err) {
        console.error('[loki/chat]', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message || 'chat failed' });
        } else {
            res.end('\n[error] chat failed');
        }
    }
});

module.exports = router;
