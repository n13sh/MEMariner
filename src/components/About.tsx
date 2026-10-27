import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { COMPANY_INFO, FAQ_ITEMS } from '../data/marinerData';
import { Reveal } from '../lib/Reveal';
import { CountUp } from '../lib/CountUp';
import { useI18n } from '../lib/i18n';

const STATS = [
  { value: '2006', key: 'about.s1', label: 'Established in East Ahmadi' },
  { value: '7', key: 'about.s2', label: 'Service divisions' },
  { value: '6', key: 'about.s3', label: 'Runner Boats models' },
  { value: 'GCC', key: 'about.s4', label: 'Kuwait and the Gulf' },
];

const CORE = [
  ['about.c1', 'General vessel maintenance to preserve performance and condition'],
  ['about.c2', 'Engine servicing, oil changes and complete overhauls'],
  ['about.c3', 'Mechanical, electrical and electronics repairs'],
  ['about.c4', 'Dockside and on-site support for yacht owners and operators'],
  ['about.c5', 'OEM spare parts sourcing with verified compatibility'],
];

export const About: React.FC = () => {
  const { t, td, isAr } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="about" className="bg-tint py-14 lg:py-20 border-b border-line">
      <div className="container-x">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow">{t('about.eyebrow', 'About us')}</p>
          <h2 className="h-section mt-4">{t('about.title', 'Middle East Mariner, Since 2006')}</h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <Reveal>
            <p className="lead">{t('about.statement', COMPANY_INFO.posterStatement)}</p>
            <dl className="mt-8 pt-6 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
              {STATS.map((s) => (
                <div key={s.key} className="flex flex-col">
                  <dt className="font-serif italic font-semibold text-[40px] leading-[1] text-[#091415] h-[40px] flex items-end" dir="ltr">
                    <CountUp value={s.value === 'GCC' && isAr ? 'الخليج' : s.value} />
                  </dt>
                  <dd className="mt-3 text-[13px] text-ink-2 leading-[1.4]">{t(s.key, s.label)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={100} className="card card-hover p-6 sm:p-8 lg:-mt-1">
            <p className="text-[13px] font-bold uppercase tracking-[1.5px] text-ink-3">
              {t('about.motto', 'Safety · Reliability · Excellence')}
            </p>
            <ul className="dot-list mt-5">
              {CORE.map(([k, en]) => (
                <li key={k}>{t(k, en)}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h3 className="h-section">{t('about.faqTitle', 'Questions, Answered')}</h3>
            <p className="lead mt-4">{t('about.faqLead', 'The things owners ask us most. Anything else, call the desk.')}</p>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-8">
            <ul className="border-t border-line">
              {FAQ_ITEMS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <li key={f.question} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-start justify-between gap-6 py-5 text-start transition-colors duration-200 hover:text-accent"
                      aria-expanded={open}
                    >
                      <span className="text-[17px] font-semibold leading-[1.4] text-[#091415]">{td(`faq-${i}`, 'question', f.question)}</span>
                      <ChevronDown
                        className={`mt-1 w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 pe-10 text-[15px] leading-[24px] text-ink-2">{td(`faq-${i}`, 'answer', f.answer)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
