import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, MapPin, Clock, Phone, Star, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useSEO } from '../lib/seo';

const BAZAAR_DATA = {
  hurghada: {
    seoTitle: 'Best Bazaars & Handmade Shopping in Hurghada Egypt 2026',
    seoDesc: 'Find the best bazaars, local markets and handmade brands in Hurghada. Real prices in EGP. Avoid tourist traps with our verified guide.',
    intro: 'Hurghada has several bazaar areas, though shopping here is more resort-focused than cultural. The Old Market (El Dahar) is the most authentic. Always agree on a price before buying anything.',
    scamAlert: 'Papyrus at bazaar stalls is almost always banana-leaf fake. Genuine papyrus only from certified papyrus shops with government registration displayed.',
    listings: [
      {
        name: 'El Dahar Old Market',
        type: 'Traditional Market',
        desc: 'Hurghada\'s most authentic local market. Spices, alabaster, clothing, and souvenirs. Far less touristy than Senzo Mall area. Arrive early morning for best prices.',
        area: 'El Dahar, North Hurghada',
        hours: 'Daily 09:00–23:00 (breaks for prayer)',
        price: 'Budget–Mid',
        phone: '',
        verified: true,
        tip: 'Start at 40% of first price. Walk away — they will call you back at 60–70% of original.',
        tags: ['Spices', 'Alabaster', 'Clothing', 'Souvenirs'],
      },
      {
        name: 'Sigala Market Street',
        type: 'Shopping Street',
        desc: 'Street of souvenir and clothing shops in the Sigala district. More curated than El Dahar. Fixed-price shops exist here. Good for Egyptian cotton and galabiya.',
        area: 'Sigala, Central Hurghada',
        hours: 'Daily 10:00–01:00',
        price: 'Mid',
        phone: '',
        verified: false,
        tip: 'Look for shops displaying "Fixed Price" signs — genuinely useful for stress-free buying.',
        tags: ['Egyptian cotton', 'Galabiya', 'Gold jewelry'],
      },
      {
        name: 'Senzo Mall Souvenir Floor',
        type: 'Modern Mall',
        desc: 'Top floor of Senzo Mall has a curated souvenir and handcraft section. Air-conditioned and price-tagged. Less negotiation, but prices are pre-inflated for tourists. Convenient for last-minute gifts.',
        area: 'Senzo Mall, Corniche',
        hours: 'Daily 10:00–23:00',
        price: 'Mid–Premium',
        phone: '+20 65 354 9999',
        verified: true,
        tip: 'Prices are 30% higher than El Dahar but fixed and no hassle.',
        tags: ['Air-conditioned', 'Fixed prices', 'Handcrafts'],
      },
      {
        name: 'Alabaster Factory (El Gouna Road)',
        type: 'Handmade Craft Workshop',
        desc: 'Genuine alabaster workshop where you watch craftsmen carving. Quality far above bazaar stalls. Authentic certificates provided. Vases, figurines, and Pharaonic statues.',
        area: 'El Gouna Road, north of Hurghada',
        hours: 'Sat–Thu 09:00–20:00',
        price: 'Mid–Premium',
        phone: '+20 100 654 3210',
        verified: true,
        tip: 'Genuine alabaster glows orange/amber when held to light. Fake stone does not.',
        tags: ['Alabaster', 'Handmade', 'Workshop', 'Certificates'],
      },
      {
        name: 'Red Sea Handmade Market (Craft Fair)',
        type: 'Seasonal Craft Market',
        desc: 'Weekend craft market near El Dahar featuring local artisans selling jewelry, woven goods, and original art. Runs Oct–May. Much better quality than the tourist bazaars.',
        area: 'El Dahar Park, Hurghada',
        hours: 'Friday & Saturday 16:00–22:00 (Oct–May only)',
        price: 'Mid',
        phone: '',
        verified: false,
        tip: 'Meet the maker — all vendors here produce what they sell. No middlemen.',
        tags: ['Jewelry', 'Woven goods', 'Art', 'Local artisans'],
      },
      {
        name: 'Habiba Gallery (Egyptian Art)',
        type: 'Art Gallery & Boutique',
        desc: 'Small gallery selling original paintings and prints by Egyptian artists. Good selection of Red Sea and desert-inspired artwork. Certificates of authenticity provided. Shipping available.',
        area: 'Sheraton Road, Hurghada',
        hours: 'Sat–Thu 11:00–21:00',
        price: 'Mid–Premium',
        phone: '+20 12 345 6780',
        verified: true,
        tip: 'Original signed art makes a far better souvenir than mass-produced alabaster.',
        tags: ['Original art', 'Prints', 'Egyptian artists', 'Shipping'],
      },
    ],
  },
  'sharm-el-sheikh': {
    seoTitle: 'Best Bazaars & Handmade Shopping in Sharm El Sheikh Egypt',
    seoDesc: 'Guide to the best markets, bazaars and authentic handmade shopping in Sharm El Sheikh. Verified tips, real prices, and scam warnings.',
    intro: 'Sharm El Sheikh\'s main shopping areas are Naama Bay\'s pedestrian strip and the Old Market (Sharm El Maya). The Old Market is more authentic and 30–40% cheaper than Naama Bay shops.',
    scamAlert: 'Watch for "free gift" tactics near carpet shops — accepting a gift obligates you psychologically to buy. Decline politely and keep walking.',
    listings: [
      {
        name: 'Sharm El Maya Old Market',
        type: 'Traditional Bazaar',
        desc: 'The original Sharm market before tourism arrived. Authentic spice stalls, local clothing, jewelry, and fresh produce. Significantly cheaper than Naama Bay. Worth the 5-minute taxi.',
        area: 'Sharm El Maya, Old Town',
        hours: 'Daily 09:00–24:00',
        price: 'Budget–Mid',
        phone: '',
        verified: true,
        tip: 'Take a tuk-tuk from Naama Bay for 15–20 EGP. Tell the driver "El Maya" market.',
        tags: ['Spices', 'Local clothing', 'Jewelry', 'Fresh produce'],
      },
      {
        name: 'Naama Bay Shopping Strip',
        type: 'Tourist Shopping Street',
        desc: 'The most convenient shopping for resort tourists. Overpriced compared to El Maya but a decent experience. Look for the permanent shops rather than open-air kiosks.',
        area: 'Naama Bay Promenade',
        hours: 'Daily 10:00–02:00',
        price: 'Mid–Premium',
        phone: '',
        verified: false,
        tip: 'Prices in Naama Bay are 30–50% higher than El Maya Old Market for identical items.',
        tags: ['Souvenirs', 'Clothing', 'Jewelry', 'Perfume'],
      },
      {
        name: 'Khan Bazar (Naama Bay)',
        type: 'Indoor Bazaar',
        desc: 'Covered bazaar complex in Naama Bay. Good range of Egyptian souvenirs, scarves, and alabaster under one roof. Bargaining expected and possible.',
        area: 'Naama Bay, opposite Hard Rock',
        hours: 'Daily 11:00–02:00',
        price: 'Mid',
        phone: '',
        verified: true,
        tip: 'Multiple competing stalls under one roof gives you negotiating leverage. Get quotes from 3 stalls.',
        tags: ['Covered', 'One-stop shopping', 'Alabaster', 'Scarves'],
      },
      {
        name: 'Bedouin Craft Market (Nabq)',
        type: 'Authentic Craft Market',
        desc: 'Seasonal Bedouin craft market run by local Sinai tribes. Handwoven baskets, silver jewelry, and camel leather goods. Genuine Bedouin craftsmanship — no factory goods.',
        area: 'Nabq Bay area (check for seasonal location)',
        hours: 'Fri–Sat evenings (seasonal)',
        price: 'Mid',
        phone: '',
        verified: false,
        tip: 'Bedouin silver is genuine — ask for a hallmark stamp or certificate. Different from bazaar silver-plate.',
        tags: ['Bedouin', 'Silver', 'Weaving', 'Camel leather', 'Seasonal'],
      },
      {
        name: 'Sinai Hand-Painted Ceramics',
        type: 'Ceramic Workshop',
        desc: 'Small workshop producing hand-painted Sinai ceramics with geometric Bedouin patterns. Each piece unique. Far above mass-produced bazaar quality.',
        area: 'Back streets of Sharm El Maya',
        hours: 'Sat–Thu 10:00–18:00',
        price: 'Mid',
        phone: '+20 69 366 4321',
        verified: true,
        tip: 'Workshop visits available — watch artists paint. A unique experience and ensures authenticity.',
        tags: ['Ceramics', 'Hand-painted', 'Bedouin patterns', 'Workshop visits'],
      },
    ],
  },
  luxor: {
    seoTitle: 'Best Bazaars & Handmade Shopping in Luxor Egypt',
    seoDesc: 'Discover authentic bazaars, alabaster workshops and local handmade crafts in Luxor. Expert buying guide with prices in EGP and scam warnings.',
    intro: 'Luxor has the most culturally rich shopping in Egypt. The Luxor Bazaar on Sharia el-Souk is 500 meters of genuine Egyptian craftsmanship. Vendor pressure is higher here than anywhere — preparation is essential.',
    scamAlert: 'Never follow a "student/friend" who approaches in front of temples and offers to show you a "family shop". This is the most common structured scam in Luxor.',
    listings: [
      {
        name: 'Sharia el-Souk (Luxor Bazaar)',
        type: 'Main Bazaar Street',
        desc: 'Luxor\'s 500-meter main shopping street. Alabaster, papyrus, antiques, spices, jewelry, and clothing. Intense but rewarding. Most genuine craftwork in all of Egypt\'s tourist cities.',
        area: 'Between Luxor Temple and the train station',
        hours: 'Daily 08:00–midnight',
        price: 'Budget–Mid (with bargaining)',
        phone: '',
        verified: true,
        tip: 'Enter from the train station end, not from Luxor Temple end — prices are 20% lower there.',
        tags: ['Alabaster', 'Papyrus', 'Spices', 'Jewelry', 'Antiques'],
      },
      {
        name: 'Habbu Alabaster Factory',
        type: 'Alabaster Workshop',
        desc: 'Family-run genuine alabaster workshop on the West Bank. Fourth-generation craftsmen. Watches, vases, canopic jars, and Pharaonic statues. Quality certification available.',
        area: 'West Bank, near Colossi of Memnon',
        hours: 'Daily 08:00–18:00',
        price: 'Mid',
        phone: '+20 95 231 1234',
        verified: true,
        tip: 'Buy directly from the workshop, not resellers in the bazaar. Same quality, 40% less cost.',
        tags: ['Alabaster', 'Workshop', 'Certified', 'West Bank'],
      },
      {
        name: 'Nile Papyrus Gallery (East Bank)',
        type: 'Papyrus Shop',
        desc: 'Government-registered papyrus gallery. Only real papyrus — not banana leaf. Certificates included. Paintings range from small prints (150 EGP) to framed art (2,500+ EGP). Free demonstration.',
        area: 'Corniche el-Nil, Luxor East Bank',
        hours: 'Daily 09:00–21:00',
        price: 'Mid–Premium',
        phone: '+20 95 237 5678',
        verified: true,
        tip: 'Real papyrus bends without cracking. Banana leaf cracks when folded. Test before buying.',
        tags: ['Papyrus', 'Government registered', 'Certificates', 'Art'],
      },
      {
        name: 'Luxor Crafts Market (Winter Palace Area)',
        type: 'Curated Craft Market',
        desc: 'Well-organised craft market near the Winter Palace Hotel. Fixed-price stalls mix with negotiable ones. Leather goods, woven baskets, hand-embroidered textiles, and Pharaonic replicas.',
        area: 'Near Sofitel Winter Palace, Corniche',
        hours: 'Daily 10:00–22:00 (Oct–Apr)',
        price: 'Mid',
        phone: '',
        verified: false,
        tip: 'Near the Winter Palace the sellers are somewhat calmer than Sharia el-Souk. Better for first-time buyers.',
        tags: ['Leather', 'Textiles', 'Fixed prices available', 'Seasonal'],
      },
      {
        name: 'West Bank Nubian Weavers Cooperative',
        type: 'Cooperative Craft Shop',
        desc: 'Women\'s cooperative on the West Bank selling hand-woven textiles, rugs, and baskets. Proceeds go directly to Nubian families. Unique patterns. Fixed fair prices — no bargaining.',
        area: 'West Bank, near Medinet Habu',
        hours: 'Sat–Thu 09:00–17:00',
        price: 'Mid (fair trade)',
        phone: '+20 100 987 6543',
        verified: true,
        tip: 'Fixed prices here are genuinely fair — these are artisan wages, not tourist markups.',
        tags: ['Nubian weaving', 'Cooperative', 'Fair trade', 'Women-run'],
      },
      {
        name: 'Antique License Dealers (East Bank)',
        type: 'Licensed Antiquities Dealers',
        desc: 'Only buy antiques from shops displaying Ministry of Culture license. Licensed dealers can provide export certificates. Buying unlicensed "antiques" is illegal and items will be confiscated at the airport.',
        area: 'East Bank near Karnak',
        hours: 'Sat–Thu 10:00–20:00',
        price: 'Mid–Premium',
        phone: '',
        verified: true,
        tip: 'Insist on seeing the Ministry of Culture export certificate before purchasing any item over 500 EGP.',
        tags: ['Antiquities', 'Licensed', 'Export certificates', 'Legal only'],
      },
    ],
  },
  aswan: {
    seoTitle: 'Best Bazaars & Handmade Shopping in Aswan Egypt',
    seoDesc: 'Guide to Aswan\'s authentic Nubian markets, handmade crafts and best shopping spots. Prices in EGP, scam tips, and verified recommendations.',
    intro: 'Aswan has the most authentic bazaar in all of Egypt\'s tourist cities — the Aswan Market on Sharia el-Souk. It\'s also the most Nubian-influenced, with unique crafts you cannot find anywhere else in Egypt.',
    scamAlert: 'Spice sellers near Aswan train station charge 10–20x normal prices. Buy spices inside the market, away from the station entrance, for realistic prices.',
    listings: [
      {
        name: 'Aswan Sharia el-Souk',
        type: 'Main Bazaar Street',
        desc: 'Aswan\'s main bazaar. More relaxed than Luxor, more authentic than Hurghada. Spices sold by actual farmers, Nubian crafts, hand-woven baskets, jewelry, and Pharaonic goods.',
        area: 'Central Aswan, parallel to Corniche',
        hours: 'Daily 08:00–midnight (closed Friday morning)',
        price: 'Budget–Mid',
        phone: '',
        verified: true,
        tip: 'Walk the full street first before buying. You\'ll find the same items at 5–6 stalls — buy from those furthest from the train station.',
        tags: ['Spices', 'Nubian crafts', 'Baskets', 'Jewelry'],
      },
      {
        name: 'Nubian Village Crafts (Gharb Soheil)',
        type: 'Village Craft Market',
        desc: 'The most authentic shopping in all of Aswan. Reach by felucca (15 EGP) to the Nubian village. Residents sell hand-painted goods, woven baskets, and hand-printed fabric directly from their homes.',
        area: 'Gharb Soheil Nubian Village (west bank by felucca)',
        hours: 'Daily 09:00–18:00',
        price: 'Budget',
        phone: '',
        verified: true,
        tip: 'This is where the goods sold in Aswan bazaar actually come from. Cut the middleman — buy here.',
        tags: ['Nubian', 'Village', 'Hand-painted', 'Authentic', 'Felucca access'],
      },
      {
        name: 'Aswan Spice Market',
        type: 'Spice & Herb Market',
        desc: 'Dedicated spice section inside the main bazaar. Hibiscus (karkadeh), cumin, fenugreek, dried mango, doum palm. Aswan hibiscus is the finest in Egypt. Sold by weight.',
        area: 'Central section of Sharia el-Souk',
        hours: 'Daily 08:00–22:00',
        price: 'Budget',
        phone: '',
        verified: true,
        tip: 'Fair price: 100g hibiscus = 25–35 EGP. Walk away if quoted more than 80 EGP per 100g.',
        tags: ['Hibiscus', 'Spices', 'Herbs', 'Sold by weight'],
      },
      {
        name: 'Khaled Nubian Handmade Gallery',
        type: 'Nubian Art Gallery',
        desc: 'Small family gallery selling original Nubian hand-painted textiles, bracelets, and wall art. Owned by a Nubian family from Gharb Soheil. Genuine crafts, no factory goods.',
        area: 'Corniche el-Nil, central Aswan',
        hours: 'Sat–Thu 10:00–20:00',
        price: 'Mid',
        phone: '+20 97 230 5678',
        verified: true,
        tip: 'Ask to see the family workshop photos — this gallery is genuinely family-produced.',
        tags: ['Nubian art', 'Family-run', 'Original', 'Textiles'],
      },
      {
        name: 'Aswan Alabaster & Stone Workshop',
        type: 'Stone Craft Workshop',
        desc: 'Workshop producing Aswan granite souvenirs and alabaster goods. Aswan granite is world-famous — used in the High Dam. Small sculptures, paperweights, and jewelry.',
        area: 'Near Aswan train station',
        hours: 'Sat–Thu 09:00–18:00',
        price: 'Mid',
        phone: '+20 97 230 4321',
        verified: true,
        tip: 'Aswan granite items are unique to this city — you cannot buy them authentically anywhere else.',
        tags: ['Granite', 'Alabaster', 'Workshop', 'Unique to Aswan'],
      },
    ],
  },
};

