#!/usr/bin/env node
 // Simple script to scrape Numbeo for a list of cities and store results in DB
const { scrapeNumbeoCity } = require('../services/scrapers/numbeoScraper');

const cities = [
    'Cairo',
    'Alexandria',
    'Hurghada',
    'Sharm el-Sheikh',
    'Luxor',
    'Aswan',
];

(async() => {
    for (const city of cities) {
        try {
            console.log('Scraping', city);
            const res = await scrapeNumbeoCity(city);
            console.log(city, '->', res ? 'ok' : 'failed');
        } catch (err) {
            console.error('Error scraping', city, err.message);
        }
    }
    console.log('Done.');
    process.exit(0);
})();
