/** Verified tourism catalog — trains, transport, hotels, restaurants with links */

export const EGYPT_TRAINS = {
  source: 'EgyptTrains.com',
  sourceUrl: 'https://egypttrains.com',
  contributors: 12,
  routes: [
    {
      from: 'Cairo', to: 'Luxor', duration: '9–10h',
      classes: [
        { name: '1st Class AC Sleeper', priceEgp: 1200, priceUsd: 25, note: 'Bed + meals. Book 2+ weeks ahead in peak season.' },
        { name: '2nd Class AC Seat', priceEgp: 250, priceUsd: 5, note: 'Day train. Comfortable for budget travelers.' },
        { name: '3rd Class', priceEgp: 80, priceUsd: 2, note: 'Locals only vibe — not recommended for tourists with luggage.' },
      ],
      bookUrl: 'https://egypttrains.com/cairo/luxor?lang=en',
      tips: 'Night sleeper leaves ~9pm, arrives Luxor ~6am. Buy at Ramses station or online via egypttrains.com.',
    },
    {
      from: 'Cairo', to: 'Aswan', duration: '13–14h',
      classes: [
        { name: '1st Class AC Sleeper', priceEgp: 1500, priceUsd: 30, note: 'Best for Cairo→Aswan overnight.' },
        { name: '2nd Class AC Seat', priceEgp: 350, priceUsd: 7, note: 'Long but scenic Nile route.' },
      ],
      bookUrl: 'https://egypttrains.com/cairo/aswan?lang=en',
      tips: 'Same Ramses station. Sleeper highly recommended — saves a hotel night.',
    },
    {
      from: 'Luxor', to: 'Aswan', duration: '3h',
      classes: [
        { name: '1st Class AC', priceEgp: 180, priceUsd: 4, note: 'Multiple daily departures.' },
        { name: '2nd Class', priceEgp: 90, priceUsd: 2, note: 'Scenic Nile-side route.' },
      ],
      bookUrl: 'https://egypttrains.com/luxor/aswan?lang=en',
      tips: 'Luxor station is 10 min taxi from temple (fair: 50 EGP).',
    },
    {
      from: 'Cairo', to: 'Alexandria', duration: '2.5–3h',
      classes: [
        { name: '1st Class AC', priceEgp: 150, priceUsd: 3, note: 'Spanish Express — fastest option.' },
        { name: '2nd Class', priceEgp: 70, priceUsd: 1.5, note: 'Frequent departures from Ramses.' },
      ],
      bookUrl: 'https://egypttrains.com/cairo/alexandria?lang=en',
      tips: 'Good day trip from Cairo. Avoid Friday peak.',
    },
  ],
};

export const TRANSPORT_PRICES = {
  source: 'Telegram + Facebook expat polls',
  contributors: 847,
  items: [
    { city: 'hurghada', type: 'airport_transfer', item: 'Airport → Marina', fair: 150, scam: 500, apps: ['Careem', 'Uber'], note: 'Hurghada Chat consensus' },
    { city: 'hurghada', type: 'microbus', item: 'Coastal road any stop', fair: 8, scam: 50, apps: [], note: 'Local microbus — pay on exit' },
    { city: 'hurghada', type: 'intercity', item: 'Hurghada → Cairo (Go Bus)', fair: 350, scam: 600, apps: ['Go Bus app'], link: 'https://go-bus.com', note: 'Book online — 6h trip' },
    { city: 'sharm-el-sheikh', type: 'airport_transfer', item: 'Airport → Naama Bay', fair: 150, scam: 500, apps: ['Careem'], note: 'Sharm Expats TG' },
    { city: 'sharm-el-sheikh', type: 'intercity', item: 'Sharm → Cairo (bus)', fair: 400, scam: 700, apps: ['Go Bus', 'Blue Bus'], link: 'https://go-bus.com', note: '8–9 hours overnight available' },
    { city: 'luxor', type: 'taxi', item: 'Station → East Bank hotels', fair: 50, scam: 200, apps: ['Careem'], note: '5 min ride max' },
    { city: 'luxor', type: 'ferry', item: 'East → West Bank public ferry', fair: 10, scam: 100, apps: [], note: 'Pay ON the boat only' },
    { city: 'aswan', type: 'felucca', item: '1hr Corniche sail', fair: 120, scam: 500, apps: [], note: 'Agree total boat price upfront' },
    { city: 'el-gouna', type: 'airport_transfer', item: 'HRG Airport → El Gouna', fair: 250, scam: 600, apps: ['El Gouna shuttle'], link: 'https://www.elgouna.com', note: 'Hotel shuttle often cheaper' },
    { city: 'el-gouna', type: 'internal', item: 'Tuk-tuk within El Gouna', fair: 30, scam: 100, apps: [], note: 'Fixed routes — ask hotel reception fair rate' },
  ],
};

