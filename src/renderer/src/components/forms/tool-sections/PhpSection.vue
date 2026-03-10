<template>
  <div class="p-6 space-y-6">
    <!-- Header with Quick Actions -->
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
        <div
          class="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center"
        >
          <img src="@/assets/svg/php.svg" alt="PHP" class="w-7 h-7" />
        </div>
        <span>{{ t('sectionPhpTitle') }}</span>
        <span
          v-if="hasInstalledVersions"
          class="px-3 py-1 text-sm font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full"
        >
          {{ installedTools.php.versions.length }} {{ locale === 'km' ? 'កំណែ' : 'versions' }}
        </span>
      </h3>
      <Button
        class="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 border-0"
        @click="openInstallModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
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
      </Button>
    </div>

    <!-- Installed PHP Versions -->
    <div
      v-if="hasInstalledVersions"
      class="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-5 backdrop-blur-sm"
    >
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
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
        <span class="text-xs text-indigo-700 dark:text-indigo-400 font-medium">
          {{
            latestInstalledVersion
              ? `${locale === 'km' ? 'ចុងក្រោយបំផុត' : 'Latest'}: ${latestInstalledVersion}`
              : ''
          }}
        </span>
      </div>
      <div class="space-y-2">
        <div
          v-for="version in installedTools.php.versions"
          :key="version"
          class="group flex items-center justify-between bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-indigo-200 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center"
            >
              <img src="@/assets/svg/php.svg" alt="PHP" class="w-6 h-6" />
            </div>
            <div>
              <span class="font-semibold text-gray-900 dark:text-gray-100">PHP {{ version }}</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span
                  class="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded"
                >
                  {{ t('installed') }}
                </span>
                <span
                  v-if="version === latestInstalledVersion"
                  class="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded"
                >
                  {{ locale === 'km' ? 'ចុងក្រោយ' : 'Latest' }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              class="text-xs h-auto py-1.5 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              :title="locale === 'km' ? 'គ្រប់គ្រងផ្នែកបន្ថែម' : 'Manage Extensions'"
              @click="openExtensionsManager(version)"
            >
              {{ locale === 'km' ? 'ផ្នែកបន្ថែម' : 'Extensions' }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="text-xs h-auto py-1.5 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              :title="locale === 'km' ? 'កែសម្រួល php.ini' : 'Edit php.ini'"
              @click="openIniEditor(version, 'cli')"
            >
              php.ini
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="text-xs h-auto py-1.5 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              :title="locale === 'km' ? 'កែសម្រួល php-fpm.conf' : 'Edit php-fpm.conf'"
              @click="openIniEditor(version, 'fpm')"
            >
              FPM
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-gradient-to-br from-indigo-50 to-indigo-100/30 dark:from-indigo-950/30 dark:to-indigo-900/10 border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 rounded-xl p-8 text-center"
    >
      <div
        class="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-indigo-600 dark:text-indigo-400"
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
        {{
          locale === 'km'
            ? 'ចាប់ផ្តើមដោយដំឡើង PHP។ យើងណែនាំ PHP 8.3 សម្រាប់គម្រោង Laravel ថ្មី។'
            : 'Get started by installing PHP. We recommend PHP 8.3 for new Laravel projects.'
        }}
      </p>
    </div>

    <!-- Install PHP Dialog -->
    <Dialog :open="showInstallModal" @update:open="(v) => !v && closeInstallModal()">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
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
          </DialogTitle>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <div>
            <Label class="block mb-2 dark:text-gray-300">{{ t('phpInstallLabel') }}</Label>
            <Input
              v-model="phpInstallVersion"
              type="text"
              placeholder="8.3"
              :disabled="isInstalling"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ locale === 'km' ? 'ឧទាហរណ៍: 8.3, 8.2, 8.1' : 'Example: 8.3, 8.2, 8.1' }}
            </p>
          </div>

          <InfoBox
            :title="locale === 'km' ? 'ណែនាំកំណែ' : 'Version Recommendation'"
            :message="
              locale === 'km'
                ? 'PHP 8.3 គឺជាកំណែចុងក្រោយបំផុតដែលមានស្ថេរភាព និងត្រូវបានណែនាំសម្រាប់គម្រោងថ្មី។ PHP 8.4 គឺជាកំណែចុងក្រោយបំផុតប៉ុន្តែអាចមានបញ្ហាឆបគ្នា។'
                : 'PHP 8.3 is the latest stable version and recommended for new projects. PHP 8.4 is the newest but may have compatibility issues.'
            "
            type="info"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" :disabled="isInstalling" @click="closeInstallModal">
            {{ locale === 'km' ? 'បោះបង់' : 'Cancel' }}
          </Button>
          <Button
            :disabled="isInstalling"
            class="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 border-0"
            @click="handleInstallPHP"
          >
            {{ t('phpInstallBtn') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- PHP INI Editor Dialog -->
    <Dialog :open="showIniEditor" @update:open="(v) => !v && closeIniEditor()">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {{ locale === 'km' ? 'កែសម្រួល' : 'Edit' }}
            {{ iniEditorType === 'fpm' ? 'PHP-FPM' : 'PHP' }}
            {{ locale === 'km' ? 'ការកំណត់' : 'Configuration' }} ({{ iniEditorVersion }})
          </DialogTitle>
        </DialogHeader>

        <div class="py-2">
          <div v-if="isLoadingIni" class="flex items-center justify-center h-64">
            <div class="text-gray-500 dark:text-gray-400">
              {{ locale === 'km' ? 'កំពុងផ្ទុក...' : 'Loading...' }}
            </div>
          </div>
          <div v-else class="space-y-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ locale === 'km' ? 'ឯកសារ' : 'File' }}:
              <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{{
                iniFilePath
              }}</code>
            </div>
            <textarea
              v-model="iniContent"
              class="w-full h-96 px-4 py-3 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 resize-none focus:outline-none"
              spellcheck="false"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" @click="closeIniEditor">
            {{ locale === 'km' ? 'បោះបង់' : 'Cancel' }}
          </Button>
          <Button
            :disabled="isSavingIni || isLoadingIni"
            class="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 border-0"
            @click="saveIniFile"
          >
            {{
              isSavingIni
                ? locale === 'km'
                  ? 'កំពុងរក្សាទុក...'
                  : 'Saving...'
                : locale === 'km'
                  ? 'រក្សាទុក'
                  : 'Save'
            }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Extensions Manager Dialog -->
    <Dialog :open="showExtensionsManager" @update:open="(v) => !v && closeExtensionsManager()">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {{ locale === 'km' ? 'គ្រប់គ្រងផ្នែកបន្ថែម PHP' : 'Manage PHP Extensions' }} ({{
              extManagerVersion
            }})
          </DialogTitle>
        </DialogHeader>

        <div class="py-2 max-h-[60vh] overflow-y-auto">
          <div v-if="isLoadingExtensions" class="flex items-center justify-center h-64">
            <div class="text-gray-500 dark:text-gray-400">
              {{ locale === 'km' ? 'កំពុងផ្ទុក...' : 'Loading...' }}
            </div>
          </div>
          <div v-else class="space-y-6">
            <!-- Installed Extensions -->
            <div v-if="installedExtensionsList.length > 0">
              <div class="flex items-center justify-between mb-3">
                <h4
                  class="text-sm font-semibold text-green-700 dark:text-green-300 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ locale === 'km' ? 'បានដំឡើងរួចហើយ' : 'Installed Extensions' }}
                  <span
                    class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs"
                  >
                    {{ installedExtensionsList.length }}
                  </span>
                </h4>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                <div
                  v-for="ext in installedExtensionsList"
                  :key="`installed-${ext}`"
                  class="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-sm"
                >
                  <svg
                    class="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-medium text-green-700 dark:text-green-300">{{ ext }}</span>
                </div>
              </div>
            </div>

            <!-- Not Installed Extensions -->
            <div v-if="notInstalledExtensionsList.length > 0">
              <div class="flex items-center justify-between mb-3">
                <h4
                  class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ locale === 'km' ? 'មិនទាន់បានដំឡើង' : 'Not Installed' }}
                  <span
                    class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {{ notInstalledExtensionsList.length }}
                  </span>
                </h4>
                <Button variant="link" size="sm" class="text-xs h-auto p-0" @click="toggleCheckAll">
                  {{
                    isAllChecked
                      ? locale === 'km'
                        ? 'មិនជ្រើសរើសទាំងអស់'
                        : 'Uncheck All'
                      : locale === 'km'
                        ? 'ជ្រើសរើសទាំងអស់'
                        : 'Check All'
                  }}
                </Button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="ext in notInstalledExtensionsList"
                  :key="`not-installed-${ext}`"
                  class="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  :class="
                    selectedExtensions.includes(ext)
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700'
                      : ''
                  "
                  @click="toggleExtension(ext)"
                >
                  <Checkbox
                    :id="`ext-${ext}`"
                    :model-value="selectedExtensions.includes(ext)"
                    @update:model-value="() => toggleExtension(ext)"
                    @click.stop
                  />
                  <label
                    :for="`ext-${ext}`"
                    class="flex-1 text-sm font-medium dark:text-gray-300 cursor-pointer"
                  >
                    {{ ext }}
                  </label>
                </div>
              </div>
            </div>

            <div
              v-if="selectedExtensions.length > 0"
              class="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg"
            >
              <p class="text-sm text-indigo-700 dark:text-indigo-300">
                {{ locale === 'km' ? 'បានជ្រើសរើស' : 'Selected' }}:
                <strong>{{ selectedExtensions.length }}</strong>
                {{ locale === 'km' ? 'ផ្នែកបន្ថែម' : 'extension(s)' }}
              </p>
            </div>

            <div
              v-if="availableExtensions.length === 0"
              class="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              {{ locale === 'km' ? 'រកមិនឃើញផ្នែកបន្ថែម' : 'No extensions found' }}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" @click="closeExtensionsManager">
            {{ locale === 'km' ? 'បិទ' : 'Close' }}
          </Button>
          <Button
            :disabled="isInstallingExtensions || selectedExtensions.length === 0"
            class="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 border-0"
            @click="installSelectedExtensions"
          >
            {{
              isInstallingExtensions
                ? locale === 'km'
                  ? 'កំពុងដំឡើង...'
                  : 'Installing...'
                : locale === 'km'
                  ? 'ដំឡើង'
                  : 'Install Selected'
            }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Installation Log Dialog -->
    <Dialog :open="showInstallLog" @update:open="(v) => !v && closeInstallLog()">
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <svg
              class="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin"
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
            {{ locale === 'km' ? 'កំពុងដំឡើង PHP' : 'Installing PHP' }} {{ installLogVersion }}
          </DialogTitle>
        </DialogHeader>

        <div class="py-2 space-y-4">
          <div
            class="bg-gray-900 dark:bg-black rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm space-y-1"
          >
            <div v-for="(log, index) in installLogs" :key="index" class="text-green-400">
              {{ log }}
            </div>
            <div v-if="installLogs.length === 0" class="text-gray-500">
              {{ locale === 'km' ? 'កំពុងចាប់ផ្តើម...' : 'Starting...' }}
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-700 dark:text-gray-300 font-medium">
                {{ locale === 'km' ? 'វឌ្ឍនភាព' : 'Progress' }}
              </span>
              <span class="text-indigo-600 dark:text-indigo-400 font-semibold">
                {{ installProgress }}%
              </span>
            </div>
            <Progress :model-value="installProgress" class="h-2.5" />
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <AlertNotification
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
      @close="status.hideStatus"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../../composables/useStatus'
import { useTools } from '../../../composables/useTools'
import AlertNotification from '../../common/AlertNotification.vue'
import InfoBox from '../../common/InfoBox.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

const { t, locale } = useI18n()
const status = useStatus()
const { getPhpIniPath, readPhpIni, writePhpIni, listPhpExtensions, getInstalledPhpExtensions } =
  useTools()
const isInstalling = ref(false)
const installProgress = ref(0)

const props = defineProps({
  installedTools: {
    type: Object,
    required: true,
  },
  onInstallPhp: {
    type: Function,
    required: true,
  },
  onInstallPhpExtensions: {
    type: Function,
    required: true,
  },
})

const phpInstallVersion = ref('8.3')

// Install modal state
const showInstallModal = ref(false)

// INI Editor state
const showIniEditor = ref(false)
const iniEditorVersion = ref('')
const iniEditorType = ref('cli')
const iniFilePath = ref('')
const iniContent = ref('')
const isLoadingIni = ref(false)
const isSavingIni = ref(false)

// Extensions Manager state
const showExtensionsManager = ref(false)
const extManagerVersion = ref('')
const availableExtensions = ref([])
const installedExtensions = ref([])
const isLoadingExtensions = ref(false)
const selectedExtensions = ref([])
const isInstallingExtensions = ref(false)

// Installation Log state
const showInstallLog = ref(false)
const installLogVersion = ref('')
const installLogs = ref([])

const hasInstalledVersions = computed(() => {
  return (
    props.installedTools &&
    props.installedTools.php.installed &&
    props.installedTools.php.versions.length > 0
  )
})

const latestInstalledVersion = computed(() => {
  if (!hasInstalledVersions.value) return null
  const versions = props.installedTools.php.versions
  return versions[0]
})

const installedExtensionsList = computed(() => {
  return availableExtensions.value.filter((ext) =>
    installedExtensions.value.includes(ext.toLowerCase())
  )
})

const notInstalledExtensionsList = computed(() => {
  return availableExtensions.value.filter(
    (ext) => !installedExtensions.value.includes(ext.toLowerCase())
  )
})

const isAllChecked = computed(() => {
  return (
    notInstalledExtensionsList.value.length > 0 &&
    notInstalledExtensionsList.value.every((ext) => selectedExtensions.value.includes(ext))
  )
})

async function handleInstallPHP() {
  if (!phpInstallVersion.value) {
    status.showStatus(
      locale.value === 'km' ? 'សូមបញ្ចូលកំណែ PHP' : 'Please enter PHP version',
      'error'
    )
    return
  }

  if (!/^\d+\.\d+$/.test(phpInstallVersion.value)) {
    status.showStatus(
      locale.value === 'km'
        ? 'កំណែមិនត្រឹមត្រូវ (ឧទាហរណ៍: 8.3)'
        : 'Invalid version format (example: 8.3)',
      'error'
    )
    return
  }

  isInstalling.value = true
  installProgress.value = 0
  showInstallLog.value = true
  installLogVersion.value = phpInstallVersion.value
  installLogs.value = []
  showInstallModal.value = false

  installLogs.value.push(
    `[${new Date().toLocaleTimeString()}] Starting PHP ${phpInstallVersion.value} installation...`
  )
  installLogs.value.push(`[${new Date().toLocaleTimeString()}] Adding repository...`)

  const progressInterval = setInterval(() => {
    if (installProgress.value < 90) {
      installProgress.value += 10

      const logs = [
        'Updating package lists...',
        'Downloading packages...',
        'Installing PHP core...',
        'Installing PHP extensions...',
        'Configuring PHP-FPM...',
        'Setting up symbolic links...',
        'Reloading services...',
      ]
      const randomLog = logs[Math.floor(Math.random() * logs.length)]
      installLogs.value.push(`[${new Date().toLocaleTimeString()}] ${randomLog}`)
    }
  }, 800)

  try {
    await props.onInstallPhp(phpInstallVersion.value)
    clearInterval(progressInterval)
    installProgress.value = 100
    installLogs.value.push(
      `[${new Date().toLocaleTimeString()}] ✓ PHP ${phpInstallVersion.value} installed successfully!`
    )

    status.showStatus(
      locale.value === 'km'
        ? `PHP ${phpInstallVersion.value} បានដំឡើងជោគជ័យ`
        : `PHP ${phpInstallVersion.value} installed successfully`,
      'success'
    )

    setTimeout(() => {
      isInstalling.value = false
      installProgress.value = 0
      showInstallLog.value = false
      installLogs.value = []
    }, 2000)
  } catch (error) {
    clearInterval(progressInterval)
    installLogs.value.push(`[${new Date().toLocaleTimeString()}] ✗ Error: ${error.message}`)

    setTimeout(() => {
      isInstalling.value = false
      installProgress.value = 0
    }, 1000)

    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}

function openInstallModal() {
  showInstallModal.value = true
  phpInstallVersion.value = '8.3'
}

function closeInstallModal() {
  if (!isInstalling.value) {
    showInstallModal.value = false
  }
}

async function openIniEditor(version, type = 'cli') {
  iniEditorVersion.value = version
  iniEditorType.value = type
  showIniEditor.value = true
  isLoadingIni.value = true

  try {
    const path = await getPhpIniPath(version, type)
    iniFilePath.value = path
    const content = await readPhpIni(path)
    iniContent.value = content
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  } finally {
    isLoadingIni.value = false
  }
}

async function saveIniFile() {
  isSavingIni.value = true

  try {
    await writePhpIni(iniFilePath.value, iniContent.value)
    status.showStatus(locale.value === 'km' ? 'រក្សាទុកជោគជ័យ' : 'Saved successfully', 'success')
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  } finally {
    isSavingIni.value = false
  }
}

function closeIniEditor() {
  showIniEditor.value = false
  iniContent.value = ''
  iniFilePath.value = ''
}

async function openExtensionsManager(version) {
  extManagerVersion.value = version
  showExtensionsManager.value = true
  isLoadingExtensions.value = true
  selectedExtensions.value = []

  try {
    const [available, installed] = await Promise.all([
      listPhpExtensions(version),
      getInstalledPhpExtensions(version),
    ])
    availableExtensions.value = available
    installedExtensions.value = installed
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  } finally {
    isLoadingExtensions.value = false
  }
}

async function installSelectedExtensions() {
  if (selectedExtensions.value.length === 0) {
    status.showStatus(
      locale.value === 'km' ? 'សូមជ្រើសរើសផ្នែកបន្ថែម' : 'Please select extensions',
      'error'
    )
    return
  }

  isInstallingExtensions.value = true

  try {
    const extensions = selectedExtensions.value.join(', ')
    await props.onInstallPhpExtensions(extManagerVersion.value, extensions)
    status.showStatus(
      locale.value === 'km' ? 'ផ្នែកបន្ថែមបានដំឡើងជោគជ័យ' : 'Extensions installed successfully',
      'success'
    )

    installedExtensions.value = await getInstalledPhpExtensions(extManagerVersion.value)
    selectedExtensions.value = []
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  } finally {
    isInstallingExtensions.value = false
  }
}

function toggleExtension(ext) {
  const index = selectedExtensions.value.indexOf(ext)
  if (index > -1) {
    selectedExtensions.value.splice(index, 1)
  } else {
    selectedExtensions.value.push(ext)
  }
}

function closeExtensionsManager() {
  showExtensionsManager.value = false
  availableExtensions.value = []
  installedExtensions.value = []
  selectedExtensions.value = []
}

function toggleCheckAll() {
  if (isAllChecked.value) {
    selectedExtensions.value = []
  } else {
    selectedExtensions.value = [...notInstalledExtensionsList.value]
  }
}

function closeInstallLog() {
  if (!isInstalling.value) {
    showInstallLog.value = false
    installLogs.value = []
  }
}
</script>
