import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-850 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-2xs" id="lang-switcher-widget">
      <button
        onClick={() => setLang('ku')}
        className={`px-3.5 py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${
          lang === 'ku'
            ? 'bg-amber-600 text-white shadow-2xs'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
        }`}
        id="btn-lang-ku"
      >
        {t.kuRtlText}
      </button>
      <button
        onClick={() => setLang('ar')}
        className={`px-3.5 py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${
          lang === 'ar'
            ? 'bg-amber-600 text-white shadow-2xs'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
        }`}
        id="btn-lang-ar"
      >
        {t.arRtlText}
      </button>
    </div>
  );
}
