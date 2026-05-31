import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Fallback rates (updated April 2026)
export const FALLBACK_RATES = {
  usd: 53.37, eur: 62.56, gbp: 71.96,
  rub: 0.681, pln: 14.64, cad: 38.60,
  aud: 37.81, sar: 14.22,
};

/**
 * Returns the latest currency rates from the database (updated daily by automation).
 * Falls back to hardcoded rates if DB is empty.
 */
export function useLiveRates() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['live-rates-db'],
    queryFn: async () => {
      const records = await base44.entities.CurrencyRate.list('-created_date', 1);
      return records?.[0] || null;
    },
    staleTime: 1000 * 60 * 30, // re-read DB every 30 min
    refetchInterval: 1000 * 60 * 30,
  });

  const rates = data
    ? {
        usd: data.usd, eur: data.eur, gbp: data.gbp,
        rub: data.rub, pln: data.pln, cad: data.cad,
        aud: data.aud, sar: data.sar,
      }
    : FALLBACK_RATES;

  return {
    rates,
    isLoading,
    refetch,
    rateDate: data?.rate_date || null,
    alert: data?.alert || null,
    changeUsd: data?.change_usd || 0,
    source: data?.source || 'Fallback rates',
  };
}

/** Converts an EGP amount to a foreign currency string */
export function egpTo(amountEgp, currency, rates) {
  const rate = rates?.[currency.toLowerCase()];
  if (!rate || !amountEgp) return null;
  return (amountEgp / rate).toFixed(2);
}