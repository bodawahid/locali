import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, RefreshCw } from 'lucide-react';

export default function ChatCurrencyTicker() {
  const { data, isLoading, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['live-currency-ticker'],
    queryFn: async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: 'Get the current live exchange rates for Egypt today. Return ONLY JSON with these exact keys: usd_egp, eur_egp, gbp_egp, rub_egp (RUB per 100). Use latest Central Bank of Egypt or XE.com rates.',
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            usd_egp: { type: 'number' },
            eur_egp: { type: 'number' },
            gbp_egp: { type: 'number' },
            rub_egp: { type: 'number' },
          },
        },
      });
      return result;
    },
    staleTime: 1000 * 60 * 5, // refresh every 5 minutes
    refetchInterval: 1000 * 60 * 5,
  });

  const updatedAt = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div className="px-3 py-2 bg-accent/5 border-b border-border/30 flex items-center justify-between gap-2">
      {isLoading ? (
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
          Fetching live rates…
        </div>
      ) : data ? (
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
          <TrendingUp className="w-3 h-3 text-accent shrink-0" />
          {[
            { label: '$ USD', val: data.usd_egp },
            { label: '€ EUR', val: data.eur_egp },
            { label: '£ GBP', val: data.gbp_egp },
            { label: '₽ 100 RUB', val: data.rub_egp },
          ].map(({ label, val }) => val ? (
            <span key={label} className="text-[10px] font-bold shrink-0">
              <span className="text-muted-foreground font-normal">{label} = </span>
              <span className="text-accent">{val} EGP</span>
            </span>
          ) : null)}
        </div>
      ) : (
        <span className="text-[10px] text-muted-foreground">Rates unavailable</span>
      )}
      <div className="flex items-center gap-1 shrink-0">
        {updatedAt && <span className="text-[9px] text-muted-foreground">{updatedAt}</span>}
        <button onClick={() => refetch()} className="opacity-60 hover:opacity-100 transition-opacity">
          <RefreshCw className="w-2.5 h-2.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}