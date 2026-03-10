<template>
  <div ref="dropdownRef" class="relative">
    <Button variant="ghost" size="icon" class="rounded-full h-8 w-8" @click="toggleDropdown">
      <MoreVertical class="h-5 w-5 text-gray-500 dark:text-gray-400" />
    </Button>

    <Transition
      enter-active-class="transition-opacity duration-200 ease-in-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in-out"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        :class="openUpward ? 'bottom-full mb-2' : 'top-full mt-2'"
        class="absolute right-0 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-40"
      >
        <div class="py-1">
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click.prevent="handleViewDetails"
          >
            <Eye class="h-4 w-4" />
            <span>{{ t('viewDetails') }}</span>
          </a>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click.prevent="handleOpenInBrowser"
          >
            <Globe class="h-4 w-4" />
            <span>{{ t('openInBrowser') }}</span>
          </a>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click.prevent="$emit('open-in-ide', project.path)"
          >
            <Code2 class="h-4 w-4" />
            <span>{{ t('openInEditor') }}</span>
          </a>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click.prevent="$emit('open-in-file-manager', project.path)"
          >
            <FolderOpen class="h-4 w-4" />
            <span>{{ t('fileManager') }}</span>
          </a>
          <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            @click.prevent="$emit('remove', project)"
          >
            <Trash2 class="h-4 w-4" />
            <span>{{ t('deleteProject') }}</span>
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Code2, Eye, FolderOpen, Globe, MoreVertical, Trash2 } from 'lucide-vue-next'
import { useDropdown } from '@/composables/useDropdown'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

defineProps({
  project: { type: Object, required: true },
})

const emit = defineEmits([
  'remove',
  'open-in-ide',
  'open-in-file-manager',
  'view-details',
  'open-in-browser',
])

const { isOpen, dropdownRef, openUpward, toggleDropdown } = useDropdown(300)

function handleViewDetails() {
  emit('view-details')
  isOpen.value = false
}

function handleOpenInBrowser() {
  emit('open-in-browser')
  isOpen.value = false
}
</script>
