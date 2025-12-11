<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img
        src="@/assets/svg/mysql.svg"
        alt="MySQL"
        class="w-8 h-8"
      >
      <span>{{ t('sectionMysqlTitle') }}</span>
    </h3>

    <div class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
      <h4 class="font-semibold text-green-800 dark:text-green-300 mb-3">
        {{ t('mysqlInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.mysql.installed">
        <div class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700">
          <span class="font-medium text-green-700 dark:text-green-400">MySQL {{ installedTools.mysql.version || '' }}</span>
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

    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {{ t('mysqlInstallTitle') }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {{ t('mysqlInstallDesc') }}
      </p>
      <button
        :disabled="installedTools && installedTools.mysql.installed"
        class="px-6 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="handleInstallMySQL"
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
  installedTools: {
    type: Object,
    required: true
  },
  onInstallMySQL: {
    type: Function,
    required: true
  }
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
