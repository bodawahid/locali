import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, X, Image, Loader2 } from 'lucide-react';

const MAX_SIZE_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * ImageUpload — reusable image upload component.
 *
 * Props:
 *   value        — current image URL (string)
 *   onChange     — called with new URL after upload, or null on remove
 *   label        — optional label text
 *   className    — extra wrapper classes
 */
export default function ImageUpload({ value, onChange, label = 'Upload Image', className = '' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError('');
    if (!ACCEPTED.includes(file.type)) {
      setError('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url);
    } catch (err) {
      setError('Upload failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="relative group inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="w-full max-h-52 object-cover rounded-xl border border-border"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 bg-white text-foreground px-3 py-1.5 rounded-lg text-xs font-bold shadow"
            >
              <Upload className="w-3.5 h-3.5" /> Change
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent/60 hover:bg-accent/5 transition-all"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          ) : (
            <Image className="w-6 h-6 text-muted-foreground" />
          )}
          <p className="text-sm font-semibold text-muted-foreground">
            {loading ? 'Uploading...' : label}
          </p>
          <p className="text-[11px] text-muted-foreground/60">JPG, PNG, WEBP · max {MAX_SIZE_MB}MB</p>
          <p className="text-[11px] text-muted-foreground/50">Drag & drop or click to browse</p>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={handleChange}
        capture="environment"
      />
    </div>
  );
}