import { useState } from 'react';
import { useSEO } from '../lib/seo';
import { Wifi, CheckCircle2, XCircle, AlertTriangle, Phone, MapPin, Info, Star } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

const OPERATORS = [
  {
    id: 'vodafone',
    name: 'Vodafone Egypt',
    logo: '🔴',
    color: 'bg-red-500/10 border-red-500/20',
    badgeColor: 'bg-red-500 text-white',
    coverage: 'Excellent — best 4G coverage in tourist areas',
    recommended: true,
    pros: ['Best 4G LTE coverage in Sharm, Hurghada, Luxor, Aswan', 'Most tourist-friendly SIM setup', 'Biggest network of official stores', 'Works well on Nile cruises'],
    cons: ['Slightly more expensive than Orange', 'Can be slow during peak season in Naama Bay'],
    packages: [
      { name: 'Starter', data: '5 GB', validity: '7 days', price: 75, calls: '100 mins local', best_for: 'Short stays, testing coverage' },
      { name: 'Tourist Basic', data: '10 GB', validity: '14 days', price: 110, calls: '200 mins local', best_for: 'Week-long beach holiday' },
      { name: 'Tourist Standard', data: '15 GB', validity: '30 days', price: 130, calls: '300 mins local', best_for: 'Most tourists — best value' },
      { name: 'Tourist Plus', data: '25 GB', validity: '30 days', price: 175, calls: '500 mins local', best_for: 'Remote workers, long stays' },
      { name: 'Heavy Data', data: '40 GB', validity: '30 days', price: 250, calls: 'Unlimited local', best_for: 'Power users, video calls daily' },
      { name: 'Mega Bundle', data: '60 GB', validity: '30 days', price: 350, calls: 'Unlimited local + international mins', best_for: 'Digital nomads, 1-month stays' },
    ],
    customerService: '888 (من خط Vodafone) أو 16888 (من أي خط)',
    customerServiceRaw: '888',
    stores: [
      { label: 'Vodafone Store Naama Bay Mall — Sharm', query: 'Vodafone Store Naama Bay Sharm El Sheikh Egypt' },
      { label: 'Vodafone Store Sahl Hasheesh Road — Hurghada', query: 'Vodafone Store Hurghada Egypt' },
      { label: 'Vodafone Store Luxor Temple Road — Luxor', query: 'Vodafone Store Luxor Egypt' },
      { label: 'Vodafone Store Corniche — Aswan', query: 'Vodafone Store Aswan Egypt' },
    ],
    topup: 'Top-up cards sold at supermarkets, pharmacies. Use Vodafone app for online recharge.',
  },
  {
    id: 'orange',
    name: 'Orange Egypt',
    logo: '🟠',
    color: 'bg-orange-500/10 border-orange-500/20',
    badgeColor: 'bg-orange-500 text-white',
    coverage: 'Very good — solid 4G across all tourist cities',
    recommended: true,
    pros: ['Competitive pricing — often 10–15% cheaper than Vodafone', 'Good international roaming options', 'Strong in Cairo and Alexandria', 'Good for calling UK, France, Germany'],
    cons: ['Coverage slightly weaker than Vodafone in remote areas', 'Fewer stores in Upper Egypt (Luxor/Aswan)'],
    packages: [
      { name: 'Mini', data: '5 GB', validity: '7 days', price: 65, calls: '60 mins local', best_for: 'Very short stays' },
      { name: 'Start', data: '10 GB', validity: '14 days', price: 95, calls: '150 mins local', best_for: 'One-week trip' },
      { name: 'Classic', data: '15 GB', validity: '30 days', price: 115, calls: '250 mins local', best_for: 'Most tourists — slightly cheaper than Vodafone' },
      { name: 'Smart', data: '25 GB', validity: '30 days', price: 160, calls: '400 mins local', best_for: 'Extended stays, remote work lite' },
      { name: 'Power', data: '40 GB', validity: '30 days', price: 225, calls: 'Unlimited local', best_for: 'Heavy users, video streaming' },
      { name: 'Max', data: '75 GB', validity: '30 days', price: 320, calls: 'Unlimited local + 60 int\'l mins', best_for: 'Long-stay digital nomads' },
    ],
    customerService: '110 (من خط Orange) أو 16110 (من أي خط)',
    customerServiceRaw: '16110',
    stores: [
      { label: 'Orange Store Old Market — Sharm', query: 'Orange Store Sharm El Sheikh Egypt' },
      { label: 'Orange Store Marina Road — Hurghada', query: 'Orange Store Hurghada Egypt' },
      { label: 'Orange Store Corniche — Luxor', query: 'Orange Store Luxor Egypt' },
      { label: 'Orange Store Train Station — Aswan', query: 'Orange Store Aswan Egypt' },
    ],
    topup: 'Top-up at Orange stores, supermarkets, and the Orange app.',
  },
  {
    id: 'etisalat',
    name: 'e& Egypt (Etisalat)',
    logo: '🟢',
    color: 'bg-green-500/10 border-green-500/20',
    badgeColor: 'bg-green-600 text-white',
    coverage: 'Good — expanding 4G network, strong in major cities',
    recommended: false,
    pros: ['Often cheapest data packages', 'Good WhatsApp & social media speeds', 'Growing 4G coverage', 'Solid in Cairo and resort areas'],
    cons: ['Coverage gaps in rural Upper Egypt', 'Fewer stores than Vodafone/Orange', 'Less tourist-focused setup process', 'Signal weaker in Nubian villages'],
    packages: [
      { name: 'Basic', data: '5 GB', validity: '7 days', price: 60, calls: '50 mins local', best_for: 'Budget-conscious short stays' },
      { name: 'Value', data: '10 GB', validity: '14 days', price: 85, calls: '120 mins local', best_for: 'Week trip on a budget' },
      { name: 'Standard', data: '15 GB', validity: '30 days', price: 105, calls: '200 mins local', best_for: 'Month stay — cheapest 15GB option' },
      { name: 'Plus', data: '25 GB', validity: '30 days', price: 150, calls: '350 mins local', best_for: 'Active internet users' },
      { name: 'Premium', data: '50 GB', validity: '30 days', price: 210, calls: 'Unlimited local', best_for: 'Heavy data users' },
      { name: 'Unlimited', data: '100 GB', validity: '30 days', price: 300, calls: 'Unlimited local', best_for: 'Maximum data, best per-GB price' },
    ],
    customerService: '110 (من خط e&)',
    customerServiceRaw: '110',
    stores: [
      { label: 'e& Store New Hurghada Mall', query: 'Etisalat e& Store Hurghada Egypt' },
      { label: 'e& Store Naama Bay — Sharm', query: 'Etisalat e& Store Sharm El Sheikh Egypt' },
      { label: 'e& Store Luxor City Center', query: 'Etisalat e& Store Luxor Egypt' },
      { label: 'e& Store Aswan Corniche', query: 'Etisalat e& Store Aswan Egypt' },
    ],
    topup: 'Top-up at official e& stores and via the myetisalat app.',
  },
  {
    id: 'we',
    name: 'WE (Telecom Egypt)',
    logo: '🔵',
    color: 'bg-blue-500/10 border-blue-500/20',
    badgeColor: 'bg-blue-600 text-white',
    coverage: 'Moderate — national coverage but 4G is less consistent',
    recommended: false,
    pros: ['Part of state-owned Telecom Egypt — reliable voice calls', 'Good landline/WiFi bundles for long stays', 'Inexpensive prepaid options', 'Can be useful for apartment internet'],
    cons: ['Weakest 4G speeds of the four operators', 'Not recommended for video calls or streaming', 'Coverage is patchy in tourist areas', 'Not ideal for tourists — more for residents'],
    packages: [
      { name: 'Lite', data: '3 GB', validity: '7 days', price: 50, calls: '30 mins local', best_for: 'Emergency backup SIM only' },
      { name: 'Basic', data: '8 GB', validity: '30 days', price: 80, calls: '100 mins local', best_for: 'Light use, casual browsing' },
      { name: 'Standard', data: '15 GB', validity: '30 days', price: 95, calls: '200 mins local', best_for: 'Cheapest 15GB — slow speeds' },
      { name: 'Value+', data: '30 GB', validity: '30 days', price: 140, calls: '300 mins local', best_for: 'Budget long stays — accept slower speeds' },
      { name: 'Unlimited', data: 'Unlimited*', validity: '30 days', price: 250, calls: 'Unlimited local', best_for: 'Fixed speed cap after 40GB' },
    ],
    customerService: '111 أو 01555000111',
    customerServiceRaw: '111',
    stores: [
      { label: 'WE Store El Dahar — Hurghada', query: 'WE Telecom Egypt Store Hurghada' },
      { label: 'WE Store Nasr City Road — Sharm', query: 'WE Telecom Egypt Store Sharm El Sheikh' },
      { label: 'WE Store Train Station — Luxor', query: 'WE Telecom Egypt Store Luxor' },
      { label: 'WE Store Corniche — Aswan', query: 'WE Telecom Egypt Store Aswan' },
    ],
    topup: 'WE stores only — less convenient than competitors.',
  },
];

