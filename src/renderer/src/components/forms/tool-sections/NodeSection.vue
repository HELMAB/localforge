<template>
  <div class="p-6">
    <!-- Header with Install Button -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
        <img
          src="@/assets/svg/nodejs.svg"
          alt="Node.js"
          class="w-8 h-8"
        >
        <span>{{ t('sectionNodeTitle') }}</span>
      </h3>
      <button
        class="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
        :disabled="isInstalling"
        :class="{ 'opacity-50 cursor-not-allowed': isInstalling }"
        @click="showInstallModal = true"
      >
        <svg
          v-if="!isInstalling"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ isInstalling ? t('nodeInstallBtn') + '...' : t('nodeInstallBtn') }}
      </button>
    </div>

    <!-- Progress Bar -->
    <div
      v-if="isInstalling"
      class="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
    >
      <div class="flex items-center gap-3">
        <svg
          class="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium text-blue-800 dark:text-blue-300">
            {{ locale === 'km' ? 'កំពុងដំឡើង Node.js...' : 'Installing Node.js...' }}
          </p>
          <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {{ locale === 'km' ? 'សូមរងចាំ នេះអាចចំណាយពេលពីរបីនាទី...' : 'Please wait, this may take a few minutes...' }}
          </p>
        </div>
      </div>
    </div>

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
          v-for="version in filteredNodeVersions"
          :key="version.full"
          class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700"
        >
          <div class="flex items-center gap-3">
            <span class="font-medium text-green-700 dark:text-green-400">Node.js {{ version.major }}</span>
            <span
              v-if="isCurrentVersion(version.full)"
              class="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold"
            >
              {{ t('nodeActiveBadge') }}
            </span>
            <span
              v-if="isDefaultVersion(version.full)"
              class="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
            >
              {{ t('nodeDefaultBadge') }}
            </span>
          </div>
          <DropdownMenu ref="dropdownMenuRef">
            <DropdownMenuItem
              v-if="!isDefaultVersion(version.full)"
              :label="t('nodeSetDefaultAction')"
              icon="check"
              variant="primary"
              @click="confirmSetDefault(version.full)"
            />
            <DropdownMenuItem
              :label="t('nodeDeleteAction')"
              icon="trash"
              variant="danger"
              :disabled="isDefaultVersion(version.full)"
              @click="confirmDelete(version.full)"
            />
          </DropdownMenu>
        </div>
      </div>
      <p
        v-else
        class="text-sm text-gray-600 dark:text-gray-400"
      >
        {{ t('notInstalled') }}
      </p>
    </div>

    <!-- Install Node Modal -->
    <InstallNodeModal
      :visible="showInstallModal"
      :title="t('nodeInstallModalTitle')"
      :message="t('nodeInstallModalMessage')"
      :input-label="t('nodeInstallModalInputLabel')"
      :placeholder="t('nodeInstallModalPlaceholder')"
      :install-text="t('nodeInstallModalInstallBtn')"
      :cancel-text="t('nodeInstallModalCancelBtn')"
      @close="showInstallModal = false"
      @install="handleInstallNode"
    />

    <!-- Output Log Modal -->
    <OutputLogModal
      :visible="showOutputLog"
      :title="t('nodeInstallLogTitle')"
      :subtitle="installComplete ? (installError ? t('nodeInstallLogError') : t('nodeInstallLogComplete')) : t('nodeInstallLogSubtitle')"
      :output="installOutput"
      :is-complete="installComplete"
      :has-error="installError"
      :close-text="t('nodeInstallLogClose')"
      :cancel-text="t('nodeInstallLogCancel')"
      @close="handleCloseOutputLog"
      @cancel="handleCancelInstall"
    />

    <!-- Set Default Confirmation Modal -->
    <ConfirmationModal
      :visible="showSetDefaultConfirm"
      :title="t('nodeSetDefaultConfirmTitle')"
      :message="t('nodeSetDefaultConfirmMessage').replace('{version}', selectedVersion)"
      :confirm-text="t('nodeSetDefaultConfirmBtn')"
      :cancel-text="t('nodeSetDefaultConfirmCancelBtn')"
      level="info"
      @close="showSetDefaultConfirm = false"
      @confirm="handleSetDefaultNode"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :visible="showDeleteConfirm"
      :title="t('nodeDeleteConfirmTitle')"
      :message="t('nodeDeleteConfirmMessage').replace('{version}', selectedVersion)"
      :confirm-text="t('nodeDeleteConfirmBtn')"
      :cancel-text="t('nodeDeleteConfirmCancelBtn')"
      level="danger"
      @close="showDeleteConfirm = false"
      @confirm="handleDeleteNode"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../../composables/useStatus'
