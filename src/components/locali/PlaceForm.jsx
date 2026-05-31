import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Upload, Plus, Loader2, MapPin } from 'lucide-react';

const CITIES = ['hurghada','sharm-el-sheikh','cairo','luxor','aswan','el-gouna','dahab','alexandria'];
const CATEGORIES = ['hotel','apartment','experience','service'];
const AMENITIES_LIST = ['WiFi','Pool','AC','Parking','Breakfast','Kitchen','Sea View','Beach Access','Gym'];

export default function PlaceForm({ place, onSave, onClose, hostEmail, hostName }) {
  const [form, setForm] = useState(place ? { ...place } : {
    title: '', description: '', city: 'hurghada', category: 'apartment',
    price: '', price_unit: 'per_night', address: '', google_maps_link: '',
    whatsapp: '', phone: '', images: [], main_image: '', amenities: [],
    is_available: true, host_email: hostEmail || '', host_name: hostName || ''
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(files.map(f => base44.integrations.Core.UploadFile({ file: f }).then(r => r.file_url)));
    const newImages = [...(form.images || []), ...urls];
    set('images', newImages);
    if (!form.main_image) set('main_image', urls[0]);
    setUploading(false);
  };

  const toggleAmenity = (a) => {
    const list = form.amenities || [];
    set('amenities', list.includes(a) ? list.filter(x => x !== a) : [...list, a]);
  };

  const handleSave = async () => {
    if (!form.title || !form.city || !form.category || !form.price || !form.whatsapp) {
      setError('Please fill in: title, city, category, price, and WhatsApp.');
      return;
    }
    setSaving(true);
    setError('');
    const data = { ...form, price: Number(form.price), status: place?.status || 'pending' };
    if (place?.id) {
      await base44.entities.Place.update(place.id, data);
    } else {
      await base44.entities.Place.create(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-xl max-h-[95vh] sm:rounded-3xl rounded-t-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-lg text-gray-900">{place?.id ? 'Edit Listing' : 'Add New Listing'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Cozy Sea-View Apartment in El Gouna"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40" />
          </div>

          {/* Category + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none capitalize bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">City *</label>
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                {CITIES.map(c => <option key={c} value={c}>{c.replace(/-/g,' ')}</option>)}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Price (EGP) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Per</label>
              <select value={form.price_unit} onChange={e => set('price_unit', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                <option value="per_night">Night</option>
                <option value="per_service">Service</option>
                <option value="per_person">Person</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Describe your place, what makes it special…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none focus:ring-2 focus:ring-rose-400/40" />
          </div>

          {/* Address + Maps */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Address</label>
            <input value={form.address} onChange={e => set('address', e.target.value)}
              placeholder="Street address or area name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40 mb-2" />
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.google_maps_link} onChange={e => set('google_maps_link', e.target.value)}
                placeholder="Google Maps link (paste URL)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40" />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">WhatsApp * <span className="text-gray-400 font-normal">(with country code)</span></label>
              <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                placeholder="201001234567"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+201001234567"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40" />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Images</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {(form.images || []).map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={url} className="w-full h-full object-cover" />
                  <button onClick={() => {
                    const imgs = form.images.filter((_, j) => j !== i);
                    set('images', imgs);
                    if (form.main_image === url) set('main_image', imgs[0] || '');
                  }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                  {form.main_image === url && (
                    <div className="absolute bottom-1 left-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Main</div>
                  )}
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-all">
                {uploading ? <Loader2 className="w-5 h-5 text-rose-400 animate-spin" /> : <Plus className="w-5 h-5 text-gray-400" />}
                <span className="text-[10px] text-gray-400 mt-1">Add</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map(a => (
                <button key={a} onClick={() => toggleAmenity(a)} type="button"
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    (form.amenities || []).includes(a) ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => set('is_available', !form.is_available)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_available ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_available ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {form.is_available ? '✅ Available for booking' : '⏸️ Not available'}
            </span>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-2 flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {place?.id ? 'Save Changes' : 'Submit Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}