import { ref } from 'vue'
import { useIpc } from './useIpc'

const NODEJS_CACHE_KEY = 'localforge_nodejs_versions'

export function useTools() {
  const { invoke } = useIpc()
  const isLoading = ref(false)
  const installedTools = ref({
    php: { installed: false, versions: [] },
    node: { installed: false, versions: [], default: null, current: null },
    nginx: { installed: false, version: null },
    composer: { installed: false, version: null },
    postgresql: { installed: false, version: null },
    mysql: { installed: false, version: null },
  })
  const error = ref(null)

  // Load Node.js versions from localStorage
  function loadNodeVersionsFromCache() {
    try {
      const cached = localStorage.getItem(NODEJS_CACHE_KEY)
      if (cached) {
        const data = JSON.parse(cached)
        installedTools.value.node = data
        return true
      }
    } catch (err) {
      // Silent fail - cache is optional
    }
    return false
  }

  // Save Node.js versions to localStorage
  function saveNodeVersionsToCache(nodeData) {
    try {
      localStorage.setItem(NODEJS_CACHE_KEY, JSON.stringify(nodeData))
    } catch (err) {
      // Silent fail - cache is optional
    }
  }

  // Clear Node.js cache
  function clearNodeVersionsCache() {
    try {
      localStorage.removeItem(NODEJS_CACHE_KEY)
    } catch (err) {
      // Silent fail - cache is optional
    }
  }

  async function checkInstalledTools(useCache = true) {
    // Try to load from cache first
    if (useCache) {
      loadNodeVersionsFromCache()
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await invoke('check-installed-tools')
      installedTools.value = result

      // Save Node.js data to cache
      saveNodeVersionsToCache(result.node)

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
      // Refresh tools and update cache
      await checkInstalledTools(false) // Don't use cache when refreshing
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function setDefaultNode(version) {
    try {
      const result = await invoke('set-default-node', { version })
      // Update the default version in cache immediately
      installedTools.value.node.default = version
      installedTools.value.node.current = version
      saveNodeVersionsToCache(installedTools.value.node)

      // Also refresh from server to get accurate state
      await checkInstalledTools(false) // Don't use cache when refreshing
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function uninstallNode(version) {
    try {
      const result = await invoke('uninstall-node', { version })
      // Remove version from cache immediately
      installedTools.value.node.versions = installedTools.value.node.versions.filter(v => v !== version)
      saveNodeVersionsToCache(installedTools.value.node)

      // Also refresh from server to get accurate state
      await checkInstalledTools(false) // Don't use cache when refreshing
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

  async function getPhpIniPath(version, type = 'cli') {
    try {
      return await invoke('get-php-ini-path', { version, type })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function readPhpIni(filePath) {
    try {
      return await invoke('read-php-ini', { filePath })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function writePhpIni(filePath, content) {
    try {
      return await invoke('write-php-ini', { filePath, content })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function listPhpExtensions(version) {
    try {
      return await invoke('list-php-extensions', { version })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function getInstalledPhpExtensions(version) {
    try {
      return await invoke('get-installed-php-extensions', { version })
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
    uninstallNode,
    installNginx,
    installComposer,
    installPostgreSQL,
    installMySQL,
    getPhpIniPath,
    readPhpIni,
    writePhpIni,
    listPhpExtensions,
    getInstalledPhpExtensions,
    loadNodeVersionsFromCache,
    saveNodeVersionsToCache,
    clearNodeVersionsCache,
  }
}
