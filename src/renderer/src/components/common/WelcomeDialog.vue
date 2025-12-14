<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="handleSkip"
        />

        <div
          class="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full p-8 transform transition-all"
        >
          <div class="text-center">
            <!-- Icon -->
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4"
            >
              <svg
                class="h-10 w-10 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <!-- Title -->
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ t('welcomeTitle') }}
            </h2>

            <!-- Subtitle -->
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('welcomeSubtitle') }}
            </p>

            <!-- Features -->
            <div class="text-left space-y-3 mb-8">
              <div class="flex items-start gap-3">
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5"
                >
                  <svg
                    class="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">
                    {{ t('feature1Title') }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ t('feature1Desc') }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5"
                >
                  <svg
                    class="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">
                    {{ t('feature2Title') }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ t('feature2Desc') }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5"
                >
                  <svg
                    class="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">
                    {{ t('feature3Title') }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ t('feature3Desc') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3">
              <button
                class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                @click="handleStartTour"
              >
                {{ t('startTour') }}
              </button>

              <button
                class="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                @click="handleSkip"
              >
                {{ t('skipTour') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['start-tour', 'skip'])
const show = ref(true)

const handleStartTour = () => {
  show.value = false
  emit('start-tour')
}

const handleSkip = () => {
  show.value = false
  emit('skip')
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
</style>
