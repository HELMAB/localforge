<template>
  <div
    v-if="visible"
    :class="[
      'mt-4 p-4 rounded-lg border',
      statusClasses[type]
    ]"
    style="white-space: pre-line"
  >
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const statusClasses = {
  success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-200 dark:border-green-700',
  error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-200 dark:border-red-700',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-700'
}
</script>
