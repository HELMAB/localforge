<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="hasActiveOperations && expanded"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
        @click.self="expanded = false"
      >
        <div
          class="w-full max-w-[80vw] mx-auto sm:mx-4 bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg shadow-2xl overflow-hidden"
        >
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
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <div class="max-h-[100vh] overflow-y-auto">
            <div
              v-for="[id, operation] in operations.activeOperations.value"
              :key="id"
              class="border-b border-gray-200 dark:border-gray-600 last:border-b-0"
            >
              <div class="p-6">
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

                <div
                  v-if="operation.output.length > 0"
                  ref="outputContainer"
                  class="bg-gray-900 text-green-400 text-xs p-3 rounded max-h-[50vh] overflow-y-auto font-mono"
                >
                  <div
                    v-for="(line, index) in operation.output"
                    :key="index"
                    class="whitespace-pre-wrap break-words leading-relaxed"
                  >
                    {{ line.text }}
                  </div>
                </div>

                <div
                  v-if="operation.status === 'running'"
                  class="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-blue-600 w-1/4 animate-[progress_1.5s_ease-in-out_infinite]"
                  />
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
import { X } from 'lucide-vue-next'
import { useOperationControl } from '@/composables/useOperationControl'

const { t } = useI18n()
const operations = useOperationControl()

const expanded = ref(true)
const outputContainer = ref(null)

const hasActiveOperations = computed(() => operations.activeOperations.value.size > 0)
const operationCount = computed(() => operations.activeOperations.value.size)
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
          if (container) container.scrollTop = container.scrollHeight
        })
      }
    }
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
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

const handleCancel = async (id) => {
  await operations.cancelOperation(id)
}
</script>
