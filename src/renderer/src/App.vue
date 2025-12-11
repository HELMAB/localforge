<template>
  <div
    id="app"
    class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200"
  >
    <div class="max-w-[890px] mx-auto p-6">
      <AppHeader @toggle-settings="showSettings = true" />

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 transition-colors duration-200">
        <TabNavigation />

        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <AppFooter />
    </div>

    <SettingsModal 
      :is-open="showSettings" 
      @close="showSettings = false"
      @toggle-dark-mode="toggleDarkMode"
      @change-language="handleLanguageChange"
    />

    <ProgressBar 
      :is-loading="progress.isLoading.value"
      :progress="progress.progress.value"
      :message="progress.message.value"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from './components/layout/AppHeader.vue'
import TabNavigation from './components/layout/TabNavigation.vue'
import AppFooter from './components/layout/AppFooter.vue'
import SettingsModal from './components/common/SettingsModal.vue'
import ProgressBar from './components/common/ProgressBar.vue'
import { useDarkMode } from './composables/useDarkMode'
import { useSettings } from './composables/useSettings'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
import { useProgress } from './composables/useProgress'

const { locale } = useI18n()
const { toggleDarkMode: toggle } = useDarkMode()
const { settings } = useSettings()
const progress = useProgress()
const showSettings = ref(false)

useKeyboardShortcuts()

const toggleDarkMode = () => {
  toggle()
}

const handleLanguageChange = (lang) => {
  locale.value = lang
}

onMounted(() => {
  locale.value = settings.value.language || 'km'
  
  window.addEventListener('toggle-dark-mode', toggleDarkMode)
  window.addEventListener('toggle-language', () => {
    locale.value = locale.value === 'km' ? 'en' : 'km'
  })
  window.addEventListener('open-settings', () => {
    showSettings.value = true
  })
})

provide('progress', progress)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
