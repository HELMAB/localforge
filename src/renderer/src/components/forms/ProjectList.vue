<template>
  <div>
    <!-- Filters and Search Bar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('projects') }}
      </h2>
      
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <!-- Filter by Type -->
        <div class="w-full sm:w-48">
          <CustomSelect
            v-model="filterType"
            :options="filterOptions"
            :placeholder="t('filterByType')"
          />
        </div>

        <!-- Sort -->
        <div class="w-full sm:w-48">
          <CustomSelect
            v-model="sortBy"
            :options="sortOptions"
            :placeholder="t('sortBy')"
          />
        </div>

        <!-- Search -->
        <div class="relative flex-1 sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('searchProjects')"
            class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Project List -->
    <div
      v-if="paginatedProjects.length > 0"
      class="space-y-4"
    >
      <div
        v-for="project in paginatedProjects"
        :key="project.path"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
      >
        <div class="p-5">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4 flex-1">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                :class="getProjectIconBg(project.type)"
              >
                <img
                  :src="getProjectIcon(project.type)"
                  class="h-7 w-7"
                  :alt="project.type"
                >
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3">
                  <h3 class="font-bold text-gray-900 dark:text-white truncate">
                    {{ project.name }}
                  </h3>
                  <span
                    class="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {{ t(getProjectTypeLabel(project.type)) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                  {{ project.path }}
                </p>
                <div class="flex items-center gap-4 mt-2">
                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    {{ t('createdOn') }} {{ formatDate(project.createdAt) }}
                  </p>
                  <span
                    v-if="project.config?.phpVersion"
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    PHP {{ project.config.phpVersion }}
                  </span>
                  <span
                    v-if="project.config?.laravelVersion"
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Laravel {{ project.config.laravelVersion }}
                  </span>
                </div>
              </div>
            </div>
            <ProjectActions
              :project="project"
              @remove="handleRemove"
              @open-in-ide="openInIDE"
              @open-in-file-manager="handleOpenInFileManager"
              @view-details="handleViewDetails(project)"
              @open-in-browser="handleOpenInBrowser(project)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-gray-400 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('noProjectsFound') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ t('noProjectsFoundDesc') }}
      </p>

      <button
        class="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
        @click="$emit('update:activeView', 'new')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ t('newProject') }}</span>
      </button>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
    >
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ t('showingProjects', { start: startItem, end: endItem, total: filteredProjects.length }) }}
      </div>
      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="currentPage--"
        >
          {{ t('previousPage') }}
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ t('page') }} {{ currentPage }} {{ t('of') }} {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="currentPage++"
        >
          {{ t('nextPage') }}
        </button>
      </div>
      <div class="w-32">
        <CustomSelect
          v-model="itemsPerPage"
          :options="itemsPerPageOptions"
          :placeholder="t('itemsPerPage')"
        />
      </div>
    </div>

    <!-- Modals -->
    <ConfirmationModal
      :visible="isRemoveModalVisible"
      :title="t('deleteProjectTitle')"
      :message="
        t('deleteProjectMessage', { projectName: projectToRemove ? projectToRemove.name : '' })
      "
      :confirm-text="t('delete')"
      level="danger"
      @close="isRemoveModalVisible = false"
      @confirm="confirmRemove"
    />

    <ProjectDetailsModal
      :visible="isDetailsModalVisible"
      :project="selectedProject"
      @close="isDetailsModalVisible = false"
      @open-in-editor="openInIDE"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRecentProjects } from '../../composables/useRecentProjects'
import { useProject } from '../../composables/useProject'
import { useToast } from '../../composables/useToast'
import ConfirmationModal from '../common/ConfirmationModal.vue'
import ProjectDetailsModal from '../common/ProjectDetailsModal.vue'
import CustomSelect from '../common/CustomSelect.vue'
import ProjectActions from './ProjectActions.vue'
import laravelIcon from '@/assets/svg/laravel.svg'
import vuejsIcon from '@/assets/svg/vuejs.svg'
import nuxtjsIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'

const { t } = useI18n()
const { recentProjects, removeProjectWithConfigs, loadRecentProjects } = useRecentProjects()
const { openInEditor, openInFileManager, openInBrowser } = useProject()
const toast = useToast()

