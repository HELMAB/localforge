import { createI18n } from 'vue-i18n'
import km from './locales/km'
import en from './locales/en'

export default createI18n({
  legacy: false,
  locale: 'km',
  fallbackLocale: 'en',
  messages: { km, en }
})
