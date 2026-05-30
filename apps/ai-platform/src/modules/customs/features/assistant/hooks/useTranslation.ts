import { useSettingsStore } from '@/store/settingsStore';
import { customsTranslations, Language } from '../translations';

export function useTranslation() {
  const { lang, setLang } = useSettingsStore();
  
  // Map standard languages. Default to 'ku' (Kurdish Sorani)
  const currentLang: Language = (lang === 'ku' || lang === 'ar') ? lang : 'ku';
  const t = customsTranslations[currentLang].assistant;

  return {
    lang,
    setLang: (newLang: 'ku' | 'ar') => setLang(newLang as any),
    t,
    isRtl: true, // Both Kurdish and Arabic use RTL layout
    currentLang
  };
}
