import React from 'react';
import { ArrowRight } from 'lucide-react';
import { RUNNER_BOATS_MODELS } from '../data/marinerData';
import { Reveal } from '../lib/Reveal';
import { BoatSilhouette } from './BoatSilhouette';
import { useI18n } from '../lib/i18n';
import type { EnquiryTabType } from './EnquirySection';

interface BoatsProps {
  onEnquire: (tab: EnquiryTabType, subject?: string) => void;
}

export const Boats: React.FC<BoatsProps> = ({ onEnquire }) => {
  const { t, td } = useI18n();
  return (
    <section id="boats" className="bg-white py-14 lg:py-20 border-b border-line">
      <div className="container-x">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow">{t('boats.eyebrow', 'Runner Boats · Official distribution')}</p>
          <h2 className="h-section mt-4">{t('boats.title', 'Runner Boats, 25 to 42 Feet')}</h2>
          <p className="lead mt-4">
            {t(
              'boats.lead',
              'Six hull lengths, configured to order. Specifications, engine rigging, pricing and availability are confirmed directly by our sales and engineering desk.'
            )}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RUNNER_BOATS_MODELS.map((boat, i) => (
            <Reveal key={boat.id} delay={(i % 3) * 60} as="article" className="group card card-hover overflow-hidden flex flex-col">
              <div className="relative h-[220px] text-white flex items-end px-8 pb-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d3a6e 0%, #092c58 55%, #061d35 100%)' }} dir="ltr">
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/15" />
                <div className="w-full transition-transform duration-700 ease-out group-hover:translate-x-3">
                  <BoatSilhouette scale={boat.silhouetteScale} className="w-full" />
                </div>
                <span className="absolute top-4 left-4 bg-white rounded-[4px] px-3 py-2 text-[12px] font-semibold uppercase tracking-[1.5px] text-navy">
                  {boat.lengthFt} {t('boats.ft', 'FT')}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink-3">{td(boat.id, 'tier', boat.tier)}</p>
                <h3 className="h-card mt-2">{td(boat.id, 'name', boat.name)}</h3>
                <p className="mt-2 text-[15px] leading-[23px] text-ink-2">{td(boat.id, 'summary', boat.summary)}</p>
              </div>
              <div className="mt-auto bg-tint-2 px-5 py-4 border-t border-line flex items-center justify-between">
                <span className="text-[13px] text-ink-3">{td(boat.id, 'lengthMeters', boat.lengthMeters)}</span>
                <button type="button" onClick={() => onEnquire('boats', boat.name)} className="link-caps">
                  <span>{t('common.enquire', 'Enquire')}</span>
                  <ArrowRight className="w-4 h-4 arrow" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-[14px] text-ink-3">{t('boats.note', 'Hull silhouettes are shown to relative scale.')}</p>
      </div>
    </section>
  );
};
