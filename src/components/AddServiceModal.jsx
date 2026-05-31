import { useState } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle, Upload, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const CITIES = [
  { label: 'Hurghada', value: 'hurghada' },
  { label: 'Sharm El Sheikh', value: 'sharm-el-sheikh' },
  { label: 'Luxor', value: 'luxor' },
  { label: 'Aswan', value: 'aswan' },
  { label: 'El Gouna', value: 'el-gouna' },
];

const SERVICE_TYPES = [
  { label: 'Tour Guide', value: 'activities' },
  { label: 'Driver', value: 'transport' },
  { label: 'Hotel / Accommodation', value: 'other' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Diving', value: 'activities' },
  { label: 'Boat Trip', value: 'activities' },
  { label: 'Other', value: 'other' },
];

const EMPTY_FORM = {
  businessName: '',
  serviceType: '',
  city: '',
  phone: '',
  description: '',
  priceRange: '',
  website: '',
};

const REQUIRED = ['businessName', 'serviceType', 'city', 'phone', 'description'];

export default function AddServiceModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [photos, setPhotos] = useState([]); // array of { file, url }
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const queryClient = useQueryClient();

  if (!open) return null;

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(k => {
      if (!form[k].trim()) errs[k] = 'This field is required.';
    });
    if (form.description.trim().length > 300) errs.description = 'Max 300 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (photos.length + files.length > 3) {
      alert('Maximum 3 photos allowed.');
      return;
    }
    setUploadingPhoto(true);
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setPhotos(p => [...p, { url: file_url }]);
      } catch {
        // skip failed uploads silently
      }
    }
    setUploadingPhoto(false);
    e.target.value = '';
  };

  const removePhoto = (idx) => setPhotos(p => p.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const serviceTypeObj = SERVICE_TYPES.find(s => s.label === form.serviceType) || SERVICE_TYPES[SERVICE_TYPES.length - 1];
      await base44.entities.Service.create({
        name: form.businessName.trim(),
        category: serviceTypeObj.value,
        city: form.city,
        phone: form.phone.trim(),
        description: form.description.trim(),
        website: form.website.trim() || undefined,
        photos: photos.map(p => p.url),
        is_verified: false,
        is_featured: false,
        avg_rating: 0,
        review_count: 0,
        scam_score: 0,
        subscription_tier: 'none',
        tags: form.priceRange ? [form.priceRange.trim()] : [],
      });
      queryClient.invalidateQueries({ queryKey: ['allServices'] });
      setStatus('success');
    } catch (err) {
      setErrorMsg(err?.message || 'Submission failed. Please try again.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setPhotos([]);
    setErrors({});
    setStatus('idle');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[95vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-black text-lg" style={{ color: '#3A2A1E' }}>
              Add Your Service to Locali Egypt 🇪🇬
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Reach thousands of tourists across Egypt — free</p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Success */}
        {status === 'success' ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F5E9DA' }}>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-black text-xl mb-2" style={{ color: '#3A2A1E' }}>Thank you!</h3>
            <p className="text-sm text-gray-500 mb-6">Your service will be reviewed within 24 hours.</p>
            <button onClick={handleClose} className="px-8 py-3 rounded-2xl font-bold text-white text-sm" style={{ background: '#2E7D8A' }}>
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Global error */}
            {status === 'error' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Business Name */}
            <Field label="Business Name" required error={errors.businessName}>
              <input
                value={form.businessName}
                onChange={e => set('businessName', e.target.value)}
                placeholder="e.g. Ahmed's Desert Tours"
                className={input(errors.businessName)}
              />
            </Field>

            {/* Service Type */}
            <Field label="Service Type" required error={errors.serviceType}>
              <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)} className={input(errors.serviceType)}>
                <option value="">Select type...</option>
                {SERVICE_TYPES.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
              </select>
            </Field>

            {/* City */}
            <Field label="City" required error={errors.city}>
              <select value={form.city} onChange={e => set('city', e.target.value)} className={input(errors.city)}>
                <option value="">Select city...</option>
                {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>

            {/* Phone */}
            <Field label="Phone Number / WhatsApp" required error={errors.phone}>
              <input
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="e.g. 201001234567"
                type="tel"
                className={input(errors.phone)}
              />
            </Field>

            {/* Description */}
            <Field label="Description" required error={errors.description}>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe your service to tourists..."
                rows={4}
                maxLength={300}
                className={`${input(errors.description)} resize-none`}
              />
              <p className="text-[10px] text-gray-400 text-right mt-1">{form.description.length}/300</p>
            </Field>

            {/* Price Range */}
            <Field label="Price Range" hint="optional" error={errors.priceRange}>
              <input
                value={form.priceRange}
                onChange={e => set('priceRange', e.target.value)}
                placeholder='e.g. "50–100 USD" or "300–500 EGP"'
                className={input()}
              />
            </Field>

            {/* Photo Upload */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                Photos
                <span className="text-[10px] font-normal text-gray-400">(optional, max 3)</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {photos.map((p, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#2E7D8A] transition-colors">
                    {uploadingPhoto ? (
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-[9px] text-gray-400 mt-1">Add photo</span>
                      </>
                    )}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  </label>
                )}
              </div>
            </div>

            {/* Website */}
            <Field label="Website or Social Media Link" hint="optional">
              <input
                value={form.website}
                onChange={e => set('website', e.target.value)}
                placeholder="https://instagram.com/yourservice"
                className={input()}
              />
            </Field>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleClose}
                className="flex-1 py-3.5 rounded-2xl font-bold text-gray-600 text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="flex-1 py-3.5 rounded-2xl font-black text-white text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#2E7D8A' }}
              >
                {status === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  'Submit for Review'
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-gray-400 pb-1">
              Free to list. Verified badge available after review. No commission on direct contacts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper components
function Field({ label, required, hint, error, children }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
        {hint && <span className="font-normal text-gray-400">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}

function input(error) {
  return `w-full px-4 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D8A] focus:border-transparent transition-all appearance-none bg-white ${
    error ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
  }`;
}