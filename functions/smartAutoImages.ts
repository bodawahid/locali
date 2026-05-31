import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PEXELS_KEY = Deno.env.get('PEXELS_API_KEY');
const UNSPLASH_KEY = Deno.env.get('UNSPLASH_API_KEY');

// In-memory set to avoid duplicate URLs within a single run
const usedUrls = new Set();

// ── Category-aware query builder ─────────────────────────────────────────────
// Each category has: primary search terms, realistic descriptors, and hard rejects.
const CATEGORY_CONFIG = {
  medical: {
    terms: ['clinic exterior', 'hospital entrance', 'pharmacy storefront', 'medical center building'],
    descriptors: ['entrance', 'building', 'exterior', 'signage', 'facade'],
    rejectTerms: ['doctor posing', 'surgery', 'operating room', 'smiling nurse', 'stethoscope white background'],
  },
  restaurant: {
    terms: ['restaurant exterior street', 'cafe facade', 'dining room interior authentic', 'local eatery'],
    descriptors: ['exterior', 'entrance', 'interior', 'dining', 'street'],
    rejectTerms: ['menu photography', 'studio food', 'styled dish', 'white plate luxury', 'food on white'],
  },
  food: {
    terms: ['restaurant exterior street', 'local food Egypt', 'cafe real interior'],
    descriptors: ['exterior', 'street', 'interior', 'natural'],
    rejectTerms: ['studio food', 'white background', 'menu photography'],
  },
  transport: {
    terms: ['taxi street', 'bus station', 'transport pickup', 'vehicle road real'],
    descriptors: ['street', 'road', 'station', 'real', 'outdoor'],
    rejectTerms: ['showroom', 'studio car', 'white background car', 'car advertisement'],
  },
  taxi: {
    terms: ['taxi cab street Egypt', 'car pickup road', 'transport vehicle real'],
    descriptors: ['street', 'road', 'real', 'outdoor'],
    rejectTerms: ['showroom', 'studio', 'advertisement'],
  },
  hotel: {
    terms: ['hotel exterior building', 'hotel facade entrance', 'accommodation building real'],
    descriptors: ['exterior', 'facade', 'entrance', 'building'],
    rejectTerms: ['luxury brochure', 'heavily edited', 'HDR promo'],
  },
  accommodation: {
    terms: ['hotel exterior building', 'guesthouse facade real', 'apartment building exterior'],
    descriptors: ['exterior', 'building', 'real'],
    rejectTerms: ['staged interior luxury', 'heavily edited'],
  },
  activities: {
    terms: ['outdoor activity Egypt real', 'tour experience real', 'adventure desert sea'],
    descriptors: ['outdoor', 'real', 'natural', 'environment'],
    rejectTerms: ['tourism brochure', 'promotional', 'staged'],
  },
  kids_family: {
    terms: ['family activity outdoor real', 'playground park outdoor', 'kids outdoor Egypt'],
    descriptors: ['outdoor', 'real', 'natural'],
    rejectTerms: ['studio family', 'posed portrait'],
  },
  sim_internet: {
    terms: ['mobile phone shop storefront', 'telecom store street', 'phone shop signage'],
    descriptors: ['storefront', 'street', 'signage', 'shop'],
    rejectTerms: ['product mockup', 'white background phone', 'advertisement'],
  },
  telecom: {
    terms: ['mobile store shop street', 'phone retailer storefront', 'sim card shop Egypt'],
    descriptors: ['storefront', 'street', 'shop'],
    rejectTerms: ['product mockup', 'white background', 'ad'],
  },
  nightlife: {
    terms: ['bar exterior night street', 'lounge entrance real', 'restaurant night street'],
    descriptors: ['exterior', 'night', 'street', 'entrance'],
    rejectTerms: ['staged promotional', 'advertising'],
  },
  remote_work: {
    terms: ['cafe interior coworking real', 'coffee shop laptop interior', 'workspace cafe'],
    descriptors: ['interior', 'real', 'natural lighting'],
    rejectTerms: ['staged stock office', 'white studio'],
  },
  long_stay: {
    terms: ['apartment building exterior', 'residential building real', 'flat exterior'],
    descriptors: ['exterior', 'building', 'real'],
    rejectTerms: ['luxury staged interior', 'promotional'],
  },
  shopping: {
    terms: ['market street Egypt real', 'bazaar outdoor', 'shop storefront street'],
    descriptors: ['street', 'outdoor', 'market', 'storefront'],
    rejectTerms: ['product white background', 'studio shot'],
  },
  horse_riding: {
    terms: ['horse riding desert real', 'horse stable outdoor Egypt', 'equestrian outdoor'],
    descriptors: ['outdoor', 'desert', 'real', 'natural'],
    rejectTerms: ['staged promotional', 'brochure tourism'],
  },
  boat: {
    terms: ['boat sea Egypt real', 'felucca Nile real', 'boat dock outdoor'],
    descriptors: ['outdoor', 'sea', 'real', 'natural'],
    rejectTerms: ['yacht advertisement', 'luxury promotional'],
  },
  diving: {
    terms: ['diving reef Egypt real', 'scuba Red Sea', 'diving underwater natural'],
    descriptors: ['underwater', 'natural', 'real'],
    rejectTerms: ['studio diving', 'promotional'],
  },
  snorkeling: {
    terms: ['snorkeling Red Sea Egypt', 'snorkel reef real underwater'],
    descriptors: ['underwater', 'real', 'outdoor'],
    rejectTerms: ['promotional tourism', 'brochure'],
  },
  temple: {
    terms: ['ancient temple Egypt exterior real', 'archaeological site outdoor'],
    descriptors: ['exterior', 'outdoor', 'real', 'ancient'],
    rejectTerms: ['heavily edited HDR', 'promotional'],
  },
  museum: {
    terms: ['museum exterior building Egypt', 'museum entrance real'],
    descriptors: ['exterior', 'entrance', 'building'],
    rejectTerms: ['staged exhibit promo'],
  },
  tour: {
    terms: ['guided tour Egypt outdoor real', 'tour group outdoor', 'tourism site real'],
    descriptors: ['outdoor', 'real', 'natural'],
    rejectTerms: ['brochure tourism', 'staged promotional'],
  },
  adventure: {
    terms: ['adventure outdoor Egypt real', 'desert excursion outdoor', 'outdoor activity real'],
    descriptors: ['outdoor', 'desert', 'real'],
    rejectTerms: ['staged promotional', 'brochure'],
  },
  other: {
    terms: ['local business street Egypt', 'shop exterior street', 'building real Egypt'],
    descriptors: ['street', 'real', 'outdoor'],
    rejectTerms: ['white background', 'studio', 'advertisement'],
  },
};

