const axios = require('axios');
const cheerio = require('cheerio');
const scrapedData = require('./scrapedDataService');

// Example: https://www.numbeo.com/cost-of-living/in/Cairo
function buildNumbeoUrl(city) {
    const slug = city.trim().replace(/\s+/g, '+');
    return `https://www.numbeo.com/cost-of-living/in/${encodeURIComponent(slug)}`;
}

async function scrapeNumbeoCity(city) {
    const url = buildNumbeoUrl(city);
    try {
        const res = await axios.get(url, { timeout: 8000, headers: { 'User-Agent': 'LocaliBot/1.0 (+https://locali.example)' } });
        const $ = cheerio.load(res.data);

        // Simple heuristic: extract first table rows with cost items
        const rows = [];
        $('table').first().find('tr').each((i, el) => {
            const cols = $(el).find('td');
            if (cols.length >= 2) {
                const name = $(cols[0]).text().trim();
                const value = $(cols[1]).text().trim();
                if (name && value) rows.push({ name, value });
            }
        });

        const details = { url, snapshot: rows.slice(0, 80) };

        // Store an aggregate record
        await scrapedData.upsertItem({
            source: 'numbeo_scrape',
            city,
            type: 'prices',
            item_id: `numbeo:${city}`,
            title: `Numbeo cost-of-living snapshot for ${city}`,
            details,
            url,
        });

        return details;
    } catch (err) {
        console.error('Numbeo scrape error for', city, err.message);
        return null;
    }
}

module.exports = { scrapeNumbeoCity };