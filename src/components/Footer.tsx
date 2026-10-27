import React from 'react';
import { Phone, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { COMPANY_INFO, SERVICE_CATEGORIES, RUNNER_BOATS_MODELS } from '../data/marinerData';
import { useI18n } from '../lib/i18n';

const Col: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-[20px] font-medium text-ink mb-5">{title}</h4>
    <ul className="space-y-3 text-[15px] text-ink-2">{children}</ul>
  </div>
);

const Round: React.FC<{ href: string; label: string; external?: boolean; children: React.ReactNode }> = ({ href, label, external, children }) => (
  <a
    href={href}
    aria-label={label}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-strong hover:-translate-y-0.5 transition-[background-color,transform] duration-200"
  >
    {children}
  </a>
);

export const Footer: React.FC = () => {
  const { t, td } = useI18n();
  return (
    <footer className="bg-white">
      <div className="container-x py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.1fr_0.9fr_0.9fr_1.3fr] gap-10">
        <div className="lg:col-span-1 sm:col-span-2">
          <BrandLogo />
          <p className="mt-5 text-[15px] leading-[24px] text-ink-2 max-w-[300px]">
            {t(
              'footer.blurb',
              'Marine engineering, OEM spare parts, on-board boat surveys and Runner Boats distribution. Serving Kuwait and the GCC from East Ahmadi since 2006.'
            )}
          </p>
        </div>

        <Col title={t('footer.services', 'Services')}>
          {SERVICE_CATEGORIES.slice(0, 5).map((c) => (
            <li key={c.id}><a href="#services" className="f-link hover:text-accent">{td(c.id, 'title', c.title)}</a></li>
          ))}
        </Col>

        <Col title={t('footer.boats', 'Runner Boats')}>
          {RUNNER_BOATS_MODELS.map((b) => (
            <li key={b.id}><a href="#boats" className="f-link hover:text-accent">{td(b.id, 'name', b.name)}</a></li>
          ))}
        </Col>

        <Col title={t('footer.company', 'Company')}>
          <li><a href="#parts" className="f-link hover:text-accent">{t('footer.parts', 'Parts & Hardware')}</a></li>
          <li><a href="#yard" className="f-link hover:text-accent">{t('footer.yard', 'The Yard')}</a></li>
          <li><a href="#surveys" className="f-link hover:text-accent">{t('footer.surveys', 'Boat Surveys')}</a></li>
          <li><a href="#about" className="f-link hover:text-accent">{t('footer.about', 'About Us')}</a></li>
          <li><a href="#contact" className="f-link hover:text-accent">{t('footer.enquire', 'Enquire')}</a></li>
        </Col>

        <Col title={t('footer.contact', 'Contact')}>
          <li><a href={COMPANY_INFO.contact.phoneHref} className="f-link hover:text-accent" dir="ltr">{COMPANY_INFO.contact.phoneDisplay}</a></li>
          <li><a href={COMPANY_INFO.contact.emailHref} className="f-link hover:text-accent [overflow-wrap:anywhere]" dir="ltr">{COMPANY_INFO.contact.email}</a></li>
          <li>{t('address.full', COMPANY_INFO.location.fullAddress)}</li>
          <li>{t('hours.days', COMPANY_INFO.hours.days)}, {t('hours.time', COMPANY_INFO.hours.time)}</li>
        </Col>
      </div>

      <div className="border-t border-line">
        <div className="container-x py-6 flex items-center gap-5">
          <span className="text-[18px] text-ink-2">{t('footer.reach', 'Reach us')}</span>
          <Round href={COMPANY_INFO.contact.phoneHref} label="Call"><Phone className="w-5 h-5" /></Round>
          <Round href={`https://wa.me/${COMPANY_INFO.contact.whatsappNumber}`} label="WhatsApp" external><MessageCircle className="w-5 h-5" /></Round>
          <Round href={COMPANY_INFO.contact.emailHref} label="Email"><Mail className="w-5 h-5" /></Round>
          {COMPANY_INFO.social.instagram && (
            <Round href={COMPANY_INFO.social.instagram} label="Instagram" external><Instagram className="w-5 h-5" /></Round>
          )}
          {COMPANY_INFO.social.facebook && (
            <Round href={COMPANY_INFO.social.facebook} label="Facebook" external><Facebook className="w-5 h-5" /></Round>
          )}
          {COMPANY_INFO.social.x && (
            <Round href={COMPANY_INFO.social.x} label="X" external>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden><path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.6l8.1-9.3L0 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.3 3.9H5.3L17.7 20Z" /></svg>
            </Round>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x py-5 text-[14px] text-ink-2">
          © {t('footer.rights', COMPANY_INFO.name)} | {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
