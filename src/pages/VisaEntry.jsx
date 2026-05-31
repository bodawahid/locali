import { useState } from 'react';
import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { FileText, CheckCircle2, XCircle, AlertTriangle, Clock, Globe, ChevronDown, ChevronUp } from 'lucide-react';

const NATIONALITY_GROUPS = [
  {
    id: 'european',
    label: '🇪🇺 European (EU + UK)',
    countries: 'Germany, UK, France, Italy, Spain, Poland, Netherlands, Belgium, Czech, Austria, Sweden, Norway, Switzerland + all EU',
    needs_visa: true,
    visa_on_arrival: true,
    voa_cost: '$30 USD (cash only at airport)',
    sinai_only: true,
    sinai_cost: 'FREE',
    evisa_available: true,
    evisa_cost: '$30 USD',
    evisa_time: '3–5 business days',
    evisa_url: 'https://visa2egypt.gov.eg',
    max_stay_voa: '30 days (extendable)',
    max_stay_sinai: '15 days (Sinai Peninsula only)',
    required_docs: [
      'Valid passport (6+ months validity from date of entry)',
      '$30 USD cash for visa on arrival (exact preferred — raised March 2026)',
      'Return or onward flight ticket (may be asked)',
      'Hotel booking for first night (may be asked)',
      'Proof of funds (rarely checked but good to carry)',
    ],
    process_voa: [
      'Land at any Egyptian international airport',
      'BEFORE immigration, find the "Visa on Arrival" bank counters (Banque Misr kiosks)',
      'Pay $25 USD and receive a visa sticker',
      'Proceed to the immigration counter and have sticker placed in your passport',
      'Stamp received — you\'re in',
    ],
    process_sinai: [
      'Arrive at Sharm El Sheikh airport (SSH)',
      'At immigration, say "Sinai only" — the free stamp is applied automatically',
      'This restricts you to South Sinai (Sharm, Dahab, St Catherine, Taba)',
      'You CANNOT visit Cairo, Luxor, Hurghada or anywhere outside Sinai on this entry',
      'If you want all of Egypt, pay the $25 visa instead',
    ],
    common_problems: [
      { problem: 'Brought only card — VoA requires cash USD', solution: 'Always carry $35+ USD cash when flying into Egypt. Airport ATMs can be slow.' },
      { problem: 'Chosen Sinai-only visa then wants to visit Cairo or Luxor', solution: 'You cannot change a Sinai-only entry. Must exit and re-enter with a full visa, or pre-buy the $30 VoA.' },
      { problem: 'eVisa not processed in time (applied 2 days before travel)', solution: 'Apply eVisa minimum 5 business days before travel. In doubt, get VoA at the airport.' },
      { problem: 'Immigration officer asks for return ticket and hotel booking', solution: 'Have Booking.com confirmation on your phone. Not always asked, but good to have.' },
    ],
  },
  {
    id: 'russian',
    label: '🇷🇺 Russian & CIS',
    countries: 'Russia, Ukraine, Belarus, Kazakhstan, Uzbekistan, Azerbaijan, Armenia, Georgia, Moldova',
    needs_visa: true,
    visa_on_arrival: true,
    voa_cost: '$30 USD (cash only)',
    sinai_only: true,
    sinai_cost: 'FREE',
    evisa_available: true,
    evisa_cost: '$30 USD',
    evisa_time: '3–5 business days',
    evisa_url: 'https://visa2egypt.gov.eg',
    max_stay_voa: '30 days',
    max_stay_sinai: '15 days (Sinai only)',
    required_docs: [
      'Passport valid 6+ months from entry date',
      '$30 USD cash (US dollars — not rubles, not card)',
      'Return flight confirmation (sometimes asked)',
      'Hotel booking for first night',
    ],
    process_voa: [
      'Arrive at Hurghada (HRG) or Sharm (SSH) — most common Russian charter entry points',
      'Before immigration: find Banque Misr kiosks and pay $25 USD',
      'Get visa sticker — go to immigration',
      'Stamp in passport — done',
    ],
    process_sinai: [
      'Arrive at Sharm El Sheikh — tell immigration "Sinai only"',
      'Free entry stamp — valid 15 days',
      'Can visit: Sharm, Naama Bay, Dahab, St Catherine\'s Monastery, Taba',
      'Cannot visit Cairo, Hurghada, Luxor, Aswan on this entry',
    ],
    common_problems: [
      { problem: 'Some Russian cards don\'t work at Egyptian ATMs due to SWIFT restrictions', solution: 'Bring USD or EUR cash from Russia. Moneygram and Western Union branches in tourist cities can help.' },
      { problem: 'Charter flights arrive at unusual times — kiosks may be slow', solution: 'Have exact $25 USD in cash ready. The queue can be 45 min+ on busy charter days.' },
      { problem: 'Hotel confirmation on Russian-language booking platform not recognized', solution: 'Print English-language Booking.com or hotel confirmation alongside your Russian booking.' },
      { problem: 'eVisa requires English input — site is not Russian-language friendly', solution: 'Use VoA at airport instead. Easier for most Russian travelers than the eVisa website.' },
    ],
  },
  {
    id: 'american',
    label: '🇺🇸 American & Canadian',
    countries: 'USA, Canada',
    needs_visa: true,
    visa_on_arrival: true,
    voa_cost: '$30 USD (cash only)',
    sinai_only: true,
    sinai_cost: 'FREE',
    evisa_available: true,
    evisa_cost: '$30 USD',
    evisa_time: '3–7 business days',
    evisa_url: 'https://visa2egypt.gov.eg',
    max_stay_voa: '30 days (extendable in Egypt for 3 months)',
    max_stay_sinai: '15 days',
    required_docs: [
      'US or Canadian passport valid 6+ months from entry',
      '$30 USD cash for visa on arrival',
      'Return or onward ticket confirmation',
      'Hotel booking for first night',
    ],
    process_voa: [
      'Fly into Cairo (CAI) most commonly, or direct to Hurghada, Sharm, or Luxor',
      'Find Banque Misr kiosks before immigration — pay $25 USD',
      'Sticker goes in passport — proceed to immigration',
      'Full 30-day visa granted on arrival',
    ],
    process_sinai: [
      'Fly directly into Sharm El Sheikh',
      'Declare "Sinai only" at immigration — free 15-day stamp',
      'Good for: Sharm, Dahab, Ras Mohammed, St Catherine, Taba',
      'Not valid for Cairo, Hurghada, Nile Valley',
    ],
    common_problems: [
      { problem: 'US passport holders often don\'t know about the free Sinai option', solution: 'If only visiting Sharm, save $30 by declaring "Sinai only" at immigration.' },
      { problem: 'eVisa website sometimes rejects US credit cards', solution: 'Try a different card or use PayPal option. Alternatively, just get VoA at airport.' },
      { problem: 'Wanting to stay longer than 30 days', solution: 'Visa can be extended at Mogamma (Cairo) or major passport offices in Luxor and Aswan for another 3 months, at minimal cost.' },
      { problem: 'US State Dept advisory causes families to push back on trip', solution: 'US Egypt advisory is Level 2 (same as France, Belgium, Germany). Tourist areas are fully safe. Read the actual advisory — it does not advise against tourist city travel.' },
    ],
  },
  {
    id: 'other',
    label: '🌍 Other Nationalities',
    countries: 'Australia, NZ, Japan, South Korea, Brazil, India, South Africa, Gulf states (GCC), and most others',
    needs_visa: true,
    visa_on_arrival: true,
    voa_cost: '$30 USD (most nationalities)',
    sinai_only: true,
    sinai_cost: 'FREE (some nationalities)',
    evisa_available: true,
    evisa_cost: '$25 USD',
    evisa_time: '5–7 business days',
    evisa_url: 'https://visa2egypt.gov.eg',
    max_stay_voa: '30 days',
    max_stay_sinai: '15 days (where applicable)',
    required_docs: [
      'Passport valid 6+ months from entry',
      '$30 USD cash (exact change preferred — raised March 2026)',
      'Onward/return ticket confirmation',
      'Hotel booking for first night',
      'Proof of sufficient funds (sometimes requested)',
    ],
    process_voa: [
      'Check official Egyptian e-visa portal for your specific nationality',
      'Most nationalities (100+) are eligible for visa on arrival',
      'At airport: Banque Misr kiosk → pay $30 USD → get sticker → immigration',
      'Some nationalities (Bangladesh, Nigeria, etc.) may need pre-arranged visa',
    ],
    process_sinai: [
      'Sharm El Sheikh only — check if your nationality is eligible for Sinai-free entry',
      'GCC passport holders: typically visa-free or simplified entry',
      'Australian/NZ/Japanese: VoA applies normally',
    ],
    common_problems: [
      { problem: 'Not sure if your nationality qualifies for VoA', solution: 'Check visa2egypt.gov.eg before traveling. If uncertain, apply for eVisa 7 days in advance.' },
      { problem: 'Indian passport holders — longer queues at Cairo immigration', solution: 'Apply for eVisa in advance. Much smoother than VoA for Indian nationals currently.' },
      { problem: 'Israeli passport holders', solution: 'Egypt and Israel have full diplomatic relations. Israeli passport holders can enter Egypt normally on VoA.' },
      { problem: 'Dual nationals uncertain which passport to use', solution: 'Use the passport most likely to qualify for easiest entry. EU passport always preferable over third-country passport.' },
    ],
  },
];

