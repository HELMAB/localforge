import { ref } from 'vue'
import { useIpc } from './useIpc'

export function useSsl() {
  const { invoke } = useIpc()
  const isGenerating = ref(false)
  const error = ref(null)

  async function generateSSL(domain) {
    isGenerating.value = true
    error.value = null

    try {
      const result = await invoke('generate-ssl', { domain })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    error,
    generateSSL
  }
}
