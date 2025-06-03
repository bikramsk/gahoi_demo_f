import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  
  .use(Backend)
  
  .use(LanguageDetector)

  .use(initReactI18next)

  .init({
    fallbackLng: 'hi',
    supportedLngs: ['hi', 'en'],
    lng: 'hi',
    debug: import.meta.env.MODE === 'development',
    
    interpolation: {
      escapeValue: false, 
    },

    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Detection options
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      cookieMinutes: 10080,
      cookieDomain: window.location.hostname
    },

    // React configuration
    react: {
      useSuspense: false 
    }
  });

export default i18n; 