import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SURVEY_DOMAINS } from '../data/marinerData';
import { Reveal } from '../lib/Reveal';
import { useI18n } from '../lib/i18n';
import type { EnquiryTabType } from './EnquirySection';

interface SurveysProps {
  onEnquire: (tab: EnquiryTabType, subject?: string) => void;
}

export const Surveys: React.FC<SurveysProps> = ({ onEnquire }) => {
  const { t, td } = useI18n();
  return (
    <section id="surveys" className="bg-white py-14 lg:py-20 border-b border-line">
      <div className="container-x">
        <Reveal className="group rounded-[8px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-[0_24px_60px_-30px_rgba(9,44,88,0.4)]">
          <div className="relative h-[320px] lg:h-auto lg:min-h-[560px]">
            <img
              src="/assets/gallery/workshop-walkaround.jpg"
              alt="Cruiser inside the Middle East Mariner workshop"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              style={{ objectPosition: '50% 40%' }}
            />
          </div>
          <div className="bg-dark text-white p-8 sm:p-12 lg:p-14">
            <p className="text-[13px] sm:text-[15px] font-bold uppercase tracking-[1.5px] text-sky-300">
              {t('surveys.eyebrow', 'Pre-purchase & condition assessments')}
            </p>
            <h2 className="font-serif italic font-semibold leading-[1.15] tracking-[0.5px] text-[34px] sm:text-[40px] mt-4">
              {t('surveys.title', 'The 5-Point On-Board Boat Survey')}
            </h2>
            <p className="mt-4 text-[16px] leading-[24px] text-white/80">
              {t(
                'surveys.lead',
                'A structured inspection of the five systems that decide whether a boat is worth buying, keeping or fixing. Delivered as a written report.'
              )}
            </p>
            <ol className="mt-6 space-y-3">
              {SURVEY_DOMAINS.map((d, i) => (
                <Reveal as="li" key={d.id} delay={150 + i * 90} className="flex items-start gap-4 text-[16px] leading-[24px]">
                  <span className="text-sky-300 font-semibold tabular-nums">{d.number}</span>
                  <span>{td(d.id, 'title', d.title)}</span>
                </Reveal>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => onEnquire('survey', '5-Point On-Board Boat Survey')}
              className="btn-white mt-8"
            >
              <span>{t('surveys.cta', 'Request a survey')}</span>
              <ArrowRight className="w-4 h-4 arrow" />
            </button>
            <p className="mt-6 text-[13px] leading-[20px] text-white/55">
              {t(
                'surveys.disclaimer',
                'A survey documents observed condition at the time of inspection and does not constitute a warranty or guarantee of seaworthiness.'
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
