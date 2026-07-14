import { localApi } from '@/api/localApi';
import { CITY_META } from '@/lib/cityContent';
import { detectCity } from '@/lib/loki/queryIntent';

const SCAM_PATTERNS = {
  'sharm-el-sheikh': [
    { type: 'taxi', area: 'Naama Bay strip', risk: 'high', note: 'Beach-front taxi stands inflate 3–5x — walk to main road or use Careem.' },
    { type: 'excursion', area: 'Beach touts', risk: 'high', note: 'Book diving/snorkeling at PADI centers, not beach sellers.' },
  ],
  hurghada: [
    { type: 'taxi', area: 'Marina / El Dahar', risk: 'high', note: 'Airport-to-hotel quotes often 500+ EGP — fair is ~150 EGP.' },
    { type: 'excursion', area: 'Hotel lobby', risk: 'medium', note: 'Hotel excursion desks add 30–50% markup.' },
  ],
  luxor: [
    { type: 'ferry', area: 'East/West Bank', risk: 'high', note: 'Public ferry is 5–10 EGP — anyone selling tickets before gangway is scamming.' },
    { type: 'guide', area: 'Valley of Kings', risk: 'medium', note: 'Unlicensed "guides" at tomb entrances.' },
  ],
  aswan: [
    { type: 'felucca', area: 'Corniche', risk: 'medium', note: 'Agree round-trip price in EGP before boarding.' },
    { type: 'nubian', area: 'Nubian villages', risk: 'low', note: '"Entry fee" demands are scams — villages are free.' },
  ],
  'el-gouna': [
    { type: 'taxi', area: 'Main Gate / Airport road', risk: 'medium', note: 'Airport transfers quoted 600+ — fair 200–280 EGP. Use hotel shuttle.' },
    { type: 'excursion', area: 'Marina hotel desks', risk: 'medium', note: '30–50% markup vs direct marina booking.' },
  ],
};

export async function fetchScamContext(userMessage = '', cityHint = null) {
  const city = cityHint || detectCity(userMessage);
  const lines = [];

  try {
    const filters = city ? { city } : {};
    const reports = await localApi.entities.ScamReport.filter(filters, '-created_date', 6);
    if (reports?.length) {
      lines.push(`SCAM REPORTS (${reports.length} community reports — Locali DB):`);
      reports.forEach((r) => {
        lines.push(`- [${r.city}] ${r.title}: ${(r.description || '').slice(0, 120)} (${r.severity})`);
      });
    }
  } catch {
    /* DB unavailable */
  }

  const patterns = city ? SCAM_PATTERNS[city] : Object.values(SCAM_PATTERNS).flat();
  if (patterns?.length) {
    lines.push('\nSCAM DETECTOR patterns:');
    patterns.forEach((p) => {
      lines.push(`- [${p.risk.toUpperCase()}] ${p.area} — ${p.note}`);
    });
  }

  if (city && CITY_META[city]) {
    lines.push(`\nCITY: ${CITY_META[city].name}`);
  }

  return { city, text: lines.join('\n') || 'No scam data — use community transport prices.' };
}

export { SCAM_PATTERNS };
