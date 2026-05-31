import { useOutletContext } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, MapPin } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

const CITY_SPECIFIC = [
  {
    city: 'Sharm El Sheikh',
    safetyLevel: 'HIGH — Resort-friendly',
    safeAreas: ['Naama Bay main strip (well-lit, busy 24h)', 'Hadaba resort zone', 'Old Market (daytime)', 'Hotel pool and beach areas'],
    cautionAreas: ['Back streets of Old Market after midnight', 'Isolated desert areas outside resort zones', 'Areas near the taxi ranks late at night'],
    tips: [
      'Naama Bay is one of the most solo-female-friendly tourist areas in Egypt.',
      'The resort strip has enough foot traffic and security cameras that harassment is uncommon.',
      'Swimwear is fine at hotel beaches. Cover up when walking away from the beach strip.',
      'Evening walks along the main strip are genuinely safe. Side streets after midnight — use Careem.',
      'Staff at dive centers and resort hotels are used to international visitors and are generally professional.',
    ],
  },
  {
    city: 'Hurghada',
    safetyLevel: 'HIGH in resort areas — MODERATE in city',
    safeAreas: ['Sahl Hasheesh resort zone', 'Hurghada Marina', 'El Mamsha (main tourist promenade)', 'Inside all-inclusive resort compounds'],
    cautionAreas: ['El Dahar old town after dark', 'Public minibuses (avoid for solo women at night)', 'Remote areas of main coastal highway'],
    tips: [
      'All-inclusive resorts in Hurghada are extremely safe — security on gates 24h.',
      'El Dahar old town is lively and generally fine in daylight. After dark, go with company or use Careem.',
      'The Marina area and El Mamsha promenade have active nightlife and are well-monitored.',
      'Verbal attention from vendors and passers-by is common in old town. Ignoring it completely is the most effective response.',
      'Local Egyptian women often engage and can be unexpected allies if you feel uncomfortable.',
    ],
  },
  {
    city: 'Luxor',
    safetyLevel: 'MODERATE — High tout density, low violence',
    safeAreas: ['Corniche road (main riverfront)', 'Inside all major temple sites', 'Hotel areas (East Bank)', 'Tourist Police presence zones'],
    cautionAreas: ['Near temple entrances (high tout concentration)', 'Bazaar and souk areas', 'West Bank at night', 'Train station area on arrival'],
    tips: [
      'Luxor is safe but has the highest vendor-pressure environment in this guide. Be mentally prepared.',
      '"La shukran" said firmly while walking — without eye contact — is your most powerful tool.',
      'Having a guide (even for half a day) dramatically reduces harassment near temple sites.',
      'The West Bank by day is beautiful and relaxed. Arrange transport for the return trip — don\'t get stranded after dark.',
      'Wearing a ring and referring to a "husband waiting at the hotel" works effectively with persistent vendors.',
      'Tourist police are stationed at Karnak, Valley of Kings, and Luxor Temple — don\'t hesitate to approach them.',
    ],
  },
  {
    city: 'Aswan',
    safetyLevel: 'VERY HIGH — Most relaxed city',
    safeAreas: ['Entire Corniche road', 'Nubian villages (generally very welcoming)', 'Elephantine Island', 'Ferry and Nile boat areas'],
    cautionAreas: ['Desert areas (extreme heat, get lost risk)', 'Abu Simbel road (do not travel outside convoy)', 'Late-night isolated felucca trips'],
    tips: [
      'Aswan has a distinctly different atmosphere — Nubian culture is more open and less pushy.',
      'Solo women consistently report Aswan as their most comfortable Egyptian city.',
      'Felucca captains are friendly and professional overall. Just establish the price clearly upfront.',
      'Nubian village visits feel genuinely welcoming. Children may ask for photos — your choice entirely.',
      'The Corniche is safe and pleasant for evening walks. Well-lit and frequented by local families.',
      'Abu Simbel trip: the early convoy is safe. Stay with the group, don\'t accept rides from strangers at the site.',
    ],
  },
];

