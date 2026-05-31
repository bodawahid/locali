import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, Phone, AlertTriangle, CheckCircle2, XCircle, Sun, Moon, Car, Users, Heart } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

const CITY_SAFETY = [
  { city: 'Hurghada', level: 'safe', note: 'Resort zone heavily secured 24/7. All-inclusive areas are extremely safe. Main risk: taxi overcharging and beach vendor scams.' },
  { city: 'Sharm El Sheikh', level: 'safe', note: 'One of the most secure tourist zones in Egypt. Tourist police visible everywhere. Naama Bay well-lit and patrolled at night.' },
  { city: 'Luxor', level: 'medium', note: 'Safe but more persistent vendor culture. West Bank temples require awareness near the entrance. Solo at night — stick to Corniche.' },
  { city: 'Aswan', level: 'safe', note: "Egypt's most relaxed tourist city. Genuinely low-pressure. Safe for solo travelers including women. Night walks on Corniche recommended." },
  { city: 'El Gouna', level: 'safe', note: 'Gated resort city — extremely safe, private security throughout. Ideal for families and long stays.' },
];

const LEVEL_STYLE = {
  safe: { bg: 'bg-success/10 border-success/20', badge: 'bg-success text-white', label: 'SAFE' },
  medium: { bg: 'bg-amber-500/10 border-amber-500/20', badge: 'bg-amber-500 text-white', label: 'MEDIUM' },
  caution: { bg: 'bg-red-500/10 border-red-500/20', badge: 'bg-red-500 text-white', label: 'CAUTION' },
};

const EMERGENCY_NUMBERS = [
  { name: 'Tourist Police', number: '126', desc: 'Free, 24/7, English-speaking officers' },
  { name: 'Ambulance', number: '123', desc: 'National emergency ambulance' },
  { name: 'Police', number: '122', desc: 'General police emergency' },
  { name: 'Fire Department', number: '180', desc: 'Fire & rescue' },
  { name: 'Tourist Complaints', number: '16118', desc: 'Ministry of Tourism hotline' },
];

const SCAMS = [
  { title: 'Taxi Overcharging', risk: 'HIGH', tip: 'Always agree on price BEFORE getting in. Use Careem/Uber. Fair airport taxi: 150–250 EGP.' },
  { title: '"Free" Perfume / Gift', risk: 'HIGH', tip: 'Never accept anything for free near markets. They demand payment aggressively after.' },
  { title: 'Fake Guides at Temples', risk: 'HIGH', tip: 'Only hire guides with official badge. Say "I already have a guide" firmly.' },
  { title: 'Horse/Calèche Overcharging', risk: 'MEDIUM', tip: 'Always ask "the whole tour, return?" Fair price: 100–200 EGP for 30 min.' },
  { title: 'Photo Fees After Posing', risk: 'MEDIUM', tip: 'Locals in traditional dress demand high fees. Don\'t engage unless you want to pay.' },
  { title: 'Fake Papyrus / Alabaster', risk: 'MEDIUM', tip: 'Real papyrus: only at Dr. Ragab shops. Real alabaster: feel the weight and cold.' },
  { title: 'Currency Exchange Scam', risk: 'HIGH', tip: 'Use official bank ATMs only. Exchange shops near pyramids/souks often shortchange.' },
];

const DOS_DONTS = [
  { type: 'do', text: 'Dress modestly at religious sites (covered shoulders and knees)' },
  { type: 'do', text: 'Ask permission before photographing locals' },
  { type: 'do', text: 'Greet with "Ahlan" — locals appreciate the effort' },
  { type: 'do', text: 'Carry small EGP notes (20s and 50s) for tips and small purchases' },
  { type: 'do', text: 'Drink bottled water only — always check the seal is intact' },
  { type: 'dont', text: 'Don\'t photograph military buildings, personnel or checkpoints' },
  { type: 'dont', text: 'Don\'t publicly display affection in conservative areas' },
  { type: 'dont', text: 'Don\'t bring drugs — penalty is severe, including life imprisonment' },
  { type: 'dont', text: 'Don\'t eat or drink publicly during Ramadan in local areas' },
  { type: 'dont', text: 'Don\'t accept unsolicited guides — firmly say "La shukran"' },
];

