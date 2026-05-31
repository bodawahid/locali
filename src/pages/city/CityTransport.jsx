import { useParams } from 'react-router-dom';
import { CITY_META, CITY_TRANSPORT, CITY_LISTINGS } from '../../lib/cityContent';
import { useSEO, buildFAQSchema } from '../../lib/seo';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import ListingCard from '../../components/city/ListingCard';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { Car, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'Is Uber available in Sharm El Sheikh?', a: 'Yes, both Uber and Careem operate in Sharm El Sheikh. They are the safest and most transparent way to get around — no negotiation, fixed prices, tracked rides.' },
    { q: 'How much is a taxi from Sharm El Sheikh airport to Naama Bay?', a: 'The fair price is 150–200 EGP. Do not pay more than 250 EGP. Use the official taxi desk inside the arrivals hall, or order Careem when you exit.' },
    { q: 'Are there buses in Sharm El Sheikh?', a: 'There is no tourist bus network. White taxis and ride apps are your options. Some hotels run free shuttles to Naama Bay — always check with your hotel first.' },
    { q: 'Is it safe to take a taxi alone at night in Sharm?', a: 'Yes, but always share your live location with someone and confirm the price before getting in. Use Uber/Careem at night for the tracking feature.' },
  ],
  hurghada: [
    { q: 'How do I get around Hurghada?', a: 'Careem is widely used and reliable. The local microbus (5–10 EGP) runs along the main road for short hops. For airport transfers, use the official desk inside arrivals.' },
    { q: 'How much is the airport taxi in Hurghada?', a: 'Official airport taxi to most hotel zones: 150–250 EGP. If anyone outside arrivals quotes 400+ EGP, walk back inside to the official taxi desk.' },
    { q: 'Is it worth renting a car in Hurghada?', a: 'For first-timers, not recommended. Egyptian traffic requires local knowledge. A private driver for the day (400–600 EGP) is safer and more practical.' },
    { q: 'How long does it take to get from Hurghada to Luxor?', a: 'By tourist bus: 6–7 hours, 200–350 EGP. By private car: 5–6 hours. By fly: 1 hour but expensive. The road is safe and the scenery changes dramatically.' },
  ],
  luxor: [
    { q: 'How do I get to the West Bank in Luxor?', a: 'Take the local passenger ferry from the Corniche (5 EGP). Runs from 6am to around 10pm. On the West Bank, rent a bicycle or hire a taxi for temple visits.' },
    { q: 'Is it safe to rent a bike in Luxor?', a: 'Yes, the West Bank roads near the temples are quiet and relatively flat. Rent from guesthouses near the ferry landing for 80–120 EGP/day. Start early before the heat.' },
    { q: 'How much should a taxi cost in Luxor?', a: 'City center trips: 40–80 EGP. Airport to Corniche: 80–120 EGP. A full-day private taxi with driver for temple visits: 400–600 EGP. Always agree in EGP before departure.' },
    { q: 'What is a calèche in Luxor?', a: 'A horse-drawn carriage (calèche) is a traditional way to get around Luxor. Negotiate a round-trip price in EGP before starting — typically 100–200 EGP for a city circuit.' },
  ],
  aswan: [
    { q: 'How do I get to Elephantine Island from Aswan?', a: 'Small motor boats depart from the Corniche constantly — 5–10 EGP per trip. Agree on price before boarding. The crossing takes about 5 minutes.' },
    { q: 'Can I travel to Abu Simbel by car?', a: 'Individual vehicles must join the official police convoy that departs at 4am. The convoy is mandatory for security reasons. You cannot drive alone.' },
    { q: 'How do I get from Aswan to Luxor?', a: 'Train is best: 2–3 hours, 60–150 EGP. The overnight sleeper train is a memorable experience. Alternatively, a private car takes 3–4 hours (700–1,000 EGP).' },
    { q: 'Are there tuk-tuks in Aswan?', a: 'Yes, tuk-tuks (auto-rickshaws) operate in some parts of Aswan and are cheap. Always negotiate the price before getting in. Typically 20–50 EGP for short trips.' },
  ],
};

