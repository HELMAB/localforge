<template>
  <span v-if="showHints" class="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
    <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">
      {{ hint }}
    </kbd>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useSettings } from '../../composables/useSettings'

const props = defineProps({
  hint: {
    type: String,
    required: true
  }
})

const { settings } = useSettings()
const showHints = computed(() => settings.value.showKeyboardHints)
</script>
