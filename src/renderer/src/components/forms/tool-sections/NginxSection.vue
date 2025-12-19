<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img
        src="@/assets/svg/nginx.svg"
        alt="Nginx"
        class="w-8 h-8"
      >
      <span>{{ t('sectionNginxTitle') }}</span>
    </h3>

    <div
      class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-green-800 dark:text-green-300 mb-3">
        {{ t('nginxInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.nginx.installed">
        <div
          class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700"
        >
          <span class="font-medium text-green-700 dark:text-green-400">Nginx {{ installedTools.nginx.version || '' }}</span>
          <span
            class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded"
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

    <div
      class="bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-green-800 dark:text-green-300 mb-3">
        {{ t('nginxInstallTitle') }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {{ t('nginxInstallDesc') }}
      </p>
      <button
        :disabled="installedTools && installedTools.nginx.installed"
        class="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="handleInstallNginx"
      >
        {{ t('nginxInstallBtn') }}
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
  onInstallNginx: {
    type: Function,
    required: true,
  },
})

async function handleInstallNginx() {
  status.showStatus(locale.value === 'km' ? 'កំពុងដំឡើង Nginx...' : 'Installing Nginx...', 'info')

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
