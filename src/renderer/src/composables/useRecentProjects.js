import { ref, computed } from 'vue'
import { useIpc } from './useIpc'

const STORAGE_KEY = 'localforge_recent_projects'
const MAX_RECENT_PROJECTS = 10

const recentProjects = ref([])

export function useRecentProjects() {
  const { invoke } = useIpc()

  async function loadRecentProjects() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const projects = JSON.parse(stored)
        const verifiedProjects = []
        for (const project of projects) {
          const exists = await invoke('check-directory-exists', { dirPath: project.path })
          if (exists) {
            verifiedProjects.push(project)
          }
        }
        recentProjects.value = verifiedProjects
        saveRecentProjects()
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load recent projects:', error)
      recentProjects.value = []
    }
  }

  function saveRecentProjects() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentProjects.value))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save recent projects:', error)
    }
  }

  function addRecentProject(project) {
    // Use fullPath if available, otherwise construct it
    const fullPath = project.fullPath || `${project.path}/${project.name}`

    const projectData = {
      name: project.name,
      path: fullPath, // Store full path
      baseDirectory: project.path, // Store base directory for reference
      type: project.type,
      createdAt: new Date().toISOString(),
      config: {
        phpVersion: project.phpVersion,
        nodeVersion: project.nodeVersion,
        laravelVersion: project.laravelVersion,
        laravelStarter: project.laravelStarter,
        nuxtVersion: project.nuxtVersion,
        nuxtTemplate: project.nuxtTemplate,
        vueOptions: project.vueOptions,
        wpPhpVersion: project.wpPhpVersion,
      },
    }

    // Remove duplicate if exists (check by full path)
    recentProjects.value = recentProjects.value.filter((p) => p.path !== fullPath)

    // Add to beginning
    recentProjects.value.unshift(projectData)

    // Keep only MAX_RECENT_PROJECTS
    if (recentProjects.value.length > MAX_RECENT_PROJECTS) {
      recentProjects.value = recentProjects.value.slice(0, MAX_RECENT_PROJECTS)
    }

    saveRecentProjects()

    // eslint-disable-next-line no-console
    console.log('Project saved to recent:', projectData)
  }

  function removeRecentProject(path) {
    recentProjects.value = recentProjects.value.filter((p) => p.path !== path)
    saveRecentProjects()
  }

  async function removeProjectWithConfigs(path) {
    try {
      await invoke('delete-project-and-configs', { projectPath: path })
      removeRecentProject(path)
      return { success: true }
    } catch (error) {
      removeRecentProject(path)
      throw error
    }
  }

  function clearRecentProjects() {
    recentProjects.value = []
    saveRecentProjects()
  }

  const sortedProjects = computed(() => {
    return [...recentProjects.value].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  })

  // Load on first use
  if (recentProjects.value.length === 0) {
    loadRecentProjects()
  }

  return {
    recentProjects: sortedProjects,
    addRecentProject,
    removeRecentProject,
    removeProjectWithConfigs,
    clearRecentProjects,
    loadRecentProjects,
  }
}
