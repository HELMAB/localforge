<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <img
        src="@/assets/svg/nginx.svg"
        alt="Nginx"
        class="w-8 h-8"
      >
      <span>{{ t('sectionNginxTitle') }}</span>
    </h3>

    <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="font-semibold text-green-800 mb-3">
        {{ t('nginxInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.nginx.installed">
        <div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">Nginx {{ installedTools.nginx.version || '' }}</span>
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

    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 mb-3">
        {{ t('nginxInstallTitle') }}
      </h4>
      <p class="text-sm text-gray-600 mb-3">
        {{ t('nginxInstallDesc') }}
      </p>
      <button
        :disabled="installedTools && installedTools.nginx.installed"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleInstallNginx"
      >
        {{ t('nginxInstallBtn') }}
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
  onInstallNginx: {
    type: Function,
    required: true
  }
})

async function handleInstallNginx() {
  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង Nginx...' : 'Installing Nginx...',
    'info'
  )

  try {
    await props.onInstallNginx()
    status.showStatus(
      locale.value === 'km' ? 'Nginx បានដំឡើងជោគជ័យ' : 'Nginx installed successfully',
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
