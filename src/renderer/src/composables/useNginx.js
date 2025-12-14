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

  async function enableNginxConfig(configName) {
    error.value = null
    try {
      const result = await invoke('enable-nginx-config', { configName })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function disableNginxConfig(configName) {
    error.value = null
    try {
      const result = await invoke('disable-nginx-config', { configName })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function addSslToConfig(configName) {
    error.value = null
    try {
      const result = await invoke('add-ssl-to-config', { configName })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function removeSslFromConfig(configName) {
    error.value = null
    try {
      const result = await invoke('remove-ssl-from-config', { configName })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function getNginxConfigDetails(configName) {
    isLoading.value = true
    error.value = null
    try {
      const result = await invoke('get-nginx-config-details', { configName })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isConfiguring,
    isLoading,
    isDeleting,
    error,
    configureNginx,
    listNginxConfigs,
    deleteNginxConfig,
    enableNginxConfig,
    disableNginxConfig,
    addSslToConfig,
    removeSslFromConfig,
    getNginxConfigDetails
  }
}
