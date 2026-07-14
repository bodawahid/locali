/**
 * Scam hotspots — 5 Locali cities: Sharm, Hurghada, Luxor, Aswan, El Gouna
 */
export const LOCALI_CITIES = ['sharm-el-sheikh', 'hurghada', 'luxor', 'aswan', 'el-gouna'];

export const SCAM_HOTSPOTS = [
  {
    id: 'naama-bay-taxi',
    title: 'Naama Bay Taxi Stand',
    city: 'sharm-el-sheikh',
    category: 'taxi',
    severity: 'high',
    lat: 27.9142,
    lng: 34.3299,
    location_name: 'Naama Bay, Sharm El Sheikh',
    description: 'Beach-front taxi stands quote 200–500 EGP for 5-min trips. Use Careem or walk to main road.',
    source: 'Sharm Expats Telegram',
    googleQuery: 'Naama Bay Sharm El Sheikh',
  },
  {
    id: 'sharm-airport-taxi',
    title: 'Sharm Airport Curbside Touts',
    city: 'sharm-el-sheikh',
    category: 'taxi',
    severity: 'high',
    lat: 27.9772,
    lng: 34.3947,
    location_name: 'Sharm El Sheikh International Airport',
    description: 'Curbside drivers quote 400–600 EGP. Official desk inside: ~150 EGP to Naama Bay.',
    source: 'Sharm_el_Sheikh_live Telegram',
    googleQuery: 'Sharm El Sheikh International Airport',
  },
  {
    id: 'sharm-old-market',
    title: 'Old Market Shopping Pressure',
    city: 'sharm-el-sheikh',
    category: 'shopping',
    severity: 'medium',
    lat: 27.8595,
    lng: 34.3114,
    location_name: 'Old Market, Sharm El Sheikh',
    description: 'Fake "closing sale" papyrus and perfume scams.',
    source: 'Facebook Egypt Expats',
    googleQuery: 'Old Market Sharm El Sheikh',
  },
  {
    id: 'hurghada-airport-taxi',
    title: 'Hurghada Airport Taxi Scam',
    city: 'hurghada',
    category: 'taxi',
    severity: 'high',
    lat: 27.1783,
    lng: 33.7994,
    location_name: 'Hurghada International Airport',
    description: 'Drivers quote 400–600 EGP to Marina. Fair: 100–150 EGP (Hurghada Chat).',
    source: 'Hurghada Chat Telegram',
    googleQuery: 'Hurghada International Airport',
  },
  {
    id: 'hurghada-marina-touts',
    title: 'Marina Excursion Touts',
    city: 'hurghada',
    category: 'tour',
    severity: 'medium',
    lat: 27.2561,
    lng: 33.8258,
    location_name: 'Hurghada Marina',
    description: 'Beach excursion sellers inflate boat trips 2–3x.',
    source: 'Facebook Hurghada Expats',
    googleQuery: 'Hurghada Marina',
  },
  {
    id: 'hurghada-senzo-mall',
    title: 'Senzo Mall Taxi Overcharge',
    city: 'hurghada',
    category: 'taxi',
    severity: 'medium',
    lat: 27.2412,
    lng: 33.8421,
    location_name: 'Senzo Mall, Hurghada',
    description: 'Taxi queue at mall exit targets tourists leaving shopping.',
    source: 'Hurghada Chat Telegram',
    googleQuery: 'Senzo Mall Hurghada',
  },
  {
    id: 'luxor-ferry-scam',
    title: 'Luxor Ferry Ticket Scam',
    city: 'luxor',
    category: 'transport',
    severity: 'high',
    lat: 25.6972,
    lng: 32.6262,
    location_name: 'Luxor Public Ferry, East Bank',
    description: 'Fake ticket sellers before gangway. Real ferry: 5–10 EGP, pay on boat only.',
    source: 'Facebook Egypt Expats',
    googleQuery: 'Luxor Ferry West Bank',
  },
  {
    id: 'luxor-valley-touts',
    title: 'Valley of Kings Unlicensed Guides',
    city: 'luxor',
    category: 'tour',
    severity: 'medium',
    lat: 25.7402,
    lng: 32.6014,
    location_name: 'Valley of the Kings',
    description: 'Fake photo fines and unlicensed guides at tomb entrances.',
    source: 'Google Maps reviews',
    googleQuery: 'Valley of the Kings Luxor',
  },
  {
    id: 'luxor-station-taxi',
    title: 'Luxor Train Station Taxi Trap',
    city: 'luxor',
    category: 'taxi',
    severity: 'high',
    lat: 25.6989,
    lng: 32.6421,
    location_name: 'Luxor Railway Station',
    description: 'Arriving train passengers targeted. Fair to temple: 50 EGP max.',
    source: 'Facebook Egypt Expats',
    googleQuery: 'Luxor Railway Station',
  },
  {
    id: 'aswan-felucca',
    title: 'Corniche Felucca Overcharge',
    city: 'aswan',
    category: 'transport',
    severity: 'medium',
    lat: 24.0889,
    lng: 32.8998,
    location_name: 'Aswan Corniche',
    description: 'Per-person pricing tricks. Agree total EGP for whole boat before boarding.',
    source: 'Facebook Egypt Expats',
    googleQuery: 'Aswan Corniche Nile',
  },
  {
    id: 'aswan-nubian-fee',
    title: 'Fake Nubian Village Entry Fee',
    city: 'aswan',
    category: 'tour',
    severity: 'medium',
    lat: 24.0789,
    lng: 32.8876,
    location_name: 'Nubian Village, Aswan',
    description: '"Entry fee" at door is a scam — villages are free to visit.',
    source: 'Facebook Egypt Expats',
    googleQuery: 'Nubian Village Aswan',
  },
  {
    id: 'elgouna-gate-taxi',
    title: 'El Gouna Gate Taxi Overcharge',
    city: 'el-gouna',
    category: 'taxi',
    severity: 'medium',
    lat: 27.3962,
    lng: 33.6778,
    location_name: 'El Gouna Main Gate',
    description: 'Airport transfers quoted 600+ EGP. Fair: 200–280 EGP. Use hotel shuttle.',
    source: 'Facebook El Gouna Expats',
    googleQuery: 'El Gouna Egypt gate',
  },
  {
    id: 'elgouna-marina-excursion',
    title: 'Marina Excursion Markup',
    city: 'el-gouna',
    category: 'tour',
    severity: 'medium',
    lat: 27.4078,
    lng: 33.6821,
    location_name: 'Abu Tig Marina, El Gouna',
    description: 'Hotel desk excursions 30–50% above direct booking at marina.',
    source: 'Facebook Egypt Hotels group',
    googleQuery: 'Abu Tig Marina El Gouna',
  },
];

