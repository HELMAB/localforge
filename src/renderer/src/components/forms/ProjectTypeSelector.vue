<template>
  <div>
    <Label class="block text-sm font-medium mb-3 dark:text-gray-300 flex items-center gap-2">
      <Terminal class="h-4 w-4" />
      {{ t('projectTypeLabel') }}
    </Label>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Button
        v-for="framework in frameworks"
        :key="framework.value"
        type="button"
        variant="outline"
        :class="[
          'group relative p-4 h-auto rounded-lg border-2 transition-all duration-200 hover:scale-105',
          modelValue === framework.value
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/20'
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
            <img :src="framework.icon" :alt="framework.label" class="w-8 h-8" />
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
          <Check class="h-3 w-3 text-white" />
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Terminal, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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
