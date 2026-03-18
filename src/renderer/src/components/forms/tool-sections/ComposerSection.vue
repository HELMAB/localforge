<template>
  <div class="p-6 space-y-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img src="@/assets/svg/composer.svg" alt="Composer" class="w-8 h-8" />
      <span>{{ t('sectionComposerTitle') }}</span>
    </h3>

    <ToolCard
      name="Composer"
      :icon="composerIcon"
      :version="installedTools?.composer?.version"
      :is-installed="installedTools?.composer?.installed"
      :description="t('composerDescription')"
      color="amber"
      :is-loading="isInstalling"
      :loading-type="loadingType"
      :locale="locale"
      @install="handleInstallComposer"
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

const composerIcon = new URL('../../../assets/svg/composer.svg', import.meta.url).href

const props = defineProps({
  installedTools: {
    type: Object,
    required: true,
  },
  onInstallComposer: {
    type: Function,
    required: true,
  },
})

const isInstalling = ref(false)
const loadingType = ref('')

async function handleInstallComposer() {
  loadingType.value = 'install'
  isInstalling.value = true
  toast.info(locale.value === 'km' ? 'កំពុងដំឡើង Composer...' : 'Installing Composer...')

  try {
    await props.onInstallComposer()
    toast.success(
      locale.value === 'km' ? 'Composer បានដំឡើងជោគជ័យ' : 'Composer installed successfully'
    )
  } catch (error) {
    const tip =
      locale.value === 'km'
        ? 'ត្រូវប្រាកដថា PHP បានដំឡើង និងមានការតភ្ជាប់អ៊ីនធឺណិត'
        : 'Ensure PHP is installed and internet connection is available'
    toast.error(`${error.message} — ${tip}`, {
      title:
        locale.value === 'km' ? 'បរាជ័យក្នុងការដំឡើង Composer' : 'Composer Installation Failed',
    })
  } finally {
    isInstalling.value = false
    loadingType.value = ''
  }
}
</script>