const COMPARISON_TABLE = [
  { feature: 'Tourist-friendliness', vodafone: '⭐⭐⭐⭐⭐', orange: '⭐⭐⭐⭐', etisalat: '⭐⭐⭐', we: '⭐⭐' },
  { feature: '4G Speed', vodafone: 'Excellent', orange: 'Very Good', etisalat: 'Good', we: 'Fair' },
  { feature: 'Coverage (tourist areas)', vodafone: 'Best', orange: 'Very Good', etisalat: 'Good', we: 'Moderate' },
  { feature: 'Cheapest 15GB package', vodafone: '130 EGP', orange: '115 EGP', etisalat: '105 EGP', we: '95 EGP' },
  { feature: 'Most data per EGP', vodafone: 'Good', orange: 'Good', etisalat: 'Best', we: 'Best (slow)' },
  { feature: 'Setup ease at airport', vodafone: '✅ Easy', orange: '✅ Easy', etisalat: '⚠️ Moderate', we: '❌ Difficult' },
  { feature: 'English-speaking staff', vodafone: '✅ Usually', orange: '✅ Usually', etisalat: '⚠️ Sometimes', we: '❌ Rare' },
  { feature: 'Recommended for tourists', vodafone: '✅ YES', orange: '✅ YES', etisalat: '⚠️ Maybe', we: '❌ No' },
];

