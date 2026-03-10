<template>
  <div class="max-w-3xl mx-auto">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('importExistingProject') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ t('importProjectDesc') }}
      </p>

      <form class="space-y-6" @submit.prevent="handleImport">
        <!-- Project Folder Selection -->
        <div>
          <Label class="block mb-2">{{ t('selectProjectFolder') }}</Label>
          <div class="flex gap-2">
            <Input
              v-model="projectPath"
              type="text"
              readonly
              :placeholder="t('browseBtn')"
              class="flex-1 bg-gray-50 dark:bg-gray-700"
            />
            <Button type="button" @click="selectFolder">
              {{ t('browseBtn') }}
            </Button>
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
            />
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ t('projectDetected') }}: {{ detectedProject.framework }}
              </p>
              <p v-if="detectedProject.version" class="text-sm text-gray-600 dark:text-gray-400">
                {{ t('frameworkVersion') }}: {{ detectedProject.version }}
              </p>
            </div>
            <span
              class="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full"
            >
              {{ t('autoDetected') }}
            </span>
          </div>
        </div>

        <!-- Project Name -->
        <div>
          <Label class="block mb-2">{{ t('projectName') }}</Label>
          <Input v-model="projectName" type="text" :placeholder="t('projectNameLabel')" required />
        </div>

        <!-- Nginx Configuration -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div class="flex items-center gap-2 mb-4">
            <Checkbox
              id="linkNginx"
              :model-value="linkToNginx"
              @update:model-value="(val) => (linkToNginx = val)"
            />
            <Label for="linkNginx">{{ t('linkToNginx') }}</Label>
          </div>

          <div v-if="linkToNginx" class="space-y-4 ml-6">
            <div>
              <Label class="block mb-2">{{ t('nginxDomain') }}</Label>
              <Input v-model="nginxDomain" type="text" :placeholder="t('nginxDomainPlaceholder')" />
            </div>

            <div>
              <Label class="block mb-2">{{ t('nginxPhpVersionLabel') }}</Label>
              <Input v-model="phpVersion" type="text" placeholder="8.3" />
            </div>

            <div class="flex items-center gap-2">
              <Checkbox
                id="enableSsl"
                :model-value="enableSsl"
                @update:model-value="(val) => (enableSsl = val)"
              />
              <Label for="enableSsl">{{ t('enableSSL') }}</Label>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" @click="$emit('cancel')">
            {{ t('cancel') }}
          </Button>
          <Button type="submit" :disabled="!projectPath || !projectName || isImporting">
            <svg
              v-if="isImporting"
              class="animate-spin h-4 w-4 mr-2"
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
          </Button>
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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

const projectIcons = {
  laravel: laravelIcon,
  vue: vuejsIcon,
  nuxt: nuxtjsIcon,
  react: reactIcon,
  wordpress: wordpressIcon,
}

watch(projectPath, async (newPath) => {
  if (newPath) {
    try {
      detectedProject.value = await detectProject(newPath)
      const pathParts = newPath.split('/')
      projectName.value = pathParts[pathParts.length - 1]
      nginxDomain.value = `${projectName.value}.local`
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error detecting project:', err)
      toast.error(t('errorDetectingProject'))
    }
  }
})

async function selectFolder() {
  try {
    const path = await selectDirectory()
    if (path) {
      projectPath.value = path
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error selecting directory:', err)
    toast.error(t('errorSelectingDirectory'))
  }
}

async function handleImport() {
  isImporting.value = true

  try {
    addRecentProject({
      name: projectName.value,
      fullPath: projectPath.value,
      type: detectedProject.value?.type || 'unknown',
      createdAt: new Date().toISOString(),
      config: {
        phpVersion: phpVersion.value,
        frameworkVersion: detectedProject.value?.version,
      },
    })

    if (linkToNginx.value && nginxDomain.value) {
      await configureNginx({
        domain: nginxDomain.value,
        projectPath: projectPath.value,
        projectType: detectedProject.value?.type || 'laravel',
        phpVersion: phpVersion.value,
        enableSSL: enableSsl.value,
      })
    }

    toast.success(t('projectImportedSuccess'))
    emit('imported')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error importing project:', err)
    toast.error(err.message || err.toString() || t('errorImportingProject'))
  } finally {
    isImporting.value = false
  }
}

function getProjectIcon(type) {
  return projectIcons[type] || laravelIcon
}
</script>
