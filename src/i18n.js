import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import yaml from 'js-yaml';
import enYaml from './locales/en.yaml?raw';
import plYaml from './locales/pl.yaml?raw';

const resources = {
  en: { translation: yaml.load(enYaml) },
  pl: { translation: yaml.load(plYaml) }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
