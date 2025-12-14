import { ref } from 'vue'

export function useProgress() {
  const isLoading = ref(false)
  const progress = ref(0)
  const message = ref('')

  const startProgress = (initialMessage = 'Processing...') => {
    isLoading.value = true
    progress.value = 0
    message.value = initialMessage
  }

  const updateProgress = (value, msg) => {
    progress.value = Math.min(100, Math.max(0, value))
    if (msg) message.value = msg
  }

  const completeProgress = (finalMessage = 'Completed!') => {
    progress.value = 100
    message.value = finalMessage
    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
      message.value = ''
    }, 1500)
  }

  const failProgress = (errorMessage = 'Failed') => {
    message.value = errorMessage
    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
      message.value = ''
    }, 2000)
  }

  return {
    isLoading,
    progress,
    message,
    startProgress,
    updateProgress,
    completeProgress,
    failProgress,
  }
}
