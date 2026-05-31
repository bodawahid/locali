import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Star, Languages, MapPin, Clock, Users, DollarSign, Plus, X, Check, AlertTriangle, ChevronRight, Sliders, Building2 } from 'lucide-react';
import { useSEO } from '../lib/seo';
import { generateTrackingCode } from '../lib/constants';

// ─── Sample operators ────────────────────────────────────────────────────────
const SAMPLE_OPERATORS = [];

const PLATFORM_RULES = [
  {
    number: 1,
    title: 'Platform-Only Communication',
    desc: 'All tourist contact stays within Locali Egypt. No external phone numbers, WhatsApp, or third-party platforms shared with tourists. Violation = immediate suspension.',
    severity: 'critical',
  },
  {
    number: 2,
    title: 'Listings Integrity',
    desc: 'Tour programs must use services from Locali Egypt directory where available (restaurants, activities, guides). This keeps the ecosystem complete.',
    severity: 'required',
  },
  {
    number: 3,
    title: 'Pricing Transparency',
    desc: 'Prices are locked after submission. No hidden fees. Refund policy must be published. Price changes require admin approval.',
    severity: 'critical',
  },
  {
    number: 4,
    title: 'Reviews Policy',
    desc: 'Tourist reviews cannot be deleted. Minimum 4.0 rating to stay listed. Below 3.5 = automatic suspension.',
    severity: 'critical',
  },
  {
    number: 5,
    title: 'Ecosystem Commitment',
    desc: 'Any external dealing with platform tourists = permanent ban. Your success depends on tourist satisfaction inside the platform.',
    severity: 'required',
  },
];

const INTEREST_OPTIONS = ['beach', 'culture', 'adventure', 'family', 'history', 'diving', 'photography'];
const CITY_OPTIONS = ['Hurghada', 'Sharm El Sheikh', 'Luxor', 'Aswan', 'El Gouna', 'Dahab', 'Cairo'];
const LANGUAGE_OPTIONS = ['English', 'Russian', 'German', 'French', 'Italian', 'Spanish', 'Arabic', 'Chinese', 'Polish'];

