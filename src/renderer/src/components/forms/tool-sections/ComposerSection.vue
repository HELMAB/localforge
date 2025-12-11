<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <span>📦</span>
      <span>{{ t('sectionComposerTitle') }}</span>
    </h3>

    <!-- Installed Composer -->
    <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="font-semibold text-green-800 mb-3">
        {{ t('composerInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.composer.installed">
        <div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">Composer {{ installedTools.composer.version || '' }}</span>
          <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">{{ t('installed') }}</span>
        </div>
      </div>
      <p
        v-else
        class="text-sm text-gray-600"
      >
        {{ t('notInstalled') }}
      </p>
    </div>

    <!-- Install Composer -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 mb-3">
        {{ t('composerInstallTitle') }}
      </h4>
      <p class="text-sm text-gray-600 mb-3">
        {{ t('composerInstallDesc') }}
      </p>
      <button
        :disabled="installedTools && installedTools.composer.installed"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
