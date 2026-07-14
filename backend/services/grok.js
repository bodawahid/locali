/**
 * xAI Grok API — server-side only (never expose key to frontend).
 * OpenAI-compatible chat completions with streaming + response cache.
 */

const XAI_API = 'https://api.x.ai/v1/chat/completions';
const DEFAULT_MODEL = process.env.XAI_MODEL || 'grok-2-latest';

const RESPONSE_CACHE = new Map();
const RESPONSE_TTL = parseInt(process.env.LOKI_RESPONSE_CACHE_TTL || '600000', 10); // 10 min
const MAX_CACHE = 200;

function cacheKey(messages) {
    const last = messages.filter((m) => m.role === 'user').pop();
    return (last ? .content || '').toLowerCase().trim().slice(0, 120);
}

function getCached(key) {
    const entry = RESPONSE_CACHE.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > RESPONSE_TTL) {
        RESPONSE_CACHE.delete(key);
        return null;
    }
    return entry;
}

function setCache(key, content) {
    if (RESPONSE_CACHE.size >= MAX_CACHE) {
        const first = RESPONSE_CACHE.keys().next().value;
        if (first) RESPONSE_CACHE.delete(first);
    }
    RESPONSE_CACHE.set(key, { content, ts: Date.now() });
}

async function grokChat(messages, options = {}) {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) throw new Error('XAI_API_KEY not configured');

    const key = cacheKey(messages);
    if (!options.skipCache) {
        const cached = getCached(key);
        if (cached) return { content: cached.content, cached: true };
    }

    const res = await fetch(XAI_API, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: options.model || DEFAULT_MODEL,
            messages,
            temperature: options.temperature ? ? 0.3,
            max_tokens: options.maxTokens ? ? 900,
            stream: false,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Grok API ${res.status}: ${err.slice(0, 200)}`);
    }

    const data = await res.json();
    const content = data.choices ? .[0] ? .message ? .content || '';
    if (content) setCache(key, content);
    return { content, cached: false };
}

async function grokChatStream(messages, options = {}, onChunk) {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) throw new Error('XAI_API_KEY not configured');

    const key = cacheKey(messages);
    if (!options.skipCache) {
        const cached = getCached(key);
        if (cached) {
            if (onChunk) onChunk(cached.content, true);
            return { content: cached.content, cached: true };
        }
    }

    const res = await fetch(XAI_API, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: options.model || DEFAULT_MODEL,
            messages,
            temperature: options.temperature ? ? 0.3,
            max_tokens: options.maxTokens ? ? 900,
            stream: true,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Grok API ${res.status}: ${err.slice(0, 200)}`);
    }

    let full = '';
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (payload === '[DONE]') continue;
            try {
                const parsed = JSON.parse(payload);
                const delta = parsed.choices ? .[0] ? .delta ? .content || '';
                if (delta) {
                    full += delta;
                    if (onChunk) onChunk(delta, false);
                }
            } catch {
                /* skip malformed SSE */
            }
        }
    }

    if (full) setCache(key, full);
    return { content: full, cached: false };
}

function getCacheStats() {
    return { size: RESPONSE_CACHE.size, ttlMs: RESPONSE_TTL };
}

module.exports = { grokChat, grokChatStream, getCacheStats };