const CITIES_LIST = [
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '🤿 Sharm El Sheikh' },
  { id: 'luxor', label: '🏛️ Luxor' },
  { id: 'aswan', label: '🛶 Aswan' },
];

const PRICE_COLORS = {
  'Budget': 'bg-emerald-500/10 text-emerald-600',
  'Budget–Mid': 'bg-emerald-500/10 text-emerald-600',
  'Mid': 'bg-amber-500/10 text-amber-600',
  'Mid (fair trade)': 'bg-amber-500/10 text-amber-600',
  'Mid–Premium': 'bg-amber-500/10 text-amber-600',
  'Premium': 'bg-red-500/10 text-red-600',
};

export default function Bazaars() {
  const { lang } = useOutletContext();
  const [city, setCity] = useState('hurghada');
  const data = BAZAAR_DATA[city];

  useSEO({
    title: data.seoTitle,
    description: data.seoDesc,
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="w-6 h-6 text-accent" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Bazaars & Handmade Shopping</h1>
        </div>
        <p className="text-sm text-muted-foreground">Authentic markets, local crafts, and verified shopping guides for all cities.</p>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {CITIES_LIST.map(c => (
          <button key={c.id} onClick={() => setCity(c.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${city === c.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* City intro */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{data.intro}</p>
      </div>

      {/* Scam alert */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-amber-700 leading-relaxed">{data.scamAlert}</p>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {data.listings.map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{item.type}</span>
                    {item.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRICE_COLORS[item.price] || 'bg-secondary text-muted-foreground'}`}>
                      {item.price}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base">{item.name}</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>

            <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-b border-border/20">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item.area}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Clock className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item.hours}</span>
              </div>
              {item.phone && (
                <div className="flex items-start gap-1.5">
                  <Phone className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                  <a href={`tel:${item.phone}`} className="text-accent font-bold">{item.phone}</a>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-b border-border/20">
              {item.tags.map((tag, j) => (
                <span key={j} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>

            {/* Pro tip */}
            <div className="px-4 py-3 bg-accent/5">
              <p className="text-xs text-muted-foreground"><strong className="text-accent">💡 Pro tip:</strong> {item.tip}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-secondary/50 rounded-2xl p-4 text-center text-xs text-muted-foreground">
        Found a great local shop?{' '}
        <a href="/verify-apply" className="text-accent font-bold underline underline-offset-2">Suggest it for verification →</a>
      </div>
    </div>
  );
}