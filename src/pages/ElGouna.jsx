import { useState } from 'react';
import { MapPin, Star, Waves, ChevronDown, ChevronUp, Phone, ExternalLink } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';
import BookingButtons from '../components/BookingButtons';
import ElGounaServices from '../components/elgouna/ElGounaServices';

const EL_GOUNA = {
  overview: `El Gouna is a privately-owned, purpose-built resort town on the Red Sea coast, 30km north of Hurghada. Often called "The Venice of the Red Sea", it's built across a network of lagoons and islands with crystal-clear water. It's Egypt's most upscale, safe, and well-maintained tourist destination — think clean streets, no haggling, modern infrastructure, and over 100 restaurants. Popular with European expats, kitesurfers, divers, and luxury travelers who want beach life without the chaos of Hurghada.`,

  areas: [
    {
      name: 'Abu Tig Marina',
      emoji: '⚓',
      vibe: 'The heart of El Gouna nightlife and dining. Lined with international restaurants, bars, and cafes on the waterfront. Yachts and boats docked right next to the restaurants. Comes alive after sunset — perfect for dinner and evening walks.',
      best_for: 'Dining, nightlife, evening walks, people-watching',
    },
    {
      name: 'Downtown El Gouna',
      emoji: '🏙️',
      vibe: 'The main commercial hub. Supermarkets, souvenir shops, pharmacies, cafes, and local restaurants. More affordable than the Marina. Great for daily errands and budget-friendly meals. Tamr Henna Square is the central meeting point.',
      best_for: 'Shopping, local food, daily essentials, budget eats',
    },
    {
      name: 'Tamr Henna Square',
      emoji: '🌴',
      vibe: 'A charming open-air plaza at the heart of Downtown. Street performers, local vendors, shisha cafes, and the famous Tamr Henna restaurant. Popular gathering spot for locals and tourists alike — especially in the evening.',
      best_for: 'Casual evenings, shisha, local atmosphere, street food',
    },
    {
      name: 'Kafr El Gouna',
      emoji: '🏘️',
      vibe: 'The "old village" area — traditional Nubian-style architecture painted in pastel colors. More residential and quieter. Home to some charming cafes and boutique shops. Instagrammable alleyways.',
      best_for: 'Photography, quiet walks, authentic atmosphere',
    },
    {
      name: 'El Khan (Golf Area)',
      emoji: '⛳',
      vibe: 'Upscale residential and golf resort zone. Very quiet and green. Home to the Steigenberger Golf Resort and the 18-hole championship course. Away from the tourist buzz.',
      best_for: 'Golf, luxury stays, peace and quiet',
    },
  ],

  beaches: [
    {
      name: 'Mangroovy Beach',
      type: 'Public / Semi-public',
      emoji: '🏄',
      vibe: 'El Gouna\'s most famous beach — the kitesurf capital. Flat shallow water, consistent winds, perfect for kitesurfing and windsurfing. Multiple kite schools on site. Very social and young crowd.',
      activities: ['Kitesurfing', 'Windsurfing', 'Paddleboarding', 'Beach bar'],
      access: 'Open to all, equipment rental on site',
      tip: 'Best winds October–April. Book lessons in advance during peak season.',
    },
    {
      name: 'Zeytuna Beach',
      type: 'Private (day pass available)',
      emoji: '🏖️',
      vibe: 'El Gouna\'s most beautiful main beach. Long sandy stretch on a lagoon — calm water, sun loungers, beach bars. Very clean and well-maintained. Great for families and couples.',
      activities: ['Swimming', 'Snorkeling', 'Jet ski', 'Beach volleyball', 'Beach bar'],
      access: 'Day pass ~300–500 EGP for non-hotel guests',
      tip: 'Arrive early to get the best lounger spots. Water is clearest in the morning.',
    },
    {
      name: 'Moods Beach',
      type: 'Beach Club',
      emoji: '🍹',
      vibe: 'Upscale beach club experience. Part of the Moods complex near the Marina. Trendy, music, cocktails, nice crowd. More of a social scene than a sports beach.',
      activities: ['Swimming', 'Cocktails', 'Music', 'Socializing'],
      access: 'Entrance fee or minimum spend',
      tip: 'Comes alive Friday & Saturday. Dress code applies in the evening.',
    },
    {
      name: 'Three Corners Beach',
      type: 'Hotel Beach (day pass)',
      emoji: '🌊',
      vibe: 'Calm lagoon beach at Three Corners Ocean View hotel. Very safe, shallow, great for kids. Less crowded than Zeytuna. Affordable day pass.',
      activities: ['Swimming', 'Snorkeling', 'Water bikes'],
      access: 'Day pass available ~200 EGP',
      tip: 'Good budget alternative to pricier beach clubs.',
    },
  ],

  hotels: {
    luxury: [
      {
        name: 'The Chedi El Gouna',
        stars: 5,
        rating: 4.9,
        price_range: '7,000–12,000 EGP/night',
        best_for: 'Honeymoon, ultra-luxury, foodies',
        desc: 'El Gouna\'s finest. Michelin-trained chefs, private beach, stunning pool, world-class spa. Minimalist Asian-Mediterranean design. Arguably the best hotel in all of Egypt.',
      },
      {
        name: 'Steigenberger Golf Resort El Gouna',
        stars: 5,
        rating: 4.8,
        price_range: '5,000–8,000 EGP/night',
        best_for: 'Golfers, luxury couples, sports lovers',
        desc: '18-hole championship golf course right at the hotel. Beautiful beach, multiple pools, excellent restaurants. Great for those who want luxury with active recreation.',
      },
      {
        name: 'Sheraton Miramar Resort El Gouna',
        stars: 5,
        rating: 4.7,
        price_range: '4,500–7,000 EGP/night',
        best_for: 'Families, all-inclusive lovers',
        desc: 'Iconic Sheraton property built on its own island, connected by bridges. Beautiful lagoon views, multiple pools, family-friendly facilities, great service.',
      },
      {
        name: 'Casa Cook El Gouna',
        stars: 4,
        rating: 4.8,
        price_range: '3,500–5,500 EGP/night',
        best_for: 'Design lovers, trendy couples, adults-only',
        desc: 'Adults-only boutique resort with stunning boho-Mediterranean design. Hammock gardens, gorgeous pool, excellent food. Instagram-famous for its aesthetic.',
      },
    ],
    midrange: [
      {
        name: 'Mövenpick Resort El Gouna',
        stars: 5,
        rating: 4.7,
        price_range: '3,500–5,500 EGP/night',
        best_for: 'Families, all-inclusive seekers',
        desc: 'Large all-inclusive resort with beach access, water sports, multiple pools, and great animation program. Good value for what you get.',
      },
      {
        name: 'Sultan Bey Hotel',
        stars: 4,
        rating: 4.5,
        price_range: '2,000–3,500 EGP/night',
        best_for: 'Budget-conscious travelers, couples',
        desc: 'Central location in Downtown area. Clean rooms, friendly staff, good breakfast. No direct beach but shuttle to beach included. Best value in El Gouna.',
      },
      {
        name: 'Panorama Bungalows Resort',
        stars: 4,
        rating: 4.4,
        price_range: '2,500–4,000 EGP/night',
        best_for: 'Couples, budget luxury',
        desc: 'Charming bungalow-style resort with private beach. Quieter than big hotels. Cozy atmosphere with good service. Popular with repeat visitors.',
      },
    ],
  },

  restaurants: {
    fine_dining: [
      {
        name: 'The Orientalist',
        cuisine: 'Egyptian/Oriental Fine Dining',
        avg_meal: '500–900 EGP/person',
        location: 'Abu Tig Marina',
        why_special: 'Beautifully designed restaurant with the best Egyptian cuisine in El Gouna. Traditional dishes elevated with modern presentation. Live Oud music some evenings.',
      },
      {
        name: 'Blu Restaurant (Casa Cook)',
        cuisine: 'Mediterranean / International',
        avg_meal: '600–1,000 EGP/person',
        location: 'Casa Cook Hotel',
        why_special: 'Stunning pool-facing restaurant inside Casa Cook. Best ambiance in El Gouna. Mediterranean-inspired menu with fresh seafood.',
      },
    ],
    casual_dining: [
      {
        name: 'Zaalouk',
        cuisine: 'Moroccan/Mediterranean',
        avg_meal: '300–500 EGP/person',
        location: 'Abu Tig Marina',
        why_special: 'One of El Gouna\'s most beloved restaurants. Tagines, couscous, mezze, and amazing cocktails. Rooftop terrace with Marina views. Always busy — reserve ahead.',
      },
      {
        name: 'Jobo Restaurant',
        cuisine: 'International/Fusion',
        avg_meal: '350–600 EGP/person',
        location: 'Abu Tig Marina',
        why_special: 'Popular burger and grill restaurant right on the Marina. Best burgers in El Gouna, great cocktails, lively atmosphere.',
      },
      {
        name: 'Yalla',
        cuisine: 'Egyptian/Street food',
        avg_meal: '80–150 EGP/person',
        location: 'Downtown',
        why_special: 'The locals\' favorite. Cheap, delicious Egyptian street food — koshari, falafel, ful, grilled chicken. No frills, massive portions.',
      },
      {
        name: 'La Veranda',
        cuisine: 'Italian',
        avg_meal: '400–700 EGP/person',
        location: 'Near Marina',
        why_special: 'Excellent wood-fired pizza and homemade pasta. Romantic garden setting. One of the most consistent restaurants in El Gouna.',
      },
      {
        name: 'Saffron',
        cuisine: 'Asian Fusion/Thai',
        avg_meal: '400–700 EGP/person',
        location: 'Abu Tig Marina',
        why_special: 'Best Asian food in El Gouna. Thai curries, sushi, dim sum, great cocktails. Waterfront tables available.',
      },
    ],
    cafes: [
      {
        name: 'Kafr Coffee',
        cuisine: 'Specialty Coffee & Light Bites',
        avg_meal: '80–180 EGP',
        location: 'Kafr El Gouna',
        why_special: 'Best specialty coffee in El Gouna. Cozy courtyard in the picturesque Kafr area. Great for laptop work or a quiet morning.',
      },
      {
        name: 'Tamr Henna Restaurant & Cafe',
        cuisine: 'Egyptian/International',
        avg_meal: '150–300 EGP',
        location: 'Tamr Henna Square',
        why_special: 'Iconic spot at the heart of Downtown. Open from morning until late. Good for shisha, coffee, and casual Egyptian food while people-watching.',
      },
    ],
  },

  nightlife: [
    {
      name: 'Moods El Gouna',
      type: 'Beach Club & Bar',
      vibe: 'party',
      emoji: '🎉',
      desc: 'El Gouna\'s most famous party venue. DJ nights, dancing, cocktails, beach access. Gets very lively Thursday to Saturday. International crowd.',
    },
    {
      name: 'The Pirate\'s Bar (Abu Tig Marina)',
      type: 'Bar',
      vibe: 'chill-to-party',
      emoji: '🍺',
      desc: 'Long-standing Marina institution. Good cocktails, cold beers, sport on TV, friendly staff. Popular with expats and sailors. Open late.',
    },
    {
      name: 'Papas Bar',
      type: 'Sports Bar',
      vibe: 'casual-chill',
      emoji: '⚽',
      desc: 'Best sports bar in El Gouna. Live sports, cold Stella beer, pub food. Very popular with the expat community for weekend football matches.',
    },
    {
      name: 'Marina View Restaurant & Bar',
      type: 'Bar/Lounge',
      vibe: 'chill',
      emoji: '🌅',
      desc: 'Perfect sunset bar on the Marina. Cocktails, wine, waterfront seating. Relaxed atmosphere, ideal for couples or a pre-dinner drink.',
    },
    {
      name: 'Club House El Gouna',
      type: 'Nightclub',
      vibe: 'party',
      emoji: '🎵',
      desc: 'The main nightclub in El Gouna. Open late, DJ sets, dancing. Popular with younger crowd and tourists looking for a proper party night.',
    },
  ],

  activities: [
    {
      name: 'Kitesurfing Lessons',
      emoji: '🪁',
      price: '1,500–2,500 EGP for 2-hr lesson',
      level: 'Beginner to advanced',
      where: 'Mangroovy Beach',
      desc: 'El Gouna is ranked among the top 5 kitesurfing destinations in the world. Consistent cross-shore winds, flat lagoon water, and multiple IKO-certified schools. Best schools: Freeride El Gouna, Kite House.',
    },
    {
      name: 'Scuba Diving',
      emoji: '🤿',
      price: '2,000–3,500 EGP (2 dives with equipment)',
      level: 'Beginners and certified',
      where: 'Various dive centers (Boat trip)',
      desc: 'Access to some of the Red Sea\'s best reefs. PADI courses available. Popular sites: Abu Nuhas wreck, Shaab Abu Ramada, and the House Reef. Best center: Sub Aqua or Aquanaut.',
    },
    {
      name: 'Snorkeling Day Trip',
      emoji: '🐠',
      price: '800–1,500 EGP/person',
      level: 'All levels',
      where: 'Boat from Abu Tig Marina',
      desc: 'Half-day boat trips to nearby reefs teeming with fish and coral. Includes equipment, guide, and light snacks. Beginner-friendly, no experience needed.',
    },
    {
      name: 'Desert Safari (Quad / Jeep)',
      emoji: '🏜️',
      price: '1,200–2,000 EGP/person',
      level: 'All levels',
      where: 'Departs from El Gouna',
      desc: 'Sunset or morning quad bike or 4x4 safari into the Eastern Desert. Includes Bedouin tea, stargazing option, and camel ride. 2–3 hours.',
    },
    {
      name: 'Golf (18-hole course)',
      emoji: '⛳',
      price: '2,500–4,000 EGP/round',
      level: 'Experienced golfers',
      where: 'Steigenberger Golf Resort',
      desc: 'Championship 18-hole golf course — one of the best in the Middle East. Equipment rental available. Morning tee times recommended before afternoon heat.',
    },
    {
      name: 'Boat & Yacht Charter',
      emoji: '⛵',
      price: '3,000–12,000 EGP/half day (whole boat)',
      level: 'All levels',
      where: 'Abu Tig Marina',
      desc: 'Rent a private speedboat, sailboat, or luxury yacht. Explore hidden lagoons, reefs, and desert coastline. Snorkeling, fishing, or pure relaxation.',
    },
    {
      name: 'Lagoon Paddleboarding / Kayaking',
      emoji: '🛶',
      price: '300–600 EGP/hour',
      level: 'All levels',
      where: 'Lagoon beaches',
      desc: 'Calm lagoon water makes El Gouna perfect for stand-up paddleboarding and kayaking. Great for morning exercise or exploring the lagoon islands.',
    },
    {
      name: 'Spa & Wellness',
      emoji: '💆',
      price: '1,000–3,000 EGP/session',
      level: 'Everyone',
      where: 'Chedi, Steigenberger, Sheraton spas',
      desc: 'World-class hotel spas offering massage, hammam, and wellness treatments. The Chedi spa is widely considered the best in Egypt.',
    },
  ],

  shopping: [
    {
      name: 'Downtown El Gouna Shops',
      type: 'Mixed retail',
      desc: 'Clothing boutiques, souvenir shops, pharmacies, supermarkets (Hyper 1), and local market stalls. Most affordable shopping in El Gouna.',
      tip: 'Hyper 1 supermarket has the best prices for snacks, drinks, and sunscreen.',
    },
    {
      name: 'Abu Tig Marina Boutiques',
      type: 'Upscale boutiques',
      desc: 'Designer swimwear, luxury beachwear, jewelry, and accessories along the Marina walkway. International brands mixed with local designers.',
      tip: 'Prices are higher than Cairo but quality is generally good. Good for resort wear.',
    },
    {
      name: 'Kafr El Gouna Crafts',
      type: 'Handmade & local crafts',
      desc: 'Small artisan shops in the Kafr village area selling handmade jewelry, ceramics, papyrus art, and local textiles. Better quality than most souvenir shops.',
      tip: 'Ask the price then offer 60–70% — mild negotiation is accepted here.',
    },
    {
      name: 'El Gouna Market (weekly)',
      type: 'Outdoor market',
      desc: 'Weekly outdoor market near Downtown with fresh produce, spices, clothing, and local goods. Good for authentic shopping experience.',
      tip: 'Usually held Thursday evenings. Ask locals for the current location.',
    },
  ],

  transport: {
    overview: 'El Gouna is designed as a self-contained resort town. Getting around is easy and fun — no need for a car.',
    options: [
      {
        name: 'Tuk-Tuk (Rickshaw)',
        emoji: '🛺',
        price: '30–100 EGP per trip',
        desc: 'The primary way to get around El Gouna. Small electric tuk-tuks are everywhere. Agree on the price before you get in. Very easy to flag down anywhere.',
        tip: 'Standard rate Downtown to Marina is ~50–70 EGP. Don\'t pay more than 100 EGP for any trip within El Gouna.',
      },
      {
        name: 'Shuttle Boats',
        emoji: '⛵',
        price: 'Free or ~20 EGP',
        desc: 'Small boats connecting the lagoon islands and hotel zones. Some are complimentary for hotel guests. A unique and fun way to move between areas.',
        tip: 'Check with your hotel — many offer free shuttle boats to the Marina and beaches.',
      },
      {
        name: 'Bicycle Rental',
        emoji: '🚲',
        price: '200–400 EGP/day',
        desc: 'El Gouna is very bike-friendly with dedicated paths around most areas. Great way to explore at your own pace. Available at most hotels and some Downtown shops.',
        tip: 'Best for morning rides — avoid midday heat (April–October).',
      },
      {
        name: 'Golf Carts',
        emoji: '🏌️',
        price: '500–800 EGP/day rental',
        desc: 'Some hotels and rental shops offer golf carts. Fun and practical for families. Widely used by residents.',
        tip: 'Mainly useful if staying in outlying hotel complexes far from Downtown.',
      },
      {
        name: 'From Hurghada Airport',
        emoji: '✈️',
        price: '200–400 EGP (private transfer)',
        desc: 'Hurghada International Airport is only 30km away (~30 min). Pre-book a private transfer through your hotel or use the official taxi rank. Avoid random drivers offering rides at the airport.',
        tip: 'Official transfer booths are inside the arrivals hall. Don\'t accept offers from men approaching you outside.',
      },
    ],
  },

  tips: [
    {
      category: '📅 Best time to visit',
      tip: 'October to April is perfect — warm (22–30°C), consistent winds for kite/windsurfing. May to September is very hot (35–42°C) but quieter and cheaper. Avoid August if you hate crowds.',
    },
    {
      category: '💰 Price expectations',
      tip: 'El Gouna is 30–50% more expensive than Hurghada. Expect to pay 300–600 EGP for a casual dinner, 3,000–7,000 EGP/night for a hotel. Water activities are premium-priced but worth it.',
    },
    {
      category: '🏖️ Getting beach access',
      tip: 'Most beaches in El Gouna are attached to hotels. Non-guests can buy day passes (200–500 EGP). Zeytuna and Mangroovy are the easiest to access as a non-hotel guest.',
    },
    {
      category: '🌐 Connectivity',
      tip: 'WiFi is good at all hotels and restaurants. Buy a Vodafone or Orange Egypt SIM at Hurghada airport (~100–150 EGP with 20GB data). Works well throughout El Gouna.',
    },
    {
      category: '💊 Medical',
      tip: 'El Gouna Hospital is excellent by Egyptian standards and handles dive accidents (hyperbaric chamber on site). For minor issues, there are pharmacies in Downtown open until late.',
    },
    {
      category: '🇪🇬 Culture tips',
      tip: 'El Gouna is one of Egypt\'s most liberal and secular areas. Swimwear is fine at beaches, but cover up when visiting Downtown or local areas. Alcohol is freely available everywhere.',
    },
    {
      category: '🔒 Safety',
      tip: 'El Gouna is one of the safest destinations in Egypt. It\'s privately managed with its own security. Very low crime rate. Solo women travelers feel comfortable here. Still use basic common sense at night.',
    },
    {
      category: '🚫 Tourist mistakes',
      tip: 'Don\'t book your entire stay all-inclusive — El Gouna\'s restaurant scene is too good to miss. Don\'t skip the Marina at night. Don\'t rent a car unless you plan to visit Hurghada or Luxor.',
    },
  ],

  warnings: [
    {
      title: 'Tuk-tuk overcharging',
      detail: 'Drivers near tourist hotels sometimes quote 3–5x the normal price. Standard Downtown→Marina is 50–70 EGP. If quoted 200+ EGP, walk away and find another driver.',
    },
    {
      title: 'Marina restaurant prices',
      detail: 'Some Marina restaurants have menus in USD or EUR and charge very high prices. Always check the menu prices before sitting down, especially for seafood restaurants.',
    },
    {
      title: 'Unofficial dive operators',
      detail: 'Only use PADI or SSI certified dive centers. Ask to see their certification. Uncertified operators cut corners on safety equipment. Recommended: Sub Aqua, Aquanaut.',
    },
    {
      title: 'Airport transfer scams',
      detail: 'Unofficial taxi drivers at Hurghada airport will approach you. Always use the pre-booked transfer desk inside arrivals or your hotel\'s official pickup service.',
    },
    {
      title: 'Kite school quality',
      detail: 'Not all kite schools in El Gouna are equal. Only book with IKO-certified instructors. Freeride El Gouna and Kite House are both reputable. Ask for instructor certification.',
    },
    {
      title: 'Cash vs card',
      detail: 'Many smaller restaurants, tuk-tuks, and market stalls are cash only. ATMs are available Downtown. Bring enough EGP — don\'t rely on cards outside hotels.',
    },
  ],
};

