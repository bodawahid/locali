import { useParams } from 'react-router-dom';
import { CITY_META, CITY_LISTINGS } from '../../lib/cityContent';
import { useSEO, buildFAQSchema } from '../../lib/seo';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import ListingCard from '../../components/city/ListingCard';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import CityMap from '../../components/city/CityMap';
import { Info, AlertTriangle, Star } from 'lucide-react';

const CITY_HIGHLIGHTS = {
  'sharm-el-sheikh': {
    intro: 'Sharm El Sheikh is one of the world\'s top diving destinations. The reefs here survived while others didn\'t. Beyond diving, the Sinai desert offers genuine adventure. Avoid the inflated hotel-packaged tours.',
    mustDo: [
      { title: 'Dive Ras Mohammed National Park', desc: 'The best reef diving in the Sinai. Shark Reef, Yolanda Reef, and Jackson Reef are world-famous walls. Book through certified PADI centers only.', price: '700–1,100 EGP (2 dives)' },
      { title: 'Snorkel Tiran Island', desc: 'Four incredible reef systems accessible by day boat. Visibility often exceeds 30m. The best snorkeling in Egypt.', price: '400–600 EGP (day trip)' },
      { title: 'Sinai Desert Safari at Sunset', desc: 'Jeep + camel + bonfire in the desert at sunset. Genuinely spectacular. Book directly with operators in El Tur, not through hotel desks.', price: '500–800 EGP' },
      { title: 'St. Catherine\'s Monastery', desc: 'One of the world\'s oldest Christian monasteries. 3-hour drive. Open mornings only. Free entry. An extraordinary and uncrowded experience.', price: 'Free (transport: 300–500 EGP)' },
    ],
  },
  hurghada: {
    intro: 'Hurghada\'s strength is its offshore reef system — some of Egypt\'s most accessible diving. The city itself is functional but not beautiful. The sea is the reason to come.',
    mustDo: [
      { title: 'Giftun Island Day Trip', desc: 'Two uninhabited islands with pristine reefs and white sand beaches. The best snorkeling accessible from Hurghada. Book at the marina for fair prices.', price: '350–600 EGP' },
      { title: 'Desert Quad Safari', desc: '4-wheel quad bikes, camel ride, and Bedouin dinner in the eastern desert. Avoid hotel packages — book directly. Always confirm group price.', price: '600–900 EGP (group price)' },
      { title: 'Dolphin House Boat Trip', desc: 'Snorkel alongside wild spinner dolphins near Shaab El Erg reef. Morning departures from the marina. One of Egypt\'s most magical experiences.', price: '400–700 EGP' },
      { title: 'El Dahar Old Town Walk', desc: 'Hurghada\'s original fishing village. Markets, local cafés, and no tourist inflation. Take 2 hours and eat lunch here instead of the strip.', price: 'Free' },
    ],
  },
  luxor: {
    intro: 'Luxor contains more ancient monuments than any city on earth. You need 3–4 days minimum to see it properly without rushing. The West Bank alone could fill a week.',
    mustDo: [
      { title: 'Valley of the Kings', desc: 'Sixty-three royal tombs carved into the limestone cliffs. The standard ticket covers 3. Add Tutankhamun for 300 EGP extra. Arrive before 7am.', price: '360 EGP (3 tombs)' },
      { title: 'Karnak Temple Complex', desc: 'The largest ancient religious complex ever built. The Great Hypostyle Hall alone — 134 columns, each 21 meters tall — is unlike anything else in the world.', price: '300 EGP' },
      { title: 'Sunrise Hot Air Balloon', desc: 'Float over the Valley of the Kings at sunrise. One of the great travel experiences. Only book certified ECAA operators. Non-certified balloons have crashed fatally.', price: '1,500–2,000 EGP' },
      { title: 'Medinet Habu & Mortuary Temples', desc: 'Ramesses III\'s mortuary temple is better-preserved than most and far less crowded than Karnak. The colors inside are still vivid after 3,200 years.', price: '180 EGP' },
    ],
  },
  aswan: {
    intro: 'Aswan is Egypt\'s southernmost city and most beautiful Nile landscape. The pace is slower, the people are genuinely welcoming, and Abu Simbel is a once-in-a-lifetime experience.',
    mustDo: [
      { title: 'Abu Simbel Temples', desc: 'Two massive temples carved into a cliff face by Ramesses II. One of the most impressive monuments on earth. The convoy departs at 4am — worth every second of lost sleep.', price: '360 EGP entry + transport' },
      { title: 'Philae Temple by Sunset', desc: 'The Temple of Isis on Agilkia Island. Take the official boat from the dock (included in ticket). The evening light show is spectacular.', price: '180 EGP + 40 EGP boat' },
      { title: 'Felucca Sunset on the Nile', desc: 'A 2-hour traditional sailing boat ride past Elephantine Island, the Aga Khan Mausoleum, and the Nubian west bank. Negotiate the whole boat, not per person.', price: '150–250 EGP (whole boat, 2 hrs)' },
      { title: 'Nubian Village Visit', desc: 'Cross to a Nubian village by small boat. Painted houses, Nubian music, and genuine hospitality. The boat is 100–200 EGP — not per person.', price: '100–200 EGP (boat)' },
    ],
  },
};

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'What is the best activity in Sharm El Sheikh?', a: 'Diving and snorkeling are the main draws. The reefs around Ras Mohammed National Park and Tiran Island are world-class. Book with a PADI-certified center — avoid unverified operators.' },
    { q: 'Can beginners dive in Sharm El Sheikh?', a: 'Yes, Sharm has some of the best conditions for beginners. Many centers offer intro dives with no certification needed, and PADI Open Water courses take 3–4 days.' },
    { q: 'Is a Sharm El Sheikh desert safari worth it?', a: 'Yes, if booked directly with operators — not through your hotel. A 4-hour evening desert safari includes quads, camels, and Bedouin dinner for 500–800 EGP.' },
    { q: 'How do I book activities without getting scammed in Sharm?', a: 'Go to the dive center, marina, or activity company directly. Avoid booking through hotel receptions, beach touts, or anyone who approaches you unsolicited.' },
  ],
  hurghada: [
    { q: 'What are the best things to do in Hurghada?', a: 'Giftun Island snorkeling, Dolphin House boat trip, desert safari, and El Dahar old town. All can be booked at fair prices directly — not through hotel packages.' },
    { q: 'Is the desert safari in Hurghada worth it?', a: 'Yes, if booked correctly. A 4-hour safari includes quad biking, camel riding, and Bedouin dinner. Fair group price: 600–900 EGP. Hotel packages mark up 2–3x.' },
    { q: 'Can you see dolphins in Hurghada?', a: 'Yes. Wild spinner dolphins are regularly seen near Shaab El Erg reef (Dolphin House). Book a morning snorkel trip from the marina. No guarantees but sightings are common.' },
    { q: 'Is Giftun Island worth visiting from Hurghada?', a: 'Absolutely. Giftun Island has excellent reef snorkeling and a beautiful sandy beach. Book the day trip from the marina rather than through hotels for the best price.' },
  ],
  luxor: [
    { q: 'What are the must-see sites in Luxor?', a: 'Valley of the Kings (West Bank), Karnak Temple (East Bank), Luxor Temple at night, Medinet Habu, and a sunrise hot air balloon over the ancient landscape.' },
    { q: 'How long does Valley of the Kings take?', a: 'The standard ticket covers 3 tombs. Allow 2–3 hours minimum. Arrive before 7am to beat the heat and crowds. The tombs are underground and naturally cool.' },
    { q: 'Is a Luxor hot air balloon safe?', a: 'Only if you book certified operators. Fatal accidents have occurred with uncertified companies offering cheap rates. Pay the fair price (1,500–2,000 EGP) for a certified flight.' },
    { q: 'Is the Luxor Pass worth buying?', a: 'If you plan to visit more than 4–5 sites, yes. The Luxor Pass ($100 USD, 5-day) covers most major sites. Available at the Luxor Museum. Pay in USD cash.' },
  ],
  aswan: [
    { q: 'What is the most important site near Aswan?', a: 'Abu Simbel. Built by Ramesses II, the twin rock-cut temples are among the most impressive monuments on earth. The 3-hour drive each way is completely worth it.' },
    { q: 'Is Philae Temple worth visiting in Aswan?', a: 'Absolutely. Philae (Temple of Isis) sits on an island in the Nile reached by boat. The evening sound and light show is spectacular and reasonably priced.' },
    { q: 'Is it worth doing a felucca overnight in Aswan?', a: 'An overnight felucca trip sleeping under the stars on the Nile is a genuine travel experience. Negotiate the full boat price (not per person) and agree on food included.' },
    { q: 'How do I get to Abu Simbel from Aswan?', a: 'The official convoy departs at 4am daily from Aswan. 3 hours each way. Shared bus: 400–600 EGP. Private car via convoy: more expensive. Flying is fastest but costly.' },
  ],
};

