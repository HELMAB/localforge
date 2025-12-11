<template>
  <div class="space-y-4">
    <InfoBox
      :title="t('laravelInfoTitle')"
      :message="t('laravelInfo')"
      type="info"
    />

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('phpVersionLabel') }}</label>
      <select
        :value="phpVersion"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="$emit('update:phpVersion', $event.target.value)"
      >
        <option value="8.3">
          PHP 8.3
        </option>
        <option
          value="8.2"
          selected
        >
          PHP 8.2
        </option>
        <option value="8.1">
          PHP 8.1
        </option>
        <option value="8.0">
          PHP 8.0
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('laravelStarterLabel') }}</label>
      <select
        :value="laravelStarter"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="$emit('update:laravelStarter', $event.target.value)"
      >
        <option value="none">
          គ្មាន (Laravel ធម្មតា)
        </option>
        <option value="breeze">
          Laravel Breeze (Blade)
        </option>
        <option value="jetstream">
          Laravel Jetstream (Livewire)
        </option>
        <option value="breeze-vue">
          Breeze + Vue.js
        </option>
        <option value="breeze-react">
          Breeze + React
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
</script>
