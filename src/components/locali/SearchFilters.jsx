import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const CITIES = [
  { id: '', label: 'All Cities' },
  { id: 'hurghada', label: 'Hurghada' },
  { id: 'sharm-el-sheikh', label: 'Sharm' },
  { id: 'el-gouna', label: 'El Gouna' },
  { id: 'cairo', label: 'Cairo' },
  { id: 'luxor', label: 'Luxor' },
  { id: 'aswan', label: 'Aswan' },
  { id: 'dahab', label: 'Dahab' },
  { id: 'alexandria', label: 'Alexandria' },
];

const CATEGORIES = [
  { id: '', label: 'All', icon: '🌍' },
  { id: 'hotel', label: 'Hotels', icon: '🏨' },
  { id: 'apartment', label: 'Apartments', icon: '🏠' },
  { id: 'experience', label: 'Experiences', icon: '🎯' },
  { id: 'service', label: 'Services', icon: '🛎️' },
];

export default function SearchFilters({ filters, onChange }) {
  const [showMore, setShowMore] = useState(false);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filters.search || ''}
          onChange={e => set('search', e.target.value)}
          placeholder="Search places, hotels, experiences…"
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-300"
        />
        {filters.search && (
          <button onClick={() => set('search', '')} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {CATEGORIES.map(c => (
          <button key={c.id}
            onClick={() => set('category', c.id)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${
              filters.category === c.id
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}>
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      {/* City pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {CITIES.map(c => (
          <button key={c.id}
            onClick={() => set('city', c.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filters.city === c.id
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Price range toggle */}
      <button onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-2 text-sm text-gray-600 font-semibold hover:text-gray-900 transition-colors">
        <SlidersHorizontal className="w-4 h-4" />
        Price Range {showMore ? '▲' : '▼'}
      </button>

      {showMore && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Min Price (EGP)</label>
              <input type="number" value={filters.minPrice || ''} onChange={e => set('minPrice', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40" />
            </div>
            <div className="text-gray-400 mt-5">—</div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Max Price (EGP)</label>
              <input type="number" value={filters.maxPrice || ''} onChange={e => set('maxPrice', e.target.value)}
                placeholder="Any"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40" />
            </div>
          </div>
          {(filters.minPrice || filters.maxPrice) && (
            <button onClick={() => onChange({ ...filters, minPrice: '', maxPrice: '' })}
              className="mt-2 text-xs text-rose-500 font-semibold hover:underline">Clear price filter</button>
          )}
        </div>
      )}
    </div>
  );
}