<template>
  <div
    class="w-[180px] min-w-[180px] bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 px-3 flex flex-col rounded-l-lg"
  >
    <nav class="space-y-2 flex-1 overflow-y-auto">
      <Button
        variant="ghost"
        class="w-full justify-start px-3 py-2.5 h-auto text-sm font-medium gap-3"
        :class="[
          activeMenu === 'sites'
            ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
        ]"
        @click="$emit('update:activeMenu', 'sites')"
      >
        <Globe class="h-5 w-5 shrink-0" />
        <span class="text-sm">{{ t('nginxSites') }}</span>
        <span
          class="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          {{ configs.length }}
        </span>
      </Button>
      <Button
        variant="ghost"
        class="w-full justify-start px-3 py-2.5 h-auto text-sm font-medium gap-3"
        :class="[
          activeMenu === 'new-site'
            ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
        ]"
        @click="$emit('update:activeMenu', 'new-site')"
      >
        <Plus class="h-5 w-5 shrink-0" />
        <span class="text-sm">{{ t('nginxNewSite') }}</span>
      </Button>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Globe, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

defineProps({
  activeMenu: {
    type: String,
    required: true,
  },
  configs: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:activeMenu'])
</script>
