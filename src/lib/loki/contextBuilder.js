import { fetchScamContext } from '@/services/loki/scamDataService';
import { getInstantCommunityContext } from '@/services/loki/communityDataService';
import { fetchCommunityInsights } from '@/services/loki/communityIntelligenceService';
import { getNumbeoSnapshot } from '@/services/loki/scraperApiService';
import { fetchFreeCurrency, fetchRedditContext, fetchPlacesContext } from '@/services/loki/freeApisService';
import { localApi } from '@/api/localApi';
import { getCachedContext, setCachedContext, cacheKey, withTimeout } from './contextCache';
import { detectIntent, detectCity } from './queryIntent';
import {
  formatTrainsContext,
  formatTransportContext,
  formatHotelsContext,
  formatRestaurantsContext,
  formatNumbeoContext,
} from '@/data/tourismCatalog';

function getTimeContext() {
  const hour = new Date().getHours();
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21 || hour < 5) return 'night';
  return hour >= 12 ? 'afternoon' : 'morning';
}

async function fetchLiveSituation(cityId) {
  try {
    const filters = cityId ? { city: cityId } : {};
    const rows = await localApi.entities.LiveSituation.filter(filters, '-updated_date', 1);
    if (!rows?.length) return '';
    const r = rows[0];
    return `[${r.city}] ${r.status} | ${r.recommendation || ''}`;
  } catch {
    return '';
  }
}

function buildIntentSlices(intent, city, userMessage) {
  const slices = [];
  slices.push(getInstantCommunityContext(city, userMessage));

  if (intent === 'trains' || intent === 'general') slices.push(formatTrainsContext(userMessage));
  if (['transport', 'prices', 'urgent', 'general'].includes(intent)) slices.push(formatTransportContext(city, userMessage));
  if (intent === 'hotels' || intent === 'general') slices.push(formatHotelsContext(city));
  if (intent === 'restaurants' || intent === 'general') slices.push(formatRestaurantsContext(city));
  if (['prices', 'restaurants', 'general'].includes(intent)) slices.push(formatNumbeoContext(city));

  return slices.filter(Boolean).join('\n\n');
}

export async function buildLokiContext(userMessage = '', options = {}) {
  const city = options.city || detectCity(userMessage);
  const intent = options.intent || detectIntent(userMessage);
  const key = cacheKey(`${city}-${intent}`, userMessage.slice(0, 60));
  const cached = getCachedContext(key);
  if (cached && !options.skipCache) return { ...cached, intent };

  const coreBlock = [
    `TIME: ${getTimeContext()} | CITY: ${city || 'unknown'} | INTENT: ${intent}`,
    buildIntentSlices(intent, city, userMessage),
  ].join('\n\n');

  if (options.fast) {
    const result = { city, intent, contextBlock: coreBlock };
    setCachedContext(key, result, 90000);
    return result;
  }

  const needScam = ['safety', 'urgent', 'transport', 'prices'].includes(intent);
  const needPrices = ['prices', 'general', 'restaurants'].includes(intent);
  const needTrains = intent === 'trains';
  const needCommunity = ['transport', 'restaurants', 'general'].includes(intent);
  const needPlaces = ['restaurants', 'hotels', 'general', 'transport'].includes(intent);
  const needReddit = ['transport', 'safety', 'general'].includes(intent);

  const [scam, prices, currency, live, trains, community, places, reddit] = await Promise.all([
    needScam ? withTimeout(fetchScamContext(userMessage, city), 1200, { text: '' }) : Promise.resolve({ text: '' }),
    needPrices ? withTimeout(getNumbeoSnapshot(city), 1200, null) : Promise.resolve(null),
    needPrices ? withTimeout(fetchFreeCurrency(), 1200, { text: '' }) : Promise.resolve({ text: '' }),
    withTimeout(fetchLiveSituation(city), 800, ''),
    needTrains ? Promise.resolve('') : Promise.resolve(''),
    needCommunity ? withTimeout(fetchCommunityInsights(city, intent), 1000, '') : Promise.resolve(''),
    needPlaces ? withTimeout(fetchPlacesContext(userMessage, city), 1200, { text: '' }) : Promise.resolve({ text: '' }),
    needReddit ? withTimeout(fetchRedditContext(userMessage, city), 1200, { text: '' }) : Promise.resolve({ text: '' }),
  ]);

  let pricesText = '';
  try {
    if (prices && Array.isArray(prices.snapshot)) {
      const lines = ['NUMBEO SNAPSHOT:'];
      prices.snapshot.slice(0, 20).forEach((p) => {
        if (p && p.name) lines.push(`${p.name}: ${p.value || ''}`);
      });
      pricesText = lines.join('\n');
    } else if (prices && typeof prices === 'object') {
      pricesText = JSON.stringify(prices).slice(0, 1200);
    }
  } catch {
    pricesText = '';
  }

  const parts = [
    coreBlock,
    currency?.text,
    scam?.text,
    pricesText,
    trains,
    community,
    live,
    places?.text,
    reddit?.text,
  ].filter(Boolean);

  const result = { city, intent, contextBlock: parts.join('\n\n') };
  setCachedContext(key, result);
  return result;
}

export { detectCity, detectIntent };
