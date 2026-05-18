import { createContext, useContext } from 'react';
import { Language } from './translations';

export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

