<template>
  <div class="flex">
    <!-- Sidebar -->
    <div class="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('menu') }}</h2>
        <nav class="space-y-2">
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
            :class="[
              activeView === 'new'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
            @click.prevent="activeView = 'new'"
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
          </a>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
            :class="[
              activeView === 'recent'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
            @click.prevent="activeView = 'recent'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            <span>{{ t('projects') }}</span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6">
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
