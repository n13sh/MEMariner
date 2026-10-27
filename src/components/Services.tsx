import React, { useEffect, useState } from 'react';
import { ArrowRight, X, Check } from 'lucide-react';
import { SERVICE_CATEGORIES, ServiceCategory } from '../data/marinerData';
import { Reveal } from '../lib/Reveal';
import { useI18n } from '../lib/i18n';
import type { EnquiryTabType } from './EnquirySection';

/**
 * AI-generated illustrations, one per division, each prompted from the
 * division's own description (generated once with pollinations.ai, fixed seeds,
 * and stored in public/assets/services so the site never depends on the service).
 */
const SERVICE_IMAGES: Record<string, string> = Object.fromEntries(
  SERVICE_CATEGORIES.map((c) => [c.id, `/assets/services/${c.id}.jpg`])
);

interface ServicesProps {
  onEnquire: (tab: EnquiryTabType, subject?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onEnquire }) => {
  const { t, td } = useI18n();
  const [active, setActive] = useState<ServiceCategory | null>(null);

  return (
    <section id="services" className="bg-white py-14 lg:py-20 border-b border-line">
      <div className="container-x">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow">{t('services.eyebrow', 'Marine services')}</p>
          <h2 className="h-section mt-4">{t('services.title', 'Safety. Reliability. Excellence.')}</h2>
          <p className="lead mt-4">
            {t(
              'services.lead',
              'Seven divisions covering vessel care, engine servicing, mechanical repairs, fabrication and climate systems, all from one workshop in East Ahmadi.'
            )}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 60} as="article" className="group card card-hover overflow-hidden flex flex-col">
              <div className="relative h-[240px] bg-navy overflow-hidden">
                <img
                  src={SERVICE_IMAGES[cat.id]}
                  alt={cat.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover img-zoom"
                  onError={(e) => {
                    // Fall back to yard photography if an illustration is missing
                    const img = e.currentTarget;
                    if (!img.dataset.fallback) {
                      img.dataset.fallback = '1';
                      img.src = '/assets/gallery/yard-qboat-rib.jpg';
                    }
                  }}
                />
                <span className="absolute top-4 start-4 bg-white rounded-[4px] px-3 py-2 text-[12px] font-semibold uppercase tracking-[1.5px] text-navy shadow-sm">
                  {t('services.division', 'Division')} {cat.letter}
                </span>
              </div>
              <div className="p-5">
                <h3 className="h-card transition-colors duration-300 group-hover:text-accent-strong">{td(cat.id, 'title', cat.title)}</h3>
                <p className="mt-2 text-[15px] leading-[23px] text-ink-2">{td(cat.id, 'subtitle', cat.subtitle)}</p>
              </div>
              <div className="mt-auto bg-tint-2 px-5 py-4 border-t border-line">
                <button type="button" onClick={() => setActive(cat)} className="link-caps">
                  <span>{t('services.discover', 'Discover')}</span>
                  <ArrowRight className="w-4 h-4 arrow" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <ServiceSheet
          category={active}
          onClose={() => setActive(null)}
          onBook={() => {
            onEnquire('maintenance', active.title);
            setActive(null);
          }}
        />
      )}
    </section>
  );
};

const ServiceSheet: React.FC<{ category: ServiceCategory; onClose: () => void; onBook: () => void }> = ({
  category,
  onClose,
  onBook,
}) => {
  const { t, td } = useI18n();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const services = td(category.id, 'services', category.services);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center sm:p-6 fade-enter"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-sheet-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-enter w-full sm:max-w-[680px] max-h-[92dvh] overflow-y-auto bg-white rounded-t-[8px] sm:rounded-[8px] p-6 sm:p-10 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="eyebrow">
            {t('services.division', 'Division')} {category.letter}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-[3px] border border-line hover:bg-tint flex items-center justify-center text-ink"
            aria-label={t('common.close', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <h3 id="service-sheet-title" className="h-section mt-3">
          {td(category.id, 'title', category.title)}
        </h3>
        <p className="lead mt-4">{td(category.id, 'description', category.description)}</p>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {services.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-[15px] leading-[23px]">
              <Check className="mt-1 w-4 h-4 text-accent shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
          <button type="button" onClick={onBook} className="btn-primary">
            <span>{t('services.book', 'Book this service')}</span>
            <ArrowRight className="w-4 h-4 arrow" />
          </button>
          <button type="button" onClick={onClose} className="btn-outline">
            {t('common.close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
