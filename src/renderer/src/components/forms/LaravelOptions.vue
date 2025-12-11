<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('laravelInfoTitle')"
      :message="t('laravelInfo')"
      type="info"
    />

    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('phpVersionLabel') }}</label>
      <CustomSelect
        :model-value="phpVersion"
        :options="phpVersionOptions"
        @update:model-value="$emit('update:phpVersion', $event)"
      />
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
import { useI18n } from 'vue-i18n'
import InfoBox from '../common/InfoBox.vue'
import CustomSelect from '../common/CustomSelect.vue'
import phpIcon from '@/assets/svg/php.svg'
import laravelIcon from '@/assets/svg/laravel.svg'

const { t } = useI18n()

defineProps({
  phpVersion: {
    type: String,
    default: '8.2'
  },
  laravelStarter: {
    type: String,
    default: 'none'
  }
})

defineEmits(['update:phpVersion', 'update:laravelStarter'])

const phpVersionOptions = [
  { value: '8.3', label: 'PHP 8.3', icon: phpIcon },
  { value: '8.2', label: 'PHP 8.2', icon: phpIcon },
  { value: '8.1', label: 'PHP 8.1', icon: phpIcon },
  { value: '8.0', label: 'PHP 8.0', icon: phpIcon }
]

const laravelStarterOptions = [
  { value: 'none', label: 'គ្មាន (Laravel ធម្មតា)', icon: laravelIcon },
  { value: 'breeze', label: 'Laravel Breeze (Blade)', icon: laravelIcon },
  { value: 'jetstream', label: 'Laravel Jetstream (Livewire)', icon: laravelIcon },
  { value: 'breeze-vue', label: 'Breeze + Vue.js', icon: laravelIcon },
  { value: 'breeze-react', label: 'Breeze + React', icon: laravelIcon }
]
</script>
