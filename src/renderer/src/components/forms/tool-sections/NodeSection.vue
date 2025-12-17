<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
      <img
        src="@/assets/svg/nodejs.svg"
        alt="Node.js"
        class="w-8 h-8"
      >
      <span>{{ t('sectionNodeTitle') }}</span>
    </h3>

    <!-- Installed Node Versions -->
    <div
      class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-green-800 dark:text-green-300 mb-3">
        {{ t('nodeInstalledTitle') }}
      </h4>
      <div
        v-if="installedTools && installedTools.node.installed"
        class="space-y-2"
      >
        <div
          v-for="version in installedTools.node.versions"
          :key="version"
          class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700"
        >
          <span class="font-medium text-green-700 dark:text-green-400">Node.js {{ version }}</span>
          <span
            :class="[
              'text-xs px-2 py-1 rounded',
              installedTools.node.default === version
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
            ]"
          >
            {{ installedTools.node.default === version ? 'Default' : t('installed') }}
          </span>
        </div>
      </div>
      <p
        v-else
        class="text-sm text-gray-600 dark:text-gray-400"
      >
        {{ t('notInstalled') }}
      </p>
    </div>

    <!-- Install Node Version -->
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4"
    >
      <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {{ t('nodeInstallTitle') }}
      </h4>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            {{ t('nodeInstallLabel') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="nodeInstallVersion"
            type="text"
            placeholder="20.10.0, lts, or latest"
            class="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
        </div>
        <button
          class="px-6 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 font-medium transition-colors"
          @click="handleInstallNode"
        >
          {{ t('nodeInstallBtn') }}
        </button>
      </div>
    </div>

    <!-- Set Default Node -->
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
    >
      <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {{ t('nodeDefaultTitle') }}
      </h4>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            {{ t('nodeDefaultLabel') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="nodeDefaultVersion"
            type="text"
            placeholder="20, lts"
            class="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
        </div>
        <button
          class="px-6 py-2 bg-green-400 dark:bg-green-500 text-white rounded-lg hover:bg-green-500 dark:hover:bg-green-600 font-medium transition-colors"
          @click="handleSetDefaultNode"
        >
          {{ t('nodeDefaultBtn') }}
        </button>
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

const { t, locale } = useI18n()
const status = useStatus()

const props = defineProps({
  installedTools: {
    type: Object,
    required: true,
  },
  onInstallNode: {
    type: Function,
    required: true,
  },
  onSetDefaultNode: {
    type: Function,
    required: true,
  },
})

const nodeInstallVersion = ref('')
const nodeDefaultVersion = ref('')

async function handleInstallNode() {
  if (!nodeInstallVersion.value) {
    status.showStatus(
      locale.value === 'km' ? 'សូមបញ្ចូលកំណែ Node.js' : 'Please enter Node.js version',
      'error'
    )
    return
  }

  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង Node.js...' : 'Installing Node.js...',
    'info'
  )

  try {
    await props.onInstallNode(nodeInstallVersion.value)
    status.showStatus(
      locale.value === 'km'
        ? `Node.js ${nodeInstallVersion.value} បានដំឡើងជោគជ័យ`
        : `Node.js ${nodeInstallVersion.value} installed successfully`,
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}

async function handleSetDefaultNode() {
  if (!nodeDefaultVersion.value) {
    status.showStatus(
      locale.value === 'km' ? 'សូមបញ្ចូលកំណែ Node.js' : 'Please enter Node.js version',
      'error'
    )
    return
  }

  status.showStatus(
    locale.value === 'km' ? 'កំពុងកំណត់កំណែលំនាំដើម...' : 'Setting default version...',
    'info'
  )

  try {
    await props.onSetDefaultNode(nodeDefaultVersion.value)
    status.showStatus(
      locale.value === 'km'
        ? `Node.js ${nodeDefaultVersion.value} បានកំណត់ជាលំនាំដើម`
        : `Node.js ${nodeDefaultVersion.value} set as default`,
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
