<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">{{ t('appTitle') }}</h1>
      <div class="inline-flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
        <button
          @click="changeLanguage('km')"
          :class="languageButtonClass('km')"
        >
          ខ្មែរ
        </button>
        <button
          @click="changeLanguage('en')"
          :class="languageButtonClass('en')"
        >
          English
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

function changeLanguage(lang) {
  locale.value = lang
}

function languageButtonClass(lang) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium text-sm transition-all duration-200'
  const activeClasses = 'bg-white text-blue-600 shadow-sm'
  const inactiveClasses = 'text-gray-600 hover:text-gray-800'

  return locale.value === lang
    ? `${baseClasses} ${activeClasses}`
    : `${baseClasses} ${inactiveClasses}`
}
</script>
