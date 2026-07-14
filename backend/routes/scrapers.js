const express = require('express');
const { scrapeNumbeoCity } = require('../services/scrapers/numbeoScraper');
const scrapedData = require('../services/scrapers/scrapedDataService');
const { generateTrainLinks } = require('../services/scrapers/egyptTrainsScraper');

const router = express.Router();

// Trigger a Numbeo scrape for a city (GET for convenience)
router.get('/numbeo/scrape', async(req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'city is required' });
    try {
        const details = await scrapeNumbeoCity(city);
        if (!details) return res.status(500).json({ error: 'failed to scrape' });
        return res.json({ ok: true, details });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'internal' });
    }
});

// Get scraped data
router.get('/data', async(req, res) => {
    const { source, city, type, limit } = req.query;
    try {
        const rows = await scrapedData.queryItems({ source, city, type, limit: limit || 50 });
        return res.json({ ok: true, rows });
    } catch (err) {
        console.error('Error querying scraped data', err);
        return res.status(500).json({ error: 'internal' });
    }
});

// Generate train links (Google Maps + search/ministry fallback)
router.get('/trains', async(req, res) => {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'from and to are required' });
    try {
        const links = await generateTrainLinks({ from, to });
        return res.json({ ok: true, links });
    } catch (err) {
        console.error('Error generating train links', err);
        return res.status(500).json({ error: 'internal' });
    }
});

module.exports = router;