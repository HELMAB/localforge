<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('wpInfoTitle')"
      :message="t('wpInfo')"
      type="info"
    />

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('wpPhpVersionLabel') }}</label>
      <select
        :value="phpVersion"
        @change="$emit('update:phpVersion', $event.target.value)"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="8.3">PHP 8.3</option>
        <option value="8.2" selected>PHP 8.2</option>
        <option value="8.1">PHP 8.1</option>
        <option value="8.0">PHP 8.0</option>
        <option value="7.4">PHP 7.4</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import InfoBox from '../common/InfoBox.vue'

const { t } = useI18n()

defineProps({
  phpVersion: {
    type: String,
    default: '8.2'
  }
})

defineEmits(['update:phpVersion'])
</script>
