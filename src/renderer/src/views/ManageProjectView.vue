<template>
  <div class="p-6">
    <div
      class="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <!-- Sidebar -->
      <ProjectSidebar
        v-model:active-view="activeView"
      />

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
        <ProjectList
          v-if="activeView === 'recent'"
          v-model:active-view="activeView"
          @projects-loaded="handleProjectsLoaded"
        />
        <CreateProjectForm v-if="activeView === 'new'" />
        <ImportProjectForm
          v-if="activeView === 'import'"
          @cancel="activeView = 'recent'"
          @imported="handleProjectImported"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProjectSidebar from '../components/forms/ProjectSidebar.vue'
import CreateProjectForm from '../components/forms/CreateProjectForm.vue'
import ProjectList from '../components/forms/ProjectList.vue'
import ImportProjectForm from '../components/forms/ImportProjectForm.vue'

const activeView = ref('recent')
const hasProjects = ref(false)

function handleProjectsLoaded(count) {
  hasProjects.value = count > 0
}

function handleProjectImported() {
  activeView.value = 'recent'
}
</script>
