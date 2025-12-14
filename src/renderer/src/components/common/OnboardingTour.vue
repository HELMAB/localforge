<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="onboarding.isActive.value"
        class="fixed inset-0 z-50"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-60" />

        <!-- Spotlight highlight -->
        <div
          v-if="currentTarget"
          :style="spotlightStyle"
          class="absolute pointer-events-none border-4 border-blue-500 rounded-lg shadow-2xl transition-all duration-300"
        />

        <!-- Tour tooltip -->
        <div
          v-if="step"
          :style="tooltipStyle"
          class="absolute bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md z-10 transition-all duration-300"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ step.title }}
            </h3>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="onboarding.skip"
            >
              <svg
                class="w-5 h-5"
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

          <!-- Content -->
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ step.content }}
          </p>

          <!-- Footer -->
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ step.stepNumber }} / {{ step.totalSteps }}
            </div>

            <div class="flex gap-2">
              <button
                v-if="onboarding.currentStep.value > 0"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                @click="onboarding.previous"
              >
                {{ t('previous') }}
              </button>

              <button
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                @click="onboarding.next"
              >
                {{
                  onboarding.currentStep.value < onboarding.steps.length - 1
                    ? t('next')
                    : t('finish')
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOnboarding } from '@/composables/useOnboarding'

const { t, locale } = useI18n()
const onboarding = useOnboarding()

const currentTarget = ref(null)
const targetRect = ref(null)

const step = computed(() => {
  return onboarding.getCurrentStep(locale.value)
})

const spotlightStyle = computed(() => {
  if (!targetRect.value) return {}

  return {
    top: `${targetRect.value.top - 8}px`,
    left: `${targetRect.value.left - 8}px`,
    width: `${targetRect.value.width + 16}px`,
    height: `${targetRect.value.height + 16}px`,
  }
})

const tooltipStyle = computed(() => {
  if (!targetRect.value || !step.value) return {}

  const position = step.value.position || 'bottom'
  const spacing = 20

  let top = 0
  let left = 0

  switch (position) {
    case 'bottom':
      top = targetRect.value.bottom + spacing
      left = targetRect.value.left + targetRect.value.width / 2
      break
    case 'top':
      top = targetRect.value.top - spacing
      left = targetRect.value.left + targetRect.value.width / 2
      break
    case 'right':
      top = targetRect.value.top + targetRect.value.height / 2
      left = targetRect.value.right + spacing
      break
    case 'left':
      top = targetRect.value.top + targetRect.value.height / 2
      left = targetRect.value.left - spacing
      break
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform:
      position === 'left'
        ? 'translate(-100%, -50%)'
        : position === 'right'
          ? 'translate(0, -50%)'
          : position === 'top'
            ? 'translate(-50%, -100%)'
            : 'translate(-50%, 0)',
  }
})

const updateTargetPosition = () => {
  if (!step.value) return

  const target = document.querySelector(step.value.target)
  if (target) {
    currentTarget.value = target
    targetRect.value = target.getBoundingClientRect()
  }
}

watch(
  () => onboarding.currentStep.value,
  () => {
    setTimeout(updateTargetPosition, 100)
  }
)

watch(
  () => onboarding.isActive.value,
  (active) => {
    if (active) {
      setTimeout(updateTargetPosition, 100)
    }
  }
)

onMounted(() => {
  window.addEventListener('resize', updateTargetPosition)
  window.addEventListener('scroll', updateTargetPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTargetPosition)
  window.removeEventListener('scroll', updateTargetPosition)
})
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
