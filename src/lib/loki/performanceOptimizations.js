/**
 * LOKI Performance & Caching Optimizations
 * Implements aggressive caching, request deduplication, and lazy loading
 */

const REQUEST_CACHE = new Map();
const INFLIGHT_REQUESTS = new Map();

export async function cachedRequest(key, fetchFn, ttl = 5 * 60 * 1000) {
    if (INFLIGHT_REQUESTS.has(key)) {
        return INFLIGHT_REQUESTS.get(key);
    }

    const cached = REQUEST_CACHE.get(key);
    if (cached && Date.now() - cached.ts < ttl) {
        return cached.data;
    }

    const promise = fetchFn();
    INFLIGHT_REQUESTS.set(key, promise);

    try {
        const result = await promise;
        REQUEST_CACHE.set(key, { data: result, ts: Date.now() });
        return result;
    } finally {
        INFLIGHT_REQUESTS.delete(key);
    }
}

export async function parallelDataFetch(requests) {
    return Promise.allSettled(requests);
}

export function compressContext(data) {
    const lines = data.split('\n').filter(Boolean);
    const unique = [...new Set(lines)];
    return unique.join('\n');
}

export function createLazyLoader(fetchFn) {
    let data = null;
    let loading = false;

    return async function load() {
        if (data) return data;
        if (loading) return new Promise((resolve) => setTimeout(resolve, 100));

        loading = true;
        try {
            data = await fetchFn();
            return data;
        } finally {
            loading = false;
        }
    };
}

export function getAdaptiveTimeout() {
    if (navigator.connection?.effectiveType) {
        const speed = navigator.connection.effectiveType;
        const timeouts = {
            '4g': 800,
            '3g': 1200,
            '2g': 2000,
            'slow-2g': 3000,
        };
        return timeouts[speed] || 1500;
    }
    return 1500;
}

export function clearAllCaches() {
    REQUEST_CACHE.clear();
    INFLIGHT_REQUESTS.clear();
}
