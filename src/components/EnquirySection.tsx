import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, RUNNER_BOATS_MODELS } from '../data/marinerData';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

export type EnquiryTabType = 'spare-parts' | 'maintenance' | 'boats' | 'survey';

interface EnquirySectionProps {
  theme: 'light' | 'dark';
  activeTab: EnquiryTabType;
  setActiveTab: (tab: EnquiryTabType) => void;
  prefillSubject: string;
}

export const EnquirySection: React.FC<EnquirySectionProps> = ({
  theme,
  activeTab,
  setActiveTab,
  prefillSubject,
}) => {
  const isLight = theme === 'light';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topicDetail, setTopicDetail] = useState('');
  const [message, setMessage] = useState('');
  const [submittedLinks, setSubmittedLinks] = useState<{
    mailto: string;
    whatsapp: string;
  } | null>(null);

  useEffect(() => {
    if (prefillSubject) {
      setTopicDetail(prefillSubject);
      setSubmittedLinks(null);
    }
  }, [prefillSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryLabel =
      activeTab === 'spare-parts'
        ? 'Boat Parts & Hardware'
        : activeTab === 'boats'
        ? 'Runner Boats Enquiry'
        : activeTab === 'survey'
        ? 'Boat Survey'
        : 'Marine Service & Maintenance';

    const subject = `${categoryLabel} Enquiry — ${topicDetail || name}`;
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
      mailto: `mailto:${COMPANY_INFO.contact.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`,
      whatsapp: `https://wa.me/${
        COMPANY_INFO.contact.whatsappNumber
      }?text=${encodeURIComponent(`${subject}\n\n${body}`)}`,
    });
  };

  return (
    <section
      id="contact"
      className={`py-16 sm:py-24 transition-colors duration-300 ${
        isLight
          ? 'bg-[#F4F8FC] text-[#092C58] border-t border-slate-200'
          : 'bg-[#051020] text-white border-t border-white/10'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Clean "Talk to a Marine Advisor" Info */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#1B75BC] block mb-2">
                East Ahmadi • Kuwait &amp; GCC
              </span>
              <h2 className="font-['Outfit'] text-2xl sm:text-4xl font-bold tracking-tight">
                Talk to a Marine Advisor
              </h2>
              <p
                className={`mt-2.5 text-sm leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}
              >
                Looking for genuine boat parts, engine servicing, or a Runner
                Boats quotation? Reach out to our Kuwait team directly or send a
                quick enquiry.
              </p>
            </div>

            {/* Direct Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-1">
              <div className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-[#1B75BC] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-60">
                    Phone &amp; Breakdown Support
                  </div>
                  <a
                    href={COMPANY_INFO.contact.phoneHref}
                    className="text-base sm:text-lg font-bold hover:text-[#1B75BC] transition"
                  >
                    {COMPANY_INFO.contact.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#1B75BC] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-60">
                    Email
                  </div>
                  <a
                    href={COMPANY_INFO.contact.emailHref}
                    className="text-sm font-semibold hover:text-[#1B75BC] transition break-all"
                  >
                    {COMPANY_INFO.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1B75BC] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-60">
                    Location
                  </div>
                  <div className="text-sm font-semibold">
                    {COMPANY_INFO.location.fullAddress}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#1B75BC] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-60">
                    Hours
                  </div>
                  <div className="text-sm font-semibold">
                    {COMPANY_INFO.hours.days}, {COMPANY_INFO.hours.time}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Call & WhatsApp Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 pt-1">
              <a
                href={COMPANY_INFO.contact.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#092C58] hover:bg-[#1B75BC] text-white px-5 py-3 text-xs font-bold tracking-wide transition shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Now</span>
              </a>

              <a
                href={`https://wa.me/${COMPANY_INFO.contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 text-xs font-bold tracking-wide transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Right Column: Simple, Clean Enquiry Card */}
          <div
            className={`lg:col-span-7 rounded-3xl p-5 sm:p-10 border shadow-xl transition-colors ${
              isLight
                ? 'bg-white border-slate-200/80'
                : 'bg-[#081b36] border-white/10'
            }`}
          >
            {/* 2x2 Grid on Mobile, Flex Pills on Tablet/Desktop */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-6">
              {[
                { id: 'spare-parts', label: 'Spare Parts' },
                { id: 'maintenance', label: 'Service & Repair' },
                { id: 'boats', label: 'Runner Boats' },
                { id: 'survey', label: 'Boat Survey' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as EnquiryTabType);
                    setSubmittedLinks(null);
                  }}
                  className={`rounded-xl sm:rounded-full px-3 sm:px-4 py-2.5 sm:py-2 text-xs font-bold transition text-center ${
                    activeTab === tab.id
                      ? 'bg-[#1B75BC] text-white shadow-sm'
                      : isLight
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-80">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className={`w-full rounded-xl border px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#1B75BC] ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-[#092C58]'
                        : 'bg-[#051020] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-80">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+965 XXXX XXXX"
                    className={`w-full rounded-xl border px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#1B75BC] ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-[#092C58]'
                        : 'bg-[#051020] border-white/15 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-80">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#1B75BC] ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-[#092C58]'
                        : 'bg-[#051020] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-80">
                    {activeTab === 'boats'
                      ? 'Runner Boat Model'
                      : activeTab === 'spare-parts'
                      ? 'Part Name / OEM Number'
                      : 'Vessel / Service Type'}
                  </label>
                  {activeTab === 'boats' ? (
                    <select
                      value={topicDetail}
                      onChange={(e) => setTopicDetail(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#1B75BC] ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-[#092C58]'
                          : 'bg-[#051020] border-white/15 text-white'
                      }`}
                    >
                      <option value="">Select a Runner Boat Model</option>
                      {RUNNER_BOATS_MODELS.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={topicDetail}
                      onChange={(e) => setTopicDetail(e.target.value)}
                      placeholder={
                        activeTab === 'spare-parts'
                          ? 'e.g., Engine Filter / Impeller / OEM #'
                          : 'e.g., Engine Service / HVAC / Hull Survey'
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#1B75BC] ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-[#092C58]'
                          : 'bg-[#051020] border-white/15 text-white'
                      }`}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 opacity-80">
                  Message or Requirements
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share engine model, part details, or preferred service schedule..."
                  className={`w-full rounded-xl border px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#1B75BC] ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-[#092C58]'
                      : 'bg-[#051020] border-white/15 text-white'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B75BC] hover:bg-[#092C58] text-white font-bold py-3.5 px-6 text-sm transition shadow-lg shadow-sky-500/20"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {submittedLinks && (
              <div
                className={`mt-5 rounded-2xl p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-200 text-[#092C58]'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>
                    Enquiry ready! Choose how you would like to send it to our
                    team:
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <a
                    href={submittedLinks.mailto}
                    className="rounded-lg bg-[#1B75BC] text-white px-3.5 py-2.5 text-xs font-bold text-center hover:opacity-90"
                  >
                    Send Email
                  </a>
                  <a
                    href={submittedLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-600 text-white px-3.5 py-2.5 text-xs font-bold text-center hover:opacity-90"
                  >
                    Send WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
