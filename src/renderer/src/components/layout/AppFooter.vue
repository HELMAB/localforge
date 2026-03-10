<template>
  <div class="text-center text-muted-foreground text-sm transition-colors">
    <p>{{ t('footer') }} — v{{ version }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import packageJson from '../../../../../package.json'

const { t } = useI18n()
const version = packageJson.version
</script>
