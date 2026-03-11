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
  info: 'bg-info/10 dark:bg-info/20 border-info dark:border-info',
  warning: 'bg-warning/10 dark:bg-warning/20 border-warning dark:border-warning',
}

const iconClasses = {
  info: 'text-info dark:text-info',
  warning: 'text-warning dark:text-warning',
}

const titleClasses = {
  info: 'text-info dark:text-info',
  warning: 'text-warning dark:text-warning',
}

const messageClasses = {
  info: 'text-foreground/80 dark:text-foreground/80',
  warning: 'text-foreground/80 dark:text-foreground/80',
}
</script>
