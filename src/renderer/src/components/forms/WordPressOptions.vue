<template>
  <div class="space-y-4">
    <div>
      <Label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('wpPhpVersionLabel') }} <span class="text-red-500">*</span>
      </Label>
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
import phpIcon from '@/assets/svg/php.svg'

const { t } = useI18n()
const { installedTools, checkInstalledTools } = useTools()

defineProps({
  phpVersion: {
    type: String,
    default: '8.2',
  },
  validationError: {
    type: String,
    default: '',
  },
})

defineEmits(['update:phpVersion'])

onMounted(async () => {
  await checkInstalledTools()
})

const phpVersionOptions = computed(() => {
  const options = []

  // Add installed PHP versions
  if (installedTools.value.php.installed && installedTools.value.php.versions.length > 0) {
    installedTools.value.php.versions.forEach((version) => {
      options.push({
        value: version,
        label: `PHP ${version}`,
        icon: phpIcon,
      })
    })
  }

  return options
})
</script>
