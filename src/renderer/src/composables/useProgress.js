import { ref } from 'vue'

export function useProgress() {
  const isLoading = ref(false)
  const progress = ref(0)
  const message = ref('')
  let intervalId = null

  function startProgress(msg = 'Processing...') {
    message.value = msg
    progress.value = 0
    isLoading.value = true
    intervalId = setInterval(() => {
      if (progress.value < 85) {
        progress.value = Math.min(85, progress.value + Math.random() * 8 + 2)
      }
    }, 400)
  }

  function completeProgress(msg = 'Completed!') {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    progress.value = 100
    message.value = msg
    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
    }, 600)
  }

  function failProgress(msg = 'Failed') {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isLoading.value = false
    progress.value = 0
    message.value = msg
  }

  return { isLoading, progress, message, startProgress, completeProgress, failProgress }
}