function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG['other'];
}

// Build queries: always simple — name + city, category + city. No marketing words.
function buildQueries(name, city, category) {
  const cityStr = city.replace(/-/g, ' ');
  const cfg = getCategoryConfig(category);
  const n = (name || '').trim();
  const queries = [];

  // 1. Most specific: service name + city
  if (n) {
    queries.push(`${n} ${cityStr}`);
    queries.push(`${n} exterior ${cityStr}`);
  }

  // 2. Category term + city (from config — realistic terms)
  for (const term of cfg.terms.slice(0, 2)) {
    queries.push(`${term} ${cityStr} Egypt`);
  }

  // 3. Generic fallback: category + city real photo
  const cat = (category || '').replace(/_/g, ' ');
  queries.push(`${cat} ${cityStr} Egypt real`);

  return [...new Set(queries)].filter(Boolean);
}

// ── Realism scoring ───────────────────────────────────────────────────────────

const GLOBAL_REAL_TERMS = ['street', 'exterior', 'building', 'outdoor', 'facade', 'entrance', 'market',
  'beach', 'desert', 'sea', 'river', 'nile', 'egypt', 'real', 'location', 'natural', 'authentic',
  'storefront', 'road', 'station', 'neighborhood'];

const GLOBAL_REJECT_TERMS = ['white background', 'isolated', 'studio', 'transparent', 'cutout',
  'smiling woman', 'smiling man', 'advertisement', 'promotional', 'mockup', 'product shot',
  'on white', 'white backdrop', 'clean background', 'stock photo'];

function scorePhoto(descText, width, height, likes) {
  let score = 0;

  // Resolution
  if (width >= 1200) score += 15;
  else if (width >= 800) score += 5;

  // Prefer landscape (real-world shots)
  if (width > height) score += 20;
  // Penalize very tall portrait (often staged)
  if (height > width * 1.3) score -= 20;

  const text = (descText || '').toLowerCase();

  for (const t of GLOBAL_REAL_TERMS) {
    if (text.includes(t)) score += 5;
  }
  for (const t of GLOBAL_REJECT_TERMS) {
    if (text.includes(t)) score -= 30; // Hard penalty
  }

  // Popularity signal (Unsplash)
  if (likes > 100) score += 10;
  if (likes > 500) score += 10;

  return score;
}

function isCategoryRejected(descText, category) {
  const cfg = getCategoryConfig(category);
  const text = (descText || '').toLowerCase();
  for (const bad of cfg.rejectTerms) {
    if (text.includes(bad.toLowerCase())) return true;
  }
  return false;
}

// ── Pexels fetcher ────────────────────────────────────────────────────────────
async function fetchPexelsBest(queries, category) {
  if (!PEXELS_KEY) return null;
  let best = null;
  let bestScore = -999;

  for (const query of queries.slice(0, 4)) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      const data = await res.json();
      const photos = data?.photos || [];

      for (const photo of photos) {
        const url = photo?.src?.large || photo?.src?.medium;
        if (!url || usedUrls.has(url)) continue;
        const descText = photo.alt || '';
        if (isCategoryRejected(descText, category)) continue;
        const score = scorePhoto(descText, photo.width, photo.height, 0);
        if (score > bestScore) {
          bestScore = score;
          best = { url, score, source: 'pexels', confidence: score > 25 ? 'high' : 'medium' };
        }
      }
      if (best && bestScore > 35) break;
    } catch (_) { /* continue */ }
  }
  return best;
}

