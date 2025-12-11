<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
      {{ t('nginxTitle') }}
    </h2>
    <NginxConfigForm />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import NginxConfigForm from '../components/forms/NginxConfigForm.vue'

const { t } = useI18n()
</script>
