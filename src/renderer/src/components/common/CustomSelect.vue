<template>
  <Select
    :model-value="toSelectValue(modelValue)"
    :disabled="disabled"
    @update:model-value="(v) => $emit('update:modelValue', fromSelectValue(v))"
  >
    <SelectTrigger class="w-full">
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="option in options"
        :key="option.value"
        :value="toSelectValue(option.value)"
      >
        <div class="flex items-center gap-2">
          <img v-if="option.icon" :src="option.icon" :alt="option.label" class="w-4 h-4" />
          {{ option.label }}
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup>
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const EMPTY_VALUE_SENTINEL = '__empty__'

defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])

function toSelectValue(value) {
  const str = String(value)
  return str === '' ? EMPTY_VALUE_SENTINEL : str
}

function fromSelectValue(value) {
  return value === EMPTY_VALUE_SENTINEL ? '' : value
}
</script>
