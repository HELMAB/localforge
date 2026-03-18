<template>
  <div id="app" class="flex h-screen overflow-hidden">
    <AppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto">
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

      <AppFooter />
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

    <AboutModal
      :visible="showAbout"
      app-name="LocalForge"
      version="1.0.4"
      :description="t('appTagline')"
      @close="showAbout = false"
    />

    <CommandPalette v-model="showCommandPalette" />

    <WelcomeDialog v-if="showWelcome" @start-tour="handleStartTour" @skip="handleSkipTour" />

    <OnboardingTour />

    <OperationMonitor />

    <ProgressBar
      :is-loading="progress.isLoading.value"
      :progress="Math.round(progress.progress.value)"
      :message="progress.message.value"
    />

    <Toaster />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppFooter from './components/layout/AppFooter.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import ErrorModal from './components/common/ErrorModal.vue'
import AboutModal from './components/common/AboutModal.vue'
import CommandPalette from './components/common/CommandPalette.vue'
import WelcomeDialog from './components/common/WelcomeDialog.vue'
import OnboardingTour from './components/common/OnboardingTour.vue'
import OperationMonitor from './components/common/OperationMonitor.vue'
import ProgressBar from './components/common/ProgressBar.vue'
import { Toaster } from './components/ui/toast'
import { useSettings } from './composables/useSettings'
import { useErrorModal } from './composables/useErrorModal'
import { useOnboarding } from './composables/useOnboarding'
import { useOperationControl } from './composables/useOperationControl'
import { useMenuNavigation } from './composables/useMenuNavigation'
import { useToast } from './composables/useToast'
import { useProgress } from './composables/useProgress'

const { ipcRenderer } = window.require('electron')
const router = useRouter()
const { locale, t } = useI18n()
const { settings } = useSettings()
const errorModal = useErrorModal()
const onboarding = useOnboarding()
const operations = useOperationControl()
const { setMenuActiveView } = useMenuNavigation()
const toast = useToast()
const progress = useProgress()
const showCommandPalette = ref(false)
const showWelcome = ref(false)
const showAbout = ref(false)

const handleStartTour = () => {
  onboarding.start()
}

const handleSkipTour = () => {
  onboarding.complete()
}

// Watch locale changes and sync to main process
watch(locale, (newLocale) => {
  ipcRenderer.send('language-changed', newLocale)
})

onMounted(() => {
  locale.value = settings.value.language || 'km'

  // Sync initial state to main process for menu labels
  ipcRenderer.send('language-changed', locale.value)

  // Listen for native menu IPC events
  ipcRenderer.on('navigate', (_event, path, subView) => {
    router.push(path)
    if (subView) {
      setMenuActiveView(subView)
    }
  })

  ipcRenderer.on('show-about', () => {
    showAbout.value = true
  })

  ipcRenderer.on('restart-app', () => {
    ipcRenderer.invoke('restart-app')
  })

  ipcRenderer.on('check-updates', async () => {
    try {
      const result = await ipcRenderer.invoke('check-for-updates')
      if (result && result.updateInfo) {
        toast.info(`${t('updateAvailable')}: v${result.updateInfo.version}`)
      } else {
        toast.info(t('noUpdates'))
      }
    } catch (error) {
      toast.info(t('noUpdates'))
    }
  })

  // Show welcome dialog for first-time users
  setTimeout(() => {
    if (onboarding.shouldShow.value) {
      showWelcome.value = true
    }
  }, 500)

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
provide('progress', progress)
</script>
