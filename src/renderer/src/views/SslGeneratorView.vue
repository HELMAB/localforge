<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">
      {{ t('sslTitle') }}
    </h2>
    <SslGeneratorForm />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import SslGeneratorForm from '../components/forms/SslGeneratorForm.vue'

const { t } = useI18n()
</script>
