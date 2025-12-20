<template>
  <div class="space-y-4">
    <!-- Post Creation Success -->
    <PostCreationActions
      v-if="showPostCreation"
      :project-path="createdProjectPath"
      :project-type="projectType"
      :project-name="projectName"
      @close="showPostCreation = false"
    />

    <!-- Project Form -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          {{ t('createTitle') }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ t('createSubtitle') }}
        </p>
      </div>

      <div class="space-y-4">
        <ProjectTypeSelector v-model="projectType" />

        <LaravelOptions
          v-if="projectType === 'laravel'"
          v-model:laravel-version="laravelVersion"
          v-model:php-version="phpVersion"
          v-model:laravel-starter="laravelStarter"
        />

        <WordPressOptions
          v-if="projectType === 'wordpress'"
          v-model:php-version="wpPhpVersion"
        />

        <VueOptions
          v-if="projectType === 'vue'"
          v-model:typescript="vueOptions.typescript"
          v-model:jsx="vueOptions.jsx"
          v-model:router="vueOptions.router"
          v-model:pinia="vueOptions.pinia"
          v-model:vitest="vueOptions.vitest"
          v-model:playwright="vueOptions.playwright"
          v-model:eslint="vueOptions.eslint"
          v-model:prettier="vueOptions.prettier"
        />

        <NuxtOptions
          v-if="projectType === 'nuxt'"
          v-model:nuxt-template="nuxtTemplate"
        />

        <NodeOptions
          v-if="['vue', 'nuxt', 'react'].includes(projectType)"
          v-model:node-version="nodeVersion"
          :project-type="projectType"
        />

        <!-- Section Divider -->
        <div class="relative py-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-600" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ t('projectDetails') }}
            </span>
          </div>
        </div>

        <!-- Project Preview -->
        <ProjectPreview
          v-if="projectName && projectPath"
          :project-type="projectType"
          :project-name="projectName"
          :php-version="projectType === 'laravel' ? phpVersion : wpPhpVersion"
          :node-version="nodeVersion"
          :laravel-version="laravelVersion"
          :laravel-starter="laravelStarter"
          :nuxt-template="nuxtTemplate"
          :vue-options="vueOptions"
        />

        <!-- 1-Column Grid Layout -->
        <div class="grid grid-cols-1 gap-4">
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
                'dark:bg-gray-700 dark:text-white',
              ]"
              :placeholder="locale === 'km' ? 'ឈ្មោះគម្រោងរបស់អ្នក' : 'my-awesome-project'"
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
        </div>

        <button
          :disabled="isCreating"
          class="w-full px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="handleCreateProject"
        >
          {{ isCreating ? t('checking') : t('createBtn') }}
        </button>

        <AlertNotification
          :message="status.message.value"
          :type="status.type.value"
          :visible="status.visible.value"
          @close="status.hideStatus"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProject } from '../../composables/useProject'
import { useStatus } from '../../composables/useStatus'
import { useSettings } from '../../composables/useSettings'
import { useTools } from '../../composables/useTools'
import { useRecentProjects } from '../../composables/useRecentProjects'
import { useToast } from '../../composables/useToast'
import { projectNameSchema, pathSchema, validateField } from '../../utils/validation'
import ProjectTypeSelector from './ProjectTypeSelector.vue'
import LaravelOptions from './LaravelOptions.vue'
import WordPressOptions from './WordPressOptions.vue'
import VueOptions from './VueOptions.vue'
import NuxtOptions from './NuxtOptions.vue'
import NodeOptions from './NodeOptions.vue'
import DirectorySelector from '../common/DirectorySelector.vue'
import AlertNotification from '../common/AlertNotification.vue'
import ProjectPreview from './ProjectPreview.vue'
import PostCreationActions from './PostCreationActions.vue'

