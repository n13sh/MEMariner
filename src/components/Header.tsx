import React, { useEffect, useState } from 'react';
import { Menu, X, Phone, Languages, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { COMPANY_INFO } from '../data/marinerData';
import { useI18n } from '../lib/i18n';

export const NAV_LINKS = [
  { key: 'nav.services', label: 'Services', href: '#services' },
  { key: 'nav.parts', label: 'Parts & Hardware', href: '#parts' },
  { key: 'nav.boats', label: 'Runner Boats', href: '#boats' },
  { key: 'nav.yard', label: 'The Yard', href: '#yard' },
  { key: 'nav.surveys', label: 'Boat Surveys', href: '#surveys' },
  { key: 'nav.about', label: 'About Us', href: '#about' },
];

interface HeaderProps {
  onEnquire: () => void;
}

const LangToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isAr, toggle } = useI18n();
  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-line bg-white text-[12px] font-semibold tracking-[1px] text-ink hover:border-accent hover:text-accent transition-colors ${className}`}
      aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
      lang={isAr ? 'en' : 'ar'}
      dir={isAr ? 'ltr' : 'rtl'}
    >
      <Languages className="w-4 h-4" />
      <span>{isAr ? 'EN' : 'العربية'}</span>
    </button>
  );
};

/**
 * Centred-logo header that compacts into a single bar once the page scrolls.
 * Fixed with a static spacer so collapsing never changes the page height, and
 * hysteresis so tiny scrolls can't flip it.
 */
export const Header: React.FC<HeaderProps> = ({ onEnquire }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    let raf = 0;
    let lastProgress = -1;
    let isCompact = false;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (!isCompact && y > 200) {
        isCompact = true;
        setCompact(true);
      } else if (isCompact && y < 60) {
        isCompact = false;
        setCompact(false);
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pr = max > 0 ? Math.min(1, y / max) : 0;
      if (Math.abs(pr - lastProgress) > 0.004) {
        lastProgress = pr;
        setProgress(pr);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const sections = NAV_LINKS.map((l) => document.querySelector<HTMLElement>(l.href)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <div aria-hidden className="h-20 lg:h-[161px]" />

      <header
        className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300 ${
          compact ? 'shadow-[0_4px_24px_rgba(0,0,0,0.08)]' : 'border-b border-line'
        }`}
      >
        <div
          aria-hidden
          className="absolute top-0 start-0 h-[2px] bg-accent will-change-[width]"
          style={{ width: `${progress * 100}%` }}
        />

        {/* Mobile row */}
        <div className="lg:hidden container-x flex items-center justify-between h-20">
          <a href="#top" aria-label={t('nav.home', 'Middle East Mariner home')}>
            <BrandLogo size="md" />
          </a>
          <div className="flex items-center gap-2">
            <LangToggle />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center justify-center w-10 h-10 text-ink"
              aria-label={open ? t('nav.closeMenu', 'Close menu') : t('nav.openMenu', 'Open menu')}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop: centred logo row that folds away when compact */}
        <div
          className={`hidden lg:flex items-center justify-center overflow-hidden transition-[height,opacity] duration-400 ease-out ${
            compact ? 'h-0 opacity-0' : 'h-[104px] opacity-100 border-b border-line'
          }`}
        >
          <a href="#top" aria-label={t('nav.home', 'Middle East Mariner home')}>
            <BrandLogo size="lg" />
          </a>
        </div>

        {/* Desktop nav row */}
        <nav className="hidden lg:block" aria-label="Primary">
          <div className="container-x h-14 flex items-center">
            <div
              className={`flex items-center overflow-hidden whitespace-nowrap transition-[width,opacity] duration-400 ease-out ${
                compact ? 'w-[150px] opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <a href="#top" aria-label={t('nav.home', 'Middle East Mariner home')} className="shrink-0">
                <BrandLogo size="sm" />
              </a>
            </div>

            <div className={`flex-1 flex items-center justify-center transition-[gap] duration-300 ${compact ? 'gap-6 xl:gap-8' : 'gap-8 xl:gap-10'}`}>
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={`nav-link whitespace-nowrap text-[14px] font-medium uppercase tracking-[1.5px] transition-colors ${
                    active === l.href ? 'text-accent is-active' : 'text-ink hover:text-accent'
                  }`}
                >
                  {t(l.key, l.label)}
                </a>
              ))}
              <button
                type="button"
                onClick={onEnquire}
                className={`nav-link whitespace-nowrap text-[14px] font-medium uppercase tracking-[1.5px] text-accent hover:text-accent-strong transition-colors ${
                  compact ? 'hidden' : ''
                }`}
              >
                {t('nav.enquire', 'Enquire')}
              </button>
              {!compact && <LangToggle />}
            </div>

            <div
              className={`flex items-center justify-end gap-2 overflow-hidden transition-[width,opacity] duration-400 ease-out ${
                compact ? 'w-[260px] opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <LangToggle />
              <button type="button" onClick={onEnquire} className="btn-primary h-10 px-5 text-[14px] shrink-0">
                {t('nav.enquire', 'Enquire')}
              </button>
            </div>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-white fade-enter overflow-y-auto">
            <div className="container-x pt-4 pb-10 flex flex-col min-h-full">
              <nav className="flex flex-col" aria-label="Mobile">
                {NAV_LINKS.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-4 border-b border-line text-[15px] font-medium uppercase tracking-[1.5px] text-ink stage-enter"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {t(l.key, l.label)}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onEnquire();
                  }}
                  className="py-4 border-b border-line text-start text-[15px] font-medium uppercase tracking-[1.5px] text-accent stage-enter"
                  style={{ animationDelay: `${NAV_LINKS.length * 40}ms` }}
                >
                  {t('nav.enquire', 'Enquire')}
                </button>
              </nav>
              <div className="mt-8 stage-enter" style={{ animationDelay: '320ms' }}>
                <a href={COMPANY_INFO.contact.phoneHref} className="btn-primary w-full">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">{COMPANY_INFO.contact.phoneDisplay}</span>
                </a>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={COMPANY_INFO.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-11 rounded-[6px] bg-[#25D366] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#1fb257] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                  {COMPANY_INFO.social.instagram && (
                    <a
                      href={COMPANY_INFO.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-11 h-11 rounded-[6px] border border-line bg-white text-ink hover:text-accent hover:border-accent flex items-center justify-center transition-colors shrink-0"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {COMPANY_INFO.social.facebook && (
                    <a
                      href={COMPANY_INFO.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-11 h-11 rounded-[6px] border border-line bg-white text-ink hover:text-accent hover:border-accent flex items-center justify-center transition-colors shrink-0"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="mt-4 text-[14px] text-ink-3">
                  {t('address.full', COMPANY_INFO.location.fullAddress)} · {t('hours.days', COMPANY_INFO.hours.days)}, {t('hours.time', COMPANY_INFO.hours.time)}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
