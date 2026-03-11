<template>
  <div class="p-6">
    <div class="w-full mx-auto">
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
import PreferenceSettings from '@/components/settings/PreferenceSettings.vue'
import AutoUpdateSettings from '@/components/settings/AutoUpdateSettings.vue'
import BackupRestoreSettings from '@/components/settings/BackupRestoreSettings.vue'
import ApplicationInfoSettings from '@/components/settings/ApplicationInfoSettings.vue'
</script>
