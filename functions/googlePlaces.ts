import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const BASE = 'https://maps.googleapis.com/maps/api/place';
const PAGE_SIZE_MAX = 20;
const MAX_TOKEN_RETRY_ATTEMPTS = 4;
const TOKEN_RETRY_DELAYS_MS = [500, 1000, 2000];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { action, query, placeId, page: rawPage, limit: rawLimit } = await req.json();

    if (!API_KEY) {
      return Response.json({ error: 'GOOGLE_PLACES_API_KEY not configured' }, { status: 500 });
    }

    // ── 1. Autocomplete search ──────────────────────────────────────────────
    if (action === 'search') {
      if (!query) return Response.json({ results: [] });

      const page = Math.max(1, Number.parseInt(String(rawPage ?? 1), 10) || 1);
      const limit = Math.min(
        PAGE_SIZE_MAX,
        Math.max(1, Number.parseInt(String(rawLimit ?? 8), 10) || 8),
      );

      let currentData: any = null;
      let nextPageToken: string | undefined;

      for (let currentPage = 1; currentPage <= page; currentPage += 1) {
        const useToken = currentPage > 1;
        const requestUrl = useToken
          ? `${BASE}/textsearch/json?pagetoken=${encodeURIComponent(nextPageToken || '')}&key=${API_KEY}`
          : `${BASE}/textsearch/json?query=${encodeURIComponent(query + ' Egypt')}&key=${API_KEY}`;

        // Google Places may return INVALID_REQUEST briefly before next_page_token becomes usable.
        let attempts = useToken ? MAX_TOKEN_RETRY_ATTEMPTS : 1;
        while (attempts > 0) {
          const res = await fetch(requestUrl);
          currentData = await res.json();

          if (!useToken || currentData.status !== 'INVALID_REQUEST') break;
          attempts -= 1;
          // Google recommends a short wait before retrying token-based pagination requests.
          if (attempts > 0) {
            const delayIndex = Math.max(0, MAX_TOKEN_RETRY_ATTEMPTS - attempts - 1);
            const delay = TOKEN_RETRY_DELAYS_MS[Math.min(delayIndex, TOKEN_RETRY_DELAYS_MS.length - 1)];
            await sleep(delay);
          }
        }

        if (!currentData || (currentData.status !== 'OK' && currentData.status !== 'ZERO_RESULTS')) {
          return Response.json({ error: currentData?.status || 'UNKNOWN_ERROR', results: [] }, { status: 400 });
        }

        nextPageToken = currentData.next_page_token;
        if (currentPage < page && !nextPageToken) {
          return Response.json({
            results: [],
            page,
            limit,
            hasMore: false,
            nextPage: null,
          });
        }
      }

      const results = (currentData?.results || []).slice(0, limit).map(p => ({
        place_id: p.place_id,
        name: p.name,
        address: p.formatted_address,
        rating: p.rating || null,
        user_ratings_total: p.user_ratings_total || 0,
        types: p.types || [],
        lat: p.geometry?.location?.lat,
        lng: p.geometry?.location?.lng,
      }));

      const hasMore = Boolean(currentData?.next_page_token);
      return Response.json({
        results,
        page,
        limit,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
      });
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