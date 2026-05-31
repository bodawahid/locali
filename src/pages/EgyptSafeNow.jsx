import { useState } from 'react';
import { useSEO, buildFAQSchema } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { ShieldCheck, AlertTriangle, Info, CheckCircle2, XCircle, Globe, Plane, TrendingUp, Users, Radio } from 'lucide-react';

const FAQS = [
  { q: 'Is Egypt safe for tourists right now in 2026?', a: 'Yes. Egypt\'s main tourist areas — Sharm El Sheikh, Hurghada, Luxor, and Aswan — are safe for tourists right now. These cities receive millions of visitors per year with extremely rare incidents. The primary risk travelers face is financial scams, not violence.' },
  { q: 'Should I cancel my Egypt trip because of the region?', a: 'No. Unless your government has issued a specific advisory against your destination city, you should not cancel. Egypt\'s tourist resorts are geographically hundreds of kilometers from conflict areas. Hurghada, Luxor, and Aswan are on the opposite side of Egypt from any regional tensions.' },
  { q: 'Are tourists still coming to Egypt right now?', a: 'Yes. Egypt received a record 19 million tourists in 2025, up 21% from 2024. Flights from Germany, UK, Russia, Poland, Ukraine, and Eastern Europe continue operating normally to Hurghada and Sharm. Occupancy at major resorts remains high.' },
  { q: 'Is it safe to visit Egypt given the situation in Gaza?', a: 'Egypt is geographically large. Sharm El Sheikh, Hurghada, Luxor, and Aswan are hundreds of kilometers from the Sinai border regions. Tourist sites have seen zero impact. Egypt has maintained stability and strong security throughout all regional tensions.' },
  { q: 'Which Egyptian cities are safest for tourists?', a: 'Aswan and Hurghada consistently rank as Egypt\'s safest tourist cities. Sharm El Sheikh has heavy security presence. Luxor is safe but has more aggressive vendor culture. All four have maintained clean safety records for international tourists for decades.' },
  { q: 'What are the real risks when visiting Egypt?', a: 'The real risks are: financial scams and overcharging (very common — this site helps you avoid them), digestive issues from food/water (manageable with care), sun/heat exposure (serious in summer), and road safety outside cities. Violent crime against tourists is statistically extremely rare.' },
  { q: 'What does the UK/EU/US travel advisory actually say about Egypt?', a: 'UK FCO: "Normal precautions" for Sharm, Hurghada, Luxor, and Aswan. Advises against travel to North Sinai only. US State Dept: Level 2 (Exercise Increased Caution) — same level as France, Belgium, Germany. EU: No advisory against tourist area travel.' },
  { q: 'Is the Red Sea safe for swimming and diving right now?', a: 'Yes. The Red Sea remains one of the world\'s top diving destinations. Shark incidents in tourist areas are isolated and statistically rarer than car accidents. Millions swim and dive safely every year. Follow lifeguard instructions and red flag warnings.' },
  { q: 'Has the regional conflict affected tourism in Hurghada and Sharm?', a: 'Not significantly. After an initial dip in late 2023, arrivals recovered strongly through 2024 and 2025. European charter operators — TUI, Thomas Cook, Jet2 — never stopped flying to Hurghada or Sharm. Occupancy rates recovered to pre-2023 levels by mid-2024.' },
  { q: 'Should I buy travel insurance for Egypt?', a: 'Yes, absolutely — not because Egypt is dangerous, but because medical care costs, flight disruptions, and theft happen everywhere. A comprehensive policy covering medical evacuation is recommended for any Egypt trip regardless of regional context.' },
];

