/**
 * Client service for LOKI free APIs (proxied via backend to avoid CORS).
 */

const API_BASE = '/api/loki';

async function lokiFetch(path, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = `${API_BASE}${path}${qs ? `?${qs}` : ''}`;
    try {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function fetchFreeCurrency() {
    const data = await lokiFetch('/currency');
    return data?.text || '';
}

export async function fetchRedditContext(query, city) {
    const data = await lokiFetch('/reddit', { q: query?.slice(0, 100) || '', city: city || '' });
    return data?.text || '';
}

export async function fetchPlacesContext(query, city) {
    const data = await lokiFetch('/places', { q: query?.slice(0, 80) || '', city: city || '' });
    return data?.text || '';
}
