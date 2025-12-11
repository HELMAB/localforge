<template>
  <div class="flex border-b">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      custom
      v-slot="{ navigate, isActive }"
    >
      <button
        @click="navigate"
        :class="tabButtonClass(isActive)"
        class="px-6 py-3 font-semibold border-b-2 transition-colors"
      >
        {{ t(tab.label) }}
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tabs = [
  { path: '/create', label: 'tabCreate' },
  { path: '/nginx', label: 'tabNginx' },
  { path: '/ssl', label: 'tabSsl' },
  { path: '/manage', label: 'tabManage' }
]

function tabButtonClass(isActive) {
  return isActive
    ? 'border-blue-500 text-blue-500'
    : 'border-transparent text-gray-500 hover:text-blue-500'
}
</script>
