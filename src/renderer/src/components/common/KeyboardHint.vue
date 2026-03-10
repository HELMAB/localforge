<template>
  <span v-if="showHints" class="inline-flex items-center ml-2">
    <kbd class="lg-kbd">{{ hint }}</kbd>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useSettings } from '../../composables/useSettings'

defineProps({
  hint: {
    type: String,
    required: true,
  },
})

const { settings } = useSettings()
const showHints = computed(() => settings.value.showKeyboardHints)
</script>
