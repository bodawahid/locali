import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ArrowLeft, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import PlaceForm from '../components/locali/PlaceForm';
import { useAuth } from '@/lib/AuthContext';

const STATUS_BADGES = {
  pending: { label: 'Pending Review', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Live', icon: CheckCircle, className: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-50 text-red-700 border-red-200' },
};

const CATEGORY_ICONS = { hotel: '🏨', apartment: '🏠', experience: '🎯', service: '🛎️' };

export default function LocaliHostDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const { data: myPlaces = [], isLoading, refetch } = useQuery({
    queryKey: ['host-places', user?.email],
    queryFn: () => user?.role === 'admin'
      ? base44.entities.Place.list('-created_date', 200)
      : base44.entities.Place.filter({ host_email: user?.email }, '-created_date', 100),
    enabled: !!user,
  });

  const handleDelete = async (id) => {
    await base44.entities.Place.delete(id);
    setDeleting(null);
    refetch();
  };

  const toggleAvailability = async (place) => {
    await base44.entities.Place.update(place.id, { is_available: !place.is_available });
    refetch();
  };

  const stats = {
    total: myPlaces.length,
    approved: myPlaces.filter(p => p.status === 'approved').length,
    pending: myPlaces.filter(p => p.status === 'pending').length,
    inquiries: myPlaces.reduce((s, p) => s + (p.inquiry_count || 0), 0),
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Sign in required</h2>
          <p className="text-gray-500">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/locali" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" /> Browse
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-rose-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xs">L</span>
              </div>
              <span className="font-black text-gray-900">My Dashboard</span>
            </div>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Listing
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Welcome, {user.full_name?.split(' ')[0] || 'Host'} 👋</h1>
          <p className="text-gray-500 mt-1">Manage your listings and track inquiries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Listings', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: 'Live', value: stats.approved, color: 'bg-green-50 text-green-700' },
            { label: 'Pending', value: stats.pending, color: 'bg-amber-50 text-amber-700' },
            { label: 'Total Inquiries', value: stats.inquiries, color: 'bg-rose-50 text-rose-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-xs font-semibold mt-1 opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
          </div>
        ) : myPlaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <div className="text-5xl mb-4">🏖️</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500 mb-6">Add your first property to start getting bookings</p>
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-600 transition-colors">
              <Plus className="w-4 h-4" /> Add Your First Listing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900">Your Listings ({myPlaces.length})</h2>
            {myPlaces.map(place => {
              const image = place.main_image || place.images?.[0];
              const statusInfo = STATUS_BADGES[place.status] || STATUS_BADGES.pending;
              const StatusIcon = statusInfo.icon;
              return (
                <div key={place.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {image ? (
                        <img src={image} alt={place.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {CATEGORY_ICONS[place.category] || '🏠'}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-gray-900 text-sm truncate">{place.title}</h3>
                          <p className="text-xs text-gray-500 capitalize mt-0.5">
                            {CATEGORY_ICONS[place.category]} {place.category} · {place.city?.replace(/-/g,' ')}
                          </p>
                          <p className="text-sm font-black text-rose-500 mt-1">
                            {place.price?.toLocaleString()} EGP <span className="text-gray-400 font-normal text-xs">/{place.price_unit?.replace('per_','')}</span>
                          </p>
                        </div>
                        {/* Status badge */}
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold shrink-0 ${statusInfo.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageSquare className="w-3 h-3" />
                          {place.inquiry_count || 0} inquiries
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-semibold ${place.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                          {place.is_available ? '● Available' : '○ Hidden'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t border-gray-50 divide-x divide-gray-50">
                    <button onClick={() => { setEditing(place); setShowForm(false); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => toggleAvailability(place)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                      {place.is_available ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {place.is_available ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => setDeleting(place.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Forms */}
      {(showForm || editing) && (
        <PlaceForm
          place={editing || null}
          hostEmail={user?.email}
          hostName={user?.full_name}
          onSave={() => { setShowForm(false); setEditing(null); refetch(); }}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-black text-lg text-gray-900 mb-2">Delete this listing?</h3>
              <p className="text-gray-500 text-sm mb-5">This cannot be undone. All data will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleting(null)} className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleting)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}