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

const { menuActiveView, setMenuActiveView } = useMenuNavigation()
const activeView = ref('recent')
const hasProjects = ref(false)

// Apply sidebar navigation to local view
watch(menuActiveView, (newView) => {
  if (newView === 'new' || newView === 'import') {
    activeView.value = newView
  } else if (newView === null || newView === '') {
    activeView.value = 'recent'
  }
})

// Sync local activeView back to menuActiveView for sidebar highlighting
watch(activeView, (newView) => {
  const target = newView === 'new' || newView === 'import' ? newView : null
  if (menuActiveView.value !== target) {
    setMenuActiveView(target)
  }
})

onMounted(() => {
  if (menuActiveView.value === 'new' || menuActiveView.value === 'import') {
    activeView.value = menuActiveView.value
  }
})

function handleProjectsLoaded(count) {
  hasProjects.value = count > 0
}

function handleProjectImported() {
  activeView.value = 'recent'
}
</script>
