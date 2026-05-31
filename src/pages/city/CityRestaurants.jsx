import { useParams } from 'react-router-dom';
import { CITY_META, CITY_LISTINGS } from '../../lib/cityContent';
import { useSEO, buildFAQSchema } from '../../lib/seo';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import ListingCard from '../../components/city/ListingCard';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import CityMap from '../../components/city/CityMap';
import { Info, AlertTriangle } from 'lucide-react';

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'Where do locals eat in Sharm El Sheikh?', a: 'Locals eat in the Old Market area and Hadaba district. These areas have no tourist markup and serve genuine Egyptian food at Egyptian prices. Avoid the Naama Bay strip for budget eating.' },
    { q: 'Are Naama Bay restaurants good value?', a: 'No. Naama Bay is the tourist strip and prices are 2–4x what you\'d pay elsewhere. Eat here once for the atmosphere — not as your daily dining option.' },
    { q: 'What is the average meal cost in Sharm El Sheikh?', a: 'A local restaurant meal costs 80–150 EGP. A tourist-area meal runs 200–400 EGP. A scam-price restaurant on the main strip may charge 600+ EGP for a meal worth 200.' },
    { q: 'Is it safe to eat street food in Sharm El Sheikh?', a: 'From busy stalls with high turnover, yes. Avoid seafood from unlicensed carts. Koshary, falafel, and ful from busy local spots are very safe and excellent.' },
  ],
  hurghada: [
    { q: 'Where can I find local food in Hurghada?', a: 'El Dahar is the old town area where Hurghada\'s real food scene is. Restaurants here serve Egyptians, not tourists, and prices show it. Felfela and similar spots are the standard.' },
    { q: 'Is food safe to eat in Hurghada?', a: 'Stick to cooked food from busy restaurants with high turnover. Avoid salads and raw items from street carts if you have a sensitive stomach. Bottled water only.' },
    { q: 'What Egyptian dishes should I try in Hurghada?', a: 'Koshary (lentils, pasta, tomato sauce), ful medames (fava bean stew), hawawshi (spiced meat in bread), and grilled fish by weight are all excellent and authentic.' },
    { q: 'How much should a restaurant meal cost in Hurghada?', a: 'A genuine local restaurant: 60–120 EGP per person. A mid-range tourist restaurant: 150–300 EGP. Anything above 500 EGP for a standard meal is overcharging.' },
  ],
  luxor: [
    { q: 'What is Nubian food?', a: 'Nubian cuisine features slow-cooked stews, black-eyed peas, grilled Nile fish, fresh-baked bread and tamiya (falafel). Distinctly different from Cairo\'s food scene and excellent value.' },
    { q: 'Should I eat at my hotel in Luxor?', a: 'Hotel restaurants are convenient but overpriced by 200–400%. Walking 5 minutes from your hotel will halve your meal cost. Sofra and Habiba\'s West Bank are both worth the short trip.' },
    { q: 'Is the West Bank food scene good in Luxor?', a: 'The West Bank has excellent small family restaurants catering to budget travelers and archaeology workers. Habiba\'s Kitchen is a local legend. Food is simple, fresh, and honest.' },
    { q: 'Can I drink alcohol in Luxor restaurants?', a: 'Some restaurants in Luxor serve alcohol. Hotels reliably do. Ask before ordering — many local restaurants are dry.' },
  ],
  aswan: [
    { q: 'What is the food like in Aswan?', a: 'Aswan has a distinct Nubian and Upper Egyptian cuisine. Fish from the Nile, grilled meats, and Nubian staples like ful and tamiya. Much cheaper than Luxor or the Red Sea resorts.' },
    { q: 'Can I eat on a felucca?', a: 'Many felucca captains can arrange simple meals on the boat. It\'s a memorable experience — packed lunches of bread, cheese, and fuul on the Nile while sailing.' },
    { q: 'Is there good vegetarian food in Aswan?', a: 'Yes. Egyptian food is naturally very vegetarian-friendly — ful (fava beans), koshary, tamiya, salads, bread, and rice dishes are everywhere and filling.' },
    { q: 'Where should I eat dinner in Aswan?', a: 'The Corniche restaurants offer Nile views but mild tourist premiums. For best value: walk one block inland where local Aswan families eat. Look for busy spots with Egyptians.' },
  ],
};

