import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, X, Image, Loader2, Plus } from 'lucide-react';

const MAX_SIZE_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * MultiImageUpload — upload multiple images, stores array of URLs.
 *
 * Props:
 *   value      — array of image URLs
 *   onChange   — called with updated array
 *   maxImages  — default 10
 */
export default function MultiImageUpload({ value = [], onChange, maxImages = 10 }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    setError('');
    const remaining = maxImages - value.length;
    const toUpload = Array.from(files).slice(0, remaining);

    for (const file of toUpload) {
      if (!ACCEPTED.includes(file.type)) { setError('Only JPG, PNG, WEBP allowed.'); continue; }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) { setError(`Each image must be under ${MAX_SIZE_MB}MB.`); continue; }
    }
    if (error) return;

    setLoading(true);
    const urls = await Promise.all(
      toUpload.map(file => base44.integrations.Core.UploadFile({ file }).then(r => r.file_url))
    );
    onChange([...value, ...urls]);
    setLoading(false);
  };

  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, idx) => (
            <div key={idx} className="relative group aspect-square">
              <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-border" loading="lazy" />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {value.length < maxImages && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 hover:border-accent/60 hover:bg-accent/5 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 text-accent animate-spin" /> : <Plus className="w-5 h-5 text-muted-foreground" />}
              <span className="text-[10px] text-muted-foreground">Add</span>
            </button>
          )}
        </div>
      )}

      {value.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => e.preventDefault()}
          className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-accent/60 hover:bg-accent/5 transition-all"
        >
          {loading ? <Loader2 className="w-6 h-6 text-accent animate-spin" /> : <Image className="w-6 h-6 text-muted-foreground" />}
          <p className="text-sm font-semibold text-muted-foreground">{loading ? 'Uploading...' : 'Upload Images'}</p>
          <p className="text-[11px] text-muted-foreground/60">JPG, PNG, WEBP · max {MAX_SIZE_MB}MB each · up to {maxImages} images</p>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}