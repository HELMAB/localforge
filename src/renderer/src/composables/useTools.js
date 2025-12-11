import { ref } from 'vue'
import { useIpc } from './useIpc'

export function useTools() {
  const { invoke } = useIpc()
  const isLoading = ref(false)
  const installedTools = ref(null)
  const error = ref(null)

  async function checkInstalledTools() {
    isLoading.value = true
    error.value = null

    try {
      const result = await invoke('check-installed-tools')
      installedTools.value = result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function installPHP(version) {
    try {
      const result = await invoke('install-php', { version })
      await checkInstalledTools()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function installPHPExtensions(version, extensions) {
    try {
      const result = await invoke('install-php-extensions', { version, extensions })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function installNode(version) {
    try {
      const result = await invoke('install-node', { version })
      await checkInstalledTools()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function setDefaultNode(version) {
    try {
      const result = await invoke('set-default-node', { version })
      await checkInstalledTools()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function installNginx() {
    try {
      const result = await invoke('install-nginx')
      await checkInstalledTools()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function installComposer() {
    try {
      const result = await invoke('install-composer')
      await checkInstalledTools()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function installPostgreSQL(version = null) {
    try {
      const result = await invoke('install-postgresql', { version })
      await checkInstalledTools()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function installMySQL() {
    try {
      const result = await invoke('install-mysql')
      await checkInstalledTools()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    isLoading,
    installedTools,
    error,
    checkInstalledTools,
    installPHP,
    installPHPExtensions,
    installNode,
    setDefaultNode,
    installNginx,
    installComposer,
    installPostgreSQL,
    installMySQL
  }
}
