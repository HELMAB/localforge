<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
        t('nodeVersionLabel')
      }}</label>
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
      
      // For Nuxt projects, only show Node 20+
      if (props.projectType === 'nuxt' && major < 20) {
        return
      }
      
      if (!majorVersionMap.has(major)) {
        majorVersionMap.set(major, version)
      }
    })

    Array.from(majorVersionMap.entries()).forEach(([major, full]) => {
      const isDefault = full === installedTools.value.node.default
      const isRecommended = major >= 20
      
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

