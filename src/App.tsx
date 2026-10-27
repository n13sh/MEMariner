import React, { useState, useEffect, useRef } from 'react';
import {
  COMPANY_INFO,
  EXPLODED_SUBSYSTEMS,
  SERVICE_CATEGORIES,
  RUNNER_BOATS_MODELS,
  SURVEY_DOMAINS,
} from './data/marinerData';
import { BrandLogo } from './components/BrandLogo';
import {
  ExplodedBoatCanvas,
  RenderViewMode,
} from './components/ExplodedBoatCanvas';
import { EnquirySection, EnquiryTabType } from './components/EnquirySection';
import { AIVoiceConcierge } from './components/AIVoiceConcierge';
import {
  PhoneCall,
  Sun,
  Moon,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  Eye,
  MessageCircle,
} from 'lucide-react';

const EQUIPMENT_SHOWCASE = [
  {
    id: 'engines-outboards',
    title: 'Marine Engines & Propulsion',
    category: 'Outboard & Inboard Systems',
    description:
      'Complete engine diagnostics, oil and filter kits, raw-water impellers, stainless propellers, and full mechanical overhauls.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'hydraulic-steering',
    title: 'Steering, Hydraulics & Stabilizers',
    category: 'Control & Attitude Hardware',
    description:
      'Hydraulic steering cylinders, helm pumps, trim tab actuators, shaft seals, and precision stern gear hardware.',
    image:
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'marine-electronics',
    title: 'Navigation & Marine Electronics',
    category: 'Radar, Sonar & Electrical',
    description:
      'Marine radar domes, chartplotters, transducers, AGM battery banks, digital throttle controls, and waterproof wiring.',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'marine-hvac',
    title: 'Marine Air Conditioning & Pumps',
    category: 'High-Ambient Gulf Climate Systems',
    description:
      'Self-contained and chilled-water marine A/C units, seawater circulation pumps, bilge systems, and plumbing hardware.',
    image:
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'deck-hardware',
    title: 'Yacht Hardware, Fiberglass & Anodes',
    category: 'Structural & Deck Accessories',
    description:
      '316 stainless deck hardware, windlasses, sacrificial anodes, marine gelcoat refinishing, and custom fabrication.',
    image:
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80',
  },
];