const AIRPORT_WARNING = [
  'Airport kiosks charge 2–4x the official store price for the exact same SIM card.',
  'A 15GB Vodafone SIM sold at Hurghada airport for 400 EGP costs 130 EGP in the city.',
  'The airport kiosks are not official operator stores — they are independent vendors.',
  'You CAN wait until you reach the city — airport WiFi is available for booking your taxi.',
  'If you must buy at the airport, go to the official branded operator counter (not kiosks).',
];

const HOW_TO_ACTIVATE = [
  { step: '1', title: 'Buy at official store', desc: 'Go to an official branded Vodafone, Orange, or e& store — not a small kiosk or market stall.' },
  { step: '2', title: 'Bring your passport', desc: 'Egyptian law requires passport registration for all SIM cards. No passport = no SIM.' },
  { step: '3', title: 'Choose your package', desc: 'Staff will help you select a data package. Show them this page if needed. Tell them your stay length.' },
  { step: '4', title: 'Register on the spot', desc: 'Staff will register the SIM with your passport number. This takes 5–10 minutes.' },
  { step: '5', title: 'Test immediately', desc: 'Before leaving the store, test that data and calls work. Ask them to configure the APN if needed.' },
  { step: '6', title: 'Top up when needed', desc: 'Buy top-up cards at supermarkets (Carrefour, Spinneys, local shops) or use the operator app.' },
];

