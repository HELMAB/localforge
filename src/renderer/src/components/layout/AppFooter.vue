<template>
  <div class="text-center text-gray-600 dark:text-gray-400 text-sm transition-colors">
    <p>{{ t('footer') }}</p>
    <p class="text-xs mt-1">v{{ version }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import packageJson from '../../../../../package.json'

const { t } = useI18n()
const version = packageJson.version
</script>
