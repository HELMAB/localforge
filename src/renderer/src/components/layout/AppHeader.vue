<template>
  <header
    class="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Zap class="w-5 h-5 text-primary" />
      </div>
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
        {{ t('appTitle') }}
      </h1>
    </div>

    <div class="flex items-center gap-4 shrink-0">
      <button
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
        :title="t('switchLanguage')"
        @click="toggleLanguage"
      >
        <Languages class="w-4 h-4 shrink-0" />
        <span class="min-w-[60px]">{{ locale === 'km' ? 'EN' : 'ខ្មែ' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSettings } from '@/composables/useSettings'
import { Zap, Languages } from 'lucide-vue-next'

const { t, locale } = useI18n()
const { updateSetting } = useSettings()

const toggleLanguage = () => {
  const newLocale = locale.value === 'km' ? 'en' : 'km'
  locale.value = newLocale
  updateSetting('language', newLocale)
}
</script>
