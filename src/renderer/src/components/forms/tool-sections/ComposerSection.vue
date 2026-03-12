<template>
  <div class="p-6 space-y-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img src="@/assets/svg/composer.svg" alt="Composer" class="w-8 h-8" />
      <span>{{ t('sectionComposerTitle') }}</span>
    </h3>

    <ToolCard
      name="Composer"
      :icon="composerIcon"
      :version="installedTools?.composer?.version"
      :is-installed="installedTools?.composer?.installed"
      :description="t('composerDescription')"
      color="amber"
      :is-loading="isInstalling"
      :loading-type="loadingType"
      :locale="locale"
      @install="handleInstallComposer"
    />

    <AlertNotification
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
      @close="status.hideStatus"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../../composables/useStatus'
import ToolCard from '../../common/ToolCard.vue'
import AlertNotification from '../../common/AlertNotification.vue'

const { t, locale } = useI18n()
const status = useStatus()

const composerIcon = new URL('../../../assets/svg/composer.svg', import.meta.url).href

const props = defineProps({
  installedTools: {
    type: Object,
    required: true,
  },
  onInstallComposer: {
    type: Function,
    required: true,
  },
})

const isInstalling = ref(false)
const loadingType = ref('')

async function handleInstallComposer() {
  loadingType.value = 'install'
  isInstalling.value = true
  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង Composer...' : 'Installing Composer...',
    'info'
  )

  try {
    await props.onInstallComposer()
    status.showStatus(
      locale.value === 'km' ? 'Composer បានដំឡើងជោគជ័យ' : 'Composer installed successfully',
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  } finally {
    isInstalling.value = false
    loadingType.value = ''
  }
}
</script>
