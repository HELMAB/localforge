import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockInvoke = vi.fn()
const mockOn = vi.fn()
const mockRemoveListener = vi.fn()

beforeEach(() => {
  mockInvoke.mockReset()
  mockOn.mockReset()
  mockRemoveListener.mockReset()

  window.require = vi.fn(() => ({
    ipcRenderer: {
      invoke: mockInvoke,
      on: mockOn,
      removeListener: mockRemoveListener,
    },
  }))
})

afterEach(() => {
  vi.resetModules()
  delete window.require
})

describe('useOperationControl', () => {
  let useOperationControl

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('./useOperationControl')
    useOperationControl = module.useOperationControl
  })

  describe('createOperation', () => {
    it('adds operation to activeOperations', () => {
      const { createOperation, activeOperations } = useOperationControl()

      createOperation('op-1', 'create-project')

      expect(activeOperations.value.has('op-1')).toBe(true)
    })

    it('sets correct initial state (running, canCancel)', () => {
      const { createOperation, getOperation } = useOperationControl()

      const operation = createOperation('op-2', 'install-php')

      expect(operation.status).toBe('running')
      expect(operation.canCancel).toBe(true)
      expect(operation.type).toBe('install-php')
      expect(operation.output).toEqual([])
      expect(operation.startTime).toBeDefined()
      expect(getOperation('op-2')).toStrictEqual(operation)
    })
  })

  describe('updateOperationOutput', () => {
    it('adds output line to operation', () => {
      const { createOperation, updateOperationOutput, getOperation } = useOperationControl()

      createOperation('op-3', 'test')
      updateOperationOutput('op-3', 'Installing dependencies...')

      const operation = getOperation('op-3')
      expect(operation.output).toHaveLength(1)
      expect(operation.output[0].text).toBe('Installing dependencies...')
      expect(operation.output[0].timestamp).toBeDefined()
    })

    it('does nothing if operation does not exist', () => {
      const { updateOperationOutput, activeOperations } = useOperationControl()

      updateOperationOutput('non-existent', 'Some output')

      expect(activeOperations.value.size).toBe(0)
    })
  })

  describe('cancelOperation', () => {
    it('calls IPC and updates status', async () => {
      mockInvoke.mockResolvedValue({ success: true })
      const { createOperation, cancelOperation, getOperation } = useOperationControl()

      createOperation('op-4', 'test')
      const result = await cancelOperation('op-4')

      expect(mockInvoke).toHaveBeenCalledWith('cancel-operation', { operationId: 'op-4' })
      expect(result).toBe(true)
      expect(getOperation('op-4').status).toBe('cancelled')
    })

    it('returns false for non-cancellable operations', async () => {
      const { createOperation, cancelOperation } = useOperationControl()

      const operation = createOperation('op-5', 'test')
      operation.canCancel = false

      const result = await cancelOperation('op-5')

      expect(result).toBe(false)
      expect(mockInvoke).not.toHaveBeenCalled()
    })

    it('returns false if operation does not exist', async () => {
      const { cancelOperation } = useOperationControl()

      const result = await cancelOperation('non-existent')

      expect(result).toBe(false)
    })

    it('returns false on IPC failure', async () => {
      mockInvoke.mockRejectedValue(new Error('Cancel failed'))
      const { createOperation, cancelOperation } = useOperationControl()

      createOperation('op-6', 'test')
      const result = await cancelOperation('op-6')

      expect(result).toBe(false)
    })
  })

  describe('completeOperation', () => {
    it('sets success status correctly', () => {
      const { createOperation, completeOperation, getOperation } = useOperationControl()

      createOperation('op-7', 'test')
      completeOperation('op-7', true)

      const operation = getOperation('op-7')
      expect(operation.status).toBe('completed')
      expect(operation.endTime).toBeDefined()
      expect(operation.duration).toBeDefined()
    })

    it('sets failed status correctly', () => {
      const { createOperation, completeOperation, getOperation } = useOperationControl()

      createOperation('op-8', 'test')
      completeOperation('op-8', false)

      const operation = getOperation('op-8')
      expect(operation.status).toBe('failed')
    })

    it('calculates duration correctly', () => {
      const { createOperation, completeOperation, getOperation } = useOperationControl()

      const startTime = Date.now()
      createOperation('op-9', 'test')
      const op = getOperation('op-9')
      op.startTime = startTime - 5000

      completeOperation('op-9', true)

      const operation = getOperation('op-9')
      expect(operation.duration).toBe(5000)
    })

    it('does nothing if operation does not exist', () => {
      const { completeOperation } = useOperationControl()

      expect(() => completeOperation('non-existent', true)).not.toThrow()
    })
  })

  describe('removeOperation', () => {
    it('deletes operation from Map', () => {
      const { createOperation, removeOperation, getOperation, activeOperations } =
        useOperationControl()

      createOperation('op-10', 'test')
      expect(activeOperations.value.has('op-10')).toBe(true)

      removeOperation('op-10')

      expect(activeOperations.value.has('op-10')).toBe(false)
      expect(getOperation('op-10')).toBeUndefined()
    })

    it('does nothing if operation does not exist', () => {
      const { removeOperation } = useOperationControl()

      expect(() => removeOperation('non-existent')).not.toThrow()
    })
  })

  describe('getOperation', () => {
    it('returns operation by id', () => {
      const { createOperation, getOperation } = useOperationControl()

      createOperation('op-11', 'test')
      const operation = getOperation('op-11')

      expect(operation).toBeDefined()
      expect(operation.id).toBe('op-11')
    })

    it('returns undefined for non-existent operation', () => {
      const { getOperation } = useOperationControl()

      const operation = getOperation('non-existent')

      expect(operation).toBeUndefined()
    })
  })

  describe('clearCompleted', () => {
    it('removes non-running operations', () => {
      const { createOperation, completeOperation, clearCompleted, getOperation } =
        useOperationControl()

      createOperation('op-12', 'test')
      createOperation('op-13', 'test')
      createOperation('op-14', 'test')

      completeOperation('op-12', true)
      completeOperation('op-13', false)

      clearCompleted()

      expect(getOperation('op-12')).toBeUndefined()
      expect(getOperation('op-13')).toBeUndefined()
      expect(getOperation('op-14')).toBeDefined()
    })

    it('keeps running operations', () => {
      const { createOperation, clearCompleted, getOperation } = useOperationControl()

      createOperation('op-15', 'test')

      clearCompleted()

      expect(getOperation('op-15')).toBeDefined()
    })
  })

  describe('returned API', () => {
    it('returns all required functions and state', () => {
      const result = useOperationControl()

      expect(result.activeOperations).toBeDefined()
      expect(result.createOperation).toBeDefined()
      expect(result.updateOperationOutput).toBeDefined()
      expect(result.cancelOperation).toBeDefined()
      expect(result.completeOperation).toBeDefined()
      expect(result.removeOperation).toBeDefined()
      expect(result.getOperation).toBeDefined()
      expect(result.clearCompleted).toBeDefined()
    })
  })
})
