<script setup>
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'

const props = defineProps({
  defaultValue: { type: null, required: false, default: undefined },
  orientation: { type: String, required: false, default: undefined },
  dir: { type: String, required: false, default: undefined },
  activationMode: { type: String, required: false, default: undefined },
  modelValue: { type: null, required: false, default: undefined },
  unmountOnHide: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: undefined },
})
const emits = defineEmits(['update:modelValue'])

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>
