import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockInvoke = vi.fn()

beforeEach(() => {
  mockInvoke.mockReset()

  window.require = vi.fn(() => ({
    ipcRenderer: {
      invoke: mockInvoke,
    },
  }))
})

afterEach(() => {
  vi.resetModules()
  delete window.require
})

describe('useNginx', () => {
  let useNginx

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('./useNginx')
    useNginx = module.useNginx
  })

  describe('configureNginx', () => {
    it('sends correct config data to IPC', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { configureNginx } = useNginx()
      const configData = {
        domain: 'test.local',
        projectPath: '/var/www/test',
        port: 80,
      }

      const result = await configureNginx(configData)

      expect(mockInvoke).toHaveBeenCalledWith('configure-nginx', configData)
      expect(result).toEqual({ success: true })
    })

    it('sets isConfiguring state during operation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { configureNginx, isConfiguring } = useNginx()

      const promise = configureNginx({ domain: 'test.local' })
      expect(isConfiguring.value).toBe(true)

      await promise
      expect(isConfiguring.value).toBe(false)
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Configuration failed'))

      const { configureNginx, error } = useNginx()

      await expect(configureNginx({ domain: 'test.local' })).rejects.toThrow('Configuration failed')
      expect(error.value).toBe('Configuration failed')
    })

    it('sets isConfiguring to false on error', async () => {
      mockInvoke.mockRejectedValue(new Error('Configuration failed'))

      const { configureNginx, isConfiguring } = useNginx()

      await expect(configureNginx({ domain: 'test.local' })).rejects.toThrow()
      expect(isConfiguring.value).toBe(false)
    })
  })

  describe('listNginxConfigs', () => {
    it('returns configuration list', async () => {
      const configs = [
        { name: 'test1.local', enabled: true },
        { name: 'test2.local', enabled: false },
      ]
      mockInvoke.mockResolvedValue(configs)

      const { listNginxConfigs } = useNginx()
      const result = await listNginxConfigs()

      expect(mockInvoke).toHaveBeenCalledWith('list-nginx-configs')
      expect(result).toEqual(configs)
    })

    it('sets isLoading during operation', async () => {
      mockInvoke.mockResolvedValue([])

      const { listNginxConfigs, isLoading } = useNginx()

      const promise = listNginxConfigs()
      expect(isLoading.value).toBe(true)

      await promise
      expect(isLoading.value).toBe(false)
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to list configs'))

      const { listNginxConfigs, error } = useNginx()

      await expect(listNginxConfigs()).rejects.toThrow('Failed to list configs')
      expect(error.value).toBe('Failed to list configs')
    })
  })

  describe('deleteNginxConfig', () => {
    it('calls IPC with correct configName', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { deleteNginxConfig } = useNginx()
      const result = await deleteNginxConfig('test.local')

      expect(mockInvoke).toHaveBeenCalledWith('delete-nginx-config', {
        configName: 'test.local',
      })
      expect(result).toEqual({ success: true })
    })

    it('sets isDeleting during operation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { deleteNginxConfig, isDeleting } = useNginx()

      const promise = deleteNginxConfig('test.local')
      expect(isDeleting.value).toBe(true)

      await promise
      expect(isDeleting.value).toBe(false)
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Delete failed'))

      const { deleteNginxConfig, error } = useNginx()

      await expect(deleteNginxConfig('test.local')).rejects.toThrow('Delete failed')
      expect(error.value).toBe('Delete failed')
    })
  })

  describe('enableNginxConfig', () => {
    it('calls IPC correctly', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { enableNginxConfig } = useNginx()
      const result = await enableNginxConfig('test.local')

      expect(mockInvoke).toHaveBeenCalledWith('enable-nginx-config', {
        configName: 'test.local',
      })
      expect(result).toEqual({ success: true })
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Enable failed'))

      const { enableNginxConfig, error } = useNginx()

      await expect(enableNginxConfig('test.local')).rejects.toThrow('Enable failed')
      expect(error.value).toBe('Enable failed')
    })
  })

  describe('disableNginxConfig', () => {
    it('calls IPC correctly', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { disableNginxConfig } = useNginx()
      const result = await disableNginxConfig('test.local')

      expect(mockInvoke).toHaveBeenCalledWith('disable-nginx-config', {
        configName: 'test.local',
      })
      expect(result).toEqual({ success: true })
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Disable failed'))

      const { disableNginxConfig, error } = useNginx()

      await expect(disableNginxConfig('test.local')).rejects.toThrow('Disable failed')
      expect(error.value).toBe('Disable failed')
    })
  })

  describe('addSslToConfig', () => {
    it('calls IPC with configName', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { addSslToConfig } = useNginx()
      const result = await addSslToConfig('test.local')

      expect(mockInvoke).toHaveBeenCalledWith('add-ssl-to-config', {
        configName: 'test.local',
      })
      expect(result).toEqual({ success: true })
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('SSL addition failed'))

      const { addSslToConfig, error } = useNginx()

      await expect(addSslToConfig('test.local')).rejects.toThrow('SSL addition failed')
      expect(error.value).toBe('SSL addition failed')
    })
  })

  describe('removeSslFromConfig', () => {
    it('calls IPC with configName', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { removeSslFromConfig } = useNginx()
      const result = await removeSslFromConfig('test.local')

      expect(mockInvoke).toHaveBeenCalledWith('remove-ssl-from-config', {
        configName: 'test.local',
      })
      expect(result).toEqual({ success: true })
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('SSL removal failed'))

      const { removeSslFromConfig, error } = useNginx()

      await expect(removeSslFromConfig('test.local')).rejects.toThrow('SSL removal failed')
      expect(error.value).toBe('SSL removal failed')
    })
  })

  describe('getNginxConfigDetails', () => {
    it('returns config information', async () => {
      const details = {
        name: 'test.local',
        domain: 'test.local',
        projectPath: '/var/www/test',
        port: 80,
        ssl: true,
      }
      mockInvoke.mockResolvedValue(details)

      const { getNginxConfigDetails } = useNginx()
      const result = await getNginxConfigDetails('test.local')

      expect(mockInvoke).toHaveBeenCalledWith('get-nginx-config-details', {
        configName: 'test.local',
      })
      expect(result).toEqual(details)
    })

    it('sets isLoading during operation', async () => {
      mockInvoke.mockResolvedValue({})

      const { getNginxConfigDetails, isLoading } = useNginx()

      const promise = getNginxConfigDetails('test.local')
      expect(isLoading.value).toBe(true)

      await promise
      expect(isLoading.value).toBe(false)
    })

    it('handles errors correctly', async () => {
      mockInvoke.mockRejectedValue(new Error('Config not found'))

      const { getNginxConfigDetails, error } = useNginx()

      await expect(getNginxConfigDetails('test.local')).rejects.toThrow('Config not found')
      expect(error.value).toBe('Config not found')
    })
  })

  describe('error state', () => {
    it('initializes with error as null', () => {
      const { error } = useNginx()
      expect(error.value).toBe(null)
    })

    it('sets error state correctly on failures', async () => {
      mockInvoke.mockRejectedValue(new Error('Test error'))

      const { configureNginx, error } = useNginx()

      await expect(configureNginx({})).rejects.toThrow()
      expect(error.value).toBe('Test error')
    })
  })

  describe('returned API', () => {
    it('returns all required functions and refs', () => {
      const {
        configureNginx,
        listNginxConfigs,
        deleteNginxConfig,
        enableNginxConfig,
        disableNginxConfig,
        addSslToConfig,
        removeSslFromConfig,
        getNginxConfigDetails,
        isConfiguring,
        isLoading,
        isDeleting,
        error,
      } = useNginx()

      expect(typeof configureNginx).toBe('function')
      expect(typeof listNginxConfigs).toBe('function')
      expect(typeof deleteNginxConfig).toBe('function')
      expect(typeof enableNginxConfig).toBe('function')
      expect(typeof disableNginxConfig).toBe('function')
      expect(typeof addSslToConfig).toBe('function')
      expect(typeof removeSslFromConfig).toBe('function')
      expect(typeof getNginxConfigDetails).toBe('function')
      expect(isConfiguring.value).toBe(false)
      expect(isLoading.value).toBe(false)
      expect(isDeleting.value).toBe(false)
      expect(error.value).toBe(null)
    })
  })
})
