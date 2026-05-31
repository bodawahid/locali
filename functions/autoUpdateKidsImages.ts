import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const BASE = 'https://maps.googleapis.com/maps/api/place';

async function fetchPhotosForPlace(placeName, city = 'Hurghada', maxPhotos = 5) {
  const searchQuery = encodeURIComponent(`${placeName} ${city} Egypt`);
  const searchUrl = `${BASE}/textsearch/json?query=${searchQuery}&key=${API_KEY}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (searchData.status !== 'OK' || !searchData.results?.length) {
    return { photos: [], debug: { status: searchData.status, error_message: searchData.error_message } };
  }

  const place = searchData.results[0];
  const placeId = place.place_id;

  const detailRes = await fetch(`${BASE}/details/json?place_id=${placeId}&fields=name,photos,rating&key=${API_KEY}`);
  const detailData = await detailRes.json();

  if (detailData.status !== 'OK') {
    return { photos: [], debug: { detailStatus: detailData.status, placeId } };
  }

  const photos = (detailData.result?.photos || [])
    .slice(0, maxPhotos)
    .map(p => `${BASE}/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${API_KEY}`);

  return { photos, debug: { placeId, placeName: detailData.result?.name, photoCount: detailData.result?.photos?.length || 0 } };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    if (!API_KEY) {
      return Response.json({ error: 'GOOGLE_PLACES_API_KEY not configured' }, { status: 500 });
    }

    const targets = [
      { name: 'Sindbad Submarine', city: 'Hurghada' },
      { name: 'Hurghada Grand Aquarium', city: 'Hurghada' },
      { name: 'Makadi Water World', city: 'Hurghada' },
      { name: 'Dolphin House', city: 'Hurghada' },
      { name: 'Sand City Hurghada', city: 'Hurghada' },
    ];

    const results = [];

    for (const target of targets) {
      const result = await fetchPhotosForPlace(target.name, target.city, 5);
      results.push({ name: target.name, ...result });
    }

    return Response.json({ success: true, results });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});