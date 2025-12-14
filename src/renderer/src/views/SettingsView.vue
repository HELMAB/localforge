<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      {{ t('settings.title') }}
    </h1>

    <div class="space-y-6">
      <!-- Auto-Update Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ t('settings.autoUpdate') }}
        </h2>
        <UpdateChecker />
      </div>

      <!-- Backup/Restore Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ t('settings.backupRestore') }}
        </h2>
        <BackupRestore />
      </div>

      <!-- Application Info -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ t('settings.appInfo') }}
        </h2>
        <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <span class="font-medium">{{ t('settings.version') }}:</span> {{ appVersion }}
          </div>
          <div>
            <span class="font-medium">{{ t('settings.platform') }}:</span> {{ platform }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import UpdateChecker from '@/components/settings/UpdateChecker.vue'
import BackupRestore from '@/components/settings/BackupRestore.vue'

const { t } = useI18n()

// Get version from package.json
const appVersion = '1.0.0'

// Get platform info
const platform = typeof process !== 'undefined' ? `${process.platform} ${process.arch}` : 'Unknown'
</script>
