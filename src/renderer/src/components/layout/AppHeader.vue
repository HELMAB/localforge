<template>
  <!-- Peace & Support Banner -->
  <div
    v-if="showBanner"
    class="sticky top-0 w-full shadow-lg flex-shrink-0 z-50 bg-gradient-to-br from-[#032ea1] via-[#1e40af] to-[#032ea1]"
  >
    <!-- Red top stripe (Cambodian flag inspired) -->
    <div class="w-full h-1.5 bg-red-600" />

    <div class="py-3 px-4 text-white">
      <div class="max-w-full mx-auto text-center">
        <!-- Main message -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 justify-center">
          <div class="flex items-center gap-2 justify-center">
            <span class="text-lg sm:text-xl font-bold">🕊️ កម្ពុជាត្រូវការសន្តិភាព</span>
          </div>
          <span class="hidden sm:inline text-white/60">•</span>
          <div class="flex items-center gap-2 justify-center">
            <span class="text-base sm:text-lg font-semibold">CAMBODIA NEEDS PEACE 🇰🇭</span>
          </div>
        </div>

        <!-- Support message -->
        <p class="text-xs sm:text-sm text-white/90 mt-1">
          យើងគាំទ្រដល់ទាហានខ្មែរទាំងអស់ដែលការពារទឹកដីជាតិ • We stand with our brave soldiers
          defending our homeland
        </p>
      </div>
    </div>

    <!-- Red bottom stripe -->
    <div class="w-full h-1.5 bg-red-600" />
  </div>

  <!-- Main Header -->
  <div
    class="relative bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 shadow-lg p-6 mb-6 overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10 bg-plus-pattern" />

    <div class="relative flex justify-between items-center">
      <!-- Logo and Title Section -->
      <div class="flex items-center gap-4">
        <!-- Logo -->
        <div
          class="flex-shrink-0 w-14 h-14 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center"
        >
          <Code2 class="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <!-- Title and Tagline -->
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-2">
            {{ t('appTitle') }}
            <span
              class="px-2 py-0.5 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full text-white"
            >
              v1.0
            </span>
          </h1>
          <p class="text-blue-100 dark:text-blue-200 text-sm mt-0.5">
            {{ t('appTagline') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Dark Mode Toggle -->
        <button
          class="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105"
          :title="t('darkModeLabel')"
          @click="toggleDarkMode"
        >
          <Moon v-if="!isDark" class="w-5 h-5" />
          <Sun v-else class="w-5 h-5" />
        </button>

        <!-- Language Selector -->
        <div
          class="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-sm"
        >
          <button :class="languageButtonClass('km')" @click="changeLanguage('km')">ខ្មែរ</button>
          <button :class="languageButtonClass('en')" @click="changeLanguage('en')">English</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useDarkMode } from '../../composables/useDarkMode'
import { usePeaceBanner } from '../../composables/usePeaceBanner'
import { Code2, Moon, Sun } from 'lucide-vue-next'

const { t, locale } = useI18n()
const { isDark, toggleDarkMode } = useDarkMode()
const { showBanner } = usePeaceBanner()

function changeLanguage(lang) {
  locale.value = lang
}

function languageButtonClass(lang) {
  const baseClasses = 'px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200'
  const activeClasses = 'bg-white text-blue-600 shadow-sm'
  const inactiveClasses = 'text-white hover:text-blue-100'

  return locale.value === lang
    ? `${baseClasses} ${activeClasses}`
    : `${baseClasses} ${inactiveClasses}`
}
</script>
