import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Move3d, MousePointerClick } from 'lucide-react';
import { ExplodedBoatCanvas, PresentationState } from './ExplodedBoatCanvas';
import { PartSheet } from './PartSheet';
import { EXPLODED_SUBSYSTEMS } from '../data/marinerData';
import { Reveal } from '../lib/Reveal';
import { useI18n } from '../lib/i18n';
import type { EnquiryTabType } from './EnquirySection';

interface VesselExplorerProps {
  onEnquire: (tab: EnquiryTabType, subject?: string) => void;
}

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

/**
 * The interactive exploded vessel in its own section: auto-rotating 3D model
 * with callouts, a slider to open it up and chips that open each system's sheet.
 */
export const VesselExplorer: React.FC<VesselExplorerProps> = ({ onEnquire }) => {
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

  const pinnedSystems = EXPLODED_SUBSYSTEMS.filter((s) => s.id !== 'interactive-inspector');
  const pinLabels = Object.fromEntries(Object.entries(PIN_LABELS).map(([id, en]) => [id, t(`pin.${id}`, en)]));

  return (
    <section id="vessel" className="bg-tint py-14 lg:py-20 border-b border-line">
      <div className="container-x grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-center">
        <Reveal>
          <p className="eyebrow">{t('vessel.eyebrow', 'Interactive vessel')}</p>
          <h2 className="h-section mt-4">{t('vessel.title', 'Every system on board, explained')}</h2>
          <p className="lead mt-4 max-w-[520px]">
            {t(
              'vessel.lead',
              'Open up a typical runner boat to see the systems we supply parts for and service: electronics, propulsion, hydraulics, climate and the hull itself. Pick a system for its common spares and the engineering behind it.'
            )}
          </p>

          <ul className="mt-7 flex flex-wrap gap-2">
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

          <div className="mt-7 flex items-center gap-4">
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
        </Reveal>

        <Reveal delay={120}>
          <div className="float-y will-change-transform">
            <div
              className="relative rounded-[8px] overflow-hidden border border-line bg-white h-[360px] sm:h-[460px] lg:h-[540px] shadow-[0_24px_60px_-30px_rgba(9,44,88,0.35)]"
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
        </Reveal>
      </div>

      {sheet && <PartSheet subsystemId={sheet} onClose={closeSheet} onEnquire={onEnquire} />}
    </section>
  );
};
