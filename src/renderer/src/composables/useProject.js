import { ref } from 'vue'
import { useIpc } from './useIpc'
import { useOperationControl } from './useOperationControl'

export function useProject() {
  const { invoke } = useIpc()
  const operations = useOperationControl()
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

    const operationId = `project-${Date.now()}`
    operations.createOperation(operationId, 'create-project')

    // Listen for real-time output
    const { ipcRenderer } = window.require('electron')
    const outputHandler = (event, { operationId: opId, line }) => {
      if (opId === operationId) {
        operations.updateOperationOutput(operationId, line)
      }
    }
    ipcRenderer.on('operation-output', outputHandler)

    try {
      const result = await invoke('create-project', { ...projectData, operationId })
      operations.completeOperation(operationId, true)
      ipcRenderer.removeListener('operation-output', outputHandler)
      return result
    } catch (err) {
      error.value = err.message
      operations.completeOperation(operationId, false)
      ipcRenderer.removeListener('operation-output', outputHandler)
      throw err
    } finally {
      isCreating.value = false
    }
  }

  async function detectProject(projectPath) {
    try {
      return await invoke('detect-project', { projectPath })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function openInBrowser(url) {
    try {
      return await invoke('open-in-browser', { url })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function openInEditor(projectPath, editor = 'code') {
    try {
      return await invoke('open-in-editor', { path: projectPath, editor })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function openInFileManager(projectPath) {
    try {
      return await invoke('open-in-file-manager', { path: projectPath })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function getProjectDetails(projectPath) {
    try {
      return await invoke('get-project-details', { projectPath })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    isCreating,
    error,
    selectDirectory,
    createProject,
    detectProject,
    openInBrowser,
    openInEditor,
    openInFileManager,
    getProjectDetails,
  }
}
