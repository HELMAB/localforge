<template>
  <div class="backup-restore">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {{ t('settings.backupDesc') }}
    </p>

    <div
      v-if="message"
      :class="['alert', messageType === 'error' ? 'alert-error' : 'alert-success', 'mb-4']"
    >
      {{ message }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="backup-card">
        <div class="flex items-center mb-3">
          <svg
            class="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <h4 class="font-medium">
            {{ t('settings.export') }}
          </h4>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ t('settings.exportDesc') }}
        </p>
        <button
          :disabled="exporting"
          class="btn btn-primary w-full"
          @click="handleExport"
        >
          {{ exporting ? t('settings.exporting') : t('settings.exportButton') }}
        </button>
      </div>

      <div class="backup-card">
        <div class="flex items-center mb-3">
          <svg
            class="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <h4 class="font-medium">
            {{ t('settings.import') }}
          </h4>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ t('settings.importDesc') }}
        </p>
        <button
          :disabled="importing"
          class="btn btn-secondary w-full"
          @click="handleImport"
        >
          {{ importing ? t('settings.importing') : t('settings.importButton') }}
        </button>
      </div>
    </div>

    <div
      v-if="lastBackupInfo"
      class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <p class="text-sm font-medium mb-2">
        {{ t('settings.lastBackup') }}
      </p>
      <div class="text-xs space-y-1">
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
import { useBackup } from '@/composables/useBackup'

const { t } = useI18n()
const { exporting, importing, exportBackup, importBackup } = useBackup()

const message = ref(null)
const messageType = ref('success')
const lastBackupInfo = ref(null)

const handleExport = async () => {
  message.value = null
  try {
    const result = await exportBackup()
    if (result.canceled) {
      return
    }
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
    if (result.canceled) {
      return
    }
    if (result.success) {
      message.value = t('settings.importSuccess')
      messageType.value = 'success'
      if (result.metadata) {
        lastBackupInfo.value = result.metadata
      }
    }
  } catch (error) {
    message.value = error.message
    messageType.value = 'error'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.backup-card {
  @apply p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800;
}

.alert {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid;
  font-size: 0.875rem;
}

.alert-success {
  background: #dcfce7;
  border-color: #22c55e;
  color: #166534;
}

.alert-error {
  background: #fee2e2;
  border-color: #ef4444;
  color: #991b1b;
}

.btn {
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}
</style>