// ─── Smart Matching Component ────────────────────────────────────────────────
function SmartMatcher({ operators, onClose }) {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState({
    budget: '', duration: '', interests: [], groupSize: '', nationality: '',
  });
  const [results, setResults] = useState(null);

  const BUDGETS = [
    { id: 'backpacker', label: '🎒 Backpacker', desc: 'Under 1,000 EGP / activity' },
    { id: 'mid', label: '✈️ Mid-range', desc: '1,000–3,000 EGP / activity' },
    { id: 'luxury', label: '💎 Luxury', desc: '3,000+ EGP / activity' },
  ];
  const DURATIONS = [
    { id: 'half', label: 'Half day (3–5 hrs)' },
    { id: 'full', label: 'Full day (6–10 hrs)' },
    { id: 'multi', label: 'Multi-day package' },
  ];

  const findMatches = () => {
    let scored = operators.map(op => {
      let score = 0;
      if (prefs.interests.some(i => op.interests_tags?.includes(i))) score += 3;
      if (prefs.budget === 'backpacker' && op.tour_packages?.some(p => p.price_egp < 1000)) score += 2;
      if (prefs.budget === 'mid' && op.tour_packages?.some(p => p.price_egp >= 1000 && p.price_egp <= 3000)) score += 2;
      if (prefs.budget === 'luxury' && op.tour_packages?.some(p => p.price_egp > 3000)) score += 2;
      if (prefs.duration === 'multi' && op.tour_packages?.some(p => p.duration.includes('day'))) score += 2;
      if (prefs.duration === 'half' && op.tour_packages?.some(p => parseInt(p.duration) <= 5)) score += 2;
      if (op.avg_rating >= 4.8) score += 1;
      return { ...op, score };
    });
    scored.sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 3));
    setStep(4);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-extrabold text-base">Find Your Perfect Operator</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-5 pt-4">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${step >= s ? 'bg-accent' : 'bg-secondary'}`} />
          ))}
        </div>

        <div className="p-5">
          {step === 1 && (
            <div>
              <h3 className="font-bold text-sm mb-4">What's your budget per activity?</h3>
              <div className="space-y-2">
                {BUDGETS.map(b => (
                  <button key={b.id} onClick={() => { setPrefs(p => ({ ...p, budget: b.id })); setStep(2); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all hover:border-accent/50 ${prefs.budget === b.id ? 'border-accent bg-accent/5' : 'border-border bg-secondary/30'}`}>
                    <p className="font-bold text-sm">{b.label}</p>
                    <p className="text-xs text-muted-foreground">{b.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-bold text-sm mb-4">How long do you want each experience?</h3>
              <div className="space-y-2">
                {DURATIONS.map(d => (
                  <button key={d.id} onClick={() => { setPrefs(p => ({ ...p, duration: d.id })); setStep(3); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all hover:border-accent/50 ${prefs.duration === d.id ? 'border-accent bg-accent/5' : 'border-border bg-secondary/30'}`}>
                    <p className="font-bold text-sm">{d.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="font-bold text-sm mb-4">What interests you most? (pick all that apply)</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {INTEREST_OPTIONS.map(interest => (
                  <button key={interest} onClick={() => setPrefs(p => ({
                    ...p,
                    interests: p.interests.includes(interest)
                      ? p.interests.filter(i => i !== interest)
                      : [...p.interests, interest],
                  }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all capitalize ${prefs.interests.includes(interest) ? 'bg-accent text-accent-foreground border-accent' : 'border-border bg-secondary/50'}`}>
                    {interest}
                  </button>
                ))}
              </div>
              <button onClick={findMatches}
                disabled={prefs.interests.length === 0}
                className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
                Find My Top 3 Operators →
              </button>
            </div>
          )}

          {step === 4 && results && (
            <div>
              <h3 className="font-bold text-sm mb-4">🎯 Your top 3 matched operators</h3>
              <div className="space-y-3">
                {results.map((op, i) => (
                  <div key={op.id} className={`bg-secondary/50 rounded-xl p-4 border ${i === 0 ? 'border-accent/40' : 'border-border/50'}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        {i === 0 && <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full block mb-1">🏆 Best Match</span>}
                        <p className="font-extrabold text-sm">{op.company_name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-foreground">{op.avg_rating}</span>
                          <span>({op.review_count} reviews)</span>
                        </div>
                      </div>
                      {op.is_verified && <ShieldCheck className="w-4 h-4 text-success shrink-0" />}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {op.tour_packages?.slice(0, 2).map((pkg, j) => (
                        <span key={j} className="text-[10px] bg-card border border-border/50 px-2 py-0.5 rounded-full">
                          {pkg.name} — {pkg.price_egp.toLocaleString()} EGP
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={onClose} className="w-full mt-4 border border-border py-2.5 rounded-xl text-sm font-bold hover:bg-secondary transition-colors">
                View Full Profiles Below
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Registration Form ────────────────────────────────────────────────────────
function RegistrationForm({ onClose }) {
  const [step, setStep] = useState('rules');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    company_name: '', license_number: '', email: '', phone_internal: '',
    cities_covered: [], languages: [], interests_tags: [],
    description: '', refund_policy: '',
  });
  const queryClient = useQueryClient();

  const createOp = useMutation({
    mutationFn: (data) => base44.entities.TourOperator.create({ ...data, status: 'pending', is_verified: false, agreed_to_terms: true }),
    onSuccess: () => { setSubmitted(true); queryClient.invalidateQueries(['operators']); },
  });

  const submit = (e) => {
    e.preventDefault();
    createOp.mutate(form);
  };

  const toggleArr = (key, val) => setForm(p => ({
    ...p,
    [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val],
  }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-extrabold text-base">Register Your Tour Company</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-extrabold text-lg mb-2">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground">We verify your license with Egypt's Ministry of Tourism. You'll be contacted within 48–72 hours. Once approved, your profile goes live with a Verified badge.</p>
            <button onClick={onClose} className="mt-4 bg-accent text-accent-foreground px-6 py-2 rounded-xl font-bold text-sm">Close</button>
          </div>
        ) : step === 'rules' ? (
          <div className="p-5">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">Read all rules carefully. Violations result in immediate suspension or permanent ban.</p>
            </div>
            <div className="space-y-3 mb-5">
              {PLATFORM_RULES.map(rule => (
                <div key={rule.number} className={`rounded-xl border p-3 ${rule.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' : 'border-border/50 bg-secondary/30'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${rule.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                      RULE {rule.number}
                    </span>
                    <p className="font-bold text-xs">{rule.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 mb-4 text-xs text-muted-foreground">
              <strong className="text-foreground">Enforcement:</strong> 3 tourist complaints = automatic review · Rating below 3.5 = suspension · External dealing = permanent ban
            </div>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-accent" />
              <span className="text-xs">I have read and agree to all Locali Egypt platform rules. I understand that violations result in suspension or permanent ban. My company agrees to the 7% commission on all platform bookings.</span>
            </label>
            <button disabled={!agreed} onClick={() => setStep('form')}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
              I Agree — Continue to Registration
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            {[
              { key: 'company_name', label: 'Company Name *', placeholder: 'Red Sea Discovery Tours' },
              { key: 'license_number', label: 'Tourism License Number * (verified with Ministry)', placeholder: 'HRG-OPR-2018-XXXXXX' },
              { key: 'email', label: 'Company Email *', placeholder: 'info@yourcompany.com', type: 'email' },
              { key: 'phone_internal', label: 'Internal Contact Number (not shown to tourists)', placeholder: '201012345678' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold mb-1 block">{f.label}</label>
                <input type={f.type || 'text'} required={f.label.includes('*')}
                  placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-accent/30" />
              </div>
            ))}

            {/* Cities */}
            <div>
              <label className="text-xs font-bold mb-2 block">Cities Covered *</label>
              <div className="flex flex-wrap gap-1.5">
                {CITY_OPTIONS.map(c => (
                  <button type="button" key={c} onClick={() => toggleArr('cities_covered', c)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${form.cities_covered.includes(c) ? 'bg-accent text-accent-foreground border-accent' : 'border-border'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="text-xs font-bold mb-2 block">Languages Supported *</label>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGE_OPTIONS.map(l => (
                  <button type="button" key={l} onClick={() => toggleArr('languages', l)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${form.languages.includes(l) ? 'bg-accent text-accent-foreground border-accent' : 'border-border'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="text-xs font-bold mb-2 block">Tour Interest Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.map(i => (
                  <button type="button" key={i} onClick={() => toggleArr('interests_tags', i)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all capitalize ${form.interests_tags.includes(i) ? 'bg-accent text-accent-foreground border-accent' : 'border-border'}`}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold mb-1 block">Company Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe your company, experience, and what makes your tours special..."
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none resize-none" />
            </div>

            <div>
              <label className="text-xs font-bold mb-1 block">Refund Policy *</label>
              <textarea rows={2} required value={form.refund_policy} onChange={e => setForm(p => ({ ...p, refund_policy: e.target.value }))}
                placeholder="e.g. Full refund 48h before. 50% refund 24h before. No refund same day."
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none resize-none" />
            </div>

            <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">After approval:</strong> You can add tour packages (with fixed prices) from your dashboard. Package prices cannot be changed without admin approval. Locali Egypt earns 7% commission on all bookings.
            </div>

            <button type="submit" disabled={createOp.isPending || !form.company_name || !form.license_number || !form.cities_covered.length}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
              {createOp.isPending ? 'Submitting…' : 'Submit for Approval'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Operator Card ────────────────────────────────────────────────────────────
function OperatorCard({ op }) {
  const [expanded, setExpanded] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [code] = useState(() => generateTrackingCode(op.cities_covered?.[0] || 'eg', 'OPR'));
  const commission = (pkg) => Math.round((pkg.price_egp || 0) * 0.07);

  const handleRequest = () => {
    if (!requestMsg.trim()) return;
    // In production this saves to DB; here we simulate
    setSent(true);
    setTimeout(() => { setShowRequest(false); setSent(false); setRequestMsg(''); }, 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border/30">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 text-xl font-extrabold text-accent">
            {op.logo_url ? <img src={op.logo_url} alt={op.company_name} className="w-full h-full object-cover rounded-2xl" /> : op.company_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-extrabold text-base leading-tight">{op.company_name}</h3>
              {op.is_verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1 flex-wrap">
              {op.avg_rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <strong className="text-foreground">{op.avg_rating}</strong>
                  <span>({op.review_count} reviews)</span>
                </span>
              )}
              <span className="font-mono text-[10px]">Lic: {op.license_number}</span>
            </div>
            {/* Cities */}
            <div className="flex flex-wrap gap-1">
              {op.cities_covered?.map((c, i) => (
                <span key={i} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <MapPin className="w-2 h-2" />{c}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-3">{op.description}</p>
      </div>

      {/* Languages + interests */}
      <div className="px-5 py-3 border-b border-border/20 flex flex-wrap gap-1.5">
        <Languages className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
        {op.languages?.map((l, i) => (
          <span key={i} className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full">{l}</span>
        ))}
        {op.interests_tags?.map((t, i) => (
          <span key={i} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full capitalize">{t}</span>
        ))}
      </div>

      {/* Tour packages */}
      <div className="p-4">
        <button onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs font-bold mb-3 hover:text-accent transition-colors">
          <span>Tour Packages ({op.tour_packages?.length || 0})</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {expanded && (
          <div className="space-y-2 mb-3">
            {op.tour_packages?.map((pkg, i) => (
              <div key={i} className="bg-secondary/50 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-sm">{pkg.name}</p>
                  <a href={`https://www.viator.com/search/${pkg.name.replace(/\s+/g, '+')}+${(op.cities_covered?.[0] || 'Egypt').replace(/\s+/g, '+')}+Egypt`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-bold text-accent hover:underline shrink-0">
                    Check price →
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-1">
                  <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{pkg.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{pkg.min_group}–{pkg.max_group} people</span>
                </div>
                <p className="text-[10px] text-muted-foreground bg-card rounded-lg px-2 py-1.5">✅ Included: {pkg.included}</p>
              </div>
            ))}
          </div>
        )}

        {/* Refund policy */}
        {op.refund_policy && (
          <div className="bg-secondary/40 rounded-xl px-3 py-2 mb-3">
            <p className="text-[10px] text-muted-foreground"><strong className="text-foreground">Refund policy:</strong> {op.refund_policy}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-2 mb-2">
          {(() => {
            const city = op.cities_covered?.[0] || 'Egypt';
            const viatorUrl = `https://www.viator.com/search/${op.company_name.replace(/\s+/g, '+')}+${city.replace(/\s+/g, '+')}+Egypt`;
            const gygUrl = `https://www.getyourguide.com/s/?q=${encodeURIComponent(op.company_name + ' ' + city + ' Egypt')}`;
            const musementSlug = city.toLowerCase().replace(/\s+/g, '-');
            return (
              <>
                <button onClick={() => window.open(viatorUrl, '_blank')} className="w-full flex items-center justify-center bg-[#29C766] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Book on Viator →</button>
                <button onClick={() => window.open(gygUrl, '_blank')} className="w-full flex items-center justify-center bg-[#FF5533] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Book on GetYourGuide →</button>
                <button onClick={() => window.open(`https://www.musement.com/us/egypt/${musementSlug}/`, '_blank')} className="w-full flex items-center justify-center bg-[#5B2D8E] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Book on Musement →</button>
              </>
            );
          })()}
        </div>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(op.company_name + ' Egypt')}`}
          target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-xs font-bold hover:bg-secondary transition-colors">
          Find on Google Maps →
        </a>
      </div>

    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TourOperators() {
  const { lang } = useOutletContext();
  const [cityFilter, setCityFilter] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showMatcher, setShowMatcher] = useState(false);

  useSEO({
    title: 'Verified Tour Operators & Custom Travel Packages in Egypt — Licensed & Trusted',
    description: 'Find and book verified, licensed Egyptian tour operators in Hurghada, Sharm El Sheikh, Luxor, Aswan and El Gouna. Fixed prices, tourist reviews, smart matching. 7% commission to Locali Egypt.',
  });

  const { data: dbOperators = [] } = useQuery({
    queryKey: ['operators', cityFilter],
    queryFn: () => base44.entities.TourOperator.filter({ status: 'approved', is_verified: true }),
  });

  const allOperators = [...SAMPLE_OPERATORS, ...dbOperators];
  const filtered = cityFilter
    ? allOperators.filter(op => op.cities_covered?.some(c => c.toLowerCase().includes(cityFilter.toLowerCase())))
    : allOperators;

  const CITIES = ['Hurghada', 'Sharm El Sheikh', 'Luxor', 'Aswan', 'El Gouna'];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-6 h-6 text-accent" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Tour Operators</h1>
          </div>
          <p className="text-sm text-muted-foreground">Verified, licensed operators · Fixed prices · 7% commission to platform · Admin-approved listings only</p>
        </div>
        <button onClick={() => setShowRegister(true)}
          className="shrink-0 flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
          <Plus className="w-3.5 h-3.5" /> Register Company
        </button>
      </div>

      {/* Smart matcher CTA */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-sm mb-0.5">Not sure which operator to pick?</p>
            <p className="text-xs text-muted-foreground">Answer 3 quick questions — we'll match you with your top 3 operators.</p>
          </div>
          <button onClick={() => setShowMatcher(true)}
            className="shrink-0 flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold">
            <Sliders className="w-3.5 h-3.5" /> Smart Match
          </button>
        </div>
      </div>

      {/* Verification info */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-6 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <strong className="text-foreground">Verification process:</strong> Every operator submits their Ministry of Tourism license. We verify before approval. Prices are locked at submission. Tourist reviews cannot be deleted. Operators below 3.5 rating are suspended automatically.
        </div>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        <button onClick={() => setCityFilter('')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!cityFilter ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
          🌍 All Cities
        </button>
        {CITIES.map(c => (
          <button key={c} onClick={() => setCityFilter(c)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {c}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} verified operator{filtered.length !== 1 ? 's' : ''} {cityFilter ? `in ${cityFilter}` : 'across all cities'}</p>

      {/* Operator list */}
      <div className="space-y-4">
        {filtered.map((op, i) => <OperatorCard key={op.id || i} op={op} />)}
      </div>

      <div className="mt-8 bg-secondary/50 rounded-2xl p-4 text-center text-xs text-muted-foreground">
        Are you a licensed tour operator?{' '}
        <button onClick={() => setShowRegister(true)} className="text-accent font-bold underline underline-offset-2">
          Register your company →
        </button>
      </div>

      {showRegister && <RegistrationForm onClose={() => setShowRegister(false)} />}
      {showMatcher && <SmartMatcher operators={allOperators} onClose={() => setShowMatcher(false)} />}
    </div>
  );
}