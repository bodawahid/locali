/**
 * Smart Image System
 * Priority: real photo → Unsplash stock → AI generated
 * Anti-duplicate: uses a stable hash of place id/name to pick from pool
 */

// Curated Unsplash search queries per category — large pools to avoid repetition
const CATEGORY_QUERIES = {
  restaurant:    ['egypt restaurant food dining', 'middle east cafe food', 'mediterranean restaurant interior', 'red sea resort dining', 'egyptian cuisine food'],
  food_drinks:   ['coffee cafe egypt', 'fresh food market egypt', 'restaurant meal egypt', 'cafe drinks table'],
  hotel:         ['egypt resort hotel pool', 'red sea hotel room', 'luxury hotel lobby egypt', 'hotel exterior resort egypt', 'hotel bedroom luxury'],
  accommodation: ['egypt apartment interior', 'hurghada hotel room', 'resort room egypt', 'holiday apartment'],
  pharmacy:      ['pharmacy interior clean', 'medical pharmacy shelves', 'drugstore interior', 'clean medical shop'],
  medical:       ['hospital clinic egypt', 'medical center interior', 'doctor clinic modern', 'healthcare facility'],
  transport:     ['taxi car egypt city', 'car road egypt', 'transport vehicle city', 'car service egypt'],
  taxi:          ['taxi car egypt', 'cab vehicle city street', 'car transport egypt'],
  activities:    ['snorkeling red sea egypt', 'desert safari egypt', 'egypt tourist activity', 'scuba diving red sea', 'camel ride egypt'],
  attraction:    ['egypt landmark pyramid', 'red sea beach egypt', 'luxor temple egypt', 'egypt scenery travel', 'nile river egypt'],
  shopping:      ['egypt bazaar market', 'souvenir shop egypt', 'market egypt', 'shopping mall egypt'],
  nightlife:     ['beach bar egypt night', 'rooftop bar sea view', 'nightclub beach', 'egypt evening bar'],
  beach:         ['red sea beach egypt', 'hurghada beach', 'sharm el sheikh beach', 'beach resort egypt'],
  tour:          ['egypt tour guide pyramids', 'egypt sightseeing tour', 'egypt tourist trip', 'nile cruise egypt'],
  guide:         ['tour guide egypt pyramids', 'egypt travel guide', 'tourist guide egypt'],
  driver:        ['egypt driver car', 'private driver car egypt', 'transport driver'],
  default:       ['egypt travel tourism', 'egypt city street', 'egypt landscape travel', 'egypt modern city'],
};

// Stable hash from string → number (for consistent but unique image assignment)
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Get an Unsplash stock image URL for a place.
 * Uses a stable hash so the same place always gets the same image,
 * but different places in the same category get different images.
 *
 * @param {string} placeId   — unique identifier (id or name)
 * @param {string} category  — category key
 * @param {object} options   — { width, height }
 */
export function getStockImageUrl(placeId, category, { width = 600, height = 400 } = {}) {
  const queries = CATEGORY_QUERIES[category?.toLowerCase()] || CATEGORY_QUERIES.default;
  const hash = hashStr(String(placeId));
  const query = queries[hash % queries.length];
  // source.unsplash.com delivers a real photo for the query, no API key needed
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}&sig=${hash}`;
}

/**
 * Resolve the best available image for a place.
 * Returns { url, source: 'real' | 'stock' | 'ai' }
 *
 * @param {object} place   — { id, name, category, image?, photos?, photo? }
 * @param {object} options — { width, height, generateAI }
 */
export async function resolveImage(place, { width = 600, height = 400, generateAI = false } = {}) {
  // 1. Real photo from entity
  const realUrl = place.image || place.photo || place.photos?.[0] || null;
  if (realUrl && isValidUrl(realUrl)) {
    return { url: realUrl, source: 'real' };
  }

  // 2. Unsplash stock (always available, no key)
  const identifier = place.id || place.name || 'place';
  const stockUrl = getStockImageUrl(identifier, place.category, { width, height });
  return { url: stockUrl, source: 'stock' };

  // Note: AI generation (step 3) is handled by SmartImage component on error
}

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Get a placeholder gradient for a category (shown while image loads)
 */
export function getCategoryGradient(category) {
  const gradients = {
    restaurant:    'from-orange-100 to-amber-50',
    food_drinks:   'from-yellow-100 to-orange-50',
    hotel:         'from-blue-100 to-cyan-50',
    accommodation: 'from-blue-100 to-indigo-50',
    pharmacy:      'from-green-100 to-emerald-50',
    medical:       'from-teal-100 to-green-50',
    transport:     'from-slate-100 to-gray-50',
    taxi:          'from-yellow-100 to-amber-50',
    activities:    'from-cyan-100 to-blue-50',
    attraction:    'from-amber-100 to-yellow-50',
    shopping:      'from-purple-100 to-pink-50',
    nightlife:     'from-violet-100 to-purple-50',
    beach:         'from-sky-100 to-cyan-50',
    default:       'from-secondary to-background',
  };
  return gradients[category?.toLowerCase()] || gradients.default;
}

export const CATEGORY_EMOJI = {
  restaurant:    '🍽️',
  food_drinks:   '☕',
  hotel:         '🏨',
  accommodation: '🏠',
  pharmacy:      '💊',
  medical:       '🏥',
  transport:     '🚗',
  taxi:          '🚕',
  activities:    '🤿',
  attraction:    '🏛️',
  shopping:      '🛍️',
  nightlife:     '🌙',
  beach:         '🏖️',
  tour:          '🗺️',
  guide:         '🧭',
  driver:        '🚘',
  default:       '📍',
};