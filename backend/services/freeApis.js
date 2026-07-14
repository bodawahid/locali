/**
 * Free API integrations for LOKI — no API keys required.
 * Frankfurter (currency), Reddit JSON, Nominatim/OSM (places).
 */

const FRANKFURTER = 'https://api.frankfurter.app/latest';
const REDDIT_SEARCH = 'https://www.reddit.com/search.json';
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

const UA = 'Locali-LOKI/1.0 (Egypt tourism assistant; contact: locali.app)';

async function fetchJson(url, opts = {}) {
    const res = await fetch(url, {
        ...opts,
        headers: { 'User-Agent': UA, Accept: 'application/json', ...opts.headers },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

/** Free EGP exchange rates via Frankfurter (ECB data) */
async function fetchCurrencyRates() {
    try {
        const data = await fetchJson(`${FRANKFURTER}?from=EGP&to=USD,EUR,GBP,SAR,AED`);
        const rates = data.rates || {};
        const usd = rates.USD ? (1 / rates.USD).toFixed(2) : null;
        const eur = rates.EUR ? (1 / rates.EUR).toFixed(2) : null;
        const gbp = rates.GBP ? (1 / rates.GBP).toFixed(2) : null;
        const sar = rates.SAR ? (1 / rates.SAR).toFixed(2) : null;
        const aed = rates.AED ? (1 / rates.AED).toFixed(2) : null;
        return {
            source: 'Frankfurter.app (ECB)',
            sourceUrl: 'https://www.frankfurter.app',
            date: data.date,
            rates: { usd, eur, gbp, sar, aed },
            text: `CURRENCY (Frankfurter/ECB, ${data.date}): 1 USD ≈ ${usd} EGP | 1 EUR ≈ ${eur} EGP | 1 GBP ≈ ${gbp} EGP | 1 SAR ≈ ${sar} EGP`,
        };
    } catch (err) {
        console.error('[freeApis] currency error', err.message);
        return { text: '', rates: null };
    }
}

/** Reddit search — free JSON endpoint (rate-limited) */
async function fetchRedditInsights(query, city = '') {
    const q = [query, city, 'egypt travel'].filter(Boolean).join(' ').trim();
    if (!q) return { text: '', posts: [] };
    try {
        const params = new URLSearchParams({
            q: q.slice(0, 120),
            sort: 'relevance',
            limit: '5',
            t: 'year',
        });
        const data = await fetchJson(`${REDDIT_SEARCH}?${params}`);
        const posts = (data?.data?.children || [])
            .map((c) => c.data)
            .filter((p) => p && !p.over_18)
            .slice(0, 4)
            .map((p) => ({
                title: p.title,
                subreddit: p.subreddit,
                score: p.score,
                url: `https://reddit.com${p.permalink}`,
                snippet: (p.selftext || '').slice(0, 200),
            }));
        if (!posts.length) return { text: '', posts: [] };
        const lines = ['REDDIT TRAVEL INSIGHTS (r/Egypt, r/travel, r/solotravel):'];
        posts.forEach((p) => {
            lines.push(`- [r/${p.subreddit}] ${p.title} (${p.score} upvotes) → ${p.url}`);
            if (p.snippet) lines.push(`  "${p.snippet.replace(/\n/g, ' ')}..."`);
        });
        return { text: lines.join('\n'), posts };
    } catch (err) {
        console.error('[freeApis] reddit error', err.message);
        return { text: '', posts: [] };
    }
}

/** Nominatim place search — free OSM geocoding */
async function fetchPlaces(query, city = '') {
    const q = [query, city, 'Egypt'].filter(Boolean).join(', ').trim();
    if (!q || q.length < 3) return { text: '', places: [] };
    try {
        const params = new URLSearchParams({
            q,
            format: 'json',
            limit: '5',
            countrycodes: 'eg',
            addressdetails: '1',
        });
        const data = await fetchJson(`${NOMINATIM}?${params}`);
        const places = (Array.isArray(data) ? data : []).slice(0, 5).map((p) => ({
            name: p.display_name?.split(',')[0] || p.name,
            type: p.type,
            lat: p.lat,
            lon: p.lon,
            mapsUrl: `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=16/${p.lat}/${p.lon}`,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`,
        }));
        if (!places.length) return { text: '', places: [] };
        const lines = [`OSM PLACES (OpenStreetMap/Nominatim):`];
        places.forEach((p) => {
            lines.push(`- ${p.name} (${p.type}) | Maps: ${p.googleMapsUrl}`);
        });
        return { text: lines.join('\n'), places };
    } catch (err) {
        console.error('[freeApis] nominatim error', err.message);
        return { text: '', places: [] };
    }
}

module.exports = { fetchCurrencyRates, fetchRedditInsights, fetchPlaces };
