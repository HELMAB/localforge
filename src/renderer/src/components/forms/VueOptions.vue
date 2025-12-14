<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('vueInfoTitle')"
      :message="t('vueInfo')"
      type="info"
    />

    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('vueOptionsLabel') }}
      </label>

      <div class="space-y-2">
        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="typescript"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            @change="$emit('update:typescript', $event.target.checked)"
          >
          <span class="text-sm dark:text-gray-300">{{ t('vueTypeScript') }}</span>
        </label>

        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="jsx"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            @change="$emit('update:jsx', $event.target.checked)"
          >
          <span class="text-sm dark:text-gray-300">{{ t('vueJsx') }}</span>
        </label>

        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="router"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            @change="$emit('update:router', $event.target.checked)"
          >
          <span class="text-sm dark:text-gray-300">{{ t('vueRouter') }}</span>
        </label>

        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="pinia"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            @change="$emit('update:pinia', $event.target.checked)"
          >
          <span class="text-sm dark:text-gray-300">{{ t('vuePinia') }}</span>
        </label>

        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="vitest"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            @change="$emit('update:vitest', $event.target.checked)"
          >
          <span class="text-sm dark:text-gray-300">{{ t('vueVitest') }}</span>
        </label>

        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="playwright"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            @change="$emit('update:playwright', $event.target.checked)"
          >
          <span class="text-sm dark:text-gray-300">{{ t('vuePlaywright') }}</span>
        </label>

        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="eslint"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            @change="$emit('update:eslint', $event.target.checked)"
          >
          <span class="text-sm dark:text-gray-300">{{ t('vueEslint') }}</span>
        </label>

        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="prettier"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            @change="$emit('update:prettier', $event.target.checked)"
          >
          <span class="text-sm dark:text-gray-300">{{ t('vuePrettier') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import InfoBox from '../common/InfoBox.vue'

const { t } = useI18n()

defineProps({
  typescript: {
    type: Boolean,
    default: false,
  },
  jsx: {
    type: Boolean,
    default: false,
  },
  router: {
    type: Boolean,
    default: false,
  },
  pinia: {
    type: Boolean,
    default: false,
  },
  vitest: {
    type: Boolean,
    default: false,
  },
  playwright: {
    type: Boolean,
    default: false,
  },
  eslint: {
    type: Boolean,
    default: false,
  },
  prettier: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'update:typescript',
  'update:jsx',
  'update:router',
  'update:pinia',
  'update:vitest',
  'update:playwright',
  'update:eslint',
  'update:prettier',
])
</script>
