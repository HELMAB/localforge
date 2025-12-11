<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-2">
      {{ t('manageTitle') }}
    </h2>
    <ManageToolsForm />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ManageToolsForm from '../components/forms/ManageToolsForm.vue'

const { t } = useI18n()
</script>
