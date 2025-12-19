<template>
  <!-- Peace & Support Banner -->
  <div
    class="sticky top-0 w-full shadow-lg flex-shrink-0 z-50"
    style="background: linear-gradient(135deg, #032ea1 0%, #1e40af 50%, #032ea1 100%)"
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
          យើងគាំទ្រដល់ទាហានខ្មែរទាំងអស់ដែលការពារទឹកដីជាតិ • We stand with our brave soldiers defending our homeland
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
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute inset-0"
        style="
            background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);
          "
      />
    </div>

    <div class="relative flex justify-between items-center">
      <!-- Logo and Title Section -->
      <div class="flex items-center gap-4">
        <!-- Logo -->
        <div
          class="flex-shrink-0 w-14 h-14 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-blue-600 dark:text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
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
          <svg
            v-if="!isDark"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        <!-- Language Selector -->
        <div
          class="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-sm"
        >
          <button
            :class="languageButtonClass('km')"
            @click="changeLanguage('km')"
          >
            ខ្មែរ
          </button>
          <button
            :class="languageButtonClass('en')"
            @click="changeLanguage('en')"
          >
            English
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useDarkMode } from '../../composables/useDarkMode'

const { t, locale } = useI18n()
const { isDark, toggleDarkMode } = useDarkMode()

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
