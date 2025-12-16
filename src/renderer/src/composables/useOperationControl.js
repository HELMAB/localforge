import { ref } from 'vue'
import { useIpc } from './useIpc'

const activeOperations = ref(new Map())

export function useOperationControl() {
  const { invoke } = useIpc()

  const createOperation = (id, type) => {
    const operation = {
      id,
      type,
      status: 'running',
      output: [],
      startTime: Date.now(),
      canCancel: true,
    }

    activeOperations.value.set(id, operation)
    return operation
  }

  const updateOperationOutput = (id, line) => {
    const operation = activeOperations.value.get(id)
    if (operation) {
      operation.output.push({
        text: line,
        timestamp: Date.now(),
      })
    }
  }

  const cancelOperation = async (id) => {
    const operation = activeOperations.value.get(id)
    if (!operation || !operation.canCancel) return false

    try {
      await invoke('cancel-operation', { operationId: id })
      operation.status = 'cancelled'
      setTimeout(() => {
        removeOperation(id)
      }, 3000)
      return true
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to cancel operation:', error)
      return false
    }
  }

  const completeOperation = (id, success = true) => {
    const operation = activeOperations.value.get(id)
    if (operation) {
      operation.status = success ? 'completed' : 'failed'
      operation.endTime = Date.now()
      operation.duration = operation.endTime - operation.startTime

      setTimeout(() => {
        removeOperation(id)
      }, 3000)
    }
  }

  const removeOperation = (id) => {
    activeOperations.value.delete(id)
  }

  const getOperation = (id) => {
    return activeOperations.value.get(id)
  }

  const clearCompleted = () => {
    for (const [id, operation] of activeOperations.value.entries()) {
      if (operation.status !== 'running') {
        activeOperations.value.delete(id)
      }
    }
  }

  return {
    activeOperations,
    createOperation,
    updateOperationOutput,
    cancelOperation,
    completeOperation,
    removeOperation,
    getOperation,
    clearCompleted,
  }
}
