import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
  /** Optional video: when set, the lightbox plays it (src is used as the poster). */
  video?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ items, index, onClose, onIndex }) => {
  const { t } = useI18n();
  const item = items[index];
  const prev = () => onIndex((index - 1 + items.length) % items.length);
  const next = () => onIndex((index + 1) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-[#061d35]/92 flex items-center justify-center p-4 sm:p-10 fade-enter"
      dir="ltr"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        aria-label={t('common.close', 'Close')}
      >
        <X className="w-5 h-5" />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label={t('lightbox.prev', 'Previous')}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label={t('lightbox.next', 'Next')}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <figure key={item.video ?? item.src} className="sheet-enter max-w-[1100px] w-full" onClick={(e) => e.stopPropagation()}>
        {item.video ? (
          <video
            src={item.video}
            poster={item.src}
            controls
            autoPlay
            playsInline
            loop
            className="mx-auto max-h-[78dvh] w-auto max-w-full rounded-[4px] shadow-2xl bg-black"
            aria-label={item.alt}
          />
        ) : (
          <img src={item.src} alt={item.alt} className="mx-auto max-h-[78dvh] w-auto max-w-full rounded-[4px] shadow-2xl" />
        )}
        <figcaption className="mt-4 flex items-center justify-between text-white/80 text-[14px]">
          <span>{item.caption ?? item.alt}</span>
          <span className="tabular-nums">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
};
