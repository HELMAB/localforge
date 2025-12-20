<template>
  <div class="p-6 space-y-6">
    <!-- Header with Quick Actions -->
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
        <div
          class="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center"
        >
          <img
            src="@/assets/svg/php.svg"
            alt="PHP"
            class="w-7 h-7"
          >
        </div>
        <span>{{ t('sectionPhpTitle') }}</span>
        <span
          v-if="hasInstalledVersions"
          class="px-3 py-1 text-sm font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full"
        >
          {{ installedTools.php.versions.length }} {{ locale === 'km' ? 'កំណែ' : 'versions' }}
        </span>
      </h3>
      <button
        class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all flex items-center gap-2 font-medium"
        @click="openInstallModal"
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
        {{ t('phpInstallTitle') }}
      </button>
    </div>

    <!-- Installed PHP Versions - Enhanced Cards -->
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
              <img
                src="@/assets/svg/php.svg"
                alt="PHP"
                class="w-6 h-6"
              >
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
            <button
              class="px-3 py-1.5 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/70 rounded transition-colors"
              :title="locale === 'km' ? 'គ្រប់គ្រងផ្នែកបន្ថែម' : 'Manage Extensions'"
              @click="openExtensionsManager(version)"
            >
              {{ locale === 'km' ? 'ផ្នែកបន្ថែម' : 'Extensions' }}
            </button>
            <button
              class="px-3 py-1.5 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/70 rounded transition-colors"
              :title="locale === 'km' ? 'កែសម្រួល php.ini' : 'Edit php.ini'"
              @click="openIniEditor(version, 'cli')"
            >
              {{ locale === 'km' ? 'php.ini' : 'php.ini' }}
            </button>
            <button
              class="px-3 py-1.5 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/70 rounded transition-colors"
              :title="locale === 'km' ? 'កែសម្រួល php-fpm.conf' : 'Edit php-fpm.conf'"
              @click="openIniEditor(version, 'fpm')"
            >
              {{ locale === 'km' ? 'FPM' : 'FPM' }}
            </button>
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

    <!-- Install PHP Modal -->
    <div
      v-if="showInstallModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeInstallModal"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col"
      >
        <div class="flex items-center justify-between p-5 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold dark:text-white flex items-center gap-2">
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
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            @click="closeInstallModal"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">
              {{ t('phpInstallLabel') }}
            </label>
            <input
              v-model="phpInstallVersion"
              type="text"
              placeholder="8.3"
              :disabled="isInstalling"
              class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
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

        <div class="flex items-center justify-end gap-3 p-5 border-t dark:border-gray-700">
          <button
            class="px-5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            @click="closeInstallModal"
          >
            {{ locale === 'km' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            :disabled="isInstalling"
            class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            @click="handleInstallPHP"
          >
            {{ t('phpInstallBtn') }}
          </button>
        </div>
      </div>
    </div>

    <!-- PHP INI Editor Modal -->
    <div
      v-if="showIniEditor"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeIniEditor"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div class="flex items-center justify-between p-5 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold dark:text-white">
            {{ locale === 'km' ? 'កែសម្រួល' : 'Edit' }}
            {{ iniEditorType === 'fpm' ? 'PHP-FPM' : 'PHP' }}
            {{ locale === 'km' ? 'ការកំណត់' : 'Configuration' }} ({{ iniEditorVersion }})
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            @click="closeIniEditor"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-5 flex-1 overflow-auto">
          <div
            v-if="isLoadingIni"
            class="flex items-center justify-center h-64"
          >
            <div class="text-gray-500 dark:text-gray-400">
              {{ locale === 'km' ? 'កំពុងផ្ទុក...' : 'Loading...' }}
            </div>
          </div>
          <div v-else>
            <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {{ locale === 'km' ? 'ឯកសារ' : 'File' }}:
              <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ iniFilePath }}</code>
            </div>
            <textarea
              v-model="iniContent"
              class="w-full h-96 px-4 py-3 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 resize-none"
              spellcheck="false"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 p-5 border-t dark:border-gray-700">
          <button
            class="px-5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            @click="closeIniEditor"
          >
            {{ locale === 'km' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            :disabled="isSavingIni || isLoadingIni"
            class="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          </button>
        </div>
      </div>
    </div>

    <!-- Extensions Manager Modal -->
    <div
      v-if="showExtensionsManager"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeExtensionsManager"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div class="flex items-center justify-between p-5 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold dark:text-white">
            {{ locale === 'km' ? 'គ្រប់គ្រងផ្នែកបន្ថែម PHP' : 'Manage PHP Extensions' }} ({{
              extManagerVersion
            }})
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            @click="closeExtensionsManager"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-5 flex-1 overflow-auto">
          <div
            v-if="isLoadingExtensions"
            class="flex items-center justify-center h-64"
          >
            <div class="text-gray-500 dark:text-gray-400">
              {{ locale === 'km' ? 'កំពុងផ្ទុក...' : 'Loading...' }}
            </div>
          </div>
          <div
            v-else
            class="space-y-6"
          >
            <!-- Installed Extensions Section -->
            <div v-if="installedExtensionsList.length > 0">
              <div class="flex items-center justify-between mb-3">
                <h4
                  class="text-sm font-semibold text-green-700 dark:text-green-300 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
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

            <!-- Not Installed Extensions Section -->
            <div v-if="notInstalledExtensionsList.length > 0">
              <div class="flex items-center justify-between mb-3">
                <h4
                  class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
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
                <button
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  @click="toggleCheckAll"
                >
                  {{
                    isAllChecked
                      ? locale === 'km'
                        ? 'មិនជ្រើសរើសទាំងអស់'
                        : 'Uncheck All'
                      : locale === 'km'
                        ? 'ជ្រើសរើសទាំងអស់'
                        : 'Check All'
                  }}
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="ext in notInstalledExtensionsList"
                  :key="`not-installed-${ext}`"
                  class="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  :class="
                    selectedExtensions.includes(ext)
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700'
                      : ''
                  "
                >
                  <input
                    :id="`ext-${ext}`"
                    type="checkbox"
                    :checked="selectedExtensions.includes(ext)"
                    class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    @change="toggleExtension(ext)"
                  >
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

        <div class="flex items-center justify-end gap-3 p-5 border-t dark:border-gray-700">
          <button
            class="px-5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            @click="closeExtensionsManager"
          >
            {{ locale === 'km' ? 'បិទ' : 'Close' }}
          </button>
          <button
            :disabled="isInstallingExtensions || selectedExtensions.length === 0"
            class="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          </button>
        </div>
      </div>
    </div>

    <!-- Installation Log Modal -->
    <div
      v-if="showInstallLog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeInstallLog"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        <div class="flex items-center justify-between p-5 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold dark:text-white flex items-center gap-2">
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
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            @click="closeInstallLog"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-5 flex-1 overflow-auto bg-gray-900 dark:bg-black">
          <div class="font-mono text-sm space-y-1">
            <div
              v-for="(log, index) in installLogs"
              :key="index"
              class="text-green-400"
            >
              {{ log }}
            </div>
            <div
              v-if="installLogs.length === 0"
              class="text-gray-500"
            >
              {{ locale === 'km' ? 'កំពុងចាប់ផ្តើម...' : 'Starting...' }}
            </div>
          </div>
        </div>

        <div class="p-5 border-t dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-700 dark:text-gray-300 font-medium">
                  {{ locale === 'km' ? 'វឌ្ឍនភាព' : 'Progress' }}
                </span>
                <span class="text-indigo-600 dark:text-indigo-400 font-semibold">{{ installProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  :style="{ width: `${installProgress}%` }"
                />
              </div>
            </div>
          </div>
        </div>
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStatus } from '../../../composables/useStatus'
import { useTools } from '../../../composables/useTools'
import AlertNotification from '../../common/AlertNotification.vue'
import InfoBox from '../../common/InfoBox.vue'

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

// Computed properties
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
  return versions[0] // Assuming versions are sorted
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

  // Validate version format (e.g., 8.3, 8.2)
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

  // Close install modal and show log modal
  showInstallModal.value = false

  // Add initial log
  installLogs.value.push(
    `[${new Date().toLocaleTimeString()}] Starting PHP ${phpInstallVersion.value} installation...`
  )
  installLogs.value.push(`[${new Date().toLocaleTimeString()}] Adding repository...`)

  // Simulate progress (in real implementation, this would come from IPC events)
  const progressInterval = setInterval(() => {
    if (installProgress.value < 90) {
      installProgress.value += 10

      // Add simulated logs
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

// INI Editor functions
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

// Extensions Manager functions
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

    // Refresh installed extensions
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
    // Uncheck all
    selectedExtensions.value = []
  } else {
    // Check all not installed
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
