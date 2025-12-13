import { ref } from 'vue'
import { useIpc } from './useIpc'

export function useNginx() {
  const { invoke } = useIpc()
  const isConfiguring = ref(false)
  const isLoading = ref(false)
  const isDeleting = ref(false)
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

  async function listNginxConfigs() {
    isLoading.value = true
    error.value = null

    try {
      const result = await invoke('list-nginx-configs')
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteNginxConfig(configName) {
    isDeleting.value = true
    error.value = null

    try {
      const result = await invoke('delete-nginx-config', { configName })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  return {
    isConfiguring,
    isLoading,
    isDeleting,
    error,
    configureNginx,
    listNginxConfigs,
    deleteNginxConfig
  }
}
