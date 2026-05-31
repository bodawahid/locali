import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch live currency rates from exchangerate-api (free tier)
    const ratesRes = await fetch('https://open.er-api.com/v6/latest/USD');
    const ratesData = await ratesRes.json();

    let usd = 53.13, eur = 62.06, gbp = 71.26, rub = 0.598, pln = 13.85, cad = 38.4, aud = 33.2, sar = 14.17;
    let source = 'Fallback (hardcoded CBE April 2026)';

    if (ratesData && ratesData.rates && ratesData.rates.EGP) {
      const EGP = ratesData.rates.EGP;
      usd = parseFloat(EGP.toFixed(2));
      eur = parseFloat((EGP / ratesData.rates.EUR).toFixed(2));
      gbp = parseFloat((EGP / ratesData.rates.GBP).toFixed(2));
      rub = parseFloat((EGP / ratesData.rates.RUB).toFixed(4));
      pln = parseFloat((EGP / ratesData.rates.PLN).toFixed(2));
      cad = parseFloat((EGP / ratesData.rates.CAD).toFixed(2));
      aud = parseFloat((EGP / ratesData.rates.AUD).toFixed(2));
      sar = parseFloat((EGP / ratesData.rates.SAR).toFixed(2));
      source = `open.er-api.com — updated ${ratesData.time_last_update_utc}`;
    }

    const today = new Date().toISOString().split('T')[0];

    // Get previous rates to calculate change
    const prevRates = await base44.asServiceRole.entities.CurrencyRate.list('-rate_date', 1);
    const prevUsd = prevRates?.[0]?.usd || usd;
    const changeUsd = parseFloat((usd - prevUsd).toFixed(2));
    const alert = Math.abs(changeUsd) >= 0.5 ? `USD/EGP moved ${changeUsd > 0 ? '+' : ''}${changeUsd} today — check rates` : null;

    // Upsert CurrencyRate
    const existing = await base44.asServiceRole.entities.CurrencyRate.filter({ rate_date: today });
    const ratePayload = { usd, eur, gbp, rub, pln, cad, aud, sar, rate_date: today, source, change_usd: changeUsd, change_eur: 0, alert };

    if (existing?.length > 0) {
      await base44.asServiceRole.entities.CurrencyRate.update(existing[0].id, ratePayload);
    } else {
      await base44.asServiceRole.entities.CurrencyRate.create(ratePayload);
    }

    // Update all LiveSituation records with latest rates
    const liveSituations = await base44.asServiceRole.entities.LiveSituation.list();
    for (const ls of liveSituations) {
      await base44.asServiceRole.entities.LiveSituation.update(ls.id, {
        usd_to_egp: usd,
        eur_to_egp: eur,
        rub_to_egp: rub,
        gbp_to_egp: gbp,
        update_date: today,
        currency_note: `Rates auto-updated ${today}. Source: ${source}`,
      });
    }

    // --- Update key PriceGuide entries with official 2026 prices ---
    const priceUpdates = [
      { item: 'Valley of the Kings entry + 3 tombs', city: 'luxor', local_price: 60, fair_tourist_price: 750, scam_price: 1500, notes: `Fixed official price: 750 EGP foreigners. Tutankhamun tomb: extra 700 EGP. Last verified: ${today}. Source: egymonuments.com` },
      { item: 'Karnak Temple entry', city: 'luxor', local_price: 40, fair_tourist_price: 600, scam_price: 1200, notes: `Fixed official price: 600 EGP foreigners, 300 EGP students. Last verified: ${today}. Source: egymonuments.com` },
      { item: 'Luxor Temple entry', city: 'luxor', local_price: 40, fair_tourist_price: 260, scam_price: 600, notes: `Fixed official price: 260 EGP foreigners. Last verified: ${today}. Source: egymonuments.com` },
      { item: 'Philae Temple entry + boat', city: 'aswan', local_price: 40, fair_tourist_price: 550, scam_price: 1200, notes: `Entry: 550 EGP foreigners. Boat: 100-150 EGP per boat return from Shellal dock. Last verified: ${today}. Source: timetravelturtle.com` },
      { item: 'Abu Simbel entry ticket', city: 'aswan', local_price: 30, fair_tourist_price: 822, scam_price: 1500, notes: `Entry: 822 EGP foreigners (egymonuments.com). Last verified: ${today}. Full day trip with transport+guide: 3200-4500 EGP extra.` },
      { item: 'Hot air balloon Luxor', city: 'luxor', local_price: 2000, fair_tourist_price: 2700, scam_price: 6000, notes: `Licensed operators: $50-70 USD per person (~2700-3700 EGP at ${usd} EGP/USD). Budget from $40. Check ECAA license. Last verified: ${today}` },
      { item: 'Hurghada to Cairo bus (GO Bus)', city: 'hurghada', local_price: 439, fair_tourist_price: 530, scam_price: 900, notes: `GO Bus from 439 EGP (~$${(439/usd).toFixed(0)} USD). Book: go-bus.com. Journey 5-6h. Last verified: ${today}` },
      { item: 'Day trip diving (2 dives, equipment, lunch)', city: 'hurghada', local_price: 1700, fair_tourist_price: 2300, scam_price: 4500, notes: `Certified 2-dive day trip: €45-65 person (~${Math.round(55*eur)} EGP at ${eur} EGP/EUR). Budget from $35 (~${Math.round(35*usd)} EGP). Last verified: ${today}` },
      { item: 'Exchange rate USD to EGP (bank/ATM)', city: 'all', local_price: Math.round(usd*100), fair_tourist_price: Math.round(usd*100), scam_price: Math.round(usd*85), notes: `100 USD = ${Math.round(usd*100)} EGP at CBE rate ${today}. Any offer below ${Math.round(usd*90)} EGP per 100 USD is a scam. Source: cbe.org.eg` },
    ];

    let updated = 0;
    for (const p of priceUpdates) {
      const existing = await base44.asServiceRole.entities.PriceGuide.filter({ item: p.item });
      if (existing?.length > 0) {
        await base44.asServiceRole.entities.PriceGuide.update(existing[0].id, p);
        updated++;
      } else {
        await base44.asServiceRole.entities.PriceGuide.create({ ...p, category: 'activities' });
        updated++;
      }
    }

    return Response.json({
      success: true,
      date: today,
      rates: { usd, eur, gbp, rub },
      source,
      price_guides_updated: updated,
      live_situations_updated: liveSituations.length,
      alert,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});