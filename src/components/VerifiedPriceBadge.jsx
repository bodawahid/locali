import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import LiveTrustBadge from './LiveTrustBadge';

/**
 * Reusable component to display a verified price range from the PriceEntry system.
 * Usage: <VerifiedPriceBadge category="taxi" city="hurghada" titleMatch="short" />
 */
export default function VerifiedPriceBadge({ category, city, titleMatch, className = '' }) {
  const { data: entries = [] } = useQuery({
    queryKey: ['priceEntries', category, city],
    queryFn: () => base44.entities.PriceEntry.filter(
      { category, city, is_active: true },
      '-last_verified_date',
      10
    ),
    staleTime: 10 * 60 * 1000,
  });

  const entry = entries.find(e =>
    !titleMatch || e.title?.toLowerCase().includes(titleMatch.toLowerCase())
  ) || entries[0];

  if (!entry) return null;

  const daysAgo = entry.last_verified_date
    ? Math.floor((Date.now() - new Date(entry.last_verified_date)) / 86400000)
    : null;

  const isStale = daysAgo !== null && daysAgo > 30;

  return (
    <div className={`bg-card border rounded-2xl p-4 ${
      entry.alert_type === 'scam_risk' ? 'border-red-300 bg-red-50' :
      entry.alert_type === 'price_increased' ? 'border-amber-300 bg-amber-50' :
      'border-border'
    } ${className}`}>
      {/* Alert badge */}
      {entry.alert_type === 'scam_risk' && (
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span className="text-[11px] font-extrabold text-red-600 uppercase tracking-wide">Tourist Scam Risk</span>
        </div>
      )}
      {entry.alert_type === 'price_increased' && (
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wide">Price Recently Increased</span>
        </div>
      )}

      <p className="text-xs font-bold text-muted-foreground mb-1">{entry.title}</p>
      <p className="text-2xl font-black text-foreground">
        {entry.min_price} – {entry.max_price}
        <span className="text-sm font-semibold text-muted-foreground ml-1">{entry.currency}</span>
      </p>

      {entry.notes && (
        <p className="text-xs text-muted-foreground mt-1 italic">"{entry.notes}"</p>
      )}

      <div className="mt-2 pt-2 border-t border-border/50">
        <LiveTrustBadge lastUpdated={entry.last_verified_date} reportCount={120} />
      </div>
    </div>
  );
}