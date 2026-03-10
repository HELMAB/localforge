<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-if="onboarding.isActive.value" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black bg-opacity-60" />

        <div
          v-if="currentTarget"
          :style="spotlightStyle"
          class="absolute pointer-events-none border-4 border-blue-500 rounded-lg shadow-2xl transition-all duration-300"
        />

        <div
          v-if="step"
          ref="tooltipRef"
          :style="tooltipStyle"
          class="absolute bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md z-10 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ step.title }}</h3>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="onboarding.skip"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ step.content }}</p>

          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ step.stepNumber }} / {{ step.totalSteps }}
            </div>

            <div class="flex gap-2">
              <Button
                v-if="onboarding.currentStep.value > 0"
                variant="ghost"
                size="sm"
                @click="onboarding.previous"
              >
                {{ t('previous') }}
              </Button>
              <Button size="sm" @click="onboarding.next">
                {{
                  onboarding.currentStep.value < onboarding.steps.length - 1
                    ? t('next')
                    : t('finish')
                }}
              </Button>
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
import { X } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'
import { Button } from '@/components/ui/button'

const { t, locale } = useI18n()
const onboarding = useOnboarding()

const currentTarget = ref(null)
const targetRect = ref(null)
const tooltipRef = ref(null)
const tooltipSize = ref({ width: 0, height: 0 })

const step = computed(() => onboarding.getCurrentStep(locale.value))

watch(tooltipRef, (el) => {
  if (el) {
    tooltipSize.value = { width: el.offsetWidth, height: el.offsetHeight }
  }
})

watch(step, async () => {
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
  if (!targetRect.value || !step.value || !tooltipSize.value.width) return { opacity: 0 }

  const position = step.value.position || 'bottom'
  const spacing = 20
  const viewportPadding = 16
  const { width: ttWidth, height: ttHeight } = tooltipSize.value

  let top = 0,
    left = 0,
    transform = ''

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

  const rightBoundary = window.innerWidth - viewportPadding
  const bottomBoundary = window.innerHeight - viewportPadding

  if (finalLeft < viewportPadding) left += viewportPadding - finalLeft
  if (finalLeft + ttWidth > rightBoundary) left -= finalLeft + ttWidth - rightBoundary
  if (finalTop < viewportPadding) top += viewportPadding - finalTop
  if (finalTop + ttHeight > bottomBoundary) top -= finalTop + ttHeight - bottomBoundary

  return { top: `${top}px`, left: `${left}px`, transform }
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
    if (active) setTimeout(updateTargetPosition, 100)
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
