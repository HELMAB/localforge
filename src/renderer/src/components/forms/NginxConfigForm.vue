<template>
  <div
    class="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
  >
    <!-- Sidebar Menu -->
    <div
      class="bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 px-3 flex flex-col rounded-l-lg"
      style="width: 180px; min-width: 180px"
    >
      <nav class="flex-1 p-2">
        <button
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-1',
            activeMenu === 'new-site'
              ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
          @click="activeMenu = 'new-site'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">{{ t('nginxNewSite') }}</span>
        </button>

        <button
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
            activeMenu === 'sites'
              ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
          @click="activeMenu = 'sites'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">{{ t('nginxSites') }}</span>
          <span
            class="ml-auto px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {{ configs.length }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <!-- New Site Form -->
      <div
        v-if="activeMenu === 'new-site'"
        class="p-6 overflow-y-auto h-full"
      >
        <div
          class="space-y-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {{
                    editMode
                      ? locale === 'km'
                        ? 'កែសម្រួល Virtual Host'
                        : 'Edit Virtual Host'
                      : t('nginxCreateNew')
                  }}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{
                    editMode
                      ? locale === 'km'
                        ? 'កែសម្រួលការកំណត់រចនាសម្ព័ន្ធ Nginx របស់អ្នក'
                        : 'Edit your Nginx configuration'
                      : t('nginxCreateNewDesc')
                  }}
                </p>
              </div>
              <button
                v-if="editMode"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                @click="cancelEdit"
              >
                {{ locale === 'km' ? 'បោះបង់' : 'Cancel' }}
              </button>
            </div>
          </div>

          <!-- Project Type Selector -->
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">
              {{ t('nginxProjectTypeLabel') }} <span class="text-red-500">*</span>
            </label>
            <CustomSelect
              v-model="projectType"
              :options="projectTypeOptions"
            />
          </div>

          <!-- Domain Name -->
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">
              {{ t('domainLabel') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="domain"
              type="text"
              :placeholder="locale === 'km' ? 'myapp.local' : 'myapp.local'"
              :class="[
                'w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors',
                validationErrors.domain
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500',
              ]"
              @blur="validateDomain"
            >
            <p
              v-if="validationErrors.domain"
              class="text-red-500 text-sm mt-1"
            >
              {{ validationErrors.domain }}
            </p>
          </div>

          <!-- Project Path -->
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">
              {{ t('nginxPathLabel') }} <span class="text-red-500">*</span>
            </label>
            <DirectorySelector
              v-model="nginxProjectPath"
              @update:model-value="validatePath"
            />
            <p
              v-if="validationErrors.path"
              class="text-red-500 text-sm mt-1"
            >
              {{ validationErrors.path }}
            </p>
          </div>

          <!-- PHP Version (only for PHP, Laravel, and WordPress projects) -->
          <div v-if="['php', 'laravel', 'wordpress'].includes(projectType)">
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
              t('nginxPhpVersionLabel')
            }}</label>
            <CustomSelect
              v-model="phpVersion"
              :options="phpVersionOptions"
              placeholder="Auto-detect (ស្វ័យប្រវត្តិ)"
            />
            <InfoBox
              :title="locale === 'km' ? 'រកឃើញស្វ័យប្រវត្តិ' : 'Auto-Detection'"
              :message="
                locale === 'km'
                  ? 'ប្រព័ន្ធនឹងស្វែងរក PHP-FPM socket ដែលមាននៅក្នុងថត /run/php/ ដោយស្វ័យប្រវត្តិ។ អ្នកក៏អាចជ្រើសរើសកំណែជាក់លាក់បានដែរ។'
                  : 'The system will automatically search for available PHP-FPM sockets in /run/php/. You can also manually select a specific version.'
              "
              type="info"
              class="mt-2"
            />
          </div>

          <!-- Port -->
          <div>
            <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{
              t('portLabel')
            }}</label>
            <input
              v-model.number="port"
              type="number"
              placeholder="3000"
              class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <!-- Enable SSL Toggle -->
          <div>
            <div
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 transition-all hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div class="flex-1">
                <label
                  class="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-green-600 dark:text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ t('enableSSL') }}
                </label>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-7">
                  {{ t('enableSSLDesc') }}
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="enableSSL"
                  type="checkbox"
                  class="sr-only peer"
                >
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                />
              </label>
            </div>
            <InfoBox
              v-if="enableSSL"
              :title="locale === 'km' ? 'តម្រូវការ mkcert' : 'mkcert Required'"
              :message="
                locale === 'km'
                  ? 'ដើម្បីបង្កើតវិញ្ញាបនប័ត្រ SSL ត្រូវការ mkcert។ ប្រសិនបើមិនទាន់បានដំឡើង សូមដំឡើងវាជាមុនសិន៖ sudo apt install mkcert'
                  : 'SSL certificate generation requires mkcert to be installed. If not installed yet, please install it first: sudo apt install mkcert'
              "
              type="warning"
              class="mt-2"
            />
          </div>

          <button
            :disabled="isConfiguring"
            class="w-full px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="handleConfigureNginx"
          >
            <span v-if="isConfiguring">{{ t('checking') }}</span>
            <span v-else-if="editMode">{{
              locale === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Update Configuration'
            }}</span>
            <span v-else>{{ t('configureBtn') }}</span>
          </button>

          <AlertNotification
            :message="status.message.value"
            :type="status.type.value"
            :visible="status.visible.value"
          />
        </div>
      </div>

      <!-- Sites List -->
      <div
        v-else-if="activeMenu === 'sites'"
        class="p-6 overflow-y-auto h-full"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <!-- Header -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {{ t('nginxManageVirtualHosts') }}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('nginxManageVirtualHostsDesc') }}
                </p>
              </div>
              <button
                :disabled="isLoading"
                class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
                @click="loadConfigs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ t('refresh') }}
              </button>
            </div>

            <!-- Search and Filters -->
            <div class="space-y-3">
              <!-- Search Box -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  :placeholder="locale === 'km' ? 'ស្វែងរកគេហទំព័រ...' : 'Search sites...'"
                >
              </div>

              <!-- Filter Buttons -->
              <div class="flex flex-wrap gap-2">
                <!-- Status Filters -->
                <div class="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  <button
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      statusFilter === 'all'
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                    ]"
                    @click="statusFilter = 'all'"
                  >
                    {{ locale === 'km' ? 'ទាំងអស់' : 'All' }}
                  </button>
                  <button
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      statusFilter === 'active'
                        ? 'bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                    ]"
                    @click="statusFilter = 'active'"
                  >
                    {{ t('active') }}
                  </button>
                  <button
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      statusFilter === 'inactive'
                        ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                    ]"
                    @click="statusFilter = 'inactive'"
                  >
                    {{ t('inactive') }}
                  </button>
                </div>

                <!-- SSL Filters -->
                <div class="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  <button
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      sslFilter === 'all'
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                    ]"
                    @click="sslFilter = 'all'"
                  >
                    {{ locale === 'km' ? 'ទាំងអស់' : 'All' }}
                  </button>
                  <button
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1',
                      sslFilter === 'https'
                        ? 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                    ]"
                    @click="sslFilter = 'https'"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    HTTPS
                  </button>
                  <button
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      sslFilter === 'no-https'
                        ? 'bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                    ]"
                    @click="sslFilter = 'no-https'"
                  >
                    {{ locale === 'km' ? 'គ្មាន HTTPS' : 'No HTTPS' }}
                  </button>
                </div>

                <!-- Results count -->
                <div
                  v-if="filteredConfigs.length !== configs.length"
                  class="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  {{ locale === 'km' ? 'បង្ហាញ' : 'Showing' }} {{ filteredConfigs.length }}
                  {{ locale === 'km' ? 'ក្នុងចំណោម' : 'of' }} {{ configs.length }}
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
          >
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
            <p>{{ t('loading') }}...</p>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="filteredConfigs.length === 0 && configs.length === 0"
            class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-20 w-20 mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-lg font-medium mb-2">
              {{ t('nginxNoConfigs') }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {{ t('nginxNoConfigsDesc') }}
            </p>
            <button
              class="px-6 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium"
              @click="activeMenu = 'new-site'"
            >
              {{ t('nginxCreateFirst') }}
            </button>
          </div>

          <!-- No Results State -->
          <div
            v-else-if="filteredConfigs.length === 0 && configs.length > 0"
            class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-20 w-20 mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p class="text-lg font-medium mb-2">
              {{ locale === 'km' ? 'រកមិនឃើញលទ្ធផល' : 'No results found' }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {{
                locale === 'km'
                  ? 'សូមព្យាយាមផ្លាស់ប្តូរការស្វែងរក ឬតម្រង'
                  : 'Try adjusting your search or filters'
              }}
            </p>
            <button
              class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm"
              @click="
                searchQuery = ''
                statusFilter = 'all'
                sslFilter = 'all'
              "
            >
              {{ locale === 'km' ? 'សម្អាតតម្រង' : 'Clear Filters' }}
            </button>
          </div>

          <!-- Active Sites -->
          <div
            v-else
            class="space-y-6"
          >
            <!-- Active Sites with HTTPS -->
            <div
              v-if="activeSitesWithSSL.length > 0"
              class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4"
            >
              <h4
                class="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ locale === 'km' ? 'គេហទំព័រសកម្ម (មាន HTTPS)' : 'Active Sites (HTTPS)' }}
                <span
                  class="ml-auto px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full"
                >
                  {{ activeSitesWithSSL.length }}
                </span>
              </h4>
              <div class="space-y-2">
                <div
                  v-for="config in activeSitesWithSSL"
                  :key="config.name"
                  class="bg-white dark:bg-gray-800 rounded-lg border border-green-300 dark:border-green-700 overflow-hidden transition-all hover:shadow-md"
                >
                  <!-- Site Card Header -->
                  <div class="flex items-center justify-between p-4">
                    <button
                      class="flex-1 min-w-0 text-left"
                      @click="toggleSiteDetails(config.name)"
                    >
                      <div class="flex items-center gap-2 mb-1">
                        <button
                          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          :title="
                            isFavorite('nginxConfigs', config.name)
                              ? locale === 'km'
                                ? 'ដកចេញពីចំណូលចិត្ត'
                                : 'Remove from favorites'
                              : locale === 'km'
                                ? 'បន្ថែមទៅចំណូលចិត្ត'
                                : 'Add to favorites'
                          "
                          @click.stop="
                            toggleFavorite('nginxConfigs', {
                              id: config.name,
                              name: config.name,
                              path: config.path,
                              type: 'nginx',
                            })
                          "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            :class="
                              isFavorite('nginxConfigs', config.name)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-gray-400'
                            "
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          :class="[
                            'h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0',
                            { 'rotate-90': expandedSite === config.name },
                          ]"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="font-semibold text-green-700 dark:text-green-400 truncate">{{
                          config.name
                        }}</span>
                        <span
                          class="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded flex-shrink-0"
                        >
                          {{ t('active') }}
                        </span>
                        <span
                          v-if="config.hasSSL"
                          class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1 flex-shrink-0"
                          :title="locale === 'km' ? 'មាន SSL/HTTPS' : 'SSL/HTTPS Enabled'"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          HTTPS
                        </span>
                      </div>
                      <div
                        class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-9"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3.5 w-3.5 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                            clip-rule="evenodd"
                          />
                          <path
                            d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"
                          />
                        </svg>
                        <span class="truncate">{{ config.path }}</span>
                      </div>
                    </button>
                    <div class="ml-4 relative flex-shrink-0">
                      <button
                        class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        :title="locale === 'km' ? 'សកម្មភាព' : 'Actions'"
                        @click="toggleDropdown(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                          />
                        </svg>
                      </button>
                      <div
                        v-if="openDropdown === config.name"
                        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                      >
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="loadConfigForEdit(config.name)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                            />
                          </svg>
                          {{ locale === 'km' ? 'កែសម្រួល' : 'Edit' }}
                        </button>
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="handleDisableConfig(config.name)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {{ locale === 'km' ? 'បិទដំណើរការ' : 'Disable' }}
                        </button>
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="handleRemoveSsl(config.name)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {{ locale === 'km' ? 'ដក HTTPS' : 'Remove HTTPS' }}
                        </button>
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <button
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          @click="handleDeleteConfig(config.name)"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {{ t('delete') }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Expandable Site Details -->
                  <Transition name="expand">
                    <div
                      v-if="expandedSite === config.name"
                      class="border-t border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10 p-4"
                    >
                      <div class="space-y-3">
                        <!-- Access URLs -->
                        <div>
                          <h5 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {{ locale === 'km' ? 'តំណភ្ជាប់ចូលប្រើ' : 'Access URLs' }}
                          </h5>
                          <div class="space-y-1">
                            <a
                              v-if="config.hasSSL"
                              :href="`https://${config.name}`"
                              target="_blank"
                              class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              https://{{ config.name }}
                            </a>
                            <a
                              :href="`http://${config.name}`"
                              target="_blank"
                              class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              http://{{ config.name }}
                            </a>
                          </div>
                        </div>

                        <!-- Configuration Info -->
                        <div class="grid grid-cols-2 gap-3 text-xs">
                          <div class="bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                            <span class="text-gray-600 dark:text-gray-400">{{ locale === 'km' ? 'ឈ្មោះដែន' : 'Domain' }}:</span>
                            <p class="font-mono font-semibold text-gray-900 dark:text-gray-100">
                              {{ config.name }}
                            </p>
                          </div>
                          <div class="bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                            <span class="text-gray-600 dark:text-gray-400">{{ locale === 'km' ? 'ស្ថានភាព' : 'Status' }}:</span>
                            <p class="font-semibold text-green-600 dark:text-green-400">
                              {{ config.enabled ? t('active') : t('inactive') }}
                            </p>
                          </div>
                        </div>
                        <div class="bg-white/50 dark:bg-gray-800/50 p-2 rounded text-xs">
                          <span class="text-gray-600 dark:text-gray-400">{{ locale === 'km' ? 'ផ្លូវគម្រោង' : 'Path' }}:</span>
                          <p class="font-mono text-gray-900 dark:text-gray-100 break-all">
                            {{ config.path }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- Active Sites without HTTPS -->
            <div
              v-if="activeSitesWithoutSSL.length > 0"
              class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4"
            >
              <h4
                class="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2"
              >
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
                {{ locale === 'km' ? 'គេហទំព័រសកម្ម (គ្មាន HTTPS)' : 'Active Sites (No HTTPS)' }}
                <span
                  class="ml-auto px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full"
                >
                  {{ activeSitesWithoutSSL.length }}
                </span>
              </h4>
              <div class="space-y-2">
                <div
                  v-for="config in activeSitesWithoutSSL"
                  :key="config.name"
                  class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700"
                >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="font-semibold text-yellow-700 dark:text-yellow-400 truncate">{{
                        config.name
                      }}</span>
                      <span
                        class="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded flex-shrink-0"
                      >
                        {{ t('active') }}
                      </span>
                    </div>
                    <div
                      class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-7"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                          clip-rule="evenodd"
                        />
                        <path
                          d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"
                        />
                      </svg>
                      <span class="truncate">{{ config.path }}</span>
                    </div>
                  </div>
                  <div class="ml-4 relative flex-shrink-0">
                    <button
                      class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      :title="locale === 'km' ? 'សកម្មភាព' : 'Actions'"
                      @click="toggleDropdown(config.name)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                        />
                      </svg>
                    </button>
                    <div
                      v-if="openDropdown === config.name"
                      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                    >
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        @click="loadConfigForEdit(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                          />
                        </svg>
                        {{ locale === 'km' ? 'កែសម្រួល' : 'Edit' }}
                      </button>
                      <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        @click="handleAddSsl(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ locale === 'km' ? 'បន្ថែម HTTPS' : 'Add HTTPS' }}
                      </button>
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        @click="handleDisableConfig(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ locale === 'km' ? 'បិទដំណើរការ' : 'Disable' }}
                      </button>
                      <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        @click="handleDeleteConfig(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ t('delete') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Inactive/Disabled Sites -->
            <div
              v-if="inactiveSites.length > 0"
              class="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <h4
                class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ t('nginxInactiveSites') }}
                <span
                  class="ml-auto px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {{ inactiveSites.length }}
                </span>
              </h4>
              <div class="space-y-2">
                <div
                  v-for="config in inactiveSites"
                  :key="config.name"
                  class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600"
                >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="font-semibold text-gray-700 dark:text-gray-300 truncate">{{
                        config.name
                      }}</span>
                      <span
                        class="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded flex-shrink-0"
                      >
                        {{ t('inactive') }}
                      </span>
                      <span
                        v-if="config.hasSSL"
                        class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1 flex-shrink-0"
                        :title="locale === 'km' ? 'មាន SSL/HTTPS' : 'SSL/HTTPS Enabled'"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        HTTPS
                      </span>
                    </div>
                    <div
                      class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-7"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                          clip-rule="evenodd"
                        />
                        <path
                          d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"
                        />
                      </svg>
                      <span class="truncate">{{ config.path }}</span>
                    </div>
                  </div>
                  <div class="ml-4 relative flex-shrink-0">
                    <button
                      class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      :title="locale === 'km' ? 'សកម្មភាព' : 'Actions'"
                      @click="toggleDropdown(config.name)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                        />
                      </svg>
                    </button>
                    <div
                      v-if="openDropdown === config.name"
                      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                    >
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        @click="loadConfigForEdit(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                          />
                        </svg>
                        {{ locale === 'km' ? 'កែសម្រួល' : 'Edit' }}
                      </button>
                      <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        @click="handleEnableConfig(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ locale === 'km' ? 'បើកដំណើរការ' : 'Enable' }}
                      </button>
                      <button
                        v-if="!config.hasSSL"
                        class="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        @click="handleAddSsl(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ locale === 'km' ? 'បន្ថែម HTTPS' : 'Add HTTPS' }}
                      </button>
                      <button
                        v-if="config.hasSSL"
                        class="w-full px-4 py-2 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        @click="handleRemoveSsl(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ locale === 'km' ? 'ដក HTTPS' : 'Remove HTTPS' }}
                      </button>
                      <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                      <button
                        class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        @click="handleDeleteConfig(config.name)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ t('delete') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNginx } from '../../composables/useNginx'
