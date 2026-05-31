import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CITY_META, CITY_SCAMS, CITY_FAQS } from '../../lib/cityContent';
import { useSEO, buildFAQSchema } from '../../lib/seo';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SEVERITY_STYLES = {
  high: { badge: 'bg-red-500 text-white', border: 'border-red-500/30 bg-red-500/5' },
  medium: { badge: 'bg-amber-500 text-white', border: 'border-amber-500/30 bg-amber-500/5' },
  low: { badge: 'bg-muted text-muted-foreground', border: 'border-border/50 bg-card' },
};

const GENERAL_ADVICE = [
  { title: 'The "Friendly Local" Opening', desc: 'Strangers who approach you speaking your language and offering unsolicited help are almost always leading you to a shop or scam. Genuine locals do not approach tourists unprompted.' },
  { title: 'Fake "Museum Closed Today"', desc: 'A man near a major attraction tells you it\'s closed for prayer/holiday/renovation. He\'ll then offer to take you somewhere "special." The attraction is open. He earns commission from the shop.' },
  { title: 'Currency Confusion', desc: 'Prices quoted in "dollars" that turn out to be EGP, or EGP that turn out to be dollars. Always clarify currency and calculate the conversion yourself.' },
  { title: 'Photo Fee Ambush', desc: 'Someone poses with you or lets you photograph them, then demands payment aggressively. Agree on terms (or decline) before taking any photo.' },
];

export default function CityScams() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const scams = CITY_SCAMS[cityId] || [];
  const faqs = CITY_FAQS[cityId] || [];
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'other', severity: 'medium', location_name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useSEO({
    title: meta ? `Scams in ${meta.name} — What to Watch Out For in 2026` : 'Egypt Scam Guide',
    description: meta ? `Know the most common tourist scams in ${meta.name} before you arrive. Taxi scams, fake guides, overcharging and how to avoid them. Real community reports.` : '',
    jsonLd: faqs.length ? buildFAQSchema(faqs) : undefined,
  });

  if (!meta) return <div className="p-4">City not found</div>;

  const highCount = scams.filter(s => s.severity === 'high').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ScamReport.create({ ...form, city: cityId, status: 'pending' });
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Common Tourist Scams in {meta.name} — 2026 Warning Guide
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          These scams happen in {meta.name} every single week. This is not sensationalism — it is pattern recognition. Tourists who know these patterns are almost never targeted successfully. Reading this page is one of the most valuable things you can do before visiting.
        </p>

        {/* Stats bar */}
        <div className="flex gap-4 mb-8">
          <div className="bg-red-500/10 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-extrabold text-red-500">{highCount}</p>
            <p className="text-[10px] font-bold text-red-500">HIGH RISK</p>
          </div>
          <div className="bg-amber-500/10 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-extrabold text-amber-600">{scams.length - highCount}</p>
            <p className="text-[10px] font-bold text-amber-600">MODERATE</p>
          </div>
          <div className="flex-1 bg-card rounded-xl border border-border/50 px-4 py-3 flex items-center">
            <ShieldCheck className="w-4 h-4 text-success mr-2 shrink-0" />
            <p className="text-xs text-muted-foreground">Reading this makes you <strong>dramatically safer</strong></p>
          </div>
        </div>

        {/* City-specific scams */}
        <h2 className="text-xl font-extrabold mb-4">Top Scams Specific to {meta.name}</h2>
        <div className="space-y-3 mb-10">
          {scams.map((scam, i) => {
            const styles = SEVERITY_STYLES[scam.severity] || SEVERITY_STYLES.low;
            return (
              <div key={i} className={`rounded-2xl border p-5 ${styles.border}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                        {scam.severity.toUpperCase()} RISK
                      </span>
                    </div>
                    <h3 className="font-bold text-sm">{scam.title}</h3>
                  </div>
                  <button onClick={() => setExpanded(expanded === i ? null : i)} className="p-1 shrink-0">
                    {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                {expanded === i && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{scam.desc}</p>
                    <div className="bg-success/10 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-success mb-1">HOW TO AVOID</p>
                      <p className="text-sm text-muted-foreground">{scam.avoid}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* General scam patterns */}
        <h2 className="text-xl font-extrabold mb-4">Universal Egypt Scam Patterns — {meta.name} & Beyond</h2>
        <div className="space-y-3 mb-10">
          {GENERAL_ADVICE.map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* The Golden Rules */}
        <h2 className="text-xl font-extrabold mb-4">The 5 Golden Rules for Staying Scam-Free</h2>
        <div className="bg-success/5 border border-success/20 rounded-2xl p-5 mb-10">
          <ol className="space-y-3">
            {[
              'Agree on the price BEFORE any service begins. Never after.',
              'Always use Egyptian Pounds (EGP). Refuse prices quoted in USD unless at official venues.',
              'Never accept anything "free" from a stranger — free gifts always have a price.',
              'Unsolicited friendship is usually a sales strategy. Be polite but firm.',
              'If you feel pressured, you have the right to walk away from any situation.',
            ].map((rule, i) => (
              <li key={i} className="flex gap-3 items-start text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-success text-success-foreground font-extrabold text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                {rule}
              </li>
            ))}
          </ol>
        </div>

        {/* Community report form */}
        <h2 className="text-xl font-extrabold mb-4">Report a New Scam</h2>
        {submitted ? (
          <div className="bg-success/10 border border-success/20 rounded-2xl p-5 text-center mb-8">
            <ShieldCheck className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="font-bold text-sm">Report submitted. Thank you for helping fellow travelers.</p>
          </div>
        ) : showForm ? (
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-5 mb-8 space-y-3">
            <p className="text-sm text-muted-foreground">Your report will be reviewed and may help future travelers. No personal data is stored.</p>
            <input type="text" placeholder="What happened? (brief title)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            <textarea placeholder="Describe the scam in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required className="w-full px-3 py-3 bg-background rounded-xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} className="px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none">
                <option value="low">Low severity</option>
                <option value="medium">Medium severity</option>
                <option value="high">High severity</option>
              </select>
              <input type="text" placeholder="Location (optional)" value={form.location_name} onChange={e => setForm({ ...form, location_name: e.target.value })} className="px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-secondary rounded-xl text-sm font-bold">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Report'}</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 bg-card border border-border rounded-2xl p-4 text-sm font-bold hover:bg-secondary transition-colors mb-8">
            <Plus className="w-4 h-4" />
            Report a Scam in {meta.name}
          </button>
        )}

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Real Prices in ${meta.name}`}
            description="Know what things should cost so you can spot overcharging"
            to={`/city/${cityId}/prices`}
          />
          <SafeNextStep
            title={`Verified Services in ${meta.name}`}
            description="Skip the risk — trusted providers only"
            to={`/services?city=${cityId}`}
          />
        </div>
      </div>
    </div>
  );
}