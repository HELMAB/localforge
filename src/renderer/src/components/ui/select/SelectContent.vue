<script setup>
import { reactiveOmit } from '@vueuse/core'
import { SelectContent, SelectPortal, SelectViewport, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import { SelectScrollDownButton, SelectScrollUpButton } from '.'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  forceMount: { type: Boolean, required: false },
  position: { type: String, required: false, default: 'popper' },
  bodyLock: { type: Boolean, required: false },
  side: { type: null, required: false, default: undefined },
  sideOffset: { type: Number, required: false, default: undefined },
  sideFlip: { type: Boolean, required: false },
  align: { type: null, required: false, default: undefined },
  alignOffset: { type: Number, required: false, default: undefined },
  alignFlip: { type: Boolean, required: false },
  avoidCollisions: { type: Boolean, required: false },
  collisionBoundary: { type: null, required: false, default: undefined },
  collisionPadding: { type: [Number, Object], required: false, default: undefined },
  arrowPadding: { type: Number, required: false, default: undefined },
  hideShiftedArrow: { type: Boolean, required: false },
  sticky: { type: String, required: false, default: undefined },
  hideWhenDetached: { type: Boolean, required: false },
  positionStrategy: { type: String, required: false, default: undefined },
  updatePositionStrategy: { type: String, required: false, default: undefined },
  disableUpdateOnLayoutShift: { type: Boolean, required: false },
  prioritizePosition: { type: Boolean, required: false },
  reference: { type: null, required: false, default: undefined },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: undefined },
  disableOutsidePointerEvents: { type: Boolean, required: false },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
    default: undefined,
  },
})
const emits = defineEmits(['closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside'])

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          props.class
        )
      "
    >
      <SelectScrollUpButton />
      <SelectViewport
        :class="
          cn(
            'p-1',
            position === 'popper' &&
              'h-[--reka-select-trigger-height] w-full min-w-[--reka-select-trigger-width]'
          )
        "
      >
        <slot />
      </SelectViewport>
      <SelectScrollDownButton />
    </SelectContent>
  </SelectPortal>
</template>
