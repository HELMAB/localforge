<template>
  <Dialog :open="visible" @update:open="(v) => !v && $emit('close')">
    <DialogContent class="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
      <DialogHeader class="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <DialogTitle class="text-2xl">{{ t('projectDetails') }}</DialogTitle>
        <DialogDescription>{{ project?.name }}</DialogDescription>
      </DialogHeader>

      <div class="p-6 overflow-y-auto flex-1 min-h-0">
        <div class="space-y-4">
          <!-- Project Type -->
          <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <img :src="getProjectIcon(project?.type)" class="h-12 w-12" :alt="project?.type" />
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('projectType') }}</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t(getProjectTypeLabel(project?.type)) }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('projectName') }}</p>
              <p class="font-medium text-gray-900 dark:text-white mt-1">{{ project?.name }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('createdOn') }}</p>
              <p class="font-medium text-gray-900 dark:text-white mt-1">
                {{ formatDate(project?.createdAt) }}
              </p>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('projectPath') }}</p>
            <code
              class="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded block overflow-x-auto"
              >{{ project?.path }}</code
            >
          </div>

          <div v-if="project?.config" class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Configuration</p>
            <div class="space-y-2">
              <div v-if="project.config.phpVersion" class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('phpVersion') }}:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                  project.config.phpVersion
                }}</span>
              </div>
              <div v-if="project.config.nodeVersion" class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Node.js:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                  project.config.nodeVersion
                }}</span>
              </div>
              <div v-if="project.config.laravelVersion" class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Laravel:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                  project.config.laravelVersion
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 shrink-0"
      >
        <Button variant="ghost" @click="$emit('close')">{{ t('close') }}</Button>
        <Button @click="handleOpenProject">
          <Code2 class="h-4 w-4 mr-2" />
          {{ t('openInEditor') }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Code2 } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import laravelIcon from '@/assets/svg/laravel.svg'
import vuejsIcon from '@/assets/svg/vuejs.svg'
import nuxtjsIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'

const { t } = useI18n()

const props = defineProps({
  visible: { type: Boolean, default: false },
  project: { type: Object, default: null },
})

const emit = defineEmits(['close', 'open-in-editor'])

function handleOpenProject() {
  emit('open-in-editor', props.project?.path)
}

function getProjectIcon(type) {
  return (
    {
      laravel: laravelIcon,
      vue: vuejsIcon,
      nuxt: nuxtjsIcon,
      react: reactIcon,
      wordpress: wordpressIcon,
    }[type] || laravelIcon
  )
}

function getProjectTypeLabel(type) {
  return (
    {
      laravel: 'projectTypeLaravel',
      vue: 'projectTypeVue',
      nuxt: 'projectTypeNuxt',
      react: 'projectTypeReact',
      wordpress: 'projectTypeWordpress',
    }[type] || 'projectTypeUnknown'
  )
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
