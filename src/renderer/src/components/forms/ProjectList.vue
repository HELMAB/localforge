<template>
  <div class="space-y-4">
    <!-- Header with Stats -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {{ t('projects') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          {{ filteredProjects.length }} {{ filteredProjects.length === 1 ? t('configuration') : t('configurations') }}
        </p>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
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
        <div class="relative flex-1 sm:min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('searchProjects')"
            class="w-full px-3 py-2 pr-9 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all text-sm"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
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

    <!-- Stats Cards -->
    <div
      v-if="recentProjects.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
    >
      <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
              Total Projects
            </p>
            <p class="text-xl font-bold text-indigo-900 dark:text-indigo-100 mt-0.5">
              {{ recentProjects.length }}
            </p>
          </div>
          <div class="w-9 h-9 bg-indigo-500 dark:bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-600 dark:text-red-400 text-xs font-medium">
              Laravel
            </p>
            <p class="text-xl font-bold text-red-900 dark:text-red-100 mt-0.5">
              {{ projectsByType.laravel }}
            </p>
          </div>
          <div class="w-9 h-9 bg-red-500 dark:bg-red-600 rounded-lg flex items-center justify-center">
            <img
              :src="laravelIcon"
              class="h-5 w-5 brightness-0 invert"
              alt="Laravel"
            >
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-600 dark:text-green-400 text-xs font-medium">
              Vue/Nuxt
            </p>
            <p class="text-xl font-bold text-green-900 dark:text-green-100 mt-0.5">
              {{ projectsByType.vue }}
            </p>
          </div>
          <div class="w-9 h-9 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
            <img
              :src="vuejsIcon"
              class="h-5 w-5 brightness-0 invert"
              alt="Vue"
            >
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-cyan-600 dark:text-cyan-400 text-xs font-medium">
              React/WP
            </p>
            <p class="text-xl font-bold text-cyan-900 dark:text-cyan-100 mt-0.5">
              {{ projectsByType.react }}
            </p>
          </div>
          <div class="w-9 h-9 bg-cyan-500 dark:bg-cyan-600 rounded-lg flex items-center justify-center">
            <img
              :src="reactIcon"
              class="h-5 w-5 brightness-0 invert"
              alt="React"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Project Grid -->
    <div v-if="paginatedProjects.length > 0">
      <TransitionGroup
        name="project-list"
        tag="div"
        class="grid grid-cols-1 lg:grid-cols-2 gap-3"
      >
        <div
          v-for="project in paginatedProjects"
          :key="project.path"
          class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-visible hover:border-blue-300 dark:hover:border-blue-600"
        >
          <div class="p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div
                  class="relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 transition-all duration-300 group-hover:scale-105"
                  :class="getProjectIconRing(project.type)"
                >
                  <div
                    class="absolute inset-0 rounded-lg"
                    :class="getProjectIconBg(project.type)"
                  />
                  <img
                    :src="getProjectIcon(project.type)"
                    class="relative h-6 w-6 z-10"
                    :alt="project.type"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <h3 class="font-bold text-base text-gray-900 dark:text-white truncate">
                      {{ project.name }}
                    </h3>
                    <span
                      class="px-1.5 py-0.5 text-xs font-medium rounded-full"
                      :class="getProjectTypeBadge(project.type)"
                    >
                      {{ t(getProjectTypeLabel(project.type)) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ project.path }}
                  </p>
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

            <!-- Project Info -->
            <div class="flex items-center gap-2 flex-wrap text-xs">
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ formatDate(project.createdAt) }}</span>
              </div>
              <div
                v-if="project.config?.phpVersion"
                class="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">PHP {{ project.config.phpVersion }}</span>
              </div>
              <div
                v-if="project.config?.laravelVersion"
                class="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded"
              >
                <img
                  :src="laravelIcon"
                  class="h-3 w-3"
                  alt="Laravel"
                >
                <span class="font-medium">v{{ project.config.laravelVersion }}</span>
              </div>
              <div
                v-if="project.config?.nodeVersion"
                class="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <span class="font-medium">Node {{ project.config.nodeVersion }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions Footer -->
          <div class="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2">
            <button
              class="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors flex items-center gap-1"
              @click="handleViewDetails(project)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ t('viewDetails') }}
            </button>
            <button
              class="px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex items-center gap-1"
              @click="openInIDE(project.path)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ t('openInEditor') }}
            </button>
          </div>
        </div>
      </TransitionGroup>
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


