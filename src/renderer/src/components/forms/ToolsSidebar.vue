<template>
  <div
    class="w-[180px] min-w-[180px] bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 px-3 flex flex-col rounded-l-lg"
  >
    <nav class="space-y-2 flex-1 overflow-y-auto">
      <Button
        v-for="tool in tools"
        :key="tool.id"
        variant="ghost"
        class="w-full justify-start px-3 py-2.5 h-auto text-sm font-medium gap-3"
        :class="sidebarButtonClass(tool.id)"
        @click="$emit('select', tool.id)"
      >
        <img :src="tool.icon" :alt="tool.id" class="w-5 h-5" />
        <span class="text-sm">{{ t(tool.label) }}</span>
      </Button>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
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
    default: 'php',
  },
})

defineEmits(['select'])

const tools = [
  { id: 'php', icon: phpIcon, label: 'menuPhp' },
  { id: 'composer', icon: composerIcon, label: 'menuComposer' },
  { id: 'node', icon: nodejsIcon, label: 'menuNode' },
  { id: 'nginx', icon: nginxIcon, label: 'menuNginx' },
  { id: 'postgresql', icon: postgresqlIcon, label: 'menuPostgresql' },
  { id: 'mysql', icon: mysqlIcon, label: 'menuMysql' },
]

function sidebarButtonClass(toolId) {
  return props.selectedTool === toolId
    ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
}
</script>
