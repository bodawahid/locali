import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Check, AlertCircle, Loader2, Image, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'activities', label: '⛵ Boat / Activities' },
  { id: 'nightlife', label: '🎶 Nightlife' },
  { id: 'kids_family', label: '🎠 Kids & Family' },
];

export default function AdminPlaceImageUpdater() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('activities');
  const [updating, setUpdating] = useState({});
  const [results, setResults] = useState({});

  const { data: services = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-services-images', selectedCategory],
    queryFn: () => base44.entities.Service.filter({ category: selectedCategory }, '-created_date', 50),
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-bold">Admin Access Required</h1>
        <button onClick={() => navigate('/')} className="bg-accent text-accent-foreground px-4 py-2 rounded-xl font-bold text-sm">Go Home</button>
      </div>
    );
  }

  const fetchAndUpdateImage = async (service) => {
    setUpdating(prev => ({ ...prev, [service.id]: true }));
    setResults(prev => ({ ...prev, [service.id]: null }));

    const res = await base44.functions.invoke('fetchPlaceImages', {
      placeName: service.name,
      city: service.city,
      maxPhotos: 3,
    });

    const data = res.data;

    if (data.found && data.mainPhoto) {
      // Update the service record with new image
      await base44.entities.Service.update(service.id, {
        main_image: data.mainPhoto,
        photos: data.photos || [],
        ...(data.rating && !service.avg_rating ? { avg_rating: data.rating } : {}),
      });
      setResults(prev => ({ ...prev, [service.id]: { success: true, photo: data.mainPhoto, name: data.name } }));
    } else {
      setResults(prev => ({ ...prev, [service.id]: { success: false, error: 'Not found on Google Places' } }));
    }

    setUpdating(prev => ({ ...prev, [service.id]: false }));
  };

  const fetchAllImages = async () => {
    for (const service of services) {
      await fetchAndUpdateImage(service);
      await new Promise(r => setTimeout(r, 500)); // small delay to avoid rate limits
    }
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
          <Image className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Place Image Updater</h1>
          <p className="text-sm text-muted-foreground">Fetch real images from Google Places API for service listings</p>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedCategory === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Bulk action */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-amber-800">⚡ Bulk Update All Images</p>
          <p className="text-xs text-amber-700 mt-0.5">Fetches real Google Places photos for all {services.length} listings in this category. May take 1–2 minutes.</p>
        </div>
        <button onClick={fetchAllImages}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 shrink-0">
          <RefreshCw className="w-4 h-4" />
          Update All
        </button>
      </div>

      {/* Service list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(service => {
            const isUpdating = updating[service.id];
            const result = results[service.id];
            return (
              <div key={service.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
                {/* Current image */}
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-secondary shrink-0">
                  {service.main_image ? (
                    <img src={service.main_image} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.city} · {service.category}</p>
                  {result && (
                    <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${result.success ? 'text-emerald-600' : 'text-red-500'}`}>
                      {result.success ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {result.success ? 'Image updated from Google Places' : result.error}
                    </div>
                  )}
                </div>

                {/* Updated image preview */}
                {result?.success && result.photo && (
                  <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-emerald-500">
                    <img src={result.photo} alt="new" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Action button */}
                <button onClick={() => fetchAndUpdateImage(service)} disabled={isUpdating}
                  className="shrink-0 flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-50">
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  {isUpdating ? 'Fetching...' : 'Fetch Image'}
                </button>
              </div>
            );
          })}

          {services.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No services found in this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}