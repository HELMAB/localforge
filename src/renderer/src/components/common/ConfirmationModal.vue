<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        @click.self="$emit('close')"
      >
        <div class="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full"
                :class="iconBgClass"
              >
                <svg
                  class="w-6 h-6"
                  :class="iconColorClass"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white"
                  :class="titleClass"
                >
                  {{ title }}
                </h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
            <button
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="$emit('close')"
            >
              {{ cancelText }}
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="confirmButtonClass"
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  level: {
    type: String,
    default: 'danger', // 'danger', 'warning', 'info'
  },
})

defineEmits(['close', 'confirm'])

const titleClass = computed(() => {
  return {
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  }[props.level]
})

const iconBgClass = computed(() => {
  return {
    danger: 'bg-red-100 dark:bg-red-900',
    warning: 'bg-yellow-100 dark:bg-yellow-900',
    info: 'bg-blue-100 dark:bg-blue-900',
  }[props.level]
})

const iconColorClass = computed(() => {
  return {
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  }[props.level]
})

const confirmButtonClass = computed(() => {
  return {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  }[props.level]
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