export default function SimCards() {
  useSEO({
    title: 'Egypt SIM Card Guide 2026 — Vodafone, Orange, Etisalat, WE — All Packages & Prices',
    description: 'Complete Egypt SIM card guide. Compare Vodafone, Orange, e& (Etisalat), and WE — all data packages, prices, coverage, and where to buy. Avoid airport scams. Updated 2026.',
  });

  const [selectedOp, setSelectedOp] = useState('vodafone');
  const activeOp = OPERATORS.find(o => o.id === selectedOp);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Wifi className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Egypt SIM Card Guide 2026</h1>
          <p className="text-sm text-muted-foreground">Vodafone · Orange · e& (Etisalat) · WE — all packages compared</p>
        </div>
      </div>

      {/* Airport warning */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="font-extrabold text-red-600">Airport SIM Kiosk Warning</h2>
        </div>
        <ul className="space-y-2">
          {AIRPORT_WARNING.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-red-500 font-bold shrink-0">!</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-success" />
          <h2 className="font-extrabold">Our Recommendation for Tourists</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Vodafone or Orange</strong> are the best choices for most tourists. Vodafone has the best 4G coverage in all four resort cities. Orange is slightly cheaper and equally good for beach areas. Avoid WE unless you specifically need it — the data speeds are too slow for comfortable use.
        </p>
      </div>

      {/* Operator tabs */}
      <h2 className="text-xl font-extrabold mb-4">All Operators — Packages & Prices</h2>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {OPERATORS.map(op => (
          <button key={op.id} onClick={() => setSelectedOp(op.id)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-2 ${selectedOp === op.id ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}>
            <span>{op.logo}</span>
            {op.name.split(' ')[0]}
            {op.recommended && <span className="bg-success text-success-foreground text-[9px] px-1.5 py-0.5 rounded-full font-bold">TOP</span>}
          </button>
        ))}
      </div>

      {activeOp && (
        <div className={`rounded-2xl border p-5 mb-8 ${activeOp.color}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeOp.logo}</span>
              <div>
                <h3 className="font-extrabold text-lg">{activeOp.name}</h3>
                <p className="text-xs text-muted-foreground">{activeOp.coverage}</p>
              </div>
            </div>
            {activeOp.recommended && <span className="text-[10px] font-bold bg-success text-success-foreground px-2 py-1 rounded-full">RECOMMENDED</span>}
          </div>

          {/* Pros / Cons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <p className="text-[10px] font-bold text-success uppercase mb-2">✓ Pros</p>
              <ul className="space-y-1.5">
                {activeOp.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold text-destructive uppercase mb-2">✗ Cons</p>
              <ul className="space-y-1.5">
                {activeOp.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <XCircle className="w-3 h-3 text-destructive shrink-0 mt-0.5" />{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Packages */}
          <h4 className="font-extrabold text-sm mb-3">All Data Packages</h4>
          <div className="space-y-2">
            {activeOp.packages.map((pkg, i) => (
              <div key={i} className="bg-background/70 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-sm">{pkg.data}</span>
                      <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">{pkg.validity}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.calls}</p>
                    <p className="text-[10px] text-accent mt-1">Best for: {pkg.best_for}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black text-accent">{pkg.price}</p>
                    <p className="text-[10px] text-muted-foreground">EGP</p>
                    <p className="text-[9px] text-muted-foreground">{pkg.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stores */}
          <div className="mt-4">
            <p className="text-xs font-bold mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Official Stores (tourist cities)
            </p>
            <ul className="space-y-1.5">
              {activeOp.stores.map((s, i) => (
                <li key={i}>
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(s.query)}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                    📍 {s.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 bg-secondary/60 rounded-xl p-3 space-y-1">
            <p className="text-xs text-muted-foreground"><strong>Top-up:</strong> {activeOp.topup}</p>
            {activeOp.customerService && (
              <p className="text-xs text-muted-foreground"><strong>Customer Service:</strong> <span className="font-bold">{activeOp.customerService}</span></p>
            )}
          </div>
        </div>
      )}

      {/* Price comparison table */}
      <h2 className="text-xl font-extrabold mb-4">Side-by-Side Comparison</h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-10">
        <div className="grid grid-cols-5 border-b border-border/30 bg-secondary/50">
          <div className="p-3 text-xs font-bold text-muted-foreground">Feature</div>
          {OPERATORS.map(op => (
            <div key={op.id} className="p-3 text-center text-xs font-bold border-l border-border/30">
              {op.logo} {op.name.split(' ')[0]}
            </div>
          ))}
        </div>
        {COMPARISON_TABLE.map((row, i) => (
          <div key={i} className="grid grid-cols-5 border-b border-border/20 last:border-0">
            <div className="p-3 text-xs text-muted-foreground">{row.feature}</div>
            <div className="p-3 text-xs text-center border-l border-border/20">{row.vodafone}</div>
            <div className="p-3 text-xs text-center border-l border-border/20">{row.orange}</div>
            <div className="p-3 text-xs text-center border-l border-border/20">{row.etisalat}</div>
            <div className="p-3 text-xs text-center border-l border-border/20">{row.we}</div>
          </div>
        ))}
      </div>

      {/* How to activate */}
      <h2 className="text-xl font-extrabold mb-4">How to Activate — Step by Step</h2>
      <div className="space-y-3 mb-10">
        {HOW_TO_ACTIVATE.map((step, i) => (
          <div key={i} className="flex gap-4 bg-card rounded-2xl border border-border/50 p-4">
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-black text-sm flex items-center justify-center shrink-0">{step.step}</div>
            <div>
              <p className="font-bold text-sm">{step.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick-use tips */}
      <h2 className="text-xl font-extrabold mb-4">Practical Tips</h2>
      <div className="space-y-2 mb-10">
        {[
          { icon: '📶', tip: 'WhatsApp, Google Maps, and Google Translate all work perfectly on any of the four operators. Prioritize data over calls.' },
          { icon: '🛜', tip: 'For remote work: Vodafone 40GB or Orange 40GB packages give the best reliability for video calls and uploads.' },
          { icon: '💳', tip: 'Most packages can be extended or upgraded at any official store — you don\'t need to buy a new SIM.' },
          { icon: '🌐', tip: 'VoIP calls (Skype, WhatsApp, FaceTime) work on all operators. No local minutes needed for international calls.' },
          { icon: '📍', tip: 'Google Maps offline download: download your city map on WiFi before landing — saves mobile data significantly.' },
          { icon: '🔋', tip: 'Data in resort hotels can be slow. Use your SIM hotspot as a backup — Vodafone and Orange handle hotspot well.' },
          { icon: '⚠️', tip: 'Register within 24 hours of purchase. Unregistered SIMs are deactivated automatically by Egyptian law.' },
          { icon: '💰', tip: 'Carry small EGP coins and notes for top-up cards — exact change often required at small shops.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-card rounded-2xl border border-border/50 p-4">
            <span className="text-xl shrink-0">{item.icon}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Before You Land Checklist" description="Full arrival preparation guide" to="/before-you-land" />
        <SafeNextStep title="Remote Work in Egypt" description="Best cafés and coworking spaces with good WiFi" to="/remote-work" />
      </div>
    </div>
  );
}