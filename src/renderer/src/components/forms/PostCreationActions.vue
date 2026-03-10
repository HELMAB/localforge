<template>
  <div
    class="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 p-6"
  >
    <div class="flex items-center gap-3 mb-4">
      <div
        class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
      >
        <CheckCircle2 class="h-6 w-6 text-green-600 dark:text-green-400" />
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
        <Button
          v-for="(action, index) in availableActions"
          :key="index"
          variant="outline"
          class="w-full flex items-center justify-between p-3 h-auto hover:border-green-300 dark:hover:border-green-600 hover:bg-white dark:hover:bg-gray-800 group"
          @click="action.handler"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              :class="action.iconBg"
            >
              <component :is="action.icon" class="h-5 w-5" :class="action.iconColor" />
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
          <ChevronRight
            class="h-5 w-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"
          />
        </Button>
      </div>
    </div>

    <Button class="w-full" @click="$emit('close')">
      {{ t('createBtn') }}
    </Button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { CheckCircle2, ChevronRight, Code2, Folder, Server, Lock } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  projectPath: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
})

defineEmits(['close'])

const availableActions = computed(() => {
  const actions = []

  // Open in IDE
  actions.push({
    title: t('openInIDE'),
    description: 'Open project in VS Code',
    icon: Code2,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    handler: openInIDE,
  })

  // Open in File Manager
  actions.push({
    title: t('openInFileManager'),
    description: 'Browse project files',
    icon: Folder,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    handler: openInFileManager,
  })

  // Create Nginx Config
  actions.push({
    title: t('createNginxConfig'),
    description: 'Setup virtual host',
    icon: Server,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    handler: goToNginxConfig,
  })

  // Generate SSL
  actions.push({
    title: t('generateSSL'),
    description: 'Enable HTTPS for development',
    icon: Lock,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    handler: goToSslGenerator,
  })

  return actions
})

function openInIDE() {
  const { exec } = require('child_process')
  exec(`code "${props.projectPath}"`)
}

function openInFileManager() {
  const { exec } = require('child_process')
  const command =
    process.platform === 'win32'
      ? `explorer "${props.projectPath}"`
      : process.platform === 'darwin'
        ? `open "${props.projectPath}"`
        : `xdg-open "${props.projectPath}"`
  exec(command)
}

function goToNginxConfig() {
  router.push('/virtual-hosts')
}

function goToSslGenerator() {
  router.push('/services')
}
</script>
