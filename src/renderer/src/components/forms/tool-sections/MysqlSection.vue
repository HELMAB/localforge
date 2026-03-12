<template>
  <div class="p-6 space-y-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img src="@/assets/svg/mysql.svg" alt="MySQL" class="w-8 h-8" />
      <span>{{ t('sectionMysqlTitle') }}</span>
    </h3>

    <ToolCard
      name="MySQL"
      :icon="mysqlIcon"
      :version="installedTools?.mysql?.version"
      :is-installed="installedTools?.mysql?.installed"
      :description="t('mysqlDescription')"
      color="sky"
      :is-loading="isInstalling"
      :loading-type="loadingType"
      :locale="locale"
      @install="handleInstallMySQL"
    />

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

const { t, locale } = useI18n()
const status = useStatus()

const mysqlIcon = new URL('../../../assets/svg/mysql.svg', import.meta.url).href

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

const isInstalling = ref(false)
const loadingType = ref('')

async function handleInstallMySQL() {
  loadingType.value = 'install'
  isInstalling.value = true
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
  } finally {
    isInstalling.value = false
    loadingType.value = ''
  }
}
</script>
