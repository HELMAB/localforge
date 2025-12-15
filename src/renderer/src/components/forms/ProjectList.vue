<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('projects') }}
      </h2>
      <div class="w-64">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('searchProjects')"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
      </div>
    </div>

    <div
      v-if="filteredProjects.length > 0"
      class="space-y-4"
    >
      <div
        v-for="project in filteredProjects"
        :key="project.path"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
      >
        <div class="p-5">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
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
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white truncate">
                  {{ project.name }}
                </h3>
                <span
                  class="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {{ t(getProjectTypeLabel(project.type)) }}
                </span>
              </div>
            </div>
            <ProjectActions
              :project="project"
              @remove="handleRemove"
              @open-in-ide="openInIDE"
              @open-in-file-manager="openInFileManager"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-4">
            {{ project.path }}
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {{ t('createdOn') }} {{ formatDate(project.createdAt) }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-center py-12"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('noProjectsFound') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ t('noProjectsFoundDesc') }}
      </p>
    </div>

    <ConfirmationModal
      :visible="isRemoveModalVisible"
      :title="t('deleteProjectTitle')"
      :message="t('deleteProjectMessage', { projectName: projectToRemove ? projectToRemove.name : '' })"
      :confirm-text="t('delete')"
      level="danger"
      @close="isRemoveModalVisible = false"
      @confirm="confirmRemove"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRecentProjects } from '../../composables/useRecentProjects'
import { useToast } from '../../composables/useToast'
import ConfirmationModal from '../common/ConfirmationModal.vue'
import ProjectActions from './ProjectActions.vue'
import laravelIcon from '@/assets/svg/laravel.svg'
import vuejsIcon from '@/assets/svg/vuejs.svg'
import nuxtjsIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'

const { t } = useI18n()
const {
  recentProjects,
  removeProjectWithConfigs,
  loadRecentProjects,
} = useRecentProjects()
const toast = useToast()

const isRemoveModalVisible = ref(false)
const projectToRemove = ref(null)
const searchQuery = ref('')

const filteredProjects = computed(() => {
  if (!searchQuery.value) {
    return recentProjects.value
  }
  return recentProjects.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(() => {
  loadRecentProjects()
})

function handleRemove(project) {
  projectToRemove.value = project
  isRemoveModalVisible.value = true
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
  return labels[type] || type
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

function openInIDE(path) {
  const { exec } = require('child_process')
  exec(`code "${path}"`, (error) => {
    if (error) {
      toast.showToast('VS Code not found or not in PATH', 'error')
    }
  })
}

function openInFileManager(path) {
  const { exec } = require('child_process')
  const command =
    process.platform === 'win32'
      ? `explorer "${path}"`
      : process.platform === 'darwin'
        ? `open "${path}"`
        : `xdg-open "${path}"`
  exec(command)
}
</script>