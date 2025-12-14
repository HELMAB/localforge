<template>
  <div class="flex gap-2">
    <input
      type="text"
      :value="modelValue"
      class="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      readonly
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <button
      class="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
      @click="handleBrowse"
    >
      <span>{{ t('browseBtn') }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useProject } from '../../composables/useProject'

const { t } = useI18n()
const { selectDirectory } = useProject()

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

async function handleBrowse() {
  const path = await selectDirectory()
  if (path) {
    emit('update:modelValue', path)
  }
}
</script>