// ── Sub components ────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="font-extrabold text-xl mb-4 flex items-center gap-2">{title}</h2>
      {children}
    </section>
  );
}

function AreaCard({ area }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{area.emoji}</span>
        <div>
          <h3 className="font-bold text-sm">{area.name}</h3>
          <p className="text-[10px] text-accent font-semibold">{area.best_for}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{area.vibe}</p>
    </div>
  );
}

function BeachCard({ beach }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{beach.emoji}</span>
          <div>
            <h3 className="font-bold text-sm">{beach.name}</h3>
            <span className="text-[10px] bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full">{beach.type}</span>
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)} className="text-muted-foreground">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{beach.vibe}</p>
      {open && (
        <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {beach.activities.map((a, i) => (
              <span key={i} className="text-[10px] bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 rounded-full">{a}</span>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">🎫 Access: {beach.access}</p>
          <p className="text-[10px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl">💡 {beach.tip}</p>
        </div>
      )}
    </div>
  );
}

function HotelCard({ h }) {
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.name + ' El Gouna Egypt')}`;
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-sm">{h.name}</h3>
        <div className="flex items-center gap-1 shrink-0">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold">{h.rating}</span>
        </div>
      </div>
      <p className="text-[10px] text-accent font-semibold mb-1">Best for: {h.best_for}</p>
      <p className="text-xs text-muted-foreground mb-2">{h.desc}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-green-600">{h.price_range}</span>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
          className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
          Booking.com <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}

function RestaurantCard({ r }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' El Gouna Egypt')}`;
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-sm">{r.name}</h3>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin className="w-3.5 h-3.5 text-accent" />
        </a>
      </div>
      <p className="text-[10px] text-accent font-semibold mb-1">{r.cuisine} · {r.location}</p>
      <p className="text-xs text-muted-foreground mb-1.5">{r.why_special}</p>
      <p className="text-[10px] font-bold text-green-600">{r.avg_meal}</p>
    </div>
  );
}

