import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationDE from '@/locales/de/translation.json';
import translationEN from '@/locales/en/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: translationDE },
    en: { translation: translationEN },
  },
  lng: 'de',
  fallbackLng: 'de',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
