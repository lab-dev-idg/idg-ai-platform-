import React from 'react';
import { LanguageContext, LanguageContextType } from '@/lib/LanguageContext';
import { Language, translations } from '@/lib/translations/index';
import { useState, useEffect } from 'react';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app-lang');
    return (saved as Language) || 'ku';
  });

  useEffect(() => {
    localStorage.setItem('app-lang', lang);
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = lang === 'ku' ? 'ckb' : 'ar';
  }, [lang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
