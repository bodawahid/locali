import { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'; // تحويل للتحميل اللانهائي النظيف
import { CITIES, t, getCityName } from '../lib/constants';
import { DollarSign, Search, Zap, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';
import LiveTrustBadge from '../components/LiveTrustBadge';
import VerifiedPriceCard from '../components/VerifiedPriceCard';
import { getCachedPrice, setCachedPrice } from '../lib/priceCache';

const PRICE_CATEGORIES = ['transport', 'food', 'accommodation', 'activities', 'shopping', 'telecom', 'medical'];

const QUICK_ITEMS = [
  { item: 'Short taxi ride (5–10 min)', category: 'taxi' },
  { item: 'Bottled water 500ml', category: 'food_drinks' },
  { item: 'Restaurant meal (local)', category: 'food_drinks' },
  { id: 'sim_card', item: 'SIM card with data', category: 'telecom' },
  { item: 'Day trip snorkeling tour', category: 'activities' },
  { item: 'Hotel room (3-star)', category: 'accommodation' },
];

export default function PriceChecker() {
  const { lang } = useOutletContext();
  const queryClient = useQueryClient();
  const [selectedCity, setSelectedCity] = useState('hurghada');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [verifiedResults, setVerifiedResults] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // 1. جلب داتا دليل الأسعار بالتحميل اللانهائي مع تثبيت الـ Key لمنع الرعشة واهتزاز الكروت
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['prices_infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=price_guide&page=${pageParam}&limit=24`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to load price directory");
      const resData = await res.json();
      return Array.isArray(resData) ? resData : [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 24 ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  // 2. تجميع كل الصفحات المستلمة في مصفوفة واحدة مسطحة بأمان في الخلفية
  const prices = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flat();
  }, [data]);

  // 3. الفلترة المحلية والناعمة جداً (Client-side) لسرعة خارقة وبدون Hard Load للـ UI
  const filtered = useMemo(() => {
    return prices.filter(p => {
      // فلتر المدينة
      if (selectedCity !== 'all') {
        const pCity = String(p.city).toLowerCase().trim();
        if (pCity !== selectedCity && p.city !== 'all') return false;
      }
      // فلتر القسم
      if (selectedCategory) {
        if (String(p.category).toLowerCase().trim() !== selectedCategory) return false;
      }
      // فلتر البحث بالكلمة
      if (search) {
        const q = search.toLowerCase();
        if (!p.item?.toLowerCase().includes(q) && !p.notes?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [prices, selectedCity, selectedCategory, search]);

  // 4. مراقبة حركة السكرول لتشغيل التلقائي للصفحات الإضافية
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 5. تعديل ميزة التحقق السريع لترمي على الـ PHP API الجديد بتاعك بطلب POST سليم
  const verifyItem = async (item, category) => {
    setActiveItem(item);
    setVerifying(true);
    
    const city = selectedCity === 'all' ? 'hurghada' : selectedCity;
    const cached = getCachedPrice(item, city, category || 'default');
    
    if (cached) {
      setVerifiedResults(prev => {
        const filteredList = prev.filter(r => r.item !== item);
        return [{ item, city, category, ...cached, from_cache: true }, ...filteredList];
      });
      setVerifying(false);
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=price_guide`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_price',
          item,
          category: category || 'default',
          city
        })
      });

      if (res.ok) {
        const resData = await res.json();
        const result = resData?.results?.[0] || resData; // مرونة حسب شكل الريسبونس الراجع
        if (result && !result.error) {
          setCachedPrice(item, city, category || 'default', result);
          setVerifiedResults(prev => {
            const filteredList = prev.filter(r => r.item !== item);
            return [result, ...filteredList];
          });
        }
      }
    } catch (err) {
      console.error("Error verifying item price:", err);
    }
    
    setVerifying(false);
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('price_checker', lang)}</h1>
          <p className="text-sm text-muted-foreground">Google Places + AI verified · Know before you pay</p>
          <LiveTrustBadge records={prices} reportCount={240} className="mt-1" />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items (e.g. taxi, water, SIM card)..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setSelectedCity('all')}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCity === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'bg-white border border-border text-gray-600'
            }`}
          >
            {t('all_cities', lang)}
          </button>
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCity === city.id ? 'bg-teal-600 text-white shadow-sm' : 'bg-white border border-border text-gray-600'
              }`}
            >
              {getCityName(city, lang)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              !selectedCategory ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-border text-gray-600'
            }`}
          >
            All
          </button>
          {PRICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedCategory === cat ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-border text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Verified results */}
      {verifiedResults.length > 0 && (
        <div className="mb-6">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">🔍 Verified Results</p>
          <div className="space-y-3">
            {verifiedResults.map((r, i) => (
              <VerifiedPriceCard key={i} result={r}
                onRefresh={() => verifyItem(r.item, r.category)} />
            ))}
          </div>
        </div>
      )}

      {/* Quick verify presets */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">⚡ Quick Price Check</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ITEMS.map((qi, i) => {
            const isActive = activeItem === qi.item && verifying;
            const result = verifiedResults.find(r => r.item === qi.item);
            return (
              <button key={i} onClick={() => verifyItem(qi.item, qi.category)}
                disabled={verifying}
                className="flex items-start gap-2 p-3 bg-white border border-border rounded-xl hover:border-teal-500/40 transition-all text-left disabled:opacity-60 shadow-sm">
                {isActive
                  ? <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin shrink-0 mt-0.5" />
                  : <Zap className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate text-gray-800">{qi.item}</p>
                  {result && !result.error ? (
                    <p className="text-[10px] text-emerald-600 font-bold">
                      {result.min}–{result.max} EGP
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground capitalize">{qi.category.replace('_', ' ')}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-[10px] font-bold">
        <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-700">Google Verified</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-amber-700">AI Estimated</span>
        </div>
      </div>

      {/* Price List from DB */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">📋 Price Database</p>
          <div className="space-y-3">
            {filtered.map((price) => (
              <div key={price.id || price.id_index} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-800">{price.item}</h3>
                    <span className="text-[10px] text-muted-foreground capitalize">{price.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {price.city !== 'all' && (
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full capitalize">
                        {price.city?.replace('-', ' ')}
                      </span>
                    )}
                    <button onClick={() => verifyItem(price.item, price.category)}
                      disabled={verifying && activeItem === price.item}
                      className="flex items-center gap-1 text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full hover:bg-teal-100 transition-colors disabled:opacity-50">
                      {verifying && activeItem === price.item
                        ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        : <Zap className="w-2.5 h-2.5" />}
                      Verify
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-green-500/5 rounded-xl p-3 text-center border border-green-500/10">
                    <p className="text-lg font-extrabold text-green-600">{price.local_price} </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t('local_price', lang)}</p>
                  </div>
                  <div className="bg-teal-500/5 rounded-xl p-3 text-center border-2 border-teal-500/20">
                    <p className="text-lg font-extrabold text-teal-600">{price.fair_tourist_price} </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t('fair_price', lang)}</p>
                  </div>
                  {price.scam_price && (
                    <div className="bg-red-500/5 rounded-xl p-3 text-center border border-red-500/10">
                      <div className="flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <p className="text-lg font-extrabold text-red-500">{price.scam_price} </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t('scam_price', lang)}</p>
                    </div>
                  )}
                </div>
                {price.notes && (
                  <p className="text-xs text-muted-foreground mt-3 italic">{price.notes}</p>
                )}
                {/* Show verified result inline if available */}
                {verifiedResults.find(r => r.item === price.item) && (
                  <div className="mt-3 pt-3 border-t border-border/40">
                    <VerifiedPriceCard compact result={verifiedResults.find(r => r.item === price.item)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">No prices found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Try a different search or category</p>
        </div>
      )}

      <div className="mt-8">
        <SafeNextStep
          title="Found a wrong price?"
          description="Help fellow tourists — report real prices"
          to="/services"
        />
      </div>
    </div>
  );
}