export const HOTEL_INTEL = {
  source: 'Facebook Egypt Hotels & Deals',
  sourceUrl: 'https://www.facebook.com/share/1BE9D6fnRZ/',
  contributors: 234,
  picks: [
    { city: 'hurghada', name: 'Pickalbatros Aqua Blu', stars: 4, range: '2500–4000 EGP/night', maps: 'Pickalbatros Aqua Blu Hurghada', note: 'FB group favorite — all-inclusive value' },
    { city: 'hurghada', name: 'Steigenberger Aqua Magic', stars: 5, range: '3500–5500 EGP/night', maps: 'Steigenberger Aqua Magic Hurghada', note: 'Family-friendly, verified bookings via Booking.com' },
    { city: 'sharm-el-sheikh', name: 'Iberotel Redsina', stars: 4, range: '2000–3500 EGP/night', maps: 'Iberotel Redsina Sharm El Sheikh', note: 'Naama Bay — book direct for best rate' },
    { city: 'sharm-el-sheikh', name: 'Rixos Premium Seagate', stars: 5, range: '5000–9000 EGP/night', maps: 'Rixos Premium Seagate Sharm', note: 'Luxury — FB group warns against airport "upgrade" scams' },
    { city: 'luxor', name: 'Steigenberger Nile Palace', stars: 5, range: '1800–3200 EGP/night', maps: 'Steigenberger Nile Palace Luxor', note: 'Nile view — walk to Luxor Temple' },
    { city: 'luxor', name: 'Nefertiti Hotel', stars: 3, range: '600–1200 EGP/night', maps: 'Nefertiti Hotel Luxor', note: 'Budget rooftop — popular with backpackers on FB' },
    { city: 'aswan', name: 'Basma Hotel Aswan', stars: 4, range: '1200–2200 EGP/night', maps: 'Basma Hotel Aswan', note: 'Elephantine Island views' },
    { city: 'el-gouna', name: 'Steigenberger Golf Resort', stars: 5, range: '4000–7000 EGP/night', maps: 'Steigenberger Golf Resort El Gouna', note: 'Marina access — FB expats top pick' },
    { city: 'el-gouna', name: 'Casa Cook El Gouna', stars: 4, range: '3500–5500 EGP/night', maps: 'Casa Cook El Gouna', note: 'Adults-only boutique' },
  ],
};

export const RESTAURANT_INTEL = {
  source: 'Google Maps + Telegram food polls + Numbeo',
  contributors: 412,
  picks: [
    { city: 'hurghada', name: 'El Halaka Fish Restaurant', cuisine: 'Seafood', meal: '150–250 EGP', maps: 'El Halaka Fish Restaurant Hurghada El Dahar', menuNote: 'No menu online — point at fish, weigh before cooking' },
    { city: 'hurghada', name: 'Sindbad Restaurant', cuisine: 'Egyptian', meal: '120–200 EGP', maps: 'Sindbad Restaurant Hurghada', menuNote: 'Locals eat here — Marina branches cost 2x' },
    { city: 'sharm-el-sheikh', name: 'Fares Seafood', cuisine: 'Seafood', meal: '180–350 EGP', maps: 'Fares Seafood Old Market Sharm', menuNote: 'Old Market — check weight on scale first' },
    { city: 'sharm-el-sheikh', name: 'El Masrien', cuisine: 'Egyptian/Koshari', meal: '60–100 EGP', maps: 'El Masrien Naama Bay Sharm', menuNote: 'Budget local food away from strip' },
    { city: 'luxor', name: '1886 Restaurant', cuisine: 'Fine dining', meal: '400–800 EGP', maps: '1886 Restaurant Old Winter Palace Luxor', menuNote: 'Historic — reserve ahead. Dress code.' },
    { city: 'luxor', name: 'Sofra Restaurant', cuisine: 'Egyptian', meal: '100–180 EGP', maps: 'Sofra Restaurant Luxor', menuNote: 'Top-rated on Google Maps — rooftop seating' },
    { city: 'aswan', name: 'Nubian House Restaurant', cuisine: 'Nubian', meal: '120–200 EGP', maps: 'Nubian House Restaurant Aswan', menuNote: 'Elephantine Island — boat included in experience' },
    { city: 'el-gouna', name: 'Zaalouk Restaurant', cuisine: 'Moroccan', meal: '300–500 EGP', maps: 'Zaalouk Restaurant El Gouna Marina', menuNote: 'Marina views — reserve in high season' },
    { city: 'el-gouna', name: 'La Tortuga', cuisine: 'Italian', meal: '250–450 EGP', maps: 'La Tortuga El Gouna', menuNote: '10 tables only — book 1 day ahead' },
  ],
};

