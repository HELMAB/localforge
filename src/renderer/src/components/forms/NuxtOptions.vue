<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('nuxtInfoTitle')"
      :message="t('nuxtInfo')"
      type="info"
    />

    <InfoBox
      :title="t('nuxtRequirementsTitle')"
      :message="t('nuxtRequirementsMessage')"
      type="warning"
    />

    <div>
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
  nuxtTemplate: {
    type: String,
    default: 'minimal',
  },
})

defineEmits(['update:nuxtTemplate'])

const nuxtTemplateOptions = [
  { value: 'minimal', label: 'Minimal - Minimal setup for Nuxt 4 (Recommended)', icon: nuxtIcon },
  { value: 'content', label: 'Content - Content-driven website', icon: nuxtIcon },
  { value: 'module', label: 'Module - Nuxt module', icon: nuxtIcon },
  { value: 'ui', label: 'UI - App using Nuxt UI', icon: nuxtIcon },
]
</script>
