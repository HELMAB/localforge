<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('nodeInfoTitle')"
      :message="t('nodeInfo')"
      type="info"
    />

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('nodeVersionLabel') }}</label>
      <select
        :value="nodeVersion"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="$emit('update:nodeVersion', $event.target.value)"
      >
        <option value="20">
          Node.js 20 LTS (Recommended)
        </option>
        <option
          value="18"
          selected
        >
          Node.js 18 LTS
        </option>
        <option value="16">
          Node.js 16
        </option>
        <option value="">
          Current Node Version
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import InfoBox from '../common/InfoBox.vue'

const { t } = useI18n()

defineProps({
  nodeVersion: {
    type: String,
    default: '18'
  }
})

defineEmits(['update:nodeVersion'])
</script>
