<template>
  <div class="p-6 flex items-center justify-center h-full">
    <div class="text-center text-gray-500">
      <p class="text-lg font-medium">{{ title }}</p>
      <p class="text-sm mt-1">{{ t('comingSoon') }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  title: {
    type: String,
    default: 'Feature',
  },
})
</script>
