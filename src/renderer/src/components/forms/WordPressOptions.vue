<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('wpInfoTitle')"
      :message="t('wpInfo')"
      type="info"
    />

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('wpPhpVersionLabel') }}</label>
      <CustomSelect
        :model-value="phpVersion"
        :options="phpVersionOptions"
        @update:model-value="$emit('update:phpVersion', $event)"
      />
      <p
        v-if="phpVersionOptions.length === 0"
        class="text-sm text-orange-600 dark:text-orange-400 mt-2"
      >
        {{ t('noPhpVersionsInstalled') }}
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
import phpIcon from '@/assets/svg/php.svg'

const { t } = useI18n()
const { installedTools, checkInstalledTools } = useTools()

defineProps({
  phpVersion: {
    type: String,
    default: '8.2'
  }
})

defineEmits(['update:phpVersion'])

onMounted(async () => {
  await checkInstalledTools()
})

const phpVersionOptions = computed(() => {
  const options = []
  
  // Add installed PHP versions
  if (installedTools.value.php.installed && installedTools.value.php.versions.length > 0) {
    installedTools.value.php.versions.forEach(version => {
      options.push({
        value: version,
        label: `PHP ${version}`,
        icon: phpIcon
      })
    })
  }
  
  return options
})
</script>
