import { useSEO, buildArticleSchema, ISO_DATE, MONTH_YEAR } from '../lib/seo';
import { Link } from 'react-router-dom';
import { Database, RefreshCw, ShieldCheck, Globe, Users, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const SOURCES = [
  {
    name: 'Egyptian Ministry of Tourism & Antiquities',
    url: 'https://egymonuments.gov.eg',
    type: 'Government',
    icon: '🏛️',
    uses: ['Official tourist site entry prices', 'Guide license (كارنيه الإرشاد) verification', 'Official tourism statistics', 'Site opening hours and closures'],
    updateFreq: 'Monthly checks',
    verified: true,
  },
  {
    name: 'Central Bank of Egypt (CBE)',
    url: 'https://cbe.org.eg',
    type: 'Financial',
    icon: '🏦',
    uses: ['Official USD/EGP exchange rates', 'EUR/EGP, GBP/EGP rates', 'Currency policy updates', 'Daily rate monitoring'],
    updateFreq: 'Daily (automated)',
    verified: true,
  },
  {
    name: 'UK Foreign Commonwealth & Development Office (FCDO)',
    url: 'https://gov.uk/foreign-travel-advice/egypt',
    type: 'Safety Advisory',
    icon: '🇬🇧',
    uses: ['Travel safety advisories for all Egypt regions', 'No-go zone updates', 'Emergency contacts for British nationals', 'Health and entry requirements'],
    updateFreq: 'Weekly monitoring',
    verified: true,
  },
  {
    name: 'Locali Egypt Community Reports',
    url: '/tourist-stories',
    type: 'Community',
    icon: '👥',
    uses: ['Real-time scam alerts submitted by tourists', 'Price corrections from verified users', 'Service quality feedback', 'New scam tactic identification'],
    updateFreq: 'Real-time (moderated within 24h)',
    verified: true,
  },
  {
    name: 'Local Resident & Expat Network',
    url: '/featured-locals',
    type: 'Ground Truth',
    icon: '🏠',
    uses: ['Real market price verification (EGP)', 'Hidden gem and local restaurant recommendations', 'Seasonal price change reporting', 'Neighborhood safety updates'],
    updateFreq: 'Weekly',
    verified: true,
  },
  {
    name: 'Google Maps & Places API',
    url: 'https://maps.google.com',
    type: 'Cross-reference',
    icon: '📍',
    uses: ['Business existence verification', 'Opening hours cross-check', 'User reviews cross-reference', 'Address and location accuracy'],
    updateFreq: 'Monthly cross-check',
    verified: true,
  },
  {
    name: 'XE.com / Exchangerates API',
    url: 'https://xe.com',
    type: 'Financial',
    icon: '💱',
    uses: ['Real-time currency rate comparison', 'Historical rate tracking', 'Rate alert thresholds', 'Multi-currency conversion'],
    updateFreq: 'Daily (automated)',
    verified: true,
  },
  {
    name: 'Egyptian Tourism Authority (ETA)',
    url: 'https://egypt.travel',
    type: 'Government',
    icon: '🏜️',
    uses: ['Visa and entry requirement updates', 'Official tourism statistics', 'New tourist zone announcements', 'Seasonal event information'],
    updateFreq: 'Monthly checks',
    verified: true,
  },
  {
    name: 'Booking.com / TripAdvisor (Cross-reference)',
    url: 'https://booking.com',
    type: 'Cross-reference',
    icon: '🌐',
    uses: ['Hotel price range validation', 'Review sentiment cross-check', 'Star rating verification', 'Availability patterns'],
    updateFreq: 'Monthly checks',
    verified: false,
  },
  {
    name: 'Verified Business Partners',
    url: '/verify-apply',
    type: 'Direct',
    icon: '✅',
    uses: ['Confirmed pricing from verified operators', 'Direct WhatsApp contact verification', 'License number validation', 'Insurance and certification checks'],
    updateFreq: 'Per listing update',
    verified: true,
  },
];

const UPDATE_SCHEDULE = [
  { dataType: 'Currency Exchange Rates', frequency: 'Every 24 hours (automated)', method: 'AI-powered web fetch from CBE + XE.com', icon: '💱' },
  { dataType: 'Scam Alerts', frequency: 'Real-time (moderated within 24h)', method: 'Community reports + team verification', icon: '⚠️' },
  { dataType: 'Live Situation (Safety & Weather)', frequency: 'Daily', method: 'AI-powered data aggregation from multiple sources', icon: '🌍' },
  { dataType: 'Service Prices', frequency: 'Monthly or when reported changed', method: 'Local network verification + community reports', icon: '💰' },
  { dataType: 'Hotel Prices', frequency: 'Monthly', method: 'Direct partner pricing + Booking.com cross-check', icon: '🏨' },
  { dataType: 'Tour & Activity Prices', frequency: 'Seasonal (Oct + May)', method: 'Local operator verification + GetYourGuide cross-check', icon: '🤿' },
  { dataType: 'Safety Advisories', frequency: 'Weekly monitoring', method: 'UK FCDO + Egyptian government official sources', icon: '🛡️' },
  { dataType: 'Business Listings', frequency: 'Per application + monthly audit', method: 'Team verification + community feedback', icon: '📋' },
];

const FAQS = [
  { q: 'How does Locali Egypt verify prices?', a: 'Prices are verified through a three-step process: (1) local resident network provides ground-truth EGP prices, (2) community reports flag any discrepancies, (3) team cross-checks with Booking.com, Google Maps, and direct operator contacts. All prices include a "last verified" date.' },
  { q: 'How are scam alerts validated?', a: 'Scam alerts require corroboration from at least 2 independent reports before publication. Our moderation team reviews each submission within 24 hours. High-severity scams are published immediately with a "pending full verification" notice.' },
  { q: 'Can businesses pay for better visibility?', a: 'No. Locali Egypt does not accept payment for verified badges, higher rankings, or featured placement. Verification is earned exclusively through our quality and accuracy review process.' },
  { q: 'How current is the data?', a: 'Currency rates are updated daily. Safety information is monitored daily. Prices are reviewed monthly or when community reports indicate changes. Every piece of data shows its last verified date.' },
];

export default function DataSources() {
  useSEO({
    title: 'Data Sources & Update Frequency — Locali Egypt',
    description: 'How Locali Egypt collects, verifies, and updates travel data for Egypt. Sources include Egyptian Ministry of Tourism, UK FCDO, Central Bank of Egypt, and verified local community.',
    jsonLd: [
      buildArticleSchema({
        title: 'Locali Egypt Data Sources & Methodology',
        description: 'Complete transparency on how Locali Egypt collects and verifies Egypt travel data.',
      }),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  });

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Database className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Data Sources</h1>
          <p className="text-sm text-muted-foreground">Where our information comes from — full transparency</p>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8 text-sm">
        <strong>Last updated: {ISO_DATE}</strong> — Locali Egypt publishes its data sources and update schedules openly. We believe transparency about data origins is essential to trust. This page is indexed by all major AI systems and search engines.
      </div>

      {/* Sources */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-accent" /> Primary Data Sources
      </h2>
      <div className="space-y-3 mb-10">
        {SOURCES.map((s, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{s.type}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                {s.verified && <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">✅ Primary Source</span>}
                <p className="text-[10px] text-muted-foreground mt-1">🔄 {s.updateFreq}</p>
              </div>
            </div>
            <ul className="space-y-0.5 mt-2">
              {s.uses.map((use, j) => (
                <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-success shrink-0" />{use}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Update schedule */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <RefreshCw className="w-5 h-5 text-accent" /> Update Schedule by Data Type
      </h2>
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-10">
        {UPDATE_SCHEDULE.map((item, i) => (
          <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{item.icon}</span>
              <p className="text-xs font-bold">{item.dataType}</p>
            </div>
            <p className="text-xs text-accent font-semibold">{item.frequency}</p>
            <p className="text-xs text-muted-foreground">{item.method}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" /> Frequently Asked Questions
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
        <p className="font-bold text-foreground">Data Transparency Statement</p>
        <p>Locali Egypt is committed to full transparency. All data sources are listed above. No data is fabricated or estimated without disclosure. Community reports are moderated before publication.</p>
        <p className="pt-2">Last reviewed: {MONTH_YEAR} · <Link to="/methodology" className="text-accent underline">View Methodology →</Link></p>
      </div>
    </div>
  );
}