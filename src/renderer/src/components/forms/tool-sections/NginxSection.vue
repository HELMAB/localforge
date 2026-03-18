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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '../../../composables/useToast'
import ToolCard from '../../common/ToolCard.vue'

const { t, locale } = useI18n()
const toast = useToast()

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
  toast.info(locale.value === 'km' ? 'កំពុងដំឡើង Nginx...' : 'Installing Nginx...')

  try {
    await props.onInstallNginx()
    toast.success(locale.value === 'km' ? 'Nginx បានដំឡើងជោគជ័យ' : 'Nginx installed successfully')
  } catch (error) {
    const tip =
      locale.value === 'km'
        ? 'ពិនិត្យ sudo access និងប្រាកដថា port 80/443 ទំនេរ'
        : 'Check sudo access and ensure ports 80/443 are available'
    toast.error(`${error.message} — ${tip}`, {
      title: locale.value === 'km' ? 'បរាជ័យក្នុងការដំឡើង Nginx' : 'Nginx Installation Failed',
    })
  } finally {
    isInstalling.value = false
    loadingType.value = ''
  }
}
</script>
