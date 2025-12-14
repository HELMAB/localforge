<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('nodeInfoTitle')"
      :message="t('nodeInfo')"
      type="info"
    />

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
import InfoBox from '../common/InfoBox.vue'
import CustomSelect from '../common/CustomSelect.vue'
import nodejsIcon from '@/assets/svg/nodejs.svg'

const { t } = useI18n()
const { installedTools, checkInstalledTools } = useTools()

defineProps({
  nodeVersion: {
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

  // Add installed Node versions
  if (installedTools.value.node.installed && installedTools.value.node.versions.length > 0) {
    installedTools.value.node.versions.forEach((version) => {
      const isDefault = version === installedTools.value.node.default
      const label = isDefault ? `Node.js ${version} (Default - Recommended)` : `Node.js ${version}`

      options.push({
        value: version,
        label: label,
        icon: nodejsIcon,
      })
    })
  }

  // Add "Current Node Version" option as fallback
  options.push({
    value: '',
    label: 'Current Node Version',
    icon: nodejsIcon,
  })

  return options
})
</script>
