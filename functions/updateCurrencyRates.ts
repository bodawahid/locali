import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Update currency rates from Open Exchange Rates API (free tier + fallbacks)
// Runs every 1 hour automatically via automation

const FALLBACK_SOURCES = [
  {
    name: 'openexchangerates',
    url: 'https://openexchangerates.org/api/latest.json',
    key: Deno.env.get('OPENEXCHANGERATES_KEY'),
    parse: (data) => ({
      usd: 1, // base
      eur: data.rates?.EUR ? (1 / data.rates.EUR) : null,
      gbp: data.rates?.GBP ? (1 / data.rates.GBP) : null,
      rub: data.rates?.RUB ? (1 / data.rates.RUB) : null,
      pln: data.rates?.PLN ? (1 / data.rates.PLN) : null,
      cad: data.rates?.CAD ? (1 / data.rates.CAD) : null,
      aud: data.rates?.AUD ? (1 / data.rates.AUD) : null,
      sar: data.rates?.SAR ? (1 / data.rates.SAR) : null,
    }),
  },
  {
    name: 'google_finance',
    url: 'https://www.google.com/finance',
    parse: async () => {
      // Fallback to manual rates if needed
      return null;
    },
  },
  {
    name: 'xe_com',
    url: 'https://www.xe.com/currency_charts/egp_usd.html',
    parse: () => null,
  },
];

async function fetchFromSource(source) {
  try {
    if (source.name === 'openexchangerates') {
      const response = await fetch(`${source.url}?app_id=${source.key}&base=EGP&symbols=USD,EUR,GBP,RUB,PLN,CAD,AUD,SAR`);
      const data = await response.json();
      if (data.rates) {
        return {
          source: 'openexchangerates',
          usd: data.rates.USD,
          eur: data.rates.EUR,
          gbp: data.rates.GBP,
          rub: data.rates.RUB,
          pln: data.rates.PLN,
          cad: data.rates.CAD,
          aud: data.rates.AUD,
          sar: data.rates.SAR,
        };
      }
    }
  } catch (error) {
    console.error(`Failed to fetch from ${source.name}:`, error.message);
  }
  return null;
}

async function getLastUpdateDate(base44) {
  try {
    const rates = await base44.entities.CurrencyRate.list('-created_date', 1);
    return rates[0] || null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Try each source in order
    let rateData = null;
    let source = null;

    for (const src of FALLBACK_SOURCES) {
      rateData = await fetchFromSource(src);
      if (rateData) {
        source = src.name;
        break;
      }
    }

    if (!rateData) {
      // If all sources fail, use last known rates (fallback)
      const lastRate = await getLastUpdateDate(base44);
      if (lastRate) {
        return Response.json({
          success: false,
          message: 'All sources failed, using last known rates',
          data: lastRate,
          fallback: true,
        });
      }
      return Response.json(
        { error: 'No sources available and no cached data' },
        { status: 503 }
      );
    }

    // Update database
    const newRate = {
      ...rateData,
      rate_date: new Date().toISOString().split('T')[0],
      source: source,
      change_usd: null,
      change_eur: null,
      alert: null,
    };

    // Check for significant changes
    const lastRate = await getLastUpdateDate(base44);
    if (lastRate) {
      newRate.change_usd = ((rateData.usd - lastRate.usd) / lastRate.usd * 100).toFixed(2);
      newRate.change_eur = ((rateData.eur - lastRate.eur) / lastRate.eur * 100).toFixed(2);

      if (Math.abs(newRate.change_usd) > 2 || Math.abs(newRate.change_eur) > 2) {
        newRate.alert = `Significant change detected! USD: ${newRate.change_usd}% | EUR: ${newRate.change_eur}%`;
      }
    }

    await base44.entities.CurrencyRate.create(newRate);

    return Response.json({
      success: true,
      message: 'Currency rates updated',
      data: newRate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});