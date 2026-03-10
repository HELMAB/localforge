<script setup>
import { SelectRoot, useForwardPropsEmits } from 'reka-ui'

const props = defineProps({
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  defaultValue: { type: null, required: false, default: undefined },
  modelValue: { type: null, required: false, default: undefined },
  by: { type: [String, Function], required: false, default: undefined },
  dir: { type: String, required: false, default: undefined },
  multiple: { type: Boolean, required: false },
  autocomplete: { type: String, required: false, default: undefined },
  disabled: { type: Boolean, required: false },
  name: { type: String, required: false, default: undefined },
  required: { type: Boolean, required: false },
})
const emits = defineEmits(['update:modelValue', 'update:open'])

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SelectRoot v-bind="forwarded">
    <slot />
  </SelectRoot>
</template>
