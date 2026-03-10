<template>
  <Dialog :open="visible" @update:open="(v) => !v && $emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
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
            <DialogTitle :class="titleClass">{{ title }}</DialogTitle>
            <DialogDescription class="mt-2">{{ message }}</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="$emit('close')">{{ cancelText }}</Button>
        <Button :class="confirmButtonClass" @click="$emit('confirm')">{{ confirmText }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  level: { type: String, default: 'danger' },
})

defineEmits(['close', 'confirm'])

const titleClass = computed(
  () =>
    ({
      danger: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400',
    })[props.level]
)

const iconBgClass = computed(
  () =>
    ({
      danger: 'bg-red-100 dark:bg-red-900',
      warning: 'bg-yellow-100 dark:bg-yellow-900',
      info: 'bg-blue-100 dark:bg-blue-900',
    })[props.level]
)

const iconColorClass = computed(
  () =>
    ({
      danger: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400',
    })[props.level]
)

const confirmButtonClass = computed(
  () =>
    ({
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      info: 'bg-blue-600 hover:bg-blue-700 text-white',
    })[props.level]
)
</script>
