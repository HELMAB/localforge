<template>
  <div>
    <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('projectTypeLabel') }}</label>
    <CustomSelect
      :model-value="modelValue"
      :options="frameworks"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import CustomSelect from '../common/CustomSelect.vue'
import laravelIcon from '@/assets/svg/laravel.svg'
import vuejsIcon from '@/assets/svg/vuejs.svg'
import nuxtjsIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: String,
    default: 'laravel'
  }
})

defineEmits(['update:modelValue'])

const frameworks = [
  { value: 'laravel', label: 'Laravel', icon: laravelIcon },
  { value: 'vue', label: 'Vue.js', icon: vuejsIcon },
  { value: 'nuxt', label: 'Nuxt.js', icon: nuxtjsIcon },
  { value: 'react', label: 'React', icon: reactIcon },
  { value: 'wordpress', label: 'WordPress', icon: wordpressIcon }
]
</script>