// ── Unsplash fetcher ──────────────────────────────────────────────────────────
async function fetchUnsplashBest(queries, category) {
  if (!UNSPLASH_KEY) return null;
  let best = null;
  let bestScore = -999;

  for (const query of queries.slice(0, 4)) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape&order_by=relevant`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
      );
      const data = await res.json();
      const photos = data?.results || [];

      for (const photo of photos) {
        const url = photo?.urls?.regular;
        if (!url || usedUrls.has(url)) continue;
        const descText = (photo.description || '') + ' ' + (photo.alt_description || '');
        if (isCategoryRejected(descText, category)) continue;
        const score = scorePhoto(descText, photo.width, photo.height, photo.likes || 0);
        if (score > bestScore) {
          bestScore = score;
          best = { url, score, source: 'unsplash', confidence: score > 25 ? 'high' : 'medium' };
        }
      }
      if (best && bestScore > 35) break;
    } catch (_) { /* continue */ }
  }
  return best;
}

// ── Main image selector ───────────────────────────────────────────────────────
async function getBestImage(name, city, category) {
  const queries = buildQueries(name, city, category);

  // Try both in parallel, pick best scorer
  const [pexels, unsplash] = await Promise.all([
    fetchPexelsBest(queries, category),
    fetchUnsplashBest(queries, category),
  ]);

  let winner = null;
  if (pexels && unsplash) {
    winner = pexels.score >= unsplash.score ? pexels : unsplash;
  } else {
    winner = pexels || unsplash;
  }

  if (winner) {
    usedUrls.add(winner.url);
    return winner;
  }

  // Hard fallback: generic city + category, no branding words
  const cityStr = city.replace(/-/g, ' ');
  const cat = (category || '').replace(/_/g, ' ');
  const fallbackQuery = `${cat} street ${cityStr} Egypt`;
  const fallbackQueries = [fallbackQuery, `${cityStr} Egypt street outdoor`];

  const [fp, fu] = await Promise.all([
    fetchPexelsBest(fallbackQueries, category),
    fetchUnsplashBest(fallbackQueries, category),
  ]);

  const fallback = fp || fu;
  if (fallback) {
    usedUrls.add(fallback.url);
    return { ...fallback, confidence: 'medium' };
  }

  return null;
}

// ── Handler ───────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const isScheduled = body.scheduled === true;

    if (!isScheduled) {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Admin only' }, { status: 403 });
      }
    }

    const limit = body.limit || 20;
    const entityTypes = body.entities || ['Service', 'Place', 'HiddenGemPlace'];
    const log = { updated: 0, failed: 0, skipped: 0, details: [] };

    for (const entity of entityTypes) {
      let records = [];
      try {
        if (entity === 'Service') {
          const all = await base44.asServiceRole.entities.Service.list('-created_date', 300);
          records = all.filter(s => !s.main_image || s.main_image === '').slice(0, limit);
        } else if (entity === 'Place') {
          const all = await base44.asServiceRole.entities.Place.list('-created_date', 300);
          records = all.filter(s => !s.main_image || s.main_image === '').slice(0, limit);
        } else if (entity === 'HiddenGemPlace') {
          const all = await base44.asServiceRole.entities.HiddenGemPlace.list('-created_date', 300);
          records = all.filter(s => (!s.main_image || s.main_image === '') && (!s.image_url || s.image_url === '')).slice(0, limit);
        }
      } catch (_) { continue; }

      for (const record of records) {
        const name = (record.name || record.title || '').trim();
        const city = (record.city || '').replace(/-/g, ' ');
        const category = (record.category || record.tag || record.type || 'other').toLowerCase();

        if (!name && !city) { log.skipped++; continue; }

        const result = await getBestImage(name, city, category);

        if (!result) {
          log.failed++;
          log.details.push({ entity, name, status: 'no_image', confidence: null });
          continue;
        }

        const updateData = {
          main_image: result.url,
          auto_image_confidence: result.confidence,
          auto_image_source: result.source,
        };
        if (entity === 'HiddenGemPlace') updateData.image_url = result.url;

        try {
          if (entity === 'Service') await base44.asServiceRole.entities.Service.update(record.id, updateData);
          else if (entity === 'Place') await base44.asServiceRole.entities.Place.update(record.id, updateData);
          else if (entity === 'HiddenGemPlace') await base44.asServiceRole.entities.HiddenGemPlace.update(record.id, updateData);

          log.updated++;
          log.details.push({ entity, name, status: 'updated', url: result.url, confidence: result.confidence, source: result.source });
        } catch (err) {
          log.failed++;
          log.details.push({ entity, name, status: 'db_error', error: err.message });
        }
      }
    }

    return Response.json({ success: true, ...log, timestamp: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});