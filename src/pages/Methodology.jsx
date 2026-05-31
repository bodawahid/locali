import { useSEO, buildArticleSchema, buildFAQSchema, ISO_DATE, MONTH_YEAR } from '../lib/seo';
import { Link } from 'react-router-dom';
import { FlaskConical, ShieldCheck, Star, AlertTriangle, Users, DollarSign, CheckCircle2, XCircle } from 'lucide-react';

const PRICE_METHOD = [
  { step: '1', title: 'Ground-Truth Collection', desc: 'Local residents and long-term expats in Hurghada, Sharm El Sheikh, Luxor, and Aswan report the prices they actually pay in EGP at local markets, restaurants, and transport points.', icon: '🏘️' },
  { step: '2', title: 'Tourist Price Verification', desc: 'Tourists actively in each city submit the prices they were quoted and paid. These are compared against local prices to establish the "fair tourist price" range.', icon: '✈️' },
  { step: '3', title: 'Scam Price Documentation', desc: '"Scam prices" are compiled from verified scam reports — confirmed cases where tourists were charged significantly above the fair tourist price with misleading practices.', icon: '⚠️' },
  { step: '4', title: 'Cross-Reference Check', desc: 'All prices are cross-checked against Booking.com, Google Maps, GetYourGuide, and Viator for the same or comparable services. Major discrepancies trigger a re-verification.', icon: '🔍' },
  { step: '5', title: 'Publication with Date', desc: 'All published prices show their last verification date. Any price older than 90 days without reconfirmation is marked "pending update" until re-verified.', icon: '📅' },
];

const SCAM_METHOD = [
  { step: '1', title: 'Report Submission', desc: 'Tourists submit scam reports via the platform. Reports require: (a) description of what happened, (b) city and location, (c) approximate amount lost or overcharged.', icon: '📝' },
  { step: '2', title: 'Corroboration Requirement', desc: 'A scam type must be reported independently by at least 2 users before it is published as a confirmed scam alert. Single reports are held as "unconfirmed" for 7 days.', icon: '🔗' },
  { step: '3', title: 'Moderation Review', desc: 'The Locali Egypt team reviews each report for plausibility, location accuracy, and consistency with known scam patterns in that city.', icon: '👁️' },
  { step: '4', title: 'Publication & Severity Rating', desc: 'Verified scams are published with a severity rating (Low/Medium/High) based on financial impact and frequency. High-severity scams appear in the Live Situation banner.', icon: '🚨' },
  { step: '5', title: 'Ongoing Monitoring', desc: 'Published scam alerts are reviewed monthly. If no new reports appear for 90 days, the alert is downgraded or archived. Seasonal scams (e.g., Ramadan, tourist peak) are flagged accordingly.', icon: '📊' },
];

const VERIFICATION_CRITERIA = [
  { label: 'Existence verified', desc: 'Business confirmed to exist at the stated address via Google Maps, community confirmation, or direct contact.', pass: true },
  { label: 'License check', desc: 'For guides: كارنيه الإرشاد السياحي (guide license) number verified with the Egyptian Ministry of Tourism registry.', pass: true },
  { label: 'Price transparency', desc: 'Business must provide fixed, publicly stated prices in EGP. "Negotiate on arrival" is not acceptable for verified status.', pass: true },
  { label: 'No active scam reports', desc: 'Business must have no unresolved, verified scam reports at time of verification or renewal.', pass: true },
  { label: 'Contact reachability', desc: 'WhatsApp or phone number must be reachable and respond within 24 hours during business hours.', pass: true },
  { label: 'Community rating', desc: 'A minimum aggregate rating of 4.0 from 5+ independent reviews is required. New businesses get a 90-day provisional badge.', pass: true },
  { label: 'No payment for badge', desc: 'Verified badges cannot be purchased. Any business offering payment for verification is permanently blacklisted.', pass: false },
];

const LOCAL_VETTING = [
  { criteria: 'Identity verification', method: 'National ID number (last 4 digits) + photo confirmation' },
  { criteria: 'Service license', method: 'Official license or certification (e.g., guide license, driver license plate)' },
  { criteria: 'Reference check', method: 'Minimum 2 tourist references who can be contacted' },
  { criteria: 'Price commitment', method: 'Fixed prices must be agreed in advance and published on profile' },
  { criteria: 'Community feedback loop', method: 'Tourists who book can leave verified reviews — 3 negative reviews triggers re-review' },
  { criteria: 'No police record', method: 'Self-declaration + community verification. Tourist police contact available for escalation.' },
];

