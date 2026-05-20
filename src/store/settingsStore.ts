import { create } from 'zustand';
import { Language, translations } from '@/lib/translations';

interface SettingsState {
  lang: Language;
  t: typeof translations['ku']; // Assuming 'ku' or they share the same interface
  setLang: (lang: Language) => void;
  initLanguage: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  lang: 'ku',
  t: translations['ku'],
  
  setLang: (lang) => {
    localStorage.setItem('app-lang', lang);
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = lang === 'ku' ? 'ckb' : 'ar';
    set({ lang, t: translations[lang] });
  },

  initLanguage: () => {
    const saved = localStorage.getItem('app-lang') as Language;
    const initialLang = saved || 'ku';
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = initialLang === 'ku' ? 'ckb' : 'ar';
    set({ lang: initialLang, t: translations[initialLang] });
  }
}));
