<template>
  <div class="lg-panel p-4 sm:p-6 overflow-y-auto min-h-[560px]">
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
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import CreateProjectForm from '../components/forms/CreateProjectForm.vue'
import ProjectList from '../components/forms/ProjectList.vue'
import ImportProjectForm from '../components/forms/ImportProjectForm.vue'
import { useMenuNavigation } from '../composables/useMenuNavigation'

const { menuActiveView, clearMenuActiveView } = useMenuNavigation()
const activeView = ref('recent')
const hasProjects = ref(false)

watch(menuActiveView, (newView) => {
  if (newView && (newView === 'recent' || newView === 'new' || newView === 'import')) {
    activeView.value = newView
    clearMenuActiveView()
  }
})

onMounted(() => {
  if (menuActiveView.value) {
    activeView.value = menuActiveView.value
    clearMenuActiveView()
  }
})

function handleProjectsLoaded(count) {
  hasProjects.value = count > 0
}

function handleProjectImported() {
  activeView.value = 'recent'
}
</script>
