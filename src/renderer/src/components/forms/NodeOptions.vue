<template>
  <div class="space-y-4">
    <div>
      <Label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('nodeVersionLabel') }} <span class="text-red-500">*</span>
      </Label>
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
        <AlertCircle class="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
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
import { AlertCircle } from 'lucide-vue-next'
import { useTools } from '../../composables/useTools'
import CustomSelect from '../common/CustomSelect.vue'
import { Label } from '@/components/ui/label'
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
