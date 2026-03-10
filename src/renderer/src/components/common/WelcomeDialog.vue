<template>
  <Dialog :open="show" @update:open="(v) => !v && handleSkip()">
    <DialogContent class="max-w-lg">
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4"
        >
          <svg
            class="h-10 w-10 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('welcomeTitle') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">{{ t('welcomeSubtitle') }}</p>

        <div class="text-left space-y-3 mb-8">
          <div v-for="i in 3" :key="i" class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5"
            >
              <svg
                class="w-4 h-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ t(`feature${i}Title`) }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ t(`feature${i}Desc`) }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <Button class="w-full" @click="handleStartTour">{{ t('startTour') }}</Button>
          <Button variant="ghost" class="w-full" @click="handleSkip">{{ t('skipTour') }}</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
const emit = defineEmits(['start-tour', 'skip'])
const show = ref(true)

const handleStartTour = () => {
  show.value = false
  emit('start-tour')
}

const handleSkip = () => {
  show.value = false
  emit('skip')
}
</script>