const projectsByType = computed(() => ({
  laravel: recentProjects.value.filter(p => p.type === 'laravel').length,
  vue: recentProjects.value.filter(p => ['vue', 'nuxt'].includes(p.type)).length,
  react: recentProjects.value.filter(p => ['react', 'wordpress'].includes(p.type)).length,
}))

const filteredProjects = computed(() => {
  let projects = recentProjects.value

  if (filterType.value !== 'all') {
    projects = projects.filter((p) => p.type === filterType.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    projects = projects.filter((p) =>
      p.name.toLowerCase().includes(query) || p.path.toLowerCase().includes(query)
    )
  }

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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error opening in browser:', err)
    toast.error(err.message || err.toString() || 'Failed to open in browser')
  }
}

async function confirmRemove() {
  if (!projectToRemove.value) return

  try {
    await removeProjectWithConfigs(projectToRemove.value.path)
    toast.success(t('projectRemovedAndConfigsDeleted'))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error deleting project configs:', err)
    toast.error(t('errorDeletingProjectConfigs', { error: err.message || err.toString() }))
  } finally {
    isRemoveModalVisible.value = false
    projectToRemove.value = null
  }
}

const projectConfig = {
  laravel: {
    icon: laravelIcon,
    ring: 'ring-red-200 dark:ring-red-800',
    badge: 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200',
    label: 'projectTypeLaravel',
  },
  vue: {
    icon: vuejsIcon,
    ring: 'ring-green-200 dark:ring-green-800',
    badge: 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200',
    label: 'projectTypeVue',
  },
  nuxt: {
    icon: nuxtjsIcon,
    ring: 'ring-green-200 dark:ring-green-800',
    badge: 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200',
    label: 'projectTypeNuxt',
  },
  react: {
    icon: reactIcon,
    ring: 'ring-blue-200 dark:ring-blue-800',
    badge: 'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
    label: 'projectTypeReact',
  },
  wordpress: {
    icon: wordpressIcon,
    ring: 'ring-blue-200 dark:ring-blue-800',
    badge: 'bg-purple-50 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
    label: 'projectTypeWordpress',
  },
}

const defaultProjectConfig = {
  icon: laravelIcon,
  ring: 'ring-gray-200 dark:ring-gray-700',
  badge: 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  label: 'projectTypeUnknown',
}

function getProjectIcon(type) {
  return projectConfig[type]?.icon || defaultProjectConfig.icon
}

function getProjectIconBg(_type) {
  return 'bg-white dark:bg-white/10'
}

function getProjectIconRing(type) {
  return projectConfig[type]?.ring || defaultProjectConfig.ring
}

function getProjectTypeBadge(type) {
  return projectConfig[type]?.badge || defaultProjectConfig.badge
}

function getProjectTypeLabel(type) {
  return projectConfig[type]?.label || defaultProjectConfig.label
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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error opening in IDE:', err)
    toast.error(err.message || err.toString() || 'Failed to open in editor')
  }
}

async function handleOpenInFileManager(path) {
  try {
    await openInFileManager(path)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error opening in file manager:', err)
    toast.error(err.message || err.toString() || 'Failed to open in file manager')
  }
}
</script>

<style scoped>
/* Project List Animations */
.project-list-move,
.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.3s ease;
}

.project-list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.project-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.project-list-leave-active {
  position: absolute;
}
</style>
