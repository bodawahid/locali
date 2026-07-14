import { localApi } from '@/api/localApi';
import { CITY_PRICES } from '@/lib/cityContent';
import { NUMBEO_CITIES } from '@/lib/loki/dataSources';
import { FALLBACK_RATES } from '@/hooks/useLiveRates';

const NUMBEO_API = 'https://www.numbeo.com/api/city_prices';

/**
 * Fetch Numbeo price indices when VITE_NUMBEO_API_KEY is set.
 * Falls back to Locali cityContent price tables.
 */
export async function fetchPriceContext(cityId = null) {
  const lines = [];
  const apiKey = import.meta.env?.VITE_NUMBEO_API_KEY;

  if (apiKey && cityId && NUMBEO_CITIES[cityId]) {
    try {
      const query = encodeURIComponent(NUMBEO_CITIES[cityId]);
      const res = await fetch(`${NUMBEO_API}?api_key=${apiKey}&query=${query}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.prices?.length) {
          lines.push(`NUMBEO PRICES (${NUMBEO_CITIES[cityId]}):`);
          data.prices.slice(0, 12).forEach((p) => {
            lines.push(`- ${p.item_name}: ${p.average_price} ${p.currency || 'EGP'}`);
          });
        }
      }
    } catch {
      /* fall through to local data */
    }
  }

  const cities = cityId ? [cityId] : Object.keys(CITY_PRICES);
  cities.forEach((cid) => {
    const prices = CITY_PRICES[cid];
    if (!prices?.length) return;
    const cityName = NUMBEO_CITIES[cid] || cid;
    lines.push(`\nLOCALI FAIR PRICES (${cityName}) — local / fair tourist / scam (EGP):`);
    prices.slice(0, 15).forEach((p) => {
      lines.push(`- ${p.item}: local ${p.local} | fair ${p.fair} | scam ${p.scam} — ${p.note || ''}`);
    });
  });

  return lines.join('\n') || 'No price data available.';
}

export async function fetchCurrencyContext() {
  try {
    const records = await localApi.entities.CurrencyRate.list('-created_date', 1);
    const r = records?.[0];
    if (r) {
      return `CURRENCY (CBE/Locali): USD=${r.usd} EGP | EUR=${r.eur} | GBP=${r.gbp} | date=${r.rate_date || 'today'}`;
    }
  } catch {
    /* fallback */
  }
  return `CURRENCY (fallback): USD=${FALLBACK_RATES.usd} EGP | EUR=${FALLBACK_RATES.eur} | GBP=${FALLBACK_RATES.gbp}`;
}
