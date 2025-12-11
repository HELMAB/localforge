<template>
  <div class="space-y-4">
    <ProjectTypeSelector v-model="projectType" />

    <LaravelOptions
      v-if="projectType === 'laravel'"
      v-model:phpVersion="phpVersion"
      v-model:laravelStarter="laravelStarter"
    />

    <WordPressOptions
      v-if="projectType === 'wordpress'"
      v-model:phpVersion="wpPhpVersion"
    />

    <NodeOptions
      v-if="['vue', 'nuxt', 'react'].includes(projectType)"
      v-model:nodeVersion="nodeVersion"
    />

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('projectNameLabel') }}</label>
      <input
        v-model="projectName"
        type="text"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="my-project"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('projectPathLabel') }}</label>
      <DirectorySelector v-model="projectPath" />
    </div>

    <button
      @click="handleCreateProject"
      :disabled="isCreating"
      class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ isCreating ? t('checking') : t('createBtn') }}
    </button>

    <StatusMessage
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProject } from '../../composables/useProject'
import { useStatus } from '../../composables/useStatus'
import ProjectTypeSelector from './ProjectTypeSelector.vue'
import LaravelOptions from './LaravelOptions.vue'
import WordPressOptions from './WordPressOptions.vue'
import NodeOptions from './NodeOptions.vue'
import DirectorySelector from '../common/DirectorySelector.vue'
import StatusMessage from '../common/StatusMessage.vue'

const { t } = useI18n()
const { createProject, isCreating } = useProject()
const status = useStatus()

const projectType = ref('laravel')
const projectName = ref('')
const projectPath = ref('')
const phpVersion = ref('8.2')
const laravelStarter = ref('none')
const wpPhpVersion = ref('8.2')
const nodeVersion = ref('18')

async function handleCreateProject() {
  if (!projectName.value || !projectPath.value) {
    status.showStatus(
      t('checking') === 'កំពុងពិនិត្យ...'
        ? 'សូមបំពេញព័ត៌មានទាំងអស់'
        : 'Please fill all fields',
      'error'
    )
    return
  }

  status.showStatus(
    t('checking') === 'កំពុងពិនិត្យ...'
      ? 'កំពុងបង្កើតគម្រោង...'
      : 'Creating project...',
    'info'
  )

  try {
    const projectData = {
      type: projectType.value,
      name: projectName.value,
      path: projectPath.value
    }

    if (projectType.value === 'laravel') {
      projectData.phpVersion = phpVersion.value
      projectData.laravelStarter = laravelStarter.value
    } else if (projectType.value === 'wordpress') {
      projectData.phpVersion = wpPhpVersion.value
    } else if (['vue', 'nuxt', 'react'].includes(projectType.value)) {
      projectData.nodeVersion = nodeVersion.value
    }

    const result = await createProject(projectData)

    status.showStatus(
      t('checking') === 'កំពុងពិនិត្យ...'
        ? `គម្រោងបានបង្កើតជោគជ័យ: ${result.path}`
        : `Project created successfully: ${result.path}`,
      'success'
    )
  } catch (error) {
    status.showStatus(
      t('checking') === 'កំពុងពិនិត្យ...'
        ? `កំហុស: ${error.message}`
        : `Error: ${error.message}`,
      'error'
    )
  }
}
</script>
