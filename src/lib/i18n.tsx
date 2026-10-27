import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AR } from '../data/ar';

export type Lang = 'en' | 'ar';

interface I18n {
  lang: Lang;
  isAr: boolean;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** UI string: returns the Arabic for `key` when active, otherwise the English default. */
  t: (key: string, en: string) => string;
  /** Data string: Arabic for record `id`, field `field`; falls back to the English value. */
  td: <T extends string | string[]>(id: string, field: string, en: T) => T;
}

const Ctx = createContext<I18n>({
  lang: 'en',
  isAr: false,
  dir: 'ltr',
  setLang: () => {},
  toggle: () => {},
  t: (_k, en) => en,
  td: (_i, _f, en) => en,
});

function readInitial(): Lang {
  try {
    const saved = localStorage.getItem('mem_lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* ignore */
  }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readInitial);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('mem_lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === 'en' ? 'ar' : 'en')), []);

  const value = useMemo<I18n>(() => {
    const isAr = lang === 'ar';
    return {
      lang,
      isAr,
      dir: isAr ? 'rtl' : 'ltr',
      setLang,
      toggle,
      t: (key, en) => (isAr ? AR.ui[key] ?? en : en),
      td: (id, field, en) => {
        if (!isAr) return en;
        const v = AR.data[id]?.[field];
        return (v as typeof en) ?? en;
      },
    };
  }, [lang, setLang, toggle]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useI18n = () => useContext(Ctx);
