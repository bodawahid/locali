import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Loader2, CheckCircle2, ArrowLeft, Phone, MessageCircle } from 'lucide-react';

const SERVICE_TYPES = [
  'Tour Guide', 'Driver', 'Hotel', 'Restaurant', 'Diving', 'Boat Trip', 'Other'
];

const CATEGORY_MAP = {
  'Tour Guide': 'activities',
  'Driver': 'transport',
  'Hotel': 'other',
  'Restaurant': 'restaurant',
  'Diving': 'activities',
  'Boat Trip': 'activities',
  'Other': 'other',
};

const EMPTY = { businessName: '', serviceType: '', phone: '', price: '' };

export default function AddService() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [saved, setSaved] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.businessName.trim()) errs.businessName = 'Required';
    if (!form.serviceType) errs.serviceType = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.price.trim()) errs.price = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (photos.length + files.length > 3) { alert('Max 3 photos.'); return; }
    setUploadingPhoto(true);
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setPhotos(p => [...p, file_url]);
      } catch {}
    }
    setUploadingPhoto(false);
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus('loading');
    try {
      const record = await base44.entities.Service.create({
        name: form.businessName.trim(),
        category: CATEGORY_MAP[form.serviceType] || 'other',
        phone: form.phone.trim(),
        description: `Price: ${form.price.trim()}`,
        photos,
        tags: [form.serviceType, form.price.trim()],
        is_verified: false,
        is_featured: false,
        avg_rating: 0,
        review_count: 0,
        scam_score: 0,
        subscription_tier: 'none',
      });
      queryClient.invalidateQueries({ queryKey: ['allServices'] });
      setSaved({
        name: form.businessName.trim(),
        serviceType: form.serviceType,
        price: form.price.trim(),
        phone: form.phone.trim(),
        photos,
      });
      setStatus('success');
    } catch (err) {
      setErrors({ submit: err?.message || 'Submission failed. Please try again.' });
      setStatus('idle');
    }
  };

  // ── Success screen ──────────────────────────────────────────────
  if (status === 'success' && saved) {
    const wa = saved.phone.replace(/\D/g, '');
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black">Listing Submitted!</h1>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-800 font-semibold">Your service has been listed successfully.</p>
        </div>

        {/* Service Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {saved.photos.length > 0 && (
            <img src={saved.photos[0]} alt={saved.name} className="w-full h-48 object-cover" />
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="font-black text-lg">{saved.name}</h2>
                <span className="text-xs font-bold bg-accent/10 text-accent px-2.5 py-1 rounded-full">{saved.serviceType}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-black text-base text-emerald-600">{saved.price}</p>
              </div>
            </div>

            {saved.photos.length > 1 && (
              <div className="flex gap-2 mb-4">
                {saved.photos.slice(1).map((url, i) => (
                  <img key={i} src={url} alt="" className="w-20 h-16 object-cover rounded-xl" />
                ))}
              </div>
            )}

            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white text-sm"
              style={{ background: '#25D366' }}
            >
              <MessageCircle className="w-4 h-4" />
              Book via WhatsApp
            </a>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-4 w-full py-3 rounded-2xl font-bold text-sm border border-border hover:bg-secondary transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black">List Your Service</h1>
          <p className="text-sm text-muted-foreground">Reach thousands of tourists across Egypt</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Global error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 font-medium">
            {errors.submit}
          </div>
        )}

        {/* Business Name */}
        <FormField label="Business Name" required error={errors.businessName}>
          <input
            value={form.businessName}
            onChange={e => set('businessName', e.target.value)}
            placeholder="e.g. Ahmed's Desert Tours"
            className={cls(errors.businessName)}
          />
        </FormField>

        {/* Service Type */}
        <FormField label="Service Type" required error={errors.serviceType}>
          <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)} className={cls(errors.serviceType)}>
            <option value="">Select type...</option>
            {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>

        {/* Phone */}
        <FormField label="Phone / WhatsApp Number" required error={errors.phone}>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="e.g. 201001234567"
              type="tel"
              className={`${cls(errors.phone)} pl-10`}
            />
          </div>
        </FormField>

        {/* Price */}
        <FormField label="Price" required error={errors.price}>
          <input
            value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder='e.g. "50 USD" or "500 EGP per person"'
            className={cls(errors.price)}
          />
        </FormField>

        {/* Photos */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            Photos <span className="text-muted-foreground font-normal text-xs">(optional, max 3)</span>
          </label>
          <div className="flex gap-3 flex-wrap">
            {photos.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                {uploadingPhoto ? (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-1">Add photo</span>
                  </>
                )}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
              </label>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-4 rounded-2xl font-bold text-sm border border-border hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="flex-1 py-4 rounded-2xl font-black text-white text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#2E7D8A' }}
          >
            {status === 'loading' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-foreground mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}

function cls(error) {
  return `w-full px-4 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D8A] focus:border-transparent transition-all appearance-none bg-background ${
    error ? 'border-red-400 bg-red-50/30' : 'border-border'
  }`;
}