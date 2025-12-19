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

    <div
      class="mb-6 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-sky-800 dark:text-sky-300 mb-3">
        {{ t('mysqlInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.mysql.installed">
        <div
          class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-sky-300 dark:border-sky-700"
        >
          <span class="font-medium text-sky-700 dark:text-sky-400">MySQL {{ installedTools.mysql.version || '' }}</span>
          <span
            class="text-xs px-2 py-1 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded"
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
      class="bg-sky-50 dark:bg-gray-800 border border-sky-200 dark:border-sky-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-sky-800 dark:text-sky-300 mb-3">
        {{ t('mysqlInstallTitle') }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {{ t('mysqlInstallDesc') }}
      </p>
      <button
        :disabled="installedTools && installedTools.mysql.installed"
        class="px-6 py-2 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="handleInstallMySQL"
      >
        {{ t('mysqlBtn') }}
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
  onInstallMysql: {
    type: Function,
    required: true,
  },
})

async function handleInstallMySQL() {
  status.showStatus(locale.value === 'km' ? 'កំពុងដំឡើង MySQL...' : 'Installing MySQL...', 'info')

  try {
    await props.onInstallMysql()
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
