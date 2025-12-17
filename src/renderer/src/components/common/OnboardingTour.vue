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
          ref="tooltipRef"
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOnboarding } from '@/composables/useOnboarding'

const { t, locale } = useI18n()
const onboarding = useOnboarding()

const currentTarget = ref(null)
const targetRect = ref(null)
const tooltipRef = ref(null)
const tooltipSize = ref({ width: 0, height: 0 })

const step = computed(() => {
  return onboarding.getCurrentStep(locale.value)
})

watch(tooltipRef, (el) => {
  if (el) {
    // When the tooltip appears in the DOM, measure its size.
    tooltipSize.value = {
      width: el.offsetWidth,
      height: el.offsetHeight,
    }
  }
})

watch(step, async () => {
  // When step changes, content changes, so we need to get the new size.
  // We wait for the DOM to update with the new content.
  await nextTick()
  if (tooltipRef.value) {
    tooltipSize.value = {
      width: tooltipRef.value.offsetWidth,
      height: tooltipRef.value.offsetHeight,
    }
  }
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
  if (!targetRect.value || !step.value || !tooltipSize.value.width) {
    return { opacity: 0 } // Hide until we can calculate position
  }

  const position = step.value.position || 'bottom'
  const spacing = 20
  const viewportPadding = 16
  const { width: ttWidth, height: ttHeight } = tooltipSize.value

  let top = 0
  let left = 0
  let transform = ''

  // 1. Calculate ideal initial position
  switch (position) {
    case 'bottom':
      top = targetRect.value.bottom + spacing
      left = targetRect.value.left + targetRect.value.width / 2
      transform = 'translate(-50%, 0)'
      break
    case 'top':
      top = targetRect.value.top - spacing
      left = targetRect.value.left + targetRect.value.width / 2
      transform = 'translate(-50%, -100%)'
      break
    case 'right':
      top = targetRect.value.top + targetRect.value.height / 2
      left = targetRect.value.right + spacing
      transform = 'translate(0, -50%)'
      break
    case 'left':
      top = targetRect.value.top + targetRect.value.height / 2
      left = targetRect.value.left - spacing
      transform = 'translate(-100%, -50%)'
      break
  }

  // 2. Calculate the tooltip's final boundaries after transform
  let finalLeft, finalTop
  switch (position) {
    case 'bottom':
      finalLeft = left - ttWidth / 2
      finalTop = top
      break
    case 'top':
      finalLeft = left - ttWidth / 2
      finalTop = top - ttHeight
      break
    case 'right':
      finalLeft = left
      finalTop = top - ttHeight / 2
      break
    case 'left':
      finalLeft = left - ttWidth
      finalTop = top - ttHeight / 2
      break
  }

  // 3. Adjust `top` and `left` to keep the tooltip inside the viewport
  const rightBoundary = window.innerWidth - viewportPadding
  const bottomBoundary = window.innerHeight - viewportPadding

  if (finalLeft < viewportPadding) {
    left += viewportPadding - finalLeft
  }
  if (finalLeft + ttWidth > rightBoundary) {
    left -= finalLeft + ttWidth - rightBoundary
  }
  if (finalTop < viewportPadding) {
    top += viewportPadding - finalTop
  }
  if (finalTop + ttHeight > bottomBoundary) {
    top -= finalTop + ttHeight - bottomBoundary
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform,
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
