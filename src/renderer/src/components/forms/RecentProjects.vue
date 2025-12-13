<template>
  <div
    v-if="recentProjects.length > 0"
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        {{ t('recentProjects') }}
        <span class="text-sm text-gray-500 dark:text-gray-400">({{ recentProjects.length }})</span>
      </h3>
      <button
        class="text-xs text-red-600 dark:text-red-400 hover:underline"
        @click="handleClearAll"
      >
        Clear All
      </button>
    </div>
    
    <div class="space-y-2 max-h-64 overflow-y-auto">
      <div
        v-for="project in recentProjects"
        :key="project.path"
        class="group flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
      >
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div
            class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            :class="getProjectIconBg(project.type)"
          >
            <img
              :src="getProjectIcon(project.type)"
              class="h-6 w-6"
              :alt="project.type"
            >
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {{ project.name }}
              </h4>
              <span class="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {{ getProjectTypeLabel(project.type) }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ project.path }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              {{ t('createdOn') }} {{ formatDate(project.createdAt) }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
            :title="t('openInIDE')"
            @click="openInIDE(project.path)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            class="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
            :title="t('openInFileManager')"
            @click="openInFileManager(project.path)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </button>
          <button
            class="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors"
            :title="t('cloneConfig')"
            @click="$emit('clone-config', project.config)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>
          <button
            class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            :title="t('removeFromList')"
            @click="handleRemove(project.path)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRecentProjects } from '../../composables/useRecentProjects'
import { useStatus } from '../../composables/useStatus'
import laravelIcon from '@/assets/svg/laravel.svg'
import vuejsIcon from '@/assets/svg/vuejs.svg'
import nuxtjsIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'

const { t } = useI18n()
const { recentProjects, removeRecentProject, loadRecentProjects, clearRecentProjects } = useRecentProjects()
const status = useStatus()

defineEmits(['clone-config'])

onMounted(() => {
  // Force reload from localStorage
  loadRecentProjects()
  // eslint-disable-next-line no-console
  console.log('Recent projects loaded:', recentProjects.value.length)
})

function handleClearAll() {
  if (confirm('Are you sure you want to clear all recent projects?')) {
    clearRecentProjects()
    status.showStatus('All recent projects cleared', 'success')
  }
}

function getProjectIcon(type) {
  const icons = {
    laravel: laravelIcon,
    vue: vuejsIcon,
    nuxt: nuxtjsIcon,
    react: reactIcon,
    wordpress: wordpressIcon
  }
  return icons[type] || laravelIcon
}

function getProjectIconBg(type) {
  const colors = {
    laravel: 'bg-red-100 dark:bg-red-900/20',
    vue: 'bg-green-100 dark:bg-green-900/20',
    nuxt: 'bg-green-100 dark:bg-green-900/20',
    react: 'bg-blue-100 dark:bg-blue-900/20',
    wordpress: 'bg-blue-100 dark:bg-blue-900/20'
  }
  return colors[type] || 'bg-gray-100 dark:bg-gray-700'
}

function getProjectTypeLabel(type) {
  const labels = {
    laravel: 'Laravel',
    vue: 'Vue.js',
    nuxt: 'Nuxt.js',
    react: 'React',
    wordpress: 'WordPress'
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
  // Open in VS Code
  const { exec } = require('child_process')
  exec(`code "${path}"`, (error) => {
    if (error) {
      status.showStatus('VS Code not found or not in PATH', 'error')
    }
  })
}

function openInFileManager(path) {
  // Open in file manager
  const { exec } = require('child_process')
  const command = process.platform === 'win32' ? `explorer "${path}"` : 
                  process.platform === 'darwin' ? `open "${path}"` : 
                  `xdg-open "${path}"`
  exec(command)
}

function handleRemove(path) {
  removeRecentProject(path)
  status.showStatus(t('projectDeleted'), 'success')
}
</script>
