<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div
      class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('settings.autoUpdate') }}
      </h2>
    </div>
    <div class="p-6 space-y-5">
      <!-- Description Section -->
      <div class="flex items-start gap-3">
        <div
          class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ t('settings.autoUpdate') }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ t('settings.autoUpdateDesc') }}
          </p>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700" />

      <!-- Update Checker Component -->
      <UpdateChecker />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import UpdateChecker from '@/components/settings/UpdateChecker.vue'

const { t } = useI18n()
</script>
