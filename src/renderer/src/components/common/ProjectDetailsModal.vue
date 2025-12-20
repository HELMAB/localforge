<template>
  <Transition name="modal">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ t('projectDetails') }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ project?.name }}
            </p>
          </div>
          <button
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="$emit('close')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div class="space-y-4">
            <!-- Project Type -->
            <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <img
                :src="getProjectIcon(project?.type)"
                class="h-12 w-12"
                :alt="project?.type"
              >
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('projectType') }}
                </p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ t(getProjectTypeLabel(project?.type)) }}
                </p>
              </div>
            </div>

            <!-- Project Info Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('projectName') }}
                </p>
                <p class="font-medium text-gray-900 dark:text-white mt-1">
                  {{ project?.name }}
                </p>
              </div>

              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('createdOn') }}
                </p>
                <p class="font-medium text-gray-900 dark:text-white mt-1">
                  {{ formatDate(project?.createdAt) }}
                </p>
              </div>
            </div>

            <!-- Path -->
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {{ t('projectPath') }}
              </p>
              <code class="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded block overflow-x-auto">
                {{ project?.path }}
              </code>
            </div>

            <!-- Configuration -->
            <div
              v-if="project?.config"
              class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Configuration
              </p>
              <div class="space-y-2">
                <div
                  v-if="project.config.phpVersion"
                  class="flex justify-between"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('phpVersion') }}:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ project.config.phpVersion }}</span>
                </div>
                <div
                  v-if="project.config.nodeVersion"
                  class="flex justify-between"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-400">Node.js:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ project.config.nodeVersion }}</span>
                </div>
                <div
                  v-if="project.config.laravelVersion"
                  class="flex justify-between"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-400">Laravel:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ project.config.laravelVersion }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            @click="$emit('close')"
          >
            {{ t('close') }}
          </button>
          <button
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            @click="handleOpenProject"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clip-rule="evenodd"
              />
            </svg>
            {{ t('openInEditor') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import laravelIcon from '@/assets/svg/laravel.svg'
import vuejsIcon from '@/assets/svg/vuejs.svg'
import nuxtjsIcon from '@/assets/svg/nuxtjs.svg'
import reactIcon from '@/assets/svg/react.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'

const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'open-in-editor'])

function handleOpenProject() {
  emit('open-in-editor', props.project?.path)
}

function getProjectIcon(type) {
  const icons = {
    laravel: laravelIcon,
    vue: vuejsIcon,
    nuxt: nuxtjsIcon,
    react: reactIcon,
    wordpress: wordpressIcon,
  }
  return icons[type] || laravelIcon
}

function getProjectTypeLabel(type) {
  const labels = {
    laravel: 'projectTypeLaravel',
    vue: 'projectTypeVue',
    nuxt: 'projectTypeNuxt',
    react: 'projectTypeReact',
    wordpress: 'projectTypeWordpress',
  }
  return labels[type] || 'projectTypeUnknown'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
