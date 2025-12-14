<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="hasActiveOperations"
        class="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-40 overflow-hidden"
      >
        <!-- Header -->
        <div
          class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-600"
        >
          <div class="flex items-center gap-2">
            <div
              class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"
            />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ t('activeOperations') }} ({{ operationCount }})
            </h3>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="hasCompleted"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              @click="operations.clearCompleted"
            >
              {{ t('clearCompleted') }}
            </button>

            <button
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              @click="expanded = !expanded"
            >
              <svg
                class="w-5 h-5 transition-transform"
                :class="{ 'rotate-180': expanded }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Operations list -->
        <Transition name="expand">
          <div
            v-if="expanded"
            class="max-h-96 overflow-y-auto"
          >
            <div
              v-for="[id, operation] in operations.activeOperations.value"
              :key="id"
              class="border-b border-gray-200 dark:border-gray-600 last:border-b-0"
            >
              <div class="p-4">
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

                <!-- Output preview (last 3 lines) -->
                <div
                  v-if="operation.output.length > 0"
                  class="bg-gray-900 text-gray-100 text-xs font-mono p-2 rounded max-h-24 overflow-y-auto"
                >
                  <div
                    v-for="(line, index) in operation.output.slice(-3)"
                    :key="index"
                    class="whitespace-pre-wrap break-all"
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
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOperationControl } from '@/composables/useOperationControl'

const { t } = useI18n()
const operations = useOperationControl()

const expanded = ref(true)

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
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
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
