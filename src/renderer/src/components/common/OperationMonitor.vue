<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="hasActiveOperations && expanded"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
        @click.self="expanded = false"
      >
        <div
          class="w-full max-w-[80vw] mx-auto sm:mx-4 bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div
            class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-center gap-3">
              <div
                class="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"
              />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('activeOperations') }} ({{ operationCount }})
              </h3>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="hasCompleted"
                class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                @click="operations.clearCompleted"
              >
                {{ t('clearCompleted') }}
              </button>

              <button
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                @click="expanded = false"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
          </div>

          <!-- Operations list -->
          <div class="max-h-[100vh] overflow-y-auto">
            <div
              v-for="[id, operation] in operations.activeOperations.value"
              :key="id"
              class="border-b border-gray-200 dark:border-gray-600 last:border-b-0"
            >
              <div class="p-6">
                <!-- Operation header -->
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        class="inline-block w-2 h-2 rounded-full"
                        :class="{
                          'bg-blue-500 animate-pulse': operation.status === 'running',
                          'bg-green-500': operation.status === 'completed',
                          'bg-red-500': operation.status === 'failed',
                          'bg-gray-500': operation.status === 'cancelled',
                        }"
                      />
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ getOperationTitle(operation.type) }}
                      </span>
                    </div>

                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDuration(operation) }}
                    </div>
                  </div>

                  <button
                    v-if="operation.status === 'running' && operation.canCancel"
                    class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium"
                    @click="handleCancel(id)"
                  >
                    {{ t('cancel') }}
                  </button>
                </div>

                <!-- Full output -->
                <div
                  v-if="operation.output.length > 0"
                  ref="outputContainer"
                  class="bg-gray-900 text-gray-100 text-xs font-mono p-3 rounded max-h-64 overflow-y-auto"
                >
                  <div
                    v-for="(line, index) in operation.output"
                    :key="index"
                    class="whitespace-pre-wrap break-words leading-relaxed"
                  >
                    {{ line.text }}
                  </div>
                </div>

                <!-- Progress indicator -->
                <div
                  v-if="operation.status === 'running'"
                  class="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                >
                  <div class="h-full bg-blue-600 animate-progress" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOperationControl } from '@/composables/useOperationControl'

const { t } = useI18n()
const operations = useOperationControl()

const expanded = ref(true)
const outputContainer = ref(null)

const hasActiveOperations = computed(() => {
  return operations.activeOperations.value.size > 0
})

const operationCount = computed(() => {
  return operations.activeOperations.value.size
})

const hasCompleted = computed(() => {
  for (const operation of operations.activeOperations.value.values()) {
    if (operation.status !== 'running') return true
  }
  return false
})

watch(
  () => operations.activeOperations.value,
  async (newOperations) => {
    if (newOperations.size > 0) {
      expanded.value = true
      await nextTick()
      if (outputContainer.value && outputContainer.value.length > 0) {
        outputContainer.value.forEach((container) => {
          if (container) {
            container.scrollTop = container.scrollHeight
          }
        })
      }
    }
    // Auto-close if any project creation fails
    for (const operation of newOperations.values()) {
      if (operation.type === 'create-project' && operation.status === 'failed') {
        expanded.value = false
        break
      }
    }
  },
  { deep: true }
)

const getOperationTitle = (type) => {
  const titles = {
    'create-project': t('creatingProject'),
    'configure-nginx': t('configuringNginx'),
    'generate-ssl': t('generatingSsl'),
    'install-tool': t('installingTool'),
  }
  return titles[type] || type
}

const formatDuration = (operation) => {
  const duration = operation.endTime ? operation.duration : Date.now() - operation.startTime

  const seconds = Math.floor(duration / 1000)
  const minutes = Math.floor(seconds / 60)

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

const handleCancel = async (id) => {
  const success = await operations.cancelOperation(id)
  if (success) {
    // Operation cancelled successfully
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.animate-progress {
  animation: progress 1.5s ease-in-out infinite;
  width: 25%;
}
</style>
