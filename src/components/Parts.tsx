import React from 'react';
import { Filter, Droplets, Cog, Gauge, Zap, Wind, ArrowRight } from 'lucide-react';
import { SPARE_PARTS_CATEGORIES } from '../data/marinerData';
import { Reveal } from '../lib/Reveal';
import { useI18n } from '../lib/i18n';
import type { EnquiryTabType } from './EnquirySection';

const ICONS: Record<string, React.ElementType> = {
  'engine-filtration': Filter,
  'cooling-pumps': Droplets,
  'propulsion-drivetrain': Cog,
  'steering-hydraulic-parts': Gauge,
  'electrical-navigation': Zap,
  'hvac-plumbing': Wind,
};

interface PartsProps {
  onEnquire: (tab: EnquiryTabType, subject?: string) => void;
}

export const Parts: React.FC<PartsProps> = ({ onEnquire }) => {
  const { t, td } = useI18n();
  return (
    <section id="parts" className="bg-tint py-14 lg:py-20 border-b border-line">
      <div className="container-x">
        <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t('parts.eyebrow', 'Boat parts & yacht hardware')}</p>
            <h2 className="h-section mt-4">{t('parts.title', 'Genuine Parts, Verified Fit')}</h2>
            <p className="lead mt-4">
              {t(
                'parts.lead',
                'Send us an OEM reference, engine serial number or a photo of the part. Our technical desk confirms compatibility and availability before anything is quoted.'
              )}
            </p>
          </div>
          <div className="lg:col-span-5 lg:text-end">
            <button
              type="button"
              onClick={() => onEnquire('spare-parts', 'OEM Part Number Lookup')}
              className="btn-primary"
            >
              <span>{t('parts.cta', 'Send a part number')}</span>
              <ArrowRight className="w-4 h-4 arrow" />
            </button>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SPARE_PARTS_CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.id] ?? Cog;
            return (
              <Reveal key={cat.id} delay={(i % 3) * 60} as="article" className="group card card-hover flex flex-col">
                <div className="p-6">
                  <span className="w-12 h-12 rounded-[4px] bg-tint text-accent flex items-center justify-center transition-[background-color,color,transform] duration-300 group-hover:bg-accent group-hover:text-white group-hover:-rotate-6">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="h-card mt-5">{td(cat.id, 'title', cat.title)}</h3>
                  <p className="mt-2 text-[15px] leading-[23px] text-ink-2">{td(cat.id, 'examples', cat.examples)}</p>
                </div>
                <div className="mt-auto bg-tint-2 px-6 py-4 border-t border-line">
                  <button type="button" onClick={() => onEnquire('spare-parts', cat.title)} className="link-caps">
                    <span>{t('common.enquire', 'Enquire')}</span>
                    <ArrowRight className="w-4 h-4 arrow" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
