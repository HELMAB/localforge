import { ref } from 'vue'
import { useIpc } from './useIpc'

export function useBackup() {
  const { invoke } = useIpc()

  const exporting = ref(false)
  const importing = ref(false)

  const exportBackup = async () => {
    exporting.value = true
    try {
      const result = await invoke('export-backup')
      return result
    } finally {
      exporting.value = false
    }
  }

  const importBackup = async () => {
    importing.value = true
    try {
      const result = await invoke('import-backup')
      return result
    } finally {
      importing.value = false
    }
  }

  return {
    exporting,
    importing,
    exportBackup,
    importBackup,
  }
}
