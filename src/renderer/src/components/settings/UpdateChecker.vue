<template>
  <div>
    <div
      v-if="updateError"
      class="mb-4 p-4 rounded-md border bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
    >
      {{ t('settings.updateError') }}: {{ updateError }}
    </div>

    <div
      v-if="updateAvailable && !updateDownloaded"
      class="mb-4 p-4 rounded-md border bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-medium">{{ t('settings.updateAvailable') }}</p>
          <p class="text-sm mt-1">{{ t('settings.newVersion') }}: {{ updateInfo?.version }}</p>
        </div>
        <Button size="sm" :disabled="downloading" @click="downloadUpdate">
          {{ downloading ? t('settings.downloading') : t('settings.download') }}
        </Button>
      </div>
    </div>

    <div v-if="downloading && downloadProgress" class="mb-4">
      <Progress :model-value="downloadProgress.percent" class="h-2" />
      <p class="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
        {{ Math.round(downloadProgress.percent) }}% -
        {{ formatBytes(downloadProgress.transferred) }} /
        {{ formatBytes(downloadProgress.total) }}
      </p>
    </div>

    <div
      v-if="updateDownloaded"
      class="mb-4 p-4 rounded-md border bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-medium">{{ t('settings.updateReady') }}</p>
          <p class="text-sm mt-1">{{ t('settings.updateReadyDesc') }}</p>
        </div>
        <Button size="sm" @click="installUpdate">
          {{ t('settings.restartInstall') }}
        </Button>
      </div>
    </div>

    <div
      v-if="!updateAvailable && updateInfo"
      class="mb-4 p-4 rounded-md border bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
    >
      <div v-if="updateInfo.isDevelopment">
        <p class="font-medium">{{ t('settings.devMode') }}</p>
        <p class="text-sm mt-1">{{ t('settings.devModeDesc') }}</p>
      </div>
      <div v-else>{{ t('settings.upToDate') }}</div>
    </div>

    <Button variant="secondary" :disabled="checking || downloading" @click="checkForUpdates">
      {{ checking ? t('settings.checking') : t('settings.checkUpdates') }}
    </Button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useUpdater } from '@/composables/useUpdater'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

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
