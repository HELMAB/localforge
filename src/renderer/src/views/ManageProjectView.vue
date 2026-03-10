<template>
  <div class="flex gap-3">
    <ProjectSidebar v-model:active-view="activeView" />

    <div class="flex-1 lg-panel p-4 sm:p-6 overflow-y-auto min-h-[560px]">
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
