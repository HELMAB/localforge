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
  <div class="relative lg-panel p-5 sm:p-6 mt-6 mb-4 overflow-hidden">
    <!-- Soft highlight -->
    <div
      class="pointer-events-none absolute -top-24 left-10 h-56 w-56 rounded-full blur-3xl"
      style="
        background: radial-gradient(circle at 30% 30%, rgba(56 189 248 / 0.35), transparent 60%);
      "
    />

    <div class="relative flex justify-between items-center">
      <!-- Logo and Title Section -->
      <div class="flex items-center gap-4">
        <!-- Logo -->
        <div
          class="flex-shrink-0 w-14 h-14 rounded-2xl border border-border/60 bg-background/45 backdrop-blur-xl flex items-center justify-center"
        >
          <Code2 class="w-8 h-8 text-primary" />
        </div>

        <!-- Title and Tagline -->
        <div>
          <h1 class="text-3xl font-bold text-foreground flex items-center gap-2">
            {{ t('appTitle') }}
            <span
              class="px-2 py-0.5 text-xs font-semibold rounded-full border border-border/60 bg-primary/10 text-primary"
            >
              v1.0
            </span>
          </h1>
          <p class="text-muted-foreground text-sm mt-0.5">
            {{ t('appTagline') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Dark Mode Toggle -->
        <button
          class="p-2.5 rounded-xl bg-background/35 border border-border/60 text-foreground hover:bg-background/55 transition-all hover:scale-[1.03]"
          :title="t('darkModeLabel')"
          @click="toggleDarkMode"
        >
          <Moon v-if="!isDark" class="w-5 h-5" />
          <Sun v-else class="w-5 h-5" />
        </button>

        <!-- Language Selector -->
        <div
          class="inline-flex items-center bg-background/35 backdrop-blur-xl border border-border/60 rounded-xl p-1 shadow-sm"
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
  const activeClasses = 'bg-background/70 text-primary shadow-sm'
  const inactiveClasses = 'text-muted-foreground hover:text-foreground'

  return locale.value === lang
    ? `${baseClasses} ${activeClasses}`
    : `${baseClasses} ${inactiveClasses}`
}
</script>
