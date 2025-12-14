import { ref } from 'vue'
import { useIpc } from './useIpc'

const { ipcRenderer } = window.require('electron')

const updateAvailable = ref(false)
const updateInfo = ref(null)
const downloadProgress = ref(null)
const updateDownloaded = ref(false)
const updateError = ref(null)
const checking = ref(false)
const downloading = ref(false)

// Event handlers
const handleUpdateAvailable = (event, info) => {
  updateAvailable.value = true
  updateInfo.value = info
}

const handleUpdateNotAvailable = (event, info) => {
  updateAvailable.value = false
  updateInfo.value = info
  checking.value = false
}

const handleDownloadProgress = (event, progress) => {
  downloadProgress.value = progress
}

const handleUpdateDownloaded = (event, info) => {
  updateDownloaded.value = true
  updateInfo.value = info
  downloading.value = false
}

const handleUpdateError = (event, error) => {
  updateError.value = error.message
  checking.value = false
  downloading.value = false
}

// Register event listeners once
ipcRenderer.on('update-available', handleUpdateAvailable)
ipcRenderer.on('update-not-available', handleUpdateNotAvailable)
ipcRenderer.on('download-progress', handleDownloadProgress)
ipcRenderer.on('update-downloaded', handleUpdateDownloaded)
ipcRenderer.on('update-error', handleUpdateError)

export function useUpdater() {
  const { invoke } = useIpc()

  const checkForUpdates = async () => {
    checking.value = true
    updateError.value = null
    try {
      await invoke('check-for-updates')
    } catch (error) {
      updateError.value = error.message
      checking.value = false
    }
  }

  const downloadUpdate = async () => {
    downloading.value = true
    updateError.value = null
    try {
      await invoke('download-update')
    } catch (error) {
      updateError.value = error.message
      downloading.value = false
    }
  }

  const installUpdate = async () => {
    try {
      await invoke('install-update')
    } catch (error) {
      updateError.value = error.message
    }
  }

  return {
    updateAvailable,
    updateInfo,
    downloadProgress,
    updateDownloaded,
    updateError,
    checking,
    downloading,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
  }
}
