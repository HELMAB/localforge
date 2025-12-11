<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img
        src="@/assets/svg/php.svg"
        alt="PHP"
        class="w-8 h-8"
      >
      <span>{{ t('sectionPhpTitle') }}</span>
    </h3>

    <!-- Installed PHP Versions -->
    <div class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
      <h4 class="font-semibold text-green-800 dark:text-green-300 mb-3">
        {{ t('phpInstalledTitle') }}
      </h4>
      <div
        v-if="installedTools && installedTools.php.installed"
        class="space-y-2"
      >
        <div
          v-for="version in installedTools.php.versions"
          :key="version"
          class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700"
        >
          <span class="font-medium text-green-700 dark:text-green-400">PHP {{ version }}</span>
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

    <!-- Install PHP Version -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {{ t('phpInstallTitle') }}
      </h4>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('phpInstallLabel') }}</label>
          <CustomSelect
            v-model="phpInstallVersion"
            :options="phpVersionOptions"
          />
        </div>
        <button
          class="px-6 py-2 bg-purple-500 dark:bg-purple-600 text-white rounded-lg hover:bg-purple-600 dark:hover:bg-purple-700 font-medium transition-colors"
          @click="handleInstallPHP"
        >
          {{ t('phpInstallBtn') }}
        </button>
      </div>
    </div>

    <!-- Install PHP Extensions -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {{ t('phpExtTitle') }}
      </h4>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            {{ t('phpExtVersionLabel') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="phpExtVersion"
            type="text"
            placeholder="8.3"
            class="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            {{ t('phpExtNameLabel') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="phpExtName"
            type="text"
            placeholder="mbstring, curl, xml"
            class="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
        </div>
        <button
          class="px-6 py-2 bg-purple-400 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-500 dark:hover:bg-purple-600 font-medium transition-colors"
          @click="handleInstallPHPExtensions"
        >
          {{ t('phpExtBtn') }}
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
import CustomSelect from '../../common/CustomSelect.vue'
import phpIcon from '@/assets/svg/php.svg'

const { t, locale } = useI18n()
const status = useStatus()

const props = defineProps({
  installedTools: {
    type: Object,
    required: true
  },
  onInstallPHP: {
    type: Function,
    required: true
  },
  onInstallPHPExtensions: {
    type: Function,
    required: true
  }
})

const phpInstallVersion = ref('8.3')
const phpExtVersion = ref('')
const phpExtName = ref('')

const phpVersionOptions = [
  { value: '8.4', label: 'PHP 8.4', icon: phpIcon },
  { value: '8.3', label: 'PHP 8.3', icon: phpIcon },
  { value: '8.2', label: 'PHP 8.2', icon: phpIcon },
  { value: '8.1', label: 'PHP 8.1', icon: phpIcon },
  { value: '8.0', label: 'PHP 8.0', icon: phpIcon }
]

async function handleInstallPHP() {
  if (!phpInstallVersion.value) {
    status.showStatus(
      locale.value === 'km' ? 'សូមជ្រើសរើសកំណែ PHP' : 'Please select PHP version',
      'error'
    )
    return
  }

  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង PHP...' : 'Installing PHP...',
    'info'
  )

  try {
    await props.onInstallPHP(phpInstallVersion.value)
    status.showStatus(
      locale.value === 'km'
        ? `PHP ${phpInstallVersion.value} បានដំឡើងជោគជ័យ`
        : `PHP ${phpInstallVersion.value} installed successfully`,
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}

async function handleInstallPHPExtensions() {
  if (!phpExtVersion.value || !phpExtName.value) {
    status.showStatus(
      locale.value === 'km'
        ? 'សូមបំពេញកំណែ និងឈ្មោះផ្នែកបន្ថែម'
        : 'Please fill version and extension names',
      'error'
    )
    return
  }

  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើងផ្នែកបន្ថែម...' : 'Installing extensions...',
    'info'
  )

  try {
    await props.onInstallPHPExtensions(phpExtVersion.value, phpExtName.value)
    status.showStatus(
      locale.value === 'km'
        ? 'ផ្នែកបន្ថែមបានដំឡើងជោគជ័យ'
        : 'Extensions installed successfully',
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
