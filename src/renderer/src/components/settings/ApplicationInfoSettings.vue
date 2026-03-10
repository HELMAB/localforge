<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div
      class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('settings.appInfo') }}
      </h2>
    </div>
    <div class="p-6 space-y-4">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
        >
          <Code2 class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {{ t('settings.version') }}
          </div>
          <div class="text-lg font-bold text-gray-900 dark:text-white">
            {{ appVersion }}
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700" />

      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center"
        >
          <Monitor class="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {{ t('settings.platform') }}
          </div>
          <div class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ platform }}
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
          Built with ❤️ using Electron + Vue 3
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Code2, Monitor } from 'lucide-vue-next'
import packageJson from '../../../../../package.json'

const { t } = useI18n()

const appVersion = packageJson.version
const platform = typeof process !== 'undefined' ? `${process.platform} ${process.arch}` : 'Unknown'
</script>
