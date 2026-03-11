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

describe('useProject', () => {
  let useProject

  beforeEach(async () => {
    vi.resetModules()
    const module = await import('./useProject')
    useProject = module.useProject
  })

  describe('selectDirectory', () => {
    it('calls IPC with select-directory channel', async () => {
      mockInvoke.mockResolvedValue('/selected/path')

      const { selectDirectory } = useProject()
      const result = await selectDirectory()

      expect(mockInvoke).toHaveBeenCalledWith('select-directory')
      expect(result).toBe('/selected/path')
    })

    it('sets error on failure', async () => {
      mockInvoke.mockRejectedValue(new Error('User cancelled'))

      const { selectDirectory, error: errorRef } = useProject()

      await expect(selectDirectory()).rejects.toThrow('User cancelled')
      expect(errorRef.value).toBe('User cancelled')
    })
  })

  describe('createProject', () => {
    it('calls IPC with create-project channel and projectData', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { createProject } = useProject()
      const projectData = {
        name: 'test-project',
        type: 'laravel',
        path: '/var/www/test',
      }

      const result = await createProject(projectData)

      expect(mockInvoke).toHaveBeenCalledWith('create-project', {
        ...projectData,
        operationId: expect.any(String),
      })
      expect(result).toEqual({ success: true })
    })

    it('handles success response', async () => {
      const successResponse = { success: true, projectPath: '/path/to/project' }
      mockInvoke.mockResolvedValue(successResponse)

      const { createProject } = useProject()
      const result = await createProject({ name: 'test', type: 'vue' })

      expect(result).toEqual(successResponse)
    })

    it('handles error response', async () => {
      mockInvoke.mockRejectedValue(new Error('Project creation failed'))

      const { createProject, error } = useProject()

      await expect(createProject({ name: 'test', type: 'vue' })).rejects.toThrow(
        'Project creation failed'
      )
      expect(error.value).toBe('Project creation failed')
    })

    it('sets isCreating to true during operation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { createProject, isCreating } = useProject()

      const promise = createProject({ name: 'test', type: 'vue' })
      expect(isCreating.value).toBe(true)

      await promise
      expect(isCreating.value).toBe(false)
    })

    it('sets isCreating to false on error', async () => {
      mockInvoke.mockRejectedValue(new Error('Creation failed'))

      const { createProject, isCreating } = useProject()

      await expect(createProject({ name: 'test', type: 'vue' })).rejects.toThrow()
      expect(isCreating.value).toBe(false)
    })
  })

  describe('detectProject', () => {
    it('returns parsed project data', async () => {
      const projectData = { type: 'laravel', name: 'my-app' }
      mockInvoke.mockResolvedValue(projectData)

      const { detectProject } = useProject()
      const result = await detectProject('/path/to/project')

      expect(mockInvoke).toHaveBeenCalledWith('detect-project', {
        projectPath: '/path/to/project',
      })
      expect(result).toEqual(projectData)
    })

    it('sets error on failure', async () => {
      mockInvoke.mockRejectedValue(new Error('Path not found'))

      const { detectProject, error } = useProject()

      await expect(detectProject('/invalid/path')).rejects.toThrow('Path not found')
      expect(error.value).toBe('Path not found')
    })
  })

  describe('openInBrowser', () => {
    it('calls IPC with correct URL', async () => {
      mockInvoke.mockResolvedValue(true)

      const { openInBrowser } = useProject()
      await openInBrowser('https://example.com')

      expect(mockInvoke).toHaveBeenCalledWith('open-in-browser', {
        url: 'https://example.com',
      })
    })

    it('sets error on failure', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to open'))

      const { openInBrowser, error } = useProject()

      await expect(openInBrowser('https://example.com')).rejects.toThrow('Failed to open')
      expect(error.value).toBe('Failed to open')
    })
  })

  describe('openInEditor', () => {
    it('calls IPC with correct path and default editor', async () => {
      mockInvoke.mockResolvedValue(true)

      const { openInEditor } = useProject()
      await openInEditor('/path/to/project')

      expect(mockInvoke).toHaveBeenCalledWith('open-in-editor', {
        path: '/path/to/project',
        editor: 'code',
      })
    })

    it('calls IPC with correct path and custom editor', async () => {
      mockInvoke.mockResolvedValue(true)

      const { openInEditor } = useProject()
      await openInEditor('/path/to/project', 'sublime')

      expect(mockInvoke).toHaveBeenCalledWith('open-in-editor', {
        path: '/path/to/project',
        editor: 'sublime',
      })
    })

    it('sets error on failure', async () => {
      mockInvoke.mockRejectedValue(new Error('Editor not found'))

      const { openInEditor, error } = useProject()

      await expect(openInEditor('/path')).rejects.toThrow('Editor not found')
      expect(error.value).toBe('Editor not found')
    })
  })

  describe('openInFileManager', () => {
    it('calls IPC with correct path', async () => {
      mockInvoke.mockResolvedValue(true)

      const { openInFileManager } = useProject()
      await openInFileManager('/path/to/project')

      expect(mockInvoke).toHaveBeenCalledWith('open-in-file-manager', {
        path: '/path/to/project',
      })
    })

    it('sets error on failure', async () => {
      mockInvoke.mockRejectedValue(new Error('Failed to open'))

      const { openInFileManager, error } = useProject()

      await expect(openInFileManager('/path')).rejects.toThrow('Failed to open')
      expect(error.value).toBe('Failed to open')
    })
  })

  describe('getProjectDetails', () => {
    it('returns project information', async () => {
      const details = { name: 'my-project', type: 'vue', path: '/path' }
      mockInvoke.mockResolvedValue(details)

      const { getProjectDetails } = useProject()
      const result = await getProjectDetails('/path/to/project')

      expect(mockInvoke).toHaveBeenCalledWith('get-project-details', {
        projectPath: '/path/to/project',
      })
      expect(result).toEqual(details)
    })

    it('sets error on failure', async () => {
      mockInvoke.mockRejectedValue(new Error('Project not found'))

      const { getProjectDetails, error } = useProject()

      await expect(getProjectDetails('/invalid')).rejects.toThrow('Project not found')
      expect(error.value).toBe('Project not found')
    })
  })

  describe('error state', () => {
    it('initializes with error as null', () => {
      const { error } = useProject()
      expect(error.value).toBe(null)
    })

    it('sets error state correctly on failures', async () => {
      mockInvoke.mockRejectedValue(new Error('Test error'))

      const { selectDirectory, error } = useProject()

      await expect(selectDirectory()).rejects.toThrow()
      expect(error.value).toBe('Test error')
    })
  })

  describe('isCreating state', () => {
    it('initializes with isCreating as false', () => {
      const { isCreating } = useProject()
      expect(isCreating.value).toBe(false)
    })

    it('toggles isCreating during createProject operation', async () => {
      mockInvoke.mockResolvedValue({ success: true })

      const { createProject, isCreating } = useProject()

      expect(isCreating.value).toBe(false)

      const promise = createProject({ name: 'test', type: 'vue' })
      expect(isCreating.value).toBe(true)

      await promise
      expect(isCreating.value).toBe(false)
    })
  })

  describe('returned API', () => {
    it('returns all required functions and refs', () => {
      const {
        selectDirectory,
        createProject,
        detectProject,
        openInBrowser,
        openInEditor,
        openInFileManager,
        getProjectDetails,
        isCreating,
        error,
      } = useProject()

      expect(typeof selectDirectory).toBe('function')
      expect(typeof createProject).toBe('function')
      expect(typeof detectProject).toBe('function')
      expect(typeof openInBrowser).toBe('function')
      expect(typeof openInEditor).toBe('function')
      expect(typeof openInFileManager).toBe('function')
      expect(typeof getProjectDetails).toBe('function')
      expect(isCreating.value).toBe(false)
      expect(error.value).toBe(null)
    })
  })
})
