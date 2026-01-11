// React hook for translations
'use client';

import { useEffect, useState } from 'react';
import { useLanguageStore } from './store';
import { t, getLanguage, type Translations } from './i18n';

export function useTranslation(): Translations {
  const { language } = useLanguageStore();
  const [translations, setTranslations] = useState<Translations>(t());

  useEffect(() => {
    // Update translations when language changes
    setTranslations(t());
    
    // Listen for language change events
    const handleLanguageChange = () => {
      setTranslations(t());
    };
    
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, [language]);

  return translations;
}
