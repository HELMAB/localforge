<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-5"
    >
      <div
        v-if="visible"
        class="fixed top-6 right-6 z-50 max-w-md min-w-80 shadow-2xl rounded-lg border"
        :class="statusClasses[type]"
      >
        <div class="p-4 flex items-start gap-3">
          <div class="flex-shrink-0">
            <CheckCircle2 v-if="type === 'success'" class="w-6 h-6" />
            <XCircle v-else-if="type === 'error'" class="w-6 h-6" />
            <Info v-else class="w-6 h-6" />
          </div>

          <div class="flex-1 text-sm font-medium whitespace-pre-line">{{ message }}</div>

          <button class="flex-shrink-0 hover:opacity-70 transition-opacity" @click="$emit('close')">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { CheckCircle2, XCircle, Info, X } from 'lucide-vue-next'

defineProps({
  message: { type: String, default: '' },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value),
  },
  visible: { type: Boolean, default: false },
})

defineEmits(['close'])

const statusClasses = {
  success:
    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-200 dark:border-green-700',
  error:
    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-200 dark:border-red-700',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-700',
}
</script>
