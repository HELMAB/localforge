<template>
  <div
    :class="boxClasses[type]"
    class="border-l-4 rounded-lg p-4 shadow-sm"
  >
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <div class="flex-shrink-0 mt-0.5">
        <svg
          v-if="type === 'info'"
          class="w-5 h-5"
          :class="iconClasses[type]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="type === 'warning'"
          class="w-5 h-5"
          :class="iconClasses[type]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4
          class="text-sm font-semibold mb-1"
          :class="titleClasses[type]"
        >
          {{ title }}
        </h4>
        <p
          class="text-sm leading-relaxed"
          :class="messageClasses[type]"
        >
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
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
