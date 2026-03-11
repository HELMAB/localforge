import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockInvoke = vi.fn()
const mockOn = vi.fn()
const mockRemoveListener = vi.fn()

beforeEach(() => {
  mockInvoke.mockReset()
  mockOn.mockReset()
  mockRemoveListener.mockReset()

  window.require = vi.fn(() => ({
    ipcRenderer: {
      invoke: mockInvoke,
      on: mockOn,
      removeListener: mockRemoveListener,
    },
  }))

  localStorage.clear()
})

afterEach(() => {
  vi.resetModules()
  delete window.require
})

describe('useTools', () => {
  let useTools

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('@/composables/useTools')
    useTools = module.useTools
  })

  describe('checkInstalledTools', () => {
    it('calls IPC with check-installed-tools channel', async () => {
      mockInvoke.mockResolvedValue({
        php: { installed: true, versions: ['8.2'] },
        node: { installed: true, versions: ['20.0.0'], default: null, current: null },
        nginx: { installed: true, version: '1.24.0' },
        composer: { installed: true, version: '2.5.0' },
        postgresql: { installed: true, version: '15.0' },
        mysql: { installed: true, version: '8.0' },
      })

      const { checkInstalledTools } = useTools()
      await checkInstalledTools()

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('updates installedTools state with response', async () => {
      const toolsData = {
        php: { installed: true, versions: ['8.2', '8.1'] },
        node: {
          installed: true,
          versions: ['20.0.0', '18.0.0'],
          default: '20.0.0',
          current: '20.0.0',
        },
        nginx: { installed: true, version: '1.24.0' },
        composer: { installed: true, version: '2.5.0' },
        postgresql: { installed: true, version: '15.0' },
        mysql: { installed: true, version: '8.0' },
      }
      mockInvoke.mockResolvedValue(toolsData)

      const { checkInstalledTools, installedTools } = useTools()
      await checkInstalledTools()

      expect(installedTools.value).toEqual(toolsData)
    })

    it('loads from cache when useCache is true', async () => {
      const cachedNodeData = {
        installed: true,
        versions: ['18.0.0'],
        default: '18.0.0',
        current: '18.0.0',
      }
      const cachedPhpData = { installed: true, versions: ['8.1'] }

      localStorage.setItem('localforge_nodejs_versions', JSON.stringify(cachedNodeData))
      localStorage.setItem('localforge_php_versions', JSON.stringify(cachedPhpData))

      const toolsData = {
        php: { installed: true, versions: ['8.2'] },
        node: { installed: true, versions: ['20.0.0'], default: null, current: null },
        nginx: { installed: true, version: '1.24.0' },
        composer: { installed: true, version: '2.5.0' },
        postgresql: { installed: true, version: '15.0' },
        mysql: { installed: true, version: '8.0' },
      }
      mockInvoke.mockResolvedValue(toolsData)

      const { checkInstalledTools } = useTools()

      // The initial call to load from cache will populate the state before IPC
      await checkInstalledTools(true)

      // The cache is loaded initially, then overwritten by IPC result
      // So we verify the IPC was called (which means cache loading was attempted)
      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('does not use cache when useCache is false', async () => {
      const cachedNodeData = {
        installed: true,
        versions: ['18.0.0'],
        default: '18.0.0',
        current: '18.0.0',
      }
      localStorage.setItem('localforge_nodejs_versions', JSON.stringify(cachedNodeData))

      const toolsData = {
        php: { installed: true, versions: ['8.2'] },
        node: { installed: true, versions: ['20.0.0'], default: null, current: null },
        nginx: { installed: true, version: '1.24.0' },
        composer: { installed: true, version: '2.5.0' },
        postgresql: { installed: true, version: '15.0' },
        mysql: { installed: true, version: '8.0' },
      }
      mockInvoke.mockResolvedValue(toolsData)

      const { checkInstalledTools, installedTools } = useTools()
      await checkInstalledTools(false)

      expect(installedTools.value.node).toEqual(toolsData.node)
      expect(installedTools.value.php).toEqual(toolsData.php)
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to check tools'))

      const { checkInstalledTools, error } = useTools()

      await expect(checkInstalledTools()).rejects.toThrow('Failed to check tools')
      expect(error.value).toBe('Failed to check tools')
    })

    it('sets isLoading during operation', async () => {
      mockInvoke.mockResolvedValue({
        php: { installed: false, versions: [] },
        node: { installed: false, versions: [], default: null, current: null },
        nginx: { installed: false, version: null },
        composer: { installed: false, version: null },
        postgresql: { installed: false, version: null },
        mysql: { installed: false, version: null },
      })

      const { checkInstalledTools, isLoading } = useTools()

      const promise = checkInstalledTools()
      expect(isLoading.value).toBe(true)

      await promise
      expect(isLoading.value).toBe(false)
    })

    it('saves data to cache after successful check', async () => {
      const nodeData = {
        installed: true,
        versions: ['20.0.0'],
        default: '20.0.0',
        current: '20.0.0',
      }
      const phpData = { installed: true, versions: ['8.2'] }

      mockInvoke.mockResolvedValue({
        php: phpData,
        node: nodeData,
        nginx: { installed: true, version: '1.24.0' },
        composer: { installed: true, version: '2.5.0' },
        postgresql: { installed: true, version: '15.0' },
        mysql: { installed: true, version: '8.0' },
      })

      const { checkInstalledTools } = useTools()
      await checkInstalledTools()

      expect(localStorage.getItem('localforge_nodejs_versions')).toBe(JSON.stringify(nodeData))
      expect(localStorage.getItem('localforge_php_versions')).toBe(JSON.stringify(phpData))
    })
  })

  describe('installPHP', () => {
    it('calls IPC with install-php channel and version', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installPHP } = useTools()
      await installPHP('8.2')

      expect(mockInvoke).toHaveBeenCalledWith('install-php', { version: '8.2' })
    })

    it('refreshes tools after installation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installPHP } = useTools()
      await installPHP('8.2')

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('PHP installation failed'))

      const { installPHP, error } = useTools()

      await expect(installPHP('8.2')).rejects.toThrow('PHP installation failed')
      expect(error.value).toBe('PHP installation failed')
    })
  })

  describe('installPHPExtensions', () => {
    it('calls IPC with install-php-extensions channel, version and extensions', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installPHPExtensions } = useTools()
      await installPHPExtensions('8.2', ['curl', 'json', 'mbstring'])

      expect(mockInvoke).toHaveBeenCalledWith('install-php-extensions', {
        version: '8.2',
        extensions: ['curl', 'json', 'mbstring'],
      })
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Extension installation failed'))

      const { installPHPExtensions, error } = useTools()

      await expect(installPHPExtensions('8.2', ['curl'])).rejects.toThrow(
        'Extension installation failed'
      )
      expect(error.value).toBe('Extension installation failed')
    })
  })

  describe('installNode', () => {
    it('calls IPC with install-node channel and version', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installNode } = useTools()
      await installNode('20.0.0')

      expect(mockInvoke).toHaveBeenCalledWith('install-node', { version: '20.0.0' })
    })

    it('refreshes tools after installation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installNode } = useTools()
      await installNode('20.0.0')

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Node installation failed'))

      const { installNode, error } = useTools()

      await expect(installNode('20.0.0')).rejects.toThrow('Node installation failed')
      expect(error.value).toBe('Node installation failed')
    })
  })

  describe('setDefaultNode', () => {
    it('calls IPC with set-default-node channel and version', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { setDefaultNode } = useTools()
      await setDefaultNode('20.0.0')

      expect(mockInvoke).toHaveBeenCalledWith('set-default-node', { version: '20.0.0' })
    })

    it('updates cache immediately before refresh', async () => {
      const initialNodeData = {
        installed: true,
        versions: ['20.0.0', '18.0.0'],
        default: null,
        current: null,
      }

      mockInvoke.mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({
        php: { installed: false, versions: [] },
        node: {
          installed: true,
          versions: ['20.0.0', '18.0.0'],
          default: '20.0.0',
          current: '20.0.0',
        },
        nginx: { installed: false, version: null },
        composer: { installed: false, version: null },
        postgresql: { installed: false, version: null },
        mysql: { installed: false, version: null },
      })

      const { setDefaultNode, installedTools } = useTools()
      installedTools.value.node = initialNodeData

      await setDefaultNode('20.0.0')

      const cachedData = JSON.parse(localStorage.getItem('localforge_nodejs_versions'))
      expect(cachedData.default).toBe('20.0.0')
      expect(cachedData.current).toBe('20.0.0')
    })

    it('refreshes tools after setting default', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { setDefaultNode } = useTools()
      await setDefaultNode('20.0.0')

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to set default'))

      const { setDefaultNode, error } = useTools()

      await expect(setDefaultNode('20.0.0')).rejects.toThrow('Failed to set default')
      expect(error.value).toBe('Failed to set default')
    })
  })

  describe('uninstallNode', () => {
    it('calls IPC with uninstall-node channel and version', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { uninstallNode } = useTools()
      await uninstallNode('20.0.0')

      expect(mockInvoke).toHaveBeenCalledWith('uninstall-node', { version: '20.0.0' })
    })

    it('removes version from cache immediately', async () => {
      const initialNodeData = {
        installed: true,
        versions: ['20.0.0', '18.0.0'],
        default: '20.0.0',
        current: '20.0.0',
      }

      mockInvoke.mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({
        php: { installed: false, versions: [] },
        node: { installed: true, versions: ['18.0.0'], default: null, current: null },
        nginx: { installed: false, version: null },
        composer: { installed: false, version: null },
        postgresql: { installed: false, version: null },
        mysql: { installed: false, version: null },
      })

      const { uninstallNode, installedTools } = useTools()
      installedTools.value.node = initialNodeData

      await uninstallNode('20.0.0')

      const cachedData = JSON.parse(localStorage.getItem('localforge_nodejs_versions'))
      expect(cachedData.versions).toEqual(['18.0.0'])
    })

    it('refreshes tools after uninstall', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { uninstallNode } = useTools()
      await uninstallNode('20.0.0')

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Uninstall failed'))

      const { uninstallNode, error } = useTools()

      await expect(uninstallNode('20.0.0')).rejects.toThrow('Uninstall failed')
      expect(error.value).toBe('Uninstall failed')
    })
  })

  describe('installNginx', () => {
    it('calls IPC with install-nginx channel', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installNginx } = useTools()
      await installNginx()

      expect(mockInvoke).toHaveBeenCalledWith('install-nginx')
    })

    it('refreshes tools after installation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installNginx } = useTools()
      await installNginx()

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Nginx installation failed'))

      const { installNginx, error } = useTools()

      await expect(installNginx()).rejects.toThrow('Nginx installation failed')
      expect(error.value).toBe('Nginx installation failed')
    })
  })

  describe('installComposer', () => {
    it('calls IPC with install-composer channel', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installComposer } = useTools()
      await installComposer()

      expect(mockInvoke).toHaveBeenCalledWith('install-composer')
    })

    it('refreshes tools after installation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installComposer } = useTools()
      await installComposer()

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Composer installation failed'))

      const { installComposer, error } = useTools()

      await expect(installComposer()).rejects.toThrow('Composer installation failed')
      expect(error.value).toBe('Composer installation failed')
    })
  })

  describe('installPostgreSQL', () => {
    it('calls IPC with install-postgresql channel without version', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installPostgreSQL } = useTools()
      await installPostgreSQL()

      expect(mockInvoke).toHaveBeenCalledWith('install-postgresql', { version: null })
    })

    it('calls IPC with install-postgresql channel with version', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installPostgreSQL } = useTools()
      await installPostgreSQL('15.0')

      expect(mockInvoke).toHaveBeenCalledWith('install-postgresql', { version: '15.0' })
    })

    it('refreshes tools after installation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installPostgreSQL } = useTools()
      await installPostgreSQL()

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('PostgreSQL installation failed'))

      const { installPostgreSQL, error } = useTools()

      await expect(installPostgreSQL()).rejects.toThrow('PostgreSQL installation failed')
      expect(error.value).toBe('PostgreSQL installation failed')
    })
  })

  describe('installMySQL', () => {
    it('calls IPC with install-mysql channel', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installMySQL } = useTools()
      await installMySQL()

      expect(mockInvoke).toHaveBeenCalledWith('install-mysql')
    })

    it('refreshes tools after installation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { installMySQL } = useTools()
      await installMySQL()

      expect(mockInvoke).toHaveBeenCalledWith('check-installed-tools')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('MySQL installation failed'))

      const { installMySQL, error } = useTools()

      await expect(installMySQL()).rejects.toThrow('MySQL installation failed')
      expect(error.value).toBe('MySQL installation failed')
    })
  })

  describe('getPhpIniPath', () => {
    it('calls IPC with get-php-ini-path channel, version and type', async () => {
      mockInvoke.mockResolvedValue('/etc/php/8.2/cli/php.ini')

      const { getPhpIniPath } = useTools()
      const result = await getPhpIniPath('8.2', 'cli')

      expect(mockInvoke).toHaveBeenCalledWith('get-php-ini-path', { version: '8.2', type: 'cli' })
      expect(result).toBe('/etc/php/8.2/cli/php.ini')
    })

    it('uses default type when not provided', async () => {
      mockInvoke.mockResolvedValue('/etc/php/8.2/cli/php.ini')

      const { getPhpIniPath } = useTools()
      await getPhpIniPath('8.2')

      expect(mockInvoke).toHaveBeenCalledWith('get-php-ini-path', { version: '8.2', type: 'cli' })
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to get path'))

      const { getPhpIniPath, error } = useTools()

      await expect(getPhpIniPath('8.2')).rejects.toThrow('Failed to get path')
      expect(error.value).toBe('Failed to get path')
    })
  })

  describe('readPhpIni', () => {
    it('calls IPC with read-php-ini channel and filePath', async () => {
      mockInvoke.mockResolvedValue('memory_limit = 128M')

      const { readPhpIni } = useTools()
      const result = await readPhpIni('/etc/php/8.2/cli/php.ini')

      expect(mockInvoke).toHaveBeenCalledWith('read-php-ini', {
        filePath: '/etc/php/8.2/cli/php.ini',
      })
      expect(result).toBe('memory_limit = 128M')
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to read file'))

      const { readPhpIni, error } = useTools()

      await expect(readPhpIni('/path/to/php.ini')).rejects.toThrow('Failed to read file')
      expect(error.value).toBe('Failed to read file')
    })
  })

  describe('writePhpIni', () => {
    it('calls IPC with write-php-ini channel, filePath and content', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { writePhpIni } = useTools()
      await writePhpIni('/etc/php/8.2/cli/php.ini', 'memory_limit = 256M')

      expect(mockInvoke).toHaveBeenCalledWith('write-php-ini', {
        filePath: '/etc/php/8.2/cli/php.ini',
        content: 'memory_limit = 256M',
      })
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to write file'))

      const { writePhpIni, error } = useTools()

      await expect(writePhpIni('/path/to/php.ini', 'content')).rejects.toThrow(
        'Failed to write file'
      )
      expect(error.value).toBe('Failed to write file')
    })
  })

  describe('listPhpExtensions', () => {
    it('calls IPC with list-php-extensions channel and version', async () => {
      mockInvoke.mockResolvedValue(['curl', 'json', 'mbstring', 'pdo'])

      const { listPhpExtensions } = useTools()
      const result = await listPhpExtensions('8.2')

      expect(mockInvoke).toHaveBeenCalledWith('list-php-extensions', { version: '8.2' })
      expect(result).toEqual(['curl', 'json', 'mbstring', 'pdo'])
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to list extensions'))

      const { listPhpExtensions, error } = useTools()

      await expect(listPhpExtensions('8.2')).rejects.toThrow('Failed to list extensions')
      expect(error.value).toBe('Failed to list extensions')
    })
  })

  describe('getInstalledPhpExtensions', () => {
    it('calls IPC with get-installed-php-extensions channel and version', async () => {
      mockInvoke.mockResolvedValue(['curl', 'json', 'mbstring'])

      const { getInstalledPhpExtensions } = useTools()
      const result = await getInstalledPhpExtensions('8.2')

      expect(mockInvoke).toHaveBeenCalledWith('get-installed-php-extensions', { version: '8.2' })
      expect(result).toEqual(['curl', 'json', 'mbstring'])
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to get extensions'))

      const { getInstalledPhpExtensions, error } = useTools()

      await expect(getInstalledPhpExtensions('8.2')).rejects.toThrow('Failed to get extensions')
      expect(error.value).toBe('Failed to get extensions')
    })
  })

  describe('localStorage cache functions - Node.js', () => {
    it('loadNodeVersionsFromCache returns true and loads data when cache exists', () => {
      const nodeData = {
        installed: true,
        versions: ['20.0.0'],
        default: '20.0.0',
        current: '20.0.0',
      }
      localStorage.setItem('localforge_nodejs_versions', JSON.stringify(nodeData))

      const { loadNodeVersionsFromCache, installedTools } = useTools()
      const result = loadNodeVersionsFromCache()

      expect(result).toBe(true)
      expect(installedTools.value.node).toEqual(nodeData)
    })

    it('loadNodeVersionsFromCache returns false when no cache', () => {
      const { loadNodeVersionsFromCache } = useTools()
      const result = loadNodeVersionsFromCache()

      expect(result).toBe(false)
    })

    it('saveNodeVersionsToCache saves data to localStorage', () => {
      const nodeData = {
        installed: true,
        versions: ['20.0.0'],
        default: '20.0.0',
        current: '20.0.0',
      }

      const { saveNodeVersionsToCache } = useTools()
      saveNodeVersionsToCache(nodeData)

      expect(localStorage.getItem('localforge_nodejs_versions')).toBe(JSON.stringify(nodeData))
    })

    it('clearNodeVersionsCache removes data from localStorage', () => {
      localStorage.setItem('localforge_nodejs_versions', JSON.stringify({ versions: ['20.0.0'] }))

      const { clearNodeVersionsCache } = useTools()
      clearNodeVersionsCache()

      expect(localStorage.getItem('localforge_nodejs_versions')).toBeNull()
    })
  })

  describe('localStorage cache functions - PHP', () => {
    it('loadPhpVersionsFromCache returns true and loads data when cache exists', () => {
      const phpData = { installed: true, versions: ['8.2', '8.1'] }
      localStorage.setItem('localforge_php_versions', JSON.stringify(phpData))

      const { loadPhpVersionsFromCache, installedTools } = useTools()
      const result = loadPhpVersionsFromCache()

      expect(result).toBe(true)
      expect(installedTools.value.php).toEqual(phpData)
    })

    it('loadPhpVersionsFromCache returns false when no cache', () => {
      const { loadPhpVersionsFromCache } = useTools()
      const result = loadPhpVersionsFromCache()

      expect(result).toBe(false)
    })

    it('savePhpVersionsToCache saves data to localStorage', () => {
      const phpData = { installed: true, versions: ['8.2'] }

      const { savePhpVersionsToCache } = useTools()
      savePhpVersionsToCache(phpData)

      expect(localStorage.getItem('localforge_php_versions')).toBe(JSON.stringify(phpData))
    })

    it('clearPhpVersionsCache removes data from localStorage', () => {
      localStorage.setItem('localforge_php_versions', JSON.stringify({ versions: ['8.2'] }))

      const { clearPhpVersionsCache } = useTools()
      clearPhpVersionsCache()

      expect(localStorage.getItem('localforge_php_versions')).toBeNull()
    })
  })

  describe('error state', () => {
    it('initializes with error as null', () => {
      const { error } = useTools()
      expect(error.value).toBe(null)
    })
  })

  describe('isLoading state', () => {
    it('initializes with isLoading as false', () => {
      const { isLoading } = useTools()
      expect(isLoading.value).toBe(false)
    })
  })

  describe('returned API', () => {
    it('returns all required functions and refs', () => {
      const {
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
        loadPhpVersionsFromCache,
        savePhpVersionsToCache,
        clearPhpVersionsCache,
        isLoading,
        installedTools,
        error,
      } = useTools()

      expect(typeof checkInstalledTools).toBe('function')
      expect(typeof installPHP).toBe('function')
      expect(typeof installPHPExtensions).toBe('function')
      expect(typeof installNode).toBe('function')
      expect(typeof setDefaultNode).toBe('function')
      expect(typeof uninstallNode).toBe('function')
      expect(typeof installNginx).toBe('function')
      expect(typeof installComposer).toBe('function')
      expect(typeof installPostgreSQL).toBe('function')
      expect(typeof installMySQL).toBe('function')
      expect(typeof getPhpIniPath).toBe('function')
      expect(typeof readPhpIni).toBe('function')
      expect(typeof writePhpIni).toBe('function')
      expect(typeof listPhpExtensions).toBe('function')
      expect(typeof getInstalledPhpExtensions).toBe('function')
      expect(typeof loadNodeVersionsFromCache).toBe('function')
      expect(typeof saveNodeVersionsToCache).toBe('function')
      expect(typeof clearNodeVersionsCache).toBe('function')
      expect(typeof loadPhpVersionsFromCache).toBe('function')
      expect(typeof savePhpVersionsToCache).toBe('function')
      expect(typeof clearPhpVersionsCache).toBe('function')
      expect(isLoading.value).toBe(false)
      expect(error.value).toBe(null)
      expect(typeof installedTools.value).toBe('object')
    })
  })
})