const EXTENSION_INFO = [
  { title: 'Where to extend your visa', desc: 'Mogamma Building, Tahrir Square, Cairo. Also available at passport offices in Luxor, Aswan, Hurghada, and Sharm.' },
  { title: 'How long can you extend', desc: 'Up to 3 months per extension. You can theoretically stay up to 6 months before needing to do a visa run.' },
  { title: 'Cost of extension', desc: 'Typically 160–340 EGP depending on nationality. Pay at the office on the day.' },
  { title: 'Documents needed', desc: 'Passport, passport photos (2), filled form from the office, hotel booking or lease, proof of funds.' },
  { title: '"Visa run" option', desc: 'Cross into Jordan at Taba border, get a new entry stamp, come back the next day. Costs $15–20 USD in border fees. Legally restarts your 30-day clock.' },
];

export default function VisaEntry() {
  const [selectedGroup, setSelectedGroup] = useState('european');
  const [openProblem, setOpenProblem] = useState(null);
  const [showExtension, setShowExtension] = useState(false);

  useSEO({
    title: 'Egypt Visa Guide 2026 — Visa on Arrival, eVisa, Requirements by Nationality',
    description: 'Complete Egypt visa guide for 2026. Visa on arrival ($25 USD), free Sinai-only visa, eVisa process, required documents, common problems and how to avoid them. By nationality.',
  });

  const group = NATIONALITY_GROUPS.find(g => g.id === selectedGroup);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Egypt Visa & Entry Guide 2026</h1>
          <p className="text-sm text-muted-foreground">Visa on arrival · eVisa · Sinai free entry · Common problems</p>
        </div>
      </div>

      {/* Quick summary */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="font-extrabold text-success">Good news: Egypt is very easy to enter</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-success">100+</p>
            <p className="text-[10px] text-muted-foreground">nationalities eligible for visa on arrival</p>
          </div>
          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-success">FREE</p>
            <p className="text-[10px] text-muted-foreground">Sinai-only entry for most nationalities</p>
          </div>
          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-accent">$30 USD</p>
            <p className="text-[10px] text-muted-foreground">Full visa on arrival — cash only (since Mar 2026)</p>
          </div>
        </div>
      </div>

      {/* Nationality selector */}
      <h2 className="text-xl font-extrabold mb-4">Select Your Nationality Group</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {NATIONALITY_GROUPS.map(g => (
          <button key={g.id} onClick={() => setSelectedGroup(g.id)}
            className={`p-3 rounded-xl text-sm font-bold border-2 transition-all text-left ${selectedGroup === g.id ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}>
            {g.label}
          </button>
        ))}
      </div>

      {group && (
        <div className="space-y-6">
          {/* Quick status */}
          <div className="bg-card rounded-2xl border border-border/50 p-5">
            <h3 className="font-extrabold text-base mb-3">{group.label} — Quick Summary</h3>
            <p className="text-xs text-muted-foreground mb-4">{group.countries}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`rounded-xl p-3 text-center ${group.visa_on_arrival ? 'bg-success/10' : 'bg-red-500/10'}`}>
                <p className="text-[10px] font-bold text-muted-foreground mb-1">VISA ON ARRIVAL</p>
                <p className={`font-extrabold text-sm ${group.visa_on_arrival ? 'text-success' : 'text-destructive'}`}>
                  {group.visa_on_arrival ? '✅ Yes' : '❌ No'}
                </p>
                <p className="text-[10px] text-muted-foreground">{group.voa_cost}</p>
              </div>
              <div className="bg-success/10 rounded-xl p-3 text-center">
                <p className="text-[10px] font-bold text-muted-foreground mb-1">SINAI FREE</p>
                <p className="font-extrabold text-sm text-success">✅ Yes</p>
                <p className="text-[10px] text-muted-foreground">{group.sinai_cost}</p>
              </div>
              <div className={`rounded-xl p-3 text-center ${group.evisa_available ? 'bg-blue-500/10' : 'bg-secondary'}`}>
                <p className="text-[10px] font-bold text-muted-foreground mb-1">eVISA</p>
                <p className={`font-extrabold text-sm ${group.evisa_available ? 'text-blue-500' : 'text-muted-foreground'}`}>
                  {group.evisa_available ? '✅ Available' : '❌ N/A'}
                </p>
                <p className="text-[10px] text-muted-foreground">{group.evisa_time}</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-3 text-center">
                <p className="text-[10px] font-bold text-muted-foreground mb-1">MAX STAY</p>
                <p className="font-extrabold text-sm text-accent">30 days</p>
                <p className="text-[10px] text-muted-foreground">extendable</p>
              </div>
            </div>
          </div>

          {/* Required documents */}
          <div className="bg-card rounded-2xl border border-border/50 p-5">
            <h3 className="font-extrabold text-sm mb-3">Required Documents</h3>
            <ul className="space-y-2">
              {group.required_docs.map((doc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />{doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Process — VoA */}
          <div className="bg-card rounded-2xl border border-border/50 p-5">
            <h3 className="font-extrabold text-sm mb-3">How to Get Visa on Arrival — Step by Step</h3>
            <div className="space-y-3">
              {group.process_voa.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-black flex items-center justify-center shrink-0">{i + 1}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sinai-only process */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
            <h3 className="font-extrabold text-sm mb-1 text-blue-600">🆓 Free Sinai-Only Entry (Sharm El Sheikh)</h3>
            <p className="text-xs text-muted-foreground mb-3">Save $25 USD if visiting Sharm El Sheikh only</p>
            <div className="space-y-2">
              {group.process_sinai.map((step, i) => (
                <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-blue-500 font-bold shrink-0">{i + 1}.</span>{step}
                </div>
              ))}
            </div>
          </div>

          {/* eVisa */}
          {group.evisa_available && (
            <div className="bg-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-extrabold text-sm mb-3">Apply Online — eVisa</h3>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Processing time: <strong>{group.evisa_time}</strong></p>
                  <p className="text-xs text-muted-foreground">Cost: <strong>{group.evisa_cost}</strong></p>
                </div>
                <a href={group.evisa_url} target="_blank" rel="noopener noreferrer"
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                  Apply at visa2egypt.gov.eg →
                </a>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-xs text-amber-700">
                  <strong>⚠️ Important:</strong> Apply at least 5 business days before travel. In doubt, get visa on arrival at the airport — it's the same price and takes 10 minutes.
                </p>
              </div>
            </div>
          )}

          {/* Common problems */}
          <div className="bg-card rounded-2xl border border-border/50 p-5">
            <h3 className="font-extrabold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Common Problems & How to Avoid Them
            </h3>
            <div className="space-y-2">
              {group.common_problems.map((item, i) => (
                <div key={i}>
                  <button onClick={() => setOpenProblem(openProblem === i ? null : i)}
                    className="w-full flex items-center justify-between text-left bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
                    <p className="text-sm font-semibold text-amber-700 pr-3">⚠️ {item.problem}</p>
                    {openProblem === i ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </button>
                  {openProblem === i && (
                    <div className="bg-success/5 border border-success/20 rounded-xl px-4 py-3 -mt-1 ml-2">
                      <p className="text-sm text-muted-foreground">✅ <strong>Solution:</strong> {item.solution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visa extension */}
      <div className="mt-8">
        <button onClick={() => setShowExtension(!showExtension)}
          className="w-full flex items-center justify-between bg-card border border-border/50 rounded-2xl p-4">
          <h3 className="font-bold text-sm">Extending Your Visa in Egypt</h3>
          {showExtension ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showExtension && (
          <div className="bg-card border border-border/50 border-t-0 rounded-b-2xl px-5 pb-5 space-y-3">
            {EXTENSION_INFO.map((item, i) => (
              <div key={i} className="pt-3 border-t border-border/20 first:border-0 first:pt-0">
                <p className="font-bold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <SafeNextStep title="Before You Land Checklist" description="Full arrival preparation beyond visa" to="/before-you-land" />
        <SafeNextStep title="Currency & ATM Guide" description="How to get Egyptian pounds and avoid exchange scams" to="/currency-rates" />
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Current safety assessment for 2026" to="/egypt-safe-now" />
      </div>
    </div>
  );
}