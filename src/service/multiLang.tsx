import detector from 'i18next-browser-languagedetector'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from '@/lang/en.json'
import translationSE from '@/lang/se.json'

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  se: {
    translation: translationSE
  }
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n