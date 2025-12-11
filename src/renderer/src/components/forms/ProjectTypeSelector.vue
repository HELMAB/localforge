<template>
  <div>
    <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('projectTypeLabel') }}</label>
    <select
      :value="modelValue"
      class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="laravel">
        Laravel
      </option>
      <option value="vue">
        Vue.js
      </option>
      <option value="nuxt">
        Nuxt.js
      </option>
      <option value="react">
        React
      </option>
      <option value="wordpress">
        WordPress
      </option>
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