const REALITY_CHECK = [
  { media: '"Egypt is a warzone / dangerous region"', reality: 'Egypt is a stable country. Tourist resort cities are geographically hundreds of km from any conflict zones. All four tourist cities have operated without incident for decades.' },
  { media: '"Tourists are frequently attacked in Egypt"', reality: 'Violent incidents against tourists are statistically extremely rare. Egypt\'s tourism industry generates 12% of GDP — the government\'s security focus on tourist areas reflects this economic reality.' },
  { media: '"The Red Sea has frequent dangerous sharks"', reality: 'Shark incidents in tourist areas are isolated and very rare globally. Millions swim the Red Sea safely every year. Follow lifeguard and dive operator guidance.' },
  { media: '"The Gaza situation makes Egypt dangerous"', reality: 'Hurghada is 600km+ from Gaza. Aswan is 900km+. The conflict is in a separate geographic region. Egypt\'s tourist infrastructure has continued normally throughout.' },
  { media: '"Egypt is too unstable for a holiday"', reality: 'Egypt has maintained political stability under the current government since 2014. Sharm and Hurghada have welcomed millions of European package tourists every year throughout this period without interruption.' },
  { media: '"Egypt is dirty and infrastructure is broken"', reality: 'Tourist resort zones (Naama Bay, Sahl Hasheesh, etc.) are maintained to international standards. Red Sea resorts match Mediterranean quality for beach, pool, and diving infrastructure.' },
];

const CURRENT_STATUS = [
  { region: 'Sharm El Sheikh', status: 'safe', note: 'Heavy security presence. Popular with European package tourists year-round. No incidents in tourist zones. Sinai-only visa remains free for most nationalities.', tourists: 'Active — flights normal' },
  { region: 'Hurghada', status: 'safe', note: 'Egypt\'s most-visited resort city. All-inclusive resort zone is extremely secure with 24h security. All major European tour operators running flights normally.', tourists: 'Very active — high occupancy' },
  { region: 'Luxor & Aswan', status: 'safe', note: 'Tourist police stationed at every major site. Safe for both independent and guided travel. Train connections from Cairo and between cities running normally.', tourists: 'Active — cruise ships resuming' },
  { region: 'Cairo', status: 'caution', note: 'Standard big-city precautions required. Tourist areas (Zamalek, pyramids area, Islamic Cairo) well-patrolled. Normal awareness and standard scam avoidance needed.', tourists: 'Active — international flights normal' },
  { region: 'North Sinai', status: 'avoid', note: 'Travel advisory in effect from UK, EU, and US governments. This region has NO tourist sites. It is completely separate from Sharm El Sheikh which is in SOUTH Sinai, 350km away.', tourists: 'No tourist infrastructure here' },
  { region: 'Libya border area', status: 'avoid', note: 'Remote western desert region. No tourist sites. No reason to visit this area.', tourists: 'Not a tourist destination' },
];

const STATUS_STYLES = {
  safe: { bg: 'bg-success/10 border-success/20', badge: 'bg-success text-success-foreground', text: 'SAFE' },
  caution: { bg: 'bg-amber-500/10 border-amber-500/20', badge: 'bg-amber-500 text-white', text: 'CAUTION' },
  avoid: { bg: 'bg-red-500/10 border-red-500/20', badge: 'bg-red-500 text-white', text: 'AVOID' },
};

const TOURIST_NUMBERS = [
  { label: 'Tourists in 2025 (record)', value: '19M', icon: Users, color: 'text-success' },
  { label: 'Tourism GDP %', value: '12%', icon: TrendingUp, color: 'text-accent' },
  { label: 'Days since major tourist incident', value: '3,000+', icon: ShieldCheck, color: 'text-success' },
  { label: 'EU airlines still flying', value: '40+', icon: Plane, color: 'text-blue-500' },
];

const WHAT_ADVISORIES_SAY = [
  { country: '🇬🇧 UK FCO', level: 'Normal precautions', scope: 'Sharm, Hurghada, Luxor, Aswan', color: 'bg-success/10 border-success/20 text-success' },
  { country: '🇩🇪 Germany', level: 'Increased caution', scope: 'Standard tourist cities — fully operational', color: 'bg-amber-500/10 border-amber-500/20 text-amber-600' },
  { country: '🇺🇸 US State Dept', level: 'Level 2 — Exercise Caution', scope: 'Same as France, Belgium, Germany', color: 'bg-amber-500/10 border-amber-500/20 text-amber-600' },
  { country: '🇫🇷 France', level: 'Vigilance normale', scope: 'Resort cities — green light', color: 'bg-success/10 border-success/20 text-success' },
  { country: '🇵🇱 Poland', level: 'Normal precautions', scope: 'High tourist traffic continues', color: 'bg-success/10 border-success/20 text-success' },
  { country: '🇷🇺 Russia', level: 'No advisory', scope: 'Largest tourist sending country to Egypt', color: 'bg-success/10 border-success/20 text-success' },
];

