// Client helper to call backend scraper endpoints
export async function getNumbeoSnapshot(city) {
    if (!city) return null;
    try {
        const base = window.location.origin || '';
        const url = `${base}/api/scrapers/data`;
        const params = new URLSearchParams({ source: 'numbeo_scrape', city, limit: '1' });
        const res = await fetch(`${url}?${params.toString()}`, { method: 'GET', credentials: 'include' });
        if (!res.ok) return null;
        const payload = await res.json();
        const row = (payload.rows && payload.rows[0]) || null;
        if (!row) return null;
        // row.details stored as JSON object/string
        const details = typeof row.details === 'string' ? JSON.parse(row.details) : row.details;
        return details || null;
    } catch (err) {
        console.error('Error fetching numbeo snapshot', err);
        return null;
    }
}