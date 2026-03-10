<template>
  <div class="flex gap-2">
    <Input
      type="text"
      :value="modelValue"
      :placeholder="t('defaultProjectPathPlaceholder')"
      class="flex-1"
      readonly
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <Button variant="secondary" @click="handleBrowse">
      {{ t('browseBtn') }}
    </Button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useProject } from '../../composables/useProject'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
const { selectDirectory } = useProject()

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

async function handleBrowse() {
  const path = await selectDirectory()
  if (path) {
    emit('update:modelValue', path)
  }
}
</script>