import { useStatus } from '../../composables/useStatus'
import { useTools } from '../../composables/useTools'
import { useFavorites } from '../../composables/useFavorites'
import { domainSchema, pathSchema, validateField } from '../../utils/validation'
import DirectorySelector from '../common/DirectorySelector.vue'
import AlertNotification from '../common/AlertNotification.vue'
import CustomSelect from '../common/CustomSelect.vue'
import InfoBox from '../common/InfoBox.vue'
import phpIcon from '@/assets/svg/php.svg'
import laravelIcon from '@/assets/svg/laravel.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'
import vueIcon from '@/assets/svg/vuejs.svg'
import reactIcon from '@/assets/svg/react.svg'
import htmlIcon from '@/assets/svg/html5.svg'

const { t, locale } = useI18n()
const {
  configureNginx,
  isConfiguring,
  listNginxConfigs,
  deleteNginxConfig,
  enableNginxConfig,
  disableNginxConfig,
  addSslToConfig,
  removeSslFromConfig,
  getNginxConfigDetails,
  isLoading,
} = useNginx()
const status = useStatus()
const { installedTools, checkInstalledTools } = useTools()
const { toggleFavorite, isFavorite } = useFavorites()
const errorModal = inject('errorModal', null)

const projectType = ref('php')
const domain = ref('')
const nginxProjectPath = ref('')
const phpVersion = ref('')
const port = ref(80)
const enableSSL = ref(false)
const configs = ref([])
const activeMenu = ref('new-site')
const openDropdown = ref(null)
const validationErrors = ref({})
const expandedSite = ref(null)
const searchQuery = ref('')
const statusFilter = ref('all')
const sslFilter = ref('all')
const editMode = ref(false)
const editingConfigName = ref(null)

