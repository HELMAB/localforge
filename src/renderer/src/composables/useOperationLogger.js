import { ref } from 'vue'

/**
 * Operation Logger - Tracks system operations and enables rollback
 *
 * Logs all critical operations (file creation, nginx config, etc.)
 * and provides rollback capabilities when operations fail
 */

const operations = ref([])
const currentOperation = ref(null)

export function useOperationLogger() {
  function startOperation(type, description, metadata = {}) {
    const operation = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type,
      description,
      metadata,
      steps: [],
      status: 'in_progress',
      startTime: new Date(),
      endTime: null,
    }

    currentOperation.value = operation
    operations.value.unshift(operation)

    return operation.id
  }

  function logStep(operationId, step) {
    const operation = operations.value.find((op) => op.id === operationId)
    if (!operation) {
      // eslint-disable-next-line no-console
      console.warn(`Operation ${operationId} not found`)
      return
    }

    const stepEntry = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...step,
    }

    operation.steps.push(stepEntry)
  }

  function completeOperation(operationId, status = 'success', result = null) {
    const operation = operations.value.find((op) => op.id === operationId)
    if (!operation) {
      // eslint-disable-next-line no-console
      console.warn(`Operation ${operationId} not found`)
      return
    }

    operation.status = status
    operation.endTime = new Date()
    operation.result = result

    if (currentOperation.value?.id === operationId) {
      currentOperation.value = null
    }

    // Keep only last 50 operations
    if (operations.value.length > 50) {
      operations.value = operations.value.slice(0, 50)
    }
  }

  async function rollbackOperation(operationId) {
    const operation = operations.value.find((op) => op.id === operationId)
    if (!operation) {
      throw new Error(`Operation ${operationId} not found`)
    }

    // Rollback steps in reverse order
    const reversedSteps = [...operation.steps].reverse()
    const rollbackResults = []

    for (const step of reversedSteps) {
      if (step.rollback) {
        try {
          const result = await step.rollback()
          rollbackResults.push({
            stepId: step.id,
            action: step.action,
            success: true,
            result,
          })
        } catch (error) {
          rollbackResults.push({
            stepId: step.id,
            action: step.action,
            success: false,
            error: error.message,
          })
        }
      }
    }

    operation.rolledBack = true
    operation.rollbackTime = new Date()
    operation.rollbackResults = rollbackResults

    return rollbackResults
  }

  function getOperation(operationId) {
    return operations.value.find((op) => op.id === operationId)
  }

  function getRecentOperations(limit = 10) {
    return operations.value.slice(0, limit)
  }

  function getFailedOperations() {
    return operations.value.filter((op) => op.status === 'failed')
  }

  function clearOperations() {
    operations.value = []
    currentOperation.value = null
  }

  return {
    operations,
    currentOperation,
    startOperation,
    logStep,
    completeOperation,
    rollbackOperation,
    getOperation,
    getRecentOperations,
    getFailedOperations,
    clearOperations,
  }
}
