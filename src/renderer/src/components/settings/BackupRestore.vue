<template>
  <div>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ t('settings.backupDesc') }}</p>

    <div
      v-if="message"
      class="mb-4 p-3 rounded-md border text-sm"
      :class="
        messageType === 'error'
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
      "
    >
      {{ message }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        class="p-5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
      >
        <div class="flex items-center mb-3">
          <Download class="w-6 h-6 mr-2 text-gray-700 dark:text-gray-300" />
          <h4 class="font-medium text-gray-900 dark:text-white">{{ t('settings.export') }}</h4>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ t('settings.exportDesc') }}</p>
        <Button class="w-full" :disabled="exporting" @click="handleExport">
          {{ exporting ? t('settings.exporting') : t('settings.exportButton') }}
        </Button>
      </div>

      <div
        class="p-5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
      >
        <div class="flex items-center mb-3">
          <Upload class="w-6 h-6 mr-2 text-gray-700 dark:text-gray-300" />
          <h4 class="font-medium text-gray-900 dark:text-white">{{ t('settings.import') }}</h4>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ t('settings.importDesc') }}</p>
        <Button variant="secondary" class="w-full" :disabled="importing" @click="handleImport">
          {{ importing ? t('settings.importing') : t('settings.importButton') }}
        </Button>
      </div>
    </div>

    <div
      v-if="lastBackupInfo"
      class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <p class="text-sm font-medium mb-2 text-gray-900 dark:text-white">
        {{ t('settings.lastBackup') }}
      </p>
      <div class="text-xs space-y-1 text-gray-600 dark:text-gray-300">
        <div v-if="lastBackupInfo.timestamp">
          <span class="font-medium">{{ t('settings.timestamp') }}:</span>
          {{ formatDate(lastBackupInfo.timestamp) }}
        </div>
        <div v-if="lastBackupInfo.hostname">
          <span class="font-medium">{{ t('settings.hostname') }}:</span>
          {{ lastBackupInfo.hostname }}
        </div>
        <div v-if="lastBackupInfo.version">
          <span class="font-medium">{{ t('settings.version') }}:</span>
          {{ lastBackupInfo.version }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, Upload } from 'lucide-vue-next'
import { useBackup } from '@/composables/useBackup'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
const { exporting, importing, exportBackup, importBackup } = useBackup()

const message = ref(null)
const messageType = ref('success')
const lastBackupInfo = ref(null)

const handleExport = async () => {
  message.value = null
  try {
    const result = await exportBackup()
    if (result.canceled) return
    if (result.success) {
      message.value = t('settings.exportSuccess')
      messageType.value = 'success'
    }
  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  }
}

const handleImport = async () => {
  message.value = null
  lastBackupInfo.value = null
  try {
    const result = await importBackup()
    if (result.canceled) return
    if (result.success) {
      message.value = t('settings.importSuccess')
      messageType.value = 'success'
      if (result.metadata) lastBackupInfo.value = result.metadata
    }
  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  }
}

const formatDate = (dateString) => new Date(dateString).toLocaleString()
</script>
