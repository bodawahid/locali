import { useParams, Link } from 'react-router-dom';
import { CITY_META, CITY_SAFETY } from '../../lib/cityContent';
import { useSEO, buildFAQSchema } from '../../lib/seo';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { ShieldCheck, AlertTriangle, Info, Phone } from 'lucide-react';

const RATING_STYLES = {
  'low': { bg: 'bg-success/10', border: 'border-success/20', text: 'text-success' },
  'medium-low': { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-600' },
  'medium': { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-600' },
  'high': { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500' },
};

const TIP_STYLES = {
  safe: { icon: ShieldCheck, color: 'text-success', bg: '' },
  caution: { icon: Info, color: 'text-amber-600', bg: '' },
  warning: { icon: AlertTriangle, color: 'text-red-500', bg: '' },
};

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'Is it safe to swim in the Red Sea in Sharm?', a: 'Yes, at designated beach areas with lifeguards. Always respect red flags and lifeguard instructions. Currents and marine hazards (sea urchins, fire coral) are real. Never swim at unpatrolled beaches.' },
    { q: 'Is Sharm El Sheikh safe for solo female travelers?', a: 'The resort areas and Naama Bay are relatively safe for solo women. Avoid walking alone late at night in non-tourist areas. Verbal harassment exists but violent incidents against tourists are rare.' },
    { q: 'What should I do if I\'m scammed in Sharm?', a: 'Report to the Tourist Police (126 toll-free). They take tourist complaints seriously and exist specifically for this. File a report even if you don\'t expect recovery — it creates a record.' },
    { q: 'Is it safe to go to the desert near Sharm?', a: 'Yes, for organized tours with licensed operators. Do not go into the Sinai desert independently. Always tell your hotel where you are going and when you expect to return.' },
  ],
  hurghada: [
    { q: 'Is Hurghada safe in 2026?', a: 'Yes. Hurghada has an excellent safety record for tourists. The main tourist areas are well-patrolled. The primary risk is financial scams, not violent crime.' },
    { q: 'Are there sharks in Hurghada?', a: 'Shark encounters are extremely rare in tourist areas. There have been very isolated incidents. Standard safety: do not swim near fishing boats or at night, and do not bleed in the water.' },
    { q: 'Is Hurghada safe for women traveling alone?', a: 'Yes, particularly in the Marina, Sahl Hasheesh, and resort areas. These are well-lit, well-patrolled, and have international visitors constantly. Standard caution applies at night.' },
    { q: 'What is the emergency number in Hurghada?', a: 'Tourist Police: 126 (free). Ambulance: 123. Police: 122. Your hotel can also call for emergency assistance — this is often the fastest option.' },
  ],
  luxor: [
    { q: 'Is Luxor safe at night?', a: 'The main Corniche road and hotel areas are safe at night. The West Bank after dark is less recommended without pre-arranged transport. Avoid wandering unfamiliar alleys alone.' },
    { q: 'How do I deal with aggressive vendors in Luxor?', a: 'Say "La shukran" (no thank you) firmly and keep walking without eye contact. Never engage in bargaining you didn\'t initiate. Eye contact and hesitation are interpreted as invitations.' },
    { q: 'Are balloon rides in Luxor safe?', a: 'Only with ECAA (Egyptian Civil Aviation Authority) certified operators. Fatal crashes have occurred with uncertified companies. Do not book on price alone — always verify certification.' },
    { q: 'Is Luxor safe for solo travelers?', a: 'Yes, with the right awareness. Luxor has many solo travelers. The main challenge is the persistent tout culture near temples — manageable with a firm approach and this guide.' },
  ],
  aswan: [
    { q: 'Is Aswan the safest city in Egypt for tourists?', a: 'It\'s widely considered one of the safest. Aswan is smaller, the pace is slower, and Nubian culture is notably more welcoming than other tourist areas. Scams exist but are milder.' },
    { q: 'Do I need a guide in Aswan?', a: 'Not required, but helpful for Abu Simbel\'s historical context. The temples are well-signed. For the Nile, a felucca captain who doubles as a guide is excellent value.' },
    { q: 'Is it safe to travel to Abu Simbel from Aswan?', a: 'Yes, on the official police convoy that departs at 4am. The route and convoy are secure. Do not attempt the drive outside the convoy — it is not permitted.' },
    { q: 'Is Aswan safe for solo female travelers?', a: 'Yes, notably more so than Luxor or Cairo. Aswan\'s Nubian-influenced culture is generally more respectful toward solo women. Standard precautions apply, especially at night.' },
  ],
};

const EMERGENCY_CONTACTS = [
  { name: 'Tourist Police', number: '126', desc: 'Free, 24/7. File complaints here.' },
  { name: 'Ambulance', number: '123', desc: 'Medical emergencies.' },
  { name: 'Police (Emergency)', number: '122', desc: 'Crime and security.' },
  { name: 'Fire Department', number: '180', desc: 'Fire emergencies.' },
];

