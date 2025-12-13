<template>
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fill-rule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clip-rule="evenodd"
          />
        </svg>
        {{ t('projectPreview') }}
      </h3>
      <div class="flex items-center gap-3 text-xs">
        <div class="flex items-center gap-1 text-blue-700 dark:text-blue-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ t('estimatedTime') }}: {{ estimatedTime }} {{ t('minutes') }}</span>
        </div>
        <div class="flex items-center gap-1 text-blue-700 dark:text-blue-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          v-if="compatibilityStatus === 'recommended'"
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
        <path
          v-else-if="compatibilityStatus === 'compatible'"
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        />
        <path
          v-else
          fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
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
    <div
      v-if="command"
      class="mt-3"
    >
      <button
        class="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        @click="showCommand = !showCommand"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 transition-transform"
          :class="{ 'rotate-90': showCommand }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        {{ showCommand ? t('hideTerminalOutput') : t('showTerminalOutput') }}
      </button>
      <div
        v-if="showCommand"
        class="mt-2 bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto relative"
      >
        <button
          class="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          :title="t('copyCommand')"
          @click="copyCommand"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        </button>
        <pre class="whitespace-pre-wrap break-all">{{ command }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../composables/useStatus'

const { t } = useI18n()
const status = useStatus()

const props = defineProps({
  projectType: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  phpVersion: {
    type: String,
    default: ''
  },
  nodeVersion: {
    type: String,
    default: ''
  },
  laravelVersion: {
    type: String,
    default: ''
  },
  laravelStarter: {
    type: String,
    default: ''
  },
  nuxtVersion: {
    type: String,
    default: ''
  },
  vueOptions: {
    type: Object,
    default: () => ({})
  }
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
    items.push(`Nuxt ${props.nuxtVersion}`)
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
    return `npx nuxi@latest init ${props.projectName}`
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
