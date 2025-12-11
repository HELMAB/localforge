<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50" @click.self="close">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('settingsTitle') }}</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Language Setting -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('languageLabel') }}
          </label>
          <select 
            v-model="localSettings.language" 
            @change="updateLanguage"
            class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="km">ភាសាខ្មែរ</option>
            <option value="en">English</option>
          </select>
        </div>

        <!-- Dark Mode Setting -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('darkModeLabel') }}
          </label>
          <button 
            @click="toggleDarkMode"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              localSettings.darkMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                localSettings.darkMode ? 'translate-x-6' : 'translate-x-1'
              ]"
            ></span>
          </button>
        </div>

        <!-- Default Project Path -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('defaultProjectPath') }}
          </label>
          <input 
            v-model="localSettings.defaultProjectPath" 
            type="text"
            class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="t('defaultProjectPathPlaceholder')"
          />
        </div>

        <!-- Default PHP Version -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('defaultPhpVersion') }}
          </label>
          <select 
            v-model="localSettings.defaultPhpVersion"
            class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="8.3">PHP 8.3</option>
            <option value="8.2">PHP 8.2</option>
            <option value="8.1">PHP 8.1</option>
            <option value="8.0">PHP 8.0</option>
          </select>
        </div>

        <!-- Default Node Version -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('defaultNodeVersion') }}
          </label>
          <select 
            v-model="localSettings.defaultNodeVersion"
            class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="20">Node.js 20 LTS</option>
            <option value="18">Node.js 18 LTS</option>
            <option value="16">Node.js 16</option>
          </select>
        </div>

        <!-- Auto Detect PHP -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('autoDetectPhp') }}
          </label>
          <button 
            @click="localSettings.autoDetectPhp = !localSettings.autoDetectPhp"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              localSettings.autoDetectPhp ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                localSettings.autoDetectPhp ? 'translate-x-6' : 'translate-x-1'
              ]"
            ></span>
          </button>
        </div>

        <!-- Keyboard Hints -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('showKeyboardHints') }}
          </label>
          <button 
            @click="localSettings.showKeyboardHints = !localSettings.showKeyboardHints"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              localSettings.showKeyboardHints ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                localSettings.showKeyboardHints ? 'translate-x-6' : 'translate-x-1'
              ]"
            ></span>
          </button>
        </div>
      </div>

      <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
        <button 
          @click="resetSettings"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {{ t('resetBtn') }}
        </button>
        <button 
          @click="saveAndClose"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {{ t('saveBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from '../../composables/useSettings'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'toggle-dark-mode', 'change-language'])

const { t, locale } = useI18n()
const { settings, updateSetting, resetSettings: reset } = useSettings()

const localSettings = ref({ ...settings.value })

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    localSettings.value = { ...settings.value }
  }
})

const close = () => {
  emit('close')
}

const saveAndClose = () => {
  Object.keys(localSettings.value).forEach(key => {
    updateSetting(key, localSettings.value[key])
  })
  close()
}

const resetSettings = () => {
  if (confirm(t('resetConfirm'))) {
    reset()
    localSettings.value = { ...settings.value }
  }
}

const toggleDarkMode = () => {
  localSettings.value.darkMode = !localSettings.value.darkMode
  emit('toggle-dark-mode')
}

const updateLanguage = () => {
  locale.value = localSettings.value.language
  emit('change-language', localSettings.value.language)
}
</script>
