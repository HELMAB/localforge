<script setup>
import { SelectValue } from 'reka-ui'

const props = defineProps({
  placeholder: { type: String, required: false, default: undefined },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: undefined },
})
</script>

<template>
  <SelectValue v-bind="props">
    <slot />
  </SelectValue>
</template>