export function App() {
  // Light / Dark Mode Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mem_theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('mem_theme', theme);
  }, [theme]);

  const isLight = theme === 'light';

  // Scrollytelling state for the 3D Exploded Boat section
  const scrollySectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string | null>(
    null
  );
  const [manualExplodeOverride, setManualExplodeOverride] = useState<
    number | null
  >(null);
  const [viewMode, setViewMode] = useState<RenderViewMode>('pbr');

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(
    null
  );

  // Enquiry state
  const [enquiryTab, setEnquiryTab] = useState<EnquiryTabType>('spare-parts');
  const [prefillSubject, setPrefillSubject] = useState('');

  // Scroll listener for 3D Boat Animation
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollySectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = Math.max(1, rect.height - viewportHeight);
      const clamped = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      setScrollProgress(clamped);

      const matchedStage = EXPLODED_SUBSYSTEMS.findIndex(
        (s) => clamped >= s.scrollRange[0] && clamped <= s.scrollRange[1]
      );
      if (matchedStage !== -1) {
        setActiveStageIndex(matchedStage);
      } else if (clamped > 0.9) {
        setActiveStageIndex(EXPLODED_SUBSYSTEMS.length - 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerEnquiry = (tab: EnquiryTabType, subject = '') => {
    setEnquiryTab(tab);
    setPrefillSubject(subject);
    setMobileMenuOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Jump to a specific boat subsystem smoothly
  const jumpToBoatStage = (stageIdx: number, subsystemId?: string) => {
    const el = scrollySectionRef.current;
    if (!el) return;
    if (subsystemId) setSelectedSubsystemId(subsystemId);
    setManualExplodeOverride(null);
    const stage = EXPLODED_SUBSYSTEMS[stageIdx];
    const targetRatio = stage
      ? (stage.scrollRange[0] + stage.scrollRange[1]) * 0.5
      : 0;
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const scrollableDistance = Math.max(1, el.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: absoluteTop + scrollableDistance * targetRatio,
      behavior: 'smooth',
    });
  };

  const cleanScrollSteps = EXPLODED_SUBSYSTEMS.slice(0, 6);

  return (
    <div
      id="top"
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isLight ? 'bg-white text-[#092C58]' : 'bg-[#061326] text-slate-100'
      }`}
    >
      {/* =====================================================================
          1. RESPONSIVE EDITORIAL HEADER (Sticky top-0, 64px mobile / 80px desktop)
      ===================================================================== */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
          isLight
            ? 'bg-white/92 border-slate-200/80'
            : 'bg-[#061326]/90 border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <a href="#top" className="focus:outline-none shrink-0">
            <BrandLogo lightTheme={isLight} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Boat Anatomy', href: '#boat-anatomy' },
              { label: 'Parts & Hardware', href: '#parts' },
              { label: 'Runner Boats', href: '#boats' },
              { label: 'Services & Surveys', href: '#services' },
              { label: 'About', href: '#about' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold tracking-wide transition hover:text-[#1B75BC] ${
                  isLight ? 'text-[#092C58]' : 'text-slate-200'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Theme Toggle + Phone + Enquire CTA + Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full h-10 w-10 sm:w-auto px-0 sm:px-3.5 text-xs font-bold border transition ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-[#092C58] hover:bg-slate-200'
                  : 'bg-white/10 border-white/15 text-sky-300 hover:bg-white/15'
              }`}
              aria-label="Toggle Dark and Light Mode"
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? (
                <>
                  <Moon className="w-4 h-4 text-[#092C58] shrink-0" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            <a
              href={COMPANY_INFO.contact.phoneHref}
              className={`hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full transition ${
                isLight
                  ? 'text-[#092C58] hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#1B75BC]" />
              <span>{COMPANY_INFO.contact.phoneDisplay}</span>
            </a>

            <button
              type="button"
              onClick={() => triggerEnquiry('spare-parts')}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1B75BC] hover:bg-[#092C58] text-white h-10 px-3.5 sm:px-5 text-xs font-bold tracking-wide transition shadow-md active:scale-95"
            >
              <span>Enquire</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-current/15 active:scale-95"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer (Fixed top-16 with scroll protection) */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden fixed inset-x-0 top-16 sm:top-20 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain z-50 px-4 pt-3 pb-8 border-b space-y-3 shadow-2xl backdrop-blur-2xl transition-all ${
              isLight
                ? 'bg-white/98 border-slate-200 text-[#092C58]'
                : 'bg-[#061326]/98 border-white/10 text-white'
            }`}
          >
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '3D Boat Anatomy', href: '#boat-anatomy' },
                { label: 'Parts & Hardware', href: '#parts' },
                { label: 'Runner Boats', href: '#boats' },
                { label: 'Services & Surveys', href: '#services' },
                { label: 'About Us', href: '#about' },
                { label: 'Contact Advisor', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-3.5 py-3 text-xs font-bold transition flex items-center justify-between ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-current/10">
              <a
                href={COMPANY_INFO.contact.phoneHref}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#092C58] text-white py-3 text-xs font-bold shadow active:scale-95 transition"
              >
                <PhoneCall className="w-4 h-4 text-sky-300" />
                <span>Call Phone</span>
              </a>

              <a
                href={`https://wa.me/${COMPANY_INFO.contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white py-3 text-xs font-bold shadow active:scale-95 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          2. MOBILE-OPTIMIZED SCROLL-DRIVEN 3D EXPLODED BOAT SECTION
          - Canvas sticks directly below the sticky header (top-16 sm:top-20)
          - Height is calc(100dvh - header) so zero canvas is obscured
          - Controls are completely visible and accessible
      ===================================================================== */}
      <section
        id="boat-anatomy"
        ref={scrollySectionRef}
        className="relative h-[400vh] sm:h-[440vh]"
      >
        {/* Sticky 3D Boat Viewport */}
        <div className="sticky top-16 sm:top-20 h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] w-full overflow-hidden">
          <ExplodedBoatCanvas
            theme={theme}
            scrollProgress={scrollProgress}
            activeStageIndex={activeStageIndex}
            selectedSubsystemId={selectedSubsystemId}
            onSelectSubsystem={(id) => {
              setSelectedSubsystemId(id);
              const foundIndex = EXPLODED_SUBSYSTEMS.findIndex(
                (s) => s.id === id
              );
              if (foundIndex !== -1) {
                jumpToBoatStage(foundIndex, id);
              }
            }}
            manualExplodeOverride={manualExplodeOverride}
            setManualExplodeOverride={setManualExplodeOverride}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        {/* Editorial Scroll Cards: Positioned cleanly above mobile bottom bar */}
        <div className="relative z-10 -mt-[calc(100dvh-4rem)] sm:-mt-[calc(100dvh-5rem)] pointer-events-none">
          {cleanScrollSteps.map((step, idx) => (
            <div
              key={step.id}
              className="h-[75dvh] sm:h-[72vh] flex items-end sm:items-center pb-24 sm:pb-0 px-3 sm:px-8 lg:px-16 max-w-7xl mx-auto"
            >
              <div
                className={`pointer-events-auto w-full sm:max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
                  isLight
                    ? 'bg-white/92 border-slate-200/90 text-[#092C58]'
                    : 'bg-[#061326]/90 border-white/15 text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#1B75BC]">
                    {idx === 0
                      ? 'Middle East Mariner • Kuwait'
                      : `0${idx} / 05 • ${step.category}`}
                  </span>

                  {/* Step Progress Dots */}
                  <div className="flex items-center gap-1">
                    {cleanScrollSteps.map((s, dotIdx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => jumpToBoatStage(dotIdx, s.id)}
                        className={`h-1.5 rounded-full transition-all ${
                          dotIdx === idx
                            ? 'w-4 bg-[#1B75BC]'
                            : 'w-1.5 bg-current opacity-25'
                        }`}
                        aria-label={`Jump to stage ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <h1 className="font-['Outfit'] text-xl sm:text-3xl font-bold tracking-tight leading-snug mb-1.5 sm:mb-3">
                  {idx === 0
                    ? 'Boat Parts, Yacht Hardware & Marine Engineering'
                    : step.name}
                </h1>

                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-3.5 sm:mb-5 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  {idx === 0
                    ? 'Quality boat parts, marine engines, and technical support in Kuwait since 2006. Scroll down to watch the boat open up.'
                    : step.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      triggerEnquiry(
                        'spare-parts',
                        idx === 0 ? 'Marine Parts & Accessories' : step.name
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1B75BC] hover:bg-[#092C58] text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold tracking-wide transition active:scale-95 shadow-md"
                  >
                    <span>
                      {idx === 0
                        ? 'Enquire About Parts'
                        : 'Enquire About System'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {idx === 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#1B75BC]">
                      <ChevronDown className="w-4 h-4 animate-bounce" />
                      <span>Scroll to Open</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3. TRUSTED MARINE EQUIPMENT & ACCESSORIES
      ===================================================================== */}
      <section
        id="parts"
        className={`py-16 sm:py-24 transition-colors duration-300 ${
          isLight ? 'bg-white text-[#092C58]' : 'bg-[#071830] text-white'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#1B75BC] block mb-2.5">
              Boat Parts, Yacht Hardware &amp; Accessories
            </span>
            <h2 className="font-['Outfit'] text-2xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
              Trusted Marine Equipment and Spare Parts
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              Discover quality boat parts, yacht hardware, propulsion components,
              and marine climate systems with expert technical support in East
              Ahmadi, Kuwait to help maintain and upgrade your vessel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {EQUIPMENT_SHOWCASE.map((item) => (
              <div
                key={item.id}
                className={`group rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isLight
                    ? 'bg-[#F8FAFC] border-slate-200/80 hover:shadow-xl'
                    : 'bg-[#051020] border-white/10 hover:border-sky-400/40'
                }`}
              >
                <div>
                  <div className="h-44 sm:h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 sm:p-7">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#1B75BC] block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-['Outfit'] text-lg sm:text-xl font-bold mb-2">
                      {item.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 sm:px-7 sm:pb-7">
                  <button
                    type="button"
                    onClick={() => triggerEnquiry('spare-parts', item.title)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B75BC] py-1 active:translate-x-1 transition-transform"
                  >
                    <span>Enquire Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. RUNNER BOATS COLLECTION (25 FT – 42 FT)
      ===================================================================== */}
      <section
        id="boats"
        className={`py-16 sm:py-24 transition-colors duration-300 ${
          isLight
            ? 'bg-[#F4F8FC] text-[#092C58] border-t border-slate-200/80'
            : 'bg-[#051020] text-white border-t border-white/10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-14">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#1B75BC] block mb-2">
                Boat Distribution • Kuwait &amp; GCC
              </span>
              <h2 className="font-['Outfit'] text-2xl sm:text-4xl font-bold tracking-tight">
                Runner Boats Collection (25 FT – 42 FT)
              </h2>
            </div>
            <p
              className={`text-xs sm:text-sm max-w-md ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              Available across six verified hull lengths. Contact our advisor
              desk for official build specifications, engine rigging, and
              availability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {RUNNER_BOATS_MODELS.map((boat) => (
              <div
                key={boat.id}
                className={`group rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isLight
                    ? 'bg-white border-slate-200/90 hover:shadow-xl'
                    : 'bg-[#081b36] border-white/10 hover:border-sky-400/40'
                }`}
              >
                <div>
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={boat.imageUrl}
                      alt={boat.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-[#092C58]/90 text-white px-3 py-1 text-xs font-bold">
                      {boat.lengthFt} FT
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="text-xs font-semibold text-[#1B75BC] mb-1">
                      {boat.tier}
                    </div>
                    <h3 className="font-['Outfit'] text-xl sm:text-2xl font-bold mb-2">
                      Runner — {boat.name}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      {boat.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 flex items-center justify-between border-t border-current/5">
                  <span className="text-[11px] sm:text-xs opacity-60">
                    Specs &amp; Pricing on Request
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerEnquiry('boats', boat.name)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1B75BC] hover:bg-[#092C58] text-white px-4 py-2 text-xs font-bold transition active:scale-95"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. TECHNICAL SERVICES & 5-POINT BOAT SURVEYS
      ===================================================================== */}
      <section
        id="services"
        className={`py-16 sm:py-24 transition-colors duration-300 ${
          isLight
            ? 'bg-white text-[#092C58] border-t border-slate-200/80'
            : 'bg-[#071830] text-white border-t border-white/10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#1B75BC] block mb-2">
              Safety • Reliability • Excellence
            </span>
            <h2 className="font-['Outfit'] text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              Marine Engineering, Maintenance &amp; Boat Surveys
            </h2>
            <p
              className={`text-xs sm:text-base ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              Tap any division below to view our full technical checklist or
              request a service appointment.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-2.5 sm:space-y-3 mb-12 sm:mb-16">
            {SERVICE_CATEGORIES.map((cat) => {
              const isOpen = expandedServiceId === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`rounded-2xl border transition-colors overflow-hidden ${
                    isLight
                      ? 'bg-[#F8FAFC] border-slate-200'
                      : 'bg-[#051020] border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedServiceId(isOpen ? null : cat.id)
                    }
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B75BC] block">
                        Division {cat.letter}
                      </span>
                      <h3 className="font-['Outfit'] text-base sm:text-xl font-bold">
                        {cat.title}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#1B75BC] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-current/10">
                      <p
                        className={`text-xs sm:text-sm mb-4 ${
                          isLight ? 'text-slate-600' : 'text-slate-300'
                        }`}
                      >
                        {cat.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                        {cat.services.map((srv) => (
                          <div
                            key={srv}
                            className="flex items-center gap-2 text-xs font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#1B75BC] shrink-0" />
                            <span>{srv}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerEnquiry('maintenance', cat.title)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1B75BC] text-white px-5 py-2.5 text-xs font-bold active:scale-95 transition"
                      >
                        <span>Book {cat.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 5-Point Boat Survey Strip */}
          <div
            className={`rounded-2xl sm:rounded-3xl p-5 sm:p-10 border ${
              isLight
                ? 'bg-[#092C58] text-white border-[#092C58]'
                : 'bg-[#051020] text-white border-sky-400/30'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-sky-300 block mb-1">
                  Pre-Purchase &amp; Condition Assessments
                </span>
                <h3 className="font-['Outfit'] text-xl sm:text-3xl font-bold">
                  5-Point On-Board Boat Surveys
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  triggerEnquiry('survey', '5-Point On-Board Boat Survey')
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#092C58] hover:bg-sky-100 px-6 py-3 text-xs font-bold transition active:scale-95"
              >
                <span>Request a Boat Survey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-5 sm:mb-6">
              {SURVEY_DOMAINS.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl sm:rounded-2xl bg-white/10 p-3.5 sm:p-4 border border-white/10 flex sm:block items-center gap-3"
                >
                  <div className="text-xs font-bold text-sky-300 sm:mb-1 shrink-0">
                    {d.number}
                  </div>
                  <div className="font-['Outfit'] font-bold text-xs sm:text-sm">
                    {d.title}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              Includes a structured inspection report covering Engines, Hull,
              Stability, Electronics, and Safety Equipment. Note: A survey
              documents observed condition and does not guarantee vessel safety
              or seaworthiness.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CONCISE ABOUT SECTION & BRAND POSTER
      ===================================================================== */}
      <section
        id="about"
        className={`py-16 sm:py-20 transition-colors duration-300 ${
          isLight
            ? 'bg-white text-[#092C58] border-t border-slate-200/80'
            : 'bg-[#061326] text-white border-t border-white/10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#1B75BC] block">
                Established 2006 • East Ahmadi, Kuwait
              </span>
              <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold tracking-tight">
                About Middle East Mariner
              </h2>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}
              >
                {COMPANY_INFO.posterStatement}
              </p>
              <button
                type="button"
                onClick={() => setPosterModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1B75BC] hover:underline pt-1"
              >
                <Eye className="w-4 h-4" />
                <span>View Official Company Overview Poster</span>
              </button>
            </div>

            <div className="lg:col-span-5">
              <div
                onClick={() => setPosterModalOpen(true)}
                className="rounded-2xl overflow-hidden border border-current/10 shadow-lg cursor-pointer hover:opacity-95 transition"
              >
                <img
                  src="/assets/company-poster.jpeg"
                  alt="Middle East Mariner Poster"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. TALK TO A MARINE ADVISOR (ENQUIRY & CONTACT SECTION)
      ===================================================================== */}
      <EnquirySection
        theme={theme}
        activeTab={enquiryTab}
        setActiveTab={setEnquiryTab}
        prefillSubject={prefillSubject}
      />

      {/* =====================================================================
          8. CLEAN FOOTER (With Mobile Sticky Bar Clearance pb-28)
      ===================================================================== */}
      <footer
        className={`pt-10 pb-28 sm:py-12 border-t text-xs transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-500'
            : 'bg-[#030914] border-white/10 text-slate-400'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo compact lightTheme={isLight} />
          <div className="text-center sm:text-right">
            <div className="font-semibold">
              {COMPANY_INFO.location.fullAddress} •{' '}
              {COMPANY_INFO.contact.phoneDisplay}
            </div>
            <div className="mt-1">
              © {new Date().getFullYear()} {COMPANY_INFO.name} (Est. 2006). All
              rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Poster Lightbox Modal */}
      {posterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setPosterModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#061326] rounded-2xl p-2 sm:p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPosterModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white"
              aria-label="Close Poster"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src="/assets/company-poster.jpeg"
              alt="Middle East Mariner Poster"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar + Bilingual AI Concierge */}
      <AIVoiceConcierge
        theme={theme}
        onOpenEnquiryTab={(tab) => triggerEnquiry(tab)}
      />
    </div>
  );
}

export default App;
