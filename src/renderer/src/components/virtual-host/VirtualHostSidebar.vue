<template>
  <div
    class="bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 px-3 flex flex-col rounded-l-lg"
    style="width: 180px; min-width: 180px"
  >
    <nav class="space-y-2 flex-1 overflow-y-auto">
      <button
        :class="[
          'w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          activeMenu === 'new-site'
            ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
        ]"
        @click="$emit('update:activeMenu', 'new-site')"
      >
        <div class="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm">{{ t('nginxNewSite') }}</span>
        </div>
      </button>

      <button
        :class="[
          'w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          activeMenu === 'sites'
            ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
        ]"
        @click="$emit('update:activeMenu', 'sites')"
      >
        <div class="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm">{{ t('nginxSites') }}</span>
          <span
            class="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {{ configs.length }}
          </span>
        </div>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  activeMenu: {
    type: String,
    required: true,
  },
  configs: {
    type: Array,
    required: true,
  },
  t: {
    type: Function,
    required: true,
  },
})

defineEmits(['update:activeMenu'])
</script>

<style scoped>
/* Add any specific styles for the sidebar here if necessary */
</style>
