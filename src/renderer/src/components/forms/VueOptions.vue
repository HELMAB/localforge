<template>
  <div class="space-y-4">
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
      <Label class="block text-sm font-medium dark:text-gray-300">
        {{ t('vueOptionsLabel') }}
      </Label>

      <div class="space-y-2">
        <div
          v-for="option in checkboxOptions"
          :key="option.key"
          class="flex items-center space-x-3"
        >
          <Checkbox
            :id="option.key"
            :model-value="option.value"
            @update:model-value="(val) => $emit(`update:${option.key}`, val)"
          />
          <Label :for="option.key" class="text-sm dark:text-gray-300 cursor-pointer font-normal">
            {{ t(option.labelKey) }}
          </Label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const { t } = useI18n()

const props = defineProps({
  typescript: { type: Boolean, default: false },
  jsx: { type: Boolean, default: false },
  router: { type: Boolean, default: false },
  pinia: { type: Boolean, default: false },
  vitest: { type: Boolean, default: false },
  playwright: { type: Boolean, default: false },
  eslint: { type: Boolean, default: false },
  prettier: { type: Boolean, default: false },
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

const checkboxOptions = computed(() => [
  { key: 'typescript', value: props.typescript, labelKey: 'vueTypeScript' },
  { key: 'jsx', value: props.jsx, labelKey: 'vueJsx' },
  { key: 'router', value: props.router, labelKey: 'vueRouter' },
  { key: 'pinia', value: props.pinia, labelKey: 'vuePinia' },
  { key: 'vitest', value: props.vitest, labelKey: 'vueVitest' },
  { key: 'playwright', value: props.playwright, labelKey: 'vuePlaywright' },
  { key: 'eslint', value: props.eslint, labelKey: 'vueEslint' },
  { key: 'prettier', value: props.prettier, labelKey: 'vuePrettier' },
])
</script>
