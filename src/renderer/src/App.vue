<template>
  <div id="app" class="min-h-screen app-bg transition-colors duration-200">
    <div class="mx-auto max-w-[1200px] px-6 pb-10">
      <AppHeader />

      <main class="lg-frame">
        <TabNavigation />

        <div class="p-2 sm:p-3">
          <router-view v-slot="{ Component }">
            <Transition
              mode="out-in"
              enter-active-class="transition-opacity duration-300 ease-in-out"
              enter-from-class="opacity-0"
              leave-active-class="transition-opacity duration-300 ease-in-out"
              leave-to-class="opacity-0"
            >
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </main>

      <div class="mt-6">
        <AppFooter />
      </div>
    </div>

    <ErrorModal
      :visible="errorModal.visible.value"
      :title="errorModal.title.value"
      :subtitle="errorModal.subtitle.value"
      :message="errorModal.message.value"
      :details="errorModal.details.value"
      :suggestions="errorModal.suggestions.value"
      :context="errorModal.context.value"
      :on-retry="errorModal.onRetry.value"
      @close="errorModal.hideError"
    />

    <CommandPalette v-model="showCommandPalette" />

    <WelcomeDialog v-if="showWelcome" @start-tour="handleStartTour" @skip="handleSkipTour" />

    <OnboardingTour />

    <OperationMonitor />

    <Toaster />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from './components/layout/AppHeader.vue'
import TabNavigation from './components/layout/TabNavigation.vue'
import AppFooter from './components/layout/AppFooter.vue'
import ErrorModal from './components/common/ErrorModal.vue'
import CommandPalette from './components/common/CommandPalette.vue'
import WelcomeDialog from './components/common/WelcomeDialog.vue'
import OnboardingTour from './components/common/OnboardingTour.vue'
import OperationMonitor from './components/common/OperationMonitor.vue'
import { Toaster } from './components/ui/toast'
import { useDarkMode } from './composables/useDarkMode'
import { useSettings } from './composables/useSettings'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
import { useErrorModal } from './composables/useErrorModal'
import { useOnboarding } from './composables/useOnboarding'
import { useOperationControl } from './composables/useOperationControl'

const { locale } = useI18n()
const { toggleDarkMode: toggle } = useDarkMode()
const { settings } = useSettings()
const errorModal = useErrorModal()
const onboarding = useOnboarding()
const operations = useOperationControl()
const showCommandPalette = ref(false)
const showWelcome = ref(false)

useKeyboardShortcuts()

const toggleDarkMode = () => {
  toggle()
}

const handleStartTour = () => {
  onboarding.start()
}

const handleSkipTour = () => {
  onboarding.complete()
}

onMounted(() => {
  locale.value = settings.value.language || 'km'

  // Show welcome dialog for first-time users
  setTimeout(() => {
    if (onboarding.shouldShow.value) {
      showWelcome.value = true
    }
  }, 500)

  window.addEventListener('toggle-dark-mode', toggleDarkMode)
  window.addEventListener('toggle-language', () => {
    locale.value = locale.value === 'km' ? 'en' : 'km'
  })

  // Command Palette shortcut (Cmd/Ctrl+K)
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      showCommandPalette.value = !showCommandPalette.value
    }
  })
})

provide('errorModal', errorModal)
provide('operations', operations)
</script>
