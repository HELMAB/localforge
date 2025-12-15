<template>
  <div class="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- Sidebar -->
    <div
      class="bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 px-3 flex flex-col rounded-l-lg"
      style="width: 180px; min-width: 180px"
    >
      <nav class="space-y-2 flex-1 overflow-y-auto">
        <button
          class="w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3"
          :class="[activeView === 'new' ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300']"
          @click="activeView = 'new'"
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
        <button
          class="w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3"
          :class="[activeView === 'recent' ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300']"
          @click="activeView = 'recent'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>{{ t('projects') }}</span>
        </button>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
      <CreateProjectForm v-if="activeView === 'new'" />
      <ProjectList v-if="activeView === 'recent'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CreateProjectForm from '../components/forms/CreateProjectForm.vue'
import ProjectList from '../components/forms/ProjectList.vue'

const { t } = useI18n()
const activeView = ref('new')
</script>
