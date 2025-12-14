<template>
  <div class="update-checker">
    <div
      v-if="updateError"
      class="alert alert-error mb-4"
    >
      {{ t('settings.updateError') }}: {{ updateError }}
    </div>

    <div
      v-if="updateAvailable && !updateDownloaded"
      class="alert alert-info mb-4"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="font-medium">
            {{ t('settings.updateAvailable') }}
          </p>
          <p class="text-sm mt-1">
            {{ t('settings.newVersion') }}: {{ updateInfo?.version }}
          </p>
        </div>
        <button
          :disabled="downloading"
          class="btn btn-primary btn-sm"
          @click="downloadUpdate"
        >
          {{ downloading ? t('settings.downloading') : t('settings.download') }}
        </button>
      </div>
    </div>

    <div
      v-if="downloading && downloadProgress"
      class="mb-4"
    >
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          :style="{ width: downloadProgress.percent + '%' }"
        />
      </div>
      <p class="text-sm text-center mt-2">
        {{ Math.round(downloadProgress.percent) }}% -
        {{ formatBytes(downloadProgress.transferred) }} /
        {{ formatBytes(downloadProgress.total) }}
      </p>
    </div>

    <div
      v-if="updateDownloaded"
      class="alert alert-success mb-4"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="font-medium">
            {{ t('settings.updateReady') }}
          </p>
          <p class="text-sm mt-1">
            {{ t('settings.updateReadyDesc') }}
          </p>
        </div>
        <button
          class="btn btn-primary btn-sm"
          @click="installUpdate"
        >
          {{ t('settings.restartInstall') }}
        </button>
      </div>
    </div>

    <div
      v-if="!updateAvailable && updateInfo"
      class="alert alert-success mb-4"
    >
      <div v-if="updateInfo.isDevelopment">
        <p class="font-medium">
          {{ t('settings.devMode') }}
        </p>
        <p class="text-sm mt-1">
          {{ t('settings.devModeDesc') }}
        </p>
      </div>
      <div v-else>
        {{ t('settings.upToDate') }}
      </div>
    </div>

    <button
      :disabled="checking || downloading"
      class="btn btn-secondary"
      @click="checkForUpdates"
    >
      {{ checking ? t('settings.checking') : t('settings.checkUpdates') }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useUpdater } from '@/composables/useUpdater'

const { t } = useI18n()

const {
  updateAvailable,
  updateInfo,
  downloadProgress,
  updateDownloaded,
  updateError,
  checking,
  downloading,
  checkForUpdates,
  downloadUpdate,
  installUpdate,
} = useUpdater()

const formatBytes = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped>
.alert {
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid;
}

.alert-info {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1e40af;
}

.dark .alert-info {
  background: #1e3a8a;
  border-color: #3b82f6;
  color: #dbeafe;
}

.alert-success {
  background: #dcfce7;
  border-color: #22c55e;
  color: #166534;
}

.dark .alert-success {
  background: #14532d;
  border-color: #22c55e;
  color: #dcfce7;
}

.alert-error {
  background: #fee2e2;
  border-color: #ef4444;
  color: #991b1b;
}

.dark .alert-error {
  background: #7f1d1d;
  border-color: #ef4444;
  color: #fee2e2;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.btn {
  padding: 0.5rem 1rem;
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

.dark .btn-primary {
  background: #2563eb;
  color: white;
}

.dark .btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.dark .btn-secondary {
  background: #4b5563;
  color: white;
}

.dark .btn-secondary:hover:not(:disabled) {
  background: #374151;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
</style>
