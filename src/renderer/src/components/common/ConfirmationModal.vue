<template>
  <Dialog :open="visible" @update:open="(v) => !v && $emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full"
            :class="iconBgClass"
          >
            <TriangleAlert class="w-6 h-6" :class="iconColorClass" />
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
import { TriangleAlert } from 'lucide-vue-next'
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
      danger: 'text-destructive dark:text-destructive',
      warning: 'text-warning dark:text-warning',
      info: 'text-info dark:text-info',
    })[props.level]
)

const iconBgClass = computed(
  () =>
    ({
      danger: 'bg-destructive/10 dark:bg-destructive/20',
      warning: 'bg-warning/10 dark:bg-warning/20',
      info: 'bg-info/10 dark:bg-info/20',
    })[props.level]
)

const iconColorClass = computed(
  () =>
    ({
      danger: 'text-destructive dark:text-destructive',
      warning: 'text-warning dark:text-warning',
      info: 'text-info dark:text-info',
    })[props.level]
)

const confirmButtonClass = computed(
  () =>
    ({
      danger: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
      warning: 'bg-warning hover:bg-warning/90 text-warning-foreground',
      info: 'bg-info hover:bg-info/90 text-info-foreground',
    })[props.level]
)
</script>
