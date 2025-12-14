<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-600 dark:text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {{ title || t('errorTitle') }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ subtitle || t('errorSubtitle') }}
                </p>
              </div>
            </div>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Error Message -->
            <div
              v-if="message"
              class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            >
              <p class="text-sm text-red-900 dark:text-red-100 whitespace-pre-wrap">
                {{ message }}
              </p>
            </div>

            <!-- Error Details (Stack Trace) -->
            <div
              v-if="details"
              class="space-y-2"
            >
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ t('errorDetails') }}
                </h4>
                <button
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  @click="toggleDetails"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform"
                    :class="{ 'rotate-180': showDetails }"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ showDetails ? t('hideDetails') : t('showDetails') }}
                </button>
              </div>
              
              <Transition name="slide-down">
                <div
                  v-if="showDetails"
                  class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto relative"
                >
                  <button
                    class="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                    :title="t('copyError')"
                    @click="copyDetails"
                  >
                    <svg
                      v-if="!copied"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <pre class="text-xs font-mono whitespace-pre-wrap break-words pr-10">{{ details }}</pre>
                </div>
              </Transition>
            </div>

            <!-- Suggestions -->
            <div
              v-if="suggestions && suggestions.length > 0"
              class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ t('suggestions') }}
              </h4>
              <ul class="space-y-2 text-sm text-blue-900 dark:text-blue-100">
                <li
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ suggestion }}</span>
                </li>
              </ul>
            </div>

            <!-- Context Information -->
            <div
              v-if="context"
              class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {{ t('contextInfo') }}
              </h4>
              <dl class="space-y-1 text-sm">
                <div
                  v-for="(value, key) in context"
                  :key="key"
                  class="flex gap-2"
                >
                  <dt class="font-medium text-gray-600 dark:text-gray-400">
                    {{ key }}:
                  </dt>
                  <dd class="text-gray-900 dark:text-gray-100">
                    {{ value }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
              @click="copyAllError"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              {{ t('copyFullError') }}
            </button>
            <div class="flex gap-2">
              <button
                v-if="onRetry"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                @click="handleRetry"
              >
                {{ t('retry') }}
              </button>
              <button
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                @click="closeModal"
              >
                {{ t('close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  context: {
    type: Object,
    default: () => null
  },
  onRetry: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['close'])

const showDetails = ref(false)
const copied = ref(false)

function toggleDetails() {
  showDetails.value = !showDetails.value
}

function closeModal() {
  emit('close')
}

function handleRetry() {
  if (props.onRetry) {
    props.onRetry()
  }
  closeModal()
}

async function copyDetails() {
  try {
    await navigator.clipboard.writeText(props.details)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to copy:', error)
  }
}

async function copyAllError() {
  const errorText = formatFullError()
  try {
    await navigator.clipboard.writeText(errorText)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to copy:', error)
  }
}

function formatFullError() {
  let text = `ERROR REPORT\n${'='.repeat(50)}\n\n`
  
  if (props.title) text += `Title: ${props.title}\n`
  if (props.subtitle) text += `Subtitle: ${props.subtitle}\n`
  text += `\n`
  
  if (props.message) {
    text += `Message:\n${props.message}\n\n`
  }
  
  if (props.details) {
    text += `Details:\n${props.details}\n\n`
  }
  
  if (props.context) {
    text += `Context:\n`
    for (const [key, value] of Object.entries(props.context)) {
      text += `  ${key}: ${value}\n`
    }
    text += `\n`
  }
  
  if (props.suggestions && props.suggestions.length > 0) {
    text += `Suggestions:\n`
    props.suggestions.forEach((suggestion, index) => {
      text += `  ${index + 1}. ${suggestion}\n`
    })
  }
  
  text += `\n${'='.repeat(50)}\n`
  text += `Generated: ${new Date().toISOString()}\n`
  
  return text
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
