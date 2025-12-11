<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <img
        src="@/assets/svg/postgresql.svg"
        alt="PostgreSQL"
        class="w-8 h-8"
      >
      <span>{{ t('sectionPostgresqlTitle') }}</span>
    </h3>

    <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="font-semibold text-green-800 mb-3">
        {{ t('postgresqlInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.postgresql.installed">
        <div class="flex items-center justify-between bg-white p-3 rounded border border-green-300">
          <span class="font-medium text-green-700">PostgreSQL {{ installedTools.postgresql.version || '' }}</span>
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
        {{ t('postgresqlInstallTitle') }}
      </h4>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-2">{{ t('postgresLabel') }}</label>
          <input
            v-model="postgresVersion"
            type="text"
            placeholder="16"
            class="w-full px-3 py-2 border rounded-lg"
          >
        </div>
        <button
          :disabled="installedTools && installedTools.postgresql.installed"
          class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleInstallPostgreSQL"
        >
          {{ t('postgresBtn') }}
        </button>
      </div>
    </div>

    <StatusMessage
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
  onInstallPostgreSQL: {
    type: Function,
    required: true
  }
})

const postgresVersion = ref('')

async function handleInstallPostgreSQL() {
  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង PostgreSQL...' : 'Installing PostgreSQL...',
    'info'
  )

  try {
    await props.onInstallPostgreSQL(postgresVersion.value || null)
    status.showStatus(
      locale.value === 'km' ? 'PostgreSQL បានដំឡើងជោគជ័យ' : 'PostgreSQL installed successfully',
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
