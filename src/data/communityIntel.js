/**
 * Community-sourced prices & tips from Telegram/Facebook expat groups.
 * Sources: Sharm Expats, Hurghada Chat, Sharm El Sheikh Live, Dahab Chat, Egypt FB groups.
 * Updated from recurring community reports — LOKI treats as ground-truth when DB empty.
 */

export const COMMUNITY_INTEL = [
  // ── SHARM ──
  { city: 'sharm-el-sheikh', category: 'taxi', item: 'Airport → Naama Bay', fair: 150, scam: 500, source: 'Sharm Expats TG', note: 'Official desk inside arrivals ~150 EGP. Never take curbside touts.' },
  { city: 'sharm-el-sheikh', category: 'taxi', item: 'Naama Bay → Old Market', fair: 70, scam: 250, source: 'Sharm_el_Sheikh_live TG', note: '10 min ride. Walk away if quoted 200+.' },
  { city: 'sharm-el-sheikh', category: 'taxi', item: 'Naama Bay strip short trip', fair: 60, scam: 200, source: 'Sharm Expats TG', note: 'Beach-front stands worst — use Careem or walk 100m to main road.' },
  { city: 'sharm-el-sheikh', category: 'tour', item: 'Snorkeling boat (half day)', fair: 400, scam: 1200, source: 'FB Egypt Expats', note: 'Book at marina, not beach. Includes lunch at fair price.' },
  { city: 'sharm-el-sheikh', category: 'tour', item: 'Quad safari 1hr', fair: 700, scam: 1800, source: 'Sharm Expats TG', note: 'Agree duration + price before mounting.' },
  { city: 'sharm-el-sheikh', category: 'sim', item: 'Vodafone 15GB / 30 days', fair: 155, scam: 420, source: 'Sharm_el_Sheikh_live TG', note: 'Official Vodafone store Old Market — NOT airport kiosk.' },
  { city: 'sharm-el-sheikh', category: 'restaurant', item: 'Local meal Old Market', fair: 120, scam: 400, source: 'FB Egypt Expats', note: 'Naama strip 2–3x more than Old Market.' },

  // ── HURGHADA ──
  { city: 'hurghada', category: 'taxi', item: 'Airport → Marina/El Dahar', fair: 150, scam: 500, source: 'Hurghada Chat TG', note: 'Community consensus: 100–150 EGP. Anything 300+ is scam.' },
  { city: 'hurghada', category: 'taxi', item: 'Marina → El Dahar', fair: 60, scam: 200, source: 'Hurghada Chat TG', note: 'Microbus 5–8 EGP if you know the route.' },
  { city: 'hurghada', category: 'taxi', item: 'Careem short trip', fair: 55, scam: 150, source: 'Hurghada Chat TG', note: 'App price is fixed — safest option per group polls.' },
  { city: 'hurghada', category: 'tour', item: 'Orange Bay day trip', fair: 600, scam: 1500, source: 'FB Hurghada Expats', note: 'Includes boat + lunch. Hotel lobby adds 40% markup.' },
  { city: 'hurghada', category: 'tour', item: 'Diving 2 dives + gear', fair: 1100, scam: 2500, source: 'Hurghada Chat TG', note: 'PADI center only. Beach tout quotes are fake.' },
  { city: 'hurghada', category: 'restaurant', item: 'Fish restaurant El Dahar', fair: 150, scam: 500, source: 'FB Egypt Expats', note: 'Marina restaurants 2x El Dahar prices.' },

  // ── LUXOR ──
  { city: 'luxor', category: 'taxi', item: 'Train station → Luxor Temple', fair: 50, scam: 200, source: 'FB Egypt Expats', note: '5 min ride. Walk if quoted 100+.' },
  { city: 'luxor', category: 'transport', item: 'Public ferry East→West Bank', fair: 10, scam: 100, source: 'FB Egypt Expats', note: 'Government ferry 5–10 EGP flat. Ticket seller ON boat only.' },
  { city: 'luxor', category: 'tour', item: 'Valley of Kings entry', fair: 300, scam: 300, source: 'Official', note: 'Fixed gov price. "Special access" offers are scams.' },
  { city: 'luxor', category: 'tour', item: 'Felucca 1hr sunset', fair: 150, scam: 600, source: 'FB Egypt Expats', note: 'Agree round-trip EGP price before boarding.' },
  { city: 'luxor', category: 'taxi', item: 'Horse carriage city tour 1hr', fair: 150, scam: 500, source: 'FB Egypt Expats', note: 'Negotiate full hour price upfront.' },

  // ── ASWAN ──
  { city: 'aswan', category: 'transport', item: 'Felucca 1hr', fair: 120, scam: 500, source: 'FB Egypt Expats', note: 'Corniche captains — agree EGP before boarding.' },
  { city: 'aswan', category: 'tour', item: 'Abu Simbel day trip', fair: 800, scam: 2000, source: 'FB Egypt Expats', note: 'Convoy leaves 4am. Book via hotel or licensed operator.' },
  { city: 'aswan', category: 'tour', item: 'Nubian village visit', fair: 0, scam: 200, source: 'FB Egypt Expats', note: 'Villages free. "Entry fee" at door is scam.' },

  // ── CAIRO ──
  { city: 'cairo', category: 'taxi', item: 'Khan El Khalili → Downtown', fair: 50, scam: 200, source: 'FB Cairo Expats', note: 'Walk 120m to main street — hotspot trap zone.' },
  { city: 'cairo', category: 'taxi', item: 'Airport → Tahrir/Downtown', fair: 200, scam: 600, source: 'FB Egypt Expats', note: 'Uber/Careem ~180–220 EGP. White taxi negotiate before.' },
  { city: 'cairo', category: 'tour', item: 'Giza pyramids horse/camel', fair: 100, scam: 500, source: 'FB Egypt Expats', note: 'Per ride not per photo. Exit gate touts worst.' },
  { city: 'cairo', category: 'shopping', item: 'Papyrus "museum" visit', fair: 0, scam: 5000, source: 'FB Egypt Expats', note: 'Free entry scams lead to high-pressure sales near Giza.' },

  // ── EL-GOUNA ──
  { city: 'el-gouna', category: 'taxi', item: 'HRG Airport → El Gouna', fair: 250, scam: 600, source: 'FB El Gouna Expats', note: 'Hotel shuttle often included — ask before paying taxi.' },
  { city: 'el-gouna', category: 'taxi', item: 'Tuk-tuk within El Gouna', fair: 30, scam: 100, source: 'FB El Gouna Expats', note: 'Short hops — ask hotel reception for fair rate.' },
  { city: 'el-gouna', category: 'restaurant', item: 'Marina dinner', fair: 300, scam: 700, source: 'Google Maps + FB', note: 'Zaalouk, La Tortuga — book ahead in season.' },
];

export function getCommunityIntel(cityId = null, query = '') {
  const q = query.toLowerCase();
  let items = COMMUNITY_INTEL;
  if (cityId) items = items.filter((i) => i.city === cityId);
  if (q) {
    const matched = items.filter(
      (i) =>
        i.item.toLowerCase().includes(q) ||
        i.category.includes(q) ||
        i.note.toLowerCase().includes(q)
    );
    if (matched.length) items = matched;
  }
  return items.slice(0, 12);
}

export function formatCommunityIntelForLoki(cityId = null, query = '') {
  const items = getCommunityIntel(cityId, query);
  if (!items.length) return '';
  const lines = ['COMMUNITY PRICES (Telegram/Facebook expat groups — verified by Locali):'];
  items.forEach((i) => {
    lines.push(`- [${i.source}] ${i.item}: fair ${i.fair} EGP | scam ${i.scam} EGP — ${i.note}`);
  });
  return lines.join('\n');
}
