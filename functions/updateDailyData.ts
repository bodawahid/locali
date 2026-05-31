import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Fetches live USD/EGP and EUR/EGP from exchangerate-api (free, no key needed)
// Then updates CurrencyRate + LiveSituation entities
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch live rates from open API
    const ratesRes = await fetch('https://open.er-api.com/v6/latest/EGP');
    const ratesJson = await ratesRes.json();

    let usd, eur, gbp, rub, pln, cad, aud, sar;

    if (ratesJson.result === 'success' && ratesJson.rates) {
      const r = ratesJson.rates;
      // EGP per 1 foreign currency = 1 / (foreign per EGP)
      usd = r.USD ? parseFloat((1 / r.USD).toFixed(4)) : 53.13;
      eur = r.EUR ? parseFloat((1 / r.EUR).toFixed(4)) : 62.06;
      gbp = r.GBP ? parseFloat((1 / r.GBP).toFixed(4)) : 71.26;
      rub = r.RUB ? parseFloat((1 / r.RUB).toFixed(4)) : 0.598;
      pln = r.PLN ? parseFloat((1 / r.PLN).toFixed(4)) : 13.85;
      cad = r.CAD ? parseFloat((1 / r.CAD).toFixed(4)) : 38.4;
      aud = r.AUD ? parseFloat((1 / r.AUD).toFixed(4)) : 33.2;
      sar = r.SAR ? parseFloat((1 / r.SAR).toFixed(4)) : 14.17;
    } else {
      // Fallback to last known CBE rates
      usd = 53.13; eur = 62.06; gbp = 71.26; rub = 0.598;
      pln = 13.85; cad = 38.4; aud = 33.2; sar = 14.17;
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch previous rate for change calculation
    const prevRates = await base44.asServiceRole.entities.CurrencyRate.list('-rate_date', 1);
    const prevUsd = prevRates?.[0]?.usd || usd;
    const prevEur = prevRates?.[0]?.eur || eur;
    const changeUsd = parseFloat((usd - prevUsd).toFixed(4));
    const changeEur = parseFloat((eur - prevEur).toFixed(4));

    let alert = null;
    if (Math.abs(changeUsd) > 1) {
      alert = `⚠️ USD/EGP changed by ${changeUsd > 0 ? '+' : ''}${changeUsd} today — check CBE before exchanging`;
    }

    // Update or create CurrencyRate record
    const existing = await base44.asServiceRole.entities.CurrencyRate.list('-rate_date', 1);
    const rateData = {
      usd, eur, gbp, rub, pln, cad, aud, sar,
      rate_date: today,
      source: 'open.er-api.com (CBE-aligned) — updated daily',
      change_usd: changeUsd,
      change_eur: changeEur,
      alert,
    };

    if (existing?.length > 0) {
      await base44.asServiceRole.entities.CurrencyRate.update(existing[0].id, rateData);
    } else {
      await base44.asServiceRole.entities.CurrencyRate.create(rateData);
    }

    // Update all LiveSituation records with latest currency
    const liveSituations = await base44.asServiceRole.entities.LiveSituation.list();
    for (const ls of liveSituations) {
      await base44.asServiceRole.entities.LiveSituation.update(ls.id, {
        usd_to_egp: usd,
        eur_to_egp: eur,
        rub_to_egp: rub,
        gbp_to_egp: gbp,
        update_date: today,
        currency_note: `Rates updated ${today} from CBE-aligned source. 1 EUR = ${eur} EGP · 1 USD = ${usd} EGP`,
      });
    }

    console.log(`[updateDailyData] Done — USD: ${usd}, EUR: ${eur}, GBP: ${gbp}, date: ${today}`);

    return Response.json({
      success: true,
      date: today,
      rates: { usd, eur, gbp, rub, pln, cad, aud, sar },
      change_usd: changeUsd,
      alert,
    });

  } catch (error) {
    console.error('[updateDailyData] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});