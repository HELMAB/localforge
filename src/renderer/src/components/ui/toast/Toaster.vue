<script setup>
import {
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { removeToast, useToastState } from './use-toast'

const state = useToastState()

function toastClasses(variant) {
  switch (variant) {
    case 'success':
      return 'border-success/30 bg-success/10 text-success dark:border-success/40 dark:bg-success/20 dark:text-success-foreground'
    case 'error':
      return 'border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/20 dark:text-destructive-foreground'
    case 'warning':
      return 'border-warning/30 bg-warning/10 text-warning dark:border-warning/40 dark:bg-warning/20 dark:text-warning-foreground'
    case 'info':
      return 'border-info/30 bg-info/10 text-info dark:border-info/40 dark:bg-info/20 dark:text-info-foreground'
    default:
      return 'border-border bg-background text-foreground'
  }
}

function handleOpenChange(toast, open) {
  toast.open = open
  if (!open) {
    setTimeout(() => removeToast(toast.id), 200)
  }
}
</script>

<template>
  <ToastProvider>
    <ToastViewport
      class="fixed top-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:right-0 sm:top-0 sm:max-w-sm"
    />

    <ToastRoot
      v-for="t in state.toasts"
      :key="t.id"
      :open="t.open"
      :duration="t.duration"
      :class="
        cn(
          'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 pr-10 shadow-lg transition-all',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-top-0 sm:data-[state=open]:slide-in-from-right-full',
          'data-[state=closed]:slide-out-to-right-full',
          toastClasses(t.variant)
        )
      "
      @update:open="(open) => handleOpenChange(t, open)"
    >
      <div class="grid gap-1">
        <ToastTitle v-if="t.title" class="text-sm font-semibold leading-none">
          {{ t.title }}
        </ToastTitle>
        <ToastDescription v-if="t.description" class="text-sm opacity-90">
          {{ t.description }}
        </ToastDescription>
      </div>

      <ToastClose
        class="absolute right-2 top-2 rounded-md p-1 text-foreground/60 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100"
        aria-label="Close"
      >
        <X class="h-4 w-4" />
      </ToastClose>
    </ToastRoot>
  </ToastProvider>
</template>
