<template>
  <div class="space-y-4">
    <ProjectTypeSelector v-model="projectType" />

    <LaravelOptions
      v-if="projectType === 'laravel'"
      v-model:php-version="phpVersion"
      v-model:laravel-starter="laravelStarter"
    />

    <WordPressOptions
      v-if="projectType === 'wordpress'"
      v-model:php-version="wpPhpVersion"
    />

    <NodeOptions
      v-if="['vue', 'nuxt', 'react'].includes(projectType)"
      v-model:node-version="nodeVersion"
    />

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('projectNameLabel') }} <span class="text-red-500">*</span>
      </label>
      <input
        v-model="projectName"
        type="text"
        :class="[
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
          validationErrors.projectName 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500',
          'dark:bg-gray-700 dark:text-white'
        ]"
        placeholder="my-project"
        @blur="validateProjectName"
      >
      <p
        v-if="validationErrors.projectName"
        class="text-red-500 text-sm mt-1"
      >
        {{ validationErrors.projectName }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('projectPathLabel') }} <span class="text-red-500">*</span>
      </label>
      <DirectorySelector v-model="projectPath" />
      <p
        v-if="validationErrors.path"
        class="text-red-500 text-sm mt-1"
      >
        {{ validationErrors.path }}
      </p>
    </div>

    <button
      :disabled="isCreating"
      class="w-full px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      @click="handleCreateProject"
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
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProject } from '../../composables/useProject'
import { useStatus } from '../../composables/useStatus'
import { useSettings } from '../../composables/useSettings'
import { projectNameSchema, pathSchema, validateField } from '../../utils/validation'
import ProjectTypeSelector from './ProjectTypeSelector.vue'
import LaravelOptions from './LaravelOptions.vue'
import WordPressOptions from './WordPressOptions.vue'
import NodeOptions from './NodeOptions.vue'
import DirectorySelector from '../common/DirectorySelector.vue'
import StatusMessage from '../common/StatusMessage.vue'

const { t } = useI18n()
const { createProject, isCreating } = useProject()
const status = useStatus()
const { settings } = useSettings()
const progress = inject('progress', null)

const projectType = ref('laravel')
const projectName = ref('')
const projectPath = ref(settings.value.defaultProjectPath || '')
const phpVersion = ref(settings.value.defaultPhpVersion || '8.2')
const laravelStarter = ref('none')
const wpPhpVersion = ref(settings.value.defaultPhpVersion || '8.2')
const nodeVersion = ref(settings.value.defaultNodeVersion || '18')
const validationErrors = ref({})

const validateProjectName = () => {
  const result = validateField(projectNameSchema, 'projectName', projectName.value)
  if (!result.valid) {
    validationErrors.value.projectName = result.error
  } else {
    delete validationErrors.value.projectName
  }
}

async function handleCreateProject() {
  validateProjectName()
  
  const pathResult = validateField(pathSchema, 'path', projectPath.value)
  if (!pathResult.valid) {
    validationErrors.value.path = pathResult.error
  } else {
    delete validationErrors.value.path
  }

  if (Object.keys(validationErrors.value).length > 0) {
    status.showStatus(
      t('checking') === 'កំពុងពិនិត្យ...'
        ? 'សូមពិនិត្យកំហុសនៅក្នុងទម្រង់'
        : 'Please fix validation errors',
      'error'
    )
    return
  }

  if (progress) {
    progress.startProgress(
      t('checking') === 'កំពុងពិនិត្យ...'
        ? 'កំពុងបង្កើតគម្រោង...'
        : 'Creating project...'
    )
  }

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

    if (progress) {
      progress.completeProgress(
        t('checking') === 'កំពុងពិនិត្យ...'
          ? 'បានបញ្ចប់!'
          : 'Completed!'
      )
    }

    status.showStatus(
      t('checking') === 'កំពុងពិនិត្យ...'
        ? `គម្រោងបានបង្កើតជោគជ័យ: ${result.path}`
        : `Project created successfully: ${result.path}`,
      'success'
    )
  } catch (error) {
    if (progress) {
      progress.failProgress(
        t('checking') === 'កំពុងពិនិត្យ...'
          ? 'បរាជ័យ'
          : 'Failed'
      )
    }

    status.showStatus(
      t('checking') === 'កំពុងពិនិត្យ...'
        ? `កំហុស: ${error.message}`
        : `Error: ${error.message}`,
      'error'
    )
  }
}
</script>
