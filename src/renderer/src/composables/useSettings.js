import { ref, watch } from 'vue'

const SETTINGS_KEY = 'devtools-settings'

const defaultSettings = {
  language: 'km',
  darkMode: false,
  defaultProjectPath: '',
  defaultPhpVersion: '8.2',
  defaultNodeVersion: '20',
  autoDetectPhp: true,
  showKeyboardHints: true
}

const settings = ref({ ...defaultSettings })

export function useSettings() {
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        settings.value = { ...defaultSettings, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const saveSettings = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const updateSetting = (key, value) => {
    settings.value[key] = value
    saveSettings()
  }

  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    saveSettings()
  }

  watch(settings, saveSettings, { deep: true })

  loadSettings()

  return {
    settings,
    updateSetting,
    resetSettings,
    loadSettings,
    saveSettings
  }
}
