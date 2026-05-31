import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp, Navigation, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableImage from '../components/EditableImage';

const EXPERIENCES = [
  {
    id: 'psoriasis-safaga',
    title: 'Psoriasis Treatment',
    location: 'Safaga, Red Sea Coast',
    emoji: '🏖️',
    tier: 'Medical',
    tierColor: 'bg-rose-100 text-rose-700 border-rose-200',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85',
    tagline: 'Natural radioactive black sand therapy for chronic skin conditions',
    description:
      "Safaga's beaches contain naturally occurring black sand with low, safe concentrations of minerals including thorium and uranium. These conditions are clinically studied and believed to improve psoriasis and chronic eczema through controlled sun and mineral exposure. European patients, particularly from Germany and Eastern Europe, have been visiting Safaga for skin therapy since the 1980s under medical supervision.",
    whyVisit:
      "Studies from European dermatology institutes have documented measurable improvement in psoriasis symptoms after multi-week stays in Safaga. The combination of Red Sea salt water, dry heat, and mineral-rich black sand creates a therapeutic trifecta not easily replicated in clinical settings.",
    bestFor: ['Psoriasis patients', 'Chronic eczema', 'Skin inflammation'],
    season: 'October – April (avoid peak summer heat)',
    duration: '2–4 weeks recommended for noticeable effects',
    tip: 'Consult a dermatologist before your visit. Some clinics in Safaga offer supervised treatment programs.',
    mapQuery: 'Safaga black sand beach Red Sea Egypt',
  },
  {
    id: 'rheumatism-aswan',
    title: 'Rheumatism Relief',
    location: 'Aswan, Southern Egypt',
    emoji: '☀️',
    tier: 'Therapeutic',
    tierColor: 'bg-amber-100 text-amber-700 border-amber-200',
    image: 'https://images.unsplash.com/photo-1553342385-111fd9d0c46a?w=800&q=85',
    tagline: 'Dry desert climate and stable heat for joint inflammation relief',
    description:
      "Aswan sits at one of the driest and most thermally stable points in Africa, with year-round temperatures averaging 35°C and humidity below 15%. This combination of low humidity, high atmospheric stability, and intense solar radiation creates natural conditions that reduce joint swelling and improve mobility for rheumatism and arthritis patients. Aswan has historically served as a therapeutic destination for Egyptian patients seeking climate-based relief.",
    whyVisit:
      "The body responds to dry heat by reducing systemic inflammation. Aswan's climate removes the damp-cold triggers that worsen rheumatic conditions, while gentle movement on flat terrain — and optional Nile swimming — supports joint rehabilitation without clinical intervention.",
    bestFor: ['Rheumatism & arthritis', 'Chronic joint pain', 'Post-surgery rehabilitation'],
    season: 'November – March (optimal dry warmth)',
    duration: '1–3 weeks',
    tip: 'Combine with Nile felucca rides for gentle, low-impact movement therapy.',
    mapQuery: 'Aswan Egypt healing climate',
  },
  {
    id: 'white-desert-mental',
    title: 'Psychological Healing',
    location: 'White Desert National Park, Farafra Oasis',
    emoji: '🏔️',
    tier: 'Mental Wellness',
    tierColor: 'bg-slate-100 text-slate-700 border-slate-200',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=85',
    tagline: 'Total silence and sensory minimalism for mental detox and anxiety relief',
    description:
      "The White Desert is one of Earth's most extreme environments for psychological reset — a vast expanse of white chalk rock formations, no light pollution, no connectivity, and zero urban noise. Visitors camp overnight under the stars in complete silence, disconnecting entirely from digital life. The experience is increasingly sought by burnout sufferers, anxiety patients, and trauma recovery programs as a form of structured 'wilderness therapy.'",
    whyVisit:
      "Neuroscience research on nature immersion consistently documents reductions in cortisol, anxiety, and rumination after 48–72 hours in silent wilderness environments. The White Desert provides this in a visually dramatic and culturally rich setting unavailable anywhere else on earth.",
    bestFor: ['Burnout & digital detox', 'Anxiety & stress', 'PTSD recovery programs', 'Mindfulness retreats'],
    season: 'October – March (cold nights, ideal for camping)',
    duration: '2–5 days',
    tip: 'Book a licensed desert guide. Camp is 6 hours from Cairo. No phone signal — bring it intentionally.',
    mapQuery: 'White Desert National Park Farafra Egypt',
  },
  {
    id: 'siwa-clay',
    title: 'Black Clay & Hot Spring Therapy',
    location: "Siwa Oasis, Western Desert (Cleopatra's Bath)",
    emoji: '🌿',
    tier: 'Traditional',
    tierColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    image: 'https://images.unsplash.com/photo-1585150166695-7a5e36394d9c?w=800&q=85',
    tagline: "Mineral-rich black clay and natural hot springs at Egypt's most ancient oasis",
    description:
      "Siwa Oasis sits in a deep depression in the Western Desert, fed by natural artesian springs rich in sulfur, magnesium, and calcium. Cleopatra's Bath — a natural spring pool used since antiquity — remains one of the most mineral-rich bathing sites in North Africa. The area's black clay is traditionally applied to skin and joints as a detoxifying and anti-inflammatory treatment, similar in composition to Dead Sea mud therapies.",
    whyVisit:
      "Siwa is remote, quiet, and deeply authentic — the last surviving community of the Berber Siwi people. Wellness visitors combine clay therapy, spring bathing, and the meditative quality of an oasis environment surrounded by sand dunes. The experience is unstructured but uniquely restorative.",
    bestFor: ['Skin detox', 'Muscle tension & joint pain', 'Holistic retreat seekers', 'Mineral bath therapy'],
    season: 'September – April',
    duration: '3–7 days recommended',
    tip: "Bring your own clean towels. The spring is open-access and free. Early morning visits are quietest.",
    mapQuery: "Cleopatra's Bath Siwa Oasis Egypt",
  },
  {
    id: 'dive-therapy-red-sea',
    title: 'Dive Therapy',
    location: 'Hurghada, Marsa Alam, Sharm El Sheikh',
    emoji: '🤿',
    tier: 'Therapeutic',
    tierColor: 'bg-blue-100 text-blue-700 border-blue-200',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=85',
    tagline: 'Underwater weightlessness and marine immersion for anxiety and PTSD reduction',
    description:
      "The Red Sea's calm, warm waters and world-class coral reefs create ideal conditions for structured dive therapy — a practice combining controlled breathing regulation, sensory immersion, and the weightlessness of underwater movement. Studies from European therapeutic dive programs document significant reductions in anxiety, PTSD symptoms, and depression markers. Egypt's affordable dive infrastructure and pristine marine environment make it a natural candidate for formal therapeutic programs.",
    whyVisit:
      "Breathing regulation during diving directly activates the parasympathetic nervous system, reducing fight-or-flight responses. The marine environment — fish, reefs, silence — engages sensory focus without cognitive overload. Veterans programs in the UK and US have adopted dive therapy with documented results.",
    bestFor: ['PTSD & trauma recovery', 'Anxiety disorders', 'Stress & burnout', 'Veterans programs'],
    season: 'Year-round (water temp 22–29°C)',
    duration: '5–10 day dive programs',
    tip: 'Look for PADI-certified dive centers in Hurghada or Dahab that offer beginner-friendly therapeutic sessions.',
    mapQuery: 'therapeutic diving Red Sea Hurghada Egypt',
  },
  {
    id: 'monastery-retreat',
    title: 'Spiritual Fasting Retreats',
    location: 'Saint Catherine Monastery (Sinai) · Wadi El Natrun Monasteries',
    emoji: '⛪',
    tier: 'Spiritual',
    tierColor: 'bg-purple-100 text-purple-700 border-purple-200',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=85',
    tagline: 'Silent stays, fasting, and desert isolation in Egypt\'s oldest Christian monasteries',
    description:
      "Egypt's Coptic and Eastern Orthodox monasteries — including Saint Catherine's, the world's oldest continuously operating monastery — offer structured retreat experiences in desert isolation. Guests participate in silent communal routines, prayer, fasting, and manual labor therapy. The monasteries at Wadi El Natrun, 90km from Cairo, offer shorter weekend retreats, while Saint Catherine's in the Sinai requires advance booking.",
    whyVisit:
      "The combination of historical sacred environments, desert silence, strict daily rhythm, and community-based simplicity creates a powerful context for psychological and spiritual restoration. These retreats are used by burnout professionals, religious seekers, and mental health practitioners across religious backgrounds.",
    bestFor: ['Spiritual seekers', 'Burnout professionals', 'Grief & emotional recovery', 'Religious heritage tours'],
    season: 'October – May',
    duration: '3–10 days (advance booking required)',
    tip: 'Wadi El Natrun requires advance reservation. Non-Coptic visitors are welcome with respectful conduct.',
    mapQuery: 'Saint Catherine Monastery Sinai Egypt retreat',
  },
  {
    id: 'thalassotherapy-red-sea',
    title: 'Thalassotherapy',
    location: 'Hurghada, El Gouna, Sharm El Sheikh',
    emoji: '🌊',
    tier: 'Medical',
    tierColor: 'bg-rose-100 text-rose-700 border-rose-200',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=85',
    tagline: 'Sea water, sea air, and marine climate therapy for skin, immunity, and stress',
    description:
      "Thalassotherapy is a medically recognized wellness practice using seawater, marine mud, seaweed, and sea air to improve health outcomes. The Red Sea — with its exceptional salinity, mineral density, and clean air quality — provides near-ideal conditions for this therapy. Benefits documented in European medical literature include improved skin conditions, enhanced immune response, reduced respiratory inflammation, and measurable stress reduction.",
    whyVisit:
      "The Red Sea's mineral composition — particularly magnesium, potassium, and calcium — is absorbed transdermally during immersion. Combined with iodine-rich sea air and UV exposure, a structured thalassotherapy program in Egypt offers effects equivalent to high-end European spa clinics at a fraction of the cost.",
    bestFor: ['Skin conditions', 'Respiratory health', 'Immune support', 'Post-illness recovery'],
    season: 'October – May (outside peak heat)',
    duration: '1–3 weeks',
    tip: 'Several 5-star hotels in El Gouna and Hurghada offer structured thalassotherapy programs. Ask about medical packages.',
    mapQuery: 'thalassotherapy Red Sea El Gouna Hurghada Egypt',
  },
];

