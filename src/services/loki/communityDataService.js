import { formatCommunityIntelForLoki, getCommunityIntel } from '@/data/communityIntel';

export function fetchCommunityPrices(cityId = null, query = '') {
  return formatCommunityIntelForLoki(cityId, query);
}

export function searchCommunityPrices(query = '', cityId = null) {
  return getCommunityIntel(cityId, query);
}

/** Instant sync context — no API wait */
export function getInstantCommunityContext(cityId, userMessage = '') {
  const priceKeywords = ['price', 'cost', 'how much', 'fair', 'taxi', 'سعر', 'كام', 'بكام', 'جنيه', 'transfer', 'airport'];
  const t = userMessage.toLowerCase();
  const isPriceQuery = priceKeywords.some((k) => t.includes(k));
  const intel = getCommunityIntel(cityId, isPriceQuery ? userMessage : '');
  if (!intel.length && cityId) return formatCommunityIntelForLoki(cityId);
  return formatCommunityIntelForLoki(cityId, isPriceQuery ? userMessage : '');
}