const EATING_TIPS = [
  { tip: 'Look for restaurants where Egyptians are eating. Locals avoid tourist traps just like you should.', icon: '👥' },
  { tip: 'Ask for the menu with prices before sitting down. Tourist areas sometimes have "tourist menus" without prices posted.', icon: '📋' },
  { tip: 'Check your bill itemized. Unexplained "service charges" and "bread fees" are common.', icon: '🧾' },
  { tip: 'Never eat from a place that has a tout standing outside pulling you in. Good restaurants don\'t need them.', icon: '🚫' },
  { tip: 'Lunch (1–3pm) is Egypt\'s main meal. Better food, better prices, and fewer tourists at that time.', icon: '☀️' },
];

export default function CityRestaurants() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const listings = CITY_LISTINGS[cityId]?.restaurants || [];
  const faqs = FAQS[cityId] || [];

  useSEO({
    title: meta ? `Best Restaurants in ${meta.name} 2025 — Where Locals Actually Eat` : 'Egypt Restaurant Guide',
    description: meta ? `Honest restaurant recommendations for ${meta.name}. Where locals eat, what's overpriced, what's worth visiting. No sponsored listings. Practical 2025 guide.` : '',
    jsonLd: faqs.length ? buildFAQSchema(faqs) : undefined,
  });

  if (!meta) return <div className="p-4">City not found</div>;

  const mapMarkers = listings.map(r => ({ lat: r.lat, lng: r.lng, label: r.name, type: 'restaurant' }));

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Best Restaurants in {meta.name} — Honest 2025 Guide
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          Where to eat in {meta.name} without getting ripped off. No paid placements, no sponsored content. These restaurants are chosen because they serve real food at honest prices — places where Egyptians eat alongside tourists who know better.
        </p>

        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex gap-3 mb-8">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Editorial policy:</strong> No restaurant has paid for placement on this page. Price symbols: € = budget (under 100 EGP), €€ = mid-range (100–250 EGP), €€€ = premium (250+ EGP).
          </p>
        </div>

        {/* Map */}
        {mapMarkers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold mb-3">Restaurant Locations — {meta.name}</h2>
            <CityMap cityId={cityId} markers={mapMarkers} />
          </div>
        )}

        {/* Listings */}
        <h2 className="text-xl font-extrabold mb-4">Recommended Restaurants in {meta.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {listings.map((r, i) => <ListingCard key={i} listing={r} />)}
        </div>

        {/* How to eat smart */}
        <h2 className="text-xl font-extrabold mb-4">How to Eat Smart in {meta.name}</h2>
        <div className="space-y-3 mb-10">
          {EATING_TIPS.map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
              <span className="text-lg">{item.icon}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>

        {/* What to order */}
        <h2 className="text-xl font-extrabold mb-4">Egyptian Food Worth Ordering</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          {[
            { dish: 'Koshary', desc: 'Egypt\'s national dish. Lentils, pasta, rice, tomato sauce, fried onions. Under 30 EGP. Nothing better at this price.' },
            { dish: 'Ful Medames', desc: 'Slow-cooked fava beans with oil and spice. The Egyptian breakfast of champions. 15–30 EGP.' },
            { dish: 'Tamiya (Falafel)', desc: 'Egyptian falafel is made with fava beans, not chickpeas. Crunchier and more flavourful. 10–20 EGP for a sandwich.' },
            { dish: 'Grilled Fish by Weight', desc: 'Order fresh fish by the kilogram from coastal restaurants. Ask the price per kilo before they grill it.' },
            { dish: 'Hawawshi', desc: 'Spiced minced meat in crispy bread. Street food at its best. 40–70 EGP for a filling meal.' },
            { dish: 'Fresh Juice', desc: 'Mango, guava, sugar cane, pomegranate — Egyptian juice bars are world-class. 20–50 EGP for a large glass.' },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <h3 className="font-bold text-sm mb-1">{item.dish}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Real Prices in ${meta.name}`}
            description="Know what a meal should actually cost before you sit down"
            to={`/city/${cityId}/prices`}
          />
          <SafeNextStep
            title={`Common Scams in ${meta.name}`}
            description="Restaurant scams are real — know them first"
            to={`/city/${cityId}/scams`}
          />
        </div>
      </div>
    </div>
  );
}