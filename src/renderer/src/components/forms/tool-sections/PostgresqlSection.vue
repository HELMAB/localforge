<template>
  <div class="p-6 space-y-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img src="@/assets/svg/postgresql.svg" alt="PostgreSQL" class="w-8 h-8" />
      <span>{{ t('sectionPostgresqlTitle') }}</span>
    </h3>

    <ToolCard
      name="PostgreSQL"
      :icon="postgresqlIcon"
      :version="installedTools?.postgresql?.version"
      :is-installed="installedTools?.postgresql?.installed"
      :description="t('postgresqlDescription')"
      color="blue"
      :is-loading="isInstalling"
      :loading-type="loadingType"
      :locale="locale"
      @install="handleInstallPostgreSQL"
    />

    <div v-if="!installedTools?.postgresql?.installed" class="mt-4">
      <Label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ t('postgresLabel') }}
      </Label>
      <Input
        v-model="postgresVersion"
        type="text"
        placeholder="16"
        :disabled="isInstalling"
        class="max-w-xs"
      />
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
import ToolCard from '../../common/ToolCard.vue'
import AlertNotification from '../../common/AlertNotification.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { t, locale } = useI18n()
const status = useStatus()

const postgresqlIcon = new URL('../../../assets/svg/postgresql.svg', import.meta.url).href

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
const isInstalling = ref(false)
const loadingType = ref('')

async function handleInstallPostgreSQL() {
  loadingType.value = 'install'
  isInstalling.value = true
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
  } finally {
    isInstalling.value = false
    loadingType.value = ''
  }
}
</script>
