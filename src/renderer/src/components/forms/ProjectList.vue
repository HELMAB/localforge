<template>
  <div class="space-y-6">
    <!-- Header with Stats -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('projects') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          {{ filteredProjects.length }} {{ filteredProjects.length === 1 ? t('configuration') : t('configurations') }}
        </p>
      </div>
      
      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
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
            class="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Total Projects
            </p>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
              {{ recentProjects.length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-white"
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

      <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-600 dark:text-green-400 text-sm font-medium">
              Laravel
            </p>
            <p class="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
              {{ recentProjects.filter(p => p.type === 'laravel').length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
            <img
              :src="laravelIcon"
              class="h-6 w-6"
              alt="Laravel"
            >
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-600 dark:text-purple-400 text-sm font-medium">
              Vue/Nuxt
            </p>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
              {{ recentProjects.filter(p => ['vue', 'nuxt'].includes(p.type)).length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center">
            <img
              :src="vuejsIcon"
              class="h-6 w-6"
              alt="Vue"
            >
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-600 dark:text-orange-400 text-sm font-medium">
              React/WP
            </p>
            <p class="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
              {{ recentProjects.filter(p => ['react', 'wordpress'].includes(p.type)).length }}
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center">
            <img
              :src="reactIcon"
              class="h-6 w-6"
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
        class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <div
          v-for="project in paginatedProjects"
          :key="project.path"
          class="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-blue-300 dark:hover:border-blue-600"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <div
                  class="relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 transition-all duration-300 group-hover:scale-110"
                  :class="getProjectIconRing(project.type)"
                >
                  <div
                    class="absolute inset-0 rounded-xl opacity-20"
                    :class="getProjectIconBg(project.type)"
                  />
                  <img
                    :src="getProjectIcon(project.type)"
                    class="relative h-8 w-8 z-10"
                    :alt="project.type"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold text-lg text-gray-900 dark:text-white truncate">
                      {{ project.name }}
                    </h3>
                    <span
                      class="px-2 py-0.5 text-xs font-medium rounded-full"
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
            <div class="flex items-center gap-4 flex-wrap text-xs">
              <div class="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
                class="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
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
                class="flex items-center gap-1.5 px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md"
              >
                <img
                  :src="laravelIcon"
                  class="h-3.5 w-3.5"
                  alt="Laravel"
                >
                <span class="font-medium">v{{ project.config.laravelVersion }}</span>
              </div>
              <div
                v-if="project.config?.nodeVersion"
                class="flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
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
          <div class="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2">
            <button
              class="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
              @click="handleViewDetails(project)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
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
              class="px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-1.5"
              @click="openInIDE(project.path)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
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

function getProjectIconRing(type) {
  const colors = {
    laravel: 'ring-red-200 dark:ring-red-800',
    vue: 'ring-green-200 dark:ring-green-800',
    nuxt: 'ring-green-200 dark:ring-green-800',
    react: 'ring-blue-200 dark:ring-blue-800',
    wordpress: 'ring-blue-200 dark:ring-blue-800',
  }
  return colors[type] || 'ring-gray-200 dark:ring-gray-700'
}

function getProjectTypeBadge(type) {
  const colors = {
    laravel: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    vue: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    nuxt: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    react: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    wordpress: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  }
  return colors[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
