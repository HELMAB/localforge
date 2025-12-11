<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('nodeInfoTitle')"
      :message="t('nodeInfo')"
      type="info"
    />

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('nodeVersionLabel') }}</label>
      <CustomSelect
        :model-value="nodeVersion"
        :options="nodeVersionOptions"
        @update:model-value="$emit('update:nodeVersion', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import InfoBox from '../common/InfoBox.vue'
import CustomSelect from '../common/CustomSelect.vue'
import nodejsIcon from '@/assets/svg/nodejs.svg'

const { t } = useI18n()

defineProps({
  nodeVersion: {
    type: String,
    default: '18'
  }
})

defineEmits(['update:nodeVersion'])

const nodeVersionOptions = [
  { value: '20', label: 'Node.js 20 LTS (Recommended)', icon: nodejsIcon },
  { value: '18', label: 'Node.js 18 LTS', icon: nodejsIcon },
  { value: '16', label: 'Node.js 16', icon: nodejsIcon },
  { value: '', label: 'Current Node Version', icon: nodejsIcon }
]
</script>