const TIERS = ['All', 'Medical', 'Therapeutic', 'Mental Wellness', 'Traditional', 'Spiritual'];

const TIER_COLORS = {
  Medical: 'bg-rose-100 text-rose-700 border-rose-200',
  Therapeutic: 'bg-amber-100 text-amber-700 border-amber-200',
  'Mental Wellness': 'bg-slate-100 text-slate-700 border-slate-200',
  Traditional: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Spiritual: 'bg-purple-100 text-purple-700 border-purple-200',
};

function ExperienceCard({ exp }) {
  const [expanded, setExpanded] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(exp.mapQuery)}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <EditableImage
          src={exp.image}
          alt={exp.title}
          className="w-full h-full object-cover"
          sectionKey={`wellness_card_${exp.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Tier badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${exp.tierColor}`}>
            {exp.tier}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white/70 text-[11px] flex items-center gap-1 mb-0.5">
            <MapPin className="w-3 h-3" /> {exp.location}
          </p>
          <h3 className="text-white font-black text-lg leading-tight drop-shadow">
            {exp.emoji} {exp.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tagline */}
        <p className="text-xs font-bold text-teal-600 mb-2">{exp.tagline}</p>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{exp.description}</p>

        {/* Key facts */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Season</p>
            <p className="text-xs font-bold text-gray-800">{exp.season}</p>
          </div>
          <div className="bg-teal-50 rounded-xl px-3 py-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Stay</p>
            <p className="text-xs font-bold text-teal-700">{exp.duration}</p>
          </div>
        </div>

        {/* Best for */}
        <div className="flex flex-wrap gap-1 mb-3">
          {exp.bestFor.map((tag, i) => (
            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Expandable section */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between text-xs font-bold text-teal-600 mb-2"
        >
          <span>Why people visit</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="space-y-3 mb-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
              <p className="text-xs text-blue-800 leading-relaxed">{exp.whyVisit}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">💡 Practical Tip</p>
              <p className="text-xs text-amber-800">{exp.tip}</p>
            </div>
          </div>
        )}

        {/* Google Maps CTA */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" /> Find on Google Maps
        </a>
      </div>
    </div>
  );
}

export default function WellnessHealing() {
  const [tierFilter, setTierFilter] = useState('All');

  const filtered = tierFilter === 'All'
    ? EXPERIENCES
    : EXPERIENCES.filter(e => e.tier === tierFilter);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative bg-teal-700 overflow-hidden">
        <div className="absolute inset-0">
          <EditableImage
            src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=80"
            alt="Heal in Egypt"
            className="w-full h-full object-cover opacity-30"
            sectionKey="wellness_hero"
          />
        </div>
        <div className="relative px-4 pt-10 pb-10 max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-xs font-bold mb-4">
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            Heal in Egypt
          </div>
          <h1 className="text-3xl font-black text-white leading-tight mb-2">
            Wellness &<br />
            <span className="text-teal-200">Natural Healing</span>
          </h1>
          <p className="text-teal-100 text-sm leading-relaxed mb-4">
            Egypt's geography creates rare natural conditions for healing — from radioactive black sands to ancient hot springs, silent deserts to mineral-rich seas.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <p className="text-white font-black text-lg">7</p>
              <p className="text-teal-200 text-[10px]">Healing Zones</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <p className="text-white font-black text-lg">5+</p>
              <p className="text-teal-200 text-[10px]">Regions Covered</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <p className="text-white font-black text-lg">Real</p>
              <p className="text-teal-200 text-[10px]">Locations Only</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Intro banner */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">About This Section</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Egypt offers a range of naturally therapeutic environments that are medically studied or traditionally practiced. These are not spa products — they are real geographic conditions. Each entry includes the location, the healing concept, and practical guidance for international visitors.
          </p>
        </div>

        {/* Tier filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-5">
          {TIERS.map(t => (
            <button key={t} onClick={() => setTierFilter(t)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                tierFilter === t
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
              }`}>
              {t}
            </button>
          ))}
        </div>

        <p className="text-xs font-bold text-gray-500 mb-4">{filtered.length} healing experience{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Experience grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {filtered.map(exp => <ExperienceCard key={exp.id} exp={exp} />)}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-center text-white">
          <h3 className="font-black text-lg mb-1">Plan Your Healing Trip</h3>
          <p className="text-teal-100 text-xs mb-4 leading-relaxed">
            Use our verified services and local contacts to organize your wellness visit to Egypt.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/services?category=medical"
              className="bg-white text-teal-700 font-black px-5 py-2.5 rounded-xl text-sm hover:opacity-90">
              Medical Services →
            </Link>
            <Link to="/guides"
              className="bg-white/20 text-white font-black px-5 py-2.5 rounded-xl text-sm hover:bg-white/30 border border-white/30">
              Find a Local Guide →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}