import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { t } from '../lib/constants';

const STATUS_COLOR = { green: 'bg-emerald-500', yellow: 'bg-amber-400', red: 'bg-red-500' };
const STATUS_LABEL = { green: 'Safe to visit', yellow: 'Some caution', red: 'Check alerts' };
const STATUS_TEXT_COLOR = { green: 'text-emerald-600', yellow: 'text-amber-600', red: 'text-red-600' };

export default function CityLivePanel({ cityId, lang = 'en' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['liveCity', cityId],
    queryFn: () => base44.entities.LiveSituation.filter({ city: cityId }, '-updated_date', 1),
    staleTime: 5 * 60 * 1000,
    enabled: !!cityId,
  });

  const info = data?.[0];

  const noData = !isLoading && !info;

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 animate-pulse">
        <div className="flex gap-2 mb-3">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-24" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0,1,2].map(i => <div key={i} className="h-14 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  // Fallback chips when no data
  const chips = info ? [
    info.temperature_c != null && { icon: '🌡️', label: `${info.temperature_c}°C` },
    info.weather && { icon: '☀️', label: info.weather },
    info.traffic && { icon: '🚗', label: info.traffic },
    info.events && { icon: '👥', label: info.events },
  ].filter(Boolean) : [];

  const status = info?.status || 'green';
  const daysAgo = info?.updated_date
    ? Math.floor((Date.now() - new Date(info.updated_date).getTime()) / 86400000)
    : null;
  const updatedText = daysAgo === null ? null : daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;

  if (noData) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 text-center py-6">
        <p className="text-sm text-muted-foreground">No live updates available yet for this city.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Check back soon — we update regularly.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${STATUS_COLOR[status]}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${STATUS_COLOR[status]}`} />
          </span>
          <span className="text-[11px] font-extrabold text-emerald-600">{t('live', lang)}</span>
          {updatedText && (
            <span className="text-[10px] text-muted-foreground">· Updated {updatedText}</span>
          )}
        </div>
        <span className={`text-[10px] font-bold ${STATUS_TEXT_COLOR[status]}`}>
          {status === 'green' ? t('safe_to_visit', lang) : status === 'yellow' ? t('some_caution', lang) : t('check_alerts', lang)}
        </span>
      </div>

      {/* Chips */}
      {chips.length > 0 ? (
        <div className="flex gap-2 flex-wrap mb-3">
          {chips.map((chip, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-secondary rounded-xl px-3 py-2">
              <span className="text-sm">{chip.icon}</span>
              <span className="text-xs font-semibold text-foreground leading-none">{chip.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap mb-3">
          {[{ icon: '🌡️', label: 'N/A' }, { icon: '☀️', label: 'N/A' }, { icon: '🚗', label: 'N/A' }].map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-secondary rounded-xl px-3 py-2">
              <span className="text-sm">{c.icon}</span>
              <span className="text-xs font-semibold text-muted-foreground">—</span>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation or alert */}
      {info?.recommendation && (
        <p className="text-[11px] text-muted-foreground italic mb-3">"{info.recommendation}"</p>
      )}
      {info?.alerts && (
        <div className="flex items-start gap-1.5 bg-red-50 rounded-xl px-3 py-2 mb-3">
          <span className="text-sm shrink-0">⚠️</span>
          <p className="text-[11px] text-red-700 font-medium">{info.alerts}</p>
        </div>
      )}

      {/* CTA */}
      <Link
        to={`/city/${cityId}`}
        className="flex items-center justify-between bg-secondary rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
      >
        <span className="text-xs font-bold text-foreground">{t('check_prices', lang)}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      </Link>
    </div>
  );
}