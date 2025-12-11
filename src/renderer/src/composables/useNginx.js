import { ref } from 'vue'
import { useIpc } from './useIpc'

export function useNginx() {
  const { invoke } = useIpc()
  const isConfiguring = ref(false)
  const error = ref(null)

  async function configureNginx(configData) {
    isConfiguring.value = true
    error.value = null

    try {
      const result = await invoke('configure-nginx', configData)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isConfiguring.value = false
    }
  }

  return {
    isConfiguring,
    error,
    configureNginx
  }
}
