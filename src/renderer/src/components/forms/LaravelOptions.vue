<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('laravelInfoTitle')"
      :message="t('laravelInfo')"
      type="info"
    />

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('laravelVersionLabel') }}</label>
      <CustomSelect
        :model-value="laravelVersion"
        :options="laravelVersionOptions"
        @update:model-value="$emit('update:laravelVersion', $event)"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('phpVersionLabel') }}</label>
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
      <p
        v-if="laravelVersion && phpVersion"
        class="text-xs text-gray-500 dark:text-gray-400 mt-1"
      >
        {{ getPhpCompatibilityMessage() }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('laravelStarterLabel') }}</label>
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
import InfoBox from '../common/InfoBox.vue'
import CustomSelect from '../common/CustomSelect.vue'
import phpIcon from '@/assets/svg/php.svg'
import laravelIcon from '@/assets/svg/laravel.svg'

const { t } = useI18n()
const { installedTools, checkInstalledTools } = useTools()

const props = defineProps({
  laravelVersion: {
    type: String,
    default: '11'
  },
  phpVersion: {
    type: String,
    default: '8.2'
  },
  laravelStarter: {
    type: String,
    default: 'none'
  }
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
  { value: '5.8', label: 'Laravel 5.8 (LTS)', icon: laravelIcon },
  { value: '5.7', label: 'Laravel 5.7', icon: laravelIcon },
  { value: '5.6', label: 'Laravel 5.6', icon: laravelIcon },
  { value: '5.5', label: 'Laravel 5.5 (LTS)', icon: laravelIcon },
  { value: '5.4', label: 'Laravel 5.4', icon: laravelIcon },
  { value: '5.3', label: 'Laravel 5.3', icon: laravelIcon },
  { value: '5.2', label: 'Laravel 5.2', icon: laravelIcon },
  { value: '5.1', label: 'Laravel 5.1 (LTS)', icon: laravelIcon },
  { value: '5.0', label: 'Laravel 5.0', icon: laravelIcon },
  { value: '4.2', label: 'Laravel 4.2', icon: laravelIcon }
]

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

const laravelStarterOptions = computed(() => {
  const version = props.laravelVersion
  const options = [{ value: 'none', label: 'គ្មាន (Laravel ធម្មតា)', icon: laravelIcon }]
  
  // Laravel 12 - New template-based stacks (shadcn/ui)
  if (version === '12') {
    options.push(
      { value: 'template-react', label: 'React Stack (shadcn/ui)', icon: laravelIcon },
      { value: 'template-vue', label: 'Vue Stack (shadcn/ui)', icon: laravelIcon },
      { value: 'template-livewire', label: 'Livewire Stack (shadcn/ui)', icon: laravelIcon },
      { value: 'breeze-manual', label: 'Laravel Breeze (Manual Install)', icon: laravelIcon },
      { value: 'jetstream-manual', label: 'Laravel Jetstream (Manual Install)', icon: laravelIcon }
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
  // Laravel 5.1-5.8 have built-in auth
  else if (parseFloat(version) >= 5.1 && parseFloat(version) <= 5.8) {
    options.push(
      { value: 'make-auth', label: 'Built-in Auth (make:auth)', icon: laravelIcon }
    )
  }
  
  return options
})

function getPhpCompatibilityMessage() {
  const phpRequirements = {
    '12': 'PHP 8.3+',
    '11': 'PHP 8.2 - 8.3',
    '10': 'PHP 8.1 - 8.3',
    '9': 'PHP 8.0 - 8.2',
    '8': 'PHP 7.3 - 8.1',
    '7': 'PHP 7.2.5 - 8.0',
    '6': 'PHP 7.2 - 8.0',
    '5.8': 'PHP 7.1 - 7.4',
    '5.7': 'PHP 7.1 - 7.3',
    '5.6': 'PHP 7.1 - 7.3',
    '5.5': 'PHP 7.0 - 7.3',
    '5.4': 'PHP 5.6.4 - 7.2',
    '5.3': 'PHP 5.6.4 - 7.1',
    '5.2': 'PHP 5.5.9 - 7.0',
    '5.1': 'PHP 5.5.9 - 7.0',
    '5.0': 'PHP 5.4 - 5.6',
    '4.2': 'PHP 5.4 - 5.6'
  }
  
  const required = phpRequirements[props.laravelVersion]
  return required ? `Required: ${required}` : ''
}
</script>
