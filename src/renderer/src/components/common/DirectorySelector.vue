<template>
  <div class="flex gap-2">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      readonly
    />
    <button
      @click="handleBrowse"
      class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

async function handleBrowse() {
  const path = await selectDirectory()
  if (path) {
    emit('update:modelValue', path)
  }
}
</script>