const TAXI_NEGOTIATION = [
  'Always state your destination AND price before getting in — not after.',
  'If the driver says "meter is broken," agree on a price or find another taxi.',
  'All prices should be in Egyptian Pounds. If quoted in USD, ask for EGP equivalent.',
  'Having your destination written in Arabic on your phone helps enormously.',
  'The "price doubles at night" claim is a scam — agree clearly before midnight.',
];

export default function CityTransport() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const transport = CITY_TRANSPORT[cityId];
  const transportListings = CITY_LISTINGS[cityId]?.transport || [];
  const faqs = FAQS[cityId] || [];

  useSEO({
    title: meta ? `Transport & Taxis in ${meta.name} 2026 — Prices & How to Get Around` : 'Egypt Transport Guide',
    description: meta ? `Complete transport guide for ${meta.name}: taxi prices, how to avoid overcharging, ride apps, airport transfers, and getting around safely in 2026.` : '',
    jsonLd: faqs.length ? buildFAQSchema(faqs) : undefined,
  });

  if (!meta || !transport) return <div className="p-4">City not found</div>;

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Transport &amp; Taxi Guide — {meta.name} 2026
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          {transport.intro} This guide gives you exact prices, the safest options, and what to say when a driver tries to overcharge you.
        </p>

        {/* How to get around */}
        <h2 className="text-xl font-extrabold mb-4">How to Get Around {meta.name}</h2>
        <div className="space-y-3 mb-10">
          {transport.tips.map((tip, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Warning */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-3 mb-10">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700 mb-1">Key Safety Rule</p>
            <p className="text-sm text-muted-foreground">{transport.safety}</p>
          </div>
        </div>

        {/* Taxi negotiation */}
        <h2 className="text-xl font-extrabold mb-4">How to Negotiate Taxis in {meta.name}</h2>
        <div className="space-y-2 mb-10">
          {TAXI_NEGOTIATION.map((rule, i) => (
            <div key={i} className="flex gap-3 items-start bg-card rounded-2xl border border-border/50 p-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center shrink-0">{i + 1}</span>
              <p className="text-sm text-muted-foreground">{rule}</p>
            </div>
          ))}
        </div>

        {/* Transport Listings */}
        {transportListings.length > 0 && (
          <>
            <h2 className="text-xl font-extrabold mb-4">Trusted Transport Options in {meta.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {transportListings.map((t, i) => <ListingCard key={i} listing={t} />)}
            </div>
          </>
        )}

        {/* Ride apps section */}
        <h2 className="text-xl font-extrabold mb-4">Ride Apps in Egypt — What Works Where</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            { app: 'Careem', available: 'All major cities', notes: 'Most reliable. Fixed prices. Arabic + English. Download before arrival.', recommended: true },
            { app: 'Uber', available: 'Sharm, Hurghada, Cairo', notes: 'Works well in resort cities. Less reliable in Upper Egypt.', recommended: true },
            { app: 'InDrive', available: 'Cairo, Alexandria', notes: 'Bid-based pricing. Good for budget travelers in Cairo.', recommended: false },
            { app: 'Official Airport Taxi', available: 'All airports', notes: 'Inside the arrivals hall. Fixed price board. Use this, not drivers outside.', recommended: true },
          ].map((item, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${item.recommended ? 'bg-success/5 border-success/20' : 'bg-card border-border/50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">{item.app}</h3>
                {item.recommended && <span className="text-[10px] font-bold bg-success text-success-foreground px-2 py-0.5 rounded-full">RECOMMENDED</span>}
              </div>
              <p className="text-xs text-muted-foreground mb-1"><strong>Available in:</strong> {item.available}</p>
              <p className="text-xs text-muted-foreground">{item.notes}</p>
            </div>
          ))}
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Taxi Prices in ${meta.name}`}
            description="Know exactly what you should be paying"
            to={`/city/${cityId}/prices`}
          />
          <SafeNextStep
            title={`Transport Scams in ${meta.name}`}
            description="The specific tricks used on tourists"
            to={`/city/${cityId}/scams`}
          />
        </div>
      </div>
    </div>
  );
}