/**
 * tagElGounaServices — Admin-only function.
 * Scans all Service records and re-tags ones related to El Gouna
 * by setting city = "el-gouna". Only updates — never creates or deletes.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const EL_GOUNA_KEYWORDS = [
  'el gouna', 'el-gouna', 'elgouna',
  'abu tig', 'abu tig marina',
  'mangroovy', 'zeytuna', 'tamr henna',
  'kafr el gouna', 'kafr elgouna',
  'steigenberger golf', 'casa cook',
  'chedi el gouna', 'sheraton miramar',
  'sultan bey', 'panorama bungalow',
  'moods el gouna', 'papas bar',
  'zaalouk', 'jobo restaurant', 'saffron el gouna',
  'orientalist el gouna', 'la veranda el gouna',
  'kafr coffee',
];

function mentionsElGouna(service) {
  const haystack = [
    service.name,
    service.description,
    service.address,
    ...(service.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return EL_GOUNA_KEYWORDS.some((kw) => haystack.includes(kw));
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    // Fetch all services
    const all = await base44.asServiceRole.entities.Service.list('-created_date', 500);

    const toTag = all.filter(
      (s) => s.city !== 'el-gouna' && mentionsElGouna(s)
    );

    const results = [];
    for (const s of toTag) {
      await base44.asServiceRole.entities.Service.update(s.id, { city: 'el-gouna' });
      results.push({ id: s.id, name: s.name, old_city: s.city });
    }

    return Response.json({
      scanned: all.length,
      tagged: results.length,
      services: results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});