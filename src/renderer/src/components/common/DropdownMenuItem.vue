<template>
  <button
    type="button"
    class="w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2"
    :class="[
      disabled
        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
        : `${colorClass} hover:bg-gray-100 dark:hover:bg-gray-700`,
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <Check v-if="icon === 'check'" class="w-4 h-4" />
    <Trash2 v-else-if="icon === 'trash'" class="w-4 h-4" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
import { Check, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'danger', 'primary'
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const colorClass = {
  default: 'text-gray-700 dark:text-gray-300',
  primary: 'text-blue-600 dark:text-blue-400',
  danger: 'text-red-600 dark:text-red-400',
}[props.variant]

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>
