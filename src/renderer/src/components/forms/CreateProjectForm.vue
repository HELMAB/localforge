<template>
  <div class="space-y-3">
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
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <div class="space-y-3">
        <ProjectTypeSelector v-model="projectType" />

        <LaravelOptions
          v-if="projectType === 'laravel'"
          v-model:laravel-version="laravelVersion"
          v-model:php-version="phpVersion"
          v-model:laravel-starter="laravelStarter"
          :validation-error="validationErrors.phpVersion"
        />

        <WordPressOptions
          v-if="projectType === 'wordpress'"
          v-model:php-version="wpPhpVersion"
          :validation-error="validationErrors.phpVersion"
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
          :validation-error="validationErrors.nodeVersion"
        />

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
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-xs font-medium mb-1.5 dark:text-gray-300">
              {{ t('projectNameLabel') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="projectName"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm',
                validationErrors.projectName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500',
                'dark:bg-gray-700 dark:text-white',
              ]"
              :placeholder="locale === 'km' ? 'ឈ្មោះគម្រោងរបស់អ្នក' : 'my-awesome-project'"
              @blur="validateProjectName"
            >
            <div
              v-if="validationErrors.projectName"
              class="flex items-start gap-1.5 mt-1.5 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="text-red-700 dark:text-red-300 text-xs leading-tight">
                {{ validationErrors.projectName }}
              </p>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5 dark:text-gray-300">
              {{ t('projectPathLabel') }} <span class="text-red-500">*</span>
            </label>
            <DirectorySelector v-model="projectPath" />
            <div
              v-if="validationErrors.path"
              class="flex items-start gap-1.5 mt-1.5 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="text-red-700 dark:text-red-300 text-xs leading-tight">
                {{ validationErrors.path }}
              </p>
            </div>
          </div>
        </div>

        <button
          :disabled="isCreating"
          class="w-full px-4 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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
const laravelVersion = ref('12')
const phpVersion = ref(settings.value.defaultPhpVersion || '8.2')
const laravelStarter = ref('none')
const wpPhpVersion = ref(settings.value.defaultPhpVersion || '8.2')
const nodeVersion = ref(settings.value.defaultNodeVersion || '22')
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

// Set Node.js 22 as default for Vue, React, and Nuxt projects
watch(projectType, (newType) => {
  if (['vue', 'react', 'nuxt'].includes(newType)) {
    const currentMajor = parseInt((nodeVersion.value || '').split('.')[0])
    if (!currentMajor || currentMajor < 22) {
      nodeVersion.value = '22'
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

  // Validate PHP version is required for Laravel and WordPress
  if (['laravel', 'wordpress'].includes(projectType.value)) {
    const phpVer = projectType.value === 'laravel' ? phpVersion.value : wpPhpVersion.value
    if (!phpVer) {
      validationErrors.value.phpVersion = t('checking') === 'កំពុងពិនិត្យ...'
        ? 'សូមជ្រើសរើសកំណែ PHP'
        : 'Please select a PHP version'
    } else {
      delete validationErrors.value.phpVersion
    }
  }

  // Validate Node.js version is required for Vue, Nuxt, and React
  if (['vue', 'nuxt', 'react'].includes(projectType.value)) {
    if (!nodeVersion.value) {
      validationErrors.value.nodeVersion = t('checking') === 'កំពុងពិនិត្យ...'
        ? 'សូមជ្រើសរើសកំណែ Node.js'
        : 'Please select a Node.js version'
    } else {
      delete validationErrors.value.nodeVersion
    }
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
    laravelVersion.value = '12'
    phpVersion.value = settings.value.defaultPhpVersion || '8.2'
    laravelStarter.value = 'none'
    wpPhpVersion.value = settings.value.defaultPhpVersion || '8.2'
    nodeVersion.value = settings.value.defaultNodeVersion || '22'
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
