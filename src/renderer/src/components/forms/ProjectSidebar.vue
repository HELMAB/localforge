<template>
  <div
    class="w-[200px] min-w-[200px] bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 px-3 flex flex-col rounded-l-lg"
  >
    <nav class="space-y-2 flex-1 overflow-y-auto">
      <Button
        variant="ghost"
        class="w-full justify-start px-3 py-2.5 h-auto text-sm font-medium gap-3"
        :class="[
          activeView === 'recent'
            ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white'
            : 'text-gray-700 dark:text-gray-300',
        ]"
        @click="$emit('update:activeView', 'recent')"
      >
        <LayoutGrid class="h-5 w-5" />
        <span>{{ t('projects') }}</span>
      </Button>
      <Button
        variant="ghost"
        class="w-full justify-start px-3 py-2.5 h-auto text-sm font-medium gap-3"
        :class="[
          activeView === 'new'
            ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white'
            : 'text-gray-700 dark:text-gray-300',
        ]"
        @click="$emit('update:activeView', 'new')"
      >
        <Plus class="h-5 w-5" />
        <span>{{ t('quickSetup') }}</span>
      </Button>
      <Button
        variant="ghost"
        class="w-full justify-start px-3 py-2.5 h-auto text-sm font-medium gap-3"
        :class="[
          activeView === 'import'
            ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white'
            : 'text-gray-700 dark:text-gray-300',
        ]"
        @click="$emit('update:activeView', 'import')"
      >
        <FolderInput class="h-5 w-5" />
        <span>{{ t('importProject') }}</span>
      </Button>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { LayoutGrid, Plus, FolderInput } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

defineProps({
  activeView: {
    type: String,
    required: true,
  },
})

defineEmits(['update:activeView'])
</script>
