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
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
}
</script>
