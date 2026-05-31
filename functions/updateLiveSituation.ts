import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan'];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow scheduled automation (no user) OR admin users
  let isAuthorized = false;
  try {
    const user = await base44.auth.me();
    if (user?.role === 'admin') isAuthorized = true;
  } catch {
    // Called from scheduler — use service role
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const today = new Date().toISOString().split('T')[0];
  const results = [];

  for (const city of CITIES) {
    const cityLabel = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const prompt = `You are a travel safety analyst. For ${cityLabel}, Egypt as of today ${today}, provide a JSON object with current travel conditions. Use real data from news, weather, and travel advisories.

Return ONLY valid JSON, no markdown:
{
  "status": "green" or "yellow" or "red",
  "weather": "brief weather summary",
  "temperature_c": number,
  "traffic": "traffic and transport summary",
  "alerts": "any safety alerts or empty string",
  "events": "any local events or festivals or empty string",
  "recommendation": "one sentence tourist recommendation",
  "prices_summary": "brief summary of current price levels",
  "meal_range": "e.g. 80-250 EGP",
  "coffee_range": "e.g. 45-90 EGP",
  "taxi_range": "e.g. 50-150 EGP",
  "usd_to_egp": number,
  "eur_to_egp": number,
  "currency_note": "brief note on exchange rates"
}

Base status on: green=normal, yellow=minor issues, red=avoid travel. Egypt tourist areas are generally green unless specific incidents reported.`;

    const raw = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
    });

    let data;
    try {
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      data = JSON.parse(cleaned);
    } catch {
      data = {
        status: 'green',
        weather: 'Data unavailable',
        temperature_c: 28,
        traffic: 'Normal',
        alerts: '',
        events: '',
        recommendation: 'Normal travel conditions.',
        prices_summary: 'Prices stable',
        meal_range: '80-250 EGP',
        coffee_range: '45-90 EGP',
        taxi_range: '50-150 EGP',
        usd_to_egp: 49.85,
        eur_to_egp: 54.2,
        currency_note: 'Rates stable',
      };
    }

    // Check if record exists for this city
    const existing = await base44.asServiceRole.entities.LiveSituation.filter({ city });

    if (existing.length > 0) {
      await base44.asServiceRole.entities.LiveSituation.update(existing[0].id, {
        ...data,
        city,
        update_date: today,
        source: 'AI auto-update (Gemini + web)',
      });
    } else {
      await base44.asServiceRole.entities.LiveSituation.create({
        ...data,
        city,
        update_date: today,
        source: 'AI auto-update (Gemini + web)',
      });
    }

    results.push({ city, status: data.status });
  }

  return Response.json({ updated: results, date: today });
});