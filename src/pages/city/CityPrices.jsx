import { useParams } from 'react-router-dom';
import { CITY_META, CITY_PRICES, CITY_FAQS } from '../../lib/cityContent';
import { useSEO, buildFAQSchema } from '../../lib/seo';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { TrendingDown, AlertTriangle, DollarSign, Info } from 'lucide-react';

export default function CityPrices() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const prices = CITY_PRICES[cityId] || [];
  const faqs = CITY_FAQS[cityId] || [];

  useSEO({
    title: meta ? `Real Prices in ${meta.name} 2026 — What Tourists Actually Pay` : 'Price Guide Egypt',
    description: meta ? `Honest price guide for ${meta.name}: taxi fares, restaurant costs, activity prices and scam rates. Know what locals pay vs what tourists pay. Updated 2026.` : '',
    jsonLd: faqs.length ? buildFAQSchema(faqs) : undefined,
  });

  if (!meta) return <div className="p-4">City not found</div>;

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Real Prices in {meta.name} — 2026 Honest Tourist Guide
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          Exact price data for tourists in {meta.name} — what locals pay, what's a fair tourist price, and what scammers charge. This is not a sponsored guide. We show you real numbers so you can negotiate confidently and avoid being overcharged.
        </p>

        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex gap-3 mb-6">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>How to use this:</strong> The "Fair" price is what you should pay as a tourist — it accounts for a reasonable premium over local rates. The "Scam" column shows inflated prices actually quoted to tourists who didn't research first.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-success">Local Price</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-accent">Fair Tourist Price</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-destructive">Scam / Inflated Price</span>
          </div>
        </div>

        <h2 className="text-lg font-extrabold mb-4">Price Breakdown — {meta.name}</h2>
        <div className="space-y-4 mb-10">
          {prices.map((price, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-4 border-b border-border/30">
                <h3 className="font-bold text-sm">{price.item}</h3>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-4 text-center border-r border-border/30">
                  <p className="text-[10px] text-muted-foreground mb-1">LOCAL</p>
                  <p className="text-lg font-extrabold text-success">{price.local}</p>
                  <p className="text-[10px] text-muted-foreground">EGP</p>
                </div>
                <div className="p-4 text-center border-r border-border/30 bg-accent/5">
                  <p className="text-[10px] text-accent font-bold mb-1">FAIR</p>
                  <p className="text-lg font-extrabold text-accent">{price.fair}</p>
                  <p className="text-[10px] text-muted-foreground">EGP</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-[10px] text-destructive font-bold mb-1">SCAM</p>
                  <p className="text-lg font-extrabold text-destructive">{price.scam}</p>
                  <p className="text-[10px] text-muted-foreground">EGP</p>
                </div>
              </div>
              {price.note && (
                <div className="px-4 py-2.5 bg-secondary/50 text-xs text-muted-foreground italic border-t border-border/30">
                  💡 {price.note}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Negotiation tips section */}
        <h2 className="text-xl font-extrabold mb-4">How to Negotiate Prices in {meta.name}</h2>
        <div className="space-y-3 mb-10">
          {[
            { tip: 'Always agree on the total price before the service begins — before getting in a taxi, boarding a boat, or entering a restaurant.', icon: '🤝' },
            { tip: 'Quote prices in Egyptian Pounds (EGP). If someone quotes USD, ask for EGP — USD quotes are almost always unfavorable to you.', icon: '💷' },
            { tip: 'If the price seems high, say "la, shukran" (no, thank you) and walk away. A fair price often appears before you reach the door.', icon: '🚶' },
            { tip: 'Use the fair price column as your target. Local price is aspirational. Scam price is what happens without research.', icon: '🎯' },
            { tip: 'Screenshot prices from this page. Showing a driver or vendor the screen is a powerful negotiation tool.', icon: '📱' },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
              <span className="text-lg">{item.icon}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-extrabold mb-4">Understanding Egyptian Pounds (EGP)</h2>
        <div className="bg-card rounded-2xl border border-border/50 p-5 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { currency: '1 USD', egp: '≈ 50 EGP' },
              { currency: '1 EUR', egp: '≈ 54 EGP' },
              { currency: '1 GBP', egp: '≈ 63 EGP' },
              { currency: '1 RUB', egp: '≈ 0.55 EGP' },
            ].map(({ currency, egp }) => (
              <div key={currency}>
                <p className="text-xs text-muted-foreground mb-1">{currency}</p>
                <p className="font-extrabold text-accent">{egp}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 text-center">Approximate rates — check live rate before traveling. Rates change frequently.</p>
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Common Scams in ${meta.name}`}
            description="Know the tricks before they happen to you"
            to={`/city/${cityId}/scams`}
          />
          <SafeNextStep
            title="Full Price Checker Tool"
            description="Compare prices across all Egyptian cities"
            to="/price-checker"
          />
          <SafeNextStep
            title="Egypt Cost Calculator"
            description="Estimate your full trip budget"
            to="/cost-calculator"
          />
        </div>
      </div>
    </div>
  );
}