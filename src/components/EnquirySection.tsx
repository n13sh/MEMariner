import React, { useEffect, useState } from 'react';
import { COMPANY_INFO, RUNNER_BOATS_MODELS } from '../data/marinerData';
import { Phone, Mail, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Reveal } from '../lib/Reveal';
import { useI18n } from '../lib/i18n';

export type EnquiryTabType = 'spare-parts' | 'maintenance' | 'boats' | 'survey';

interface EnquirySectionProps {
  activeTab: EnquiryTabType;
  setActiveTab: (tab: EnquiryTabType) => void;
  prefillSubject: string;
}

const TYPES: { id: EnquiryTabType; label: string }[] = [
  { id: 'spare-parts', label: 'Boat parts & hardware' },
  { id: 'maintenance', label: 'Service & maintenance' },
  { id: 'boats', label: 'Runner Boats' },
  { id: 'survey', label: 'On-board boat survey' },
];

const PROMISES = [
  ['contact.p1', 'Response within one working day'],
  ['contact.p2', 'Compatibility checked against your engine or hull before quoting'],
  ['contact.p3', 'Workshop in East Ahmadi plus dockside support across Kuwait'],
  ['contact.p4', 'Genuine OEM parts, sourced with verified fit'],
  ['contact.p5', 'Clear written quotations and survey reports'],
];

