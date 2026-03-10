<script setup>
import { cn } from '@/lib/utils'
import { alertVariants } from '.'

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
    default: undefined,
  },
  variant: { type: null, required: false, default: undefined },
})
</script>

<template>
  <div :class="cn(alertVariants({ variant }), props.class)" role="alert">
    <slot />
  </div>
</template>
