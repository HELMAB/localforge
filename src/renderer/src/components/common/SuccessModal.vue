<template>
  <Dialog :open="visible" @update:open="(v) => !v && $emit('close')">
    <DialogContent class="max-w-sm">
      <div class="flex flex-col items-center text-center py-2">
        <div class="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-4">
          <Check class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ message }}</p>
        <Button class="w-full" @click="$emit('close')">{{ t('ok') }}</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: 'Success' },
  message: { type: String, required: true },
})

defineEmits(['close'])
</script>