// Computed property for filtered configs
const filteredConfigs = computed(() => {
  let result = configs.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (config) =>
        config.name.toLowerCase().includes(query) || config.path.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value === 'active') {
    result = result.filter((config) => config.enabled)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter((config) => !config.enabled)
  }

  // Apply SSL filter
  if (sslFilter.value === 'https') {
    result = result.filter((config) => config.hasSSL)
  } else if (sslFilter.value === 'no-https') {
    result = result.filter((config) => !config.hasSSL)
  }

  return result
})

// Computed properties to separate sites by status and SSL (using filtered configs)
const activeSitesWithSSL = computed(() =>
  filteredConfigs.value.filter((config) => config.enabled && config.hasSSL)
)
const activeSitesWithoutSSL = computed(() =>
  filteredConfigs.value.filter((config) => config.enabled && !config.hasSSL)
)
const inactiveSites = computed(() => filteredConfigs.value.filter((config) => !config.enabled))

onMounted(async () => {
  await checkInstalledTools()
  await loadConfigs()
})

async function loadConfigs() {
  try {
    configs.value = await listNginxConfigs()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load configs:', error)
  }
}

async function loadConfigForEdit(configName) {
  closeDropdown()
  try {
    const details = await getNginxConfigDetails(configName)

    // Populate form with existing values
    domain.value = details.domain || ''
    nginxProjectPath.value = details.projectPath || ''
    projectType.value = details.projectType || 'php'
    port.value = details.port || 80
    phpVersion.value = details.phpVersion || ''
    enableSSL.value = details.hasSSL || false

    // Set edit mode
    editMode.value = true
    editingConfigName.value = configName

    // Switch to new-site menu
    activeMenu.value = 'new-site'
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការផ្ទុកការកំណត់: ${error.message}`
        : `Error loading config: ${error.message}`,
      'error'
    )
  }
}

function cancelEdit() {
  // Reset form
  domain.value = ''
  nginxProjectPath.value = ''
  projectType.value = 'php'
  port.value = 80
  phpVersion.value = ''
  enableSSL.value = false
  validationErrors.value = {}

  // Exit edit mode
  editMode.value = false
  editingConfigName.value = null
}

function toggleDropdown(configName) {
  if (openDropdown.value === configName) {
    openDropdown.value = null
  } else {
    openDropdown.value = configName
  }
}

function closeDropdown() {
  openDropdown.value = null
}

function toggleSiteDetails(configName) {
  if (expandedSite.value === configName) {
    expandedSite.value = null
  } else {
    expandedSite.value = configName
  }
}

function validateDomain() {
  const result = validateField(domainSchema, 'domain', domain.value)
  if (!result.valid) {
    validationErrors.value.domain = result.error
  } else {
    delete validationErrors.value.domain
  }
}

function validatePath() {
  const result = validateField(pathSchema, 'path', nginxProjectPath.value)
  if (!result.valid) {
    validationErrors.value.path = result.error
  } else {
    delete validationErrors.value.path
  }
}

async function handleDeleteConfig(configName) {
  closeDropdown()
  const confirmMessage =
    locale.value === 'km'
      ? `តើអ្នកប្រាកដថាចង់លុបការកំណត់រចនាសម្ព័ន្ធ "${configName}" មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
      : `Are you sure you want to delete the configuration "${configName}"? This action cannot be undone.`

  if (!confirm(confirmMessage)) {
    return
  }

  try {
    await deleteNginxConfig(configName)
    status.showStatus(
      locale.value === 'km' ? `បានលុប ${configName} ជោគជ័យ` : `Successfully deleted ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការលុប: ${error.message}`
        : `Error deleting: ${error.message}`,
      'error'
    )
  }
}

async function handleEnableConfig(configName) {
  closeDropdown()
  try {
    await enableNginxConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានបើកដំណើរការ ${configName} ជោគជ័យ`
        : `Successfully enabled ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការបើកដំណើរការ: ${error.message}`
        : `Error enabling: ${error.message}`,
      'error'
    )
  }
}

async function handleDisableConfig(configName) {
  closeDropdown()
  try {
    await disableNginxConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានបិទដំណើរការ ${configName} ជោគជ័យ`
        : `Successfully disabled ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការបិទដំណើរការ: ${error.message}`
        : `Error disabling: ${error.message}`,
      'error'
    )
  }
}

