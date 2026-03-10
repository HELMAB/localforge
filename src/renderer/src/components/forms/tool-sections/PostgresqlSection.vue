<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img src="@/assets/svg/postgresql.svg" alt="PostgreSQL" class="w-8 h-8" />
      <span>{{ t('sectionPostgresqlTitle') }}</span>
    </h3>

    <div
      class="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-3">
        {{ t('postgresqlInstalledTitle') }}
      </h4>
      <div v-if="installedTools && installedTools.postgresql.installed">
        <div
          class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-blue-300 dark:border-blue-700"
        >
          <span class="font-medium text-blue-700 dark:text-blue-400"
            >PostgreSQL {{ installedTools.postgresql.version || '' }}</span
          >
          <span
            class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded"
            >{{ t('installed') }}</span
          >
        </div>
      </div>
      <p v-else class="text-sm text-gray-600 dark:text-gray-400">
        {{ t('notInstalled') }}
      </p>
    </div>

    <div
      class="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-3">
        {{ t('postgresqlInstallTitle') }}
      </h4>
      <div class="space-y-3">
        <div>
          <Label class="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">{{
            t('postgresLabel')
          }}</Label>
          <Input v-model="postgresVersion" type="text" placeholder="16" />
        </div>
        <Button
          :disabled="installedTools && installedTools.postgresql.installed"
          @click="handleInstallPostgreSQL"
        >
          {{ t('postgresBtn') }}
        </Button>
      </div>
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../../composables/useStatus'
import AlertNotification from '../../common/AlertNotification.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { t, locale } = useI18n()
const status = useStatus()

const props = defineProps({
  installedTools: {
    type: Object,
    required: true,
  },
  onInstallPostgresql: {
    type: Function,
    required: true,
  },
})

const postgresVersion = ref('')

async function handleInstallPostgreSQL() {
  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង PostgreSQL...' : 'Installing PostgreSQL...',
    'info'
  )

  try {
    await props.onInstallPostgresql(postgresVersion.value || null)
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
