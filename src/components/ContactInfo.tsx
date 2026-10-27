import React from 'react';
import { Phone, Mail, MapPin, Clock, Zap, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/marinerData';
import { Reveal } from '../lib/Reveal';
import { useI18n } from '../lib/i18n';

const XIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.6l8.1-9.3L0 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.3 3.9H5.3L17.7 20Z" />
  </svg>
);

const Tile: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode; delay?: number }> = ({
  icon: Icon,
  title,
  children,
  delay = 0,
}) => (
  <Reveal delay={delay} className="card card-hover p-5 flex items-start gap-4">
    <span className="w-11 h-11 rounded-[6px] bg-tint text-accent flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5" />
    </span>
    <div className="min-w-0">
      <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink-3">{title}</p>
      <div className="mt-1 text-[16px] leading-[24px] text-ink">{children}</div>
    </div>
  </Reveal>
);

export const ContactInfo: React.FC = () => {
  const { t } = useI18n();
  const { contact, location, hours, social } = COMPANY_INFO;
  return (
    <section id="contact-info" className="bg-tint py-14 lg:py-20 border-b border-line">
      <div className="container-x">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow">{t('info.eyebrow', 'Contact information')}</p>
          <h2 className="h-section mt-4">{t('info.title', 'Reach the Desk')}</h2>
          <p className="lead mt-4">{t('info.lead', 'Call, email or message us. We are in East Ahmadi six days a week.')}</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Tile icon={Phone} title={t('info.phone', 'Phone number')}>
            <a href={contact.phoneHref} className="font-semibold hover:text-accent" dir="ltr">
              {contact.phoneDisplay}
            </a>
            <p className="text-[14px] text-ink-2">{t('hours.full', hours.fullText)}</p>
          </Tile>
          <Tile icon={Mail} title={t('info.email', 'Email address')} delay={60}>
            <a href={contact.emailHref} className="font-semibold hover:text-accent [overflow-wrap:anywhere]" dir="ltr">
              {contact.email}
            </a>
            <p className="text-[14px] text-ink-2">{t('info.desk', 'Desk support for parts, service and surveys')}</p>
          </Tile>
          <Tile icon={MapPin} title={t('info.office', 'Office & workshop')} delay={120}>
            <p className="font-semibold">{t('address.full', location.fullAddress)}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-accent hover:underline"
            >
              {t('info.maps', 'Open in Google Maps')}
            </a>
          </Tile>
          <Tile icon={Clock} title={t('info.hours', 'Working hours')} delay={180}>
            <p className="font-semibold">{t('hours.days', hours.days)}</p>
            <p className="text-[14px] text-ink-2">
              {t('hours.time', hours.time)} · {t('info.closed', `Closed ${hours.closed.split(' (')[0]}`)}
            </p>
          </Tile>
        </div>

        <Reveal delay={240} className="mt-4 card p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <span className="w-11 h-11 rounded-[6px] bg-accent text-white flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink-3">{t('info.quick', 'Quick response')}</p>
            <p className="mt-1 text-[16px] leading-[24px]">{t('info.promise', contact.responsePromise)}</p>
          </div>
          <div className="flex items-center gap-2">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full border border-line bg-white text-ink hover:text-accent hover:border-accent flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full border border-line bg-white text-ink hover:text-accent hover:border-accent flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {social.x && (
              <a href={social.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="w-11 h-11 rounded-full border border-line bg-white text-ink hover:text-accent hover:border-accent flex items-center justify-center transition-colors">
                <XIcon className="w-4 h-4" />
              </a>
            )}
            {social.whatsapp && (
              <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-11 h-11 rounded-full bg-[#25D366] text-white hover:bg-[#1fb257] flex items-center justify-center transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
