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

describe('useSsl', () => {
  let useSsl

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('@/composables/useSsl')
    useSsl = module.useSsl
  })

  describe('generateSSL', () => {
    it('sends domain to IPC correctly', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { generateSSL } = useSsl()
      const result = await generateSSL('example.test')

      expect(mockInvoke).toHaveBeenCalledWith('generate-ssl', { domain: 'example.test' })
      expect(result).toEqual({ success: true })
    })

    it('sends different domains to IPC correctly', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { generateSSL } = useSsl()
      await generateSSL('mysite.local')
      await generateSSL('another.dev')

      expect(mockInvoke).toHaveBeenCalledWith('generate-ssl', { domain: 'mysite.local' })
      expect(mockInvoke).toHaveBeenCalledWith('generate-ssl', { domain: 'another.dev' })
    })

    it('sets isGenerating state during operation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { generateSSL, isGenerating } = useSsl()

      expect(isGenerating.value).toBe(false)

      const promise = generateSSL('example.test')
      expect(isGenerating.value).toBe(true)

      await promise
      expect(isGenerating.value).toBe(false)
    })

    it('sets isGenerating to false on error', async () => {
      mockInvoke.mockRejectedValue(new Error('SSL generation failed'))

      const { generateSSL, isGenerating } = useSsl()

      await expect(generateSSL('example.test')).rejects.toThrow('SSL generation failed')
      expect(isGenerating.value).toBe(false)
    })

    it('handles success response', async () => {
      const successResponse = { success: true, certPath: '/path/to/cert' }
      mockInvoke.mockResolvedValue(successResponse)

      const { generateSSL } = useSsl()
      const result = await generateSSL('example.test')

      expect(result).toEqual(successResponse)
    })

    it('handles error response and sets error state', async () => {
      mockInvoke.mockRejectedValue(new Error('Domain not found'))

      const { generateSSL, error } = useSsl()

      await expect(generateSSL('invalid.test')).rejects.toThrow('Domain not found')
      expect(error.value).toBe('Domain not found')
    })

    it('clears error before new operation', async () => {
      mockInvoke
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({ success: true })

      const { generateSSL, error } = useSsl()

      await expect(generateSSL('example.test')).rejects.toThrow()
      expect(error.value).toBe('First error')

      await generateSSL('example.test')
      expect(error.value).toBe(null)
    })
  })

  describe('isGenerating state', () => {
    it('initializes with isGenerating as false', () => {
      const { isGenerating } = useSsl()
      expect(isGenerating.value).toBe(false)
    })

    it('toggles isGenerating during generateSSL operation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { generateSSL, isGenerating } = useSsl()

      expect(isGenerating.value).toBe(false)

      const promise = generateSSL('example.test')
      expect(isGenerating.value).toBe(true)

      await promise
      expect(isGenerating.value).toBe(false)
    })
  })

  describe('error state', () => {
    it('initializes with error as null', () => {
      const { error } = useSsl()
      expect(error.value).toBe(null)
    })

    it('sets error state correctly on failures', async () => {
      mockInvoke.mockRejectedValue(new Error('Test error'))

      const { generateSSL, error } = useSsl()

      await expect(generateSSL('example.test')).rejects.toThrow()
      expect(error.value).toBe('Test error')
    })
  })

  describe('returned API', () => {
    it('returns all required functions and refs', () => {
      const { generateSSL, isGenerating, error } = useSsl()

      expect(typeof generateSSL).toBe('function')
      expect(isGenerating.value).toBe(false)
      expect(error.value).toBe(null)
    })
  })
})
