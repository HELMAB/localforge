import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('useIpc', () => {
  let useIpc
  let mockInvoke

  beforeEach(() => {
    mockInvoke = vi.fn()
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

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('@/composables/useIpc')
    useIpc = module.useIpc
  })

  describe('invoke', () => {
    it('calls ipcRenderer.invoke with correct channel', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { invoke } = useIpc()
      await invoke('test-channel')

      expect(mockInvoke).toHaveBeenCalledWith('test-channel')
    })

    it('passes arguments correctly to ipcRenderer.invoke', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { invoke } = useIpc()
      await invoke('test-channel', 'arg1', 'arg2', { key: 'value' })

      expect(mockInvoke).toHaveBeenCalledWith('test-channel', 'arg1', 'arg2', { key: 'value' })
    })

    it('passes single argument correctly', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { invoke } = useIpc()
      await invoke('select-directory')

      expect(mockInvoke).toHaveBeenCalledWith('select-directory')
    })

    it('passes multiple arguments as rest parameters', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { invoke } = useIpc()
      await invoke('channel', 1, 2, 3)

      expect(mockInvoke).toHaveBeenCalledWith('channel', 1, 2, 3)
    })

    it('returns the result from ipcRenderer.invoke', async () => {
      const expectedResult = { success: true, data: 'test' }
      mockInvoke.mockResolvedValue(expectedResult)

      const { invoke } = useIpc()
      const result = await invoke('test-channel')

      expect(result).toEqual(expectedResult)
    })

    it('handles async/await correctly', async () => {
      mockInvoke.mockResolvedValue('async result')

      const { invoke } = useIpc()
      const result = await invoke('async-channel')

      expect(result).toBe('async result')
    })
  })

  describe('IPC handlers mocking', () => {
    it('properly mocks IPC handler in tests', async () => {
      const mockProjectData = {
        name: 'test-project',
        path: '/home/user/projects/test-project',
        type: 'laravel',
      }
      mockInvoke.mockResolvedValue(mockProjectData)

      const { invoke } = useIpc()
      const result = await invoke('create-project', mockProjectData)

      expect(mockInvoke).toHaveBeenCalledTimes(1)
      expect(mockInvoke).toHaveBeenCalledWith('create-project', mockProjectData)
      expect(result).toEqual(mockProjectData)
    })

    it('can mock different channels in sequence', async () => {
      mockInvoke.mockResolvedValueOnce('/selected/path').mockResolvedValueOnce({ success: true })

      const { invoke } = useIpc()

      const dirResult = await invoke('select-directory')
      expect(dirResult).toBe('/selected/path')

      const createResult = await invoke('create-project', { name: 'test' })
      expect(createResult).toEqual({ success: true })

      expect(mockInvoke).toHaveBeenCalledTimes(2)
    })

    it('can mock error responses', async () => {
      mockInvoke.mockRejectedValue(new Error('IPC Error'))

      const { invoke } = useIpc()

      await expect(invoke('failing-channel')).rejects.toThrow('IPC Error')
    })
  })
})

describe('useIpc error handling', () => {
  it('throws error when Electron is not available (window.require undefined)', () => {
    vi.resetModules()
    delete window.require

    expect(() => {
      const { useIpc } = require('../../src/renderer/src/composables/useIpc')
      useIpc()
    }).toThrow('Electron IPC not available')
  })

  it('throws error when window.require returns null', () => {
    vi.resetModules()
    window.require = vi.fn(() => null)

    expect(() => {
      const { useIpc } = require('../../src/renderer/src/composables/useIpc')
      useIpc()
    }).toThrow()
  })

  it('throws error when ipcRenderer is undefined', () => {
    vi.resetModules()
    window.require = vi.fn(() => ({}))

    expect(() => {
      const { useIpc } = require('../../src/renderer/src/composables/useIpc')
      useIpc()
    }).toThrow('Electron IPC not available')
  })

  it('throws TypeError when ipcRenderer.invoke is undefined', async () => {
    vi.resetModules()
    window.require = vi.fn(() => ({
      ipcRenderer: {
        invoke: undefined,
      },
    }))

    const { useIpc } = require('../../src/renderer/src/composables/useIpc')
    const { invoke } = useIpc()

    await expect(invoke('test-channel')).rejects.toThrow(TypeError)
  })
})