const isRemoveModalVisible = ref(false)
const isDetailsModalVisible = ref(false)
const projectToRemove = ref(null)
const selectedProject = ref(null)
const searchQuery = ref('')
const filterType = ref('all')
const sortBy = ref('date')
const currentPage = ref(1)
const itemsPerPage = ref(10)

defineProps({
  activeView: {
    type: String,
    required: true,
  },
})

defineEmits(['update:activeView'])

// Filter options with icons
const filterOptions = computed(() => [
  { value: 'all', label: t('allTypes') },
  { value: 'laravel', label: 'Laravel', icon: laravelIcon },
  { value: 'vue', label: 'Vue.js', icon: vuejsIcon },
  { value: 'nuxt', label: 'Nuxt.js', icon: nuxtjsIcon },
  { value: 'react', label: 'React', icon: reactIcon },
  { value: 'wordpress', label: 'WordPress', icon: wordpressIcon },
])

// Sort options
const sortOptions = computed(() => [
  { value: 'date', label: t('sortByDate') },
  { value: 'name', label: t('sortByName') },
])

// Items per page options
const itemsPerPageOptions = computed(() => [
  { value: 5, label: `5 ${t('itemsPerPage')}` },
  { value: 10, label: `10 ${t('itemsPerPage')}` },
  { value: 20, label: `20 ${t('itemsPerPage')}` },
  { value: 50, label: `50 ${t('itemsPerPage')}` },
])


const filteredProjects = computed(() => {
  let projects = recentProjects.value

  // Filter by type
  if (filterType.value !== 'all') {
    projects = projects.filter((p) => p.type === filterType.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    projects = projects.filter((p) =>
      p.name.toLowerCase().includes(query) || p.path.toLowerCase().includes(query)
    )
  }

  // Sort
  if (sortBy.value === 'name') {
    projects = [...projects].sort((a, b) => a.name.localeCompare(b.name))
  } else {
    projects = [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return projects
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / itemsPerPage.value))

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredProjects.value.length)
)

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProjects.value.slice(start, end)
})

watch([filterType, searchQuery, sortBy], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadRecentProjects()
})

function handleRemove(project) {
  projectToRemove.value = project
  isRemoveModalVisible.value = true
}

function handleViewDetails(project) {
  selectedProject.value = project
  isDetailsModalVisible.value = true
}

async function handleOpenInBrowser(project) {
  try {
    const projectName = project.name.toLowerCase().replace(/\s+/g, '-')
    const url = `http://${projectName}.local`
    await openInBrowser(url)
  } catch (error) {
    toast.showToast(error.message, 'error')
  }
}

async function confirmRemove() {
  if (!projectToRemove.value) return

  try {
    await removeProjectWithConfigs(projectToRemove.value.path)
    toast.showToast(t('projectRemovedAndConfigsDeleted'), 'success')
  } catch (error) {
    toast.showToast(t('errorDeletingProjectConfigs', { error: error.message }), 'error')
  } finally {
    isRemoveModalVisible.value = false
    projectToRemove.value = null
  }
}

function getProjectIcon(type) {
  const icons = {
    laravel: laravelIcon,
    vue: vuejsIcon,
    nuxt: nuxtjsIcon,
    react: reactIcon,
    wordpress: wordpressIcon,
  }
  return icons[type] || laravelIcon
}

function getProjectIconBg(type) {
  const colors = {
    laravel: 'bg-red-100 dark:bg-red-900/20',
    vue: 'bg-green-100 dark:bg-green-900/20',
    nuxt: 'bg-green-100 dark:bg-green-900/20',
    react: 'bg-blue-100 dark:bg-blue-900/20',
    wordpress: 'bg-blue-100 dark:bg-blue-900/20',
  }
  return colors[type] || 'bg-gray-100 dark:bg-gray-700'
}

function getProjectTypeLabel(type) {
  const labels = {
    laravel: 'projectTypeLaravel',
    vue: 'projectTypeVue',
    nuxt: 'projectTypeNuxt',
    react: 'projectTypeReact',
    wordpress: 'projectTypeWordpress',
  }
  return labels[type] || 'projectTypeUnknown'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  return date.toLocaleDateString()
}

async function openInIDE(path) {
  try {
    await openInEditor(path)
  } catch (error) {
    toast.showToast(error.message, 'error')
  }
}

async function handleOpenInFileManager(path) {
  try {
    await openInFileManager(path)
  } catch (error) {
    toast.showToast(error.message, 'error')
  }
}
</script>