const WOMEN_SAFETY_TIPS = [
  'Dress modestly outside resort areas — covered shoulders and knees reduce unwanted attention significantly.',
  'Walk confidently and avoid making eye contact with men who try to engage you.',
  '"La shukran" (no thank you) in Arabic often gets more respect than English refusals.',
  'In taxis: sit in the back seat. Always use Careem/Uber for the tracking feature.',
  'Beach areas in Sharm and Hurghada are generally safe. Off-resort areas require more awareness.',
  'Trust your instincts — if a situation feels uncomfortable, leave immediately.',
];

export default function CitySafety() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const safety = CITY_SAFETY[cityId];
  const faqs = FAQS[cityId] || [];

  useSEO({
    title: meta ? `Is ${meta.name} Safe for Tourists in 2026? Honest Safety Guide` : 'Egypt Safety Guide',
    description: meta ? `Honest safety assessment for ${meta.name} in 2026. What risks actually exist, what the media exaggerates, and practical safety tips for tourists. Women safety section included.` : '',
    jsonLd: faqs.length ? buildFAQSchema(faqs) : undefined,
  });

  if (!meta || !safety) return <div className="p-4">City not found</div>;

  const ratingStyle = RATING_STYLES[safety.ratingLevel] || RATING_STYLES['medium'];

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Is {meta.name} Safe for Tourists in 2026? Honest Guide
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Honest safety assessment for {meta.name}. This is not designed to scare you — it is designed to prepare you. The reality is that the vast majority of tourists have completely safe and enjoyable trips. The risks that exist are manageable with the right knowledge.
        </p>

        {/* Overall Rating */}
        <div className={`rounded-2xl border p-5 mb-8 ${ratingStyle.bg} ${ratingStyle.border}`}>
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className={`w-6 h-6 ${ratingStyle.text}`} />
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overall Safety Rating — {meta.name} 2026</p>
              <p className={`text-xl font-extrabold ${ratingStyle.text}`}>{safety.rating}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{safety.overview}</p>
        </div>

        {/* Safety tips */}
        <h2 className="text-xl font-extrabold mb-4">Safety Guidelines — {meta.name}</h2>
        <div className="space-y-2 mb-10">
          {safety.tips.map((tip, i) => {
            const style = TIP_STYLES[tip.type];
            const Icon = style.icon;
            return (
              <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex items-start gap-3">
                <Icon className={`w-4 h-4 ${style.color} shrink-0 mt-0.5`} />
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>

        {/* Women's safety */}
        <h2 className="text-xl font-extrabold mb-4">Safety for Women Traveling in {meta.name}</h2>
        <div className="space-y-2 mb-10">
          {WOMEN_SAFETY_TIPS.map((tip, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
              <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
        <div className="mb-10">
          <SafeNextStep
            title="Full Women's Safety Guide for Egypt"
            description="Comprehensive advice for solo and group female travelers"
            to="/women-safety"
          />
        </div>

        {/* Emergency contacts */}
        <h2 className="text-xl font-extrabold mb-4">Emergency Numbers — {meta.name}</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {EMERGENCY_CONTACTS.map((contact, i) => (
            <a
              key={i}
              href={`tel:${contact.number}`}
              className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 hover:bg-red-500/10 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="font-extrabold text-lg text-red-500">{contact.number}</span>
              </div>
              <p className="font-bold text-xs">{contact.name}</p>
              <p className="text-[11px] text-muted-foreground">{contact.desc}</p>
            </a>
          ))}
        </div>

        {/* What to do if something goes wrong */}
        <h2 className="text-xl font-extrabold mb-4">If Something Goes Wrong</h2>
        <div className="space-y-3 mb-10">
          {[
            { scenario: 'You were scammed or overcharged', action: 'Report to Tourist Police (126). Describe exactly what happened, where, and what was charged. Ask for a police report number.' },
            { scenario: 'Medical emergency', action: 'Call 123 (ambulance) or ask your hotel to arrange transport to the nearest hospital. Have your travel insurance details accessible.' },
            { scenario: 'Lost passport or stolen documents', action: 'Contact your country\'s embassy immediately. Tourist Police can provide an official crime report for insurance and embassy purposes.' },
            { scenario: 'You feel unsafe or threatened', action: 'Walk toward any hotel lobby — they are generally safe havens. Hotel staff will call police. Never confront or escalate with someone threatening you.' },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-bold text-sm mb-2">{item.scenario}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.action}</p>
            </div>
          ))}
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Common Scams in ${meta.name}`}
            description="Financial safety — the most likely issue you'll face"
            to={`/city/${cityId}/scams`}
          />
          <SafeNextStep
            title="Emergency Contact Hub"
            description="All emergency numbers for Egypt in one place"
            to="/emergency"
          />
        </div>
      </div>
    </div>
  );
}