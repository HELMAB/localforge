<template>
  <div class="max-w-5xl mx-auto">
    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <!-- Step Circle -->
          <div class="relative flex flex-col items-center">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300"
              :class="[
                currentStep > index
                  ? 'bg-green-500 text-white'
                  : currentStep === index
                    ? 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/50'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
              ]"
            >
              <svg
                v-if="currentStep > index"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              class="absolute -bottom-6 text-xs font-medium whitespace-nowrap"
              :class="
                currentStep >= index
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              "
            >
              {{ t(step.title) }}
            </span>
          </div>

          <!-- Connector Line -->
          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-1 mx-4 transition-colors duration-300"
            :class="
              currentStep > index
                ? 'bg-green-500'
                : 'bg-gray-200 dark:bg-gray-700'
            "
          />
        </div>
      </div>
    </div>

    <!-- Wizard Content -->
    <div class="mt-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
      <!-- Step 1: Project Type -->
      <div v-if="currentStep === 0">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('selectProjectType') }}
        </h3>
        <ProjectTypeSelector v-model="formData.projectType" />
      </div>

      <!-- Step 2: Configuration -->
      <div v-if="currentStep === 1">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('configureProject') }}
        </h3>
        <div class="space-y-6">
          <LaravelOptions
            v-if="formData.projectType === 'laravel'"
            v-model:laravel-version="formData.laravelVersion"
            v-model:php-version="formData.phpVersion"
            v-model:laravel-starter="formData.laravelStarter"
          />

          <WordPressOptions
            v-if="formData.projectType === 'wordpress'"
            v-model:php-version="formData.wpPhpVersion"
          />

          <VueOptions
            v-if="formData.projectType === 'vue'"
            v-model:typescript="formData.vueOptions.typescript"
            v-model:jsx="formData.vueOptions.jsx"
            v-model:router="formData.vueOptions.router"
            v-model:pinia="formData.vueOptions.pinia"
            v-model:vitest="formData.vueOptions.vitest"
            v-model:playwright="formData.vueOptions.playwright"
            v-model:eslint="formData.vueOptions.eslint"
            v-model:prettier="formData.vueOptions.prettier"
          />

          <NuxtOptions
            v-if="formData.projectType === 'nuxt'"
            v-model:nuxt-template="formData.nuxtTemplate"
          />

          <NodeOptions
            v-if="['vue', 'nuxt', 'react'].includes(formData.projectType)"
            v-model:node-version="formData.nodeVersion"
            :project-type="formData.projectType"
          />
        </div>
      </div>

      <!-- Step 3: Project Details -->
      <div v-if="currentStep === 2">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('projectDetails') }}
        </h3>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              {{ t('projectNameLabel') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.projectName"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="t('projectNameLabel')"
            >
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              {{ t('projectPathLabel') }} <span class="text-red-500">*</span>
            </label>
            <DirectorySelector v-model="formData.projectPath" />
          </div>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div v-if="currentStep === 3">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('reviewAndCreate') }}
        </h3>
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('projectType') }}
              </p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t(getProjectTypeLabel(formData.projectType)) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('projectName') }}
              </p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ formData.projectName }}
              </p>
            </div>
            <div v-if="formData.phpVersion || formData.wpPhpVersion">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('phpVersion') }}
              </p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ formData.phpVersion || formData.wpPhpVersion }}
              </p>
            </div>
            <div v-if="formData.nodeVersion">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Node.js
              </p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ formData.nodeVersion }}
              </p>
            </div>
          </div>
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {{ t('projectPath') }}
            </p>
            <code class="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-2 rounded block">
              {{ formData.projectPath }}/{{ formData.projectName }}
            </code>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          v-if="currentStep > 0"
          class="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          @click="previousStep"
        >
          {{ t('previous') }}
        </button>
        <div v-else />

        <div class="flex items-center gap-3">
          <button
            class="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            @click="$emit('cancel')"
          >
            {{ t('cancel') }}
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            class="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            :disabled="!canProceed"
            @click="nextStep"
          >
            {{ t('next') }}
          </button>
          <button
            v-else
            class="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            :disabled="isCreating || !canCreate"
            @click="createProject"
          >
            <svg
              v-if="isCreating"
              class="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ isCreating ? t('creating') : t('createProject') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProject } from '@/composables/useProject'
import { useRecentProjects } from '@/composables/useRecentProjects'
import { useToast } from '@/composables/useToast'
import ProjectTypeSelector from './ProjectTypeSelector.vue'
import LaravelOptions from './LaravelOptions.vue'
import WordPressOptions from './WordPressOptions.vue'
import VueOptions from './VueOptions.vue'
import NuxtOptions from './NuxtOptions.vue'
import NodeOptions from './NodeOptions.vue'
import DirectorySelector from '../common/DirectorySelector.vue'

const { t } = useI18n()
const { createProject: createProjectApi, isCreating } = useProject()
const { addRecentProject } = useRecentProjects()
const toast = useToast()

const emit = defineEmits(['cancel', 'created'])

const currentStep = ref(0)

const steps = [
  { title: 'projectType', key: 'type' },
  { title: 'configuration', key: 'config' },
  { title: 'details', key: 'details' },
  { title: 'review', key: 'review' },
]

const formData = ref({
  projectType: 'laravel',
  projectName: '',
  projectPath: '',
  laravelVersion: '11',
  phpVersion: '8.3',
  laravelStarter: 'none',
  wpPhpVersion: '8.3',
  nodeVersion: 'lts',
  nuxtTemplate: 'default',
  vueOptions: {
    typescript: false,
    jsx: false,
    router: false,
    pinia: false,
    vitest: false,
    playwright: false,
    eslint: false,
    prettier: false,
  },
})

const canProceed = computed(() => {
  if (currentStep.value === 0) return formData.value.projectType
  if (currentStep.value === 1) return true
  if (currentStep.value === 2) {
    return formData.value.projectName && formData.value.projectPath
  }
  return true
})

const canCreate = computed(() => {
  return formData.value.projectName && formData.value.projectPath
})

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function createProject() {
  try {
    const result = await createProjectApi({
      type: formData.value.projectType,
      name: formData.value.projectName,
      path: formData.value.projectPath,
      phpVersion: formData.value.phpVersion || formData.value.wpPhpVersion,
      nodeVersion: formData.value.nodeVersion,
      laravelVersion: formData.value.laravelVersion,
      laravelStarter: formData.value.laravelStarter,
      nuxtTemplate: formData.value.nuxtTemplate,
      vueOptions: formData.value.vueOptions,
    })

    addRecentProject({
      name: formData.value.projectName,
      fullPath: result.fullPath,
      path: formData.value.projectPath,
      type: formData.value.projectType,
      config: {
        phpVersion: formData.value.phpVersion || formData.value.wpPhpVersion,
        nodeVersion: formData.value.nodeVersion,
        laravelVersion: formData.value.laravelVersion,
      },
    })

    toast.showToast(t('projectCreatedSuccess'), 'success')
    emit('created')
  } catch (error) {
    toast.showToast(error.message, 'error')
  }
}

function getProjectTypeLabel(type) {
  const labels = {
    laravel: 'projectTypeLaravel',
    vue: 'projectTypeVue',
    nuxt: 'projectTypeNuxt',
    react: 'projectTypeReact',
    wordpress: 'projectTypeWordpress',
  }
  return labels[type] || type
}
</script>
