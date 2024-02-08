import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import ar from '../langs/ar.json';
import de from '../langs/de.json';
import en from '../langs/en.json';
import es from '../langs/es.json';
import fr from '../langs/fr.json';
import it from '../langs/it.json';

export const DEFAULT_NAMESPACE = 'translations';
export const DEFAULT_LANG = 'en';
export const resources = {
  ar,
  de,
  en,
  es,
  fr,
  it,
} as const;

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NAMESPACE;
    resources: (typeof resources)['en'];
  }
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: DEFAULT_LANG,
  lng: DEFAULT_LANG,
  // debug only when not in production
  debug: import.meta.env.DEV,
  ns: [DEFAULT_NAMESPACE],
  defaultNS: DEFAULT_NAMESPACE,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
});

export default i18n;
