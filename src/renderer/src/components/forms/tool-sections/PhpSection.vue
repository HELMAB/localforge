<template>
  <div class="p-6 space-y-6">
    <!-- Header with Quick Actions -->
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
          <img
            src="@/assets/svg/php.svg"
            alt="PHP"
            class="w-7 h-7"
          >
        </div>
        <span>{{ t('sectionPhpTitle') }}</span>
        <span
          v-if="hasInstalledVersions"
          class="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"
        >
          {{ installedTools.php.versions.length }} {{ locale === 'km' ? 'កំណែ' : 'versions' }}
        </span>
      </h3>
      <button
        v-if="!hasInstalledVersions"
        class="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
        @click="installRecommendedPHP"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
            clip-rule="evenodd"
          />
        </svg>
        {{ locale === 'km' ? 'ដំឡើង PHP ណែនាំ' : 'Install Recommended' }}
      </button>
    </div>

    <!-- Installed PHP Versions - Enhanced Cards -->
    <div
      v-if="hasInstalledVersions"
      class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 rounded-xl p-5 backdrop-blur-sm"
    >
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          {{ t('phpInstalledTitle') }}
        </h4>
        <span class="text-xs text-green-600 dark:text-green-400 font-medium">
          {{ latestInstalledVersion ? `${locale === 'km' ? 'ចុងក្រោយបំផុត' : 'Latest'}: ${latestInstalledVersion}` : '' }}
        </span>
      </div>
      <div class="space-y-2">
        <div
          v-for="version in installedTools.php.versions"
          :key="version"
          class="group flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-green-300 dark:border-green-700 hover:shadow-md transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <img
                src="@/assets/svg/php.svg"
                alt="PHP"
                class="w-6 h-6"
              >
            </div>
            <div>
              <span class="font-semibold text-gray-900 dark:text-gray-100">PHP {{ version }}</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                  {{ t('installed') }}
                </span>
                <span
                  v-if="version === latestInstalledVersion"
                  class="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                >
                  {{ locale === 'km' ? 'ចុងក្រោយ' : 'Latest' }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              :title="locale === 'km' ? 'ពិនិត្យកំណែ' : 'Check Version'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center"
    >
      <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-purple-600 dark:text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {{ locale === 'km' ? 'មិនទាន់បានដំឡើង PHP' : 'No PHP Installed' }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
        {{ locale === 'km'
          ? 'ចាប់ផ្តើមដោយដំឡើង PHP។ យើងណែនាំ PHP 8.3 សម្រាប់គម្រោង Laravel ថ្មី។'
          : 'Get started by installing PHP. We recommend PHP 8.3 for new Laravel projects.' }}
      </p>
    </div>

    <!-- Install PHP Version -->
    <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-purple-600 dark:text-purple-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
              clip-rule="evenodd"
            />
          </svg>
          {{ t('phpInstallTitle') }}
        </h4>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            {{ t('phpInstallLabel') }}
          </label>
          <CustomSelect
            v-model="phpInstallVersion"
            :options="phpVersionOptions"
            :disabled="isInstalling"
          />
        </div>

        <InfoBox
          :title="locale === 'km' ? 'ណែនាំកំណែ' : 'Version Recommendation'"
          :message="locale === 'km'
            ? 'PHP 8.3 គឺជាកំណែចុងក្រោយបំផុតដែលមានស្ថេរភាព និងត្រូវបានណែនាំសម្រាប់គម្រោងថ្មី។ PHP 8.4 គឺជាកំណែចុងក្រោយបំផុតប៉ុន្តែអាចមានបញ្ហាឆបគ្នា។'
            : 'PHP 8.3 is the latest stable version and recommended for new projects. PHP 8.4 is the newest but may have compatibility issues.'"
          type="info"
        />

        <!-- Installation Progress -->
        <div
          v-if="isInstalling"
          class="space-y-2"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300 font-medium">
              {{ locale === 'km' ? 'កំពុងដំឡើង...' : 'Installing...' }}
            </span>
            <span class="text-purple-600 dark:text-purple-400 font-semibold">{{ installProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              class="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              :style="{ width: `${installProgress}%` }"
            />
          </div>
        </div>

        <button
          :disabled="isInstalling"
          class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-lg hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          @click="handleInstallPHP"
        >
          {{ isInstalling ? (locale === 'km' ? 'កំពុងដំឡើង...' : 'Installing...') : t('phpInstallBtn') }}
        </button>
      </div>
    </div>

    <!-- Install PHP Extensions -->
    <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
      <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        {{ t('phpExtTitle') }}
      </h4>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-gray-300">
            {{ t('phpExtVersionLabel') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="phpExtVersion"
            type="text"
            placeholder="8.3"
            class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-colors"
          >
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium dark:text-gray-300">
              {{ t('phpExtNameLabel') }} <span class="text-red-500">*</span>
            </label>
            <button
              class="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
              @click="fillCommonExtensions"
            >
              {{ locale === 'km' ? 'បំពេញធម្មតា' : 'Fill Common' }}
            </button>
          </div>
          <input
            v-model="phpExtName"
            type="text"
            placeholder="mbstring, curl, xml, zip, gd"
            :class="[
              'w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors',
              validationErrors.extensions
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
            ]"
            @blur="validateExtensions"
          >
          <p
            v-if="validationErrors.extensions"
            class="text-red-500 text-sm mt-1"
          >
            {{ validationErrors.extensions }}
          </p>
        </div>

        <InfoBox
          :title="locale === 'km' ? 'ផ្នែកបន្ថែមទូទៅ' : 'Common Extensions'"
          :message="locale === 'km'
            ? 'ផ្នែកបន្ថែមទូទៅសម្រាប់ Laravel៖ mbstring, curl, xml, zip, gd, mysql, pgsql, bcmath, intl'
            : 'Common extensions for Laravel: mbstring, curl, xml, zip, gd, mysql, pgsql, bcmath, intl'"
          type="info"
        />

        <button
          class="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../../composables/useStatus'
import { phpExtensionSchema, validateField } from '../../../utils/validation'
import StatusMessage from '../../common/StatusMessage.vue'
import CustomSelect from '../../common/CustomSelect.vue'
import InfoBox from '../../common/InfoBox.vue'
import phpIcon from '@/assets/svg/php.svg'

const { t, locale } = useI18n()
const status = useStatus()
const validationErrors = ref({})
const isInstalling = ref(false)
const installProgress = ref(0)

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
  { value: '8.4', label: 'PHP 8.4 (Latest)', icon: phpIcon },
  { value: '8.3', label: 'PHP 8.3 (Recommended)', icon: phpIcon },
  { value: '8.2', label: 'PHP 8.2', icon: phpIcon },
  { value: '8.1', label: 'PHP 8.1', icon: phpIcon },
  { value: '8.0', label: 'PHP 8.0', icon: phpIcon }
]

// Computed properties
const hasInstalledVersions = computed(() => {
  return props.installedTools && props.installedTools.php.installed && props.installedTools.php.versions.length > 0
})

const latestInstalledVersion = computed(() => {
  if (!hasInstalledVersions.value) return null
  const versions = props.installedTools.php.versions
  return versions[0] // Assuming versions are sorted
})

const commonExtensions = [
  'mbstring', 'curl', 'xml', 'zip', 'gd', 'mysql', 'pgsql', 'bcmath', 'intl'
]

// Validation functions
function validateExtensions() {
  const result = validateField(phpExtensionSchema, 'extensions', phpExtName.value)
  if (!result.valid) {
    validationErrors.value.extensions = result.error
  } else {
    delete validationErrors.value.extensions
  }
}

async function handleInstallPHP() {
  if (!phpInstallVersion.value) {
    status.showStatus(
      locale.value === 'km' ? 'សូមជ្រើសរើសកំណែ PHP' : 'Please select PHP version',
      'error'
    )
    return
  }

  isInstalling.value = true
  installProgress.value = 0

  status.showStatus(
    locale.value === 'km' ? 'កំពុងដំឡើង PHP...' : 'Installing PHP...',
    'info'
  )

  // Simulate progress (in real implementation, this would come from IPC events)
  const progressInterval = setInterval(() => {
    if (installProgress.value < 90) {
      installProgress.value += 10
    }
  }, 500)

  try {
    await props.onInstallPHP(phpInstallVersion.value)
    clearInterval(progressInterval)
    installProgress.value = 100

    status.showStatus(
      locale.value === 'km'
        ? `PHP ${phpInstallVersion.value} បានដំឡើងជោគជ័យ`
        : `PHP ${phpInstallVersion.value} installed successfully`,
      'success'
    )

    setTimeout(() => {
      isInstalling.value = false
      installProgress.value = 0
    }, 1000)
  } catch (error) {
    clearInterval(progressInterval)
    isInstalling.value = false
    installProgress.value = 0

    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}

async function installRecommendedPHP() {
  phpInstallVersion.value = '8.3'
  await handleInstallPHP()
}

async function handleInstallPHPExtensions() {
  // Validate extensions
  validateExtensions()

  if (!phpExtVersion.value || !phpExtName.value) {
    status.showStatus(
      locale.value === 'km'
        ? 'សូមបំពេញកំណែ និងឈ្មោះផ្នែកបន្ថែម'
        : 'Please fill version and extension names',
      'error'
    )
    return
  }

  if (Object.keys(validationErrors.value).length > 0) {
    status.showStatus(
      locale.value === 'km'
        ? 'សូមពិនិត្យកំហុសនៅក្នុងទម្រង់'
        : 'Please fix validation errors',
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

    // Clear form
    phpExtVersion.value = ''
    phpExtName.value = ''
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}

function fillCommonExtensions() {
  phpExtName.value = commonExtensions.join(', ')
}
</script>
