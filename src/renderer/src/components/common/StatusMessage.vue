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
const props = defineProps({
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
  success: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200'
}
</script>
