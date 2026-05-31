import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Grid3X3, LayoutList, Plus, User, Shield } from 'lucide-react';
import PlaceCard from '../components/locali/PlaceCard.jsx';
import SearchFilters from '../components/locali/SearchFilters';
import PlaceForm from '../components/locali/PlaceForm';
import { useAuth } from '@/lib/AuthContext';

export default function LocaliHome() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ search: '', city: '', category: '', minPrice: '', maxPrice: '' });
  const [showForm, setShowForm] = useState(false);
  const [gridView, setGridView] = useState(true);

  const { data: places = [], refetch, isLoading } = useQuery({
    queryKey: ['places-approved'],
    queryFn: () => base44.entities.Place.filter({ status: 'approved' }, '-created_date', 100),
    staleTime: 60000,
  });

  const filtered = useMemo(() => {
    return places.filter(p => {
      if (filters.search && !p.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !p.description?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !p.address?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.city && p.city !== filters.city) return false;
      if (filters.category && p.category !== filters.category) return false;
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      return true;
    });
  }, [places, filters]);

  const featured = filtered.filter(p => p.is_featured);
  const regular = filtered.filter(p => !p.is_featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/locali" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="font-black text-xl text-gray-900">Locali</span>
          </Link>

          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <Link to="/locali/admin"
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
            {(user?.role === 'host' || user?.role === 'admin') && (
              <Link to="/locali/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-colors">
                <LayoutList className="w-3.5 h-3.5" /> My Listings
              </Link>
            )}
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors shadow-sm">
              <Plus className="w-3.5 h-3.5" /> List Your Place
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
            Discover Egypt.<br />
            <span className="text-rose-100">Stay Like a Local.</span>
          </h1>
          <p className="text-rose-100 text-lg max-w-xl mx-auto mb-8">
            Hotels, apartments, experiences, and services across Egypt — verified and curated for travelers.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2">
              <span className="text-xl">🏨</span>
              <div className="text-left">
                <p className="font-black">{places.filter(p=>p.category==='hotel').length}+</p>
                <p className="text-rose-100 text-xs">Hotels</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2">
              <span className="text-xl">🏠</span>
              <div className="text-left">
                <p className="font-black">{places.filter(p=>p.category==='apartment').length}+</p>
                <p className="text-rose-100 text-xs">Apartments</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2">
              <span className="text-xl">🎯</span>
              <div className="text-left">
                <p className="font-black">{places.filter(p=>p.category==='experience').length}+</p>
                <p className="text-rose-100 text-xs">Experiences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <SearchFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-gray-600">
            {isLoading ? 'Loading…' : `${filtered.length} place${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            <button onClick={() => setGridView(true)}
              className={`p-1.5 rounded-lg transition-colors ${gridView ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setGridView(false)}
              className={`p-1.5 rounded-lg transition-colors ${!gridView ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏖️</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No places found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or be the first to list here!</p>
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-600 transition-colors">
              <Plus className="w-4 h-4" /> Add Your Place
            </button>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-black text-gray-900 mb-4">⭐ Featured Listings</h2>
                <div className={`grid gap-5 ${gridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {featured.map(p => <PlaceCard key={p.id} place={p} />)}
                </div>
              </div>
            )}

            {/* All listings */}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && <h2 className="text-lg font-black text-gray-900 mb-4">All Listings</h2>}
                <div className={`grid gap-5 ${gridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {regular.map(p => <PlaceCard key={p.id} place={p} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Listing CTA */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mt-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-3">Have a place in Egypt?</h2>
          <p className="text-gray-400 mb-6">List your hotel, apartment, or experience and reach thousands of travelers.</p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg">
            <Plus className="w-5 h-5" /> List Your Place Free
          </button>
        </div>
      </div>

      {showForm && (
        <PlaceForm
          hostEmail={user?.email}
          hostName={user?.full_name}
          onSave={() => { setShowForm(false); refetch(); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}