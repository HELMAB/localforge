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
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import InfoBox from '../common/InfoBox.vue'
import CustomSelect from '../common/CustomSelect.vue'
import phpIcon from '@/assets/svg/php.svg'

const { t } = useI18n()

defineProps({
  phpVersion: {
    type: String,
    default: '8.2'
  }
})

defineEmits(['update:phpVersion'])

const phpVersionOptions = [
  { value: '8.3', label: 'PHP 8.3', icon: phpIcon },
  { value: '8.2', label: 'PHP 8.2', icon: phpIcon },
  { value: '8.1', label: 'PHP 8.1', icon: phpIcon },
  { value: '8.0', label: 'PHP 8.0', icon: phpIcon },
  { value: '7.4', label: 'PHP 7.4', icon: phpIcon }
]
</script>
