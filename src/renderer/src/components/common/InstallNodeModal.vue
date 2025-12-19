<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        @click.self="handleClose"
      >
        <div class="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
              >
                <img
                  src="@/assets/svg/nodejs.svg"
                  alt="Node.js"
                  class="w-6 h-6"
                >
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ title }}
                </h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {{ message }}
                </p>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {{ inputLabel }}
              </label>
              <input
                ref="inputRef"
                v-model="inputValue"
                type="text"
                :placeholder="placeholder"
                class="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                @keyup.enter="handleInstall"
                @keyup.esc="handleClose"
              >
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
            <button
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="handleClose"
            >
              {{ cancelText }}
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :disabled="!inputValue"
              :class="{ 'opacity-50 cursor-not-allowed': !inputValue }"
              @click="handleInstall"
            >
              {{ installText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  inputLabel: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  installText: {
    type: String,
    default: 'Install',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
})

const emit = defineEmits(['close', 'install'])

const inputValue = ref('')
const inputRef = ref(null)

watch(() => props.visible, (newVal) => {
  if (newVal) {
    inputValue.value = ''
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