export const EnquirySection: React.FC<EnquirySectionProps> = ({ activeTab, setActiveTab, prefillSubject }) => {
  const { t, td } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topicDetail, setTopicDetail] = useState('');
  const [message, setMessage] = useState('');
  const [submittedLinks, setSubmittedLinks] = useState<{ mailto: string; whatsapp: string } | null>(null);

  useEffect(() => {
    if (prefillSubject) {
      setTopicDetail(prefillSubject);
      setSubmittedLinks(null);
    }
  }, [prefillSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryLabel = TYPES.find((x) => x.id === activeTab)?.label ?? 'Enquiry';
    const subject = `${categoryLabel} — ${topicDetail || name}`;
    const body = [
      `Middle East Mariner Enquiry`,
      `Category: ${categoryLabel}`,
      `Item / Model / Part: ${topicDetail || 'General Enquiry'}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Details: ${message || 'Please contact me regarding this requirement.'}`,
    ].join('\n');
    setSubmittedLinks({
      mailto: `mailto:${COMPANY_INFO.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      whatsapp: `https://wa.me/${COMPANY_INFO.contact.whatsappNumber}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`,
    });
  };

  const topicLabel = t(
    `form.topic.${activeTab}`,
    activeTab === 'boats'
      ? 'Runner Boats model'
      : activeTab === 'spare-parts'
      ? 'Part name or OEM number'
      : activeTab === 'survey'
      ? 'Vessel and location'
      : 'Vessel or service type'
  );

  return (
    <section id="contact" className="bg-white py-14 lg:py-20 border-b border-line">
      <div className="container-x grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <Reveal>
          <h2 className="h-section">{t('contact.title', 'Talk to a Marine Advisor')}</h2>
          <p className="lead mt-4 max-w-[560px]">
            {t(
              'contact.lead',
              'Connect with our team for guidance on parts, servicing, surveys and the Runner Boats range, with pricing and specifications confirmed for your vessel.'
            )}
          </p>
          <ul className="dot-list mt-6">
            {PROMISES.map(([k, en]) => (
              <li key={k}>{t(k, en)}</li>
            ))}
          </ul>

          <ul className="mt-8 pt-6 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-5 text-[15px]">
            <li className="flex items-start gap-3">
              <Phone className="mt-1 w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-[12px] uppercase tracking-[1.5px] text-ink-3">{t('contact.phone', 'Phone')}</p>
                <a href={COMPANY_INFO.contact.phoneHref} className="font-semibold hover:text-accent" dir="ltr">{COMPANY_INFO.contact.phoneDisplay}</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-1 w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-[12px] uppercase tracking-[1.5px] text-ink-3">{t('contact.email', 'Email')}</p>
                <a href={COMPANY_INFO.contact.emailHref} className="font-semibold hover:text-accent [overflow-wrap:anywhere]" dir="ltr">{COMPANY_INFO.contact.email}</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-[12px] uppercase tracking-[1.5px] text-ink-3">{t('contact.workshop', 'Workshop')}</p>
                <p className="font-semibold">{t('address.full', COMPANY_INFO.location.fullAddress)}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-1 w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-[12px] uppercase tracking-[1.5px] text-ink-3">{t('contact.hours', 'Hours')}</p>
                <p className="font-semibold">{t('hours.days', COMPANY_INFO.hours.days)}, {t('hours.time', COMPANY_INFO.hours.time)}</p>
              </div>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={handleSubmit} className="card rounded-[8px] p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label" htmlFor="enq-name">{t('form.name', 'Full name')} *</label>
                <input id="enq-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="field" />
              </div>
              <div>
                <label className="label" htmlFor="enq-phone">{t('form.phone', 'Mobile number')} *</label>
                <input id="enq-phone" type="tel" required autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="field" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label" htmlFor="enq-email">{t('form.email', 'Email address')} *</label>
                <input id="enq-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" dir="ltr" />
              </div>
              <div>
                <label className="label" htmlFor="enq-type">{t('form.type', 'Enquiry type')} *</label>
                <select
                  id="enq-type"
                  value={activeTab}
                  onChange={(e) => {
                    setActiveTab(e.target.value as EnquiryTabType);
                    setSubmittedLinks(null);
                  }}
                  className="field"
                >
                  {TYPES.map((x) => (
                    <option key={x.id} value={x.id}>{t(`form.type.${x.id}`, x.label)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="enq-topic">{topicLabel}</label>
              {activeTab === 'boats' ? (
                <select id="enq-topic" value={topicDetail} onChange={(e) => setTopicDetail(e.target.value)} className="field">
                  <option value="">{t('form.selectModel', 'Select a model')}</option>
                  {RUNNER_BOATS_MODELS.map((m) => (
                    <option key={m.id} value={m.name}>{td(m.id, 'name', m.name)}</option>
                  ))}
                </select>
              ) : (
                <input id="enq-topic" type="text" value={topicDetail} onChange={(e) => setTopicDetail(e.target.value)} className="field" />
              )}
            </div>
            <div>
              <label className="label" htmlFor="enq-msg">{t('form.message', 'Requirement / questions')} *</label>
              <textarea id="enq-msg" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="field h-auto py-3 resize-y min-h-[110px]" />
            </div>
            <button type="submit" className="btn-primary w-full">
              <span>{t('form.submit', 'Submit')}</span>
              <ArrowRight className="w-4 h-4 arrow" />
            </button>
            <p className="text-[12px] leading-[18px] text-ink-3 text-center">
              {t('form.note1', 'Your enquiry is prepared as a message to')} <span dir="ltr">{COMPANY_INFO.contact.email}</span>{' '}
              {t('form.note2', 'or WhatsApp')} <span dir="ltr">{COMPANY_INFO.contact.phoneDisplay}</span>. {t('form.note3', 'Nothing is sent until you choose one.')}
            </p>

            {submittedLinks && (
              <div className="sheet-enter rounded-[4px] bg-tint border border-line p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[14px]">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span>{t('form.ready', 'Your enquiry is ready. Send it by email or WhatsApp.')}</span>
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 shrink-0">
                  <a href={submittedLinks.mailto} className="btn-outline h-10 px-4 text-[14px]">{t('form.sendEmail', 'Email')}</a>
                  <a href={submittedLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="btn h-10 px-4 text-[14px] bg-[#25D366] text-white hover:bg-[#1fb257]">{t('form.sendWhatsApp', 'WhatsApp')}</a>
                </div>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
};
