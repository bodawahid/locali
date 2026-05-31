/**
 * Client-side price cache with TTL.
 * Backed by localStorage so it survives page reloads.
 * Key format: price:{category}:{city}:{item}
 */

const TTL_MS = {
  taxi: 6 * 3600_000,
  food_drinks: 6 * 3600_000,
  activities: 24 * 3600_000,
  accommodation: 48 * 3600_000,
  shopping: 12 * 3600_000,
  telecom: 7 * 24 * 3600_000,
  default: 12 * 3600_000,
};

function makeKey(item, city, category) {
  return `price:${category}:${city}:${item}`.toLowerCase().replace(/\s+/g, '_');
}

export function getCachedPrice(item, city, category) {
  try {
    const key = makeKey(item, city, category);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    const ttl = TTL_MS[category] || TTL_MS.default;
    if (Date.now() - entry.ts > ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedPrice(item, city, category, data) {
  try {
    const key = makeKey(item, city, category);
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // localStorage full or unavailable — ignore
  }
}

export function clearPriceCache() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('price:'));
    keys.forEach(k => localStorage.removeItem(k));
  } catch {}
}