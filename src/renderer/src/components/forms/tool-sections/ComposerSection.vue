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
    <div
      class="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-amber-800 dark:text-amber-300 mb-3">
        {{ t('composerInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.composer.installed">
        <div
          class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-amber-300 dark:border-amber-700"
        >
          <span class="font-medium text-amber-700 dark:text-amber-400">Composer {{ installedTools.composer.version || '' }}</span>
          <span
            class="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded"
          >{{ t('installed') }}</span>
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
    <div
      class="bg-amber-50 dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-amber-800 dark:text-amber-300 mb-3">
        {{ t('composerInstallTitle') }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {{ t('composerInstallDesc') }}
      </p>
      <button
        :disabled="installedTools && installedTools.composer.installed"
        class="px-6 py-2 bg-amber-600 dark:bg-amber-700 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="handleInstallComposer"
      >
        {{ t('composerInstallBtn') }}
      </button>
    </div>

    <AlertNotification
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
      @close="status.hideStatus"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../../composables/useStatus'
import AlertNotification from '../../common/AlertNotification.vue'

const { t, locale } = useI18n()
const status = useStatus()

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

async function handleInstallComposer() {
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
  }
}
</script>
