/**
 * AdminNightlifeForm — Admin-only add/edit modal for NightlifeVenue entity.
 */
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

const CITIES = ['sharm-el-sheikh', 'hurghada', 'luxor', 'aswan', 'el-gouna'];
const TYPES = ['bar', 'beach_club', 'nightclub', 'rooftop', 'yacht', 'vip_lounge'];
const PRICE_RANGES = ['budget', 'moderate', 'premium', 'luxury'];
const SAFETY = ['safe', 'moderate', 'use_caution'];

export default function AdminNightlifeForm({ onSave, onClose, record }) {
  const [form, setForm] = useState(record ? { ...record } : {
    name: '', description: '', location: '', city: 'sharm-el-sheikh',
    type: 'bar', price_range: 'moderate', safety_rating: 'safe',
    entry_fee: '', dress_code: '', phone: '', main_image: '', is_verified: false,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.city) return;
    setSaving(true);
    const data = { ...form, entry_fee: parseFloat(form.entry_fee) || 0 };
    if (record?.id) {
      await base44.entities.NightlifeVenue.update(record.id, data);
    } else {
      await base44.entities.NightlifeVenue.create(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-lg max-h-[95vh] sm:rounded-3xl rounded-t-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-lg">{record?.id ? 'Edit Venue' : 'Add Venue'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Venue Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Club / bar name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">City *</label>
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-white capitalize">
                {CITIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-white capitalize">
                {TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Price Range</label>
              <select value={form.price_range} onChange={e => set('price_range', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-white capitalize">
                {PRICE_RANGES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Safety</label>
              <select value={form.safety_rating} onChange={e => set('safety_rating', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-white capitalize">
                {SAFETY.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none focus:ring-2 focus:ring-accent/40" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Location / Area</label>
              <input value={form.location || ''} onChange={e => set('location', e.target.value)} placeholder="Naama Bay…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Entry Fee (EGP)</label>
              <input type="number" value={form.entry_fee || ''} onChange={e => set('entry_fee', e.target.value)} placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone</label>
              <input value={form.phone || ''} onChange={e => set('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Dress Code</label>
              <input value={form.dress_code || ''} onChange={e => set('dress_code', e.target.value)} placeholder="Smart casual…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Main Image</label>
            <ImageUpload value={form.main_image} onChange={url => set('main_image', url || '')} label="Upload Venue Photo" />
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => set('is_verified', !form.is_verified)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_verified ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_verified ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm font-semibold text-gray-700">Verified</span>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name || !form.city}
            className="flex-1 py-3 bg-accent text-accent-foreground rounded-2xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {record?.id ? 'Save Changes' : 'Add Venue'}
          </button>
        </div>
      </div>
    </div>
  );
}