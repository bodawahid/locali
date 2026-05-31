import { useState, useMemo, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { CITIES } from '../lib/constants';
import { Search, SlidersHorizontal, Plus, Wrench, Loader2, CheckCircle } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import AdminServiceForm from '../components/AdminServiceForm';
import VerifiedKidsActivities from '../components/VerifiedKidsActivities';
import VerifiedNightlifeVenues from '../components/VerifiedNightlifeVenues';
import { useAuth } from '@/lib/AuthContext';

// ── City normalization map ────────────────────────────────────────────────────
const CITY_NORMALIZE = {
  'luxor': 'luxor', 'Luxor': 'luxor', 'LUXOR': 'luxor', 'luxor ': 'luxor', ' luxor': 'luxor',
  'al-uqsur': 'luxor', 'el-uqsur': 'luxor',
  'aswan': 'aswan', 'Aswan': 'aswan', 'ASWAN': 'aswan', 'aswan ': 'aswan', ' aswan': 'aswan',
  'assuan': 'aswan', 'assouan': 'aswan',
  'hurghada': 'hurghada', 'Hurghada': 'hurghada', 'HURGHADA': 'hurghada',
  'el-hurghada': 'hurghada', 'al-hurghada': 'hurghada',
  'sharm-el-sheikh': 'sharm-el-sheikh', 'sharm el sheikh': 'sharm-el-sheikh',
  'Sharm El Sheikh': 'sharm-el-sheikh', 'sharm': 'sharm-el-sheikh',
  'sharm-el-shaikh': 'sharm-el-sheikh', 'Sharm': 'sharm-el-sheikh',
  'el-gouna': 'el-gouna', 'el gouna': 'el-gouna', 'El Gouna': 'el-gouna',
  'elgouna': 'el-gouna', 'El-Gouna': 'el-gouna',
};

const VALID_CITY_IDS = new Set(CITIES.map(c => c.id));

function normalizeCity(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (CITY_NORMALIZE[trimmed]) return CITY_NORMALIZE[trimmed];
  const lower = trimmed.toLowerCase();
  if (CITY_NORMALIZE[lower]) return CITY_NORMALIZE[lower];
  if (VALID_CITY_IDS.has(lower)) return lower;
  return null;
}

function sortServices(services) {
  return [...services].sort((a, b) => {
    const aImg = !!(a.main_image || (a.photos && a.photos.length));
    const bImg = !!(b.main_image || (b.photos && b.photos.length));
    if (aImg !== bImg) return aImg ? -1 : 1;
    if (a.is_verified !== b.is_verified) return a.is_verified ? -1 : 1;
    return (a.name || '').localeCompare(b.name || '');
  });
}

// ── Admin City Fix Tool ───────────────────────────────────────────────────────
function AdminCityFixTool({ onDone }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=service`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch services for fixing");
      const all = await res.json();
      
      const allServices = Array.isArray(all) ? all : [];
      let fixed = 0, unknown = 0;
      const updates = [];

      for (const svc of allServices) {
        const normalized = normalizeCity(svc.city);
        let targetCity = null;

        if (normalized && normalized !== svc.city) {
          targetCity = normalized;
        } else if (!normalized) {
          const text = ((svc.name || '') + ' ' + (svc.description || '')).toLowerCase();
          if (text.includes('luxor') || text.includes('karnak') || text.includes('valley')) targetCity = 'luxor';
          else if (text.includes('aswan') || text.includes('nubian') || text.includes('philae')) targetCity = 'aswan';
          else if (text.includes('hurghada') || text.includes('el gouna')) targetCity = 'hurghada';
          else if (text.includes('sharm') || text.includes('naama') || text.includes('sinai')) targetCity = 'sharm-el-sheikh';
        }

        if (targetCity) {
          fixed++;
          updates.push(
            fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id_index: svc.id_index, id: svc.id, city: targetCity, action: 'update_city' })
            })
          );
        } else {
          unknown++;
        }
      }

      if (updates.length > 0) await Promise.all(updates);
      setResult({ fixed, unknown, total: allServices.length });
      onDone();
    } catch (err) {
      setResult({ error: err.message });
    }
    setRunning(false);
  };

  return (
    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <p className="text-xs font-bold text-amber-800">⚡ Admin Mode</p>
          <p className="text-xs text-amber-700">Normalize inconsistent city names across all services in your MySQL DB.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setRunning(false) || run()} disabled={running}
            className="flex items-center gap-1.5 bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-700 disabled:opacity-50">
            {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wrench className="w-3 h-3" />}
            {running ? 'Fixing…' : 'Fix Cities'}
          </button>
        </div>
      </div>
      {result && !result.error && (
        <p className="text-xs text-amber-800 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
          Fixed {result.fixed} · {result.unknown} unknown · {result.total} total
        </p>
      )}
      {result?.error && <p className="text-xs text-red-600">Error: {result.error}</p>}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ cityId, category, onClearCity, onClearCategory, isAdmin, onAdd }) {
  const city = CITIES.find(c => c.id === cityId);
  const nearby = (cityId === 'luxor' || cityId === 'aswan')
    ? CITIES.filter(c => c.id !== cityId && c.region === 'Cultural')
    : CITIES.filter(c => c.id !== cityId && c.region === 'Red Sea');

  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
        <Search className="w-6 h-6 text-muted-foreground/40" />
      </div>
      <p className="font-bold text-base mb-1">
        {cityId ? `No services yet in ${city?.name || cityId}` : 'No services found'}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        {category ? 'Try removing the category filter, or explore' : 'Try'} nearby cities.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {cityId && (
          <button onClick={() => onClearCity('')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-accent text-accent-foreground">
            View All Cities
          </button>
        )}
        {category && (
          <button onClick={onClearCategory}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-secondary border border-border">
            Remove Category Filter
          </button>
        )}
        {nearby.slice(0, 2).map(c => (
          <button key={c.id} onClick={() => onClearCity(c.id)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-secondary border border-border">
            Try {c.name}
          </button>
        ))}
      </div>
      {isAdmin && (
        <button onClick={onAdd}
          className="mt-4 flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-bold mx-auto">
          <Plus className="w-4 h-4" /> Add First Listing
        </button>
      )}
    </div>
  );
}

const CATEGORY_CHIPS = [
  { id: '', label: '✨ All', emoji: '' },
  { id: 'restaurant', label: '🍽️ Restaurants' },
  { id: 'medical', label: '🏥 Medical' },
  { id: 'transport', label: '🚗 Transport' },
  { id: 'activities', label: '🏄 Activities' },
  { id: 'kids_family', label: '👨‍👩‍👧 Kids' },
  { id: 'sim_internet', label: '📶 SIM' },
  { id: 'nightlife', label: '🎉 Nightlife' },
  { id: 'remote_work', label: '💻 Remote Work' },
  { id: 'long_stay', label: '🏠 Long Stay' },
];

const CITY_CHIPS = [
  { id: '', label: '🌍 All Cities' },
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '🤿 Sharm' },
  { id: 'el-gouna', label: '⛵ El Gouna' },
  { id: 'luxor', label: '🏛️ Luxor' },
  { id: 'aswan', label: '🛶 Aswan' },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Services() {
  const { lang } = useOutletContext();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const [selectedCity, setSelectedCity] = useState(urlParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(urlParams.get('category') || '');
  const [search, setSearch] = useState(urlParams.get('q') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const loadMoreRef = useRef(null);

  const isAdmin = user?.role === 'admin';

  // 1. تثبيت الـ queryKey ليكون ثابت تماماً لمنع حدوث الـ Hard Reload والرعشة عند تغيير الفلاتر
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['allServicesInfinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=service&page=${pageParam}&limit=24`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to load services from MySQL");
      const resData = await res.json();
      return Array.isArray(resData) ? resData : [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 24 ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  // 2. تجميع كل الصفحات المستلمة وعمل الـ Normalize في الخلفية
  const services = useMemo(() => {
    if (!data?.pages) return [];
    const flatList = data.pages.flat();
    return flatList.map(s => ({
      ...s,
      city: normalizeCity(s.city) || s.city || '',
    }));
  }, [data]);

  const cityCounts = useMemo(() => {
    const counts = {};
    for (const s of services) {
      if (s.city) counts[s.city] = (counts[s.city] || 0) + 1;
    }
    return counts;
  }, [services]);

  // 3. الفلترة المحلية الفورية والناعمة بدون رعشة أو وميض على الشاشة
  const filtered = useMemo(() => {
    let result = services;
    if (selectedCity) result = result.filter(s => s.city === selectedCity);
    if (selectedCategory) result = result.filter(s => s.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q));
    }
    if (verifiedOnly) result = result.filter(s => s.is_verified || s.is_verified === 'true');
    return sortServices(result);
  }, [services, selectedCity, selectedCategory, search, verifiedOnly]);

  // 4. Observe list end via IntersectionObserver
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: '0px 0px 300px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header + Search */}
      <div className="bg-teal-600 pt-6 pb-5 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-black text-2xl">Local Directory</h1>
              <p className="text-teal-100 text-xs">Find trusted businesses in Egypt</p>
            </div>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Business
            </button>
          </div>
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search restaurants, hospitals, transport..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* City filter chips */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {CITY_CHIPS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCity(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedCity === c.id
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400'
              }`}
            >
              {c.label}
              {c.id && <span className="ml-1 opacity-60">({cityCounts[c.id] || 0})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {CATEGORY_CHIPS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300'
              }`}
            >
              {c.label}
            </button>
          ))}
          <button
            onClick={() => setVerifiedOnly(v => !v)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1 ${
              verifiedOnly ? 'bg-green-500 text-white border-green-500' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" /> Verified
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {isAdmin && <AdminCityFixTool onDone={() => queryClient.invalidateQueries(['allServicesInfinite'])} />}

        {(showForm || editingRecord) && (
          <AdminServiceForm
            category={selectedCategory || editingRecord?.category || 'medical'}
            record={editingRecord}
            onSave={() => { setShowForm(false); setEditingRecord(null); queryClient.invalidateQueries(['allServicesInfinite']); }}
            onClose={() => { setShowForm(false); setEditingRecord(null); }}
          />
        )}

        {/* Results count */}
        {!isLoading && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              {selectedCity && ` in ${CITY_CHIPS.find(c => c.id === selectedCity)?.label || selectedCity}`}
            </p>
            {isAdmin && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Listing
              </button>
            )}
          </div>
        )}

        {selectedCategory === 'kids_family' && <VerifiedKidsActivities />}
        {selectedCategory === 'nightlife' && <VerifiedNightlifeVenues />}

        {isLoading ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-400 font-medium">Loading listings...</p>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(s => (
                <ServiceCard key={s.id || s.id_index} service={s} isAdmin={isAdmin} onEdit={() => setEditingRecord(s)} />
              ))}
            </div>
            
            {/* لودر السكرول السفلي الخفيف */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-6 mt-4">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            )}
            {!isFetchingNextPage && !hasNextPage && filtered.length > 0 && (
              <p className="text-center text-xs text-gray-400 mt-4">No more data to load</p>
            )}
            <div ref={loadMoreRef} className="h-1" />
          </>
        ) : (
          <EmptyState
            cityId={selectedCity}
            category={selectedCategory}
            onClearCity={(id) => setSelectedCity(id || '')}
            onClearCategory={() => setSelectedCategory('')}
            isAdmin={isAdmin}
            onAdd={() => setShowForm(true)}
          />
        )}
      </div>
    </div>
  );
}