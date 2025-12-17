<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div
      class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('settingsTitle') }}
      </h2>
    </div>

    <div class="p-6 space-y-5">
      <!-- Language -->
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t('languageLabel') }}
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('chooseLanguageDesc') }}
            </p>
          </div>
        </div>
        <CustomSelect
          v-model="currentLanguage"
          :options="languageOptions"
          @update:model-value="changeLanguage"
        />
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700" />

      <!-- Dark Mode -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center"
          >
            <svg
              v-if="!isDark"
              class="w-5 h-5 text-purple-600 dark:text-purple-400"
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
              class="w-5 h-5 text-purple-600 dark:text-purple-400"
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
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t('darkModeLabel') }}
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ isDark ? t('darkThemeEnabled') : t('lightThemeEnabled') }}
            </p>
          </div>
        </div>
        <button
          :class="[
            'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
            isDark ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600',
          ]"
          @click="toggleDarkMode"
        >
          <span
            :class="[
              'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
              isDark ? 'translate-x-6' : 'translate-x-1',
            ]"
          />
        </button>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700" />

      <!-- Default Path -->
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t('defaultProjectPath') }}
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('defaultLocationDesc') }}
            </p>
          </div>
        </div>
        <input
          v-model="localSettings.defaultProjectPath"
          type="text"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          :placeholder="t('defaultProjectPathPlaceholder')"
        >
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700" />

      <!-- Keyboard Hints -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t('showKeyboardHints') }}
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('displayKeyboardShortcuts') }}
            </p>
          </div>
        </div>
        <button
          :class="[
            'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
            localSettings.showKeyboardHints
              ? 'bg-blue-600 dark:bg-blue-500'
              : 'bg-gray-300 dark:bg-gray-600',
          ]"
          @click="localSettings.showKeyboardHints = !localSettings.showKeyboardHints"
        >
          <span
            :class="[
              'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
              localSettings.showKeyboardHints ? 'translate-x-6' : 'translate-x-1',
            ]"
          />
        </button>
      </div>

      <!-- Save Button -->
      <div class="pt-4">
        <button
          class="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-sm"
          @click="saveSettings"
        >
          <span class="flex items-center justify-center gap-2">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {{ t('saveBtn') }}
          </span>
        </button>
      </div>
    </div>
  </div>
  <SuccessModal
    :visible="showSuccessModal"
    :title="t('settings.successTitle')"
    :message="t('settings.successMessage')"
    @close="showSuccessModal = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDarkMode } from '@/composables/useDarkMode'
import { useSettings } from '@/composables/useSettings'
import CustomSelect from '@/components/common/CustomSelect.vue'
import SuccessModal from '@/components/common/SuccessModal.vue'

const { t, locale } = useI18n()
const { isDark, toggleDarkMode } = useDarkMode()
const { settings, updateSetting } = useSettings()

const currentLanguage = ref(locale.value)
const localSettings = ref({ ...settings.value })
const showSuccessModal = ref(false)

const languageOptions = [
  { value: 'km', label: 'ភាសាខ្មែរ (Khmer)' },
  { value: 'en', label: 'English' },
]

const changeLanguage = () => {
  locale.value = currentLanguage.value
  updateSetting('language', currentLanguage.value)
}

const saveSettings = () => {
  Object.keys(localSettings.value).forEach((key) => {
    updateSetting(key, localSettings.value[key])
  })
  showSuccessModal.value = true
}
</script>