const WHATSAPP_EXAMPLES = [
  { scenario: 'I was scammed', msg: 'Hello, I am a tourist in [CITY]. I was scammed at [LOCATION]. I need help from tourist police. My name is [NAME], hotel: [HOTEL].' },
  { scenario: 'Medical emergency', msg: 'URGENT: I need medical help. I am at [LOCATION] in [CITY]. I am a tourist. Please send ambulance or advise nearest hospital. My hotel: [HOTEL].' },
  { scenario: 'Lost passport', msg: 'I am a tourist in [CITY], Egypt. I lost my passport. I need help contacting my embassy. Name: [NAME], nationality: [NATIONALITY], hotel: [HOTEL].' },
];

export default function SafetyGuide() {
  const { lang } = useOutletContext();
  const [checklist, setChecklist] = useState(new Set());

  const CHECKLIST = [
    'Travel insurance with medical evacuation purchased',
    'Tourist Police number saved: 126',
    'Hotel address screenshot on phone',
    'Careem app installed and payment set up',
    'Emergency cash in USD (minimum $50)',
    'Embassy contact number saved',
    'Offline map of your city downloaded',
    'Bottled water supply confirmed at hotel',
    'Basic Arabic phrases learned (La shukran, Bikam?)',
    'Fair prices read on Locali Egypt before arrival',
  ];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Safety Guide — Egypt 2026</h1>
          <p className="text-sm text-muted-foreground">Realistic, calm, practical. Everything you need to stay safe.</p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <span className="font-extrabold text-success">Bottom Line: Egypt is safe for tourists.</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">Over 15 million tourists visited safely in 2024. The real risks are financial scams, not violence. With preparation, you will have no issues. This guide gives you exactly what you need.</p>
      </div>

      {/* City Safety Levels */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-accent" /> Safety by City</h2>
      <div className="space-y-3 mb-10">
        {CITY_SAFETY.map((c, i) => {
          const s = LEVEL_STYLE[c.level];
          return (
            <div key={i} className={`rounded-2xl border p-4 ${s.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold">{c.city}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{c.note}</p>
            </div>
          );
        })}
      </div>

      {/* Emergency Numbers */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-red-500" /> Emergency Numbers</h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-10">
        {EMERGENCY_NUMBERS.map((e, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border/20 last:border-0">
            <div>
              <p className="font-bold text-sm">{e.name}</p>
              <p className="text-xs text-muted-foreground">{e.desc}</p>
            </div>
            <a href={`tel:${e.number}`} className="text-xl font-extrabold text-accent">{e.number}</a>
          </div>
        ))}
      </div>

      {/* Common Scams */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Common Scams & How to Avoid Them</h2>
      <div className="space-y-3 mb-10">
        {SCAMS.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm">{s.title}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.risk === 'HIGH' ? 'bg-red-500/20 text-red-600' : 'bg-amber-500/20 text-amber-600'}`}>{s.risk}</span>
            </div>
            <p className="text-xs text-muted-foreground">✅ {s.tip}</p>
          </div>
        ))}
      </div>

      {/* Night Safety + Transport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-3"><Moon className="w-4 h-4 text-indigo-500" /><h2 className="font-extrabold">Night Safety</h2></div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {['Stick to well-lit main streets (Corniche, Naama Bay)', 'Use Careem after dark — never unmarked taxis', 'Resort areas are safe at any hour with security', 'Avoid dark beach areas alone after midnight', 'Women: travel with a companion after 11pm outside resorts'].map((t, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />{t}</li>)}
          </ul>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-3"><Car className="w-4 h-4 text-blue-500" /><h2 className="font-extrabold">Transport Safety</h2></div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {['Always use Careem or Uber (rated drivers)', 'Agree taxi price before getting in — always', 'For intercity: official bus companies or train only', 'Avoid driving yourself — Egyptian traffic is chaotic', 'Airport taxis: only from official desk inside terminal'].map((t, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />{t}</li>)}
          </ul>
        </div>
      </div>

      {/* Women Safety */}
      <div className="bg-pink-500/5 border border-pink-500/20 rounded-2xl p-5 mb-10">
        <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-pink-500" /><h2 className="font-extrabold">Women Safety Specific</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {['Hurghada & Sharm: very safe, international resort culture', 'Aswan: most relaxed city, friendly and low-pressure', 'Dress modestly outside resort zones — prevents unwanted attention', 'Use "La, shukran" firmly — never engage with persistent men', 'Share location with a contact when going out solo', 'Tourist Police (126) respond quickly to any harassment'].map((t, i) => (
            <div key={i} className="flex gap-2 text-xs text-muted-foreground"><CheckCircle2 className="w-3 h-3 text-pink-500 shrink-0 mt-0.5" />{t}</div>
          ))}
        </div>
      </div>

      {/* Dos & Donts */}
      <h2 className="text-xl font-extrabold mb-4">Cultural Do's & Don'ts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        <div className="bg-success/5 border border-success/20 rounded-2xl p-4">
          <h3 className="font-extrabold text-success text-sm mb-3">✅ Do</h3>
          <ul className="space-y-2">{DOS_DONTS.filter(d => d.type === 'do').map((d, i) => <li key={i} className="text-xs text-muted-foreground">{d.text}</li>)}</ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
          <h3 className="font-extrabold text-red-500 text-sm mb-3">❌ Don't</h3>
          <ul className="space-y-2">{DOS_DONTS.filter(d => d.type === 'dont').map((d, i) => <li key={i} className="text-xs text-muted-foreground">{d.text}</li>)}</ul>
        </div>
      </div>

      {/* WhatsApp Emergency Templates */}
      <h2 className="text-xl font-extrabold mb-4">WhatsApp Emergency Message Templates</h2>
      <div className="space-y-3 mb-10">
        {WHATSAPP_EXAMPLES.map((e, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <p className="text-xs font-bold text-accent mb-2">📱 Scenario: {e.scenario}</p>
            <p className="text-xs font-mono bg-secondary p-3 rounded-xl text-muted-foreground leading-relaxed">{e.msg}</p>
          </div>
        ))}
      </div>

      {/* Safety Checklist */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /> Pre-Trip Safety Checklist</h2>
      <div className="space-y-2 mb-10">
        {CHECKLIST.map((item, i) => (
          <button key={i} onClick={() => setChecklist(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}
            className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all text-sm ${checklist.has(i) ? 'bg-success/5 border border-success/20 line-through text-muted-foreground' : 'bg-card border border-border/50'}`}>
            <div className={`w-5 h-5 rounded-full shrink-0 border-2 flex items-center justify-center mt-0.5 ${checklist.has(i) ? 'bg-success border-success' : 'border-border'}`}>
              {checklist.has(i) && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            {item}
          </button>
        ))}
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-6 text-center">
        <p className="font-extrabold mb-2">Book Only Verified Services via Locali Egypt</p>
        <p className="text-sm text-muted-foreground mb-3">Every verified operator has been reviewed. Your tracking code ensures fair pricing.</p>
        <a href="/book" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold text-sm">Book Verified Tours →</a>
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Women's Safety Guide" description="Specific advice for female travelers" to="/women-safety" />
        <SafeNextStep title="Emergency Numbers" description="All contacts in one place" to="/emergency" />
        <SafeNextStep title="Before You Land Checklist" description="Full arrival preparation guide" to="/before-you-land" />
      </div>
    </div>
  );
}