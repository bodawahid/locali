const CACHE = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 min
const CURRENCY_TTL = 60 * 60 * 1000; // 1 hour
const COMMUNITY_TTL = 3 * 60 * 1000; // 3 min (real-time)
const MAX_CACHE_SIZE = 50; // Prevent memory bloat

export function getCachedContext(key) {
    const entry = CACHE.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > entry.ttl) {
        CACHE.delete(key);
        return null;
    }
    return entry.data;
}

export function setCachedContext(key, data, ttl = DEFAULT_TTL) {
    // Simple LRU eviction
    if (CACHE.size >= MAX_CACHE_SIZE) {
        const firstKey = CACHE.keys().next().value;
        if (firstKey) CACHE.delete(firstKey);
    }
    CACHE.set(key, { data, ts: Date.now(), ttl });
}

export function cacheKey(city, queryHint = '') {
    return `${city || 'all'}:${queryHint.slice(0, 40)}`;
}

/** Race promise against timeout — returns fallback on slow API */
export async function withTimeout(promise, ms = 1500, fallback = '') {
    try {
        return await Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
        ]);
    } catch {
        return fallback;
    }
}

/** Preload default context for faster first message */
let preloadPromise = null;

export function preloadLokiContext(city = null) {
    if (!preloadPromise) {
        preloadPromise =
            import ('@/lib/loki/contextBuilder').then((m) =>
                m.buildLokiContext('', { city, fast: true })
            ).catch(() => null);
    }
    return preloadPromise;
}

export function clearContextCache() {
    CACHE.clear();
    preloadPromise = null;
}