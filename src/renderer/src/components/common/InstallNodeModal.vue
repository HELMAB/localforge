<template>
  <Dialog :open="visible" @update:open="(v) => !v && handleClose()">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
          >
            <img src="@/assets/svg/nodejs.svg" alt="Node.js" class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <DialogTitle>{{ title }}</DialogTitle>
            <DialogDescription class="mt-2">{{ message }}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div class="mt-2">
        <Label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {{ inputLabel }}
        </Label>
        <Input
          ref="inputRef"
          v-model="inputValue"
          type="text"
          :placeholder="placeholder"
          @keyup.enter="handleInstall"
          @keyup.esc="handleClose"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">{{ cancelText }}</Button>
        <Button :disabled="!inputValue" @click="handleInstall">{{ installText }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  inputLabel: { type: String, required: true },
  placeholder: { type: String, default: '' },
  installText: { type: String, default: 'Install' },
  cancelText: { type: String, default: 'Cancel' },
})

const emit = defineEmits(['close', 'install'])
const inputValue = ref('')
const inputRef = ref(null)

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      inputValue.value = ''
      nextTick(() => inputRef.value?.focus())
    }
  }
)

function handleClose() {
  emit('close')
}

function handleInstall() {
  if (inputValue.value.trim()) {
    emit('install', inputValue.value.trim())
    inputValue.value = ''
  }
}
</script>