export const CITY_MAP_CENTER = {
  'sharm-el-sheikh': { lat: 27.9158, lng: 34.3300, zoom: 12 },
  hurghada: { lat: 27.2574, lng: 33.8129, zoom: 12 },
  luxor: { lat: 25.6872, lng: 32.6396, zoom: 13 },
  aswan: { lat: 24.0889, lng: 32.8998, zoom: 13 },
  'el-gouna': { lat: 27.3962, lng: 33.6778, zoom: 13 },
  all: { lat: 26.5, lng: 32.5, zoom: 7 },
};

const SEVERITY_COLORS = { high: '#ef4444', medium: '#f97316', low: '#eab308' };

export function mergeScamMarkers(dbReports = [], cityFilter = '') {
  const hotspots = cityFilter
    ? SCAM_HOTSPOTS.filter((h) => h.city === cityFilter)
    : SCAM_HOTSPOTS;

  const fromDb = dbReports
    .filter((r) => !cityFilter || r.city === cityFilter)
    .filter((r) => LOCALI_CITIES.includes(r.city))
    .map((r, i) => {
      if (r.latitude && r.longitude) {
        return {
          id: r.id || `db-${i}`,
          title: r.title,
          city: r.city,
          category: r.category,
          severity: r.severity || 'medium',
          lat: Number(r.latitude),
          lng: Number(r.longitude),
          location_name: r.location_name,
          description: r.description,
          source: 'community_report',
        };
      }
      const match = SCAM_HOTSPOTS.find((h) => h.city === r.city);
      if (match) {
        return { ...match, id: r.id || match.id, title: r.title, description: r.description || match.description, source: 'community_report' };
      }
      return null;
    })
    .filter(Boolean);

  const seen = new Set();
  return [...fromDb, ...hotspots]
    .filter((m) => {
      const key = `${m.lat?.toFixed(3)}-${m.lng?.toFixed(3)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return m.lat && m.lng;
    })
    .map((m) => ({ ...m, color: SEVERITY_COLORS[m.severity] || SEVERITY_COLORS.medium }));
}
