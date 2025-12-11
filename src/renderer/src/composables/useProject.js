import { ref } from 'vue'
import { useIpc } from './useIpc'

export function useProject() {
  const { invoke } = useIpc()
  const isCreating = ref(false)
  const error = ref(null)

  async function selectDirectory() {
    try {
      return await invoke('select-directory')
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function createProject(projectData) {
    isCreating.value = true
    error.value = null

    try {
      const result = await invoke('create-project', projectData)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isCreating.value = false
    }
  }

  return {
    isCreating,
    error,
    selectDirectory,
    createProject
  }
}
