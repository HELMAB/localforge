<template>
  <Dialog :open="visible" @update:open="(v) => !v && $emit('close')">
    <DialogContent class="max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
      <DialogHeader class="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full"
            :class="
              isComplete
                ? hasError
                  ? 'bg-red-100 dark:bg-red-900'
                  : 'bg-green-100 dark:bg-green-900'
                : 'bg-blue-100 dark:bg-blue-900'
            "
          >
            <LoaderCircle
              v-if="!isComplete"
              class="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400"
            />
            <X v-else-if="hasError" class="w-6 h-6 text-red-600 dark:text-red-400" />
            <Check v-else class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="flex-1">
            <DialogTitle>{{ title }}</DialogTitle>
            <DialogDescription>{{ subtitle }}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto p-6 bg-gray-900 dark:bg-black min-h-0">
        <pre
          ref="logContainer"
          class="text-xs font-mono text-green-400 whitespace-pre-wrap break-words"
          >{{ output || (isComplete ? 'No output' : 'Waiting for output...') }}</pre
        >
      </div>

      <div
        class="p-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-3 shrink-0"
      >
        <Button v-if="!isComplete" variant="outline" @click="$emit('cancel')">
          {{ cancelText }}
        </Button>
        <Button
          v-else
          :class="
            hasError
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          "
          @click="$emit('close')"
        >
          {{ closeText }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { Check, LoaderCircle, X } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  output: { type: String, default: '' },
  isComplete: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false },
  closeText: { type: String, default: 'Close' },
  cancelText: { type: String, default: 'Cancel' },
})

defineEmits(['close', 'cancel'])

const logContainer = ref(null)

watch(
  () => props.output,
  () => {
    nextTick(() => {
      if (logContainer.value) {
        logContainer.value.scrollTop = logContainer.value.scrollHeight
      }
    })
  }
)
</script>
