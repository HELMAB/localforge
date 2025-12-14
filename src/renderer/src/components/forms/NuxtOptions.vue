<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('nuxtInfoTitle')"
      :message="t('nuxtInfo')"
      type="info"
    />

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
        t('nuxtVersionLabel')
      }}</label>
      <CustomSelect
        :model-value="nuxtVersion"
        :options="nuxtVersionOptions"
        @update:model-value="$emit('update:nuxtVersion', $event)"
      />
    </div>

    <div v-if="nuxtVersion === '4'">
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
        t('nuxtTemplateLabel')
      }}</label>
      <CustomSelect
        :model-value="nuxtTemplate"
        :options="nuxtTemplateOptions"
        @update:model-value="$emit('update:nuxtTemplate', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import InfoBox from '../common/InfoBox.vue'
import CustomSelect from '../common/CustomSelect.vue'
import nuxtIcon from '@/assets/svg/nuxtjs.svg'

const { t } = useI18n()

defineProps({
  nuxtVersion: {
    type: String,
    default: '4',
  },
  nuxtTemplate: {
    type: String,
    default: 'minimal',
  },
})

defineEmits(['update:nuxtVersion', 'update:nuxtTemplate'])

const nuxtVersionOptions = [
  { value: '4', label: 'Nuxt 4.x (Latest - Recommended)', icon: nuxtIcon },
  { value: '3', label: 'Nuxt 3.x', icon: nuxtIcon },
  { value: '2', label: 'Nuxt 2.x (Legacy)', icon: nuxtIcon },
]

const nuxtTemplateOptions = [
  { value: 'minimal', label: 'Minimal - Minimal setup for Nuxt 4 (Recommended)', icon: nuxtIcon },
  { value: 'content', label: 'Content - Content-driven website', icon: nuxtIcon },
  { value: 'module', label: 'Module - Nuxt module', icon: nuxtIcon },
  { value: 'ui', label: 'UI - App using Nuxt UI', icon: nuxtIcon },
]
</script>
