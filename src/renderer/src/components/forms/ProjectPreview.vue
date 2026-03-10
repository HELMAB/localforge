<template>
  <div
    class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-4 mb-4"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
        <Eye class="h-5 w-5" />
        {{ t('projectPreview') }}
      </h3>
      <div class="flex items-center gap-3 text-xs">
        <div class="flex items-center gap-1 text-blue-700 dark:text-blue-300">
          <Clock class="h-4 w-4" />
          <span>{{ t('estimatedTime') }}: {{ estimatedTime }} {{ t('minutes') }}</span>
        </div>
        <div class="flex items-center gap-1 text-blue-700 dark:text-blue-300">
          <ArrowDown class="h-4 w-4" />
          <span>{{ t('estimatedSize') }}: ~{{ estimatedSize }} MB</span>
        </div>
      </div>
    </div>

    <!-- What will be installed -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
      <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {{ t('whatWillBeInstalled') }}:
      </h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="item in installItems"
          :key="item"
          class="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center gap-1"
        >
          <CheckCircle2 class="h-3 w-3" />
          {{ item }}
        </span>
      </div>
    </div>

    <!-- Compatibility Check -->
    <div
      v-if="compatibilityStatus"
      class="flex items-start gap-2 p-2 rounded"
      :class="compatibilityClass"
    >
      <CheckCircle2 v-if="compatibilityStatus === 'recommended'" class="h-5 w-5 flex-shrink-0" />
      <Info v-else-if="compatibilityStatus === 'compatible'" class="h-5 w-5 flex-shrink-0" />
      <TriangleAlert v-else class="h-5 w-5 flex-shrink-0" />
      <div class="text-xs">
        <p class="font-semibold">
          {{ compatibilityTitle }}
        </p>
        <p class="mt-0.5">
          {{ compatibilityMessage }}
        </p>
      </div>
    </div>

    <!-- Command Preview (collapsible) -->
    <div v-if="command" class="mt-3">
      <Button
        variant="link"
        class="text-xs text-blue-600 dark:text-blue-400 h-auto p-0 flex items-center gap-1"
        @click="showCommand = !showCommand"
      >
        <ChevronRight class="h-4 w-4 transition-transform" :class="{ 'rotate-90': showCommand }" />
        {{ showCommand ? t('hideTerminalOutput') : t('showTerminalOutput') }}
      </Button>
      <div
        v-if="showCommand"
        class="mt-2 bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto relative"
      >
        <Button
          variant="ghost"
          size="icon"
          class="absolute top-2 right-2 h-6 w-6 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
          :title="t('copyCommand')"
          @click="copyCommand"
        >
          <Copy class="h-4 w-4" />
        </Button>
        <pre class="whitespace-pre-wrap break-all">{{ command }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../composables/useStatus'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Clock,
  ArrowDown,
  CheckCircle2,
  Info,
  TriangleAlert,
  ChevronRight,
  Copy,
} from 'lucide-vue-next'

const { t } = useI18n()
const status = useStatus()

const props = defineProps({
  projectType: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  phpVersion: {
    type: String,
    default: '',
  },
  nodeVersion: {
    type: String,
    default: '',
  },
  laravelVersion: {
    type: String,
    default: '',
  },
  laravelStarter: {
    type: String,
    default: '',
  },
  nuxtTemplate: {
    type: String,
    default: '',
  },
  vueOptions: {
    type: Object,
    default: () => ({}),
  },
})

const showCommand = ref(false)

const installItems = computed(() => {
  const items = []

  if (props.projectType === 'laravel') {
    items.push(`Laravel ${props.laravelVersion}`)
    if (props.phpVersion) items.push(`PHP ${props.phpVersion}`)
    items.push('Composer dependencies')
    if (props.laravelStarter && props.laravelStarter !== 'none') {
      items.push(props.laravelStarter.replace(/-/g, ' '))
    }
  } else if (props.projectType === 'vue') {
    items.push('Vue 3')
    if (props.nodeVersion) items.push(`Node.js ${props.nodeVersion}`)
    items.push('npm dependencies')
    if (props.vueOptions) {
      if (props.vueOptions.typescript) items.push('TypeScript')
      if (props.vueOptions.router) items.push('Vue Router')
      if (props.vueOptions.pinia) items.push('Pinia')
    }
  } else if (props.projectType === 'nuxt') {
    items.push('Nuxt 4 (latest)')
    if (props.nuxtTemplate) items.push(`Template: ${props.nuxtTemplate}`)
    if (props.nodeVersion) items.push(`Node.js ${props.nodeVersion}`)
    items.push('npm dependencies')
  } else if (props.projectType === 'react') {
    items.push('React')
    if (props.nodeVersion) items.push(`Node.js ${props.nodeVersion}`)
    items.push('npm dependencies')
  } else if (props.projectType === 'wordpress') {
    items.push('WordPress Latest')
    if (props.phpVersion) items.push(`PHP ${props.phpVersion}`)
  }

  return items
})

