<template>
  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-green-600 dark:text-green-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-green-900 dark:text-green-100">
          {{ t('projectCreatedSuccess') }}
        </h3>
        <p class="text-sm text-green-700 dark:text-green-300">
          {{ projectPath }}
        </p>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {{ t('nextSteps') }}:
      </h4>
      <div class="space-y-2">
        <button
          v-for="(action, index) in availableActions"
          :key="index"
          class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          @click="action.handler"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              :class="action.iconBg"
            >
              <component
                :is="action.icon"
                class="h-5 w-5"
                :class="action.iconColor"
              />
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {{ action.title }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ action.description }}
              </p>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <button
      class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
      @click="$emit('close')"
    >
      {{ t('createBtn') }}
    </button>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  projectPath: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  }
})

defineEmits(['close'])

// Icon components as functional components
const CodeIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z',
    'clip-rule': 'evenodd'
  })
])

const FolderIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', { d: 'M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z' })
])

const DatabaseIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', { d: 'M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z' }),
  h('path', { d: 'M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z' }),
  h('path', { d: 'M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z' })
])

const ServerIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z',
    'clip-rule': 'evenodd'
  })
])

const ShieldIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z',
    'clip-rule': 'evenodd'
  })
])

const availableActions = computed(() => {
  const actions = []

  // Open in IDE
  actions.push({
    title: t('openInIDE'),
    description: 'Open project in VS Code',
    icon: CodeIcon,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    handler: openInIDE
  })

  // Open in File Manager
  actions.push({
    title: t('openInFileManager'),
    description: 'Browse project files',
    icon: FolderIcon,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    handler: openInFileManager
  })

  // PHP-based projects
  if (['laravel', 'wordpress'].includes(props.projectType)) {
    actions.push({
      title: t('setupDatabase'),
      description: 'Configure database connection',
      icon: DatabaseIcon,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      handler: () => openFileInIDE('.env')
    })
  }

  // Create Nginx Config
  actions.push({
    title: t('createNginxConfig'),
    description: 'Setup virtual host',
    icon: ServerIcon,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    handler: goToNginxConfig
  })

  // Generate SSL
  actions.push({
    title: t('generateSSL'),
    description: 'Enable HTTPS for development',
    icon: ShieldIcon,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    handler: goToSslGenerator
  })

  return actions
})

function openInIDE() {
  const { exec } = require('child_process')
  exec(`code "${props.projectPath}"`)
}

function openInFileManager() {
  const { exec } = require('child_process')
  const command = process.platform === 'win32' ? `explorer "${props.projectPath}"` : 
                  process.platform === 'darwin' ? `open "${props.projectPath}"` : 
                  `xdg-open "${props.projectPath}"`
  exec(command)
}

function openFileInIDE(filename) {
  const { exec } = require('child_process')
  const path = require('path')
  const filePath = path.join(props.projectPath, props.projectName, filename)
  exec(`code "${filePath}"`)
}

function goToNginxConfig() {
  router.push('/nginx')
}

function goToSslGenerator() {
  router.push('/ssl')
}
</script>
