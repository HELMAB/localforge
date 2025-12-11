<template>
  <div class="flex border-b dark:border-gray-700">
    <router-link
      v-for="(tab, index) in tabs"
      :key="tab.path"
      v-slot="{ navigate, isActive }"
      :to="tab.path"
      custom
    >
      <button
        :class="tabButtonClass(isActive)"
        class="px-6 py-3 font-semibold border-b-2 transition-colors flex items-center"
        @click="navigate"
      >
        {{ t(tab.label) }}
        <KeyboardHint :hint="`Ctrl+${index + 1}`" />
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import KeyboardHint from '../common/KeyboardHint.vue'

const { t } = useI18n()

const tabs = [
  { path: '/create', label: 'tabCreate' },
  { path: '/nginx', label: 'tabNginx' },
  { path: '/ssl', label: 'tabSsl' },
  { path: '/manage', label: 'tabManage' }
]

function tabButtonClass(isActive) {
  return isActive
    ? 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400'
    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
}
</script>
