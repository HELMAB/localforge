<template>
  <div
    class="bg-gray-50 border-r border-gray-200 py-4 px-3 flex flex-col rounded-l-lg"
    style="width: 180px; min-width: 180px;"
  >
    <nav class="space-y-2 flex-1 overflow-y-auto">
      <button
        v-for="tool in tools"
        :key="tool.id"
        :class="sidebarButtonClass(tool.id)"
        class="w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        @click="$emit('select', tool.id)"
      >
        <div class="flex items-center gap-3">
          <img
            :src="tool.icon"
            :alt="tool.id"
            class="w-5 h-5"
          >
          <span class="text-sm">{{ t(tool.label) }}</span>
        </div>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import phpIcon from '@/assets/svg/php.svg'
import composerIcon from '@/assets/svg/composer.svg'
import nodejsIcon from '@/assets/svg/nodejs.svg'
import nginxIcon from '@/assets/svg/nginx.svg'
import postgresqlIcon from '@/assets/svg/postgresql.svg'
import mysqlIcon from '@/assets/svg/mysql.svg'

const { t } = useI18n()

const props = defineProps({
  selectedTool: {
    type: String,
    default: 'php'
  }
})

defineEmits(['select'])

const tools = [
  { id: 'php', icon: phpIcon, label: 'menuPhp' },
  { id: 'composer', icon: composerIcon, label: 'menuComposer' },
  { id: 'node', icon: nodejsIcon, label: 'menuNode' },
  { id: 'nginx', icon: nginxIcon, label: 'menuNginx' },
  { id: 'postgresql', icon: postgresqlIcon, label: 'menuPostgresql' },
  { id: 'mysql', icon: mysqlIcon, label: 'menuMysql' }
]

function sidebarButtonClass(toolId) {
  return props.selectedTool === toolId
    ? 'bg-blue-500 text-white hover:bg-blue-600'
    : 'hover:bg-gray-200 text-gray-700'
}
</script>
