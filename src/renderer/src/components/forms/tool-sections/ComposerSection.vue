<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img
        src="@/assets/svg/composer.svg"
        alt="Composer"
        class="w-8 h-8"
      >
      <span>{{ t('sectionComposerTitle') }}</span>
    </h3>

    <!-- Installed Composer -->
    <div class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
      <h4 class="font-semibold text-green-800 dark:text-green-300 mb-3">
        {{ t('composerInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.composer.installed">
        <div class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700">
          <span class="font-medium text-green-700 dark:text-green-400">Composer {{ installedTools.composer.version || '' }}</span>
          <span class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">{{ t('installed') }}</span>
        </div>
      </div>
      <p
        v-else
        class="text-sm text-gray-600 dark:text-gray-400"
      >
        {{ t('notInstalled') }}
      </p>
    </div>

    <!-- Install Composer -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {{ t('composerInstallTitle') }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {{ t('composerInstallDesc') }}
      </p>
      <button
        :disabled="installedTools && installedTools.composer.installed"
        class="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="handleInstallComposer"
      >
        {{ t('composerInstallBtn') }}
      </button>
    </div>

    <StatusMessage
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../../composables/useStatus'
import StatusMessage from '../../common/StatusMessage.vue'

const { t, locale } = useI18n()
const status = useStatus()

const props = defineProps({
  installedTools: {
    type: Object,
    required: true
  },
  onInstallComposer: {
    type: Function,
    required: true
  }
})

async function handleInstallComposer() {
  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង Composer...' : 'Installing Composer...',
    'info'
  )

  try {
    await props.onInstallComposer()
    status.showStatus(
      locale.value === 'km'
        ? 'Composer បានដំឡើងជោគជ័យ'
        : 'Composer installed successfully',
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}
</script>