async function handleAddSsl(configName) {
  closeDropdown()
  try {
    status.showStatus(
      locale.value === 'km'
        ? 'កំពុងបង្កើត SSL... (អ្នកប្រហែលជាត្រូវបញ្ចូលពាក្យសម្ងាត់)'
        : 'Adding SSL... (You may need to enter your password)',
      'info'
    )
    await addSslToConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានបន្ថែម HTTPS ទៅ ${configName} ជោគជ័យ`
        : `Successfully added HTTPS to ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការបន្ថែម HTTPS: ${error.message}`
        : `Error adding HTTPS: ${error.message}`,
      'error'
    )
  }
}

async function handleRemoveSsl(configName) {
  closeDropdown()
  const confirmMessage =
    locale.value === 'km'
      ? `តើអ្នកប្រាកដថាចង់ដក HTTPS ពី "${configName}" មែនទេ?`
      : `Are you sure you want to remove HTTPS from "${configName}"?`

  if (!confirm(confirmMessage)) {
    return
  }

  try {
    await removeSslFromConfig(configName)
    status.showStatus(
      locale.value === 'km'
        ? `បានដក HTTPS ពី ${configName} ជោគជ័យ`
        : `Successfully removed HTTPS from ${configName}`,
      'success'
    )
    await loadConfigs()
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុសក្នុងការដក HTTPS: ${error.message}`
        : `Error removing HTTPS: ${error.message}`,
      'error'
    )
  }
}

