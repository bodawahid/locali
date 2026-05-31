import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const BASE = 'https://maps.googleapis.com/maps/api/place';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { action, query, placeId } = await req.json();

    if (!API_KEY) {
      return Response.json({ error: 'GOOGLE_PLACES_API_KEY not configured' }, { status: 500 });
    }

    // ── 1. Autocomplete search ──────────────────────────────────────────────
    if (action === 'search') {
      if (!query) return Response.json({ results: [] });

      const url = `${BASE}/textsearch/json?query=${encodeURIComponent(query + ' Egypt')}&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        return Response.json({ error: data.status, results: [] }, { status: 400 });
      }

      const results = (data.results || []).slice(0, 8).map(p => ({
        place_id: p.place_id,
        name: p.name,
        address: p.formatted_address,
        rating: p.rating || null,
        user_ratings_total: p.user_ratings_total || 0,
        types: p.types || [],
        lat: p.geometry?.location?.lat,
        lng: p.geometry?.location?.lng,
      }));

      return Response.json({ results });
    }

    // ── 2. Place Details ────────────────────────────────────────────────────
    if (action === 'details') {
      if (!placeId) return Response.json({ error: 'placeId required' }, { status: 400 });

      const fields = 'name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,website,geometry,photos,types,url';
      const url = `${BASE}/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== 'OK') {
        return Response.json({ error: data.status }, { status: 400 });
      }

      const p = data.result;
      let photoUrl = null;
      if (p.photos?.length > 0) {
        photoUrl = `${BASE}/photo?maxwidth=800&photo_reference=${p.photos[0].photo_reference}&key=${API_KEY}`;
      }

      return Response.json({
        place: {
          place_id: placeId,
          name: p.name,
          address: p.formatted_address,
          phone: p.formatted_phone_number || null,
          website: p.website || null,
          rating: p.rating || null,
          user_ratings_total: p.user_ratings_total || 0,
          opening_hours: p.opening_hours?.weekday_text || null,
          is_open_now: p.opening_hours?.open_now ?? null,
          lat: p.geometry?.location?.lat,
          lng: p.geometry?.location?.lng,
          photo_url: photoUrl,
          google_maps_url: p.url || `https://maps.google.com/?q=place_id:${placeId}`,
          types: p.types || [],
        }
      });
    }

    return Response.json({ error: 'Invalid action. Use: search | details' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});