/**
 * EditableImage — Drop-in <img> replacement that shows a pencil overlay for admins.
 * Persists uploaded images to HomeContent entity using sectionKey.
 *
 * Props:
 *   src           — fallback/default image URL
 *   alt           — alt text
 *   className     — classes for the <img>
 *   sectionKey    — unique key to persist image in HomeContent (e.g. "wellness_hero")
 *   onUploaded    — optional callback(newUrl)
 *   ...rest       — any other img props
 */
import { useRef, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Pencil, Loader2 } from 'lucide-react';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 5;

// In-memory cache to avoid re-fetching on every render
const imageCache = {};

export default function EditableImage({
  src: defaultSrc,
  alt = '',
  className = '',
  sectionKey,
  onUploaded,
  ...rest
}) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [src, setSrc] = useState(defaultSrc);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role === 'admin';

  // Load persisted image from DB on mount
  useEffect(() => {
    if (!sectionKey) return;

    if (imageCache[sectionKey] !== undefined) {
      if (imageCache[sectionKey]) {
        setSrc(imageCache[sectionKey].url);
        setRecordId(imageCache[sectionKey].id);
      }
      return;
    }

    base44.entities.HomeContent.filter({ section_key: sectionKey }, '-created_date', 1)
      .then(results => {
        if (results && results.length > 0 && results[0].image_url) {
          imageCache[sectionKey] = { url: results[0].image_url, id: results[0].id };
          setSrc(results[0].image_url);
          setRecordId(results[0].id);
        } else {
          imageCache[sectionKey] = null;
        }
      });
  }, [sectionKey]);

  const handleFile = async (file) => {
    if (!ACCEPTED.includes(file.type) || file.size > MAX_MB * 1024 * 1024) return;
    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setSrc(file_url);
      onUploaded?.(file_url);

      if (sectionKey) {
        if (recordId) {
          await base44.entities.HomeContent.update(recordId, { image_url: file_url });
          imageCache[sectionKey] = { url: file_url, id: recordId };
        } else {
          const created = await base44.entities.HomeContent.create({
            section_key: sectionKey,
            section_type: 'image_block',
            title: sectionKey,
            image_url: file_url,
            is_active: true,
          });
          setRecordId(created.id);
          imageCache[sectionKey] = { url: file_url, id: created.id };
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <img src={src} alt={alt} className={className} {...rest} />;
  }

  return (
    <div className="relative w-full h-full">
      <img src={src} alt={alt} className={className} {...rest} />

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
        disabled={loading}
        className="absolute bottom-2 right-2 z-30 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
        title="Replace image"
      >
        {loading
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Pencil className="w-3.5 h-3.5" />}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}