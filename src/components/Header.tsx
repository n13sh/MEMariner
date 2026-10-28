import React, { useEffect, useState } from 'react';
import { Menu, X, Phone, ChevronDown, MessageCircle, Instagram, Facebook } from 'lucide-react';
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
      className={`inline-flex items-center gap-1 h-9 px-1 text-[15px] font-medium text-white hover:text-gold transition-colors ${className}`}
      aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
      lang={isAr ? 'en' : 'ar'}
      dir={isAr ? 'ltr' : 'rtl'}
    >
      <span>{isAr ? 'En' : 'العربية'}</span>
      <ChevronDown className="w-4 h-4 opacity-80" />
    </button>
  );
};

/**
 * Single-row header that floats over the hero: logo at the start, links at the
 * end. Transparent at the top of the page, white with a shadow once scrolled.
 */
export const Header: React.FC<HeaderProps> = ({ onEnquire }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    let raf = 0;
    let lastProgress = -1;
    let isScrolled = false;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (!isScrolled && y > 40) {
        isScrolled = true;
        setScrolled(true);
      } else if (isScrolled && y < 8) {
        isScrolled = false;
        setScrolled(false);
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

  const solid = scrolled || open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solid ? 'bg-band/60 backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_24px_rgba(0,0,0,0.18)]' : 'bg-transparent'
      }`}
    >
      <div
        aria-hidden
        className="absolute top-0 start-0 h-[2px] bg-gold will-change-[width]"
        style={{ width: `${progress * 100}%` }}
      />

      <div className="container-x font-dm flex items-center justify-between h-20">
        <a href="#top" aria-label={t('nav.home', 'Middle East Mariner home')} className="shrink-0">
          <BrandLogo size="md" tone="light" />
        </a>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap text-[15px] font-medium transition-colors ${
                active === l.href ? 'text-gold' : 'text-white hover:text-gold'
              }`}
            >
              {t(l.key, l.label)}
            </a>
          ))}
          <button
            type="button"
            onClick={onEnquire}
            className="whitespace-nowrap text-[15px] font-medium text-white hover:text-gold transition-colors"
          >
            {t('nav.enquire', 'Enquire')}
          </button>
          <LangToggle />
        </nav>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <LangToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center justify-center w-10 h-10 text-white"
            aria-label={open ? t('nav.closeMenu', 'Close menu') : t('nav.openMenu', 'Open menu')}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-band text-white fade-enter overflow-y-auto">
          <div className="container-x pt-4 pb-10 flex flex-col min-h-full">
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-4 border-b border-white/15 text-[16px] font-medium text-white stage-enter"
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
                className="py-4 border-b border-white/15 text-start text-[16px] font-medium text-gold stage-enter"
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
                    className="w-11 h-11 rounded-[6px] border border-white/25 bg-white/10 text-white hover:bg-white hover:text-band flex items-center justify-center transition-colors shrink-0"
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
                    className="w-11 h-11 rounded-[6px] border border-white/25 bg-white/10 text-white hover:bg-white hover:text-band flex items-center justify-center transition-colors shrink-0"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="mt-4 text-[14px] text-white/70">
                {t('address.full', COMPANY_INFO.location.fullAddress)} · {t('hours.days', COMPANY_INFO.hours.days)}, {t('hours.time', COMPANY_INFO.hours.time)}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