import AlertNotification from '../../common/AlertNotification.vue'
import ConfirmationModal from '../../common/ConfirmationModal.vue'
import InstallNodeModal from '../../common/InstallNodeModal.vue'
import OutputLogModal from '../../common/OutputLogModal.vue'
import DropdownMenu from '../../common/DropdownMenu.vue'
import DropdownMenuItem from '../../common/DropdownMenuItem.vue'

const { ipcRenderer } = window.require('electron')

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
  onUninstallNode: {
    type: Function,
    required: true,
  },
})

const showInstallModal = ref(false)
const showOutputLog = ref(false)
const showSetDefaultConfirm = ref(false)
const showDeleteConfirm = ref(false)
const selectedVersion = ref('')
const isInstalling = ref(false)
const installOutput = ref('')
const installComplete = ref(false)
const installError = ref(false)
const dropdownMenuRef = ref([])

// Filter versions to show only one per major version
const filteredNodeVersions = computed(() => {
  if (!props.installedTools?.node?.versions?.length) return []

  const versions = props.installedTools.node.versions
  const majorVersionMap = new Map()

  // Group by major version and keep the latest (first one due to sorted order)
  versions.forEach(version => {
    const major = version.split('.')[0]
    if (!majorVersionMap.has(major)) {
      majorVersionMap.set(major, version)
    }
  })

  // Convert to array of objects with major and full version
  return Array.from(majorVersionMap.entries()).map(([major, full]) => ({
    major,
    full,
  }))
})

function isDefaultVersion(version) {
  return props.installedTools?.node?.default === version
}

function isCurrentVersion(version) {
  return props.installedTools?.node?.current === version
}

function confirmSetDefault(version) {
  selectedVersion.value = version
  showSetDefaultConfirm.value = true
  closeAllDropdowns()
}

function confirmDelete(version) {
  selectedVersion.value = version
  showDeleteConfirm.value = true
  closeAllDropdowns()
}

function closeAllDropdowns() {
  dropdownMenuRef.value.forEach(dropdown => {
    if (dropdown?.closeDropdown) {
      dropdown.closeDropdown()
    }
  })
}

function handleOutputData(event, data) {
  installOutput.value += data.data
}

async function handleInstallNode(version) {
  showInstallModal.value = false
  isInstalling.value = true
  installOutput.value = ''
  installComplete.value = false
  installError.value = false
  showOutputLog.value = true

  try {
    await props.onInstallNode(version)
    installComplete.value = true
    installError.value = false
    status.showStatus(
      locale.value === 'km'
        ? `Node.js ${version} បានដំឡើងជោគជ័យ`
        : `Node.js ${version} installed successfully`,
      'success'
    )
  } catch (error) {
    installComplete.value = true
    installError.value = true
    installOutput.value += `\n\nError: ${error.message}`
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  } finally {
    isInstalling.value = false
  }
}

function handleCloseOutputLog() {
  showOutputLog.value = false
  installOutput.value = ''
  installComplete.value = false
  installError.value = false
}

function handleCancelInstall() {
  // TODO: Implement cancel functionality if needed
  showOutputLog.value = false
  isInstalling.value = false
}

async function handleSetDefaultNode() {
  showSetDefaultConfirm.value = false

  status.showStatus(
    locale.value === 'km' ? 'កំពុងកំណត់កំណែលំនាំដើម...' : 'Setting default version...',
    'info'
  )

  try {
    await props.onSetDefaultNode(selectedVersion.value)
    status.showStatus(
      locale.value === 'km'
        ? `Node.js ${selectedVersion.value} បានកំណត់ជាលំនាំដើម`
        : `Node.js ${selectedVersion.value} set as default`,
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}

async function handleDeleteNode() {
  showDeleteConfirm.value = false

  status.showStatus(
    locale.value === 'km' ? 'កំពុងលុប Node.js...' : 'Deleting Node.js...',
    'info'
  )

  try {
    await props.onUninstallNode(selectedVersion.value)
    status.showStatus(
      locale.value === 'km'
        ? `Node.js ${selectedVersion.value} បានលុបជោគជ័យ`
        : `Node.js ${selectedVersion.value} deleted successfully`,
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}

onMounted(() => {
  ipcRenderer.on('install-node-output', handleOutputData)
})

onUnmounted(() => {
  ipcRenderer.removeListener('install-node-output', handleOutputData)
})
</script>