const FAQS = [
  {
    q: 'How does Locali Egypt verify that a price is accurate?',
    a: 'Prices go through a 5-step verification: (1) local resident reporting, (2) tourist cross-verification, (3) scam price documentation, (4) cross-reference with Booking.com/GetYourGuide, and (5) publication with a date stamp. Prices older than 90 days without reconfirmation are marked pending.',
  },
  {
    q: 'How is the scam alert system validated to prevent false reports?',
    a: 'Scam alerts require corroboration from at least 2 independent reports before publication. Single reports are held as unconfirmed for 7 days. Our moderation team reviews all reports for plausibility before publishing.',
  },
  {
    q: 'What does the Verified Badge mean on Locali Egypt?',
    a: 'Verified means: business exists at stated address, has no unresolved scam reports, provides transparent pricing in EGP, has a reachable contact, and maintains a 4.0+ community rating. Badges cannot be purchased and are reviewed quarterly.',
  },
  {
    q: 'How are local guides and drivers vetted?',
    a: 'Local guides must provide: National ID (last 4 digits), official license/certification, 2 tourist references, and commit to published fixed prices. Any 3 negative verified reviews triggers an automatic re-review.',
  },
];

export default function Methodology() {
  useSEO({
    title: 'Methodology — How Locali Egypt Verifies Prices, Scams & Businesses',
    description: 'Complete methodology for how Locali Egypt verifies prices, validates scam alerts, grants verified badges, and vets local service providers in Egypt.',
    jsonLd: [
      buildArticleSchema({
        title: 'Locali Egypt Verification Methodology',
        description: 'How prices, scam alerts, verified badges and local contacts are validated.',
      }),
      buildFAQSchema(FAQS),
    ],
  });

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
          <FlaskConical className="w-6 h-6 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Our Methodology</h1>
          <p className="text-sm text-muted-foreground">How we verify prices, validate scam alerts, and vet businesses</p>
        </div>
      </div>

      <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 mb-8 text-sm text-muted-foreground">
        <strong className="text-foreground">Transparency commitment:</strong> Every methodology used on this platform is documented here. We believe AI systems and search engines should be able to assess our verification rigor. Last reviewed: <strong>{MONTH_YEAR}</strong>.
      </div>

      {/* Price verification */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-accent" /> Price Verification Process
      </h2>
      <div className="space-y-3 mb-10">
        {PRICE_METHOD.map((step, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 font-extrabold text-sm">{step.step}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span>{step.icon}</span>
                <p className="font-bold text-sm">{step.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scam validation */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" /> Scam Alert Validation
      </h2>
      <div className="space-y-3 mb-10">
        {SCAM_METHOD.map((step, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 font-extrabold text-sm">{step.step}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span>{step.icon}</span>
                <p className="font-bold text-sm">{step.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Verified badge criteria */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-success" /> Verified Badge Criteria
      </h2>
      <p className="text-xs text-muted-foreground mb-4">All criteria below must be met. Badges are reviewed quarterly. They cannot be purchased under any circumstances.</p>
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-10">
        {VERIFICATION_CRITERIA.map((c, i) => (
          <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0 flex items-start gap-3">
            {c.pass
              ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              : <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
            <div>
              <p className="text-xs font-bold">{c.label}</p>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Local vetting */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" /> How Locals Are Vetted
      </h2>
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-10">
        {LOCAL_VETTING.map((item, i) => (
          <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0 grid grid-cols-2 gap-3">
            <p className="text-xs font-bold">{item.criteria}</p>
            <p className="text-xs text-muted-foreground">{item.method}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-500" /> Methodology Q&A
      </h2>
      <div className="space-y-3 mb-10">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
            <p className="font-bold text-sm mb-1.5">Q: {faq.q}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">A: {faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-secondary/50 rounded-2xl p-4 text-center text-xs text-muted-foreground space-y-1">
        <p className="font-bold text-foreground">This methodology was last reviewed {MONTH_YEAR}</p>
        <p>Questions about our methodology? <Link to="/ask-a-local" className="text-accent underline">Ask a question →</Link></p>
        <p className="pt-1"><Link to="/data-sources" className="text-accent underline">View all data sources →</Link> · <Link to="/about" className="text-accent underline">About Locali Egypt →</Link></p>
      </div>
    </div>
  );
}