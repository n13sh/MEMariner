import React, { useEffect } from 'react';
import { X, ArrowRight, Wrench } from 'lucide-react';
import { EXPLODED_SUBSYSTEMS, SERVICE_CATEGORIES } from '../data/marinerData';
import { useI18n } from '../lib/i18n';
import { AR } from '../data/ar';
import type { EnquiryTabType } from './EnquirySection';

interface PartSheetProps {
  subsystemId: string;
  onClose: () => void;
  onEnquire: (tab: EnquiryTabType, subject?: string) => void;
}

/** Detail panel for one vessel system, opened from a marker or a click on the 3D model. */
export const PartSheet: React.FC<PartSheetProps> = ({ subsystemId, onClose, onEnquire }) => {
  const { t, td, isAr } = useI18n();
  const part = EXPLODED_SUBSYSTEMS.find((s) => s.id === subsystemId);

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

  if (!part) return null;
  const services = SERVICE_CATEGORIES.filter((c) => part.relatedServiceIds.includes(c.id));
  const telemetryLabel = (label: string) => (isAr ? (AR.data.telemetry[label] as string) ?? label : label);
  const spare = (i: number, field: 'partName' | 'oemCategory' | 'typicalApplication') => {
    const sp = part.commonSpareParts[i];
    if (!isAr) return sp[field];
    const packed = AR.data[part.id]?.[`sp${i}`] as string | undefined;
    if (!packed) return sp[field];
    const [name, cat, app] = packed.split('|');
    return field === 'partName' ? name : field === 'oemCategory' ? cat : app;
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center sm:p-6 fade-enter"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="part-sheet-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-enter w-full sm:max-w-[760px] max-h-[92dvh] overflow-y-auto bg-white rounded-t-[8px] sm:rounded-[8px] p-6 sm:p-10 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="eyebrow">
            <span dir="ltr">{part.code}</span> · {td(part.id, 'category', part.category)}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-[3px] border border-line hover:bg-tint flex items-center justify-center text-ink shrink-0"
            aria-label={t('common.close', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <h3 id="part-sheet-title" className="h-section mt-3">
          {isAr ? part.arabicName : part.name}
        </h3>
        <p className="mt-1 text-[15px] text-ink-3" dir={isAr ? 'ltr' : 'rtl'}>
          {isAr ? part.name : part.arabicName}
        </p>
        <p className="lead mt-4">{td(part.id, 'summary', part.summary)}</p>
        <p className="mt-3 text-[15px] leading-[24px] text-ink-2">{td(part.id, 'engineeringDetails', part.engineeringDetails)}</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {part.telemetryMetrics.map((m) => (
            <div key={m.label} className="rounded-[4px] bg-tint border border-line px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-ink-3">{telemetryLabel(m.label)}</p>
              <p className="mt-1 text-[14px] font-semibold text-navy leading-tight" dir="ltr">
                {m.value}
                {m.unit ? <span className="text-ink-3 font-normal"> {m.unit}</span> : null}
              </p>
            </div>
          ))}
        </div>

        <h4 className="mt-8 text-[13px] font-bold uppercase tracking-[1.5px] text-ink-3">{t('part.spares', 'Common spare parts')}</h4>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {part.commonSpareParts.map((sp, i) => (
            <li key={sp.partName} className="py-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-6">
              <div>
                <p className="text-[15px] font-semibold text-[#091415]">{spare(i, 'partName')}</p>
                <p className="text-[13px] text-ink-2">{spare(i, 'typicalApplication')}</p>
              </div>
              <span className="text-[12px] font-medium uppercase tracking-[1px] text-accent shrink-0">{spare(i, 'oemCategory')}</span>
            </li>
          ))}
        </ul>

        {services.length > 0 && (
          <>
            <h4 className="mt-8 text-[13px] font-bold uppercase tracking-[1.5px] text-ink-3">{t('part.related', 'Related services')}</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {services.map((c) => (
                <li key={c.id}>
                  <a
                    href="#services"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-[3px] border border-line bg-white px-3 py-2 text-[13px] font-medium text-ink hover:border-accent hover:text-accent transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5 text-accent" />
                    {td(c.id, 'title', c.title)}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onEnquire('spare-parts', part.name);
              onClose();
            }}
            className="btn-primary"
          >
            <span>{t('part.enquire', 'Enquire about this system')}</span>
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