const projectTypeOptions = [
  { value: 'php', label: 'PHP', icon: phpIcon },
  { value: 'laravel', label: 'Laravel', icon: laravelIcon },
  { value: 'wordpress', label: 'WordPress', icon: wordpressIcon },
  { value: 'static-vue', label: 'Vue', icon: vueIcon },
  { value: 'react', label: 'React', icon: reactIcon },
  { value: 'static-html', label: 'HTML', icon: htmlIcon },
]

const phpVersionOptions = computed(() => {
  const options = [{ value: '', label: 'Auto-detect (ស្វ័យប្រវត្តិ)', icon: phpIcon }]

  // Add installed PHP versions
  if (installedTools.value.php.installed && installedTools.value.php.versions.length > 0) {
    installedTools.value.php.versions.forEach((version) => {
      options.push({
        value: version,
        label: `PHP ${version}-FPM`,
        icon: phpIcon,
      })
    })
  }

  return options
})

async function handleConfigureNginx() {
  // Validate form fields
  validateDomain()
  validatePath()

  // Check if there are validation errors
  if (Object.keys(validationErrors.value).length > 0) {
    status.showStatus(
      locale.value === 'km' ? 'សូមពិនិត្យកំហុសនៅក្នុងទម្រង់' : 'Please fix validation errors',
      'error'
    )
    return
  }

  if (!domain.value || !nginxProjectPath.value) {
    status.showStatus(
      locale.value === 'km' ? 'សូមបំពេញព័ត៌មានទាំងអស់' : 'Please fill all fields',
      'error'
    )
    return
  }

  // If in edit mode, delete the old config first
  if (editMode.value && editingConfigName.value) {
    try {
      await deleteNginxConfig(editingConfigName.value)
    } catch (error) {
      status.showStatus(
        locale.value === 'km'
          ? `កំហុសក្នុងការលុបការកំណត់ចាស់: ${error.message}`
          : `Error deleting old config: ${error.message}`,
        'error'
      )
      return
    }
  }

  status.showStatus(
    locale.value === 'km'
      ? 'កំពុងកំណត់រចនាសម្ព័ន្ធ... (អ្នកប្រហែលជាត្រូវបញ្ចូលពាក្យសម្ងាត់)'
      : 'Configuring... (You may need to enter your password)',
    'info'
  )

  try {
    const result = await configureNginx({
      domain: domain.value,
      projectPath: nginxProjectPath.value,
      port: port.value,
      projectType: projectType.value,
      phpVersion: phpVersion.value || null,
      enableSSL: enableSSL.value,
    })

    const phpInfo = result.phpFpmSocket ? `\nPHP-FPM: ${result.phpFpmSocket}` : ''
    const sslInfo = result.sslGenerated ? `\n✓ ${t('sslGenerated')}` : ''
    const hostsInfo = result.hostsUpdated ? `\n✓ ${t('hostsUpdated')}` : ''

    const actionText = editMode.value
      ? locale.value === 'km'
        ? 'បានធ្វើបច្ចុប្បន្នភាព'
        : 'updated'
      : locale.value === 'km'
        ? 'បានកំណត់រចនាសម្ព័ន្ធ'
        : 'configured'

    status.showStatus(
      locale.value === 'km'
        ? `Nginx ${actionText}ជោគជ័យ!${phpInfo}${sslInfo}${hostsInfo}\n\nអ្នកអាចចូលប្រើគេហទំព័ររបស់អ្នកតាមរយៈ៖\nhttp://${domain.value}`
        : `Nginx ${actionText} successfully!${phpInfo}${sslInfo}${hostsInfo}\n\nYou can now access your site at:\nhttp://${domain.value}`,
      'success'
    )

    // Reset form and exit edit mode
    cancelEdit()

    // Reload configs list and switch to Sites view
    await loadConfigs()
    activeMenu.value = 'sites'
  } catch (error) {
    // Show detailed error in modal
    if (errorModal) {
      errorModal.showError(error, {
        title: locale.value === 'km' ? 'បរាជ័យក្នុងការកំណត់ Nginx' : 'Failed to Configure Nginx',
        subtitle:
          locale.value === 'km'
            ? 'មានកំហុសកើតឡើងពេលកំណត់រចនាសម្ព័ន្ធ Nginx'
            : 'An error occurred while configuring Nginx',
        suggestions: [
          locale.value === 'km'
            ? 'ពិនិត្យមើលថាតើអ្នកបានបញ្ចូលពាក្យសម្ងាត់ត្រឹមត្រូវ (sudo privilege ត្រូវការ)'
            : 'Check if you entered the correct password (sudo privilege required)',
          locale.value === 'km'
            ? 'ត្រូវប្រាកដថា Nginx ត្រូវបានដំឡើងនៅលើប្រព័ន្ធរបស់អ្នក'
            : 'Ensure Nginx is installed on your system',
          locale.value === 'km'
            ? 'ពិនិត្យមើលថាតើផ្លូវគម្រោងមានឬអត់'
            : 'Check if the project path exists',
        ],
        context: {
          Domain: domain.value,
          'Project Path': nginxProjectPath.value,
          'Project Type': projectType.value,
          Port: port.value,
          'PHP Version': phpVersion.value || 'Auto-detect',
          'SSL Enabled': enableSSL.value ? 'Yes' : 'No',
        },
        onRetry: handleConfigureNginx,
      })
    }
  }
}
</script>

<style scoped>
/* Expand/Collapse Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