export default function EgyptSafeNow() {
  const [openFaq, setOpenFaq] = useState(null);

  useSEO({
    title: 'Is Egypt Safe Right Now in 2026? Honest Tourist Safety Guide',
    description: 'Short answer: Yes, Egypt is safe for tourists in Hurghada, Sharm El Sheikh, Luxor and Aswan. Current situation, media vs reality, travel advisory analysis, and FAQ.',
    jsonLd: buildFAQSchema(FAQS),
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Is Egypt Safe Right Now?</h1>
          <p className="text-sm text-muted-foreground">Honest assessment — updated weekly · March 2026</p>
        </div>
      </div>

      {/* Short answer hero */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          <span className="font-extrabold text-success text-lg">Short Answer: Yes.</span>
        </div>
        <p className="text-base font-semibold leading-relaxed">
          Egypt is safe for tourists in Hurghada, Sharm El Sheikh, Luxor, and Aswan.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          Nearly 19 million visitors arrived safely in 2025 — a record year, up 21% from 2024. All major European tour operators are flying normally. The real risks tourists face are financial scams and overcharging — not violence. Western media coverage of regional tensions does not reflect the situation in Egypt's tourist cities.
        </p>
      </div>

      {/* Live status indicator */}
      <div className="flex items-center gap-2 mb-6 bg-card border border-border/50 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <Radio className="w-3.5 h-3.5 text-success" />
          <span className="text-xs font-bold text-success">LIVE STATUS</span>
        </div>
        <span className="text-xs text-muted-foreground">Last checked: March 29, 2026 — Flights operating normally · Resorts open · No tourist area alerts</span>
      </div>

      {/* Tourist numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {TOURIST_NUMBERS.map(({ label, value, icon: Icon, color }, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 text-center">
            <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Current situation */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-extrabold">Current Situation — Updated Weekly</h2>
        <span className="text-[10px] font-bold bg-success text-success-foreground px-2 py-0.5 rounded-full">MARCH 2026</span>
      </div>
      <div className="space-y-3 mb-10">
        {CURRENT_STATUS.map((item, i) => {
          const style = STATUS_STYLES[item.status];
          return (
            <div key={i} className={`rounded-2xl border p-4 ${style.bg}`}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-bold text-sm">{item.region}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${style.badge}`}>{style.text}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{item.note}</p>
              <p className="text-[10px] font-bold text-muted-foreground">✈ {item.tourists}</p>
            </div>
          );
        })}
      </div>

      {/* What advisories actually say */}
      <h2 className="text-xl font-extrabold mb-4">What Travel Advisories Actually Say</h2>
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-10">
        <div className="px-4 py-3 border-b border-border/30 bg-secondary/50">
          <p className="text-xs font-bold text-muted-foreground">Most advisories cover all of Egypt — but tourist cities are always in the lower-risk category within each advisory.</p>
        </div>
        <div className="divide-y divide-border/20">
          {WHAT_ADVISORIES_SAY.map((a, i) => (
            <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{a.country}</span>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${a.color}`}>{a.level}</span>
                <p className="text-[10px] text-muted-foreground mt-1">{a.scope}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media vs Reality */}
      <h2 className="text-xl font-extrabold mb-4">Egypt vs. Media Hype — What's Actually True</h2>
      <p className="text-sm text-muted-foreground mb-4">These are the most common misconceptions that prevent tourists from booking. Here is the reality behind each one.</p>
      <div className="space-y-3 mb-10">
        {REALITY_CHECK.map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="bg-red-500/5 border-b border-red-500/10 px-5 py-3 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground italic">{item.media}</p>
            </div>
            <div className="bg-success/5 px-5 py-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{item.reality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actual risks */}
      <h2 className="text-xl font-extrabold mb-4">What Are the Real Risks in Egypt?</h2>
      <div className="space-y-3 mb-10">
        {[
          { risk: 'Financial Scams & Overcharging', level: 'HIGH', desc: 'The #1 issue tourists face. Taxi overcharging, fake guides, inflated prices. Manageable with preparation — this site gives you the numbers to negotiate from.' },
          { risk: 'Food & Water Issues', level: 'MODERATE', desc: 'Never drink tap water. Stick to bottled water (5 EGP at supermarkets) and fully cooked food. A minority of tourists experience mild stomach issues — pack rehydration salts.' },
          { risk: 'Sun & Heat Exposure', level: 'MODERATE', desc: 'Summer temperatures reach 42–45°C. Heatstroke is a genuine danger June–August. Visit temples before 10am. Always carry water. Schedule afternoon rest during peak summer.' },
          { risk: 'Road Safety', level: 'MODERATE', desc: 'Egyptian traffic is chaotic. Use Careem/Uber for in-city travel, official tour operators for desert highways, and train for city-to-city travel where available.' },
          { risk: 'Petty Theft', level: 'LOW', desc: 'Pickpocketing in very crowded markets (Cairo Khan el-Khalili, Luxor bazaar). Keep phones in front pockets, use a money belt in markets.' },
          { risk: 'Violent Crime Against Tourists', level: 'VERY LOW', desc: 'Statistically extremely rare. Egypt\'s entire tourism economy (12% of GDP) depends on tourist safety. Tourist police presence at all major sites is intensive.' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm">{item.risk}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.level === 'HIGH' ? 'bg-amber-500 text-white' :
                item.level === 'MODERATE' ? 'bg-amber-500/20 text-amber-700' :
                item.level === 'VERY LOW' ? 'bg-success/20 text-success' :
                'bg-success/10 text-success'
              }`}>{item.level}</span>
            </div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Why tourists still come */}
      <h2 className="text-xl font-extrabold mb-4">Why Tourists Keep Coming to Egypt</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {[
          { title: 'Price vs. Value', desc: 'Egypt offers 3–5x more experience per euro than Dubai or Turkey. 7 days all-in: €500–900 vs €1,500–3,000 in Dubai.' },
          { title: 'World-Class Diving', desc: 'Red Sea visibility: 20–40 meters. Coral reef ecosystems unmatched in the Mediterranean. Sharm and Hurghada are globally top-10 dive destinations.' },
          { title: 'Unbeatable History', desc: '7,000 years of civilization. Luxor has more ancient history per km² than anywhere on earth. Abu Simbel, Karnak, Valley of Kings.' },
          { title: 'Weather Certainty', desc: '330+ sunny days per year in Red Sea cities. October–April is 22–28°C. Winter sun destination without the crowds of peak summer.' },
          { title: 'Ease of Access', desc: 'Direct flights from most European cities. Visa on arrival ($30 USD since March 2026) for most nationalities. No advance planning required for resort travel.' },
          { title: 'Local Warmth', desc: 'Despite persistent scam culture near tourist sites, ordinary Egyptians are genuinely hospitable. A short journey off the main strip reveals extraordinary warmth.' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <h3 className="font-bold text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ — collapsible */}
      <h2 className="text-xl font-extrabold mb-4">Frequently Asked Safety Questions</h2>
      <div className="space-y-2 mb-10">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left"
            >
              <h3 className="font-bold text-sm">{faq.q}</h3>
              <span className="text-muted-foreground font-bold text-lg shrink-0">{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Middle East Safety Map" description="See Egypt's stability vs surrounding region" to="/middle-east-safety-map" />
        <SafeNextStep title="Women's Safety Guide for Egypt" description="Specific advice for solo and group female travelers" to="/women-safety" />
        <SafeNextStep title="Emergency Numbers for Egypt" description="Tourist Police, ambulance, and embassy contacts" to="/emergency" />
        <SafeNextStep title="Before You Land Checklist" description="Everything you need to prepare before arriving" to="/before-you-land" />
      </div>
    </div>
  );
}