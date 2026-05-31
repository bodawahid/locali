const express = require('express');
const { query } = require('../db');

const router = express.Router();

router.post('/verify-prices', async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const results = await Promise.all(items.map(async (item) => {
      const city = item.city || 'all';
      const search = `%${(item.item || '').trim().replace(/%/g, '')}%`;
      const rows = await query(
        'SELECT * FROM price_entries WHERE (city = ? OR city = ?) AND item LIKE ? ORDER BY updated_at DESC LIMIT 1',
        [city, 'all', search]
      );

      if (!rows.length) {
        return {
          item: item.item,
          category: item.category || null,
          city,
          error: 'No local price record found',
        };
      }

      const record = rows[0];
      return {
        item: record.item,
        city: record.city,
        category: record.category,
        local_price: record.local_price,
        fair_tourist_price: record.fair_tourist_price,
        scam_price: record.scam_price,
        notes: record.notes,
        source: record.source,
        updated_at: record.updated_at,
      };
    }));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify prices' });
  }
});

router.post('/update-currency-rates', async (req, res) => {
  try {
    const payload = req.body || {};
    const rateDate = payload.rate_date || new Date().toISOString().slice(0, 10);
    const columns = ['rate_date','usd','eur','gbp','rub','pln','cad','aud','sar','source','change_usd','change_eur','alert'];
    const fields = columns.filter((col) => payload[col] !== undefined && payload[col] !== null);
    if (!fields.length) {
      return res.status(400).json({ error: 'No currency rate fields provided.' });
    }

    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map((field) => payload[field]);
    await query(`INSERT INTO currency_rates (${fields.map((field) => `\`${field}\``).join(', ')}) VALUES (${placeholders})`, values);

    const rows = await query('SELECT * FROM currency_rates WHERE rate_date = ? ORDER BY id DESC LIMIT 1', [rateDate]);
    res.json({ saved: rows[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update currency rates' });
  }
});

router.post('/google-places', async (req, res) => {
  const { action } = req.body || {};
  if (action === 'search') {
    return res.json({ suggestions: [] });
  }
  if (action === 'details') {
    return res.json({ place: null });
  }
  res.json({ message: 'Local googlePlaces stub running', action });
});

router.post('/fetch-free-images', async (req, res) => {
  res.json({ images: [] });
});

router.post('/fetch-place-images', async (req, res) => {
  res.json({ images: [] });
});

router.post('/smart-auto-images', async (req, res) => {
  res.json({ updated: false, details: 'Local smartAutoImages stub.' });
});

router.post('/sync-google-places-api', async (req, res) => {
  res.json({ synced: true, note: 'Local syncGooglePlacesAPI stub.' });
});

router.post('/tag-el-gouna-services', async (req, res) => {
  res.json({ tagged: [], note: 'Local tagElGounaServices stub.' });
});

router.post('/:fn', (req, res) => {
  res.status(404).json({ error: `Function ${req.params.fn} is not supported in the local backend.` });
});

module.exports = router;