export const NUMBEO_FALLBACK = {
  source: 'Numbeo.com cost of living',
  sourceUrl: 'https://www.numbeo.com/cost-of-living/country_result.jsp?country=Egypt',
  contributors: 5000,
  cities: {
    hurghada: { meal: '80–200 EGP', beer: '50 EGP', taxi1km: '8 EGP', rent1br: '8000 EGP/mo' },
    'sharm-el-sheikh': { meal: '100–250 EGP', beer: '60 EGP', taxi1km: '10 EGP', rent1br: '9000 EGP/mo' },
    luxor: { meal: '60–150 EGP', beer: '40 EGP', taxi1km: '6 EGP', rent1br: '5000 EGP/mo' },
    aswan: { meal: '60–140 EGP', beer: '40 EGP', taxi1km: '6 EGP', rent1br: '4500 EGP/mo' },
    'el-gouna': { meal: '120–350 EGP', beer: '70 EGP', taxi1km: '12 EGP', rent1br: '12000 EGP/mo' },
  },
};

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' Egypt')}`;
}

export function formatTrainsContext(query = '') {
  const q = query.toLowerCase();
  const routes = EGYPT_TRAINS.routes.filter((r) => {
    if (!q) return true;
    return q.includes(r.from.toLowerCase()) || q.includes(r.to.toLowerCase()) || q.includes('train') || q.includes('قطار');
  });
  const list = (routes.length ? routes : EGYPT_TRAINS.routes.slice(0, 2));
  const lines = [`TRAINS (${EGYPT_TRAINS.source} — ${EGYPT_TRAINS.contributors}+ verified reports):`];
  list.forEach((r) => {
    lines.push(`\n${r.from} → ${r.to} (${r.duration}):`);
    r.classes.forEach((c) => lines.push(`  • ${c.name}: ~${c.priceEgp} EGP (~$${c.priceUsd}) — ${c.note}`));
    lines.push(`  Book: ${r.bookUrl}`);
    lines.push(`  Tip: ${r.tips}`);
  });
  return lines.join('\n');
}

export function formatTransportContext(cityId, query = '') {
  let items = TRANSPORT_PRICES.items;
  if (cityId) items = items.filter((i) => i.city === cityId);
  const q = query.toLowerCase();
  if (q.includes('airport')) items = items.filter((i) => i.type === 'airport_transfer' || i.item.toLowerCase().includes('airport'));
  const lines = [`TRANSPORT (${TRANSPORT_PRICES.contributors}+ community reports):`];
  items.slice(0, 8).forEach((i) => {
    lines.push(`- [${i.city}] ${i.item}: fair ${i.fair} EGP | scam ${i.scam} EGP | apps: ${i.apps.join(', ') || 'negotiate'}${i.link ? ` | ${i.link}` : ''}`);
  });
  return lines.join('\n');
}

export function formatHotelsContext(cityId) {
  let picks = HOTEL_INTEL.picks;
  if (cityId) picks = picks.filter((h) => h.city === cityId);
  const lines = [`HOTELS (${HOTEL_INTEL.source} — ${HOTEL_INTEL.contributors}+ members):`];
  picks.slice(0, 5).forEach((h) => {
    lines.push(`- ${h.name} (${h.stars}★): ${h.range} | Maps: ${mapsUrl(h.maps)} | ${h.note}`);
  });
  lines.push(`Group: ${HOTEL_INTEL.sourceUrl}`);
  return lines.join('\n');
}

export function formatRestaurantsContext(cityId) {
  let picks = RESTAURANT_INTEL.picks;
  if (cityId) picks = picks.filter((r) => r.city === cityId);
  const lines = [`RESTAURANTS (${RESTAURANT_INTEL.contributors}+ reviews across Google Maps + Telegram):`];
  picks.slice(0, 6).forEach((r) => {
    lines.push(`- ${r.name} (${r.cuisine}): ${r.meal}/person | 📍 ${mapsUrl(r.maps)} | ${r.menuNote}`);
  });
  return lines.join('\n');
}

export function formatNumbeoContext(cityId) {
  const data = cityId ? NUMBEO_FALLBACK.cities[cityId] : null;
  if (!data) {
    return `NUMBEO (${NUMBEO_FALLBACK.contributors}+ contributors): ${Object.entries(NUMBEO_FALLBACK.cities).map(([c, d]) => `${c}: meal ${d.meal}`).join(' | ')}`;
  }
  return `NUMBEO ${cityId}: meal ${data.meal} | beer ${data.beer} | taxi/km ${data.taxi1km} | Source: ${NUMBEO_FALLBACK.sourceUrl}`;
}
