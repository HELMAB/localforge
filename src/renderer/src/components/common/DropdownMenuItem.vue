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
    <svg
      v-if="icon"
      class="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        v-if="icon === 'check'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 13l4 4L19 7"
      />
      <path
        v-else-if="icon === 'trash'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
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
