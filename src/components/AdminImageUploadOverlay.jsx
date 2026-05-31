/**
 * AdminImageUploadOverlay
 * Wraps any image container and shows a pencil icon button (bottom-right) for admin users.
 *
 * Props:
 *   entityName   — e.g. "Service", "Listing"
 *   recordId     — entity record id
 *   fieldName    — field to update (default: "main_image")
 *   onUploaded   — callback(newUrl) called after successful upload + save
 *   children     — the existing image/content to wrap
 *   className    — extra classes on wrapper
 */
import { useRef, useState } from 'react';
import { localApi } from '@/api/localApi';
import { useAuth } from '@/lib/AuthContext';
import { Pencil, Loader2 } from 'lucide-react';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 5;

export default function AdminImageUploadOverlay({
  entityName,
  recordId,
  fieldName = 'main_image',
  onUploaded,
  children,
  className = '',
}) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Non-admins: render children as-is
  if (!user || user.role !== 'admin') {
    return <div className={className}>{children}</div>;
  }

  const handleFile = async (file) => {
    if (!ACCEPTED.includes(file.type) || file.size > MAX_MB * 1024 * 1024) return;
    setLoading(true);
    try {
      const { file_url } = await localApi.integrations.Core.UploadFile({ file });
      if (entityName && recordId) {
        await localApi.entities[entityName].update(recordId, { [fieldName]: file_url });
      }
      onUploaded?.(file_url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {children}

      {/* Pencil button — bottom right corner */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        disabled={loading}
        className="absolute bottom-2 right-2 z-20 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
        title="Replace image"
      >
        {loading
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Pencil className="w-3 h-3" />}
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