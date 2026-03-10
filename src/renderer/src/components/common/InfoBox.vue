<template>
  <div :class="boxClasses[type]" class="border-l-4 rounded-lg p-4 shadow-sm">
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <div class="flex-shrink-0 mt-0.5">
        <Info v-if="type === 'info'" class="w-5 h-5" :class="iconClasses[type]" />
        <TriangleAlert v-else-if="type === 'warning'" class="w-5 h-5" :class="iconClasses[type]" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold mb-1" :class="titleClasses[type]">
          {{ title }}
        </h4>
        <p class="text-sm leading-relaxed" :class="messageClasses[type]">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Info, TriangleAlert } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning'].includes(value),
  },
})

const boxClasses = {
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 dark:border-yellow-600',
}

const iconClasses = {
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
}

const titleClasses = {
  info: 'text-blue-900 dark:text-blue-100',
  warning: 'text-yellow-900 dark:text-yellow-100',
}

const messageClasses = {
  info: 'text-blue-800 dark:text-blue-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
}
</script>
