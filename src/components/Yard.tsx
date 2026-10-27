import React, { useState } from 'react';
import { Maximize2, Play } from 'lucide-react';
import { Reveal } from '../lib/Reveal';
import { Lightbox, LightboxItem } from './Lightbox';
import { useI18n } from '../lib/i18n';

interface YardItem extends LightboxItem {
  key: string;
  wide: boolean;
}

const PHOTOS: YardItem[] = [
  { key: 'yard.c1', src: '/assets/gallery/yard-qboat-rib.jpg', alt: 'Aluminium Q-Boat and a RIB on trailers outside the workshop', caption: 'Q-Boat and RIB, trailer prep', wide: true },
  { key: 'yard.c2', src: '/assets/gallery/yard-maxum.jpg', alt: 'Maxum bowrider on a trailer at the East Ahmadi yard', caption: 'Bowrider, seasonal storage', wide: false },
  { key: 'yard.c3', src: '/assets/gallery/rigging-still.jpg', alt: 'Triple outboard engines being craned onto a vessel', caption: 'Triple outboard rigging', wide: false, video: '/assets/video/rigging.mp4' },
  { key: 'yard.c4', src: '/assets/gallery/workshop-walkaround.jpg', alt: 'Walkaround cruiser inside the workshop', caption: 'Inside the workshop', wide: true },
  { key: 'yard.c5', src: '/assets/gallery/outboard-service-still.jpg', alt: 'Technicians servicing an outboard engine', caption: 'Outboard service', wide: true, video: '/assets/video/outboard-service.mp4' },
];

export const Yard: React.FC = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const items = PHOTOS.map((p) => ({ ...p, caption: t(p.key, p.caption ?? '') }));

  return (
    <section id="yard" className="bg-tint py-14 lg:py-20 border-b border-line">
      <div className="container-x">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow">{t('yard.eyebrow', 'The yard')}</p>
          <h2 className="h-section mt-4">{t('yard.title', 'Built on Real Work')}</h2>
          <p className="lead mt-4">
            {t(
              'yard.lead',
              'Our workshop and yard in East Ahmadi. Haul-outs, outboard rigging, hull work and seasonal storage, handled in-house by our own technicians. Tiles marked with a play button open a short clip.'
            )}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((p, i) => (
            <Reveal
              key={p.src}
              delay={i * 60}
              as="figure"
              className={`group card card-hover overflow-hidden cursor-pointer ${p.wide ? 'col-span-2' : 'col-span-1'}`}
              onClick={() => setOpen(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen(i);
                }
              }}
              aria-label={`${p.video ? t('yard.playVideo', 'Play video') : t('yard.openPhoto', 'Open photo')}: ${p.caption}`}
            >
              <div className="relative h-[240px] sm:h-[320px] overflow-hidden bg-navy">
                {p.video ? (
                  <video
                    src={p.video}
                    poster={p.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover img-zoom"
                    aria-hidden
                  />
                ) : (
                  <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover img-zoom" />
                )}
                {p.video ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-white/90 text-navy flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-7 h-7 ms-1" fill="currentColor" />
                    </span>
                  </span>
                ) : (
                  <span className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center opacity-0 translate-y-1 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                )}
              </div>
              <figcaption className="px-4 py-3 text-[14px] text-ink-2 border-t border-line flex items-center justify-between">
                <span>{p.caption}</span>
                {p.video && <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-accent">{t('yard.video', 'Video')}</span>}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>

      {open !== null && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </section>
  );
};
