<template>
  <div class="p-6">
    <div class="w-full mx-auto">
      <div
        class="mb-6 flex items-center justify-between rounded-xl border border-gray-200/70 bg-white/50 px-6 py-4 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/60"
      >
        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ t('peaceBannerControl') }}
        </span>
        <button
          class="px-3 py-1.5 rounded-md bg-blue-600 text-xs font-semibold text-white transition hover:bg-blue-500"
          @click="toggleBanner"
        >
          {{ showBanner ? t('hidePeaceBanner') : t('showPeaceBanner') }}
        </button>
      </div>

      <div class="space-y-6">
        <PreferenceSettings />

        <AutoUpdateSettings />

        <BackupRestoreSettings />

        <ApplicationInfoSettings />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import PreferenceSettings from '@/components/settings/PreferenceSettings.vue'
import AutoUpdateSettings from '@/components/settings/AutoUpdateSettings.vue'
import BackupRestoreSettings from '@/components/settings/BackupRestoreSettings.vue'
import ApplicationInfoSettings from '@/components/settings/ApplicationInfoSettings.vue'
import { usePeaceBanner } from '../composables/usePeaceBanner'

const { t } = useI18n()
const { showBanner, toggleBanner } = usePeaceBanner()
</script>
