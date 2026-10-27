import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  MessageSquare,
  PhoneCall,
  Send,
  X,
  Sparkles,
  AlertTriangle,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { COMPANY_INFO, RUNNER_BOATS_MODELS } from '../data/marinerData';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  lang: 'en' | 'ar';
  actionType?: 'spare-parts' | 'maintenance' | 'boats' | 'survey' | 'emergency';
}

interface AIVoiceConciergeProps {
  theme?: 'light' | 'dark';
  onOpenEnquiryTab: (
    tab: 'spare-parts' | 'maintenance' | 'boats' | 'survey',
    prefillSubject?: string
  ) => void;
}

export const AIVoiceConcierge: React.FC<AIVoiceConciergeProps> = ({
  theme = 'light',
  onOpenEnquiryTab,
}) => {
  const isLight = theme === 'light';
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      lang: 'en',
      text: 'Welcome to Middle East Mariner (East Ahmadi, Kuwait). I can help route enquiries for OEM Marine Spare Parts, Engine & Vessel Maintenance, Boat Surveys, or the Runner Boats portfolio (25 FT – 42 FT). You may write in English or العربية.',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const detectArabic = (str: string) => /[\u0600-\u06FF]/.test(str);

  const speakResponse = (text: string, language: 'en' | 'ar') => {
    if (
      !voiceEnabled ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ar' ? 'ar-KW' : 'en-GB';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const generateSafeReply = (
    query: string,
    detectedLang: 'en' | 'ar'
  ): Omit<Message, 'id' | 'role'> => {
    const q = query.toLowerCase();

    if (
      q.includes('emergency') ||
      q.includes('breakdown') ||
      q.includes('urgent') ||
      q.includes('sinking') ||
      q.includes('stranded') ||
      q.includes('overheat') ||
      q.includes('طوارئ') ||
      q.includes('عطل')
    ) {
      return {
        lang: detectedLang,
        actionType: 'emergency',
        text:
          detectedLang === 'ar'
            ? `لحالات الأعطال البحرية الطارئة، يرجى الاتصال فوراً بفريقنا الفني في شرق الأحمدي على الرقم المعتمد ${COMPANY_INFO.contact.phoneDisplay}.`
            : `For urgent marine breakdowns, please call our East Ahmadi technical desk immediately at ${COMPANY_INFO.contact.phoneDisplay}.`,
      };
    }

    if (
      q.includes('price') ||
      q.includes('cost') ||
      q.includes('how much') ||
      q.includes('in stock') ||
      q.includes('discount') ||
      q.includes('warranty') ||
      q.includes('سعر') ||
      q.includes('كم') ||
      q.includes('متوفر')
    ) {
      return {
        lang: detectedLang,
        actionType: 'spare-parts',
        text:
          detectedLang === 'ar'
            ? 'حفاظاً على الدقة، لا أقوم بتخمين الأسعار أو تأكيد توفر المخزون تلقائياً. يرجى إرسال رقم القطعة (OEM) أو طراز المحرك/القارب عبر نموذج الطلب للتأكيد الرسمي.'
            : 'To ensure accuracy, I do not quote unverified prices or guarantee stock availability automatically. Please submit your OEM part number, engine model, or boat inquiry for official verification.',
      };
    }

    if (
      q.includes('boat') ||
      q.includes('runner') ||
      q.includes('rider') ||
      q.includes('sirius') ||
      q.includes('crown') ||
      q.includes('deluxe') ||
      q.includes('trident') ||
      q.includes('magnus') ||
      q.includes('buy') ||
      q.includes('قارب') ||
      q.includes('قوارب')
    ) {
      const modelList = RUNNER_BOATS_MODELS.map((m) => m.name).join(', ');
      return {
        lang: detectedLang,
        actionType: 'boats',
        text:
          detectedLang === 'ar'
            ? `نقدم مجموعة قوارب Runner Boats بالمقاسات المعتمدة التالية: ${modelList}. يمكنك فتح نموذج الاستفسار لتحديد الطراز المطلوب.`
            : `Middle East Mariner distributes the Runner Boats portfolio across six verified models: ${modelList}. Click below to request specifications and availability.`,
      };
    }

    if (
      q.includes('part') ||
      q.includes('oem') ||
      q.includes('filter') ||
      q.includes('impeller') ||
      q.includes('propeller') ||
      q.includes('battery') ||
      q.includes('pump') ||
      q.includes('قطع') ||
      q.includes('غيار') ||
      q.includes('فلتر')
    ) {
      return {
        lang: detectedLang,
        actionType: 'spare-parts',
        text:
          detectedLang === 'ar'
            ? 'لتوريد قطع الغيار البحرية، يرجى تزويدنا باسم القطعة، رقم المرجع (OEM)، وطراز المحرك عبر نموذج طلب قطع الغيار أدناه.'
            : 'For marine spare parts enquiries, please provide the part name, OEM reference, and engine model using the Spare Parts form below.',
      };
    }

    if (q.includes('survey') || q.includes('inspection') || q.includes('فحص')) {
      return {
        lang: detectedLang,
        actionType: 'survey',
        text:
          detectedLang === 'ar'
            ? 'يشمل الفحص البحري للقوارب (Boat Survey) خمسة محاور: المحركات، الهيكل، التوازن، الإلكترونيات، ومعدات السلامة مع تقرير فحص مفصل.'
            : 'Our On-Board Boat Survey covers five core inspection areas: Engines, Hull, Stability, Electronics, and Safety Equipment.',
      };
    }

    return {
      lang: detectedLang,
      actionType: 'maintenance',
      text:
        detectedLang === 'ar'
          ? `شركة ميدل إيست مارينر (شرق الأحمدي، الكويت) تقدم صيانة اليخوت والقوارب، المحركات، التكييف البحري، والفيبرجلاس. هاتف: ${COMPANY_INFO.contact.phoneDisplay}.`
          : `Middle East Mariner (Est. 2006 — East Ahmadi, Kuwait) provides vessel maintenance, engine servicing, hydraulic/electrical repairs, fiberglass fabrication, and marine HVAC across Kuwait & the GCC.`,
    };
  };

  const handleSend = (customQuery?: string) => {
    const trimmed = (customQuery ?? input).trim();
    if (!trimmed) return;

    const detectedLang: 'en' | 'ar' = detectArabic(trimmed) ? 'ar' : lang;
    if (detectArabic(trimmed)) setLang('ar');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      lang: detectedLang,
    };

    const replyData = generateSafeReply(trimmed, detectedLang);
    const botMsg: Message = {
      id: `bot-${Date.now() + 1}`,
      role: 'assistant',
      ...replyData,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (!customQuery) setInput('');
    speakResponse(botMsg.text, botMsg.lang);
  };

  const quickPrompts =
    lang === 'ar'
      ? [
          'طلب قطع غيار (OEM)',
          'قوارب Runner Boats',
          'حجز صيانة محرك',
          'عطل طارئ',
        ]
      : [
          'OEM Spare Parts',
          'Runner Boats (25–42 FT)',
          'Engine & HVAC Service',
          'Urgent Breakdown',
        ];

  return (
    <>
      {/* =====================================================================
          MOBILE STICKY BOTTOM ACTION BAR (< 640px) — Thumb-Friendly 48px Targets
      ===================================================================== */}
      <div
        className={`sm:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl pb-safe transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200'
            : 'bg-[#051020]/95 border-white/15'
        }`}
      >
        <div className="grid grid-cols-3 gap-1.5 px-3 pt-2 pb-1">
          <a
            href={COMPANY_INFO.contact.phoneHref}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#092C58] text-white py-2.5 px-2 text-xs font-bold shadow-sm active:scale-95 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <span>Call Desk</span>
          </a>

          <a
            href={`https://wa.me/${COMPANY_INFO.contact.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white py-2.5 px-2 text-xs font-bold shadow-sm active:scale-95 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1B75BC] text-white py-2.5 px-2 text-xs font-bold shadow-sm active:scale-95 transition"
          >
            <Mic className="w-3.5 h-3.5 shrink-0" />
            <span>AI Advisor</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          DESKTOP FLOATING LAUNCHER (>= 640px)
      ===================================================================== */}
      <div className="hidden sm:flex fixed bottom-5 right-5 z-40 items-center gap-2.5">
        <a
          href={COMPANY_INFO.contact.phoneHref}
          className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white px-4 py-3 text-xs font-bold tracking-wide shadow-lg transition"
          title="Urgent Breakdown Direct Line"
        >
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>URGENT: {COMPANY_INFO.contact.phoneDisplay}</span>
        </a>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#092C58] to-[#1B75BC] hover:from-[#0d3b75] hover:to-[#2289da] text-white border border-sky-400/50 px-4 py-3 shadow-xl transition"
          aria-label="Open Middle East Mariner AI Technical Concierge"
        >
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-sky-400/20">
            <Mic className="w-3.5 h-3.5 text-sky-300" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-bold font-['Outfit']">
              Marine AI Concierge
            </div>
            <div className="text-[10px] text-sky-200 font-['IBM_Plex_Mono']">
              EN / العربية • Parts &amp; Support
            </div>
          </div>
        </button>
      </div>

      {/* =====================================================================
          CONCIERGE DRAWER (Full Bottom-Sheet on Mobile, Floating Modal on Desktop)
      ===================================================================== */}
      {isOpen && (
        <div
          className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 z-50 flex flex-col justify-end sm:block bg-black/50 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:w-[400px] rounded-t-3xl sm:rounded-2xl bg-[#071830] border-t sm:border border-sky-400/35 shadow-2xl overflow-hidden flex flex-col max-h-[85dvh] sm:max-h-[78vh] pb-safe sm:pb-0"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#092C58] to-[#124982] px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-400/20 border border-sky-300/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Outfit'] font-bold text-sm text-white">
                      Mariner AI Advisor
                    </h3>
                    <span className="rounded bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.5 font-['IBM_Plex_Mono'] text-[9px] text-emerald-300">
                      EN / AR
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-200/80">
                    Parts, Runner Boats &amp; Service Routing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1.5 text-xs font-semibold text-white transition"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-300" />
                  <span>{lang === 'en' ? 'العربية' : 'EN'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    if (!next && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`p-2 rounded-lg border transition ${
                    voiceEnabled
                      ? 'bg-sky-500/30 border-sky-400 text-sky-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  aria-label="Toggle Voice"
                >
                  {voiceEnabled ? (
                    <Volume2
                      className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`}
                    />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Guardrail Notice */}
            <div className="bg-[#051020] px-4 py-2 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Verified Routing • No automated price/stock guessing</span>
              </span>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    dir={m.lang === 'ar' ? 'rtl' : 'ltr'}
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#1B75BC] text-white rounded-br-none'
                        : 'bg-white/[0.07] border border-white/10 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.actionType && m.actionType !== 'emergency' && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenEnquiryTab(
                          m.actionType as
                            | 'spare-parts'
                            | 'maintenance'
                            | 'boats'
                            | 'survey'
                        );
                        setIsOpen(false);
                      }}
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 px-3 py-2 text-xs font-semibold text-sky-300 transition"
                    >
                      <span>
                        {m.actionType === 'spare-parts' &&
                          'Open Spare Parts Form'}
                        {m.actionType === 'boats' && 'Open Runner Boats Form'}
                        {m.actionType === 'maintenance' && 'Open Service Form'}
                        {m.actionType === 'survey' && 'Open Boat Survey Form'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {m.actionType === 'emergency' && (
                    <a
                      href={COMPANY_INFO.contact.phoneHref}
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-2 text-xs font-bold text-white shadow transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Call Now: {COMPANY_INFO.contact.phoneDisplay}</span>
                    </a>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-white/10 bg-[#051020]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 rounded-full bg-white/[0.08] hover:bg-sky-500/20 border border-white/10 px-3 py-1.5 text-[11px] text-slate-200 transition whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar (16px font on mobile to prevent iOS Safari zoom!) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#051020] border-t border-white/10 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                placeholder={
                  lang === 'ar'
                    ? 'اسأل عن قطع الغيار أو الصيانة...'
                    : 'Ask about parts, boats, or service...'
                }
                className="flex-1 bg-transparent text-base sm:text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#1B75BC] hover:bg-sky-500 text-white transition shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
