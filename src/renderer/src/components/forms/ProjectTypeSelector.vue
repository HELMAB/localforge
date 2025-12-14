<template>
  <div>
    <label class="block text-sm font-medium mb-3 dark:text-gray-300 flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
          clip-rule="evenodd"
        />
      </svg>
      {{ t('projectTypeLabel') }}
    </label>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <button
        v-for="framework in frameworks"
        :key="framework.value"
        type="button"
        :class="[
          'group relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105',
          modelValue === framework.value
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-700',
        ]"
        @click="$emit('update:modelValue', framework.value)"
      >
        <div class="flex flex-col items-center gap-2">
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
              modelValue === framework.value
                ? 'bg-blue-100 dark:bg-blue-900/40'
                : 'bg-gray-100 dark:bg-gray-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20',
            ]"
          >
            <img
              :src="framework.icon"
              :alt="framework.label"
              class="w-8 h-8"
            >
          </div>
          <span
            :class="[
              'text-sm font-medium transition-colors',
              modelValue === framework.value
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400',
            ]"
          >
            {{ framework.label }}
          </span>
        </div>
        <div
          v-if="modelValue === framework.value"
          class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import laravelIcon from '@/assets/svg/laravel.svg'
import vuejsIcon from '@/assets/svg/vuejs.svg'
import nuxtjsIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: String,
    default: 'laravel',
  },
})

defineEmits(['update:modelValue'])

const frameworks = [
  { value: 'laravel', label: 'Laravel', icon: laravelIcon },
  { value: 'vue', label: 'Vue.js', icon: vuejsIcon },
  { value: 'nuxt', label: 'Nuxt.js', icon: nuxtjsIcon },
  { value: 'react', label: 'React', icon: reactIcon },
  { value: 'wordpress', label: 'WordPress', icon: wordpressIcon },
]
</script>
