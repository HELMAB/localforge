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
            <Languages class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <Label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t('languageLabel') }}
            </Label>
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
            <Moon v-if="!isDark" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <Sun v-else class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <Label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t('darkModeLabel') }}
            </Label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ isDark ? t('darkThemeEnabled') : t('lightThemeEnabled') }}
            </p>
          </div>
        </div>
        <Switch :model-value="isDark" @update:model-value="toggleDarkMode" />
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700" />

      <!-- Default Path -->
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center"
          >
            <Folder class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <Label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t('defaultProjectPath') }}
            </Label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('defaultLocationDesc') }}
            </p>
          </div>
        </div>
        <Input
          v-model="localSettings.defaultProjectPath"
          type="text"
          :placeholder="t('defaultProjectPathPlaceholder')"
        />
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700" />

      <!-- Keyboard Hints -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center"
          >
            <Keyboard class="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <Label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t('showKeyboardHints') }}
            </Label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('displayKeyboardShortcuts') }}
            </p>
          </div>
        </div>
        <Switch
          :model-value="localSettings.showKeyboardHints"
          @update:model-value="(val) => (localSettings.showKeyboardHints = val)"
        />
      </div>

      <!-- Save Button -->
      <div class="pt-4">
        <Button class="w-full" @click="saveSettings">
          <Check class="w-4 h-4 mr-2" />
          {{ t('saveBtn') }}
        </Button>
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
import { Languages, Moon, Sun, Folder, Keyboard, Check } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
