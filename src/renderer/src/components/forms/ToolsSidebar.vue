<template>
  <div class="lg-sidebar flex flex-col">
    <nav class="space-y-1 flex-1 overflow-y-auto">
      <Button
        v-for="tool in tools"
        :key="tool.id"
        variant="ghost"
        class="lg-sideitem"
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
  return props.selectedTool === toolId ? 'lg-sideitem--active' : 'lg-sideitem--inactive'
}
</script>
