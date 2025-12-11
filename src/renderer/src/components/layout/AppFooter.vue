<template>
  <div class="text-center text-gray-600 text-sm">
    <p>{{ t('footer') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
