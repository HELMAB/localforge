<template>
  <div class="p-6 space-y-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img src="@/assets/svg/nginx.svg" alt="Nginx" class="w-8 h-8" />
      <span>{{ t('sectionNginxTitle') }}</span>
    </h3>

    <ToolCard
      name="Nginx"
      :icon="nginxIcon"
      :version="installedTools?.nginx?.version"
      :is-installed="installedTools?.nginx?.installed"
      :description="t('nginxDescription')"
      color="green"
      :is-loading="isInstalling"
      :loading-type="loadingType"
      :locale="locale"
      @install="handleInstallNginx"
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

const nginxIcon = new URL('../../../assets/svg/nginx.svg', import.meta.url).href

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

const isInstalling = ref(false)
const loadingType = ref('')

async function handleInstallNginx() {
  loadingType.value = 'install'
  isInstalling.value = true
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
  } finally {
    isInstalling.value = false
    loadingType.value = ''
  }
}
</script>
