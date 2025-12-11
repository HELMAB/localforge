<template>
  <div class="p-6">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <span>🟢</span>
      <span>{{ t('sectionNodeTitle') }}</span>
    </h3>

    <!-- Installed Node Versions -->
    <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="font-semibold text-green-800 mb-3">{{ t('nodeInstalledTitle') }}</h4>
      <div v-if="installedTools && installedTools.node.installed" class="space-y-2">
        <div
          v-for="version in installedTools.node.versions"
          :key="version"
          class="flex items-center justify-between bg-white p-3 rounded border border-green-300"
        >
          <span class="font-medium text-green-700">Node.js {{ version }}</span>
          <span
            :class="[
              'text-xs px-2 py-1 rounded',
              installedTools.node.default === version
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            ]"
          >
            {{ installedTools.node.default === version ? 'Default' : t('installed') }}
          </span>
        </div>
      </div>
      <p v-else class="text-sm text-gray-600">{{ t('notInstalled') }}</p>
    </div>

    <!-- Install Node Version -->
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-gray-800 mb-3">{{ t('nodeInstallTitle') }}</h4>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-2">{{ t('nodeInstallLabel') }}</label>
          <input
            v-model="nodeInstallVersion"
            type="text"
            placeholder="20.10.0, lts, or latest"
            class="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          @click="handleInstallNode"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
        >
          {{ t('nodeInstallBtn') }}
        </button>
      </div>
    </div>

    <!-- Set Default Node -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 mb-3">{{ t('nodeDefaultTitle') }}</h4>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-2">{{ t('nodeDefaultLabel') }}</label>
          <input
            v-model="nodeDefaultVersion"
            type="text"
            placeholder="20, lts"
            class="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          @click="handleSetDefaultNode"
          class="px-6 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 font-medium"
        >
          {{ t('nodeDefaultBtn') }}
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
  installedTools: Object,
  onInstallNode: Function,
  onSetDefaultNode: Function
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
