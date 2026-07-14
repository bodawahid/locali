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
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  const { action, query, placeId } = req.body || {};

  if (!API_KEY) {
    return res.status(503).json({ error: 'GOOGLE_PLACES_API_KEY not configured', results: [] });
  }

  const BASE = 'https://maps.googleapis.com/maps/api/place';

  try {
    if (action === 'scam-hotspots') {
      const city = query || 'Hurghada';
      const searches = [
        `${city} taxi scam tourist Egypt`,
        `${city} tourist trap Egypt`,
        `${city} bazaar overcharge Egypt`,
      ];
      const all = [];
      for (const q of searches) {
        const url = `${BASE}/textsearch/json?query=${encodeURIComponent(q)}&key=${API_KEY}`;
        const r = await fetch(url);
        const data = await r.json();
        (data.results || []).slice(0, 3).forEach((p) => {
          all.push({
            place_id: p.place_id,
            name: p.name,
            address: p.formatted_address,
            lat: p.geometry?.location?.lat,
            lng: p.geometry?.location?.lng,
            rating: p.rating,
            source: 'google_places',
          });
        });
      }
      return res.json({ results: all });
    }

    if (action === 'search') {
      if (!query) return res.json({ results: [] });
      const url = `${BASE}/textsearch/json?query=${encodeURIComponent(query + ' Egypt')}&key=${API_KEY}`;
      const r = await fetch(url);
      const data = await r.json();
      const results = (data.results || []).slice(0, 8).map((p) => ({
        place_id: p.place_id,
        name: p.name,
        address: p.formatted_address,
        lat: p.geometry?.location?.lat,
        lng: p.geometry?.location?.lng,
        rating: p.rating,
      }));
      return res.json({ results });
    }

    if (action === 'geocode') {
      if (!query) return res.json({ results: [] });
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${API_KEY}`;
      const r = await fetch(url);
      const data = await r.json();
      const results = (data.results || []).map((g) => ({
        address: g.formatted_address,
        lat: g.geometry?.location?.lat,
        lng: g.geometry?.location?.lng,
      }));
      return res.json({ results });
    }

    if (action === 'details' && placeId) {
      const fields = 'name,formatted_address,rating,user_ratings_total,geometry,url,reviews';
      const url = `${BASE}/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
      const r = await fetch(url);
      const data = await r.json();
      if (data.status !== 'OK') return res.json({ error: data.status }, { status: 400 });
      const p = data.result;
      const scamReviews = (p.reviews || [])
        .filter((rev) => /scam|overcharge|rip|tourist trap|expensive|avoid/i.test(rev.text || ''))
        .slice(0, 3)
        .map((rev) => ({ text: rev.text, rating: rev.rating, author: rev.author_name }));
      return res.json({
        place: {
          name: p.name,
          address: p.formatted_address,
          lat: p.geometry?.location?.lat,
          lng: p.geometry?.location?.lng,
          rating: p.rating,
          google_maps_url: p.url,
          scam_reviews: scamReviews,
        },
      });
    }

    return res.json({ message: 'Use action: search | geocode | details | scam-hotspots' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Google Places request failed' });
  }
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
