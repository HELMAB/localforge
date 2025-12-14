import { ref } from 'vue'

export function useStatus() {
  const message = ref('')
  const type = ref('info')
  const visible = ref(false)

  function showStatus(msg, statusType = 'info') {
    message.value = msg
    type.value = statusType
    visible.value = true
  }

  function hideStatus() {
    visible.value = false
  }

  function clearStatus() {
    message.value = ''
    type.value = 'info'
    visible.value = false
  }

  return {
    message,
    type,
    visible,
    showStatus,
    hideStatus,
    clearStatus,
  }
}
