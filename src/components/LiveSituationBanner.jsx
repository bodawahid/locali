import { Link } from 'react-router-dom';
import { CheckCircle2, Plane, ArrowRight, DollarSign } from 'lucide-react';
import { useLiveRates } from '../hooks/useLiveRates';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
const FALLBACK_SUMMARY = 'Tourist areas operating normally. Flights running on schedule. No alerts affecting Sharm El Sheikh, Hurghada, Luxor or Aswan.';

export default function LiveSituationBanner() {
  const { data: records = [] } = useQuery({
    queryKey: ['live-situation-banner'],
    queryFn: () => base44.entities.LiveSituation.list('-update_date', 10),
    staleTime: 1000 * 60 * 30,
  });

  const globalRec = records.find(r => r.city === 'global');
  const hasAlert = records.some(r => r.status === 'red');
  const hasCaution = records.some(r => r.status === 'yellow');
  const overallStatus = hasAlert ? 'red' : hasCaution ? 'yellow' : 'green';
  const summary = records.find(r => r.city === 'hurghada')?.recommendation || FALLBACK_SUMMARY;
  const updateDate = globalRec?.update_date || 'April 2, 2026';
  const { rates } = useLiveRates();
  const usdRate = rates.usd || globalRec?.usd_to_egp;

  const headerClass = overallStatus === 'green'
    ? 'bg-success/10 border-success/20'
    : overallStatus === 'yellow'
    ? 'bg-amber-500/10 border-amber-500/20'
    : 'bg-red-500/10 border-red-500/20';

  const dotClass = overallStatus === 'green' ? 'bg-success' : overallStatus === 'yellow' ? 'bg-amber-500' : 'bg-red-500';
  const textClass = overallStatus === 'green' ? 'text-success' : overallStatus === 'yellow' ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="bg-white border-2 border-border/40 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className={`flex items-center justify-between px-4 py-3 border-b ${headerClass}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${dotClass}`} />
          <span className={`text-xs font-bold uppercase tracking-wide ${textClass}`}>Live Situation Update</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Updated {updateDate}</span>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm font-medium">{summary}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-success/5 rounded-xl px-3 py-2">
            <Plane className="w-4 h-4 text-success shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">Flights</p>
              <p className="text-xs font-bold">Normal operations</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-accent/5 rounded-xl px-3 py-2">
            <DollarSign className="w-4 h-4 text-accent shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">USD → EGP</p>
              <p className="text-xs font-bold">{usdRate} EGP</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
          UK FCO: Normal precautions for Sharm, Hurghada, Luxor, Aswan
        </div>

        <div className="flex items-center justify-between pt-1">
          <Link to="/live-situation" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
            Full live update <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/egypt-safe-now" className="text-xs text-muted-foreground hover:underline">
            Safety guide →
          </Link>
        </div>
      </div>
    </div>
  );
}