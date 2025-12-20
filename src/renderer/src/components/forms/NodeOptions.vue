<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('nodeVersionLabel') }} <span class="text-red-500">*</span>
      </label>
      <CustomSelect
        :model-value="nodeVersion"
        :options="nodeVersionOptions"
        @update:model-value="$emit('update:nodeVersion', $event)"
      />
      <p
        v-if="nodeVersionOptions.length === 0"
        class="text-sm text-orange-600 dark:text-orange-400 mt-2"
      >
        {{ t('noNodeVersionsInstalled') }}
      </p>
      <div
        v-if="validationError"
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
          {{ validationError }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTools } from '../../composables/useTools'
import CustomSelect from '../common/CustomSelect.vue'
import nodejsIcon from '@/assets/svg/nodejs.svg'

const { t } = useI18n()
const { installedTools, checkInstalledTools } = useTools()

const props = defineProps({
  nodeVersion: {
    type: String,
    default: '',
  },
  projectType: {
    type: String,
    default: '',
  },
  validationError: {
    type: String,
    default: '',
  },
})

defineEmits(['update:nodeVersion'])

onMounted(async () => {
  await checkInstalledTools()
})

const nodeVersionOptions = computed(() => {
  const options = []

  if (installedTools.value.node.installed && installedTools.value.node.versions.length > 0) {
    const versions = installedTools.value.node.versions
    const majorVersionMap = new Map()

    versions.forEach((version) => {
      const major = parseInt(version.split('.')[0])

      // For Nuxt projects, only show Node 22+
      if (props.projectType === 'nuxt' && major < 22) {
        return
      }

      if (!majorVersionMap.has(major)) {
        majorVersionMap.set(major, version)
      }
    })

    Array.from(majorVersionMap.entries()).forEach(([major, full]) => {
      const isDefault = full === installedTools.value.node.default
      const isRecommended = major >= 22
      
      let label = `Node.js ${major}`
      if (isDefault) {
        label += ' (Default)'
      }
      if (isRecommended && props.projectType === 'nuxt') {
        label += isDefault ? '' : ' (Recommended)'
      }

      options.push({
        value: full,
        label: label,
        icon: nodejsIcon,
      })
    })
  }

  options.push({
    value: '',
    label: 'Current Node Version',
    icon: nodejsIcon,
  })

  return options
})
</script>

