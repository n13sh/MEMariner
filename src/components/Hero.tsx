import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Move3d, MousePointerClick } from 'lucide-react';
import { ExplodedBoatCanvas, PresentationState } from './ExplodedBoatCanvas';
import { PartSheet } from './PartSheet';
import { EXPLODED_SUBSYSTEMS } from '../data/marinerData';
import { useI18n } from '../lib/i18n';
import type { EnquiryTabType } from './EnquirySection';

interface HeroProps {
  onEnquire: (tab: EnquiryTabType, subject?: string) => void;
}

const HIGHLIGHTS = [
  ['hero.h1', 'OEM spare parts'],
  ['hero.h2', 'Engine servicing'],
  ['hero.h3', 'On-board surveys'],
  ['hero.h4', 'Runner Boats 25–42 FT'],
];

const SHORT: Record<string, string> = {
  'assembled-overview': 'Full vessel',
  'radar-electronics': 'Electronics & T-top',
  'twin-propulsion': 'Engines & propellers',
  'steering-hydraulics': 'Hydraulics & trim',
  'hvac-auxiliary': 'A/C, fuel & pumps',
  'hull-fabrication': 'Hull & stringers',
};

const PIN_LABELS: Record<string, string> = {
  'radar-electronics': 'Electronics & Radar',
  'twin-propulsion': 'Engines & Propellers',
  'steering-hydraulics': 'Hydraulics & Trim',
  'hvac-auxiliary': 'Marine A/C & Fuel',
  'hull-fabrication': 'Hull & Stringers',
  'assembled-overview': 'Deck & Hardware',
};

export const Hero: React.FC<HeroProps> = ({ onEnquire }) => {
  const { t } = useI18n();
  const presentationRef = useRef<PresentationState>({ yaw: -0.4, explode: 0 });
  const [explode, setExplode] = useState(0);
  const [touched, setTouched] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [sheet, setSheet] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) presentationRef.current.yaw += dt * 0.12;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  useEffect(() => {
    presentationRef.current.explode = explode / 100;
  }, [explode]);

  const openPart = useCallback((id: string) => {
    setSelected(id);
    setSheet(id);
    setPaused(true);
    setExplode((v) => (v < 35 ? 55 : v));
  }, []);

  const closeSheet = useCallback(() => {
    setSheet(null);
    setPaused(false);
  }, []);

  const d = (ms: number) => ({ animationDelay: `${ms}ms` });
  const pinnedSystems = EXPLODED_SUBSYSTEMS.filter((s) => s.id !== 'interactive-inspector');
  const pinLabels = Object.fromEntries(Object.entries(PIN_LABELS).map(([id, en]) => [id, t(`pin.${id}`, en)]));

  return (
    <section id="hero" className="relative bg-white border-b border-line overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -end-[10%] top-[10%] w-[55%] h-[80%] rounded-full opacity-70 blur-3xl will-change-transform"
        style={{ background: 'radial-gradient(closest-side, #e4f0fa, transparent)' }}
      />

      <div className="container-x relative py-12 lg:py-[70px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="eyebrow stage-enter" style={d(0)}>
            {t('hero.eyebrow', 'Boat parts, yacht hardware & marine engineering in Kuwait')}
          </p>
          <h1 className="h-hero mt-6 stage-enter" style={d(120)}>
            {t('hero.title1', 'Trusted Marine Equipment')}
            <br className="hidden sm:block" /> {t('hero.title2', 'and Services')}
          </h1>
          <p className="lead mt-6 max-w-[560px] stage-enter" style={d(240)}>
            {t(
              'hero.lead',
              'Discover quality boat parts, marine engines and yacht hardware sourced from leading manufacturers, with expert servicing and on-board surveys from our workshop in East Ahmadi. Serving Kuwait and the GCC since 2006.'
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 stage-enter" style={d(360)}>
            <button
              type="button"
              onClick={() => onEnquire('spare-parts', 'Marine Parts & Accessories')}
              className="btn-primary"
            >
              <span>{t('hero.cta', 'Enquire now')}</span>
              <ArrowRight className="w-4 h-4 arrow" />
            </button>
            <a href="#services" className="link-caps">
              <span>{t('hero.services', 'Our services')}</span>
              <ArrowRight className="w-4 h-4 arrow" />
            </a>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 stage-enter" style={d(480)}>
            {HIGHLIGHTS.map(([k, en]) => (
              <li key={k} className="flex items-center gap-2 text-[14px] text-ink-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {t(k, en)}
              </li>
            ))}
          </ul>
        </div>

        <div className="stage-enter" style={d(300)}>
          <div className="float-y will-change-transform">
            <div
              className="relative rounded-[8px] overflow-hidden border border-line bg-tint h-[360px] sm:h-[460px] lg:h-[520px] shadow-[0_24px_60px_-30px_rgba(9,44,88,0.35)]"
              onPointerDown={() => setTouched(true)}
              dir="ltr"
            >
              <ExplodedBoatCanvas
                theme="light"
                chromeless
                showPins
                pinLabels={pinLabels}
                presentationRef={presentationRef}
                scrollProgress={0}
                activeStageIndex={0}
                selectedSubsystemId={selected}
                onSelectSubsystem={openPart}
                manualExplodeOverride={null}
                setManualExplodeOverride={() => {}}
                viewMode="pbr"
                setViewMode={() => {}}
              />
              <div
                className={`pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5 transition-opacity duration-500 ${
                  touched ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className="inline-flex items-center gap-2 rounded-[4px] bg-white/90 border border-line px-3 py-1.5 text-[12px] font-medium uppercase tracking-[1.5px] text-ink-2">
                  <Move3d className="w-3.5 h-3.5 text-accent" />
                  {t('hero.drag', 'Drag to rotate')}
                </span>
                <span className="inline-flex items-center gap-2 rounded-[4px] bg-white/90 border border-line px-3 py-1.5 text-[12px] font-medium uppercase tracking-[1.5px] text-ink-2">
                  <MousePointerClick className="w-3.5 h-3.5 text-accent" />
                  {t('hero.click', 'Click a part for details')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="text-[13px] font-medium uppercase tracking-[1.5px] text-ink-2 whitespace-nowrap">
              {t('hero.open', 'Open the vessel')}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={explode}
              onChange={(e) => setExplode(Number(e.target.value))}
              aria-label={t('hero.open', 'Open the vessel')}
              className="slider flex-1 cursor-pointer"
              dir="ltr"
              style={{ '--pct': `${explode}%` } as React.CSSProperties}
            />
            <span className="text-[14px] font-medium tabular-nums w-10 text-end">{explode}%</span>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {pinnedSystems.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => openPart(s.id)}
                  className={`rounded-[3px] border px-3 py-1.5 text-[12px] font-medium tracking-[0.5px] transition-colors ${
                    selected === s.id
                      ? 'bg-accent border-accent text-white'
                      : 'bg-white border-line text-ink hover:border-accent hover:text-accent'
                  }`}
                >
                  <span dir="ltr">{s.code}</span> · {t(`hero.short.${s.id}`, SHORT[s.id] ?? s.name)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {sheet && <PartSheet subsystemId={sheet} onClose={closeSheet} onEnquire={onEnquire} />}
    </section>
  );
};
