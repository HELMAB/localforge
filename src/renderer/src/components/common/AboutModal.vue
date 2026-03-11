<template>
  <Dialog :open="visible" @update:open="(v) => !v && $emit('close')">
    <DialogContent class="max-w-sm">
      <div class="flex flex-col items-center text-center py-2">
        <div class="bg-primary/10 p-3 rounded-full mb-4">
          <Rocket class="w-8 h-8 text-primary" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{{ appName }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {{ t('about.version') }}: {{ version }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ description }}</p>
        <Button class="w-full" @click="$emit('close')">{{ t('ok') }}</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-vue-next'

const { t } = useI18n()

defineProps({
  visible: { type: Boolean, required: true },
  appName: { type: String, default: 'LocalForge' },
  version: { type: String, required: true },
  description: { type: String, default: '' },
})

defineEmits(['close'])
</script>
