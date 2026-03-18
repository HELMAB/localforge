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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '../../../composables/useToast'
import ToolCard from '../../common/ToolCard.vue'

const { t, locale } = useI18n()
const toast = useToast()

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
  toast.info(locale.value === 'km' ? 'កំពុងដំឡើង MySQL...' : 'Installing MySQL...')

  try {
    await props.onInstallMysql()
    toast.success(
      locale.value === 'km' ? 'MySQL បានដំឡើងជោគជ័យ' : 'MySQL installed successfully'
    )
  } catch (error) {
    const tip =
      locale.value === 'km'
        ? 'ពិនិត្យ sudo access និងប្រាកដថា port 3306 ទំនេរ'
        : 'Check sudo access and ensure port 3306 is available'
    toast.error(`${error.message} — ${tip}`, {
      title: locale.value === 'km' ? 'បរាជ័យក្នុងការដំឡើង MySQL' : 'MySQL Installation Failed',
    })
  } finally {
    isInstalling.value = false
    loadingType.value = ''
  }
}
</script>
