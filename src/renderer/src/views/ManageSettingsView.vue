<template>
  <div class="lg-panel p-4 sm:p-6">
    <div
      class="mb-6 flex items-center justify-between rounded-2xl border px-5 py-4 backdrop-blur-xl"
      :class="['bg-background/35 border-border/60']"
    >
      <span class="text-sm font-semibold text-foreground/80">
        {{ t('peaceBannerControl') }}
      </span>
      <button
        class="px-3.5 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
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
