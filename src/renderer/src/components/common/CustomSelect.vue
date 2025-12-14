<template>
  <div
    ref="dropdownRef"
    class="relative"
  >
    <button
      type="button"
      :disabled="disabled"
      class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      @click="toggleDropdown"
    >
      <div class="flex items-center gap-2">
        <img
          v-if="selectedOption?.icon"
          :src="selectedOption.icon"
          :alt="selectedOption.label"
          class="w-5 h-5"
        >
        <span>{{ selectedOption?.label || placeholder }}</span>
      </div>
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-left text-gray-900 dark:text-white"
        :class="{ 'bg-blue-50 dark:bg-blue-900': modelValue === option.value }"
        @click="selectOption(option.value)"
      >
        <img
          v-if="option.icon"
          :src="option.icon"
          :alt="option.label"
          class="w-5 h-5"
        >
        <span>{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    required: true,
    // Array of { value: string|number, label: string, icon?: string }
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

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)
})

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function selectOption(value) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