function NightlifeCard({ v }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 flex gap-3 items-start">
      <span className="text-2xl shrink-0">{v.emoji}</span>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-sm">{v.name}</h3>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${v.vibe === 'party' ? 'bg-red-100 text-red-700' : v.vibe === 'chill' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {v.vibe}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground">{v.type}</p>
        <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
      </div>
    </div>
  );
}

function ActivityCard({ a }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{a.emoji}</span>
        <div>
          <h3 className="font-bold text-sm">{a.name}</h3>
          <p className="text-[10px] text-muted-foreground">{a.level} · {a.where}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{a.desc}</p>
      <p className="text-xs font-bold text-green-600">{a.price}</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

export default function ElGouna() {
  const d = EL_GOUNA;
  const [activeTab, setActiveTab] = useState('overview');

  const TABS = [
    { id: 'overview', label: '🌊 Overview' },
    { id: 'beaches', label: '🏖️ Beaches' },
    { id: 'hotels', label: '🏨 Hotels' },
    { id: 'food', label: '🍽️ Food' },
    { id: 'activities', label: '🏄 Activities' },
    { id: 'nightlife', label: '🎉 Nightlife' },
    { id: 'transport', label: '🚗 Getting Around' },
    { id: 'services', label: '📍 Local Services' },
    { id: 'tips', label: '💡 Tips & Warnings' },
  ];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0">
          <Waves className="w-7 h-7 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">El Gouna</h1>
          <p className="text-sm text-muted-foreground">The Venice of the Red Sea · 30km from Hurghada</p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['🔒 Safest in Egypt', '🌊 Lagoon beaches', '🪁 Kite capital', '🍽️ 100+ restaurants', '✈️ 30 min from airport'].map((b, i) => (
          <span key={i} className="text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 px-2.5 py-1 rounded-full">{b}</span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1 mb-6">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-accent text-accent-foreground' : 'bg-card border border-border text-muted-foreground hover:border-accent/50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          <Section title="📍 About El Gouna">
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5 mb-6">
              <p className="text-sm text-cyan-900 leading-relaxed">{d.overview}</p>
            </div>
          </Section>
          <Section title="🏘️ Areas & Districts">
            <div className="grid sm:grid-cols-2 gap-3">
              {d.areas.map((a, i) => <AreaCard key={i} area={a} />)}
            </div>
          </Section>
        </>
      )}

      {activeTab === 'beaches' && (
        <Section title="🏖️ Beaches">
          <div className="grid sm:grid-cols-2 gap-3">
            {d.beaches.map((b, i) => <BeachCard key={i} beach={b} />)}
          </div>
        </Section>
      )}

      {activeTab === 'hotels' && (
        <Section title="🏨 Hotels">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">⭐⭐⭐⭐⭐ Luxury</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {d.hotels.luxury.map((h, i) => <HotelCard key={i} h={h} />)}
          </div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">⭐⭐⭐⭐ Mid-Range & Value</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {d.hotels.midrange.map((h, i) => <HotelCard key={i} h={h} />)}
          </div>
        </Section>
      )}

      {activeTab === 'food' && (
        <Section title="🍽️ Restaurants & Cafes">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">✨ Fine Dining</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {d.restaurants.fine_dining.map((r, i) => <RestaurantCard key={i} r={r} />)}
          </div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">🍴 Casual Dining</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {d.restaurants.casual_dining.map((r, i) => <RestaurantCard key={i} r={r} />)}
          </div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">☕ Cafes</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {d.restaurants.cafes.map((r, i) => <RestaurantCard key={i} r={r} />)}
          </div>
        </Section>
      )}

      {activeTab === 'activities' && (
        <Section title="🏄 Activities & Experiences">
          <div className="grid sm:grid-cols-2 gap-3">
            {d.activities.map((a, i) => <ActivityCard key={i} a={a} />)}
          </div>
        </Section>
      )}

      {activeTab === 'nightlife' && (
        <Section title="🎉 Nightlife">
          <div className="space-y-3">
            {d.nightlife.map((v, i) => <NightlifeCard key={i} v={v} />)}
          </div>
        </Section>
      )}

      {activeTab === 'transport' && (
        <Section title="🚗 Getting Around El Gouna">
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 mb-4">
            <p className="text-sm text-cyan-800">{d.transport.overview}</p>
          </div>
          <div className="space-y-3">
            {d.transport.options.map((t, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{t.emoji}</span>
                  <div>
                    <h3 className="font-bold text-sm">{t.name}</h3>
                    <p className="text-xs font-bold text-green-600">{t.price}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1.5">{t.desc}</p>
                <p className="text-[10px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl">💡 {t.tip}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeTab === 'services' && (
        <Section title="📍 Local Services & Places">
          <ElGounaServices />
        </Section>
      )}

      {activeTab === 'tips' && (
        <>
          <Section title="💡 Insider Tips">
            <div className="space-y-3">
              {d.tips.map((t, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-accent mb-1">{t.category}</p>
                  <p className="text-sm text-foreground leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="⚠️ Warnings">
            <div className="space-y-3">
              {d.warnings.map((w, i) => (
                <div key={i} className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-red-700 mb-1">⚠️ {w.title}</p>
                  <p className="text-sm text-red-800 leading-relaxed">{w.detail}</p>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      <SafeNextStep title="Hurghada — Budget Alternative" description="Similar beaches, lower prices" to="/services?city=hurghada" />
    </div>
  );
}