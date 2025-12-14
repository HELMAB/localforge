import { ref } from 'vue'

const visible = ref(false)
const title = ref('')
const subtitle = ref('')
const message = ref('')
const details = ref('')
const suggestions = ref([])
const context = ref(null)
const onRetry = ref(null)

export function useErrorModal() {
  function showError(error, options = {}) {
    // Extract error information
    if (typeof error === 'string') {
      message.value = error
      details.value = ''
    } else if (error instanceof Error) {
      message.value = error.message
      details.value = error.stack || ''
    } else {
      message.value = error?.message || 'Unknown error'
      details.value = error?.stack || JSON.stringify(error, null, 2)
    }

    // Set options
    title.value = options.title || ''
    subtitle.value = options.subtitle || ''
    suggestions.value = options.suggestions || []
    context.value = options.context || null
    onRetry.value = options.onRetry || null

    // Show modal
    visible.value = true
  }

  function showErrorWithContext(error, contextInfo) {
    const errorContext = {
      timestamp: new Date().toLocaleString(),
      ...contextInfo,
    }

    showError(error, {
      context: errorContext,
    })
  }

  function hideError() {
    visible.value = false
    // Clear after animation
    setTimeout(() => {
      title.value = ''
      subtitle.value = ''
      message.value = ''
      details.value = ''
      suggestions.value = []
      context.value = null
      onRetry.value = null
    }, 300)
  }

  return {
    // State
    visible,
    title,
    subtitle,
    message,
    details,
    suggestions,
    context,
    onRetry,

    // Methods
    showError,
    showErrorWithContext,
    hideError,
  }
}
