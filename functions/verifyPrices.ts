/**
 * verifyPrices v2 — Safe Pricing Intelligence System
 *
 * PIPELINE (weighted):
 *   1. Crowd data from PriceInsight entity  → weight 0.50
 *   2. City Baseline Model                   → weight 0.35
 *   3. AI Estimation (last resort only)      → weight 0.15
 *
 * RULES:
 *   - NEVER return a single exact price
 *   - ALWAYS return range + confidence + source label
 *   - Remove outliers (trim top/bottom 10%)
 *   - Confidence: <3 signals = low, 3-10 = medium, 10+ = high
 *   - Google Places NOT used as price source
 *
 * POST payload: { items: [{ item, category, city }] }
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ─── City Baseline Model ────────────────────────────────────────────────────
// Conservative EGP tourist ranges per city+category
const BASELINE = {
  taxi: {
    hurghada:       { min: 70,  max: 120 },
    'sharm-el-sheikh': { min: 80, max: 150 },
    luxor:          { min: 50,  max: 100 },
    aswan:          { min: 50,  max: 100 },
    cairo:          { min: 60,  max: 130 },
    'el-gouna':     { min: 80,  max: 160 },
    default:        { min: 60,  max: 130 },
  },
  food_drinks: {
    hurghada:       { min: 40,  max: 120 },
    'sharm-el-sheikh': { min: 50, max: 160 },
    luxor:          { min: 30,  max: 90  },
    aswan:          { min: 30,  max: 90  },
    cairo:          { min: 40,  max: 150 },
    'el-gouna':     { min: 60,  max: 200 },
    default:        { min: 40,  max: 130 },
  },
  activities: {
    hurghada:       { min: 300, max: 900  },
    'sharm-el-sheikh': { min: 400, max: 1200 },
    luxor:          { min: 400, max: 1500 },
    aswan:          { min: 300, max: 1000 },
    cairo:          { min: 200, max: 800  },
    'el-gouna':     { min: 400, max: 1200 },
    default:        { min: 300, max: 1000 },
  },
  accommodation: {
    hurghada:       { min: 500,  max: 3000 },
    'sharm-el-sheikh': { min: 700, max: 5000 },
    luxor:          { min: 400,  max: 2000 },
    aswan:          { min: 400,  max: 2000 },
    cairo:          { min: 600,  max: 4000 },
    'el-gouna':     { min: 1000, max: 6000 },
    default:        { min: 500,  max: 3500 },
  },
  shopping: {
    hurghada:       { min: 50,  max: 500 },
    'sharm-el-sheikh': { min: 60, max: 600 },
    luxor:          { min: 40,  max: 400 },
    aswan:          { min: 40,  max: 400 },
    cairo:          { min: 50,  max: 800 },
    default:        { min: 50,  max: 500 },
  },
  telecom: {
    default:        { min: 100, max: 350 },
  },
  medical: {
    hurghada:       { min: 200, max: 800  },
    'sharm-el-sheikh': { min: 300, max: 1000 },
    default:        { min: 200, max: 900  },
  },
  default: {
    default:        { min: 50,  max: 300 },
  },
};

function getBaseline(category, city) {
  const cat = BASELINE[category] || BASELINE.default;
  return cat[city] || cat.default || BASELINE.default.default;
}

// ─── Server-side cache ───────────────────────────────────────────────────────
const SERVER_CACHE = {};
const CACHE_TTL = {
  taxi: 6 * 3600_000,
  food_drinks: 6 * 3600_000,
  activities: 24 * 3600_000,
  accommodation: 48 * 3600_000,
  shopping: 12 * 3600_000,
  telecom: 7 * 24 * 3600_000,
  default: 12 * 3600_000,
};

function cacheKey(item, city, category) {
  return `${category}:${city}:${item}`.toLowerCase().replace(/\s+/g, '_');
}
function getCached(key, category) {
  const entry = SERVER_CACHE[key];
  if (!entry) return null;
  const ttl = CACHE_TTL[category] || CACHE_TTL.default;
  if (Date.now() - entry.ts > ttl) { delete SERVER_CACHE[key]; return null; }
  return entry.data;
}
function setCache(key, data) { SERVER_CACHE[key] = { ts: Date.now(), data }; }

// ─── Outlier trimming ────────────────────────────────────────────────────────
function trimOutliers(values) {
  if (values.length <= 2) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const cut = Math.floor(sorted.length * 0.1);
  return sorted.slice(cut, sorted.length - cut);
}

// ─── Crowd data aggregation ──────────────────────────────────────────────────
async function fetchCrowdData(item, city, category, base44) {
  const filter = {};
  if (city && city !== 'all') filter.city = city;
  if (category) filter.category = category;

  let reports = [];
  try {
    // Try PriceInsight entity (community price reports)
    reports = await base44.asServiceRole.entities.PriceInsight.filter(filter, '-created_date', 50);
    // Also look for keyword match
    if (item) {
      reports = reports.filter(r =>
        r.service_name?.toLowerCase().includes(item.toLowerCase().split(' ')[0]) ||
        item.toLowerCase().includes((r.service_name || '').toLowerCase().split(' ')[0])
      );
    }
  } catch (_) {
    return null;
  }

  if (reports.length === 0) return null;

  // Collect all reported tourist prices
  const mins = trimOutliers(reports.map(r => r.local_price_min).filter(Boolean));
  const maxs = trimOutliers(reports.map(r => r.local_price_max).filter(Boolean));
  const tourist = trimOutliers(reports.map(r => r.reported_tourist_price).filter(Boolean));

  if (mins.length === 0 && tourist.length === 0) return null;

  // Build range from crowd data
  let min, max;
  if (mins.length > 0 && maxs.length > 0) {
    min = Math.round(mins.reduce((a, b) => a + b, 0) / mins.length);
    max = Math.round(maxs.reduce((a, b) => a + b, 0) / maxs.length);
  } else if (tourist.length > 0) {
    const avg = tourist.reduce((a, b) => a + b, 0) / tourist.length;
    min = Math.round(avg * 0.8);
    max = Math.round(avg * 1.3);
  }

  if (!min || !max || min >= max) return null;

  return {
    min,
    max,
    signal_count: reports.length,
    source: 'crowd',
  };
}

// ─── AI fallback ─────────────────────────────────────────────────────────────
async function fetchAIEstimate(item, city, category, base44) {
  const baseline = getBaseline(category, city);
  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are a safe pricing assistant for a tourism platform in Egypt.
Estimate a conservative EGP price RANGE for tourists for: "${item}" in ${city}, category: ${category}.

Baseline reference: ${baseline.min}–${baseline.max} EGP
Return a JSON object with: { "min": number, "max": number, "note": "brief reason" }
Rules:
- Stay within 30% of the baseline unless you have strong reason
- Always return a range, never a single value
- Be conservative (tourists may pay more)`,
    response_json_schema: {
      type: 'object',
      properties: {
        min: { type: 'number' },
        max: { type: 'number' },
        note: { type: 'string' },
      },
    },
  });

  if (!result || !result.min || !result.max) return null;
  return { min: Math.round(result.min), max: Math.round(result.max), note: result.note };
}

// ─── Weighted merge of signals ────────────────────────────────────────────────
function mergeSignals({ crowd, baseline, ai }, signalCount) {
  const signals = [];

  if (crowd) signals.push({ min: crowd.min, max: crowd.max, weight: 0.50, source: 'crowd', count: crowd.signal_count });
  if (baseline) signals.push({ min: baseline.min, max: baseline.max, weight: crowd ? 0.35 : 0.80, source: 'baseline', count: 1 });
  if (ai && !crowd && !baseline) signals.push({ min: ai.min, max: ai.max, weight: 0.15, source: 'ai', count: 0 });

  if (signals.length === 0) return null;

  const totalW = signals.reduce((a, s) => a + s.weight, 0);
  const wMin = signals.reduce((a, s) => a + s.min * (s.weight / totalW), 0);
  const wMax = signals.reduce((a, s) => a + s.max * (s.weight / totalW), 0);

  const totalSignals = signalCount;
  const confidence_score =
    totalSignals >= 10 ? 0.85 :
    totalSignals >= 3  ? 0.55 + (totalSignals / 10) * 0.25 :
    totalSignals >= 1  ? 0.35 :
    0.25;

  const confidence =
    confidence_score >= 0.75 ? 'high' :
    confidence_score >= 0.50 ? 'medium' :
    confidence_score >= 0.35 ? 'low' : 'estimated';

  // Determine primary source label
  const primarySource = crowd ? 'crowd_verified' : baseline ? 'baseline_model' : 'ai_estimated';
  const sourceLabels = signals.map(s => s.source);

  return {
    min: Math.round(wMin),
    max: Math.round(wMax),
    currency: 'EGP',
    confidence,
    confidence_score: Math.round(confidence_score * 100) / 100,
    source: primarySource,
    source_labels: sourceLabels,
    source_count: totalSignals,
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });

  const base44 = createClientFromRequest(req);
  const { items } = await req.json();

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'items array required' }, { status: 400 });
  }

  const batch = items.slice(0, 10);
  const results = [];

  for (const { item, category = 'default', city = 'hurghada' } of batch) {
    const key = cacheKey(item, city, category);

    // 1. Server cache
    const cached = getCached(key, category);
    if (cached) {
      results.push({ item, city, category, ...cached, from_cache: true });
      continue;
    }

    // 2. Crowd data (weight: 50%)
    let crowd = null;
    try { crowd = await fetchCrowdData(item, city, category, base44); } catch (_) {}

    // 3. City baseline (weight: 35%)
    const baseline = getBaseline(category, city);

    // 4. AI only if NO crowd AND baseline is too generic
    let ai = null;
    if (!crowd) {
      try { ai = await fetchAIEstimate(item, city, category, base44); } catch (_) {}
    }

    const signalCount = (crowd?.signal_count || 0) + (baseline ? 1 : 0) + (ai ? 0 : 0);
    const merged = mergeSignals({ crowd, baseline, ai }, signalCount);

    if (!merged) {
      results.push({ item, city, category, error: 'No data available' });
      continue;
    }

    const output = {
      item,
      city,
      category,
      ...merged,
      updated: new Date().toISOString(),
      from_cache: false,
      // Extra context
      ai_note: ai?.note || null,
    };

    setCache(key, { ...merged, updated: output.updated, ai_note: output.ai_note });
    results.push(output);
  }

  return Response.json({ results });
});