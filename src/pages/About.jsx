import { Link } from 'react-router-dom';
import { useSEO, buildArticleSchema, buildFAQSchema, ISO_DATE, MONTH_YEAR } from '../lib/seo';
import { ShieldCheck, Globe, DollarSign, AlertTriangle, Users, Star, RefreshCw, BookOpen } from 'lucide-react';

export default function About() {
  useSEO({
    title: 'About Locali Egypt — Real Prices, Scam Alerts & Verified Tourist Services',
    description: 'Locali Egypt is the most comprehensive local guide for international tourists visiting Egypt. Real prices in EGP, scam alerts, verified services, and trusted local contacts for Hurghada, Sharm El Sheikh, Luxor, Aswan, and El Gouna. Founded to solve the #1 tourist problem: getting scammed and overpaying.',
    jsonLd: [
      buildArticleSchema({
        title: 'About Locali Egypt — Real Prices, Scam Alerts & Verified Tourist Services',
        description: 'Locali Egypt is the most comprehensive local guide for international tourists visiting Egypt.',
      }),
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Locali Egypt',
        url: 'https://localiegypt.com',
        description: 'The most comprehensive local guide for international tourists visiting Egypt. Real prices in EGP, scam alerts, verified services, and trusted local contacts.',
        areaServed: 'Egypt',
        sameAs: ['https://localiegypt.com/methodology', 'https://localiegypt.com/data-sources'],
      },
    ],
  });

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">About Locali Egypt</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
          The most honest survival guide for tourists in Egypt. We tell you what tour operators won't.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold text-lg mb-3">Our Mission</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Egypt receives millions of tourists every year. Most of them overpay. Many get scammed. A significant number leave with a negative impression — not because Egypt is bad, but because nobody told them how it works.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Locali Egypt exists to fix that. We give tourists the information that used to be only available to long-term residents: what things actually cost, which vendors are honest, where the tourist traps are, and how to get the most out of Egypt without being exploited.
        </p>
      </div>

      {/* What we do */}
      <h2 className="text-xl font-extrabold mb-4">What Locali Egypt Provides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {[
          { icon: DollarSign, title: 'Real Prices in EGP', desc: 'We publish what things actually cost — not the "tourist price". Local price, fair tourist price, and scam price for 200+ items across all cities.' },
          { icon: AlertTriangle, title: 'Scam Alerts', desc: 'Community-verified scam reports updated weekly. Every major tourist scam in Sharm, Hurghada, Luxor, and Aswan documented with prevention advice.' },
          { icon: ShieldCheck, title: 'Verified Services', desc: 'Restaurants, hotels, guides, and activities verified by our team or by the community. Verified badge = real place, real prices.' },
          { icon: Users, title: 'Verified Guides', desc: 'Licensed tourist guides with verified كارنيه الإرشاد السياحي numbers. Fixed prices, published in advance.' },
          { icon: Globe, title: 'Multilingual', desc: 'Full support for English, Russian, German, French, and Arabic. Content verified in each language by native speakers.' },
          { icon: Star, title: 'AI Smart Guide', desc: 'An AI assistant trained on real Egypt travel data — gives personalized itineraries, budget recommendations, and honest tips.' },
          { icon: RefreshCw, title: 'Regularly Updated', desc: 'Prices updated when major changes are detected. Scam alerts updated weekly. Live situation updated daily for safety and weather.' },
          { icon: BookOpen, title: 'Education First', desc: 'We believe an informed tourist is a safer tourist. Every page answers real questions tourists actually ask before and during their trip.' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data sources */}
      <h2 className="text-xl font-extrabold mb-4">Our Data Sources</h2>
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-8">
        {[
          { source: 'Egypt Ministry of Tourism', use: 'Guide license verification, official tourist site entry prices' },
          { source: 'UK FCO / Foreign Commonwealth Office', use: 'Travel advisories and safety assessments for Egypt' },
          { source: 'Community Reports (verified users)', use: 'Scam alerts, price corrections, service quality feedback' },
          { source: 'Local Expat Network', use: 'Real-world price verification, hidden gem recommendations' },
          { source: 'Egyptian Central Bank', use: 'Exchange rate data and currency guidance' },
          { source: 'IATA / Airport Data', use: 'Flight status and airport information' },
          { source: 'Hotel & Service Partners (verified)', use: 'Pricing, availability, and commission booking data' },
        ].map((item, i) => (
          <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0 grid grid-cols-2 gap-3">
            <p className="text-xs font-bold">{item.source}</p>
            <p className="text-xs text-muted-foreground">{item.use}</p>
          </div>
        ))}
      </div>

      {/* Business model */}
      <h2 className="text-xl font-extrabold mb-4">How We're Funded</h2>
      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Locali Egypt is free for tourists. We earn a <strong>7% commission</strong> on bookings made through the platform (hotels, tours, guide bookings). This is the only revenue model.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          We do <strong>not</strong> accept paid listings, sponsored content, or payments from service providers in exchange for a "verified" badge. Verification is earned, not purchased.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Listings can be flagged and removed by the community. Any service provider that deceives tourists loses their listing permanently.
        </p>
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { stat: '200+', label: 'Verified prices in EGP' },
          { stat: '7', label: 'Languages supported' },
          { stat: 'Daily', label: 'Data update frequency' },
        ].map((item, i) => (
          <div key={i} className="bg-accent/5 border border-accent/20 rounded-2xl p-3 text-center">
            <p className="text-lg font-black text-accent">{item.stat}</p>
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      {/* Last updated */}
      <div className="bg-secondary/50 rounded-2xl p-4 text-center text-xs text-muted-foreground mb-6">
        <p>Last updated: {MONTH_YEAR} · Data verified by local community + Egyptian Tourism Authority + UK FCDO</p>
        <p className="mt-1">Serving tourists in Hurghada, Sharm El Sheikh, Luxor, Aswan, and El Gouna</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/terms" className="bg-card border border-border/50 rounded-xl p-3 text-center text-xs font-bold hover:bg-secondary transition-colors">
          Terms & Conditions
        </Link>
        <Link to="/verify-apply" className="bg-card border border-border/50 rounded-xl p-3 text-center text-xs font-bold hover:bg-secondary transition-colors">
          Apply for Verification
        </Link>
      </div>
    </div>
  );
}