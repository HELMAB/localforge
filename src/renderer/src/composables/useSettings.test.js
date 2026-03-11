import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'

const mockInvoke = vi.fn()

beforeEach(() => {
  mockInvoke.mockReset()

  vi.stubGlobal('process', {
    env: {
      USER: 'user',
      USERNAME: undefined,
    },
  })

  window.require = vi.fn(() => ({
    ipcRenderer: {
      invoke: mockInvoke,
    },
  }))

  vi.stubGlobal('localStorage', {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  })
})

afterEach(() => {
  vi.resetModules()
  vi.unstubAllGlobals()
  delete window.require
})

describe('useSettings', () => {
  let useSettings

  const defaultSettings = {
    language: 'en',
    darkMode: false,
    defaultProjectPath: '/home/user/projects',
    defaultPhpVersion: '8.3',
    defaultNodeVersion: '22',
    autoDetectPhp: true,
    showKeyboardHints: false,
    onboardingCompleted: false,
  }

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('./useSettings')
    useSettings = module.useSettings
  })

  describe('loadSettings', () => {
    it('loads from localStorage correctly', async () => {
      const savedSettings = {
        language: 'km',
        darkMode: true,
        defaultProjectPath: '/custom/path',
      }
      localStorage.getItem.mockReturnValue(JSON.stringify(savedSettings))

      const { settings, loadSettings } = useSettings()
      loadSettings()

      expect(localStorage.getItem).toHaveBeenCalledWith('localforge-settings')
      expect(settings.value.language).toBe('km')
      expect(settings.value.darkMode).toBe(true)
      expect(settings.value.defaultProjectPath).toBe('/custom/path')
    })

    it('handles corrupted JSON gracefully', async () => {
      localStorage.getItem.mockReturnValue('invalid-json{')

      const { settings, loadSettings } = useSettings()
      loadSettings()

      expect(localStorage.getItem).toHaveBeenCalledWith('localforge-settings')
      expect(settings.value).toEqual(defaultSettings)
    })

    it('uses defaults when localStorage is empty', async () => {
      localStorage.getItem.mockReturnValue(null)

      const { settings, loadSettings } = useSettings()
      loadSettings()

      expect(localStorage.getItem).toHaveBeenCalledWith('localforge-settings')
      expect(settings.value).toEqual(defaultSettings)
    })
  })

  describe('saveSettings', () => {
    it('saves to localStorage correctly', async () => {
      localStorage.getItem.mockReturnValue(null)

      const { settings, saveSettings } = useSettings()
      settings.value.language = 'km'
      saveSettings()

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'localforge-settings',
        JSON.stringify(settings.value)
      )
    })
  })

  describe('updateSetting', () => {
    it('updates single setting', async () => {
      localStorage.getItem.mockReturnValue(null)

      const { settings, updateSetting } = useSettings()
      updateSetting('language', 'km')

      expect(settings.value.language).toBe('km')
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('updates multiple settings sequentially', async () => {
      localStorage.getItem.mockReturnValue(null)

      const { settings, updateSetting } = useSettings()
      updateSetting('darkMode', true)
      updateSetting('language', 'km')

      expect(settings.value.darkMode).toBe(true)
      expect(settings.value.language).toBe('km')
    })
  })

  describe('resetSettings', () => {
    it('resets to default values', async () => {
      localStorage.getItem.mockReturnValue(null)

      const { settings, updateSetting, resetSettings } = useSettings()
      updateSetting('language', 'km')
      updateSetting('darkMode', true)
      expect(settings.value.language).toBe('km')

      resetSettings()

      expect(settings.value).toEqual(defaultSettings)
      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('settings watcher', () => {
    it('triggers saveSettings on changes', async () => {
      localStorage.getItem.mockReturnValue(null)

      const { settings } = useSettings()
      localStorage.setItem.mockClear()

      settings.value.language = 'km'
      await nextTick()

      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('triggers saveSettings on nested object changes', async () => {
      localStorage.getItem.mockReturnValue(null)

      const { settings } = useSettings()
      localStorage.setItem.mockClear()

      settings.value.defaultProjectPath = '/new/path'
      await nextTick()

      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('default settings', () => {
    it('has correct default values', async () => {
      localStorage.getItem.mockReturnValue(null)

      const { settings } = useSettings()

      expect(settings.value.language).toBe('en')
      expect(settings.value.darkMode).toBe(false)
      expect(settings.value.defaultPhpVersion).toBe('8.3')
      expect(settings.value.defaultNodeVersion).toBe('22')
      expect(settings.value.autoDetectPhp).toBe(true)
      expect(settings.value.showKeyboardHints).toBe(false)
      expect(settings.value.onboardingCompleted).toBe(false)
    })
  })

  describe('returned API', () => {
    it('returns settings, updateSetting, resetSettings, loadSettings, saveSettings', async () => {
      localStorage.getItem.mockReturnValue(null)

      const api = useSettings()

      expect(api).toHaveProperty('settings')
      expect(api).toHaveProperty('updateSetting')
      expect(api).toHaveProperty('resetSettings')
      expect(api).toHaveProperty('loadSettings')
      expect(api).toHaveProperty('saveSettings')
    })
  })
})