const GENERAL_TIPS = [
  {
    title: 'Dress Strategy',
    icon: Info,
    items: [
      'Resort beaches: bikinis and swimwear are completely normal and accepted.',
      'Walking between beach areas and restaurants: light cover-up is enough.',
      'Temple and mosque visits: cover shoulders and knees. Bring a scarf.',
      'Old markets and city streets: loose clothing, covered shoulders, reduces attention significantly.',
      'You will not be turned away anywhere for clothing, but modest dress genuinely changes the experience.',
    ],
  },
  {
    title: 'Transport Safety',
    icon: CheckCircle2,
    items: [
      'Always use Careem or Uber over street taxis — tracking feature is important.',
      'Share your live location with a trusted person for any taxi journey.',
      'Sit in the back seat. If driver behaves uncomfortably, ask to be dropped at any busy hotel.',
      'Pre-book all transport at night. Don\'t rely on finding taxis after midnight.',
      'Hotel staff can always arrange reliable transport — use this option.',
    ],
  },
  {
    title: 'Handling Unwanted Attention',
    icon: AlertTriangle,
    items: [
      '"La shukran" without eye contact, while walking, is the gold standard response.',
      'Do not engage, explain, or justify. Engagement signals availability for negotiation.',
      'Moving into any hotel lobby immediately changes the dynamic — hotels are safe havens.',
      'Wearing headphones (even unplugged) reduces approaches significantly.',
      '"My husband is waiting" remains highly effective in Egyptian cultural context.',
      'Egyptian women in groups or shops will often support foreign women if needed — ask for help.',
    ],
  },
  {
    title: 'What Actually Works',
    icon: CheckCircle2,
    items: [
      'Guided tours for temple sites reduce harassment enormously — worth the cost for this reason alone.',
      'Staying in hotels with female staff or female-friendly reviews (check TripAdvisor).',
      'Eating at restaurants where Egyptian families are present — harassment doesn\'t happen there.',
      'Having the number 126 (Tourist Police) saved on your phone from day one.',
      'Traveling with at least one other person for non-resort areas of Luxor and Cairo.',
    ],
  },
];

const REAL_EXPERIENCES = [
  { text: '"Sharm El Sheikh felt very safe for solo travel. The main strip is lively and patrolled. I walked at night every evening and had zero issues. The dive centers are professional and gender-neutral."', author: 'Sarah, UK', city: 'Sharm El Sheikh' },
  { text: '"In Luxor, I was approached constantly near Karnak. But I learned "La shukran" on day one and it worked every single time. A half-day guide made the temple experience completely different."', author: 'Anna, Germany', city: 'Luxor' },
  { text: '"Hurghada resort zone was perfect. El Dahar old town I wouldn\'t do alone at night. Once I understood that — the trip was great. The scam guide on this site saved me on day one."', author: 'Maria, Russia', city: 'Hurghada' },
  { text: '"Aswan was my favorite city in Egypt. The Nubian people are genuinely warm. I felt more comfortable there than in many European cities. The felucca sunset was unforgettable."', author: 'Yuki, Japan', city: 'Aswan' },
  { text: '"The key insight: it\'s not about danger, it\'s about managing attention. Once I treated it like a skill to learn rather than a threat to fear, Egypt became an amazing solo adventure."', author: 'Lisa, Netherlands', city: 'All cities' },
];

export default function WomenSafety() {
  const { lang } = useOutletContext();

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Women's Safety in Egypt</h1>
          <p className="text-sm text-muted-foreground">Honest, city-specific advice from real female travelers</p>
        </div>
      </div>

      <div className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Honest assessment:</strong> Egypt is manageable and rewarding for solo female travelers who prepare. The risks are mostly about attention and pressure, not violence. Millions of women visit safely every year. Knowledge is the most effective protection.
        </p>
      </div>

      {/* City-specific */}
      <h2 className="text-xl font-extrabold mb-4">City-by-City Safety Guide</h2>
      <div className="space-y-4 mb-10">
        {CITY_SPECIFIC.map((city) => (
          <div key={city.city} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-extrabold">{city.city}</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                city.safetyLevel.startsWith('VERY') ? 'bg-success/20 text-success' :
                city.safetyLevel.startsWith('HIGH') ? 'bg-success/10 text-success' :
                'bg-amber-500/10 text-amber-600'
              }`}>{city.safetyLevel.split(' — ')[0]}</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-success uppercase mb-1.5">✓ Safe Areas</p>
                  <ul className="space-y-1">
                    {city.safeAreas.map((area, i) => <li key={i} className="text-xs text-muted-foreground flex gap-1.5"><span className="text-success">•</span>{area}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase mb-1.5">⚠ Use Caution</p>
                  <ul className="space-y-1">
                    {city.cautionAreas.map((area, i) => <li key={i} className="text-xs text-muted-foreground flex gap-1.5"><span className="text-amber-500">•</span>{area}</li>)}
                  </ul>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Practical Tips</p>
                <ul className="space-y-1.5">
                  {city.tips.map((tip, i) => <li key={i} className="text-xs text-muted-foreground flex gap-1.5"><CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />{tip}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* General tips */}
      <h2 className="text-xl font-extrabold mb-4">General Safety Strategies</h2>
      <div className="space-y-4 mb-10">
        {GENERAL_TIPS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-accent" />
                <h3 className="font-bold">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-1 shrink-0">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Real experiences */}
      <h2 className="text-lg font-extrabold mb-3">Real Traveler Experiences</h2>
      <div className="space-y-3 mb-8">
        {REAL_EXPERIENCES.map((exp, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
            <p className="text-sm italic text-muted-foreground leading-relaxed">{exp.text}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-bold">— {exp.author}</span>
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{exp.city}</span>
            </div>
          </div>
        ))}
      </div>

      <SafeNextStep title="Emergency Contacts" description="Tourist Police: 126 — Ambulance: 123 — Police: 122" to="/emergency" />
    </div>
  );
}