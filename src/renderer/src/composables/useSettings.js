import { ref, watch } from 'vue'

const SETTINGS_KEY = 'localforge-settings'

const defaultSettings = {
  language: 'en',
  darkMode: false,
  defaultProjectPath: '',
  defaultPhpVersion: '8.3',
  defaultNodeVersion: '22',
  autoDetectPhp: true,
  showKeyboardHints: false,
  onboardingCompleted: false,
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
      // eslint-disable-next-line no-console
      console.error('Failed to load settings:', error)
    }
  }

  const saveSettings = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
    } catch (error) {
      // eslint-disable-next-line no-console
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
    saveSettings,
  }
}
