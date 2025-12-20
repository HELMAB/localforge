<template>
  <div class="max-w-3xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('importExistingProject') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ t('importProjectDesc') }}
      </p>

      <form
        class="space-y-6"
        @submit.prevent="handleImport"
      >
        <!-- Project Folder Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('selectProjectFolder') }}
          </label>
          <div class="flex gap-2">
            <input
              v-model="projectPath"
              type="text"
              readonly
              :placeholder="t('browseBtn')"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
            <button
              type="button"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              @click="selectFolder"
            >
              {{ t('browseBtn') }}
            </button>
          </div>
        </div>

        <!-- Detected Project Info -->
        <div
          v-if="detectedProject"
          class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div class="flex items-center gap-3 mb-3">
            <img
              :src="getProjectIcon(detectedProject.type)"
              class="h-10 w-10"
              :alt="detectedProject.framework"
            >
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ t('projectDetected') }}: {{ detectedProject.framework }}
              </p>
              <p
                v-if="detectedProject.version"
                class="text-sm text-gray-600 dark:text-gray-400"
              >
                {{ t('frameworkVersion') }}: {{ detectedProject.version }}
              </p>
            </div>
            <span class="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
              {{ t('autoDetected') }}
            </span>
          </div>
        </div>

        <!-- Project Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('projectName') }}
          </label>
          <input
            v-model="projectName"
            type="text"
            :placeholder="t('projectNameLabel')"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          >
        </div>

        <!-- Nginx Configuration -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div class="flex items-center gap-2 mb-4">
            <input
              id="linkNginx"
              v-model="linkToNginx"
              type="checkbox"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            >
            <label
              for="linkNginx"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t('linkToNginx') }}
            </label>
          </div>

          <div
            v-if="linkToNginx"
            class="space-y-4 ml-6"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('nginxDomain') }}
              </label>
              <input
                v-model="nginxDomain"
                type="text"
                :placeholder="t('nginxDomainPlaceholder')"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('nginxPhpVersionLabel') }}
              </label>
              <input
                v-model="phpVersion"
                type="text"
                placeholder="8.3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div class="flex items-center gap-2">
              <input
                id="enableSsl"
                v-model="enableSsl"
                type="checkbox"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              >
              <label
                for="enableSsl"
                class="text-sm text-gray-700 dark:text-gray-300"
              >
                {{ t('enableSSL') }}
              </label>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            class="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            @click="$emit('cancel')"
          >
            {{ t('cancel') }}
          </button>
          <button
            type="submit"
            :disabled="!projectPath || !projectName || isImporting"
            class="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              v-if="isImporting"
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
            {{ isImporting ? t('importing') : t('importBtn') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProject } from '@/composables/useProject'
import { useNginx } from '@/composables/useNginx'
import { useRecentProjects } from '@/composables/useRecentProjects'
import { useToast } from '@/composables/useToast'
import laravelIcon from '@/assets/svg/laravel.svg'
import vuejsIcon from '@/assets/svg/vuejs.svg'
import nuxtjsIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'

const { t } = useI18n()
const { selectDirectory, detectProject } = useProject()
const { configureNginx } = useNginx()
const { addRecentProject } = useRecentProjects()
const toast = useToast()

const emit = defineEmits(['cancel', 'imported'])

const projectPath = ref('')
const projectName = ref('')
const detectedProject = ref(null)
const linkToNginx = ref(false)
const nginxDomain = ref('')
const phpVersion = ref('8.3')
const enableSsl = ref(false)
const isImporting = ref(false)

watch(projectPath, async (newPath) => {
  if (newPath) {
    try {
      detectedProject.value = await detectProject(newPath)
      // Auto-fill project name from path
      const pathParts = newPath.split('/')
      projectName.value = pathParts[pathParts.length - 1]
      nginxDomain.value = `${projectName.value}.local`
    } catch (error) {
      toast.showToast(t('errorDetectingProject'), 'error')
    }
  }
})

async function selectFolder() {
  try {
    const path = await selectDirectory()
    if (path) {
      projectPath.value = path
    }
  } catch (error) {
    toast.showToast(t('errorSelectingDirectory'), 'error')
  }
}

async function handleImport() {
  isImporting.value = true

  try {
    // Add to recent projects
    addRecentProject({
      name: projectName.value,
      path: projectPath.value,
      type: detectedProject.value?.type || 'unknown',
      createdAt: new Date().toISOString(),
      config: {
        phpVersion: phpVersion.value,
        frameworkVersion: detectedProject.value?.version,
      },
    })

    // Configure Nginx if requested
    if (linkToNginx.value && nginxDomain.value) {
      await configureNginx({
        domain: nginxDomain.value,
        projectPath: projectPath.value,
        projectType: detectedProject.value?.type || 'laravel',
        phpVersion: phpVersion.value,
        enableSSL: enableSsl.value,
      })
    }

    toast.showToast(t('projectImportedSuccess'), 'success')
    emit('imported')
  } catch (error) {
    toast.showToast(error.message, 'error')
  } finally {
    isImporting.value = false
  }
}

function getProjectIcon(type) {
  const icons = {
    laravel: laravelIcon,
    vue: vuejsIcon,
    nuxt: nuxtjsIcon,
    react: reactIcon,
    wordpress: wordpressIcon,
  }
  return icons[type] || laravelIcon
}
</script>
