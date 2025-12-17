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
          <svg
            class="w-6 h-6 text-blue-600 dark:text-blue-400"
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
          <svg
            class="w-6 h-6 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
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
import packageJson from '../../../../../package.json'

const { t } = useI18n()

const appVersion = packageJson.version
const platform = typeof process !== 'undefined' ? `${process.platform} ${process.arch}` : 'Unknown'
</script>
