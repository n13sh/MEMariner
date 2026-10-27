import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export const BackToTop: React.FC = () => {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('top.label', 'Back to top')}
      className={`fixed bottom-[88px] end-5 z-40 w-[46px] h-[46px] rounded-full bg-white border border-line text-ink shadow-[0_4px_14px_rgba(0,0,0,0.12)] flex items-center justify-center transition-[opacity,transform] duration-300 hover:text-accent hover:-translate-y-0.5 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
