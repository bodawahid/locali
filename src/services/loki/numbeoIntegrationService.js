// Numbeo integration (stubbed)
// This module contains helpers to fetch Numbeo data. In production use a server-side proxy
// and a real API key. For now we provide a safe stub and community fallbacks.

const NUMBEO_API = 'https://www.numbeo.com/api';

export async function fetchNumbeoPrices(city = 'Hurghada') {
    try {
        const apiKey = import.meta.env?.VITE_NUMBEO_API_KEY;
        if (!apiKey) return '';

        const query = encodeURIComponent(`${city}, Egypt`);
        const res = await fetch(`${NUMBEO_API}/city_prices?api_key=${apiKey}&query=${query}`);
        if (!res.ok) return '';

        const data = await res.json();
        if (!data?.prices?.length) return '';

        const items = data.prices.slice(0, 12).map((p) => `- ${p.item_name}: ${p.average_price} ${p.currency || 'EGP'}`).join('\n');
        return `💰 **Numbeo Cost-of-Living Data** (${city}):\n${items}`;
    } catch {
        return '';
    }
}

export async function fetchNumbeoByCityCode(cityCode) {
    const cityMap = {
        hurghada: 'Hurghada',
        'sharm-el-sheikh': 'Sharm El Sheikh',
        luxor: 'Luxor',
        aswan: 'Aswan',
        'el-gouna': 'El Gouna',
    };
    return fetchNumbeoPrices(cityMap[cityCode] || cityCode);
}

export const COMMUNITY_PRICES = {
    hurghada: {
        meal_budget: '25–50 EGP',
        meal_mid: '50–100 EGP',
        meal_upscale: '100–250 EGP',
        beer_domestic: '25–35 EGP',
        beer_imported: '40–60 EGP',
        coffee: '10–20 EGP',
        taxi_km: '10–20 EGP',
    },
    'sharm-el-sheikh': {
        meal_budget: '30–60 EGP',
        meal_mid: '60–120 EGP',
        meal_upscale: '120–300 EGP',
        beer_domestic: '30–40 EGP',
        beer_imported: '50–80 EGP',
        coffee: '12–25 EGP',
        taxi_km: '15–25 EGP',
    },
    luxor: {
        meal_budget: '20–40 EGP',
        meal_mid: '40–80 EGP',
        meal_upscale: '80–200 EGP',
        beer_domestic: '20–30 EGP',
        beer_imported: '40–60 EGP',
        coffee: '8–15 EGP',
        taxi_km: '8–15 EGP',
    },
};
