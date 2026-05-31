import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PEXELS_KEY = Deno.env.get('PEXELS_API_KEY');
const UNSPLASH_KEY = Deno.env.get('UNSPLASH_API_KEY');

async function fetchPexels(query) {
  if (!PEXELS_KEY) return null;
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
    headers: { Authorization: PEXELS_KEY }
  });
  const data = await res.json();
  return data?.photos?.[0]?.src?.large || null;
}

async function fetchUnsplash(query) {
  if (!UNSPLASH_KEY) return null;
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
  });
  const data = await res.json();
  return data?.results?.[0]?.urls?.regular || null;
}

async function getImage(name, city, category) {
  const queries = [
    `${name} ${city} Egypt`,
    `${name} Egypt`,
    `${category} ${city} Egypt`,
    `${category} Egypt tourism`,
  ];

  for (const q of queries) {
    const url = await fetchPexels(q) || await fetchUnsplash(q);
    if (url) return url;
  }
  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { entity = 'Service', limit = 50 } = await req.json().catch(() => ({}));

    let records = [];
    if (entity === 'Service') {
      const all = await base44.asServiceRole.entities.Service.list('-created_date', 200);
      records = all.filter(s => !s.main_image || s.main_image === '');
    } else if (entity === 'HiddenGemPlace') {
      const all = await base44.asServiceRole.entities.HiddenGemPlace.list('-created_date', 200);
      records = all.filter(s => !s.main_image && !s.image_url);
    } else if (entity === 'Place') {
      const all = await base44.asServiceRole.entities.Place.list('-created_date', 200);
      records = all.filter(s => !s.main_image || s.main_image === '');
    }

    records = records.slice(0, limit);

    const results = { updated: 0, failed: 0, skipped: 0, details: [] };

    for (const record of records) {
      const name = record.name || record.title || '';
      const city = record.city || '';
      const category = record.category || record.tag || '';

      if (!name) { results.skipped++; continue; }

      const imageUrl = await getImage(name, city, category);
      if (!imageUrl) {
        results.failed++;
        results.details.push({ name, status: 'no_image_found' });
        continue;
      }

      const updateData = { main_image: imageUrl };
      // For HiddenGemPlace also set image_url as fallback
      if (entity === 'HiddenGemPlace') updateData.image_url = imageUrl;

      if (entity === 'Service') {
        await base44.asServiceRole.entities.Service.update(record.id, updateData);
      } else if (entity === 'HiddenGemPlace') {
        await base44.asServiceRole.entities.HiddenGemPlace.update(record.id, updateData);
      } else if (entity === 'Place') {
        await base44.asServiceRole.entities.Place.update(record.id, updateData);
      }

      results.updated++;
      results.details.push({ name, status: 'updated', url: imageUrl });
    }

    return Response.json({ success: true, entity, total: records.length, ...results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});