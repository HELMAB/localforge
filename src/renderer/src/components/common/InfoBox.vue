<template>
  <div :class="boxClasses[type]" class="border rounded-lg p-3">
    <p class="text-sm">
      <strong>{{ title }}</strong><br>
      <span>{{ message }}</span>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning'].includes(value)
  }
})

const boxClasses = {
  info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-100',
  warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100'
}
</script>
