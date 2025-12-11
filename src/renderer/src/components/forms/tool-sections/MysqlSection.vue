<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <span>🐬</span>
      <span>{{ t('sectionMysqlTitle') }}</span>
    </h3>

    <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="font-semibold text-green-800 mb-3">{{ t('mysqlInstalledTitle') }}</h4>
      <div v-if="installedTools && installedTools.mysql.installed">
        <div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">MySQL {{ installedTools.mysql.version || '' }}</span>
          <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">{{ t('installed') }}</span>
        </div>
      </div>
      <p v-else class="text-sm text-gray-600">{{ t('notInstalled') }}</p>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 mb-3">{{ t('mysqlInstallTitle') }}</h4>
      <p class="text-sm text-gray-600 mb-3">{{ t('mysqlInstallDesc') }}</p>
      <button
        @click="handleInstallMySQL"
        :disabled="installedTools && installedTools.mysql.installed"
        class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ t('mysqlBtn') }}
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
  installedTools: Object,
  onInstallMySQL: Function
})

async function handleInstallMySQL() {
  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង MySQL...' : 'Installing MySQL...',
    'info'
  )

  try {
    await props.onInstallMySQL()
    status.showStatus(
      locale.value === 'km' ? 'MySQL បានដំឡើងជោគជ័យ' : 'MySQL installed successfully',
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
