import React, { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const initLanguage = useSettingsStore(state => state.initLanguage);

  useEffect(() => {
    initLanguage();
  }, [initLanguage]);

  return <>{children}</>;
}
