<script setup>
import { reactiveOmit } from '@vueuse/core'
import { SelectSeparator } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: undefined },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
    default: undefined,
  },
})

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <SelectSeparator v-bind="delegatedProps" :class="cn('-mx-1 my-1 h-px bg-muted', props.class)" />
</template>
