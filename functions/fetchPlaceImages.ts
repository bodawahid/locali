import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const BASE = 'https://maps.googleapis.com/maps/api/place';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    if (!API_KEY) {
      return Response.json({ error: 'GOOGLE_PLACES_API_KEY not configured' }, { status: 500 });
    }

    const { placeName, city, maxPhotos = 3 } = await req.json();
    if (!placeName) return Response.json({ error: 'placeName required' }, { status: 400 });

    // Text search to find the place
    const searchQuery = encodeURIComponent(`${placeName} ${city || ''} Egypt`);
    const searchUrl = `${BASE}/textsearch/json?query=${searchQuery}&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' || !searchData.results?.length) {
      return Response.json({ photos: [], placeId: null, found: false });
    }

    const place = searchData.results[0];
    const placeId = place.place_id;

    // Get full details with photos
    const fields = 'name,photos,rating,formatted_address';
    const detailUrl = `${BASE}/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
    const detailRes = await fetch(detailUrl);
    const detailData = await detailRes.json();

    if (detailData.status !== 'OK') {
      return Response.json({ photos: [], placeId, found: false });
    }

    const photos = (detailData.result?.photos || [])
      .slice(0, maxPhotos)
      .map(p => `${BASE}/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${API_KEY}`);

    return Response.json({
      found: true,
      placeId,
      name: detailData.result?.name,
      address: detailData.result?.formatted_address,
      rating: detailData.result?.rating,
      photos,
      mainPhoto: photos[0] || null,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});