<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ message }}</h3>
        <Progress :model-value="progress" class="h-3" />
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400 text-center">{{ progress }}%</div>
    </div>
  </div>
</template>

<script setup>
import { Progress } from '@/components/ui/progress'

defineProps({
  isLoading: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  message: { type: String, default: 'Processing...' },
})
</script>
