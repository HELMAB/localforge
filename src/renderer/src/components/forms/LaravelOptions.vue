<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
        t('laravelVersionLabel')
      }}</label>
      <CustomSelect
        :model-value="laravelVersion"
        :options="laravelVersionOptions"
        @update:model-value="$emit('update:laravelVersion', $event)"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('phpVersionLabel') }} <span class="text-red-500">*</span>
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
      <p
        v-if="laravelVersion && phpVersion"
        class="text-xs text-gray-500 dark:text-gray-400 mt-1"
      >
        {{ getPhpCompatibilityMessage() }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
        t('laravelStarterLabel')
      }}</label>
      <CustomSelect
        :model-value="laravelStarter"
        :options="laravelStarterOptions"
        @update:model-value="$emit('update:laravelStarter', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTools } from '../../composables/useTools'
import CustomSelect from '../common/CustomSelect.vue'
import phpIcon from '@/assets/svg/php.svg'
import laravelIcon from '@/assets/svg/laravel.svg'

const { t } = useI18n()
const { installedTools, checkInstalledTools } = useTools()

const props = defineProps({
  laravelVersion: {
    type: String,
    default: '12',
  },
  phpVersion: {
    type: String,
    default: '8.2',
  },
  laravelStarter: {
    type: String,
    default: 'none',
  },
  validationError: {
    type: String,
    default: '',
  },
})

defineEmits(['update:laravelVersion', 'update:phpVersion', 'update:laravelStarter'])

onMounted(async () => {
  await checkInstalledTools()
})

const laravelVersionOptions = [
  { value: '12', label: 'Laravel 12.x (Latest)', icon: laravelIcon },
  { value: '11', label: 'Laravel 11.x (Recommended)', icon: laravelIcon },
  { value: '10', label: 'Laravel 10.x (LTS)', icon: laravelIcon },
  { value: '9', label: 'Laravel 9.x (LTS)', icon: laravelIcon },
  { value: '8', label: 'Laravel 8.x', icon: laravelIcon },
  { value: '7', label: 'Laravel 7.x', icon: laravelIcon },
  { value: '6', label: 'Laravel 6.x (LTS)', icon: laravelIcon },
]

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

const laravelStarterOptions = computed(() => {
  const version = props.laravelVersion
  const options = [{ value: 'none', label: 'គ្មាន (Laravel ធម្មតា)', icon: laravelIcon }]

  // Laravel 12 - New template-based stacks (shadcn/ui)
  if (version === '12') {
    options.push(
      { value: 'template-react', label: 'React Starter Kit', icon: laravelIcon },
      { value: 'template-vue', label: 'Vue Starter Kit', icon: laravelIcon },
      { value: 'template-livewire', label: 'Livewire Starter Kit', icon: laravelIcon }
    )
  }
  // Laravel 8-11 supports Breeze and Jetstream
  else if (version === '11' || version === '10' || version === '9' || version === '8') {
    options.push(
      { value: 'breeze', label: 'Laravel Breeze (Blade)', icon: laravelIcon },
      { value: 'jetstream', label: 'Laravel Jetstream (Livewire)', icon: laravelIcon },
      { value: 'breeze-vue', label: 'Breeze + Vue.js', icon: laravelIcon },
      { value: 'breeze-react', label: 'Breeze + React', icon: laravelIcon }
    )
  }
  // Laravel 6-7 supports laravel/ui
  else if (version === '7' || version === '6') {
    options.push(
      { value: 'ui-bootstrap', label: 'Laravel UI (Bootstrap)', icon: laravelIcon },
      { value: 'ui-vue', label: 'Laravel UI (Vue)', icon: laravelIcon },
      { value: 'ui-react', label: 'Laravel UI (React)', icon: laravelIcon }
    )
  }

  return options
})

function getPhpCompatibilityMessage() {
  const phpRequirements = {
    12: 'PHP 8.3+',
    11: 'PHP 8.2 - 8.3',
    10: 'PHP 8.1 - 8.3',
    9: 'PHP 8.0 - 8.2',
    8: 'PHP 7.3 - 8.1',
    7: 'PHP 7.2.5 - 8.0',
    6: 'PHP 7.2 - 8.0',
  }

  const required = phpRequirements[props.laravelVersion]
  return required ? `Required: ${required}` : ''
}
</script>