export default function CityThingsToDo() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const activities = CITY_LISTINGS[cityId]?.activities || [];
  const faqs = FAQS[cityId] || [];
  const highlights = CITY_HIGHLIGHTS[cityId];

  useSEO({
    title: meta ? `Things To Do in ${meta.name} 2025 — Honest Activity Guide` : 'Egypt Activities Guide',
    description: meta ? `Best activities and experiences in ${meta.name} for 2025. Fair prices, certified operators, no tourist traps. What's worth doing and what to skip.` : '',
    jsonLd: faqs.length ? buildFAQSchema(faqs) : undefined,
  });

  if (!meta) return <div className="p-4">City not found</div>;

  const mapMarkers = activities.map(a => ({ lat: a.lat, lng: a.lng, label: a.name, type: 'activity' }));

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Things To Do in {meta.name} — 2025 Honest Activity Guide
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {highlights?.intro}
        </p>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 mb-8">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Scam alert:</strong> Many fake tour operators operate near tourist sites. Always book through official operators or certified centers — never through strangers who approach you on the street.
          </p>
        </div>

        {/* Must-do section */}
        <h2 className="text-xl font-extrabold mb-4">Best Things To Do in {meta.name} — With Real Prices</h2>
        <div className="space-y-4 mb-10">
          {highlights?.mustDo.map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent fill-accent shrink-0" />
                  {item.title}
                </h3>
                <span className="text-xs font-bold text-accent shrink-0 bg-accent/10 px-2 py-1 rounded-lg">{item.price}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Map */}
        {mapMarkers.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-extrabold mb-3">Activity Map — {meta.name}</h2>
            <CityMap cityId={cityId} markers={mapMarkers} />
          </div>
        )}

        {/* Verified listings */}
        {activities.length > 0 && (
          <>
            <h2 className="text-xl font-extrabold mb-4">Verified Activity Operators in {meta.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {activities.map((a, i) => <ListingCard key={i} listing={a} />)}
            </div>
          </>
        )}

        {/* Booking advice */}
        <h2 className="text-xl font-extrabold mb-4">How to Book Activities Without Getting Scammed</h2>
        <div className="space-y-3 mb-10">
          {[
            { tip: 'Book activities directly with the operator — not through your hotel reception. Hotels add 100–200% markup.', icon: '🏢' },
            { tip: 'For diving: only use PADI or SSI certified dive centers. Ask to see their certification before paying.', icon: '🤿' },
            { tip: 'For balloon rides: only use ECAA (Egyptian Civil Aviation Authority) certified operators. Uncertified balloons have crashed.', icon: '🎈' },
            { tip: 'Ask for a written breakdown of everything included in the price before paying. "Hidden add-ons" are the most common tour scam.', icon: '📄' },
            { tip: 'Government ticket prices for temples and museums are fixed and posted. No one can offer you a "special rate" on official tickets.', icon: '🏛️' },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
              <span className="text-lg">{item.icon}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Real Activity Prices in ${meta.name}`}
            description="Know the fair price before you negotiate"
            to={`/city/${cityId}/prices`}
          />
          <SafeNextStep
            title={`Activity Scams in ${meta.name}`}
            description="Specific scams targeting activities and tours"
            to={`/city/${cityId}/scams`}
          />
        </div>
      </div>
    </div>
  );
}