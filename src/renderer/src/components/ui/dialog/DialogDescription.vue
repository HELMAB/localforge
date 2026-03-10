<script setup>
import { reactiveOmit } from '@vueuse/core'
import { DialogDescription, useForwardProps } from 'reka-ui'
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

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
