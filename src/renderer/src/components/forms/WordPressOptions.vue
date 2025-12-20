<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('wpPhpVersionLabel') }} <span class="text-red-500">*</span>
      </label>
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