const { t, locale } = useI18n()
const { createProject, isCreating } = useProject()
const status = useStatus()
const toast = useToast()
const { settings } = useSettings()
const { installedTools, checkInstalledTools } = useTools()
const progress = inject('progress', null)
const errorModal = inject('errorModal', null)
const { addRecentProject } = useRecentProjects()

const projectType = ref('laravel')
const projectName = ref('')
const projectPath = ref(settings.value.defaultProjectPath || '')
const laravelVersion = ref('11')
const phpVersion = ref(settings.value.defaultPhpVersion || '8.2')
const laravelStarter = ref('none')
const wpPhpVersion = ref(settings.value.defaultPhpVersion || '8.2')
const nodeVersion = ref(settings.value.defaultNodeVersion || '18')
const vueOptions = ref({
  typescript: false,
  jsx: false,
  router: false,
  pinia: false,
  vitest: false,
  playwright: false,
  eslint: false,
  prettier: false,
})
const nuxtTemplate = ref('minimal')
const validationErrors = ref({})
const showPostCreation = ref(false)
const createdProjectPath = ref('')

// Set Node.js 20 as default for Nuxt projects
watch(projectType, (newType) => {
  if (newType === 'nuxt') {
    const currentMajor = parseInt((nodeVersion.value || '').split('.')[0])
    if (!currentMajor || currentMajor < 20) {
      nodeVersion.value = '20'
    }
  }
})

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

  // Validate Node.js version for Node-based projects
  if (['vue', 'nuxt', 'react'].includes(projectType.value) && nodeVersion.value) {
    await checkInstalledTools()
    const availableVersions = installedTools.value.node.versions || []
    if (!availableVersions.includes(nodeVersion.value)) {
      status.showStatus(
        t('checking') === 'កំពុងពិនិត្យ...'
          ? `កំណែ Node.js ${nodeVersion.value} មិនត្រូវបានដំឡើង។ សូមដំឡើងវាជាមុនសិននៅក្នុងផ្ទាំងគ្រប់គ្រងសេវាកម្ម។`
          : `Node.js version ${nodeVersion.value} is not installed. Please install it first in the Manage Services tab.`,
        'error'
      )
      return
    }
  }

  // Validate PHP version for PHP-based projects
  if (['laravel', 'wordpress'].includes(projectType.value)) {
    await checkInstalledTools()
    const phpVer = projectType.value === 'laravel' ? phpVersion.value : wpPhpVersion.value
    const availablePhpVersions = installedTools.value.php.versions || []
    if (phpVer && !availablePhpVersions.includes(phpVer)) {
      status.showStatus(
        t('checking') === 'កំពុងពិនិត្យ...'
          ? `កំណែ PHP ${phpVer} មិនត្រូវបានដំឡើង។ សូមដំឡើងវាជាមុនសិននៅក្នុងផ្ទាំងគ្រប់គ្រងសេវាកម្ម។`
          : `PHP version ${phpVer} is not installed. Please install it first in the Manage Services tab.`,
        'error'
      )
      return
    }
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
      t('checking') === 'កំពុងពិនិត្យ...' ? 'កំពុងបង្កើតគម្រោង...' : 'Creating project...'
    )
  }

  try {
    const projectData = {
      type: projectType.value,
      name: projectName.value,
      path: projectPath.value,
    }

    if (projectType.value === 'laravel') {
      projectData.laravelVersion = laravelVersion.value
      projectData.phpVersion = phpVersion.value
      projectData.laravelStarter = laravelStarter.value
    } else if (projectType.value === 'wordpress') {
      projectData.phpVersion = wpPhpVersion.value
    } else if (projectType.value === 'vue') {
      projectData.nodeVersion = nodeVersion.value
      // Convert reactive object to plain object for IPC
      projectData.vueOptions = JSON.parse(JSON.stringify(vueOptions.value))
    } else if (projectType.value === 'nuxt') {
      projectData.nodeVersion = nodeVersion.value
      projectData.nuxtTemplate = nuxtTemplate.value
    } else if (projectType.value === 'react') {
      projectData.nodeVersion = nodeVersion.value
    }

    const result = await createProject(projectData)

    if (progress) {
      progress.completeProgress(t('checking') === 'កំពុងពិនិត្យ...' ? 'បានបញ្ចប់!' : 'Completed!')
    }

    // Add to recent projects with full path from result
    const projectDataWithFullPath = {
      ...projectData,
      fullPath: result.path,
    }
    addRecentProject(projectDataWithFullPath)

    // Show post-creation actions
    createdProjectPath.value = result.path
    showPostCreation.value = true

    toast.success(
      t('checking') === 'កំពុងពិនិត្យ...'
        ? `គម្រោងបានបង្កើតជោគជ័យ: ${projectName.value}`
        : `Project created successfully: ${projectName.value}`
    )

    // Reset form except project path
    projectName.value = ''
    projectType.value = 'laravel'
    laravelVersion.value = '11'
    phpVersion.value = settings.value.defaultPhpVersion || '8.2'
    laravelStarter.value = 'none'
    wpPhpVersion.value = settings.value.defaultPhpVersion || '8.2'
    nodeVersion.value = settings.value.defaultNodeVersion || '18'
    vueOptions.value = {
      typescript: false,
      jsx: false,
      router: false,
      pinia: false,
      vitest: false,
      playwright: false,
      eslint: false,
      prettier: false,
    }
    nuxtTemplate.value = 'minimal'
    validationErrors.value = {}
  } catch (error) {
    if (progress) {
      progress.failProgress(t('checking') === 'កំពុងពិនិត្យ...' ? 'បរាជ័យ' : 'Failed')
    }

    // Show error in modal with detailed information
    if (errorModal) {
      errorModal.showError(error, {
        title:
          t('checking') === 'កំពុងពិនិត្យ...'
            ? 'បរាជ័យក្នុងការបង្កើតគម្រោង'
            : 'Failed to Create Project',
        subtitle:
          t('checking') === 'កំពុងពិនិត្យ...'
            ? 'មានកំហុសកើតឡើងពេលបង្កើតគម្រោងរបស់អ្នក'
            : 'An error occurred while creating your project',
        suggestions: [
          t('checking') === 'កំពុងពិនិត្យ...'
            ? 'ពិនិត្យមើលថាអ្នកមានសិទ្ធិគ្រប់គ្រាន់សម្រាប់បង្កើតឯកសារនៅក្នុងថតនោះ'
            : 'Check if you have sufficient permissions to create files in that directory',
          t('checking') === 'កំពុងពិនិត្យ...'
            ? 'ត្រូវប្រាកដថា Composer, Node.js, ឬសេវាកម្មចាំបាច់ផ្សេងទៀតត្រូវបានដំឡើង'
            : 'Ensure Composer, Node.js, or other required services are installed',
          t('checking') === 'កំពុងពិនិត្យ...'
            ? 'ពិនិត្យមើលការភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក ប្រសិនបើគម្រោងត្រូវការទាញយក dependencies'
            : 'Check your internet connection if the project needs to download dependencies',
        ],
        context: {
          'Project Type': projectType.value,
          'Project Name': projectName.value,
          'Project Path': projectPath.value,
          ...(projectType.value === 'laravel' && {
            'Laravel Version': laravelVersion.value,
            'PHP Version': phpVersion.value,
          }),
          ...(projectType.value === 'vue' && { 'Node Version': nodeVersion.value }),
          ...(projectType.value === 'nuxt' && {
            'Nuxt Template': nuxtTemplate.value,
            'Node Version': nodeVersion.value,
          }),
          ...(projectType.value === 'react' && { 'Node Version': nodeVersion.value }),
          ...(projectType.value === 'wordpress' && { 'PHP Version': wpPhpVersion.value }),
        },
        onRetry: handleCreateProject,
      })
    }
  }
}
</script>