const estimatedTime = computed(() => {
  if (props.projectType === 'laravel') return '2-5'
  if (props.projectType === 'vue') return '1-3'
  if (props.projectType === 'nuxt') return '1-3'
  if (props.projectType === 'react') return '1-2'
  if (props.projectType === 'wordpress') return '1'
  return '2-3'
})

const estimatedSize = computed(() => {
  if (props.projectType === 'laravel') return '100-200'
  if (props.projectType === 'vue') return '150-300'
  if (props.projectType === 'nuxt') return '200-400'
  if (props.projectType === 'react') return '200-400'
  if (props.projectType === 'wordpress') return '50'
  return '100'
})

const compatibilityStatus = computed(() => {
  if (props.projectType === 'laravel' && props.laravelVersion && props.phpVersion) {
    const phpVer = parseFloat(props.phpVersion)
    const laravelVer = parseFloat(props.laravelVersion)

    if (laravelVer === 12 && phpVer >= 8.3) return 'recommended'
    if (laravelVer === 11 && phpVer >= 8.2) return 'recommended'
    if (laravelVer === 10 && phpVer >= 8.1) return 'recommended'
    if (laravelVer === 12 && phpVer < 8.3) return 'warning'
    if (laravelVer === 11 && phpVer < 8.2) return 'warning'
    if (laravelVer === 10 && phpVer < 8.1) return 'warning'

    return 'compatible'
  }
  return null
})

const compatibilityClass = computed(() => {
  if (compatibilityStatus.value === 'recommended') {
    return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
  } else if (compatibilityStatus.value === 'compatible') {
    return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
  } else if (compatibilityStatus.value === 'warning') {
    return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
  }
  return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
})

const compatibilityTitle = computed(() => {
  if (compatibilityStatus.value === 'recommended') return `✓ ${t('recommended')}`
  if (compatibilityStatus.value === 'compatible') return `✓ ${t('compatible')}`
  if (compatibilityStatus.value === 'warning') return `⚠ ${t('warning')}`
  return `✗ ${t('incompatible')}`
})

const compatibilityMessage = computed(() => {
  if (props.projectType === 'laravel' && props.laravelVersion && props.phpVersion) {
    if (compatibilityStatus.value === 'recommended') {
      return 'Perfect match! This combination is tested and recommended for production.'
    } else if (compatibilityStatus.value === 'warning') {
      return 'This combination might work but is not officially recommended. Consider upgrading PHP.'
    }
  }
  return ''
})

const command = computed(() => {
  if (!props.projectName) return ''

  if (props.projectType === 'laravel') {
    let cmd = `composer create-project laravel/laravel ${props.projectName}`
    if (props.laravelVersion) cmd += ` "${props.laravelVersion}.*"`
    return cmd
  } else if (props.projectType === 'vue') {
    return `npm create vue@latest ${props.projectName}`
  } else if (props.projectType === 'nuxt') {
    const template = props.nuxtTemplate || 'minimal'
    return `npx nuxi@latest init ${props.projectName} -t ${template} --packageManager=npm --no-gitInit --no-modules`
  } else if (props.projectType === 'react') {
    return `npx create-react-app ${props.projectName}`
  } else if (props.projectType === 'wordpress') {
    return `wget https://wordpress.org/latest.tar.gz && tar -xzf latest.tar.gz`
  }
  return ''
})

function copyCommand() {
  navigator.clipboard.writeText(command.value)
  status.showStatus(t('commandCopied'), 'success')
}
</script>
