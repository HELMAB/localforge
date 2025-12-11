<template>
  <div>
    <label class="block text-sm font-medium mb-2">{{ t('projectTypeLabel') }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="laravel">Laravel</option>
      <option value="vue">Vue.js</option>
      <option value="nuxt">Nuxt.js</option>
      <option value="react">React</option>
      <option value="wordpress">WordPress</option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: String,
    default: 'laravel'
  }
})

defineEmits(['update:modelValue'])
</script>
