<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">{{ t('createTitle') }}</h2>
    <CreateProjectForm />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import CreateProjectForm from '../components/forms/CreateProjectForm.vue'

const { t } = useI18n()
</script>
