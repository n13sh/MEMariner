import React from 'react';
import { MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/marinerData';
import { useI18n } from '../lib/i18n';

export const WhatsAppButton: React.FC = () => {
  const { t } = useI18n();
  return (
  <a
    href={`https://wa.me/${COMPANY_INFO.contact.whatsappNumber}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={t('wa.label', 'Chat on WhatsApp')}
    className="ping-soft group fixed bottom-5 end-5 z-40 w-[52px] h-[52px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-105"
  >
    <MessageCircle className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12" />
  </a>
  );
};
