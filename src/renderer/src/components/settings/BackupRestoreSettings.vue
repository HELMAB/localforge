<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <div
      class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('settings.backupRestore') }}
      </h2>
    </div>
    <div class="p-6">
      <BackupRestore />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BackupRestore from '@/components/settings/BackupRestore.vue'

const { t } = useI18n()
</script>
